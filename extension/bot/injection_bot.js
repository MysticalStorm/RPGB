    var isBotActive = false;
	var currentFarmArea;
	var movementSpeed = 225;

    function pathTo(x, y) {
		var finder = new PF.BestFirstFinder({
    		allowDiagonal: false
		});

    	var map = node_graphs[players[0].map].nodes;
    	var grid = new PF.Grid(map.length, map[0].length);

		for (var i = 0; i <= map.length - 1; i++) {
			for (var j = 0; j <= map[i].length - 1; j++) {
				grid.setWalkableAt(i, j, Boolean(map[i][j].type));
			}
		}
		var path = finder.findPath(players[0].i, players[0].j, x, y, grid);
		path.shift(); 
		return path;
    }

    function scanArea(lx, ly, rx, ry, exept) {
    	var enemies = [];
    	var map = node_graphs[players[0].map].nodes
	    for (var i = lx; i <= rx; i++) {
			for (var j = ly; j <= ry; j++) {
				var item = on_map[players[0].map][i][j];
				if (item.b_t == BASE_TYPE.NPC) {
					var item_object = obj_g(item);
					enemies.push({x: item_object.i, y: item_object.j});
				}
			}
		}

		if (exept != undefined) 
		enemies = enemies.filter(function (element) {
			var isValid = true;
			exept.forEach( function(coord, i, arr) {
				isValid = isValid && (JSON.stringify(coord) !== JSON.stringify(element));
			}); 
			return isValid;
		});

		var p = { x: players[0].i, y: players[0].j}
		enemies.sort(function (a, b) {
			var lhs = (Math.abs(p.x - a.x) + Math.abs(p.y - a.y));
			var rhs = (Math.abs(p.x - b.x) + Math.abs(p.y - b.y));
			if (lhs > rhs) {
				return 1;
			} else if (lhs < rhs) { 
				return -1; 
			}
			return 0;
		})

		return enemies;
    }

    function ableToAtackEnemiesPaths(enemies) {
    	var enemiesData = [];
    	enemies.forEach( function(enemy, i, arr) {
    		var positionPath = atackPosition(enemy.x, enemy.y);
    		if (positionPath.length > 0) {
    			enemiesData.push({path: positionPath, enemy: enemy});
    		}
		});
    	enemiesData.sort(function (a, b) {
    		return a.path.length - b.path.length;
    	})
    	return enemiesData;
    }

    function atackPosition(x, y) {
    	var paths = [];

    	if (!obj_g(on_map[players[0].map][x - 1][y])) {
    		paths.push(pathTo(x - 1, y));
    	}
    	if (!obj_g(on_map[players[0].map][x + 1][y])) {
    		paths.push(pathTo(x + 1, y));	
    	}
    	if (!obj_g(on_map[players[0].map][x][y - 1])) {
    		paths.push(pathTo(x, y - 1));
    	}
    	if (!obj_g(on_map[players[0].map][x][y + y])) {
    		paths.push(pathTo(x, y + 1));
    	}
    	paths = paths.filter(function (element) {
    		return Boolean(element.length);
    	})
    	var sorted = paths.sort(function (a, b) {
    		return a.length > b.length ? 1 : ( (a.length === b.length) ? 0 : -1 )
    	})
    	return sorted.length === 0 ? [] : sorted.shift();
    }

    function getPlayersCoords() {
        var players_coords = Object.values( players ).map(function(elem, index) {
            return {x: elem.i, y: elem.j, name: elem.name};
        });
        var players_coords = players_coords.filter(function (elem) {
            return !(/pet/.test(elem.name))
        })
		return players_coords;
    }

	function playersInArea(area) {
		var players_coords = getPlayersCoords();
		var _players = [];

        area = {
            lx: area.lx < area.rx ? area.lx : area.rx,
            rx: area.lx < area.rx ? area.rx : area.lx,
            ly: area.ly < area.ry ? area.ly : area.ry,
            ry: area.ly < area.ry ? area.ry : area.ly
        }
		players_coords.forEach(function (player, i, array) {
			if ( (player.x >= area.lx && player.x <= area.rx) &&
				(player.y >= area.ly && player.y <= area.ry) ) {
				_players.push(player);
			}
		});
		return _players;
    }

    function activateBot() {
    	if (isBotActive) {
    		isBotActive = false;
    		return;
		}
    	isBotActive = true;

        var castleArea = {lx: 40, ly: 54, rx: 52, ry: 65, exept: [{x: 43, y: 58}, {x: 50, y: 63}]};
        currentFarmArea = castleArea;

    	farmArea(currentFarmArea);
    }

    function stopBot() {
    	isBotActive = false;
    	currentFarmArea = undefined;
    }

    function toHome() {
    	var path=pathTo(20, 20);
    	movementSpeed = 225;
    	_moveInPath(path, function (s) {})
    }

    function farmArea(area) {
    	if (area === undefined) return;

    	var mobs = scanArea(area.lx, area.ly , area.rx, area.ry, area.exept);
    	var positionsToAtack = ableToAtackEnemiesPaths(mobs);
    	farmMobs(positionsToAtack);
    }

    
    function farmMobs(positionsToAtack) {
    	if (positionsToAtack.length == 0) {
    		console.log("Farm is empty");
    		setTimeout(farmArea, 1000, currentFarmArea);
    		return
    	}
    	if (!isBotActive) return;

    	var atackPosition = positionsToAtack.shift();
    	if (atackPosition.path.length > 0) {
    		nodes(atackPosition.path);

    		var p = atackPosition.path[0];
    		movementSpeed = playersInArea(currentFarmArea).length > 1 ? 500 : 225;
    		_moveInPath(atackPosition.path, function (finished) {
    			if (p != undefined)
    			console.log("move to (" + p.x + " " + p.y + ") - " + finished);

    			if (finished) {
    				if (!on_map[players[0].map][atackPosition.enemy.x][atackPosition.enemy.y]) {
						farmArea(currentFarmArea);
						return
					}

					atackMob(atackPosition.enemy.x, atackPosition.enemy.y, function (success) {
						console.log("atack (" + atackPosition.enemy.x + " " + atackPosition.enemy.y + ") - " + success);
                        farmArea(currentFarmArea);
					});
    			}
    		})
    	} else {
    		farmMobs(positionsToAtack);
    	}
    }

    function atackMob(x, y, callback) {
    	Socket.send("set_target", {
				target: obj_g(on_map[players[0].map][x][y]).id
		});
		isMobDead(x, y, callback);
    }

    function isMobDead(x, y, callback) {
    	if (!(on_map[players[0].map][x][y].b_t == BASE_TYPE.NPC)) {
    		callback(true);
    		return
    	}
    	setTimeout(isMobDead, 100, x, y, callback);
    }

    function nodes(path) {
    	var data=node_graphs[players[0].map].nodes;
    	var enemies = scanArea(0, 0, 100, 100);
        var players_coords = getPlayersCoords();

		var evt=document.createEvent("CustomEvent");
		evt.initCustomEvent("yourCustomEvent", true, true, 
				{map: data,
				player: {i: players[0].i, j: players[0].j},
				path: path,
				enemies: enemies,
				players: players_coords,
				area: currentFarmArea,
				active: isBotActive});
		document.dispatchEvent(evt);
    }

    function validate(item) {
    	return (Math.abs(players[0].i - item[0]) <= 1) || (Math.abs(players[0].j - item[1]) <= 1) || !obj_g(on_map[players[0].map][item[0]][item[1]])
    }

    function _moveInPath(path, callback) {
    	if (path.length == 0) {
    		players[0].temp.dest = {i: players[0].i, j: players[0].j};
    		players[0].temp.dest = players[0].temp.to;
    		callback(true);
    		return
    	}
    	var item = path.shift();
    	if (!validate(item)) {
    		players[0].temp.dest = {i: players[0].i, j: players[0].j};
    		players[0].temp.dest = players[0].temp.to;
    		callback(false);
    		console.log("Not valid movement")
    		return
    	}
    	

    	players[0].temp.to.i = item[0];
    	players[0].temp.to.j = item[1];
    	players[0].temp.dest = {i: item[0], j: item[1]};
    	
    	Socket.send("move", {
                        i: item[0],
                        j: item[1],
                        t: timestamp()
        })
        players[0].i = item[0];
        players[0].j = item[1];
       	resetMapShift();
       	finishedMovement();
       	drawMap();
       	updateBase();
       	setTimeout(_moveInPath, movementSpeed ,path, callback);
    } 