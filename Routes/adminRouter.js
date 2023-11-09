const express = require('express');
const adminRouter = express.Router();
const adminConstroller = require('../Controller/Admin/adminController')
const adminProductController = require('../Controller/Admin/adminProductController')
const adminCategoryController = require('../Controller/Admin/adminCategoryController')
const productImageUploadMulter = require('../Middleware/multerMiddleware')
const auth = require('../Middleware/auth')

adminRouter.use('/uploads', express.static('uploads'))
adminRouter.use('/Public', express.static('Public'))

//Admin login
adminRouter.get('/',adminConstroller.getAdminLogin)
adminRouter.post('/postAdminLogin',adminConstroller.postAdminLogin)
adminRouter.get('/adminLogout',adminConstroller.getadminLogout)
//Admin dashboard
adminRouter.get('/adminDashboard',auth.isAdmin,adminConstroller.getAdminDashboard)
// View product
adminRouter.get('/products',auth.isAdmin,adminProductController.getAdminProducts)
//Add product
adminRouter.get('/adminAddProduct',auth.isAdmin,adminProductController.getAdminAddProduct)
adminRouter.post('/postAdminAddProduct',auth.isAdmin,productImageUploadMulter.array('adminAddProductImage' , 4),adminProductController.postAdminAddProduct)
//Edit product
adminRouter.get('/getAdminEditProduct',auth.isAdmin,adminProductController.getAdminEditProduct)
adminRouter.post('/postAdminEditProduct',auth.isAdmin,productImageUploadMulter.array('adminAddProductImage',4),adminProductController.postAdminEditProduct)
// Delete and Block product
adminRouter.get('/adminDeleteProductImage',auth.isAdmin,adminProductController.getAdminDeleteProductImage)
adminRouter.get('/adminBlockProduct',auth.isAdmin,adminProductController.getAdminBlockProduct)
adminRouter.get('/adminUnblockProduct',auth.isAdmin,adminProductController.getAdminUnblockProduct)
// Category
adminRouter.get('/getAdminCategories',auth.isAdmin,adminCategoryController.getAdminAddCategories)
// Category Add and Edit
adminRouter.post('/postAdminAddCategories',auth.isAdmin,adminCategoryController.postAdminAddCategories)
adminRouter.get('/adminEditCategories',auth.isAdmin,adminCategoryController.getAdminEditCategories)
adminRouter.post('/postAdminEditCategories',auth.isAdmin,adminCategoryController.postAdminEditCategories)
// Category Block and Unblock
adminRouter.get('/adminBlockCategories',auth.isAdmin,adminCategoryController.getAdminBlockCategories)
adminRouter.get('/adminUnblockCategories',auth.isAdmin,adminCategoryController.getAdminUnblockCategories)

module.exports = adminRouter;