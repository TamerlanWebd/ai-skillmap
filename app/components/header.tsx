import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-xl font-bold">🚀 AI SkillMap</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in">Войти</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
