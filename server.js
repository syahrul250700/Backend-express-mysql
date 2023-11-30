import http from "http";
import { app } from "./routes/main_routes.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4321;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server Berhasil jalan di port ${PORT}`);
});
