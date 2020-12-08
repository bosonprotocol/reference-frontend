import React from 'react'

import { Redirect } from "react-router-dom"

function OnboardingReset() {
  localStorage.removeItem('onboarding-completed')
  localStorage.removeItem('onboarding-slide')

  return (
    <Redirect exact to="/" />
  )
}

export default OnboardingReset
