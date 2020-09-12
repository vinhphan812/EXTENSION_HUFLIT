const DOM = document.getElementById('DOM'); // div DOM data 
const Menu = document.getElementById('menu'); // Menu user after Login
const main = document.getElementById('main'); // div all element
const inpUser = document.getElementById('user'); // input user
const inpPass = document.getElementById('pass'); // input pass
const host = 'https://api-huflit-server.herokuapp.com/';

var LoginUser, LoginPass; // variable user and pass for Login 
var xhr = new XMLHttpRequest(); // create XHR request API



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
          inputLogin();          
          return;
     }
});

// checkCookie use XmlHttpRequest
// cookie will request to API
// response isDone = true | false
function checkCookie(cookie){
     try {
          var data = 'cookie=' + cookie;

          isDisabled(true);
          xhr.addEventListener('readystatechange', resCookie)
          xhrRequest('checkCookie', data);
     } catch (error) {
          inputLogin();
     }
}


function resCookie(event){
     const msg = document.getElementById('msg');
     // 4 <=> DONE
     if(this.readyState === 4)
     {
          var res = JSON.parse(this.responseText);
          if(res.isDone){
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
                         stopLoading();
                         return;
                    }
                    
               });
          }
     }
}



function Login(user, pass){
     const msg = document.getElementById('msg');

     LoginUser = user || inpUser.value; //LoginUser is inputUser or local storage
     LoginPass = pass || inpPass.value; // LoginPass is inputPass or local storage
     if(msg)
          msg.innerText = "";

     isDisabled(true); // disabled input and button when variable is true

     if(LoginUser == "" || LoginPass == "") // if LoginUser or PassUser are equal to "", formLogin is display
     {
          isDisabled(false); // not disable input and button when variable is false
          msg.innerText = "Enter user or pass";
          return;
     }
     
     var data = "user=" + LoginUser + "&pass=" + LoginPass; // set data request formData --> x-www-form-urlencoded

     xhr.removeEventListener('readystatechange', resCookie);

     xhr.addEventListener('readystatechange', DOMLogin);

     xhrRequest('profile', data)
}

function inputLogin(){
     document.getElementById('login').addEventListener('click', function(event){
          Login();
     });
     
     document.addEventListener('keyup', function(event){
          if(event.key == 'Enter')
               Login();
     });
     stopLoading();
}

// remove username, password, cookie in storage local
function Logout(){
     chrome.storage.local.remove(['user', 'pass', 'cookie'], function(){
          console.log('success');
     })
     window.location.href = 'popup.html'
}