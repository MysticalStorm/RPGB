chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if (info.url === "https://data.mo.ee/release.js?v=57-7-0-1b") {
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