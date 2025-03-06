export function drawMidpointCircle(p0, p1, rgba, setPixel) {
    let cx = Math.round((p0.x + p1.x) / 2);
    let cy = Math.round((p0.y + p1.y) / 2);
    let radius = Math.round(Math.sqrt((p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2) / 2);

    let x = radius;
    let y = 0;
    let p = 1 - radius; 
    function drawSymmetricPixels(cx, cy, x, y) {
        setPixel(cx + x, cy + y, rgba);
        setPixel(cx - x, cy + y, rgba);
        setPixel(cx + x, cy - y, rgba);
        setPixel(cx - x, cy - y, rgba);
        setPixel(cx + y, cy + x, rgba);
        setPixel(cx - y, cy + x, rgba);
        setPixel(cx + y, cy - x, rgba);
        setPixel(cx - y, cy - x, rgba);
    }

    drawSymmetricPixels(cx, cy, x, y);

    while (x > y) {
        y++;

        if (p <= 0) {
            p += 2 * y + 1;
        } else {
            x--;
            p += 2 * (y - x) + 1;
        }

        drawSymmetricPixels(cx, cy, x, y);
    }
}
