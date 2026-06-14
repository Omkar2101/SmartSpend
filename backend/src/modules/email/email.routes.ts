import { Router } from "express";

import { requireAuth }
from "../../middleware/auth.middleware";

import { EmailController }
from "./email.controller";

const router = Router();

const emailController =
    new EmailController();

router.post(
    "/sync",
    requireAuth,
    emailController.synchronizeRecentEmails
);

export default router;