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


//get all products in the database 
export const getProducts = async (req, res, next) => {

  const products =await Product.find();
  res.status(200).json({
    success: true, 
    count: products.length,
    products
  });
  
};
