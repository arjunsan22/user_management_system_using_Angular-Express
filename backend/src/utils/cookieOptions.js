
const isProduction = process.env.NODE_ENV === "production";

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 15 * 60 * 1000, 
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 2 * 24 * 60 * 60 * 1000, 
};