var dataMenu = ['Schedules', 'Password', 'Logout'];

// if done --> DOM data 
function isDone(data) {
     document.getElementById('box-title').className = 'flex row';

     var liMenu = dataMenu.map(function(item) {
          return '<li class="itemMenu" id="' + item + '"><img class="icon" src="assets/img/' + item + '.png"><span>' + item + '</span></li>';
     })

     if (document.getElementById('loader')) stopLoading();

     document.body.style.height = '500px';

     //remove event xhr Login and check cookie 
     document.removeEventListener('keyup', function(event) {
          if (event.key == 'Enter') Login();
     });

     xhr.removeEventListener('readystatechange', resCookie);
     xhr.removeEventListener('readystatechange', DOMLogin);

     //DOM username
     Menu.innerHTML = '<div class="user flex"><img src="assets/img/user.png"><p>' + data.split(' |')[1] + '</p></div><ul class="menu flex">' + liMenu.join('') + '</ul>';
     //DOM menu list
     document.getElementById('Schedules').addEventListener('click', Schedule);
     document.getElementById('Password').addEventListener('click', ChangePassword);
     document.getElementById('Logout').addEventListener('click', Logout);
     DOM.innerHTML = '';

     //transition css
     setTimeout(function() {
          Menu.style.opacity = 1;
          DOM.style.height = '300px';
          DOM.style.opacity = 0;
     }, 450);

     Schedule();
}