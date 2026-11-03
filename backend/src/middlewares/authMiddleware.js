import jwt from "jsonwebtoken";
import { findById } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = asyncHandler(async (req, res, next) => {
  
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Please login first");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Access token expired. Please login again.");
  }

  const user = await findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Safety: password object-il ninnu kalayunnu
  delete user.password;
  req.user = user;

  next();
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Access denied: Admins only");
  }
  next();
};