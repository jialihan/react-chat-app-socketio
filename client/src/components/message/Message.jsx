import React from 'react';
import "./Message.css";

const defaultAvatarURL = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png";
const Message = ({ url, msg, type }) => {
    return (
        <div className={`msg-box ${type}`}>
            <div className="user-avatar">
                <img src={url} width="100%" height="100%" />
            </div>
            <div className={`msg-bubble ${type}`}>
                {msg}
            </div>
        </div>
    )
}

Message.defaultProps = {
    type: 'left',
    msg: 'Hello, happy to chat with you. Hello, happy to chat with you',
    url: defaultAvatarURL,
}

export default Message
