import { useContext, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { GlobalContext, Action } from "../contexts/Global";

import { ROUTE } from "../helpers/configs/Dictionary";

function OnboardingReset() {
  const globalContext = useContext(GlobalContext);
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("onboarding-completed");
    localStorage.removeItem("onboarding-slide");
    globalContext.dispatch(Action.completeOnboarding(false));
    history.push(ROUTE.Home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default OnboardingReset;
