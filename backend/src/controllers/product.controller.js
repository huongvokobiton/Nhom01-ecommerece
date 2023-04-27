const Product = require("../models/product.model");

const ErrorHandler = require("../utils/appError.util");
const APIFeatures = require("../utils/apiFeatures.util");
const cloudinary = require("cloudinary");

const { getPromotedProducts } = require("../databases/neo4j.database");

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

// Get all products   =>   /api/v1/product
exports.getProducts = async (req, res, next) => {
  const resPerPage = 12;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  apiFeatures.pagination(resPerPage);
  products = await apiFeatures.query;
  //console.log('ID LA ' ,products);
  res.status(200).json({
    success: true,
    productsCount,
    resPerPage,
    filteredProductsCount,
    products,
  });
};

// Get all promoted products   =>   /api/v1/product/promoted
exports.getProductsPromoted = async (req, res, next) => {
  const resPerPage = 8;
  const productsCount = await Product.countDocuments();

  //console.log('ID la ',req.user.id)

  let promotedProductName = [];
  try {
    promotedProductName = await getPromotedProducts(
      req.user.id,
      '644453f19437263ab821045e'
    );
    
    console.log('Connected to Neo4J Database successfully')
    //console.log('List Product De Xuat' , promotedProductName)

    if (! promotedProductName && promotedProductName?.length === 0) {
      res.status(200).json({
        success: true,
        productsCount: 0,
        resPerPage: resPerPage,
        filteredProductsCount: 0,
        products: [],
      });
      //console.log(promotedProductName)
      return
    }

    const apiFeatures = new APIFeatures(Product.find(), { ...req.query, _id: promotedProductName }) //HoangT Edit name => _id
      .search()
      .filter();

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      productsCount,
      resPerPage,
      filteredProductsCount,
      products,
    });
  } catch (e) {
    console.log(e);
    res.status(500)
  }
};

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
};

// Get single product details   =>   /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
  }

  // Deleting images associated with the product
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Xóa sản phẩm thành công",
  });
};

// Create new review   =>   /api/v1/review
exports.createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(200).json({
      message: "Không tìm thấy review với id",
    });
  }
};

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  console.log(product);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
};
