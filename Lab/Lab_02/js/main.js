function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var rotationLocation = gl.getUniformLocation(program, "u_rotation");
    var scaleLocation = gl.getUniformLocation(program, "u_scale");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    var angle = 0;        
    var direction = 1; 
    var translation = [100, 150];
    var rotation = [0, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];
    var scale = [1, 1];
    var isAnimating = false; 

    drawScene();

    // Setup UI sliders
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width - 100});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height - 100});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: 0.1, max: 3.1, step: 1});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: 0.1, max: 3.1, step: 1});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        var angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(colorLocation, color);
        gl.uniform2fv(translationLocation, translation);
        gl.uniform2fv(rotationLocation, rotation);
        gl.uniform2fv(scaleLocation, scale);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function animate() {
        if (!isAnimating) return;
        
        angle += 0.02;
        translation[0] += direction * 2;
        
        if (translation[0] > gl.canvas.width - 100 || translation[0] < 0) {
            direction *= -1;
        }
        
        var angleInRadians = angle;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        
        drawScene();
        requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            animate();
        }
    }

    document.getElementById("startButton").addEventListener("click", function() {
        startAnimation();
    });

    document.getElementById("stopButton").addEventListener("click", function() {
        isAnimating = false;
    });
}

// Correct geometry setup
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,     // Bottom-left
            200, 0,   // Bottom-right
            100, 200,  // Top
        ]),
        gl.STATIC_DRAW
    );
}

main();
