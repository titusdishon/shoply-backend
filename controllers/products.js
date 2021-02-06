//controller for handling the products

import Product from "../models/products.js";
//product api should be /api/v1/product/new

export const newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

export const getProducts = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "This route shows all products in the database",
  });
};
