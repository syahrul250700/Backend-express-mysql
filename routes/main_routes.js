import express from "express";
import products from "../routes/products_routes.js";
import users from "../routes/users_routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ErrorMiddleware } from "../middlewares/errorMiddleware.js";
export const app = express();

app.route("/").get((req, res, next) => {
  res.status(200).json({
    status: true,
    code: res.statusCode,
    message: `Server is Run on port ${process.env.PORT}`,
  });
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/products", products);
app.use("/users", users);
app.use(ErrorMiddleware);
