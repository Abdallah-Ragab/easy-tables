const path = require("path");

module.exports = {
    mode: 'development',
    entry: {development: "./src/index.js"},
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        libraryTarget: "umd",
        library: "easytables",
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
    devServer: {
        static: {
            directory: path.resolve(__dirname, "public")
        },
        open: true,
    },
    devtool: 'source-map'
}