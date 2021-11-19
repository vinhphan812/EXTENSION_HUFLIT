const dataKey = ["user", "pass", "cookie", "schedule", "name", "studyProgram"];
chrome.runtime.onInstalled.addListener(() =>
	console.log("Installed success!!!")
);

chrome.runtime.onStartup.addListener(async () => {});

chrome.storage.local.get(dataKey, async function (data) {
	console.log("run check");
	if (data.cookie) {
		checkCookie(data);
	} else {
		console.log("cookie null");
		if ((data.user, data.pass)) return login(data.user, data.pass);
		else console.log("info null");
	}
});

async function checkCookie({ user, pass, cookie }) {
	if (cookie) {
		const data = await (
			await fetchData("checkCookie", `cookie=${cookie}`)
		).json();
		if (data.success) return "USING";
	}
	if (user && pass) return login(user, pass);
	return "NULL";
}

async function login(user, pass) {
	const { success, cookie, name, term, year } = await (
		await fetchData("login", `user=${user}&pass=${pass}`)
	).json();
	if (success) {
		console.log("save");
		chrome.storage.local.set({
			cookie: cookie,
			name: name,
			term: term,
			year: year,
		});
	}
	return true;
}

function fetchData(path, body) {
	return fetch("https://api-huflit.herokuapp.com/" + path, {
		method: "POST",
		headers: {
			"Content-Type":
				"application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: body,
	});
}
