let mongoose = require('mongoose');

let User = mongoose.model('users');

let bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = (app)=>{
  app.get('/login', (req, res)=>{
    if(req.session.id) res.redirect('/');
    res.render('login');
  });

  app.post('/login', (req, res)=>{
    User.findOne({username:req.body.username}, {username:1, password:1}).then((data, err)=>{
        if(data.length == 0){
          res.send('login');
          return;
        }
        bcrypt.compare(req.body.password, data.password, (err, check)=>{
        if(check){
          res.sessionAdd('username', req.body.username);
          res.send(true);
        }
        else {
          res.send(false);
        }
      });
    });
  });

  app.post('/registration', (req, res)=>{
    if(req.body.username.length == 0)
    {
      res.send('login');
      return;
    }
    if(req.body.password.length == 0)
    {
      res.send('Password is empty');
      return;
    }
    User.find({username:req.body.username}, (err, data)=>{
      if(data.length != 0){
        res.send('loginIsTaken');
        return;
      }
      User.find({email:req.body.email}, (err, data)=>{
        if(data.length !=0){
          res.send('emailIsTaken');
          return;
        }
        bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
          User.create({
            username: req.body.username,
            password: hash,
            email: req.body.email},
            ()=>{
              res.send('true');
            });
          });
      });
    });
  });
  app.get('/logof', (req, res)=>{
    res.sessionDelete("username");
    res.redirect('/');
  });
};
