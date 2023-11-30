import { responseSuccess } from "../helpers/formatResponse.js";
import products_models from "../models/products_model.js";

export const getProduct = async (req, res, next) => {
  try {
    const products = await products_models.listProduct(req.body);
    responseSuccess(res, products, "Berhasil Menampilkan data produk");
  } catch (error) {
    next(error);
  }
};
export const addProduct = async (req, res, next) => {
  try {
    const products = await products_models.createProduct(req.body, req.user);
    responseSuccess(res, products, "Berhasil Tambah Produk");
  } catch (error) {
    next(error);
  }
};
export const editProduct = async (req, res, next) => {
  try {
    const users = await products_models.updateProduct(
      req.body,
      req.params.id,
      req.user,
      req.date
    );
    responseSuccess(res, users, "Berhasil Update Product");
  } catch (error) {
    next(error);
  }
};
export const removeProduct = async (req, res, next) => {
  try {
    const data = await products_models.deleteProduct(req.params.id);
    responseSuccess(res, data, "Berhasil menghapus data produk");
  } catch (error) {
    next(error);
  }
};
