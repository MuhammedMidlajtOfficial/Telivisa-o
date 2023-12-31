const express = require('express');
const adminRouter = express.Router();
const adminConstroller = require('../Controller/Admin/adminController')
const adminProductController = require('../Controller/Admin/adminProductController')
const adminCategoryController = require('../Controller/Admin/adminCategoryController')
const adminUserController = require('../Controller/Admin/adminUserController')
const adminOrderController = require('../Controller/Admin/adminOrderController')
const reportController = require('../Controller/Admin/reportController')
const adminCouponConttroller = require('../Controller/Admin/adminCouponController')
const adminBannerController = require('../Controller/Admin/adminBannerController')
const adminOfferController = require('../Controller/Admin/adminOfferController')
const productImageUploadMulter = require('../Middleware/multerMiddleware')
const auth = require('../Middleware/auth');
const offerSchema = require('../Model/offerSchema');

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


// Coupon View
adminRouter.get('/adminCoupon', auth.isAdmin, adminCouponConttroller.getAdminCoupon)
// Coupon Add
adminRouter.post('/postAdminAddCoupon', auth.isAdmin, adminCouponConttroller.postAdminAddCoupon)
// Coupon Block & Unblock Status
adminRouter.get('/adminBlockCoupon', auth.isAdmin, adminCouponConttroller.getAdminBlockCoupon)
adminRouter.get('/adminUnblockCoupon', auth.isAdmin, adminCouponConttroller.getAdminUnblockCoupon)
// Coupon Edit
adminRouter.get('/adminEditCoupon', auth.isAdmin, adminCouponConttroller.getAdminEditCoupon)
adminRouter.post('/postAdminEditCoupon', auth.isAdmin, adminCouponConttroller.postAdminEditCoupon)



// Banner View
adminRouter.get('/adminBanner', auth.isAdmin, adminBannerController.getAdminBanner)
// Banner Add
adminRouter.post('/postAdminBanner', auth.isAdmin, productImageUploadMulter.array('adminAddBannerImage'), adminBannerController.postAdminBanner);
// Banner Edit
adminRouter.get('/adminEditBanner', auth.isAdmin, adminBannerController.getAdminEditBanner)
adminRouter.post('/postAdminEditBanner', auth.isAdmin, productImageUploadMulter.array('adminAddBannerImage'), adminBannerController.postAdminEditBanner);
// Banner Change Status
adminRouter.get('/adminChangeBannerStatus', auth.isAdmin, adminBannerController.getAdminChangeBannerStatus)



// Offer View
adminRouter.get('/adminOffers', auth.isAdmin, adminOfferController.getBrandOffer )
// Offer Add
adminRouter.post('/postAdminAddBrandOffer', auth.isAdmin, adminOfferController.postAdminAddBrandOffer)
// Offer Chande Status
adminRouter.get('/adminChangeOfferStatus', auth.isAdmin, adminOfferController.notAdminChangeOfferStatus)
// Offer Edit
adminRouter.get('/adminEditOffer', auth.isAdmin, adminOfferController.getAdminEditOffer)
adminRouter.post('/postAdminEditOffer', auth.isAdmin, adminOfferController.postAdminEditOffer)


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
// Order Cancel
adminRouter.get('/adminOrderCancel', auth.isAdmin, adminOrderController.getAdminOrderCancel)

// Return Req
adminRouter.get('/adminReturnReq', auth.isAdmin, adminOrderController.getReturnReq)
// Accept Return Req
adminRouter.get('/requestAccept', auth.isAdmin, adminOrderController.getRequestAccept)
adminRouter.get('/requestReject', auth.isAdmin, adminOrderController.getRequestReject)



// Sales Report
adminRouter.get('/salesReport', auth.isAdmin, reportController.getSalesReport)
adminRouter.post('/filterReport', auth.isAdmin, reportController.getFilterReport)


module.exports = adminRouter;