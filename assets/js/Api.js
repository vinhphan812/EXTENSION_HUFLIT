/**
 * ? MODULE API: getSchedule, ChangePassword, Logout.
 */

let api, tab;

class Tab {
	constructor(info) {
		this.action = [
			this.Schedule,
			this.Mark,
			this.ChangePass,
			this.Logout,
		];
		this.current = "";
		this.menu = ["Schedule", "Mark", "Password", "Logout"];
		this.api = new API(info, this);
	}

	HOME(data) {
		//? animation LOGO
		loginSuccess();
		//? DOM username
		Menu.html(
			tag(
				"div",
				{
					class: ["user", "flex"],
				},
				tag("img", { src: "/assets/img/user.png" }) +
					tag("p", {}, data.split(" | ")[1])
			) + tag("ul", { class: ["menu", "flex"] }, menuEl(this.menu))
		);

		//? DOM menu list
		for (var i = 0; i < this.menu.length; i++) {
			$("#" + this.menu[i]).click(this.action[i]);
		}

		//? transition css
		return setTimeout(doneHome, 450);

		function menuEl(data) {
			const src = (fname) => `./assets/img/${fname}.png`;
			return data
				.map((item) => {
					var span = tag("span", {}, item),
						img = tag("img", {
							class: "icon",
							src: src(item),
						});
					return tag(
						"li",
						{ class: "itemMenu", id: item },
						img + span
					);
				})
				.join("");
		}
	}
	ChangePass() {
		//? form change password
		fadeUp();

		setTimeout(function () {
			var header = tag(
				"h2",
				{ class: "textCenter" },
				"Change Password"
			);
			var inpPass = tag("input", {
					type: "password",
					id: "pwOld",
					required: true,
					value: tab.api.info.pass,
				}),
				lblPass = tag(
					"label",
					{ for: "pwOld" },
					"Mật khẩu hiện tại"
				),
				boxOld = tag("div", { class: "box" }, inpPass + lblPass);

			var inpNew = tag("input", {
					type: "password",
					id: "pw1",
					required: true,
				}),
				labelNew = tag("label", { for: "pw1" }, "Mật khẩu mới"),
				boxNew = tag("div", { class: "box" }, inpNew + labelNew);
			var checkbox = tag("input", {
					type: "checkbox",
					id: "check",
					checked: false,
				}),
				labelCheck = tag(
					"label",
					{ for: "check" },
					"hiển thị mật khẩu"
				);
			var button = tag("button", { id: "change" }, "Cập Nhật");
			var BOX = tag("div", {}, boxOld + boxNew);
			var form = tag(
					"div",
					{ class: ["form", "flex"] },
					BOX + checkbox + labelCheck
				),
				msg = tag("p", { id: "msg" }, " ");

			DOM.html(header + form + msg + button);
			$(document.body).on("keyup", (e) =>
				e.key == "Enter" ? changePassHandle() : null
			);

			$("#check").change(function (e) {
				$("#pw1").attr("type", this.checked ? "text" : "password");
				$("#pwOld").attr(
					"type",
					this.checked ? "text" : "password"
				);
			});

			$("#change").click(changePassHandle);
			displayRender();
		}, 1000);

		const changePassHandle = () => {
				const msg = $("#msg");
				msg.html("");
				if (pw1.value == "" || pw1.value == tab.api.info.pass)
					return msg.text("bạn chưa nhập mật khẩu mới...");

				tab.api.ChangePassRequest(
					$("#pwOld").val(),
					pw1.value,
					function () {
						if (this.readyState == 4) {
							var data = JSON.parse(this.responseText);
							if (data.success) {
								tab.api.info.pass = pw1.value;
								tab.api.saveInfo();
							}
							console.log();
							StateControl(data.msg, data.success);
						}
					}
				);
			},
			StateControl = (text, flag) => {
				$(document.body).off("keyup", (e) =>
					e.key == "Enter" ? changePassHandle() : null
				);
				if (flag) setContentModal("Status", text);
				else setContentModal("Status", text);
				$("#pwOld").val(tab.api.info.pass);
				$("button").click(tab.ChangePass);
			};
	}
	Mark() {
		fade();
		if (tab.api.info.marks) return render(tab.api.info.marks);
		tab.api.getMark(renderMark);

		function renderMark() {
			if (this.readyState == 4) {
				const data = JSON.parse(this.responseText);
				tab.api.info.studyProgram = data.sProgram;
				tab.api.saveInfo();
				if (data.success) return render(data.data);
				else tab.api.getMark(renderMark);
			}
		}
		function render(marks) {
			tab.api.info.marks = marks;
			DOM.html(
				tag("div", { style: "overflow: overlay;", id: "mark" }, "")
			);

			const $mark = $("#mark");
			for (var i = 0; i < marks.length; i++) {
				const {
					subject,
					score,
					scoreChar,
					survey,
					codeDetail,
				} = marks[i];

				const info = tag(
					"div",
					{ class: "info flex" },
					tag("span", { class: "mon" }, subject)
				);
				var stateClass = "",
					content = "",
					detail = " ";

				if (score) {
					content += renderScore(score);
					content += renderScore(scoreChar);

					stateClass = score > 4 ? "pass" : "fail";

					tab.api.getDetail(codeDetail, function () {
						if (this.readyState == 4) {
							const { sContent, sDetail } = JSON.parse(
									this.responseText
								),
								$detail = $("#" + codeDetail);
							$(".loading > .task", $detail).css(
								"width",
								"100%"
							);
							setTimeout(() => {
								$(".loading", $detail).remove();
								for (var j in sDetail) {
									$detail.append(
										elDetail(
											sContent[j],
											sDetail[j]
										)
									);
								}
							}, 500);
						}
					});
					detail = tag(
						"div",
						{ class: "detail", id: codeDetail },
						'<div class="loading"><div class="bg-loading"></div><div class="task"></div></div>'
					);
				}

				const elSurvey = survey
					? tag(
							"button",
							{
								class: "survey",
								"data-PID": survey.PID,
								"data-SID": survey.SID,
								"data-classId": survey.classId,
								"data-auth": survey.auth,
								"data-YearStudy": survey.YearStudy,
								"data-TermID": survey.TermID,
							},
							"auto Survey"
					  )
					: "";

				var title = tag(
					"div",
					{ class: "flex header" },
					info + content + elSurvey
				);

				var el = tag(
					"div",
					{ class: "subject flex column " + stateClass },
					title + detail + tag("div", { class: "bg" }, " ")
				);

				$mark.append(el);
			}
			DOM.append(
				tag("div", { class: "total" }, [
					tag("div", {}, `Total: ${marks.length}`),
					tag("div", {}, `Pass: ${$(".pass").length}`),
					tag("div", {}, `Fail: ${$(".fail").length}`),
				])
			);
			console.log("DONE");
			$(".survey").click(SurveyHandleClick);
			displayRender();
		}
		function renderScore(score) {
			if (score) return tag("span", { class: "score" }, score);
			return "";
		}
		function elDetail(content, score) {
			return tag(
				"div",
				{ class: "" },
				tag("span", {}, content) + tag("span", {}, score.toFixed(1))
			);
		}
		function SurveyHandleClick(e) {
			const data = e.target.attributes;
			if (data.length) {
				let form = {
					PID: data["data-pid"].nodeValue,
					SID: data["data-sid"].nodeValue,
					ClassId: data["data-classid"].nodeValue,
					Auth: data["data-auth"].nodeValue,
					YearStudy: data["data-yearstudy"].nodeValue,
					TermID: data["data-termid"].nodeValue,
					cookie: tab.api.info.cookie,
				};
				tab.api.Survey(form, function () {
					if (this.readyState == 4) {
						var data = JSON.parse(this.responseText);
						setContentModal("title", data.msg);
					}
				});
			}
		}
	}
	Schedule() {
		fade() & tab.api.getSchedule(callbackSchedule);
	}
	Logout() {
		chrome.storage.local.remove(dataKey);
		window.location.href = "popup.html";
	}
}

class API {
	constructor(info, tab) {
		this.tab = tab;
		// this.host = "https://api-huflit.herokuapp.com/";
		this.host = "http://localhost:3000/";
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
			tab.HOME(this.info.name);
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
		console.log("save");
		chrome.storage.local.set(this.info);
	}

	requestServer(uri, data, callback = this.callback) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", this.host + uri);

		xhr.onreadystatechange = callback;

		xhr.setRequestHeader("Accept", "*/*");
		xhr.setRequestHeader("Accept-Language", "vi,en;q=0.9,vi-VN;q=0.8");
		xhr.setRequestHeader(
			"Content-Type",
			"application/x-www-form-urlencoded"
		);

		xhr.send(data);
	}

	login(callback) {
		if (!this.info.user || !this.info.pass) return displayInputLogin();

		const data = formData({ user: this.info.user, pass: this.info.pass });
		return this.requestServer("login", data, callback);
	}

	checkCookie(callback) {
		if (!this.info.cookie) return this.login(callbackLogin);

		const data = formData({ cookie: this.info.cookie });
		return this.requestServer("checkCookie", data, callback);
	}

	getSchedule(callback) {
		const data = formData({ cookie: this.info.cookie });

		return this.requestServer("GetSchedule", data, callback);
	}

	ChangePassRequest(oldPass, newPassword, callback) {
		const data = formData({
			cookie: this.info.cookie,
			oldPass: oldPass,
			newPass: newPassword,
		});

		return this.requestServer("ChangePass", data, callback);
	}
	getMark(callback = this.callback) {
		const data = formData({
			cookie: this.info.cookie,
			studyProgram: this.info.studyProgram || "",
		});
		return this.requestServer("GetMark", data, callback);
	}
	getDetail(codeDetail, callback = this.callback) {
		const data = formData({
			cookie: this.info.cookie,
			codeDetail: codeDetail,
		});
		return this.requestServer("GetDetail", data, callback);
	}
	Survey(form, callback = this.callback) {
		const data = formData(form);
		return this.requestServer("SurveyTeacher", data, callback);
	}
}

(async () => {
	var info = await getDataFormStorage(dataKey);
	tab = new Tab(info);
	tab.api.checkCookie(LoginControl);
})();
