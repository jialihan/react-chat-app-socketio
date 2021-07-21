import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from "react-router";
import UserContext from 'src/context/UserContext';
import ChatList from 'src/components/chatlist/ChatList'
import ChatPanel from '../chatpanel/ChatPanel';
import "./ChatBox.css";
const ChatBox = ({ history }) => {
    const userContext = useContext(UserContext);
    const userId = userContext.myId;
    const [items, setItems] = useState([]);
    const [selectedUser, setSeletedUser] = useState(null);
    useEffect(() => {
        if (userId === null || userId === undefined) {
            // handle user NOT login
            history.push("/login");
        }
        else {
            fetch(`http://localhost:8000/getChatList/${userId}`)
                .then(resp => resp.json())
                .then(dt => {
                    setItems(dt);
                    setSeletedUser(dt[0]);
                });
        }
    }, []);

    const onChangeSelectedUserHandler = (id, name, url) => {
        const newUserObj = {
            id,
            name,
            url
        };
        setSeletedUser(newUserObj);
    }

    return (
        <div className="chatbox-wrapper">
            <h2>Hello, {userContext.name} !</h2>
            <div className="chat-box">
                <ChatList items={items} onSelectedChange={onChangeSelectedUserHandler} />
                <ChatPanel selectedUser={selectedUser} />
            </div>
        </div>
    )
}

export default withRouter(ChatBox);
