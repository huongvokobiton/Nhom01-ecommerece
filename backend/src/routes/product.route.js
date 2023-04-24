const express = require("express");
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/product.controller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.middleware");
const asyncErrorMiddleware = require("../middlewares/error.middleware");

router.route("/products").get(asyncErrorMiddleware(getProducts));
//router.route("/product/promote").get(asyncErrorMiddleware(getProductsPromoted));

router.route("/admin/products").get(asyncErrorMiddleware(getAdminProducts));
router.route("/product/:id").get(asyncErrorMiddleware(getSingleProduct));

router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(newProduct)
  );

router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(updateProduct)
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(deleteProduct)
  );

router
  .route("/review")
  .put(isAuthenticatedUser, asyncErrorMiddleware(createProductReview));
router
  .route("/reviews")
  .get(isAuthenticatedUser, asyncErrorMiddleware(getProductReviews));
router
  .route("/reviews")
  .delete(isAuthenticatedUser, asyncErrorMiddleware(deleteReview));

module.exports = router;
