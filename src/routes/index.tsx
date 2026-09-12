import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/home-screen";

type Search = { i?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    i: typeof s.i === "string" ? s.i : undefined,
  }),
  component: Home,
});

function Home() {
  const { i } = Route.useSearch();
  return <HomeScreen importToken={i} />;
}
