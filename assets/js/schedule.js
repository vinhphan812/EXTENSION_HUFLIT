const periodBoard = {
		1: { start: "6h45", end: "7h35" },
		2: { start: "7h35", end: "8h25" },
		3: { start: "8h25", end: "9h15" },
		4: { start: "9h30", end: "10h20" },
		5: { start: "10h20", end: "11h10" },
		6: { start: "11h10", end: "12h00" },
		7: { start: "12h45", end: "13h35" },
		8: { start: "13h35", end: "14h25" },
		9: { start: "14h25", end: "15h15" },
		10: { start: "15h30", end: "16h20" },
		11: { start: "16h20", end: "17h10" },
		12: { start: "17h10", end: "18h15" },
		13: { start: "18h15", end: "19h05" },
		14: { start: "19h05", end: "19h55" },
		15: { start: "19h55", end: "20h45" },
	},
	dayOfWeek = [
		"Thứ 2",
		"Thứ 3",
		"Thứ 4",
		"Thứ 5",
		"Thứ 6",
		"Thứ 7",
		"Chủ nhật",
	];

function renderSchedule(schedule) {
	DOM.css("opacity", 0);

	const date = new Date(),
		toDay = date.getDay() == 0 ? 8 : date.getDay() + 1;

	// check main contain in #DOM
	// render main schedule as: list day of week and render data

	isMain() && ScheduleMain();

	for (var i = 2; i <= 8; i++) {
		var elThu = $("#" + i),
			dataDay = schedule.filter((item) => item.Thu.split(" ")[1] == i);

		elThu.addClass("thu");

		if (dataDay.length == 0) dataDay = Empty(toDay, i);
		else dataDay = dataDay.sort(sortSubject).map(renderSubject);
		// dataDay.length > 1 ? dataDay.sort(sortSubject) : dataDay;
		$("#t" + i)
			.attr("class", toDay == i ? "on" : "off")
			.html(typeof dataDay == "object" ? dataDay.join("") : dataDay);

		elThu.click(handleClick);
	}
	$("#" + toDay)
		.text("Hôm nay")
		.addClass("active");

	displayRender();
}

function ScheduleMain() {
	var day = document.createElement("ul"),
		render = document.createElement("div");

	DOM.html("");
	//Add id for render component
	render.id = "render";
	//Add Class for render and day Componet
	render.classList.add("render");
	day.classList.add("day");
	day.classList.add("flex");
	day.classList.add("textCenter");
	// Add day and render to DOM
	DOM.append(day).append(render);
	//DOM list day of week and block render data
	for (var i = 2; i <= 8; i++) renderMain(i);
}

function renderDay() {}

function renderMain(i) {
	var el = document.createElement("li");
	el.classList.add("thu");
	el.id = i;
	el.textContent = dayOfWeek[i - 2];

	DOM.children()[0].append(el); // DOM item in day of week
	//div Subject in Day
	var div = document.createElement("div");
	div.classList.add("off");
	div.id = "t" + i;
	$("#render").append(div);
}

function renderSubject(item) {
	return (
		'<div class="subject flex"><div class="tiet textCenter"><span>' +
		startLession(item.TietHoc) +
		"</span><span>" +
		endLession(item.TietHoc) +
		"</span></div><div class='info flex'><span class='mon'>" +
		item.MonHoc +
		'</span><span class="giaovien">' +
		item.GiaoVien +
		'</span></div><span class="phong textCenter">' +
		item.Phong +
		"</span></div>"
	);
}

const startLession = (time) => periodBoard[time.split("-")[0]].start,
	endLession = (time) => periodBoard[time.split("-")[1]].end,
	parseLession = (item) => item.TietHoc.split("-")[0].trim(),
	sortSubject = (a, b) => parseLession(a) - parseLession(b),
	handleClick = (e) => {
		const id = e.currentTarget.id;
		for (var i = 2; i <= 8; i++) {
			if (id == i) {
				e.currentTarget.classList.add("active");
				$("#t" + id)
					.addClass("on")
					.removeClass("off");
			} else {
				$("#t" + i).attr("class", "off");
				$("#" + i)
					.addClass("thu")
					.removeClass("active");
			}
		}
	},
	isMain = () => !DOM.children().length || !DOM.children().hasClass("day"),
	Empty = (toDay, i) =>
		toDay == i
			? "<p class='textCenter'> Nay rảnh nè đi coffee hong...!</p>"
			: "<p class='textcenter'>Trống...!</p>";
