import Product from "../models/products.js";
import dotenv from "dotenv";
import connectDb from "../config/database.js";
import products from "../data/products.js";

dotenv.config({ path: "./config/config.env" });

connectDb();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
  process.exit();
};

seedProducts();
