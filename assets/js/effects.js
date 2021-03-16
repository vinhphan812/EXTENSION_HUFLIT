// enble/disable to Input, Button Login
function isDisabledInput(flag) {
	inpUser.prop("disabled", flag);
	inpPass.prop("disabled", flag);
	$("#login").prop("disabled", flag);
}

//display input username and password
function displayInputLogin() {
	displayRender();

	$("#login").click(checkLogin);
	$(document.body).on("keyup", (event) =>
		event.key == "Enter" ? checkLogin() : null
	);
}

function fadeUp(el = DOM) {
	fade();
	el.css("transform", "translateY(30px)");
}

function fade(el = DOM) {
	el.css("opacity", 0);
}

function displayRender(el = DOM) {
	el.css("opacity", "1");
	el.css("transform", "translateY(0px)");
}

//? Animation logo and text content HUFLIT EXTENSION
function loginSuccess() {
	fade();
	$("#box-title").addClass("row").removeClass("column");
	$(document.body).css("height", "500px").off();
}
function doneHome() {
	Menu.css("opacity", 1);
	DOM.css("height", "300px");
}
