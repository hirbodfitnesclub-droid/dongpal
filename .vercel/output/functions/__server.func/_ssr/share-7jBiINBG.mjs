import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as uid } from "./router-BTyiibq2.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none outline-none disabled:pointer-events-none disabled:opacity-40 transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring/60", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-[var(--shadow-border)] hover:bg-[#f6f2ea]",
			secondary: "bg-card-2 text-foreground shadow-[var(--shadow-border)] hover:bg-[#252521]",
			ghost: "bg-transparent text-foreground hover:bg-card-2",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			danger: "bg-owe/15 text-owe hover:bg-owe/25"
		},
		size: {
			default: "h-12 rounded-xl px-5 text-sm",
			sm: "h-10 rounded-lg px-3.5 text-sm",
			lg: "h-14 rounded-2xl px-6 text-base",
			icon: "size-11 rounded-xl",
			pill: "h-10 rounded-full px-4 text-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Drawer$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		shouldScaleBackground: false,
		...props
	});
}
Drawer.Trigger;
Drawer.Close;
var DrawerPortal = Drawer.Portal;
function DrawerOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
		className: cn("fixed inset-0 z-[80] bg-overlay", className),
		...props
	});
}
function DrawerContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
		className: cn("fixed inset-x-0 bottom-0 z-[90] flex max-h-[92dvh] flex-col rounded-t-2xl bg-card outline-none", "shadow-[0_-8px_40px_rgb(0_0_0/0.4)]", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1 w-10 rounded-full bg-foreground/15" }), children]
	})] });
}
function DrawerTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
		className: cn("text-lg font-medium tracking-tight", className),
		...props
	});
}
function DrawerDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-xl bg-card-2 px-4 text-base text-foreground outline-none", "shadow-[var(--shadow-border)] placeholder:text-subtle", "focus-visible:ring-2 focus-visible:ring-ring/50", className),
		...props
	});
}
function PersonAvatar({ member, size = "md", className }) {
	const initial = member.name.trim().charAt(0) || "؟";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 items-center justify-center rounded-full font-medium", size === "sm" && "size-7 text-xs", size === "md" && "size-9 text-sm", size === "lg" && "size-12 text-base", `tone-${member.tone % 8}`, className),
		children: initial
	});
}
function AvatarStack({ members }) {
	const shown = members.slice(0, 4);
	const extra = members.length - shown.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center",
		children: [shown.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
			member: m,
			size: "sm",
			className: cn("ring-2 ring-background", i > 0 && "-mr-2")
		}, m.id)), extra > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "-mr-2 inline-flex size-7 items-center justify-center rounded-full bg-card-2 text-[10px] text-muted ring-2 ring-background",
			children: ["+", extra]
		})]
	});
}
var FA = [
	"۰",
	"۱",
	"۲",
	"۳",
	"۴",
	"۵",
	"۶",
	"۷",
	"۸",
	"۹"
];
function toEnDigits(value) {
	return value.replace(/[۰-۹٠-٩]/g, (ch) => {
		const code = ch.charCodeAt(0);
		if (code >= 1776 && code <= 1785) return String(code - 1776);
		if (code >= 1632 && code <= 1641) return String(code - 1632);
		return ch;
	});
}
function toFaDigits(value) {
	return value.replace(/\d/g, (d) => FA[Number(d)]);
}
function formatGrouped(n, fa) {
	const grouped = Math.abs(Math.round(n)).toLocaleString("en-US").replace(/,/g, fa ? "٬" : ",");
	const signed = n < 0 ? (fa ? "−" : "-") + grouped : grouped;
	return fa ? toFaDigits(signed) : signed;
}
function displayAmount(toman, unit) {
	return unit === "rial" ? toman * 10 : toman;
}
function toToman(input, unit) {
	return unit === "rial" ? Math.round(input / 10) : Math.round(input);
}
function unitLabel(unit) {
	return unit === "rial" ? "ریال" : "تومان";
}
function formatMoney(toman, opts) {
	const body = formatGrouped(displayAmount(toman, opts.unit), opts.fa);
	if (opts.withUnit === false) return body;
	return `${body} ${unitLabel(opts.unit)}`;
}
function parseMoneyInput(raw) {
	const cleaned = toEnDigits(raw).replace(/[^\d]/g, "");
	if (!cleaned) return 0;
	const n = Number(cleaned);
	if (!Number.isFinite(n)) return null;
	return n;
}
var CATEGORIES = [
	{
		id: "food",
		label: "غذا"
	},
	{
		id: "taxi",
		label: "مسیر"
	},
	{
		id: "stay",
		label: "اقامت"
	},
	{
		id: "shop",
		label: "خرید"
	},
	{
		id: "ticket",
		label: "بلیت"
	},
	{
		id: "other",
		label: "دیگر"
	}
];
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? "دیگر";
}
function shareOf(expense, memberId) {
	const { included, amount, mode } = expense;
	if (amount <= 0 || included.length === 0) return 0;
	if (!included.includes(memberId)) return 0;
	if (mode === "exact") return Math.max(0, Math.round(expense.exact?.[memberId] ?? 0));
	if (mode === "shares") {
		const weights = included.map((id) => Math.max(0, expense.shares?.[id] ?? 1));
		const totalW = weights.reduce((a, b) => a + b, 0);
		if (totalW <= 0) return 0;
		return allocateRounded(included.map((id, i) => ({
			id,
			ideal: amount * weights[i] / totalW
		})), amount)[memberId] ?? 0;
	}
	const n = included.length;
	const base = Math.floor(amount / n);
	const rem = amount - base * n;
	const idx = included.indexOf(memberId);
	return base + (idx >= 0 && idx < rem ? 1 : 0);
}
function allocateRounded(parts, total) {
	const floors = parts.map((p) => ({
		id: p.id,
		value: Math.floor(p.ideal),
		frac: p.ideal - Math.floor(p.ideal)
	}));
	let leftover = total - floors.reduce((s, p) => s + p.value, 0);
	floors.slice().sort((a, b) => b.frac - a.frac).forEach((p) => {
		if (leftover > 0) {
			p.value += 1;
			leftover -= 1;
		}
	});
	const out = {};
	for (const p of floors) out[p.id] = p.value;
	return out;
}
function nets(group) {
	const net = {};
	for (const m of group.members) net[m.id] = 0;
	for (const e of group.expenses) {
		if (!net[e.paidBy] && net[e.paidBy] !== 0) net[e.paidBy] = 0;
		net[e.paidBy] += e.amount;
		const ids = /* @__PURE__ */ new Set([...e.included, ...group.members.map((m) => m.id)]);
		for (const id of ids) {
			if (net[id] === void 0) net[id] = 0;
			net[id] -= shareOf(e, id);
		}
	}
	return net;
}
function totalSpent(group) {
	return group.expenses.reduce((s, e) => s + e.amount, 0);
}
function settle(net) {
	const debtors = [];
	const creditors = [];
	for (const [id, v] of Object.entries(net)) if (v < -.5) debtors.push({
		id,
		amt: -v
	});
	else if (v > .5) creditors.push({
		id,
		amt: v
	});
	debtors.sort((a, b) => b.amt - a.amt);
	creditors.sort((a, b) => b.amt - a.amt);
	const transfers = [];
	let i = 0;
	let j = 0;
	while (i < debtors.length && j < creditors.length) {
		const d = debtors[i];
		const c = creditors[j];
		const pay = Math.min(d.amt, c.amt);
		if (pay > 0) {
			transfers.push({
				from: d.id,
				to: c.id,
				amount: Math.round(pay)
			});
			d.amt -= pay;
			c.amt -= pay;
		}
		if (d.amt < .5) i += 1;
		if (c.amt < .5) j += 1;
	}
	return transfers.filter((t) => t.amount > 0);
}
function memberName(group, id) {
	return group.members.find((m) => m.id === id)?.name ?? "نامشخص";
}
function compactGroup(group) {
	return {
		v: 1,
		n: group.name,
		m: group.members.map((m) => ({
			i: m.id,
			n: m.name,
			t: m.tone
		})),
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
			x: e.exact
		}))
	};
}
function expandGroup(data, remapIds = true) {
	const idMap = /* @__PURE__ */ new Map();
	const mapId = (id) => {
		if (!remapIds) return id;
		if (!idMap.has(id)) idMap.set(id, uid("m"));
		return idMap.get(id);
	};
	const members = data.m.map((m) => ({
		id: mapId(m.i),
		name: m.n,
		tone: m.t
	}));
	const expenses = data.e.map((e) => ({
		id: remapIds ? uid("e") : e.i,
		title: e.t,
		amount: e.a,
		paidBy: mapId(e.p),
		category: e.c,
		createdAt: e.d,
		included: e.u.map(mapId),
		mode: e.m,
		shares: e.s ? Object.fromEntries(Object.entries(e.s).map(([k, v]) => [mapId(k), v])) : void 0,
		exact: e.x ? Object.fromEntries(Object.entries(e.x).map(([k, v]) => [mapId(k), v])) : void 0
	}));
	return {
		id: uid("g"),
		name: data.n,
		members,
		expenses,
		createdAt: Date.now()
	};
}
function encodeGroup(group) {
	const json = JSON.stringify(compactGroup(group));
	const bytes = new TextEncoder().encode(json);
	let bin = "";
	bytes.forEach((b) => {
		bin += String.fromCharCode(b);
	});
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decodeGroup(payload) {
	try {
		const pad = payload.replace(/-/g, "+").replace(/_/g, "/");
		const padded = pad + "=".repeat((4 - pad.length % 4) % 4);
		const bin = atob(padded);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		const json = new TextDecoder().decode(bytes);
		const data = JSON.parse(json);
		if (data.v !== 1 || !data.n || !Array.isArray(data.m)) return null;
		return expandGroup(data, true);
	} catch {
		return null;
	}
}
function shareUrl(group) {
	return `${typeof window === "undefined" ? "" : window.location.origin}/?i=${encodeURIComponent(encodeGroup(group))}`;
}
//#endregion
export { unitLabel as C, totalSpent as S, nets as _, DrawerContent as a, shareUrl as b, Input as c, cn as d, decodeGroup as f, memberName as g, formatMoney as h, Drawer$1 as i, PersonAvatar as l, formatGrouped as m, Button as n, DrawerDescription as o, displayAmount as p, CATEGORIES as r, DrawerTitle as s, AvatarStack as t, categoryLabel as u, parseMoneyInput as v, toToman as x, settle as y };
