const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const userModel = require('../models/user');
const { comparePassword } = require('../utils/password');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

function generateTempToken(data) {
  return jwt.sign(data, jwtSecret, { expiresIn: '5m' });
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Password not set. Please use Google OAuth.' });
    }
    
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
    });
    
    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        organizationId: user.organization_id,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function googleCallback(req, res) {
  try {
    const user = req.user;
    
    if (!user) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/google/select?error=user_not_found`);
    }
    
    const tempToken = generateTempToken({
      email: user.email,
      name: user.name,
      googleId: user.id,
    });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/google/select?token=${tempToken}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
}

async function completeGoogleAuth(req, res) {
  try {
    const { tempToken, role, organizationId, organizationName } = req.body;
    
    let tempData;
    try {
      tempData = jwt.verify(tempToken, jwtSecret);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    const { email, name } = tempData;
    let user = await userModel.findByEmail(email);
    
    if (!user) {
      if (role === 'admin' && organizationName) {
        const orgModel = require('../models/organization');
        const { generateSlug } = require('../utils/slug');
        const { hashPassword } = require('../utils/password');
        
        const slug = generateSlug(organizationName);
        const org = await orgModel.create({
          name: organizationName,
          slug,
          createdBy: null,
        });
        
        user = await userModel.create({
          email,
          name,
          role: 'admin',
          organizationId: org.id,
          status: 'approved',
          password: null,
        });
      } else if (role === 'user' && organizationId) {
        user = await userModel.create({
          email,
          name,
          role: 'user',
          organizationId,
          status: 'pending',
          password: null,
        });
      } else {
        return res.status(400).json({ error: 'Invalid role or organization' });
      }
    }
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        organizationId: user.organization_id,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { generateToken, login, googleCallback, completeGoogleAuth };
