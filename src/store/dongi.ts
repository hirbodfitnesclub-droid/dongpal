import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/ids";
import type { Unit } from "@/lib/money";
import type { CategoryId, Expense, Group, Member, SplitMode } from "@/lib/split";

export type Settings = {
  unit: Unit;
  faDigits: boolean;
};

type DongiState = {
  hydrated: boolean;
  groups: Group[];
  settings: Settings;
  setHydrated: () => void;
  setUnit: (unit: Unit) => void;
  setFaDigits: (fa: boolean) => void;
  createGroup: (name: string, memberNames: string[]) => string;
  importGroup: (group: Group) => string;
  renameGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  addMember: (groupId: string, name: string) => void;
  removeMember: (groupId: string, memberId: string) => void;
  addExpense: (
    groupId: string,
    input: {
      title: string;
      amount: number;
      paidBy: string;
      category: CategoryId;
      included: string[];
      mode: SplitMode;
      shares?: Record<string, number>;
      exact?: Record<string, number>;
    },
  ) => void;
  updateExpense: (groupId: string, expense: Expense) => void;
  removeExpense: (groupId: string, expenseId: string) => void;
  applySettlements: (
    groupId: string,
    transfers: { from: string; to: string; amount: number }[],
  ) => void;
};

const TONES = 8;

function nextTone(members: Member[]): number {
  return members.length % TONES;
}

const DEMO: Group = {
  id: "g_demo_north",
  name: "شمال، آخر هفته",
  createdAt: Date.now() - 1000 * 60 * 60 * 26,
  members: [
    { id: "m_you", name: "تو", tone: 0 },
    { id: "m_sara", name: "سارا", tone: 1 },
    { id: "m_ali", name: "علی", tone: 2 },
    { id: "m_nima", name: "نیما", tone: 3 },
  ],
  expenses: [
    {
      id: "e1",
      title: "ویلای دو شب",
      amount: 4_200_000,
      paidBy: "m_sara",
      category: "stay",
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
      included: ["m_you", "m_sara", "m_ali", "m_nima"],
      mode: "equal",
    },
    {
      id: "e2",
      title: "بنزین رفت",
      amount: 720_000,
      paidBy: "m_you",
      category: "taxi",
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
      included: ["m_you", "m_sara", "m_ali", "m_nima"],
      mode: "equal",
    },
    {
      id: "e3",
      title: "ماهی‌سفید",
      amount: 1_850_000,
      paidBy: "m_ali",
      category: "food",
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      included: ["m_you", "m_sara", "m_ali", "m_nima"],
      mode: "equal",
    },
    {
      id: "e4",
      title: "کافه جاده",
      amount: 340_000,
      paidBy: "m_nima",
      category: "food",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      included: ["m_you", "m_sara", "m_nima"],
      mode: "equal",
    },
  ],
};

export const useDongi = create<DongiState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      groups: [DEMO],
      settings: { unit: "toman", faDigits: true },
      setHydrated: () => set({ hydrated: true }),
      setUnit: (unit) =>
        set((s) => ({ settings: { ...s.settings, unit } })),
      setFaDigits: (faDigits) =>
        set((s) => ({ settings: { ...s.settings, faDigits } })),
      createGroup: (name, memberNames) => {
        const names = memberNames.map((n) => n.trim()).filter(Boolean);
        const members: Member[] = (names.length ? names : ["تو"]).map(
          (n, i) => ({
            id: uid("m"),
            name: n,
            tone: i % TONES,
          }),
        );
        const group: Group = {
          id: uid("g"),
          name: name.trim() || "بدون اسم",
          members,
          expenses: [],
          createdAt: Date.now(),
        };
        set((s) => ({ groups: [group, ...s.groups] }));
        return group.id;
      },
      importGroup: (group) => {
        set((s) => ({ groups: [group, ...s.groups] }));
        return group.id;
      },
      renameGroup: (id, name) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === id ? { ...g, name: name.trim() || g.name } : g,
          ),
        })),
      deleteGroup: (id) =>
        set((s) => ({ groups: s.groups.filter((g) => g.id !== id) })),
      addMember: (groupId, name) =>
        set((s) => ({
          groups: s.groups.map((g) => {
            if (g.id !== groupId) return g;
            const member: Member = {
              id: uid("m"),
              name: name.trim(),
              tone: nextTone(g.members),
            };
            return { ...g, members: [...g.members, member] };
          }),
        })),
      removeMember: (groupId, memberId) =>
        set((s) => ({
          groups: s.groups.map((g) => {
            if (g.id !== groupId) return g;
            if (g.members.length <= 1) return g;
            return {
              ...g,
              members: g.members.filter((m) => m.id !== memberId),
              expenses: g.expenses
                .map((e) => ({
                  ...e,
                  included: e.included.filter((id) => id !== memberId),
                }))
                .filter((e) => e.paidBy !== memberId && e.included.length > 0),
            };
          }),
        })),
      addExpense: (groupId, input) =>
        set((s) => ({
          groups: s.groups.map((g) => {
            if (g.id !== groupId) return g;
            const expense: Expense = {
              id: uid("e"),
              title: input.title.trim() || categoryFallback(input.category),
              amount: Math.max(0, Math.round(input.amount)),
              paidBy: input.paidBy,
              category: input.category,
              createdAt: Date.now(),
              included:
                input.included.length > 0
                  ? input.included
                  : g.members.map((m) => m.id),
              mode: input.mode,
              shares: input.shares,
              exact: input.exact,
            };
            return { ...g, expenses: [expense, ...g.expenses] };
          }),
        })),
      updateExpense: (groupId, expense) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  expenses: g.expenses.map((e) =>
                    e.id === expense.id ? expense : e,
                  ),
                }
              : g,
          ),
        })),
      removeExpense: (groupId, expenseId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  expenses: g.expenses.filter((e) => e.id !== expenseId),
                }
              : g,
          ),
        })),
      applySettlements: (groupId, transfers) => {
        const g = get().groups.find((x) => x.id === groupId);
        if (!g) return;
        for (const t of transfers) {
          get().addExpense(groupId, {
            title: "تسویه",
            amount: t.amount,
            paidBy: t.from,
            category: "other",
            included: [t.to],
            mode: "equal",
          });
        }
      },
    }),
    {
      name: "dongpal.v1",
      skipHydration: true,
      partialize: (s) => ({ groups: s.groups, settings: s.settings }),
    },
  ),
);

function categoryFallback(c: CategoryId): string {
  const map: Record<CategoryId, string> = {
    food: "غذا",
    taxi: "مسیر",
    stay: "اقامت",
    shop: "خرید",
    ticket: "بلیت",
    other: "هزینه",
  };
  return map[c];
}

export function hydrateDongi() {
  const result = useDongi.persist.rehydrate();
  Promise.resolve(result).finally(() => {
    useDongi.getState().setHydrated();
  });
}
