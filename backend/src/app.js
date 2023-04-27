const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const paymentRoutes = require('./routes/payment.route');


const globalErrHandler = require("./controllers/error.controller");
const morgan = require("morgan");
const AppError = require("./utils/appError.util");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
//app.use(morgan("tiny"));

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use('/api/v1', paymentRoutes);


// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError("undefined route", 404, "fail");
  next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;
