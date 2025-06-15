function drawMinkowskiIsland(ctx, level) {
  const size = 300;
  const startX = 150;
  const startY = 150;

  const square = [
    { x: startX, y: startY + size },  // Bottom-left
    { x: startX + size, y: startY + size },  // Bottom-right
    { x: startX + size, y: startY },  // Top-right
    { x: startX, y: startY }          // Top-left
  ];

  ctx.beginPath();
  ctx.moveTo(square[0].x, square[0].y);

  for (let i = 0; i < 4; i++) {
    const from = square[i];
    const to = square[(i + 1) % 4];
    const path = generateMinkowskiEdge(from, to, level);
    for (let j = 1; j < path.length; j++) {
      ctx.lineTo(path[j].x, path[j].y);
    }
  }

  ctx.closePath();
  ctx.stroke();
}

function generateMinkowskiEdge(p1, p2, level) {
  if (level === 0) return [p1, p2];

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const dirX = dx / length;
  const dirY = dy / length;
  const segment = length / 4;

  const points = [];

  // Đoạn 1 – giữ nguyên
  const A = {
    x: p1.x + dirX * segment,
    y: p1.y + dirY * segment
  };
  points.push(...generateMinkowskiEdge(p1, A, level - 1));

  // Đoạn 2 – hình vuông nhô ra xuống/phải
  const B1 = {
    x: A.x + dirX * segment,
    y: A.y + dirY * segment
  };

  const normalDir = {
    x: -dirY, // vuông góc với (dirX, dirY)
    y: dirX
  };

  const B2 = {
    x: A.x + normalDir.x * segment,
    y: A.y + normalDir.y * segment
  };

  const B3 = {
    x: B2.x + dirX * segment,
    y: B2.y + dirY * segment
  };

  points.push(...generateMinkowskiEdge(A, B2, level - 1));
  points.push(...generateMinkowskiEdge(B2, B3, level - 1));
  points.push(...generateMinkowskiEdge(B3, B1, level - 1));

  // Đoạn 3 – hình vuông nhô ra lên/trái
  const flipNormal = {
    x: -normalDir.x,
    y: -normalDir.y
  };

  const C1 = {
    x: B1.x + flipNormal.x * segment,
    y: B1.y + flipNormal.y * segment
  };

  const C2 = {
    x: C1.x + dirX * segment,
    y: C1.y + dirY * segment
  };

  const C3 = {
    x: B1.x + dirX * segment,
    y: B1.y + dirY * segment
  };

  points.push(...generateMinkowskiEdge(B1, C1, level - 1));
  points.push(...generateMinkowskiEdge(C1, C2, level - 1));
  points.push(...generateMinkowskiEdge(C2, C3, level - 1));

  // Đoạn 4 – giữ nguyên
  points.push(...generateMinkowskiEdge(C3, p2, level - 1));

  return points;
}
