import React, { useState } from "react";
import MessageList from "./message-list/MessageList";
import "./Chat.scss";
import { Arrow } from "../../../../shared-components/icons/Icons";
import messageListData from "././message-list/messageListData";
import { useEffect, useRef } from "react/cjs/react.development";
import { useWeb3React } from "@web3-react/core";

function Chat() {
    const [text, setText] = useState('');
    const [data, setData] = useState(messageListData);
    const { account } = useWeb3React();

    const messagesEndRef = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
    }

    useEffect(() => {
        scrollToBottom()
    }, [data])

    const onType = (e) => { setText(e.target.value); }

    const onSubmit = (e) => {
        e.preventDefault();
        if (!text) return;
        const updateMsgs = () => {
            const newArr = data.slice(0);
            newArr.push({ account, timestamp: "2021-08-02T16:00:00Z", message: text });
            setData(newArr);
        };
        updateMsgs();
        setText("");
    }

    return (
        <section className="chat" ref={messagesEndRef}>
            <MessageList data={data} />
            <form className='chat-form' onSubmit={onSubmit}>
                <input className="textarea" type="text" placeholder="Type" value={text} onInput={onType} />
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
