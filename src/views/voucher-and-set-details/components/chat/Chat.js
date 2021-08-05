import React, { useState } from "react";
import { chatSendMessage, getChatHistory } from "../../../../hooks/api";
import MessageList from "./message-list/MessageList";
import "./Chat.scss";
import { Arrow } from "../../../../shared-components/icons/Icons";
import messageListData from "././message-list/messageListData";
import { useEffect, useRef } from "react/cjs/react.development";
import { useWeb3React } from "@web3-react/core";
import { getAccountStoredInLocalStorage } from "../../../../hooks/authenticate";

function Chat(voucherDetails) {
  const [text, setText] = useState("");
  const [data, setData] = useState(messageListData);
  const voucherId = Object.values(voucherDetails)[0];
  const { account } = useWeb3React();

  const messagesEndRef = useRef();
  const authData = getAccountStoredInLocalStorage(account);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const requestData = {
        address: account,
        voucherId: voucherId,
      };
      const chatHistory = await getChatHistory(requestData, authData.token);
      console.log(chatHistory);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const onType = (e) => {
    setText(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    const updateMsgs = () => {
      const newArr = data.slice(0);
      newArr.push({
        account,
        timestamp: "2021-08-02T16:00:00Z",
        message: text,
      });
      setData(newArr);
    };
    updateMsgs();

    const requestData = {
      address: account,
      voucherId: voucherId,
      message: text,
    };
    await chatSendMessage(requestData, authData.token);

    setText("");
  };

  return (
    <section className="chat" ref={messagesEndRef}>
      <MessageList data={data} />
      <form className="chat-form" onSubmit={onSubmit}>
        <input
          className="textarea"
          type="text"
          placeholder="Type"
          value={text}
          onInput={onType}
        />
        <div
          className="button square new"
          role="button"
          id="topNavBackButton"
          onClick={onSubmit}
        >
          <Arrow color="#80F0BE" />
        </div>
      </form>
    </section>
  );
}

export default Chat;
