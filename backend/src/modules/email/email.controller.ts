import {
  Request,
  Response,
} from "express";

import { EmailService }
  from "./email.service";

export class EmailController {

  private emailService =
    new EmailService();

  synchronizeRecentEmails =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const result =
          await this.emailService
            .synchronizeRecentEmails(
              req.user!.clerkId
            );

        res.status(200).json({
          success: true,
          data: result,
        });

      } catch (error) {

        console.error(error);

        res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Email synchronization failed",
        });

      }

    };

}