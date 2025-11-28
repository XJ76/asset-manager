const categoryModel = require('../models/category');
const { transformRows, transformRow } = require('../utils/transform');

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.findAll(
      req.user.organizationId
    );
    res.json(transformRows(categories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    const category = await categoryModel.create({
      ...req.body,
      organizationId: req.user.organizationId,
    });
    res.status(201).json(transformRow(category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await categoryModel.update(req.params.id, req.body);
    res.json(transformRow(category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    await categoryModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

