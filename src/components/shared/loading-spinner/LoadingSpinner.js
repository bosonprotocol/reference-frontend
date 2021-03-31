import React from "react";

import "./LoadingSpinner.scss";

function LoadingSpinner() {
  return (
    <div className="loading background">
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default LoadingSpinner;
