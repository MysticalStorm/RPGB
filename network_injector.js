chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var regexp = /https:\/\/data.mo.ee\/release.js\?v=(\d{2}|\d{1})-(\d{2}|\d{1})-(\d{2}|\d{1})-(\d{2}|\d{1})(\w)?/g
    if (regexp.test( info.url.toString() )) {
    //if (info.url === "https://data.mo.ee/release.js?v=57-7-0-2a") {
      return {cancel: true};
    }
  },
  {
    urls: [
      "http://rpg.mo.ee/*",
      "https://data.mo.ee/*"
    ]
  }, ["blocking"]
);