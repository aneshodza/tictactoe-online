class User {
    constructor(uid, socket_id) {
        this.uid = uid;
        this.socket_id = socket_id;
    }

    updateSocket(socket_id) {
        this.socket_id = socket_id;
    }
}

module.exports = User;
