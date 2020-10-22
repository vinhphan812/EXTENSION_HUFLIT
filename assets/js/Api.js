var schedules = [];

// function API: getSchedule, ChangePassword, Logout.
/// + Schedule
//// get cookie from storage local --> renderSchedule(response)
function Schedule() {
     DOM.style.opacity = 0;
     if (schedules.length == 0)
          chrome.storage.local.get(['cookie'], function(res) {
               if (res.cookie) {
                    var data = 'cookie=' + res.cookie;
                    xhr.addEventListener('readystatechange', function(event) {
                         if (this.readyState == 4 && this.responseURL.indexOf('Schedules') >= 0)
                              renderSchedule(schedules = JSON.parse(this.responseText));
                    });
                    xhrRequest('Schedules', data);
               } else {
                    DOM.style.opacity = 1;
                    DOM.innerHTML = '<div class="errorText">ERROR:: Cookie null</div>';
               }
          });
     else renderSchedule(schedules);
}
/// + ChangePassword
//// DOM form enter new password --> transition css, add event checkbox check text <-> pass 
//// key 'Enter' and click Update button call function Change
function ChangePassword() {
     DOM.style.opacity = 0;
     DOM.style.transform = 'translateY(10px)';

     setTimeout(function() {
          DOM.innerHTML = '<div class="form flex" id="form"><div class="box"><input type="password" id="pw1" required><label>Mật khẩu mới</label></div><input type="checkbox" id="check"><layer>hiển thị mật khẩu</layer></div><layer id="msg"></layer><button id="update">cập nhật</button>';
          DOM.style.opacity = 1;
          DOM.style.transform = 'translateY(0px)';

          var update = document.getElementById('update');
          var check = document.getElementById('check');
          var pw1 = document.getElementById('pw1');

          document.addEventListener('keyup', function(event) {
               if (event.key == 'Enter') Change();
          });

          check.addEventListener('click', function(event) {
               if (check.checked) pw1.type = 'text';
               else pw1.type = 'password';
          });
          update.addEventListener('click', Change);
     }, 1000);
}

//get cookie and password old --> check new pass != old pass --> request API changePass
function Change() {
     msg.innerText = '';
     chrome.storage.local.get(['cookie', 'pass'], function(res) {
          if (pw1.value == '' || pw1.value == res.pass)
               msg.innerText = 'bạn chưa nhập mật khẩu mới...';
          else {
               chrome.storage.local.set({ pass: pw1.value });
               var data = 'cookie=' + res.cookie + '&oldPass=' + res.pass + '&newPass=' + pw1.value;
               xhr.addEventListener('readystatechange', function(event) {
                    DOM.innerHTML = '<div class="successText"><img src="./assets/img/tick.png" style="margin: 10px;"><p>' + this.responseText + '</p></div>';
               });
               xhrRequest('ChangePass', data);
          }
     });
}