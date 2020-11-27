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
     DOM.css('opacity', 0);
     const date = new Date();
     const today = date.getDay() + 1 == 1 ? 8 : date.getDay() + 1;
     console.log(DOM.children().length);
     ///check main contain in #DOM
     // render main schedule as: list day of week and render data
     if (!DOM.children().length || DOM.children()[0].className.indexOf('day') < 0) ScheduleMain();

     for (var i = 2; i <= 8; i++) {
          var elThu = $("#" + i);
          var dataDay = schedule.filter((item) => item.Thu.split(' ')[1] == i);

          elThu.addClass('thu');

          if (dataDay.length == 0)
               dataDay = today == i ? "<p class='textCenter'> Hôm nay rãnh rỗi quá nè...!</p>" : "<p class='textcenter'>Trống...!</p>";
          else {
               if (dataDay.length >= 2)
                    dataDay = dataDay.sort((a, b) =>
                         parseInt(a.TietHoc.split('-')[0].trim()) - parseInt(b.TietHoc.split('-')[0].trim()));
               dataDay = dataDay.map(renderSubject);
          }
          $('#t' + i).attr('class', today == i ? 'on' : 'off');
          $('#t' + i).html(typeof dataDay == 'object' ? dataDay.join('') : dataDay);
          elThu.on('click', (e) => {
               const id = e.currentTarget.id;
               for (var i = 2; i <= 8; i++) {
                    if (id == i) {
                         e.currentTarget.classList.add('active');
                         $('#t' + id).addClass('on').removeClass('off');
                    } else {
                         // console.log($('#t' + i));
                         $('#t' + i).attr('class', 'off');
                         $('#' + i).addClass('thu');
                         $('#' + i).removeClass('active')
                    }
               }
          });
     }
     $('#' + today).text("Hôm nay");
     $('#' + today).addClass('active');

     displayRender();
}

function ScheduleMain() {
     var dayOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
     var day = document.createElement('ul');
     var render = document.createElement('div');

     DOM.html('');

     render.classList.add('render');
     render.id = 'render';
     day.classList.add('day');
     day.classList.add('flex');
     day.classList.add('textCenter');
     DOM.append(day); //DOM list day of week
     DOM.append(render); // DOM render data
     for (var i = 2; i <= 8; i++) {
          //List Day Of week
          var el = document.createElement('li');
          el.classList.add('thu');
          el.id = i;
          el.textContent = dayOfWeek[i - 2];
          DOM.children()[0].append(el); // DOM item in day of week 
          //div dataDay
          var div = document.createElement('div');
          div.classList.add('off');
          div.id = 't' + i;
          $('#render').append(div); // DOM item render data
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