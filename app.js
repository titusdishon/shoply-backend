import express from "express";
import products from "./routes/products.js";
import order from "./routes/order.js";
import auth from "./routes/user.js";
import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
//products apis
app.use(`/api/v1`, products);
app.use(`/api/v1`, auth);
app.use(`/api/v1`, order);
//handle errors with middlewares
app.use(errorMiddleware);

export default app;
