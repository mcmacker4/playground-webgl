import { CreateShader, CreateProgram } from "./shader"

const canvas = document.getElementById("playground") as HTMLCanvasElement

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gl = canvas.getContext("webgl") as WebGLRenderingContext

window.onresize = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
}

if (gl == null) {
    throw new Error("WebGL not supported.")
}

gl.clearColor(0.3, 0.6, 0.9, 1.0)

const vertices = new Float32Array([
    -1, 1, 0,
    -1, -1, 0,
    1, -1, 0,
    -1, 1, 0,
    1, -1, 0,
    1, 1, 0
])

const vShaderSrc = `
attribute vec3 position;

varying vec4 _color;

void main() {
    gl_Position = vec4(position / 2.0, 1.0);
    _color = vec4(position / 2.0 + 0.5, 1.0);
}`

const fShaderSrc = `
precision highp float;

varying vec4 _color;

void main() {
    gl_FragColor = _color;
}`

const vShader = CreateShader(gl, gl.VERTEX_SHADER, vShaderSrc)
const fShader = CreateShader(gl, gl.FRAGMENT_SHADER, fShaderSrc)

const program = CreateProgram(gl, vShader, fShader)

const buffer = gl.createBuffer()

gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

gl.useProgram(program)

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(0)
    gl.bindAttribLocation(program, 0, "position")
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)

    requestAnimationFrame(draw)
}

draw()