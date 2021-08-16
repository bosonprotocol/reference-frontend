import React, { useEffect, useState, useRef } from "react";
import MessageList from "./message-list/MessageList";
import "./Chat.scss";
import { Arrow } from "../../../../shared-components/icons/Icons";
import { useWeb3React } from "@web3-react/core";

import { getThread } from "../../../../hooks/api";
import { getAccountStoredInLocalStorage } from "../../../../hooks/authenticate";
import io from "socket.io-client";
import { useHistory } from "react-router";

const NEW_CHAT_MESSAGE_EVENT = "message";
const SOCKET_SERVER_URL = "http://localhost:4000";


function Chat(voucherDetails) {
    const history = useHistory();
    const accountChanged = useRef(false);
    const [text, setText] = useState("");
    const [roomId, setRoomId] = useState("");
    const { account } = useWeb3React();
    const messagesEndRef = useRef();
    const voucherId = Object.values(voucherDetails)[0];
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [thread, setThread] = useState('');
    const authData = getAccountStoredInLocalStorage(account);

    useEffect(() => {
        if(accountChanged.current){
            history.push('/');
        } else  {
            accountChanged.current = true;
        }
    }, [account]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
    }, [messages]);

    useEffect(() => {
        setRoomId([voucherId, account].join(","));
        disconnect()
        setText('');
    }, [voucherId, account]);

    useEffect(() => {
        console.log('CONNECT')
        getSlackThreadData();
        WSConnection();
        return () => { disconnect() };
    }, [socketRef, thread, voucherId, account]);

    const onType = (e) => { setText(e.target.value) };

    const onSend = async (e) => {
        e.preventDefault();

        if (text === '') return;

        const requestData = {
            address: account,
            voucherId: voucherId,
            message: text,
        };

        if (!thread && requestData.message) {

            getSlackThreadData();
            WSConnection();

        } else {

            socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
                ...requestData,
                senderId: socketRef.current.id,
            });

        }

        setText("");
    };


    const getSlackThreadData = async () => {
        const response = await getThread({ address: account, voucherId: voucherId, }, authData.authToken);
        setThread(response.data.metadataExists);
    }

    const WSConnection = async () => {

        const ioParams = {
            transports: ['websocket'],
            upgrade: false,
            query: {
                roomId: roomId,
                address: account,
                voucherId: voucherId,
                message: text,
            }
        }

        // Creates a WebSocket connection
        socketRef.current = io(SOCKET_SERVER_URL, ioParams);

        // Listens for incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (messages) => {
            setMessages(messages);
        });

        // Listens for incoming messages
        socketRef.current.off(NEW_CHAT_MESSAGE_EVENT, () => {
            setMessages();
        });

        // Listens for disconnection from server
        socketRef.current.on('disconnect', () => { console.log('DISCONNECTED') });
    }

    const disconnect = () => {
        // Destroys the socket connection 
        socketRef?.current?.disconnect(true);
        // Destroys the socket reference when the connection is closed
        socketRef?.current?.off('connection', () => { });
    }
    return (
        <section className="chat" ref={messagesEndRef}>
            <MessageList data={messages} />
            <form className="chat-form" onSubmit={onSend}>
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
                    onClick={onSend}
                >
                    <Arrow color="#80F0BE" />
                </div>
            </form>
        </section>
    );
}

export default Chat;
