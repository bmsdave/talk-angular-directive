'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import yargs    from 'yargs';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import del      from 'del';
import proxyMiddleware      from 'http-proxy-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');

console.log('=> bootstrap-loader configuration: ' + bootstrapEntryPoints.dev);

var root = 'client';

// helper method for resolving paths
var resolveToApp = function (glob = '') {
  return path.join(root, 'app', glob); // app/{glob}
};

var resolveToComponents = function (glob = '') {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

var resolveToDirectives = function (glob = '') {
  return path.join(root, 'app/directives', glob); // app/directives/{glob}
};

// helper method for proxy query
// example:
let proxy = proxyMiddleware(
    ['/auth', '/api', '/logout'],
    {target: 'http://127.0.0.1:5000'}
);

// map of all paths
var paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  styl: resolveToApp('**/*.scss'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/app.js'),
    bootstrapEntryPoints.dev
  ],
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  blankTemplateDirectives: path.join(__dirname, 'generator', 'directive/**/*.**'),
  dest: path.join(__dirname, 'dist')
};

// use webpack.config.js to build modules
gulp.task('webpack', [ 'clean' ], function (cb) {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task('serve', function () {
  const config = require('./webpack.dev.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true'
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {baseDir: root},
    middleware: [
      // set proxy here if you need
      // proxy,
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddleware(compiler)
    ]
  });
});

gulp.task('clean', function (cb) {
  del([ paths.dest ]).then(function (cleanPaths) {
    gutil.log('[clean]', cleanPaths);
    cb();
  })
});

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('directive', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToDirectives(), parentPath, name);

  return gulp.src(paths.blankTemplateDirectives)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('watch', [ 'serve' ]);
gulp.task('default', [ 'watch' ]);
