import assert from "node:assert/strict";
import test from "node:test";
import { nets, settle, shareOf, type Expense, type Group } from "./split.ts";

const group: Group = {
  id: "g",
  name: "t",
  createdAt: 0,
  members: [
    { id: "a", name: "A", tone: 0 },
    { id: "b", name: "B", tone: 1 },
    { id: "c", name: "C", tone: 2 },
  ],
  expenses: [],
};

test("equal split remainder goes to first members", () => {
  const e: Expense = {
    id: "e",
    title: "x",
    amount: 100,
    paidBy: "a",
    category: "food",
    createdAt: 0,
    included: ["a", "b", "c"],
    mode: "equal",
  };
  assert.equal(shareOf(e, "a"), 34);
  assert.equal(shareOf(e, "b"), 33);
  assert.equal(shareOf(e, "c"), 33);
});

test("settle minimizes transfers", () => {
  const g: Group = {
    ...group,
    expenses: [
      {
        id: "e1",
        title: "x",
        amount: 90,
        paidBy: "a",
        category: "food",
        createdAt: 0,
        included: ["a", "b", "c"],
        mode: "equal",
      },
    ],
  };
  const n = nets(g);
  assert.equal(n.a, 60);
  assert.equal(n.b, -30);
  assert.equal(n.c, -30);
  const t = settle(n);
  assert.equal(t.length, 2);
  assert.equal(
    t.reduce((s, x) => s + x.amount, 0),
    60,
  );
});
