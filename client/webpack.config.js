const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isDevelopment ? "bundle.js" : "bundle.[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  devtool: isDevelopment ? "inline-source-map" : "source-map",
  devServer: {
    static: [path.join(__dirname, "dist"), path.join(__dirname, "public")],
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: isDevelopment ? ["react-refresh/babel"] : [],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: false,
    runtimeChunk: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      minify: !isDevelopment && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/robots.txt", to: "robots.txt" }, // Copy robots.txt to dist
        { from: "public/sitemap.xml", to: "sitemap.xml" }, // Copy sitemap.xml to dist
      ],
    }),
    new Dotenv(),
    !isDevelopment &&
      new MiniCssExtractPlugin({
        filename: "bundle.[contenthash].css",
      }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: [".js", ".jsx"],
  },
  performance: {
    hints: false,
  },
};
