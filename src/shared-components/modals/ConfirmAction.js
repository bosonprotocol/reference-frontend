import { useState } from "react";
import PopupMessage from "../popup-message/PopupMessage";

const ConfirmAction = (action, text) => {
    const [popupMessage, setPopupMessage] = useState();

    const callAction = () => {
      setPopupMessage(false);
      action();
    };
    setPopupMessage({
      text,
      controls: (
        <div className="flex split buttons-pair">
          <div
            className="button gray"
            role="button"
            onClick={() => setPopupMessage(false)}
          >
            BACK
          </div>
          <div
            className="button primary"
            role="button"
            onClick={() => callAction()}
          >
            CONFIRM
          </div>
        </div>
      ),
    });
    return  <PopupMessage {...popupMessage}/>

  };

  export default ConfirmAction
