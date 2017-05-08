/*
 * contentScriptWhen: "start"
 *
 * "start": Load content scripts immediately after the document
 * element is inserted into the DOM, but before the DOM content
 * itself has been loaded
 */

/*
 * use an empty HTMLElement both as a place_holder
 * and a way to prevent the DOM content from loading
 */


var s = document.createElement ("script");
s.src = chrome.extension.getURL ("bot/injection.js");
s.async = false;
document.documentElement.appendChild (s);

var s = document.createElement ("script");
s.src = chrome.extension.getURL ("bot/injection_bot.js");
s.async = false;
document.documentElement.appendChild (s);

var s = document.createElement ("script");
s.src = chrome.extension.getURL ("auxiliary/pathfinding-browser.min.js");
s.async = false;
document.documentElement.appendChild (s);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (request.id == "draw") {
    	location.href="javascript:nodes(); void 0";
	} else if (request.id == "bot") {
		location.href="javascript:activateBot(); void 0";
	} else if (request.id == "stop") {
		location.href="javascript:stopBot(); void 0";
	} else if (request.id == "home") {
		location.href="javascript:toHome(); void 0";
	}
});

document.addEventListener('yourCustomEvent', function (e) {
  	var data=e.detail;
  	chrome.runtime.sendMessage(data);
});