'use client'; // Mandatory for hooks and form interaction

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Signup } from "../actions/auth";

export default function SignupPage() {
  const router = useRouter();

  // 1. Initialize Action State
  // state will hold { success, data, error } from your catchErrors wrapper
  const [state, formAction, isPending] = useActionState(Signup, null);

  // 2. Handle Redirect on Success
  useEffect(() => {
    if (state?.success) {
      router.push('/'); // Or redirect to dashboard after signup
    }
  }, [state, router]);

  return (
    <div className="bg-background text-foreground flex items-center justify-center h-full w-full">
      <div className="w-full max-w-[400px] rounded-xl border border-white/10 mt-32 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign up for Splitwise
        </h1>

        {/* 3. Connect the formAction */}
        <form action={formAction} className="space-y-4">
          <Input
            placeholder="Name"
            type="text"
            name="name"
            required
            disabled={isPending}
          />

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

          <Input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            required
            disabled={isPending}
          />

          {/* 4. Display Error Feedback */}
          {state?.error && (
            <p className="text-destructive text-sm font-medium text-center bg-destructive/10 p-2 rounded">
              {state.error}
            </p>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-center text-white/60">
          Already have an account?{" "}
          <Link href={'/signin'}>
            <span className="text-white underline cursor-pointer">
              Sign in
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}