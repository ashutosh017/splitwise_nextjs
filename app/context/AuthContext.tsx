'use client'

import { cookies } from "next/headers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { env } from "../env";
import { ApiResponse } from "../config";

interface AuthContextType {
    user: User | null,
    isLoading: boolean

}
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false
})

interface User {
    id: string,
    email: string
}

export default function AuthContextProvider({ children }: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        setIsLoading(true);
        const checkAuth = async () => {
            const cookieStore = await cookies();
            const token = cookieStore.get('token')?.value;

            if (!token) return null;

            try {
                const response = await fetch(`${env.BACKEND_URL}/api/v1/verify`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Cookie': `token=${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const result = await response.json() as ApiResponse<User>;
                if (result.data) setUser(result.data);

            } catch (error) {
                console.error("Auth check failed:", error);
                return null;
            }
            setIsLoading(false);

        };
        checkAuth();


    }, [])
    return <AuthContext.Provider value={{
        user, isLoading: loading
    }}>
        {children}
    </AuthContext.Provider>

}

export const useAuth = () => useContext(AuthContext)