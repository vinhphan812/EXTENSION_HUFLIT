/**
 *?class all active for extension
 */
const DOM = $("#root"),
	Menu = $("#menu"),
	main = $("#main"),
	inpUser = $("#user"),
	inpPass = $("#pass");

const dataKey = ["user", "pass", "cookie", "schedule", "name", "studyProgram"],
	time = {
		1: { s: "6h45", e: "7h35" },
		2: { s: "7h35", e: "8h25" },
		3: { s: "8h25", e: "9h15" },
		4: { s: "9h30", e: "10h20" },
		5: { s: "10h20", e: "11h10" },
		6: { s: "11h10", e: "12h00" },
		7: { s: "12h45", e: "13h35" },
		8: { s: "13h35", e: "14h25" },
		9: { s: "14h25", e: "15h15" },
		10: { s: "15h30", e: "16h20" },
		11: { s: "16h20", e: "17h10" },
		12: { s: "17h10", e: "18h15" },
		13: { s: "18h15", e: "19h05" },
		14: { s: "19h05", e: "19h55" },
		15: { s: "19h55", e: "20h45" },
		start: (t) => time[t].s,
		end: (t) => time[t].e,
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
		DOM.html(
			tag("div", { class: ["text", "error"] }, errorText) +
				tag("button", {}, "Thử Lại")
		),
	successText = (t) =>
		DOM.html(
			tag("div", { class: ["text", "success"] }, t) +
				tag("button", {}, "Quay Lại")
		),
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
function tag(tag, data = {}, text = false) {
	const typeData = (dt) => typeof dt === "boolean";
	var s = [];
	if (data)
		for (var key in data) {
			const dt = data[key],
				val = typeof dt == "object" ? dt.join(" ") : dt;
			s.push(typeData(dt) ? (dt ? key : "") : `${key}="${val}"`);
		}
	text = typeof text == "object" ? text.join("") : text;
	var s = s.join(" ");
	return !text ? `<${tag} ${s} />` : `<${tag} ${s}>${text}</${tag}>`;
}

const LoginControl = async function (res) {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);

			if (!data.success) tab.api.login(callbackLogin);
			else tab.HOME(data.name) & tab.api.getSchedule(callbackSchedule);
		}
	},
	callbackLogin = async function () {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);

			if (!data.success) {
				if (tab.api.info) {
					chrome.storage.local.remove(dataKey);
					window.location.href = "popup.html";
				}
				isDisabledInput(false);
				return $("#msg").text(data.msg);
			}

			tab.HOME(data.name);
			tab.api.info.cookie = data.cookie;
			tab.api.info.name = data.name;
			tab.api.saveInfo();
			tab.api.getSchedule(callbackSchedule);
		}
	},
	callbackSchedule = function () {
		if (readyState(this)) {
			const data = JSON.parse(this.responseText);
			if (!data.success) return alert("Please Login Again!!!");
			fade();
			renderSchedule(data.schedule);
			displayRender();
			tab.api.info.schedule = data.schedule;
			tab.api.saveInfo();
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
		tab.api.setAccount(inpUser.val(), inpPass.val()) &
			tab.api.login(callbackLogin);
	},
	scheduleHandle = () => tab.api.getSchedule(callbackSchedule),
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
	};
