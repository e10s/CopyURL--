browser.runtime.onMessage.addListener(msg => {
	if (!msg.format) {
		return;
	}

	const textHolder = createTextHolder();
	textHolder.textContent = format(msg.format);
	const ranges = preserveSelection();

	try {
		document.body.appendChild(textHolder);

		const range = document.createRange();
		range.selectNodeContents(textHolder);


		const sel = getSelection();
		sel.removeAllRanges();
		sel.addRange(range);

		document.execCommand("Copy");
		console.log("Copy:", sel.toString());
	}
	finally {
		if (textHolder.parentNode) {
			document.body.removeChild(textHolder);
		}
		restoreSelection(ranges);
	}
});

function createTextHolder() {
	const ta = document.createElement("textarea");
	ta.readonly = true;
	return ta;
}

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

function preserveSelection() {
	return (sel => Array.from(Array(sel.rangeCount)).map((_, i) => sel.getRangeAt(i)))(getSelection());
}

function restoreSelection(ranges) {
	const sel = getSelection();

	ranges.forEach(r => {
		sel.addRange(r);
	});
}

