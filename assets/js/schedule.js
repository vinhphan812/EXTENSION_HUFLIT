const periodBoard = {
     1: { start: '6h45', end: '7h35' },
     2: { start: '7h35', end: '8h25' },
     3: { start: '8h25', end: '9h15' },
     4: { start: '9h30', end: '10h20' },
     5: { start: '10h20', end: '11h10' },
     6: { start: '11h10', end: '12h00' },
     7: { start: '12h45', end: '13h35' },
     8: { start: '13h35', end: '14h25' },
     9: { start: '14h25', end: '15h15' },
     10: { start: '15h30', end: '16h20' },
     11: { start: '16h20', end: '17h10' },
     12: { start: '17h10', end: '18h15' },
     13: { start: '18h15', end: '19h05' },
     14: { start: '19h05', end: '19h55' },
     15: { start: '19h55', end: '20h45' },
}

function renderSchedule(schedule) {
     const date = new Date();
     const today = date.getDay() + 1 == 1 ? 8 : date.getDay() + 1;

     ///check main contain in #DOM
     // render main schedule as: list day of week and render data
     if (!DOM.childElementCount || DOM.children[0].className != 'day') ScheduleMain();

     for (var i = 2; i <= 8; i++) {
          var elThu = document.getElementById(i);
          var dataDay = schedule.filter((item) => item.Thu.split(' ')[1] == i);

          elThu.classList.add('thu');

          if (dataDay.length == 0)
               dataDay = today == i ? "<p class='textCenter'> Hôm nay rãnh rỗi quá nè...!</p>" : "<p class='textcenter'>Trống...!</p>";
          else {
               if (dataDay.length >= 2)
                    dataDay = dataDay.sort((a, b) =>
                         parseInt(a.TietHoc.split('-')[0].trim()) - parseInt(b.TietHoc.split('-')[0].trim()));
               dataDay = dataDay.map(renderSubject);
          }
          document.getElementById('t' + i).className = today == i ? 'on flex' : 'off';
          document.getElementById('t' + i).innerHTML = typeof dataDay == 'object' ? dataDay.join('') : dataDay;
          elThu.addEventListener('click', function(ev) {
               for (var i = 2; i <= 8; i++) {
                    if (this.id == i) {
                         this.className += ' active';
                         document.getElementById('t' + this.id).className = 'on flex';
                    } else {
                         document.getElementById('t' + i).className = 'off';
                         document.getElementById(i).className = 'thu';
                    }
               }
          });
     }
     document.getElementById(today).textContent = "Hôm nay";
     document.getElementById(today).className += ' active';

     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY("30px")';
}

function ScheduleMain() {
     var dayOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
     var day = document.createElement('ul');
     var render = document.createElement('div');

     DOM.innerHTML = '';

     render.classList.add('render');
     render.id = 'render';
     day.classList.add('day');
     day.classList.add('flex');
     day.classList.add('textCenter');
     document.getElementById('DOM').appendChild(day); //DOM list day of week
     document.getElementById('DOM').appendChild(render); // DOM render data
     for (var i = 2; i <= 8; i++) {
          //List Day Of week
          var el = document.createElement('li');
          el.classList.add('thu');
          el.id = i;
          el.textContent = dayOfWeek[i - 2];
          document.getElementById('DOM').children[0].appendChild(el); // DOM item in day of week 
          //div dataDay
          var div = document.createElement('div');
          div.classList.add('off');
          div.id = 't' + i;
          document.getElementById('render').appendChild(div); // DOM item render data
     }
}

function renderSubject(item) {
     return '<div class="subject flex"><div class="tiet textCenter"><span>' +
          periodBoard[item.TietHoc.split('-')[0]].start +
          "</span><span>" + periodBoard[item.TietHoc.split('-')[1]].end +
          "</span></div><div class='info flex'><span class='mon'>" +
          item.MonHoc + '</span><span class="giaovien">' +
          item.GiaoVien + '</span></div><span class="phong textCenter">' +
          item.Phong + '</></div>';
}