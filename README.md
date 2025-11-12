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

## 📁 Project Structure

```
Subscription-Management-Dash/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.jsx           # Main layout with sidebar & header
│   │   │   └── LoadingSpinner.jsx   # Loading component
│   │   ├── contexts/          # React Context providers
│   │   │   └── ThemeContext.jsx     # Dark/Light theme context
│   │   ├── pages/             # Page components
│   │   │   ├── DashboardPage.jsx           # User dashboard
│   │   │   ├── SubscriptionPlansPage.jsx   # Plans with payment
│   │   │   ├── MySubscriptionPage.jsx      # Manage subscription
│   │   │   ├── AdminDashboardPage.jsx      # Admin dashboard
│   │   │   ├── AdminPlansPage.jsx          # Manage plans
│   │   │   ├── AdminUsersPage.jsx          # Manage users
│   │   │   ├── LoginPage.jsx               # Login
│   │   │   ├── SignUpPage.jsx              # Registration
│   │   │   ├── EmailVerificationPage.jsx   # Email verify
│   │   │   ├── ForgotPasswordPage.jsx      # Password reset
│   │   │   └── ResetPasswordPage.jsx       # New password
│   │   ├── services/          # API services
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   └── auth.service.js      # Auth API calls
│   │   ├── store/             # Redux store & slices
│   │   │   ├── index.js             # Store configuration
│   │   │   └── slices/              # Redux slices
│   │   ├── utils/             # Utility functions
│   │   │   └── razorpay.js          # Razorpay integration
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend Node.js application
│   ├── config/                # Configuration files
│   │   └── database.js              # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js       # Authentication logic
│   │   ├── subscription.controller.js  # Subscription logic
│   │   ├── admin.controller.js      # Admin operations
│   │   └── payment.controller.js    # Razorpay payment logic
│   ├── middleware/            # Custom middleware
│   │   └── auth.middleware.js       # JWT verification
│   ├── models/                # Mongoose models
│   │   ├── User.model.js            # User schema
│   │   ├── SubscriptionPlan.model.js  # Plan schema
│   │   └── UserSubscription.model.js  # Subscription schema
│   ├── routes/                # API routes
│   │   ├── auth.routes.js           # Auth endpoints
│   │   ├── subscription.routes.js   # Subscription endpoints
│   │   ├── admin.routes.js          # Admin endpoints
│   │   └── payment.routes.js        # Payment endpoints
│   ├── utils/                 # Utility functions
│   │   ├── jwt.utils.js             # JWT token generation
│   │   └── email.utils.js           # Email sending
│   ├── server.js              # Server entry point
│   └── package.json
│
└── README.md                  # This file
```

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

#### 3. Setup Frontend

```bash
cd ../client
npm install
```

**Optional: Create `.env` file in client directory (for custom API URL):**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

#### 4. Setup Razorpay (Payment Gateway)

1. **Create Razorpay Account:**
   - Visit: https://dashboard.razorpay.com/
   - Sign up for free account

2. **Get Test Keys:**
   - Switch to **TEST MODE** (toggle in dashboard)
   - Go to: Settings → API Keys → Generate Test Key
   - Copy `Key ID` and `Key Secret`

3. **Add to `.env`:**
   - Paste keys in server `.env` file
   - Restart server for changes to take effect

4. **Test Payment:**
   - Use test card: `4111 1111 1111 1111`
   - CVV: `123`, Expiry: `12/25`

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

## 🎨 Theme System

### Dark/Light Mode Toggle

The application features a beautiful animated theme toggle:

- **Toggle Button:** Located in sidebar with Sun ☀️ / Moon 🌙 icons
- **Animation:** Smooth 500ms transitions for all color changes
- **Persistence:** Theme preference saved to localStorage
- **Default:** Dark mode (blue-emerald gradient)
- **Light Mode:** Clean white/gray design with blue accents
- **Global Coverage:** All pages and components theme-aware

**Theme Switching:**
- Click theme toggle in sidebar
- Entire application smoothly transitions
- Background, cards, text, and borders all adapt
- Chart colors and table styles adjust
- Setting persists across sessions

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

### Gmail Setup:
1. Enable **2-Factor Authentication** on your Google account
2. Generate an **App Password**: 
   - Go to: Google Account → Security → App Passwords
   - Create password for "Mail"
3. Use the 16-character password in `EMAIL_PASSWORD` env variable
4. Update `EMAIL_USER` with your Gmail address

### Email Templates:
-  Email verification code
-  Password reset link
-  Subscription confirmation
-  Subscription cancellation
-  Payment success notification

## 🎨 UI/UX Design

### Design System:

**Dark Mode (Default):**
- Background: Gradient (gray-900 → blue-900 → emerald-900)
- Cards: Glass-morphism with gray-800/50 and backdrop blur
- Text: White primary, gray-400 secondary
- Borders: Gray-700/50 with soft glow

**Light Mode:**
- Background: Gradient (gray-50 → blue-50 → emerald-50)
- Cards: White/80 with shadow effects
- Text: Gray-900 primary, gray-600 secondary
- Borders: Gray-200/50 with subtle shadows

**Common Elements:**
- Smooth 300-500ms color transitions
- Animated icons (Sun/Moon) with rotation
- Gradient buttons (blue → emerald)
- Hover effects and micro-interactions
- Responsive grid layouts
- Modern card designs

### Color Palette:
- Primary: Blue-500 to Emerald-600 (gradient)
- Success: Green-400
- Error: Red-600
- Warning: Yellow-400
- Info: Blue-400
- Admin Badge: Purple-600 to Pink-600

## 🧪 Testing

### User Flow Testing:

1. **Registration & Verification:**
   - Sign up with email
   - Check inbox for 6-digit code
   - Verify email
   - Redirected to dashboard

2. **Subscription Flow:**
   - Browse plans
   - Click "Subscribe Now"
   - Razorpay modal opens
   - Enter test card: `4111 1111 1111 1111`
   - Complete payment
   - Subscription activated

3. **Subscription Management:**
   - View subscription details
   - Check days remaining
   - Cancel subscription
   - Renew subscription

4. **Theme Testing:**
   - Toggle dark/light mode in sidebar
   - Verify all pages update
   - Refresh page - theme persists

### Admin Flow Testing:

1. **Dashboard:**
   - View user statistics
   - Check revenue metrics
   - View user growth chart
   - Monitor recent activity

2. **Plan Management:**
   - Create new plan
   - Edit existing plan
   - Delete unused plan
   - View all plans

3. **User Management:**
   - View all users (admins hidden)
   - Search users by name/email
   - Filter by role
   - View subscription status

## 📦 Deployment

### Backend (Node.js)

**Recommended Platforms:**
- **Render** - Free tier available
- **Railway** - Easy deployment
- **Heroku** - Classic choice
- **DigitalOcean App Platform**

**Deployment Steps:**
1. Push code to GitHub
2. Connect repository to platform
3. Add environment variables
4. Deploy!

**Environment Variables to Set:**
- All variables from `.env` file
- Update `CLIENT_URL` to production URL
- Switch Razorpay to LIVE mode (production)

### Frontend (React)

**Recommended Platforms:**
- **Vercel** - Optimized for React
- **Netlify** - Easy deployment
- **Render** - All-in-one solution
- **GitHub Pages** - Free for public repos

**Build Command:** `npm run build`
**Publish Directory:** `dist`

**Environment Variables:**
- `VITE_API_URL` - Backend API URL

### Database

**MongoDB Options:**
- **MongoDB Atlas** (Recommended) - Free tier available
- **Local MongoDB** - Development only
- **MongoDB Cloud** - Managed service

### Payment Gateway (Production)

When going live:
1. Switch Razorpay to **LIVE mode**
2. Generate LIVE API keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
4. Complete KYC verification with Razorpay
5. Test with real small amounts first

## 🐛 Troubleshooting

### Common Issues:

**Issue: "Not authorized, token failed"**
- **Solution:** Log out and log in again (refreshes token)
- **Cause:** Token expired or invalid

**Issue: Razorpay modal doesn't open**
- **Solution:** Check internet connection (script loads from CDN)
- **Cause:** Razorpay SDK not loaded

**Issue: Payment verification fails**
- **Solution:** Verify `RAZORPAY_KEY_SECRET` in `.env` is correct
- **Cause:** Signature mismatch

**Issue: Email not sending**
- **Solution:** Check Gmail App Password is correct
- **Cause:** Email credentials invalid

**Issue: "Already have active subscription"**
- **Solution:** Cancel existing subscription first
- **Cause:** User can only have one active subscription

**Issue: Admin can't see users**
- **Solution:** Admins are hidden from user list (by design)
- **Cause:** Filter excludes admin role

**Issue: Theme doesn't persist**
- **Solution:** Check localStorage is enabled in browser
- **Cause:** Browser privacy settings

### Debugging Tips:

**Check Token:**
```javascript
// In browser console (F12)
localStorage.getItem('accessToken')
```

**Check Razorpay Key:**
```javascript
fetch('http://localhost:5000/api/payments/key')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Check Server Logs:**
- Payment flow logs emoji indicators (🔐, ✅, ❌, 💳)
- Easy to track in terminal

## 📊 Features Breakdown

### Pages:

**Public Pages:**
- Login
- Sign Up
- Email Verification
- Forgot Password
- Reset Password

**User Pages:**
- Dashboard (subscription overview)
- Subscription Plans (with payment)
- My Subscription (manage & cancel)

**Admin Pages:**
- Admin Dashboard (analytics & stats)
- Manage Plans (CRUD operations)
- Manage Users (view & search)

### Components:

- **Layout** - Responsive sidebar, header, theme toggle
- **ThemeContext** - Global theme state management
- **LoadingSpinner** - Consistent loading UI
- **StatCard** - Reusable dashboard cards
- **PlanCard** - Subscription plan display
- **Protected Routes** - Auth-based routing

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token with expiration
- HTTP-only cookies for refresh tokens
- CSRF protection via cookies
- Payment signature verification (HMAC SHA256)
- Input validation and sanitization
- Role-based access control
- Email verification requirement
- Secure password reset flow
- Protected API endpoints

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

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - Feel free to use this project as a template for your own work.

## 🙏 Acknowledgments

- Built with modern web technologies
- Razorpay for payment gateway
- MongoDB for database
- Framer Motion for animations
- TailwindCSS for styling

**Built with ❤️ using React, Node.js, MongoDB, and Razorpay**

