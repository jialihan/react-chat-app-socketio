import React, { useEffect } from 'react';
import PhoneIcon from 'src/assets/phone-alt-solid.svg';
import InfoIcon from 'src/assets/info-circle-solid.svg';
import VideoIcon from 'src/assets/video-solid.svg';
import SmileIcon from 'src/assets/smile-beam-solid.svg';
import AttachmentIcon from 'src/assets/folder-plus-solid.svg';
import SendIcon from 'src/assets/paper-plane-solid.svg';
import useChat from 'src/hooks/useChat';
import "./ChatPanel.css";


const ChatPanel = ({ selectedUser }) => {
    const {
        inputMsg,
        setInputMsg,
        inputHandler,
        renderMsgs,
        userTyping,
        keyDownHandler,
        keyUpHandler,
        btnClickSubmitHanlder,
    } = useChat(selectedUser);

    useEffect(() => {
        return () => {
            // cleanup
            setInputMsg('');
        }
    }, [selectedUser])

    if (!selectedUser) {
        return null;
    }
    const { name = '' } = selectedUser;
    return (
        <div className="chat-panel">
            <div className="chat-panel-header">
                <div className="header-name">{name}</div>
                <div className="icons">
                    <div className="icon-wrapper">
                        <img src={PhoneIcon} />
                    </div>
                    <div className="icon-wrapper">
                        <img src={InfoIcon} />
                    </div>
                    <div className="icon-wrapper">
                        <img src={VideoIcon} />
                    </div>
                </div>
            </div>
            <div className="chat-msg-body">
                {renderMsgs}
            </div>
            <div className="chat-panel-footer">
                <input value={inputMsg} onKeyUp={keyUpHandler} onKeyDown={keyDownHandler} onChange={inputHandler} placeholder="send a message..." />
                <div className="icons">
                    <div className="icon-wrapper">
                        <img src={SmileIcon} />
                    </div>
                    <div className="icon-wrapper">
                        <img src={AttachmentIcon} />
                    </div>
                    <div className="icon-wrapper" onClick={btnClickSubmitHanlder}>
                        <img src={SendIcon} />
                    </div>
                </div>
            </div>
            {  userTyping && (
                <div className="type-indicator">{userTyping} is typing....</div>)
            }
        </div>
    )
}

export default ChatPanel;
