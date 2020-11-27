var dataMenu = ['Schedules', 'Password', 'Logout'];

// if done --> DOM data 
function isDone(data) {
     $('#box-title').addClass('row').removeClass('column');
     const liMenu = dataMenu.map(function(item) {
          return '<li class="itemMenu" id="' +
               item + '"><img class="icon" src="assets/img/' +
               item + '.png"><span>' +
               item + '</span></li>';
     });
     $(document.body).css('height', '500px');

     //remove event xhr Login and check cookie 
     $(document).off('keyup', (event) => event.key == 'Enter' ? Login() : null);

     xhr.removeEventListener('readystatechange', resCookie);
     xhr.removeEventListener('readystatechange', DOMLogin);


     // DOM username
     Menu.html(
          '<div class="user flex"><img src="assets/img/user.png"><p>' +
          data.split(' |')[1] +
          '</p></div><ul class="menu flex">' +
          liMenu.join('') + '</ul>'
          );
     //DOM menu list
     $('#Schedules').click(Schedule);
     $('#Password').click(ChangePassword);
     $('#Logout').click(logOut);

     //transition css
     setTimeout(function() {
          Menu.css('opacity', 1);
          DOM.css('height', '300px');
     }, 450);
}