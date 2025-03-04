export function drawLine_Bresenham(p0, p1, rgba, setPixel) {
    let x0 = p0[0], y0 = p0[1];
    let x1 = p1[0], y1 = p1[1];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        setPixel(x0, y0, rgba);

        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}
