import prisma from "../prisma";
import type { Member as PrismaMember } from '@/src/generated/prisma/client'
import type { MemberRepository } from "../interfaces";
import type { CreateMemberInput, Member, MemberWithHashedPassword } from "../zod";

export class PrismaMemberRepository implements MemberRepository {
    async create(data: CreateMemberInput): Promise<MemberWithHashedPassword> {
        const user = await prisma.member.create({
            data
        })
        return {
            ...this.toDomain(user),
            password: user.password
        }
    }
    async findByEmail(email: string): Promise<MemberWithHashedPassword | null> {
        const user = await prisma.member.findUnique({
            where: {
                email
            }
        })
        return user ? {
            ...this.toDomain(user),
            password: user.password
        } : null
    }
    async findById(id: string): Promise<Member | null> {
        const user = await prisma.member.findUnique({
            where: {
                id
            }
        })
        if (!user) {
            return null;
        }
        return this.toDomain(user)
    }
    private toDomain(member: PrismaMember): Member {
        return {
            id: member.id,
            name: member.name,
            email: member.email
        }
    }
}