"use strict";

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

browser.runtime.onInstalled.addListener(() => {
	specs.forEach((spec, index) => {
		browser.menus.create(
			{
				id: `${index}`, title: spec.title, contexts: ["all"],
				documentUrlPatterns: ["https://*/*"]
			})
	});
});

browser.menus.onClicked.addListener((info, tab) => {
	// Delegate handling clipboard to the content script.
	browser.tabs.sendMessage(tab.id, { "format": specs[`${info.menuItemId}`].format });
});

