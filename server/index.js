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
        let player;
        if (lobby.p1.uid === socket.handshake.query.uid) {
            player = 1;
        } else if (lobby.p2 && lobby.p2.uid === socket.handshake.query.uid) {
            player = 2;
        } else {
            player = 3;
        }

        socket.emit('joined', {
            player: player
        });
    }
});

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.post('/move', (req, res) => {
    console.log(req.body);
    console.log(lobby.play(req.body.uid, req.body.move));
    res.send('ok');
})

