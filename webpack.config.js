module.exports = {
  devtool: 'eval-source-map',
  entry: __dirname + '/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  devServer: {
    historyApiFallback: true, // 不跳转
    inline: true // 实时刷新    
  }
}