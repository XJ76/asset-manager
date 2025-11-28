const assetModel = require('../models/asset');
const { transformRows, transformRow } = require('../utils/transform');

async function getAssets(req, res) {
  try {
    const userId = req.user.role === 'user' ? req.user.id : null;
    const assets = await assetModel.findAll(
      req.user.organizationId,
      userId
    );
    res.json(transformRows(assets));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAsset(req, res) {
  try {
    const asset = await assetModel.create({
      ...req.body,
      createdBy: req.user.id,
      organizationId: req.user.organizationId,
    });
    res.status(201).json(transformRow(asset));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateAsset(req, res) {
  try {
    const asset = await assetModel.update(req.params.id, req.body);
    res.json(transformRow(asset));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteAsset(req, res) {
  try {
    await assetModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAssets, createAsset, updateAsset, deleteAsset };

