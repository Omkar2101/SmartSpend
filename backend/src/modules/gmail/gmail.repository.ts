import prisma from "../../config/prisma";

export class GmailRepository {

  async upsertGmailConnection(data: {
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
        googleEmail: data.googleEmail,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiryDate: data.expiryDate,
      },

      create: data,
    });

  }

  async findByUserId(userId: string) {

    return prisma.gmailConnection.findUnique({
      where: {
        userId,
      },
    });

  }

  async updateTokens(
    id: string,
    data: {
      accessToken: string;
      refreshToken?: string;
      expiryDate?: Date;
    }
  ) {

    return prisma.gmailConnection.update({
      where: { id },
      data: {
        accessToken: data.accessToken,
        ...(data.refreshToken && { refreshToken: data.refreshToken }),
        ...(data.expiryDate && { expiryDate: data.expiryDate }),
      },
    });

  }

  async updateLastSyncedAt(id: string, syncedAt: Date) {

    return prisma.gmailConnection.update({
      where: { id },
      data: { lastSyncedAt: syncedAt },
    });

  }

}