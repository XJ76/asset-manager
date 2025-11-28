module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 
    (process.env.NODE_ENV === 'production' 
      ? `${process.env.BACKEND_URL}/api/auth/google/callback`
      : 'http://localhost:5000/api/auth/google/callback'),
};

