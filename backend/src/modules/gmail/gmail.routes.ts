import { Router } from "express";
import { GmailController } from "./gmail.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

const gmailController = new GmailController();

router.get("/connect", requireAuth, gmailController.connect);

router.get("/callback", gmailController.callback);

export default router;
