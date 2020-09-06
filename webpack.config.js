const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TereserWepackPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');


const isDirEmpty = (dir) => !fs.readdirSync(dir).length;
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const isVanillaProject = process.env.FILES_IMPORT === 'vanilla';

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [],
    }
    
    if (isProd) {
        config.minimizer.push(
            new TereserWepackPlugin(),
            new OptimizeCssAssetsWebpackPlugin()
        )
    }

    return config;
}

const getPlugins = () => {
    const plugings = [
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: isProd
        }),
        new CleanWebpackPlugin(),
        new MiniCssWebpackPlugin({
            filename: filename('css')
        }),
        new webpack.DefinePlugin({
            VANILLA: JSON.stringify('vanilla'),
            'process.env.VANILLA': JSON.stringify(process.env.VANILLA)
        })
    ];

    const copyPatterns = [];
    if (!isDirEmpty('./src/assets/images')) {
        copyPatterns.push({
            from: path.resolve(__dirname, 'src/assets/images'),
            to: path.resolve(__dirname, 'dist/assets/images')
        });
    }

    if (!isDirEmpty('./src/libs') && isVanillaProject) {
        copyPatterns.push({
            from: path.resolve(__dirname, 'src/libs'),
            to: path.resolve(__dirname, 'dist/libs')
        });
    }

    if (!isDirEmpty('./src/example') && isVanillaProject) {
        copyPatterns.push({
            from: path.resolve(__dirname, 'src/example'),
            to: path.resolve(__dirname, 'dist')
        });
    }

    if (copyPatterns.length) {
        plugings.push(
            new CopyWebpackPlugin({
                patterns: copyPatterns
            })
        )
    }

    return plugings;
}


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: isVanillaProject ? './dummy.js' : './index.js',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
    },
    optimization: optimization(),
    devServer: {
        port: 3000,
        hot: true,
        historyApiFallback: true,
        contentBase: './index.html',
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
    },
    plugins: getPlugins(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                        ]
                    }
                }
            },
            {
                test: /\.s[ca]ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssWebpackPlugin.loader,
                        options: {
                            modules: true,
                            importLoaders: 1,
                            hmr: true,
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer()
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }, {
                test: /\.twig$/,
                loader: "twig-loader",
                options: {
                    // See options section below
                },
            }
        ]
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    }
}
