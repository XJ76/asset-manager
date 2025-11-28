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
    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { generateToken, login, googleCallback };
