import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import io from "socket.io-client";
import UserContext from 'src/context/UserContext';
import Message from 'src/components/message/Message';

const myAvatarURL = "https://static.vecteezy.com/system/resources/thumbnails/001/993/889/small_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg";
const SERVER = "http://localhost:8080/";

const useChat = (selectedUser) => {
    const userContext = useContext(UserContext);
    const [inputMsg, setInputMsg] = useState('');
    const [userTyping, setUserTyping] = useState(null);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    /************* Socket Io related ****************************/
    useEffect(() => {
        if (selectedUser) {
            const userId = userContext.myId;
            //fetch chat history
            fetch(`http://localhost:8000/getChatHistory/${userId}/${selectedUser.id}`) // optional chaning ES2020
                .then(resp => resp.json())
                .then(data => {
                    setMessages((prevData) => [...prevData, ...data]);
                });
            // set up socket
            const roomId = [userId, selectedUser.id].sort((a, b) => a - b).join('-');
            socketRef.current = io(SERVER, {
                query: { id: roomId },
            });

            socketRef.current.on('connection', () => {
                console.log(`I'm connected with the back-end.`);
            });

            socketRef.current.on('receive-new-msg', (msgData) => {
                let obj;
                if (msgData.fromId === userId) {
                    obj = { ...msgData, url: myAvatarURL };
                }
                else {
                    obj = { ...msgData, url: selectedUser.url }
                }
                setMessages((messages) => [...messages, obj]);
            });
            socketRef.current.on('user-typing', (typeData) => {
                if (typeData.userId !== userContext.myId) {
                    // Only show another is typing
                    setUserTyping(typeData.name);
                }
            });
            socketRef.current.on('stop-typing', (typeData) => {
                console.log("stop type:", typeData);
                setUserTyping(null);
            });
        }
        return () => {
            if (selectedUser) {
                socketRef.current.disconnect();
            }
            setMessages([]);
            setUserTyping(null);
        };
    }, [selectedUser]);
    const sendMessage = (fromId, toId, msg) => {
        const msgObject = {
            fromId,
            toId,
            msg
        };
        console.log("emit new msg to sever: ", msgObject);
        socketRef.current.emit("send-new-msg", JSON.stringify(msgObject));
    };
    const sendUserTyping = (roomId, userId) => {
        console.log("sent type event... ");
        const obj = {
            roomId,
            userId
        };
        socketRef.current.emit("user-typing", JSON.stringify(obj));
    };
    const sendStopTyping = (roomId, userId) => {
        console.log("sent stop type event... ");
        const obj = {
            roomId,
            userId
        };
        socketRef.current.emit("stop-typing", JSON.stringify(obj));
    };
    /******************* User type input related  ********************/
    const debounce = (fn, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (timer) {
                    fn(...args);
                }
                timer = null;
            }, delay);
        }
    }
    let inputHandler = (e) => {
        e.preventDefault();
        setInputMsg(e.target.value);
    }
    let keyDownHandler = (e) => {
        console.log("key down event");
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputMsg && inputMsg.length > 0) {
                sendMessage(userContext.myId, selectedUser.id, inputMsg);
                setInputMsg('');
            }
        }
        else {
            // handle user typing evnet
            if (selectedUser) {
                const roomId = [userContext.myId, selectedUser.id].sort((a, b) => a - b).join('-');
                console.log("roomId = " + roomId);
                sendUserTyping(roomId, userContext.myId);
            }
        }
    }
    let keyUpHandler = (e) => {
        if (e.key !== 'Enter') {
            console.log("stop type event");
            if (selectedUser) {
                const roomId = [userContext.myId, selectedUser.id].sort((a, b) => a - b).join('-');
                sendStopTyping(roomId, userContext.myId);
            }
        }
    }
    keyDownHandler = useCallback(
        debounce(keyDownHandler, 500),
        [selectedUser, userContext.myId],
    );
    keyUpHandler = useCallback(
        debounce(keyUpHandler, 500),
        [selectedUser, userContext.myId],
    );

    const btnClickSubmitHanlder = (e) => {
        e.preventDefault();
        if (inputMsg && inputMsg.length > 0) {
            sendMessage(userContext.myId, selectedUser.id, inputMsg);
            setInputMsg('');
        }
    }

    let renderMsgs = messages.map((el, i) => {
        var type = el.fromId === selectedUser.id ? 'left' : 'right';
        return <Message key={i} type={type} url={el.url} msg={el.msg} />;
    });

    return {
        // user input related
        inputMsg,
        renderMsgs,
        userTyping,
        setInputMsg,
        inputHandler,
        setInputMsg,
        keyDownHandler,
        keyUpHandler,
        btnClickSubmitHanlder
    };
}

export default useChat;
