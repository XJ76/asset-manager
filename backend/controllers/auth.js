const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
    jwtSecret,
    { expiresIn: '7d' }
  );
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

module.exports = { generateToken, googleCallback };

