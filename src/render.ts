import { Entity } from "./entity"
import { Camera } from "./camera"
import { mat4 } from "gl-matrix"

export function render(gl: WebGLRenderingContext, program: WebGLProgram, camera: Camera, entity: Entity) {
    gl.useProgram(program)

    // Camera matrices
    const viewMat = mat4.create()
    mat4.translate(viewMat, viewMat, [ -camera.position[0], -camera.position[1], -camera.position[2] ])
    mat4.rotateX(viewMat, viewMat, -camera.rotation[0])
    mat4.rotateY(viewMat, viewMat, -camera.rotation[1])
    mat4.rotateZ(viewMat, viewMat, -camera.rotation[2])

    // Uniforms
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, camera.projectionMatrix)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, viewMat)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelMatrix"), false, entity.getModelMatrix())
    gl.uniform3f(gl.getUniformLocation(program, "campos"), camera.position[0], camera.position[1], camera.position[2])

    gl.bindAttribLocation(program, 0, "position")
    gl.bindAttribLocation(program, 1, "normal")
    gl.enableVertexAttribArray(0)
    gl.enableVertexAttribArray(1)

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.model.verticesVBO)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, entity.model.normalsVBO)
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, entity.model.vertexCount)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.useProgram(null)
}