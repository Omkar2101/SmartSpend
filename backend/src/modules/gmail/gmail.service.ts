import { google } from "googleapis";
import { oauth2Client } from "../../config/google";
import { GmailRepository } from "./gmail.repository";
import { UserRepository } from "../user/user.repository";

export class GmailService {
  private gmailRepository = new GmailRepository();

  private userRepository = new UserRepository();

  async saveGmailConnection(code: string, clerkId: string) {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const profile = await oauth2.userinfo.get();

    const user = await this.userRepository.findByClerkId(clerkId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.gmailRepository.upsertConnection({
      userId: user.id,
      googleEmail: profile.data.email || "",
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || "",
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    });
  }
}
