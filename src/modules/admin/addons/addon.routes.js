const express = require('express');
const router = express.Router();
const addonCtrl = require('./addon.controller');
const adminAuth = require('../../../middlewares/admin-auth.middleware');
const rbac = require('../../../middlewares/rbac.middleware');

router.use(adminAuth, rbac('admin', 'superadmin'));

router.post('/', addonCtrl.createAddon);
router.get('/', addonCtrl.getAllAddons);
router.patch('/:id', addonCtrl.updateAddon);
router.delete('/:id', addonCtrl.deleteAddon);

module.exports = router;
