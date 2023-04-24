const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updatePassword,
  updateProfile,
  logout,
  allUsers,
  getUserDetails,
  updateUser,
} = require("../controllers/auth.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.middleware");
const asyncErrorMiddleware = require("../middlewares/error.middleware");

router.route("/register").post(asyncErrorMiddleware(registerUser));
router.route("/login").post(asyncErrorMiddleware(loginUser));

router.route("/logout").get(logout);

router
  .route("/me")
  .get(isAuthenticatedUser, asyncErrorMiddleware(getUserProfile));
router
  .route("/password/update")
  .put(isAuthenticatedUser, asyncErrorMiddleware(updatePassword));
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(allUsers)
  );
router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(getUserDetails)
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorMiddleware(updateUser)
  );

module.exports = router;
