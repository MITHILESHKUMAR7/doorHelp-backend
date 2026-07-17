const express = require('express');
const router = express.Router();
const categoryCtrl = require('./category.controller');
const adminAuth = require('../../../middlewares/admin-auth.middleware');
const rbac = require('../../../middlewares/rbac.middleware');

router.use(adminAuth, rbac('admin', 'superadmin'));

router.post('/', categoryCtrl.createCategory);
router.get('/', categoryCtrl.getAllCategories);
router.patch('/:id', categoryCtrl.updateCategory);
router.delete('/:id', categoryCtrl.deleteCategory);

module.exports = router;
