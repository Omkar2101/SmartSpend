import { Router } from "express";
import { GmailController } from "./gmail.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();
const gmailController = new GmailController();

router.get("/callback", gmailController.handleGmailAuthorizationCallback);

router.get(
    "/authorization-url",
    requireAuth,
    gmailController.generateAuthorizationUrl
);

router.get(
    "/connection",
    requireAuth,
    gmailController.getConnection
);

router.post(
    "/disconnect",
    requireAuth,
    gmailController.disconnect
);

export default router;
