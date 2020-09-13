//Load css/js from server

var head = document.getElementsByTagName('head')[0];
var body = document.getElementsByTagName('body')[0];

var linkMain = document.createElement('link');
var linkSchedule = document.createElement('link');

linkSchedule.rel = linkMain.rel = 'stylesheet';
linkSchedule.type = linkMain.type = 'text/css';
linkSchedule.href = 'https://api-huflit-server.glitch.me/extension/css/schedule.min.css';
linkMain.href = 'https://api-huflit-server.glitch.me/extension/css/popup.min.css';

head.appendChild(linkMain);
head.appendChild(linkSchedule);

var api = document.createElement('script');
var schedule = document.createElement('script');

api.src = 'https://api-huflit-server.glitch.me/extension/js/Api.min.js';
schedule.src = 'https://api-huflit-server.glitch.me/extension/js/schedule.min.js';
schedule.type = api.type = 'text/javascript';

body.appendChild(schedule);
body.appendChild(api);

// make request server API 
function xhrRequest(uri, data){    
     xhr.open("POST", host + uri);     

     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8")
     
     xhr.send(data);
}
// save cookie, user, pass to storage local
function DOMLogin(event){
     const msg = document.getElementById('msg');
     if(this.readyState === 4)
     {
          var res = JSON.parse(this.responseText);

          if(res.isDone){ 
               // DOM user and menu
               // save data user, pass, cookie 
               chrome.storage.local.set({cookie: res.cookie, user: LoginUser, pass: LoginPass}, function(){
                    console.log('save success');
                    isDone(res.name);
               });
          }
          else{
               isDisabled(false);
               // DOM messenger error 
               msg.innerText = res.msg;
          }
     }
}

// use to Input, Button Login
function isDisabled(flag){
     inpUser.disabled = flag;
     inpPass.disabled = flag;
     document.getElementById('login').disabled = flag;          
}

// stop action loading 
function stopLoading(){
     main.style.filter = 'none';
     main.style.opacity = 1;
     document.getElementById('loader').remove();
     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY(0px)';
}