
import type { Prisma, Balance as PrismaBalance } from '@/generated/prisma/client'
import type { BalanceRepository } from "../interfaces";
import type { BalanceSummary, CreateBalanceInput } from "../zod";
import prisma from '../lib/prisma';

export class PrismaBalanceRepository implements BalanceRepository {
    async upsert(input: CreateBalanceInput, tx?: Prisma.TransactionClient): Promise<BalanceSummary> {
        const client = tx ?? prisma;
        const balance = await client.balance.upsert({
            where: {
                groupId_fromMemberId_toMemberId: {
                    groupId: input.groupId,
                    fromMemberId: input.fromMemberId,
                    toMemberId: input.toMemberId
                }
            },
            create: {
                amount: input.amount,
                fromMemberId: input.fromMemberId,
                toMemberId: input.toMemberId,
                groupId: input.groupId,
            },
            update: {
                amount: {
                    increment: input.amount
                }
            }
        })
        return this.toSummary(balance);
    }
    async getAllBalancesOfAUserInAGroup(userId: string, groupId: string): Promise<BalanceSummary[]> {
        const balances = await prisma.balance.findMany({
            where: {
                OR: [
                    {
                        fromMemberId: userId
                    },
                    {
                        toMemberId: userId
                    }
                ]
                ,
                groupId
            }
        })
        return balances.map((b) => this.toSummary(b))
    }
    async find(groupId: string, fromMemberId: string, toMemberId: string): Promise<BalanceSummary | null> {
        const balance = await prisma.balance.findUnique({
            where: {
                groupId_fromMemberId_toMemberId: {
                    groupId, fromMemberId, toMemberId
                }
            }
        })
        if (!balance) return null;
        return this.toSummary(balance);
    }
    async decrement(groupId: string, fromMemberId: string, toMemberId: string, amount: number): Promise<BalanceSummary> {
        const balance = await prisma.balance.update({
            where: {
                groupId_fromMemberId_toMemberId: {
                    groupId, fromMemberId, toMemberId
                }
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })
        return this.toSummary(balance);
    }
    async increment(groupId: string, fromMemberId: string, toMemberId: string, amount: number): Promise<BalanceSummary> {
        const balance = await prisma.balance.update({
            where: {
                groupId_fromMemberId_toMemberId: {
                    groupId, fromMemberId, toMemberId
                }
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        })
        return this.toSummary(balance);
    }
    async delete(groupId: string, fromMemberId: string, toMemberId: string): Promise<void> {
        await prisma.balance.delete({
            where: {
                groupId_fromMemberId_toMemberId: {
                    groupId, fromMemberId, toMemberId
                }
            },

        })
    }
    async listByGroup(groupId: string): Promise<BalanceSummary[]> {
        const balances = await prisma.balance.findMany({
            where: {
                groupId
            }
        })
        return balances.map((b) => this.toSummary(b))
    }
    private toSummary(balance: PrismaBalance): BalanceSummary {
        return {
            amount: Number(balance.amount),
            fromMemberId: balance.fromMemberId,
            toMemberId: balance.toMemberId,
            groupId: balance.groupId,
        }
    }
} 