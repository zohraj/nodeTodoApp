var config = require('../config')
exports = module.exports = function (io) {
   
    // Set socket.io listeners.
    io.on('connection', function (socket) {
        onConnect(socket);
    });


    onConnect = (socket) => {
        console.log("connected with socket");
        socket.emit("new-message","I am server");


        // On conversation entry, join broadcast channel
        socket.on('enter conversation', (conversation) => {
            socket.join(conversation);
            // console.log('joined ' + conversation);
        });

        socket.on('leave conversation', (conversation) => {
            socket.leave(conversation);
            // console.log('left ' + conversation);
        })

        socket.on('new-message', (conversation) => {
            onRecevingNewMessage(conversation);
            // io.sockets.in(conversation).emit('refresh messages', conversation);
        });

        socket.on('disconnect', () => {
            //console.log('user disconnected');
        });
        onHandShaking(socket)
    }
    onHandShaking = (socket) => {
        var handshake = socket.handshake;
        console.log("socket Id : " + socket.id + " and token: " + handshake.query.id);

        onlineUsers = config.onlineUsers;
        var userFound = false;
        onlineUsers.forEach(function (user) {
            if (user.userId == handshake.query.id) {
                userFound = true
            }

        })
        if (!userFound && handshake.query.id && handshake.query.id != 'undefined' && socket.id) {
            onlineUsers.push({
                "userId": handshake.query.id,
                "socketId": socket.id
            })
        }
        else {
            onlineUsers.forEach(function (user) {
                if (user.userId == handshake.query.id) {
                    user.socketId = socket.id
                }
            })
        }
        config.onlineUsers = onlineUsers
    }
    onRecevingNewMessage = (data) => {
        console.log(data);
        var recipient;
        onlineUsers.forEach(function (user) {
            if (user.userId == data.to) {
                recipient = user;
            }
        })
        console.log(onlineUsers);
        if (recipient) {
            io.to(recipient.socketId).emit("new-message", data.message);
        }
    }
}