'use strict';

const express = require('express')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , socketIO = require('socket.io')
    , PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/chat").then(()=>{
  console.log('Connected to a DB');
}, ()=>{
  console.log('Something is wrong with DB');
});

const schemas = require('./mongooseSchemas.js')
    , sessions = require('./sessions.js');

let app = express()
  , urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(cookieParser());
app.use(urlencodedParser);
app.use(sessions);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

let loginController = require('./controllers/loginController')(app);
let chatController = require('./controllers/chatController')(app);
let profileController = require('./controllers/profileController')(app);

app.get('/', (req, res)=>{
  if(!req.session.username){
    res.redirect('/login');
  }
  else {
    res.redirect('/chat');
  }
});

app.get('*', (req, res)=>{
  res.sendFile(__dirname + '/404.html');
});

let server = app.listen(PORT, ()=>{
  console.log(`Listening to port ${PORT}`);
});

let socket = require('./io.js')(server);
