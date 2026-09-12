import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Copy, a as Trash2, c as ShoppingBag, d as Link2, f as House, g as Delete, h as Dices, l as Plus, m as Download, n as Utensils, o as Ticket, p as Ellipsis, r as UserPlus, u as Pencil, v as Car, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useDongi, n as Route } from "./router-BTyiibq2.mjs";
import { C as unitLabel, S as totalSpent, _ as nets, a as DrawerContent, b as shareUrl, c as Input, d as cn, g as memberName, h as formatMoney, i as Drawer$1, l as PersonAvatar, m as formatGrouped, n as Button, o as DrawerDescription, p as displayAmount, r as CATEGORIES, s as DrawerTitle, u as categoryLabel, v as parseMoneyInput, x as toToman, y as settle } from "./share-7jBiINBG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/g._groupId-iXhxk6DM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	food: Utensils,
	taxi: Car,
	stay: House,
	shop: ShoppingBag,
	ticket: Ticket,
	other: Ellipsis
};
function ExpenseFlow({ open, onOpenChange, group, editing }) {
	const settings = useDongi((s) => s.settings);
	const addExpense = useDongi((s) => s.addExpense);
	const updateExpense = useDongi((s) => s.updateExpense);
	const [step, setStep] = (0, import_react.useState)(1);
	const [display, setDisplay] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("food");
	const [paidBy, setPaidBy] = (0, import_react.useState)(group.members[0]?.id ?? "");
	const [included, setIncluded] = (0, import_react.useState)(group.members.map((m) => m.id));
	const [mode, setMode] = (0, import_react.useState)("equal");
	const [shares, setShares] = (0, import_react.useState)({});
	const [exact, setExact] = (0, import_react.useState)({});
	const resetFrom = (expense) => {
		if (expense) {
			const shown = settings.unit === "rial" ? expense.amount * 10 : expense.amount;
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
	function tap(key) {
		if (key === "del") {
			setDisplay((d) => d.slice(0, -1));
			return;
		}
		if (key === "000") {
			setDisplay((d) => d ? d + "000" : d);
			return;
		}
		setDisplay((d) => {
			if (d.length >= 12) return d;
			if (d === "0") return key;
			return d + key;
		});
	}
	function toggleMember(id) {
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
			shares: mode === "shares" ? shares : void 0,
			exact: mode === "exact" ? exact : void 0
		};
		if (editing) updateExpense(group.id, {
			...editing,
			...payload,
			title: title.trim() || editing.title
		});
		else addExpense(group.id, payload);
		toast(editing ? "هزینه ویرایش شد" : "هزینه ثبت شد");
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange: (v) => {
			if (v) resetFrom(editing);
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountStep, {
			display,
			unit: settings.unit,
			fa: settings.faDigits,
			keys: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"000",
				"0",
				"del"
			],
			onTap: tap,
			onNext: () => toman > 0 && setStep(2),
			canNext: toman > 0
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailsStep, {
			group,
			title,
			setTitle,
			category,
			setCategory,
			paidBy,
			setPaidBy,
			included,
			toggleMember,
			mode,
			setMode,
			shares,
			setShares,
			exact,
			setExact,
			toman,
			unit: settings.unit,
			fa: settings.faDigits,
			exactOk,
			exactSum,
			onBack: () => setStep(1),
			onSave: save
		}) })
	});
}
function AmountStep({ display, unit, fa, keys, onTap, onNext, canNext }) {
	const n = parseMoneyInput(display) ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, {
				className: "text-center text-sm font-medium text-muted",
				children: "مبلغ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
				className: "sr-only",
				children: "ورود مبلغ هزینه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tabular-nums text-5xl font-medium tracking-tight text-foreground",
					children: display ? formatGrouped(n, fa) : fa ? "۰" : "0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: unitLabel(unit)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-3 gap-2",
				children: keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "keypad-btn",
					onClick: () => onTap(k),
					children: k === "del" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "mx-auto size-5" }) : fa && k !== "000" ? formatGrouped(Number(k), true) : k
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5 w-full",
				size: "lg",
				disabled: !canNext,
				onClick: onNext,
				children: "ادامه"
			})
		]
	});
}
function DetailsStep(props) {
	const perHead = (0, import_react.useMemo)(() => {
		const n = props.included.length || 1;
		return Math.floor(props.toman / n);
	}, [props.included.length, props.toman]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-h-[92dvh] flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted",
						onClick: props.onBack,
						children: "مبلغ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "جزئیات" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
				className: "sr-only",
				children: "جزئیات هزینه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center tabular-nums text-2xl font-medium",
				children: formatMoney(props.toman, {
					unit: props.unit,
					fa: props.fa
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-5",
				placeholder: "برای چی؟ مثلاً ناهار",
				value: props.title,
				onChange: (e) => props.setTitle(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: CATEGORIES.map((c) => {
					const Icon = ICONS[c.id];
					const on = props.category === c.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => props.setCategory(c.id),
						className: cn("flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-[background-color,color] duration-150", on ? "bg-primary text-primary-foreground" : "bg-card-2 text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), c.label]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs font-medium text-muted",
				children: "کی داده؟"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: props.group.members.map((m) => {
					const on = props.paidBy === m.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => props.setPaidBy(m.id),
						className: cn("flex h-11 items-center gap-2 rounded-full px-2.5 pe-3.5 transition-[background-color] duration-150", on ? "bg-primary text-primary-foreground" : "bg-card-2"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
							member: m,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: m.name
						})]
					}, m.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs font-medium text-muted",
				children: "بین کی تقسیم بشه؟"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: props.group.members.map((m) => {
					const on = props.included.includes(m.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => props.toggleMember(m.id),
						className: cn("flex h-11 items-center gap-2 rounded-full px-2.5 pe-3.5 transition-[opacity,background-color] duration-150", on ? "bg-card-2" : "bg-card-2 opacity-35"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
							member: m,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: m.name
						})]
					}, m.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-3 gap-1 rounded-xl bg-card-2 p-1",
				children: [
					["equal", "مساوی"],
					["shares", "سهمی"],
					["exact", "دقیق"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => props.setMode(id),
					className: cn("h-10 rounded-lg text-sm transition-[background-color,color] duration-150", props.mode === id ? "bg-background text-foreground" : "text-muted"),
					children: label
				}, id))
			}),
			props.mode === "equal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-sm text-muted",
				children: [
					"حدود ",
					formatMoney(perHead, {
						unit: props.unit,
						fa: props.fa
					}),
					" هر نفر"
				]
			}),
			props.mode === "shares" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-2",
				children: props.included.map((id) => {
					const m = props.group.members.find((x) => x.id === id);
					if (!m) return null;
					const v = props.shares[id] ?? 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl bg-card-2 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-9 rounded-lg bg-background text-lg",
									onClick: () => props.setShares({
										...props.shares,
										[id]: Math.max(1, v - 1)
									}),
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-center tabular-nums",
									children: v
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-9 rounded-lg bg-background text-lg",
									onClick: () => props.setShares({
										...props.shares,
										[id]: v + 1
									}),
									children: "+"
								})
							]
						})]
					}, id);
				})
			}),
			props.mode === "exact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [props.included.map((id) => {
					const m = props.group.members.find((x) => x.id === id);
					if (!m) return null;
					const shown = props.exact[id] ? String(displayAmount(props.exact[id], props.unit)) : "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-20 shrink-0 text-sm",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: shown,
							placeholder: "۰",
							onChange: (e) => {
								const n = parseMoneyInput(e.target.value) ?? 0;
								props.setExact({
									...props.exact,
									[id]: toToman(n, props.unit)
								});
							}
						})]
					}, id);
				}), !props.exactOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-owe",
					children: [
						"جمع سهم‌ها باید برابر مبلغ باشد (",
						formatMoney(props.exactSum, {
							unit: props.unit,
							fa: props.fa
						}),
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				size: "lg",
				disabled: !props.exactOk || props.toman <= 0,
				onClick: props.onSave,
				children: "ذخیره هزینه"
			})
		]
	});
}
function LuckyPicker({ open, onOpenChange, members }) {
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const [winner, setWinner] = (0, import_react.useState)(null);
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			if (timer.current) window.clearInterval(timer.current);
		};
	}, []);
	function spin() {
		if (members.length === 0 || spinning) return;
		setWinner(null);
		setSpinning(true);
		let ticks = 0;
		let idx = current;
		const target = 16 + Math.floor(Math.random() * 8);
		timer.current = window.setInterval(() => {
			ticks += 1;
			idx = (idx + 1) % members.length;
			setCurrent(idx);
			if (ticks >= target) {
				if (timer.current) window.clearInterval(timer.current);
				setSpinning(false);
				setWinner(members[idx] ?? members[0]);
			}
		}, 70);
	}
	const shown = winner ?? members[current];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "کی بده؟" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, {
					className: "mt-1",
					children: "قرعه برای دونگ این دور"
				}),
				shown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
						member: shown,
						size: "lg",
						className: "size-20 text-2xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-medium",
						children: shown.name
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8 w-full",
					size: "lg",
					onClick: spin,
					disabled: spinning,
					children: spinning ? "در حال چرخش" : winner ? "دوباره" : "بزن"
				})
			]
		}) })
	});
}
async function renderStoryPng(group, transfers, opts) {
	const w = 1080;
	const h = 1350;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	await document.fonts.ready;
	ctx.fillStyle = "#0c0c0b";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#ece7dc";
	ctx.fillRect(72, 72, 120, 8);
	ctx.fillStyle = "#8a8780";
	ctx.font = "500 36px Vazirmatn, sans-serif";
	ctx.textAlign = "right";
	ctx.direction = "rtl";
	ctx.fillText("دونگی", 1008, 120);
	ctx.fillStyle = "#f3f1ea";
	ctx.font = "600 72px Vazirmatn, sans-serif";
	ctx.fillText(group.name, 1008, 210);
	ctx.fillStyle = "#8a8780";
	ctx.font = "400 32px Vazirmatn, sans-serif";
	ctx.fillText("کمترین جابه‌جایی برای تسویه", 1008, 270);
	if (transfers.length === 0) {
		ctx.fillStyle = "#8aa384";
		ctx.font = "500 48px Vazirmatn, sans-serif";
		ctx.fillText("حساب‌ها صاف است", 1008, 420);
	} else {
		let y = 380;
		for (const t of transfers.slice(0, 8)) {
			ctx.fillStyle = "#1a1a17";
			roundRect(ctx, 72, y, 936, 110, 28);
			ctx.fill();
			ctx.fillStyle = "#f3f1ea";
			ctx.font = "500 36px Vazirmatn, sans-serif";
			ctx.textAlign = "right";
			const line = `${memberName(group, t.from)}  ←  ${memberName(group, t.to)}`;
			ctx.fillText(line, 976, y + 48);
			ctx.fillStyle = "#c47a62";
			ctx.font = "600 32px Vazirmatn, sans-serif";
			ctx.fillText(formatMoney(t.amount, {
				unit: opts.unit,
				fa: opts.fa
			}), 976, y + 88);
			y += 130;
		}
	}
	ctx.fillStyle = "#5c5a55";
	ctx.font = "400 26px Vazirmatn, sans-serif";
	ctx.textAlign = "right";
	ctx.fillText("ساخته‌شده با دونگی", 1008, 1270);
	return await new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) resolve(blob);
			else reject(/* @__PURE__ */ new Error("blob"));
		}, "image/png");
	});
}
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function GroupScreen({ group }) {
	const navigate = useNavigate();
	const settings = useDongi((s) => s.settings);
	const addMember = useDongi((s) => s.addMember);
	const removeExpense = useDongi((s) => s.removeExpense);
	const applySettlements = useDongi((s) => s.applySettlements);
	const deleteGroup = useDongi((s) => s.deleteGroup);
	const renameGroup = useDongi((s) => s.renameGroup);
	const [tab, setTab] = (0, import_react.useState)("exp");
	const [flow, setFlow] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [lucky, setLucky] = (0, import_react.useState)(false);
	const [memberOpen, setMemberOpen] = (0, import_react.useState)(false);
	const [newMember, setNewMember] = (0, import_react.useState)("");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const net = (0, import_react.useMemo)(() => nets(group), [group]);
	const transfers = (0, import_react.useMemo)(() => settle(net), [net]);
	const spent = totalSpent(group);
	const allZero = transfers.length === 0 && group.expenses.length > 0;
	function copyText(text, ok) {
		navigator.clipboard.writeText(text).then(() => toast(ok), () => toast("کپی نشد"));
	}
	function settlementText() {
		if (transfers.length === 0) return `${group.name} — حساب‌ها صاف است.`;
		const lines = transfers.map((t) => `${memberName(group, t.from)} به ${memberName(group, t.to)} بده: ${formatMoney(t.amount, {
			unit: settings.unit,
			fa: settings.faDigits
		})}`);
		return [
			`دونگ ${group.name}`,
			...lines,
			"— دونگی"
		].join("\n");
	}
	async function shareLink() {
		const url = shareUrl(group);
		if (navigator.share) try {
			await navigator.share({
				title: `دونگ ${group.name}`,
				url,
				text: settlementText()
			});
			return;
		} catch {}
		copyText(url, "لینک دونگ کپی شد");
	}
	async function exportStory() {
		try {
			const blob = await renderStoryPng(group, transfers, {
				unit: settings.unit,
				fa: settings.faDigits
			});
			const file = new File([blob], "dongi.png", { type: "image/png" });
			if (navigator.share && navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: group.name
				});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg pb-36 pt-[max(0.75rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]",
						"aria-label": "بازگشت",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: group.name,
							onChange: (e) => renameGroup(group.id, e.target.value),
							className: "w-full bg-transparent text-lg font-medium outline-none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLucky(true),
						className: "inline-flex size-11 items-center justify-center rounded-xl bg-card shadow-[var(--shadow-border)]",
						"aria-label": "کی بده",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-5 mt-5 rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "جمع خرج"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 tabular-nums text-3xl font-medium tracking-tight",
						children: formatMoney(spent, {
							unit: settings.unit,
							fa: settings.faDigits
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid grid-cols-2 gap-2",
						children: group.members.map((m) => {
							const v = net[m.id] ?? 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-xl bg-card-2 px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
									member: m,
									size: "sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("tabular-nums text-xs", v > .5 ? "text-owed" : v < -.5 ? "text-owe" : "text-muted"),
										children: v > .5 ? `طلب ${formatMoney(v, {
											unit: settings.unit,
											fa: settings.faDigits,
											withUnit: false
										})}` : v < -.5 ? `بدهکار ${formatMoney(-v, {
											unit: settings.unit,
											fa: settings.faDigits,
											withUnit: false
										})}` : "صاف"
									})]
								})]
							}, m.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMemberOpen(true),
						className: "mt-3 inline-flex h-10 items-center gap-1.5 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), "نفر جدید"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-5 mt-6 grid grid-cols-2 gap-1 rounded-xl bg-card p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("exp"),
					className: cn("h-10 rounded-lg text-sm transition-[background-color] duration-150", tab === "exp" ? "bg-card-2" : "text-muted"),
					children: "هزینه‌ها"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("set"),
					className: cn("h-10 rounded-lg text-sm transition-[background-color] duration-150", tab === "set" ? "bg-card-2" : "text-muted"),
					children: "بده‌بستان"
				})]
			}),
			tab === "exp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "stagger-in mt-4 space-y-2 px-5",
				children: [group.expenses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-card px-5 py-10 text-center text-sm text-muted",
					children: "هنوز هزینه‌ای ثبت نشده. اولی را اضافه کن."
				}), group.expenses.map((e) => {
					const payer = group.members.find((m) => m.id === e.paidBy);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-border)]",
						children: [
							payer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, { member: payer }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: e.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 truncate text-xs text-muted",
										children: [
											payer?.name,
											" · ",
											categoryLabel(e.category),
											" · ",
											e.included.length,
											" نفر"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 truncate tabular-nums text-sm",
										children: formatMoney(e.amount, {
											unit: settings.unit,
											fa: settings.faDigits
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 self-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center text-muted",
									onClick: () => {
										setEditing(e);
										setFlow(true);
									},
									"aria-label": "ویرایش",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center text-muted",
									onClick: () => removeExpense(group.id, e.id),
									"aria-label": "حذف",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							})
						]
					}, e.id);
				})]
			}),
			tab === "set" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "stagger-in mt-4 space-y-3 px-5",
				children: [
					allZero && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card px-5 py-8 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-owed",
							children: "حساب‌ها صاف است"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "هیچکس به کسی بدهکار نیست."
						})]
					}),
					group.expenses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl bg-card px-5 py-8 text-center text-sm text-muted",
						children: "اول چند هزینه ثبت کن تا دونگ مشخص شود."
					}),
					transfers.map((t) => {
						const from = group.members.find((m) => m.id === t.from);
						const to = group.members.find((m) => m.id === t.to);
						const line = `${memberName(group, t.from)} به ${memberName(group, t.to)} بده: ${formatMoney(t.amount, {
							unit: settings.unit,
							fa: settings.faDigits
						})}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											from && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
												member: from,
												size: "sm"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-muted",
												children: "بده به"
											}),
											to && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonAvatar, {
												member: to,
												size: "sm"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-11 items-center justify-center text-muted",
										onClick: () => copyText(line, "پیام کپی شد"),
										"aria-label": "کپی",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: [
										from?.name,
										" → ",
										to?.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 tabular-nums text-xl font-medium text-owe",
									children: formatMoney(t.amount, {
										unit: settings.unit,
										fa: settings.faDigits
									})
								})
							]
						}, `${t.from}-${t.to}`);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => copyText(settlementText(), "متن تسویه کپی شد"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "کپی متن"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => void shareLink(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), "لینک دونگ"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: () => void exportStory(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "تصویر استوری"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								disabled: transfers.length === 0,
								onClick: () => {
									applySettlements(group.id, transfers);
									toast("تسویه ثبت شد");
								},
								children: "ثبت تسویه"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-5 mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-subtle",
					onClick: () => setConfirmDelete(true),
					children: "حذف دورهمی"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "pointer-events-auto w-full",
					size: "lg",
					onClick: () => {
						setEditing(null);
						setFlow(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "هزینه جدید"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseFlow, {
				open: flow,
				onOpenChange: setFlow,
				group,
				editing
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LuckyPicker, {
				open: lucky,
				onOpenChange: setLucky,
				members: group.members
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: memberOpen,
				onOpenChange: setMemberOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "نفر جدید" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, { children: "به این دورهمی اضافه می‌شود." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-4",
							placeholder: "اسم",
							value: newMember,
							onChange: (e) => setNewMember(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							onClick: () => {
								if (!newMember.trim()) return;
								addMember(group.id, newMember);
								setNewMember("");
								setMemberOpen(false);
							},
							children: "افزودن"
						})
					]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "حذف شود؟" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerDescription, { children: "این دورهمی از این دستگاه پاک می‌شود." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-5 w-full",
							variant: "danger",
							onClick: () => {
								deleteGroup(group.id);
								navigate({ to: "/" });
							},
							children: "حذف"
						})
					]
				}) })
			})
		]
	});
}
function GroupRoute() {
	const { groupId } = Route.useParams();
	const hydrated = useDongi((s) => s.hydrated);
	const group = useDongi((s) => s.groups.find((g) => g.id === groupId));
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg px-5 pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 rounded-lg bg-card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-40 rounded-2xl bg-card" })]
	});
	if (!group) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium",
				children: "این دورهمی پیدا نشد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "شاید از این دستگاه حذف شده."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 text-sm text-primary",
				children: "بازگشت"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupScreen, { group });
}
//#endregion
export { GroupRoute as component };
