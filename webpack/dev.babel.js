/**
 * @prettier
 */

import path from "path"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"

import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const projectBasePath = path.join(__dirname, "../")
const isDevelopment = process.env.NODE_ENV !== "production"

const devConfig = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: true,
    includeDependencies: true,
  },
  {
    mode: "development",
    entry: {
      "swagger-ui-bundle": [
        "./src/core/index.js",
      ],
      "swagger-ui-standalone-preset": [
        "./src/standalone/index.js",
      ],
      "swagger-ui": "./src/style/main.scss",
      vendors: ["react", "react-dom", "react-refresh/runtime"],
    },

    performance: {
      hints: false
    },

    output: {
      filename: "[name].js",
      chunkFilename: "[id].js",
      library: {
        name: "[name]",
        export: "default",
      },
      publicPath: "/",
    },

    devServer: {
      allowedHosts: "all", // for development within VMs
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      port: 3200,
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: path.resolve(projectBasePath, "dev-helpers"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
      },
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(projectBasePath, "src"),
            path.join(projectBasePath, "node_modules", "object-assign-deep"),
          ],
          loader: "babel-loader",
          options: {
            retainLines: true,
            cacheDirectory: true,
            plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean),
          },
        },
        {
          test: /\.(txt|yaml)$/,
          use: [
            {
              loader: "raw-loader"
            },
          ],
          type: "javascript/auto",
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                esModule: false,
              },
            },
          ],
          type: "javascript/auto",
        },
        {
          test: /\.(woff|woff2)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
              },
            },
          ],
          type: "javascript/auto",
        },
        {
          test: /\.(ttf|eot)$/,
          use: [
            {
              loader: "file-loader"
            },
          ],
          type: "javascript/auto",
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            }
          ]
        },
      ],
    },

    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin({ library: "[name]" }),
      new HtmlWebpackPlugin({
        template: path.join(projectBasePath, "dev-helpers", "index.html"),
      })
    ].filter(Boolean),

    optimization: {
      runtimeChunk: "single", // for multiple entry points using ReactRefreshWebpackPlugin
    },
  },
)

// mix in the style config's plugins and loader rules

devConfig.plugins = [...devConfig.plugins, ...styleConfig.plugins]

devConfig.module.rules = [
  ...devConfig.module.rules,
  ...styleConfig.module.rules,
]

export default devConfig
