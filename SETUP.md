# 🚀 Task Tracker - Complete Setup Guide

This guide will walk you through setting up the Task Tracker application from scratch, including MongoDB configuration and Google OAuth integration.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Google OAuth Setup (Optional)](#google-oauth-setup-optional)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - Either:
  - Local installation ([Download](https://www.mongodb.com/try/download/community))
  - MongoDB Atlas account (free tier) ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** (optional, for version control)
- A **Google Cloud** account (optional, for Google OAuth)

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd task_tracker
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 16
- React 19
- NextAuth.js
- MongoDB & Mongoose
- Tailwind CSS
- TypeScript
- Zod (validation)
- And more...

**Wait for installation to complete** (may take 1-2 minutes)

---

## Environment Configuration

### Step 1: Create `.env.local` File

In the `task_tracker` directory, create a file named `.env.local`:

**Windows PowerShell:**
```powershell
New-Item .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

### Step 2: Add Environment Variables

Open `.env.local` and add the following:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
MONGODB_URI=mongodb://localhost:27017/task-tracker

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# ============================================
# GOOGLE OAUTH (OPTIONAL)
# ============================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ============================================
# OPTIONAL SETTINGS
# ============================================
NODE_ENV=development
DEBUG=false
```

### Step 3: Generate NextAuth Secret

You **must** generate a secure random secret for `NEXTAUTH_SECRET`.

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Copy the output** and replace `your-secret-key-here` in `.env.local`.

**Example:**
```env
NEXTAUTH_SECRET=a8f7d9e2c1b4a6f8d9e2c1b4a6f8d9e2
```

---

## Database Setup

Choose **one** of the following options:

### Option A: MongoDB Atlas (Cloud - Recommended for Beginners)

#### 1. Create Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Click **"Try Free"**
- Sign up with email or Google

#### 2. Create Cluster
- Click **"Build a Database"**
- Select **"M0 FREE"** tier
- Choose a cloud provider and region (closest to you)
- Click **"Create Cluster"** (takes 1-3 minutes)

#### 3. Create Database User
- Go to **"Database Access"** (left sidebar)
- Click **"Add New Database User"**
- Choose **"Password"** authentication method
- **Username:** `tasktracker`
- **Password:** Click "Autogenerate Secure Password" (copy this!)
- **Database User Privileges:** Read and write to any database
- Click **"Add User"**

#### 4. Whitelist IP Address
- Go to **"Network Access"** (left sidebar)
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (for development)
  - Or enter your specific IP address
- Click **"Confirm"**

#### 5. Get Connection String
- Go to **"Database"** (left sidebar)
- Click **"Connect"** on your cluster
- Choose **"Connect your application"**
- **Driver:** Node.js
- **Version:** 5.5 or later
- **Copy** the connection string

#### 6. Update `.env.local`
Replace the `MONGODB_URI` value:

```env
MONGODB_URI=mongodb+srv://tasktracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/task-tracker?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_PASSWORD` with the password you copied in step 3.

---

### Option B: Local MongoDB

#### 1. Install MongoDB
- Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS

#### 2. Start MongoDB Service

**Windows:**
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB
mongod --dbpath=C:\data\db
```

**Mac:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Verify MongoDB is Running
```bash
mongosh
# Should connect successfully
```

#### 4. Use in `.env.local`
Keep the default value:
```env
MONGODB_URI=mongodb://localhost:27017/task-tracker
```

---

## Google OAuth Setup (Optional)

If you want to enable "Sign in with Google" functionality, follow these steps:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** dropdown (top bar)
3. Click **"New Project"**
4. **Project name:** Task Tracker
5. Click **"Create"**
6. Wait for project creation (notification will appear)
7. **Select your new project** from the dropdown

### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for: **"Google+ API"** or **"People API"**
3. Click on **"Google+ API"**
4. Click **"Enable"**
5. Wait a few seconds

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type
3. Click **"Create"**

**App Information:**
- **App name:** Task Tracker
- **User support email:** (select your email)
- **App logo:** (optional - skip)
- **Application home page:** http://localhost:3000
- **Authorized domains:** (leave empty)
- **Developer contact information:** (your email)

4. Click **"Save and Continue"**

**Scopes:**
- Click **"Save and Continue"** (no need to add scopes)

**Test Users:**
- Click **"+ Add Users"**
- Enter your email address (the one you'll use to sign in)
- Click **"Add"**
- Click **"Save and Continue"**

**Summary:**
- Review and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** (top)
3. Select **"OAuth 2.0 Client ID"**
4. **Application type:** Web application
5. **Name:** Task Tracker Web Client

**Authorized JavaScript origins:**
- Click **"+ Add URI"**
- Add: `http://localhost:3000`
- Click **"+ Add URI"** again
- Add: `http://localhost:3001`

**Authorized redirect URIs:**
- Click **"+ Add URI"**
- Add: `http://localhost:3000/api/auth/callback/google`
- Click **"+ Add URI"** again
- Add: `http://localhost:3001/api/auth/callback/google`

6. Click **"Create"**

### Step 5: Copy Credentials

A popup will show your credentials:
- **Client ID** - Copy this (looks like: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** - Copy this (looks like: `GOCSPX-abc123def456`)

### Step 6: Update `.env.local`

Add your credentials:

```env
GOOGLE_CLIENT_ID=123456789-abc123def456ghi789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456ghi789jkl012
```

**Note:** If you leave these empty, Google Sign-In will be automatically disabled.

---

## Running the Application

### Step 1: Start Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

**Note:** If port 3000 is in use, Next.js will automatically use 3001.

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Task Tracker home page!

### Step 3: Create Your First Account

1. Click **"Get Started Free"** or **"Sign Up"**
2. Fill in the form:
   - **Name:** Your Name
   - **Email:** your@email.com
   - **Password:** At least 6 characters
3. Click **"Sign Up"**
4. You'll be automatically signed in and redirected to the dashboard

### Step 4: Create Your First Task

1. Click the **"+ New Task"** button
2. Fill in task details:
   - **Title:** My First Task
   - **Description:** Testing the app
   - **Due Date:** Pick a date
   - **Priority:** Medium
   - **Status:** Todo
   - **Category:** Personal
3. Click **"Create Task"**

**Congratulations! 🎉 Your Task Tracker is working!**

---

## Testing

### Feature Testing Checklist

#### Authentication
- [ ] Sign up with email/password
- [ ] Sign out
- [ ] Sign in with email/password
- [ ] Sign in with Google (if configured)
- [ ] Try wrong password (should fail)
- [ ] Try duplicate email signup (should fail)

#### Task Management
- [ ] Create a task
- [ ] Edit a task
- [ ] Change task status
- [ ] Change task priority
- [ ] Delete a task (with confirmation)
- [ ] Create task with due date
- [ ] Create task without due date

#### Search & Filter
- [ ] Search tasks by title
- [ ] Filter by status (Todo, In Progress, Done)
- [ ] Filter by category
- [ ] Clear filters

#### Profile
- [ ] View profile page
- [ ] Update name
- [ ] View task statistics
- [ ] Check completion rate

#### Export
- [ ] Export tasks to PDF
- [ ] Verify PDF content

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solutions:**
- **Atlas:** 
  - Verify connection string is correct
  - Check IP whitelist includes your IP
  - Verify database user credentials
- **Local:**
  - Ensure MongoDB service is running
  - Check port 27017 is not blocked
  - Try: `mongosh` to test connection

### Issue: "Invalid email or password"

**Solutions:**
- Make sure you've created an account first (Sign Up)
- Check email and password are correct
- Passwords are case-sensitive
- Try creating a new account

### Issue: "Google Sign In (Not Configured)"

**Solutions:**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`
- Remove any extra spaces or quotes
- Restart the development server
- If you don't want Google OAuth, this is normal - use email/password instead

### Issue: "redirect_uri_mismatch" (Google OAuth)

**Solutions:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth 2.0 Client ID
- Verify redirect URI exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check the port number (3000 or 3001)
- Add both ports if needed

### Issue: "Port 3000 already in use"

**Solutions:**
- Next.js will automatically use 3001
- Or kill the process on port 3000:

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors

**Solutions:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not working

**Solutions:**
- Ensure `.env.local` is in the `task_tracker` folder (not parent)
- Check for typos in variable names
- No spaces around `=` sign
- **Restart the development server** after changing `.env.local`

---

## Production Deployment

### Deploy to Vercel

#### 1. Prepare Your Code
```bash
# Test build locally
npm run build
npm start
```

#### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Task Tracker"
git remote add origin <your-repo-url>
git push -u origin main
```

#### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. **Root Directory:** `task_tracker`
6. **Framework Preset:** Next.js (auto-detected)
7. Add environment variables:
   ```
   MONGODB_URI=<your-production-mongodb-uri>
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<your-secret>
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   ```
8. Click **"Deploy"**

#### 4. Update Google OAuth (if using)
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add production redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. Add to authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ Yes | - | MongoDB connection string |
| `NEXTAUTH_URL` | ✅ Yes | - | Application URL |
| `NEXTAUTH_SECRET` | ✅ Yes | - | Random 32+ character secret |
| `GOOGLE_CLIENT_ID` | ❌ No | - | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ No | - | Google OAuth Secret |
| `NODE_ENV` | ❌ No | `development` | Environment mode |
| `DEBUG` | ❌ No | `false` | Enable debug logs |

---

## Next Steps

After successful setup:

1. **Explore Features:**
   - Create multiple tasks
   - Try different statuses and priorities
   - Use search and filters
   - Export to PDF

2. **Customize:**
   - Update your profile
   - Try dark/light theme
   - Add tasks with categories

3. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel
   - Share with others

4. **Learn:**
   - Explore the codebase
   - Read the code comments
   - Understand the architecture

---

## Support

Need help?
- Check the [README.md](./README.md) for feature overview
- Review error messages in browser console
- Check terminal output for server errors
- Verify all environment variables are set

---

## Congratulations! 🎉

You've successfully set up Task Tracker! Start managing your tasks efficiently.

**Happy Task Tracking!**

