import { Model } from "./model";
import { vec3, mat4 } from "gl-matrix";


export class Entity {

    readonly model: Model

    readonly position: vec3
    readonly rotation: vec3

    private matrix = mat4.create()

    constructor(model: Model, position?: vec3, rotation?: vec3) {
        this.model = model
        this.position = position || vec3.create()
        this.rotation = rotation || vec3.create()
    }

    getModelMatrix() {
        mat4.identity(this.matrix)
        mat4.translate(this.matrix, this.matrix, this.position)
        mat4.rotateX(this.matrix, this.matrix, this.rotation[0])
        mat4.rotateY(this.matrix, this.matrix, this.rotation[1])
        mat4.rotateZ(this.matrix, this.matrix, this.rotation[2])
        return this.matrix
    }

}