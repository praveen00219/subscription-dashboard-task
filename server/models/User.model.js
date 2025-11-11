import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate verification token
userSchema.methods.generateVerificationToken = function () {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationToken = token;
  this.verificationTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  return token;
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = async function () {
  const crypto = await import('crypto');
  const token = crypto.default.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.default.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
  return token;
};

const User = mongoose.model('User', userSchema);

export default User;

