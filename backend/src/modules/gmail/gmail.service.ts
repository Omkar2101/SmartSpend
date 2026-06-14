import { google } from "googleapis";
import { oauth2Client } from "../../config/google";
import { GmailRepository } from "./gmail.repository";
import { UserRepository } from "../user/user.repository";

export class GmailService {
  private gmailRepository = new GmailRepository();

  private userRepository = new UserRepository();

  async saveGmailConnection(code: string, clerkId: string) {
    console.log("Authorization code:", code);
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);
    oauth2Client.setCredentials(tokens);

    const user = await this.userRepository.findByClerkId(clerkId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.gmailRepository.upsertGmailConnection({
      userId: user.id,
      googleEmail: user.email || "",
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || "",
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    });
  }
}
