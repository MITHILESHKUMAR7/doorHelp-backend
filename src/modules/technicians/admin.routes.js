const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const ROLES = require('../../common/constants/roles');
const controller = require('./technician.controller');
const { createTechnicianSchema, updateTechnicianSchema, idParamSchema } = require('./technician.validator');

const router = express.Router();
const adminOnly = [auth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

router.get('/', ...adminOnly, controller.listTechnicians);
router.post('/', ...adminOnly, validate(createTechnicianSchema), controller.createTechnician);
router.patch('/:id', ...adminOnly, validate(updateTechnicianSchema), controller.updateTechnician);
router.delete('/:id', ...adminOnly, validate(idParamSchema), controller.deleteTechnician);

module.exports = router;