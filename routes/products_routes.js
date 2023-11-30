import express from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import {
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/products_controller.js";
const products = express.Router();

products.get("/", authentication, getProduct);
products.post("/", authentication, addProduct);
products.put("/:id", authentication, editProduct);
products.delete("/:id", authentication, removeProduct);

export default products;
