import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminService from '../../services/admin.service';

const initialState = {
  dashboardStats: null,
  users: [],
  plans: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching stats');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching users');
    }
  }
);

export const fetchAllPlans = createAsyncThunk(
  'admin/fetchAllPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching plans');
    }
  }
);

export const createPlan = createAsyncThunk(
  'admin/createPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await adminService.createPlan(planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error creating plan');
    }
  }
);

export const updatePlan = createAsyncThunk(
  'admin/updatePlan',
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const response = await adminService.updatePlan(id, planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error updating plan');
    }
  }
);

export const deletePlan = createAsyncThunk(
  'admin/deletePlan',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deletePlan(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting plan');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Plans
      .addCase(fetchAllPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.plans;
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Plan
      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans.push(action.payload.plan);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Plan
      .addCase(updatePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.plans.findIndex((p) => p._id === action.payload.plan._id);
        if (index !== -1) {
          state.plans[index] = action.payload.plan;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Plan
      .addCase(deletePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = state.plans.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;

