'use client'; // Required for useActionState

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Input } from "@/components/ui/input"; // Adjust paths as needed
import { Button } from "@/components/ui/button";
import { Signin } from "../actions/auth";

export default function SigninPage() {
  const router = useRouter();

  // 1. Initialize Action State
  // 'state' will hold { success, data, error } from your catchErrors wrapper
  const [state, formAction, isPending] = useActionState(Signin, null);

  // 2. Handle Redirect on Success
  useEffect(() => {
    if (state?.success) {
      router.push('/');
      router.refresh(); // Refresh to update Navbar auth state
    }
  }, [state, router]);

  return (
    <div className="bg-background text-foreground flex justify-center items-center h-full w-full">
      <div className="w-full max-w-[400] rounded-xl border border-white/10 mt-32 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign in to Splitwise
        </h1>

        {/* 3. Attach formAction */}
        <form action={formAction} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            name="email"
            required
            disabled={isPending}
          />

          <Input
            placeholder="Password"
            type="password"
            name="password"
            required
            disabled={isPending}
          />

          {/* 4. Display Error Message */}
          {state?.error && (
            <p className="text-destructive text-sm font-medium text-center">
              {state.error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-center text-white/60">
          Don’t have an account?{" "}
          <Link href={'/signup'}>
            <span className="text-white underline cursor-pointer">
              Sign up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}