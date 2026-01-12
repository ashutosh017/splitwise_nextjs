import { GroupNotFoundError, MemberAlreadyInGroupError, MemberNotFoundError, MemberNotInGroupError } from "../errors/errors";
import type { GroupRepository } from "../interfaces";
import type { CreateGroupInput, GroupSummary, Member } from "../zod";
import type { MemberService } from "./member.service";

export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly memberService: MemberService,
    ) {
    }
    async createGroup(input: CreateGroupInput): Promise<GroupSummary> {
        const group = await this.groupRepo.create(input);
        return group;
    }

    async findById(groupId: string): Promise<GroupSummary> {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new GroupNotFoundError();
        return group;
    }

    async assertMemberInGroup(groupId: string, memberId: string): Promise<void> {
        await this.ensureMemberAndGroupExist(groupId, memberId);
        const isMember = await this.groupRepo.hasMember(groupId, memberId)
        if (!isMember) throw new MemberNotInGroupError();
    }

    async ensureMemberAndGroupExist(groupId: string, memberId: string): Promise<void> {
        const [group, member] = await Promise.all(
            [
                this.groupRepo.findById(groupId),
                this.memberService.findById(memberId)
            ]
        )
        if (!group) throw new GroupNotFoundError();
        if (!member) throw new MemberNotFoundError();
    }

    async addMember(groupId: string, memberId: string): Promise<void> {
        await this.ensureMemberAndGroupExist(groupId, memberId);
        const existing = await this.groupRepo.hasMember(groupId, memberId);
        if (existing) throw new MemberAlreadyInGroupError();
        await this.groupRepo.addMember(groupId, memberId)
    }

    async removeMember(groupId: string, memberId: string): Promise<void> {
        await this.ensureMemberAndGroupExist(groupId, memberId);
        await this.groupRepo.removeMember(groupId, memberId);
        const existing = await this.groupRepo.hasMember(groupId, memberId);
        if (!existing) throw new MemberNotInGroupError();
        await this.groupRepo.removeMember(groupId, memberId);
    }

    async listGroups(): Promise<GroupSummary[]> {
        return await this.groupRepo.listGroups();
    }
    async getAllMembers(groupId: string): Promise<Member[]> {
        return this.groupRepo.listMembers(groupId);
    }
    async delete(groupId: string): Promise<void> {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new GroupNotFoundError()
        this.groupRepo.delete(groupId);
    }
    async listGroupsForMember(memberId: string): Promise<GroupSummary[]> {
        const member = await this.memberService.findById(memberId);
        if (!member) throw new MemberNotFoundError;
        const groups = await this.groupRepo.listGroupsForMember(memberId);
        return groups
    }


}