'use server'
import { memberService } from "@/di/container";
import { ActionResponse, catchErrors } from "@/lib/action-wrapper";
import { Member, MemberWithHashedPassword } from "@/zod";

export const searchUsers = async (email: string): Promise<ActionResponse<Member[]>> => catchErrors(async () => memberService.findFromKeyword(email))