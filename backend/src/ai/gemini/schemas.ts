import { z } from "zod";

export const ExpenseSchema =
    z.object({

        vendor:
            z.string().nullable().optional(),

        amount:
            z.number(),

        currency:
            z.string().nullable().optional(),

        category:
            z.string().nullable().optional(),

        expenseDate:
            z.string().nullable().optional(),

        confidence:
            z.number().nullable().optional(),

    });

export type ExpenseExtraction =
    z.infer<
        typeof ExpenseSchema
    >;