import api from '../services/api';

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Get Razorpay key
export const getRazorpayKey = async () => {
  try {
    const response = await api.get('/payments/key');
    return response.data.key;
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw error;
  }
};

// Create payment order
export const createPaymentOrder = async (planId) => {
  try {
    // Debug: Check if token exists
    const token = localStorage.getItem('accessToken');
    console.log('Token exists:', !!token);
    
    const response = await api.post('/payments/create-order', { planId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    console.error('Full error:', error.response?.data);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Handle payment failure
export const handlePaymentFailure = async (errorData) => {
  try {
    await api.post('/payments/payment-failed', errorData);
  } catch (error) {
    console.error('Error logging payment failure:', error);
  }
};

// Create renewal order
export const createRenewalOrder = async () => {
  try {
    const response = await api.post('/payments/renew-order', {});
    return response.data;
  } catch (error) {
    console.error('Error creating renewal order:', error);
    throw error;
  }
};

// Verify renewal payment
export const verifyRenewalPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify-renewal', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying renewal payment:', error);
    throw error;
  }
};

// Display Razorpay checkout
export const displayRazorpay = async (orderData, userDetails, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const razorpayKey = await getRazorpayKey();

  const options = {
    key: razorpayKey,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Subscription Management',
    description: `Subscription to ${orderData.planDetails.name}`,
    order_id: orderData.id,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
    },
    theme: {
      color: '#3B82F6',
    },
    handler: function (response) {
      onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        onFailure({
          message: 'Payment cancelled by user',
          orderId: orderData.id,
        });
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response) {
    onFailure({
      error: response.error,
      orderId: orderData.id,
    });
  });
  paymentObject.open();
};

