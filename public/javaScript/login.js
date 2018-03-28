let reg = false;

let validateEmail = (mail)=>{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
};

window.onload = ()=>{

  document.getElementById('registration').onclick =()=>{
    if(reg)
    {
      let email = document.getElementById('email')
        , passrepeat = document.getElementById('passrepeat')
        , parent = email.parentNode;
        parent.removeChild(email);
        parent.removeChild(passrepeat);
        document.getElementById('registration').innerHTML = 'Registration';
        document.getElementById('submit').value = "Log in";
        reg = false;
    }
    else {
      let parent = document.getElementById('password')
        , password = parent.cloneNode(false)
        , email = parent.cloneNode(false);
      email.placeholder = 'Email';
      email.id = 'email';
      email.type = 'text';
      email.value = '';
      email.classList.add('animated');
      email.classList.add('zoomIn');
      password.placeholder = 'Repeat password';
      password.id = 'passrepeat';
      password.value = '';
      password.classList.add('animated');
      password.classList.add('zoomIn');
      parent.parentNode.insertBefore(email , parent.nextSibling);
      parent.parentNode.insertBefore(password , parent.nextSibling);
      document.getElementById('registration').innerHTML = 'Back to login';
      document.getElementById('submit').value = "Registrate";
      reg = true;
    }
  };

  document.getElementById('submit').onclick =()=>{
    if(reg){
      let password =  document.getElementById('password').value
        , login = document.getElementById('login').value
        , passrepeat = document.getElementById('passrepeat').value
        , email = document.getElementById('email').value
        , errors = document.getElementsByClassName('error');

      if(errors.length != 0){
        while (errors[0]) {
          errors[0].parentNode.removeChild(errors[0]);
        }
      }

      if(login.length == 0 || password.length == 0 || passrepeat.length == 0 || email.length == 0)
      {
        alert('One of the fields is empty');
        return;
      }

      if(password != passrepeat){
        let referrence = document.getElementById('passrepeat')
          , insert = document.createElement('p');
        insert.className = "error";
        insert.innerHTML = 'Password is invalid';
        referrence.parentNode.insertBefore(insert, referrence.nextSibling);
        return;
      }

      if(!validateEmail(email)){
        let referrence = document.getElementById('email')
          , insert = document.createElement('p');
        insert.className = "error";
        insert.innerHTML = 'Email is invalid';
        referrence.parentNode.insertBefore(insert, referrence.nextSibling);
        return;
      }

      let xhr = new XMLHttpRequest();

      let body = "username=" + encodeURIComponent(login) + '&password=' + encodeURIComponent(password)
      + '&email=' + encodeURIComponent(email);

      xhr.open('POST', 'registration', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onload = ()=>{
        if(xhr.response == 'true'){
          location.reload();
        }
        else {
          switch (xhr.response) {
            case 'loginIsTaken':
              let referrenceLogin = document.getElementById('login')
                , insertLogin = document.createElement('p');
              insertLogin.className = "error";
              insertLogin.innerHTML = 'Login is taken';
              referrenceLogin.parentNode.insertBefore(insertLogin, referrenceLogin.nextSibling);
              break;
            case 'emailIsTaken':
              let referrenceEmail = document.getElementById('email')
                , insertEmail = document.createElement('p');
              insertEmail.className = "error";
              insertEmail.innerHTML = 'Email is taken';
              referrenceEmail.parentNode.insertBefore(insertEmail, referrenceEmail.nextSibling);
              break;
            default:

          }
        }
      };
      xhr.send(body);
    }
    else {
      let password =  document.getElementById('password').value
        , login = document.getElementById('login').value;

      if(login.length == 0 || password.length == 0)
      {
        alert('Login or password field id empty');
        return;
      }

      let xhr = new XMLHttpRequest();

      let body = "username=" + encodeURIComponent(login) + '&password=' + encodeURIComponent(password);

      xhr.open('POST', 'login', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onload = ()=>{
        if(xhr.response == 'true'){
          location.replace('/');
        }
        else {
          switch (xhr.response) {
            case 'false':
            case 'login':
              let parent = document.getElementById('authorization')
                , password = document.getElementById('password')
                , err = document.createElement('p')
                , oldError = document.getElementsByClassName('error');

              if(oldError.length != 0)parent.removeChild(oldError[0]);

              err.innerHTML = 'An unknown login-pass combination';
              err.className = 'error';

              parent.insertBefore(err, password.nextSibling);
              break;
            default:
          }
        }
      };
      xhr.send(body);
    }
  };
};
