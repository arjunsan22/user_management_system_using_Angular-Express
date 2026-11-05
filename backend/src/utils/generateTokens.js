
import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "2d" }
  );

  return { accessToken, refreshToken };
};