const orgModel = require('../models/organization');
const userModel = require('../models/user');
const { generateToken } = require('./auth');
const { generateSlug } = require('../utils/slug');
const { transformRow } = require('../utils/transform');

async function createOrganization(req, res) {
  try {
    const { name, email, userName, userRole = 'admin' } = req.body;
    const slug = generateSlug(name);
    
    const org = await orgModel.create({
      name,
      slug,
      createdBy: null,
    });
    
    const user = await userModel.create({
      email,
      name: userName || email.split('@')[0],
      role: userRole,
      organizationId: org.id,
      status: 'approved',
    });
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
    });
    
    res.status(201).json({ 
      organization: transformRow(org), 
      user: transformRow(user), 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createOrganization };

