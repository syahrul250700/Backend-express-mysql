import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as db from "../app/database.js";
import { validate } from "../app/validate.js";
import { ErrorResponse } from "../app/error.js";
import {
  addUserValidation,
  loginUserValidation,
} from "../validation/users_validation.js";

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: "1m",
  });
};
const createRefreshToken = (username) => {
  return jwt.sign({ username: username }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};
const verify_token = async (access_token) => {
  try {
    const user = await jwt.verify(
      access_token,
      process.env.SECRET_KEY,
      (err, decoded) => {
        if (err) {
          let message = "";
          if (err.name == "JsonWebTokenError") {
            message = "sesi tidak valid";
          } else if (err.name == "TokenExpiredError") {
            message = "Sesi anda berakhir, silahkan login kembali";
          }
          throw new ErrorResponse(401, message);
        } else {
          return decoded;
        }
      }
    );
    return user;
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
const refresh_token = async (refreshToken) => {
  if (refreshToken) {
    try {
      const token = await verify_token(refreshToken);
      // console.log(token)
      const [users] = await db.local
        .promise()
        .query("SELECT * FROM users WHERE username = ?", [token.username]);
      if (users.length > 0) {
        const access_token = createAccessToken(users[0]);
        const user = await verify_token(access_token);
        const expires_at = user.exp * 1000;
        const refresh_token = createRefreshToken(users[0].username);
        return { access_token, refresh_token, expires_at };
      } else {
        throw new ErrorResponse(400, "User tidak ditemukan");
      }
    } catch (error) {
      throw new ErrorResponse(error.status, error);
    }
  } else {
    throw new ErrorResponse(401, "Gagal refresh token, Silahkan login kembali");
  }
};
const login = async (req) => {
  const input = validate(loginUserValidation, req);
  // console.log(input);
  try {
    const [users] = await db.local
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [input.username]);
    // console.log(users);
    if (users.length > 0) {
      //jika data user sudah ada
      var passwordIsValid = bcrypt.compareSync(
        input.password,
        users[0].password
      );
      if (!passwordIsValid) {
        throw new ErrorResponse(401, " Password Salah");
      } else {
        const access_token = createAccessToken(users[0]);
        const user = await verify_token(access_token);
        const expires_at = user.exp * 1000;
        const refresh_token = createRefreshToken(users[0].username);
        return { access_token, refresh_token, expires_at };
      }
    } else {
      throw new ErrorResponse(401, "User tidak ditemukan");
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
const register = async (req) => {
  const input = validate(addUserValidation, req);
  let hashedPassword = bcrypt.hashSync(input.password, 8);
  try {
    const [users] = await db.local
      .promise()
      .query("SELECT * FROM users WHERE username = ? ", [input.username]);
    if (users.length > 0) {
      throw new ErrorResponse(400, "User sudah ada");
    } else {
      let data = {
        username: input.username,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        created_by: input.username,
      };
      const [addUser] = await db.local
        .promise()
        .query("INSERT INTO users SET ?", [data]);
      return addUser;
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
const getAllUsers = async () => {
  try {
    const SQLQuery = "SELECT * FROM users";
    const [data] = await db.local.promise().query(SQLQuery);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const creatNewUsers = async (req, user) => {
  const input = validate(addUserValidation, req);
  let hashedPassword = bcrypt.hashSync(input.password, 8);
  try {
    const [users] = await db.local
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [input.username]);
    if (users.length > 0) {
      throw new ErrorResponse(400, " Data Users sudah ada");
    } else {
      let data = {
        username: input.username,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        created_by: user.username,
      };
      const [newUser] = await db.local
        .promise()
        .query("INSERT INTO users SET ? ", [data]);
      return newUser;
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
const updateUsers = async (input, id, user) => {
  try {
    const [users] = await db.local
      .promise()
      .query("SELECT * FROM users WHERE id_user = ?", [id]);
    if (users.length > 0) {
      const [editUser] = await db.local
        .promise()
        .query(
          "UPDATE users SET username=? , name=? , email=? , created_by=? WHERE id_user=?",
          [input.username, input.name, input.email, user.username, id]
        );
      return editUser;
    } else {
      throw new ErrorResponse(400, "Data User tidak ditemukan");
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
const removeUsers = async (id) => {
  try {
    const [users] = await db.local
      .promise()
      .query("SELECT * FROM users WHERE id_user = ?", [id]);
    if (users.length > 0) {
      const [delUser] = await db.local
        .promise()
        .query("DELETE FROM users WHERE  id_user = ?", [id]);
      return delUser;
    } else {
      throw new ErrorResponse(400, "Data user tidak ditemukan");
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};
export default {
  createAccessToken,
  createRefreshToken,
  verify_token,
  refresh_token,
  login,
  register,
  getAllUsers,
  creatNewUsers,
  updateUsers,
  removeUsers,
};
