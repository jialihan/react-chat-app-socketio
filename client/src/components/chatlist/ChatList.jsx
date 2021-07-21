import React, { useState, useEffect } from 'react';
import ChatListItem from 'src/components/chatlist-item/ChatListItem';
import "./ChatList.css";

const ChatList = ({ items, onSelectedChange }) => {
    let list = items.map(el => <ChatListItem
        key={el.id}
        id={el.id}
        name={el.name}
        url={el.url}
        date={el.date}
        lastMsg={el.lastMsg}
        clicked={onSelectedChange}
    />);
    return (
        <div className="chat-list">
            {list}
        </div>
    )
}

export default ChatList
