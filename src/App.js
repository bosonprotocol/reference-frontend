import "./styles/Global.scss"

import React from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'

function App() {
  return (
    <div className="simulate-mobile">
      <Router>
        <Switch>
          <Route path="/onboarding" component={Onboarding} />
          {/* modal */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
