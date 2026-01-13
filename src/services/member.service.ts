import { MemberAlreadyExistsError, MemberNotFoundError } from "../errors/errors";
import type { MemberRepository } from "../interfaces";
import type { CreateMemberInput, Member, MemberWithHashedPassword } from "../zod";

export class MemberService {
    constructor(
        private readonly memberRepo: MemberRepository
    ) { }
    async create(input: CreateMemberInput): Promise<MemberWithHashedPassword> {
        const member = await this.assertMember(input.email)
        if (member) throw new MemberAlreadyExistsError();
        return this.memberRepo.create(input)
    }
    async findById(memberId: string): Promise<Member> {
        const member = await this.memberRepo.findById(memberId);
        if (!member) throw new MemberNotFoundError();
        return member;
    }
    async findManyByEmail(emails: string[]): Promise<Member[]> {
        return this.memberRepo.findManyByEmail(emails)
    }
    async findByEmail(email: string): Promise<MemberWithHashedPassword> {
        const member = await this.memberRepo.findByEmail(email);
        if (!member) throw new MemberNotFoundError();
        return member;
    }
    async assertMember(email: string): Promise<boolean> {
        const user = await this.memberRepo.findByEmail(email);
        return !!user;
    }
    async findFromKeyword(keyword: string): Promise<Member[] | null> {
        return this.memberRepo.findFromKeyword(keyword);
    }

}