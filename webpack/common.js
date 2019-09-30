const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "playground.js"
    },
    module: {
        rules: [
            {
                test: /\.js/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts/,
                loader: 'babel-loader!ts-loader'
            },
            {
                test: /(\.glsl)$/,
                loader: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".json", "*"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
}