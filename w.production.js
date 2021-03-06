const webpack = require('webpack')
const path = require('path')
const resolve = path.resolve
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: [
        './src/root.js'
    ],
    //devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'public'),
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?minimize=true!sass-loader'
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?minimize=true!less-loader'
                })
            },
            {test: /\.(png|jpg)$/, use: 'file-loader?name=img/[name].[ext]'},
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=font/[name].[ext]'
            },
            {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml'},
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                '__DEVTOOLS__' : false,
                'API_URL': JSON.stringify('//api.anizm.tv/api'),
                'JWT': JSON.stringify({
                    client_id: 2,
                    client_secret: "Pp4MowKT1UemtAQqv7vhNHA4Xm0CWrdwfqBjo01S",
                }),
                'CDN' : JSON.stringify('//api.anizm.tv')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ExtractTextPlugin({filename: 'css/[name].css', disable: false, allChunks: false}),
        new HtmlWebpackPlugin({
            hash : true,
            template : 'src/Template/index.ejs'
        }),
        new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
            // check if the context was created inside the moment package
            if (!/\/moment/.test(context.context)) { return }
            // context needs to be modified in place
            Object.assign(context, {
                // include only japanese, korean and chinese variants
                // all tests are prefixed with './' so this must be part of the regExp
                // the default regExp includes everything; /^$/ could be used to include nothing
                regExp: /^\.(tr-TR)/
            })
        })
    ]
}

module.exports = config