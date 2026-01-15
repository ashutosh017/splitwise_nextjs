import jwt from 'jsonwebtoken'

import type { MemberService } from "./member.service";
import { PasswordsDoesNotMatchError, UnauthorizedError } from "../errors/errors";
import bcrypt from 'bcrypt'
import type { CreateMemberInput, SigninData, SignupData, TokenInput, TokenSummary } from "../zod";
import type { TokenInput as Token } from "../zod";
import { env } from '@/lib/env';

export class AuthService {
    private SALT_ROUNDS = 10;
    constructor(private memberService: MemberService) { }
    async signup(data: SignupData): Promise<void> {
        if (data.password !== data.confirmPassword) throw new PasswordsDoesNotMatchError()
        const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)
        const createInput: CreateMemberInput = {
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
        await this.memberService.create(createInput);
    }

    async signin(data: SigninData): Promise<Token> {
        const user = await this.memberService.findByEmail(data.email);
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, env.JWT_SECRET, {
            expiresIn: '7d'
        })
        return {
            token,
        }
    }
    async verifyToken(data: TokenInput): Promise<TokenSummary> {
        try {
            const decoded = jwt.verify(data.token, env.JWT_SECRET);
            if (typeof decoded === 'string') {
                return JSON.parse(decoded) as TokenSummary;
            }
            return decoded as TokenSummary;
        } catch (error) {
            throw new UnauthorizedError("Error verifying token")
        }
    }
}




