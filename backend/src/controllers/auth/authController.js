import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByEmail, findById, updateRefreshToken } from "../../models/userModel.js";
import { generateTokens } from "../../utils/generateTokens.js";
import { accessCookieOptions, refreshCookieOptions } from "../../utils/cookieOptions.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await findByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token in DB
  await updateRefreshToken(user.id, refreshToken);

  // Set HttpOnly Cookies
  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Login successful"
    )
  );
});

// 2. LOGOUT API
export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token in DB if user is logged in
  if (req.user?.id) {
    await updateRefreshToken(req.user.id, null);
  }

  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json(
    new ApiResponse(200, {}, "Logout successful")
  );
});

// 3. REFRESH ACCESS TOKEN API
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await findById(decoded.id);
  if (!user || user.refresh_token !== refreshToken) {
    throw new ApiError(401, "User not found or token revoked");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  // Update new refresh token in DB
  await updateRefreshToken(user.id, newRefreshToken);

  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

  return res.status(200).json(
    new ApiResponse(200, {}, "Access token refreshed successfully")
  );
});

// 4. GET CURRENT LOGGED-IN USER API
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      "Current user fetched successfully"
    )
  );
});