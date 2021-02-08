import express from "express";
import products from "./routes/products.js";
import auth from "./routes/user.js";
import errorMiddleware from "./middlewares/errors.js";

const app = express();

app.use(express.json());
//products apis
app.use(`/api/v1`, products);
app.use(`/api/v1`, auth);
//handle errors with middlewares
app.use(errorMiddleware);

export default app;
