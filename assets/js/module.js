/**
 *?class all active for extension
 */
const DOM = $("#root"),
	Menu = $("#menu"),
	main = $("#main"),
	inpUser = $("#user"),
	inpPass = $("#pass");

const dataKey = ["user", "pass", "cookie", "schedule", "name"];

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
function tag(tag, text, data = {}) {
	var s = "";
	if (data)
		for (var key in data) {
			const dt = data[key],
				val = typeof dt == "object" ? dt.join(" ") : dt;

			s += `${key}="${val}" `;
		}

	return `<${tag} ${s}>${text}</${tag}>`;
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
	changePassHandle = function () {
		// form change password
		fadeUp();

		setTimeout(function () {
			var form = document.createElement("div");
			form.className = "form flex";
			//box input password
			var boxInput = document.createElement("div"),
				inputPass = document.createElement("input"),
				labelPass = document.createElement("label");
			boxInput.classList.add("box");
			// input password
			inputPass.type = "password";
			inputPass.id = "pw1";
			inputPass.required = true;
			//label password
			labelPass.textContent = "Mật khẩu mới";
			// checkbox display password
			var checkbox = document.createElement("input"),
				labelCheck = document.createElement("label");
			checkbox.type = "checkbox";
			checkbox.id = "check";
			checkbox.checked = false;
			labelCheck.textContent = "hiển thị mật khẩu";
			checkbox.addEventListener("change", function (e) {
				inputPass.type = this.checked ? "text" : "password";
			});
			//add elements for form change password
			$(form).append(boxInput).append(checkbox).append(labelCheck);

			//add elements for box Input password
			$(boxInput).append(inputPass).append(labelPass);

			DOM.html(form);

			displayRender();
		}, 1000);
	};
