const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  getMonthlyIncome,
} = require("../controllers/order.controller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.middleware");
const asyncErrorMiddleware = require("../middlewares/error.middleware");

router
  .route("/order/new")
  .post(isAuthenticatedUser, asyncErrorMiddleware(newOrder));

router
  .route("/order/:id")
  .get(isAuthenticatedUser, asyncErrorMiddleware(getSingleOrder));
router
  .route("/orders/me")
  .get(isAuthenticatedUser, asyncErrorMiddleware(myOrders));

router
  .route("/admin/orders/income")
  .get(asyncErrorMiddleware(getMonthlyIncome));
router
  .route("/admin/orders/")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(allOrders)
  );
router
  .route("/admin/order/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(updateOrder)
  );

module.exports = router;
