browser.runtime.onMessage.addListener(msg => {
	if (!msg.format) {
		return;
	}

	const t = format(msg.format);
	navigator.clipboard.writeText(t).then(() => console.log("Copy:", t));
});

function format(text) {
	function h(fragment) {
		const su = {
			"&": "&amp;",
			">": "&gt;",
			"<": "&lt;",
			"\"": "&quot;"
		};
		const re = new RegExp(Object.keys(su).join("|"), "g");

		return fragment.replace(re, match => su[match]);
	}

	const substitutions = {
		"%URL%": location.href,
		"%URL_H%": h(location.href),
		"%TITLE%": document.title,
		"%TITLE_H%": h(document.title)
	};
	const regexp = new RegExp(Object.keys(substitutions).join("|"), "g");

	return text.replace(regexp, match => substitutions[match]);
}
