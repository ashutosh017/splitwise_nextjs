import { Prisma } from "@/generated/prisma/client";
import type { CreateGroupInput, CreateGroupWithMembersInput, GroupSummary, GroupWithMembers, Member } from "../zod";

export interface GroupRepository {
    create(data: CreateGroupInput): Promise<GroupSummary>
    updateGroupDetails({ id, name, description }: { id: string, name: string, description: string }): Promise<void>
    createGroupWithMembers(input: CreateGroupWithMembersInput): Promise<GroupSummary>
    findById(groupId: string): Promise<GroupSummary | null>
    getDetailedGroupData(groupId: string): Promise<any | null>
    hasMember(groupId: string, memberId: string): Promise<boolean>
    addMember(groupId: string, memberId: string): Promise<void>
    addMembers(data: { groupId: string, memberId: string }[]): Promise<void>
    removeMember(groupId: string, memberId: string): Promise<void>
    listGroups(): Promise<GroupSummary[]>
    listMembers(groupId: string): Promise<Member[]>
    listGroupsForMember(memberId: string): Promise<GroupWithMembers[]>
    delete(groupId: string): Promise<void>
}

export const detailedGroupSelect = {
    id: true,
    name: true,
    description: true,
    balances: {
        select: {
            id: true,
            amount: true,
            from: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            },
            to: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            },
            updatedAt: true,
            dateCreated: true
        }
    },
    expenses: {
        select: {
            id: true,
            amount: true,
            description: true,
            whoPaid: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            },
            splitType: true,
            splits: {
                select: {
                    value: true,
                    member: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    dateCreated: true,
                    updatedAt: true
                }
            },
            dateCreated: true,
            updatedAt: true
        },
        orderBy: { dateCreated: 'desc' },
        take: 25
    },
    members: {// GroupMmeber[] -> junction table 
        select: {
            member: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            }
        }
    },
    dateCreated: true,
    updatedAt: true,
    _count: {
        select: {
            members: true,
            balances: true,
            expenses: true
        }
    }
} satisfies Prisma.GroupSelect
export type DetailedGroupData = Prisma.GroupGetPayload<{ select: typeof detailedGroupSelect }>