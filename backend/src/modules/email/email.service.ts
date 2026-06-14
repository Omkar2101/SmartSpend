import { google } from "googleapis";

import { oauth2Client } from "../../config/google";

import { EmailRepository } from "./email.repository";
import { GmailRepository } from "../gmail/gmail.repository";
import { UserRepository } from "../user/user.repository";

export class EmailService {

  private emailRepository =
    new EmailRepository();

  private gmailRepository =
    new GmailRepository();

  private userRepository =
    new UserRepository();

  async synchronizeRecentEmails(
    clerkId: string
  ) {

    /**
     * Step 1:
     * Find SmartSpend user
     */
    const user =
      await this.userRepository
        .findByClerkId(clerkId);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    /**
     * Step 2:
     * Find Gmail connection
     */
    const gmailConnection =
      await this.gmailRepository
        .findByUserId(user.id);

    if (!gmailConnection) {
      throw new Error(
        "Gmail account not connected"
      );
    }

    /**
     * Step 3:
     * Configure OAuth client
     */
    oauth2Client.setCredentials({
      access_token:
        gmailConnection.accessToken,

      refresh_token:
        gmailConnection.refreshToken,
    });

    /**
     * Step 4:
     * Create Gmail client
     */
    const gmail =
      google.gmail({
        version: "v1",
        auth: oauth2Client,
      });

    /**
     * Step 5:
     * Fetch recent message IDs
     */
    const listResponse =
      await gmail.users.messages.list({
        userId: "me",
        maxResults: 20,
      });

    const messages =
      listResponse.data.messages || [];

    /**
     * No emails found
     */
    if (messages.length === 0) {

      return {
        synced: 0,
        message:
          "No emails found",
      };

    }

    /**
     * Step 6:
     * Fetch message details
     */
    const emailRecords =
      await Promise.all(

        messages.map(
          async (message) => {

            const messageResponse =
              await gmail.users.messages.get({
                userId: "me",
                id: message.id!,
              });

            const data =
              messageResponse.data;

            const headers =
              data.payload?.headers || [];

            const subject =
              headers.find(
                h =>
                  h.name === "Subject"
              )?.value ?? undefined;

            const sender =
              headers.find(
                h =>
                  h.name === "From"
              )?.value ?? undefined;

            return {

              gmailMessageId:
                data.id!,

              subject,

              sender,

              snippet:
                data.snippet ?? undefined,

              receivedAt:
                data.internalDate
                  ? new Date(
                    Number(
                      data.internalDate
                    )
                  )
                  : undefined,

              rawPayload:
                data,

              userId:
                user.id,
            };

          }
        )

      );

    /**
     * Step 7:
     * Save emails
     */
    const result =
      await this.emailRepository
        .saveEmails(
          emailRecords
        );

    /**
     * Step 8:
     * Return summary
     */
    return {

      fetched:
        messages.length,

      inserted:
        result.count,

      skipped:
        messages.length -
        result.count,

    };

  }

}