import type { Prisma } from "@/generated/prisma/client";
import type { CreateManySplitInput, SplitSummary } from "../zod";

export interface SplitRepository {
    findByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<SplitSummary[]>
    createMany(input: CreateManySplitInput, tx?: Prisma.TransactionClient): Promise<void>,
    deleteByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<void>
}
