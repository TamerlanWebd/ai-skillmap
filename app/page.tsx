import { Header } from "@/app/components/header";

export default function HomePage() {
  return (
    <main>
      <Header />
      <div className="container mx-auto p-4 pt-8">
        <h2 className="text-2xl font-bold">Ваша интерактивная карта навыков</h2>
        <p className="text-muted-foreground mt-2">
          Начните строить свой путь развития. Добавляйте навыки, соединяйте их и
          получайте рекомендации от AI.
        </p>
      </div>
    </main>
  );
}
