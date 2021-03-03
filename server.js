import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./config/database.js";


//handle uncaught exceptions
process.on("uncaughtException", (err)=>{
  console.log("Shutdown server due to unhandled promise exception");
  process.exit();
})

dotenv.config({ path: "./config/config.env" });
//connecting to database
connectDb();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});


//handle unhandled promise rejection


process.on('unhandledRejection', err=>{
  console.log(`ERROR: ${err.message}`);
  console.log("Shutdown server due to unhandled promise rejection");

  server.close(()=>{
    process.exit();
  });
})
