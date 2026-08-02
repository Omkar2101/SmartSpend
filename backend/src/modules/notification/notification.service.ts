import { NotificationRepository } from "./notification.repository";
import { UserRepository } from "../user/user.repository";

export class NotificationService {
  private notificationRepository = new NotificationRepository();
   private userRepository = new UserRepository();

  // Add your service methods here

  async getNotifications(clerkId: string) {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.notificationRepository.findByUserId(user.id);
  }

  //get unread count
  async getUnreadCount(clerkId: string) {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.notificationRepository.getUnreadCount(user.id);
  }

  //mark as read
  async markAsRead(notificationId: string, clerkId: string) {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.notificationRepository.markAsRead(notificationId);
  }

  //mark all as read
  async markAllAsRead(clerkId: string) {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.notificationRepository.markAllAsRead(user.id);
  }
}
