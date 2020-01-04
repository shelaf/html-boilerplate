'use strict';

module.exports = (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  from: ctx.from,
  to: ctx.to,
  plugins: {
    precss: {},
    'postcss-normalize': {},
    autoprefixer: {
      grid: true,
      cascade: false
    },
    cssnano: {
      "preset": [
        "default",
        {"discardComments": {removeAll: true}}
      ]
    }
  }
});
