import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as Plus, s as SlidersHorizontal, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useDongi, r as Route$1 } from "./router-BTyiibq2.mjs";
import { S as totalSpent, a as DrawerContent, c as Input, d as cn, f as decodeGroup, h as formatMoney, i as Drawer$1, n as Button, o as DrawerDescription, s as DrawerTitle, t as AvatarStack } from "./share-7jBiINBG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D-5gBVQ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CreateGroup({ open, onOpenChange }) {
	const navigate = useNavigate();
	const createGroup = useDongi((s) => s.createGroup);
	const [name, setName] = (0, import_react.useState)("");
	const [member, setMember] = (0, import_react.useState)("");
	const [members, setMembers] = (0, import_react.useState)(["تو"]);
	function addMember() {
		const t = member.trim();
		if (!t) return;
		setMembers((m) => [...m, t]);
		setMember("");
	}
	function submit() {
		const id = createGroup(name || "دورهمی جدید", members);
		onOpenChange(false);
		setName("");
		setMembers(["تو"]);
		navigate({
			to: "/g/$groupId",
			params: { groupId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "دورهمی جدید" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "mt-1",
					children: "اسم گروه و نفرات را بنویس. بعداً هم می‌شود اضافه کرد."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-5",
					placeholder: "مثلاً سفر شمال، خانه، شام جمعه",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "اسم نفر",
						value: member,
						onChange: (e) => setMember(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addMember();
							}
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: addMember,
						children: "افزودن"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: members.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex h-9 items-center gap-1 rounded-full bg-card-2 px-3 text-sm",
						children: [m, members.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-muted",
							onClick: () => setMembers((list) => list.filter((_, idx) => idx !== i)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})]
					}, `${m}-${i}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					size: "lg",
					onClick: submit,
					children: "بساز"
				})
			]
		}) })
	});
}
function HomeScreen({ importToken }) {
	const navigate = useNavigate();
	const hydrated = useDongi((s) => s.hydrated);
	const groups = useDongi((s) => s.groups);
	const settings = useDongi((s) => s.settings);
	const setUnit = useDongi((s) => s.setUnit);
	const setFaDigits = useDongi((s) => s.setFaDigits);
	const importGroup = useDongi((s) => s.importGroup);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!hydrated || !importToken) return;
		const g = decodeGroup(importToken);
		if (!g) {
			toast("لینک دونگ نامعتبر بود");
			return;
		}
		const id = importGroup(g);
		toast("دورهمی اضافه شد");
		navigate({
			to: "/g/$groupId",
			params: { groupId: id },
			search: {}
		});
	}, [
		hydrated,
		importToken,
		importGroup,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg px-5 pb-36 pt-[max(1.25rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.2em] text-muted",
					children: "DONGI"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-3xl font-medium tracking-tight",
					children: "دونگی"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSettingsOpen((v) => !v),
					className: "inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]",
					"aria-label": "تنظیمات",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" })
				})]
			}),
			settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "واحد نمایش"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-2 gap-1 rounded-xl bg-card-2 p-1",
						children: ["toman", "rial"].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setUnit(u),
							className: cn("h-10 rounded-lg text-sm", settings.unit === u ? "bg-background" : "text-muted"),
							children: u === "toman" ? "تومان" : "ریال"
						}, u))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs font-medium text-muted",
						children: "ارقام"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-2 gap-1 rounded-xl bg-card-2 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFaDigits(true),
							className: cn("h-10 rounded-lg text-sm", settings.faDigits ? "bg-background" : "text-muted"),
							children: "فارسی"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFaDigits(false),
							className: cn("h-10 rounded-lg text-sm", !settings.faDigits ? "bg-background" : "text-muted"),
							children: "123"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 max-w-[18ch] text-lg leading-snug text-muted",
				children: "هزینه‌ها را بنویس. دونگ را دونگی حساب می‌کند."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in mt-8 space-y-3",
				children: [hydrated && groups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card px-5 py-10 text-center shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-foreground",
						children: "هنوز دورهمی‌ای نیست"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "یک گروه بساز یا از لینک دونگ وارد شو."
					})]
				}), groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/g/$groupId",
					params: { groupId: g.id },
					className: "block rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: g.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								g.members.length,
								" نفر · ",
								g.expenses.length,
								" هزینه"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarStack, { members: g.members })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 tabular-nums text-sm text-muted",
						children: [
							"جمع خرج",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: formatMoney(totalSpent(g), {
									unit: settings.unit,
									fa: settings.faDigits
								})
							})
						]
					})]
				}, g.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "pointer-events-auto w-full shadow-lg",
					size: "lg",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "دورهمی جدید"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateGroup, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
function Home() {
	const { i } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, { importToken: i });
}
//#endregion
export { Home as component };
