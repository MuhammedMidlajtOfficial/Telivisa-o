const express = require('express');
const adminRouter = express.Router();
const adminConstroller = require('../Controller/Admin/adminController')
const adminProductController = require('../Controller/Admin/adminProductController')
const adminCategoryController = require('../Controller/Admin/adminCategoryController')
const adminUserController = require('../Controller/Admin/adminUserController')
const adminOrderController = require('../Controller/Admin/adminOrderController')
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
//Product Add
adminRouter.get('/adminAddProduct',auth.isAdmin,adminProductController.getAdminAddProduct)
adminRouter.post('/postAdminAddProduct',auth.isAdmin,productImageUploadMulter.array('adminAddProductImage'),adminProductController.postAdminAddProduct)
// Product Edit
adminRouter.get('/getAdminEditProduct',auth.isAdmin,adminProductController.getAdminEditProduct)
adminRouter.post('/postAdminEditProduct',auth.isAdmin,productImageUploadMulter.array('adminAddProductImage'),adminProductController.postAdminEditProduct)
//Product Delete(image) and Block 
adminRouter.get('/adminDeleteProductImage',auth.isAdmin,adminProductController.getAdminDeleteProductImage)
adminRouter.get('/adminBlockProduct',auth.isAdmin,adminProductController.getAdminBlockProduct)
adminRouter.get('/adminUnblockProduct',auth.isAdmin,adminProductController.getAdminUnblockProduct)


//Product List
adminRouter.get('/productList',auth.isAdmin,adminProductController.getProductList)
//Product Hoarding Active & Inactive
adminRouter.get('/adminActiveHoarding',auth.isAdmin,adminProductController.getAdminActiveHoarding)
adminRouter.get('/adminInactiveHoarding',auth.isAdmin,adminProductController.getAdminInactiveHoarding)


// Category View and Add 
adminRouter.get('/getAdminCategories',auth.isAdmin,adminCategoryController.getAdminAddCategories)
adminRouter.post('/postAdminAddCategories',auth.isAdmin,adminCategoryController.postAdminAddCategories)
// Category  Edit
adminRouter.get('/adminEditCategories',auth.isAdmin,adminCategoryController.getAdminEditCategories)
adminRouter.post('/postAdminEditCategories',auth.isAdmin,adminCategoryController.postAdminEditCategories)
// Category Block and Unblock
adminRouter.get('/adminBlockCategories',auth.isAdmin,adminCategoryController.getAdminBlockCategories)
adminRouter.get('/adminUnblockCategories',auth.isAdmin,adminCategoryController.getAdminUnblockCategories)


// User View
adminRouter.get('/adminUser',auth.isAdmin,adminUserController.getAdminUser)
// User Block & Unblock
adminRouter.get('/adminBlockUser',auth.isAdmin,adminUserController.getAdminBlockUser)
adminRouter.get('/adminUnblockUser',auth.isAdmin,adminUserController.getAdminUnblockUser)



// Order View
adminRouter.get('/adminOrders', auth.isAdmin, adminOrderController.getAdminOrders)
// Sigle Order View
adminRouter.get('/adminViewOrder', auth.isAdmin, adminOrderController.getAdminViewOrder )
// Change Status
adminRouter.post('/adminUpdateOrderStatus', auth.isAdmin, adminOrderController.postAdminUpdateOrderStatus)


module.exports = adminRouter;