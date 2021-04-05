/**
 *?class all active for extension
 */
const DOM = $("#root"),
	Menu = $("#menu"),
	main = $("#main"),
	inpUser = $("#user"),
	inpPass = $("#pass");

const dataKey = ["user", "pass", "cookie", "schedule", "name"],
	periodBoard = {
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
	content = ["Hôm nay bạn rảnh...!", "Trống...!"];

const error = (errorText) =>
		DOM.html(tag("div", errorText, { class: "errorText" })),
	readyState = (res) => res.readyState === 4 && res.status === 200;

function formData(data = {}) {
	var form = [];
	for (var key in data) form.push(`${key}=${data[key]}`);

	return form.join("&");
}

function getDataFormStorage(key) {
	return new Promise(async function (resolve, reject) {
		chrome.storage.local.get(key, (res) => resolve(res));
	});
}
function tag(tag, data = {}, text = 1) {
	var s = "";
	if (data)
		for (var key in data) {
			const dt = data[key],
				val = typeof dt == "object" ? dt.join(" ") : dt;
			s +=
				typeof dt === "boolean"
					? dt
						? key
						: ""
					: `${key}="${val}" `;
		}

	return text == 1 ? `<${tag} ${s} />` : `<${tag} ${s}>${text}</${tag}>`;
}

const LoginControl = async function (res) {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);

			data.success
				? Tab.HOME(data.name) & api.getSchedule(callbackSchedule)
				: api.login(callbackLogin);
		}
	},
	callbackLogin = function () {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);

			if (!data.success) {
				isDisabledInput(false);
				return $("#msg").text(data.msg);
			}

			Tab.HOME(data.name);
			api.info.cookie = data.cookie;
			api.info.name = data.name;
			api.getSchedule(callbackSchedule);
			api.saveInfo();
		}
	},
	callbackSchedule = function () {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);
			if (!data.success) return alert("Please Login Again!!!");
			renderSchedule(data.schedule);
			displayRender();
			api.info.schedule = data.schedule;
			api.saveInfo();
		}
	},
	callbackChangePass = function (event) {
		if (this.readyState == 4)
			DOM.html(
				tag(
					"div",
					tag("img", "", {
						src: "./assets/img/tick.png",
						style: "margin: 100px",
					}) + tag("p", this.responseText),
					{ class: "successText" }
				)
			);
	},
	checkLogin = function () {
		const msg = $("#msg");
		msg.text("");
		if (!inpUser.val() || !inpPass.val())
			return msg.text("Please enter user or pass !");
		isDisabledInput(true);
		api.setAccount(inpUser.val(), inpPass.val()) &
			api.login(callbackLogin);
	},
	logOut = () => {
		chrome.storage.local.remove(dataKey);
		window.location.href = "popup.html";
	},
	scheduleHandle = () =>
		DOM.css("opacity", 0) & api.getSchedule(callbackSchedule),
	changePassRenderHandle = function () {
		// form change password
		fadeUp();

		setTimeout(function () {
			var header = tag(
				"h2",
				{ class: "textCenter" },
				"Change Password"
			);
			var inputPass = tag("input", {
					type: "password",
					id: "pw1",
					required: true,
				}),
				labelPass = tag("label", {}, "Mật khẩu mới"),
				boxInput = tag(
					"div",
					{ class: "box" },
					inputPass + labelPass
				);
			var checkbox = tag("input", {
					type: "checkbox",
					id: "check",
					checked: false,
				}),
				labelCheck = tag("label", {}, "hiển thị mật khẩu");
			var button = tag("button", { id: "change" }, "Cập Nhật");
			var form = tag(
					"div",
					{ class: ["form", "flex"] },
					boxInput + checkbox + labelCheck
				),
				msg = tag("p", { id: "msg" }, "");

			DOM.html(header + form + msg + button);

			$("#check").change(function (e) {
				$("#pw1").attr("type", this.checked ? "text" : "password");
			});
			$("#change").click(changePassHandleClick);
			displayRender();
		}, 1000);
	},
	changePassHandleClick = () => {
		const msg = $("#msg");
		msg.html("");
		if (pw1.value == "" || pw1.value == api.info.pass)
			msg.text("bạn chưa nhập mật khẩu mới...");
		else {
			api.ChangePassRequest(pw1.value);
		}
	};
