# Subscription Management - Backend

Node.js/Express.js backend API for subscription management system.

## 🚀 Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT (Access + Refresh Tokens)
- bcryptjs
- Nodemailer
- Cookie Parser

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env` file in the server root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subscription-management
JWT_ACCESS_SECRET=your-super-secret-access-token
JWT_REFRESH_SECRET=your-super-secret-refresh-token
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-app-password
EMAIL_FROM=noreply@subscriptionpro.com
CLIENT_URL=http://localhost:3000
```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server runs on http://localhost:5000

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   ├── subscription.controller.js
│   └── admin.controller.js
├── middleware/
│   └── auth.middleware.js   # JWT verification
├── models/
│   ├── User.model.js
│   ├── RefreshToken.model.js
│   ├── SubscriptionPlan.model.js
│   └── UserSubscription.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   └── admin.routes.js
├── utils/
│   ├── jwt.utils.js         # Token generation & verification
│   └── email.utils.js       # Email sending
└── server.js                # Entry point
```

## 🔐 Authentication System

### JWT + Refresh Token Flow

1. **Access Token**: Short-lived (15 min), sent in Authorization header
2. **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
3. **Token Rotation**: When refresh token is used, it's revoked and new one issued
4. **Auto Cleanup**: Expired tokens are automatically deleted from database

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Password reset tokens are hashed and time-limited

### Email Verification
- 6-digit verification code
- Expires in 10 minutes
- Sent via Nodemailer

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /signup` - Register user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /verify-email` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `POST /refresh-token` - Refresh access token
- `GET /check-auth` - Check authentication

### Subscription Routes (`/api/subscriptions`)
- `GET /plans` - Get all plans (Public)
- `GET /my-subscription` - Get user subscription
- `POST /subscribe` - Subscribe to plan
- `POST /cancel` - Cancel subscription
- `POST /renew` - Renew subscription
- `GET /history` - Get subscription history

### Admin Routes (`/api/admin`)
- `GET /dashboard-stats` - Dashboard statistics
- `GET /users` - Get all users
- `GET /plans` - Get all plans
- `POST /plans` - Create plan
- `PUT /plans/:id` - Update plan
- `DELETE /plans/:id` - Delete plan
- `PUT /users/:id/role` - Update user role
- `GET /subscriptions` - Get all subscriptions

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (user/admin)
- isVerified
- verificationToken & expiry
- resetPasswordToken & expiry

### RefreshToken
- token (unique)
- user reference
- expiresAt
- revokedAt (for token rotation)
- IP tracking

### SubscriptionPlan
- name, description, price
- duration (month/year)
- features (array)
- isActive
- maxUsers, trialDays

### UserSubscription
- user & plan references
- status (active/cancelled/expired)
- startDate, endDate
- cancelledAt
- autoRenew
- paymentInfo

## 📧 Email Configuration

For Gmail:
1. Enable 2FA on Google account
2. Generate App Password
3. Use in EMAIL_PASSWORD env variable

## 🛡️ Security Features

- JWT token authentication
- HTTP-only cookies for refresh tokens
- CORS configured
- Password hashing
- Token rotation
- Rate limiting ready
- XSS protection
- Input validation

## 📄 License

MIT

