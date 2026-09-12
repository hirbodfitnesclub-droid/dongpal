import { useMemo, useState } from "react";
import {
  Car,
  Delete,
  Home,
  ShoppingBag,
  Ticket,
  Utensils,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { PersonAvatar } from "@/components/person-avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  displayAmount,
  formatGrouped,
  formatMoney,
  parseMoneyInput,
  toToman,
  unitLabel,
  type Unit,
} from "@/lib/money";
import {
  CATEGORIES,
  type CategoryId,
  type Expense,
  type Group,
  type SplitMode,
} from "@/lib/split";
import { useDongi } from "@/store/dongi";

const ICONS: Record<CategoryId, typeof Utensils> = {
  food: Utensils,
  taxi: Car,
  stay: Home,
  shop: ShoppingBag,
  ticket: Ticket,
  other: MoreHorizontal,
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group: Group;
  editing?: Expense | null;
};

export function ExpenseFlow({ open, onOpenChange, group, editing }: Props) {
  const settings = useDongi((s) => s.settings);
  const addExpense = useDongi((s) => s.addExpense);
  const updateExpense = useDongi((s) => s.updateExpense);

  const [step, setStep] = useState<1 | 2>(1);
  const [display, setDisplay] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [paidBy, setPaidBy] = useState(group.members[0]?.id ?? "");
  const [included, setIncluded] = useState<string[]>(
    group.members.map((m) => m.id),
  );
  const [mode, setMode] = useState<SplitMode>("equal");
  const [shares, setShares] = useState<Record<string, number>>({});
  const [exact, setExact] = useState<Record<string, number>>({});

  const resetFrom = (expense?: Expense | null) => {
    if (expense) {
      const shown =
        settings.unit === "rial" ? expense.amount * 10 : expense.amount;
      setDisplay(String(shown));
      setTitle(expense.title);
      setCategory(expense.category);
      setPaidBy(expense.paidBy);
      setIncluded(expense.included);
      setMode(expense.mode);
      setShares(expense.shares ?? {});
      setExact(expense.exact ?? {});
      setStep(2);
    } else {
      setDisplay("");
      setTitle("");
      setCategory("food");
      setPaidBy(group.members[0]?.id ?? "");
      setIncluded(group.members.map((m) => m.id));
      setMode("equal");
      setShares({});
      setExact({});
      setStep(1);
    }
  };

  const raw = parseMoneyInput(display) ?? 0;
  const toman = toToman(raw, settings.unit);

  const exactSum = included.reduce((s, id) => s + (exact[id] ?? 0), 0);
  const exactOk = mode !== "exact" || exactSum === toman;

  function tap(key: string) {
    if (key === "del") {
      setDisplay((d) => d.slice(0, -1));
      return;
    }
    if (key === "000") {
      setDisplay((d) => (d ? d + "000" : d));
      return;
    }
    setDisplay((d) => {
      if (d.length >= 12) return d;
      if (d === "0") return key;
      return d + key;
    });
  }

  function toggleMember(id: string) {
    setIncluded((curr) => {
      if (curr.includes(id)) {
        if (curr.length === 1) return curr;
        return curr.filter((x) => x !== id);
      }
      return [...curr, id];
    });
  }

  function save() {
    if (toman <= 0 || included.length === 0 || !exactOk) return;
    const payload = {
      title,
      amount: toman,
      paidBy,
      category,
      included,
      mode,
      shares: mode === "shares" ? shares : undefined,
      exact: mode === "exact" ? exact : undefined,
    };
    if (editing) {
      updateExpense(group.id, {
        ...editing,
        ...payload,
        title: title.trim() || editing.title,
      });
    } else {
      addExpense(group.id, payload);
    }
    toast(editing ? "هزینه ویرایش شد" : "هزینه ثبت شد");
    onOpenChange(false);
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "del"];

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (v) resetFrom(editing);
        onOpenChange(v);
      }}
    >
      <DrawerContent>
        {step === 1 ? (
          <AmountStep
            display={display}
            unit={settings.unit}
            fa={settings.faDigits}
            keys={keys}
            onTap={tap}
            onNext={() => toman > 0 && setStep(2)}
            canNext={toman > 0}
          />
        ) : (
          <DetailsStep
            group={group}
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            paidBy={paidBy}
            setPaidBy={setPaidBy}
            included={included}
            toggleMember={toggleMember}
            mode={mode}
            setMode={setMode}
            shares={shares}
            setShares={setShares}
            exact={exact}
            setExact={setExact}
            toman={toman}
            unit={settings.unit}
            fa={settings.faDigits}
            exactOk={exactOk}
            exactSum={exactSum}
            onBack={() => setStep(1)}
            onSave={save}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}

function AmountStep({
  display,
  unit,
  fa,
  keys,
  onTap,
  onNext,
  canNext,
}: {
  display: string;
  unit: Unit;
  fa: boolean;
  keys: string[];
  onTap: (k: string) => void;
  onNext: () => void;
  canNext: boolean;
}) {
  const n = parseMoneyInput(display) ?? 0;
  return (
    <div className="flex flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
      <DrawerTitle className="text-center text-sm font-medium text-muted">
        مبلغ
      </DrawerTitle>
      <DrawerDescription className="sr-only">ورود مبلغ هزینه</DrawerDescription>
      <div className="mt-6 text-center">
        <p className="tabular-nums text-5xl font-medium tracking-tight text-foreground">
          {display ? formatGrouped(n, fa) : fa ? "۰" : "0"}
        </p>
        <p className="mt-2 text-sm text-muted">{unitLabel(unit)}</p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            className="keypad-btn"
            onClick={() => onTap(k)}
          >
            {k === "del" ? (
              <Delete className="mx-auto size-5" />
            ) : fa && k !== "000" ? (
              formatGrouped(Number(k), true)
            ) : (
              k
            )}
          </button>
        ))}
      </div>
      <Button className="mt-5 w-full" size="lg" disabled={!canNext} onClick={onNext}>
        ادامه
      </Button>
    </div>
  );
}

function DetailsStep(props: {
  group: Group;
  title: string;
  setTitle: (v: string) => void;
  category: CategoryId;
  setCategory: (v: CategoryId) => void;
  paidBy: string;
  setPaidBy: (v: string) => void;
  included: string[];
  toggleMember: (id: string) => void;
  mode: SplitMode;
  setMode: (m: SplitMode) => void;
  shares: Record<string, number>;
  setShares: (v: Record<string, number>) => void;
  exact: Record<string, number>;
  setExact: (v: Record<string, number>) => void;
  toman: number;
  unit: Unit;
  fa: boolean;
  exactOk: boolean;
  exactSum: number;
  onBack: () => void;
  onSave: () => void;
}) {
  const perHead = useMemo(() => {
    const n = props.included.length || 1;
    return Math.floor(props.toman / n);
  }, [props.included.length, props.toman]);

  return (
    <div className="flex max-h-[92dvh] flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
      <div className="flex items-center justify-between">
        <button type="button" className="text-sm text-muted" onClick={props.onBack}>
          مبلغ
        </button>
        <DrawerTitle>جزئیات</DrawerTitle>
        <span className="w-8" />
      </div>
      <DrawerDescription className="sr-only">جزئیات هزینه</DrawerDescription>

      <p className="mt-4 text-center tabular-nums text-2xl font-medium">
        {formatMoney(props.toman, { unit: props.unit, fa: props.fa })}
      </p>

      <Input
        className="mt-5"
        placeholder="برای چی؟ مثلاً ناهار"
        value={props.title}
        onChange={(e) => props.setTitle(e.target.value)}
      />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.id];
          const on = props.category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => props.setCategory(c.id)}
              className={cn(
                "flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-[background-color,color] duration-150",
                on ? "bg-primary text-primary-foreground" : "bg-card-2 text-muted",
              )}
            >
              <Icon className="size-3.5" />
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs font-medium text-muted">کی داده؟</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.group.members.map((m) => {
          const on = props.paidBy === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => props.setPaidBy(m.id)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full px-2.5 pe-3.5 transition-[background-color] duration-150",
                on ? "bg-primary text-primary-foreground" : "bg-card-2",
              )}
            >
              <PersonAvatar member={m} size="sm" />
              <span className="text-sm">{m.name}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs font-medium text-muted">بین کی تقسیم بشه؟</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {props.group.members.map((m) => {
          const on = props.included.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => props.toggleMember(m.id)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full px-2.5 pe-3.5 transition-[opacity,background-color] duration-150",
                on ? "bg-card-2" : "bg-card-2 opacity-35",
              )}
            >
              <PersonAvatar member={m} size="sm" />
              <span className="text-sm">{m.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-card-2 p-1">
        {(
          [
            ["equal", "مساوی"],
            ["shares", "سهمی"],
            ["exact", "دقیق"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => props.setMode(id)}
            className={cn(
              "h-10 rounded-lg text-sm transition-[background-color,color] duration-150",
              props.mode === id ? "bg-background text-foreground" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {props.mode === "equal" && (
        <p className="mt-3 text-center text-sm text-muted">
          حدود {formatMoney(perHead, { unit: props.unit, fa: props.fa })} هر نفر
        </p>
      )}

      {props.mode === "shares" && (
        <div className="mt-3 space-y-2">
          {props.included.map((id) => {
            const m = props.group.members.find((x) => x.id === id);
            if (!m) return null;
            const v = props.shares[id] ?? 1;
            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-xl bg-card-2 px-3 py-2"
              >
                <span className="text-sm">{m.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="size-9 rounded-lg bg-background text-lg"
                    onClick={() =>
                      props.setShares({ ...props.shares, [id]: Math.max(1, v - 1) })
                    }
                  >
                    −
                  </button>
                  <span className="w-6 text-center tabular-nums">{v}</span>
                  <button
                    type="button"
                    className="size-9 rounded-lg bg-background text-lg"
                    onClick={() => props.setShares({ ...props.shares, [id]: v + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {props.mode === "exact" && (
        <div className="mt-3 space-y-2">
          {props.included.map((id) => {
            const m = props.group.members.find((x) => x.id === id);
            if (!m) return null;
            const shown = props.exact[id]
              ? String(displayAmount(props.exact[id], props.unit))
              : "";
            return (
              <div key={id} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-sm">{m.name}</span>
                <Input
                  inputMode="numeric"
                  value={shown}
                  placeholder="۰"
                  onChange={(e) => {
                    const n = parseMoneyInput(e.target.value) ?? 0;
                    props.setExact({
                      ...props.exact,
                      [id]: toToman(n, props.unit),
                    });
                  }}
                />
              </div>
            );
          })}
          {!props.exactOk && (
            <p className="text-xs text-owe">
              جمع سهم‌ها باید برابر مبلغ باشد (
              {formatMoney(props.exactSum, { unit: props.unit, fa: props.fa })})
            </p>
          )}
        </div>
      )}

      <Button
        className="mt-6 w-full"
        size="lg"
        disabled={!props.exactOk || props.toman <= 0}
        onClick={props.onSave}
      >
        ذخیره هزینه
      </Button>
    </div>
  );
}
