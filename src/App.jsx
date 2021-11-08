import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Overview from './pages/Overview.jsx';
import Pools from './pages/Pools.jsx';
import Tokens from './pages/Tokens.jsx';
import PoolPage from './pages/PoolPage.jsx';
import TokenPage from './pages/TokenPage.jsx';



function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Overview />
          </Route>
          <Route exact path="/pools">
            <Pools />
          </Route>
          <Route exact path="/tokens">
            <Tokens />
          </Route>
          <Route exact path={['/tokens/:address', '/token/:address']} children={<TokenPage />} />
          <Route exact path={['/pools/:address', '/pool/:address', '/pair/:address']} children={<PoolPage />} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
