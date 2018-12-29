const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    output: {
        filename: 'main.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
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
        },{
            test:/\.(jpg|png|gif|bmp|svg)$/,
            exclude: /node_modules/,
            include:path.join(__dirname,'image'),
            use:"url-loader"
        }]
    },
    resolve: {
        extensions: ['.ts','.js','.json','.html','.jpg']
    }
};