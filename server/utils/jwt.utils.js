import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.model.js';

// Generate Access Token
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

// Generate Refresh Token
export const generateRefreshToken = async (userId, ipAddress) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  // Save refresh token to database
  const refreshToken = await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
    createdByIp: ipAddress,
  });

  return refreshToken.token;
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Revoke Refresh Token
export const revokeToken = async (token, ipAddress) => {
  const refreshToken = await RefreshToken.findOne({ token });

  if (!refreshToken || !refreshToken.isActive) {
    throw new Error('Invalid token');
  }

  // Revoke token
  refreshToken.revokedAt = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
};

// Refresh Access Token with Token Rotation
export const refreshAccessToken = async (oldRefreshToken, ipAddress) => {
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(oldRefreshToken);

    // Find the refresh token in database
    const refreshToken = await RefreshToken.findOne({ token: oldRefreshToken });

    if (!refreshToken || !refreshToken.isActive) {
      throw new Error('Invalid refresh token');
    }

    // Get user role
    const User = (await import('../models/User.model.js')).default;
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = await generateRefreshToken(user._id, ipAddress);

    // Revoke old refresh token and mark it as replaced
    refreshToken.revokedAt = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken;
    await refreshToken.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new Error('Failed to refresh token: ' + error.message);
  }
};

// Clean up expired tokens (can be run periodically)
export const cleanupExpiredTokens = async () => {
  await RefreshToken.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { revokedAt: { $ne: null } },
    ],
  });
};

