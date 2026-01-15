import prisma from "../lib/prisma";
import type { Member as PrismaMember } from '@/generated/prisma/client'
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
    async findManyByEmail(emails: string[]): Promise<Member[]> {
        return prisma.member.findMany({
            where: {
                email: {
                    in: emails
                }
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    }
    async findById(id: string): Promise<Member | null> {
        if (!id) return null;
        const user = await prisma.member.findUnique({
            where: {
                id: id
            }
        })
        if (!user) {
            return null;
        }
        return this.toDomain(user)
    }
    async findFromKeyword(keyword: string): Promise<Member[]> {
        return prisma.member.findMany({
            where: {
                OR: [{
                    name: {
                        contains: keyword
                    }
                },
                {
                    email: {
                        contains: keyword
                    }
                }
                ]
            }
        })
    }
    private toDomain(member: PrismaMember): Member {
        return {
            id: member.id,
            name: member.name,
            email: member.email
        }
    }
}