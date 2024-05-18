import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/error.js";

export const verifyUser = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return next(new ErrorHandler("Invalid Token", 400));
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user = {
      userId: userInfo.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
