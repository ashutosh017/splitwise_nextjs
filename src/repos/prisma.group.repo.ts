import prisma from "../lib/prisma";
import type { Prisma, Member as PrismaMember } from '@/generated/prisma/client'
import { DetailedGroupData, detailedGroupSelect, type GroupRepository } from "../interfaces";
import type { CreateGroupInput, CreateGroupWithMembersInput, GroupSummary, GroupWithMembers, Member } from "../zod";
import type { Group as PrismaGroup } from '@/generated/prisma/client'


export class PrismaGroupRepository implements GroupRepository {
    async create(groupInput: CreateGroupInput): Promise<GroupSummary> {
        const group = await prisma.group.create({
            data: groupInput
        })
        return this.toSummary(group);
    }
    async createGroupWithMembers(input: CreateGroupWithMembersInput): Promise<GroupSummary> {
        const group = await prisma.group.create({
            data: {
                name: input.name,
                description: input.description,
                members: {
                    create: input.memberIds.map((id) => ({
                        member: {
                            connect: {
                                id
                            }
                        }
                    }))
                }
            }
        })
        return this.toSummary(group)
    }
    private toSummary(group: PrismaGroup): GroupSummary {
        return {
            id: group.id,
            name: group.name,
            description: group.description ?? ""
        }
    }


    async getDetailedGroupData(groupId: string): Promise<DetailedGroupData | null> {
        if (!groupId) return null;

        return prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: detailedGroupSelect
        })
    }
    async findById(groupId: string): Promise<GroupSummary | null> {
        if (!groupId) return null;
        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            }
        })
        if (!group) return null;
        return this.toSummary(group);
    }
    async hasMember(groupId: string, memberId: string): Promise<boolean> {
        const member = await prisma.groupMember.findUnique({
            where: {
                groupId_memberId: {
                    groupId, memberId
                }
            }
        })
        return !!member
    }
    async addMembers(data: { groupId: string, memberId: string }[]): Promise<void> {
        await prisma.groupMember.createMany({ data })
    }
    async addMember(groupId: string, memberId: string): Promise<void> {
        await prisma.groupMember.create({
            data: {
                group: {
                    connect: {
                        id: groupId
                    }
                }
                , member: {
                    connect: {
                        id: memberId
                    }
                }
            }
        })
    }
    async removeMember(groupId: string, memberId: string): Promise<void> {
        await prisma.groupMember.delete({
            where: {
                groupId_memberId: {
                    groupId, memberId
                }
            }
        })
    }

    private toMember(member: PrismaMember): Member {
        return {
            id: member.id,
            email: member.email,
            name: member.name
        }
    }
    async listGroups(): Promise<GroupSummary[]> {
        const groups = await prisma.group.findMany();
        return groups.map((g) => this.toSummary(g))
    }
    async listMembers(groupId: string): Promise<Member[]> {
        const record = await prisma.groupMember.findMany({
            where: {
                groupId
            }, include: {
                member: true
            }
        })
        return record.map((r) => this.toMember(r.member))
    }
    async listGroupsForMember(memberId: string): Promise<GroupWithMembers[]> {
        const groups = await prisma.groupMember.findMany({
            where: {
                memberId
            }, select: {
                group: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        members: {
                            select: {
                                id: true,
                            }
                        }
                    }
                }
            }
        })
        return groups.map((g) => ({
            ...g.group,
            description: g.group.description ?? ""
        }))
    }
    async delete(groupId: string): Promise<void> {
        await prisma.group.delete({
            where: {
                id: groupId
            }
        })
    }
}