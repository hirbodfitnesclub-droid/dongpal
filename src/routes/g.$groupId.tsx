import { createFileRoute, Link } from "@tanstack/react-router";
import { GroupScreen } from "@/components/group-screen";
import { useDongi } from "@/store/dongi";

export const Route = createFileRoute("/g/$groupId")({
  component: GroupRoute,
});

function GroupRoute() {
  const { groupId } = Route.useParams();
  const hydrated = useDongi((s) => s.hydrated);
  const group = useDongi((s) => s.groups.find((g) => g.id === groupId));

  if (!hydrated) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg px-5 pt-10">
        <div className="h-10 w-40 rounded-lg bg-card" />
        <div className="mt-6 h-40 rounded-2xl bg-card" />
      </main>
    );
  }

  if (!group) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-medium">این دورهمی پیدا نشد</p>
        <p className="mt-2 text-sm text-muted">شاید از این دستگاه حذف شده.</p>
        <Link to="/" className="mt-6 text-sm text-primary">
          بازگشت
        </Link>
      </main>
    );
  }

  return <GroupScreen group={group} />;
}
