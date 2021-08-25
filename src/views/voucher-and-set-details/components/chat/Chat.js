import React, { useEffect, useState, useRef, Fragment } from "react";
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
    const [text, setText] = useState("");
    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(true);
    const isAccountChangedRef = useRef(false);
    const isMountedRef = useRef(false);
    const isInitialMessageRef = useRef(true);
    const inputRef = useRef(null);
    const history = useHistory();
    const { account } = useWeb3React();
    const voucherId = Object.values(voucherDetails)[0];
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    const [thread, setThread] = useState('');
    const authData = getAccountStoredInLocalStorage(account);

    useEffect(() => {

        if (socketRef?.current?.connected) {
            setLoading(false);
            inputRef.current?.focus();
        } else if (isMountedRef) {
            setTimeout(() => {
                setLoading(false);
                inputRef.current?.focus();
            }, 750);
        }

    }, [socketRef?.current?.connected])

    useEffect(() => {
        if (isAccountChangedRef.current) {
            history.push('/');
        } else {
            isAccountChangedRef.current = true;
        }
    }, [account]);

    useEffect(() => {
        setRoomId([voucherId, account].join(","));
        isInitialMessageRef.current = true;
        disconnect();
    }, [voucherId, account]);

    useEffect(() => {

        if (isMountedRef.current && thread) {
            WSConnection();
        } else {
            isMountedRef.current = true;
            getSlackThreadData();
            WSConnection();
        }

        return () => {
            disconnect();
            setText('');
        };

    }, [thread, voucherId, account]);

    const onType = (e) => { setText(e.target.value) };

    const onSend = async (e) => {
        e.preventDefault();

        if (text === '' || !socketRef?.current?.connected) return;

        const requestData = {
            address: account,
            voucherId: voucherId,
            message: text,
        };

        if (!thread && requestData.message && isInitialMessageRef.current) {
            WSConnection();
            setLoading(true);
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

            if (messages.length === 1) {
                // Render first message in order to remove the link directing to the URL of the voucher
                setMessages((previousMessages => {
                    if (previousMessages[0] && (previousMessages[0].message.split('\n').length > 1)) {
                        previousMessages[0].message = previousMessages[0]?.message?.split('\n')[1];
                    } else if (!previousMessages[0]) {
                        messages[0].message = messages[0]?.message?.split('\n')[1];
                    }
                    return [...previousMessages, ...messages]
                }));

            } else {
                // Render first message in order to remove the link directing to the URL of the voucher
                messages[0].message = messages[0]?.message.split('\n')[1];
                setMessages(messages);
            }

            inputRef.current?.focus();
            isInitialMessageRef.current = false;
        });

        // Listens for incoming messages
        socketRef.current.off(NEW_CHAT_MESSAGE_EVENT, () => {
            setMessages('');
        });

        // Listens for disconnection from server
        socketRef.current.on('disconnect', () => { console.log('DISCONNECTED') });
    }

    const disconnect = () => {
        // Destroys the socket connection 
        socketRef?.current?.close()
        // Destroys the socket reference when the connection is closed
        socketRef?.current?.off('connection', () => { });
    }

    return (
        <section className="chat">
            <MessageList data={messages} />
            <form className="chat-form" onSubmit={onSend} >
                <input
                    ref={inputRef}
                    className="textarea"
                    disabled={loading}
                    type="text"
                    placeholder="Write a message..."
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
