window.onload = ()=>{
  let p = document.getElementById('sendFriendRequest') || document.getElementById('acceptFriendsRequests')
    , url = window.location.href.split('/');
  p.onclick = (event)=>{
    if(p.id == 'acceptFriendsRequests'){
      let xhr = new XMLHttpRequest()
        , body = "of=" + encodeURIComponent(url[4]);
      xhr.open("POST", "/friendaccept", true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = ()=>{
        location.reload();
      };
      xhr.send(body);
    } else {
      let xhr = new XMLHttpRequest()
        , body = "sendto=" + encodeURIComponent(url[4]);
      xhr.open("POST", "/friend", true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = ()=>{
        location.reload();
      };
      xhr.send(body);
    }
  };
};
