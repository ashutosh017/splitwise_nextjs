import { GroupNotFoundError, MemberAlreadyInGroupError, MemberNotFoundError, MemberNotInGroupError } from "../errors/errors";
import type { GroupRepository } from "../interfaces";
import type { CreateGroupInput, CreateGroupWithMembersInput, GroupSummary, GroupWithMembers, Member } from "../zod";
import type { MemberService } from "./member.service";

export class GroupService {
    constructor(
        private readonly groupRepo: GroupRepository,
        private readonly memberService: MemberService,
    ) {
    }
    async getGroupDetails(groupId: string): Promise<any | null> {
        return this.groupRepo.getDetailedGroupData(groupId)

    }
    async createGroup(input: CreateGroupInput): Promise<GroupSummary> {
        const group = await this.groupRepo.create(input);
        return group;
    }
    async createGroupWithMembers(input: CreateGroupWithMembersInput): Promise<GroupSummary> {
        const groups = await this.groupRepo.createGroupWithMembers(input)
        return groups
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
    async addMembers(data: { groupId: string, memberId: string }[]): Promise<void> {
        await this.groupRepo.addMembers(data);
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
    async getAllMembers(groupId: string): Promise<Member[]> {
        return this.groupRepo.listMembers(groupId);
    }
    async delete(groupId: string): Promise<void> {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new GroupNotFoundError()
        this.groupRepo.delete(groupId);
    }
    async listGroupsForMember(memberId: string): Promise<GroupWithMembers[]> {
        const member = await this.memberService.findById(memberId);
        console.log("control1", member)
        if (!member) throw new MemberNotFoundError;
        console.log("control2")
        const groups = await this.groupRepo.listGroupsForMember(memberId);
        console.log("control3", groups)
        return groups
    }


}