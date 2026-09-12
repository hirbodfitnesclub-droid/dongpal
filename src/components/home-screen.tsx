import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { CreateGroup } from "@/components/create-group";
import { AvatarStack } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { decodeGroup } from "@/lib/share";
import { totalSpent } from "@/lib/split";
import { cn } from "@/lib/utils";
import { useDongi } from "@/store/dongi";

export function HomeScreen({ importToken }: { importToken?: string }) {
  const navigate = useNavigate();
  const hydrated = useDongi((s) => s.hydrated);
  const groups = useDongi((s) => s.groups);
  const settings = useDongi((s) => s.settings);
  const setUnit = useDongi((s) => s.setUnit);
  const setFaDigits = useDongi((s) => s.setFaDigits);
  const importGroup = useDongi((s) => s.importGroup);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!hydrated || !importToken) return;
    const g = decodeGroup(importToken);
    if (!g) {
      toast("لینک دونگ نامعتبر بود");
      return;
    }
    const id = importGroup(g);
    toast("دورهمی اضافه شد");
    void navigate({ to: "/g/$groupId", params: { groupId: id }, search: {} });
  }, [hydrated, importToken, importGroup, navigate]);

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 pb-36 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-muted">
            DONGPAL
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">دنگ‌پال</h1>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]"
          aria-label="تنظیمات"
        >
          <SlidersHorizontal className="size-4" />
        </button>
      </header>

      {settingsOpen && (
        <section className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs font-medium text-muted">واحد نمایش</p>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-card-2 p-1">
            {(["toman", "rial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={cn(
                  "h-10 rounded-lg text-sm",
                  settings.unit === u ? "bg-background" : "text-muted",
                )}
              >
                {u === "toman" ? "تومان" : "ریال"}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs font-medium text-muted">ارقام</p>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-card-2 p-1">
            <button
              type="button"
              onClick={() => setFaDigits(true)}
              className={cn(
                "h-10 rounded-lg text-sm",
                settings.faDigits ? "bg-background" : "text-muted",
              )}
            >
              فارسی
            </button>
            <button
              type="button"
              onClick={() => setFaDigits(false)}
              className={cn(
                "h-10 rounded-lg text-sm",
                !settings.faDigits ? "bg-background" : "text-muted",
              )}
            >
              123
            </button>
          </div>
        </section>
      )}

      <p className="mt-8 max-w-[18ch] text-lg leading-snug text-muted">
        هزینه‌ها را بنویس. دونگ را دنگ‌پال حساب می‌کند.
      </p>

      <div className="stagger-in mt-8 space-y-3">
        {hydrated && groups.length === 0 && (
          <div className="rounded-2xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]">
            <p className="text-foreground">هنوز دورهمی‌ای نیست</p>
            <p className="mt-1 text-sm text-muted">
              یک گروه بساز یا از لینک دونگ وارد شو.
            </p>
          </div>
        )}
        {groups.map((g) => (
            <Link
              key={g.id}
              to="/g/$groupId"
              params={{ groupId: g.id }}
              className="block rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-medium">
                    {g.name}
                    {g.id === "g_demo_north" && (
                      <span className="rounded-full bg-card-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                        نمونه
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {g.members.length} نفر · {g.expenses.length} هزینه
                  </p>
                </div>
                <AvatarStack members={g.members} />
              </div>
              <p className="mt-4 tabular-nums text-sm text-muted">
                جمع خرج{" "}
                <span className="text-foreground">
                  {formatMoney(totalSpent(g), {
                    unit: settings.unit,
                    fa: settings.faDigits,
                  })}
                </span>
              </p>
            </Link>
          ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]">
        <Button
          className="pointer-events-auto w-full shadow-lg"
          size="lg"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          دورهمی جدید
        </Button>
      </div>

      <CreateGroup open={open} onOpenChange={setOpen} />
    </main>
  );
}
