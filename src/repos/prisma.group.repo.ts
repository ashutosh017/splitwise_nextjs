import prisma from "../lib/prisma";
import type { Member as PrismaMember } from '@/generated/prisma/client'
import type { GroupRepository } from "../interfaces";
import type { CreateGroupInput, GroupSummary, Member } from "../zod";
import type { Group as PrismaGroup } from '@/generated/prisma/client'

export class PrismaGroupRepository implements GroupRepository {
    async create(groupInput: CreateGroupInput): Promise<GroupSummary> {
        const group = await prisma.group.create({
            data: groupInput
        })
        return this.toSummary(group);
    }
    private toSummary(group: PrismaGroup): GroupSummary {
        return {
            id: group.id,
            name: group.name,
            description: group.description ?? ""
        }
    }
    async findById(groupId: string): Promise<GroupSummary | null> {
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
    async listGroupsForMember(memberId: string): Promise<GroupSummary[]> {
        const groups = await prisma.groupMember.findMany({
            where: {
                memberId: {
                    not: memberId
                }
            }, include: {
                group: true
            }
        })
        return groups.map((g) => this.toSummary(g.group))
    }
    async delete(groupId: string): Promise<void> {
        await prisma.group.delete({
            where: {
                id: groupId
            }
        })
    }
}