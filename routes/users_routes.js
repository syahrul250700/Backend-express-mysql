import express from "express";
import {
  LoginUser,
  GetAllUsers,
  AddNewUsers,
  UpdateUsers,
  DeleteUsers,
  registrasiUsers,
  LogoutUsers,
} from "../controllers/users_controller.js";
import { authentication } from "../middlewares/authMiddleware.js";
const users = express.Router();

users.get("/", authentication, GetAllUsers);
users.post("/", authentication, AddNewUsers);
users.put("/:id", authentication, UpdateUsers);
users.delete("/:id", authentication, DeleteUsers);
users.post("/login", LoginUser);
users.post("/logout", LogoutUsers);
users.post("/registrasi", registrasiUsers);

export default users;
