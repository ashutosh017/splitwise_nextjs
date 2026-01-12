import { AppError } from "@/errors/app_error";

export type ActionResponse<T> =
    | { success: true; data: T; error: null }
    | { success: false; data: null; error: string };

export async function catchErrors<T>(
    action: () => Promise<T>
): Promise<ActionResponse<T>> {
    try {
        const data = await action();
        return { success: true, data, error: null };
    } catch (error: any) {
        console.error("Action Error:", error);

        const message = error instanceof AppError ? error.message : "An unexpected error occurred";
        return { success: false, data: null, error: message };
    }
}