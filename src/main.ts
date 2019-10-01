import { vec3 } from "gl-matrix"
import { CreateProgramFromSources } from "./shader"
import { Camera } from "./camera"
import { Model } from "./model"
import { Entity } from "./entity"
import { render } from "./render"

const canvas = document.getElementById("playground") as HTMLCanvasElement

const gl = canvas.getContext("webgl") as WebGLRenderingContext

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
}

window.onresize = resize
resize()

if (gl == null) {
    throw new Error("WebGL not supported.")
}

gl.clearColor(0.3, 0.6, 0.9, 1.0)

const vertices = [
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5, 0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0
]

const vShaderSrc = `
attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec4 _color;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    _color = vec4(position + 0.5, 1.0);
}`

const fShaderSrc = `
precision highp float;

varying vec4 _color;

void main() {
    gl_FragColor = _color;
}`

const program = CreateProgramFromSources(gl, vShaderSrc, fShaderSrc)

const camera = new Camera(vec3.set(vec3.create(), 0, 0, 2))

const model = new Model(gl, vertices)
const entity = new Entity(model)

function drawLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    entity.rotation[1] += 0.05

    render(gl, program, camera, entity)

    requestAnimationFrame(drawLoop)
}

drawLoop()