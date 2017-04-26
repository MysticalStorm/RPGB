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
s.src = chrome.extension.getURL ("injection.js");
s.async = false;
document.documentElement.appendChild (s);