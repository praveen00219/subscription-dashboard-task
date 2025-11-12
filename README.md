# 🎯 Subscription Management System

A modern, full-stack subscription management application with **Razorpay payment gateway integration**, animated **dark/light theme switching**, and comprehensive admin controls. Built with React.js (Frontend) and Node.js/Express.js (Backend) featuring JWT authentication and secure payment processing.

### Dark Mode (Default)
- Beautiful gradient backgrounds with glass-morphism effects
- Smooth animations and modern UI

### Light Mode
- Clean, professional design with soft colors
- Perfect for daytime use

### Payment Integration
- Razorpay checkout modal seamlessly integrated
- Secure payment processing with real-time feedback

## ✨ Key Highlights

- 💳 **Razorpay Payment Gateway** - Secure payment processing in test mode
- 🌓 **Dark/Light Mode Toggle** - Animated theme switching with persistence
- 🎨 **Beautiful UI** - Glass-morphism effects with Framer Motion animations
- 🔐 **Secure Authentication** - JWT with refresh token rotation
- 📊 **Admin Dashboard** - Complete subscription and user management
- 📧 **Email Notifications** - Automated subscription confirmations
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Production Ready** - Complete error handling and validation

## ⚡ Quick Start

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Configure environment variables
# Create .env file with your credentials (see setup section below)

# 3. Start backend server
npm run dev

# 4. Install frontend dependencies (in new terminal)
cd client
npm install

# 5. Start frontend
npm run dev

# 6. Open browser
# Go to http://localhost:5173

# 7. Test payment with Razorpay test card
# Card: 4111 1111 1111 1111, CVV: 123, Expiry: 12/25
```
## Admin Credentials:
- **Email**: praveen2192000@gmail.com
- **Password**: Test@123

**Note** - Clone the repo and run the frontend locally. You don't need to run the backend because it requires many environment variables. I have already deployed the backend and configured the frontend to use the deployed API URL.

## 🚀 Features

### 🎨 UI/UX Features
-  **Animated Dark/Light Theme Toggle** with smooth transitions
-  **Theme Persistence** - Saves user preference to localStorage
-  **Glass-morphism Design** - Modern frosted glass effects
-  **Responsive Layout** - Mobile, tablet, and desktop support
-  **Smooth Animations** - Powered by Framer Motion
-  **Sidebar Navigation** - Collapsible with role-based menu items
-  **Loading States** - Beautiful loading spinners and indicators
-  **Toast Notifications** - Real-time feedback for all actions

### 🔐 Authentication & Security
-  User Registration & Login with validation
-  Email Verification with 6-digit code
-  Forgot Password & Reset Password flow
-  JWT Access Token (15min) + Refresh Token (7 days)
-  Token rotation on refresh
-  HTTP-only cookies for refresh tokens
-  Role-based access control (User & Admin)
-  Email verification middleware
-  Protected routes and authorization

### 💳 Payment Integration
-  **Razorpay Payment Gateway** integration
-  Test mode for safe development
-  Secure payment order creation
-  Payment signature verification (HMAC SHA256)
-  Payment success/failure handling
-  Transaction logging and tracking
-  Support for credit/debit cards, UPI, netbanking
-  Automatic subscription activation after payment
-  Payment receipt generation

### 👤 User Features
-  View available subscription plans with pricing
-  **Subscribe to plans via Razorpay payment**
-  View current subscription status
-  Cancel active subscription
-  Renew expired subscriptions
-  Dashboard with subscription overview
-  Subscription history
-  Plan comparison with features
-  Days remaining counter
-  Email notifications on subscription changes

### 👨‍💼 Admin Features
-  Admin dashboard with real-time statistics
-  **User Growth Chart** - Last 7 days analytics
-  **Recent Activity Feed** - Live subscription updates
-  Create, update, delete subscription plans
-  View all users (excluding admins from user list)
-  User search and filtering
-  View subscription status breakdown
-  Revenue tracking and analytics
-  Plan management with validation
-  Protected admin routes

## 🛠️ Tech Stack

### Frontend
- **React.js 18** (Vite) - Fast build tool and dev server
- **Redux Toolkit** - State management with slices
- **TailwindCSS 3** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Framer Motion** - Smooth animations and transitions
- **Chart.js & React-Chartjs-2** - Data visualization
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library
- **Context API** - Global theme management

### Backend
- **Node.js** & **Express.js** - RESTful API server
- **MongoDB** & **Mongoose** - NoSQL database
- **JWT (jsonwebtoken)** - Secure authentication
- **Razorpay SDK** - Payment gateway integration
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Crypto** - Payment signature verification


## 🚦 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas cloud instance)
- **Email account** for sending emails (Gmail recommended)
- **Razorpay account** (for payment integration - free test mode)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Subscription-Management-Dash
```

#### 2. Setup Backend

```bash
cd server
npm install
```

**Create `.env` file in server directory:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/subscription-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@subscriptionpro.com

# Razorpay Configuration (TEST MODE)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY

# Client URL
CLIENT_URL=http://localhost:5173
```

**Important Notes:**
- For Gmail, enable 2FA and generate an App Password
- Get Razorpay test keys from [Razorpay Dashboard](https://dashboard.razorpay.com/) (TEST MODE)
- Never commit `.env` file to version control

**Start the backend server:**
```bash
npm run dev
```
Server will run on `http://localhost:5000`

#### 3. Setup Frontend & Start the frontend

```bash
cd ../client
npm install
```

```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/check-auth` - Check authentication status

### Subscriptions (User)
- `GET /api/subscriptions/plans` - Get all active plans (Public)
- `GET /api/subscriptions/my-subscription` - Get user's subscription (Protected)
- `POST /api/subscriptions/cancel` - Cancel active subscription (Protected)
- `GET /api/subscriptions/history` - Get subscription history (Protected)

### Payments (Razorpay Integration)
- `GET /api/payments/key` - Get Razorpay public key (Public)
- `POST /api/payments/create-order` - Create payment order (Protected)
- `POST /api/payments/verify-payment` - Verify payment & activate subscription (Protected)
- `POST /api/payments/payment-failed` - Log payment failures (Protected)
- `POST /api/payments/renew-order` - Create renewal order (Protected)
- `POST /api/payments/verify-renewal` - Verify renewal payment (Protected)

### Admin
- `GET /api/admin/dashboard-stats` - Get dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (excludes admins) (Admin)
- `GET /api/admin/plans` - Get all plans (Admin)
- `POST /api/admin/plans` - Create new plan (Admin)
- `PUT /api/admin/plans/:id` - Update plan (Admin)
- `DELETE /api/admin/plans/:id` - Delete plan (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)
- `GET /api/admin/subscriptions` - Get all subscriptions (Admin)

## 🔐 Authentication Flow

1. **User Registration:**
   - User signs up with name, email, and password
   - Password is hashed using bcryptjs
   - 6-digit verification code sent to email

2. **Email Verification:**
   - User enters 6-digit code
   - Account activated upon successful verification

3. **Login:**
   - User logs in with email and password
   - Server returns:
     - Access Token (JWT, stored in localStorage, 30 days)
     - Refresh Token (HTTP-only cookie, 7 days)

4. **Token Usage:**
   - Access token sent with each API request in `Authorization` header
   - API interceptor automatically adds token from localStorage
   - When token expires, refresh token used to get new access token
   - Refresh token rotation: Old token revoked, new one issued

5. **Logout:**
   - Tokens cleared from localStorage and cookies
   - User redirected to login page

## 💳 Payment Flow (Razorpay)

1. **User Selects Plan:**
   - User clicks "Subscribe Now" on desired plan
   - System checks for existing active subscription

2. **Payment Order Creation:**
   - Backend creates Razorpay order with plan details
   - Order ID and amount returned to frontend

3. **Razorpay Checkout:**
   - Razorpay payment modal opens
   - User enters payment details (card/UPI/netbanking)
   - Payment processed securely by Razorpay

4. **Payment Verification:**
   - Frontend sends payment response to backend
   - Backend verifies payment signature using HMAC SHA256
   - Payment status validated with Razorpay API

5. **Subscription Activation:**
   - Subscription created in database
   - Start and end dates calculated
   - Confirmation email sent to user
   - Dashboard updated with active subscription

6. **Error Handling:**
   - Failed payments logged
   - User notified with toast message
   - Can retry payment anytime

   ### Payment Gateway (Production)

When going live:
1. Switch Razorpay to **LIVE mode**
2. Generate LIVE API keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
4. Complete KYC verification with Razorpay
5. Test with real small amounts first

## 📧 Email Configuration

### Gmail Setup:
1. Enable **2-Factor Authentication** on your Google account
2. Generate an **App Password**: 
   - Go to: Google Account → Security → App Passwords
   - Create password for "Mail"
3. Use the 16-character password in `EMAIL_PASSWORD` env variable
4. Update `EMAIL_USER` with your Gmail address

## 🎯 Project Highlights

### What Makes This Special:

1. **Complete Payment Integration:**
   - Not just a mock - real Razorpay integration
   - Secure signature verification
   - Full payment lifecycle handling

2. **Beautiful Theme System:**
   - Animated toggle with Framer Motion
   - Every component theme-aware
   - Persistent user preference

3. **Production-Ready:**
   - Error handling throughout
   - Loading states everywhere
   - User feedback with toasts
   - Responsive design

4. **Admin Features:**
   - Real-time analytics
   - User growth charts
   - Revenue tracking
   - Complete CRUD operations

5. **Modern Tech Stack:**
   - Latest React 18
   - Redux Toolkit
   - TailwindCSS 3
   - Framer Motion animations

## 🙏 Acknowledgments

- Built with modern web technologies
- Razorpay for payment gateway
- MongoDB for database
- Framer Motion for animations
- TailwindCSS for styling

## Contact 

- Praveen
- praveen2192000gmail.com
- [Phone](7297952644) | [LinkedIn](https://www.linkedin.com/in/praveen219) | [Github](https://github.com/praveen00219) | [Portfolio](https://praveen21-portfolio.netlify.app/)

**Built with ❤️ using React, Node.js, MongoDB, and Razorpay**

