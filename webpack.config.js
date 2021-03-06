'use strict';

const
    //NODE_ENV = process.env.NODE_ENV || 'development',
    webpack  = require('webpack'),
    path = require('path');


module.exports = {
    context: __dirname,
    entry: {
        main : "./app/src/app"
        //header : "./src/directives/header/header",
        //styles: "./src/less/main"
    },

    output: {
        path: __dirname + "/app/assets/js",  // собираем весь джс в один файл
        //publicPath: "/app/",  //
        filename: "build.js",   // можно "[name].js", тогда каждый файл будет отдельно собираться
        library: 'home' // название глобальной переменной для тестов, // можно "[name]"
    },
    devServer: {
        host: 'localhost', //default
        port: 8080,
        contentBase: __dirname + "/app"
    },
    //watch: NODE_ENV == 'development',   //смотрим только за продакшеном
    watch: true,
    watchOptions: {
        aggregateTimeout: 100   // время после которого срабатывает watch (по умолчанию было 300)
    },
    //devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null, // делать нормальный вид функций
    devtool: "cheap-inline-module-source-map",
    plugins: [
        //new webpack.NoErrorsPlugin(), // не создает файл если он с ошибкой
        new webpack.DefinePlugin({
            //NODE_ENV : JSON.stringify(NODE_ENV),  // включаем енвайронмент
            LANG: JSON.stringify('ru')  // сетим язык в скриптах для кодировки(можно удалить, но пусть будет)
        })/*,
        new webpack.optimize.CommonsChunkPlugin({   // крутая штука, собирает одинаковый код в один файл с разных точек входа https://www.youtube.com/watch?v=pSKd2zkEAZM&list=PLDyvV36pndZHfBThhg4Z0822EEG9VGenn&index=12
            name: "common",
            chunks: ['about','home'], // откуда брать
            minChunks : 2 // количество точек входа для выноса общего кода
        })*/
    ],
    resolve: {
        moduleDirectories: ['node_modules'], // смотрит где искать и какие расширения
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    resolveLoader: {
        moduleDirectories: ['node_modules'], // смотрит где искать и какие расширения для лоадеров
        moduleTemplates: ['*-loader','*'],
        extensions: ['','.js']
    },
    module: {
        loaders: [
            {   // Typescript
                test: /\.ts?$/,
                include: path.resolve(__dirname,"app","src"),  // включаем только папку src
                exclude: /(node_modules|bower_components)/, //выключаем не нужные
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname,"node_modules","bootstrap","dist","css"),  // включаем только папку bootstrap
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                include: path.resolve(__dirname,"app","assets","less"),
                exclude: /(node_modules|bower_components)/, //выключаем не нужные
                loader: "style!css!less"
            },
            {
                test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
                include: path.resolve(__dirname,"node_modules","bootstrap","dist","fonts"),  // включаем только папку bootstrap
                loader: "file?pubicPath=../&name=../fonts/[hash].[ext]"
            }
        ]/*,
        preLoaders: [
            { test: /\.coffee$/, loader: "coffee-hint-loader" }
        ]*/
    }
};

/*if (NODE_ENV == 'production') {     // минифай
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    )
}

console.log(__dirname);*/