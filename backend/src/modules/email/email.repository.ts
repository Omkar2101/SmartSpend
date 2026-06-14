import prisma from "../../config/prisma";

export class EmailRepository {

  async saveEmails(
    emails: {
      gmailMessageId: string;
      subject?: string;
      sender?: string;
      snippet?: string;
      receivedAt?: Date;
      rawPayload?: any;
      userId: string;
    }[]
  ) {

    return prisma.emailMessage.createMany({
      data: emails,
      skipDuplicates: true,
    });

  }

}