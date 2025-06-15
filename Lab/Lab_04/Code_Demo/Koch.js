function drawKochSnowflake(ctx, level) {
  const size = 350;
  const height = size * Math.sqrt(3) / 2;

  const centerX = 300;
  const centerY = 250;

  const A = { x: centerX, y: centerY - height / 2 };
  const B = { x: centerX - size / 2, y: centerY + height / 2 };
  const C = { x: centerX + size / 2, y: centerY + height / 2 };

  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  drawKoch(ctx, A, B, level);
  drawKoch(ctx, B, C, level);
  drawKoch(ctx, C, A, level);
  ctx.stroke();
}

function drawKoch(ctx, p1, p2, level) {
  if (level === 0) {
    ctx.lineTo(p2.x, p2.y);
    return;
  }

  const dx = (p2.x - p1.x) / 3;
  const dy = (p2.y - p1.y) / 3;

  const pa = { x: p1.x + dx, y: p1.y + dy };
  const pb = { x: p1.x + 2 * dx, y: p1.y + 2 * dy };

  const baseAngle = Math.atan2(dy, dx);
  const angle = baseAngle + Math.PI / 3;
  const length = Math.hypot(dx, dy);

  const peak = {
    x: pa.x + Math.cos(angle) * length,
    y: pa.y + Math.sin(angle) * length
  };

  drawKoch(ctx, p1, pa, level - 1);
  drawKoch(ctx, pa, peak, level - 1);
  drawKoch(ctx, peak, pb, level - 1);
  drawKoch(ctx, pb, p2, level - 1);
}
