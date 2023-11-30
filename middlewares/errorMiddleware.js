import { ErrorResponse } from "../app/error.js";
import { logger } from "../app/log.js";
export const ErrorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ErrorResponse) {
    if (err.status) {
      res
        .status(err.status)
        .json({
          code: err.status,
          status: false,
          message: err.message,
        })
        .end();
      logger.info({
        code: err.status,
        message: err.message,
      });
    } else {
      res
        .status(400)
        .json({
          code: 400,
          status: false,
          message: err.message,
        })
        .end();
      logger.error({
        code: 400,
        message: err.message,
      });
    }
  } else {
    res
      .status(500)
      .json({
        code: 500,
        status: false,
        message: err.message,
      })
      .end();
    logger.error({
      code: 500,
      message: err.message,
    });
  }
};
