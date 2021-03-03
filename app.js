import express from "express";
import products from "./routes/products.js";
import order from "./routes/order.js";
import auth from "./routes/auth.js";
import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import fileupload from "express-fileupload";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import payments from "./routes/payments.js";
import {ConfigEnv} from "./config/config.js"
import cors from "cors";

ConfigEnv()

//swagger config
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EShop swagger APIS',
            version: '1.0.0',
            definition: "All api documentations for the eshop project"
        },
        servers:[
            {
                url:"http://localhost:4000"
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpecs = await swaggerJsdoc(options);
const app = express();
//swagger serve
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
//cors config
app.use(cors())

  
//app configurations
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileupload());
//setup cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

//products apis
app.use(`/api/v1`, products);
app.use(`/api/v1`, auth);
app.use(`/api/v1`, order);
app.use(`/api/v1`, payments);
//handle errors with middlewares
app.use(errorMiddleware);

export default app;
