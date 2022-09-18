const path = require("path");

module.exports = {
    mode: 'production',
    entry: {easytables: "./src/index.js"},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        libraryTarget: "umd",
        library: "[name]",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
        ]
    },

}