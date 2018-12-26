const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin')
module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    output: {
        filename: 'main.[hash].js',
        path: path.resolve(__dirname, 'dist')
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