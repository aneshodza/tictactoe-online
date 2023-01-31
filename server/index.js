const express = require('express');
const app = express();
const port = 3001;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
