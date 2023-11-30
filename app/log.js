import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = winston.createLogger({
  level: "info",
  fromat: winston.format.json(),
  transports: [
    new winston.transports.Console({}),

    new DailyRotateFile({
      filename: "logs/all/all-%DATE%.log",
      maxFiles: "14d",
      maxSize: "1m",
    }),
    new DailyRotateFile({
      level: "error",
      filename: "logs/error/error-%DATE%.log",
      maxFiles: "14d",
    }),
  ],
});
