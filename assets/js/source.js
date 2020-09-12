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