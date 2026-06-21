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

  listEmails =
    async (
      req: Request,
      res: Response
    ) => {

      try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const emails =
          await this.emailService
            .listEmailsForUser(
              req.user!.clerkId,
              page,
              limit
            );

        res.status(200).json({
          success: true,
          data: emails,
        });

      } catch (error) {

        console.error(error);

        res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch emails",
        });

      }

    };

}