import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Copy,
  Dices,
  Download,
  Link2,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { ExpenseFlow } from "@/components/expense-flow";
import { LuckyPicker } from "@/components/lucky-picker";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/money";
import { shareUrl } from "@/lib/share";
import {
  categoryLabel,
  memberName,
  nets,
  settle,
  totalSpent,
  type Expense,
  type Group,
} from "@/lib/split";
import { renderStoryPng } from "@/lib/story";
import { cn } from "@/lib/utils";
import { useDongi } from "@/store/dongi";

export function GroupScreen({ group }: { group: Group }) {
  const navigate = useNavigate();
  const settings = useDongi((s) => s.settings);
  const addMember = useDongi((s) => s.addMember);
  const removeExpense = useDongi((s) => s.removeExpense);
  const applySettlements = useDongi((s) => s.applySettlements);
  const deleteGroup = useDongi((s) => s.deleteGroup);
  const renameGroup = useDongi((s) => s.renameGroup);

  const [tab, setTab] = useState<"exp" | "set">("exp");
  const [flow, setFlow] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [lucky, setLucky] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const net = useMemo(() => nets(group), [group]);
  const transfers = useMemo(() => settle(net), [net]);
  const spent = totalSpent(group);
  const allZero = transfers.length === 0 && group.expenses.length > 0;

  function copyText(text: string, ok: string) {
    void navigator.clipboard.writeText(text).then(
      () => toast(ok),
      () => toast("کپی نشد"),
    );
  }

  function settlementText() {
    if (transfers.length === 0) return `${group.name} — حساب‌ها صاف است.`;
    const lines = transfers.map(
      (t) =>
        `${memberName(group, t.from)} به ${memberName(group, t.to)} بده: ${formatMoney(t.amount, { unit: settings.unit, fa: settings.faDigits })}`,
    );
    return [`دونگ ${group.name}`, ...lines, "— دنگ‌پال"].join("\n");
  }

  async function shareLink() {
    const url = shareUrl(group);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `دونگ ${group.name}`,
          url,
          text: settlementText(),
        });
        return;
      } catch {
        /* ignore */
      }
    }
    copyText(url, "لینک دونگ کپی شد");
  }

  async function exportStory() {
    try {
      const blob = await renderStoryPng(group, transfers, {
        unit: settings.unit,
        fa: settings.faDigits,
      });
      const file = new File([blob], "dongpal.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: group.name });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${group.name}.png`;
      a.click();
      toast("تصویر ذخیره شد");
    } catch {
      toast("ساخت تصویر نشد");
    }
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg pb-36 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-2 px-4">
        <Link
          to="/"
          className="inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]"
          aria-label="بازگشت"
        >
          <ArrowRight className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <input
            value={group.name}
            onChange={(e) => renameGroup(group.id, e.target.value)}
            className="w-full bg-transparent text-lg font-medium outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setLucky(true)}
          className="inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]"
          aria-label="کی بده"
        >
          <Dices className="size-4" />
        </button>
      </header>

      <section className="mx-5 mt-5 rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium text-muted">جمع خرج</p>
        <p className="mt-1 tabular-nums text-3xl font-medium tracking-tight">
          {formatMoney(spent, { unit: settings.unit, fa: settings.faDigits })}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {group.members.map((m) => {
            const v = net[m.id] ?? 0;
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-xl bg-card-2 px-3 py-2.5"
              >
                <PersonAvatar member={m} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm">{m.name}</p>
                  <p
                    className={cn(
                      "tabular-nums text-xs",
                      v > 0.5 ? "text-owed" : v < -0.5 ? "text-owe" : "text-muted",
                    )}
                  >
                    {v > 0.5
                      ? `طلب ${formatMoney(v, { unit: settings.unit, fa: settings.faDigits, withUnit: false })}`
                      : v < -0.5
                        ? `بدهکار ${formatMoney(-v, { unit: settings.unit, fa: settings.faDigits, withUnit: false })}`
                        : "صاف"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setMemberOpen(true)}
          className="mt-3 inline-flex h-10 items-center gap-1.5 text-sm text-muted"
        >
          <UserPlus className="size-3.5" />
          نفر جدید
        </button>
      </section>

      <div className="mx-5 mt-6 grid grid-cols-2 gap-1 rounded-xl bg-card p-1">
        <button
          type="button"
          onClick={() => setTab("exp")}
          className={cn(
            "h-10 rounded-lg text-sm transition-[background-color] duration-150",
            tab === "exp" ? "bg-card-2" : "text-muted",
          )}
        >
          هزینه‌ها
        </button>
        <button
          type="button"
          onClick={() => setTab("set")}
          className={cn(
            "h-10 rounded-lg text-sm transition-[background-color] duration-150",
            tab === "set" ? "bg-card-2" : "text-muted",
          )}
        >
          بده‌بستان
        </button>
      </div>

      {tab === "exp" && (
        <ul className="stagger-in mt-4 space-y-2 px-5">
          {group.expenses.length === 0 && (
            <li className="rounded-2xl bg-card px-5 py-10 text-center text-sm text-muted">
              هنوز هزینه‌ای ثبت نشده. اولی را اضافه کن.
            </li>
          )}
          {group.expenses.map((e) => {
            const payer = group.members.find((m) => m.id === e.paidBy);
            return (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-border)]"
              >
                {payer && <PersonAvatar member={payer} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {payer?.name} · {categoryLabel(e.category)} · {e.included.length} نفر
                  </p>
                  <p className="mt-2 truncate tabular-nums text-sm">
                    {formatMoney(e.amount, {
                      unit: settings.unit,
                      fa: settings.faDigits,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 self-start">
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center text-muted"
                    onClick={() => {
                      setEditing(e);
                      setFlow(true);
                    }}
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center text-muted"
                    onClick={() => removeExpense(group.id, e.id)}
                    aria-label="حذف"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {tab === "set" && (
        <section className="stagger-in mt-4 space-y-3 px-5">
          {allZero && (
            <div className="rounded-2xl bg-card px-5 py-8 text-center">
              <p className="text-owed">حساب‌ها صاف است</p>
              <p className="mt-1 text-sm text-muted">هیچکس به کسی بدهکار نیست.</p>
            </div>
          )}
          {group.expenses.length === 0 && (
            <div className="rounded-2xl bg-card px-5 py-8 text-center text-sm text-muted">
              اول چند هزینه ثبت کن تا دونگ مشخص شود.
            </div>
          )}
          {transfers.map((t) => {
            const from = group.members.find((m) => m.id === t.from);
            const to = group.members.find((m) => m.id === t.to);
            const line = `${memberName(group, t.from)} به ${memberName(group, t.to)} بده: ${formatMoney(t.amount, { unit: settings.unit, fa: settings.faDigits })}`;
            return (
              <div
                key={`${t.from}-${t.to}`}
                className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {from && <PersonAvatar member={from} size="sm" />}
                    <span className="text-sm text-muted">بده به</span>
                    {to && <PersonAvatar member={to} size="sm" />}
                  </div>
                  <button
                    type="button"
                    className="inline-flex size-11 items-center justify-center text-muted"
                    onClick={() => copyText(line, "پیام کپی شد")}
                    aria-label="کپی"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm">
                  {from?.name} → {to?.name}
                </p>
                <p className="mt-1 tabular-nums text-xl font-medium text-owe">
                  {formatMoney(t.amount, {
                    unit: settings.unit,
                    fa: settings.faDigits,
                  })}
                </p>
              </div>
            );
          })}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => copyText(settlementText(), "متن تسویه کپی شد")}
            >
              <Copy className="size-4" />
              کپی متن
            </Button>
            <Button variant="secondary" onClick={() => void shareLink()}>
              <Link2 className="size-4" />
              لینک دونگ
            </Button>
            <Button variant="secondary" onClick={() => void exportStory()}>
              <Download className="size-4" />
              تصویر استوری
            </Button>
            <Button
              variant="secondary"
              disabled={transfers.length === 0}
              onClick={() => {
                applySettlements(group.id, transfers);
                toast("تسویه ثبت شد");
              }}
            >
              ثبت تسویه
            </Button>
          </div>
        </section>
      )}

      <div className="mx-5 mt-8">
        <button
          type="button"
          className="text-xs text-subtle"
          onClick={() => setConfirmDelete(true)}
        >
          حذف دورهمی
        </button>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]">
        <Button
          className="pointer-events-auto w-full"
          size="lg"
          onClick={() => {
            setEditing(null);
            setFlow(true);
          }}
        >
          <Plus className="size-4" />
          هزینه جدید
        </Button>
      </div>

      <ExpenseFlow
        open={flow}
        onOpenChange={setFlow}
        group={group}
        editing={editing}
      />
      <LuckyPicker open={lucky} onOpenChange={setLucky} members={group.members} />

      <Drawer open={memberOpen} onOpenChange={setMemberOpen}>
        <DrawerContent>
          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <DrawerTitle>نفر جدید</DrawerTitle>
            <DrawerDescription>به این دورهمی اضافه می‌شود.</DrawerDescription>
            <Input
              className="mt-4"
              placeholder="اسم"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
            <Button
              className="mt-4 w-full"
              onClick={() => {
                if (!newMember.trim()) return;
                addMember(group.id, newMember);
                setNewMember("");
                setMemberOpen(false);
              }}
            >
              افزودن
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DrawerContent>
          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            <DrawerTitle>حذف شود؟</DrawerTitle>
            <DrawerDescription>
              این دورهمی از این دستگاه پاک می‌شود.
            </DrawerDescription>
            <Button
              className="mt-5 w-full"
              variant="danger"
              onClick={() => {
                deleteGroup(group.id);
                void navigate({ to: "/" });
              }}
            >
              حذف
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
