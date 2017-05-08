	var mapData = {path: [], active: false};

    function refresh() {
    	if (mapData.active)
    		$("#activateButton").css("background-color", "green");
    	else
    		$("#activateButton").css("background-color", "red");

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
            mapData["area"] = request.area;
			if (request.path !== undefined) mapData["path"] = request.path;
			mapData["enemies"] = request.enemies;
			mapData["players"] = request.players;
			mapData["active"] = request.active;

			drawBotMap();
		});
	}

	function drawBotMap() {
		var data = mapData;

    	var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, data.map.length*2, data.map[0].length*2);

		if (data.area != undefined) {
			var area = {
				lx: data.area.lx < data.area.rx ? data.area.lx : data.area.rx,
				rx: data.area.lx < data.area.rx ? data.area.rx : data.area.lx,
                ly: data.area.ly < data.area.ry ? data.area.ly : data.area.ry,
                ry: data.area.ly < data.area.ry ? data.area.ry : data.area.ly
			}
            for (var i = area.lx; i <= area.rx; i++) {
                for (var j = area.ly; j <= area.ry; j++) {
                    ctx.fillStyle = "#a59bff";
                    ctx.fillRect(i * 2, j * 2, 2, 2);
                }
            }
        }

		for (var i = data.map.length - 1; i >= 0; i--) {
			for (var j = 0; j <= data.map[i].length - 1; j++) {
				ctx.fillStyle = "#000000";
                if (!data.map[i][j].type)
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
			ctx.fillStyle = "#2500ff";
			ctx.fillRect(players[i].x*2, players[i].y*2, 4, 4);
			ctx.fillStyle = "#3fff00";
			ctx.fillRect((players[i].x*2)+1, (players[i].y*2)+1, 2, 2);
		}		

		ctx.fillStyle = "#4CFF00";
		ctx.fillRect(data.player.i*2,data.player.j*2, 3, 3);
    }

	document.addEventListener('DOMContentLoaded', function() {
	   	$("#activateButton").click(function () {
	    	bot();
	    });

	    $("#homeButton").click(function () {
	    	home();
	    });

        setInterval(refresh, 1000);
	    communication();
	});