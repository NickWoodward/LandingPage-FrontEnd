const path = require('path');

module.exports = {
    entry: './src/js/app.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:5].[ext]',
                        outputPath: './images/'
                    }
                }
            },
            {
                test: /\.(svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './svg/'
                    }
                }
            }
        ]
    }
}
