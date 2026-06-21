import prisma from "../../config/prisma";

export class InvoiceRepository {

    async createInvoice(
        data: {
            userId: string;
            emailMessageId: string;

            vendor: string;

            amount: number;

            currency: string;

            category: string;

            expenseDate?: string;

            confidence: number;
        }
    ) {

        return prisma.invoice.create({

            data: {

                userId:
                    data.userId,

                emailMessageId:
                    data.emailMessageId,

                vendor:
                    data.vendor,

                totalAmount:
                    data.amount,

                currency:
                    data.currency,

                category:
                    data.category,

                confidence:
                    data.confidence,

                invoiceDate:
                    data.expenseDate
                        ? new Date(
                              data.expenseDate
                          )
                        : null,
            },
        });

    }

}