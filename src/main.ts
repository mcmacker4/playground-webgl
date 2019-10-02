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

varying vec3 _position;
varying vec3 _color;
varying vec3 _normal;

void main() {
    vec4 pos = modelMatrix * vec4(position - 0.5, 1.0);
    gl_Position = projectionMatrix * viewMatrix * pos;
    _position = pos.xyz;
    _color = pos.xyz;
    _normal = (modelMatrix * vec4(normal, 0.2)).xyz;
}`

const fShaderSrc = `
precision highp float;

varying vec3 _position;
varying vec3 _color;
varying vec3 _normal;

uniform vec3 campos;

const vec3 lightpos = vec3(1, 1, 1);
const float specstrength = 0.5;
const vec3 lightcolor = vec3(1.0);

void main() {
    float ambient = 0.1;

    vec3 lightdir = normalize(lightpos - _position);
    float diffuse = max(dot(_normal, lightdir), 0.0);

    vec3 viewdir = normalize(_position - campos);
    vec3 reflectdir = reflect(-lightdir, _normal);
    float spec = pow(max(dot(-viewdir, reflectdir), 0.0), 16.0);
    vec3 specular = specstrength * spec * lightcolor;
    
    gl_FragColor = vec4((ambient + diffuse + specular) * _color, 1.0);
}`

const program = CreateProgramFromSources(gl, vShaderSrc, fShaderSrc)

const camera = new Camera(vec3.set(vec3.create(), 0, 0, 2))

const model = new Model(gl, vertices, normals)
const entity = new Entity(model)

function drawLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)

    // entity.rotation[1] = Math.PI / 4
    // entity.rotation[0] = Math.PI / 4

    entity.rotation[1] += 0.02
    entity.rotation[0] += 0.02

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