const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/controller/controller.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                loader: ExtractTextPlugin.extract({ // saving styles to separate file
                    loader: 'css-loader'
                }),
                test: /\.css$/
            },
            {
                test: /\.(jpe?g|png|svg)$/, 
                use: [
                    {
                        loader: 'url-loader', // image transform to base64URI if size is < 40kB
                        options: { limit: 40000 } // 40kB
                    },
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
    ]
}