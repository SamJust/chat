const socketIO = require('socket.io')
    , mongoose = require('mongoose');

let Message = mongoose.model('messages');

module.exports = (server)=>{

  let io = socketIO(server);

  io.on('connection', (socket)=>{
    // socket.id = socket.handshake.query.username;
    socket.join(socket.handshake.query.username);
    socket.on('sendMessage', (name, msg, to)=>{
      Message.create({
        sender: name,
        reciever: to,
        text: msg,
        date: Date.now(),
        read: "unread"
      });
      socket.to(to).emit('recieveMessage', name, msg);
      socket.emit('recieveMessage', name, msg, to);
    });
  });
};
