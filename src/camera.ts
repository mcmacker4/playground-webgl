import { mat4, vec3 } from "gl-matrix"


export class Camera {

    readonly position: vec3
    readonly rotation: vec3

    readonly projectionMatrix: mat4

    constructor(position?: vec3, rotation?: vec3) {
        this.position = position || vec3.create()
        this.rotation = rotation || vec3.create()

        this.projectionMatrix = mat4.create()
        mat4.perspective(this.projectionMatrix, 80.0, window.innerWidth / window.innerHeight, 0.01, 1000.0)
    }

}