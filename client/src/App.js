import './App.css';
import ChatBox from 'src/components/chatbox/ChatBox';
import Login from 'src/components/login/Login';
import UserContext from 'src/context/UserContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useState } from 'react';

function App() {
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);

  return (
    <UserContext.Provider value={{
      myId: id,
      setMyId: setId,
      name: name,
      setName, setName
    }}>
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/chat">
            <ChatBox />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
