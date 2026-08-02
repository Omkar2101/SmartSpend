import prisma from "../../config/prisma";

export class InvoiceRepository {

    async createInvoice(
        data: {
            userId: string;
            emailMessageId?: string;

            vendor: string;

            amount: number;

            currency: string;

            category: string;

            expenseDate?: string;

            confidence?: number;
        }
    ) {

        return prisma.invoice.create({

            data: {

                userId:
                    data.userId,

                emailMessageId:
                    data.emailMessageId || null,

                vendor:
                    data.vendor,

                totalAmount:
                    data.amount,

                currency:
                    data.currency,

                category:
                    data.category,

                confidence:
                    data.confidence || 1.0,

                invoiceDate:
                    data.expenseDate
                        ? new Date(
                              data.expenseDate
                          )
                        : null,
            },
        });

    }

    async findMany(
        userId: string,
        filters: {
            category?: string;
            vendor?: string;
            startDate?: string;
            endDate?: string;
            currency?: string;
        } = {},
        pagination: {
            page?: number;
            limit?: number;
        } = {}
    ) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 50;

        const whereClause: any = { userId };

        if (filters.category) {
            whereClause.category = filters.category;
        }

        if (filters.vendor) {
            whereClause.vendor = {
                contains: filters.vendor,
                mode: "insensitive",
            };
        }

        if (filters.currency) {
            whereClause.currency = filters.currency;
        }

        if (filters.startDate || filters.endDate) {
            whereClause.OR = [
                {
                    invoiceDate: {
                        ...(filters.startDate && { gte: new Date(filters.startDate) }),
                        ...(filters.endDate && { lte: new Date(filters.endDate) }),
                    },
                },
                {
                    invoiceDate: null,
                    createdAt: {
                        ...(filters.startDate && { gte: new Date(filters.startDate) }),
                        ...(filters.endDate && { lte: new Date(filters.endDate) }),
                    },
                },
            ];
        }

        return prisma.invoice.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findById(id: string, userId: string) {
        return prisma.invoice.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async update(
        id: string,
        userId: string,
        data: {
            vendor?: string;
            invoiceNumber?: string;
            invoiceDate?: string;
            totalAmount?: number;
            currency?: string;
            category?: string;
            rawText?: string;
        }
    ) {
        return prisma.invoice.updateMany({
            where: {
                id,
                userId,
            },
            data: {
                ...(data.vendor && { vendor: data.vendor }),
                ...(data.invoiceNumber !== undefined && { invoiceNumber: data.invoiceNumber }),
                ...(data.invoiceDate && { invoiceDate: new Date(data.invoiceDate) }),
                ...(data.totalAmount !== undefined && { totalAmount: data.totalAmount }),
                ...(data.currency && { currency: data.currency }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.rawText !== undefined && { rawText: data.rawText }),
            },
        }).then(async () => {
            return this.findById(id, userId);
        });
    }

    async delete(id: string, userId: string) {
        return prisma.invoice.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }

    async getStats(userId: string) {
        // Calculate total expenses
        const totalAggregate = await prisma.invoice.aggregate({
            where: { userId },
            _sum: { totalAmount: true },
        });

        // Calculate current month's expenses
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const monthlyAggregate = await prisma.invoice.aggregate({
            where: {
                userId,
                OR: [
                    {
                        invoiceDate: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    {
                        invoiceDate: null,
                        createdAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                ],
            },
            _sum: { totalAmount: true },
        });

        // Group by category
        const categoryGroups = await prisma.invoice.groupBy({
            by: ["category"],
            where: { userId },
            _sum: { totalAmount: true },
        });

        const categoriesBreakdown: Record<string, number> = {};
        categoryGroups.forEach((group) => {
            if (group.category) {
                categoriesBreakdown[group.category] = group._sum.totalAmount || 0;
            } else {
                categoriesBreakdown["Uncategorized"] =
                    (categoriesBreakdown["Uncategorized"] || 0) + (group._sum.totalAmount || 0);
            }
        });

        // Group by vendor for top 5
        const vendorGroups = await prisma.invoice.groupBy({
            by: ["vendor"],
            where: { userId },
            _sum: { totalAmount: true },
            orderBy: {
                _sum: {
                    totalAmount: "desc",
                },
            },
            take: 5,
        });

        const topVendors = vendorGroups.map((group) => ({
            vendor: group.vendor,
            amount: group._sum.totalAmount || 0,
        }));

        return {
            totalExpenses: totalAggregate._sum.totalAmount || 0,
            monthlyExpenses: monthlyAggregate._sum.totalAmount || 0,
            categoriesBreakdown,
            topVendors,
        };
    }
}