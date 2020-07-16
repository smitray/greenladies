import webpackConfig from './webpack.dev';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import webpack from 'webpack';
import {createReloadable, isDevelopment} from '@artsy/express-reloadable';

import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'

const app = express();

if (isDevelopment) {
  const compiler = webpack(webpackConfig);

  app.use(morgan('dev'));
  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler));

  const mountAndReload = createReloadable(app, require);
  app.use(mountAndReload(path.resolve(__dirname, 'src'), {
    watchModules: ['react-relay-network-modern-ssr']
  }))
} else {
  app.use(require('src'));
}

app.listen(3000, () => {
  console.log('App started');
});
