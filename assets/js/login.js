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

chrome.storage.local.get(['schedules', 'name'], function(res) {
     if (res.schedules && res.name) {
          isDone(res.name)
          renderSchedule(res.schedules);
     }
     getCookie();
})

function getCookie() {
     chrome.storage.local.get(['cookie'], function(result) {
          if (result.cookie)
               checkCookie(result.cookie);
          else
               inputLogin();
     });
}

// checkCookie use XmlHttpRequest
// cookie will request to API
// response isDone = true | false
function checkCookie(cookie) {
     try {
          var data = 'cookie=' + cookie;
          xhr.addEventListener('readystatechange', resCookie)
          xhrRequest('checkCookie', data);
     } catch (error) {
          console.log(error);
     }
}

//event readstatechange
function resCookie() {
     const msg = document.getElementById('msg');
     // 4 <=> DONE
     if (this.readyState === 4) {
          var res = JSON.parse(this.responseText);
          if (res.isDone)
               isDone(res.name);
          else // if cookie expired --> get user and pass --> request Login with user and pass --> response cookie
               chrome.storage.local.get(['user', 'pass'], function(res) {
               if (res.user && res.pass)
                    Login(res.user, res.pass);
               else // if user or pass is change --> display login form 
                    isDisabled(false);
          });
     }
}

//Login param is username, password 
function Login(user, pass) {
     const msg = document.getElementById('msg');

     LoginUser = user || inpUser.value; //LoginUser is inputUser or local storage
     LoginPass = pass || inpPass.value; // LoginPass is inputPass or local storage

     if (msg) {
          isDisabled(true); // disabled input and button when variable is true
          msg.innerText = "";
     }



     if (LoginUser == "" || LoginPass == "") // if LoginUser or PassUser are equal to "", formLogin is display
     {
          isDisabled(false); // not disable input and button when variable is false
          msg.innerText = "Enter user or pass";
          return displayRender();
     }

     var data = "user=" + LoginUser + "&pass=" + LoginPass; // set data request formData --> x-www-form-urlencoded

     xhr.removeEventListener('readystatechange', resCookie);

     xhr.addEventListener('readystatechange', DOMLogin);

     xhrRequest('profile', data);
}
//display input username and password
function inputLogin() {
     displayRender();
     document.getElementById('login').addEventListener('click', Login);
     document.addEventListener('keyup', (event) => event.key == 'Enter' ? Login() : '');
}

// remove username, password, cookie in storage local
function logOut() {
     chrome.storage.local.remove(['user', 'pass', 'cookie', 'schedules', 'name']);
     window.location.href = 'popup.html';
}
// make request server API 
function xhrRequest(uri, data) {
     xhr.open("POST", host + uri);

     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8");

     xhr.send(data);
}
// save cookie, user, pass to storage local
function DOMLogin(event) {
     const msg = document.getElementById('msg');
     if (this.readyState === 4) {
          var res = JSON.parse(this.responseText);
          if (res.isDone) // Login success, then save data user, pass, cookie
               chrome.storage.local.set({ cookie: res.cookie, user: LoginUser, pass: LoginPass, name: res.name }, () => {
               Schedule();
               isDone(res.name);
          });
          else {
               //Login false: login again and messeger error
               inputLogin();
               displayRender();
               isDisabled(false);
               msg.innerText = res.msg;
          }
     }
}

// enble/disable to Input, Button Login
function isDisabled(flag) {
     inpUser.disabled = flag;
     inpPass.disabled = flag;
     document.getElementById('login').disabled = flag;
}

function displayRender() {
     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY(0px)';
}