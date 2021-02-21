import express from "express";
import products from "./routes/products.js";
import order from "./routes/order.js";
import auth from "./routes/user.js";
import errorMiddleware from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cloudinary from "cloudinary";
import fileupload from "express-fileupload";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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

//environment config
dotenv.config()
//app configurations
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileupload());
//setup cloudinary config

cloudinary.config({
  cloud_name: 'titusdishon-com',
  api_key: '376158673733585',
  api_secret: '-U13mLgi2LjhGIjihJx11fYO14A',
});

//products apis
app.use(`/api/v1`, products);
app.use(`/api/v1`, auth);
app.use(`/api/v1`, order);
//handle errors with middlewares
app.use(errorMiddleware);

export default app;
