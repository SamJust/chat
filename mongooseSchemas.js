let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  date: Number,
  friends: Array,
  recievedRequests: Array,
  sentRequests: Array
});

mongoose.model('users', userSchema);

let messageSchema = new mongoose.Schema({
  sender: String,
  reciever: String,
  text: String,
  date: String,
  read: String,
});

mongoose.model('messages', messageSchema);

let sesionsSchema = new mongoose.Schema({
  sessions: Object
});

mongoose.model('sessions', sesionsSchema);
