const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = merge(common, {
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.ejs'        
        })
    ]
});