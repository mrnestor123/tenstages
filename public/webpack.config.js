const path = require('path');
// const DefinePlugin = require('webpack/lib/DefinePlugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// export default function(env) {
//     return {
//         entry: `./src/apps/${env.class}.js`,
//         output: {
//             // path: path.resolve(__dirname, 'dist'),
//             path: '/var/www/vhosts',
//             publicPath: "https://components.digitalvalue.es/dv-components-m/lib/",
//             filename: `${env.class}.min.js`,
//             libraryTarget: 'umd'
//         },
//         /* optimization: {
//             minimize: false
//         },*/ 
//         module: {
//             rules: [
//                 {
//                     test: /\.js$/, //using regex to tell babel exactly what files to transcompile
//                     exclude: /node_modules/, // files to be ignored
//                     use: {
//                         loader: 'babel-loader' // specify the loader
//                     },
//                 }
//             ]
//         },
//         mode: 'production',
//         //devtool: 'source-map',
//         plugins: [ 
//             //ESto para que es ???  
//             new DefinePlugin({
//                 PRODUCTION: JSON.stringify(true),
//             }),
// 	        // new BundleAnalyzerPlugin({
//             //     generateStatsFile:true
//             // }),
//         ],
//         externals: {
//             "./ckeditor-classic.js":"ClassicEditor"
//         }

//     }
// }

module.exports = {
    entry: `./landing/landing-routes.js`,
    output: {
        filename: `landing-routes-min.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production'
}
