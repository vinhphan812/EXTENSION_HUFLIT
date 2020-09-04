var dataMenu = [['Schedules','Schedules'], ['ChangePassword','Change Password'], ['Logout','Logout']];


// if done --> DOM data 
function isDone(data){
     var liMenu = dataMenu.map(function(item){
          return '<li class="itemMenu" id="' + item[0] + '"><img class="icon" src="/assets/img/' + item[0] + '.png"><span>' + item[1] + '</span></li>'
     })
     if(document.getElementById('loader'))
          stopLoading();
          
     document.body.style.height = '500px';

     //remove event xhr Login and check cookie 
     document.removeEventListener('keyup', function(event){
          if(event.key == 'Enter')
               Login();
     });

     login.removeEventListener('click', function(event){
          Login();
     });

     xhr.removeEventListener('readystatechange', resCookie);
     xhr.removeEventListener('readystatechange', DOMLogin);
     

     //DOM username
     Menu.innerHTML = '<div class="user flex"><img src="/assets/img/user.png"><p>' + data + '</p></div><ul class="menu flex">' + liMenu.join('') + '</ul>';
     //DOM menu list
     document.getElementById('Schedules').addEventListener('click', Schedule);
     document.getElementById('ChangePassword').addEventListener('click', ChangePassword);
     document.getElementById('Logout').addEventListener('click', Logout);
     DOM.innerHTML = '';

     //transition css
     setTimeout(function(){
          Menu.style.opacity = 1;
          DOM.style.height = '293px';
          DOM.style.opacity = 0;
     }, 450);
}

// save cookie, user, pass to storage local
function DOMLogin(event){
     const msg = document.getElementById('msg');
     if(this.readyState === 4)
     {
          var res = JSON.parse(this.responseText);

          if(res.isDone){ 
               isDone(res.name); // DOM user and menu
               // save data user, pass, cookie 
               chrome.storage.local.set({cookie: res.cookie, user: LoginUser, pass: LoginPass}, function(){
                    console.log('save success');
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
     login.disabled = flag;          
}

// stop action loading 
function stopLoading(){
     main.style.filter = 'none';
     main.style.opacity = 1;
     document.getElementById('loader').remove();
     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY(0px)';
     logo.style.opacity = 1;
     logo.style.transform = 'translateY(0px)';
}

// make request server API 
function xhrRequest(uri, data){    
     xhr.open("POST", "https://api-huflit.herokuapp.com/" + uri);

     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8")
     
     xhr.send(data);
}