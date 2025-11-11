# Subscription Management - Frontend

React.js frontend application for subscription management system.

## 🚀 Tech Stack

- React.js (Vite)
- Redux Toolkit
- TailwindCSS
- React Router
- Axios
- Framer Motion
- Chart.js
- Lucide React Icons

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

The API URL is automatically configured based on environment:
- Development: `http://localhost:5000/api`
- Production: `/api`

## 🏃 Running the App

### Development Mode
```bash
npm run dev
```
Runs on http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # Reusable components
│   ├── FloatingShape.jsx
│   ├── Input.jsx
│   ├── Layout.jsx
│   └── LoadingSpinner.jsx
├── pages/            # Page components
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── EmailVerificationPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── SubscriptionPlansPage.jsx
│   ├── MySubscriptionPage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── AdminPlansPage.jsx
│   └── AdminUsersPage.jsx
├── services/         # API services
│   ├── api.js
│   ├── auth.service.js
│   ├── subscription.service.js
│   └── admin.service.js
├── store/            # Redux store
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── subscriptionSlice.js
│       └── adminSlice.js
├── App.jsx           # Main App component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🎨 Features

### Authentication
- Login/Signup with email verification
- Forgot password and reset password
- Auto token refresh with refresh tokens

### User Dashboard
- View subscription status
- Browse available plans
- Subscribe to plans
- Manage subscriptions
- Cancel/Renew subscriptions

### Admin Dashboard
- User management
- Plan management (CRUD)
- Statistics and analytics
- View all subscriptions

## 🔐 Authentication

Access tokens are stored in localStorage and automatically refreshed when expired using refresh tokens (HTTP-only cookies).

## 🎨 UI/UX

Following admin template design with:
- Dark theme with gradient backgrounds
- Glass-morphism effects
- Smooth animations
- Responsive design
- Beautiful forms and cards

## 📄 License

MIT

