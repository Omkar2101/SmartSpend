import { z } from "zod";

export const ExpenseSchema =
    z.object({

        vendor:
            z.string(),

        amount:
            z.number(),

        currency:
            z.string(),

        category:
            z.string(),

        expenseDate:
            z.string(),

        confidence:
            z.number(),

    });

export type ExpenseExtraction =
    z.infer<
        typeof ExpenseSchema
    >;