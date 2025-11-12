# 💳 Razorpay Payment Gateway Integration

This document explains the Razorpay payment integration for subscription management.

## 🚀 Setup Instructions

### 1. Install Razorpay SDK (Server)

Navigate to the server directory and install Razorpay:

```bash
cd server
npm install razorpay
```

### 2. Configure Environment Variables

Add the following to your server `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Important:** Make sure your Razorpay account is in **TEST MODE** for development.

### 3. Get Razorpay Test Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Switch to **Test Mode** (toggle in top left)
4. Go to **Settings** → **API Keys**
5. Generate test API keys
6. Copy `Key ID` and `Key Secret` to your `.env` file

### 4. Configure Client Environment

Add to your client `.env` file (or `.env.local`):

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Features Implemented

### Backend Features:
- ✅ Create Razorpay orders
- ✅ Verify payment signatures
- ✅ Handle payment failures
- ✅ Create subscriptions after successful payment
- ✅ Support for subscription renewals
- ✅ Secure payment verification using HMAC SHA256

### Frontend Features:
- ✅ Razorpay checkout integration
- ✅ Payment loading states
- ✅ Success/failure toast notifications
- ✅ Automatic subscription refresh after payment
- ✅ User-friendly payment flow

## 📋 Payment Flow

1. **User Clicks "Subscribe Now"**
   - Frontend creates a payment order via API
   - Backend creates Razorpay order with plan details

2. **Razorpay Checkout Opens**
   - User sees Razorpay payment modal
   - In test mode, you can use test card details
   - User completes payment

3. **Payment Verification**
   - Frontend sends payment response to backend
   - Backend verifies signature using Razorpay secret
   - If valid, subscription is created

4. **Subscription Activation**
   - User subscription is activated
   - Confirmation email sent
   - Dashboard updated with new subscription

## 🧪 Testing Payments

### Test Card Details (Razorpay Test Mode):

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**Other Test Cards:**
- International Card: `5104 0600 0000 0008`
- Amex Card: `3782 822463 10005`

### Testing UPI (Test Mode):
- UPI ID: `success@razorpay`
- Auto-completes payment successfully

### Testing Netbanking:
- Select any bank in test mode
- Click "Success" or "Failure" button

## 🔐 Security Features

1. **Signature Verification:**
   - All payments verified using HMAC SHA256
   - Prevents tampering with payment data

2. **Server-Side Validation:**
   - Payment status checked on Razorpay servers
   - Order verification before subscription creation

3. **Error Handling:**
   - Failed payments logged
   - Users notified of failures
   - Retry mechanism available

## 📝 API Endpoints

### Payment Endpoints:

```
GET    /api/payments/key                  - Get Razorpay public key
POST   /api/payments/create-order         - Create payment order
POST   /api/payments/verify-payment       - Verify payment and create subscription
POST   /api/payments/payment-failed       - Log payment failures
POST   /api/payments/renew-order          - Create renewal order
POST   /api/payments/verify-renewal       - Verify renewal payment
```

## 💡 Usage Example

### Subscribe to a Plan:

```javascript
// User clicks "Subscribe Now" button
// 1. Order is created
const order = await createPaymentOrder(planId, token);

// 2. Razorpay checkout opens
displayRazorpay(order, userDetails, onSuccess, onFailure);

// 3. Payment is verified
const result = await verifyPayment(paymentData, token);

// 4. Subscription is activated
```

## 🎨 UI Components

### Payment States:
- **Initiating:** Shows loading state
- **Payment Modal:** Razorpay checkout
- **Verifying:** After payment completion
- **Success:** Subscription activated
- **Failed:** Error message with retry option

## 🔧 Troubleshooting

### Issue: Razorpay script not loading
**Solution:** Check internet connection and ensure checkout.razorpay.com is accessible

### Issue: Payment verification fails
**Solution:** Verify RAZORPAY_KEY_SECRET is correct in .env file

### Issue: Order creation fails
**Solution:** Check if user already has active subscription

### Issue: Payment modal doesn't open
**Solution:** Ensure Razorpay SDK is loaded (check browser console)

## 📊 Payment Flow Diagram

```
User → Click Subscribe
  ↓
Frontend → Create Order (API)
  ↓
Backend → Razorpay Order Created
  ↓
Frontend → Display Razorpay Checkout
  ↓
User → Complete Payment
  ↓
Razorpay → Payment Success/Failure
  ↓
Frontend → Verify Payment (API)
  ↓
Backend → Verify Signature
  ↓
Backend → Create Subscription
  ↓
Frontend → Show Success & Refresh Data
```

## 📞 Support

For Razorpay API issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)
- [Integration Guide](https://razorpay.com/docs/payment-gateway/web-integration/standard/)

## 🎉 What's Next?

- ✨ Webhook integration for automatic payment updates
- 📧 Enhanced email notifications with payment receipts
- 📊 Payment analytics dashboard
- 💰 Refund management
- 🔄 Auto-renewal with saved cards

