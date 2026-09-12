import { uid } from "./ids";
import type { Expense, Group, Member } from "./split";

type Compact = {
  v: 1;
  n: string;
  m: { i: string; n: string; t: number }[];
  e: {
    i: string;
    t: string;
    a: number;
    p: string;
    c: Expense["category"];
    d: number;
    u: string[];
    m: Expense["mode"];
    s?: Record<string, number>;
    x?: Record<string, number>;
  }[];
};

export function compactGroup(group: Group): Compact {
  return {
    v: 1,
    n: group.name,
    m: group.members.map((m) => ({ i: m.id, n: m.name, t: m.tone })),
    e: group.expenses.map((e) => ({
      i: e.id,
      t: e.title,
      a: e.amount,
      p: e.paidBy,
      c: e.category,
      d: e.createdAt,
      u: e.included,
      m: e.mode,
      s: e.shares,
      x: e.exact,
    })),
  };
}

export function expandGroup(data: Compact, remapIds = true): Group {
  const idMap = new Map<string, string>();
  const mapId = (id: string) => {
    if (!remapIds) return id;
    if (!idMap.has(id)) idMap.set(id, uid("m"));
    return idMap.get(id)!;
  };

  const members: Member[] = data.m.map((m) => ({
    id: mapId(m.i),
    name: m.n,
    tone: m.t,
  }));

  const expenses: Expense[] = data.e.map((e) => ({
    id: remapIds ? uid("e") : e.i,
    title: e.t,
    amount: e.a,
    paidBy: mapId(e.p),
    category: e.c,
    createdAt: e.d,
    included: e.u.map(mapId),
    mode: e.m,
    shares: e.s
      ? Object.fromEntries(Object.entries(e.s).map(([k, v]) => [mapId(k), v]))
      : undefined,
    exact: e.x
      ? Object.fromEntries(Object.entries(e.x).map(([k, v]) => [mapId(k), v]))
      : undefined,
  }));

  return {
    id: uid("g"),
    name: data.n,
    members,
    expenses,
    createdAt: Date.now(),
  };
}

export function encodeGroup(group: Group): string {
  const json = JSON.stringify(compactGroup(group));
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeGroup(payload: string): Group | null {
  try {
    const pad = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json) as Compact;
    if (data.v !== 1 || !data.n || !Array.isArray(data.m)) return null;
    return expandGroup(data, true);
  } catch {
    return null;
  }
}

export function shareUrl(group: Group): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/?i=${encodeURIComponent(encodeGroup(group))}`;
}
