import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

export class NotificationController {
  private notificationService = new NotificationService();

  // Get all notifications for logged-in user
  getNotifications = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const notifications = await this.notificationService.getNotifications(clerkId);
      res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  };

  // Get total unread notifications count
  getUnreadCount = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const count = await this.notificationService.getUnreadCount(clerkId);
      res.json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch unread count",
      });
    }
  };

  // Mark single notification as read
  markAsRead = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const notificationId = req.params.id as string;
      const result = await this.notificationService.markAsRead(notificationId, clerkId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
      });
    }
  };

  // Mark all notifications as read
  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const clerkId = req.user!.clerkId;
      const result = await this.notificationService.markAllAsRead(clerkId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to mark all notifications as read",
      });
    }
  };
}
