import { formatMoney, type Unit } from "./money";
import { memberName, type Group, type Transfer } from "./split";

export async function renderStoryPng(
  group: Group,
  transfers: Transfer[],
  opts: { unit: Unit; fa: boolean },
): Promise<Blob> {
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
  ctx.fillText("دنگ‌پال", w - 72, 120);

  ctx.fillStyle = "#f3f1ea";
  ctx.font = "600 72px Vazirmatn, sans-serif";
  ctx.fillText(group.name, w - 72, 210);

  ctx.fillStyle = "#8a8780";
  ctx.font = "400 32px Vazirmatn, sans-serif";
  ctx.fillText("کمترین جابه‌جایی برای تسویه", w - 72, 270);

  if (transfers.length === 0) {
    ctx.fillStyle = "#8aa384";
    ctx.font = "500 48px Vazirmatn, sans-serif";
    ctx.fillText("حساب‌ها صاف است", w - 72, 420);
  } else {
    let y = 380;
    for (const t of transfers.slice(0, 8)) {
      ctx.fillStyle = "#1a1a17";
      roundRect(ctx, 72, y, w - 144, 110, 28);
      ctx.fill();

      ctx.fillStyle = "#f3f1ea";
      ctx.font = "500 36px Vazirmatn, sans-serif";
      ctx.textAlign = "right";
      const line = `${memberName(group, t.from)}  ←  ${memberName(group, t.to)}`;
      ctx.fillText(line, w - 104, y + 48);

      ctx.fillStyle = "#c47a62";
      ctx.font = "600 32px Vazirmatn, sans-serif";
      ctx.fillText(
        formatMoney(t.amount, { unit: opts.unit, fa: opts.fa }),
        w - 104,
        y + 88,
      );
      y += 130;
    }
  }

  ctx.fillStyle = "#5c5a55";
  ctx.font = "400 26px Vazirmatn, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("ساخته‌شده با دنگ‌پال", w - 72, h - 80);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("blob"));
    }, "image/png");
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
