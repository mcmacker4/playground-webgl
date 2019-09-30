
const canvas = document.getElementById("playground") as HTMLCanvasElement

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onresize = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

const gl = canvas.getContext("webgl") as WebGLRenderingContext

if (gl == null) {
    throw new Error("WebGL not supported.")
}

gl.clearColor(0.3, 0.6, 0.9, 1.0)

function draw() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    requestAnimationFrame(draw)
}

draw()