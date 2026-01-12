'use server'
import { env } from "../../lib/env"
import { authService } from "../../di/container"
import { SigninData, SignupData, TokenInput, TokenSummary } from "../../zod"
import { ActionResponse, catchErrors } from "@/lib/action-wrapper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function verifyToken(input: TokenInput): Promise<ActionResponse<TokenSummary>> {
    return catchErrors(async () => authService.verifyToken(input))
}

export async function Signin(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    return catchErrors(async () => {
        const response = await authService.signin({ email, password });
        const cookieStore = await cookies();
        cookieStore.set('token', response.token)
        return response.token
    });
}

export async function Signup(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    return catchErrors(async () => {
        return authService.signup({ name, email, password, confirmPassword })
    })
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect('/');
}

export async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')
    if (!token) return false;
    const verify = await verifyToken({ token: token.value })
    return !!verify
}