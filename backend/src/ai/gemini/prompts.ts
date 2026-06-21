export const buildExpensePrompt = (
    email: {
        subject?: string;
        sender?: string;
        snippet?: string;
    }
) => `
You are an expense extraction engine.

Extract expense information from the email.

Return ONLY valid JSON.

Do not return markdown.
Do not return explanations.
Do not wrap in code blocks.

Schema:

{
    "vendor": string,
    "amount": number,
    "currency": string,
    "category": string,
    "expenseDate": string,
    "confidence": number
}

Email Subject:
${email.subject}

Sender:
${email.sender}

Snippet:
${email.snippet}
`;