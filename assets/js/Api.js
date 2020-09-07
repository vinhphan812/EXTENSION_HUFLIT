// function API: getSchedule, ChangePassword, Logout.
/// + Schedule
//// get cookie from storage local --> renderSchedule(response)
function Schedule(){
          DOM.style.opacity = 0;
          chrome.storage.local.get(['cookie'], function(res){
               if(res.cookie)
               {
                    var data = 'cookie=' + res.cookie;
                    xhr.addEventListener('readystatechange', function(event){
                              if(this.readyState == 4 && this.responseURL.indexOf('Schedules') >= 0)
                                   renderSchedule(JSON.parse(this.responseText));
                    })
                    xhrRequest('Schedules', data);
               }
               else
                    DOM.innerHTML = 'ERROR:: Cookie null'
          })
}
/// + ChangePassword
//// DOM form enter new password --> transition css, add event checkbox check text <-> pass 
//// key 'Enter' and click Update button call function Change
function ChangePassword(){
     DOM.style.opacity = 0;
     DOM.style.transform = 'translateY(10px)';

     setTimeout(function(){
          DOM.innerHTML = '<div class="form flex" id="form"><div class="box"><input type="password" id="pw1" required><label>Mật khẩu mới</label></div><input type="checkbox" id="check"><layer>hiển thị mật khẩu</layer></div><layer id="msg"></layer><button id="update">cập nhật</button>';
          DOM.style.opacity = 1;
          DOM.style.transform = 'translateY(0px)';

          var update = document.getElementById('update');
          var pw1 = document.getElementById('pw1');
          var check = document.getElementById('check');
          
          document.addEventListener('keyup', function(event){
               if(event.key == 'Enter')
                    Change();
          })
     
          check.addEventListener('click', function(event){
               if(check.checked)
                    pw1.type = 'text';
               else
                    pw1.type = 'password';
          })
          update.addEventListener('click', Change)
     ;}, 1000);     
}

//get cookie and password old --> check new pass != old pass --> request API changePass
function Change(){
     msg.innerText = '';
          chrome.storage.local.get(['cookie', 'pass'], function(res){
               if(pw1.value == '' || pw1.value == res.pass)
                    msg.innerText = 'bạn chưa nhập mật khẩu mới...';
               else
               {
                    chrome.storage.local.set({pass: pw1.value});
                    var data = 'cookie=' + res.cookie + '&oldPass=' + res.pass + '&newPass=' + pw1.value;
                    xhr.addEventListener('readystatechange', function (event){
                         if(this.readyState === 4 && this.responseURL.indexOf('ChangePass') >= 0){
                              DOM.innerHTML = '<div style="display: flex;flex-direction: column;justify-content: center;color: #1e7900;align-items: center;height: 100%;font-weight: bold;"><img src="./assets/img/tick.png" style="margin: 10px;"><p>' + this.responseText + '</p></div>';
                         }        
                    });
                    xhrRequest('ChangePass', data);
               }
          })
}
// remove username, password, cookie in storage local
function Logout(){
     chrome.storage.local.remove(['user', 'pass', 'cookie'], function(){
          console.log('success');
     })
     window.location.href = 'popup.html'
}

