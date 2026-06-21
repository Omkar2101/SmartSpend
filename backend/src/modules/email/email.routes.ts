import { Router } from "express";

import { requireAuth }
from "../../middleware/auth.middleware";

import { EmailController }
from "./email.controller";

const router = Router();

const emailController =
    new EmailController();

// GET /emails — list synced emails for the current user
router.get(
    "/",
    requireAuth,
    emailController.listEmails
);

// POST /emails/sync — pull latest emails from Gmail
router.post(
    "/sync",
    requireAuth,
    emailController.synchronizeRecentEmails
);

export default router;