const mongoose = require('mongoose');

let User = mongoose.model("users");

module.exports = (app)=>{
  app.get('/profile/:profileName', (req, res)=>{
    User.findOne({username: req.params.profileName}, (err, data)=>{
      if(req.session.username != req.params.profileName && req.session.username){
        let checkFriends = data._doc.friends.find((value, index, array)=>{
          return value === req.session.username;
        });
        let checkSent = data._doc.sentRequests.find((value, index, array)=>{
          return value === req.session.username;
        });
        let checkRecieved = data._doc.recievedRequests.find((value, index, array)=>{
          return value === req.session.username;
        });
        if(checkFriends){
          res.render('profile', {data:data, showFriendsButton:"no", username: req.session.username});
        } else if(checkSent){
          res.render('profile', {data:data, showFriendsButton:"alreadyRecieved", username: req.session.username});
        } else if (checkRecieved) {
          res.render('profile', {data:data, showFriendsButton:"alreadySent", username: req.session.username});
        } else {
          res.render('profile', {data:data, showFriendsButton:"yes", username: req.session.username});
        }
      }
      else res.render('profile', {data:data, showFriendsButton:"no", username: req.session.username});
    });
  });

  app.post('/profile', (req, res)=>{
    User.findOne({username: req.body.username}, (err, data)=>{
      if(data) res.send(data.username);
      else res.send(undefined);
    });
  });

  app.post('/friend', (req, res)=>{
    User.findOne({username: req.body.sendto}, (err, data)=>{
      let check = data._doc.friends.find((value, index, array)=>{
        return value === req.body.sendto;
      });
      if(!check){
        User.update({username: req.body.sendto},
          { $push: { "recievedRequests": req.session.username } }, (err, data)=>{
            User.update({username: req.session.username},
              { $push: { "sentRequests": req.body.sendto } }, (err, data)=>{
                res.redirect("/profile/" + req.body.sendto);
            });
        });
      }
      else{
        res.redirect("/profile/" + req.body.sendto);
      }
    });
  });

  app.post('/friendaccept', (req, res)=>{
    User.update({username: req.session.username},
      {$pull:{"recievedRequests":req.body.of}, $push:{'friends':req.body.of}}
      , (err, data)=>{
        User.update({username: req.body.of},
          {$pull:{"sentRequests":req.session.username}, $push:{'friends':req.session.username}}
          , (err, data)=>{
          res.end();
        });
    });
  });
};
