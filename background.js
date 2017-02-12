const specs = [
	{
		title: "Title",
		format: "%TITLE%"
	},
	{
		title: "URL",
		format: "%URL%"
	},
	{
		title: "Title ↵ URL",
		format: "%TITLE%\n%URL%"
	},
	{
		title: "Title ␣ URL",
		format: "%TITLE% %URL%"
	},
	{
		title: "HTML",
		format: "<a href=\"%URL_H%\" title=\"%TITLE_H%\">%TITLE_H%</a>"
	},
	{
		title: "Markdown",
		format: "[%TITLE%](%URL% \"%TITLE%\")"
	}
];

specs.forEach((spec, index) => {
	browser.contextMenus.create(
		{
			id: `${index}`, title: spec.title, contexts: ["all"],
			documentUrlPatterns: ["http://*/*", "https://*/*"]
		})
});

browser.contextMenus.onClicked.addListener((info, tab) => {
	// Delegate handling clipboard to the content script.
	browser.tabs.sendMessage(tab.id, { "format": specs[`${info.menuItemId}`].format });
});

