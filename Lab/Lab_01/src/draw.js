import { drawLine_daa } from './algorithm/daa.js';
import { drawLine_Bresenham } from './algorithm/bresenham.js';
import { drawMidpointCircle } from './algorithm/midpoint.js';
import { drawMidpointEllipse } from './algorithm/ellipse.js';

var algorithmSelect = document.getElementById("algorithm");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 800;
var height = 600;

var bgRgba = [205, 232, 206, 255];
var pointRgba = [0, 0, 255, 255];
var lineRgba, vlineRgba;

function updateColors() {
    if (algorithmSelect.value === "dda") {
        lineRgba = [255, 255, 255, 255];
        vlineRgba = [255, 255, 255, 255];
    } else if (algorithmSelect.value === "bresenham") {
        lineRgba = [0, 0, 0, 255];
        vlineRgba = [0, 0, 0, 255];
    } else if (algorithmSelect.value === "midpoint") {
        lineRgba = [0, 0, 255, 255]; 
        vlineRgba = [0, 0, 255, 255];
    }
    else if (algorithmSelect.value === "ellipse") {
        lineRgba = [255, 0, 0, 255]; 
        vlineRgba = [255, 0, 0, 255];
    }
    
}

updateColors(); // Set initial colors

canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

function Painter(context, width, height) {
    this.context = context;
    this.imageData = context.createImageData(width, height);
    this.points = [];
    this.width = width;
    this.height = height;

    this.getPixelIndex = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return -1;
        return (x + y * width) << 2;
    };

    this.setPixel = function(x, y, rgba) {
        var pixelIndex = this.getPixelIndex(x, y);
        if (pixelIndex == -1) return;
        for (var i = 0; i < 4; i++) {
            this.imageData.data[pixelIndex + i] = rgba[i];
        }
    };

    this.drawPoint = function(p, rgba) {
        var x = p[0];
        var y = p[1];
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                this.setPixel(x + i, y + j, rgba);
    };

    this.drawLine = function(p0, p1, rgba) {
        let algorithm = algorithmSelect.value;
        if (algorithm === "dda") {
            drawLine_daa(p0, p1, rgba, this.setPixel.bind(this));
        } else if (algorithm === "bresenham") {
            drawLine_Bresenham(p0, p1, rgba, this.setPixel.bind(this));
        } else if (algorithm === "midpoint") {
            drawMidpointCircle({ x: p0[0], y: p0[1] }, { x: p1[0], y: p1[1] }, rgba, this.setPixel.bind(this));
        } else if (algorithm === "ellipse") {
            let centerX = p0[0], centerY = p0[1];
            let radiusX = Math.abs(p1[0] - centerX);
            let radiusY = Math.abs(p1[1] - centerY);
            drawMidpointEllipse(centerX, centerY, radiusX, radiusY, rgba, this.setPixel.bind(this));
        }
    };

    this.drawBkg = function() {
        for (var i = 0; i < this.width; i++)
            for (var j = 0; j < this.height; j++)
                this.setPixel(i, j, bgRgba);
    };

    this.clear = function() {
        this.points.length = 0;
        this.drawBkg();
        this.context.putImageData(this.imageData, 0, 0);
    };

    this.addPoint = function(p) {
        this.points.push(p);
    };

    this.draw = function(p) {
        updateColors();
        var n = this.points.length;
        this.drawBkg();
        for (var i = 0; i < n; i++) this.drawPoint(this.points[i], pointRgba);
        
        if (algorithmSelect.value === "midpoint" && n >= 2) {
            this.drawLine(this.points[n - 2], this.points[n - 1], lineRgba);
        } else {
            for (var i = 0; i < n - 1; i++) this.drawLine(this.points[i], this.points[i + 1], lineRgba);
            if (n > 0 && (this.points[n - 1][0] != p[0] || this.points[n - 1][1] != p[1])) {
                this.drawLine(this.points[n - 1], p, vlineRgba);
            }
        }

        this.context.putImageData(this.imageData, 0, 0);
    };

    this.clear();
}

var painter = new Painter(context, width, height);

algorithmSelect.addEventListener("change", function() {
    updateColors();
    painter.clear();
});

function getPosOnCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return [
        Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
        Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)
    ];
}

function doMouseMove(e) {
    if (state === 0 || state === 2) return;
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.draw(p);
}

function doMouseDown(e) {
    if (state === 2 || e.button !== 0) return;
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.addPoint(p);
    painter.draw(p);

    if ((algorithmSelect.value === "midpoint" || algorithmSelect.value === "ellipse") && painter.points.length === 2) {
        state = 2;
        painter.draw(painter.points[painter.points.length - 1]);
    } else if (state === 0) {
        state = 1;
    }
}

function doKeyDown(e) {
    if (state === 2) return;
    if (e.key === "Escape" && state === 1) {
        state = 2;
        painter.draw(painter.points[painter.points.length - 1]);
    }
}

function doReset() {
    if (state === 0) return;
    state = 0;
    painter.clear();
}

canvas.addEventListener("mousedown", doMouseDown, false);
canvas.addEventListener("mousemove", doMouseMove, false);
window.addEventListener("keydown", doKeyDown, false);

document.getElementById("reset").addEventListener("click", doReset, false);

var state = 0;
