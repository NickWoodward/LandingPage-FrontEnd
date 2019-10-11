const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/app.js',
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // JS
            {
                test: /\.js$/,
                exclude: /\node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // SASS
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            // ASSESTS
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:5].[ext]',
                        outputPath: './images/'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.ejs'        
        })
    ]
};