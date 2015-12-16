import { Route } from 'react-router';

import marketingRoutes from 'MarketingApp/routes'

ReactRouterSSR.Run(
  <Route>
    {marketingRoutes}
  </Route>
);
