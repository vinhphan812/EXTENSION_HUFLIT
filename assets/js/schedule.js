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
	var day = tag("ul", { class: ["day", "flex", "textCenter"] }, ""),
		render = tag("div", { id: "render", class: "render" }, "");

	DOM.html("").append(day).append(render);
	//DOM list day of week and block render data
	for (var i = 2; i <= 8; i++) renderMain(i);
}

function renderMain(i) {
	const div = tag("div", { class: "off", id: "t" + i }, ""),
		li = tag("li", { class: "thu", id: i }, dayOfWeek[i - 2]);

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
				${tag(t, {}, s)}
				${tag(t, {}, e)}
			</div>
			<div class='info flex'>
				${tag(t, { class: "mon" }, m)}
				${tag(t, { class: "giaovien" }, g)}
			</div>
			${tag(t, { class: ["phong", "textCenter"] }, p)}
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
		return tag(
			"p",
			{
				class: "textCenter",
			},
			content[toDay - i == 0 ? 0 : 1]
		);
	};
