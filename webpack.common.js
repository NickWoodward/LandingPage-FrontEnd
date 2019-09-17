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
            }
        ]
    }
}