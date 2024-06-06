import * as userService from "../services/userService.js";
import { verifyToken } from "../utils/service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new BadRequestError("You are unauthorized");
  }
  try {
    const decoded = verifyToken(token, process.env.SECRETKEY);
    const user = await userService.userFindOne({ id: decoded.userId });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rolename)) {
     throw new BadRequestError("You are unauthorized")
    }
    next();
  };
};
