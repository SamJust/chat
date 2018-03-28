let socket
  , visible = false
  , searching = false;

window.onresize = (event)=>{
  let referenceDiv = document.getElementById("nav")
    , input = document.getElementById("searchField");
  input.style.width = `${referenceDiv.offsetWidth - 10}px`;
};

window.onload = async ()=>{

  let referenceDiv = document.getElementById("nav")
    , input = document.getElementById("searchField");
  input.style.width = `${referenceDiv.offsetWidth - 10}px`;

  let span = document.getElementById('samschat');
  span.onclick = (event)=>{
    if (visible) {
      document.getElementById('userControlls').style.display = 'none';
      visible = false;
    }
    else {
      document.getElementById('userControlls').style.display = 'block';
      visible = true;
    }
  };

  let urlSearch = new URLSearchParams(window.location.search)
    , currentDiv = document.getElementById(urlSearch.get('with'));
  if(currentDiv){
    currentDiv.style.backgroundColor = "grey";
  }

  // console.log(window);
  // let userName = prompt("Enter your username");
  // if(!userName){
  //   let parent = document.getElementById('sendButton').parentNode;
  //   parent.removeChild(document.getElementById('sendButton'));
  //   parent.removeChild(document.getElementById('userText'));
  //   let newMessage = document.createElement('p');
  //   newMessage.innerHTML = "Refresh page and enter a nickname";
  //   parent.insertBefore(newMessage, parent.firstChild);
  // }
  let promise = new Promise((resolve, reject)=>{
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'username', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = ()=>{
      this.username = xhr.response;
      resolve()
    };
    xhr.send();
  }).then(()=>{
    socket = io({query:`username=${this.username}`});
    socket.on('recieveMessage', (sender, msg, to)=>{
      // console.log("start recieve " + performance.now());
      let urlSearch = new URLSearchParams(window.location.search);
      let lastMessage = document.getElementById('chat').getElementsByTagName('p')[0] || document.getElementById('chat').lastChild
        , newMessage = document.createElement('p')
        , friendDiv;
      if(sender != this.username){
        friendDiv = document.getElementById(sender);
      }
      else {
        friendDiv = document.getElementById(urlSearch.get('with'));
      }
      friendDiv.parentNode.insertBefore(friendDiv, friendDiv.parentNode.firstChild);
      newMessage.innerHTML = sender + ': ' + msg;
      if(sender === this.username){
        newMessage.className = 'messageYour';
      }
      else {
        newMessage.className = 'messageOthers';
      }
      if(sender == urlSearch.get('with') || sender == this.username){
        lastMessage.parentNode.insertBefore(newMessage, lastMessage);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `setread`, true);
        let body = "with=" + encodeURIComponent(urlSearch.get('with'));
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
      }
      else if(friendDiv.innerHTML.indexOf('--new messages--') == -1){
         friendDiv.innerHTML += '--new messages--';
      }
      // console.log("end recieve " + performance.now());
    });
  }, ()=>{});

  let friends = document.getElementsByClassName('friend');
  for (let i in friends) {
    friends[i].onclick = (event)=>{
      // history.pushState({},'', `/chat?with=${friends[i].innerHTML}`);
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `messages?with=${event.target.id}`, true);

      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onload = ()=>{
        let newMessages = JSON.parse(xhr.response);
        let messages = document.getElementById('chat').getElementsByTagName('p')
          , parent = document.getElementById('chat');
        while (messages[0]) {
          parent.removeChild(messages[0]);
        }
        for (let i = newMessages.length -1; i >= 0; i--) {
          let temp = document.createElement('p');
          temp.classList.add('message');
          if(newMessages[i].sender == this.username) temp.classList.add('messageYour');
          else temp.classList.add('messageOthers');
          temp.innerHTML = newMessages[i].sender + ':' + newMessages[i].text;
          parent.insertBefore(temp, parent.firstChild.previousSibling);
        }
        event.target.innerHTML = event.target.id;
        history.pushState({},'', `/chat?with=${event.target.id}`);

        let urlSearch = new URLSearchParams(window.location.search);
        try {
          currentDiv.style.backgroundColor = "lightgray";
        } catch (err) {

        }
        currentDiv = document.getElementById(urlSearch.get('with'));
        currentDiv.style.backgroundColor = "grey";

        if(searching){
          let results = document.getElementsByClassName('searchResult');
          while (results[0]) {
            results[0].parentNode.removeChild(results[0]);
          }
          let textInput = document.createElement('input')
            , buttonInput = document.createElement('input')
            , chatEnter = document.getElementById('chatEnter');
          textInput.type = "text";
          buttonInput.type = "button";
          textInput.id = "sendButton";
          buttonInput.id = "userText";
          buttonInput.value = "Send";
          chatEnter.insertBefore(textInput, chatEnter.lastChild);
          chatEnter.insertBefore(buttonInput, chatEnter.lastChild);
          searching = false;
        }
      };
      xhr.send();
    };
  }
  document.getElementById('sendButton').onclick = ()=>{
    let urlSearch = new URLSearchParams(window.location.search);
    // console.log("start onclick " + performance.now());
    let text = document.getElementById('userText').value;
    if(text.length == 0) return;
    socket.emit('sendMessage', this.username, text, urlSearch.get('with'));
    document.getElementById('userText').value = "";
    // history.pushState({},'', '/chat?with=qwe');
    // console.log("end onclick " + performance.now());
  };
  document.getElementById('userText').onkeyup = (event)=>{
    if(event.keyCode == 13)
    {
      document.getElementById('sendButton').click();
    }
    else {

    }
  };

  document.getElementById('searchButton').onclick = ()=>{
    let searchField = document.getElementById('searchField');
    if(searchField.value.length == 0) return;
    let xhr = new XMLHttpRequest()
      , body = "username=" + encodeURIComponent(searchField.value);

    xhr.open('POST', 'profile', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = ()=>{
      let messages = document.getElementById('chat').getElementsByTagName('p')
        , parent = document.getElementById('chat');
      while (messages[0]) {
        parent.removeChild(messages[0]);
      }
      parent = document.getElementById('chatEnter');
      if(!searching){
        parent.removeChild(document.getElementById('sendButton'));
        parent.removeChild(document.getElementById('userText'));
        searching = true;
      }
      else{
        let results = document.getElementsByClassName('searchResult');
        while (results[0]) {
          results[0].parentNode.removeChild(results[0]);
        }
      }
      try {
        currentDiv.style.backgroundColor = 'lightgray';
      } catch (e) {

      }

      currentDiv = undefined;

      // history.pushState({}, "", '/search?su='+encodeURIComponent(searchField.value));

      let lastMessage = document.getElementById('chat').getElementsByTagName('p')[0] || document.getElementById('chat').lastChild
        , newMessage = document.createElement('div');
      if(xhr.response === ""){
        newMessage.innerHTML = "No user found";
      }
      else {
        newMessage.innerHTML = `<a id="sendFriendRequest" href="/profile/${xhr.response}">${xhr.response}</a>`;
      }
      newMessage.className = "searchResult";
      lastMessage.parentNode.insertBefore(newMessage, lastMessage);
    };
    xhr.send(body);
  };
  document.getElementById('searchField').onkeyup = (event)=>{
    if(event.keyCode == 13)
    {
      document.getElementById('searchButton').click();
    }
    else {

    }
  };
};
