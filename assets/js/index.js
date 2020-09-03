var dataMenu = [['Schedules','Schedules'], ['ChangePassword','Change Password'], ['Logout','Logout']];


// if done --> DOM data 
function isDone(data){
     var liMenu = dataMenu.map(function(item){
          return '<li class="itemMenu" id="' + item[0] + '"><img class="icon" src="/assets/img/' + item[0] + '.png"><span>' + item[1] + '</span></li>'
     })

     document.body.style.height = '500px';

     document.removeEventListener('keyup', function(event){
          if(event.key == 'Enter')
               Login();
     });

     login.removeEventListener('click', function(event){
          Login();
     });
     //DOM username
     Menu.innerHTML = '<div class="user"><img src="/assets/img/user.png"><p>' + data + '</p></div><ul class="menu">' + liMenu.join('') + '</ul>';
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
               isDone(res.name);
               chrome.storage.local.set({cookie: res.cookie, user: LoginUser, pass: LoginPass}, function(){
                    console.log('save success');
               });
          }
          else{
               isDisabled(false);
               msg.innerText = res.msg;
          }
     }
}

// use to Input, Button Login
function isDisabled(flag){
     inpUser.disabled = flag;
     inpPass.disabled = flag;
     login.disabled = flag;
     if(!flag)
          stopLoading();     
}

function onLoading(){
     DOM.innerHTML = '<div id="loader"><img src="assets/img/loading.png"></div>';
}

function stopLoading(){
     main.style.filter = 'none';
     main.style.opacity = 1;
     document.getElementById('loader').remove();
     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY(0px)';
     logo.style.opacity = 1;
     logo.style.transform = 'translateY(0px)';
}
