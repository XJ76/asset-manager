const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleClientId, googleClientSecret, googleCallbackUrl } = require('./auth');
const userModel = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: googleCallbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, emails, displayName } = profile;
    const email = emails[0].value;
    
    let user = await userModel.findByEmail(email);
    
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    
    return done(null, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organization_id,
    });
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;

