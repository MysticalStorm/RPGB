chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if (info.url === "https://data.mo.ee/release.js?v=57-7-0-2") {
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