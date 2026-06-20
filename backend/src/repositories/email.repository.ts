import { ProcessingStatus } from "@prisma/client";
import prisma from "../config/prisma";

async function updateProcessingStatus(
  emailMessageId: string,
  status: ProcessingStatus,
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

export const emailRepository = {
  updateProcessingStatus,
};
