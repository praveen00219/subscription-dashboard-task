import mongoose from 'mongoose';

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    cancelledAt: Date,
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentInfo: {
      lastPaymentDate: Date,
      lastPaymentAmount: Number,
      paymentMethod: String,
      transactionId: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
userSubscriptionSchema.index({ user: 1, status: 1 });
userSubscriptionSchema.index({ endDate: 1 });

// Virtual to check if subscription is expired
userSubscriptionSchema.virtual('isExpired').get(function () {
  return Date.now() > this.endDate;
});

// Virtual to get days remaining
userSubscriptionSchema.virtual('daysRemaining').get(function () {
  const diff = this.endDate - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Middleware to update status based on date
userSubscriptionSchema.pre('save', function (next) {
  if (this.isExpired && this.status === 'active') {
    this.status = 'expired';
  }
  next();
});

const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

export default UserSubscription;

