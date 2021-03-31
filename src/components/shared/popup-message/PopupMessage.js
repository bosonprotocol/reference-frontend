import React from "react";

import "./PopupMessage.scss";

function PopupMessage({ text, controls }) {
  return text || controls ? (
    <div className="popup-message">
      <div className="popup-container">
        <div className="text">{text}</div>
        <div className="controls">{controls}</div>
      </div>
    </div>
  ) : null;
}

export default PopupMessage;
