const Lobby = require('./lobby');

const express = require('express');
const app = express();
const port = 3001;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

let lobby = undefined;

io.on('connection', (socket) => {
    console.log(socket.handshake.query.uid);
    if (socket.handshake.query.uid === undefined) {
        socket.disconnect();
    }
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    console.log(lobby)
    if (lobby === undefined) {
        lobby = new Lobby();
        lobby.initialize(socket.handshake.query.uid, socket.id);
        socket.emit('joined', {player: 1});
    } else {
        lobby.join(socket.handshake.query.uid, socket.id);
        socket.emit('joined', {
            player: lobby.p1.uid === socket.handshake.query.uid ? 1 : 2
        });
    }
});

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
