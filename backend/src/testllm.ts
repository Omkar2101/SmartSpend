import 'dotenv/config';
import { extractExpense } from "./ai/gemini/expense-extractor";

const getLLMResult = async () => {
    const result = await extractExpense({
    subject:
        "Amazon Order Confirmation",

    sender:
        "shipment-tracking@amazon.in",

    snippet:
        "Your order has been placed. Total Amount ₹2499."
});

console.log(result);
}

getLLMResult();