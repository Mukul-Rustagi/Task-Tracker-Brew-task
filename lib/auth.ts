import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './mongodb';
import User from '@/models/User';
import { ENV, ERROR_MESSAGES, FEATURES } from './constants';
import { signinSchema } from './validations';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
        }

        try {
          // Validate input
          const validatedData = signinSchema.parse(credentials);

          await dbConnect();

          const user = await User.findOne({ email: validatedData.email }).select('+password');

          if (!user) {
            throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
          }

          if (!user.password) {
            throw new Error(ERROR_MESSAGES.AUTH.GOOGLE_SIGNIN_REQUIRED);
          }

          const isPasswordValid = await user.comparePassword(credentials.password);

          if (!isPasswordValid) {
            throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
    // Conditionally add Google provider
    ...(FEATURES.GOOGLE_AUTH_ENABLED
      ? [
          GoogleProvider({
            clientId: ENV.GOOGLE_CLIENT_ID,
            clientSecret: ENV.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'google') {
          await dbConnect();

          const existingUser = await User.findOne({ 
            email: user.email?.toLowerCase() 
          });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image,
              provider: 'google',
            });
          }
        }
        return true;
      } catch (error) {
        console.error('Sign in callback error:', error);
        return false;
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: ENV.NEXTAUTH_SECRET,
  debug: FEATURES.DEBUG_MODE,
};


