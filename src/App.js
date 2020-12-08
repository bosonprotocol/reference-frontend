import "./styles/Global.scss"

import React from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'

import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

function App() {
  return (
    <div className="emulate-mobile">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/onboarding" component={OnboardingReset}/>
          <Route path="/metamask" component={ConnectToMetamask}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
