import { Fragment } from "react";
import Identicon from "../identicon/Idenicon";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react/cjs/react.development";
import { shortenAddress } from "../../../../../utils/BlockchainUtils";

function Chat({ data }) {
  const { account } = useWeb3React();
  const [iconSize, setIconSize] = useState(5);

  const updateDimensions = () => {
    window.innerWidth <= 768 ? setIconSize(5) : setIconSize(10);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <ol className="chat">
      {data.map((message, index) => {
        const lastMessageDay = data[index - 1]?.timestamp
          .split("T")[0]
          .split("-")[2];
        const currentMessageDay = message.timestamp.split("T")[0].split("-")[2];
        const time = message.timestamp.split("T")[1].slice(0, 5);

        return data[index - 1]?.account !== data[index]?.account ||
          lastMessageDay === currentMessageDay ||
          index === 0 ? (
          <li
            key={index}
            className={message.type == "BUYER" ? "self" : "other"}
          >
            {message.type == "BUYER" ? (
              <Identicon address={data[index].account} size={iconSize} />
            ) : (
              ""
            )}
            <div className="msg">
              <p className="address">
                <span>
                  {message.type == "BUYER" ? shortenAddress(account) : "SELLER"}
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
              className={message.account == account ? "self" : "other"}
            >
              <Identicon address={data[index].account} size={iconSize} />
              <div className="msg">
                <p className="address">
                  <span>
                    {message.type == "BUYER"
                      ? shortenAddress(account)
                      : "SELLER"}
                  </span>
                </p>
                <p>{data[index]?.message}</p>
                <time>{time}</time>
              </div>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

export default Chat;
//
