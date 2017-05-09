	var mapData = {path: [], active: false};
	var canvas;
	var lx, ly, rx, ry, px, py;

	var isNeedEdit = false;
	var isEditCoordinates = false;
	var isEditArea = false;

	var touches = 0;

	var isEditAnimated = false;
	var editAnimationId;

	// {lx:,ly:,rx:,ry:,exept:[],name:}
	var areas = {};
	var selectedArea;

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

    function toPoint() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        	if (px != undefined && py != undefined)
            	chrome.tabs.sendMessage(tabs[0].id, {id: "toPoint", point: {lx: Math.floor(px/2), ly: Math.floor(py/2)} },
                	function(response) {});
        	else
                chrome.tabs.sendMessage(tabs[0].id, {id: "toPoint" },
                    function(response) {});
        });
    }

	function newPoint() {
        if (px != undefined && py != undefined)
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {id: "newPoint", point: {lx: Math.floor(px/2), ly: Math.floor(py/2)} },
				function(response) {});
		});
	}

    function newArea() {
    	if (selectedArea !== undefined) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                        id: "newArea",
                        area: {area:
							{lx: Math.floor(selectedArea.area.lx / 2),
                            ly: Math.floor(selectedArea.area.ly / 2),
                            rx: Math.floor(selectedArea.area.rx / 2),
                            ry: Math.floor(selectedArea.area.ry / 2),
								exept: selectedArea.area.exept,
                            name: selectedArea.area.name,
						},
							index: selectedArea.index}
                    },
                    function (response) {
                    });
            });
        }
    }

	function communication() {
		chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			//{map: data, player: {i: players[0].i, j: players[0].j}, path: path, enemies: enemies, players: players_coords}
			mapData["map"] = request.map;
			mapData["player"] = request.player;
            //mapData["area"] = request.area.are;
            if (request.farm != undefined && request.active) {
            	selectedArea = {area:
                    {lx: Math.floor(request.farm.area.lx * 2),
                        ly: Math.floor(request.farm.area.ly * 2),
                        rx: Math.floor(request.farm.area.rx * 2),
                        ry: Math.floor(request.farm.area.ry * 2),
						exept: request.farm.area.exept,
                        name: request.farm.area.name,
                    },
                    index: request.farm.index}
            }
			if (request.path !== undefined) mapData["path"] = request.path;
			mapData["enemies"] = request.enemies;
			mapData["players"] = request.players;
			mapData["active"] = request.active;

			drawBotMap();
		});
	}

	function clearCanvas() {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 202, 202);
    }

	function drawBotMap() {
		var data = mapData;
		var ctx = canvas.getContext("2d");

		clearCanvas();

		if (selectedArea != undefined && data.active) {
            for (var i = selectedArea.area.lx; i <= selectedArea.area.rx; i++) {
                for (var j = selectedArea.area.ly; j <= selectedArea.area.ry; j++) {
                    ctx.fillStyle = "#a59bff";
                    ctx.fillRect(i, j, 2, 2);
                }
            }
        }

        if (!data.active && !isEditArea && !isEditCoordinates && selectedArea !== undefined) {
            for (var i = selectedArea.area.lx; i <= selectedArea.area.rx; i++) {
                for (var j = selectedArea.area.ly; j <= selectedArea.area.ry; j++) {
                    ctx.fillStyle = "#a59bff";
                    ctx.fillRect(i, j, 2, 2);
                }
            }
		}

        if (isEditCoordinates) {
            if (px != undefined && py != undefined) {
                ctx.fillStyle = "#ffa800";
                ctx.fillRect(px, py, 4, 4);
            }
		}
		if (isEditArea) {
			if (lx != undefined && ly != undefined && rx != undefined && ry != undefined) {
                ctx.fillStyle = "#FFA800";
                ctx.fillRect(lx, ly, rx - lx, ry - ly);
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

    // get mouse pos relative to canvas (yours is fine, this is just different)
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function editAnimation() {
    	if (isEditAnimated) {
            $("#setButton").css("background-color", "darkgoldenrod");
            if (isEditCoordinates) $("#setButton").text("Point");
            if (isEditArea) $("#setButton").text("Area");
        } else {
            $("#setButton").css("background-color", "#4CAF50");
            $("#setButton").text("Edit");
        }
        isEditAnimated = !isEditAnimated;
    }

    function isNeedEditApplyStyle() {
    	if ((isEditCoordinates || isEditArea) && editAnimationId === undefined) {
    		if (isEditArea)
            $("#save_button").text("S\na\nv\ne");
    		editAnimationId = setInterval(editAnimation, 500);
		} else if (editAnimationId !== undefined) {
            $("#save_button").text("C\nh\no\ns\ne");
    		try {
                if (isEditCoordinates) {
    		        newPoint();
                }
                clearInterval(editAnimationId);
    			editAnimationId = undefined;
    			isEditAnimated = false;
    			isEditCoordinates = false;
    			isEditArea = false;
    			isNeedEdit = false;
    			touches = 0;
    			editAnimation();
			} catch(error) {}
			return;
		}

        if (isNeedEdit) {
            $("#toCoordButton").text("Point");
            $("#toCoordButton").css("background-color", "darkgoldenrod");

            $("#nextButton").text("Area")
            $("#nextButton").css("background-color", "darkgoldenrod");
        } else {
            $("#toCoordButton").text("To Point");
            $("#toCoordButton").css("background-color", "#4CAF50");

            $("#nextButton").text("Next")
            $("#nextButton").css("background-color", "#4CAF50");
        }
	}

	function loadAreas() {
    	try {
            areas = JSON.parse(localStorage.areas);
        } catch (error) {
    		console.log(error);
		}
    }

    function saveArea() {
    	try {
            var input = JSON.parse($("#coords").val());
            console.log(input);

            if (input.name == undefined ||
				input.exept == undefined ||
				lx == undefined ||
				ly == undefined ||
				rx == undefined ||
				ry == undefined ||
				input.name == ""
			) throw "Some value incorrect";

            if (localStorage.areas !== undefined)
                areas = JSON.parse(localStorage.areas);
            else
                localStorage.areas = areas;

            areas[input.name] = {lx: lx, ly: ly, rx: rx, ry: ry, exept: input.exept, name: input.name};

            console.log(localStorage.areas);
            console.log(areas);
            localStorage.areas = JSON.stringify(areas);
        } catch (error) {
    		console.log(error);
		}
    }

	document.addEventListener('DOMContentLoaded', function() {
		canvas = document.getElementById('myCanvas');

        $("#setButton").click(function () {
			isNeedEdit = !isNeedEdit;
			isNeedEditApplyStyle();
        });

	   	$("#activateButton").click(function () {
	    	bot();
	    });

	    $("#toCoordButton").click(function () {
	    	if (isNeedEdit) {
	    		isEditCoordinates = true;
                isEditArea = false;
				isNeedEdit = false;
				isNeedEditApplyStyle();
			} else {
	    	    toPoint();
            }
	    });

        $("#nextButton").click(function () {
            if (isNeedEdit) {
                isEditCoordinates = false;
                isEditArea = true;
                isNeedEdit = false;

                if (selectedArea != undefined) {
                	lx = selectedArea.area.lx;
                    ly = selectedArea.area.ly;
                    rx = selectedArea.area.rx;
                    ry = selectedArea.area.ry;
				}

                isNeedEditApplyStyle();
            } else {
            	if (mapData.active) return;

                var values = Object.values(areas);
            	if (selectedArea !== undefined) {
            		var index = selectedArea.index + 1;
					if (values.length > 0) {
						if ((index <= values.length - 1)) {
                            selectedArea = {area: values[index], index: index};
                        } else {
							selectedArea = {area: values[0], index: 0};
						}
					}
				} else {
            		if (values.length > 0) {
            			selectedArea = {area: values[0], index: 0};
					}
				}
			}
        });

        $('#save_button').click( function () {
            if (isEditArea) {
                saveArea();
                return;
            }
        	if (selectedArea !== undefined) {
				newArea()
			}
        })

        $('#myCanvas').on('mousedown', function(e){
			var pos = getMousePos(canvas, e);
			if (isEditCoordinates) {
                px = pos.x | 0;
                py = pos.y | 0;

			} else if (isEditArea && touches == 0) {
				touches++;

                lx = pos.x | 0;
                ly = pos.y | 0;
                rx = undefined;
                ry = undefined;
			} else if (isEditArea && touches == 1) {
                touches = 0;

                rx = pos.x | 0;
                ry = pos.y | 0;
			}
        });

        loadAreas();
        setInterval(refresh, 1000);
	    communication();
	});