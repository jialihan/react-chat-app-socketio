var app = require('express')();
var cors = require('cors');
const fs = require('fs');
const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
const Socket_PORT = 8080;
const HTTP_PORT = 8000;

// Cors Config
const whitelist = ['http://localhost:3000', 'http://localhost:3001']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

server.listen(Socket_PORT, () => {
    console.log(`socket listening on :${Socket_PORT}`);
});

app.listen(HTTP_PORT, () => {
    console.log(`app listening on :${HTTP_PORT}`);
});

// // Rest API data
// var chatlist = require('./chat-list.json');
// app.get('/getChatList', cors(corsOptions), (req, res) => {
//     const data = {
//         list: JSON.stringify(chatlist),
//     }
//     res.json(data);
// });
app.get('/auth/:name', cors(corsOptions), (req, res) => {
    var name = req.params.name;
    var id = -1;
    if (name === 'jelly') {
        id = 0;
    }
    else if (name === 'alice') {
        id = 1;
    }
    else if (name === 'bob') {
        id = 2;
    }
    const data = { id: id, name: name };
    res.json(data);
})

app.get('/getChatList/:id', cors(corsOptions), (req, res) => {
    var id = req.params.id;
    fs.readFile('./chat-list.json', (err, data) => {
        if (err) throw err;
        var dt = JSON.parse(data);
        res.json(dt[id]);
    });
});

app.get('/getChatHistory/:id1/:id2', cors(corsOptions), (req, res) => {
    var id1 = req.params.id1;
    var id2 = req.params.id2;
    var key1 = id1 + "-" + id2;
    var key2 = id2 + "-" + id1;
    fs.readFile('./chat-history.json', (err, data) => {
        if (err) throw err;
        var chatHistory = JSON.parse(data);
        var resp = chatHistory[key1];
        if (!resp) {
            resp = chatHistory[key2];
        }
        res.json(resp);
    });
});

const getNameById = (userId) => {
    var name = '';
    if (userId === 0) {
        name = 'jelly';
    }
    else if (userId === 1) {
        name = 'alice';
    }
    else if (userId === 2) {
        name = 'bob';
    }
    return name;
}

// Socket events
io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
    console.log('new client connected');
    socket.emit('connection', null);
    // Save current socket
    const { id } = socket.handshake.query;
    socket.join(id);

    // Listen for new messages
    socket.on('send-new-msg', (data) => {
        var msgData = JSON.parse(data);
        io.in(id).emit('receive-new-msg', msgData);
    });

    // Listen to user typing event
    socket.on("user-typing", (data) => {
        var { roomId, userId } = JSON.parse(data);
        var name = getNameById(userId);
        var typeData = {
            userId,
            name
        }
        io.in(roomId).emit('user-typing', typeData);
    });
    socket.on("stop-typing", (data) => {
        var { roomId, userId } = JSON.parse(data);
        var name = getNameById(userId);
        var typeData = {
            userId,
            name
        }
        io.in(roomId).emit('stop-typing', typeData);
    });

    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        socket.leave(id);
    });

});




