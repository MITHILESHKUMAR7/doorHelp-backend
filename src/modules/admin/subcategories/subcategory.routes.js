const express = require('express');
const router = express.Router();
const subCtrl = require('./subcategory.controller');
const adminAuth = require('../../../middlewares/admin-auth.middleware');
const rbac = require('../../../middlewares/rbac.middleware');

router.use(adminAuth, rbac('admin', 'superadmin'));

router.post('/', subCtrl.createSubcategory);
router.get('/', subCtrl.getAllSubcategories);
router.patch('/:id', subCtrl.updateSubcategory);
router.delete('/:id', subCtrl.deleteSubcategory);

module.exports = router;
