const express = require('express')
const router = express.Router();

const {
    processPayment,
    sendStripApi
} = require('../controllers/payment.controller')

const { isAuthenticatedUser } = require('../middlewares/auth.middleware')
const asyncErrorMiddleware = require("../middlewares/error.middleware");

router.route('/payment/process').post(isAuthenticatedUser, asyncErrorMiddleware(processPayment));
router.route('/stripeapi').get(isAuthenticatedUser, asyncErrorMiddleware(sendStripApi));

module.exports = router;