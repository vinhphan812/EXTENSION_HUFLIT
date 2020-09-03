const DOM = document.getElementById('DOM');
const logo = document.getElementById('logo');
const Menu = document.getElementById('menu');
const main = document.getElementById('main');
const login = document.getElementById('login');
const inpUser = document.getElementById('user');
const inpPass = document.getElementById('pass');
var LoginUser, LoginPass;
var xhr = new XMLHttpRequest();



//start....
// - get cookie from storage local to CheckCookie
//  + if cookie contain in storage local --> function call API checkCookie
//  + else display login form then add event click button and key Enter --> function Login API 
chrome.storage.local.get(['cookie'], function(result){
     if(result.cookie){
          main.style.opacity = 0.5;
          main.style.filter = 'blur(1px)';
          checkCookie(result.cookie);
     }
     else
     {
          login.addEventListener('click', function(event){
               Login();
          });
          
          document.addEventListener('keyup', function(event){
               if(event.key == 'Enter')
                    Login();
          });
          stopLoading();
          return;
     }
});

// checkCookie use XmlHttpRequest
// cookie will request to API
// response isDone = true | false
function checkCookie(cookie){
     var data = 'cookie=' + cookie;

     isDisabled(true)
     xhr.addEventListener('readystatechange', resCookie)
     
     xhr.open("POST", "https://api-huflit.herokuapp.com/CheckCookie");
     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8")
     xhr.send(data);
}


function resCookie(event){
     const msg = document.getElementById('msg');
     // 4 <=> DONE
     if(this.readyState === 4)
     {
          var res = JSON.parse(this.responseText);
          if(res.isDone){
               stopLoading();
               isDone(res.name);
          }
          else // if cookie expired --> get user and pass --> request Login with user and pass --> response cookie
          {
               chrome.storage.local.get(['user', 'pass'], function(res){
                    if(res.user && res.pass)
                         Login(res.user, res.pass);
                    else
                    {
                         // if user or pass is change --> display login form 
                         isDisabled(false);
                         return;
                    }
                    
               });
          }
     }
}



function Login(user, pass){
     const msg = document.getElementById('msg');

     LoginUser = user || inpUser.value;
     LoginPass = pass || inpPass.value;
     msg.innerText = "";

     isDisabled(true);

     if(LoginUser == "" || LoginPass == "")
     {
          isDisabled(false);
          msg.innerText = "Enter user or pass";
          return;
     }
     
     var data = "user=" + LoginUser + "&pass=" + LoginPass;
     xhr.addEventListener('readystatechange', DOMLogin);
     xhr.open("POST", "https://api-huflit.herokuapp.com/profile");

     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8")

     xhr.send(data);
}

