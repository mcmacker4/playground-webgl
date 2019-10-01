

export class Model {

    readonly verticesVBO: WebGLBuffer
    readonly vertexCount: number

    constructor(gl: WebGLRenderingContext, vertices: number[]) {
        const vbo = gl.createBuffer()

        if (!vbo) throw new Error("Could not create VBO.")

        const position = new Float32Array(vertices)

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.verticesVBO = vbo
        this.vertexCount = position.length / 3
    }

}