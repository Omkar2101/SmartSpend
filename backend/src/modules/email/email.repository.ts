import { ProcessingStatus } from "@prisma/client";
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

  async findByUserId(
    userId: string,
    page = 1,
    limit = 50
  ) {

    return prisma.emailMessage.findMany({
      where: { userId },
      orderBy: { receivedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        gmailMessageId: true,
        subject: true,
        sender: true,
        snippet: true,
        receivedAt: true,
        processed: true,
        processingStatus: true,
        createdAt: true,
        userId: true,
      },
    });

  }

  async findByGmailMessageId(
    gmailMessageId: string
) {
    return prisma.emailMessage.findUnique({
        where: {
            gmailMessageId,
        },
    });
}

  async updateProcessingStatus(
    emailMessageId: string,
    status: ProcessingStatus
  ) {
    return prisma.emailMessage.update({
      where: {
        gmailMessageId: emailMessageId,
      },
      data: {
        processingStatus: status,
        processedAt: status === ProcessingStatus.PROCESSED ? new Date() : null,
      },
    });
  }

}