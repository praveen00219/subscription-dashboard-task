# 🧪 Testing Payment Flow - Complete Guide

## 🎯 Quick Fix for "Not authorized, token failed"

### **MOST COMMON FIX (Try this first!):**

1. **Open Browser Console** (Press F12)
2. **Paste this command:**
   ```javascript
   localStorage.removeItem('accessToken');
   ```
3. **Refresh the page**
4. **Log in again** with your credentials
5. **Try subscribing** - Should work now! ✅

---

## 🔍 Step-by-Step Testing

### Step 1: Verify You're Logged In

✅ **Check these things:**
- You see your name in the top-right header
- You see the sidebar with navigation
- Dashboard shows your subscription status

❌ **If not visible:**
- You're not logged in
- Go to `/login` and log in

### Step 2: Check Token in Browser Console

```javascript
// Paste in browser console (F12)
const token = localStorage.getItem('accessToken');
console.log('Token exists:', !!token);
console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
```

**Expected:** Should show `Token exists: true`

### Step 3: Test API Connection

```javascript
// Paste in browser console
fetch('http://localhost:5000/api/payments/key')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Server is responding');
    console.log('Razorpay Key:', data.key);
  })
  .catch(err => console.error('❌ Server not responding:', err));
```

**Expected:** Should show Razorpay key starting with `rzp_test_`

### Step 4: Check Server Logs

When you click "Subscribe Now", your **server terminal** should show:

```
🔐 Create order request from user: your_email@example.com
📦 Plan ID: 673a4b...
✅ Plan found: Premium Plan - Price: 999
💳 Creating Razorpay order...
✅ Razorpay order created: order_xxxxx
```

**If you see:** `❌ Razorpay keys not configured`
- Check your `.env` file
- Restart server

### Step 5: Browser Network Tab

1. Open **DevTools** (F12) → **Network** tab
2. Click "Subscribe Now" button
3. Look for request to `create-order`
4. Click on it → **Headers** tab
5. Scroll to **Request Headers**

**Should see:**
```
Authorization: Bearer eyJhbGciOiJIUz...
Content-Type: application/json
```

**If Authorization is missing:**
- Token not in localStorage
- API interceptor not working

---

## 🚀 Complete Test Scenario

### Scenario 1: Fresh User Subscribing

```
Step 1: Sign up → ✅ Account created
Step 2: Verify email → ✅ Email verified  
Step 3: Go to Plans page → ✅ See plans
Step 4: Click "Subscribe Now" → 💳 Razorpay modal opens
Step 5: Enter test card → ✅ Payment processed
Step 6: Payment verified → 🎉 Subscription activated!
```

### Test Card Details (Razorpay Test Mode):

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Not authorized, token failed"

**Cause:** Token is expired, invalid, or not being sent

**Solution:**
```javascript
// Clear token and log in again
localStorage.clear();
// Refresh page and log in
```

### Issue 2: Payment modal doesn't open

**Cause:** Razorpay script not loaded

**Solution:**
- Check internet connection
- Check browser console for errors
- Try refreshing page

### Issue 3: "Already have active subscription"

**Cause:** User already subscribed

**Solution:**
- Go to "My Subscription" page
- Cancel existing subscription
- Then subscribe to new plan

### Issue 4: Server error 500

**Cause:** Razorpay keys not configured

**Solution:**
1. Check `server/.env` has:
   ```
   RAZORPAY_KEY_ID=rzp_test_XXXXX
   RAZORPAY_KEY_SECRET=YYYYYYY
   ```
2. Restart server

---

## 🎬 Complete Testing Script

Open browser console and paste this complete test:

```javascript
console.log('🧪 Starting Payment Flow Test...\n');

// Test 1: Check Token
const token = localStorage.getItem('accessToken');
console.log('1️⃣ Token Check:', token ? '✅ EXISTS' : '❌ MISSING');
if (!token) {
  console.log('   → Solution: Log out and log in again');
}

// Test 2: Check Server
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(() => console.log('2️⃣ Server Check: ✅ RUNNING'))
  .catch(() => console.log('2️⃣ Server Check: ❌ NOT RUNNING\n   → Start server: npm run dev'));

// Test 3: Check Razorpay Key
fetch('http://localhost:5000/api/payments/key')
  .then(r => r.json())
  .then(data => {
    if (data.key) {
      console.log('3️⃣ Razorpay Key: ✅ CONFIGURED');
      console.log('   Key:', data.key.substring(0, 20) + '...');
    } else {
      console.log('3️⃣ Razorpay Key: ❌ NOT CONFIGURED');
    }
  })
  .catch(err => console.log('3️⃣ Razorpay Key: ❌ ERROR', err.message));

// Test 4: Check Auth
fetch('http://localhost:5000/api/auth/check-auth', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      console.log('4️⃣ Authentication: ✅ VALID');
      console.log('   User:', data.user.name, '(' + data.user.email + ')');
    } else {
      console.log('4️⃣ Authentication: ❌ INVALID');
    }
  })
  .catch(() => console.log('4️⃣ Authentication: ❌ FAILED\n   → Log out and log in again'));

setTimeout(() => {
  console.log('\n🎯 Test complete! Check results above.');
  console.log('\nIf all ✅, you can proceed with payment.');
  console.log('If any ❌, follow the solutions provided.');
}, 2000);
```

---

## ✅ Expected Working Flow

When everything is configured correctly:

1. Click **"Subscribe Now"**
   - Browser console shows: `Token exists: true`
   - Server logs: `🔐 Create order request from user: ...`

2. **Razorpay modal opens**
   - Shows plan details
   - Shows payment amount in ₹

3. **Enter test card details**
   - Card processes instantly (test mode)

4. **Payment success**
   - Toast: "Verifying payment..."
   - Server logs: `✅ Payment verified`
   - Toast: "🎉 Payment successful!"

5. **Dashboard updates**
   - Shows active subscription
   - Shows plan details

---

## 📝 Pre-Flight Checklist

Before testing payment:

- [ ] Server is running (`npm run dev` in server folder)
- [ ] Client is running (`npm run dev` in client folder)
- [ ] You are logged in (see your name in header)
- [ ] Email is verified (if required)
- [ ] No active subscription yet (or cancelled existing one)
- [ ] `.env` file has Razorpay test keys
- [ ] Server was restarted after adding Razorpay keys

---

## 🆘 Emergency Reset

If nothing works, do a complete reset:

```bash
# Stop both servers (Ctrl+C)

# Clear browser
# Open DevTools (F12) → Application → Clear Storage → Clear

# Delete node_modules and reinstall
cd server
rm -rf node_modules
npm install

# Restart everything
npm run dev

# In new terminal
cd client
npm run dev

# Go to browser, log in fresh, and test
```

---

## 💬 What to Check in Console

### Browser Console (F12):
```
✅ Token exists: true
✅ Creating payment order...
✅ Razorpay modal opening...
✅ Payment successful
✅ Verifying payment...
✅ Subscription activated
```

### Server Terminal:
```
🔐 Create order request from user: user@example.com
✅ Plan found: Premium Plan - Price: 999
💳 Creating Razorpay order...
✅ Razorpay order created: order_xxxxx
```

If you see these logs, everything is working! 🎉

---

## 🎯 Final Solution

**Most likely you just need to:**

1. **Log out** (click logout in sidebar)
2. **Log in again** (go to login page)
3. **Try subscribing** (click Subscribe Now)
4. **Enter test card** (4111 1111 1111 1111)
5. **Complete payment** ✅

This refreshes your authentication token and should fix the "Not authorized" error!

