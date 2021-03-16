/**
 * ? MODULE API: getSchedule, ChangePassword, Logout.
 */
function Change() {
	const msg = $("#msg");
	msg.html("");
	if (pw1.value == "" || pw1.value == api.info.pass)
		msg.text("bạn chưa nhập mật khẩu mới...");
	else {
		api.ChangePassRequest(pw1.value);
	}
}

class Tab {
	static menu = ["Schedules", "Password", "Logout"];
	constructor() {}

	static HOME(data) {
		//? animation LOGO
		fade();
		loginSuccess();

		//? DOM username
		Menu.html(
			tag(
				"div",
				tag("img", "", { src: "/assets/img/user.png" }) +
					tag("p", data.split(" |")[1]),
				{
					class: ["user", "flex"],
				}
			) + tag("ul", menuEl(this.menu), { class: ["menu", "flex"] })
		);

		//? DOM menu list
		$("#Schedules").click(scheduleHandle);
		$("#Password").click(changePassHandle);
		$("#Logout").click(logOut);

		//transition css
		return setTimeout(doneHome, 450);

		function menuEl(data) {
			return data
				.map(function (item) {
					return tag(
						"li",
						tag("img", "", {
							class: "icon",
							src: `assets/img/${item}.png`,
						}) + tag("span", item),
						{ class: "itemMenu", id: item }
					);
				})
				.join("");
		}
	}
}

class API {
	constructor(info) {
		this.host = "https://api-huflit.herokuapp.com/";
		this.info = info;
		this.callback = function (a) {
			if (a.currentTarget.readyState == 4) {
				if (!a.currentTarget.responseText)
					return alert("request failed");
				const data = JSON.parse(a.currentTarget.responseText);
				if (data.success) console.log(data);
			}
		};
		if (this.info.schedule) {
			Tab.HOME(this.info.name);
			renderSchedule(this.info.schedule);
		}
	}

	setAccount(user, pass) {
		if (!user || !pass) return false;
		this.info.user = user;
		this.info.pass = pass;
		return true;
	}

	saveInfo() {
		chrome.storage.local.set(this.info);
	}

	requestServer(uri, data, callback = this.callback) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", this.host + uri);

		xhr.onreadystatechange = callback;

		xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8");
		xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
		xhr.setRequestHeader(
			"Content-Type",
			"application/x-www-form-urlencoded"
		);

		xhr.send(data);
	}

	login(callback) {
		if (!this.info.user || !this.info.pass) return displayInputLogin();

		const data = formData({ user: this.info.user, pass: this.info.pass });
		this.requestServer("login", data, callback);
	}

	checkCookie(callback) {
		return new Promise(async (resolve, reject) => {
			if (!this.info.cookie) return this.login(callbackLogin);

			const data = formData({ cookie: this.info.cookie });
			this.requestServer("checkCookie", data, callback);
		});
	}

	getSchedule(callback) {
		return new Promise(async (resolve, reject) => {
			const data = formData({ cookie: this.info.cookie });
			this.requestServer("GetSchedule", data, callback);
		});
	}

	ChangePassRequest(newPassword, callback) {
		return new Promise(async (resolve, reject) => {
			const data = formData({
				cookie: this.info.cookie,
				oldPass: this.info.oldPass,
				newPass: newPassword,
			});
			this.requestServer("ChangePass", data, callback);
		});
	}
}

let api;

(async () => {
	var info = await getDataFormStorage(dataKey);
	api = new API(info);
	api.checkCookie(LoginControl);
})();
