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
	],
	content = ["Nay rảnh nè đi coffee hong...!", "Trống...!"];

function renderSchedule(schedule) {
	DOM.css("opacity", 0);

	const date = new Date(),
		toDay = date.getDay() == 0 ? 8 : date.getDay() + 1;

	//? check main contain in #DOM
	//? render main schedule as: list day of week and render data

	isMain() && ScheduleMain();

	for (var i = 2; i <= 8; i++) {
		var elThu = $("#" + i),
			dataDay = schedule.filter((item) => item.Thu.split(" ")[1] == i);

		elThu.addClass("thu");

		dataDay = !dataDay.length
			? Empty(toDay, i)
			: dataDay.sort(sortSubject).map(renderSubject).join("");

		$("#t" + i)
			.attr("class", toDay == i ? "on" : "off")
			.html(dataDay);

		elThu.click(handleClick);
	}
	$("#" + toDay)
		.text("Hôm nay")
		.addClass("active");

	displayRender();
}

function ScheduleMain() {
	var day = tag("ul", "", { class: ["day", "flex", "textCenter"] }),
		render = tag("div", "", { id: "render", class: "render" });

	DOM.html("").append(day).append(render);
	//DOM list day of week and block render data
	for (var i = 2; i <= 8; i++) renderMain(i);
}

function renderMain(i) {
	const div = tag("div", "", { class: "off", id: "t" + i }),
		li = tag("li", dayOfWeek[i - 2], { class: "thu", id: i });

	$(DOM.children()[0]).append(li);

	$("#render").append(div);
}

function renderSubject(item) {
	const s = startLession(item.TietHoc),
		e = endLession(item.TietHoc),
		m = item.MonHoc,
		g = item.GiaoVien,
		p = item.Phong,
		t = "span";

	return `<div class="subject flex">
			<div class="tiet textCenter">
				${tag(t, s)}
				${tag(t, e)}
			</div>
			<div class='info flex'>
				${tag(t, m, { class: "mon" })}
				${tag(t, g, { class: "giaovien" })}
			</div>
			${tag(t, p, { class: ["phong", "textCenter"] })}
		</div>`;
}

const startLession = (time) => periodBoard[time.split("-")[0]].start,
	endLession = (time) => periodBoard[time.split("-")[1]].end,
	parseLession = (item) => item.TietHoc.split("-")[0].trim(),
	sortSubject = (a, b) => parseLession(a) - parseLession(b),
	handleClick = (e) => {
		const id = e.currentTarget.id,
			ac = $(".active"),
			currentId = ac.attr("id");
		ac.removeClass("active");
		$("#" + id).addClass("active");
		$("#t" + currentId)
			.removeClass("on")
			.addClass("off");
		$("#t" + id)
			.removeClass("off")
			.addClass("on");
	},
	isMain = () => !DOM.children().length || !DOM.children().hasClass("day"),
	Empty = (toDay, i) => {
		return tag("p", content[toDay - i == 0 ? 0 : 1], {
			class: "textCenter",
		});
	};
