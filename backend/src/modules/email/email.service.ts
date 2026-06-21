import { google } from "googleapis";

import { EmailRepository } from "./email.repository";
import { GmailRepository } from "../gmail/gmail.repository";
import { UserRepository } from "../user/user.repository";

import { buildGmailExpenseQuery } from "./constants";

export class EmailService {

    private emailRepository =
        new EmailRepository();

    private gmailRepository =
        new GmailRepository();

    private userRepository =
        new UserRepository();

    async synchronizeRecentEmails(
        clerkId: string
    ) {

        /**
         * Step 1: Find SmartSpend user
         */
        const user =
            await this.userRepository
                .findByClerkId(clerkId);

        if (!user) {
            throw new Error("User not found");
        }

        /**
         * Step 2: Find Gmail connection
         */
        const gmailConnection =
            await this.gmailRepository
                .findByUserId(user.id);

        if (!gmailConnection) {
            throw new Error("Gmail account not connected");
        }

        /**
         * Step 3: Build isolated OAuth2 client
         */
        if (!gmailConnection.refreshToken) {
            throw new Error(
                "No refresh token stored. Please reconnect your Gmail account."
            );
        }

        const userOAuthClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        userOAuthClient.setCredentials({
            access_token: gmailConnection.accessToken,
            refresh_token: gmailConnection.refreshToken,
            expiry_date: gmailConnection.expiryDate
                ? gmailConnection.expiryDate.getTime()
                : undefined,
        });

        /**
         * Persist auto-refreshed tokens back to DB
         */
        userOAuthClient.on("tokens", async (newTokens) => {
            console.log("Access token refreshed — persisting to DB");
            await this.gmailRepository.updateTokens(
                gmailConnection.id,
                {
                    accessToken: newTokens.access_token ?? gmailConnection.accessToken,
                    ...(newTokens.refresh_token && {
                        refreshToken: newTokens.refresh_token,
                    }),
                    ...(newTokens.expiry_date && {
                        expiryDate: new Date(newTokens.expiry_date),
                    }),
                }
            );
        });

        /**
         * Step 4: Create Gmail client
         */
        const gmail = google.gmail({
            version: "v1",
            auth: userOAuthClient,
        });

        /**
         * Step 5: Build incremental query.
         *
         * BUG FIX: Previously used a static 'newer_than:90d' query with
         * maxResults:50 and NO pagination.  If the inbox had 50+ matching
         * emails, the Gmail API would only return the first page and the
         * code would discard the nextPageToken, so genuinely new emails
         * landing beyond page 1 were silently dropped.
         *
         * Fix A — Incremental query: use 'after:YYYY/MM/DD' based on
         *   lastSyncedAt so each subsequent sync only asks Gmail for emails
         *   that arrived AFTER the previous run.  New emails are always on
         *   page 1 of a narrow time window → they can never be buried.
         *
         * Fix B — Full pagination: follow nextPageToken until exhausted so
         *   no emails are ever skipped, regardless of inbox size.
         */
        const query = buildGmailExpenseQuery(gmailConnection.lastSyncedAt);
        console.log(`Searching Gmail with query: ${query}`);

        const syncStartedAt = new Date();

        // Paginate through ALL results using nextPageToken
        const allMessages: { id?: string | null }[] = [];
        let pageToken: string | undefined = undefined;
        const MAX_EMAILS = 500; // safety cap

        while (allMessages.length < MAX_EMAILS) {
            const listResponse: any = await gmail.users.messages.list({
                userId: "me",
                q: query,
                maxResults: 100, // max allowed per page
                ...(pageToken ? { pageToken } : {}),
            });

            const pageMessages = listResponse.data.messages || [];
            allMessages.push(...pageMessages);

            pageToken = listResponse.data.nextPageToken ?? undefined;

            console.log(
                `Fetched page: ${pageMessages.length} messages ` +
                `(total so far: ${allMessages.length}, nextPageToken: ${!!pageToken})`
            );

            if (!pageToken) {
                break;
            }
        }

        console.log(`Total expense emails from Gmail: ${allMessages.length}`);

        /**
         * No emails found
         */
        if (allMessages.length === 0) {
            // Still update lastSyncedAt so next incremental query advances
            await this.gmailRepository.updateLastSyncedAt(gmailConnection.id, syncStartedAt);
            return {
                fetched: 0,
                inserted: 0,
                skipped: 0,
                message: "No new expense-related emails since last sync",
            };
        }

        /**
         * Step 6: Fetch full details for each message ID
         */
        const emailRecords = await Promise.all(
            allMessages.map(async (message) => {

                const messageResponse =
                    await gmail.users.messages.get({
                        userId: "me",
                        id: message.id!,
                        format: "metadata",
                        metadataHeaders: ["Subject", "From", "Date"],
                    });

                const data = messageResponse.data;
                const headers = data.payload?.headers || [];

                const subject = headers.find(h => h.name === "Subject")?.value ?? undefined;
                const sender  = headers.find(h => h.name === "From")?.value ?? undefined;

                return {
                    gmailMessageId: data.id!,
                    subject,
                    sender,
                    snippet: data.snippet ?? undefined,
                    receivedAt: data.internalDate
                        ? new Date(Number(data.internalDate))
                        : undefined,
                    rawPayload: data,
                    userId: user.id,
                };
            })
        );

        /**
         * Step 7: Save emails (skip already-saved ones)
         */
        const result = await this.emailRepository.saveEmails(emailRecords);

        console.log(`Fetched: ${allMessages.length}, Inserted: ${result.count}`);

        /**
         * Step 8: Advance the lastSyncedAt watermark so the next sync
         * only queries emails newer than right now.
         */
        await this.gmailRepository.updateLastSyncedAt(gmailConnection.id, syncStartedAt);

        return {
            fetched: allMessages.length,
            inserted: result.count,
            skipped: allMessages.length - result.count,
        };

    }


    async listEmailsForUser(
        clerkId: string,
        page: number,
        limit: number
    ) {

        const user =
            await this.userRepository
                .findByClerkId(clerkId);

        if (!user) {
            throw new Error("User not found");
        }

        return this.emailRepository
            .findByUserId(user.id, page, limit);

    }

}