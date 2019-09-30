const merge = require('webpack-merge')

const common = require('./common')

module.exports = merge(common, {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },
    devtool: "source-map"
})