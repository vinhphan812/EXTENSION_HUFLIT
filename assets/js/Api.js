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
		loginSuccess();

		//? DOM username
		Menu.html(
			`<div class="user flex">
                    <img src="assets/img/user.png">
                    ${textTag("p", data.split(" |")[1])}
               </div>
               <ul class="menu flex">
			     ${menuEl(this.menu)}
		     </ul>`
		);

		//? DOM menu list
		$("#Schedules").click(scheduleHandle);
		// $("#Password").click(renderChangePass);
		$("#Password").click(changePassHandle);
		$("#Logout").click(logOut);

		//transition css
		return setTimeout(doneHome, 450);

		function menuEl(data) {
			return data
				.map(function (item) {
					return `<li class="itemMenu" id="${item}">
                                   <img class="icon" src="assets/img/${item}.png">
                                   ${textTag("span", item)}
                              </li>`;
				})
				.join("");
		}

		function textTag(tag, text) {
			return `<${tag}>${text}</${tag}>`;
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

		const data = `user=${this.info.user}&pass=${this.info.pass}`;
		this.requestServer("login", data, callback);
	}

	checkCookie(callback) {
		return new Promise(async (resolve, reject) => {
			if (!this.info.cookie) return this.login(callbackLogin);

			const data = "cookie=" + this.info.cookie;
			this.requestServer("checkCookie", data, callback);
		});
	}

	getSchedule(callback) {
		return new Promise(async (resolve, reject) => {
			const data = "cookie=" + this.info.cookie;
			this.requestServer("GetSchedule", data, callback);
		});
	}

	ChangePassRequest(newPassword, callback) {
		return new Promise(async (resolve, reject) => {
			const data = `cookie=${this.info.cookie}&oldPass=${this.info.pass}&newPass=${newPassword}`;
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
