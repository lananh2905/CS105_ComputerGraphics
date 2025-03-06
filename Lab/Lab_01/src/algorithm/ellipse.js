export function drawMidpointEllipse(centerX, centerY, radiusX, radiusY, rgba, setPixel) {
    let x = 0, y = radiusY;
    let p1 = radiusY * radiusY - radiusX * radiusX * radiusY + 0.25 * radiusX * radiusX;
    let dx = 2 * radiusY * radiusY * x;
    let dy = 2 * radiusX * radiusX * y;

    function plotEllipsePoints(cx, cy, x, y) {
        setPixel(cx + x, cy + y, rgba);
        setPixel(cx - x, cy + y, rgba);
        setPixel(cx + x, cy - y, rgba);
        setPixel(cx - x, cy - y, rgba);
    }

    while (dx < dy) {
        plotEllipsePoints(centerX, centerY, x, y);
        x++;
        dx += 2 * radiusY * radiusY;
        if (p1 < 0) {
            p1 += dx + radiusY * radiusY;
        } else {
            y--;
            dy -= 2 * radiusX * radiusX;
            p1 += dx - dy + radiusY * radiusY;
        }
    }

    let p2 = radiusY * radiusY * (x + 0.5) * (x + 0.5) + radiusX * radiusX * (y - 1) * (y - 1) - radiusX * radiusX * radiusY * radiusY;

    while (y >= 0) {
        plotEllipsePoints(centerX, centerY, x, y);
        y--;
        dy -= 2 * radiusX * radiusX;
        if (p2 > 0) {
            p2 += radiusX * radiusX - dy;
        } else {
            x++;
            dx += 2 * radiusY * radiusY;
            p2 += dx - dy + radiusX * radiusX;
        }
    }
}
