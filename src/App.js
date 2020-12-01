import "./styles/Global.scss"

import React from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'

function App() {
  return (
    <div className="simulate-mobile">
      <div className="onboarding-modal">
        <Onboarding />
      </div>
      <Router>
        <Switch>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
