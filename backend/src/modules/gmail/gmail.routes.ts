import { Router } from "express";
import { GmailController } from "./gmail.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

const gmailController = new GmailController();

// router.get("/connect", requireAuth, gmailController.connect);
// router.get("/connect", requireAuth, gmailController.initiateGmailAuthorization);
// router.get("/connect", gmailController.initiateGmailAuthorization);
router.get("/callback", gmailController.handleGmailAuthorizationCallback);
router.get(
    "/authorization-url",
    requireAuth,
    gmailController.generateAuthorizationUrl
);

export default router;
