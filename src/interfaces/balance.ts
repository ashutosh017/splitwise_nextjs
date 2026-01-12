import type { Prisma } from "@/generated/prisma/client"
import type { BalanceSummary, CreateBalanceInput } from "../zod"

export interface BalanceRepository {
    find(
        groupId: string,
        fromMemberId: string,
        toMemberId: string
    ): Promise<BalanceSummary | null>
    upsert(input: CreateBalanceInput, tx?: Prisma.TransactionClient): Promise<BalanceSummary>
    increment(
        groupId: string,
        fromMemberId: string,
        toMemberId: string,
        amount: number
    ): Promise<BalanceSummary>
    decrement(
        groupId: string,
        fromMemberId: string,
        toMemberId: string,
        amount: number,
        tx?: Prisma.TransactionClient
    ): Promise<BalanceSummary>
    delete(
        groupId: string,
        fromMemberId: string,
        toMemberId: string
    ): Promise<void>
    listByGroup(groupId: string): Promise<BalanceSummary[]>
}

