var config = require('../config')
exports = module.exports = function (io) {
    // io.on('connection', function (socket) {

    //   })

    // Set socket.io listeners.
    io.on('connection', (socket) => {

    });
    io.use(function (socket) {
        console.log('a user connected');
        onConnect(socket);

        // On conversation entry, join broadcast channel
        socket.on('enter conversation', (conversation) => {
            socket.join(conversation);
            // console.log('joined ' + conversation);
        });

        socket.on('leave conversation', (conversation) => {
            socket.leave(conversation);
            // console.log('left ' + conversation);
        })

        socket.on('new message', (conversation) => {
            onRecevingNewMessage(conversation);
            // io.sockets.in(conversation).emit('refresh messages', conversation);
        });

        socket.on('disconnect', () => {
            //console.log('user disconnected');
        });
        onHandShaking(socket)
    });
}
onConnect = () => {
    console.log("connected with socket");
    // socket.on('new-message', function (data) {


    // });
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
            result = user;
        }
    })
    console.log(onlineUsers);
    if (result) {
        io.to(result.socketId).emit("new-message", data.message);
    }
}