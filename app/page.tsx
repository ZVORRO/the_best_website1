import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Backlog from "@/components/Backlog";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Intro />
      <Backlog />
      <footer className="px-6 pb-10 pt-4 text-center font-body text-xs text-mute/70">
        Зроблено вручну, з нульовим бюджетом і ненульовою симпатією.
      </footer>
    </main>
  );
}
