import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { NotificationController } from "./notification.controller";

const router = Router();
const notificationController = new NotificationController();

// GET /notifications — List notifications for authenticated user
router.get("/", requireAuth, notificationController.getNotifications);

// GET /notifications/unread-count — Get total unread count
router.get("/unread-count", requireAuth, notificationController.getUnreadCount);

// PATCH /notifications/:id/read — Mark single notification as read
router.patch("/:id/read", requireAuth, notificationController.markAsRead);
router.put("/:id/read", requireAuth, notificationController.markAsRead);

// POST /notifications/mark-all-read — Mark all notifications as read
router.post("/mark-all-read", requireAuth, notificationController.markAllAsRead);

export default router;
