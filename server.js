import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./config/database.js";

dotenv.config({ path: "./config/config.env" });
//connecting to database
connectDb();

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
