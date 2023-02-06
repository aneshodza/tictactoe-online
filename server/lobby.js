const User = require('./user');

class Lobby {
    initialize(p1, socket_id) {
        this.p1 = new User(p1, socket_id);
        this.p2 = null;
        this.started = false;
        this.finished = false;
        this.whoWon = 0;
        this.turn = 1;
        this.field = Array.from({length: 9}, (_, index) => ({id: index, value: 0}));
    }

    isFull() {
        return this.p2 !== null;
    }

    join(p2, socket_id) {
        if (p2 === 'p1') {
            this.p1.updateSocket(socket_id);
            return false;
        } else if (p2 === 'p2') {
            this.p2.updateSocket(socket_id);
            return false;
        }
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
        if (this.field[move].value !== 0) {
            return false;
        }

        if (uid === 'p1') {
            this.field[move].value = 1;
            this.turn = 2;
            return true;
        } else if (uid === 'p2') {
            this.field[move].value = 2;
            this.turn = 1;
            return true;
        }

        if (this.turn === 1 && uid !== this.p1.uid) {
            return false;
        } else if (this.turn === 2 && uid !== this.p2.uid) {
            return false;
        }
        
        this.field[move].value = this.turn;
        this.turn = this.turn === 1 ? 2 : 1;
        return true;
    }

    checkWin(whoMoved) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        let tempField = [...this.field]
        tempField = tempField.filter(square => square.value === whoMoved)
        let fieldIds = []
        tempField.forEach(square => {
            fieldIds.push(square.id)
        })
        for (let i = 0; i < winConditions.length; i++) {
            if(winConditions[i].filter(id => fieldIds.includes(id)).length === 3) {
                this.finished = true;
                this.whoWon = whoMoved
                return true
            }
        }
        return false
    }
}

module.exports = Lobby;
