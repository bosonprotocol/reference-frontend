import "./styles/Global.scss"

import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'

function App() {
  const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
  const [modalControl, setModalControl] = useState("onboarding-modal")

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-completed', '1')
    setModalControl(modalControl + ' fade-out')

    setTimeout(() => {
      setNewUser(false)
    }, 300);
  }

  return (
    <div className="simulate-mobile">
      {newUser &&
        <div className={modalControl}>
          <Onboarding completeOnboarding={completeOnboarding} />
        </div>
      }
      <Router>
        <Switch>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
