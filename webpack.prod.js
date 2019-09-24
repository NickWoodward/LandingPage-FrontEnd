const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.ejs'        
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash].css"
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./js/*', './svg/*', './images/*']
        })
    ]

});