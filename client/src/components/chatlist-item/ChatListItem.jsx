import React from 'react'
import "./ChatListItem.css";
const defaultAvatarURL = "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png";
const ChatListItem = ({ id, name, url, date, lastMsg, clicked }) => {
    return (
        <div className="chatlist-item" onClick={clicked.bind(null, id, name, url)}>
            <div className="item-avatar">
                <img src={url ? url : defaultAvatarURL} width="100%" height="100%" />
            </div>
            <div className="item-info">
                <div className="item-info-header">
                    <div className="name">
                        {name}</div>
                    <div className="msg-date">
                        {date}</div>
                </div>
                <div className="footer">
                    {lastMsg}
                </div>
            </div>
        </div>
    )
}

export default ChatListItem
