
// Do server-rendering only in proudction mode
if (process.env.NODE_ENV === 'production') {
  // Set userAgent for material-ui
  global.navigator = {
    userAgent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
  };
  // Load Webpack infos for SSR
  // ReactRouterSSR.LoadWebpackStats(WebpackStats);

  // require('../client/routes');
} else {
  // Load any testing
}
