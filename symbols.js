import {d3} from "./namespaces.js";

export const symbolSquare = symbol((ctx, x, y, size) => {
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
});

export const symbolCircle = symbol((ctx, x, y, size) => {
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
});

export const symbolDiamond = symbol((ctx, x, y, size) => {
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x, y + size / 2);
  ctx.lineTo(x + size / 2, y + size);
  ctx.lineTo(x + size, y + size / 2);
  ctx.closePath();
});

export const symbolX = symbol((ctx, x, y, size) => {
  const b = size / 2;
  const a = b / 2;
  ctx.moveTo(x + a, y);
  ctx.lineTo(x, y + a);
  ctx.lineTo(x + a, y + b);
  ctx.lineTo(x, y + b + a);
  ctx.lineTo(x + a, y + b + b);
  ctx.lineTo(x + b, y + b + a);
  ctx.lineTo(x + a + b, y + b + b);
  ctx.lineTo(x + b + b, y + a + b);
  ctx.lineTo(x + a + b, y + b);
  ctx.lineTo(x + b + b, y + a);
  ctx.lineTo(x + a + b, y);
  ctx.lineTo(x + b, y + a);
  ctx.closePath();
});

function symbol(generator) {
  return (...params) => {
    const context = d3.path();
    generator(context, ...params);
    return context.toString();
  };
}
