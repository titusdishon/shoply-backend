import Order from "../models/order.js";
import Product from "../models/products.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const newOrder = catchAsyncErrors(async (req, res, next) => {
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
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// get a single order that has been placed
export const getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler("The order you are looking for does not exist", 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get a single order that has been placed by the current user
export const getMyOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return next(new ErrorHandler("You do not have any orders", 404));
  }
  const orderLength = orders.length;
  res.status(200).json({
    success: true,
    orders,
    orderLength,
  });
});

// get a all orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new ErrorHandler("The are no orders available", 404));
  }
  const orderLength = orders.length;
  res.status(200).json({
    success: true,
    orders,
    orderLength,
  });
});

// update/process  an order for admin
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === "Delivered") {
    new ErrorHandler("The order has already been delivered", 400);
  }
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});
//update the quantity of the order before saving
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}


// Delete an order
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new ErrorHandler("The order you are looking for does not exist", 404)
      );
    }
    await order.remove();
    res.status(200).json({
      success: true,
      order,
    });
  });