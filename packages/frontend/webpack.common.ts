import DotenvWebpack from 'dotenv-webpack';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
	entry: ['webpack-hot-middleware/client', './src/client.tsx'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'babel-loader',
				include: path.resolve(__dirname, 'src'),
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.mjs'],
	},
	plugins: [
    // new HtmlWebpackPlugin({ template: 'src/index.html' }), 
    new DotenvWebpack()
  ],
};

export default config;
