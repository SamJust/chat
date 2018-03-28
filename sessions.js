let mongoose = require('mongoose');
let Sessions = mongoose.model('sessions');

var sessions = {};

Sessions.find({}, (err, data)=>{
  sessions = data[0].sessions;
});

module.exports = (req, res, next) => {
  let sessionId;
  if(req.cookies.sessionId == undefined){
    sessionId = '_' + Math.random().toString(36).substr(2, 9)
    res.cookie('sessionId',sessionId);
    sessions[sessionId] = {userid:undefined};
    console.log('session created');
  }
  else {
    sessionId = req.cookies.sessionId;
  }

  req.session = sessions[sessionId];

  res.sessionAdd = (key, value) => {
    if(!key || !value) throw 'Invalid input';
    sessions[sessionId][key] = value;
  };

  res.sessionDelete = (key) => {
    if(!key) throw 'Invalid input';
    sessions[sessionId][key] = undefined;
  };
   return next();
};

setInterval(()=>{
  Sessions.update({}, {
    $set:{
      'sessions': sessions
    }
  }, (err, data)=>{
  });
}, 3000);
