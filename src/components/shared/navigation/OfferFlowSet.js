/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";

import { NavigationContext } from "../../../contexts/Navigation";
import { Arrow } from "../../shared/Icons";

function OfferFlowSet() {
  const navigationContext = useContext(NavigationContext);
  const [progressBarWidth, setProgressBarWidth] = useState();
  const {
    activeScreen,
    setActiveScreen,
    screens,
  } = navigationContext.state.offerFlowControl;

  useEffect(() => {
    let calc = parseInt((100 / screens.length) * (activeScreen + 1));
    setProgressBarWidth(calc + "%");
  }, [activeScreen]);

  return (
    <div className="top-navigation-offer flex ai-center">
      <div
        className="button square"
        role="button"
        onClick={() => setActiveScreen(activeScreen - 1, activeScreen === 0)}
      >
        <Arrow color={"#80F0BE"} />
      </div>
      <div className="progress-bar flex center">
        <div className="bar">
          <div style={{ width: progressBarWidth }} className="fill"></div>
        </div>
      </div>
    </div>
  );
}

export default OfferFlowSet;
