import React from 'react';

const userContext = React.createContext({
    myid: null,
    name: null,
    setName: () => { },
    setMyId: () => { },
});

export default userContext;