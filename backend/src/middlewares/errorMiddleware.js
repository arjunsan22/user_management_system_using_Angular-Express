import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;