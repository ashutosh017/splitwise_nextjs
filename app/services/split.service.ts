import { SplitsNotFoundError } from "../errors/errors";
import type { Prisma } from "@/src/generated/prisma/client";
import type { SplitRepository } from "../interfaces";
import type { CreateManySplitInput, SplitSummary } from "../zod";

export class SplitService {
    constructor(
        private readonly splitRepo: SplitRepository
    ) { }
    async findByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<SplitSummary[]> {
        return this.splitRepo.findByExpenseId(expenseId, tx);
    }
    async deleteByExpenseId(expenseId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const splits = await this.findByExpenseId(expenseId);
        if (!splits) throw new SplitsNotFoundError();
        await this.deleteByExpenseId(expenseId, tx);
    }
    async createMany(input: CreateManySplitInput, tx?: Prisma.TransactionClient): Promise<void> {
        await this.createMany(input, tx);
    }

}