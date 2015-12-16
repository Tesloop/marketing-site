import { Route, IndexRoute } from 'react-router';

import MarketingApp from './MarketingApp';
import Splash from './Splash/Splash';

export default (
  <Route path="/" component={MarketingApp}>
    <IndexRoute component={Splash} />
  </Route>
);