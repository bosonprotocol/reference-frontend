import React from 'react'

import { Redirect } from "react-router-dom"

import { ROUTE } from "../helpers/Dictionary"

function OnboardingReset() {
  localStorage.removeItem('onboarding-completed')
  localStorage.removeItem('onboarding-slide')

  return (
    <Redirect exact to={ROUTE.Home} />
  )
}

export default OnboardingReset
