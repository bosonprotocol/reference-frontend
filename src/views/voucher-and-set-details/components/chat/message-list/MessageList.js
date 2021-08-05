import { Fragment } from "react";
import Identicon from "../identicon/Idenicon";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react/cjs/react.development";

function Chat({ data }) {
  {
    /* {((messageListData[index - 1]?.account !== messageListData[index]?.account) || index === 0) && <p>{messageListData[index]?.message}</p>} */
  }
  {
    /* {(messageListData[index - 1]?.account !== messageListData[index]?.account) && (nextMessageDay === currentMessageDay) && <p>{messageListData[index + 1]?.message}</p>} */
  }

  const { account } = useWeb3React();
  const [iconSize, setIconSize] = useState(5);

  const updateDimensions = () => {
    window.innerWidth <= 768 ? setIconSize(5) : setIconSize(10);
  };
  const newDataInstance = data.slice(0);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <ol className="chat">
      {newDataInstance.map((message, index) => {
        const lastMessageDay = newDataInstance[index - 1]?.timestamp
          .split("T")[0]
          .split("-")[2];
        const currentMessageDay = message.timestamp.split("T")[0].split("-")[2];
        const time = message.timestamp.split("T")[1].slice(0, 5);

        return newDataInstance[index - 1]?.account !==
          newDataInstance[index]?.account ||
          lastMessageDay === currentMessageDay ||
          index === 0 ? (
          <li
            key={index}
            className={message.account == account ? "self" : "other"}
          >
            <Identicon address={data[index].account} size={iconSize} />
            <div className="msg">
              <p className="address">
                <span>0x2..24b</span>
              </p>
              <p>{newDataInstance[index]?.message}</p>
              <time>{time}</time>
            </div>
          </li>
        ) : (
          <Fragment>
            <div className="day">Mon</div>
            <li
              key={index}
              className={message.account == account ? "self" : "other"}
            >
              <Identicon address={data[index].account} size={iconSize} />
              <div className="msg">
                <p className="address">
                  <span>0x2..24b</span>
                </p>
                <p>{newDataInstance[index]?.message}</p>
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
