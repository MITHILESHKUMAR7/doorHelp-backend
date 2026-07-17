const express = require('express');
const router = express.Router();
const serviceCtrl = require('./service.controller');
const adminAuth = require('../../../middlewares/admin-auth.middleware');
const rbac = require('../../../middlewares/rbac.middleware');

router.use(adminAuth, rbac('admin', 'superadmin'));

router.post('/', serviceCtrl.createService);
router.get('/', serviceCtrl.getAllServices);
router.patch('/:id', serviceCtrl.updateService);
router.delete('/:id', serviceCtrl.deleteService);

module.exports = router;
