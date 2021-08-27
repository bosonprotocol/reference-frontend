import { Fragment } from "react";
import Identicon from "../../icons/identicon/Idenicon";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useRef } from "react/cjs/react.development";
import { shortenAddress } from "../../../../../utils/BlockchainUtils";
import PortalIcon from "../../icons/portalIcon/PortalIcon";

function Chat({ data }) {
  const { account } = useWeb3React();
  const [iconSize, setIconSize] = useState(5);
  const messagesEndRef = useRef();

  const updateDimensions = () => {
    window.innerWidth <= 768 ? setIconSize(5) : setIconSize(10);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [data]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <ol className="chat">
      {data?.map((message, index) => {
        console.log(message)
        const lastMessageDay = data[index - 1]?.timestamp
          ?.split("T")[0]
          .split("-")[2];
        const currentMessageDay = message?.timestamp
          ?.split("T")[0]
          .split("-")[2];
        const renderedTimestamp = message?.timestamp
          ?.split("T")[1]
          .slice(0, 5)
          .split(":");
        const hourFromDB = Number(renderedTimestamp[0]);
        const minutes = renderedTimestamp[1];
        const hourForTimezone =
          hourFromDB - new Date().getTimezoneOffset() / 60;
        const time = `${hourForTimezone}:${minutes}`;

        return data[index - 1]?.account !== data[index]?.account ||
          lastMessageDay === currentMessageDay ||
          index === 0 ? (
          <li
            key={index}
            className={message.type == "BUYER" ? "self" : "other"}
          >
            {message.type == "BUYER" ? (
              <Identicon address={account} size={iconSize} />
            ) : (
              <PortalIcon />
            )}
            <div className="msg">
              <p className="address">
                <span>
                  {message.type == "BUYER"
                    ? shortenAddress(account)
                    : "PORTAL SUPPORT"}
                </span>
              </p>
              <p>{data[index]?.message}</p>
              <time>{time}</time>
            </div>
          </li>
        ) : (
          <Fragment>
            <div className="day">{currentMessageDay}</div>
            <li
              key={index}
              className={message.type == "BUYER" ? "self" : "other"}
            >
              {message.type == "BUYER" ? (
                <Identicon address={account} size={iconSize} />
              ) : (
                <PortalIcon />
              )}
              <div className="msg">
                <p className="address">
                  <span>
                    {message.type == "BUYER"
                      ? shortenAddress(account)
                      : "PORTAL SUPPORT"}
                  </span>
                </p>
                <p>{message?.message}</p>
                <time>{time}</time>
              </div>
            </li>
          </Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </ol>
  );
}

export default Chat;
