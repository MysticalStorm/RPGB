	var mapData = {path: []};
	var refreshId = false;

    function refresh() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {id: "draw"}, function(response) {
  			});
		});
	}

	function bot() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {id: "bot"}, function(response) {
  			});
		});
	}

	function stop() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {id: "stop"}, function(response) {
  			});
		});
	}

	function home() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {id: "home"}, function(response) {
  			});
		});
	}

	function communication() {
		chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			//{map: data, player: {i: players[0].i, j: players[0].j}, path: path, enemies: enemies, players: players_coords}
			mapData["map"] = request.map;
			mapData["player"] = request.player;
			if (request.path !== undefined) mapData["path"] = request.path;
			mapData["enemies"] = request.enemies;
			mapData["players"] = request.players;
			
			drawBotMap();
		});
	}

	function drawBotMap() {
		var data = mapData;

    	var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		for (var i = data.map.length - 1; i >= 0; i--) {
			for (var j = 0; j <= data.map[i].length - 1; j++) {
				ctx.fillStyle = (data.map[i][j].type ? "#FFFFFF" : "#000000");
				ctx.fillRect(i*2,j*2,2,2);
			}
		}

		var path = data.path;
		for (var i = 0; i <= path.length - 1; i++) {
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(path[i][0]*2, path[i][1]*2, 2, 2);
		}

		var enemies = data.enemies;
		for (var i = 0; i <= enemies.length - 1; i++) {
			ctx.fillStyle = "#FC7777";
			ctx.fillRect(enemies[i].x*2, enemies[i].y*2, 2, 2);
		}

		var players = data.players;
		for (var i = 0; i <= players.length - 1; i++) {
			ctx.fillStyle = "#0000FF";
			ctx.fillRect(players[i].x*2, players[i].y*2, 4, 4);
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect((players[i].x*2)+1, (players[i].y*2)+1, 2, 2);
		}		

		ctx.fillStyle = "#4CFF00";
		ctx.fillRect(data.player.i*2,data.player.j*2, 3, 3);
    }

	document.addEventListener('DOMContentLoaded', function() {
	    $("#refreshButton").click(function () {
	    	if (!refreshId) {
	    		refreshId = setInterval(refresh, 1000);
	    	} else {
	    		clearInterval(refreshId);
	    		refreshId = false;
	    	}
	    });

	   	$("#activateButton").click(function () {
	    	bot();
	    });

	    $("#stopButton").click(function () {
	    	stop();
	    });

	    $("#homeButton").click(function () {
	    	home();
	    });

	    communication();
	});