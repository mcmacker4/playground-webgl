const fs = require('fs')

const args = process.argv.slice(2)

if (args.length !== 2) throw new Error("Need exactly 2 arguments. Input path and output path.")

const inPath = args[0]
const outPath = args[1]

console.log(`Input file: ${inPath}`)
console.log(`Output file: ${outPath}`)


const objstring = fs.readFileSync(inPath).toString()

const lines = objstring.split(/\n+/)

const { vlines, vtlines, vnlines, flines } = lines.reduce((acc, line) => {
    if (line.startsWith("v ")) {
        acc.vlines.push(line)
    } else if (line.startsWith("vt ")) {
        acc.vtlines.push(line)
    } else if (line.startsWith("vn ")) {
        acc.vnlines.push(line)
    } else if (line.startsWith("f ")) {
        acc.flines.push(line)
    }
    return acc
}, { vlines: [], vtlines: [], vnlines: [], flines: [] })


const vertices = vlines.map(vline => {
    const parts = vline.split(/\s+/)
    return parts.slice(1).map(n => parseFloat(n))
})

const uvs = vtlines.map(vtline => {
    const parts = vtline.split(/\s+/)
    return parts.slice(1).map(n => parseFloat(n))
})

const normals = vnlines.map(vnline => {
    const parts = vnline.split(/\s+/)
    return parts.slice(1).map(n => parseFloat(n))
})


const model = flines.reduce((acc, line) => {

    const face = line.split(/\s+/).slice(1)
    
    face.forEach(vertex => {
        const parts = vertex.split('/')
        const v = vertices[parts[0] - 1]
        acc.vertices.push(...v)
        const uv = uvs[parts[1] - 1]
        acc.uvs.push(...uv)
        const n = normals[parts[2] - 1]
        acc.normals.push(...n)
    })

    return acc

}, { vertices: [], uvs: [], normals: [] })

console.log(`Faces: ${flines.length}`)

fs.writeFileSync(outPath, JSON.stringify(model))

console.log("Done!")