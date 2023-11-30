import * as db from "../app/database.js";
import { validate } from "../app/validate.js";
import { ErrorResponse } from "../app/error.js";
import { addProductValidation } from "../validation/products_validation.js";
import { error } from "winston";

const listProduct = async () => {
  try {
    let sql = "SELECT * FROM products";
    const [result] = await db.local.promise().query(sql);
    if (result.length == 0) {
      throw new ErrorResponse(404, "Data produk tidak ada");
    }
    return result;
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};

const createProduct = async (req, user) => {
  const input = validate(addProductValidation, req);
  let date;
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    ("00" + (date.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getUTCDate()).slice(-2) +
    " " +
    ("00" + (date.getUTCHours() + 7)).slice(-2) +
    ":" +
    ("00" + date.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + date.getUTCSeconds()).slice(-2);
  console.log(date);
  try {
    const [products] = await db.local
      .promise()
      .query("SELECT * FROM products WHERE name_product = ? ", [
        input.name_product,
      ]);
    if (products.length > 0) {
      throw new ErrorResponse(400, " Data Produk sudah ada");
    } else {
      let data = {
        name_product: input.name_product,
        content: input.content,
        amount: input.amount,
        created_at: date,
        update_at: date,
        created_by: user.username,
        update_by: user.username,
      };
      const [addProduct] = await db.local
        .promise()
        .query("INSERT INTO products SET ?", [data]);
      return addProduct;
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};

const updateProduct = async (input, id, user, date) => {
  try {
    const [products] = await db.local
      .promise()
      .query("SELECT * FROM products WHERE id_product= ?", [id]);
    if (products.length > 0) {
      const [editProduct] = await db.local
        .promise()
        .query(
          "UPDATE products SET name_product=?, content=?, amount=?, update_at=?, update_by=? WHERE id_product=?",
          [
            input.name_product,
            input.content,
            input.amount,
            date.update_at,
            user.username,
            id,
          ]
        );
      return editProduct;
    } else {
      throw new ErrorResponse(400, "Data produk tidak ditemukan");
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};

const deleteProduct = async (id) => {
  try {
    const [products] = await db.local
      .promise()
      .query("SELECT * FROM products WHERE id_product= ?", [id]);
    if (products.length > 0) {
      const [DelProducts] = await db.local
        .promise()
        .query("DELETE from products WHERE id_products=?", [id]);
      return DelProducts;
    } else {
      throw new ErrorResponse(400, "Data tidak ditemukan");
    }
  } catch (error) {}
  throw new ErrorResponse(error.status, error);
};
export default { listProduct, createProduct, updateProduct, deleteProduct };
