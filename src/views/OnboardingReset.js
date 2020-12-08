import React from 'react'

import { Redirect } from "react-router-dom"

function OnboardingReset() {
  localStorage.removeItem('onboarding-completed')

  return (
    <Redirect exact to="/" />
  )
}

export default OnboardingReset
