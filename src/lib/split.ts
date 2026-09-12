export type SplitMode = "equal" | "shares" | "exact";

export type Member = {
  id: string;
  name: string;
  tone: number;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  category: CategoryId;
  createdAt: number;
  included: string[];
  mode: SplitMode;
  shares?: Record<string, number>;
  exact?: Record<string, number>;
};

export type CategoryId =
  | "food"
  | "taxi"
  | "stay"
  | "shop"
  | "ticket"
  | "other";

export type Transfer = {
  from: string;
  to: string;
  amount: number;
};

export type Group = {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  createdAt: number;
};

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "food", label: "غذا" },
  { id: "taxi", label: "مسیر" },
  { id: "stay", label: "اقامت" },
  { id: "shop", label: "خرید" },
  { id: "ticket", label: "بلیت" },
  { id: "other", label: "دیگر" },
];

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "دیگر";
}

export function shareOf(expense: Expense, memberId: string): number {
  const { included, amount, mode } = expense;
  if (amount <= 0 || included.length === 0) return 0;
  if (!included.includes(memberId)) return 0;

  if (mode === "exact") {
    return Math.max(0, Math.round(expense.exact?.[memberId] ?? 0));
  }

  if (mode === "shares") {
    const weights = included.map((id) => Math.max(0, expense.shares?.[id] ?? 1));
    const totalW = weights.reduce((a, b) => a + b, 0);
    if (totalW <= 0) return 0;
    const raw = included.map((id, i) => ({
      id,
      ideal: (amount * weights[i]) / totalW,
    }));
    return allocateRounded(raw, amount)[memberId] ?? 0;
  }

  const n = included.length;
  const base = Math.floor(amount / n);
  const rem = amount - base * n;
  const idx = included.indexOf(memberId);
  return base + (idx >= 0 && idx < rem ? 1 : 0);
}

function allocateRounded(
  parts: { id: string; ideal: number }[],
  total: number,
): Record<string, number> {
  const floors = parts.map((p) => ({
    id: p.id,
    value: Math.floor(p.ideal),
    frac: p.ideal - Math.floor(p.ideal),
  }));
  let leftover = total - floors.reduce((s, p) => s + p.value, 0);
  floors
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach((p) => {
      if (leftover > 0) {
        p.value += 1;
        leftover -= 1;
      }
    });
  const out: Record<string, number> = {};
  for (const p of floors) out[p.id] = p.value;
  return out;
}

export function nets(group: Group): Record<string, number> {
  const net: Record<string, number> = {};
  for (const m of group.members) net[m.id] = 0;
  for (const e of group.expenses) {
    if (!net[e.paidBy] && net[e.paidBy] !== 0) net[e.paidBy] = 0;
    net[e.paidBy] += e.amount;
    const ids = new Set([...e.included, ...group.members.map((m) => m.id)]);
    for (const id of ids) {
      if (net[id] === undefined) net[id] = 0;
      net[id] -= shareOf(e, id);
    }
  }
  return net;
}

export function totalSpent(group: Group): number {
  return group.expenses.reduce((s, e) => s + e.amount, 0);
}

export function settle(net: Record<string, number>): Transfer[] {
  const debtors: { id: string; amt: number }[] = [];
  const creditors: { id: string; amt: number }[] = [];
  for (const [id, v] of Object.entries(net)) {
    if (v < -0.5) debtors.push({ id, amt: -v });
    else if (v > 0.5) creditors.push({ id, amt: v });
  }
  debtors.sort((a, b) => b.amt - a.amt);
  creditors.sort((a, b) => b.amt - a.amt);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const pay = Math.min(d.amt, c.amt);
    if (pay > 0) {
      transfers.push({ from: d.id, to: c.id, amount: Math.round(pay) });
      d.amt -= pay;
      c.amt -= pay;
    }
    if (d.amt < 0.5) i += 1;
    if (c.amt < 0.5) j += 1;
  }
  return transfers.filter((t) => t.amount > 0);
}

export function memberName(group: Group, id: string): string {
  return group.members.find((m) => m.id === id)?.name ?? "نامشخص";
}
