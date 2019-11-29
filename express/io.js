let io
module.exports = {
    init: function(http) {
        // start socket.io server and cache io value
        io = require('socket.io')(http, {
          origins: 'http://localhost:3000',
          transports: ['websocket']
        })
        return io
    },
    getio: function() {
        // return previously cached value
        if (!io) {
            throw new Error("must call .init(server) before you can call .getio()");
        }
        return io
    }
}