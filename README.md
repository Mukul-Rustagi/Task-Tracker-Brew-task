# 📝 Task Tracker

A modern, full-stack task management application built with Next.js 16, TypeScript, MongoDB, and NextAuth.js. Manage your tasks efficiently with a beautiful, responsive interface and powerful features.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** - Secure signup and signin
- **Google OAuth** - Sign in with your Google account
- **JWT Sessions** - Secure, stateless authentication
- **Protected Routes** - Automatic route protection with middleware

### 📋 Task Management
- **CRUD Operations** - Create, read, update, and delete tasks
- **Task Status** - Todo, In Progress, Done
- **Priority Levels** - Low, Medium, High
- **Due Dates** - Set and track deadlines
- **Categories** - Work, Personal, Shopping, Health, Finance, Other
- **Search & Filter** - Find tasks quickly
- **Bulk Actions** - Manage multiple tasks at once
- **Subtasks** - Break down tasks into smaller steps

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface
- **Dark/Light Theme** - Toggle between themes
- **Responsive** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Instant feedback on actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

### 📊 Analytics
- **Task Statistics** - View completion rates and progress
- **Visual Charts** - See your productivity at a glance
- **Export to PDF** - Download task reports
- **Calendar View** - See tasks by date

### 👤 Profile Management
- **Update Profile** - Change name and profile picture
- **View Statistics** - See your task completion stats
- **Account Settings** - Manage your account

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **jsPDF** - PDF generation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication library
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

### Code Quality
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Production-ready structure** - Organized, maintainable code

---

## 📁 Project Structure

```
task_tracker/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth.js handler
│   │   │   └── signup/          # User registration
│   │   ├── tasks/               # Task CRUD endpoints
│   │   │   ├── [id]/           # Single task operations
│   │   │   └── route.ts        # List/create tasks
│   │   └── user/               # User management
│   ├── auth/                    # Auth pages
│   │   ├── signin/             # Sign in page
│   │   └── signup/             # Sign up page
│   ├── dashboard/              # Main dashboard
│   ├── profile/                # User profile
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── providers.tsx           # Context providers
├── components/                  # React components
│   ├── CalendarView.tsx        # Calendar component
│   ├── TaskCard.tsx            # Task card component
│   └── TaskModal.tsx           # Task creation/edit modal
├── contexts/                    # React contexts
│   └── ThemeContext.tsx        # Theme management
├── lib/                         # Utilities & config
│   ├── api-response.ts         # Standardized API responses
│   ├── auth.ts                 # NextAuth configuration
│   ├── constants.ts            # App constants
│   ├── errors.ts               # Error handling utilities
│   ├── mongodb.ts              # Database connection
│   └── validations.ts          # Zod validation schemas
├── models/                      # Mongoose models
│   ├── Task.ts                 # Task model
│   └── User.ts                 # User model
├── types/                       # TypeScript types
│   └── next-auth.d.ts          # NextAuth type extensions
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── middleware.ts               # Route protection
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd task_tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/task-tracker
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
   ```

4. **Generate NextAuth secret:**
   ```bash
   # Windows PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   
   # Mac/Linux
   openssl rand -base64 32
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide with Google OAuth configuration
- **API Documentation** - See `/app/api/` folder for endpoint details
- **Component Documentation** - See `/components/` folder

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |

---

## 🎯 Key Features Explained

### Production-Ready Code Organization

The codebase follows industry best practices:

- **Centralized Constants** - All configuration in `lib/constants.ts`
- **Standardized API Responses** - Consistent format across all endpoints
- **Custom Error Classes** - Proper error handling with `lib/errors.ts`
- **Validation Schemas** - Reusable Zod schemas in `lib/validations.ts`
- **Type Safety** - Full TypeScript coverage
- **Clean Architecture** - Separation of concerns

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ CSRF protection
- ✅ Input validation with Zod
- ✅ MongoDB injection prevention
- ✅ Protected API routes
- ✅ Secure session management

### Performance Optimizations

- ✅ Server-side rendering with Next.js
- ✅ Optimized database queries
- ✅ Efficient state management
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Code splitting

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google (if configured)
- [ ] Create a task
- [ ] Edit a task
- [ ] Delete a task
- [ ] Search tasks
- [ ] Filter by status
- [ ] Export to PDF
- [ ] Update profile
- [ ] Sign out

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `task_tracker`
   - Add environment variables
   - Deploy!

3. **Update environment variables:**
   - Set `NEXTAUTH_URL` to your production URL
   - Add Google OAuth production redirect URIs

---

## 📱 Screenshots

### Dashboard
Clean, modern interface with task cards and filters.

### Task Modal
Create and edit tasks with all the details you need.

### Profile Page
View your statistics and manage your account.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🆘 Support

If you encounter any issues:

1. Check the [SETUP.md](./SETUP.md) guide
2. Review the error messages in the console
3. Verify environment variables are set correctly
4. Ensure MongoDB is running

---

## 🎓 Learning Resources

This project demonstrates:
- Next.js 16 App Router
- TypeScript best practices
- MongoDB with Mongoose
- NextAuth.js authentication
- Tailwind CSS styling
- Production-ready code structure
- Error handling patterns
- API design principles

---

## 🔄 Updates

### Latest Version
- ✅ Production-ready code organization
- ✅ Centralized error handling
- ✅ Standardized API responses
- ✅ Google OAuth integration
- ✅ Comprehensive documentation
- ✅ Bug fixes and improvements

---

## 👨‍💻 Author

Built with ❤️ using Next.js, TypeScript, and MongoDB

---

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐️!

---

**Happy Task Tracking! 🎉**

#   T a s k - T r a c k e r - B r e w - t a s k  
 