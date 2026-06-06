import {
  Request,
  Response,
  NextFunction,
} from "express";
import { verifyToken } from "@clerk/backend";
import { clerkClient } from "../config/clerk";

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
        message: "Authorization header missing",
      });
    }

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    /**
     * Verify token with Clerk
     */
    const payload =
      await verifyToken(
        token,
        {
          secretKey: process.env.CLERK_SECRET_KEY,
        }
      );
    console.log("Token payload:", payload);
    /**
     * payload.sub
     * = Clerk User ID
     */
    const clerkId = payload.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    /**
     * Fetch Clerk user
     */
    const clerkUser =
      await clerkClient.users.getUser(
        clerkId
      );

    req.user = {
      clerkId,
      email:
        clerkUser.emailAddresses[0]
          ?.emailAddress || "",
    };
    console.log("Authenticated user:", req.user);

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });

  }
};

