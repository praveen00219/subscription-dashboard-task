import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as subscriptionService from '../../services/subscription.service';

const initialState = {
  plans: [],
  currentPlan: null,
  userSubscription: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching plans');
    }
  }
);

export const fetchUserSubscription = createAsyncThunk(
  'subscription/fetchUserSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getUserSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching subscription');
    }
  }
);

export const subscribeToPlan = createAsyncThunk(
  'subscription/subscribeToPlan',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.subscribe(planId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error subscribing to plan');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.cancelSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error canceling subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.plans;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Subscription
      .addCase(fetchUserSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSubscription = action.payload.subscription;
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Subscribe to Plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSubscription = action.payload.subscription;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSubscription = action.payload.subscription;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

