import { Router } from "express";
import { GmailController } from "./gmail.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

const gmailController = new GmailController();

// router.get("/connect", requireAuth, gmailController.connect);
router.get("/authorize", requireAuth, gmailController.initiateGmailAuthorization);

router.get("/oauth/callback", gmailController.handleGmailAuthorizationCallback);

export default router;
