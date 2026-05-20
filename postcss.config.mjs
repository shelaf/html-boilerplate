export default (ctx) => ({
  map: ctx.env === 'development' ? ctx.map : false,
  from: ctx.from,
  to: ctx.to,
  plugins: {
    'postcss-preset-env': {
      autoprefixer: {
        grid: true
      }
    },
    'postcss-normalize': {},
    cssnano: ctx.env !== 'development' ? {
      preset: [
        'default',
        { discardComments: { removeAll: true } }
      ]
    } : false
  }
});
