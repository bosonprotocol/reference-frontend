import "./styles/Global.scss"

import React, { useState, useRef } from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'
import Home from './views/Home'

import FastClick from "fastclick"

function App() {
  const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
  const screensRef = useRef()
  const onboardingModalRef = useRef()

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-completed', '1')

    onboardingModalRef.current.classList.add('fade-out')
    screensRef.current.classList.add('fade-in')

    setTimeout(() => {
      setNewUser(false)
    }, 900);
  }

  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
        FastClick.attach(document.body);
    }, false);
  }

  return (
    <div className="simulate-mobile">
      {newUser &&
        <div className="onboarding-modal" ref={onboardingModalRef}>
          <Onboarding completeOnboarding={completeOnboarding} />
        </div>
      }
      <div className={`screens ${newUser && 'new-user'}`} ref={screensRef}>
        <Router>
          <Switch>
            <Home />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
