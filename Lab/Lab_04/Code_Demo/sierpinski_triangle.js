function drawSierpinskiTriangle(ctx, p1, p2, p3, level) {
    if (level === 1) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fill();
      return;
    }
  
    // Trung điểm mỗi cạnh
    const m1 = midpoint(p1, p2);
    const m2 = midpoint(p2, p3);
    const m3 = midpoint(p3, p1);
  
    drawSierpinskiTriangle(ctx, p1, m1, m3, level - 1);
    drawSierpinskiTriangle(ctx, m1, p2, m2, level - 1);
    drawSierpinskiTriangle(ctx, m3, m2, p3, level - 1);
  }
  
  function midpoint(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }
  