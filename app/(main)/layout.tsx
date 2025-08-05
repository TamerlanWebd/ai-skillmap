import { Header } from "../components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 relative overflow-hidden">{children}</main>
    </div>
  );
}
