
export function CreateShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    let shader = gl.createShader(type)
    if (!shader)
        throw new Error("Could not create shader.")
    
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`)
    
    return shader
}

export function CreateProgram(gl: WebGLRenderingContext, vshader: WebGLShader, fshader: WebGLShader): WebGLProgram {
    let program = gl.createProgram()
    if (!program)
        throw new Error("Could not create shader program.")
    
    gl.attachShader(program, vshader)
    gl.attachShader(program, fshader)

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(`Error linking shader program: ${gl.getProgramInfoLog(program)}`)

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        throw new Error(`Error validating shader program: ${gl.getProgramInfoLog(program)}`)
    
    return program
}

export function CreateProgramFromSources(gl: WebGLRenderingContext, vsource: string, fsource: string) {
    const vshader = CreateShader(gl, gl.VERTEX_SHADER, vsource)
    const fshader = CreateShader(gl, gl.FRAGMENT_SHADER, fsource)
    return CreateProgram(gl,  vshader, fshader)
}