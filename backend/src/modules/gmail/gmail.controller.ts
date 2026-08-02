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

        // res.status(200).json({
        //   success: true,
        //   data: gmailConnection,
        // });
        res.redirect(
    "http://localhost:5173/dashboard?gmail=connected"
);

      } catch (error) {

        console.error(error);

        res.status(500).json({
          success: false,
          message:
            "Failed to connect Gmail account",
        });

      }
    };
  
  generateAuthorizationUrl = async (
    req: Request,
    res: Response
) => {

    try {

        const authorizationUrl =
            this.gmailService.generateAuthorizationUrl(
                req.user!.clerkId
            );

        res.status(200).json({
            success: true,
            data: {
                authorizationUrl,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to generate Gmail authorization URL",
        });

    }

  };

  getConnection = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const connection = await this.gmailService.getConnection(clerkId);
      res.json({
        success: true,
        data: connection,
      });
    } catch (error) {
      console.error("Error getting Gmail connection:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get Gmail connection status",
      });
    }
  };

  disconnect = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      await this.gmailService.disconnect(clerkId);
      res.json({
        success: true,
        message: "Gmail disconnected successfully",
      });
    } catch (error: any) {
      console.error("Error disconnecting Gmail:", error);
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to disconnect Gmail",
      });
    }
  };
}