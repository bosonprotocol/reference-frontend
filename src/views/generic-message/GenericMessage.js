import React from "react";
import { useHistory } from "react-router-dom";
import {
  IconSuccess,
  IconError,
  LockedIcon,
  IconClock,
} from "../../shared-components/icons/Icons";
import { MESSAGE } from "../../helpers/configs/Dictionary";

import "./GenericMessage.scss";

function GenericMessage({
  messageType,
  title,
  text,
  link,
  setMessageType,
  subprops,
}) {
  const history = useHistory();

  return (
    <section className="message">
      <div className="container flex column split">
        <div className="top-side flex column center">
          <div className="status-icon">

            {messageType === MESSAGE.SUCCESS ? (
              <IconSuccess />
            ) : messageType === MESSAGE.ERROR ? (
              <IconError />
            ) : messageType === MESSAGE.LOCKED ? (
              <LockedIcon />
            ) : messageType === MESSAGE.COF_SUCCESS ? (
              <IconClock color={"#A1B2C5"} length={"68px"} />
            ) : messageType === MESSAGE.REFUND_SUCCESS ? (
              <IconClock color={"#E49043"} length={"68px"} />
            ) : messageType === MESSAGE.COMPLAIN_SUCCESS ? (
              <IconClock color={"#FA5B66"} length={"68px"} />
            ) : null}
              
          </div>
          <p className="title">{title}</p>
          <p className="description">{text}</p>
        </div>
        <div className="action">
          <div
            className="button primary"
            onClick={() =>
              !setMessageType
                ? history.push(link)
                : setMessageType(false, subprops)
            }
          >
            {subprops?.button ? subprops.button : "CLOSE"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GenericMessage;
