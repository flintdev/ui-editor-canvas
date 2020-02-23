const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    context: __dirname,
    mode: 'development',
    entry: "./example/index.tsx",
    devtool: 'inline-source-map',
    output: {
        path: path.resolve('./docs/'),
        filename: "index.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
        alias: {
            src: path.resolve('./src'),
            example: path.resolve('./example'),
            dist: path.resolve('./dist'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./example/index.html",
            filename: "./index.html"
        })
    ]
};