import { BalanceNotFoundError, GroupNotFoundError, InsufficientBalanceError, InvalidAmountError } from "../errors/errors";
import type { Prisma } from "@/generated/prisma/client";
import type { BalanceRepository } from "../interfaces";
import prisma from "../lib/prisma";
import type { BalanceSummary, CreateBalanceInput, ExpenseSummary, GroupSummary, SplitSummary } from "../zod";
import type { GroupService } from "./group.service";

export class BalanceService {
    constructor(
        private readonly balanceRepo: BalanceRepository,
        private readonly groupService: GroupService
    ) {
    }
    async getNetBalancesOfAllUsersInAGroup(groupId: string): Promise<Record<string, number>> {
        const members = await this.groupService.getAllMembers(groupId);
        const netBalanceMap: Record<string, number> = {}
        await Promise.all(members.map(async (m) => {
            const toatalBalance = await this.getTotalBalanceOfAUserInAGroup(m.id, groupId)
            netBalanceMap[m.id] = toatalBalance
        }))
        return netBalanceMap
    }
    async getCompleteBalanceDistribution(userId: string): Promise<Record<string, number>> {
        const groups = await this.groupService.listGroupsForMember(userId);
        const balanceMap: Record<string, number> = {}
        await Promise.all(
            groups.map(async (group) => {
                const totalBalance = await this.getTotalBalanceOfAUserInAGroup(userId, group.id);
                balanceMap[group.id] = totalBalance
            })
        );
        return balanceMap;
    }
    async getTotalBalanceOfAUserInAGroup(userId: string, groupId: string): Promise<number> {
        const balances = await this.balanceRepo.getAllBalancesOfAUserInAGroup(userId, groupId);
        let totalBalance = 0;
        balances.forEach(b => {
            if (b.fromMemberId !== userId) {
                totalBalance -= b.amount
            }
            else {
                totalBalance += b.amount
            }

        });
        return totalBalance;
    }
    async createOrUpdate(input: CreateBalanceInput): Promise<BalanceSummary> {
        if (input.amount < 0) throw new InvalidAmountError();
        const balance = await this.balanceRepo.upsert(input);
        return balance;
    }
    async find(groupId: string, fromMemberId: string, toMemberId: string): Promise<BalanceSummary> {
        const balance = await this.balanceRepo.find(groupId, fromMemberId, toMemberId)
        if (!balance) throw new BalanceNotFoundError()
        return balance;
    }
    async listByGroup(groupId: string): Promise<BalanceSummary[]> {
        const group = await this.groupService.findById(groupId);
        if (!group) throw new GroupNotFoundError();
        const balances = await this.balanceRepo.listByGroup(groupId);
        return balances;
    }
    async delete(groupId: string, fromMemberId: string, toMemberId: string): Promise<void> {
        await this.find(groupId, fromMemberId, toMemberId);
        await this.balanceRepo.delete(groupId, fromMemberId, toMemberId);
    }
    async decrement(groupId: string, fromMemberId: string, toMemberId: string, amount: number): Promise<BalanceSummary> {
        if (amount <= 0) throw new InvalidAmountError();
        const balance = await this.find(groupId, fromMemberId, toMemberId);
        if (balance.amount < amount) throw new InsufficientBalanceError();
        return this.balanceRepo.decrement(groupId, fromMemberId, toMemberId, amount);
    }
    async increment(groupId: string, fromMemberId: string, toMemberId: string, amount: number): Promise<BalanceSummary> {
        return this.createOrUpdate({
            groupId, fromMemberId, toMemberId, amount
        });
    }
    async applyExpense(expense: ExpenseSummary, normalizedSplits: Map<string, number>, tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx ?? prisma;
        for (const [memberId, amount] of normalizedSplits.entries()) {
            if (memberId === expense.whoPaidId) continue;
            if (amount <= 0) continue;
            await this.balanceRepo.upsert({
                groupId: expense.groupId,
                amount,
                fromMemberId: expense.whoPaidId,
                toMemberId: memberId
            }, client)
        }
    }
    async reverseExpense(expense: ExpenseSummary, splits: SplitSummary[], tx?: Prisma.TransactionClient): Promise<void> {
        const client = tx ?? prisma;
        for (const split of splits) {
            if (split.memberId === expense.whoPaidId) continue;
            await this.balanceRepo.decrement(expense.groupId, split.memberId, expense.whoPaidId, split.value, client)
        }
    }

}