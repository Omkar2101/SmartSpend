import prisma from "../../config/prisma";

export class NotificationRepository {
  async createNotification(
    userId: string,
    title: string,
    message: string
  ) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
  }
}
