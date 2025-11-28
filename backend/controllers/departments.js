const departmentModel = require('../models/department');
const { transformRows, transformRow } = require('../utils/transform');

async function getDepartments(req, res) {
  try {
    const departments = await departmentModel.findAll(
      req.user.organizationId
    );
    res.json(transformRows(departments));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createDepartment(req, res) {
  try {
    const department = await departmentModel.create({
      ...req.body,
      organizationId: req.user.organizationId,
    });
    res.status(201).json(transformRow(department));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    await departmentModel.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getDepartments, createDepartment, deleteDepartment };

