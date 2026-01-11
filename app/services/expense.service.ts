import { DuplicateMembersInSplitsArrayError, EmptySplitsArrayError, ExpenseNotFoundError, InvalidAmountError, InvalidSplitValueError, PercentageSplitNotEqualTo100Error, SplitAmountMismatchError } from "../errors/errors";
import type { ExpenseRepository } from "../interfaces";
import prisma from "../prisma";
import type { CreateExpenseInput, ExpenseSummary, SplitSummary, SplitType, UpdateExpenseInput } from "../zod";
import type { BalanceService } from "./balance.service";
import type { GroupService } from "./group.service";
import type { SplitService } from "./split.service";

export class ExpenseService {
    constructor(
        private readonly expenseRepo: ExpenseRepository,
        private readonly splitService: SplitService,
        private readonly groupService: GroupService,
        private readonly balanceService: BalanceService,

    ) { }
    async create(input: CreateExpenseInput): Promise<ExpenseSummary> {
        await this.validateExpense(input)
        const map = this.normalizeSplits(input.splitType, input.amount, input.splits);
        return prisma.$transaction(async (tx) => {
            const expense = await this.expenseRepo.create({
                amount: input.amount,
                description: input.description,
                whoPaidId: input.whoPaidId,
                groupId: input.groupId, splitType: input.splitType,
            }, tx)
            await this.splitService.createMany(
                {
                    expenseId: expense.id,
                    normalizedSplits: map,
                },
                tx
            );
            await this.balanceService.applyExpense(
                expense,
                map, tx
            );

            return expense;
        })
    }


    private normalizeSplits(
        type: SplitType,
        total: number,
        splits: SplitSummary[]
    ): Map<string, number> {

        const result = new Map<string, number>();
        switch (type) {
            case "EQUAL": {
                const perHead = total / splits.length;
                for (const s of splits) {
                    result.set(s.memberId, perHead);
                }
                break;
            }

            case "AMOUNT": {
                let sum = 0;
                for (const s of splits) {
                    if (s.value == null) throw new InvalidSplitValueError();
                    sum += s.value;
                    result.set(s.memberId, s.value);
                }
                if (sum !== total) throw new SplitAmountMismatchError();
                break;
            }

            case "PERCENTAGE": {
                let percentSum = 0;
                for (const s of splits) {
                    if (s.value == null) throw new InvalidSplitValueError();
                    percentSum += s.value;
                    result.set(s.memberId, (total * s.value) / 100);
                }
                if (percentSum !== 100) throw new PercentageSplitNotEqualTo100Error();
                break;
            }

            case "SHARE": {
                const totalShares = splits.reduce(
                    (acc, s) => acc + (s.value ?? 0),
                    0
                );
                if (totalShares === 0) throw new InvalidSplitValueError();

                for (const s of splits) {
                    if (s.value == null) throw new InvalidSplitValueError();
                    result.set(
                        s.memberId,
                        (total * s.value) / totalShares
                    );
                }
                break;
            }
        }

        return result;
    }

    private async validateExpense(input: CreateExpenseInput): Promise<void> {
        const { amount, whoPaidId, groupId } = input
        if (amount <= 0) throw new InvalidAmountError();
        if (input.splits.length === 0) throw new EmptySplitsArrayError()
        if (this.hasDuplicates(input.splits)) throw new DuplicateMembersInSplitsArrayError()
        await this.groupService.ensureMemberAndGroupExist(groupId, whoPaidId);
        for (const split of input.splits) {
            await this.groupService.assertMemberInGroup(groupId, split.memberId);
        }

    }
    private hasDuplicates<T>(arr: T[]): boolean {
        const map = new Map<T, number>()
        arr.forEach((item) => {
            const count = map.get(item) ?? 0;
            map.set(item, count + 1);
        })
        return Array.from(map.values()).some(count => count > 1);
    }
    async listByGroup(groupId: string): Promise<ExpenseSummary[]> {
        const expenses = await this.expenseRepo.listByGroup(groupId);
        return expenses;
    }
    async findById(expenseId: string): Promise<ExpenseSummary> {
        const expense = await this.expenseRepo.findById(expenseId)
        if (!expense) throw new ExpenseNotFoundError();
        return expense
    }
    async delete(expenseId: string): Promise<void> {
        const expense = await this.findById(expenseId);
        return prisma.$transaction(async (tx) => {
            const splits = await this.splitService.findByExpenseId(expenseId, tx);
            await this.balanceService.reverseExpense(expense, splits, tx)
            await this.splitService.deleteByExpenseId(expenseId, tx);
            await this.expenseRepo.delete(expenseId, tx)
        })
    }

    async update(updateInput: UpdateExpenseInput): Promise<ExpenseSummary> {
        const expenseId = updateInput.expenseId;
        const oldExpense = await this.findById(expenseId);
        const splits = await this.splitService.findByExpenseId(expenseId)
        await this.validateExpense({
            ...oldExpense,
            splits
        })
        const normalizedSplits = this.normalizeSplits(oldExpense.splitType, updateInput.amount!, splits)
        return prisma.$transaction(async (tx) => {
            await this.balanceService.reverseExpense(oldExpense, splits, tx);
            await this.splitService.deleteByExpenseId(expenseId, tx)
            const updatedExpense = await this.expenseRepo.update(updateInput, tx);
            await this.splitService.createMany(
                {
                    expenseId,
                    normalizedSplits
                },
                tx
            );

            await this.balanceService.applyExpense(
                updatedExpense,
                normalizedSplits,
                tx
            );
            return updatedExpense;
        })


    }

}