import { Request, Response } from "express";

import { oauth2Client } from "../../config/google";

export class GmailController {
  connect = async (req: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    });

    res.redirect(url);
  };

  callback = async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Callback hit",
      code: req.query.code,
    });
  };
}
