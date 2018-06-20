// env 环境变量
const devMode = process.env.NODE_ENV !== 'production';
const proxyEnv = process.env.PROXY_ENV == 'bs_proxy';
const analyzer = process.env.ANALYZER_ENV == 'analyzer_env';

// webpack 配置对象
const config = {};
// webpack配置环境声明
config.mode = devMode ? "development" : "production" ;

/////////////////////////////////////////////////////////////////////////////////////////////////
// common 全局配置 ------------------------------------------------------------------------------- //
/////////////////////////////////////////////////////////////////////////////////////////////////
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');



// 一些输出文件命名方式

let $fn_js = "[name].js";
let $fn_css = "[name].css";
let $fn_file = "[name].[ext]";
// let $fn_js = devMode ? "[name].js" : "[name]-[hash].js";
// let $fn_css = devMode ? "[name].css" : "[name]-[hash].css";
// let $fn_file = devMode ? "[name].[ext]" : "[name]-[hash].[ext]";


// 入口
config.entry = {
    gitcs: path.resolve(__dirname, "./src/gitcs.js"),
    gitg: path.resolve(__dirname, "./src/gitg.js")
};

// 输出目录
config.output = {
    path: path.resolve(__dirname, 'public'),
    publicPath: "/",
    filename: "assets/js/"+$fn_js,
    chunkFilename: "assets/js/"+$fn_js,
    // library: 'libraryname'
    // libraryTarget: 'umd'
};


// 自定义处理规则对象---------------------------------------------------------------
const rules = {};

// js 文件处理
rules.js = {
    test: /\.js$/,
    include: path.resolve(__dirname, 'src'),
    //exclude: path.resolve(__dirname, 'node_modules'),
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['env']
        }
    }
};

// css 文件处理
rules.css = {
    test: /\.css$/,
    use: [
        'style-loader',
        //MiniCssExtractPlugin.loader,
        'css-loader',
    ]
};

// scss 文件处理
rules.scss = {
    test: /\.s[ac]ss$/,
    use: [
        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader',
        'sass-loader',
    ]
};

// 图片文件处理
rules.img = {
    test: /\.(png|jpg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: $fn_file,
                //publicPath: '/assets/images/',
                outputPath: "assets/images/"
            }
        }
    ]
};

// 字体文件处理
/*
{
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
            name: $fn_file,
            outputPath: "assets/font/"
        }
    ]
}*/


/*{
    include: path.resolve("node_modules", "lodash"),
    sideEffects: false
}*/


// 处理模块规则
config.module= {
    rules: [
        rules.js,
        rules.css,
        rules.scss,
        rules.img
    ]
};

// 处理插件
config.plugins = [
    new CleanWebpackPlugin(['public/assets']),
    new ManifestPlugin({
        fileName: "manifest.json",
    }),
    /*new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })*/
];


// 类库依赖
/*config.externals = {
    jquery: 'jQuery'
}*/



// .css 用 MiniCssExtractPlugin.loader 时
config.optimization = {
    splitChunks: {
        // chunks (chunk) {
        // // exclude `my-excluded-chunk`
        //     return chunk.name !== 'app';
        // }
        cacheGroups: {
            // commons: {
            //     name: 'commons',
            //     chunks: 'initial',
            //     minChunks: 1,
            //     // test: /\.scss$/,
            //     // chunks: 'all,async,initial',
            //     // enforce: true
            // },
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                // enforce: true
            },
            app: {
                test: /[\\/]src[\\/]\.*\.(js|scss|css)$/,
                // test: /src[\\/]*\.(js|scss|css)$/,
                // test: /(gitcs\.js|gitg\.js|\.scss)$/,
                name: 'app',
                chunks: 'all',
                // enforce: true
            }
        }
    },
    /*minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
    ]*/
};

// config.optimization.runtimeChunk = true;


//npm config set registry=https://registry.npm.taobao.org -g
//yarn config set registry https://registry.npm.taobao.org -g
//alias cnpm="npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm \
// --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc"


if( devMode ){

    //////////////////////////////////////////////////////////////////////////////////////////////
    // 开发环境配置做的事 ------------------------------------------------------------------------------ //
    //////////////////////////////////////////////////////////////////////////////////////////////

    //const HtmlWebpackPlugin = require('html-webpack-plugin');

    const DashboardPlugin = require('webpack-dashboard/plugin');

    // browser-sync proxy php app
    if( proxyEnv ){

        const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

        config.plugins.push(
            new BrowserSyncPlugin(
                {
                    host: 'localhost',
                    port: 3000,
                    /*ui: {
                        port: 3001
                    },*/
                    proxy: 'http://10.0.75.1',
                    // server: { baseDir: ['www'] },
                    watch: true,
                    open: false,
                    watchOptions: {
                        // ignoreInitial: true,
                        usePolling: true,
                        // interval: 100,
                    },
                    // files: ["www/Public/Home/**/*.css", "www/Public/Home/**/*.js"],
                    // injectCss: false,
                    // callback:
                },
                {
                    // prevent BrowserSync from reloading the page
                    // and let Webpack Dev Server take care of this
                    reload: false
                }
            )
        );

    }else {

        config.devServer = {
            contentBase: path.join(__dirname, "public"),
            host: '0.0.0.0',
            /*proxy: {
                "/": "http://192.168.1.100:3000"
            },*/
            //compress: true,
            watchContentBase: true,
            inline: true,
            hot: true,
            port: 3000,
            watchOptions: {
                // aggregateTimeout: 800,
                poll: true,
                ignored: /node_modules/
            }
        };

    }


    config.watch = true;
    // config.devtool = "none,eval,cheap-eval-source-map,cheap-source-map,cheap-module-source-map";
    config.devtool = "eval";
    

    config.plugins = [
        ...config.plugins,
        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin()
    ];


}else {

    /////////////////////////////////////////////////////////////////////////////////////////
    // 生产环境配置做的事 ------------------------------------------------------------------------- //
    /////////////////////////////////////////////////////////////////////////////////////////


    // const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
    const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

    if( analyzer ){

        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

        config.plugins.push(
            new BundleAnalyzerPlugin({
            analyzerHost: "0.0.0.0",
            analyzerPort: 3001,
            /*analyzerMode: 'static',
            reportFilename: 'report.html',
            openAnalyzer: false*/
            })
        );

    }
    

    config.plugins = [
        ...config.plugins,
        new MiniCssExtractPlugin({
            filename: "assets/css/"+$fn_css,
            chunkFilename: "assets/css/"+$fn_css
        }),
        new OptimizeCSSAssetsPlugin({})
        //new CleanEntryJsWebpackPlugin(['css.js'])
    ];


}

module.exports = config;