let mongoose = require('mongoose')
  , User = mongoose.model('users')
  , Message = mongoose.model('messages')
  , EventEmitter = require('events').EventEmitter;

let getLastMessgages = async (username, friendsArray, destinationArray)=>{
  if(friendsArray.length == 0)return;
  let promise = await new Promise((resolve, reject)=>{
    let eventEmitter = new EventEmitter()
      , messagesLoaded = 0;
    for(let i = 0; i < friendsArray.length; i++){
      Message.findOne({$or:[{sender: username, reciever: friendsArray[i]},
                          {sender: friendsArray[i], reciever: username}]}, {},
                          { sort: { date : -1 } }, (err, data)=>{
                            if(data != null) destinationArray.push(data);
                            else destinationArray.push({sender: friendsArray[i], reciever: friendsArray[i], date: 0, read:"true"});
                            eventEmitter.emit('loaded');
                          });
    }
    eventEmitter.on('loaded', ()=>{
      messagesLoaded++;
      if(messagesLoaded == friendsArray.length){
        resolve();
      }
    });
  }).then((result)=>{
    return;
  }, (err)=>{});
};

let sortMessages = (messages)=>{
  return messages.sort((a, b)=>{
    if(a == null) return false;
    return +b.date - (+a.date);
  });
};

module.exports = (app)=>{
  app.get('/chat', (req, res)=>{
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    User.findOne({username:req.session.username}, {password:0, email:0}, (err, friends)=>{
      Message.find({$or:[{sender: req.session.username, reciever: req.query.with},
                         {sender: req.query.with, reciever: req.session.username}]}, async (err, messages)=>{
                           let arr = [];
                           await getLastMessgages(req.session.username, friends._doc.friends, arr);
                           let sortedArray = await sortMessages(arr);
                           let sortedFriends = [];
                           for (let item in sortedArray){
                             if(sortedArray[item].sender == req.session.username) sortedFriends.push({friend:sortedArray[item].reciever, read: sortedArray[item].read});
                             else sortedFriends.push({friend:sortedArray[item].sender, read: sortedArray[item].read});
                           }
                           res.render('chat', {friends:sortedFriends, messages: messages, username: req.session.username});
                         });
    });
  });
  app.get('/username', (req, res)=>{
    res.send(req.session.username);
  });
  app.get('/messages', (req, res)=>{
    Message.find({$or:[{sender: req.session.username, reciever: req.query.with},
                       {sender: req.query.with, reciever: req.session.username}]},
                       {_id:0},
                       (err, data)=>{
                         res.send(data);
                       });
    Message.updateMany({$or:[{sender: req.session.username, reciever: req.query.with, read: 'unread'},
                         {sender: req.query.with, reciever: req.session.username, read: 'unread'}]},
                   {$set:{read:"read"}}, ()=>{});
  });

  app.post("/setread", (req, res)=>{
    Message.updateMany({$or:[{sender: req.session.username, reciever: req.body.with, read: 'unread'},
                             {sender: req.body.with, reciever: req.session.username, read: 'unread'}]},
                       {$set:{read:"read"}},
                       ()=>{});
  });
};
