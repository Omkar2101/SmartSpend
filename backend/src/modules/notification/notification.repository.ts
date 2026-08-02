import prisma from "../../config/prisma";

export class NotificationRepository {
  async createNotification(userId: string, title: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
  }

  // find notifications by user id
  async findByUserId(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
      },
    });
  }

  //get unread count
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  //mark as read
  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  //mark all as read
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
