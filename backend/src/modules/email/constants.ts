/**
 * Gmail expense search query builder.
 *
 * For the FIRST sync (no lastSyncedAt):  uses newer_than:90d to backfill history.
 * For SUBSEQUENT syncs (lastSyncedAt set): uses after:YYYY/MM/DD so only genuinely
 * new emails since the last run are fetched — this prevents the pagination trap
 * where 50+ existing emails fill the first page and new emails are never reached.
 */
export const GMAIL_EXPENSE_KEYWORDS =
    "subject:(purchase OR invoice OR receipt OR order OR payment OR booking OR bill OR " +
    "transaction OR bought OR expense OR subscription OR renewal OR " +
    "\"order confirmation\" OR \"payment confirmation\" OR " +
    "\"payment received\" OR \"amount paid\")";

export function buildGmailExpenseQuery(lastSyncedAt: Date | null): string {
    if (lastSyncedAt) {
        // Subtract 1 day buffer to avoid missing emails due to clock skew
        const since = new Date(lastSyncedAt.getTime() - 24 * 60 * 60 * 1000);
        const y = since.getUTCFullYear();
        const m = String(since.getUTCMonth() + 1).padStart(2, "0");
        const d = String(since.getUTCDate()).padStart(2, "0");
        return `${GMAIL_EXPENSE_KEYWORDS} after:${y}/${m}/${d}`;
    }
    // First-ever sync: backfill last 90 days
    return `${GMAIL_EXPENSE_KEYWORDS} newer_than:90d`;
}