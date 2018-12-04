const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist','script')
    },
    devtool:'source-map',
    devServer:{
        clientLogLevel:'none',
        contentBase:'./dist',
        publicPath:'/dist/script',
        watchOptions:{
            ignored: /node_modules/
        }
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "awesome-typescript-loader"
        }]
    },
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ]
    }
};