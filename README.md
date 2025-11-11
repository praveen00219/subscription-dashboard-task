# Subscription Management System

A full-stack subscription management application built with React.js (Frontend) and Node.js/Express.js (Backend) with JWT + Refresh Token authentication.

## 🚀 Features

### Authentication & Security
- ✅ User Registration & Login
- ✅ Email Verification with 6-digit code
- ✅ Forgot Password & Reset Password
- ✅ JWT Access Token + Refresh Token with token rotation
- ✅ HTTP-only cookies for refresh tokens
- ✅ Role-based access control (User & Admin)

### User Features
- ✅ View available subscription plans
- ✅ Subscribe to plans
- ✅ View current subscription status
- ✅ Cancel subscription
- ✅ Renew subscription
- ✅ Dashboard with subscription overview

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Create, update, delete subscription plans
- ✅ View all users
- ✅ View all subscriptions
- ✅ Update user roles
- ✅ Analytics and reports

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Chart.js** - Charts
- **React Hot Toast** - Notifications

### Backend
- **Node.js** & **Express.js** - Server
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Cookie Parser** - Cookie handling

## 📁 Project Structure

```
Subscription-Management-Dash/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store & slices
│   │   └── App.jsx           # Main App component
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend Node.js application
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── server.js             # Server entry point
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Email account for sending emails (Gmail recommended)

### Installation

#### 1. Clone the repository
```bash
cd Subscription-Management-Dash
```

#### 2. Setup Backend

```bash
cd server
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update the .env file with your credentials
```

**Required Environment Variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subscription-management
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-app-password
EMAIL_FROM=noreply@subscriptionpro.com
CLIENT_URL=http://localhost:3000
```

**Start the backend server:**
```bash
npm run dev
```
Server will run on http://localhost:5000

#### 3. Setup Frontend

```bash
cd ../client
npm install

# Start the frontend
npm run dev
```
Frontend will run on http://localhost:3000

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/check-auth` - Check authentication status

### Subscriptions
- `GET /api/subscriptions/plans` - Get all plans (Public)
- `GET /api/subscriptions/my-subscription` - Get user's subscription
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/renew` - Renew subscription
- `GET /api/subscriptions/history` - Get subscription history

### Admin
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/plans` - Get all plans
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/subscriptions` - Get all subscriptions

## 🔐 Authentication Flow

1. User signs up with email, name, and password
2. System sends verification code to email
3. User verifies email with 6-digit code
4. User logs in and receives:
   - Access Token (stored in localStorage, 15min expiry)
   - Refresh Token (stored in HTTP-only cookie, 7 days expiry)
5. Access token is sent with each request in Authorization header
6. When access token expires, frontend automatically requests new token using refresh token
7. Refresh token rotation: When refreshed, old token is revoked and new one is issued

## 👤 Default Admin Account

After setting up, you can create an admin account by:
1. Registering a new user
2. Manually updating the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", isVerified: true } }
)
```

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Account Settings → Security → App Passwords
3. Use the generated password in `EMAIL_PASSWORD` env variable

## 🎨 UI/UX Design

The frontend follows the same design pattern as the admin template with:
- Gradient backgrounds (gray-900, blue-900, emerald-900)
- Glass-morphism effects
- Smooth animations with Framer Motion
- Responsive design
- Dark theme

## 🧪 Testing

Create some subscription plans via admin panel and test:
- User registration and email verification
- Login and token refresh
- Subscribing to plans
- Canceling subscriptions
- Admin CRUD operations

## 📦 Deployment

### Backend (Node.js)
Deploy to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

### Frontend (React)
Deploy to platforms like:
- Vercel
- Netlify
- Cloudflare Pages

### Database
- MongoDB Atlas (cloud)
- Local MongoDB instance

## 🤝 Contributing

This is a technical assessment project. Feel free to use it as a template for your own projects.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built as part of GNXTACE TECHNOLOGIES Full Stack Web Developer Technical Assessment.

