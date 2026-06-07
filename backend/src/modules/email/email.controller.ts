import { Request, Response } from "express";
import { EmailService } from "./email.service";

export class EmailController {
  private emailService = new EmailService();

  // Add your controller methods here
}
