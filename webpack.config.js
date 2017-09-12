require('dotenv').config();

const path = require('path')
const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const MY_PORT = 3000;
const DEV = process.env.NODE_ENV !== 'production';
const INCLUDE_PATH = path.join(__dirname, 'src');

const devEntry = {
  app: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${MY_PORT}`,
    'webpack/hot/only-dev-server',
    'index.tsx',
  ],
};

const prodEntry = {
  app: [
    './index.tsx',
  ],
  vendor: [
    'react-dom',
    'react-hot-loader',
    'react',
  ],
};

const defaultPlugins = [
  new HtmlWebpackPlugin({
    template: './index.html',
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
    },
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];

const devPlugins = [
  new DashboardPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

const prodPlugins = [
  new ExtractTextPlugin('style.css'),
  new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'bundle'] }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: { screw_ie8: true, warnings: false },
    mangle: { screw_ie8: true },
    output: { comments: false, screw_ie8: true },
  })
];

module.exports = {
  devtool: DEV ? 'cheap-module-eval-source-map' : 'cheap-hidden-source-map',
  entry: DEV ? devEntry : prodEntry,
  output: {
    filename: DEV ? '[name].js' : '[name].min.js',
    path: path.join(__dirname, 'dist'),
    publicPath: DEV ? `http://localhost:${MY_PORT}/` : '/',
  },
  plugins: defaultPlugins.concat(DEV ? devPlugins : prodPlugins),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif)$/i, include: INCLUDE_PATH, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.ico$/, include: INCLUDE_PATH, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.tsx?$/, include: INCLUDE_PATH, loaders: ['babel-loader', 'ts-loader'] },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    historyApiFallback: true,
    hot: true,
    port: MY_PORT,
    publicPath: `http://localhost:${MY_PORT}/`,
    stats: {
      chunks: false,
      colors: true,
      reasons: true,
    },
  },
}