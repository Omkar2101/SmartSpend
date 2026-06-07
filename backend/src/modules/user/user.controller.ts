import { Request, Response } from "express";

import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  getMe = async (req: Request, res: Response) => {
    const user = await this.userService.findOrCreateUser({
      clerkId: req.user!.clerkId,
      email: req.user!.email,
    });

    res.json({
      success: true,
      data: user,
    });
  };
}
