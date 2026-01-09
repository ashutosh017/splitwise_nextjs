import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="bg-background text-foreground flex justify-center items-center h-full w-full">
      <div className="w-full max-w-[400] rounded-xl border border-white/10 mt-32 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign in to Splitwise
        </h1>

        <form className="space-y-4">
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

          <Button className="w-full" type="submit">
            Sign in
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
