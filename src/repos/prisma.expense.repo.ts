import prisma from "../lib/prisma";
import type { Prisma, Expense as PrismaExpense } from '@/generated/prisma/client'
import type { ExpenseRepository } from "../interfaces";
import type { CreateExpenseRepoInput, ExpenseSummary, UpdateExpenseInput } from "../zod";

export class PrismaExpenseRepository implements ExpenseRepository {
    async create(input: CreateExpenseRepoInput, tx?: Prisma.TransactionClient): Promise<ExpenseSummary> {
        const client = tx ? tx : prisma;
        const expense = await client.expense.create({
            data: {
                amount: input.amount,
                splitType: input.splitType,
                description: input.description,
                whoPaid: {
                    connect: {
                        id: input.whoPaidId
                    }
                },
                group: {
                    connect: {
                        id: input.groupId
                    }
                }
            },
        })
        return this.toSummary(expense)
    }
    async findById(expenseId: string): Promise<ExpenseSummary | null> {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        })
        if (!expense) return null;
        return this.toSummary(expense);
    }
    async listByGroup(groupId: string): Promise<ExpenseSummary[]> {
        const expenses = await prisma.expense.findMany({
            where: {
                groupId
            }
        })
        return expenses.map((e) => this.toSummary(e))
    }
    async delete(expenseId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx ?? prisma;
        await client.expense.delete({
            where: {
                id: expenseId
            }
        })
    }
    async update(updateInput: UpdateExpenseInput, tx?: Prisma.TransactionClient): Promise<ExpenseSummary> {
        const client = tx ?? prisma;
        const expense = await client.expense.update({
            where: {
                id: updateInput.expenseId
            },
            data: updateInput
        })
        return this.toSummary(expense)
    }

    private toSummary(expense: PrismaExpense): ExpenseSummary {
        return {
            id: expense.id,
            whoPaidId: expense.whoPaidId,
            groupId: expense.groupId,
            amount: Number(expense.amount),
            description: expense.description,
            splitType: expense.splitType
        }
    }
}