# 🔧 Token Authentication Troubleshooting Guide

## 🚨 Issue: "Not authorized, token failed"

This error occurs when the JWT token is not being sent correctly or is invalid.

## ✅ Step-by-Step Fix

### Step 1: Check if Token Exists in Browser

1. Open your browser **DevTools** (F12)
2. Go to **Console** tab
3. Type: `localStorage.getItem('accessToken')`
4. Press Enter

**Expected Result:** Should show a JWT token string (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**If NULL or undefined:**
- You need to log in again
- Token was not saved during login

### Step 2: Verify Token in Network Requests

1. Open **DevTools** → **Network** tab
2. Try to subscribe to a plan
3. Look for the request to `/api/payments/create-order`
4. Click on it → Go to **Headers** tab
5. Check **Request Headers** section

**Should see:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If Authorization header is missing:**
- Token not in localStorage
- API interceptor not working

### Step 3: Log Out and Log In Again

Sometimes the token gets corrupted or expires. Fresh login helps:

1. Click **Logout** in the sidebar
2. Log in again with your credentials
3. Try subscribing to a plan again

### Step 4: Check Server Logs

Look at your server terminal for any error messages. The middleware now logs token verification errors.

### Step 5: Verify Environment Variables

Make sure your server `.env` file has:

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d

RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

## 🔍 Debug Checklist

Run through this checklist:

- [ ] User is logged in (check `state.auth.isAuthenticated`)
- [ ] Token exists in localStorage
- [ ] Token is not expired
- [ ] Server is running
- [ ] `.env` file has correct Razorpay keys
- [ ] Server restarted after adding env variables
- [ ] Client shows user info in layout (indicates auth works)

## 🎯 Quick Test

Open browser console and run:

```javascript
// Check if user is authenticated
console.log('Auth State:', {
  token: localStorage.getItem('accessToken'),
  isAuth: !!localStorage.getItem('accessToken')
});

// Try to fetch Razorpay key (public endpoint - no auth needed)
fetch('http://localhost:5000/api/payments/key')
  .then(r => r.json())
  .then(d => console.log('Razorpay Key:', d))
  .catch(e => console.error('Key fetch error:', e));
```

## 🐛 Common Causes

### 1. Token Expired
**Solution:** Log out and log in again

### 2. Token Not Saved
**Solution:** Check `auth.service.js` - token should be saved to localStorage after login

### 3. CORS Issues
**Solution:** Ensure server CORS is configured correctly:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // or your client URL
  credentials: true,
}));
```

### 4. Wrong API URL
**Solution:** Check `client/src/services/api.js` - baseURL should match your server

### 5. Server Not Reading .env
**Solution:** 
- Ensure `dotenv.config()` is called at the top of `server.js`
- Restart server after changing `.env`

## 🔥 Emergency Fix

If nothing works, try this complete reset:

```bash
# 1. Clear browser data
# Open DevTools → Application → Clear Storage → Clear site data

# 2. Restart server
cd server
npm run dev

# 3. Restart client  
cd client
npm run dev

# 4. Log in fresh
# Go to login page and log in with credentials

# 5. Try payment again
```

## ✅ Verification Steps

### Test 1: Check Auth is Working
1. Log in to your account
2. Go to Dashboard
3. If you see your name and subscription info → Auth is working ✅

### Test 2: Check API Calls
1. Open Network tab
2. Navigate to any page
3. Check if API calls have `Authorization` header
4. If yes → Token is being sent ✅

### Test 3: Test Payment Endpoint
Open browser console and run:
```javascript
const token = localStorage.getItem('accessToken');
console.log('Testing payment endpoint with token:', !!token);

fetch('http://localhost:5000/api/payments/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ planId: 'your_plan_id_here' })
})
.then(r => r.json())
.then(d => console.log('Payment Response:', d))
.catch(e => console.error('Payment Error:', e));
```

## 📞 Still Not Working?

If the issue persists:

1. **Check Console Logs:**
   - Browser console (F12)
   - Server terminal
   
2. **Verify Token Structure:**
   ```javascript
   const token = localStorage.getItem('accessToken');
   const parts = token?.split('.');
   console.log('Token parts:', parts?.length); // Should be 3
   ```

3. **Test Without Payment:**
   - Try accessing other protected routes (Dashboard, My Subscription)
   - If those work, problem is specific to payment routes
   - If those fail, auth is broken globally

## 💡 Most Likely Solution

**The token in localStorage might be expired or invalid.**

**Quick Fix:**
1. Open browser console (F12)
2. Run: `localStorage.removeItem('accessToken')`
3. Refresh page (you'll be logged out)
4. Log in again
5. Try payment again - should work! ✅

This generates a fresh token and fixes most token-related issues.

