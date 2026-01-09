import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-background text-foreground flex items-center justify-center h-screen w-screen">
      <div className="w-full max-w-[400] rounded-xl border border-white/10 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign up for Splitwise
        </h1>

        <form className="space-y-4">
          <Input
            placeholder="Name"
            type="text"
            name="name"
            required
          />

          <Input
            placeholder="Email"
            type="email"
            name="email"
            required
          />

          <Input
            placeholder="Password"
            type="password"
            name="password"
            required
          />

          <Input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            required
          />

          <Button className="w-full" type="submit">
            Create account
          </Button>
        </form>

        <p className="text-sm text-center text-white/60">
          Already have an account?{" "}
          <Link href={'/signin'}  >
          <span  className="text-white underline cursor-pointer">
            Sign in
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
