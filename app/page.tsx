import { Header } from "@/app/components/header";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Создай свою карту <span className="text-primary">развития</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          AI SkillMap помогает визуализировать твои навыки, отслеживать прогресс
          и получать умные рекомендации по обучению.
        </p>
        <div className="mt-8">
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/dashboard">Перейти к карте</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild size="lg">
              <Link href="/sign-up">Начать бесплатно</Link>
            </Button>
          </SignedOut>
        </div>
      </main>
    </div>
  );
}
