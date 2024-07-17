import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import ExpressFormidable from 'express-formidable';
import { createProductController, 
    deleteProductController, 
    getProductController, 
    singleProductController, 
    updateProductController,
    productPhotoController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
 } from '../controllers/productController.js';
const router = express.Router();

// routes

router.post("/create-product", requireSignIn, isAdmin, ExpressFormidable(), createProductController);
router.put("/update-product/:pid", requireSignIn, isAdmin, ExpressFormidable(), updateProductController);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", singleProductController);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);

router.post("/product-filters", productFilterController);
router.get("/product-count", productCountController);

//product-per page
router.get("/product-list/:page", productListController);
//search product
router.get("/search/:keyword", searchProductController);

// similar products
router.get("/related-products/:pid/:cid", relatedProductController);

router.get("/product-category/:slug", productCategoryController);

//payment route
router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;