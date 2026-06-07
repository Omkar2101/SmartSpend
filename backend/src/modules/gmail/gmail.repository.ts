import prisma from "../../config/prisma";

export class GmailRepository {
  async upsertConnection(data: {
    userId: string;
    googleEmail: string;
    accessToken: string;
    refreshToken: string;
    expiryDate?: Date;
  }) {
    return prisma.gmailConnection.upsert({
      where: {
        userId: data.userId,
      },

      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiryDate: data.expiryDate,
        googleEmail: data.googleEmail,
      },

      create: data,
    });
  }
}
