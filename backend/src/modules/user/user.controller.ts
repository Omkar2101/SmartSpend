import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {

  private userService =
    new UserService();

  syncUser = async (
    req: Request,
    res: Response
  ) => {

    const user =
      await this.userService.syncUser(
        req.body
      );

    res.status(200).json({
      success: true,
      data: user,
    });
  };
}