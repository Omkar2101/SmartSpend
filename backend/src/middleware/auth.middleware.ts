import { Request, Response, NextFunction } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};