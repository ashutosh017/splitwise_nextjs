import type { Prisma } from "@/generated/prisma/client";
import type { CreateExpenseRepoInput, ExpenseSummary, UpdateExpenseInput } from "../zod";

export interface ExpenseRepository {
    create(input: CreateExpenseRepoInput, tx?: Prisma.TransactionClient): Promise<ExpenseSummary>
    findById(expenseId: string): Promise<ExpenseSummary | null>,
    listByGroup(groupId: string): Promise<ExpenseSummary[]>
    delete(expenseId: string, tx?: Prisma.TransactionClient): Promise<void>
    update(input: UpdateExpenseInput, tx?: Prisma.TransactionClient): Promise<ExpenseSummary>
}
