import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, Users, Zap } from "lucide-react";
import { verifyToken } from "./actions/auth";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let user = null;
  if (token) {
    const { success, data } = await verifyToken({ token: token.value })
    if (data) user = data;
  }
  return (
    <div className="flex flex-col items-center justify-center space-y-20 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          {user ? (
            <>Welcome back, <span className="text-primary">{user.name}</span></>
          ) : (
            "Less stress when sharing expenses"
          )}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {user
            ? "Ready to settle up? View your current group balances and expenses."
            : "Keep track of your shared expenses and balances with housemates, trips, and friends."}
        </p>

        <div className="flex gap-4 justify-center">
          {user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Shared Groups"
          description="Create groups for trips, households, or anything else to keep things organized."
        />
        <FeatureCard
          icon={<Receipt className="h-10 w-10 text-primary" />}
          title="Split Expenses"
          description="Add expenses quickly on the go and split them equally or by exact amounts."
        />
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-primary" />}
          title="Settle Up"
          description="Pay your friends back with integrated payment reminders and debt simplification."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-card hover:bg-accent/50 transition-colors space-y-4">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}