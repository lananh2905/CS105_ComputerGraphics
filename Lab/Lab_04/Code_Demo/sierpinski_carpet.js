function drawSierpinski(ctx, x, y, size, level) {
    if (level === 1) {
      ctx.fillRect(x, y, size, size);
      return;
    }
    const newSize = size / 3;
    for (let dx = 0; dx < 3; dx++) {
      for (let dy = 0; dy < 3; dy++) {
        if (dx === 1 && dy === 1) continue; // bỏ ô trung tâm
        drawSierpinski(ctx, x + dx * newSize, y + dy * newSize, newSize, level - 1);
      }
    }
  }
  