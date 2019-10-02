import { vec3 } from "gl-matrix"
import { CreateProgramFromSources } from "./shader"
import { Camera } from "./camera"
import { Model } from "./model"
import { Entity } from "./entity"
import { render } from "./render"

const canvas = document.getElementById("playground") as HTMLCanvasElement

const gl = canvas.getContext("webgl") as WebGLRenderingContext

if (gl == null) {
    throw new Error("WebGL not supported.")
}

gl.clearColor(0.3, 0.6, 0.9, 1.0)

const vertices = [
    //Front +z
    0, 1, 1,
    0, 0, 1,
    1, 0, 1,
    0, 1, 1,
    1, 0, 1,
    1, 1, 1,
    //Back -z
    1, 1, 0,
    1, 0, 0,
    0, 0, 0,
    1, 1, 0,
    0, 0, 0,
    0, 1, 0,
    //Right +x
    1, 1, 1,
    1, 0, 1,
    1, 0, 0,
    1, 1, 1,
    1, 0, 0,
    1, 1, 0,
    //Left -x
    0, 1, 0,
    0, 0, 0,
    0, 0, 1,
    0, 1, 0,
    0, 0, 1,
    0, 1, 1,
    //Up +y
    0, 1, 0,
    0, 1, 1,
    1, 1, 1,
    0, 1, 0,
    1, 1, 1,
    1, 1, 0,
    //Down -y
    0, 0, 1,
    0, 0, 0,
    1, 0, 0,
    0, 0, 1,
    1, 0, 0,
    1, 0, 1
]

const normals = [
    //Front +z
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    //Back -z
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    //Right +x
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    //Left -x
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    //Up +y
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    //Down -y
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0
]

const vShaderSrc = `
attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 _color;
varying vec3 _normal;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position - 0.5, 1.0);
    _color = vec3(1.0);
    _normal = (modelMatrix * vec4(normal, 0.2)).xyz;
}`

const fShaderSrc = `
precision highp float;

varying vec3 _color;
varying vec3 _normal;

const vec3 sundir = normalize(vec3(-1, -1, 1));

void main() {
    float sun = dot(normalize(_normal), sundir);
    gl_FragColor = vec4(_color * max(sun, 0.0), 1.0);
}`

const program = CreateProgramFromSources(gl, vShaderSrc, fShaderSrc)

const camera = new Camera(vec3.set(vec3.create(), 0, 0, 2))

const model = new Model(gl, vertices, normals)
const entity = new Entity(model)

function drawLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)

    entity.rotation[1] += 0.01
    entity.rotation[0] += 0.01

    render(gl, program, camera, entity)

    requestAnimationFrame(drawLoop)
}

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
    camera.updateProjection()
}

window.onresize = resize
resize()

drawLoop()