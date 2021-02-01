module.exports = {
  entry: {
    main: './main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // babel 的一个编译配置
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: 'createElement' }, // 将 React.createElement 映射成其他方法
              ],
            ],
          },
        },
      },
    ],
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
};
