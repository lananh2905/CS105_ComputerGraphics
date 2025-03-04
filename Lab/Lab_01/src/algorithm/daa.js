function drawLine_daa(p0, p1, rgba, setPixel) {
    var x0 = p0[0], y0 = p0[1];
    var x1 = p1[0], y1 = p1[1];
    var dx = x1 - x0, dy = y1 - y0;
    if (dx == 0 && dy == 0)
        return;
    if (Math.abs(dy) <= Math.abs(dx)) {
        if (x1 < x0) {
            var tx = x0; x0 = x1; x1 = tx;
            var ty = y0; y0 = y1; y1 = ty;
        }
        var k = dy / dx;
        var y = y0;
        for (var x = x0; x <= x1; x++) {
            setPixel(x, Math.floor(y + 0.5), rgba);
            y = y + k;
        }
    }
    else {
        if (y1 < y0) {
            var tx = x0; x0 = x1; x1 = tx;
            var ty = y0; y0 = y1; y1 = ty;
        }
        var k = dx / dy;
        var x = x0;
        for (var y = y0; y <= y1; y++) {
            setPixel(Math.floor(x + 0.5), y, rgba);
            x = x + k;
        }
    }
}

export { drawLine_daa };