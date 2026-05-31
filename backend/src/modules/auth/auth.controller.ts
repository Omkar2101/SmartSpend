import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";

const service = new AuthService();

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.authService.getUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  });
}
