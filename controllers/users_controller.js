import { responseSuccess } from "../helpers/formatResponse.js";
import UsersModel from "../models/users_model.js";

export const LoginUser = async (req, res, next) => {
  try {
    const { access_token, refresh_token, expires_at } = await UsersModel.login(
      req.body
    );
    res.cookie("access_token", access_token, { httpOnly: true });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 86400000, //24jam
    });
    res.cookie("expires_at", expires_at, { httpOnly: true });
    res.status(200).json({
      status: true,
      code: res.statusCode,
      message: `Berhasil Login User`,
    });
  } catch (error) {
    next(error);
  }
};
export const LogoutUsers = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("expires_at");
    res.status(200).json({
      status: true,
      code: res.statusCode,
      message: `Berhasil Logout User`,
    });
  } catch (error) {
    next(error);
  }
};
export const registrasiUsers = async (req, res, next) => {
  try {
    const users = await UsersModel.register(req.body);
    responseSuccess(res, users, " Berhasil Registrasi");
  } catch (error) {
    next(error);
  }
};
export const GetAllUsers = async (req, res, next) => {
  try {
    const data = await UsersModel.getAllUsers();
    responseSuccess(res, data, "GET ALL USER SUCCESS");
  } catch (error) {
    next(error);
  }
};
export const AddNewUsers = async (req, res, next) => {
  try {
    const data = await UsersModel.creatNewUsers(req.body, req.user);
    responseSuccess(res, data, "ADD NEW USERS SUCCESS");
  } catch (error) {
    next(error);
  }
};
export const UpdateUsers = async (req, res, next) => {
  try {
    const data = await UsersModel.updateUsers(
      req.body,
      req.params.id,
      req.user
    );
    responseSuccess(res, data, "UPDATE USER SUCCESS");
  } catch (error) {
    next(error);
  }
};
export const DeleteUsers = async (req, res, next) => {
  try {
    const data = await UsersModel.removeUsers(req.params.id);
    responseSuccess(res, data, "DELETE USER SUCCESS");
  } catch (error) {
    next(error);
  }
};
