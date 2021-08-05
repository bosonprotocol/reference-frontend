import { Fragment } from "react";
import Identicon from "../identicon/Idenicon";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react/cjs/react.development";

function Chat({ data }) {
  {
    /* {((messageListData[index - 1]?.account !== messageListData[index]?.account) || index === 0) && <p>{messageListData[index]?.message}</p>} */
  }
  {
    /* {(messageListData[index - 1]?.account !== messageListData[index]?.account) && (nextMessageDay === currentMessageDay) && <p>{messageListData[index + 1]?.message}</p>} */
  }

  const { account } = useWeb3React();

  const newDataInstance = data.slice(0);

  newDataInstance.forEach((msg, i) => {
    if (msg.account === account) {
      newDataInstance[i].account = "self";
    }
  });

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
          <Fragment>
            <li key={index} className={message.account}>
              <div className="avatar">
                <Identicon address={data[index].account} />
              </div>
              <div className="msg">
                <p className="address">
                  <span>0x2..24b</span>
                </p>
                <p>{newDataInstance[index]?.message}</p>
                <time>{time}</time>
              </div>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <div className="day">Mon</div>
            <li key={index} className={message.account}>
              <div className="avatar">
                <Identicon address={data[index].account} />
              </div>
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
