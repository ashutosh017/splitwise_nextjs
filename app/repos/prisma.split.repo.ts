import type { Prisma } from "@/src/generated/prisma/client";
import type { TransactionClient } from "@/src/generated/prisma/internal/prismaNamespace";
import prisma from "../prisma";
import type { Split as PrismaSplit } from '@/src/generated/prisma/client'
import type { CreateManySplitInput, SplitSummary } from "../zod";
import type { SplitRepository } from "../interfaces";

export class PrismaSplitRepository implements SplitRepository {
    async createMany(input: CreateManySplitInput, tx?: TransactionClient): Promise<void> {
        const client = tx ? tx : prisma;
        await client.split.createMany({
            data: Array.from(input.normalizedSplits.entries()).map(([memberId, amount]) => (
                {
                    expenseId: input.expenseId,
                    memberId,
                    value: amount
                }
            ))
        })
    }
    async findByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<SplitSummary[]> {
        const client = tx ?? prisma;
        const splits = await client.split.findMany({
            where: {
                expenseId
            }
        })
        return splits.map((s) => this.toSummary(s))
    }
    async deleteByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx ?? prisma;
        await client.split.deleteMany({
            where: {
                expenseId
            }
        })
    }
    private toSummary(split: PrismaSplit): SplitSummary {
        return {
            value: Number(split.value),
            memberId: split.memberId

        }
    }

}