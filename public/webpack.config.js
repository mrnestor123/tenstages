const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = function(env){
    return{
        entry: `./src/apps/${env.class}.js`,
        output: {
            // path: path.resolve(__dirname, 'dist'),
            path: '/var/www/vhosts',
            publicPath: "https://components.digitalvalue.es/dv-components-m/lib/",
            filename: `${env.class}.min.js`,
            libraryTarget: 'umd'
        },
        /* optimization: {
            minimize: false
        },*/ 
        module: {
            rules: [
                {
                    test: /\.js$/, //using regex to tell babel exactly what files to transcompile
                    exclude: /node_modules/, // files to be ignored
                    use: {
                        loader: 'babel-loader' // specify the loader
                    },
                }
            ]
        },
        mode: 'production',
        plugins: [ 
            //ESto para que es ???  
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
            }),
	        // new BundleAnalyzerPlugin({
            //     generateStatsFile:true
            // }),
        ],
  externals: {
"./ckeditor-classic.js":"ClassicEditor"
  }

  }
}
