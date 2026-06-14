import { Request, Response } from "express";
import { GmailService } from "./gmail.service";
import { oauth2Client } from "../../config/google";


export class GmailController {
  private gmailService =
    new GmailService();

  initiateGmailAuthorization =
    async (
      req: Request,
      res: Response
    ) => {

      const authorizationUrl =
        oauth2Client.generateAuthUrl({
          access_type: "offline",

          scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/userinfo.email",
          ],

          // state: req.user!.clerkId,
          state: "user_3Ekp3aYjvN8d8HHZ0JybrQEXBie",

        });

      res.redirect(
        authorizationUrl
      );
    };

  handleGmailAuthorizationCallback =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const authorizationCode =
          req.query.code as string;

        const clerkUserId =
          req.query.state as string;

        const gmailConnection =
          await this.gmailService
            .saveGmailConnection(
              authorizationCode,
              clerkUserId
            );

        res.status(200).json({
          success: true,
          data: gmailConnection,
        });

      } catch (error) {

        console.error(error);

        res.status(500).json({
          success: false,
          message:
            "Failed to connect Gmail account",
        });

      }
    };
}