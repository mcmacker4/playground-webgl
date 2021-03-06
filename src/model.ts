
interface ModelJSON {
    vertices: number[]
    normals: number[]
}

export class Model {

    readonly verticesVBO: WebGLBuffer
    readonly normalsVBO: WebGLBuffer
    readonly vertexCount: number

    constructor(gl: WebGLRenderingContext, model: ModelJSON) {
        
        const vertvbo = gl.createBuffer()
        const normvbo = gl.createBuffer()

        if (!vertvbo || !normvbo) throw new Error("Could not create VBO.")

        const position = new Float32Array(model.vertices)
        const normal = new Float32Array(model.normals)

        gl.bindBuffer(gl.ARRAY_BUFFER, vertvbo)
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, normvbo)
        gl.bufferData(gl.ARRAY_BUFFER, normal, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.verticesVBO = vertvbo
        this.normalsVBO = normvbo
        this.vertexCount = position.length / 3
    }

}