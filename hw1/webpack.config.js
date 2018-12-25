const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool:'source-map',
    devServer:{
        watchOptions:{
            ignored: /node_modules/
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/index.html'
        })
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "awesome-typescript-loader"  
        }]
    },
    resolve: {
        extensions: ['.ts','.js','.json','.html']
    }
};