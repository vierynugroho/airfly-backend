import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { MulterError } from "multer";

export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isDevelopment = NODE_ENV === "development" ? true : false;

  if (isDevelopment) {
    console.log("\x1b[31m%s\x1b[0m", "=============== ERROR ==============");
    console.log(Date());
    console.log("\x1b[31m%s\x1b[0m", "====================================");
    console.log("\x1b[33m%s\x1b[0m", "Name:");
    console.log(`${err.name || "something error"}`);
    console.log("\x1b[33m%s\x1b[0m", "Message:");
    console.log(`${err.message}`);
    console.log("\x1b[33m%s\x1b[0m", "Details:");
    console.log(err.stack || err);
    console.log("\x1b[31m%s\x1b[0m", "====================================");
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: {
          statusCode: 409,
          message: "Duplicate field, constraint violation",
        },
      });
    } else if (err.code === "P2003") {
      return res.status(409).json({
        error: {
          statusCode: 409,
          message: "Key Constraint",
          details: err.message,
        },
      });
    } else if (err.code === "P2005") {
      return res.status(409).json({
        error: {
          statusCode: 409,
          message: "Resource not found",
          details: err.message,
        },
      });
    } else {
      return res.status(500).json({
        error: {
          statusCode: 500,
          message: "something went wrong",
          details: err.message,
        },
      });
    }
  } else if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        message: `${err.message}, please re-login`,
        details: err.message,
      },
    });
  } else if (err instanceof jwt.NotBeforeError) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        message: "token not active, please re-login",
        details: err.message,
      },
    });
  } else if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      error: {
        statusCode: 401,
        message: "token is expired, please re-login",
        details: err.message,
      },
    });
  } else if (err instanceof MulterError) {
    return res.status(400).json({
      error: {
        statusCode: 400,
        title: `${err.code}: ${err.name}`,
        message: `${err.name} - ${err.message}`,
        fields: err.field,
      },
    });
  } else if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      error: {
        statusCode: err.statusCode,
        message: err.message,
      },
    });
  } else {
    return res.status(500).json({
      error: {
        statusCode: 500,
        message: "something went wrong",
        details: err.message,
        sentry: res.sentry + "\n",
      },
    });
  }
  next();
};
