const User = require('./user');

class Lobby {
    initialize(p1, socket_id) {
        this.p1 = new User(p1, socket_id);
        this.p2 = null;
        this.started = false;
        this.finished = false;
        this.turn = 1;
    }

    isFull() {
        return this.p2 !== null;
    }

    join(p2, socket_id) {
        if (p2 === this.p1.uid) {
            this.p1.updateSocket(socket_id);
            return false;
        } else if (this.p2 && p2 === this.p2.uid) {
            this.p2.updateSocket(socket_id);
            return false;
        }

        if (this.isFull()) {
            return false;
        }
        this.p2 = new User(p2, socket_id);
        this.started = true;
        return true;
    }

    play(uid, move) {
        if (!this.started || this.finished) {
            return false;
        } else if (this.turn === 1 && uid !== this.p1.uid) {
            return false;
        } else if (this.turn === 2 && uid !== this.p2.uid) {
            return false;
        }

        this.turn = this.turn + 1 % 2;
        return true;
    }
}

module.exports = Lobby;
