const userModel = require('../models/user');
const { transformRows, transformRow } = require('../utils/transform');

async function getUsers(req, res) {
  try {
    const users = await userModel.findAll(req.user.organizationId);
    res.json(transformRows(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function approveUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.updateStatus(id, 'approved');
    res.json(transformRow(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function rejectUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.updateStatus(id, 'rejected');
    res.json(transformRow(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getUsers, approveUser, rejectUser };

