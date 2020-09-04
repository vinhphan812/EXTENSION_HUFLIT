function renderSchedule(schedule){
     const date = new Date();
     var today = date.getDay() + 1 == 1 ? 8 : date.getDay() + 1;
     ///check main contain in #DOM
     if(!DOM.childElementCount || DOM.children[0].className != 'day')
          ScheduleMain(); // render main schedule as: list day of week and render data

     for(var i = 2; i <= 8; i++){
          var elThu = document.getElementById(i);
          var dataDay = schedule.filter(function(item){return item.Thu == i});
          
          elThu.classList.add('thu');

          if(dataDay.length == 0)
               dataDay = today == i ? "<p class='textCenter'> Hôm nay rãnh nè đi nhậu đi...!</p>" : "<p class='textcenter'>Trống...!</p>";
          else{
               if(dataDay.length >= 2)
                    dataDay = dataDay.sort(function(a, b){
                         return parseInt(a.TietHoc.split(' - ')[0].trim()) - parseInt(b.TietHoc.split(' - ')[0].trim());
                    })
               dataDay = dataDay.map(function(item){return '<div class="subject flex"><div class="tiet textCenter">' + item.TietHoc.split(' - ')[1].trim() + "</div><div class='info flex'><span class='mon'>" + item.MonHoc + '</span><span class="giaovien">' + item.GiaoVien + '</span></div><span class="phong textCenter">' + item.Phong  + '</></div>'});
          }         
          document.getElementById('t' + i).className = today == i ? 'on flex' : 'off';
          document.getElementById('t'+ i).innerHTML = typeof dataDay == 'object' ? dataDay.join('') : dataDay;
          elThu.addEventListener('click',function(ev){
               for(var i = 2; i <= 8; i++)
               {
                    document.getElementById('t' + i).className = 'off';
                    document.getElementById(i).className = 'thu';
               }
               this.className += ' active'
               document.getElementById('t'+this.id).className = 'on flex';
          })
     }
     document.getElementById(today).textContent = "Hôm nay"; 
     document.getElementById(today).className += ' active';
     DOM.style.opacity = 1;
     DOM.style.transform = 'translateY("30px")';
}

function ScheduleMain(){
     var dayOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
     var day = document.createElement('ul')
     var render = document.createElement('div');

     DOM.innerHTML = '';

     render.classList.add('render');
     render.id = 'render';
     day.classList.add('day');
     day.classList.add('flex');
     day.classList.add('textCenter');
     document.getElementById('DOM').appendChild(day);  //DOM list day of week
     document.getElementById('DOM').appendChild(render); // DOM render data
     for(var i = 2; i <= 8; i++){
          //List Day Of week
          var el = document.createElement('li'); 
          el.classList.add('thu');
          el.id = i;
          el.textContent = dayOfWeek[i-2];
          document.getElementById('DOM').children[0].appendChild(el); // DOM item in day of week 
          //div dataDay
          var div = document.createElement('div');
          div.classList.add('off');
          div.id = 't' + i;
          document.getElementById('render').appendChild(div); // DOM item render data
     }
}