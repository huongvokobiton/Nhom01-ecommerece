const Order = require("../models/oder.model");
const Product = require("../models/product.model");
const ErrorHandler = require("../utils/appError.util");

const { createRelationship } = require("../databases/neo4j.database");

// Create a new order   =>  /api/v1/order/new
exports.newOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  try {
    const record = await createRelationship(
      "id",
      req.user._id,
      "id",
      orderItems?.[0]?.product,
      orderItems?.[0]?.quantity
    );
  } catch (error) {
    console.log("error", error);
  }

  res.status(200).json({
    success: true,
    order,
  });

};

// Get single order   =>   /api/v1/order/:id
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Không tìm thấy đơn hàng nào có ID này", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
};

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
};

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
};

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Đã giao hàng") {
    return next(new ErrorHandler("Bạn đã giao đơn đặt hàng này", 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });

  
}


// //HoangT - Add function to push relation Neo4J
// const neo4j = require('neo4j-driver');

// async function createRelationship(session, label1, property1, label2, property2, quantity) {
//   const query = `
//     MATCH (a{${label1}:${property1}}), (b{${label2}:${property2}})
//     MERGE (a)-[:PURCHASED {quantity: ${quantity}}]->(b)
//     RETURN a, b
//   `;

//   const result = await session.run(query, {label1,property1, label2,property2, quantity});
//   console.log('Query la : ' + query);

//   return result.records.map(record => ({
//     source: record.get('a').properties,
//     target: record.get('b').properties
//   }));
// }
// //HoangT - END

// GET MONTHLY INCOME
exports.getMonthlyIncome = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    let income = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          // $project : chỉ định các field mong muốn truy vấn.
          month: { $month: "$createdAt" },
          sales: "$totalPrice",
        },
      },
      {
        $group: {
          // $group: nhóm các document theo điều kiện nhất định
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
