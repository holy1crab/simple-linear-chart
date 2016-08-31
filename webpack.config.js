var path = require('path');
var webpack = require('webpack');


module.exports = {

    entry: {
        index: [__dirname + '/src/app/main.ts']
    },

    devtool: 'source-map',

    output: {
        path: 'build',
        filename: '[name].bundle.js',
        publicPath: 'build/'
    },

    resolve: {
        // modulesDirectories: ['src/app', 'node_modules'],
        extensions: ['', '.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    plugins: [
    ]
};