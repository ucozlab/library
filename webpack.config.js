'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
    entry: "./src/main",
    output: {
        path: __dirname + "/dist/js/",
        filename: "build.js",
        library: 'home'
    },
    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV : JSON.stringify(NODE_ENV),
            LANG: JSON.stringify('ru')
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel" }
            //{ test: /\.coffee$/, loader: "coffee-loader" }
        ]/*,
        preLoaders: [
            { test: /\.coffee$/, loader: "coffee-hint-loader" }
        ]*/
    }
}