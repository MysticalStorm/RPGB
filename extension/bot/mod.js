Player.Mods = Player.Mods || {};
var Mods = Player.Mods;
Mods.version = "4.1.92";
Mods.versionDate = "29-03-2017";
Mods.modOptions = Mods.modOptions || {};
Mods.Load = {};
Mods.time = timestamp();
var disable_options = !0,
    Load = Mods.Load,
    modOptions = Mods.modOptions,
    switchWorldBugFix = function() {};
String.prototype.toHHMMSS = function(b) {
    var e = parseInt(this, 10);
    b = Math.floor(e / 3600);
    var f = Math.floor((e - 3600 * b) / 60),
        e = e - 3600 * b - 60 * f,
        g = "";
    0 !== b && (g = b + ":");
    if (0 !== f || "" !== g) f = 10 > f && "" !== g ? "0" + f : String(f), g += f + ":";
    return g = "" === g ? e + "s" : g + (10 > e ? "0" + e : String(e))
};

function getElem(b, e) {
    if ("string" !== typeof b) return null;
    var f = document.getElementById(b);
    if (null === f) return null;
    if ("undefined" === typeof e) return f;
    for (var g in e)
        if ("id" == g || "className" == g || "cssFloat" == g || "innerHTML" == g) f[g] = e[g];
        else if ("string" === typeof e[g] && f.setAttribute(g, e[g]), "function" === typeof e[g] && (f[g] = e[g]), "number" === typeof e[g] && (f[g] = "" + e[g]), "object" === typeof e[g])
        for (var k in e[g]) "style" == g && (f.style[k] = e[g][k]), "setAttributes" == g && f.setAttribute(k, "javascript: " + e[g][k]), "setFunctions" ==
            g && (f[k] = e[g][k]);
    return f
}

function createElem(b, e, f) {
    if ("undefined" === typeof b || "undefined" === e) return Mods.consoleLog("createElem error: no type or attachTo"), null;
    b = document.createElement(b);
    if ("undefined" != typeof f)
        for (var g in f)
            if ("id" == g || "className" == g || "cssFloat" == g || "innerHTML" == g) b[g] = f[g];
            else if ("string" === typeof f[g] && b.setAttribute(g, f[g]), "function" === typeof f[g] && (b[g] = f[g]), "number" === typeof f[g] && (b[g] = "" + f[g]), "object" === typeof f[g])
        for (var k in f[g]) "style" == g && (b.style[k] = f[g][k]), "setAttributes" == g &&
            b.setAttribute(k, "" + f[g][k]), "setFunctions" == g && (b[k] = f[g][k]);
    if ("string" === typeof e) getElem(e).appendChild(b);
    else if ("object" === typeof e) e.appendChild(b);
    else return b
}

function formatLargeNumber(b, e) {
    if (null === b) return null;
    if (0 === b) return "0";
    e = !e || 0 > e ? 0 : e;
    var f = b.toPrecision(2).split("e"),
        f = 1 === f.length ? 0 : Math.floor(Math.min(f[1].slice(1), 14) / 3),
        g = 1 > f ? b.toFixed(0 + e) : (b / Math.pow(10, 3 * f)).toFixed(1 + e);
    return (0 > g ? g : Math.abs(g)) + ["", "K", "M", "B", "T"][f]
}

function scaleSize(b, e, f, g) {
    var k = g / f;
    f >= b && 1 >= k ? (f = b, g = f * k) : g >= e && (g = e, f = g / k);
    return [f, g]
}

function roundToDecimals(b, e) {
    var f = Math.pow(10, e || 0);
    return Math.round(b * f) / f
}

function addEvent(b, e, f) {
    b.addEventListener ? (b.addEventListener(e, f, !1), EventCache.add(b, e, f)) : b.attachEvent ? (b["e" + e + f] = f, b[e + f] = function() {
        b["e" + e + f](window.event)
    }, b.attachEvent("on" + e, b[e + f]), EventCache.add(b, e, f)) : b["on" + e] = b["e" + e + f]
}

function firstChar(b) {
    return b.substring(0, 1)
}
var EventCache = function() {
    var b = [];
    return {
        listEvents: b,
        add: function(e, f, g) {
            b.push(arguments)
        },
        flush: function() {
            var e, f;
            for (e = b.length - 1; 0 <= e; --e) f = b[e], f[0].removeEventListener && f[0].removeEventListener(f[1], f[2], f[3]), "on" != f[1].substring(0, 2) && (f[1] = "on" + f[1]), f[0].detachEvent && f[0].detachEvent(f[1], f[2]), f[0][f[1]] = null
        }
    }
}();
Player.is_mod_dev = function(b) {
    return /^(dendrek|witwiz)$/.test(b)
};
Mods.TranslationHandler = function() {
    function b(b, e) {
        f && console.log("ERROR: Mods TranslationHandler: " + b, e || "");
        return !1
    }
    var e = this,
        f = !1,
        g = [],
        k = !1,
        m = {
            calendar: _tc,
            errors: _te,
            "interface": _ti,
            item_description: _tit,
            mods: _tm,
            names: _tn,
            achievements: _ta,
            quests: _tq
        },
        n = [];
    this.getInstance = function() {
        return e
    };
    this.registerItems = function(e) {
        var f = typeof e;
        if ("string" !== f && "array" !== f) return b("Attempted to register invalid data type:", e);
        e = "string" === f ? [e] : e || [];
        for (var g in e) lang.en.mods[e[g]] = "";
        return !0
    };
    this.translate = function(e, g) {
        if (0 === arguments.length) return b("No translation arguments supplied:", data);
        g = g || {};
        var k = "mods",
            n = g.data_tm || !1,
            x = !1;
        g.data_tm && delete g.data_tm;
        g.ns && m[g.ns] && (k = g.ns);
        var y = (0, m[k])(e, g);
        "mods" == k && 1 == y.length && "-" == y.charAt(0) && (x = !0);
        k = x ? "" : y;
        if (g.fn) switch (g.fn) {
            case "capitaliseFirstLetter":
                k = capitaliseFirstLetter(k);
                break;
            case "firstChar":
                k = firstChar(k);
                break;
            case "toUpperCase":
                k = k.toUpperCase()
        }
        var x = "",
            A;
        for (A in g) x += "data-" + A + '="' + g[A] + '" ';
        k = n ? '<span data-tm="' +
            e + '" ' + x.trim() + ">" + k + "</span>" : k;
        f && (k = "[" + Translate.lang + "] " + k);
        return k
    };
    this.translate_interface = function(f, g) {
        if (0 === arguments.length) return b("No translation arguments supplied:", data);
        g = g || {};
        g.data_tm = !0;
        return e.translate(f, g)
    };
    this.set_language = function(b) {
        k(b);
        for (var e in n) b = n[e], "function" === typeof b && b()
    };
    this.toggleDebug = function(b) {
        f = b || !f
    };
    this.onSetLanguage = function(b) {
        -1 == n.indexOf(b) && n.push(b)
    };
    this.toEnglish = function(b) {};
    (function() {
        for (var b in g) lang.en.mods[g[b]] = "";
        k =
            Translate.set_language;
        Translate.set_language = e.set_language;
        _tm = e.translate;
        _tmi = e.translate_interface
    })();
    return this
};
Mods.TemplateHandler = function() {
    function b(b) {
        return "undefined" != typeof CompiledTemplate[b] ? !0 : !1
    }
    var e = this,
        f = {};
    this.getInstance = function() {
        return e
    };
    this.register = function(e, k, m) {
        if (!b[e] || m) CompiledTemplate[e] = Handlebars.compile(k), f[e] = k
    };
    this.remove = function(e) {
        b[e] && (delete f[e], delete CompiledTemplate[e])
    };
    this.recompileTemplates = function() {
        for (var b in f) e.register(b, f[b], !0)
    };
    return this
};
Mods.initialize = function() {
    Mods.updatePatches();
    Mods.HandlebarsOverides = new Mods.TemplateHandler;
    Mods.Translations = new Mods.TranslationHandler;
    Mods.Translations.onSetLanguage(Mods.HandlebarsOverides.recompileTemplates);
    Player.is_mod_dev(players[0].name);
    Mods.modOptionsTypes = {
        text: {
            type: "text",
            createElement: "span",
            closeElement: "span",
            opt_span: "all",
            style: {
                "": ""
            }
        },
        checkbox: {
            createElement: "input type='checkbox'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        radio: {
            type: "radio",
            createElement: "input type='radio'",
            style: {
                width: ".8em",
                height: ".8em",
                margin: "0px",
                "margin-right": "6px"
            }
        },
        button: {
            type: "button",
            createElement: "button",
            closeElement: "button",
            className: "market_select pointer",
            opt_span: "all",
            style: {
                margin: "0px",
                "font-size": "1em"
            }
        },
        block_color: {
            createElement: "div",
            closeElement: "div",
            opt_span: "all",
            style: {
                border: "1px solid #666666",
                width: "100px",
                height: "20px"
            }
        }
    };
    Mods.modOptionsVersion = function() {
        var b = {
            fullscreen: {
                id: "fullscreen",
                name: "FullScreen Mode",
                shortname: "FullScreen Mode",
                description1: "Enable full-screen mode.",
                description2: "This mod allows to display the game on the whole screen. It is only suggested on PC (no mobile devices). WARNING: on slow devices, it may affect game performance. After loading the mod, enable full screen mode in the options menu.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            autocast: {
                id: "autocast",
                name: "Auto Cast",
                shortname: "Auto Cast",
                description1: "Enable auto-casting equipped magic.",
                description2: "This mod enables auto-casting magic (which becomes automatic when engaging in combat). It is disabled by default, to turn it on enable Autocast in game options.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmap: {
                id: "newmap",
                name: "Enhanced Map",
                shortname: "Enhanced Map",
                description1: "Enhances game map with several added details.",
                description2: "Map now shows current position and details, including travel signs, mobs, bosses, resource spots and POI. In dungeons, fellow players are shown in the full map. Mimimap shows bigger dots, yellow-colored for friends.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            newmarket: {
                id: "newmarket",
                name: "Enhanced Market",
                shortname: "Enhanced Market",
                description1: "Adds various helpers for market interface.",
                description2: "Allows resubmit or edit of market offers, display target player for transactions, highlights offers directed to the player and other market improvements. Adds Trade channel.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            kbind: {
                id: "kbind",
                name: "Keybinding Extensions",
                shortname: "Keybinding Extensions",
                description1: "Adds an iterface to manage custom keybindings for various actions.",
                description2: "From the game menu, a new 'keybindings' item allows access to mod customization.",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            },
            gearmd: {
                id: "gearmd",
                name: "Gear Screen Mod",
                shortname: "Gear Mod",
                description1: "Enable a gear menu, to show what you have equipped.",
                description2: "From your Inventory, click (Show Equipment) to access a gear screen, where you can easily see what you have equipped and what you're missing. This screen can be moved! And click 'Equipped' to switch it to 'Vanity Set.' Using the in-game wiki search under Items, then use (Try On) to equip items to your Vanity Set!",
                load: !1,
                loaded: !1,
                newmod: !1,
                updated: !1,
                time: 0
            }
        };
        b.petinv = {
            id: "petinv",
            name: "Pet Inventory",
            shortname: "Pet Inventory",
            description1: "Attaches the pet inventory to the main one.",
            description2: "You will see the Pet's inventory beneath your main inventory. You will also be able to transfer items between the two inventories very easily. By default, left-clicking items will send them from your inventory to your Pet's and shift+clicking will cause you to use/equip items. Additional features include: (unload) and (load) to unload/load all pet-inventory items quickly.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "shiftclick",
                    name: "Allow shift+click to send items to pet chest.",
                    description: "If toggled on, shift+click sends items from your inventory to the pet chest, while left-click uses/equips items. If toggled off, shift+click uses/equips items, while left-click sends items from your inventory to the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;shiftclick&apos;);"
                },
                1: {
                    id: "petexp",
                    name: "Hide the Pet's exp/evolution on the pet chest.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;petexp&apos;);"
                },
                2: {
                    id: "pettext",
                    name: "Hide text/information above pet inventory.",
                    description: "If toggled off, the 'Pet/'s chest title, as well as the greyed text and checkbox will be hidden.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Hide 'Pet/'s chest'.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;petinv&apos;,&apos;pettext&apos;,&apos;0&apos;);"
                        }
                    }
                }
            }
        };
        b.mosmob = {
            id: "mosmob",
            name: "Mouseover Stats",
            shortname: "Mouseover Stats",
            description1: "When you mouseover a mob, an item, or an object, you'll be able to see its stats.",
            description2: "The stats shown are 'A' for accuracy, 'S' for strength, 'D' for defence, and 'Hp' for health. Objects show a description or required levels. A game options allows to tweak panel appearance.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "appearance",
                    name: "Choose how the mob's stats appear.",
                    description: "When you mouseover a mob, you will see its stats: accuracy, strength, defense and health. You can decide here how those values are shown.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "(A0, S0, D0, H5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "(Acc0, Str0, Def0, Hp5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "(0 / 0 / 0 | 5)",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;appearance&apos;);"
                        }
                    }
                },
                1: {
                    id: "twolines",
                    name: "Show the mob's stats below the mob's name.",
                    description: "When toggled on, you'll see two lines of text: 1) level and name, 2) stats. When toggled off, the name and stats all appear on one line.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;twolines&apos;);"
                },
                2: {
                    id: "color",
                    name: "Set color of mob's stats based on difficulty.",
                    description: "When toggled on, the mob's stats will be compared to your own. If it's stronger, the stat will be red, if much weaker, the stat will be green. Stats within your combat range will be yellow.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;mosmob&apos;,&apos;color&apos;);"
                }
            }
        };
        b.health = {
            id: "health",
            name: "Updated Health Bar",
            shortname: "Health Bar",
            description1: "Will now display health values for you and your target.",
            description2: "You'll see current health values on your and your target's health bars that adjust as you take/deal damage or heal.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "capitalize",
                    name: "Capitalize your name.",
                    description: "The game's default is to show your name in lower case. Choose this option to have your name shown in proper case.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;capitalize&apos;);"
                },
                1: {
                    id: "appearance",
                    name: "Choose how the name/health/level appear.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "appearance",
                            name: "L1 White Rat (5)",
                            description: "The mob's level will be shown in front of its name, and its current health will be shown in parenthesis.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        1: {
                            id: "appearance",
                            name: "White Rat (5/5)",
                            description: "The mob's level is hidden. Its current and max health are shown in parenthesis as ([current]/[max]).",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        },
                        2: {
                            id: "appearance",
                            name: "White Rat (5/5 100%)",
                            description: "The mob's level is hidden. Its current, max and percent health are shown in parenthesis as ([current]/[max] [percent]%).",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;health&apos;,&apos;appearance&apos;);"
                        }
                    }
                }
            }
        };
        b.chestm = {
            id: "chestm",
            name: "Chest Interface",
            shortname: "Chest Interface",
            description1: "New options for sorting, withdrawing and depositing.",
            description2: "You have several options for how to sort items, including 'inventory first'; you can also use withdraw 'All' to fill your inventory quickly, or deposit 'All+' to deposit all unequipped items at once. (If you Ctrl+click an item in your inventory, All+ will also ignore that item; this is useful for items that you cannot equip.)",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "sortinv",
                    name: "When sorting the chest, sort inventory items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Inventory items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortinv_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortinv_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortinv&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                1: {
                    id: "sortfav",
                    name: "When sorting the chest, sort favorited items to the top.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;);",
                    options: {
                        0: {
                            id: "0",
                            name: "Choose highlight color.",
                            type: Mods.modOptionsTypes.text,
                            description: "Favorited items in your chest will have the border color you choose.",
                            options: {
                                0: {
                                    id: "chestm_sortfav_color",
                                    name: "No highlight color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "0",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                1: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "1",
                                    border: "#FFFFFF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                2: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "2",
                                    border: "#00FF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                3: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "3",
                                    border: "#FF00FF",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                },
                                4: {
                                    id: "chestm_sortfav_color",
                                    type: Mods.modOptionsTypes.radio,
                                    value: "4",
                                    border: "#FFFF00",
                                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;sortfav&apos;,&apos;color&apos;);"
                                }
                            }
                        }
                    }
                },
                2: {
                    id: "hidecheckbox",
                    name: "Hide additional sorting option checkboxes.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;hidecheckbox&apos;);"
                },
                3: {
                    id: "gearsort",
                    name: "Choose how gear is sub-sorted.",
                    description: "Gear is already sorted by chategory (armor vs weapon vs jewelry). But can be further sub-sorted based on one of the following parameters.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "gearsort",
                            name: "Sort by minimum level requirement.",
                            type: Mods.modOptionsTypes.radio,
                            value: "0",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        1: {
                            id: "gearsort",
                            name: "Sort by armor type.",
                            type: Mods.modOptionsTypes.radio,
                            value: "1",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        },
                        2: {
                            id: "gearsort",
                            name: "Sort by primary stat bonus.",
                            type: Mods.modOptionsTypes.radio,
                            value: "2",
                            onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;gearsort&apos;);"
                        }
                    }
                },
                4: {
                    id: "allplus",
                    name: "Hide the All+ deposit option.",
                    type: Mods.modOptionsTypes.checkbox,
                    onclick: "javascript: Mods.modOptions_options(&apos;chestm&apos;,&apos;allplus&apos;);"
                }
            }
        };
        b.rclick = {
            id: "rclick",
            name: "Right-Click Menu Extensions",
            shortname: "RightClick Menu Extensions",
            description1: "Right-clicking on mobs: 'Drops', 'Combat Analysis' and wiki access.",
            description2: "These are new menu options when you right click on mobs. Item Drops shows all items the mob is able to drop (and accurate drop rates); Combat Analysis shows the expected amount of damage that you and the mob will do. Right click on items/mobs allows wiki search. On a player, allows whispering. On inventory items allow to destroy all similar items and to search wiki. Additionally, this mod will show gathering success rates when used on mining nodes, trees, and fishing spots.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0,
            options: {
                0: {
                    id: "dropitem",
                    name: "Choose what the item 'Drops' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Show 'Wiki' drop rates.",
                            description: "The drop rates shown on the wiki are not accurate because they are not adjusted to the accurate in-game values. By default, this mod shows the adjusted drop rates. However, turning this option on will show the un-adjusted (aka 'wiki') rates.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;dropitem&apos;,&apos;0&apos;);"
                        }
                    }
                },
                1: {
                    id: "combat",
                    name: "Choose what the 'Combat Analysis' option shows.",
                    type: Mods.modOptionsTypes.text,
                    options: {
                        0: {
                            id: "0",
                            name: "Average damage",
                            description: "This shows the actual average damage (over a large number of fights) that can be expected with your current gear. It takes into account that damage can never be less than 0. For example, a mob that normally hits you for 0, will sometimes hit you for more than 0. So its average damage has to be greater than 0.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;0&apos;);"
                        },
                        1: {
                            id: "1",
                            name: "Chance to hit for zero",
                            description: "A 'miss' is a hit of zero (when you or the enemy take 0 damage). The higher this rate is, the more likely a miss will occur.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;1&apos;);"
                        },
                        2: {
                            id: "2",
                            name: "Max damage",
                            description: "Max damage is the highest possible melee hit that you or your enemy can do. You should avoid fighting a mob whose max hit is greater than your current health.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;2&apos;);"
                        },
                        3: {
                            id: "3",
                            name: "Ave. hits to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many hits it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;3&apos;);"
                        },
                        4: {
                            id: "4",
                            name: "Ave. time to kill",
                            description: "Assuming you and the enemy start at full health, this is approximately how many seconds it will normally take for one of you to kill the other.",
                            type: Mods.modOptionsTypes.checkbox,
                            onclick: "javascript: Mods.modOptions_options(&apos;rclick&apos;,&apos;combat&apos;,&apos;4&apos;);"
                        }
                    }
                }
            }
        };
        b.magicm = {
            id: "magicm",
            name: "Magic Damage Interface",
            shortname: "Magic Interface",
            description1: "Magic damage done now appears over the enemy.",
            description2: "When you cast spells, you will see the amount of damage they do appear over the enemy's head. Additionally, new keybinds are available for magic spells: 7 8 9 0 as well as the number pad 1 2 3 4.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.wikimd = {
            id: "wikimd",
            name: "In-Game Wiki",
            shortname: "In-Game Wiki",
            description1: "An in-game wiki will now be available in this menu.",
            description2: "You can use the wiki to browse the game's database for items/monsters/vendors to see information like stats, drops, vendor availability/prices, and craft recipes. There are plenty of options for searching the wiki (such as by name, by min-skill requirement, by type, etc) to make navigating it and finding what you're looking for easier. On crafting recipes, you can look at crafting formula or learn the formula for later use in the Forge Mod.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.miscmd = {
            id: "miscmd",
            name: "Miscellaneous Improvements",
            shortname: "Miscellaneous",
            description1: "Various improvements of the game's UI.",
            description2: "These are 'small' mods that didn't require individual load options. Included at the moment: 1) Indicators for items that will be saved upon death, 2) Toolbar at the top showing various useful information.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.chatmd = {
            id: "chatmd",
            name: "Chat Extensions",
            shortname: "Chat Extensions",
            description1: "Adds chat filters and commands.",
            description2: "A new chat filter (found in the Filters menu) has been added that blocks 'spam' messages, including: 'I think I'm missing something.' 'Cannot do that yet.' 'You are under attack!' 'You feel a bit better.' and 'It's a [object name]'; in addition, when you do /online, your friends will be yellow colored, and mods/admins as well with green/orange colors. Another option allows to enable links in chat. The mod also adds newbie tips, shown every 10 minutes (can be disabled from game options). Also, you can right-click a player's name in chat window to ignore, add/remove as friend. Also chat commands (ping, played, wiki...) are added.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        b.farming = {
            id: "farming",
            name: "Farming Improvements",
            shortname: "Farming Mod",
            description1: "Adds the ability to 'queue' farming actions.",
            description2: "Queued farming actions (seeding, harvesting and raking) will occur automatically once you are no longer busy with the previous action. You can queue one plot at a time, or the entire farm, if you like. Additional keybinds include: Ctrl (to queue actions) and Space (to toggle between Active and Paused). Also, the Island Deed now sends you on a path straight to the sign for a quick exist.",
            load: !1,
            loaded: !1,
            newmod: !1,
            updated: !1,
            time: 0
        };
        if (Mods.modOptions != b)
            for (var e in b) {
                null == Mods.modOptions[e] && (Mods.modOptions[e] = b[e], Mods.modOptions[e].newmod = !0);
                for (var f in b[e]) null == Mods.modOptions[e][f] && (Mods.modOptions[e][f] = b[e][f], Mods.modOptions[e].updated = !0), Mods.modOptions[e][f] != b[e][f] && "boolean" != typeof b[e][f] && (Mods.modOptions[e][f] = b[e][f], Mods.modOptions[e][f].updated = !0)
            }
    };
    Mods.modOptionsVersion();
    Mods.modOptionsLoad = function() {
        var b = {},
            e = {},
            f = {},
            g = {},
            k;
        for (k in Mods.modOptions) b[Mods.modOptions[k].id] =
            Mods.modOptions[k].load, f[Mods.modOptions[k].id] = Mods.modOptions[k].newmod;
        localStorage.modOptionsLoad = localStorage.modOptionsLoad || JSON.stringify(b);
        localStorage.modOptionsNewmod = localStorage.modOptionsNewmod || JSON.stringify(f);
        var e = JSON.parse(localStorage.modOptionsLoad),
            g = JSON.parse(localStorage.modOptionsNewmod),
            m;
        for (m in b) Mods.modOptions[m].load = "boolean" == typeof e[m] ? e[m] : b[m], Mods.modOptions[m].newmod = "boolean" == typeof g[m] ? g[m] : f[m]
    };
    Mods.modOptionsLoad();
    Mods.loadModsSelectAll = function(b) {
        for (var e in Mods.modOptions) getElem("checkbox_" +
            Mods.modOptions[e].id).checked = b
    };
    Mods.loadSelectedMods = function(b) {
        if ("undefined" != typeof b && void 0 !== Mods.modOptions[b]) {
            if (!Mods.modOptions[b].loaded) {
                Mods.failedLoad(b);
                Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0)
                }, 1500);
                Mods.loadMod(b);
                Mods.modOptions[b].loaded = !0;
                var e = capitaliseFirstLetter(b);
                Mods.loadedMods.push(e)
            }
            Mods.modOptions[b].newmod = !1;
            Mods.modOptions[b].updated = !1;
            for (e = getElem("row_" + b); e.firstChild;) e.removeChild(e.firstChild);
            createElem("td", e, {
                style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                innerHTML: Mods.modOptions[b].name + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[b].loaded ? "(" + _tmi("loaded") + ")" : "") + (Mods.modOptions[b].newmod ? " ** " + _tmi("new").toUpperCase() + " **" : Mods.modOptions[b].updated ? " ** " + _tmi("updated", {
                    fn: "capitaliseFirstLetter"
                }) + "**" : "") + "</span>",
                setAttributes: {
                    colSpan: "3"
                }
            });
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none";
            var f = JSON.parse(localStorage.modOptionsLoad),
                g = JSON.parse(localStorage.modOptionsNewmod);
            f[b] = !0;
            g[b] = !1
        } else {
            var f = {},
                g = {},
                k;
            for (k in Mods.modOptions) {
                !getElem("checkbox_" + Mods.modOptions[k].id).checked || Mods.isLoaded(capitaliseFirstLetter(k)) || Mods.modOptions[k].requires && !Mods.isLoaded(Mods.modOptions[k].requires) || (Mods.failedLoad(k), Timers.set("failed_load_mods", function() {
                    Mods.failedLoad(!0)
                }, 1500), Mods.loadMod(Mods.modOptions[k].id), Mods.modOptions[k].loaded = !0, e = capitaliseFirstLetter(k), Mods.loadedMods.push(e));
                f[Mods.modOptions[k].id] = getElem("checkbox_" + Mods.modOptions[k].id).checked;
                Mods.modOptions[k].newmod = !1;
                g[Mods.modOptions[k].id] = !1;
                Mods.modOptions[k].updated = !1;
                for (e = getElem("row_" + Mods.modOptions[k].id); e.firstChild;) e.removeChild(e.firstChild);
                createElem("td", e, {
                    style: "padding-top: 8px; padding-bottom: 0px; font-weight: bold;",
                    innerHTML: _tmi(Mods.modOptions[k].name) + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[k].loaded ? " (" + _tmi("loaded") + ")" : "") + (Mods.modOptions[k].newmod ? " ** (" + _tmi("new").toUpperCase() + ") **" : Mods.modOptions[k].updated ? " ** " +
                        _tmi("updated", {
                            fn: "capitaliseFirstLetter"
                        }) + " **" : "") + "</span>",
                    setAttributes: {
                        colSpan: "3"
                    }
                })
            }
            getElem("mods_menu_newmods").style.display = "none";
            getElem("mods_menu_updated").style.display = "none"
        }
        localStorage.modOptionsLoad = JSON.stringify(f);
        localStorage.modOptionsNewmod = JSON.stringify(g)
    };
    Mods.loadMod = function(b) {
        Mods.modOptions[b].loaded || (Load[b](), Mods.modOptions[b].loaded = !0, Mods.modOptionsOptionsDisplay(b))
    };
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block"
    };
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none"
    };
    Mods.modOptionsOptionsDisplay = function(b) {
        for (var e in Mods.modOptions) getElem("mod_options_options_" +
            Mods.modOptions[e].id).style.display = "none";
        getElem("mod_options_options_" + b).style.display = "block";
        Mods.modOptions[b].loaded ? (getElem("mod_options_options_" + b + "_loaded").style.display = "block", getElem("mod_options_options_" + b + "_notloaded").style.display = "none") : (getElem("mod_options_options_" + b + "_loaded").style.display = "none", getElem("mod_options_options_" + b + "_notloaded").style.display = "block")
    };
    Mods.loadNewMods = function() {
        var b = getElem("checkbox_enable_newmods").checked;
        if (b)
            for (var e in Mods.modOptions) Mods.modOptions[e].newmod &&
                (getElem("checkbox_" + Mods.modOptions[e].id).checked = !0);
        localStorage.loadNewMods = JSON.stringify(b)
    };
    Mods.loadModOptions = function() {
        var b = 100,
            e = 75; - 1 != ["android", "1"].indexOf(getParameterByName("inapp")) && (e = b = 0);
        createElem("div", wrapper, {
            id: "mods_form",
            className: "menu scrolling_allowed",
            onmousedown: function(b) {
                b = b || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - b.clientX,
                    dy: (parseInt(this.style.top) || 0) - b.clientY
                };
                this.canMove = !0
            },
            onmousemove: function(b) {
                b = b || window.event;
                this.canMove &&
                    "mods_wiki_name" != b.target.id && "mods_wiki_level_low" != b.target.id && "mods_wiki_level_high" != b.target.id && (this.style.left = Math.min(window.innerWidth - 200, Math.max(-200, b.clientX + this.coordinates.dx)) + "px", this.style.top = Math.min(window.innerHeight - 170, Math.max(-170, b.clientY + this.coordinates.dy)) + "px")
            },
            onmouseup: function(b) {
                this.canMove = !1
            },
            style: "z-index: 99999; position: absolute; left: " + b + "px; top: " + e + "px; width: 400px; overflowY: auto;",
            innerHTML: "<span id='mods_form_top' class='common_border_bottom' style='margin-bottom:4px;'><span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>" +
                _tmi("Mods Info") + "</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left:42px;'>" + _tmi("Load mods") + "</span><span id = 'mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>" + _tmi("Close", {
                    ns: "interface"
                }) + "</span></span>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_mods_options",
            className: "common_border_bottom",
            style: "width: 100%; min-height: 24px; margin-bottom: 5px; font-size: .8em; display: block",
            innerHTML: "<button id='mods_menu_load_all' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(true);' style='float:left; margin:0px; margin-left:5px;'>" + _tmi("Select All") + "</button><button id='mods_menu_load_none' class='market_select pointer' onclick='javascript:Mods.loadModsSelectAll(false);' style='float:left; margin:0px; margin-left:6px;'>" + _tmi("Select None") + "</button><button id ='mods_menu_load_selected' class='market_select pointer' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:Mods.loadSelectedMods();'>" +
                _tmi("Load Selected") + "</button>"
        });
        createElem("div", "mods_form", {
            id: "mod_load_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span style='color:yellow; font-size:.8em; font-weight:bold; padding-left:4px;'>" + _tmi("Mod Pack version {version}", {
                    version: Mods.version
                }) + " " + _tmi("created by {created} - Maintained by {maintained}", {
                    created: "Dendrek &amp; WitWiz",
                    maintained: "-"
                }) + "</span><table id='mod_options_table' cellspacing='0' style='font-size: 0.8em; width:100%; margin-top:5px;'><tr id='mods_menu_newmods' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** " +
                _tmi("New Mods Available!") + " **<span style='color:#FFFFFF; float:right; font-weight:normal; margin-top:2px;'>" + _tmi("Always enable new mods") + "</span><input type='checkbox' id='checkbox_enable_newmods' style='width:.8em; height:.8em; float:right;' onclick='javascript:Mods.loadNewMods();'></td></tr><tr id='mods_menu_updated' style='color:#00FF00; font-weight:bold; display:none;'><td colspan='3'>** " + _tmi("Mods Updated!") + " ** &nbsp;&nbsp;&nbsp;<span style='font-weight:normal; color:#FFFFFF; float:right;'>(" +
                _tmi("reload your browser to enable the updates") + ")</span></td></tr></table>"
        });
        createElem("div", "mods_form", {
            id: "mod_options_options",
            className: "common_border_right",
            style: "width: 26%; height: 0px; padding-bottom: 4px; font-size: .8em; float: left; display: none; border-top: 1px solid #666666; border-right: 1px solid #666666; border-bottom: 1px solid #666666; overflow-x: hidden;"
        });
        createElem("div", "mods_form", {
            id: "mod_options_mods_options",
            className: "scrolling_allowed",
            style: "width: 72.4%; min-height: 100%; margin-left: 1%; display: none; float: left; border-top: 1px solid #666666; border-left: 1px solid #666666; border-bottom: 1px solid #666666"
        });
        createElem("span", "mod_options_options", {
            id: "mod_options_name_title",
            style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; margin-bottom: 14px; width: 98px; padding-top: 10px; padding-left: 6px; font-weight: bold; color: yellow",
            innerHTML: _tmi("Mod Options")
        });
        var b = !0,
            e = "",
            f;
        for (f in Mods.modOptions) {
            Mods.modOptions[f].newmod && (getElem("mods_menu_newmods").style.display = "");
            Mods.modOptions[f].updated && !Mods.modOptions[f].newmod && (getElem("mods_menu_updated").style.display =
                "");
            e = (b = !1, "");
            createElem("tr", "mod_options_table", {
                id: "row_" + Mods.modOptions[f].id,
                style: "font-size: 1em; color: #FF0; background-color: " + e
            });
            createElem("td", "row_" + Mods.modOptions[f].id, {
                colSpan: "3",
                style: "font-weight: bold; padding: 6px 6px 0px 6px; border-top: 1px solid #666;",
                innerHTML: _tmi(Mods.modOptions[f].name) + "<span style='color:#FFFFFF; font-weight:normal;'>" + (Mods.modOptions[f].loaded ? " (" + _tmi("loaded") + ")" : "") + (Mods.modOptions[f].newmod ? " ** " + _tmi("New") + " **" : Mods.modOptions[f].updated ?
                    " ** " + _tmi("Updated") + " **" : "") + "</span>"
            });
            var g = "getElem(&apos;r2_td1_" + Mods.modOptions[f].id + "&apos;).style.paddingBottom",
                k = "getElem(&apos;r2_td2_" + Mods.modOptions[f].id + "&apos;).style.paddingBottom",
                m = "getElem(&apos;row3_" + Mods.modOptions[f].id + "&apos;).style.display";
            createElem("tr", "mod_options_table", {
                id: "row2_" + Mods.modOptions[f].id,
                style: "font-size: 1em; color: #FFF; font-weight: normal; background-color: " + e
            });
            createElem("td", "row2_" + Mods.modOptions[f].id, {
                id: "r2_td1_" + Mods.modOptions[f].id,
                style: "width: 15px; padding: 0px 0px 6px 6px;",
                innerHTML: "<input id='checkbox_" + Mods.modOptions[f].id + "' type='checkbox' style='width:.8em; height:.8em; margin-right:6px;'>"
            });
            createElem("td", "row2_" + Mods.modOptions[f].id, {
                id: "r2_td2_" + Mods.modOptions[f].id,
                colSpan: "2",
                style: "padding: 0px 0px 6px 6px;",
                innerHTML: _tmi(Mods.modOptions[f].description1) + "<span class='common_link' onclick='javascript: ( " + m + " == &apos;none&apos; ) ? ( " + m + " = &apos;&apos;, " + g + " = " + k + " = &apos;0px&apos; ) : ( " + m + " = &apos;none&apos;, " +
                    g + " = " + k + " = &apos;6px&apos; );' style='float:right; margin:0px;'>(" + _tmi("more info") + ")</span>"
            });
            createElem("tr", "mod_options_table", {
                id: "row3_" + Mods.modOptions[f].id,
                style: "color: #FFF; background-color: " + e + "; display: none;"
            });
            createElem("td", "row3_" + Mods.modOptions[f].id);
            createElem("td", "row3_" + Mods.modOptions[f].id, {
                colSpan: "2",
                style: "padding: 0px 0px 6px 0px;",
                innerHTML: _tmi(Mods.modOptions[f].description2)
            });
            createElem("span", "mod_options_options", {
                id: "mod_options_name_" + Mods.modOptions[f].id,
                className: "common_link",
                style: "size: .8em; display: inline-block; float: left; clear: left; margin: 0px; padding: 8px 0px 10px 6px; width: 90%; border-top: 1px solid #666;",
                innerHTML: Mods.modOptions[f].shortname,
                onclick: function() {
                    Mods.modOptionsOptionsDisplay(Mods.modOptions[f].id)
                }
            });
            createElem("div", "mod_options_mods_options", {
                id: "mod_options_options_" + Mods.modOptions[f].id,
                style: "padding-top: 10px; padding-left: 5%; width: 95%; height: 95%; font-size: .8em; display: none;",
                innerHTML: "<span style='color:yellow; font-weight:bold; float:left;'>" +
                    _tmi(Mods.modOptions[f].name) + " " + _tmi("Options", {
                        ns: "interface"
                    }) + "</span><span id='mod_options_options_" + Mods.modOptions[f].id + "_notloaded' style='margin-top:41px; width:100%; float:left; clear:left;'><span style='float:left; margin-bottom:4px; text-align:center; width:91%; '>" + _tmi("The {modname} mod is not loaded", {
                        modname: _tmi(Mods.modOptions[f].name, {
                            fn: "toLowerCase"
                        })
                    }) + "...</span><button id='mod_options_options_load_" + Mods.modOptions[f].id + "' class='market_select pointer' type='button' style='font-size:1.25em; margin:0px; width:80px; left:45%; margin-left:-40px; float:left; clear:left; display:block; position:relative;' onclick='javascript:Mods.loadSelectedMods(&apos;" +
                    f + "&apos;);'>" + _tmi("Load Mod") + "</button></span><span id='mod_options_options_" + Mods.modOptions[f].id + "_loaded' style='margin-top:6px; margin-bottom:6px; width:100%; float:left; clear:left; display:none;'><table id='mod_options_options_" + Mods.modOptions[f].id + "_table' style='font-size: 0.8em; width:100%;'><tr><td style='width:17px;'></td><td style='width:17px;'></td><td style='width:17px;'></td><td></td></table></span>"
            });
            b = !b;
            getElem("checkbox_enable_newmods").checked && Mods.modOptions[f].newmod &&
                (Mods.modOptions[f].load = !0);
            getElem("checkbox_" + Mods.modOptions[f].id).checked = Mods.modOptions[f].load
        }
        b = !1;
        for (f in Mods.modOptions) b && (getElem("mod_options_options_" + Mods.modOptions[f].id).style.display = "none"), "block" == getElem("mod_options_options_" + Mods.modOptions[f].id).style.display && (b = !0);
        Mods.modOptions.wikimd.loaded && (getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>" + _tmi("Mods Info") + "</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>" +
            _tmi("Load mods") + "</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>" + _tmi("wiki", {
                fn: "capitaliseFirstLetter"
            }) + "</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>" + _tmi("Close", {
                ns: "interface"
            }) + "</span>", getElem("mods_form").style.width = "464px", getElem("mods_form").style.marginLeft =
            "-225px", Mods.Wikimd.loadDivs(), Mods.loadModMenu_options = function() {
                getElem("mod_load_options").style.display = "none";
                getElem("mod_load_mods_options").style.display = "none";
                getElem("mod_options_options").style.display = "block";
                getElem("mod_options_mods_options").style.display = "block";
                getElem("mod_wiki_options").style.display = "none";
                getElem("mod_wiki_mods_options").style.display = "none"
            }, Mods.loadModMenu_load = function() {
                getElem("mod_load_options").style.display = "block";
                getElem("mod_load_mods_options").style.display =
                    "block";
                getElem("mod_options_options").style.display = "none";
                getElem("mod_options_mods_options").style.display = "none";
                getElem("mod_wiki_options").style.display = "none";
                getElem("mod_wiki_mods_options").style.display = "none"
            }, Mods.loadModMenu_wiki = function() {
                getElem("mod_load_options").style.display = "none";
                getElem("mod_load_mods_options").style.display = "none";
                getElem("mod_options_options").style.display = "none";
                getElem("mod_options_mods_options").style.display = "none";
                getElem("mod_wiki_options").style.display =
                    "block";
                getElem("mod_wiki_mods_options").style.display = "block"
            })
    };
    Mods.initializeOptionsMenu = function() {
        var b = "",
            e = Mods.modOptions,
            f = "",
            g = 0,
            k;
        for (k in e)
            if (void 0 !== e[k].options) {
                var m = e[k].options,
                    n;
                for (n in m)
                    if (void 0 !== m[n].id && (b = k + "_" + m[n].id, f = m[n], g = 0, Mods.populateOptionsMenu(b, f, g, e[k].id), void 0 !== m[n].options)) {
                        var p = m[n].options,
                            q;
                        for (q in p)
                            if (void 0 !== p[q].id && (b = k + "_" + n + "_" + p[q].id, f = p[q], g = 1, Mods.populateOptionsMenu(b, f, g, e[k].id), void 0 !== p[q].options)) {
                                var t = p[q].options,
                                    r;
                                for (r in t) void 0 !==
                                    t[r].id && (b = k + "_" + n + "_" + q + "_" + t[r].id, f = t[r], g = 2, Mods.populateOptionsMenu(b, f, g, e[k].id))
                            }
                    }
            } else b = k + "_0options", f = null, g = 0, Mods.populateOptionsMenu(b, f, g, e[k].id)
    };
    Mods.populateOptionsMenu = function(b, e, f, g) {
        if (null !== e) {
            var k = e.type,
                m = "mod_options_options_row_" + b,
                n = "id='mod_options_options_" + b + "' ",
                p = "<" + k.createElement + (void 0 !== e.value ? " value='" + e.value + "' " : " "),
                q = void 0 !== k["class"] ? "class='" + k["class"] + "' " : "",
                t = "style='' ",
                r = void 0 !== e.onclick ? "onclick='" + e.onclick + "'>" : "'>",
                x = void 0 !== k.closeElement ?
                "</" + k.closeElement + "></td>" : "</td>",
                y = "",
                A = "",
                u = "";
            b = "mod_options_options_row2_" + b + (void 0 !== e.value ? "_" + e.value : "");
            var B = "",
                C = 0,
                v = 0,
                D;
            for (D in k.style) t = t.slice(0, -2) + D + ":" + k.style[D] + ";' ";
            "all" == k.opt_span ? C = 4 - f : (C = 1, v = 4 - (f + C));
            void 0 !== e.description && (u = "<span class='common_link' onclick='javascript:getElem(&apos;" + b + "&apos;).style.display = getElem(&apos;" + b + "&apos;).style.display == &apos;none&apos;? &apos;&apos;:&apos;none&apos;' style='float:right; margin:0px;'>(more info)</span></td>",
                B = "<td colspan='" + f + "'></td><td colspan='" + (4 - f) + "'><span>" + e.description + "</span></td>");
            "text" == k.type ? y = e.name + u : "button" == k.type ? (y = e.name, A = u + "</td>", x = void 0 !== k.closeElement ? "</" + k.closeElement + ">" : "") : A = void 0 !== e.border ? "<div style='height:10px; width:40px; margin-top:1px; border:1px solid " + e.border + ";'></div>" : void 0 !== e.background ? "<div style='height:11px; width:40px; margin-top:1px; background:" + e.border + ";'></div>" : "<td colspan='" + v + "'><span>" + e.name + "</span>" + u;
            f = 0 < f ? "<td colspan='" +
                f + "'><td colspan='" + C + "'>" : "<td colspan='" + C + "'>"
        } else m = "mod_options_options_row_" + b, n = "mod_options_options_" + b, p = "<span ", q = "", t = "style='' ", r = ">", x = "</span></td>", y = "This mod does not have any options that can be changed.", A = "", b = "mod_options_options_row2_" + b, B = "", f = "<td colspan='4'>";
        e = document.createElement("tr");
        e.id = m;
        e.innerHTML = f + p + n + q + t + r + y + x + A;
        e.style.marginTop = "12px";
        getElem("mod_options_options_" + g + "_table").appendChild(e);
        f = document.createElement("tr");
        f.id = b;
        f.innerHTML = B;
        f.style.display =
            "none";
        getElem("mod_options_options_" + g + "_table").appendChild(f);
        f = document.createElement("tr");
        f.innerHTML = "&nbsp;";
        f.style.fontSize = ".3em";
        getElem("mod_options_options_" + g + "_table").appendChild(f)
    };
    Mods.loadOptionsMenu = function(b) {
        var e = !0;
        void 0 !== Mods.modOptions[b] && (e = !1);
        for (var f in Mods.modOptions) {
            var g = Mods.modOptions[f];
            if ((!e && f == b || e) && void 0 !== g.options && g.loaded) {
                var g = g.options,
                    k = JSON.parse(localStorage[f + "_options"]),
                    m;
                for (m in g)
                    if ("radio" == g[m].type.type ? (getElem("mod_options_options_" +
                            f + "_" + g[m].id).value = k[f][g[m].id] || 0, Mods.modOptions_options(f, g[m].id)) : "checkbox" == g[m].type.type && (getElem("mod_options_options_" + f + "_" + g[m].id).checked = k[f][g[m].id] || !1, Mods.modOptions_options(f, g[m].id)), void 0 !== g.options) {
                        var n = g.options,
                            p;
                        for (p in n) "radio" == n[p].type.type ? (getElem("mod_options_options_" + f + "_" + m + "_" + n[p].id).value = k[f][m][n[p].id] || 0, Mods.modOptions_options(f, g[m].id, n[p].id)) : "checkbox" == n[p].type.type && (getElem("mod_options_options_" + f + "_" + m + "_" + n[p].id).checked = k[f][m][n[p].id] ||
                            !1, Mods.modOptions_options(f, g[m].id, n[p].id))
                    }
            }
        }
    };
    Mods.modOptions_options = function(b, e, f) {};
    Load.variables();
    Load.functions();
    Mods.worldChangeUpdate()
};
Mods.isLoaded = function(b) {
    return -1 != Mods.loadedMods.indexOf(b) && "undefined" == typeof Mods.failedToLoad[b.toLowerCase()] ? !0 : !1
};
Mods.updatePatches = function() {
    void 0 == localStorage.MOD_SETTINGS_VERSION && (localStorage.RECIPE_U_LIST && localStorage.removeItem("RECIPE_U_LIST"), localStorage.MOD_SETTINGS_VERSION = Mods.version)
};
Mods.enchantType = function(b) {
    var e = !1;
    b = item_base[b] || !1;
    if (!b || "undefined" == typeof b.params.enchant_id) return !1;
    if (1 == b.params.slot) e = "cape";
    else if (b.params.min_accuracy || b.params.min_archery && -1 != [4, 3].indexOf(b.params.slot)) e = "weapon";
    else if (b.params.min_defense || b.params.min_magic || b.params.min_archery) e = "armor";
    else if (b.params.min_health || b.params.min_jewelry) e = "jewelry";
    return e
};
Load.functions = function() {
    Mods.consoleLog = function(b) {
        iOS || Android || console.log(b)
    };
    Mods.failedLoad = function(b) {
        if (!0 === b) {
            b = !0;
            var e = "",
                f;
            for (f in Mods.failedToLoad) modOptions[f] && (b = !1, e += modOptions[f].name + ", ");
            e = b ? _tm("Mods loaded and ready: {RPG MO} Mods Pack version {version}", {
                "RPG MO": "RPG MO",
                version: Mods.version
            }) : _tm("Mod failed to load: {mod}", {
                mod: e.slice(0, -2)
            }) + ". " + _tm("Please inform the mod developers {names}. Try reloading the game and do not load this mod until this issue can be fixed.", {
                names: "(Dendrek or WitWiz)"
            });
            quiet_mod_load || addChatText(e, void 0, COLOR.TEAL)
        } else Mods.failedToLoad[b] = 1
    };
    Mods.timestamp = function(b) {
        delete Mods.failedToLoad[b];
        Mods.consoleLog(b + " loaded (" + Math.round((timestamp() - modOptions[b].time) / 10) / 100 + "s)")
    };
    Mods.findWithAttr = function(b, e, f) {
        for (var g in b)
            if (b[g][e] == f) return g
    };
    ChatSystem.toggle = function() {
        var b;
        Mods.isLoaded("Wikimd") && (b = Mods.Wikimd.chatSystemToggle());
        b || captcha || Mods.chatSystemToggle()
    };
    Chat.set_hidden = function() {
        if (-1 != loadedMods.indexOf("Chatmd") &&
            !1 === Mods.Chatmd.set_hidden() || !1 === Mods.set_hidden()) return !1; - 1 != loadedMods.indexOf("Tabs") && (getElem("tabs").style.visibility = "hidden", getElem("chat_resize").style.visibility = "hidden")
    };
    Mods.cleanText = function(b, e, f) {
        e ? b = b.replace(/['"]/g, "*") : f ? b.replace(/'/g, "\\'").replace(/"/g, '\\"') : b = b.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        return b
    };
    Mods.timeConvert = function(b, e, f) {
        var g, k, m;
        k = {
            year: 31536E3,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        b = (0 < b ? b : 0) - (0 < e ? e : 0);
        m = "";
        b = 1E3 === f || .001 === f ? b / 1E3 :
            60 === f || 3600 === f ? b * f : b;
        for (g in k) 1 <= b / k[g] && (e = Math.floor(b / k[g]), b -= e * k[g], m += e + " " + g + sOrNoS(e) + ", ");
        return m = m.slice(0, -2)
    };
    Mods.UpdateBase = Mods.UpdateBase || updateBase;
    updateBase = function() {
        Mods.UpdateBase()
    };
    Mods.refreshHUD = Mods.refreshHUD || refreshHUD;
    refreshHUD = function() {
        Mods.refreshHUD();
        for (var b in loadedMods) {
            var e = loadedMods[b];
            "undefined" != typeof Mods[e] && "undefined" != typeof Mods[e].refreshHUD && Mods[e].refreshHUD()
        }
    };
    Mods.CustomMenu = Mods.CustomMenu || ActionMenu.custom_create;
    ActionMenu.custom_create =
        function(b, e) {
            Mods.CustomMenu(b, e);
            var f = getElem("action_menu");
            f.offsetTop + f.offsetHeight > window.innerHeight && (f.style.top = window.innerHeight - f.offsetHeight + "px")
        };
    inventoryClick = function(b) {
        Mods.oldInventoryClick(b);
        Mods.isLoaded("Gearmd") && Mods.Gearmd.inventoryClick(b);
        Mods.isLoaded("Miscmd") && Mods.Miscmd.inventoryClick()
    };
    setCanvasSize = function(b) {
        Mods.oldCanvasSize(b);
        Mods.setCanvasSize()
    };
    Mods.setCanvasSize = function() {
        for (var b = 0; 3 > b; b++) Mods.fontSize[b] = Math.min(1, Math.round((1 + .4 * (b - 1)) * current_ratio_y *
            10) / 10) + "em";
        for (var e in loadedMods) b = loadedMods[e], "undefined" != typeof Mods[b] && "undefined" != typeof Mods[b].setCanvasSize && Mods[b].setCanvasSize();
        getElem("object_selector_info", {
            style: {
                left: Math.ceil(320 * current_ratio_x) + "px",
                width: "20%",
                height: "auto",
                textAlign: "center"
            }
        });
        getElem("market_offer_popup") && hasClass(getElem("market"), "hidden") && Mods.Newmarket.hidedetails();
        Mods.isLoaded("Tabs") && Mods.Tabs.resize()
    };
    Music.play = function(b, e) {
        for (var f in loadedMods) {
            var g = loadedMods[f];
            if ("undefined" !=
                typeof Mods[g] && "undefined" != typeof Mods[g].onMapChange) Mods[g].onMapChange(players[0].map)
        }
        Mods.oldMusic.play(b, e)
    };
    Inventory.equip = function(b, e, f) {
        if (!Mods.inventoryEquip(b, e, f)) return Mods.oldInventoryEquip(b, e, f)
    };
    Mods.inventoryEquip = function(b, e, f) {
        var g = !1,
            k;
        for (k in loadedMods) {
            var m = loadedMods[k];
            "undefined" != typeof Mods[m] && "undefined" != typeof Mods[m].inventoryEquip && (g = !0 === Mods[m].inventoryEquip(b, e, f) || !0 === g ? !0 : !1)
        }
        return g
    };
    document.addEventListener("keyup", function(b) {
        Mods.eventListener("keyup",
            b.keyCode, keyMap.action(b))
    });
    document.addEventListener("keydown", function(b) {
        Mods.eventListener("keydown", b.keyCode, keyMap.action(b))
    });
    Mods.currentSocket = function(b) {
        "object" === typeof b && b.action && Mods.socketOn(b.action, b.data, b)
    };
    Mods.socketOn = function(b, e, f) {
        for (var g in loadedMods) void 0 !== Mods[loadedMods[g]].socketOn && -1 !== Mods[loadedMods[g]].socketOn.actions.indexOf(b) && Mods[loadedMods[g]].socketOn.fn(b, e, f)
    };
    socket.on("message", Mods.currentSocket);
    Mods.worldChangeUpdate = function() {
        Mods.currentWorldID =
            0;
        for (var b in ServerList.downloaded)
            if (ServerList.downloaded[b].url == ServerList.last_connected) {
                Mods.currentWorldID = ServerList.downloaded[b].world;
                break
            }
        if (0 < Mods.currentWorldID)
            for (var e in loadedMods)
                if (b = loadedMods[e], "undefined" != typeof Mods[b] && "undefined" != typeof Mods[b].onWorldChange) Mods[b].onWorldChange()
    };
    switchWorldBugFix = function() {
        socket.removeListener("message", Mods.currentSocket);
        socket.on("message", Mods.currentSocket);
        Mods.worldChangeUpdate()
    };
    Mods.eventListener = function(b, e, f) {
        for (var g in loadedMods) void 0 ===
            Mods[loadedMods[g]].eventListener || !Mods[loadedMods[g]].eventListener.keys[b] || !0 !== Mods[loadedMods[g]].eventListener.keys[b][0] && -1 === Mods[loadedMods[g]].eventListener.keys[b].indexOf(e) && -1 == Mods[loadedMods[g]].eventListener.keys[b].indexOf(f) || Mods[loadedMods[g]].eventListener.fn(b, e, f)
    }
};
Load.variables = function() {
    Mods.loadedMods = Mods.loadedMods || [];
    loadedMods = Mods.loadedMods;
    localStorage.enableNewMods = localStorage.enableNewMods || "false";
    Mods.disableInvClick = !1;
    KEY_ACTION.CTRL = 145;
    keyMap.keys[1][17] = KEY_ACTION.CTRL;
    keyMap.keys[1][91] = KEY_ACTION.CTRL;
    Mods.oldCanvasSize = Mods.oldCanvasSize || setCanvasSize;
    Mods.oldInventoryEquip = Mods.oldInventoryEquip || Inventory.equip;
    Mods.failedToLoad = Mods.failedToLoad || {};
    Mods.set_hidden = Mods.set_hidden || Chat.set_hidden;
    Mods.fontSize = Mods.fontSize || {
        0: .7,
        1: 1,
        2: 1.3
    };
    Mods.marketReplace = {
        " Of": ":",
        "'": "`",
        Necklace: "Neck.",
        Medallion: "Medal.",
        "Platinum ": "Plat. ",
        "Pet ": "",
        " Scroll": "",
        "Enchanted ": "Ench. ",
        Platemail: "Plate.",
        Helmet: "Helm.",
        "Superior ": "Sup. ",
        " Permission": "",
        Defense: "Def.",
        Accuracy: "Acc.",
        Strength: "Str.",
        Farming: "Farm.",
        Woodcutting: "WC.",
        Jewelry: "Jewel.",
        Cooking: "Cook.",
        Carpentry: "Carp.",
        Alchemy: "Alch.",
        "Fishing ": "Fish. ",
        " Fishing": " Fish.",
        "Medium ": "Med. ",
        Teleport: "Tele."
    };
    Mods.oldInventoryClick = inventoryClick;
    Mods.chatSystemToggle =
        Mods.chatSystemToggle || ChatSystem.toggle;
    getElem("inventory").style.zIndex = "199";
    Mods.oldMusic = Mods.oldMusic || {};
    Mods.oldMusic.play = Mods.oldMusic.play || Music.play;
    Mods.currentWorldID = Mods.currentWorldID || 0;
    Mods.Health = Mods.Health || {};
    Mods.Health.old_inAFight = Mods.Health.old_inAFight || BigMenu.in_a_fight;
    Mods.Rclick = Mods.Rclick || {};
    Mods.Rclick.oldActionMenu = Mods.Rclick.oldActionMenu || ActionMenu.create;
    Mods.Rclick.oldInvMenu = Mods.Rclick.oldInvMenu || InvMenu.create;
    localStorage.infopanelmode = localStorage.infopanelmode ||
        0;
    Mods.Mosmob = Mods.Mosmob || {};
    Mods.regular_onmousemove = Mods.regular_onmousemove || regular_onmousemove;
    Mods.Tabs = Mods.Tabs || {};
    Mods.Newmarket = Mods.Newmarket || {};
    Mods.Newmarket.submitHolder = Mods.Newmarket.submitHolder || {};
    Mods.Newmarket.submitSorted = Mods.Newmarket.submitSorted || [];
    Mods.Newmarket.submitQueued = Mods.Newmarket.submitQueued || !1;
    Mods.Newmap = Mods.Newmap || {};
    Mods.Kbind = Mods.Kbind || {};
    Mods.Tabs.oldremove_channel = Mods.Tabs.oldremove_channel || Contacts.remove_channel;
    Mods.Tabs.oldadd_channel = Mods.Tabs.oldadd_channel ||
        Contacts.add_channel;
    Mods.Tabs.oldchannel_subscriptions = Mods.Tabs.oldchannel_subscriptions || Client.channel_subscriptions;
    Mods.Tabs.wwMaxTabs = 8;
    Mods.Tabs.wwCurrentTabs = Mods.Tabs.wwCurrentTabs || [];
    Mods.Tabs.wwTabContent = Mods.Tabs.wwTabContent || [];
    Mods.Tabs.chat_size_percent = .3;
    Mods.Tabs.chat_resize_timestamp = timestamp();
    localStorage.chestInv_color = localStorage.chestInv_color || JSON.stringify("#C000FF");
    localStorage.chestFav_color = localStorage.chestFav_color || JSON.stringify("#FF8000");
    localStorage.chest_colCheck =
        localStorage.chest_colCheck || "true";
    localStorage.chest_colCheckF = localStorage.chest_colCheckF || "true";
    localStorage.sortFav_check = localStorage.sortFav_check || "false";
    localStorage.sortInv_check = localStorage.sortInv_check || "false";
    localStorage.chestArmorPriority = localStorage.chestArmorPriority || "false";
    localStorage.chestCraftPriority = localStorage.chestCraftPriority || "false";
    localStorage.chestPricePriority = localStorage.chestPricePriority || "false";
    localStorage.chestPlayerPriorities && "{object Object}" ==
        localStorage.chestPlayerPriorities && delete localStorage.chestPlayerPriorities;
    localStorage.chestPlayerPriorities = localStorage.chestPlayerPriorities || JSON.stringify({});
    localStorage.avoidAll = localStorage.avoidAll || JSON.stringify({});
    Mods.Chestm = Mods.Chestm || {};
    Mods.Chestm.chest_item_id = Mods.Chestm.chest_item_id || 0;
    Mods.Chestm.tempChest = Mods.Chestm.tempChest || {};
    Mods.Chestm.inv_select_color = JSON.parse(localStorage.chestInv_color);
    Mods.Chestm.fav_select_color = JSON.parse(localStorage.chestFav_color);
    Mods.Chestm.chest_colCheck = JSON.parse(localStorage.chest_colCheck);
    Mods.Chestm.chest_colCheckF = JSON.parse(localStorage.chest_colCheckF);
    Mods.Chestm.chest_sort_hidden = !0;
    Mods.Chestm.sortFav_check = JSON.parse(localStorage.sortFav_check);
    Mods.Chestm.sortInv_check = JSON.parse(localStorage.sortInv_check);
    Mods.Chestm.armorPriority = JSON.parse(localStorage.chestArmorPriority);
    Mods.Chestm.craftPriority = JSON.parse(localStorage.chestCraftPriority);
    Mods.Chestm.pricePriority = JSON.parse(localStorage.chestPricePriority);
    Mods.Chestm.playerPriorities = JSON.parse(localStorage.chestPlayerPriorities);
    Mods.Chestm.currentChestPage = 1;
    Mods.Chestm.chestArmorPriorities = {
        5: 0,
        0: 1,
        9: 2,
        2: 3,
        1: 4,
        7: 5,
        6: 6,
        3: 7,
        8: 8,
        4: 9
    };
    Mods.Chestm.chestCraftPriorities = {
        3: 0,
        8: 1,
        4: 2,
        7: 3,
        5: 4,
        0: 5,
        9: 6,
        2: 7,
        1: 8,
        6: 9
    };
    Mods.Chestm.materialsPriorities = {
        Jewel: 0,
        Cut: 1,
        Uncut: 2,
        ore: 3,
        Chunk: 3,
        Sand: 3,
        Clay: 3,
        Copper: 3,
        Zinc: 3,
        Coal: 3,
        Bar: 4,
        Mould: 4,
        Log: 5,
        Wood: 5,
        Vial: 6,
        Raw: 7,
        Feather: 8,
        Egg: 9,
        Scale: 10,
        Eye: 11,
        Soil: 12,
        Leaf: 12,
        Seed: 12,
        Grass: 12,
        Hay: 12,
        Wheat: 12,
        Enchant: 13,
        Teleport: 14
    };
    Mods.Chestm.ctrlPressed = !1;
    Mods.Chestm.avoidAll = Mods.Chestm.avoidAll || JSON.parse(localStorage.avoidAll);
    localStorage.autocastenabled = localStorage.autocastenabled || JSON.stringify(1);
    getElem("options_form");
    Mods.Autocast = Mods.Autocast || {};
    Mods.Autocast.lastFullCast = timestamp();
    Mods.Autocast.enabled = JSON.parse(localStorage.autocastenabled);
    --Mods.Autocast.enabled;
    Mods.Kbind = Mods.Kbind || {};
    Mods.showBag = void 0 == Mods.showBag ? !1 : Mods.showBag;
    Mods.Kbind.lastfoodeaten = timestamp();
    localStorage.announceBlock =
        localStorage.announceBlock || JSON.stringify([]);
    localStorage.tradechatmode = localStorage.tradechatmode || 0;
    localStorage.marketpopup = localStorage.marketpopup || !1;
    Mods.Newmarket.times = Mods.Newmarket.times || JSON.parse(localStorage.announceBlock);
    Mods.Newmarket.announceList = Mods.Newmarket.announceList || {};
    Mods.Newmarket.announces = Mods.Newmarket.announces || {
        messages: [],
        count: 0
    };
    Mods.Newmarket.states = Mods.Newmarket.states || {};
    Mods.Newmarket.submitHolder = [];
    Mods.Newmarket.tradechatmode = JSON.parse(localStorage.tradechatmode);
    --Mods.Newmarket.tradechatmode;
    Mods.Newmarket.infopannelmode = JSON.parse(localStorage.infopanelmode);
    --Mods.Newmarket.infopannelmode;
    Mods.Newmarket.popup = JSON.parse(localStorage.marketpopup);
    Mods.Newmarket.old_client_update_new_offer_item_change = Mods.Newmarket.old_client_update_new_offer_item_change || Market.client_update_new_offer_item_change;
    localStorage.fullscreenenabled = localStorage.fullscreenenabled ? localStorage.fullscreenenabled : JSON.stringify(1);
    Mods.Fullscreen = Mods.Fullscreen || {};
    Mods.Fullscreen.iMapBegin =
        Mods.Fullscreen.iMapBegin || iMapBegin;
    Mods.Fullscreen.jMapBegin = Mods.Fullscreen.jMapBegin || jMapBegin;
    Mods.Fullscreen.iMapTo = Mods.Fullscreen.iMapTo || iMapTo;
    Mods.Fullscreen.jMapTo = Mods.Fullscreen.jMapTo || jMapTo;
    Mods.Fullscreen.astarsearchOld = Mods.Fullscreen.astarsearchOld || astar.search;
    Mods.Fullscreen.enabled = JSON.parse(localStorage.fullscreenenabled);
    --Mods.Fullscreen.enabled;
    localStorage.enableShiftClick = localStorage.enableShiftClick || !1;
    Mods.Petinv = Mods.Petinv || {};
    Mods.Petinv.enableShiftClick_check =
        JSON.parse(localStorage.enableShiftClick);
    Mods.Petinv.invSendItem = !1;
    Mods.Petinv.petInv_toggle = players[0].pet.enabled ? !0 : !1;
    Mods.Magicm = Mods.Magicm || {};
    Mods.Magicm.enemy = Mods.Magicm.enemy || {};
    Mods.Magicm.magic_damage_timers = Mods.Magicm.magic_damage_timers || {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    };
    Mods.Wikimd = Mods.Wikimd || {};
    Mods.Wikimd.newWikiLoad = Mods.Wikimd.newWikiLoad || {};
    Mods.Wikimd.oldWikiLoad = Mods.Wikimd.oldWikiLoad || {};
    Mods.Wikimd.item_formulas = Mods.Wikimd.item_formulas || {};
    Mods.Wikimd.item_slots = {
        0: "Helm",
        1: "Cape",
        2: "Chest",
        3: "R.Hand",
        4: "L.Hand",
        5: "Glove",
        6: "Boots",
        7: "Neck",
        8: "Ring",
        9: "none",
        10: "Magic",
        11: "Pants"
    };
    Mods.Wikimd.oldSortList = Mods.Wikimd.oldSortList || [];
    Mods.Wikimd.oldSortValue = Mods.Wikimd.oldSortValue || "";
    Mods.Wikimd.newSortValue = Mods.Wikimd.newSortValue || "";
    Mods.Wikimd.oldSort = Mods.Wikimd.oldSort || {};
    Mods.Wikimd.oldSort = {
        item: Mods.Wikimd.oldSort.item || "name",
        monster: Mods.Wikimd.oldSort.monster || "name",
        vendor: Mods.Wikimd.oldSort.vendor || "name",
        craft: Mods.Wikimd.oldSort.craft || "name",
        pet: Mods.Wikimd.oldSort.pet ||
            "name",
        spell: Mods.Wikimd.oldSort.spell || "name",
        arrow: Mods.Wikimd.oldSort.arrow || "name",
        enchant: Mods.Wikimd.oldSort.enchant || "name"
    };
    Mods.Wikimd.formulas = Mods.Wikimd.formulas || {};
    Mods.Wikimd.span = {
        item: {
            wiki_r1_c0: {
                c: 2,
                r: 2
            }
        },
        monster: {
            wiki_r2_c1: {
                c: 5
            }
        },
        vendor: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r1_c1: {
                c: 5
            }
        },
        craft: {
            wiki_r1_c0: {
                c: 2
            },
            wiki_r2_c0: {
                c: 2
            },
            wiki_r2_c1: {
                c: 5
            }
        },
        pet: {
            wiki_r2_c1: {
                c: 5
            }
        },
        spell: {
            wiki_r1_c0: {
                r: 2
            }
        },
        arrow: {
            wiki_r1_c0: {
                r: 2
            }
        },
        enchant: {
            wiki_r2_c2: {
                c: 5
            }
        }
    };
    Mods.Wikimd.mouse = {
        x: 0,
        y: 0
    };
    Mods.Wikimd.pet_family =
        Mods.Wikimd.pet_family || {};
    Mods.Wikimd.family = Mods.Wikimd.family || {};
    LazyLoad.css(cdn_url + "mod.css?v=" + mod_version, function() {
        Mods.consoleLog("CSS Loaded")
    });
    localStorage.activeQuest = localStorage.activeQuest || JSON.stringify(!1);
    localStorage.penalty_bonus = localStorage.penalty_bonus || JSON.stringify("health");
    localStorage.audioVolume = localStorage.audioVolume || "50";
    Mods.Miscmd = Mods.Miscmd || {};
    Mods.Miscmd.ideath = Mods.Miscmd.ideath || {};
    Mods.Miscmd.ideath.inventory = [];
    Mods.Miscmd.ideath.bgColor = "#3A6";
    Mods.Miscmd.ideath.brColor =
        "inherit";
    Mods.Miscmd.toolbar = Mods.Miscmd.toolbar || {};
    Mods.Miscmd.toolbar.oldDrawMap = Mods.Miscmd.toolbar.oldDrawMap || drawMap;
    Mods.Miscmd.toolbar.xpmessage = ["Current experience rate is 2x"];
    Mods.Miscmd.toolbar.ids = {
        invSlots: "td_inventory"
    };
    Mods.Miscmd.toolbar.oldInventoryAdd = Mods.Miscmd.toolbar.oldInventoryAdd || Inventory.add;
    Mods.Miscmd.toolbar.oldInventoryRemove = Mods.Miscmd.toolbar.oldInventoryRemove || Inventory.remove;
    Mods.Miscmd.toolbar.activeQuest = Mods.Miscmd.toolbar.activeQuest || JSON.parse(localStorage.activeQuest);
    Mods.Miscmd.toolbar.oldQuestsShowActive = Mods.Miscmd.toolbar.oldQuestsShowActive || Quests.show_active;
    Mods.Miscmd.penalty = Mods.Miscmd.penalty || JSON.parse(localStorage.penalty_bonus);
    Mods.Miscmd.oldPenaltyBonus = Mods.Miscmd.oldPenaltyBonus || penalty_bonus;
    Mods.Miscmd.potions = Mods.Miscmd.potions || {};
    Mods.Miscmd.adps = [];
    Mods.Miscmd.maxtime = 18E4;
    Mods.Miscmd.avgdps = 0;
    Mods.Miscmd.maxdps = 0;
    Mods.Miscmd.avgexp = 0;
    Mods.Miscmd.dpsmode = !1;
    Mods.Miscmd.lastSkill = {};
    Mods.Miscmd.changeVolume = Mods.Miscmd.changeVolume || {};
    localStorage.colorChannel = localStorage.colorChannel || JSON.stringify(!1);
    localStorage.highlightFriends = localStorage.highlightFriends || JSON.stringify(!0);
    localStorage.timer = localStorage.timer && "object" == typeof JSON.parse(localStorage.timer) && localStorage.timer || JSON.stringify({
        start: {},
        set: {}
    });
    localStorage.tipsenabled = localStorage.tipsenabled ? localStorage.tipsenabled : JSON.stringify(0);
    localStorage.enableallchatts = localStorage.enableallchatts ? localStorage.enableallchatts : JSON.stringify(0);
    Mods.Chatmd =
        Mods.Chatmd || {};
    Mods.Chatmd.addChatText = Mods.Chatmd.addChatText || addChatText;
    Mods.Chatmd.colors = {
        EN: "#FFFFFF",
        ST: "#D4D4D4",
        18: "#99FFC6",
        $$: "#F2A2F2",
        "{M}": "#EAE330",
        "default": "#FFDFC0",
        none: "#DDDD69"
    };
    Mods.Chatmd.runTimer = Mods.Chatmd.runTimer || JSON.parse(localStorage.timer);
    Mods.Chatmd.ModCh = Mods.Chatmd.ModCh || {};
    Mods.Chatmd.ModCh.delay = Mods.Chatmd.ModCh.delay || !1;
    Mods.Chatmd.ModCh.channel = "{M}";
    Mods.Chatmd.ModCh.regular_onclick = Mods.Chatmd.ModCh.regular_onclick || regular_onclick;
    Mods.Chatmd.afkHolder =
        Mods.Chatmd.afkHolder || {};
    Mods.Chatmd.afkMessage = Mods.Chatmd.afkMessage || "";
    Mods.Chatmd.whispNames = Mods.Chatmd.whispNames || [];
    Mods.Chatmd.cycleWhisper = Mods.Chatmd.cycleWhisper || !0;
    Mods.Chatmd.oldDrawObject = Mods.Chatmd.oldDrawObject || drawObject;
    Mods.Chatmd.mooDelay = Mods.Chatmd.mooDelay || {};
    Mods.Chatmd.blockCommand = !1;
    Mods.Chatmd.enableallchatts = JSON.parse(localStorage.enableallchatts);
    --Mods.Chatmd.enableallchatts;
    Mods.Chatmd.tipsenabled = JSON.parse(localStorage.tipsenabled);
    --Mods.Chatmd.tipsenabled;
    Mods.Chatmd.old_has_client_command = Mods.Chatmd.old_has_client_command || Chat.has_client_command;
    Mods.Chatmd.old_execute_client_command = Mods.Chatmd.old_execute_client_command || Chat.execute_client_command;
    Mods.Chatmd.spamItems = Mods.Chatmd.spamItems || [];
    Mods.Chatmd.modDevColorToggle = Mods.Chatmd.modDevColorToggle || JSON.parse(localStorage.moddevtoggle || 1) || 1;
    Mods.Tabs.set_visible = Mods.Tabs.set_visible || Chat.set_visible;
    Mods.Tabs.chatMovement = Mods.Tabs.chatMovement || -1;
    Mods = Mods || {};
    Mods.Farming = Mods.Farming || {};
    Mods.Farming.queue = Mods.Farming.queue || {};
    Mods.Farming.sortedQueue = Mods.Farming.sortedQueue || [];
    Mods.Farming.ctrlPressed = Mods.Farming.ctrlPressed || !1;
    Mods.Farming.queueHidden = Mods.Farming.queueHidden || !1;
    Mods.Farming.queuePaused = Mods.Farming.queuePaused || !1;
    Mods.Farming.wateringCanDisabled = Mods.Farming.wateringCanDisabled || !1;
    Mods.Farming.oldDefault = Mods.Farming.oldDefault || {
        rake: DEFAULT_FUNCTIONS.rake,
        seed: DEFAULT_FUNCTIONS.seed,
        harvest: DEFAULT_FUNCTIONS.harvest,
        get_watering_can_id: Inventory.get_watering_can_id
    };
    Mods.Farming.oldInventoryEquip = Mods.Farming.oldInventoryEquip || Inventory.equip;
    Mods.Farming.oldMoveInPath = Mods.Farming.oldMoveInPath || moveInPath;
    localStorage.farming_options = localStorage.farming_options || JSON.stringify({});
    Mods.Farming.options = Mods.Farming.options || JSON.parse(localStorage.farming_options);
    Mods.Farming.farming_queue_template = Handlebars.compile("<span style='width: 100%; display: block; float: left; color: #FF0; font-weight: bold; border-bottom: 1px solid #DDD; padding-bottom: 5px; margin-bottom: 2px;'>Farming Queue <span class='common_link' style='margin: 0; font-weight: normal; float: right;' onclick='Mods.Farming.queueOptions(true);'>(options)</span></span><span id='mods_farming_queue' style='width: 100%; float: left; display: block; margin-bottom: 2px; padding-bottom: 2px; overflow-y: hidden;'><span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span style='float: left;'>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span></span><span style='width: 100%; float: left; display: inline-block; border-bottom: 1px solid #DDD; margin-bottom: 2px; padding-bottom: 4px;'><span style='float: left;'>Queued:&nbsp;<span id='mods_farming_total'>0</span></span><span class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.cancelQueue()'>(clear)</span></span><span style='color: #FF0;'>Action: <span id='mods_farming_action' style='color: #FFF; font-weight: normal;'>Active</span></span><span id='farming_queue_button' class='common_link' style='margin: 0; float: right; display: block; font-weight: normal;' onclick='Mods.Farming.pauseQueue(this)'>(queue)</span>");
    Mods.Farming.farming_queue_action_template = Handlebars.compile("<span id='mods_farming_{{slot}}' style='width: 100%; float: left; display: inline-block; font-weight: normal;'><span>{{action}}:&nbsp;&nbsp;{{object}}</span><span style='float: right;'>({{i}}, {{j}})</span></span>");
    Mods.Farming.farming_queue_option_template = Handlebars.compile("<span style='color: #FF0; font-weight: bold; width: 100%; float: left; margin-bottom: 2px; padding-bottom: 5px; border-bottom: 1px solid #DDD;'>Farming Options</span><table style='color: #DDD;'><tr><td colspan='2'><div id='mods_farming_opt_hide' class='common_link' style='margin: 4px;' onclick='Mods.Farming.hideQueue()'>Hide queued window</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_equipped' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Meet requirements to queue action</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_stop' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Stop movement while queuing</div></td></tr><tr><td><input type='checkbox' id='mods_farming_opt_save' style='width: .8em; height: .8em;'></td><td><div style='margin: 3px;'>Save queue when leaving island</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Ctrl: Toggle Queuing</div></td></tr><tr><td colspan='2'><div style='margin: 3px;'>Space: Toggle Active/Paused</div></td></tr></table>");
    Mods.Miscmd.default_open_nest = Mods.Miscmd.default_open_nest || Breeding.open_nest
};
Load.rclick = function() {
    modOptions.rclick.time = timestamp();
    ActionMenu.mobDrops = function(b, e) {
        var f = "";
        if (e == BASE_TYPE.OBJECT) {
            var g = _tm(object_base[b].name, {
                ns: "names"
            });
            addChatText(g + " " + _tm("drops"), void 0, COLOR.ORANGE);
            for (var k in object_base[b].params.results) {
                var m = {},
                    n, p, q = 0;
                n = 0;
                p = object_base[b].params.results[k].returns;
                for (var t in p) {
                    var g = object_base[b].params.results[k].skill,
                        g = skills[0][g].current > skills[0][g].level ? skills[0][g].current : skills[0][g].level,
                        r = p[t].chance || g >= p[t].level &&
                        void 0 !== p[t].max_chance && Math.min(p[t].base_chance + (g - p[t].level) / 100, p[t].max_chance) || Math.min(g >= p[t].level && p[t].base_chance + (g - p[t].level) / 100, 1) || 0;
                    m[item_base[p[t].id].name] = {
                        percent: r * (1 - n),
                        xp: "undefined" == typeof p[t].xp ? "" : "(" + p[t].xp + _tm("xp", {
                            ns: "interface"
                        }) + ") "
                    };
                    "undefined" != typeof p[t].xp && (q += p[t].xp * r * (1 - n));
                    n += m[item_base[p[t].id].name].percent
                }
                n = 0;
                for (t in m) f = f + t + " " + Math.round(1E4 * m[t].percent) / 100 + "% " + m[t].xp + "- ", n += m[t].percent;
                f = 0 < Math.round(1E4 * (1 - n)) / 100 ? f + _tm("No loot") +
                    " " + Math.round(1E4 * (1 - n)) / 100 + "%" : f.slice(0, -3);
                0 < q && (q = Math.round(100 * q) / 100, f = f + "; " + _tm("avg") + ": " + q + _tm("xp", {
                    ns: "interface"
                }));
                f += ". ";
                addChatText(f, void 0, COLOR.WHITE);
                f = ""
            }
        } else if (e == BASE_TYPE.NPC) {
            if (npc_base[b].type == OBJECT_TYPE.SHOP) {
                m = {};
                g = _tm(npc_base[b].name, {
                    ns: "names"
                });
                for (q in npc_base[b].temp.content) k = npc_base[b].temp.content[q], 0 < k.count && (m[item_base[k.id].name] = {
                    stock: k.count
                });
                for (t in m) f = f + t + " (" + m[t].stock + ") - ";
                f = "" === f ? capitaliseFirstLetter(_tm("nothing")) + "." : f.slice(0, -3) + ".";
                addChatText(g + " " + _tm("sells"), void 0, COLOR.ORANGE)
            } else {
                m = {};
                n = q = 0;
                p = npc_base[b].params.drops;
                g = _tm(npc_base[b].name, {
                    ns: "names"
                });
                for (t in p) r = p[t].chance || skills[0][object_base[b].params.results[0].skill].level >= p[t].level && void 0 !== p[t].max_chance && Math.min(p[t].base_chance + (skills[0][object_base[b].params.results[0].skill].level - p[t].level) / 100, p[t].max_chance) || Math.min(skills[0][object_base[b].params.results[0].skill].level >= p[t].level && p[t].base_chance + (skills[0][object_base[b].params.results[0].skill].level -
                    p[t].level) / 100, 1) || 0, m[item_base[p[t].id].name] = {
                    percent: r * (1 - n),
                    xp: "undefined" == typeof p[t].xp ? "" : "(" + p[t].xp + _tm("xp", {
                        ns: "interface"
                    }) + ") "
                }, "undefined" != typeof p[t].xp && (q += p[t].xp * r * (1 - n)), n += m[item_base[p[t].id].name].percent;
                n = 0;
                for (t in m) f = f + t + " " + Math.round(1E4 * m[t].percent) / 100 + "% " + m[t].xp + "- ", n += m[t].percent;
                f = 0 < Math.round(1E4 * (1 - n)) / 100 ? f + _tm("No loot") + " " + Math.round(1E4 * (1 - n)) / 100 + "%" : f.slice(0, -3);
                addChatText(g + " " + _tm("drops") + ":", void 0, COLOR.ORANGE);
                0 < q && (q = Math.round(100 * q) /
                    100, f = f + "; " + _tm("avg") + ": " + q + _tm("xp", {
                        ns: "interface"
                    }));
                f += ". "
            }
            addChatText(f, void 0, COLOR.WHITE)
        }
    };
    ActionMenu.combatCheck = function(b) {
        for (var e = 0, f = 0, g = 0, k = e = 0, m = 0, n = 0, p = 0, q = 0, t = 0, r = 0, x = 0, y = 0, A = firstChar(_tm("{count} second", {
                ns: "calendar",
                count: "1"
            }).split(" ")[1]).toLowerCase(), u = 0; 2 > u; u++) 0 === u && (k = players[0].temp.total_strength, m = npc_base[b].temp.total_defense, n = players[0].temp.total_accuracy), 1 == u && (k = npc_base[b].temp.total_strength, m = players[0].temp.total_defense, n = npc_base[b].temp.total_accuracy),
            f = Math.ceil(k / 5), e = Math.max(Math.ceil(m - n), 0), 0 === e ? (g = .5 * f + 1, e = 0) : 1 < (e - 1) / f ? (g = (Math.pow(f, 2) + 3 * f + 3) / (6 * e), e = 1 - (f + 2) / (2 * e)) : (g = .5 * f + 1 - .5 * e - Math.pow(1 - e, 3) / (6 * f * e), e = (Math.pow(e, 2) - 2 * e + 1) / (2 * e * f)), 0 === u && (p = g, q = e, t = f + 1), 1 == u && (r = g, x = e, y = f + 1);
        var f = players[0].params.magic_slots,
            k = g = 0,
            m = 1 - players[0].params.cooldown,
            B = 1 - (npc_base[b].temp.magic_block || 0) / 100;
        if (0 < f)
            for (var C = "", n = 0; n < f; n++)
                if (n < players[0].params.magics.length) var u = players[0].params.magics[n].id,
                    e = Math.min(1, (players[0].temp.magic / 1.2 +
                        skills[0].magic.current + Magic[u].params.penetration) / npc_base[b].temp.total_defense),
                    v = B * Math.round((.5 / 1.333 + .25) * Magic[u].params.basic_damage * e) / (Magic[u].params.cooldown * m / 1E3),
                    D = Math.ceil(3 / (Magic[u].params.cooldown * m / 1E3)),
                    D = B * D * Math.round((1 / 1.333 + .25) * Magic[u].params.basic_damage * e),
                    C = C + _tm(Magic[u].name, {
                        ns: "names"
                    }) + " (" + Math.round(100 * e) / 100 + "): " + Math.round(100 * v) / 100 + "/" + A + "; ",
                    g = g + v,
                    k = k + D;
        var B = npc_base[b].temp.magics && npc_base[b].temp.magics.length || 0,
            E = m = 0,
            w = 1 - (npc_base[b].temp.cooldown ||
                0),
            z = 1 - (players[0].temp.magic_block || 0) / 100;
        if (0 < B)
            for (var G = _tm("Enemy magic") + ": ", n = 0; n < B; n++) n < B && (u = npc_base[b].temp.magics[n].id, e = Math.min(1, (npc_base[b].temp.magic / 1.2 + Magic[u].params.penetration) / players[0].temp.total_defense), v = 1 / Math.ceil(Magic[u].params.cooldown * w / 1E3 / 3), v = z * Math.round((.5 / 1.333 + .25) * Magic[u].params.basic_damage * e * v / 3 * 100) / 100, D = Math.min(1, Math.ceil(3 / (Magic[u].params.cooldown * w / 1E3))), D = z * D * Math.round((1 / 1.333 + .25) * Magic[u].params.basic_damage * e), G = G + _tm(Magic[u].name, {
                ns: "names"
            }) + " (" + Math.round(100 * e) / 100 + "): " + Math.round(100 * v) / 100 + "/" + A + "; ", m += v, E += D);
        x = _tm("enemy").toUpperCase() + ": " + _tm("average damage") + " = " + Math.round(100 * r) / 100 + " + " + Math.round(300 * m) / 100 + firstChar(_tm("Magic")) + " = " + Math.round(100 * (r + 3 * m)) / 100 + ", " + _tm("chance to hit") + " = " + Math.round(1E4 * (1 - x)) / 100 + "%, " + _tm("max damage", {
            ns: "item_description"
        }) + ": " + y + " + " + E + firstChar(_tm("Magic")) + " = " + (y + E);
        q = _tm("you").toUpperCase() + ": " + _tm("average damage") + " = " + Math.round(100 * p) / 100 + " + " +
            Math.round(300 * g) / 100 + firstChar(_tm("Magic")) + " = " + Math.round(100 * (p + 3 * g)) / 100 + ", " + _tm("chance to hit") + " = " + Math.round(1E4 * (1 - q)) / 100 + "%, " + _tm("max damage", {
                ns: "item_description"
            }) + ": " + t + " + " + k + firstChar(_tm("Magic")) + " = " + (t + k);
        addChatText(_tm("Combat Analysis") + ": " + _tm(npc_base[b].name, {
            ns: "names"
        }), void 0, COLOR.ORANGE);
        addChatText(x, void 0, COLOR.WHITE);
        addChatText(q, void 0, COLOR.WHITE);
        0 < f && (addChatText(C, void 0, COLOR.TEAL), addChatText(_tm("Total magic damage") + ": " + Math.round(100 * g) /
            100 + "/" + A + "", void 0, COLOR.TEAL));
        0 < B && (addChatText(G, void 0, COLOR.TEAL), addChatText(_tm("Total magic damage from enemy") + ": " + Math.round(100 * m) / 100 + "/" + A + "", void 0, COLOR.TEAL));
        b = Math.ceil(npc_base[b].temp.health / (p + 3 * g));
        r = (b - 1) * (r + 3 * m);
        p = 3 * b;
        p = Math.floor(p / 60) + ":" + (10 > parseInt(p % 60, 10) ? "0" : "") + parseInt(p % 60, 10);
        r = _tm("Average per fight") + ": " + _tm("hits") + ": " + Math.round(100 * b) / 100 + ", " + _tm("damage received") + ": " + Math.round(100 * r) / 100 + ", " + _tm("time to kill") + ": " + p;
        addChatText(r, void 0, COLOR.WHITE)
    };
    InvMenu.create = function(b) {
        Mods.Rclick.oldInvMenu(b) && (b = players[0].temp.inventory[b], "undefined" != typeof b && (b = item_base[b.id], d = getElem("action_menu"), -1 < loadedMods.indexOf("Wikimd") && -1 < loadedMods.indexOf("Chatmd") && (b = b.name.replace(/'/g, "\\&apos;"), d.innerHTML += "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki item name " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" + _tmi("Check Wiki") + "<span class='item'>" + _tmi("Item", {
                ns: "interface",
                fn: "toUpperCase"
            }) +
            "</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki craft item " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" + _tmi("Check Wiki") + "<span class='item'>" + _tmi("Craft", {
                fn: "toUpperCase"
            }) + "</span></span><span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc item " + b + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" + _tmi("Check Wiki") + "<span class='item'>" + _tmi("npc", {
                fn: "toUpperCase"
            }) + "</span></span>")))
    };
    Mods.destroyallitems = function(b) {
        InvMenu.hide();
        "undefined" != typeof b && Popup.prompt(_tm("Do you want to destroy all {item_name}?", {
            item_name: item_base[b].name
        }), function() {
            Socket.send("inventory_destroy", {
                item_id: b,
                all: !0
            })
        })
    };
    getElem("action_menu").style.zIndex = "999999999";
    ActionMenu.create = function(b, e, f) {
        Mods.Rclick.oldActionMenu(b, e, f);
        if (!f) {
            f = getElem("action_menu");
            addClass(f, "hidden");
            f.style.top = b.clientY + 10 + "px";
            f.style.left = b.clientX + "px";
            var g = b = "";
            e = "";
            for (var k in players)
                if ("0" != k &&
                    players[k].i == selected_object.i && players[k].j == selected_object.j && players[k].b_t == BASE_TYPE.PLAYER) {
                    e = "<span class='line' onclick=\"ChatSystem.whisper('" + players[k].name.sanitize() + "');addClass(getElem(&apos;action_menu&apos;), ";
                    e += '&apos;hidden&apos;)">' + _tm("Whisper", {
                        ns: "interface"
                    }) + " <span class='item'>" + players[k].name.sanitize() + "</span></span>";
                    break
                }
            if (1 == selected_object.b_t && void 0 !== selected_object.params.results || 4 == selected_object.b_t) b = "<span class='line' onclick='ActionMenu.mobDrops(" +
                selected_object.b_i + "," + selected_object.b_t + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + _tmi(selected_object.name, {
                    ns: "names"
                }) + "</span>" + _tmi("Drops") + "</span>" + ("4" == selected_object.b_t ? "<span class='line' onclick='ActionMenu.combatCheck(" + selected_object.b_i + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" + _tmi("Combat Analysis") + "</span>" : ""), modOptions.chatmd.loaded && (selected_object.type == OBJECT_TYPE.SHOP ?
                    (k = selected_object.name.replace(/'/g, "*"), g = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki npc name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" + _tmi("Check Wiki") + "<span class='item'>" + _tmi("NPC", {
                        fn: "toUpperCase"
                    }) + "</span></span>") : selected_object.type == OBJECT_TYPE.ENEMY && (k = selected_object.name.replace(/'/g, "*"), g = "<span class='line' onclick='Mods.Chatmd.chatCommands(&apos;/wiki mob name " + k.replace("[BOSS]", "") + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)'>" +
                        _tmi("Check Wiki") + "<span class='item'>" + _tmi("MOB", {
                            fn: "toUpperCase"
                        }) + "</span></span>"));
            k = ActionMenu.action(selected_object, 0) + ActionMenu.action(selected_object, 1) + b + g + e + ActionMenu.action(selected_object, 2);
            f.innerHTML = k;
            0 < f.innerHTML.length && removeClass(f, "hidden")
        }
    };
    Mods.timestamp("rclick")
};
Load.chestm = function() {
    modOptions.chestm.time = timestamp();
    Chest.open = function(b, e, f) {
        chest_content = b;
        chests[0] = b;
        for (var g in Mods.Chestm.tempChest) delete Mods.Chestm.tempChest[g];
        for (b = 0; b < chests[0].length; b++) Mods.Chestm.tempChest[chest_content[b].id] = b;
        e && Chest.change_page(chest_page);
        f && Carpentry.init(f);
        Chest.sort_player_modChest()
    };
    BigMenu.update_chest = function(b) {
        -1 < navigator.userAgent.search("Chrome") && (Mods.Chestm.inv_select_color = getElem("chest_invColor").value, Mods.Chestm.fav_select_color =
            getElem("chest_favColor").value);
        Mods.Chestm.chest_colCheck = getElem("chest_colCheck").checked;
        Mods.Chestm.chest_colCheckF = getElem("chest_colCheckF").checked;
        chest_content = b;
        getElem("chest_coins_amount").innerHTML = thousandSeperate(players[0].temp.coins);
        for (var e = chest_page - 1, f = 60 * e, g = Math.min(b.length, 60 * e + 60); f < 60 * e + 60; f++) {
            var k = getElem("chest_" + (f - 60 * e)),
                m, n, p;
            if (f < g) {
                n = item_base[b[f].id];
                m = b[f].id;
                k.style.background = Items.get_background(n.b_i);
                k = k.childNodes[0];
                n = b[f].count;
                p = Inventory.get_item_count(players[0],
                    b[f].id);
                l = "";
                o = 0;
                for (h = 6 - n.toString().length - p.toString().length; o < h; o++) l += "&nbsp;";
                k.innerHTML = n + l + p
            } else m = -1;
            k = getElem("chest_" + (f - 60 * e));
            0 < Inventory.get_item_count(players[0], m) && Mods.Chestm.chest_colCheck ? k.style.borderColor = Mods.Chestm.inv_select_color : k.style.borderColor = Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[m] ? Mods.Chestm.fav_select_color : "";
            localStorage.chestInv_color = JSON.stringify(Mods.Chestm.inv_select_color);
            localStorage.chestFav_color = JSON.stringify(Mods.Chestm.fav_select_color);
            localStorage.chest_colCheck = JSON.stringify(Mods.Chestm.chest_colCheck);
            localStorage.chest_colCheckF = JSON.stringify(Mods.Chestm.chest_colCheckF)
        }
        BigMenu.update_chest_selection();
        Chest.button_enable_check()
    };
    Chest.mouseoverColor = function(b, e) {
        var f = b.id,
            f = parseInt(f.replace("chest_", "")) + 60 * (parseInt(chest_page) - 1),
            f = chests[0][f] && chests[0][f].id || !1;
        "" !== b.style.borderColor && !0 === e && (b.style.borderColor = "#1DEDFF");
        "" !== b.style.borderColor && !1 === e && (b.style.borderColor = 0 < Inventory.get_item_count(players[0],
            f) && Mods.Chestm.chest_colCheck && Mods.Chestm.inv_select_color || Mods.Chestm.chest_colCheckF && Mods.Chestm.playerPriorities[f] && Mods.Chestm.fav_select_color || "")
    };
    Chest.button_enable_check = function() {
        var b = chest_page - 1,
            e = parseInt(selected_chest) + 60 * b;
        if ("undefined" != typeof chest_content[e]) {
            var f = chest_content[e].id,
                g = getElem("chest_withdraw_item_1"),
                b = getElem("chest_withdraw_item_8"),
                k = getElem("chest_withdraw_item_12"),
                m = getElem("chest_withdraw_item_19"),
                n = getElem("chest_withdraw_item_all"),
                p = getElem("chest_deposit_item_1"),
                q = getElem("chest_deposit_item_all"),
                t = getElem("chest_deposit_item_pet"),
                r = getElem("chest_destroy_item");
            0 === chest_content[e].count ? (g.className = "", b.className = "", k.className = "", m.className = "", n.className = "", r.className = "", g.onclick = function() {}, b.onclick = function() {}, k.onclick = function() {}, m.onclick = function() {}, n.onclick = function() {}, r.onclick = function() {}) : (g.className = "link", b.className = "link", k.className = "link", m.className = "link", n.className = "link", r.className = "link", g.onclick = function() {
                    Chest.withdraw(1)
                },
                b.onclick = function() {
                    Chest.withdraw(8)
                }, k.onclick = function() {
                    Chest.withdraw(12)
                }, m.onclick = function() {
                    Chest.withdraw(19)
                }, n.onclick = function() {
                    Chest.withdraw(99)
                }, r.onclick = function() {
                    Chest.destroy()
                });
            0 === Inventory.get_item_count(players[0], f) ? (p.className = "", q.className = "", p.onclick = function() {}, q.onclick = function() {}) : (p.className = "link", q.className = "link", p.onclick = function() {
                Chest.deposit(1)
            }, q.onclick = function() {
                Chest.deposit(99)
            });
            b = !1;
            for (e = 0; e < players[0].temp.inventory.length; e++)
                if (!players[0].temp.inventory[e].selected) {
                    b = !0;
                    break
                }
            b ? (t.className = "link", t.onclick = function() {
                Chest.deposit_all()
            }) : (t.className = "", t.onclick = function() {})
        }
    };
    Chest.sort_player_modChest = function() {
        Mods.Chestm.armorPriority = "0" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.craftPriority = "1" == getElem("chest_sort_category").value ? !0 : !1;
        Mods.Chestm.pricePriority = "2" == getElem("chest_sort_category").value ? !0 : !1;
        chests[0].sort(function(b, e) {
            Mods.Chestm.sortFav_check = getElem("chest_favCheck").checked;
            Mods.Chestm.sortInv_check = getElem("chest_invCheck").checked;
            var f = item_base[b.id].params.price,
                g = item_base[e.id].params.price,
                k = item_base[b.id].params,
                m = item_base[e.id].params,
                n = item_base[b.id].name,
                p = item_base[e.id].name,
                q = Mods.Chestm.playerPriorities,
                k = (m.min_defense || m.min_accuracy || m.min_health || m.min_forging || m.min_jewelry || m.min_cooking || m.min_carpentry || m.min_fishing || m.min_alchemy || m.min_magic || m.min_archery || 0) - (k.min_defense || k.min_accuracy || k.min_health || k.min_forging || k.min_jewelry || k.min_cooking || k.min_carpentry || k.min_fishing || k.min_alchemy ||
                    k.min_magic || k.min_archery || 0),
                m = item_base[b.id].b_t,
                t = item_base[e.id].b_t;
            !0 === Mods.Chestm.armorPriority ? (m = Mods.Chestm.chestArmorPriorities[m], t = Mods.Chestm.chestArmorPriorities[t]) : !0 === Mods.Chestm.craftPriority ? (m = Mods.Chestm.chestCraftPriorities[m], t = Mods.Chestm.chestCraftPriorities[t]) : !0 === Mods.Chestm.pricePriority && (m = -item_base[b.id].params.price, t = -item_base[e.id].params.price);
            if (!0 === Mods.Chestm.sortFav_check && "undefined" != typeof q[b.id] && "undefined" == typeof q[e.id]) return -1;
            if (!0 === Mods.Chestm.sortFav_check &&
                "undefined" == typeof q[b.id] && "undefined" != typeof q[e.id]) return 1;
            if (!0 === Mods.Chestm.sortInv_check && 0 < Inventory.get_item_count(players[0], b.id) && 0 === Inventory.get_item_count(players[0], e.id)) return -1;
            if (!0 === Mods.Chestm.sortInv_check && 0 === Inventory.get_item_count(players[0], b.id) && 0 < Inventory.get_item_count(players[0], e.id)) return 1;
            if (m == t) {
                if (3 == item_base[b.id].b_t && !Mods.Chestm.pricePriority) {
                    var q = item_base[b.id].name,
                        m = item_base[e.id].name,
                        r = t = -1,
                        x;
                    for (x in Mods.Chestm.materialsPriorities) - 1 <
                        q.search(x) && (t = Mods.Chestm.materialsPriorities[x]), -1 < m.search(x) && (r = Mods.Chestm.materialsPriorities[x]);
                    if (-1 != t && -1 == r) return -1;
                    if (-1 == t && -1 != r) return 1;
                    if (t < r) return -1;
                    if (t > r) return 1
                }
                return 0 < k ? 1 : 0 > k || f > g ? -1 : f < g ? 1 : n > p ? -1 : n < p ? 1 : 0
            }
            return m < t ? -1 : m > t ? 1 : n > p ? -1 : n < p ? 1 : 0
        });
        BigMenu.update_chest(chests[0], Mods.Chestm.currentChestPage);
        localStorage.sortFav_check = Mods.Chestm.sortFav_check;
        localStorage.sortInv_check = Mods.Chestm.sortInv_check;
        localStorage.chestArmorPriority = Mods.Chestm.armorPriority;
        localStorage.chestCraftPriority =
            Mods.Chestm.craftPriority;
        localStorage.chestPricePriority = Mods.Chestm.pricePriority
    };
    Chest.deposit = function(b) {
        var e = chest_page - 1,
            e = parseInt(selected_chest) + 60 * e,
            f = chests[0][e].id,
            e = Mods.Chestm.tempChest[f];
        Mods.Chestm.chest_item_id = f;
        Socket.send("chest_deposit", {
            item_id: f,
            item_slot: e,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: b
        })
    };
    Chest.destroy = function() {
        var b = chest_page - 1,
            b = parseInt(selected_chest) + 60 * b,
            e = chests[0][b].id,
            b = Mods.Chestm.tempChest[e];
        Mods.Chestm.chest_item_id =
            e;
        Popup.prompt(_tmi("Do you want to destroy all {item_name}?", {
            item_name: item_base[e].name
        }), function() {
            Socket.send("chest_destroy", {
                item_id: e,
                item_slot: b,
                target_id: chest_npc.id
            })
        })
    };
    Chest.withdraw = function(b) {
        var e = chest_page - 1,
            e = parseInt(selected_chest) + 60 * e;
        b > chest_content[e].count && (b = chest_content[e].count);
        var f = chests[0][e].id,
            e = Mods.Chestm.tempChest[f];
        Mods.Chestm.chest_item_id = f;
        Socket.send("chest_withdraw", {
            item_id: f,
            item_slot: e,
            target_id: chest_npc.id,
            target_i: chest_npc.i,
            target_j: chest_npc.j,
            amount: b
        })
    };
    Chest.withdrawfavs = function(b) {};
    Chest.deposit_all = function() {
        var b = players[0].temp.inventory,
            e = Inventory.get_item_counts(players[0]);
        if (Timers.running("deposit_all")) return !1;
        Timers.set("deposit_all", null_function, 1E3);
        var f = 0,
            g = 0,
            k;
        for (k in e) {
            var f = Inventory.get_item_count(players[0], k),
                m;
            for (m in b) parseInt(b[m].id) == k && b[m].selected && --f;
            0 === f || Mods.Chestm.avoidAll[k] || (function(b, e, f) {
                setTimeout(function() {
                    Socket.send("chest_deposit", {
                        item_id: e,
                        item_slot: Mods.Chestm.tempChest[e],
                        target_id: chest_npc.id,
                        target_i: chest_npc.i,
                        target_j: chest_npc.j,
                        amount: f
                    })
                }, 75 * b)
            }(g, k, f), g += 1)
        }
    };
    Mods.Chestm.eventListener = {
        keys: {
            keydown: [KEY_ACTION.CTRL],
            keyup: [KEY_ACTION.CTRL]
        },
        fn: function(b, e, f) {
            "keydown" == b && f === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !0, Mods.disableInvClick = !0, Mods.Chestm.showAvoidAll(!0), Timers.set("clear_ctrl_chest", function() {
                Mods.Chestm.eventListener.fn("keyup", !1, KEY_ACTION.CTRL)
            }, 1E3));
            "keyup" == b && f === KEY_ACTION.CTRL && (Mods.Chestm.ctrlPressed = !1, Mods.disableInvClick = !1, Mods.Chestm.showAvoidAll(!1))
        }
    };
    Mods.Chestm.showAvoidAll = function(b) {
        b = b || !1;
        for (var e = 0; 40 > e; e++) {
            var f = getElem("inv_" + e),
                g = players[0].temp.inventory[e] && players[0].temp.inventory[e].id || !1,
                k = f.style.borderColor || "#FFFFFF",
                m = "#FFFFFF" != f.style.borderColor && "rgb(255, 255, 255)" != f.style.borderColor ? f.style.borderColor : "";
            f.style.borderColor = g && b && Mods.Chestm.avoidAll[g] ? k : m
        }
    };
    (function() {
        for (var b = 0; 10 > b; b++)
            if ("undefined" != typeof getElem("chest").childNodes[1].childNodes[0]) getElem("chest").childNodes[1].removeChild(getElem("chest").childNodes[1].childNodes[0]);
            else break;
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_chest",
            style: "float: left; font-weight: bold;",
            innerHTML: _tmi("Chest", {
                ns: "interface"
            })
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_sort",
            className: "link",
            style: "float: left; font-weight: bold; margin: 0px; margin-left: 10px;",
            innerHTML: _tmi("Sort")
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_market",
            className: "link",
            style: "margin-right: 10px; margin-top: 5px;",
            innerHTML: _tmi("Market", {
                ns: "interface"
            }),
            onclick: function() {
                Market.open()
            }
        });
        createElem("span", getElem("chest").childNodes[1], {
            id: "chest_close",
            className: "link",
            style: "margin: 0px; padding: 0px; float: right;",
            innerHTML: _tmi("Close", {
                ns: "interface"
            }),
            onclick: function() {
                addClass(getElem("chest"), "hidden")
            }
        });
        for (b = 0; 5 > b; b++) createElem("span", getElem("chest").childNodes[1], {
            id: "chest_page_" + (5 - b),
            className: "chest_pages link",
            style: "margin: 0px; padding-right: 9px; float: right;",
            onclick: function() {
                for (var b = 0; 5 > b; b++) getElem("chest_page_" +
                    (b + 1)).style.color = "";
                b = parseInt(this.id.replace("chest_page_", ""));
                getElem("chest_page_" + b).style.color = "orange";
                Chest.change_page(b)
            },
            innerHTML: 5 - b
        });
        getElem("chest_withdraw").style.display = "none";
        getElem("chest_withdraw_8").style.display = "none";
        getElem("chest_destroy").style.display = "none";
        getElem("chest_deposit").style.display = "none";
        getElem("chest_deposit_all").style.display = "none";
        getElem("chest_item_name").style.display = "none";
        createElem("span", "chest", {
            id: "chest_sort_holder",
            style: "width: 100%; min-height: 22px; display: none; margin-bottom: 3px; margin-top: 3px; padding-bottom: 4px; color: #FFF; border-bottom: 1px solid #666;"
        });
        createElem("div", "chest", {
            id: "chest_btn_holder",
            style: "font-weight: bold; color: #555; display: inline-block; width: 100%; margin: 4px 0px; 0px"
        });
        createElem("div", "chest_btn_holder", {
            id: "chest_withdraw_btn_holder",
            style: "display: inline-block; float:left; width:60%"
        });
        createElem("div", "chest_btn_holder", {
            id: "chest_deposit_btn_holder",
            style: "display: inline-block; float:right; width:40%"
        });
        createElem("select", "chest_sort_holder", {
            id: "chest_sort_category",
            className: "market_select",
            style: "width: 144px; float: left; margin: 1px 12px 3px 5px;",
            onchange: function() {
                Chest.sort_player_modChest()
            },
            innerHTML: '<option value="-1" data-tu="-- $tm(\'Sort Inventory\') --">-- ' + _tm("Sort Inventory") + " --</option><option value=\"0\" data-tu=\"$tm('Sort'): $tm('Equipment')\">" + _tm("Sort") + ": " + _tm("Equipment") + "</option><option value=\"1\" data-tu=\"$tm('Sort'): $tm('Materials')\">" + _tm("Sort") + ": " + _tm("Materials") + "</option><option value=\"2\" data-tu=\"$tm('Sort'): $tm('Vendor Price')\">" + _tm("Sort") + ": " + _tm("Vendor Price") + "</option>"
        });
        createElem("div",
            "chest_sort_holder", {
                id: "chest_divInv",
                style: "display: inline-block; float: left;"
            });
        createElem("input", "chest_divInv", {
            id: "chest_invCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest()
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_invCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: _tmi("Inventory Items")
        });
        createElem("input", "chest_divInv", {
            id: "chest_colCheck",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 0px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        });
        createElem("span", "chest_divInv", {
            id: "chest_colCheck_name",
            style: "float: left; font-size: 0.7em;",
            innerHTML: _tmi("Highlight")
        });
        createElem("div", "chest_sort_holder", {
            id: "chest_divFav",
            style: "display: inline-block; float: left;"
        });
        createElem("input", "chest_divFav", {
            id: "chest_favCheck",
            type: "checkbox",
            style: "float: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                Chest.sort_player_modChest()
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_favCheck_name",
            style: "float: left; font-size: 0.7em; margin-top: -1px;",
            innerHTML: _tmi("Favorited Items")
        });
        createElem("input", "chest_divFav", {
            id: "chest_colCheckF",
            type: "checkbox",
            style: "float: left; clear: left; margin: 1px 7px 0px 14px; width: 0.7em; height: 0.7em;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        });
        createElem("span", "chest_divFav", {
            id: "chest_colCheck_nameF",
            style: "float: left; font-size: 0.7em;",
            innerHTML: _tmi("Highlight")
        }); - 1 < navigator.userAgent.search("Chrome") && (createElem("input", "chest_divInv", {
            id: "chest_invColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        }), createElem("input", "chest_divFav", {
            id: "chest_favColor",
            type: "color",
            style: "float: left; margin: -2px 0px 0px 3px; width: .95em; height: 1.25em; border: none; background: none; background-color: transparent;",
            onchange: function() {
                BigMenu.update_chest(chest_content)
            }
        }));
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item",
            style: "float: left; color: #FF0; font-weight: normal; margin: 4px 6px 7px 2px",
            innerHTML: _tmi("Withdraw", {
                ns: "interface"
            })
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item_1",
            className: "link",
            style: "float: left; margin: 5px 3px;",
            innerHTML: "1",
            onclick: function() {
                Chest.withdraw(1)
            }
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item_8",
            className: "link",
            style: "float: left; margin: 5px 3px;",
            innerHTML: "8",
            onclick: function() {
                Chest.withdraw(8)
            }
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item_12",
            className: "link",
            style: "float: left; margin: 5px 3px;",
            innerHTML: "12",
            onclick: function() {
                Chest.withdraw(12)
            }
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item_19",
            className: "link",
            style: "float: left; margin: 5px 3px;",
            innerHTML: "19",
            onclick: function() {
                Chest.withdraw(19)
            }
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_withdraw_item_all",
            className: "link",
            style: "float: left; margin: 5px 8px;",
            innerHTML: _tmi("All", {
                ns: "interface"
            }),
            onclick: function() {
                Chest.withdraw(99)
            }
        });
        createElem("span", "chest_withdraw_btn_holder", {
            id: "chest_destroy_item",
            className: "link",
            style: "float: left; margin: 5px 0px 0px;",
            innerHTML: _tmi("Destroy", {
                ns: "interface"
            }),
            onclick: function() {
                Chest.destroy();
                Chest.sort_player_modChest()
            }
        });
        createElem("span", "chest_deposit_btn_holder", {
            id: "chest_deposit_item",
            style: "float: right; color: #FF0; font-weight: normal; margin: 4px 2px 7px 6px",
            innerHTML: _tmi("Deposit", {
                ns: "interface"
            })
        });
        createElem("span", "chest_deposit_btn_holder", {
            id: "chest_deposit_item_1",
            className: "link",
            style: "float: right; margin: 5px 3px;",
            innerHTML: "1",
            onclick: function() {
                Chest.deposit(1)
            }
        });
        createElem("span", "chest_deposit_btn_holder", {
            id: "chest_deposit_item_all",
            className: "link",
            style: "float: right; margin: 5px 3px;",
            innerHTML: _tmi("All", {
                ns: "interface"
            }),
            onclick: function() {
                Chest.deposit(99)
            }
        });
        createElem("span", "chest_deposit_btn_holder", {
            id: "chest_deposit_item_pet",
            className: "link",
            style: "float: right; margin: 5px 3px;",
            innerHTML: _tmi("All", {
                ns: "interface"
            }) + "+",
            onclick: function() {
                Chest.deposit_all()
            }
        });
        for (b = 0; 60 > b; b++) getElem("chest_" + b).onmouseover = new Function("Chest.mouseoverColor(this,true);"), getElem("chest_" + b).onmouseout = new Function("Chest.mouseoverColor(this,false);"), getElem("chest_" + b).onclick = function() {};
        getElem("chest_colCheck").checked = Mods.Chestm.chest_colCheck;
        getElem("chest_colCheckF").checked = Mods.Chestm.chest_colCheckF; - 1 < navigator.userAgent.search("Chrome") &&
            (getElem("chest_invColor").value = Mods.Chestm.inv_select_color, getElem("chest_favColor").value = Mods.Chestm.fav_select_color);
        getElem("chest_sort").onclick = function() {
            Mods.Chestm.chest_sort_hidden = !Mods.Chestm.chest_sort_hidden;
            Mods.Chestm.chest_sort_hidden ? (getElem("chest_sort_holder").style.display = "none", getElem("chest_sort").innerHTML = _tmi("Sort")) : (getElem("chest_sort_holder").style.display = "inline-block", getElem("chest_sort").innerHTML = _tmi("Sort") + " (" + _tmi("Hide").toLowerCase() + ")")
        };
        getElem("chest_invCheck").checked =
            Mods.Chestm.sortInv_check;
        getElem("chest_favCheck").checked = Mods.Chestm.sortFav_check;
        getElem("chest_sort_category").value = Mods.Chestm.armorPriority ? 0 : Mods.Chestm.craftPriority ? 1 : Mods.Chestm.pricePriority ? 2 : -1;
        getElem("chest").onclick = function(b) {
            var f = b.target || {};
            b = f.id || !1;
            var g = /chest_[0-9]/.test(b);
            !g && (f = f.parentNode) && (f = f.id, /chest_[0-9]/.test(f) && (b = f, g = !0));
            g && (b = b.replace("chest_", ""));
            f = Mods.Chestm.ctrlPressed;
            g && (f ? (b = parseInt(b) + 60 * (parseInt(chest_page) - 1), (b = chests[0][b] && chests[0][b].id ||
                !1) && (Mods.Chestm.playerPriorities[b] ? delete Mods.Chestm.playerPriorities[b] : Mods.Chestm.playerPriorities[b] = !0)) : (selected_chest = b, Chest.button_enable_check()));
            localStorage.chestPlayerPriorities = JSON.stringify(Mods.Chestm.playerPriorities);
            Chest.sort_player_modChest()
        };
        getElem("inventory").onclick = function(b) {
            var f = b.target;
            b = f.id;
            var g = /inv_[0-9]/.test(b);
            g && (b = b.replace("inv_", ""));
            var k = Mods.Chestm.ctrlPressed;
            g && k && (g = players[0].temp.inventory[b] && players[0].temp.inventory[b].id || !1) && (Mods.Chestm.avoidAll[g] ?
                delete Mods.Chestm.avoidAll[g] : Mods.Chestm.avoidAll[g] = !0, f.style.borderColor = (Mods.Chestm.avoidAll[g] || !1) && "#00FF00" || "#FF0000", Timers.set("slot_border_" + b, function() {
                    f.style.borderColor = "";
                    Mods.Chestm.ctrlPressed && Mods.Chestm.showAvoidAll(!0)
                }, 1E3), Mods.Chestm.showAvoidAll(!0));
            localStorage.avoidAll = JSON.stringify(Mods.Chestm.avoidAll)
        }
    })();
    Mods.timestamp("chestm")
};
Load.health = function() {
    modOptions.health.time = timestamp();
    BigMenu.in_a_fight = function(b, e) {
        var f = -1 != loadedMods.indexOf("Chatmd") && "" !== Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        Mods.Health.old_inAFight(b, e);
        "undefined" !== typeof b && (skills[0].health.current = b.temp.health, getElem("player_health_name").innerHTML = f + capitaliseFirstLetter(b.name) + " (" + b.temp.health + "/" +
            skills[0].health.level + ")");
        "undefined" != typeof e && (getElem("enemy_health_name").innerHTML = e.name + " (" + e.temp.health + ")")
    };
    Player.update_healthbar = function() {
        var b = -1 != loadedMods.indexOf("Chatmd") && "" !== Mods.Chatmd.afkMessage ? "<span class='pointer' title='" + Mods.Chatmd.afkMessage + "' style='color: #F00;' onclick='javascript:Mods.Chatmd.chatCommands(&apos;/afk&apos;)'>*</span>" : "";
        players[0].temp.healthbar && removeClass(getElem("player_healthbar"), "hidden");
        getElem("player_health_name").innerHTML = b +
            capitaliseFirstLetter(players[0].name) + " (" + skills[0].health.current + "/" + skills[0].health.level + ")"; - 1 == players[0].temp.target_id && (getElem("player_health").style.width = Math.round(skills[0].health.current / skills[0].health.level * 100) + "%")
    };
    Player.update_healthbar();
    Mods.timestamp("health")
};
Load.mosmob = function() {
    modOptions.mosmob.time = timestamp();
    regular_onmousemove = function(b) {
        Mods.regular_onmousemove(b);
        2 == socket_status && (b = translateMousePositionToScreenPosition(b.clientX, b.clientY), 100 > b.x && 100 > b.y || minimap) && (getElem("object_selector_info").style.display = "block")
    };
    updateMouseSelector = function(b) {
        if (hasClass(getElem("mods_tooltip_holder"), "hidden")) {
            var e = getElem("object_selector_info");
            e.style.pointerEvents = "none";
            if (!mouse_over_magic && !mouse_over_quiver) {
                b.clientX = b.clientX || b.pageX ||
                    b.touches && b.touches[0].pageX;
                b.clientY = b.clientY || b.pageY || b.touches && b.touches[0].pageY;
                Math.round(Math.min(window.innerWidth, width * max_scale));
                Math.round(Math.min(window.innerWidth / k, height * max_scale));
                var f = Math.min(16, Math.round(16 * current_ratio_y)),
                    g = translateMousePosition(b.clientX, b.clientY);
                b = "";
                var k = "#FFFF00";
                if (g && map_visible(g.i, g.j) && on_map[current_map] && on_map[current_map][g.i] && on_map[current_map][g.i]) {
                    var m;
                    (m = obj_g(on_map[current_map][g.i][g.j])) || (m = player_map[g.i] && player_map[g.i][g.j] ?
                        player_map[g.i][g.j][0] : !1);
                    if (m && m.name && "Name" != m.name) {
                        b = _tmi(m.name, {
                            ns: "names"
                        });
                        m.b_t == BASE_TYPE.PLAYER && (k = "#FFFFFF", b = capitaliseFirstLetter(m.name) + " (" + FIGHT.calculate_monster_level(m) + ")");
                        m.b_t == BASE_TYPE.PET && (b = _tmi(pets[m.id].name, {
                            ns: "names"
                        }) + "<br/><span style='font-size:" + .7 * f + "px'>" + capitaliseFirstLetter(m.name) + "</span>");
                        if (m.b_t == BASE_TYPE.NPC)
                            if (m.type == OBJECT_TYPE.SHOP) b = b + " (" + _tmi("NPC", {
                                fn: "toUpperCase"
                            }) + ")";
                            else {
                                editor_enabled && (b = b + " (ID:" + m.b_i + ")");
                                b = b + " (" + FIGHT.calculate_monster_level(m) +
                                    ")<br/><span style='font-size:" + .7 * f + "px'>(" + npc_base[m.b_i].temp.total_accuracy + _tmi("Accuracy", {
                                        ns: "interface",
                                        fn: "firstChar"
                                    }) + ", " + npc_base[m.b_i].temp.total_strength + _tmi("Strength", {
                                        ns: "interface",
                                        fn: "firstChar"
                                    }) + ", " + npc_base[m.b_i].temp.total_defense + _tmi("Defense", {
                                        ns: "interface",
                                        fn: "firstChar"
                                    }) + ", " + (npc_base[m.b_i].temp.magic ? npc_base[m.b_i].temp.magic + _tmi("Magic", {
                                        ns: "interface",
                                        fn: "firstChar"
                                    }) + ", " : "") + npc_base[m.b_i].params.health + _tmi("HP") + ")</span>";
                                var n = "undefined" != typeof npc_base[m.b_i].temp.melee_block ?
                                    npc_base[m.b_i].temp.melee_block : !1,
                                    p = "undefined" != typeof npc_base[m.b_i].temp.magic_block ? npc_base[m.b_i].temp.magic_block : !1,
                                    q = "undefined" != typeof npc_base[m.b_i].temp.archery_block ? npc_base[m.b_i].temp.archery_block : !1;
                                if (n || p || q) {
                                    var t = "";
                                    n && (t += _tmi("Melee Block") + ":" + n + " ");
                                    p && (t += _tmi("Magic Block") + ":" + p + " ");
                                    q && (t += _tmi("Archery Block") + ":" + q + " ");
                                    b = b + "<br/><span style='font-size:" + .7 * f + "px'>" + t + "</span>"
                                }
                                0 === Mods.Newmarket.infopannelmode && (b += m.params.aggressive ? "<br/><span style='color:#FF0000;font-size:" +
                                    .7 * f + "px'>" + _tmi("Aggressive") + "</span>" : "<br/><span style='color:#FFFFFF;font-size:" + .7 * f + "px'>" + _tmi("Passive") + "</span>")
                            }
                        m.params.desc && 0 === Mods.Newmarket.infopannelmode && (b = b + "<br/><span style='font-size:" + .7 * f + "px'><i>" + _tmi(m.params.desc, {
                            ns: "interface"
                        }) + "</i></span>");
                        editor_enabled && (b += "<br/>(i: " + g.i + ", j:" + g.j + ")", m.blocking && (b += "(B)"))
                    }
                }
                editor_enabled && (m = g.i - dx, g = g.j - dy, 10 < g && 11 > m && 1 < m && (g = m - 2 + 9 * (16 - g) + editor_page * editor_page_size, g < BASE_TYPE[tileset].length && 0 <= g && g < (editor_page +
                    1) * editor_page_size && (b = BASE_TYPE[tileset][g].name, BASE_TYPE[tileset][g].blocking && (b += "(B)"))));
                e.innerHTML = b;
                e.style.color = k
            }
            "" === b ? e.style.display = "none" : (2 == Mods.Newmarket.infopannelmode ? (e.style.border = "none", e.style.backgroundColor = "") : (e.className = "menu", e.style.borderRadius = "14px", e.style.padding = "7px", e.style.border = "2px #666 solid", e.style.MozBorderRadius = "10px"), e.style.display = "block")
        }
    };
    InfoPaneltoggle = function() {
        var b = getElem("settings_infopanel");
        switch (Mods.Newmarket.infopannelmode) {
            case 0:
                b.innerHTML =
                    _tmi("Info Panel") + ": " + _tmi("no inspect");
                Mods.Newmarket.infopannelmode = 1;
                break;
            case 1:
                b.innerHTML = _tmi("Info Panel") + ": " + _tmi("transparent");
                Mods.Newmarket.infopannelmode = 2;
                break;
            default:
                b.innerHTML = _tmi("Info Panel") + " : " + _tmi("full"), Mods.Newmarket.infopannelmode = 0
        }
        localStorage.infopanelmode = JSON.stringify(Mods.Newmarket.infopannelmode)
    };
    Mods.Mosmob.createDiv = function() {
        if (null !== getElem("mods_tooltip_holder")) return !1;
        createElem("div", wrapper, {
            id: "mods_tooltip_holder",
            className: "menu hidden",
            style: "position: absolute; left: 50%; margin-left: -122px; top: 3.4%; font-size: 0.7em; padding: 7px; border: 2px solid #666; border-radius: 14px; z-index: 100; max-width: 230px;"
        });
        Mods.Mosmob.holder_html_template = Handlebars.compile("<div id='mods_tooltip_name' style='position: relative; width: 100%; float: left; text-align: center;'>&nbsp;</div><div id='mods_tooltip_content' style='position: relative; width: 100%; float: left; clear: left; padding: 3px 6px 1px 0px;'>&nbsp;</div>");
        getElem("mods_tooltip_holder").innerHTML =
            Mods.Mosmob.holder_html_template()
    };
    Mods.Mosmob.gatherParams = function(b) {
        var e = {},
            f = item_base[b];
        if (void 0 == f || void 0 == f.params) return !1;
        var g = f.params,
            k;
        e.name = f.name;
        e.owned = "";
        var f = 0 + Inventory.get_item_count(players[0], b),
            m;
        for (m in players[0].pet.chest) players[0].pet.chest[m] == b && (f += 1);
        for (m in chests[0])
            if (chests[0][m].id == b) {
                0 < chests[0][m].count && (f += chests[0][m].count);
                break
            }
        e.owned += "<span style='color: #FFF'>" + thousandSeperate(f) + "</span>";
        g.min_magic && (g.magic_slots || 10 == g.slot || g.cooldown) ?
            (f = 10 == g.slot ? Magic[g.magic].params : !1, e.spell = !1 === f ? !1 : f.basic_damage + " <span style='color: #AAA;'>" + _tmi("Dmg") + "</span>, " + f.cooldown / 1E3 + "s <span style='color: #AAA;'>" + _tmi("CD") + "</span>, " + f.xp + " <span style='color: #AAA;'>" + _tmi("Exp/Cast") + "</span><br>" + f.penetration + " <span style='color: #AAA;'>" + _tmi("Spell Pen") + "</span>, " + f.uses + " <span style='color: #AAA;'>" + _tmi("Uses/Scroll") + "</span>") : e.spell = !1;
        f = {
            Good: {
                1: 2500,
                2: 8E4
            },
            Great: {
                1: 8E3,
                2: 17E4
            },
            Best: {
                1: 34999,
                2: 45E4
            },
            Legendary: {
                1: 15E4,
                2: 15E5
            },
            Rare: {
                1: 0,
                2: 1
            }
        };
        e.price = void 0 == g.price ? "span style='color: #F00;'>0</span>" : "<span style='color: #FFF;'>" + thousandSeperate(g.price) + "</span> <span style='color: #AAA'>" + _tmi("coins", {
            ns: "interface"
        }) + "</span>";
        e.obtained = "";
        if (modOptions.wikimd.loaded) {
            e.obtained = "";
            var n = Mods.Wikimd.item_formulas[b];
            if (n.craft && n.craft.source) {
                var p = [],
                    q = "";
                for (m in n.craft.source) {
                    var t = n.craft.source[m].skill || n.craft.source[m].patterns[0].skill || !1;
                    t && -1 == p.indexOf(t) && (p.push(t), q += 0 < q.length ? ", " + _tmi(capitaliseFirstLetter(t), {
                        ns: "interface"
                    }) : _tmi(capitaliseFirstLetter(t), {
                        ns: "interface"
                    }))
                }
                0 < q.length && (e.obtained += "<span style='text-align: center'>" + _tmi("Craft") + " <span style='color: #AAA;'>(" + q + ")</span>,&nbsp;</span>")
            }
            n.enchant && n.enchant.from_enchant && (e.obtained += "<span style='text-align: center'>" + _tmi("Craft") + " <span style='color: #AAA;'>(" + _tmi("Enchant") + ")</span>,&nbsp;</span>");
            n.drop && n.drop.sources && (e.obtained += "<span style='text-align: center'>" + _tmi("Drop") + ",&nbsp;</span>");
            if (n.sold && n.sold.sources) {
                e.obtained +=
                    "<span style='text-align: center'>";
                p = !1;
                for (k in n.sold.sources)
                    if (n.sold.sources[k].spawn) {
                        p = !0;
                        break
                    }
                e.obtained = p ? e.obtained + (_tmi("Buy from") + " ") : e.obtained + (_tmi("Sale to") + " ");
                e.obtained += "<span style='color: #AAA;'>(" + _tmi("NPC") + ")</span>,&nbsp;</span>"
            }
        }
        if (void 0 == g.no_present) {
            k = "";
            for (var r in f) g.price >= f[r][1] && g.price <= f[r][2] && (k += _tmi(r) + ", ");
            k = k.slice(0, -2);
            0 !== k.length && (e.obtained += "<span style='text-align: center'>" + _tmi("Present") + " <span style='color: #AAA;'>(" + k + ")</span>,&nbsp;</span>")
        }
        g = !1;
        for (m in ItemPacks)
            if (!g && ItemPacks[m].items)
                for (var x in ItemPacks[m].items) {
                    if (ItemPacks[m].items[x].id == b) {
                        e.obtained += "<span style='text-align: center'>MOS,&nbsp;</span>";
                        g = !0;
                        break
                    }
                } else break;
        0 < e.obtained.length ? (e.obtained = "<span style='text-align: center;'>" + _tmi("Obtained") + ": <span style='color: #FFF'><span style='width: 60%;'>" + e.obtained.slice(0, -14), e.obtained += "</span></span></span>") : e.obtained = !1;
        return e
    };
    Mods.Mosmob.compileInfo = function(b) {
        b = Mods.Mosmob.gatherParams(b);
        if (!1 ===
            b) return !1;
        var e = "<div style='color: #FF0; padding: 0px 10px 2px 10px; text-align: center;'>" + _tmi("Owned") + ": " + b.owned + "<span style='color: #AAA'>,</span> " + _tmi("Value") + ": " + b.price + "<br>",
            e = e + (b.obtained ? b.obtained + "<br>" : ""),
            e = e + (b.spell ? _tmi("Spell Info") + ": <span style='color: #FFF;'>" + b.spell + "</span><br>" : ""),
            e = e + (b.enchant ? _tmi("Enchant Info") + ": <span style='color: #FFF;'>" + b.enchant + "</span>" : "");
        return e + "</div>"
    };
    Mods.Mosmob.updateTooltip = function(b) {
        !1 !== b && -1 < b && "" != b ? (removeClass(getElem("mods_tooltip_holder"),
                "hidden"), getElem("mods_tooltip_name").innerHTML = "<div style='width: 100%; text-align: center; padding-bottom: 4px; padding-top: 1px;'><span style='color: #FF0; font-weight: bold; padding-bottom: 3px; padding-left: 3px; font-size: 1.2em;'>" + Mods.cleanText(_tm(item_base[b].name, {
                ns: "names"
            })) + "</span><br><span style='color: #FF0; padding: 1px 3px 3px 3px; font-style: italic; text-align: center'>" + Items.info(b) + "</span>", getElem("mods_tooltip_content").innerHTML = Mods.Mosmob.compileInfo(b), getElem("object_selector_info").style.display =
            "none") : addClass(getElem("mods_tooltip_holder"), "hidden")
    };
    Mods.Mosmob.findID = function(b) {
        b = b.target || b.srcElement;
        var e = b.id,
            f = /(chest_|cabinet_chest_|shop_|forg_slot_|inv_|pet_inv_|pet_chest_|wiki_row\d_col\d_div_)(\d{1,3})(_(\d{1,2}))?/.exec(e),
            g = b.item_id || b.getAttribute("item_id");
        b = !1;
        if ("forge_result" == e)
            if ("undefined" != typeof forge_formula) g = -1, b = FORGE_FORMULAS[forge_formula], b = void 0 !== b ? b.item_id : !1;
            else {
                Mods.Mosmob.updateTooltip(!1);
                return
            }
        else if (!(f || -1 < g && null !== g)) {
            Mods.Mosmob.updateTooltip(!1);
            return
        }
        if (f)
            if ("chest_" == f[1]) b = parseInt(f[2]), b += 60 * (chest_page - 1), b = chests[0][b], b = void 0 !== b ? b.id : !1;
            else if ("cabinet_chest_" == f[1]) b = parseInt(f[2]), e = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items, b = void 0 !== e ? e[b] : !1;
        else if ("shop_" == f[1]) b = parseInt(f[2]), b = shop_npc.temp.content[b], b = void 0 !== b ? b.id : !1;
        else if ("forg_slot_" == f[1]) b = parseInt(f[2]), e = parseInt(f[4]), b = forge_components[b][e], b = void 0 !== b ? b.id : !1;
        else if ("inv_" == f[1]) b = parseInt(f[2]), b = players[0].temp.inventory[b],
            b = void 0 !== b ? b.id : !1;
        else {
            if ("pet_inv_" == f[1] || "pet_chest_" == f[1]) b = parseInt(f[2]), b = players[0].pet.chest[b], b = parseInt(b)
        } else -1 < g && (b = g); - 1 < b ? Mods.Mosmob.updateTooltip(b) : Mods.Mosmob.updateTooltip(!1)
    };
    getElem("wrapper").onmousemove = regular_onmousemove;
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_infopanel' onclick='InfoPaneltoggle();'>" + _tmi("Info Panel") + ": " + _tmi("full") + "</span>"
    });
    Mods.Mosmob.createDiv();
    InfoPaneltoggle();
    document.body.onmouseover =
        Mods.Mosmob.findID;
    Mods.timestamp("mosmob")
};
Load.fullscreen = function() {
    modOptions.fullscreen.time = timestamp();
    Mods.Fullscreen.toggle = function() {
        var b = getElem("settings_fullscreen"),
            e = getElem("settings_game_grid");
        switch (Mods.Fullscreen.enabled) {
            case 0:
                b.innerHTML = _tmi("Fullscreen Mode") + " (" + _tmi("off") + ")";
                Mods.Fullscreen.enabled = 1;
                e.onclick = function() {
                    toggleGridSize()
                };
                e.style.color = "";
                fullscreen_mode = !1;
                c.base.width = width;
                map_increase = 4;
                break;
            default:
                b.innerHTML = _tmi("Fullscreen Mode") + " (" + _tmi("on") + ")<br/><span style='color:red;font-size:10px;'>" +
                    _tmi("WARNING: May impact game performance.") + "</span>", Mods.Fullscreen.enabled = 0, e.onclick = "", e.style.color = "#AAA", map_increase = 6, experimental_fullscreen && (large_offscreen_canvas_width = width + 2 * tile_width, c.base.width = large_offscreen_canvas_width, renderGround(), fullscreen_mode = !0)
        }
        localStorage.fullscreenenabled = JSON.stringify(Mods.Fullscreen.enabled);
        resetMapShift();
        drawMap();
        setCanvasSize(!0)
    };
    iMapBegin = function() {
        return 0 === Mods.Fullscreen.enabled ? -6 : Mods.Fullscreen.iMapBegin()
    };
    jMapBegin = function() {
        return 0 ===
            Mods.Fullscreen.enabled ? -9 : Mods.Fullscreen.jMapBegin()
    };
    iMapTo = function() {
        return 0 === Mods.Fullscreen.enabled ? minimap ? 99 : 24 : Mods.Fullscreen.iMapTo()
    };
    jMapTo = function() {
        return 0 === Mods.Fullscreen.enabled ? minimap ? 99 : 21 : Mods.Fullscreen.jMapTo()
    };
    astar.search = function(b, e, f, g, k) {
        return 0 === Mods.Fullscreen.enabled ? Mods.Fullscreen.astarsearchNew(b, e, f, g, k) : Mods.Fullscreen.astarsearchOld(b, e, f, g, k)
    };
    Mods.Fullscreen.astarsearchNew = function(b, e, f, g, k) {
        var m;
        m = 6 == map_increase ? 15 : 5 + map_increase / 2;
        astar.init(b,
            e, m + 1);
        k = k || astar.manhattan;
        g = !!g;
        var n = astar.heap();
        for (n.push(e); 0 < n.size();) {
            var p = n.pop();
            if (p === f) {
                b = p;
                for (e = []; b.parent;) e.push(b), b = b.parent;
                return e.reverse()
            }
            p.closed = !0;
            for (var q = astar.neighbors(b, p, g, e, m), t = 0, r = q.length; t < r; t++) {
                var x = q[t];
                if (!x.closed && !x.isWall()) {
                    var y = p.g + x.cost,
                        A = x.visited;
                    if (!A || y < x.g) x.visited = !0, x.parent = p, x.h = x.h || k(x.pos, f.pos), x.g = y, x.f = x.g + x.h, A ? n.rescoreElement(x) : n.push(x)
                }
            }
        }
        return []
    };
    createElem("div", "options_video", {
        innerHTML: "<span class='wide_link pointer' id='settings_fullscreen' onclick='Mods.Fullscreen.toggle();'>" +
            _tmi("Fullscreen Mode") + " (" + _tmi("off") + ")</span>"
    });
    getElem("my_text").style.zIndex = "90";
    Mods.Fullscreen.toggle();
    Mods.timestamp("fullscreen")
};
Load.autocast = function() {
    modOptions.autocast.time = timestamp();
    Mods.Autocast.toggle = function() {
        var b = getElem("settings_autocast");
        switch (Mods.Autocast.enabled) {
            case 0:
                b.innerHTML = _tmi("Autocast") + " (" + _tmi("off") + ")";
                Mods.Autocast.enabled = 1;
                break;
            default:
                b.innerHTML = _tmi("Autocast") + " (" + _tmi("on") + ")", Mods.Autocast.enabled = 0
        }
        localStorage.autocastenabled = JSON.stringify(Mods.Autocast.enabled)
    };
    Mods.Autocast.socketOn = {
        actions: ["attack"],
        fn: function(b, e, f) {
            0 === Mods.Autocast.enabled && 0 < players[0].params.magic_slots &&
                "attack" === b && ("0" != f.defender && "0" != f.attacker || setTimeout(function() {
                    Mods.Autocast.TryCast()
                }, 175))
        }
    };
    Mods.Autocast.TryCast = function() {
        if (inAFight && 0 === Mods.Autocast.enabled) {
            for (var b = 0; b < players[0].params.magic_slots; b++) players[0].params.magics[b] && players[0].params.magics[b].ready && Player.client_use_magic(b, !0);
            Mods.Autocast.lastFullCast = timestamp();
            setTimeout(function() {
                Mods.Autocast.TryCast()
            }, 190)
        }
    };
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_autocast' onclick='Mods.Autocast.toggle();'>" +
            _tmi("Autocast") + " (" + _tmi("off") + ")</span>"
    });
    Mods.Autocast.toggle();
    Mods.timestamp("autocast")
};
Load.kbind = function() {
    modOptions.kbind.time = timestamp();
    Mods.Kbind.Init = function() {
        for (var b = Mods.Kbind.AKbind, e = 0; e < b.length; e++) getElem("kbinding_" + e).checked ? (b[e].value = getElem("kbind_" + e).value, b[e].enabled = !0) : (b[e].value = 0, b[e].enabled = !1);
        localStorage.AKbind = JSON.stringify(b)
    };
    Mods.Kbind.CastAll = function() {
        if (inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast && GAME_STATE != GAME_STATES.CHAT) {
            for (var b = 0; b < players[0].params.magic_slots; b++) players[0].params.magics[b] && players[0].params.magics[b].ready &&
                Player.client_use_magic(b, !0);
            Mods.Autocast.lastFullCast = timestamp()
        }
    };
    Mods.blockKbind = !1;
    Mods.Kbind.Process = function(b, e) {
        var f = Mods.Kbind.AKbind,
            g = document.activeElement && ("number" == document.activeElement.type || "text" == document.activeElement.type);
        if (GAME_STATE != GAME_STATES.CHAT && !g && hasClass(getElem("market"), "hidden") && !captcha && !Mods.blockKbind) {
            f[0].enabled && e == f[0].value && !players[0].temp.busy && Chest.deposit_all();
            f[1].enabled && e == f[1].value && !players[0].temp.busy && Mods.Petinv.unload();
            if (f[2].enabled &&
                e == f[2].value && inAFight && 150 < timestamp() - Mods.Autocast.lastFullCast) {
                for (g = 0; g < players[0].params.magic_slots; g++) players[0].params.magics[g].ready && Player.client_use_magic(g, !0);
                Mods.Autocast.lastFullCast = timestamp()
            }
            f[3].enabled && e == f[3].value && inAFight && 150 < timestamp() - lastRunAwayAttempt && Socket.send("run_from_fight", {});
            lastRunAwayAttempt = timestamp();
            f[4].enabled && e == f[4].value && !players[0].temp.busy && Mods.Kbind.DestroyResource();
            f[5].enabled && e == f[5].value && !players[0].temp.busy && Mods.Petinv.load();
            f[6].enabled && e == f[6].value && !players[0].temp.busy && Mods.Kbind.eatfood();
            f[7].enabled && e == f[7].value && (getElem("inventory").style.zIndex = "199", Mods.showBag = !Mods.showBag.valueOf(), Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "");
            if (f[8].enabled && e == f[8].value && (f = getElem("chest"), !hasClass(f, "hidden"))) {
                f = 60 * (parseInt(chest_page) - 1) + parseInt(selected_chest);
                f = item_base[chests[0][f].id];
                g = f.params;
                b = f.b_t;
                var k = !1;
                (g.min_cooking || g.min_forging || g.min_jewelry ||
                    g.min_alchemy || g.min_farming || g.min_archery || g.min_mining || -1 < f.name.indexOf("Fabric") || -1 < f.name.indexOf("Enchant Scroll") || 1 < g.min_magic && 5 != b && 0 !== b && -1 == f.name.indexOf("Teleport") || 1 == b) && 4 != b && 14 != g.slot && (k = !0);
                k && Chest.withdraw(99);
                !k && Chest.withdraw(1)
            }
        }
    };
    Mods.Kbind.eatfood = function() {
        if (GAME_STATE != GAME_STATES.CHAT && skills[0].health.level > skills[0].health.current && 250 < timestamp() - Mods.Kbind.lastfoodeaten) {
            for (var b = !1, e = 0; e < players[0].temp.inventory.length; e++)
                if ("undefined" != typeof item_base[players[0].temp.inventory[e].id].params.heal) {
                    b =
                        left_click_cancel ? !0 : !1;
                    left_click_cancel = !1;
                    inventoryClick(e) && (Mods.Kbind.lastfoodeaten = timestamp());
                    left_click_cancel = b;
                    b = !0;
                    break
                }
            b || addChatText(_tm("You have no food in inventory!"), void 0, COLOR.WHITE)
        }
    };
    Mods.Kbind.ResourceList = {
        ores: [30, 31, 32, 33, 184, 185, 186, 373, 383, 484, 657, 1447, 1887, 187],
        logs: [29, 296, 313, 314, 594, 595, 596, 597, 2129, 2130],
        fishes: [8, 10, 12, 14, 16, 1368, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 1370, 1372, 1374, 1376, 1378, 1381, 1384, 1386,
            1390, 1392
        ]
    };
    Mods.Kbind.DestroyResource = function(b) {
        if (GAME_STATE != GAME_STATES.CHAT && (b = b || !1, 0 !== b.length))
            if (b) {
                var e = b.shift();
                Popup.prompt(_tmi("Do you want to destroy all {item_type} in your bag?", {
                    item_type: e
                }), function() {
                    Mods.Kbind.destroyCycle(e);
                    Mods.Kbind.DestroyResource(b)
                }, function() {
                    Mods.Kbind.DestroyResource(b)
                })
            } else {
                var f = [],
                    g = players[0].temp.inventory,
                    k;
                for (k in g) {
                    var m = parseInt(g[k].id),
                        n;
                    for (n in Mods.Kbind.ResourceList) {
                        if (-1 != f.indexOf(n)) break;
                        if (-1 != Mods.Kbind.ResourceList[n].indexOf(m)) {
                            f.push(n);
                            break
                        }
                    }
                }
                0 < f.length && Mods.Kbind.DestroyResource(f)
            }
    };
    Mods.Kbind.destroyCycle = function(b) {
        if ("undefined" != typeof b) {
            var e = players[0].temp.inventory,
                f = [],
                g;
            for (g in e) {
                var k = parseInt(e[g].id);
                Mods.Kbind.ResourceList[b] && -1 != Mods.Kbind.ResourceList[b].indexOf(k) && -1 == f.indexOf(k) && (f.push(k), Mods.Kbind.destroyItem(k, 50 + 50 * f.length))
            }
        }
    };
    Mods.Kbind.destroyItem = function(b, e) {
        "undefined" != typeof b && Timers.set("destroy_cycle_" + b, function() {
            Socket.send("inventory_destroy", {
                item_id: b,
                all: !0
            })
        }, e || 50)
    };
    Mods.Kbind.eventListener = {
        keys: {
            keyup: [!0]
        },
        fn: function(b, e) {
            0 != GAME_STATE && Mods.Kbind.Process(b, e)
        }
    };
    (function() {
        Mods.Kbind.AKbind = [{
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 0,
            enabled: !1
        }, {
            value: 66,
            enabled: !0
        }, {
            value: 0,
            enabled: !1
        }];
        keylist = {
            0: "<option value=0>(none)</option><option value=8>[BackSpace]</option><option value=9>[Tab]</option><option value=13>[Enter]</option><option value=27>[Esc]</option><option value=33>[PgUp]</option><option value=34>[PgDwn]</option><option value=35>[End]</option><option value=36>[Home]</option><option value=45>[Ins]</option><option value=46>[Delete]</option><option value=66>B</option><option value=67>C</option><option value=69>E</option><option value=70>F</option><option value=71>G</option><option value=72>H</option><option value=73>I</option><option value=74>J</option><option value=75>K</option><option value=76>L</option><option value=77>M</option><option value=78>N</option><option value=79>O</option><option value=80>P</option><option value=81>Q</option><option value=82>R</option><option value=84>T</option><option value=85>U</option><option value=86>V</option><option value=88>X</option><option value=89>Y</option><option value=90>Z</option><option value=96>[Numpad0]</option><option value=97>[Numpad1]</option><option value=98>[Numpad2]</option><option value=99>[Numpad3]</option><option value=100>[Numpad4]</option><option value=101>[Numpad5]</option><option value=102>[Numpad6]</option><option value=103>[Numpad7]</option><option value=104>[Numpad8]</option><option value=105>[Numpad9]</option>"
        };
        createElem("div", wrapper, {
            id: "keybinding_form",
            className: "menu",
            style: "position: absolute; display: none; z-index: 300; width: 330px; height: 245px; top: 50%; left: 50%; margin-left: -115px; margin-top: -122px;",
            innerHTML: "<span class='common_border_bottom'><span style='float:left; font-weight: bold;color:#FFFF00;'>" + _tmi("Keybindings") + "</span><span class='common_link' style='margin:0px;margin-bottom:2px;' onclick='javascript:Mods.Kbind.Init();getElem(\"keybinding_form\").style.display=\"none\";'>" +
                _tmi("Close", {
                    ns: "interface"
                }) + "</span></span><div style='padding-top: 8px;'><table width='100%'><tr><td><input type='checkbox' id='kbinding_0' onclick='void(0);'></td><td><select id='kbind_0' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Deposit All+ in chest") + "</td></tr><tr><td><input type='checkbox' id='kbinding_1' onclick='void(0);'></td><td><select id='kbind_1' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Unload pet inventory") + "</td></tr><tr><td><input type='checkbox' id='kbinding_5' onclick='void(0);'></td><td><select id='kbind_5' class='market_select'>" +
                keylist[0] + "</select></td><td>" + _tmi("Load pet inventory") + "</td></tr><tr><td><input type='checkbox' id='kbinding_2' onclick='void(0);'></td><td><select id='kbind_2' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Cast all magic") + "</td></tr><tr><td><input type='checkbox' id='kbinding_3' onclick='void(0);'></td><td><select id='kbind_3' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Run from fight") + "</td></tr><tr><td><input type='checkbox' id='kbinding_4' onclick='void(0);'></td><td><select id='kbind_4' class='market_select'>" +
                keylist[0] + "</select></td><td>" + _tmi("Destroy all ores/logs/fishes in bag") + "</td></tr><tr><td><input type='checkbox' id='kbinding_6' onclick='void(0);'></td><td><select id='kbind_6' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Eat food in inventory") + "</td></tr><tr><td><input type='checkbox' id='kbinding_7' onclick='void(0);'></td><td><select id='kbind_7' class='market_select'>" + keylist[0] + "</select></td><td>" + _tmi("Toggle inventory") + "</td></tr><tr><td><input type='checkbox' id='kbinding_8' onclick='void(0);'></td><td><select id='kbind_8' class='market_select'>" +
                keylist[0] + "</select></td><td>" + _tmi("Withdraw 1 or All") + "</td></tr></table></div>"
        });
        var b = Mods.Kbind.AKbind;
        localStorage.AKbind = localStorage.AKbind || JSON.stringify(b);
        for (var e = JSON.parse(localStorage.AKbind), f = 0; f < b.length; f++) e[f] = void 0 !== e[f] ? e[f] : b[f];
        b = Mods.Kbind.AKbind = e;
        localStorage.AKbind = JSON.stringify(b);
        for (e = 0; e < b.length; e++) getElem("kbinding_" + e).checked = b[e].enabled, getElem("kbind_" + e).value = b[e].value;
        b = document.createElement("span");
        b.className = "wide_link";
        b.id = "keybinding_link";
        b.style.cssFloat = "left";
        b.onclick = function() {
            getElem("keybinding_form").style.display = "block"
        };
        b.innerHTML = _tmi("Keybindings");
        e = getElem("mods_link");
        getElem("settings").insertBefore(b, e);
        Mods.Kbind.Init();
        CompiledTemplate.magic_slots = Handlebars.compile("{{#each this.magics}}<div class='magic_outer pointer' style='{{magic_image this.id}};'><div class='magic_inner' id='magic_slot_{{this.i}}' onclick='Player.client_use_magic({{this.i}})' onmouseover='mouseOverMagic({{this.i}})' onmouseout='mouseOutMagic({{this.i}})'>{{this.count}}</div></div>{{/each}}<div class='magic_outer'><div class='magic_inner pointer' style='font-size:10px;text-align: center;background-color: rgba(0, 0, 0, 0.8);font-family:initial;' id='magic_slot_all' onclick='Mods.Kbind.CastAll()'>{{_tm 'Cast All'}}</div></div>")
    })();
    Mods.timestamp("kbind")
};
Load.petinv = function() {
    modOptions.petinv.time = timestamp();
    Mods.Petinv.invHeight = function() {
        var b = getElem("inventory"),
            e = getElem("inv_pet_chest"),
            f = getElem("pet_inv_container"),
            g = getElem("pet_inv_expand");
        players[0].pet.enabled ? (removeClass(e, "hidden"), addClass(b, "hasPet"), Mods.Petinv.petInv_toggle ? (removeClass(g, "collapsed caret-down"), addClass(g, "caret-up"), removeClass(f, "hidden"), Mods.Petinv.init_menuInv()) : (removeClass(g, "caret-up"), addClass(g, "collapsed caret-down"), addClass(f, "hidden"))) : (removeClass(b,
            "hasPet"), addClass(e, "hidden"))
    };
    Mods.Petinv.spawnInvPetChest = function() {
        for (a = 0; 24 > a; a++) createElem("div", "pet_inv_items", {
            id: "inv_pet_chest_" + a,
            className: "inv_item",
            innerHTML: "&nbsp;"
        })
    };
    Mods.Petinv.init_menuInv = function() {
        for (var b = 0; 24 > b; b++) players[0].pet.enabled && (getElem("inv_pet_chest_" + b).style.display = pets[players[0].pet.id].params.inventory_slots > b ? "inline-block" : "none");
        if (players[0].pet.enabled) {
            for (b = 0; b < pets[players[0].pet.id].params.inventory_slots; b++) {
                var e = getElem("inv_pet_chest_" +
                    b);
                removeClass(e, "selected");
                if ("undefined" != typeof players[0].pet.chest[b]) {
                    var f = item_base[players[0].pet.chest[b]];
                    e.style.background = Items.get_background(f.b_i)
                } else e.style.background = ""
            }
            b = pets[players[0].pet.id];
            b = b.params.xp_required ? _tmi("Pet experience {xp}/{total} ({percent}%)", {
                ns: "interface",
                xp: Math.round(players[0].pet.xp),
                total: b.params.xp_required,
                percent: Math.floor(players[0].pet.xp / b.params.xp_required * 100)
            }) : b.params.requires_stone ? _tmi("Pet needs {item_name} to evolve.", {
                ns: "interface",
                item_name: item_base[710].name
            }) : _tmi("Pet has reached its maximum level", {
                ns: "interface"
            }) + ".";
            getElem("inv_pet_level").innerHTML = b
        }
        for (b = 0; 40 > b; b++) e = getElem("inv_" + b), "undefined" != typeof players[0].temp.inventory[b] ? (f = item_base[players[0].temp.inventory[b].id], e.style.background = Items.get_background(f.b_i)) : e.style.background = ""
    };
    Mods.Petinv.invSendItemCheck = function(b) {
        enableShiftClick = getElem("shift_click").checked;
        return !1 === Mods.Petinv.petInv_toggle || !1 === players[0].pet.enabled ? !1 : !0 === b &&
            !0 === enableShiftClick || !1 === b && !1 === enableShiftClick ? !0 : !1
    };
    Mods.Petinv.createFunc = function(b) {
        return function(e) {
            Mods.disableInvClick || (Mods.Petinv.invSendItemCheck(e.shiftKey) ? Pet.menu_add(b) : (inventoryClick(b), left_click_cancel = !0))
        }
    };
    Mods.Petinv.socketOn = {
        actions: ["my_pet_data", "skills"],
        fn: function(b, e) {
            if ("my_pet_data" == b || "skills" == b) Mods.Petinv.init_menuInv(), Mods.Petinv.invHeight()
        }
    };
    Mods.Petinv.setCanvasSize = function() {
        var b = getElem("wrapper"),
            e = getElem("inventory");
        420 > parseInt(b.style.height) ?
            addClass(e, "isSmall") : removeClass(e, "isSmall")
    };
    Mods.Petinv.unload = function(b) {
        Pet.menu_unload()
    };
    Mods.Petinv.load = function(b) {
        Pet.menu_load()
    };
    (function() {
        createElem("div", "inventory", {
            id: "inv_pet_chest"
        });
        createElem("div", "inv_pet_chest", {
            id: "pet_inv_expand",
            className: "caret-down",
            innerHTML: _tmi("Pet's chest", {
                ns: "interface"
            })
        });
        createElem("div", "inv_pet_chest", {
            id: "pet_inv_container"
        });
        createElem("div", "pet_inv_container", {
            id: "pet_inv_items"
        });
        createElem("div", "pet_inv_container", {
            id: "inv_pet_settings"
        });
        createElem("div", "inv_pet_settings", {
            id: "inv_pet_level",
            innerHTML: _tmi("Pet has reached its maximum level", {
                ns: "interface"
            }) + "."
        });
        createElem("div", "inv_pet_settings", {
            id: "inv_pet_btn_holder"
        });
        createElem("span", "inv_pet_btn_holder", {
            id: "pet_inv_unload",
            className: "common_link",
            innerHTML: _tmi("unload", {
                fn: "capitaliseFirstLetter"
            }),
            onclick: "Mods.Petinv.unload()"
        });
        createElem("span", "inv_pet_btn_holder", {
            id: "pet_inv_load",
            className: "common_link",
            innerHTML: _tmi("load", {
                fn: "capitaliseFirstLetter"
            }),
            onclick: "Mods.Petinv.load()"
        });
        createElem("div", "inv_pet_settings", {
            id: "inv_checkbox_holder"
        });
        createElem("div", "inv_checkbox_holder", {
            id: "inv_checkbox",
            title: _tm("When set to (send items), hold Shift and click items in your inventory to send them to your pet chest.") + "\n" + _tm("Regular click uses/equips the items. Toggle to (use items) to reverse this functionality."),
            innerHTML: _tmi("use items = shift+click")
        });
        createElem("input", "inv_checkbox_holder", {
            id: "shift_click",
            type: "checkbox"
        });
        Mods.Petinv.spawnInvPetChest();
        getElem("shift_click").checked =
            Mods.Petinv.enableShiftClick_check;
        for (a = 0; 40 > a; a++) getElem("inv_" + a).onclick = Mods.Petinv.createFunc(a);
        for (a = 0; 24 > a; a++) getElem("inv_pet_chest_" + a).onclick = function(b) {
            return function() {
                Pet.menu_remove(b)
            }
        }(a);
        getElem("pet_inv_expand").onclick = new Function("Mods.Petinv.petInv_toggle = !Mods.Petinv.petInv_toggle; Mods.Petinv.invHeight();");
        Mods.Petinv.invHeight();
        Mods.Petinv.init_menuInv();
        Mods.Petinv.enableShiftClick_check ? (getElem("inv_checkbox").innerHTML = _tmi("send items = shift+click"), getElem("shift_click").checked = !0) : (getElem("inv_checkbox").innerHTML = _tmi("use items = shift+click"), getElem("shift_click").checked = !1);
        getElem("shift_click").onclick = function() {
            Mods.Petinv.enableShiftClick_check = !Mods.Petinv.enableShiftClick_check;
            (localStorage.enableShiftClick = Mods.Petinv.enableShiftClick_check) ? getElem("inv_checkbox").innerHTML = _tmi("send items = shift+click"): getElem("inv_checkbox").innerHTML = _tmi("use items = shift+click")
        }
    })();
    Mods.timestamp("petinv")
};
Load.magicm = function() {
    modOptions.magicm.time = timestamp();
    Mods.Magicm.socketOn = {
        actions: ["message"],
        fn: function(b, e, f) {
            e.color == COLOR.GREEN && e.key && -1 < e.key.search("magic damage") && 0 != e.key.search("Blocked") && (b = e.key.substr(1, e.key.search("magic damage") - 7), Mods.Magicm.show_magic_damage(b))
        }
    };
    Mods.Magicm.show_magic_damage = function(b) {
        var e = getElem("enemy_hit").cloneNode(!0),
            f = Mods.Magicm.enemy,
            g = Mods.Magicm.magic_damage_timers,
            k = 0 === g[0] ? 0 : 0 === g[1] ? 1 : 0 === g[2] ? 2 : 0 === g[3] ? 3 : g[0] <= g[1] ? 0 : g[1] <= g[2] ?
            1 : g[2] <= g[3] ? 2 : 3,
            m = 0 === k || 2 === k ? (k / 2 * -1 - .5) * half_tile_width_round : k / 2 * half_tile_width_round,
            n = -2 * half_tile_height_round,
            p = players[0].temp.target_id,
            p = objects_data[p] || players[p];
        f != p && (f = Mods.Magicm.magic_damage_timers, f[0] = f[1] = f[2] = f[3] = 0, f = Mods.Magicm.enemy = p);
        f && (p = translateTileToCoordinates(f.i, f.j), translateTileToCoordinates(dx, dy), e.id = "magic_" + k + f.id + (new Date).getTime(), removeClass(e, "hidden"), e.innerHTML = getElem("enemy_hit").innerHTML, e.childNodes[1].innerHTML = b, wrapper.appendChild(e), e.style.left =
            (p.x + 16 + players[0].mx + m) * current_ratio_x + "px", e.style.top = (p.y - 40 + players[0].my + n) * current_ratio_y + "px", addClass(e, "opacity_100"), g[k] = 100, setTimeout(function() {
                decreaseOpacity(e, 150, 10);
                Mods.Magicm.decreaseMagic(k, 150, 10)
            }, 150))
    };
    Mods.Magicm.decreaseMagic = function(b, e, f) {
        0 < Mods.Magicm.magic_damage_timers[b] && (Mods.Magicm.magic_damage_timers[b] = Math.max(Mods.Magicm.magic_damage_timers[b] - f, 0), setTimeout(function() {
            Mods.Magicm.decreaseMagic(b, e, f)
        }, e))
    };
    Mods.timestamp("magicm")
};
Load.wikimd = function() {
    modOptions.wikimd.time = timestamp();
    Mods.Wikimd.populate_item_formulas = function() {
        var b = {
                cape: Forge.enchantingChancesCapes,
                weapon: Forge.enchantingChancesWeapon,
                armor: Forge.enchantingChancesArmor,
                jewelry: Forge.enchantingChancesJewelry
            },
            e = [];
        Mods.Wikimd.item_formulas = {};
        for (var f in item_base) {
            var g = item_base[f],
                k = g.b_i,
                m = ITEM_CATEGORY[g.b_t],
                n = g.name,
                p = g.params,
                q = g.temp,
                t = g.img,
                r = Mods.Wikimd.item_slots[p.slot] || "none",
                x = thousandSeperate(p.price),
                y = "none",
                A = "none",
                u = p.enchant_id,
                B = 10 == p.slot ? Magic[p.magic].params : !1,
                C = 20 == p.slot && "undefined" != typeof p.min_archery ? !0 : !1,
                g = p.farming_id || !1;
            "L.Hand" == r && 3 == p.disable_slot && (r = "2 Hands");
            for (var v in skills[0]) "undefined" != typeof p["min_" + v] && (y = capitaliseFirstLetter(v), A = item_base[f].params["min_" + v]);
            "undefined" != typeof p.heal && (y = "Food", A = p.heal);
            Mods.Wikimd.item_formulas[k] = Mods.Wikimd.item_formulas[k] || {};
            Mods.Wikimd.item_formulas[k].id = k;
            Mods.Wikimd.item_formulas[k].type = m;
            Mods.Wikimd.item_formulas[k].name = n;
            Mods.Wikimd.item_formulas[k].params =
                p;
            Mods.Wikimd.item_formulas[k].temp = q;
            Mods.Wikimd.item_formulas[k].img = t;
            Mods.Wikimd.item_formulas[k].skill = y;
            Mods.Wikimd.item_formulas[k].level = A;
            Mods.Wikimd.item_formulas[k].slot = r;
            Mods.Wikimd.item_formulas[k].price = x;
            if (u && (y = Mods.enchantType(Mods.Wikimd.item_formulas[k].id), 0 != y)) {
                var m = b[y],
                    t = {},
                    D;
                for (D in m) n = item_base[D].name || "", -1 != n.indexOf("Enchant Scroll") && (n = n.split(" ")[0].toLowerCase(), q = +Math.min(1, (p.enchant_bonus || 0) + (m[D](A) || 0)).toFixed(2), t[n] = {
                    percent: q,
                    xp: FORGE_MATERIAL_XP[D] ||
                        0
                });
                Mods.Wikimd.item_formulas[k].enchant = Mods.Wikimd.item_formulas[k].enchant || {};
                Mods.Wikimd.item_formulas[k].enchant.to_enchant = u;
                Mods.Wikimd.item_formulas[k].enchant.type = y;
                Mods.Wikimd.item_formulas[k].enchant.low = t.low || {};
                Mods.Wikimd.item_formulas[k].enchant.med = t.medium || {};
                Mods.Wikimd.item_formulas[k].enchant.high = t.high || {};
                Mods.Wikimd.item_formulas[k].enchant.sup = t.superior || {};
                Mods.Wikimd.item_formulas[u] = Mods.Wikimd.item_formulas[u] || {};
                Mods.Wikimd.item_formulas[u].enchant = Mods.Wikimd.item_formulas[u].enchant || {};
                Mods.Wikimd.item_formulas[u].enchant.from_enchant = k
            }
            B && (Mods.Wikimd.item_formulas[k].magic = B, Mods.Wikimd.item_formulas[k].magic.min_level = A);
            if (C) {
                var A = {},
                    E;
                for (E in p) 0 === E.indexOf("archery_") && (A[E] = p[E]);
                Mods.Wikimd.item_formulas[k].arrow = A;
                Mods.Wikimd.item_formulas[k].arrow.min_level = p.min_archery
            }
            g && e.push(k)
        }
        for (f in object_base)
            if (y = object_base[f], n = {}, n.name = y.name, n.id = y.b_i, n.img = y.img, "undefined" != typeof y.params.results)
                for (v in p = y.params.results, p) {
                    y = p[v].skill;
                    D = p[v].returns;
                    var b =
                        p[v].requires || [],
                        u = p[v].requires_one_from || [],
                        w;
                    for (w in D)
                        if (g = D[w], k = g.id, A = g.level, B = g.base_chance || null, C = g.max_chance || null, m = g.xp || null, t = g.consumes || null, "health" != y) {
                            Mods.Wikimd.item_formulas[k].craft = Mods.Wikimd.item_formulas[k].craft || {};
                            Mods.Wikimd.item_formulas[k].craft.source = Mods.Wikimd.item_formulas[k].craft.source || {};
                            for (E in Mods.Wikimd.item_formulas[k].craft.source)
                                if (Mods.Wikimd.item_formulas[k].craft.source[E].name == n.name) {
                                    n.id = Mods.Wikimd.item_formulas[k].craft.source[E].id;
                                    break
                                }
                                "undefined" == typeof Mods.Wikimd.item_formulas[k].craft.source[n.id] && (Mods.Wikimd.item_formulas[k].craft.source[n.id] = {}, Mods.Wikimd.item_formulas[k].craft.source[n.id].object = n, Mods.Wikimd.item_formulas[k].craft.source[n.id].name = n.name, Mods.Wikimd.item_formulas[k].craft.source[n.id].id = n.id);
                            Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns = Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns || {};
                            var g = !0,
                                z = 0,
                                G;
                            for (G in Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns) q =
                                Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns[G], q.skill == y && q.xp == m && q.base_chance == B && q.max_chance == C && (g = JSON.stringify(q.requires.sort()) !== JSON.stringify(b.sort()), q = JSON.stringify(q.requires_one_from.sort()) !== JSON.stringify(u.sort()), g = g || q ? !0 : !1), g && z++;
                            g && (Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns[z] = {
                                consumes: t,
                                requires: b,
                                requires_one_from: u,
                                base_chance: B,
                                max_chance: C,
                                skill: y,
                                xp: m,
                                level: A
                            })
                        }
                }
            for (z in FORGE_FORMULAS) {
                g = FORGE_FORMULAS[z];
                k = g.item_id;
                y = object_base[36];
                n = {};
                n.name = y.name;
                n.id = y.b_i;
                n.type = y.type;
                n.img = y.img;
                n.b_t = y.b_t;
                y = "forging";
                g.fletching_level && (y = "fletching");
                A = g.level || g.fletching_level;
                E = g.chance;
                q = g.pattern || null;
                m = g.xp;
                b = JSON.parse(JSON.stringify(g.materials));
                t = {};
                for (f in b) t[f] = b[f];
                delete t[36];
                b[36] = 1;
                Mods.Wikimd.item_formulas[k].craft = Mods.Wikimd.item_formulas[k].craft || {};
                Mods.Wikimd.item_formulas[k].craft.source = Mods.Wikimd.item_formulas[k].craft.source || {};
                Mods.Wikimd.item_formulas[k].craft.source[n.id] = Mods.Wikimd.item_formulas[k].craft.source[n.id] || {};
                Mods.Wikimd.item_formulas[k].craft.source[n.id].object = n;
                Mods.Wikimd.item_formulas[k].craft.source[n.id].skill = y;
                Mods.Wikimd.item_formulas[k].craft.source[n.id].level = A;
                Mods.Wikimd.item_formulas[k].craft.source[n.id].xp = m;
                Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns = Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns || {};
                Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns[z] = {
                    pattern: q,
                    requires: b,
                    chance: E,
                    consumes: t
                }
            }
        for (z in CARPENTRY_FORMULAS) {
            w = CARPENTRY_FORMULAS[z];
            n = {
                name: "House"
            };
            n.type = z;
            E = 1;
            var y = "Carpentry",
                F;
            for (F in w)
                if (g = w[F], k = g.item_id, A = g.level, t = g.consumes || [], g.craftable && 0 !== t.length) {
                    m = 0;
                    for (f in t) "length" != f && (m += CARPENTRY_MATERIAL_XP[t[f].id] * t[f].count);
                    Mods.Wikimd.item_formulas[k].craft = Mods.Wikimd.item_formulas[k].craft || {};
                    Mods.Wikimd.item_formulas[k].craft.source = Mods.Wikimd.item_formulas[k].craft.source || {};
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry = Mods.Wikimd.item_formulas[k].craft.source.Carpentry || {};
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.object =
                        n;
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.skill = y;
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.level = A;
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.xp = m;
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.patterns = Mods.Wikimd.item_formulas[k].craft.source.Carpentry.patterns || {};
                    Mods.Wikimd.item_formulas[k].craft.source.Carpentry.patterns[F] = {
                        requires: t,
                        chance: E,
                        consumes: t
                    }
                }
        }
        for (z in e) k = item_base[e[z]], F = object_base[k.params.farming_id], A = k.params.min_farming, k = F.params.results[0].returns[0].id,
            Mods.Wikimd.item_formulas[k].craft.source[F.b_i] && Mods.Wikimd.item_formulas[k].craft.source[F.b_i].patterns && (q = Mods.Wikimd.item_formulas[k].craft.source[F.b_i].patterns[0], q.level = A, q.consumes = [{
                id: e[z],
                count: 1
            }]);
        for (z in FLETCHING_FORMULAS) {
            g = FLETCHING_FORMULAS[z];
            k = g.item_id;
            y = object_base[398];
            n = {};
            n.name = y.name;
            n.id = y.b_i;
            n.type = y.type;
            n.img = y.img;
            n.b_t = y.b_t;
            y = "fletching";
            A = g.level;
            E = g.chance;
            q = g.pattern || null;
            m = g.xp;
            t = {};
            for (f in q) t[q[f]] = 1;
            Mods.Wikimd.item_formulas[k].craft = Mods.Wikimd.item_formulas[k].craft || {};
            Mods.Wikimd.item_formulas[k].craft.source = Mods.Wikimd.item_formulas[k].craft.source || {};
            Mods.Wikimd.item_formulas[k].craft.source[n.id] = Mods.Wikimd.item_formulas[k].craft.source[n.id] || {};
            Mods.Wikimd.item_formulas[k].craft.source[n.id].object = n;
            Mods.Wikimd.item_formulas[k].craft.source[n.id].skill = y;
            Mods.Wikimd.item_formulas[k].craft.source[n.id].level = A;
            Mods.Wikimd.item_formulas[k].craft.source[n.id].xp = m;
            Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns = Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns || {};
            Mods.Wikimd.item_formulas[k].craft.source[n.id].patterns[z] = {
                pattern: q,
                chance: E,
                consumes: t
            }
        }
        for (f in npc_base) {
            y = npc_base[f];
            if ("undefined" != typeof y.params.drops)
                for (v in z = y.params.drops, z) g = z[v], k = g.id, n = y.name, e = y.b_i, m = y.b_t, t = y.img, E = g.chance, A = y.level, Mods.Wikimd.item_formulas[k].drop = Mods.Wikimd.item_formulas[k].drop || {}, Mods.Wikimd.item_formulas[k].drop.sources = Mods.Wikimd.item_formulas[k].drop.sources || {}, Mods.Wikimd.item_formulas[k].drop.sources[f] = {
                    name: n,
                    id: e,
                    level: A,
                    type: m,
                    chance: E,
                    img: t
                };
            if ("undefined" != typeof y.temp.content)
                for (v in A = y.temp.content, A) g = A[v], k = g.id, n = y.name, e = y.b_i, m = y.b_t, t = y.img, z = g.count || 0, F = g.spawn || !1, Mods.Wikimd.item_formulas[k].sold = Mods.Wikimd.item_formulas[k].sold || {}, Mods.Wikimd.item_formulas[k].sold.sources = Mods.Wikimd.item_formulas[k].sold.sources || {}, Mods.Wikimd.item_formulas[k].sold.sources[f] = {
                    name: n,
                    id: e,
                    count: z,
                    type: m,
                    spawn: F,
                    img: t
                }
        }
        Mods.Wikimd.populate_formulas()
    };
    Mods.Wikimd.populate_formulas = function() {
        var b = Mods.Wikimd.item_formulas,
            e = Mods.Wikimd.formulas = {},
            f = 0,
            g, k, m, n, p, q;
        for (q in b)
            if ("undefined" != typeof b[q].craft && "undefined" != typeof b[q].craft.source)
                for (var t in b[q].craft.source) {
                    var r = b[q].craft.source[t].patterns,
                        x;
                    for (x in r) {
                        e[f] = {};
                        e[f].id = b[q].id;
                        e[f].img = b[q].img;
                        e[f].name = b[q].name;
                        e[f].object = b[q].craft.source[t].object;
                        e[f].pattern = r[x];
                        e[f].level = "undefined" != typeof r[x].level && (0 === r[x].level ? 1 : r[x].level) || b[q].craft.source[t].level;
                        e[f].skill = r[x].skill || b[q].craft.source[t].skill;
                        e[f].xp = r[x].xp || b[q].craft.source[t].xp;
                        g = {};
                        k = e[f].pattern.requires;
                        m = {};
                        n = e[f].pattern.consumes;
                        for (p in n) "object" == typeof n[p] ? m[n[p].id] = n[p].count : m[p] = n[p];
                        for (p in k) "object" == typeof k[p] ? "undefined" != typeof k[p].id && "undefined" != typeof k[p].count ? g[k[p].id] = k[p].count : g[k[p]] = 1 : "Anvil" != e[f].object.name ? g[k[p]] = 1 : g[p] = k[p];
                        n = k = 0;
                        for (p in g) "length" != p && (k += parseInt(g[p]));
                        for (p in m) "length" != p && (n += parseInt(m[p]));
                        delete e[f].pattern.consumes;
                        delete e[f].pattern.requires;
                        e[f].pattern.requires = g;
                        e[f].pattern.consumes = m;
                        e[f].pattern.requires.length =
                            k;
                        e[f].pattern.consumes.length = n;
                        f++
                    }
                }
    };
    Mods.Wikimd.populate_pets = function() {
        for (var b = Mods.Wikimd.pet_family = {}, e = 0, f = pets.length, e = 0; 2 > e; e++)
            for (var g in pets) {
                var k = f - g,
                    m = pets[k].params.item_id,
                    n = pets[k].params.level;
                b[m] = b[m] || {};
                b[m][n] = m;
                k = pets[k].params.next_pet_item_id;
                void 0 !== k && (b[m][n + 1] = k);
                for (var p in b[m])
                    for (var q in b[m]) b[b[m][p]] = b[b[m][p]] || {}, b[b[m][p]][q] = b[m][q];
                if (1 == e)
                    for (p in Mods.Wikimd.formulas)
                        if (Mods.Wikimd.formulas[p].id == m && "Big Treasure Chest" != Mods.Wikimd.formulas[p].object.name) {
                            b[m] =
                                Mods.Wikimd.formulas[p];
                            break
                        }
            }
    };
    Mods.Wikimd.populate_family = function() {
        var b = Mods.Wikimd.pet_family,
            e = Mods.Wikimd.family = {},
            f;
        for (f in b) {
            var g = void 0 !== b[f][1] ? b[f][1] : void 0 !== b[f][2] ? b[f][2] : void 0 !== b[f][3] ? b[f][3] : void 0 !== b[f][4] ? b[f][4] : b[f][5];
            "number" == typeof g && 0 < g && (g = pets[item_base[g].params.pet].name, g = g.replace(/ ?(Baby|\[|\]|Ancient|Legendary|Rare|Common) ?/gi, ""), e[f] = g)
        }
    };
    Mods.Wikimd.loadDivs = function() {
        createElem("div", "mods_form", {
            id: "mod_wiki_mods_options",
            className: "common_border_bottom scrolling_allowed",
            style: "width: 100%; height: 24px; margin-bottom: 5px; font-size: .8em; display: none;",
            innerHTML: "<select     id='mods_wiki_type'                  class='market_select scrolling_allowed'             style='float:left;     margin:0px;                         width:70px;'></select><select     id='mods_wiki_type_item'             class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_monster'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_vendor'           class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_craft'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_enchant'          class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_pet'              class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_spell'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_arrow'            class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:70px;         display:none;                        '></select><select     id='mods_wiki_type_item_type'        class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_item_skill'       class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_skill'      class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><select     id='mods_wiki_type_craft_source'     class='market_select scrolling_allowed'             style='float:left;     margin:0px;     margin-left:6px;     width:80px;         display:none;                        '></select><input      id='mods_wiki_name' type='text'      class='market_select scrolling_allowed'             style='float:left;                     margin-left:6px;     width:200px;        display:none;     height:16px;       '></input><button     id='mods_wiki_load'                  class='market_select pointer scrolling_allowed'     style='                margin:0px;                                                                margin-bottom:2px; '>Go!</button>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_range_separate",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; height: 20px; display: none; border-left: 1px solid #FFF;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<select id='mods_wiki_range' class='market_select scrolling_allowed' style='float:left; margin-left:6px; width:70px; display:none; margin-top:0px;'></input>"
        });
        createElem("span", "mod_wiki_mods_options", {
            id: "mods_wiki_level",
            className: "scrolling_allowed",
            style: "float: left; margin-left: 6px; display: none;",
            onclick: "javascript:Mods.Wikimd.loadWikiType(false);",
            innerHTML: "<input type='text' id='mods_wiki_level_low' class='market_select scrolling_allowed' style='width: 25px; margin-right: 5px; height:16px; float:left;'><span class='scrolling_allowed' style='float:left; margin-top:3px;'>to</span><input type='text' id='mods_wiki_level_high' class='market_select scrolling_allowed' style='width: 25px;margin-left: 5px; height:16px; float:left;'>"
        });
        for (var b =
                "", e = 0; 300 > e; e++)
            for (var f = 0; 3 > f; f++)
                if (0 === f) b += "<tr class='scrolling_allowed wiki_f2 hidden' id='wiki_row" + f + "_" + e + "'><td colspan='7'>&nbsp;</td></tr>";
                else {
                    for (var g = "<tr class='scrolling_allowed hidden' id='wiki_row" + f + "_" + e + "'>", k = e, m = f, n = "", p = 0; 6 > p; p++) {
                        var q = "<td class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_" + k + "'>",
                            t = (0 === k ? "<div style='padding-top: 3px' " : "<span ") + "class='scrolling_allowed' id='wiki_row",
                            r = "<div class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_div_" + k + "'>";
                        0 ===
                            p && (r += "<div class='scrolling_allowed' id='wiki_row" + m + "_col" + p + "_img_" + k + "'>&nbsp;</div>");
                        r += t + m + "_col" + p + "_text_" + k + (0 === k ? "'>&nbsp;</div>" : "'>&nbsp;</span>");
                        r += "</div>";
                        n += q + r + "</td>"
                    }
                    b += g + n + "</tr>"
                }
        createElem("div", "mods_form", {
            id: "mod_wiki_options",
            className: "scrolling_allowed",
            style: "display: block; height: 250px; overflow-x: hidden;",
            innerHTML: "<span class='scrolling_allowed' id='mod_wiki_search'>" + ("<table id='mod_wiki_search_items_table' class='scrolling_allowed' cellspacing='0' cellpadding='0' style='font-size: 0.8em; width:100%; margin-top:5px; padding-right:1px;'>" +
                b + "</table>") + "</span>"
        });
        createElem("div", wrapper, {
            id: "wiki_recipe_form",
            className: "menu",
            style: "position: relative; left: 50%; top: 30%; z-index: 99999999; width: 145px; height: 163px; display: none;"
        });
        createElem("span", "wiki_recipe_form", {
            id: "wiki_recipe_top",
            innerHTML: "<span class='pointer' style='font-weight: bold; color: #FFFFFF; float: right;' onclick='javascript: getElem(&apos;wiki_recipe_form&apos;).style.display = &apos;none&apos;'>Close</span>"
        });
        createElem("div", "wiki_recipe_form", {
            id: "wiki_recipe_holder",
            style: "position: relative; display: inline-block; float: left;"
        });
        for (e = 0; 4 > e; e++)
            for (f = 0; 4 > f; f++) createElem("div", "wiki_recipe_holder", {
                id: "wiki_formula_" + e + "_" + f,
                className: "inv_item",
                style: "display: inline-block; width: 32px; height: 32px; border: 1px solid #999; margin: 1px; float: left;",
                innerHTML: "&nbsp;"
            });
        getElem("mods_wiki_type").innerHTML = "<option value='-1'>Select</option>          <option value='item'>ITEM</option>                <option value='monster'>MOB</option>              <option value='vendor'>NPC</option>                  <option value='craft'>CRAFT</option>                <option value='enchant'>ENCHANT</option>          <option value='spell'>SPELL</option>             <option value='arrow'>ARROW</option>                    <option value='pet'>PET</option>";
        getElem("mods_wiki_type_item").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='type'>Type</option>                <option value='name'>Name</option>";
        getElem("mods_wiki_type_item_type").innerHTML = "<option value='-1'>Select</option>          <option value='weapons'>Weapon</option>           <option value='r.hand armors'>Shield</option>     <option value='chest'>Chest</option>                 <option value='helm'>Helm</helm>                    <option value='pants'>Pants</option>              <option value='glove'>Gloves</option>            <option value='boots'>Boots</option>                    <option value='cape'>Cape</option>               <option value='jewelry'>Jewelry</option>        <option value='magic'>Magic</option>            <option value='materials'>Material</option>         <option value='tools'>Tool</option>                  <option value='foods'>Food</option>             <option value='pets'>Pets</option>";
        getElem("mods_wiki_type_item_skill").innerHTML = "<option value='-1'>Select</option>          <option value='accuracy'>Accuracy</option>        <option value='strength'>Strength</option>        <option value='defense'>Defense</option>             <option value='health'>Health</option>              <option value='magic'>Magic</option>              <option value='alchemy'>Alchemy</option>         <option value='woodcutting'>Woodcut</option>            <option value='farming'>Farming</option>         <option value='fishing'>Fishing</option>        <option value='cooking'>Cooking</option>        <option value='jewelry'>Jewelry</option>            <option value='carpentry'>Carpentry</option>         <option value='forging'>Forging</option>        <option value='mining'>Mining</option>     <option value='archery'>Archery</option>";
        getElem("mods_wiki_type_monster").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_vendor").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft").innerHTML = "<option value='all'>All</option>            <option value='skill'>Skill</option>              <option value='source'>Source</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_craft_skill").innerHTML = "<option value='-1'>Select</option>          <option value='alchemy'>Alchemy</option>          <option value='woodcutting'>Woodcut</option>      <option value='farming'>Farming</option>             <option value='fishing'>Fishing</option>            <option value='cooking'>Cooking</option>          <option value='jewelry'>Jewelry</option>         <option value='carpentry'>Carpentry</option>            <option value='forging'>Forging</option>         <option value='mining'>Mining</option>          <option value='magic'>Magic</option>      <option value='fletching'>Fletching</option>";
        getElem("mods_wiki_type_craft_source").innerHTML = "<option value='-1'>Select</option>          <option value='furnace'>Furnace</option>          <option value='anvil'>Anvil</option>              <option value='campfire'>Campfire</option>           <option value='carpentry'>Carpentry</option>       <option value='kettle'>Kettle</option>             <option value='fletching'>Fletching</option>     <option value='other'>Other</option>";
        getElem("mods_wiki_type_pet").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>                <option value='family'>Family</option";
        getElem("mods_wiki_type_enchant").innerHTML = "<option value='all'>All</option>            <option value='item'>Item</option>";
        getElem("mods_wiki_type_spell").innerHTML = "<option value='all'>All</option>            <option value='name'>Name</option>";
        getElem("mods_wiki_type_arrow").innerHTML = "<option value='name'>Name</option>";
        var e = {
                type: 0,
                type_item: 1,
                type_monster: 1,
                type_vendor: 1,
                type_craft: 1,
                type_pet: 1,
                type_spell: 1,
                type_arrow: 1,
                type_enchant: 1,
                type_item_type: 2,
                type_item_skill: 2,
                type_craft_skill: 2,
                type_craft_source: 2
            },
            f = ["onchange"],
            x;
        for (x in e)
            for (var y in f) getElem("mods_wiki_" + x).setAttribute(f[y], "javascript: Mods.Wikimd.loadWikiType(" + e[x] + ");");
        getElem("mods_wiki_name").setAttribute("onclick", "javascript:Mods.Wikimd.loadWikiType(false);");
        getElem("mods_wiki_load").setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);");
        getElem("mods_wiki_name").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_name").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_low").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_low").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mods_wiki_level_high").setAttribute("onfocus", "javascript: Mods.blockKbind = true;");
        getElem("mods_wiki_level_high").setAttribute("onblur", "javascript: Mods.blockKbind = false");
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_options").style.display =
            "block"
    };
    Mods.Wikimd.chatSystemToggle = function() {
        return Mods.blockKbind ? (Mods.Wikimd.populateWiki(!0), !0) : !1
    };
    Mods.Wikimd.nameMenu = function(b, e) {
        if ("string" === typeof b && "number" === typeof e && ("item" == b || "craft" == b || "pet" == b || "spell" == b || "enchant" == b ? item_base : "monster" == b && npc_base)) {
            var f = getElem("action_menu");
            addClass(f, "hidden");
            var g = Mods.Wikimd.mouse;
            f.style.top = g.y + 10 + "px";
            f.style.left = g.x + "px";
            if ("item" != b && "craft" != b && "pet" != b && "spell" != b && "enchant" != b || !modOptions.chatmd.loaded) "monster" ==
                b && modOptions.rclick.loaded && (k = npc_base[e].name, f.innerHTML = "<div style='padding-left: 3px;'><span class='line' onclick='ActionMenu.mobDrops(" + e + ",4);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)' style='margin-left:-5px;'><span class='item'>" + k + "</span>Drops</span><span class='line' onclick='ActionMenu.combatCheck(" + e + ");addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;);'>Combat Analysis</span><span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)'>Close</span></div>");
            else {
                var k = item_base[e].name.replace(/'/g, "*"),
                    g = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki item name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ITEM</span></span>",
                    m;
                m = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki mob item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>MOB</span></span>";
                var n;
                n = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki npc item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>NPC</span></span>";
                var p;
                p = "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki craft item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>CRAFT</span></span>";
                var q;
                q = "<span class='line' onclick='" +
                    ("Mods.Chatmd.chatCommands(&apos;/wiki enchant item " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>ENCHANT</span></span>";
                var t;
                t = -1 < item_base[e].params.pet ? "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki pet name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>PET</span></span>" : "";
                k = 10 == item_base[e].params.slot ?
                    "<span class='line' onclick='" + ("Mods.Chatmd.chatCommands(&apos;/wiki spell name " + k + "&apos;);addClass(getElem(&apos;action_menu&apos;), &apos;hidden&apos;)") + "' style='margin-left:-5px;'>Check Wiki<span class='item'>SPELL</span></span>" : "";
                f.innerHTML = ("<div style='padding-left: 8px;'>" + g + m + n + p + q + t + k + "<span class='line' onclick='addClass(getElem(&apos;action_menu&apos;),&apos;hidden&apos;)' style='margin-left:-5px;'>Close</span></div>").replace(/\*/g, "\\&apos;")
            }
            0 < f.innerHTML.length && removeClass(f,
                "hidden")
        }
    };
    Mods.Wikimd.populateWiki = function(b, e) {
        var f, g, k, m, n, p, q, t, r, x, y, A, u, B, C, v, D, E, w;
        f = Mods.Wikimd.oldSortValue;
        !0 === b && (Mods.Wikimd.newSortValue = Mods.Wikimd.currentSort(), b = Mods.Wikimd.populateWikiList());
        if (b) {
            -1 != loadedMods.indexOf("Chatmd") && (k = getElem("mods_wiki_load"), k.innerHTML = "Back!", k.setAttribute("onclick", "javascript:Mods.Chatmd.chatCommands('/wiki " + f.replace(/'/g, "\\'") + "')"));
            f = getElem("mods_wiki_type").value;
            e = e || Mods.Wikimd.sortWiki(b, f, Mods.Wikimd.oldSort[f]);
            k = !1;
            for (g in b) {
                k = !0;
                break
            }
            for (n = 0; 300 > n; n++)
                for (g = 0; 3 > g; g++) addClass(getElem("wiki_row" + g + "_" + n), "hidden");
            if (k)
                for (k = {
                        item: {
                            1: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Item Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "level")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Level"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "skill")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Skill"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "price")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Price"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "archery")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Archery"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "slot")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Slot"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed hidden"]
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "power")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Power"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "aim")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Aim"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "armor")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Armor"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "magic")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Magic"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "speed")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Speed"]
                                    }
                                }
                            }
                        },
                        monster: {
                            1: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "moster", "respawn")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Respawn Time"]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "monster", "level")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Level"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "monster", "health")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Health"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "monster", "accuracy")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["ACC"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "monster", "strength")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["STR"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "monster", "defense")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["DEF"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null,
                                                "monster", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Monster Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p65"],
                                    div: {
                                        className: ["scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                        onclick: [function() {}]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameImg",
                                            "scrolling_allowed"
                                        ],
                                        innerHTML: ["Item Drops"]
                                    }
                                }
                            }
                        },
                        vendor: {
                            1: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1", "scrolling_allowed market_select pointer wiki_base1 wiki_pad2"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "vendor", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Vendor Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p65"],
                                    div: {
                                        className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_pad2 wiki_bL"],
                                        onclick: [function() {}]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                        innerHTML: ["Buys / Sells"]
                                    }
                                }
                            }
                        },
                        craft: {
                            1: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "location")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Craft Location"]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "level")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Level"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "skill")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Skill"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "base_chance")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Min%"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "max_chance")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Max%"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "xp")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Exp"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "craft", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Craft Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p65"],
                                    div: {
                                        className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base1 wiki_h35 wiki_bT wiki_bL"],
                                        onclick: [function() {}]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                        innerHTML: ["Required Materials"]
                                    }
                                }
                            }
                        },
                        pet: {
                            1: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select pointer wiki_h17 wiki_base1"],
                                        onclick: [function() {}]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_nameText"],
                                        innerHTML: ["<span style='font-weight: normal color: #999 font-size: 1.05em'>Req to level: &nbsp;</span><span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;stones&apos;)'>SoE</span>&nbsp; | &nbsp;<span onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;xp_required&apos;)'>Exp</span>"]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "pet", "aim")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Aim"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "pet", "power")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Power"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "pet", "armor")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Armor"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "pet", "magic")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Magic"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "pet", "speed")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Speed"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                        onclick: [function() {}]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText", "scrolling_allowed wiki_name"],
                                        innerHTML: ["<span class='pointer' onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;name&apos;)'>Name</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;family&apos;)'>Family</span>&nbsp; | &nbsp;<span class='pointer'  onclick='Mods.Wikimd.sortWiki(null, &apos;pet&apos;, &apos;inventory_slots&apos;)'>Slots</span>"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p65"],
                                    div: {
                                        className: ["scrolling_allowed market_select wiki_h35 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                        onclick: [function() {}]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                        innerHTML: ["Evolution Chain"]
                                    }
                                }
                            }
                        },
                        spell: {
                            1: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Spell Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "level")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Level"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "cooldown")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["CD"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "price")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Price"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "casts")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Casts"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "cost_s")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Cost/S"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed hidden"]
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "damage")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Dmg"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "exp")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Exp"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "spell", "penetration")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Pen"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "dmg_s")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Dmg/S"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "item", "exp_s")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Exp/S"]
                                    }
                                }
                            }
                        },
                        arrow: {
                            1: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h35 wiki_base1"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden",
                                            "scrolling_allowed wiki_img"
                                        ]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Arrow Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "level")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Level"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "price")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Price"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "amount")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Amount"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "cooldown")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Cooldown"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "exp")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Exp"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed hidden"]
                                },
                                1: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "speed")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Speed"]
                                    }
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "damage")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Damage"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "range")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Range"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "dmg_s")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Dmg/S"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bT wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bT wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "arrow", "exp_s")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Exp/S"]
                                    }
                                }
                            }
                        },
                        enchant: {
                            1: {
                                className: ["scrolling_allowed wiki_row2", "scrolling_allowed wiki_a2"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null,
                                                "enchant", "enchant")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Enchanted Item"]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed hidden"]
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_mL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_mL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "enchant", "low")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Low %"]
                                    }
                                },
                                3: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "enchant", "med")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Med %"]
                                    }
                                },
                                4: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bR wiki_bL",
                                            "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bR wiki_bL"
                                        ],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "enchant", "high")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["High %"]
                                    }
                                },
                                5: {
                                    className: ["scrolling_allowed wiki_p13"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_base0 wiki_h17 wiki_bL", "scrolling_allowed market_select wiki_base0 wiki_h17 wiki_bL"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "enchant", "sup")
                                        }]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameText"],
                                        innerHTML: ["Sup %"]
                                    }
                                }
                            },
                            2: {
                                className: ["scrolling_allowed wiki_row1", "scrolling_allowed wiki_a1"],
                                0: {
                                    className: ["scrolling_allowed wiki_p35"],
                                    div: {
                                        className: ["scrolling_allowed market_select pointer wiki_h17 wiki_base1 wiki_bT", "scrolling_allowed market_select pointer wiki_h35 wiki_base1 wiki_bT"],
                                        onclick: [function() {
                                            Mods.Wikimd.sortWiki(null, "enchant", "name")
                                        }]
                                    },
                                    img: {
                                        className: ["scrolling_allowed hidden", "scrolling_allowed wiki_img"]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_name"],
                                        innerHTML: ["Item Name"],
                                        style: [{
                                            marginTop: "-8px"
                                        }]
                                    }
                                },
                                1: {
                                    className: ["scrolling_allowed hidden"]
                                },
                                2: {
                                    className: ["scrolling_allowed wiki_p65"],
                                    div: {
                                        className: ["scrolling_allowed market_select wiki_h17 wiki_base1 wiki_h17 wiki_bT wiki_bL", "scrolling_allowed market_select wiki_base2 wiki_pad2 wiki_bT wiki_bL wiki_mR wiki_mL"],
                                        onclick: [function() {}]
                                    },
                                    text: {
                                        className: ["scrolling_allowed wiki_base1 wiki_nameImg", "scrolling_allowed"],
                                        innerHTML: ["Enchant Chain"]
                                    }
                                }
                            }
                        }
                    }, m = 0; 300 > m; m++) {
                    var z = function(b) {
                        return "<div style='padding-top: 2px'>" +
                            b + "</div>"
                    };
                    g = m - 1;
                    removeClass(getElem("wiki_row0_" + m), "hidden");
                    if (!e || m > e.length) break;
                    if (0 < m) {
                        if (void 0 == e[g]) break;
                        q = Mods.Wikimd.tableData(g, b, e);
                        if (!q) break;
                        r = q.item;
                        A = q.drops;
                        x = q.img;
                        items = q.items;
                        u = q.images;
                        C = q.max_chance;
                        B = q.min_chance;
                        v = q.n_onclick;
                        y = q.mins;
                        w = q.magic;
                        arrow = q.arrow;
                        r.object && "Anvil" == r.object.name && Mods.findWithAttr(FORGE_FORMULAS, "item_id", Mods.Wikimd.formulas[e[g]].id)
                    }
                    for (q = 1; 3 > q; q++)
                        if (t = getElem("wiki_row" + q + "_" + m), void 0 == k[f][q]) t.className = "scrolling_allowed hidden";
                        else
                            for (t.className = 0 === m ? k[f][q].className[0] : k[f][q].className[1], t = 0; 6 > t; t++)
                                if (n = getElem("wiki_row" + q + "_col" + t + "_" + m), void 0 == k[f][q][t]) n.className = "scrolling_allowed hidden";
                                else
                                    for (p in n.className = k[f][q][t].className, n = getElem("wiki_row" + q + "_col" + t + "_div_" + m), D = getElem("wiki_row" + q + "_col" + t + "_img_" + m), E = getElem("wiki_row" + q + "_col" + t + "_text_" + m), n = {
                                            div: n,
                                            img: D,
                                            text: E
                                        }, n) null !== n[p] && void 0 !== k[f][q][t][p] && (0 === m ? (n[p].className = k[f][q][t][p].className[0], k[f][q][t][p].innerHTML && (n[p].innerHTML =
                                        k[f][q][t][p].innerHTML[0]), k[f][q][t][p].onclick && (n[p].onclick = k[f][q][t][p].onclick[0]), k[f][q][t][p].style && (n[p].style.marginTop = k[f][q][t][p].style[0].marginTop)) : (D = void 0 !== k[f][q][t][p].className[1] ? k[f][q][t][p].className[1] : k[f][q][t][p].className[0], n[p].className = D));
                    0 < m && ("monster" != f && (q = getElem("wiki_row2_col0_img_" + m), t = getElem("wiki_row2_col0_text_" + m), q.style.top = null, q.style.left = null, q.style.width = null, q.style.height = null, q.style.marginLeft = null, q.style.marginTop = null, t.style.width =
                            null, t.style.textAlign = null, t.style.top = null, t.style.left = null), "item" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + r.id + ")"), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_img_" + m).style.background = Items.get_background(r.id), getElem("wiki_row1_col0_img_" + m).item_id = r.id, getElem("wiki_row1_col0_text_" + m).innerHTML = z(r.name) + (Mods.isLoaded("Gearmd") && (0 == item_base[r.id].b_t || 2 == item_base[r.id].b_t || 4 == item_base[r.id].b_t && "undefined" !=
                            typeof item_base[r.id].params.min_magic || 5 == item_base[r.id].b_t || 7 == item_base[r.id].b_t || 9 == item_base[r.id].b_t) ? "<span style='position: absolute; bottom: -10px; right: 0px; font-size: 10px; color: #999;' onclick='javascript: Mods.Gearmd.changeTryOn(true, " + r.id + ");';>(Try On)</span>" : ""), getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > r.name.length ? "-8px" : "-15px", getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" + m).innerHTML = z(r.level), getElem("wiki_row1_col2_text_" +
                            m).innerHTML = z(r.skill), getElem("wiki_row1_col3_text_" + m).innerHTML = z(r.price), getElem("wiki_row1_col4_text_" + m).innerHTML = z(r.params.archery || "-"), getElem("wiki_row1_col5_text_" + m).innerHTML = z(r.slot), getElem("wiki_row2_col1_div_" + m).style.height = "", getElem("wiki_row2_col1_text_" + m).innerHTML = z(r.params.power || "-"), getElem("wiki_row2_col2_div_" + m).style.height = "", getElem("wiki_row2_col2_text_" + m).innerHTML = z(r.params.aim || "-"), getElem("wiki_row2_col3_text_" + m).innerHTML = z(r.params.armor || "-"), getElem("wiki_row2_col4_text_" +
                            m).innerHTML = z(r.params.magic || "-"), getElem("wiki_row2_col5_text_" + m).innerHTML = z(r.params.speed || "-")) : "monster" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_text_" + m).style.marginTop = "", getElem("wiki_row1_col0_text_" + m).innerHTML = z("Respawn: " + y + " Minute" + (1 < y ? "s" : "")), getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" + m).innerHTML = z(FIGHT.calculate_monster_level(r)), getElem("wiki_row1_col2_text_" +
                                m).innerHTML = z(r.params.health), getElem("wiki_row1_col3_text_" + m).innerHTML = z(r.temp.total_accuracy), getElem("wiki_row1_col4_text_" + m).innerHTML = z(r.temp.total_strength), getElem("wiki_row1_col5_text_" + m).innerHTML = z(r.temp.total_defense), getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('monster'," + r.b_i + ")"), getElem("wiki_row2_col0_div_" + m).style.height = 22 > A.length ? "109px" : 36 * (Math.ceil(A.length / 7) - 3) + 109 + "px", q = getElem("wiki_row2_col0_img_" + m), g = [54, 64], x ? (g = scaleSize(64,
                                64, x.tile_width, x.tile_height), q.style.background = 'url("' + x.url + '") no-repeat scroll ' + -r.img.x * x.tile_width + "px " + -r.img.y * x.tile_height + "px transparent") : q.style.background = 'url("' + getBodyImgNoHalo(r.img.hash).toDataURL("image/png") + '") no-repeat scroll transparent', q.item_id = !1, q.style.top = "60px", q.style.left = "50%", q.style.width = g[0] + "px", q.style.height = g[1] + "px", q.style.marginLeft = -Math.ceil(g[0] / 2) + "px", q.style.marginTop = -Math.ceil(g[1] / 2) + "px", t = getElem("wiki_row2_col0_text_" + m), t.innerHTML =
                            z(r.name), t.style.marginTop = "10px", t.style.width = "100%", t.style.textAlign = "center", t.style.top = "0", t.style.left = "0", getElem("wiki_row2_col1_div_" + m).style.height = 22 > A.length ? "108px" : 36 * (Math.ceil(A.length / 7) - 3) + 108 + "px", getElem("wiki_row2_col1_text_" + m).innerHTML = u) : "vendor" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""), getElem("wiki_row1_col0_div_" + m).style.height = 8 > A.length ? "36px" : 15 > A.length ? "72px" : 36 * (Math.ceil(A.length / 7) - 2) + 72 + "px", x ? getElem("wiki_row1_col0_img_" + m).style.background =
                            'url("' + x.url + '") no-repeat scroll ' + -r.img.x * x.tile_width + "px " + -r.img.y * x.tile_height + "px transparent" : getElem("wiki_row1_col0_img_" + m).style.background = 'url("' + getBodyImgNoHalo(r.img.hash).toDataURL("image/png") + '") no-repeat scroll -12px -10px transparent', getElem("wiki_row1_col0_img_" + m).item_id = !1, getElem("wiki_row1_col0_text_" + m).innerHTML = z(r.name), getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > r.name.length ? "-8px" : "-15px", getElem("wiki_row1_col1_div_" + m).style.height = 8 > A.length ? "36px" :
                            15 > A.length ? "72px" : 36 * (Math.ceil(A.length / 7) - 2) + 72 + "px", getElem("wiki_row1_col1_text_" + m).innerHTML = u) : "craft" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_text_" + m).style.marginTop = "", getElem("wiki_row1_col0_text_" + m).innerHTML = z(r.object.name), getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" + m).innerHTML = z(r.level), getElem("wiki_row1_col2_text_" + m).innerHTML = z(capitaliseFirstLetter(r.skill.slice(0,
                                7))), getElem("wiki_row1_col3_text_" + m).innerHTML = z(B), getElem("wiki_row1_col4_text_" + m).innerHTML = z(C), getElem("wiki_row1_col5_text_" + m).innerHTML = z(r.xp || "-"), getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + r.id + ")"), getElem("wiki_row2_col0_div_" + m).setAttribute("onclick", v), getElem("wiki_row2_col0_div_" + m).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px", getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(r.id),
                            getElem("wiki_row2_col0_img_" + m).item_id = r.id, getElem("wiki_row2_col0_text_" + m).innerHTML = z(r.name), getElem("wiki_row2_col0_text_" + m).style.marginTop = 18 > r.name.length ? "-8px" : "-15px", getElem("wiki_row2_col1_div_" + m).style.height = 8 > items ? "36px" : 15 > items ? "72px" : 36 * (Math.ceil(items / 7) - 2) + 72 + "px", getElem("wiki_row2_col1_text_" + m).innerHTML = u) : "pet" == f ? (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_img_" + m).style.background =
                            "", getElem("wiki_row1_col0_img_" + m).item_id = !1, getElem("wiki_row1_col0_text_" + m).innerHTML = z(0 < pets[r.params.pet].params.stones ? "Stones of Evolution: " + pets[r.params.pet].params.stones : 0 < pets[r.params.pet].params.xp_required ? "Exp: " + thousandSeperate(parseInt(pets[r.params.pet].params.xp_required)) : "Cannot be leveled"), getElem("wiki_row1_col0_text_" + m).style.marginTop = "", getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" + m).innerHTML = z(r.params.aim ? r.params.aim : "-"), getElem("wiki_row1_col2_text_" +
                                m).innerHTML = z(r.params.power ? r.params.power : "-"), getElem("wiki_row1_col3_text_" + m).innerHTML = z(r.params.armor ? r.params.armor : "-"), getElem("wiki_row1_col4_text_" + m).innerHTML = z(r.params.magic ? r.params.magic : "-"), getElem("wiki_row1_col5_text_" + m).innerHTML = z(r.params.speed ? r.params.speed : "-"), getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('" + f + "'," + item_base[e[g]].b_i + ")"), getElem("wiki_row2_col0_div_" + m).style.height = 6 > A.length ? "38px" : 11 > A.length ? "73px" : 36 * (Math.ceil(A.length /
                                5) - 2) + 73 + "px", getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(r.b_i), getElem("wiki_row2_col0_img_" + m).item_id = r.b_i, g = pets[r.params.pet].name.replace(/\[(Ancient|Legendary|Rare|Common)\]/gi, function(b, e) {
                                return "[<span style='color: " + {
                                    Ancient: COLOR.RED,
                                    Legendary: COLOR.ORANGE,
                                    Rare: COLOR.YELLOW,
                                    Common: COLOR.GREEN
                                }[e] + ";;'>" + e.slice(0, 1) + "</span>]"
                            }), getElem("wiki_row2_col0_text_" + m).innerHTML = z(g + "<span style='color:#999; font-size:.9em'><br>(" + (void 0 !== Mods.Wikimd.family[r.b_i] ?
                                Mods.Wikimd.family[r.b_i] : "Crafted") + ")</span><span style='position: absolute; right: 0px; bottom: 0px; font-size: .8em; color: #CCC'>" + pets[r.params.pet].params.inventory_slots + " slots</span>"), getElem("wiki_row2_col0_text_" + m).style.marginTop = 20 > pets[r.params.pet].name.length ? "-12px" : "-17px", getElem("wiki_row2_col1_div_" + m).style.height = 6 > A.length ? "36px" : 11 > A.length ? "71px" : 36 * (Math.ceil(A.length / 5) - 2) + 71 + "px", getElem("wiki_row2_col1_text_" + m).innerHTML = u) : "spell" == f ? (g = "#DD8", q = "#8CD", getElem("wiki_row1_col0_" +
                            m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + r.id + ")"), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_img_" + m).style.background = Items.get_background(r.id), getElem("wiki_row1_col0_img_" + m).item_id = r.id, getElem("wiki_row1_col0_text_" + m).innerHTML = z(r.name), getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > r.name.length ? "-8px" : "-15px", getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" + m).innerHTML = z(w.min_level), getElem("wiki_row1_col2_text_" +
                            m).innerHTML = z(Math.round(w.cooldown / 100) / 10 + " <span style='color: " + q + "'>secs</span>"), getElem("wiki_row1_col3_text_" + m).innerHTML = z(thousandSeperate(r.params.price)), getElem("wiki_row1_col4_text_" + m).innerHTML = z(w.uses), getElem("wiki_row1_col5_text_" + m).innerHTML = z(Math.round(r.params.price / (w.cooldown / 1E3 * w.uses) * 10) / 10 + " <span style='color: " + q + "'>cps</span>"), getElem("wiki_row2_col1_div_" + m).style.height = "", getElem("wiki_row2_col1_text_" + m).innerHTML = z(w.basic_damage + " <span style='color: " +
                            g + "'>dmg</span>"), getElem("wiki_row2_col2_div_" + m).style.height = "", getElem("wiki_row2_col2_text_" + m).innerHTML = z(w.xp + " <span style='color: " + g + "'>exp</span>"), getElem("wiki_row2_col3_text_" + m).innerHTML = z(w.penetration), getElem("wiki_row2_col4_text_" + m).innerHTML = z(Math.round(w.basic_damage / (w.cooldown / 1E3) * 10) / 10 + " <span style='color: " + g + "'>dps</span>"), getElem("wiki_row2_col5_text_" + m).innerHTML = z(Math.round(w.xp / (w.cooldown / 1E3) * 10) / 10 + " <span style='color: " + g + "'>eps</span>")) : "arrow" == f ? (g =
                            "#DD8", q = "#8CD", getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + r.id + ")"), getElem("wiki_row1_col0_div_" + m).style.height = "", getElem("wiki_row1_col0_img_" + m).style.background = Items.get_background(r.id), getElem("wiki_row1_col0_img_" + m).item_id = r.id, getElem("wiki_row1_col0_text_" + m).innerHTML = z(r.name), getElem("wiki_row1_col0_text_" + m).style.marginTop = 18 > r.name.length ? "-8px" : "-15px", getElem("wiki_row1_col1_div_" + m).style.height = "", getElem("wiki_row1_col1_text_" +
                                m).innerHTML = z(arrow.min_level), getElem("wiki_row1_col2_text_" + m).innerHTML = z(thousandSeperate(r.params.price)), getElem("wiki_row1_col3_text_" + m).innerHTML = z(arrow.archery_uses), getElem("wiki_row1_col4_text_" + m).innerHTML = z(Math.round(arrow.archery_cooldown / 100) / 10 + " <span style='color: " + q + "'>secs</span>"), getElem("wiki_row1_col5_text_" + m).innerHTML = z(2 * arrow.archery_damage), getElem("wiki_row2_col1_div_" + m).style.height = "", getElem("wiki_row2_col1_text_" + m).innerHTML = z(parseInt(arrow.archery_speed /
                                25 - 5)), getElem("wiki_row2_col2_div_" + m).style.height = "", getElem("wiki_row2_col2_text_" + m).innerHTML = z(arrow.archery_damage), getElem("wiki_row2_col3_text_" + m).innerHTML = z(arrow.archery_range), getElem("wiki_row2_col4_text_" + m).innerHTML = z(Math.round(arrow.archery_damage / (arrow.archery_cooldown / 1E3) * 10) / 10 + " <span style='color: " + g + "'>dps</span>"), getElem("wiki_row2_col5_text_" + m).innerHTML = z(Math.round(2 * arrow.archery_damage / (arrow.archery_cooldown / 1E3) * 10) / 10 + " <span style='color: " + g + "'>eps</span>")) :
                        "enchant" == f && (getElem("wiki_row1_col0_" + m).setAttribute("oncontextmenu", ""), g = "<span>" + item_base[r.enchant.to_enchant].name.replace("Enchanted", "Ench").replace("Necklace", "Neck") + "</span>", getElem("wiki_row1_col0_text_" + m).style.marginTop = "", getElem("wiki_row1_col0_text_" + m).innerHTML = z(g + "<span style='color:#999; font-size:.9em'> (" + r.enchant.type + ")</span>"), getElem("wiki_row1_col2_text_" + m).innerHTML = z(Math.round(100 * (r.enchant.low.percent || 0)) + "%"), getElem("wiki_row1_col3_text_" + m).innerHTML =
                            z(Math.round(100 * (r.enchant.med.percent || 0)) + "%"), getElem("wiki_row1_col4_text_" + m).innerHTML = z(Math.round(100 * (r.enchant.high.percent || 0)) + "%"), getElem("wiki_row1_col5_text_" + m).innerHTML = z(Math.round(100 * (r.enchant.sup.percent || 0)) + "%"), getElem("wiki_row2_col0_" + m).setAttribute("oncontextmenu", "Mods.Wikimd.nameMenu('item'," + r.id + ")"), getElem("wiki_row2_col0_div_" + m).style.height = "38px", getElem("wiki_row2_col0_img_" + m).style.background = Items.get_background(r.id), getElem("wiki_row2_col0_img_" + m).item_id =
                            r.id, getElem("wiki_row2_col0_text_" + m).innerHTML = z(r.name), getElem("wiki_row2_col0_text_" + m).style.marginTop = 25 > r.name.length ? "-8px" : "-15px", getElem("wiki_row2_col2_div_" + m).style.height = "36px", getElem("wiki_row2_col2_text_" + m).innerHTML = u));
                    Mods.Wikimd.setSpan(f, m)
                }
        }
    };
    Mods.Wikimd.tableData = function(b, e, f) {
        var g, k, m, n, p, q, t, r, x, y, A, u, B, C, v;
        u = getElem("mods_wiki_type").value;
        g = e[f[b]];
        if (!g) return !1;
        k = IMAGE_SHEET[g.img.sheet];
        q = p = n = "";
        m = {};
        e = 0;
        n_onclick = y = A = "";
        t = 0;
        C = {};
        v = {};
        if ("monster" == u) {
            m = g.params.drops;
            for (r in m) u = item_base[m[r].id], n = n + "<a title='" + Mods.cleanText(u.name) + "(" + 100 * m[r].chance + "%)'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>";
            t = Math.round((g.params.health + 60) / 60)
        } else if ("vendor" == u) {
            m = g.temp.content;
            for (r in m) u = item_base[m[r].id], m[r].spawn ? p = p + "<a title='" + Mods.cleanText(u.name) +
                " (buys & sells) value " + thousandSeperate(u.params.price) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>" : q = q + "<a title='" + Mods.cleanText(u.name) + " (buys) value " + thousandSeperate(u.params.price) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g,
                    "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>";
            n = p + q
        } else if ("craft" == u) {
            B = g.pattern.requires;
            requires_one_from = g.pattern.requires_one_from || [];
            e = 0;
            tooMany = function(b) {
                return 1 < Math.max(B[b] || 0, g.pattern.consumes[b] || 0) && !0 || !1
            };
            for (r in requires_one_from) "undefined" != typeof item_base[requires_one_from[r]] && (u = item_base[requires_one_from[r]], p = p + "<a title='" + Mods.cleanText(u.name) +
                "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>");
            for (r in B)
                if ("length" != r && "undefined" != typeof item_base[r])
                    for (x = 0; x < Math.max(B[r], g.pattern.consumes[r] || 0); x++) u = item_base[r], "undefined" == typeof g.pattern.consumes[r] ? (p = p + "<a title='" + Mods.cleanText(u.name) +
                        " (not consumed) x" + Math.max(B[r], g.pattern.consumes[r] || 0) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " background-color: #666666; width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>", tooMany(r) && (x = Math.max(B[r], g.pattern.consumes[r] || 0)) && (p += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" +
                            x + "</div>")) : (q = q + "<a title='" + Mods.cleanText(u.name) + " (consumed) x" + Math.max(B[r], g.pattern.consumes[r] || 0) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>", tooMany(r) && (x = Math.max(B[r], g.pattern.consumes[r] || 0)) && (q += "<div style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" +
                        x + "</div>"));
            for (r in g.pattern.consumes)
                if ("length" != r && "undefined" != typeof item_base[r] && "undefined" == typeof B[r])
                    for (x = 0; x < g.pattern.consumes[r]; x++) u = item_base[r], q = q + "<a title='" + Mods.cleanText(u.name) + " (consumed) x" + g.pattern.consumes[r] + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>",
                        tooMany(r) && (x = g.pattern.consumes[r]) && (q += "<div item_id='" + u.b_i + "' style='width:32px; height:20px; margin:2px; margin-left: 4px; margin-top: 14px; display:inline-block; float:left; text-align: center;'> x" + x + "</div>");
            for (r in B) "length" != r && (x = Math.max(B[r], g.pattern.consumes[r] || 0), e += 1 >= x && x || 2);
            for (r in g.pattern.consumes) "undefined" == typeof B[r] && "length" != r && (x = parseInt(g.pattern.consumes[r]), e += 1 >= x && x || 2);
            n = p + q;
            y = g.pattern.base_chance || g.pattern.chance || "-";
            y = "number" == typeof y ? Math.round(1E4 *
                y) / 100 + "%" : y;
            A = g.pattern.max_chance || g.pattern.chance || 1;
            A = "number" == typeof A ? Math.round(1E4 * A) / 100 + "%" : A;
            n_onclick = "";
            "Anvil" == g.object.name && (n_onclick = "Mods.Wikimd.showFormula('" + f[b] + "');")
        } else if ("pet" == u)
            for (r in m = Mods.Wikimd.pet_family[g.b_i], m.length = 0, m) {
                if ("number" == typeof parseInt(r) && "undefined" != typeof item_base[m[r]] && void 0 !== item_base[m[r]].params.pet)
                    if (void 0 == Mods.Wikimd.pet_family[g.b_i].id) u = item_base[m[r]], m.length += 1, "" !== n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"),
                        n = u.b_i == g.b_i ? n + ("<a title='" + Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>") : n + ("<a title='" + Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," +
                            u.b_i + ")'>&nbsp;</div></a>");
                    else {
                        u = Mods.Wikimd.pet_family[g.b_i].pattern;
                        f = u.consumes;
                        B = u.requires;
                        for (x in B)
                            if ("number" == typeof parseInt(x) && void 0 !== item_base[x] && void 0 !== item_base[x].img && void 0 == f[x])
                                for (b = 0; b < B[x]; b++) u = item_base[x], m.length += 1, "" !== n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"), n += "<a title='" +
                                    Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>";
                        for (x in f)
                            if ("number" == typeof parseInt(x) && void 0 !== item_base[x] && void 0 !== item_base[x].img)
                                for (b = 0; b < f[x]; b++) u = item_base[x], m.length += 1, "" !== n && (n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>+</span></span>"),
                                    n += "<a title='" + Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>";
                        u = item_base[g.b_i];
                        m.length += 1;
                        n += "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>=</span></span>";
                        n += "<a title='" + Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace("transparent", "#666").replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," + u.b_i + ")'>&nbsp;</div></a>"
                    }
            } else if ("enchant" == u)
                for (m = [g.enchant.from_enchant, g.id, g.enchant.to_enchant], b = 0; 3 > b; b++) m[b] && (u = item_base[m[b]], r = m[b] == g.id ? "#666" : "transparent", "" !== n && (n +=
                        "<span style='font-size: .8em; height: 32px; width: 10px; margin: 2px; display:inline-block; float:left; position: relative; color: #999;'><span style='position: absolute; width: 100%; top: 40%; right: 10%;'>&gt;</span></span>"), n += "<a title='" + Mods.cleanText(u.name) + "'><div item_id='" + u.b_i + "' style='" + Items.get_background_image(u.b_i).replace("transparent", r).replace(/\"/g, "&apos;") + " width:32px; height:32px; margin:2px; margin-left: 4px; display:inline-block; float:left;' oncontextmenu='Mods.Wikimd.nameMenu(&apos;item&apos;," +
                    u.b_i + ")'>&nbsp;</div></a>");
            else "spell" == u ? C = g.magic : "arrow" == u && (v = g.arrow);
        return {
            item: g,
            img: k,
            drops: m,
            items: e,
            images: n,
            max_chance: A,
            min_chance: y,
            n_onclick: n_onclick,
            mins: t,
            magic: C,
            arrow: v
        }
    };
    Mods.Wikimd.showFormula = function(b) {
        if ("undefined" != typeof b) {
            b = Mods.Wikimd.formulas[b].pattern.pattern;
            getElem("wiki_recipe_form").style.display = "block";
            for (var e = 0; 4 > e; e++)
                for (var f = 0; 4 > f; f++) {
                    var g = getElem("wiki_formula_" + e + "_" + f);
                    g.style.background = "";
                    "undefined" != typeof b[e] && "undefined" != typeof b[e][f] &&
                        "undefined" != typeof item_base[b[e][f]] && (g.style.background = Items.get_background(item_base[b[e][f]].b_i))
                }
        }
    };
    Mods.Wikimd.setSpan = function(b, e) {
        for (var f = Mods.Wikimd.span, g, k, m, n = 1; 3 > n; n++)
            for (var p = 0; 6 > p; p++) g = getElem("wiki_row" + n + "_col" + p + "_" + e), void 0 !== f[b] && (k = f[b]["wiki_r" + n + "_c" + p], "undefined" != typeof k ? (m = k.c || "", k = k.r || "") : k = m = "", g.setAttribute("colspan", m), g.setAttribute("rowspan", k))
    };
    Mods.Wikimd.sortWiki = function(b, e, f) {
        if ("undefined" != typeof e && "undefined" != typeof f) {
            var g = !1;
            if ("object" !=
                typeof b || null === b) g = !0;
            var k = !1;
            Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue || Mods.Wikimd.sortReverse ? Mods.Wikimd.oldSortValue != Mods.Wikimd.newSortValue && (Mods.Wikimd.sortReverse = !1) : k = !0;
            Mods.Wikimd.oldSortValue = Mods.Wikimd.newSortValue;
            b = null === b ? Mods.Wikimd.newWikiLoad : b;
            e = getElem("mods_wiki_type").value;
            f = f || Mods.Wikimd.oldSort[e];
            if ("object" == typeof b) {
                var m = function(e) {
                        e.sort(function(e, g) {
                            var k, m, n, p, q, r, A;
                            k = getElem("mods_wiki_type").value;
                            A = function(b) {
                                return "damage" == b ? "basic_damage" :
                                    "exp" == b ? "xp" : "casts" == b ? "uses" : b
                            };
                            "item" == k ? r = function(e, f) {
                                return -1 < e && b[e] ? "name" == f || "level" == f || "skill" == f || "slot" == f ? b[e][f] : b[e].params[f] || 0 : 0
                            } : "monster" == k ? r = function(e, f) {
                                return -1 < e && b[e] ? "name" == f ? b[e][f] : "level" == f ? FIGHT.calculate_monster_level(b[e]) : "health" == f || "respawn" == f ? b[e].temp.health : b[e].temp["total_" + f] : 0
                            } : "craft" == k ? r = function(e, f) {
                                return -1 < e && b[e] ? "base_chance" == f || "max_chance" == f ? b[e].pattern[f] || b[e].pattern.chance || 1 : "location" == f ? b[e].object.name || 0 : "xp" == f ? parseInt(b[e].xp) ||
                                    0 : "level" == f ? parseInt(b[e].level) || 0 : b[e][f] : 0
                            } : "pet" == k ? r = function(e, f) {
                                return -1 < e && b[e] ? "name" == f ? pets[b[e].params.pet][f] : "xp_required" == f || "stones" == f || "inventory_slots" == f ? pets[b[e].params.pet].params[f] : "family" == f ? Mods.Wikimd.family[e] : b[e].params[f] : 0
                            } : "spell" == k ? r = function(e, f) {
                                if (!(-1 < e && b[e])) return 0;
                                var g = A(f),
                                    k = b[e].magic;
                                return "dmg_s" == g ? Math.round(k.basic_damage / (k.cooldown / 1E3) * 100) / 100 : "cost_s" == g ? Math.round(b[e].params.price / (k.uses * k.cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp /
                                    (k.cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                            } : "arrow" == k ? r = function(e, f) {
                                if (!(-1 < e && b[e])) return 0;
                                var g = A(f),
                                    k = b[e].arrow;
                                return "dmg_s" == g ? Math.round(k.archery_damage / (k.archery_cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp / (k.archery_cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                            } : "enchant" == k && (r = function(e, f) {
                                return -1 < e && b[e] ? "name" == f ? b[e].name : "enchant" == f ? item_base[b[e].enchant.to_enchant].name : b[e].enchant[f] : 0
                            });
                            if ("vendor" == k) return b[g][f] >
                                b[e][f] && !t || b[g][f] < b[e][f] && t ? 1 : -1;
                            k = r(e, f);
                            m = r(e, vold);
                            n = r(e, last);
                            p = r(g, f);
                            q = r(g, vold);
                            r = r(g, last);
                            return k > p ? -1 : k < p ? 1 : m > q ? -1 : m < q ? 1 : n > r ? -1 : n < r ? 1 : 0
                        })
                    },
                    n = [],
                    p;
                for (p in b) n.push(p);
                var q = Mods.Wikimd.oldSort || {},
                    t = !1;
                "item" == e ? (vold = "undefined" != typeof q.item ? q.item : "name" != f ? "name" : "level", last = "name" != f && "name" != vold ? "name" : "level" != f && "level" != vold ? "level" : "price") : "monster" == e ? (vold = q.monster ? q.monster : "name" != f ? "name" : "level", last = "name" != f && "name" != vold ? "name" : "health") : "craft" == e ? (vold = "xp" !=
                    f ? "xp" : "level", last = "xp" != f && "xp" != vold ? "xp" : "level" != f && "level" != vold ? "level" : "name") : "pet" == e ? (vold = q.pet ? q.pet : "family" != f ? "family" : "inventory_slots", last = "family" != f && "family" != vold ? "family" : "inventory_slots" != f && "inventory_slots" != vold ? "inventory_slots" : "name") : "enchant" == e ? (vold = q.enchant ? q.enchant : "low" != f ? "low" : "name", last = "low" != f && "low" != vold ? "low" : "name" != f && "name" != vold ? "name" : "enchant") : "spell" == e ? (vold = q.spell ? q.spell : "level" != f ? "level" : "name", last = "level" != f && "level" != vold ? "level" :
                    "name" != f && "name" != vold ? "name" : "exp") : "arrow" == e && (vold = q.arrow ? q.arrow : "name", last = "name" != f && "name" != vold ? "name" : "exp");
                q[e] == f && k && (t = !0) && (Mods.Wikimd.sortReverse = !0) || (q[e] = f) && (Mods.Wikimd.sortReverse = !1);
                if ("vendor" == e) m(n);
                else {
                    k = [];
                    q = [];
                    for (p in n) {
                        var r, x;
                        r = function(b) {
                            return "damage" == b ? "basic_damage" : "exp" == b ? "xp" : "casts" == b ? "uses" : b
                        };
                        "item" == e ? x = function(e, f) {
                            return -1 < e && b[e] ? "name" == f || "level" == f || "skill" == f || "slot" == f ? b[e][f] : b[e].params[f] || 0 : 0
                        } : "monster" == e ? x = function(e, f) {
                            return -1 <
                                e && b[e] ? "name" == f ? b[e][f] : "level" == f ? FIGHT.calculate_monster_level(b[e]) : "health" == f || "respawn" == f ? b[e].temp.health : b[e].temp["total_" + f] : 0
                        } : "craft" == e ? x = function(e, f) {
                            return -1 < e && b[e] ? "base_chance" == f || "max_chance" == f ? b[e].pattern[f] || b[e].pattern.chance || 1 : "location" == f ? b[e].object.name || 0 : "xp" == f ? parseInt(b[e].xp) || 0 : "level" == f ? parseInt(b[e].level) || 0 : b[e][f] : 0
                        } : "pet" == e ? x = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? pets[b[e].params.pet][f] : "xp_required" == f || "stones" == f || "inventory_slots" == f ? pets[b[e].params.pet].params[f] :
                                "family" == f ? Mods.Wikimd.family[e] : b[e].params[f] : 0
                        } : "spell" == e ? x = function(e, f) {
                            if (!(-1 < e && b[e])) return 0;
                            var g = r(f),
                                k = b[e].magic;
                            return "dmg_s" == g ? Math.round(k.basic_damage / (k.cooldown / 1E3) * 100) / 100 : "cost_s" == g ? Math.round(b[e].params.price / (k.uses * k.cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp / (k.cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                        } : "arrow" == e ? x = function(e, f) {
                            if (!(-1 < e && b[e])) return 0;
                            var g = r(f),
                                k = b[e].arrow;
                            return "dmg_s" == g ? Math.round(k.archery_damage / (k.archery_cooldown /
                                1E3) * 100) / 100 : "cost_s" == g ? Math.round(b[e].params.price / (k.archery_uses * k.archery_cooldown / 1E3) * 100) / 100 : "exp_s" == g ? Math.round(k.xp / (k.archery_cooldown / 1E3) * 100) / 100 : "level" == g ? k.min_level : "name" == g ? b[e].name : k[g]
                        } : "enchant" == e && (x = function(e, f) {
                            return -1 < e && b[e] ? "name" == f ? b[e].name : "enchant" == f ? item_base[b[e].enchant.to_enchant].name : b[e].enchant[f] : 0
                        });
                        0 < x(n[p], f) || "family" == f && "string" == typeof x(n[p], f) ? k.push(n[p]) : q.push(n[p])
                    }
                    0 < k.length && m(k);
                    0 < q.length && m(q);
                    t && (k.reverse(), 0 === k.length && q.reverse());
                    for (var y in q) k.push(q[y]);
                    n = k
                }
            }
            Mods.Wikimd.oldSortList = n;
            if (g) Mods.Wikimd.populateWiki(b, n);
            else return n
        }
    };
    Mods.Wikimd.populateWikiList = function() {
        var b = getElem("mods_wiki_type"),
            e = getElem("mods_wiki_type_item"),
            f = getElem("mods_wiki_type_item_type"),
            g = getElem("mods_wiki_type_item_skill"),
            k = getElem("mods_wiki_type_monster"),
            m = getElem("mods_wiki_type_vendor"),
            n = getElem("mods_wiki_type_craft"),
            p = getElem("mods_wiki_type_pet"),
            q = getElem("mods_wiki_type_spell"),
            t = getElem("mods_wiki_type_arrow"),
            r = getElem("mods_wiki_type_enchant"),
            x = getElem("mods_wiki_type_craft_skill"),
            y = getElem("mods_wiki_type_craft_source"),
            A = getElem("mods_wiki_name"),
            u = getElem("mods_wiki_range"),
            B = parseInt(getElem("mods_wiki_level_low").value),
            C = parseInt(getElem("mods_wiki_level_high").value),
            v = {},
            D = Mods.Wikimd.item_formulas,
            E = Mods.Wikimd.formulas,
            w;
        if ("undefined" != typeof b.value)
            if ("item" == b.value) {
                for (w in D) v[w] = D[w];
                if ("name" == e.value) {
                    if ("undefined" != typeof A.value)
                        for (w in v) u = v[w].name.toLowerCase(), k = A.value.toLowerCase(), 0 > u.indexOf(k) && delete v[w]
                } else {
                    if ("skill" ==
                        e.value)
                        if ("-1" != g.value)
                            for (w in v) v[w].skill.toLowerCase() != g.value && delete v[w];
                        else return !1;
                    else if ("type" == e.value)
                        if ("-1" != f.value)
                            for (w in k = f.value, v) {
                                var A = v[w].slot || "none",
                                    A = A.toLowerCase(),
                                    z = v[w].type || "none",
                                    z = z.toLowerCase(),
                                    m = v[w].skill || "none",
                                    m = m.toLowerCase(); - 1 < k.indexOf(A) && -1 < k.search(z) || A == k || m == k || z == k || delete v[w]
                            } else return !1;
                    if (-1 != u.value)
                        for (w in v) m = "", m = "level" == u.value ? v[w].level : v[w].params[u.value] || null, null === m && delete v[w], "number" == typeof B && "undefined" != typeof v[w] &&
                            (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] && (!(m > C) && -1 < m || delete v[w])
                }
            } else if ("monster" == b.value || "vendor" == b.value) {
            for (w in npc_base) v[w] = npc_base[w];
            if ("monster" == b.value)
                for (w in v)
                    if (3 != v[w].type) delete v[w];
                    else if ("name" == k.value) "undefined" != typeof A.value && (t = A.value.toLowerCase(), y = v[w].name.toLowerCase(), -1 == y.indexOf(t) && delete v[w]);
            else if ("item" == k.value) {
                q = !1;
                for (z in v[w].params.drops) "number" == typeof parseInt(z) && (r = v[w].params.drops, t = A.value.toLowerCase(),
                    r = item_base[r[z].id].name, r = r.toLowerCase(), -1 < r.indexOf(t) && (q = !0));
                q || delete v[w]
            } else -1 != u.value && "undefined" != typeof v[w] && (m = "level" == u.value ? FIGHT.calculate_monster_level(v[w]) : "health" == u.value ? v[w].temp.health : v[w].temp["total_" + u.value] || null, null === m && delete v[w], "number" == typeof B && "undefined" != typeof v[w] && (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] && (!(m > C) && -1 < m || delete v[w]));
            else if ("vendor" == b.value)
                for (w in v)
                    if (4 != v[w].type) delete v[w];
                    else if ("name" ==
                m.value) {
                if ("undefined" != typeof A.value)
                    for (w in v) t = A.value.toLowerCase(), y = v[w].name.toLowerCase(), -1 == y.indexOf(t) && delete v[w]
            } else {
                if ("item" == m.value) {
                    q = !1;
                    for (z in v[w].temp.content) "number" == typeof parseInt(z) && (r = v[w].temp.content, t = A.value.toLowerCase(), r = item_base[r[z].id].name, r = r.toLowerCase(), -1 != r.indexOf(t) && (q = !0));
                    q || delete v[w]
                }
            } else return !1
        } else if ("craft" == b.value) {
            for (w in E) v[w] = E[w];
            if ("item" == n.value) {
                if ("undefined" != typeof A.value)
                    for (w in v) {
                        q = !1;
                        t = A.value.toLowerCase();
                        y = v[w].name;
                        y = y.toLowerCase(); - 1 != y.indexOf(t) && (q = !0);
                        if (!q)
                            for (z in v[w].pattern.requires)
                                if ("undefined" != typeof item_base[z].name && (r = item_base[z].name, r = r.toLowerCase(), -1 != r.indexOf(t))) {
                                    q = !0;
                                    break
                                }
                        if (!q)
                            for (z in v[w].pattern.requires_one_from)
                                if (u = v[w].pattern.requires_one_from[z], "undefined" != typeof item_base[u].name && (r = item_base[u].name, r = r.toLowerCase(), -1 != r.indexOf(t))) {
                                    q = !0;
                                    break
                                }
                        if (!q)
                            for (z in v[w].pattern.consumes)
                                if ("undefined" != typeof item_base[z].name && (r = item_base[z].name, r = r.toLowerCase(), -1 != r.indexOf(t))) {
                                    q = !0;
                                    break
                                }
                        q || delete v[w]
                    }
            } else {
                if ("skill" == n.value)
                    if (-1 != x.value)
                        for (w in v) v[w].skill.toLowerCase() != x.value && delete v[w];
                    else return !1;
                if ("source" == n.value)
                    if (-1 != y.value)
                        for (w in v) A = "fletching" == y.value ? "fletching table" : y.value, v[w].object.name.toLowerCase() != A && delete v[w];
                    else return !1;
                if (-1 != u.value)
                    for (w in v) m = "base_chance" == u.value || "max_chance" == u.value ? "max_chance" == u.value && null === v[w].pattern.max_chance ? 100 * v[w].pattern.base_chance || null : 100 * v[w].pattern[u.value] ||
                        100 * v[w].pattern.chance || null : "undefined" != typeof v[w][u.value] ? parseInt(v[w][u.value]) : null, null === m && delete v[w], "number" == typeof B && "undefined" != typeof v[w] && (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] && (!(m > C) && -1 < m || delete v[w])
            }
        } else if ("pet" == b.value) {
            for (w in Mods.Wikimd.pet_family) v[w] = item_base[w];
            for (w in v) "name" == p.value && ("undefined" != typeof A.value ? (t = A.value.toLowerCase(), y = v[w].name.toLowerCase(), -1 == y.indexOf(t) && delete v[w]) : "family" == p.value ? "undefined" !=
                typeof A.value && (t = A.value.toLowerCase(), y = Mods.Wikimd.family[w], void 0 !== y ? (y = y.toLowerCase(), -1 == y.indexOf(t) && delete v[w]) : delete v[w]) : -1 != u.value && "undefined" != typeof v[w] && (m = -1 == u.value ? null : "aim" == u.value || "armor" == u.value || "power" == u.value || "magic" == u.value || "speed" == u.value ? item_base[v[w].b_i].params[u.value] : pets[v[w].params.pet].params[u.value], null === m && delete v[w], "number" == typeof B && "undefined" != typeof v[w] && (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] &&
                    (!(m > C) && -1 < m || delete v[w])))
        } else if ("spell" == b.value) {
            for (w in D) D[w].magic && (v[w] = D[w]);
            for (w in v) "name" == q.value ? "undefined" != typeof A.value && (t = A.value.toLowerCase(), y = v[w].name.toLowerCase(), -1 == y.indexOf(t) && delete v[w]) : -1 != u.value && "undefined" != typeof v[w] && (z = v[w].magic, k = "damage" == u.value ? "basic_damage" : "exp" == u.value ? "xp" : "casts" == u.value ? "uses" : u.value, m = "dmg_s" == u.value ? Math.round(z.basic_damage / (z.cooldown / 1E3) * 10) / 10 : "cost_s" == u.value ? Math.round(v[w].params.price / (z.uses * z.cooldown)) :
                "exp_s" == u.value ? Math.round(z.xp / z.uses) : null, m = -1 == u.value ? null : null !== m ? m : "price" == u.value ? v[w].params.price : z[k], null === m && delete v[w], "number" == typeof B && "undefined" != typeof v[w] && (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] && (!(m > C) && -1 < m || delete v[w]))
        } else if ("arrow" == b.value) {
            for (w in D) D[w].arrow && (v[w] = D[w]);
            for (w in v) "name" == t.value && "undefined" != typeof A.value && (u = A.value.toLowerCase(), y = v[w].name.toLowerCase(), -1 == y.indexOf(u) && delete v[w])
        } else if ("enchant" ==
            b.value) {
            for (w in D) D[w].enchant && D[w].enchant.to_enchant && (v[w] = D[w]);
            for (w in v) "item" == r.value ? "undefined" != typeof A.value && (t = A.value.toLowerCase(), y = v[w].name.toLowerCase(), k = (k = v[w].enchant.from_enchant) ? item_base[k].name.toLowerCase() : null, z = (z = v[w].enchant.to_enchant) ? item_base[z].name.toLowerCase() : null, -1 == y.indexOf(t) && (k && -1 == k.indexOf(t) || !k) && (z && -1 == z.indexOf(t) || !k) && delete v[w]) : -1 != u.value && "undefined" != typeof v[w] && (m = -1 == u.value ? null : v[w].enchant[u.value] || null, null === m && delete v[w],
                "number" == typeof B && "undefined" != typeof v[w] && (!(m < B) && -1 < m || delete v[w]), "number" == typeof C && "undefined" != typeof v[w] && (!(m > C) && -1 < m || delete v[w]))
        } else return !1;
        else return !1;
        return Mods.Wikimd.newWikiLoad = v
    };
    Mods.Wikimd.currentSort = function() {
        var b = getElem("mods_wiki_type"),
            e = getElem("mods_wiki_type_item"),
            f = getElem("mods_wiki_type_item_type"),
            g = getElem("mods_wiki_type_item_skill"),
            k = getElem("mods_wiki_type_monster"),
            m = getElem("mods_wiki_type_vendor"),
            n = getElem("mods_wiki_type_craft"),
            p = getElem("mods_wiki_type_spell"),
            q = getElem("mods_wiki_type_arrow"),
            t = getElem("mods_wiki_type_enchant"),
            r = getElem("mods_wiki_type_craft_skill"),
            x = getElem("mods_wiki_type_craft_source"),
            y = getElem("mods_wiki_type_pet"),
            A = getElem("mods_wiki_name"),
            u = getElem("mods_wiki_range"),
            B = parseInt(getElem("mods_wiki_level_low").value),
            C = parseInt(getElem("mods_wiki_level_high").value),
            v = "",
            v = "monster" == b.value ? "mob " : "vendor" == b.value ? "npc " : b.value + " ",
            v = v + (("item" == b.value && e.value || "monster" == b.value && k.value || "vendor" == b.value && m.value || "craft" ==
                b.value && n.value || "pet" == b.value && y.value || "spell" == b.value && p.value || "arrow" == b.value && q.value || "enchant" == b.value && t.value) + " " || ""),
            v = v + (("item" == b.value && "name" == e.value || "monster" == b.value && "all" != k.value || "vendor" == b.value && "all" != m.value || "craft" == b.value && "item" == n.value || "pet" == b.value && ("name" == y.value || "family" == y.value) || "spell" == b.value && "name" == p.value || "arrow" == b.value && "name" == q.value || "enchant" == b.value && "item" == t.value) && (A.value || "") || ""),
            v = v + ("item" == b.value && ("type" == e.value &&
                f.value + " " || "skill" == e.value && g.value + " ") || ""),
            v = v + ("craft" == b.value && ("skill" == n.value && r.value + " " || "source" == n.value && x.value + " ") || "");
        return v += ("item" == b.value && "name" != e.value || "monster" == b.value && "all" == k.value || "craft" == b.value && "item" != n.value || "pet" == b.value && "all" == y.value || "spell" == b.value && "all" == p.value || "enchant" == b.value && "all" == t.value) && u.value + " (" + (B || "") + "," + (C || "") + ")" || ""
    };
    Mods.Wikimd.loadWikiType = function(b, e) {
        if (-1 != loadedMods.indexOf("Chatmd")) {
            var f = getElem("mods_wiki_load");
            f.innerHTML = "Go!";
            f.setAttribute("onclick", "javascript:Mods.Wikimd.populateWiki(true);")
        }
        if (!1 !== b) {
            var g = getElem("mods_wiki_type"),
                k = getElem("mods_wiki_type_item");
            getElem("mods_wiki_type_item_type");
            getElem("mods_wiki_type_item_skill");
            var m = getElem("mods_wiki_type_monster"),
                n = getElem("mods_wiki_type_vendor"),
                p = getElem("mods_wiki_type_craft");
            getElem("mods_wiki_type_craft_skill");
            getElem("mods_wiki_type_craft_source");
            var q = getElem("mods_wiki_type_pet"),
                t = getElem("mods_wiki_type_spell"),
                r = getElem("mods_wiki_type_arrow"),
                x = getElem("mods_wiki_type_enchant"),
                y = getElem("mods_wiki_name"),
                f = getElem("mods_wiki_range");
            getElem("mods_wiki_level");
            var A = getElem("mods_wiki_level_low"),
                u = getElem("mods_wiki_level_high"),
                g = g.value,
                k = k.value,
                m = m.value,
                n = n.value,
                p = p.value,
                q = q.value,
                t = t.value,
                r = r.value,
                x = x.value;
            y.value = null;
            A.value = null;
            u.value = null;
            var B, C, v, D, E, w, z, G, F, J, K, L, I, H;
            0 === b ? (C = v = z = G = "none", B = "item" == g && "block" || "none", D = "monster" == g && "block" || "none", E = "vendor" == g && "block" || "none", w = "craft" == g && "block" || "none", F = "pet" ==
                g && "block" || "none", J = "spell" == g && "block" || "none", K = "arrow" == g && "block" || "none", L = "enchant" == g && "block" || "none", H = ("item" == g && "name" != k || "monster" == g && "all" == m || "craft" == g && "item" != p || "pet" == g && "all" == q || "spell" == g && "all" == t || "arrow" == g && "all" == r || "enchant" == g && "all" == x) && "block" || "none", I = ("item" == g && "name" == k || "monster" == g && "all" != m || "vendor" == g && "all" != n || "craft" == g && "item" == p || "pet" == g && "all" != q || "spell" == g && "name" == t || "arrow" == g && "name" == r || "enchant" == g && "item" == x) && "block" || "none") : 1 == b ? (C = "item" ==
                g && "type" == k && "block" || "none", v = "item" == g && "skill" == k && "block" || "none", z = "craft" == g && "skill" == p && "block" || "none", G = "craft" == g && "source" == p && "block" || "none", H = ("item" == g && "name" != k || "monster" == g && "all" == m || "craft" == g && "item" != p || "pet" == g && "all" == q || "spell" == g && "all" == t || "arrow" == g && "all" == r || "enchant" == g && "all" == x) && "block" || "none", I = ("item" == g && "name" == k || "monster" == g && "all" != m || "vendor" == g && "all" != n || "craft" == g && "item" == p || "pet" == g && "all" != q || "spell" == g && "name" == t || "arrow" == g && "name" == r || "enchant" ==
                    g && "item" == x) && "block" || "none") : 2 == b && (H = "block");
            y = "monster" != g ? "item" != g ? "" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='price'>Price</option>             <option value='power'>Power</option>              <option value='aim'>Aim</option>             <option value='armor'>Armor</option>        <option value='magic'>Magic</option>        <option value='speed'>Speed</option>" : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='health'>Health</option>           <option value='accuracy'>ACC</option>             <option value='strength'>STR</option>        <option value='defense'>DEF</option>";
            y = "craft" != g ? y : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='base_chance'>Min%</option>        <option value='max_chance'>Max%</option>          <option value='xp'>Exp</option>";
            y = "pet" != g ? y : "<option value='sones'>Range</option>            <option value='stones'>Req SoE</option>     <option value='xp_required'>Req Exp</option>     <option value='inventory_slots'>Slots</option>    <option value='aim'>Aim</option>             <option value='power'>Power</option>        <option value='armor'>Armor</option>        <option value='magic'>Magic</option>                  <option value='speed'>Speed</option>";
            y = "spell" != g ? y : "<option value='level'>Range</option>            <option value='level'>Level</option>        <option value='damage'>Damage</option>           <option value='exp'>Exp</option>                  <option value='cooldown'>Cooldown</option>   <option value='price'>Price</option>        <option value='casts'>Casts</option>        <option value='penetration'>Spell Pen</option>        <option value='dmg_s'>Dmg/S</option>        <option value='cost_s'>Cost/S</option>       <option value='exp_s'>Exp/S</option>";
            y = "enchant" != g ? y : "<option value='low'>Range</option>            <option value='low'>Low %</option>          <option value='med'>Med %</option>               <option value='high'>High %</option>              <option value='sup'>Sup %</option>";
            "block" == H && (f.innerHTML = y);
            getElem("mods_wiki_type_item").style.display = B;
            getElem("mods_wiki_type_item_type").style.display = C;
            getElem("mods_wiki_type_item_skill").style.display = v;
            getElem("mods_wiki_type_monster").style.display = D;
            getElem("mods_wiki_type_vendor").style.display =
                E;
            getElem("mods_wiki_type_craft").style.display = w;
            getElem("mods_wiki_type_craft_skill").style.display = z;
            getElem("mods_wiki_type_craft_source").style.display = G;
            getElem("mods_wiki_type_pet").style.display = F;
            getElem("mods_wiki_type_spell").style.display = J;
            getElem("mods_wiki_type_arrow").style.display = K;
            getElem("mods_wiki_type_enchant").style.display = L;
            getElem("mods_wiki_name").style.display = I;
            getElem("mods_wiki_range").style.display = H;
            getElem("mods_wiki_level").style.display = H;
            getElem("mods_wiki_range_separate").style.display =
                H
        }
    };
    Mods.loadModMenu_options = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "block";
        getElem("mod_options_mods_options").style.display = "block";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none"
    };
    Mods.loadModMenu_load = function() {
        getElem("mod_load_options").style.display = "block";
        getElem("mod_load_mods_options").style.display = "block";
        getElem("mod_options_options").style.display =
            "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "none";
        getElem("mod_wiki_mods_options").style.display = "none"
    };
    Mods.loadModMenu_wiki = function() {
        getElem("mod_load_options").style.display = "none";
        getElem("mod_load_mods_options").style.display = "none";
        getElem("mod_options_options").style.display = "none";
        getElem("mod_options_mods_options").style.display = "none";
        getElem("mod_wiki_options").style.display = "block";
        getElem("mod_wiki_mods_options").style.display =
            "block"
    };
    (function() {
        getElem("mods_form_top").innerHTML = "<span style='float:left; font-weight: bold; color:#FFFF00; margin-bottom:3px;'>" + _tmi("Mods Info") + "</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_load();' style='float:left; margin:0px; margin-left: 42px;'>" + _tmi("Load mods") + "</span><span id='mods_menu_load' class='common_link' onclick='javascript:Mods.loadModMenu_wiki();' style='float:left; margin:0px; margin-left: 41px;'>" + _tmi("wiki", {
                fn: "capitaliseFirstLetter"
            }) +
            "</span><span id='mod_options_close' class='common_link' style='margin: 0px; margin-bottom: 2px;' onclick='javascript:addClass(getElem(&apos;mods_form&apos;),&apos;hidden&apos;);'>" + _tmi("Close", {
                ns: "interface"
            }) + "</span>";
        getElem("mods_form", {
            style: {
                width: "464px"
            }
        });
        Mods.Wikimd.loadDivs();
        Mods.elemClass("scrolling_allowed", "mod_wiki_mods_options");
        Mods.elemClass("scrolling_allowed", "mod_wiki_options");
        getElem("mod_wiki_search").onmouseover = function(b) {
            Mods.Wikimd.mouse.x = b.clientX;
            Mods.Wikimd.mouse.y =
                b.clientY
        };
        Mods.Wikimd.populate_item_formulas();
        Mods.Wikimd.populate_pets();
        Mods.Wikimd.populate_family()
    })();
    Mods.timestamp("wikimd")
};
Load.miscmd = function() {
    modOptions.miscmd.time = timestamp();
    penalty_bonus = function() {
        Mods.Miscmd.penalty = getElem("penalty_bonus_skill").value;
        localStorage.penalty_bonus = JSON.stringify(Mods.Miscmd.penalty);
        Mods.Miscmd.oldPenaltyBonus()
    };
    Mods.Miscmd.ideath.sort_values = function() {
        for (var b = {}, e = [], f = 2, g, k = 0; k < players[0].temp.inventory.length; k++) {
            var m = players[0].temp.inventory[k].id,
                n = item_base[m].params.price;
            855 != m ? (b[m] = n, e.push(parseInt(m))) : players[0].temp.inventory[k].selected && (f = 7)
        }
        players[0].temp.created_at <
            timestamp() - 72E5 || (f = 40);
        if (players[0].pet.enabled) {
            g = players[0].pet.id;
            g = pets[g].params.item_id;
            for (k = 0; k < e.length; k++) e[k] == g && e.splice(k, 1);
            delete b[g]
        }
        0 < e.length && e.sort(function(e, f) {
            return b[e] > b[f] ? -1 : b[e] < b[f] ? 1 : item_base[e].name > item_base[f].name ? -1 : 1
        });
        e.splice(f, 40);
        e.push(g);
        return e
    };
    Mods.Miscmd.ideath.safe_items = function() {
        var b = Mods.Miscmd.ideath.bgColor,
            e = Mods.Miscmd.ideath.brColor,
            f = Mods.Miscmd.ideath.sort_values();
        for (a = 0; 40 > a; a++) {
            var g = getElem("inv_" + a);
            g.innerHTML = "&nbsp;";
            if ("undefined" !=
                typeof players[0].temp.inventory[a]) {
                var k = players[0].temp.inventory[a],
                    m;
                for (m in f) k.id == f[m] && (g.innerHTML = "<div class='pointer' title='" + _tm("You keep this item if you die.") + "' style='position: absolute; top: 0%; left: 0%; margin-left: -1px; margin-top: -1px; width: 13%; height: 13%; background-color: " + b + "; border: 1px solid; border-color: " + e + "; opacity: .8;'>&nbsp;</div>", f.splice(m, 1))
            }
        }
    };
    oldBigMenuShow = BigMenu.show;
    BigMenu.show = function(b) {
        Mods.showInv = 2 === b ? !0 : !1;
        oldBigMenuShow(b)
    };
    Mods.Miscmd.invClick =
        function() {
            Mods.showInv && (Mods.showBag = !Mods.showBag, Mods.showBag ? getElem("inventory").style.display = "block" : getElem("inventory").style.display = "")
        };
    Mods.Miscmd.toolbar.loadDivs = function() {
        var b = ["td_inventory_old"],
            e;
        for (e in b) createElem("span", "toolbar_padding_holder", {
            id: b[e],
            className: "toolbar_item"
        });
        createElem("div", wrapper, {
            id: "td_inventory",
            style: "position: absolute; text-shadow: -1px -1px #333; border: 1px solid #000; border-radius: 4px; font-weight: normal; z-index: 999999; opacity: .8; background-color: rgba(20, 20, 20, 0.7); pointer-events: none; text-align: center; color: white; font-family: ariel;"
        });
        createElem("div", wrapper, {
            id: "td_inv_click",
            onclick: Mods.Miscmd.invClick,
            style: "position: absolute; z-index: 999999; opacity: .8; text-align: center; color: white; font-family: ariel;"
        });
        touch_initialized && (getElem("td_inv_click").style.display = "none")
    };
    Mods.Miscmd.toolbar.playerLocation = function() {
        return "<span style='color: #BBB;'>" + map_names[players[0].map] + "</span> (" + players[0].i + ", " + players[0].j + ")"
    };
    Mods.Miscmd.toolbar.dpsinfo = function() {
        var b;
        Mods.Miscmd.dpsmode ? b = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' class='pointer'><span style='color: #BBB;'>" +
            _tmi("DPS") + ":</span> " + Math.round(100 * Mods.Miscmd.avgdps) / 100 + " (" + Math.round(100 * Mods.Miscmd.maxdps) / 100 + ")</span>" : (b = 1E4 < Mods.Miscmd.avgexp ? Math.round(Mods.Miscmd.avgexp / 10) / 100 + "k" : Math.round(Mods.Miscmd.avgexp), b = "<span onclick='javascript:Mods.Miscmd.switchdpsmode();' onMouseOver='Mods.Miscmd.ShowExpPopup(this);' onMouseOut='Mods.Miscmd.HideExpPopup();' class='pointer'><span style='color: #BBB;'>" + _tmi("Exp/h") + ":</span> " + b + "</span>");
        return b
    };
    Mods.Miscmd.ShowExpPopup = function(b) {
        if (!1 ===
            Mods.Miscmd.dpsmode) {
            b = getElem("ww_xp_popup");
            b || (createElem("div", wrapper, {
                id: "ww_xp_popup",
                className: "xptable menu",
                style: "z-index: 101; visibility: hidden; position: absolute; opacity: 1; padding: 0px;"
            }), b = getElem("ww_xp_popup"));
            getElem("td_dpsinfo");
            b.style.left = getElem("td_dpsinfo").getBoundingClientRect().left - (body_offset_x || 0) + "px";
            b.style.top = getElem("td_dpsinfo").getBoundingClientRect().bottom - (body_offset_y || 0) + "px";
            var e = "<table><thead><tr><th>" + _tmi("Skill", {
                    ns: "interface"
                }) + "</th><th>" +
                _tmi("Exp/h") + "</th><th>" + _tmi("Level in") + "</th></tr></thead><tbody>",
                f = {},
                g;
            for (g in Mods.Miscmd.adps) f[Mods.Miscmd.adps[g].skill] ? (f[Mods.Miscmd.adps[g].skill].xp += Mods.Miscmd.adps[g].xpdelta, f[Mods.Miscmd.adps[g].skill].mintime > Mods.Miscmd.adps[g].time && (f[Mods.Miscmd.adps[g].skill].mintime = Mods.Miscmd.adps[g].time), f[Mods.Miscmd.adps[g].skill].maxtime < Mods.Miscmd.adps[g].time && (f[Mods.Miscmd.adps[g].skill].maxtime = Mods.Miscmd.adps[g].time)) : (f[Mods.Miscmd.adps[g].skill] = {}, f[Mods.Miscmd.adps[g].skill].mintime =
                f[Mods.Miscmd.adps[g].skill].maxtime = Mods.Miscmd.adps[g].time, f[Mods.Miscmd.adps[g].skill].xp = Mods.Miscmd.adps[g].xpdelta);
            g = !0;
            for (var k in f) {
                var m = 3600 * f[k].xp / ((f[k].maxtime - f[k].mintime) / 1E3);
                if (isFinite(m) && !isNaN(m)) {
                    var n = Level.xp_for_level(skills[0][k].level + 1) - skills[0][k].xp,
                        p = Math.round((skills[0][k].xp - Level.xp_for_level(skills[0][k].level)) / (Level.xp_for_level(skills[0][k].level + 1) - Level.xp_for_level(skills[0][k].level)) * 100),
                        q = Math.floor(n / (m / 3600)),
                        n = parseInt(q / 3600),
                        t = parseInt(q /
                            60) % 60,
                        q = q % 60,
                        n = (10 > n ? "0" + n : n) + ":" + (10 > t ? "0" + t : t) + ":" + (10 > q ? "0" + q : q),
                        m = 1E4 < m ? Math.round(m / 10) / 100 + "k" : Math.round(m),
                        e = !0 === g ? e + "<tr>" : e + "<tr class='alt'>",
                        e = e + ("<td>" + _tmi(capitaliseFirstLetter(k), {
                            ns: "interface"
                        }) + " (" + p + "%)</td><td>" + m + "</td><td>" + n + "</td></tr>");
                    g = !0 === g ? !1 : !0
                }
            }
            b.innerHTML = e + "</tbody></table>";
            b.style.visibility = ""
        }
    };
    Mods.Miscmd.HideExpPopup = function() {
        getElem("ww_xp_popup").style.visibility = "hidden"
    };
    Mods.Miscmd.switchdpsmode = function() {
        Mods.Miscmd.dpsmode ? (Mods.Miscmd.avgexp =
            0, Mods.Miscmd.adps = [], Mods.Miscmd.maxtime = 18E4, Mods.Miscmd.dpsmode = !1) : (Mods.Miscmd.maxdps = 0, Mods.Miscmd.avgdps = 0, Mods.Miscmd.adps = [], Mods.Miscmd.maxtime = 6E4, getElem("ww_xp_popup").style.visibility = "hidden", Mods.Miscmd.dpsmode = !0);
        Mods.Miscmd.toolbar.updateToolbar("dpsinfo")
    };
    Mods.Miscmd.toolbar.playerStats = function() {
        for (var b = !1, e = 0; e < players[0].params.magic_slots; e++)
            if (players[0].params.magics[e]) var f = Magic[players[0].params.magics[e].id].params.penetration,
                b = b || f,
                b = Math.min(b, f);
        b = b || 0;
        return "<span style='color: #BBB;'>" +
            _tmi("Stats", {
                ns: "interface"
            }) + ":</span> " + Math.floor(players[0].temp.total_accuracy) + " / " + Math.floor(players[0].temp.total_strength) + " / " + Math.floor(players[0].temp.total_defense) + " / " + Math.floor(players[0].temp.magic / 1.2 + skills[0].magic.level + b) + " / " + Math.floor(players[0].temp.total_archery)
    };
    Mods.Miscmd.toolbar.questData = function(b) {
        for (var e = [], f = getElem("quests_form") || !1, g = 0; g < player_quests.length; g++) player_quests[g].progress < quests[g].amount && e.push(quests[g]);
        if (f)
            for (f = f.childNodes[1].childNodes[0].childNodes[0],
                g = 1; g < f.childNodes.length; g++)
                if (null == f.childNodes[g].onclick) {
                    var k = f.childNodes[g].childNodes[1].childNodes[1].childNodes[0].getAttribute("data-tq"),
                        m;
                    for (m in e)
                        if (e[m].name == k) {
                            f.childNodes[g].setAttribute("onclick", 'Mods.Miscmd.toolbar.questData("' + e[m].id + '"); Mods.Miscmd.toolbar.updateToolbar("questData")');
                            break
                        }
                }
        b = b || Mods.Miscmd.toolbar.activeQuest || !1;
        b && player_quests[b] && player_quests[b].progress != quests[b].amount || !(0 < e.length) || (b = e[0].id);
        if ("undefined" == typeof player_quests[b]) getElem("td_quests").style.display =
            "none";
        else return getElem("td_quests").style.display = "", e = "<span style='color: #BBB;'>" + _tmi("Quest") + ":</span> (" + player_quests[b].progress + "/" + quests[b].amount + ") " + npc_base[quests[b].npc_id].name, Mods.Miscmd.toolbar.activeQuest = b, localStorage.activeQuest = JSON.stringify(b), e
    };
    Mods.Miscmd.toolbar.invSlots = function() {
        getElem("td_inventory_old").style.display = "none";
        var b = 40 - players[0].temp.inventory.length,
            e = "",
            f = "";
        players[0].pet.enabled && (e = players[0].pet.chest.length, f = pets[players[0].pet.id].params.inventory_slots,
            e = f - e);
        return "<span style='color: yellow;'>" + b + "</span>" + (players[0].pet.enabled ? "/<span style='color:yellow;'>" + e + "</span>" : "")
    };
    Mods.Miscmd.toolbar.currentWorld = function() {
        var b = "";
        0 < Mods.currentWorldID && (b = "<div id='td_current_world_hover' class='pointer' style='color: #FFF;'><span>" + _tmi("World", {
            ns: "interface"
        }) + " - " + Mods.currentWorldID + "</span></div>");
        return b
    };
    Mods.Miscmd.toolbar.cache = {};
    Mods.Miscmd.toolbar.updateToolbar = function(b) {
        var e = Mods.Miscmd.toolbar,
            f = Mods.Miscmd.toolbar.ids;
        if ("undefined" !=
            typeof b) e.updateCheckCache(f[b], e[b]());
        else
            for (var g in f) e.updateCheckCache(f[g], e[g]())
    };
    Mods.Miscmd.toolbar.updateCheckCache = function(b, e) {
        Mods.Miscmd.toolbar.cache[b] && Mods.Miscmd.toolbar.cache[b] == e || (Mods.Miscmd.toolbar.cache[b] = e, getElem(b).innerHTML = e)
    };
    Mods.Miscmd.inventoryEquip = function(b, e, f) {
        if ("undefined" != typeof e && -1 != item_base[e].name.indexOf("Potion") && "Potion Of Preservation" != item_base[e].name)
            for (b = 1; 20 > b; b++) Timers.set("new_potion_" + e + "_" + b, function() {
                var b, f, m, n, p, q, t;
                q = {};
                q[e] = {};
                for (b in item_base[e].params)
                    if (f = /^boost_(.{1,})$/.exec(b)) m = f[1], f = item_base[e].params[f[0]], p = timestamp(), n = skills[0][m].level, n = Math.ceil(n * f), t = 6E4 * n + p, q[e][m] = {
                        percent: f,
                        start: p,
                        delta: n,
                        end: t
                    };
                if (null !== getElem("mod_potion_" + e))
                    for (b = 1; 20 > b; b++) Timers.clear("new_potion_" + e + "_" + b);
                else Mods.Miscmd.potions[e] = q[e]
            }, 1E3 * b);
        return !1
    };
    Mods.Miscmd.checkPotions = function() {
        var b, e, f, g, k, m, n, p;
        b = Mods.Miscmd.potions;
        g = getElem("mod_potion_holder");
        m = {
            accuracy: "ACC",
            alchemy: "Alch",
            carpentry: "Crpt",
            cooking: "Cook",
            defense: "DEF",
            farming: "Farm",
            fishing: "Fish",
            forging: "Forg",
            health: "Hlth",
            jewelry: "Jewl",
            magic: "Mag",
            mining: "Mine",
            strength: "STR",
            woodcutting: "Wood",
            archery: "Arch",
            fletching: "Fletch"
        };
        null !== g && delete wrapper[g];
        null === g && createElem("div", wrapper, {
            id: "mod_potion_holder",
            style: "position: absolute; z-index: 999; background: transparent; left: 11%; top: 15%; min-width: 32px; min-height: 32px;"
        });
        for (e in b) {
            g = getElem("mod_potion_" + e);
            null === g && (g = item_base[e], createElem("div", "mod_potion_holder", {
                id: "mod_potion_" + e,
                title: g.name,
                style: "position: relative; display: block; padding: 2px; float: left;",
                innerHTML: "<div style='" + Items.get_background_image(g.b_i) + " float: left; width: 32px; height: 32px; margin-left: -16px; left: 50%; position: relative;'>&nbsp;</div><div id='mod_potion_duration_" + e + "' style='float: left; clear: left; font-size: 0.7em; color: #FFF; background: #444; padding: 4px; border: 1px solid #FFF; border-radius: 5px; -moz-border-radius: 5px;'>&nbsp;</div>"
            }));
            g = "";
            n = !1;
            for (f in b[e]) k =
                skills[0][f].current - skills[0][f].level, 0 < k ? (g += "<tr><td>" + m[f] + "</td><td><span style='color: #FF0; text-align: right; padding-left: 4px;'>+" + k + "</span></td></tr>", n = !0, b[e][f].value != k && (b[e][f].value = k, p = !0)) : b[e][f].value = 0;
            p ? (g = "<table>" + g + "</table>", getElem("mod_potion_duration_" + e).innerHTML = g) : n || (getElem("mod_potion_holder").removeChild(getElem("mod_potion_" + e)), delete b[e])
        }
    };
    Mods.Miscmd.socketOn = {
        actions: ["inventory", "my_pet_data", "item_drop"],
        fn: function(b, e, f) {
            f = Mods.Miscmd.toolbar.updateToolbar;
            "my_pet_data" == b && !1 === e.enabled && setCanvasSize();
            if ("inventory" == b || "my_pet_data" == b || "item_drop" == b) f("invSlots"), Mods.Miscmd.ideath.safe_items()
        }
    };
    Mods.Miscmd.toolbar.checkTime = function() {
        Mods.Miscmd.checkPotions();
        Timers.set("check_time", function() {
            Mods.Miscmd.toolbar.checkTime()
        }, 1E3)
    };
    Mods.Miscmd.inventoryClick = function() {
        Android && 500 > timestamp() - lastTap || (Mods.Miscmd.ideath.safe_items(), Mods.Miscmd.toolbar.updateToolbar("invSlots"))
    };
    Inventory.add = function(b, e, f) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryAdd(b, e, f)
    };
    Inventory.remove = function(b, e) {
        Mods.Miscmd.toolbar.updateToolbar("invSlots");
        return Mods.Miscmd.toolbar.oldInventoryRemove(b, e)
    };
    Mods.Miscmd.setCanvasSize = function() {
        var b = wrapper.style.width.replace("px", "") / width,
            e = wrapper.style.height.replace("px", "") / height,
            f = bigIcons ? 2 : 1;
        getElem("td_inventory", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * f * b + "px",
                top: (16 + 24 * f) * e + "px",
                width: 28 * f * b + "px",
                height: 10 *
                    f * e + "px",
                fontSize: Mods.fontSize[0]
            }
        });
        getElem("td_inv_click", {
            style: {
                right: ((players[0].pet.enabled ? 66 : 34) + (300 == players[0].map || 16 == players[0].map ? 32 : 0)) * f * b + "px",
                top: 22 * e + "px",
                width: 28 * f * b + "px",
                height: 28 * f * e + "px"
            }
        })
    };
    Mods.Miscmd.changeVolume = function(b) {
        localStorage.audioVolume = b;
        b = parseInt(b);
        try {
            for (var e in sound_effects) sound_effects[e].music.setVolume(b, 0);
            for (var f in map_music) map_music[f].music.setVolume(b, 0)
        } catch (g) {}
    };
    navigator.userAgent.match(/chrome/i) && (createElem("div", "options_audio", {
        innerHTML: "<br>" + _tmi("Volume") + " <input id='settings_volume_slider' type='range' min='0' max='100' step='5' value='50' onchange='Mods.Miscmd.changeVolume(value)'/>"
    }), getElem("my_text").style.zIndex = "90", document.getElementById("settings_volume_slider").value = localStorage.audioVolume, Mods.Miscmd.changeVolume(localStorage.audioVolume));
    Mods.Miscmd.onWorldChange = function() {};
    Breeding.open_nest = function() {
        Mods.Miscmd.default_open_nest();
        Timers.set("mods_draw_pet_nest", function() {
            var b = (pet_nest = on_map[pet_nest.map][pet_nest.i][pet_nest.j]) &&
                pet_nest.params && pet_nest.params.pet_id;
            if ("undefined" != typeof b) {
                var e = {
                        length: 0
                    },
                    f;
                for (f in pets[b].params.eats) e[item_base[f].name.toLowerCase()] = " (" + parseInt(100 * pets[b].params.eats[f]) + "%)", e.length++;
                var b = Array.prototype.slice.call(document.querySelectorAll("div#pet_nest_form > .inv_item.tooltip"), 0 - e.length),
                    g;
                for (g in b) f = b[g].title.toLowerCase(), "undefined" != typeof e[f] && (b[g].title += e[f])
            }
        }, 1)
    };
    (function() {
        getElem("penalty_bonus_skill").value = Mods.Miscmd.penalty;
        for (var b = 0; 40 > b; b++) getElem("inv_" +
            b).style.position = "relative";
        getElem("chest_item", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap"
            }
        });
        getElem("inv_name", {
            style: {
                overflow: "hidden",
                maxWidth: "185px",
                whiteSpace: "nowrap",
                cssFloat: "left"
            }
        });
        Mods.Miscmd.toolbar.loadDivs();
        Mods.Miscmd.toolbar.updateToolbar();
        Mods.Miscmd.toolbar.checkTime();
        Mods.Miscmd.ideath.safe_items();
        setCanvasSize()
    })();
    Mods.timestamp("miscmd")
};
Load.chatmd = function() {
    modOptions.chatmd.time = timestamp();
    Mods.Chatmd.ModDevToggle = function() {
        var b = getElem("settings_moddevtoggle");
        switch (Mods.Chatmd.modDevColorToggle) {
            case 0:
                b.innerHTML = "ModDev Color : Enabled";
                Mods.Chatmd.modDevColorToggle = 1;
                break;
            default:
                b.innerHTML = "ModDev Color : Disabled", Mods.Chatmd.modDevColorToggle = 0
        }
        localStorage.moddevtoggle = JSON.stringify(Mods.Chatmd.modDevColorToggle)
    };
    Mods.Chatmd.blockChat = function(b, e, f, g, k) {
        f = {
            "#ping;": !0,
            "@mods ": !1
        };
        k = !1;
        if ("whisper" == g)
            for (var m in f) {
                0 ===
                    b.indexOf(m) && (e == players[0].name && f[m] || !f[m]) && (k = !0);
                if (k && "@mods " == m && e != players[0].name) return b = b.replace(m, ""), m = Player.is_chat_mod(e) ? COLOR.LGREEN : Player.is_mod(e) ? COLOR.GREEN : Player.is_admin(e) ? COLOR.ORANGE : "#EAE330", addChatText(b, e, m, "chat", Mods.Chatmd.ModCh.channel), !0;
                g = timestamp() - (Mods.Chatmd.delay || 0);
                if (k) return 1E3 < g && (Mods.Chatmd.delay = timestamp(), Mods.Chatmd.message(b)), !0
            }
        return !1
    };
    Mods.Chatmd.message = function(b) {};
    Mods.Chatmd.translateSpamItems = function() {
        var b = [_tm("You are under attack!", {
                ns: "interface"
            }), _tm("Cannot do that yet", {
                ns: "errors"
            }), _tm("I think that I'm missing something.", {
                ns: "errors"
            }), _tm("You feel a bit better", {
                ns: "interface"
            }), _tm("Your inventory is full!", {
                ns: "errors"
            }), _tm("You feel more experienced", {
                ns: "interface"
            }), _tm("I need a seed to do that.", {
                ns: "errors"
            }), _tm("I need a rake to do that.", {
                ns: "errors"
            }), _tm("Not enough free space in your magic pouch!", {
                ns: "errors"
            }), _tm("You need a magic pouch!", {
                ns: "errors"
            }), _tm("Chest is full!", {
                ns: "errors"
            }), _tm("You ran away.", {
                ns: "interface"
            }), _tm("Plant is revived and starts to grow again", {
                ns: "interface"
            }), _tm("Plant is feeling refreshed", {
                ns: "interface"
            }), _tm("Your watering can is now filled with water", {
                ns: "interface"
            })],
            e = _tm("This pouch has a limit {amount} of each spell!", {
                ns: "errors",
                amount: 99999
            }),
            e = e.substr(0, e.search("99999"));
        b.push(e);
        Mods.Chatmd.spamItems = b
    };
    Mods.Chatmd.set_hidden = function() {
        return !0 === Mods.Chatmd.block_hidden ? Mods.Chatmd.block_hidden = !1 : !0
    };
    Mods.Chatmd.marketSearch = function(b, e, f) {
        if (!(!selected ||
                selected && "undefined" == typeof selected.name || selected && "undefined" != typeof selected.name && -1 == selected.name.indexOf("Chest") || "undefined" == typeof b || "undefined" == typeof f) && (Market.open(selected), 1 == b || 0 === b)) {
            getElem("market_search_type").value = b;
            if (!1 !== e && -1 < e && 11 > e) getElem("market_search_category").value = e;
            else if (void 0 !== item_base[f]) getElem("market_search_category").value = parseInt(item_base[f].b_t);
            else return;
            if (void 0 !== item_base[f]) getElem("market_search_item").value = f;
            else if (8 < e && "string" ==
                typeof f) getElem("market_search_name").value = f;
            else return;
            Market.client_search()
        }
    };
    Mods.Chatmd.ModCh.nameClick = function(b) {
        if (GAME_STATE == GAME_STATES.CHAT) {
            var e = getElem("mod_text"),
                f = getElem("my_text");
            if (getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
                var g = Mods.Chatmd.ModCh.targets();
                if (g) {
                    var k = g.targets,
                        g = g.message; - 1 == k.indexOf(b) ? k.push(b) : k.splice(k.indexOf(b), 1);
                    b = JSON.stringify(k);
                    b = b.replace(/"/g, "");
                    e.value = "@" + b + " " + g;
                    f.value = "/@mods @" + b + " " + g
                } else e.value = '/w "' + b + '" ',
                    f.value = '/w "' + b + '" '
            } else f.value = '/w "' + b + '" ';
            Chat.update_string()
        }
    };
    Mods.Chatmd.ModCh.targets = function() {
        if (GAME_STATE == GAME_STATES.CHAT && getElem("current_channel").value == Mods.Chatmd.ModCh.channel) {
            var b = getElem("mod_text").value;
            if (/^@/.test(b)) {
                var e = /^@ ?"([^"]{0,})"/,
                    f = /^@ ?([^ ]{1,}) /,
                    e = /^@ ?([\[\(][^\]\)]{0,}[\]\)])/.exec(b) || e.exec(b) || f.exec(b);
                if (!e) return {
                    targets: [],
                    message: ""
                };
                b = b.slice(e[0].length).trim().replace(/""/, '""');
                e = e[1];
                "" === e && (e = "[]");
                e = e.replace(/",? ?"/g, '","').replace(/^\(/,
                    "[").replace(/\)$/, "]").replace(/^\[/, '["').replace(/, ?/g, '","').replace(/]$/, '"]').replace(/""/g, '"');
                '["]' == e && (e = "[]");
                !/^\[.*\]$/.test(e) && (e = '["' + e + '"]');
                e = JSON.parse(e);
                return e = {
                    message: b,
                    targets: e
                }
            }
        }
        return !1
    };
    Mods.Chatmd.chatContext = function(b, e) {
        for (var f = b.target || b.srcElement, g = !1; f && f !== document; f = f.parentNode)
            if (f.classList.contains("chat_text")) {
                g = f;
                break
            }
        if (g) {
            var k = g.id ? /^chat_(\S+)_\d+$/g.exec(g.id) : !1,
                k = k && 0 < k.length ? k[1] : !1;
            b.preventDefault();
            b.clientX = b.clientX || b.pageX || b.touches[0].pageX;
            b.clientY = b.clientY || b.pageY || b.touches[0].pageY;
            var m = function(b) {
                    Socket.send("message", {
                        data: b,
                        lang: getElem("current_channel").value
                    })
                },
                f = [];
            mod_initialized || chat_mod_initialized ? (f = [{
                name: e,
                method: "Mute",
                func: function() {
                    m("/mute " + e)
                }
            }, {
                name: e,
                method: "Unmute",
                func: function() {
                    m("/unmute " + e)
                }
            }], mod_initialized && (f.push({
                name: e,
                method: "Kick",
                func: function() {
                    m("/kick " + e)
                }
            }), f.push({
                name: e,
                method: "Ban",
                func: function() {
                    Popup.prompt("Ban. Are you sure?", function() {
                        m("/ban " + e)
                    })
                }
            })), g.id && f.push({
                name: e,
                method: "Remove Message",
                func: function() {
                    Socket.send("remove_line", {
                        line: g.id.replace(/^chat_/g, ""),
                        lang: /^chat_(\S+)_\d+$/g.exec(g.id)[1]
                    });
                    Popup.prompt("Also mute " + e + "?", function() {
                        m("/mute " + e)
                    }, null_function)
                }
            })) : k && g.id && Contacts.channel_permissions(k, "chat_moderator") && f.push({
                name: e,
                method: _tm("Remove message", {
                    ns: "interface"
                }),
                func: function() {
                    Socket.send("remove_line", {
                        line: g.id.replace(/^chat_/g, ""),
                        lang: k
                    })
                }
            });
            Contacts.are_friends(e) ? f.push({
                    name: e,
                    method: "Remove friend",
                    func: function() {
                        Contacts.remove_friend(e)
                    }
                }) :
                f.push({
                    name: e,
                    method: "Add friend",
                    func: function() {
                        Contacts.add_friend(e);
                        addChatText(_tm("{player} was added as a friend.", {
                            player: e
                        }), void 0, COLOR.TEAL)
                    }
                });
            Player.has_lower_permissions(e) || (Contacts.is_ignored(e) ? f.push({
                name: e,
                method: "Remove ignore",
                func: function() {
                    Contacts.remove_ignore(e)
                }
            }) : f.push({
                name: e,
                method: "Ignore",
                func: function() {
                    Contacts.ignore_player(e);
                    addChatText(_tm("{player} was added to your ignore list!", {
                        player: e
                    }), void 0, COLOR.TEAL)
                }
            }));
            var n = g.id.replace(/^[chat_]+/g, ""),
                p = !1,
                q;
            for (q in chat_history)
                if (chat_history[q] && chat_history[q].id && chat_history[q].id == n) {
                    p = chat_history[q];
                    break
                }
            p && p.to && p.user != players[0].name ? f = f.concat([{
                name: e,
                method: "Report",
                func: function() {
                    Report.show_dialog(p.user, [], !0)
                }
            }]) : p && p.user && p.user != players[0].name && Report.can_report(skills[0]) && (f = f.concat([{
                name: e,
                method: "Report",
                func: function() {
                    Report.show_dialog(p.user, [p.lang], !1)
                }
            }]));
            f = f.concat([{
                name: e,
                method: "Whisper",
                func: function() {
                    hasClass(getElem("my_text"), "hidden") && ChatSystem.toggle();
                    getElem("my_text").value = '/w "' + e + '" '
                }
            }]);
            f = f.concat([{
                name: "",
                method: "Cancel",
                func: function() {
                    addClass(getElem("action_menu"), "hidden")
                }
            }]);
            ActionMenu.custom_create(b, f)
        }
    };
    Mods.Chatmd.urlify = function(b) {
        return b.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank" onclick="event.stopPropagation();this.blur();" style="color:yellow;">$1</a>')
    };
    Mods.Chatmd.colorChat = function(b) {
        var e = !1,
            f = Mods.Chatmd.colors,
            g = !1;
        if ("boolean" != typeof b ||
            b)
            if ("string" == typeof b) {
                for (var k in channel_names)
                    if (channel_names[k] == b) {
                        g = !0;
                        break
                    }
                if (!g) return !1
            } else return !1;
        else e = !0;
        e && (b = getElem("current_channel").value);
        b = f[b] || channel_names.indexOf(b) && f["default"] || f.none;
        chat_filters.color && (b = COLOR.WHITE);
        return e ? (e = /^\//.test(getElem("my_text").value), f = /^\//.test(getElem("mod_text").value), g = /^\/\@mods/.test(getElem("my_text").value), getElem("current_channel").style.color = b, e && !g || (getElem("my_text").style.color = b), f || e && !g || (getElem("mod_text").style.color =
            b), !1) : b
    };
    Mods.Chatmd.chatCommand = function(b) {};
    Mods.Chatmd.ModCh.chatCommand = function(b, e, f, g, k, m) {};
    Mods.Chatmd.ModCh.createDiv = function() {
        null === getElem("mod_text") && createElem("input", wrapper, {
            id: "mod_text",
            type: "text",
            className: "hidden",
            style: "font-family: Brawler, cursive; font-size: 13px; position: absolute; left: 55px; bottom: 23px; z-index: 90; opacity: 1; color: " + COLOR.GREEN + "; text-shadow: 1px 1px 1px #3A3A3A;background: #9C9C9C; border: 0px; padding: 0px; margin: 0px;",
            setAttributes: {
                autocomplete: "off",
                size: "1",
                onkeypress: "javascript: Chat.update_string();",
                maxlength: "154"
            }
        })
    };
    Mods.Chatmd.ModCh.listener = function(b) {};
    Mods.Chatmd.ModCh.sendWhisper = function(b) {};
    Chat.has_client_command = function(b) {
        return 0 < b.length ? Mods.Chatmd.old_has_client_command(b) : !0
    };
    Chat.execute_client_command = function(b) {
        0 < b.length && Mods.Chatmd.old_execute_client_command(b)
    };
    Mods.Chatmd.filter_checks = function() {
        var b = getElem("filter_channel_only").checked,
            e = getElem("filter_highlight_friends").checked;
        localStorage.colorChannel =
            JSON.stringify(b);
        localStorage.highlightFriends = JSON.stringify(e); - 1 < loadedMods.indexOf("Tabs") && (b = Mods.Tabs.wwCurrentTabs[Mods.Tabs.findWithAttr(Mods.Tabs.wwCurrentTabs, "id", Mods.Tabs.wwactiveTab)], b.filter_coloredonly = getElem("filter_channel_only").checked, b.filter_highlightfriends = getElem("filter_highlight_friends").checked, localStorage.CurrentTabs = JSON.stringify(Mods.Tabs.wwCurrentTabs))
    };
    Mods.Chatmd.socketOn = {
        actions: ["message", "login"],
        fn: function(b, e) {
            e && "whisper" == e.type && e.name != players[0].name &&
                Mods.Chatmd.afkReply(e.name, e.message)
        }
    };
    Mods.Chatmd.eventListener = {
        keys: {
            keydown: [KEY_ACTION.SEND_CHAT],
            keyup: [!0]
        },
        fn: function(b, e, f) {
            if ("keydown" == b && f == KEY_ACTION.SEND_CHAT && "" !== getElem("my_text").value && !Mods.Chatmd.blockCommand && (isTouchDevice() || (Mods.Chatmd.blockCommand = !0, Timers.set("unblockCommand", function() {
                    Mods.Chatmd.blockCommand = !1
                }, 1E3)), !1 === Mods.Chatmd.chatCommands(getElem("my_text").value) && (getElem("my_text").value = ""), "$$" == getElem("current_channel").value && (getElem("my_text").value =
                    Mods.Chatmd.filterMarketChat(getElem("my_text").value)), Player.is_mod_dev(players[0].name) && 1 == Mods.Chatmd.modDevColorToggle)) {
                var g = getElem("my_text"),
                    k = "#" + g.value.slice(0);
                g.value = k.substring(0, 160)
            }
            "keyup" == b && (Mods.Chatmd.ModCh.listener(e), f != KEY_ACTION.SEND_CHAT || isTouchDevice() || (Mods.Chatmd.blockCommand = !1))
        }
    };
    Mods.Chatmd.newDrawObject = function(b, e) {
        var f;
        if (e.b_t == BASE_TYPE.PLAYER) {
            f = Player.has_lower_permissions(e.name) ? npc_base[437] : npc_base[102];
            var g = Math.random();
            Mods.Chatmd.mooDelay[e.name] =
                Mods.Chatmd.mooDelay[e.name] || 1;
            1E3 < timestamp() - Mods.Chatmd.mooDelay[e.name] && (Mods.Chatmd.mooDelay[e.name] = timestamp(), .7 < g && Mods.Chatmd.m00(e))
        } else f = e;
        Mods.Chatmd.oldDrawObject(b, f)
    };
    updateBase();
    Mods.Chatmd.m00 = function(b) {
        var e = "m00 m00! mU m00 m00 m00 m00 m00! moo MOO moo mOO M00".split(" "),
            f = Math.max(1, Math.ceil(Math.random() * e.length)) - 1,
            g = getElem("enemy_hit").cloneNode(!0),
            k = translateTileToCoordinates(b.i, b.j);
        g.id = "moo_" + b.id + (new Date).getTime();
        removeClass(g, "hidden");
        g.innerHTML = "<div id='enemy_burst' style='display: block; position: relative; background: #000000; text-align: center; width: 35px; height: 35px; -webkit-transform: rotate(20deg); -moz-transform: rotate(20deg); -ms-transform: rotate(20deg); -o-transform: rotate(20deg);'></div><div id='enemy_damage' class='damage' style='font-size: 16px; top: 4px;'></div>";
        g.childNodes[0].innerHTML = "<div style='position: absolute; background: #000000; top: 0; left: 0; height: 35px; width: 35px; -webkit-transform: rotate(135deg); -moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -o-transform: rotate(135deg)'></div>";
        g.childNodes[1].innerHTML = e[f];
        g.style.background = "#000000";
        g.style.width = "35px";
        g.style.height = "35px";
        wrapper.appendChild(g);
        g.style.left = (k.x + 16 + players[0].mx) * current_ratio_x + "px";
        g.style.top = (k.y - 40 + players[0].my - 20) * current_ratio_y + "px";
        addClass(g, "opacity_100");
        setTimeout(function() {
            decreaseOpacity(g, 150, 10)
        }, 150)
    };
    drawObject = function(b, e) {
        Mods.Chatmd.oldDrawObject(b, e)
    };
    Draw.clear(ctx.players_show);
    updateBase();
    Mods.Chatmd.afkReply = function(b, e) {
        var f = Mods.Chatmd.afkHolder = Mods.Chatmd.afkHolder || {},
            g = Mods.Chatmd.afkMessage;
        "" !== g && b != players[0].name && (void 0 == f[b] || 3E5 < timestamp() - f[b]) && !/^@mods ?/.test(e) && (f[b] = timestamp(), Socket.send("message", {
            data: '/w "' + b + '" ' + g
        }))
    };
    Mods.Chatmd.wiki = function(b, e) {
        if ("object" === typeof e &&
            "object" === typeof b && "wiki" === e[0]) {
            var f = {
                    item: "item",
                    mob: "monster",
                    npc: "vendor",
                    craft: "craft",
                    pet: "pet",
                    spell: "spell",
                    enchant: "enchant"
                },
                g = function(b, e, f) {
                    e = "string" == typeof e ? "_" + e : "";
                    return getElem("mods_wiki_" + b + e + ("string" == typeof e && "string" == typeof f ? "_" + f : ""))
                },
                k = Mods.Wikimd.loadWikiType;
            e[1] && (g("type").value = f[e[1]] || e[1], k(0, "type"), e[2] && b[e[1]] && void 0 !== b[e[1]][e[2]] && (g("type", f[e[1]] || e[1]).value = e[2], k(1, e[1]), e.text && "text" === b[e[1]][e[2]] && (g("name").value = "string" === typeof e.text ?
                e.text : null), e.value && "value" === b[e[1]][e[2]] && (g("type", f[e[1]] || e[1], e[2]).value = "string" === typeof e.value ? e.value : -1, k(2, e[2])), !e.range || "range" !== b[e[1]][e[2]] && "value" !== b[e[1]][e[2]] || (g("range").value = e.range, g("level", "low").value = -1 < e.min ? e.min : null, g("level", "high").value = -1 < e.max ? e.max : null)));
            removeClass(getElem("mods_form"), "hidden");
            Mods.Wikimd.populateWiki(!0);
            Mods.loadModMenu_wiki && Mods.loadModMenu_wiki()
        }
    };
    Mods.Chatmd.mods_client_commands = {
        findcom: function(b) {
            if ("undefined" === typeof Mods.Newmap ||
                "undefined" === typeof Mods.Newmap.POI || "undefined" === typeof Mods.Newmap.POIfind) return "Enhanced Map mod not loaded! You need to load it first before using the /find command.";
            Mods.Newmap.POIfind = [];
            HUD.drawMinimap();
            b = b.toLowerCase();
            if ("" === b) return "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.";
            var e = "",
                f = "",
                g = !1,
                k = !1,
                m = {
                    0: "Dorpat",
                    1: "Dungeon",
                    2: "Narwa",
                    3: "Whiland",
                    4: "Reval",
                    5: "Rakblood",
                    6: "Blood River",
                    7: "Hell",
                    8: "Clouds",
                    9: "Heaven",
                    10: "Cesis",
                    11: "Walco",
                    13: "Pernau",
                    14: "Fellin Island",
                    15: "Dragon's Lair",
                    16: "No Man's Land",
                    17: "Ancient Dungeon",
                    18: "Lost Woods",
                    19: "Minigames",
                    20: "Broceliande Forest",
                    21: "Devil's Triangle",
                    22: "Cathedral",
                    23: "Illusion Guild",
                    24: "Every Man's Land",
                    25: "Moche I",
                    26: "Wittensten",
                    27: "Dungeon II",
                    28: "Dungeon III",
                    29: "Dungeon IV",
                    30: "Moche II",
                    31: "Void I",
                    32: "Nature Tower",
                    33: "Ice Tower",
                    34: "Fire Tower"
                },
                n = {},
                p;
            for (p in m) n[p] = !1;
            var q = {
                "fir log": "fir",
                "fir tree": "fir",
                "fir wood": "fir",
                "oak log": "oak",
                "oak tree": "oak",
                "oak wood": "oak",
                "willow log": "willow",
                "willow tree": "willow",
                "willow wood": "willow",
                "maple log": "maple",
                "maple tree": "maple",
                "maple wood": "maple",
                "spirit wood": "spirit log",
                "spirit tree": "spirit log",
                "blue palm log": "blue palm",
                "blue palm tree": "blue palm",
                "blue palm wood": "blue palm",
                "magic oak log": "magic oak",
                "magic oak tree": "magic oak",
                "magic oak wood": "magic oak",
                "iron ore": "iron",
                "iron chunk": "iron",
                "silver ore": "silver",
                "silver chunk": "silver",
                "gold ore": "gold",
                "gold chunk": "gold",
                "white gold ore": "white gold",
                "white gold chunk": "white gold",
                "azure ore": "azure",
                "azure chunk": "azure",
                azurite: "azure",
                "azurite ore": "azure",
                "azurite chunk": "azure",
                "platinum ore": "platinum",
                "platinum chunk": "platinum",
                "fire stone ore": "fire stone",
                "fire stone chunk": "fire stone",
                firestone: "fire stone",
                "firestone ore": "fire stone",
                "firestone chunk": "fire stone",
                grendalf: "grendalf the grey",
                overlord: "orc overlord",
                phoenix: "flame phoenix",
                vortex: "chaos vortex",
                dorpat: "transfer to dorpat",
                dungeon: "dorpat mine",
                reval: "transfer to reval",
                cesis: "transfer to cesis",
                "ancient dungeon": "transfer to ancient dungeon",
                pernau: "transfer to pernau",
                whiland: "transfer to whiland",
                clouds: "transfer to clouds",
                heaven: "transfer to heaven",
                "lost woods": "transfer to lost woods",
                "forest maze": "transfer to lost woods",
                rakblood: "transfer to rakblood",
                "no man's land": "transfer to no man's land",
                pvp: "transfer to no man's land",
                narwa: "transfer to narwa",
                "blood river": "transfer to blood river",
                hell: "transfer to hell",
                "fellin island": "transfer to fellin island",
                "dragon's lair": "transfer to dragon's lair"
            };
            b in q && (b = q[b]);
            for (p in Mods.Newmap.POI[0]) "undefined" !== typeof Mods.Newmap.POI[0][p].name && Mods.Newmap.POI[0][p].name.toLowerCase() === b && (current_map == Mods.Newmap.POI[0][p].mapid ? (g && (e += ", "), g = !0, e = e + "(" + Mods.Newmap.POI[0][p].x + ", " + Mods.Newmap.POI[0][p].y + ")", Mods.Newmap.POIfindMap = current_map, Mods.Newmap.POIfind.push({
                color: "#FF0000",
                i: Mods.Newmap.POI[0][p].x,
                j: Mods.Newmap.POI[0][p].y
            })) : n[Mods.Newmap.POI[0][p].mapid] || (k && (f += ", "), k = !0, n[Mods.Newmap.POI[0][p].mapid] = !0, f += m[Mods.Newmap.POI[0][p].mapid]));
            b = b.replace(/\w\S*/g, function(b) {
                return b.charAt(0).toUpperCase() + b.substr(1).toLowerCase()
            });
            g && (e = "Found " + b + " in " + m[current_map] + " at coordinates: " + e + ". ", HUD.drawMinimap());
            k && (e = g ? e + "Found in: " + f + "." : e + "Found " + b + " in: " + f + ".");
            return g || k ? e : b + " not found."
        },
        dailylogin: function() {
            var b = players[0].temp.consecutive_logins,
                e = timestamp() - players[0].temp.consecutive_login;
            return _tu("$tm('Daily rewards counter'): $tc('{count} day', {\"count\": \"" + b + "\"}), $tm('happened') {btime} $tm('ago')", {
                btime: {
                    timestamp: e,
                    accuracy: 4
                }
            })
        },
        tip: function() {
            return _tm("TIP") + ": " + _tm(Mods.Chatmd.game_tips[0][Math.floor(Math.random() * Mods.Chatmd.game_tips[0].length)])
        },
        played: function(b) {
            if ("string" == typeof b && (b = b.trim()) && 0 < b.length) return !0;
            b = timestamp() - players[0].temp.created_at;
            return _tm("Time since you started playing") + ": " + beautifulTimeT(b, 4) + "."
        },
        join: function(b) {
            var e = !0,
                f = !1,
                f = !1,
                g;
            for (g in channel_names)
                if (channel_names[g].toLowerCase() == b.toLowerCase()) {
                    b = channel_names[g];
                    f = !0;
                    Contacts.channels[b] &&
                        (e = !1);
                    break
                }
            f ? e ? (Contacts.add_channel(b), f = _tm("You have joined {channel}.", {
                channel: "(--chanName--)"
            })) : f = _tm("You are already in {channel}.", {
                channel: "(--chanName--)"
            }) : f = _tm("You cannot join {channel}.", {
                channel: "(--chanName--)"
            });
            return f.replace("--chanName--", b)
        },
        leave: function(b) {
            var e = !1,
                f = !1,
                f = !1,
                g;
            for (g in channel_names)
                if (channel_names[g].toLowerCase() == b.toLowerCase()) {
                    b = channel_names[g];
                    f = !0;
                    Contacts.channels[b] && (e = !0);
                    break
                }
            f && e ? (Contacts.remove_channel(b), f = _tm("You have left {channel}", {
                channel: "(--chanName--)"
            })) : f = _tm("You are not in {channel}.", {
                channel: "(--chanName--)"
            });
            return f.replace("--chanName--", b)
        },
        whisp: function(b) {
            b = b.replace("/r", "").trim() || "";
            var e = Mods.Chatmd.whispNames;
            if (0 < e.length) return b = '/w "' + e[0] + '" ' + b, getElem("my_text").value = b, !hasClass(getElem("mod_text"), "hidden") && (getElem("mod_text").value = b), !0
        },
        ping: function(b) {
            if ("all" == b) return !0;
            var e;
            b = parseInt(b) || Mods.currentWorldID || 0;
            for (var f in ServerList.downloaded)
                if (b == ServerList.downloaded[f].world) {
                    e =
                        f;
                    break
                }
            e && ServerList.preping(e, !0);
            return !1
        },
        mods: function() {
            removeClass(getElem("mods_form"), "hidden");
            return !1
        },
        wiki: function(b) {
            function e(b) {
                b && (k.text = b)
            }

            function f(b) {
                b && (r = q.exec(b)) && (k.range = r[1], k.min = r[3], k.max = r[5])
            }

            function g(b) {
                if (b && (t = p.exec(b))) {
                    b = {
                        weapon: "weapons",
                        weaponss: "weapons",
                        shield: "r.hand armors"
                    };
                    var e = ["weapon", "weaponss", "shield"],
                        g = t[1],
                        m;
                    for (m in e) g = g.replace(e[m], b[e[m]]);
                    k.value = g;
                    f(t[3])
                }
            }
            b = b.toLowerCase();
            var k, m, n, p, q, t, r;
            k = {
                0: "wiki"
            };
            m = {
                item: {
                    all: "range",
                    skill: "value",
                    type: "value",
                    name: "text"
                },
                mob: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                npc: {
                    all: "range",
                    name: "text",
                    item: "text"
                },
                craft: {
                    all: "range",
                    skill: "value",
                    source: "value",
                    item: "text"
                },
                pet: {
                    all: "range",
                    name: "text",
                    family: "text"
                },
                spell: {
                    all: "range",
                    name: "text"
                },
                enchant: {
                    all: "range",
                    item: "text"
                }
            };
            n = {
                monster: "mob",
                vendor: "npc"
            };
            p = /^([^ ]{1,})( (.*))?/gi;
            q = /^([^ ]{1,}) (\(|min ?|from ?|)?=?(\d{1,})? ?(, ?|to ?|max ?)?=?(\d{1,})?/gi;
            b = /^(item|mob|monster|npc|vendor|craft|pet|spell|enchant) ?(skill|type|name|item|family|all|source)?( (.*))?/gi.exec(b);
            if (!b) return Mods.Chatmd.wiki(m, k), !1;
            k[1] = n[b[1]] || b[1];
            k[2] = n[b[2]] || b[2];
            "text" == m[k[1]][k[2]] && e(b[4]);
            "range" == m[k[1]][k[2]] && f(b[4]);
            "value" == m[k[1]][k[2]] && g(b[4]);
            Mods.Chatmd.wiki(m, k);
            return !1
        },
        moo: function(b) {
            for (var e = 1; 120 > e; e++) Timers.clear("m00 chat" + e);
            b = parseInt(b);
            b = "number" == typeof b && 0 < b ? Math.min(120, Math.max(Math.ceil(b), 1)) : 10;
            reply = "m000000000000000000";
            drawObject = function(b, e) {
                Mods.Chatmd.newDrawObject(b, e)
            };
            drawMap(!1, !0, !1);
            updateBase();
            HUD.drawMinimap();
            Timers.set("m00",
                function() {
                    drawObject = function(b, e) {
                        Mods.Chatmd.oldDrawObject(b, e)
                    };
                    drawMap(!1, !0, !1);
                    updateBase()
                }, 1E3 * b);
            for (e = 1; e < 10 * b; e++) Timers.set("m00 chat" + e, function() {
                drawMap(!1, !0, !1);
                updateBase()
            }, 100 * e)
        },
        timer: function(b) {
            var e = /set/.test(b) && "set" || /start/.test(b) && "start" || /clear/.test(b) && "clear" || !1,
                f = "set" == e && /.{1,}set/.exec(b)[0].replace(" set", "") || "start" == e && /.{1,}start/.exec(b)[0].replace(" start", "") || "clear" == e && /.{1,}clear/.exec(b)[0].replace(" clear", "") || !1,
                g = (f = "string" == typeof f && 7 <
                    f.length && f.slice(7, 100) || "default", " (" + f.toLowerCase() + ")") || "",
                k = f && " (" + f.toLowerCase() + ")" || "";
            target = "set" == e && /(?=set).{1,}/.exec(b)[0].replace("set ", "") || !1;
            if ("set" == e) {
                b = 0;
                var m = {
                        hrs: {
                            0: !1,
                            1: ["hours", "hour", "hrs", "hr", "h"],
                            2: 3600
                        },
                        min: {
                            0: !1,
                            1: ["minutes", "minute", "mins", "min", "m"],
                            2: 60
                        },
                        sec: {
                            0: !1,
                            1: ["seconds", "second", "secs", "sec", "s"],
                            2: 1
                        }
                    },
                    n;
                for (n in m) {
                    var p = m[n],
                        q = !1,
                        t = t || !1,
                        r;
                    for (r in p[1]) RegExp(p[1][r]).test(target) && (q = p[1][r], p[0] = RegExp(".{1,}" + q).exec(target), p[0] = p[0][0], target =
                        target.replace(p[0], ""), p[0] = p[0].replace(q, ""), p[0] = parseFloat(p[0]), p[0] = 0 < p[0] && p[0] * p[2] || 0, b += p[0], t = !0)
                }
                target = t ? Math.ceil(b) : parseInt(target) || !1
            }
            if ("set" == e && "number" == typeof target && 0 < target) Mods.Chatmd.runTimer.set[f.toLowerCase()] = [timestamp(), 1E3 * target], Timers.set("set_timer" + f.toLowerCase(), function(b) {
                    addChatText(_tm("Countdown {end_name} has expired. It has been {time} seconds.", {
                        end_name: k,
                        time: target
                    }), void 0, COLOR.TEAL);
                    delete Mods.Chatmd.runTimer.set[f.toLowerCase()]
                }, 1E3 * target),
                reply = _tm("Countdown {start_name} started for {time}.", {
                    start_name: g,
                    time: Mods.timeConvert(target)
                });
            else if ("start" == e) Mods.Chatmd.runTimer.start[f] = [timestamp()], reply = _tm("Timer {start_name} started.", {
                start_name: g
            });
            else if ("clear" == e) delete Mods.Chatmd.runTimer.start[f], delete Mods.Chatmd.runTimer.set[f], Timers.clear("set_timer" + f.toLowerCase()), reply = _tm("Timer/Countdown {start_name} has been deleted.", {
                start_name: g
            });
            else {
                g = Mods.Chatmd.runTimer;
                r = t = !1;
                for (b = 0; 2 > b; b++) {
                    0 === b ? (e = "start", p = _tm("Timers elapsed") +
                        ":", m = ".") : (e = "set", p = _tm("Countdowns running") + ":", m = " " + _tm("remaining") + ".");
                    addChatText(p, void 0, COLOR.TEAL);
                    for (n in g[e]) r = t = !0, p = 0 < g[e][n][0] && timestamp() - g[e][n][0] - (g[e][n][1] || 0) || !1, 0 < g[e][n][1] && (p *= -1), p = 0 < p ? "- " + _tm("Timer {timer_name} running: ", {
                        timer_name: n
                    }) + Mods.timeConvert(p / 1E3) + m : "- " + _tm("Timer {timer_name} has already elapsed.", {
                        timer_name: n
                    }), addChatText(p, void 0, COLOR.TEAL);
                    !t && addChatText("- " + _tm("No timers running") + "...", void 0, COLOR.TEAL);
                    t = !1
                }!r && (reply = _tm("No timers have been started. Try {command1} (to start a timer) or {command2} (to start a countdown).", {
                    command1: "/timer name start",
                    command2: "/timer name set #"
                })) || (reply = !1)
            }
            localStorage.timer = JSON.stringify(Mods.Chatmd.runTimer);
            return reply
        },
        modch: function(b) {
            Mods.Chatmd.ModCh.sendWhisper(b)
        },
        ttlxp: function(b) {
            b = /^(\d{1,}) ?(\-|to)? ?(\d{1,})?$/.exec(b);
            if (!b) {
                b = 0;
                for (var e in skills[0]) skills[0][e].xp && (b += Math.floor(skills[0][e].xp));
                return _tm("Your total experience for all skills is: {totalExp}", {
                    totalExp: thousandSeperate(Math.round(b))
                })
            }
            e = b[1];
            b = b[3] || 1;
            val1a = Level.xp_for_level(e);
            val2b =
                Level.xp_for_level(b);
            var f = Math.max(val1a, val2b) - Math.min(val1a, val2b),
                f = thousandSeperate(f);
            return _tm("Total exp needed to go from level {startLevel} to {endLevel} : {totalExp}", {
                startLevel: Math.min(e, b),
                endLevel: Math.max(e, b),
                totalExp: f
            })
        },
        id: function(b) {
            if (!Player.has_lower_permissions(players[0].name) && !Player.is_mod_dev(players[0].name)) return !1;
            var e, f, g, k, m, n, p, q, t, r, x, y, A;
            x = [];
            A = {};
            y = "";
            g = /^(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?(.*)/;
            f = /^(([^!=><&]{1,})?(!|!=|<=|>=|=|<|>))? ?([^!=><&]{1,})/g;
            k = /([^.]{1,})/g;
            b = g.exec(b);
            q = void 0 !== b[1] && void 0 !== window[b[1]] ? window[b[1]] : window.item_base;
            g = b[1] || "item_base";
            b = b[2].replace(/\+/g, "\\+").replace(/\-/g, "\\-").replace(/\'/g, "\\'").split(/ ?& ?/g);
            if (!b || !q) return "No items match the given values. (error: no parameters)";
            for (m in q) A[m] = q[m];
            for (m in b)
                if (f.lastIndex = 0, (e = f.exec(b[m].trim())) && e[4])
                    for (n in q = e[2] ? e[2].match(k) : ["name"], t = e[3] && "=" != e[3] && "!" != e[3] && "!=" != e[3] && -1 < e[4] ?
                        e[3] : "!" == e[3] || "!=" == e[3] ? "!=" : "=", r = e[4], str = "!=" == t ? "!" + r : "=" == t ? r.replace(/\\/g, "") : ">=" == t ? r + "+" : "<=" == t ? r + "-" : ">" == t ? parseInt(r) + 1 + "+" : parseInt(r) - 1 + "-", x.push(q.toString().replace(/,/g, ".") + "=" + str), A) {
                        e = A[n];
                        for (p in q) "object" == typeof e && (e = e[q[p]]);
                        void 0 !== e && "object" !== typeof e && null !== e && -1 < r && -1 < e && ("=" == t && e == r || ">" == t && e > r || "<" == t && e < r || ">=" == t && e >= r || "<=" == t && e <= r || "!=" == t && e != r) || !(-1 < r && -1 < e) && ("!=" !== t && RegExp(r, "gi").test(e) || "!=" === t && !1 === RegExp(r, "gi").test(e)) || delete A[n]
                    }
                x =
            x.toString().replace(/ ,/g, "; ");
            x = (0 < x.length ? "." : "") + x + ": ";
            b = 0;
            for (m in A)
                if (b += 1, 20 < b) {
                    y += "(too many results), ";
                    break
                } else y += A[m].name + " (" + m + "), ";
            return 0 < y.length ? g + x + y.slice(0, -2) : g + x + "No items match the given values."
        },
        help: function(b) {
            var e = {
                    afk: 'Use /afk or /afk [message] to set an automatic reply to people who whisper you if you are away from the keyboard. While your status is "AFK" if you type /afk again, the automatic replies will be disabled.',
                    combats: "Use /combats to see everyones combat level.",
                    cleardata: "Use /cleardata to delete all your settings and cache",
                    clearcache: "Use /clearcache to delete cache, does not delete your settings",
                    cathedral: "Use /cathedral to see how much time is left before can start another cathedral run.",
                    nature: "Use /nature to see how much time is left before can start another Nature tower run.",
                    ice: "Use /ice to see how much time is left before can start another Ice tower run.",
                    fire: "Use /fire to see how much time is left before can start another Fire tower run.",
                    daily: "Use /daily to see the number of consecutive days you have on your daily rewards counter.",
                    find: "Use /find [monster] or [material] to get the map or coordinates of what you're looking for.",
                    friend: "Use /friend [player] to quickly add or remove a player to/from your friends list. Example: /friend dendrek",
                    help: "Use /help to see a list of the mod chat commands. To read a description of a command, type /help [command].",
                    ignore: "Use /ignore [player] to quickly add or remove a player to/from your ignore list. Example: /ignore dumbplayer",
                    join: "Use /join [CH] (where CH is a valid channel name, written with capital letters, such a EN, DE, 18, etc) to join that channel. Example: /join EN",
                    leave: "Use /leave [CH] (where CH is a valid channel name, written with capital letters, such as EN, DE, 18, etc) to leave taht channel. Example: /leave EN",
                    maintenance: "Use /maintenance to see how much time is left till the next maintenance restart. Use '/maintenance all' to see it for every world.",
                    m00: "Use /m00 to see ... something happen. You can extend the duration of this command with /m00 # (such as /m00 30 to set the duration to 30 seconds).",
                    online: "Use /online to see a list of players who are currently online.",
                    o: "Use /o [player] to check if that player is online. It's a fast way to confirm a players online-status without scanning the /online list. Example: /o dendrek",
                    penalty: "Use /penalty to see how many captcha points you have stored. You can save up to 5 points. If you reach -5 points, you'll go to jail.",
                    ping: "Use /ping to see how much of a delay (called latency) there is between you and your computer. Every 1000ms equals a 1 second delay. Use '/ping all' to see it for every world.",
                    played: "Use /played to see how long it has been since you created your current character. This is a measure of time since you started, not of actual time played.",
                    premium: "Use /premium to buy or see how much premium time you have left.",
                    r: 'Use /r to reply to the last person who whispered you. If a player has whispered you recently enough, /r will immediately change to /w "playername". Additionally, use PageUp and PageDown to cycle through previous whisper targets.',
                    savemap: "Use /savemap to save current map into a .PNG file. Caution, might take a while to generate! Not to be used with a mobile device.",
                    saveplayer: "Use /saveplayer to save current player into a .PNG file.",
                    stats: "Use /stats to see your total adjusted values from your stats and gear",
                    world: "Use /world to see which world you are in currently. Use /world x to connect to another world, change x into any available world number.",
                    timer: {
                        desc: "Use /timer to check already created timers. You can also create a countdown (using /timer set), a clock (using /timer start), remove timers (using /timer clear), and even give timers names (using /timer [name] [command]). Type /help timer [set/start/clear/name] for more details.",
                        set: 'The command /timer set #[time type] starts a timer for "#" seconds. If time type is specified (examples: seconds/secs/sec/s, /minutes/mins/min/m, /hours/hrs/hr/h) the # will be in that time interval. Example: /timer set 30m starts a timer for 30minutes. /timer set 1h 20m 15s can also be done.',
                        start: 'The command /timer start starts a "clock" from the current moment that counts up. You can check how much time has passed by typing /timer at any time.',
                        clear: 'The command /timer [name] clear cancels all existing timers that have the specified "name" value. If name is not included, /timer clear cancels all existing "default" timers. See /help timer name for more details on naming timers.',
                        name: "Timers can be named in this way: /timer [name] [command]. The commands are set, start, and clear. The name can be practically anything, but it CANNOT contain the words set, start or clear. Examples: /timer orc overlord set 20m (starts a countdown named 'orc overlord'), /timer see how long this takes start (starts a clock named 'see how long this takes')."
                    },
                    totalexp: "Use /totalexp to see the total experience you've gathered. Or use /totalexp # to see how much exp would be required to go from level 1 to the level specified. Or use /totalexp # to # to see how much exp is required to go from the lower level to the higher. Example: /totalexp 90 to 95",
                    totalvalue: "Use /totalvalue to see a total wiki value of all items in your inventory, chest, pet, as well as your coins.",
                    version: "Use /version to get current game and mod version",
                    xp: "Use /xp to see if a 2x experience event is currently running, and to see the duration if one is.",
                    wiki: {
                        desc: 'Use /wiki to open up the in-game wiki. You can also perform a search using this command. /wiki [option1] [option2] [option3] etc, where each option "fills" in one of the search boxes in the wiki. For more details, type /help wiki options.',
                        options: 'The wiki has dropdown boxes that must be filled in. To do a wiki search using the /wiki command, you must "fill in" each box with an appropriate value. Examples of wiki searches: /wiki item name bronze pants, /wiki mob item superior armor enchant, /wiki npc name magician, /wiki craft item iron bar. The different parts of the search must be included for it to work.'
                    }
                },
                f = _tm("List of commands") + ": ",
                g = "(",
                k = "(",
                m;
            for (m in e) {
                var g = g + (m + "|"),
                    f = f + (m + ", "),
                    n;
                for (n in e[m]) "desc" == n || 0 <= n || -1 !=
                    k.indexOf(n) || (k += n + "|")
            }
            f = f.slice(0, -2) + ".";
            g = g.slice(0, -1) + ")";
            k = k.slice(0, -1) + ")";
            e.help += f;
            b = RegExp(g + " ?" + k + "?", "g").exec(b);
            f = "";
            f = b && e[b[1]] && e[b[1]][b[2]] ? e[b[1]][b[2]] : b && e[b[1]] ? e[b[1]].desc || e[b[1]] : e.help;
            Translate.lang && "en" != Translate.lang && addChatText(_tm("Sorry, currently only avaliable in English"), void 0, COLOR.TEAL);
            return f
        },
        obj: function(b) {
            if (!Player.has_lower_permissions(players[0].name) && !Player.is_mod_dev(players[0].name)) return !1;
            var e, f, g, k;
            e = /(item_base|objects_data|object_base|ground_base|npc_base|players|Magic|quests|pets|IMAGE_SHEET|skills|FORGE_FORMULAS|CARPENTRY_FORMULAS|sprite|countries)? ?\[?(\d{1,})\]? ?(.*)/g.exec(b);
            g = /([^.]{1,})/g;
            if (!e) return "No items match the given value. (error: no parameters)";
            b = e[1] || "item_base";
            g = e[3] ? e[3].match(g) : [];
            f = e[2];
            if (void 0 == window[b] || "undefined" == typeof f) return "No items match the given values. (error: base = undefined)";
            e = g.toString().replace(/,/g, ".");
            e = b + "[" + f + "]" + (0 < e.length ? "." + e : "") + ": ";
            b = window[b][f];
            for (k in g) "undefined" != typeof b && (b = b[g[k]]);
            if ("undefined" === typeof b) return "No items match the given values.";
            if ("object" !== typeof b && null !== b) e += b + ", ";
            else
                for (k in b) e =
                    "object" == typeof b[k] ? e + (k + " (object), ") : e + (k + " (" + b[k] + "), ");
            return e.slice(0, -2)
        },
        afk: function(b) {
            var e = "",
                e = "";
            b = b.trim();
            e = _tm("[AFK]") + ": " + (0 < b.length ? b : _tm("I am away from my keyboard."));
            "" === Mods.Chatmd.afkMessage || Mods.Chatmd.afkMessage != e && "" !== b ? (Mods.Chatmd.afkMessage = e, Mods.Chatmd.afkHolder = {}, e = _tm("You are now [AFK]") + ' : "' + b + '"') : (Mods.Chatmd.afkMessage = "", e = _tm("You are no longer [AFK]"));
            Player.update_healthbar();
            return e
        },
        ttval: function() {
            var b, e;
            b = 0;
            for (e in players[0].temp.inventory) b +=
                item_base[players[0].temp.inventory[e].id].params.price;
            for (e in players[0].pet.chest) b += item_base[players[0].pet.chest[e]].params.price;
            for (e in chests[0]) b += chests[0][e].count * item_base[chests[0][e].id].params.price;
            b += players[0].temp.coins;
            b = thousandSeperate(b);
            return _tm("The total value of items in your Chest/Inv/Pet + Coins is: {totalValue}", {
                totalValue: b
            })
        },
        tele: function(b) {
            if (!Player.has_permissions(players[0].name)) return !1;
            var e;
            b = b.split(" ");
            e = players[0].i + (parseInt(b[0]) || 0);
            b = players[0].j +
                (parseInt(b[1]) || 0);
            Socket.send("message", {
                data: "/level " + players[0].map + " " + e + " " + b
            });
            return !1
        },
        showcl: function() {
            return _tm("Current combat level: {currentLevel}", {
                currentLevel: players[0].params.combat_level
            })
        },
        showversion: function() {
            return _tm("Game version") + ": " + release_version + " | " + _tm("Modpack") + ": " + Mods.version + " (" + Mods.versionDate + ")"
        }
    };
    Mods.Chatmd.chatCommands = function(b) {
        var e = {
                played: ["/played", 2],
                join: ["/join", 1],
                leave: ["/leave", 1],
                whisp: ["/r", 0],
                ping: ["/ping"],
                mods: ["/mods", 0],
                wiki: ["/wiki"],
                moo: ["/m00"],
                timer: ["/timer"],
                tip: ["/tip", 0],
                modch: ["/@mods", 1],
                ttlxp: ["/totalexp"],
                id: ["/id", 1],
                help: ["/help"],
                obj: ["/obj", 1],
                afk: ["/afk"],
                ttval: ["/totalvalue", 0],
                tele: ["/tele", 1],
                dailylogin: ["/daily"],
                findcom: ["/find", 1],
                showcl: ["/cl", 0],
                showversion: ["/version", 0]
            },
            f, g = !1,
            k;
        for (k in e)
            if (RegExp("^" + e[k][0] + "\\b" + (e[k][1] && 1 == e[k][1] ? " " : "")).test(b)) {
                g = !0;
                f = k;
                break
            }
        if (!g) return b;
        g = "number" == typeof e[f][1] ? e[f][1] : 2;
        if (0 < g) {
            var m = b.split(" ");
            k = "";
            m[0] == e[f][0] && (m.shift(), k = m.join(" ").trim(),
                m = [], k.replace(/"([^\\"]*(?:\\.[^\\"]*)*)"|'([^\\']*(?:\\.[^\\']*)*)'|(\S+)/g, function(b, e, f, g) {
                    m.push(e || f || g || "")
                }), m = m.join(" ").trim());
            if (1 == g && 0 === k.length) return b;
            b = Mods.Chatmd.mods_client_commands[f](m)
        } else b = Mods.Chatmd.mods_client_commands[f]();
        return "string" == typeof b ? (addChatText(b, void 0, COLOR.TEAL), !1) : b ? !0 : !1
    };
    Mods.Chatmd.ScheduleTips = function() {
        0 === Mods.Chatmd.tipsenabled && Mods.Chatmd.chatCommands("/tip");
        setTimeout(function() {
            Mods.Chatmd.ScheduleTips()
        }, 6E5)
    };
    Mods.Chatmd.Tipstoggle =
        function() {
            var b = getElem("settings_tips");
            switch (Mods.Chatmd.tipsenabled) {
                case 0:
                    b.innerHTML = _tmi("Tips") + " " + _tmi("off", {
                        ns: "interface"
                    });
                    Mods.Chatmd.tipsenabled = 1;
                    break;
                default:
                    b.innerHTML = _tmi("Tips") + " " + _tmi("on", {
                        ns: "interface"
                    }), Mods.Chatmd.tipsenabled = 0
            }
            localStorage.tipsenabled = JSON.stringify(Mods.Chatmd.tipsenabled)
        };
    Mods.Chatmd.Timestamptoggle = function() {
        var b = getElem("settings_enableallchatts");
        switch (Mods.Chatmd.enableallchatts) {
            case 0:
                b.innerHTML = _tmi("Timestamps on all chat lines") +
                    " " + _tmi("on", {
                        ns: "interface"
                    });
                Mods.Chatmd.enableallchatts = 1;
                break;
            default:
                b.innerHTML = _tmi("Timestamps on all chat lines") + " " + _tmi("off", {
                    ns: "interface"
                }), Mods.Chatmd.enableallchatts = 0
        }
        localStorage.enableallchatts = JSON.stringify(Mods.Chatmd.enableallchatts)
    };
    Mods.Chatmd.filterMarketChat = function(b) {
        for (var e = /(\d+.?\d?[kmbt]? )([^|]{1,})( for )/ig, f, g = !1; f = e.exec(d);) {
            f = f[2];
            for (var k in item_base) item_base[k].name.toLowerCase() === f.toLowerCase() && (g = k)
        }
        return g ? "{item:" + g + "}" : b
    };
    Mods.Chatmd.game_tips = {
        0: "In defensive fight mode, each point of melee damage you deal will give 2 xp to the defense skill and 1 xp to health.;In accurate fight mode, each point of melee damage you deal will give 2 xp to the accuracy skill and 1 xp to health.;In aggressive fight mode, each point of melee damage you deal will give 2 xp to the strength skill and 1 xp to health.;In cordial fight mode, each point of melee damage you deal will give 2 xp to the to health skill.;In controlled fight mode, combat xp is equally divided between strength, defense and accuracy. Health will always get 1 xp per damage dealt.;Ingame wiki mod is a precious resource to plan your adventure. Access it typing /wiki in the chat line.;You can turn tips off from the Game Options menu.;If you like RPG MO, consider writing a review and gaining free MOS: https://forums.mo.ee/viewtopic.php?t=3870.;There is a Secret Cow Level.;The Enhanced Map mod adds several details to the game map, including key resource spots, travel points and boss locations.;The Enhanced Market mod adds several helpers for player's market operations, including the ability to resubmit expired offers and compare your equip with the one that is for sale.;Your health slowly regenerates over time: you gain 1 health every minute.;The more health a mob has, the more time it takes to respawn.;Be ready to be hunted down and fight for your life if you go into No Man's Land, the RPG MO PvP area.;Don't sell raw fish you get, cook it!;Better boots can increase your movement speed.;Food heals you. You can get food by killing chickens or by fishing. You may have to cook the food.;The forums have a lot of information about this game. You can access them on https://forums.mo.ee/ .;Are you lost? Click on the minimap to enlarge it or save entire map with /savemap;If you die, you will lose all the items you are carrying but the two most valuable. Beware!;Potion of Preservation is a special potion that must be equipped and it will be consumed on death, allowing you to save a total of 7 items from your inventory.;If you have a pet equipped and you die you keep the pet. If it is not equipped, but it's in your inventory you may lose it.;When you die you do not lose the items you placed in your Pet's inventory.;You can buy an island deed from the farmer in Dorpat.;To see your combat level, mouse over yourself. To see the level of monsters, position the mouse pointer over them.;Public chat is global, meaning everyone online can read it!;Players chat is white, moderators chat is green and developers/admins chat is orange.;To whisper, type /w \"[playersname]\" followed by the message.;Type /online to bring up a list of players currently online.;Type /played to see how much time has passed since your first login.;Type /penalty to view or spend your current penalty points.;Type /wiki to access the ingame wiki database.;Type /xp to check the duration of an ongoing x2 Experience event.;x2 Experience server events are triggered by players using special x2 pots from the MOS market.;Need help? Don't be afraid to ask! RPG MO is full of helpful players! Further help and guides can be found in the game forums.;Higher accuracy will allow you to equip better weapons.;Higher defense will allow you to equip better armor.;Higher health will allow you to equip better jewelry.;Do not ignore Captchas! If you fail or ignore them you will get -5 penalty points and you will go to jail.;If you end up in jail, only a Game Moderator or an Admin can decide to free you.;You can save up to 5 captcha points. Using Captcha points will add XP to a skill of your choice.;You can access the player's market through the chest.;Some pets can be purchased from the pet vendor in Dorpat. Better pets are usually available on the market ;A pet can extend your inventory space. Pets also give stats boosts.;Cross-chatting is bad. If someone is speaking in a chat channel, make sure you answer in the same one.;The best way to make money is through gathering professions (especially mining). There will always be players looking for iron, sand or coal in the player's market!;Through the market you can place \"buy\" or \"sell\" offers, and you can check buy and sell offers from other players.;MOS is a special currency that can be acquired with real money. It allows you to buy special items from the MOS store.;The MOS Store is accessible from the \"Buy items and coins\" link at the bottom right of page.;To use magic you need to buy and equip a magic pouch, fill it with spell scrolls (all available at Dorpat Magician NPC) and engage in combat.;You are allowed to have a max of 5 accounts (alts), but trading items or materials between your own accounts is not allowed.;Please check RPG MO Code of Conduct on https://mo.ee/rules".split(";")
    };
    createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_tips' onclick='Mods.Chatmd.Tipstoggle();'>" + _tmi("Tips") + " " + _tmi("on", {
            ns: "interface"
        }) + "</span>"
    });
    Player.is_mod_dev(players[0].name) && createElem("div", "options_game", {
        innerHTML: "<span class='wide_link pointer' id='settings_moddevtoggle' onclick='Mods.Chatmd.ModDevToggle();'>ModDev Color : " + (0 == Mods.Chatmd.modDevColorToggle ? "Disabled" : "Enabled") + "</span>"
    });
    Mods.Chatmd.Tipstoggle();
    Mods.Chatmd.ScheduleTips();
    addChatText(_tm("Several new chat commands available. Type {command} to see a list and usage instructions.", {
        command: "/help"
    }), void 0, COLOR.TEAL);
    COLOR.MOD_DEV = "#C3B4FF";
    Mods.Chatmd.translateSpamItems();
    Mods.Translations.onSetLanguage(Mods.Chatmd.translateSpamItems);
    Mods.timestamp("chatmd")
};
Load.newmap = function() {
    modOptions.newmap.time = timestamp();
    Mods.Newmap.drawMinimapLarge = Mods.Newmap.drawMinimapLarge || HUD.drawMinimapLarge;
    Mods.Newmap.drawMinimap = Mods.Newmap.drawMinimap || HUD.drawMinimap;
    Mods.Newmap.addPOI = function(b) {
        Mods.Newmap.POI[0].push(b)
    };
    Mods.Newmap.removePOI = function(b, e) {
        for (var f = Mods.Newmap.POI[0].length - 1; 0 <= f; f--)
            if (Mods.Newmap.POI[0][f].mapid == b.map && Mods.Newmap.POI[0][f].x == b.i && Mods.Newmap.POI[0][f].y == b.j && Mods.Newmap.POI[0][f].type == e) return Mods.Newmap.POI[0].splice(f,
                1)
    };
    createElem("div", wrapper, {
        id: "mods_newmap_coords",
        style: "visibility: hidden; z-index: 300; left: 35%; top: 20px; position: absolute; color #FFF; text-align: middle; font-size: 20px; color:#a2a2a2; text-shadow: #555 1px 1px 1px; pointer-events: none;"
    });
    createElem("div", wrapper, {
        id: "mods_newmap_popup",
        style: "visibility: hidden; z-index: 49; position: absolute; color: #FFF; border-radius: 4px; text-align: middle; font-size: 12px; background-color: #666; padding: 4px; pointer-events: none;"
    });
    createElem("div",
        wrapper, {
            id: "mods_zone_buttondiv",
            style: "visibility: hidden; z-index: 49; position: absolute; top: 40px; left: 3px; font-size: 8px;",
            innerHTML: "<button id='mods_zone_button' class='market_select pointer' onclick='Mods.Newmap.ShowZone();' data-tm='World Map'>" + _tm("World Map") + "</button>"
        });
    Mods.Newmap.zonemapvisible = !1;
    Mods.Newmap.POI = {
        0: [{
            mapid: 0,
            name: "Dorpat Town",
            type: "CITY",
            x: 20,
            y: 20
        }, {
            mapid: 0,
            name: "Dorpat Outpost",
            type: "CITY",
            x: 83,
            y: 38
        }, {
            mapid: 0,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 32,
            y: 5
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 16,
            y: 8
        }, {
            mapid: 0,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 91,
            y: 33
        }, {
            mapid: 0,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 95,
            y: 5
        }, {
            mapid: 0,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 81,
            y: 90
        }, {
            mapid: 0,
            name: "Sand",
            description: "1 mining",
            type: "RESOURCE",
            icon: "spade",
            x: 73,
            y: 73
        }, {
            mapid: 0,
            name: "Silver",
            description: "25 mining",
            type: "RESOURCE",
            icon: "pick",
            x: 69,
            y: 79
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 24,
            y: 27
        }, {
            mapid: 0,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 88,
            y: 32
        }, {
            mapid: 0,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 3,
            y: 88
        }, {
            mapid: 0,
            name: "Willow",
            description: "20 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 87,
            y: 88
        }, {
            mapid: 0,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 67,
            y: 23
        }, {
            mapid: 0,
            name: "Minotaur Maze",
            description: "Access to Minotaur Cave dungeon",
            type: "POI",
            x: 21,
            y: 87
        }, {
            mapid: 0,
            name: "Dorpat Castle",
            description: "Access to Dorpat Castle dungeon",
            type: "POI",
            x: 50,
            y: 59
        }, {
            mapid: 0,
            name: "Miner's Guild",
            description: "Requires Mining guild permission and 65 mining.",
            type: "POI",
            x: 56,
            y: 14
        }, {
            mapid: 0,
            name: "Skeleton Dungeon",
            description: "",
            type: "POI",
            x: 66,
            y: 29
        }, {
            mapid: 0,
            name: "Transfer to Whiland",
            description: "Leads to Rakblood, No Man's Land (PvP)",
            type: "TRAVEL",
            x: 92,
            y: 15
        }, {
            mapid: 0,
            name: "Cow",
            type: "MOB",
            icon: 102,
            x: 41,
            y: 11
        }, {
            mapid: 0,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 48,
            y: 17
        }, {
            mapid: 0,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 75,
            y: 18
        }, {
            mapid: 0,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 80,
            y: 9
        }, {
            mapid: 0,
            name: "Minotaur",
            type: "MOB",
            icon: 6,
            x: 18,
            y: 90
        }, {
            mapid: 0,
            name: "Apeman",
            type: "MOB",
            icon: 119,
            x: 50,
            y: 78
        }, {
            mapid: 0,
            name: "Dwarf Mage",
            type: "MOB",
            icon: 7,
            x: 63,
            y: 52
        }, {
            mapid: 0,
            name: "Gray Wizard",
            type: "MOB",
            icon: 0,
            x: 15,
            y: 50
        }, {
            mapid: 0,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 80,
            y: 78
        }, {
            mapid: 0,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 90,
            y: 41
        }, {
            mapid: 0,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 83,
            y: 56
        }, {
            mapid: 0,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 45,
            y: 60
        }, {
            mapid: 0,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 50,
            y: 63
        }, {
            mapid: 0,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 43,
            y: 58
        }, {
            mapid: 0,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 70,
            y: 69
        }, {
            mapid: 0,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 65,
            y: 75
        }, {
            mapid: 0,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 71,
            y: 72
        }, {
            mapid: 0,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 28,
            y: 33
        }, {
            mapid: 0,
            name: "Hen",
            type: "MOB",
            icon: 101,
            x: 9,
            y: 31
        }, {
            mapid: 0,
            name: "Green Wizard",
            type: "MOB",
            icon: 3,
            x: 48,
            y: 46
        }, {
            mapid: 0,
            name: "Chicken",
            type: "MOB",
            icon: 100,
            x: 16,
            y: 34
        }, {
            mapid: 0,
            name: "Dorpat Mine",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 0,
            name: "Transfer to Walco",
            description: "",
            type: "TRAVEL",
            x: 94,
            y: 83
        }, {
            mapid: 0,
            name: "Transfer to Reval",
            description: "Leads to Cesis, Pernau",
            type: "TRAVEL",
            x: 6,
            y: 89
        }, {
            mapid: 0,
            name: "Transfer to Clouds",
            description: "Leads to Heaven. Requires wings.",
            type: "TRAVEL",
            x: 43,
            y: 92
        }, {
            mapid: 0,
            name: "Transfer to Moche",
            description: "Leads to Reval",
            type: "TRAVEL",
            x: 9,
            y: 60
        }, {
            mapid: 1,
            name: "Big Treasure Chest",
            description: "Use spare keys from search dungeons here.",
            type: "POI",
            x: 26,
            y: 8
        }, {
            mapid: 1,
            name: "Campfire",
            type: "POI",
            x: 90,
            y: 41
        }, {
            mapid: 1,
            name: "Clay",
            description: "0 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 15,
            y: 27
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 6,
            y: 16
        }, {
            mapid: 1,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 31,
            y: 18
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 4,
            y: 9
        }, {
            mapid: 1,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 18
        }, {
            mapid: 1,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 19,
            y: 25
        }, {
            mapid: 1,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 30,
            y: 90
        }, {
            mapid: 1,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 86
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 67,
            y: 14
        }, {
            mapid: 1,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 21
        }, {
            mapid: 1,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 35,
            y: 22
        }, {
            mapid: 1,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 71,
            y: 15
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 70
        }, {
            mapid: 1,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 33,
            y: 24
        }, {
            mapid: 1,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 32,
            y: 22
        }, {
            mapid: 1,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 68,
            y: 59
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 23
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 66,
            y: 29
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 56
        }, {
            mapid: 1,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 22,
            y: 88
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 22,
            y: 11
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 10,
            y: 83
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 46,
            y: 85
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 34,
            y: 63
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 60,
            y: 67
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 82,
            y: 62
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            description: "Leads to Dungeons II-IV",
            type: "TRAVEL",
            x: 93,
            y: 90
        }, {
            mapid: 1,
            name: "Transfer to Dungeon II",
            type: "TRAVEL",
            x: 87,
            y: 25
        }, {
            mapid: 1,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 14,
            y: 21
        }, {
            mapid: 1,
            name: "Moth",
            type: "MOB",
            icon: 280,
            x: 10,
            y: 27
        }, {
            mapid: 1,
            name: "Cave Bat",
            type: "MOB",
            icon: 196,
            x: 21,
            y: 33
        }, {
            mapid: 1,
            name: "Cave Worm",
            type: "MOB",
            icon: 197,
            x: 14,
            y: 52
        }, {
            mapid: 1,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 11,
            y: 66
        }, {
            mapid: 1,
            name: "Sapphire Dragon",
            type: "MOB",
            icon: 14,
            x: 25,
            y: 84
        }, {
            mapid: 1,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 9,
            y: 85
        }, {
            mapid: 1,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 91,
            y: 79
        }, {
            mapid: 1,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 41,
            y: 87
        }, {
            mapid: 1,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 60,
            y: 90
        }, {
            mapid: 1,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 86,
            y: 91
        }, {
            mapid: 1,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 91,
            y: 87
        }, {
            mapid: 1,
            name: "Ridder",
            type: "MOB",
            icon: 201,
            x: 44,
            y: 56
        }, {
            mapid: 1,
            name: "Crusader",
            type: "MOB",
            icon: 200,
            x: 53,
            y: 59
        }, {
            mapid: 1,
            name: "Dark Knight",
            type: "MOB",
            icon: 29,
            x: 58,
            y: 64
        }, {
            mapid: 1,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 61,
            y: 61
        }, {
            mapid: 1,
            name: "Holy Warrior",
            type: "MOB",
            icon: 30,
            x: 55,
            y: 79
        }, {
            mapid: 1,
            name: "Scholar",
            type: "MOB",
            icon: 202,
            x: 62,
            y: 80
        }, {
            mapid: 1,
            name: "Enchanter",
            type: "MOB",
            icon: 204,
            x: 79,
            y: 67
        }, {
            mapid: 1,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 74,
            y: 29
        }, {
            mapid: 1,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 72,
            y: 16
        }, {
            mapid: 1,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 71,
            y: 44
        }, {
            mapid: 1,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 74,
            y: 49
        }, {
            mapid: 1,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 58,
            y: 46
        }, {
            mapid: 1,
            name: "Minotaur Skeleton",
            type: "MOB",
            icon: 68,
            x: 43,
            y: 34
        }, {
            mapid: 1,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 32,
            y: 56
        }, {
            mapid: 1,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 32,
            y: 67
        }, {
            mapid: 1,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 54,
            y: 19
        }, {
            mapid: 1,
            name: "Hydra",
            type: "MOB",
            icon: 17,
            x: 75,
            y: 17
        }, {
            mapid: 1,
            name: "Gnoll Warrior",
            type: "MOB",
            icon: 16,
            x: 65,
            y: 10
        }, {
            mapid: 1,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 85,
            y: 20
        }, {
            mapid: 1,
            name: "Gnoll Mage",
            type: "MOB",
            icon: 199,
            x: 89,
            y: 35
        }, {
            mapid: 2,
            name: "Narwa Town",
            type: "CITY",
            x: 68,
            y: 37
        }, {
            mapid: 2,
            name: "Water Altar",
            type: "POI",
            x: 61,
            y: 75
        }, {
            mapid: 2,
            name: "Wooden Harpoon",
            description: "50 fishing",
            icon: "woodharp",
            type: "RESOURCE",
            x: 78,
            y: 30
        }, {
            mapid: 2,
            name: "Transfer to Rakblood",
            description: "Leads to Whiland",
            type: "TRAVEL",
            x: 19,
            y: 81
        }, {
            mapid: 2,
            name: "Transfer to Fellin Island",
            description: "Requires ticket. Leads to Dragon's Lair",
            type: "TRAVEL",
            x: 78,
            y: 38
        }, {
            mapid: 2,
            name: "Transfer to Blood River",
            description: "Leads to Hell. Requires wings.",
            type: "TRAVEL",
            x: 86,
            y: 81
        }, {
            mapid: 2,
            name: "Sailor",
            description: "(NPC) Shop",
            type: "POI",
            x: 74,
            y: 38
        }, {
            mapid: 2,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 92,
            y: 11
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 82,
            y: 93
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 72,
            y: 78
        }, {
            mapid: 2,
            name: "Frozen Spirit",
            type: "MOB",
            icon: 57,
            x: 95,
            y: 56
        }, {
            mapid: 2,
            name: "Ice Lizard",
            type: "MOB",
            icon: 55,
            x: 77,
            y: 82
        }, {
            mapid: 2,
            name: "Ice Wyvern",
            type: "MOB",
            icon: 259,
            x: 91,
            y: 80
        }, {
            mapid: 2,
            name: "Ice Giant",
            type: "MOB",
            icon: 54,
            x: 79,
            y: 54
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 82,
            y: 58
        }, {
            mapid: 2,
            name: "Frozen Bat",
            type: "MOB",
            icon: 53,
            x: 84,
            y: 18
        }, {
            mapid: 2,
            name: "Ice Golem",
            type: "MOB",
            icon: 56,
            x: 90,
            y: 49
        }, {
            mapid: 2,
            name: "Ice Troglodyte",
            type: "MOB",
            icon: 52,
            x: 85,
            y: 34
        }, {
            mapid: 2,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 93,
            y: 17
        }, {
            mapid: 2,
            name: "Snow Troll Defender",
            type: "MOB",
            icon: 71,
            x: 51,
            y: 53
        }, {
            mapid: 2,
            name: "Snow Troll Knight",
            type: "MOB",
            icon: 69,
            x: 62,
            y: 64
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 52,
            y: 89
        }, {
            mapid: 2,
            name: "King Elemental Dragon",
            type: "MOB",
            icon: 76,
            x: 32,
            y: 86
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 18,
            y: 57
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 25,
            y: 90
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 10,
            y: 72
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 9,
            y: 44
        }, {
            mapid: 2,
            name: "Wind Elemental",
            type: "MOB",
            icon: 51,
            x: 32,
            y: 29
        }, {
            mapid: 2,
            name: "Adult Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 32,
            y: 82
        }, {
            mapid: 2,
            name: "Baby Elemental Dragon",
            type: "MOB",
            icon: 74,
            x: 23,
            y: 74
        }, {
            mapid: 2,
            name: "Snow Troll Assassin",
            type: "MOB",
            icon: 70,
            x: 18,
            y: 47
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 44,
            y: 34
        }, {
            mapid: 2,
            name: "Snow Gungan Priest",
            type: "MOB",
            icon: 72,
            x: 66,
            y: 25
        }, {
            mapid: 2,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 8,
            y: 18
        }, {
            mapid: 2,
            name: "Polar Bear",
            type: "MOB",
            icon: 189,
            x: 18,
            y: 14
        }, {
            mapid: 2,
            name: "Snow Gungan Lord",
            type: "MOB",
            icon: 73,
            x: 48,
            y: 16
        }, {
            mapid: 3,
            name: "Whiland Town",
            type: "CITY",
            x: 28,
            y: 93
        }, {
            mapid: 3,
            name: "Earth Altar",
            type: "POI",
            x: 42,
            y: 39
        }, {
            mapid: 3,
            name: "Wandering Farmer",
            description: "(NPC) Shop",
            type: "POI",
            x: 10,
            y: 29
        }, {
            mapid: 3,
            name: "Transfer to Dorpat",
            type: "TRAVEL",
            x: 4,
            y: 5
        }, {
            mapid: 3,
            name: "Transfer to Rakblood",
            description: "Leads to Narwa",
            type: "TRAVEL",
            x: 71,
            y: 46
        }, {
            mapid: 3,
            name: "Transfer to No Man's Land",
            description: "PVP Area",
            type: "TRAVEL",
            x: 90,
            y: 12
        }, {
            mapid: 3,
            name: "Transfer to Lost Woods",
            type: "TRAVEL",
            x: 8,
            y: 90
        }, {
            mapid: 3,
            name: "Oak",
            description: "10 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 19,
            y: 85
        }, {
            mapid: 3,
            name: "Deer",
            type: "MOB",
            icon: 103,
            x: 10,
            y: 13
        }, {
            mapid: 3,
            name: "Boletus",
            type: "MOB",
            icon: 34,
            x: 12,
            y: 7
        }, {
            mapid: 3,
            name: "Bear",
            type: "MOB",
            icon: 104,
            x: 25,
            y: 87
        }, {
            mapid: 3,
            name: "Silver Shroom",
            type: "MOB",
            icon: 35,
            x: 75,
            y: 42
        }, {
            mapid: 3,
            name: "Blue Magic Shroom",
            type: "MOB",
            icon: 33,
            x: 37,
            y: 81
        }, {
            mapid: 3,
            name: "Avatar's Shroom",
            type: "MOB",
            icon: 38,
            x: 42,
            y: 87
        }, {
            mapid: 3,
            name: "Russula",
            type: "MOB",
            icon: 31,
            x: 39,
            y: 77
        }, {
            mapid: 3,
            name: "Grizzly Bear",
            type: "MOB",
            icon: 188,
            x: 58,
            y: 69
        }, {
            mapid: 3,
            name: "Golden Shroom",
            type: "MOB",
            icon: 36,
            x: 67,
            y: 76
        }, {
            mapid: 3,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 80,
            y: 66
        }, {
            mapid: 3,
            name: "Dark Shroom",
            type: "MOB",
            icon: 32,
            x: 84,
            y: 70
        }, {
            mapid: 3,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 80,
            y: 30
        }, {
            mapid: 3,
            name: "Dry-Rotted Shroom",
            type: "MOB",
            icon: 37,
            x: 55,
            y: 60
        }, {
            mapid: 3,
            name: "Poisoned Shroom",
            type: "MOB",
            icon: 39,
            x: 75,
            y: 31
        }, {
            mapid: 4,
            name: "Reval Town",
            type: "CITY",
            x: 16,
            y: 24
        }, {
            mapid: 4,
            name: "Orc Overlord",
            type: "BOSS",
            cblevel: 450,
            x: 71,
            y: 87
        }, {
            mapid: 4,
            name: "Snake Maze",
            type: "POI",
            x: 59,
            y: 43
        }, {
            mapid: 4,
            name: "Flash Altar",
            type: "POI",
            x: 62,
            y: 65
        }, {
            mapid: 4,
            name: "Jewelry Guild",
            description: "Requires Jewelry Guild permission and 60 jewelry.",
            type: "POI",
            x: 48,
            y: 56
        }, {
            mapid: 4,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 8,
            y: 34
        }, {
            mapid: 4,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 66,
            y: 38
        }, {
            mapid: 4,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 45,
            y: 56
        }, {
            mapid: 4,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 42,
            y: 55
        }, {
            mapid: 4,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 65,
            y: 28
        }, {
            mapid: 4,
            name: "Silver Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 67,
            y: 29
        }, {
            mapid: 4,
            name: "Clay",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 46,
            y: 59
        }, {
            mapid: 4,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 93,
            y: 68
        }, {
            mapid: 4,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 90,
            y: 67
        }, {
            mapid: 4,
            name: "Cactus",
            description: "5 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 12
        }, {
            mapid: 4,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 93,
            y: 7
        }, {
            mapid: 4,
            name: "Transfer to Cesis",
            description: "Leads to Ancient Dungeon",
            type: "TRAVEL",
            x: 40,
            y: 91
        }, {
            mapid: 4,
            name: "Transfer to Pernau",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 87
        }, {
            mapid: 4,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 56,
            y: 82
        }, {
            mapid: 4,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 91,
            y: 81
        }, {
            mapid: 4,
            name: "Desert Runner",
            type: "MOB",
            icon: 44,
            x: 33,
            y: 12
        }, {
            mapid: 4,
            name: "Cyclops Knight",
            type: "MOB",
            icon: 43,
            x: 51,
            y: 30
        }, {
            mapid: 4,
            name: "Orc King",
            type: "MOB",
            icon: 46,
            x: 87,
            y: 68
        }, {
            mapid: 4,
            name: "Kobalos",
            type: "MOB",
            icon: 304,
            x: 89,
            y: 23
        }, {
            mapid: 4,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 83,
            y: 84
        }, {
            mapid: 4,
            name: "King Cobra",
            type: "MOB",
            icon: 48,
            x: 62,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 60,
            y: 49
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 34,
            y: 36
        }, {
            mapid: 4,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 72
        }, {
            mapid: 4,
            name: "Fire Ant",
            type: "MOB",
            icon: 50,
            x: 13,
            y: 82
        }, {
            mapid: 4,
            name: "Desert Orc",
            type: "MOB",
            icon: 45,
            x: 83,
            y: 46
        }, {
            mapid: 4,
            name: "Maple",
            description: "35 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 43,
            y: 84
        }, {
            mapid: 4,
            name: "Willow",
            description: "20 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 37,
            y: 93
        }, {
            mapid: 4,
            name: "Transfer to Moche",
            description: "Leads to Dorpat",
            type: "TRAVEL",
            x: 47,
            y: 9
        }, {
            mapid: 5,
            name: "Rakblood Town",
            type: "CITY",
            x: 34,
            y: 68
        }, {
            mapid: 5,
            name: "Coal Vein",
            type: "RESOURCE",
            icon: "steelpick",
            description: "40 mining",
            x: 56,
            y: 20
        }, {
            mapid: 5,
            name: "Coal Vein",
            type: "RESOURCE",
            icon: "steelpick",
            description: "40 mining",
            x: 49,
            y: 17
        }, {
            mapid: 5,
            name: "Fishing Master",
            type: "POI",
            x: 47,
            y: 76
        }, {
            mapid: 5,
            name: "Transfer to Whiland",
            description: "Leads to Dorpat",
            type: "TRAVEL",
            x: 38,
            y: 21
        }, {
            mapid: 5,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Blood River",
            type: "TRAVEL",
            x: 88,
            y: 91
        }, {
            mapid: 5,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 46,
            y: 79
        }, {
            mapid: 5,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 77,
            y: 73
        }, {
            mapid: 5,
            name: "White Gold Vein",
            description: "55 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 17,
            y: 25
        }, {
            mapid: 5,
            name: "White Gold Vein",
            description: "55 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 8,
            y: 21
        }, {
            mapid: 5,
            name: "White Gold Vein",
            description: "55 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 29,
            y: 21
        }, {
            mapid: 5,
            name: "Assassin",
            type: "MOB",
            icon: 186,
            x: 25,
            y: 79
        }, {
            mapid: 5,
            name: "Explorer",
            type: "MOB",
            icon: 187,
            x: 23,
            y: 66
        }, {
            mapid: 5,
            name: "Dark Orc",
            type: "MOB",
            icon: 66,
            x: 34,
            y: 83
        }, {
            mapid: 5,
            name: "Bronze Golem",
            type: "MOB",
            icon: 60,
            x: 14,
            y: 42
        }, {
            mapid: 5,
            name: "Azure Golem",
            type: "MOB",
            icon: 59,
            x: 17,
            y: 12
        }, {
            mapid: 5,
            name: "Iron Golem",
            type: "MOB",
            icon: 62,
            x: 55,
            y: 25
        }, {
            mapid: 5,
            name: "Coal Golem",
            type: "MOB",
            icon: 61,
            x: 72,
            y: 20
        }, {
            mapid: 5,
            name: "Steel Golem",
            type: "MOB",
            icon: 63,
            x: 65,
            y: 45
        }, {
            mapid: 5,
            name: "Thief",
            type: "MOB",
            icon: 185,
            x: 37,
            y: 44
        }, {
            mapid: 5,
            name: "Rock Spirit",
            type: "MOB",
            icon: 64,
            x: 45,
            y: 85
        }, {
            mapid: 5,
            name: "Mutated Hydra",
            type: "MOB",
            icon: 65,
            x: 51,
            y: 88
        }, {
            mapid: 5,
            name: "Giant Troll",
            type: "MOB",
            icon: 303,
            x: 60,
            y: 79
        }, {
            mapid: 5,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 63,
            y: 71
        }, {
            mapid: 6,
            name: "Blood River Town",
            type: "CITY",
            x: 35,
            y: 86
        }, {
            mapid: 6,
            name: "Fire Altar",
            type: "POI",
            x: 78,
            y: 42
        }, {
            mapid: 6,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 43,
            y: 46
        }, {
            mapid: 6,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 63,
            y: 33
        }, {
            mapid: 6,
            name: "Azurite",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 63,
            y: 33
        }, {
            mapid: 6,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 85,
            y: 49
        }, {
            mapid: 6,
            name: "Transfer to Narwa",
            description: "Leads to Fellin Island, Rakblood",
            type: "TRAVEL",
            x: 29,
            y: 42
        }, {
            mapid: 6,
            name: "Transfer to Hell",
            description: "",
            type: "TRAVEL",
            x: 59,
            y: 21
        }, {
            mapid: 6,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 61,
            y: 25
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 45,
            y: 46
        }, {
            mapid: 6,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 65,
            y: 31
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 61,
            y: 37
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 52,
            y: 60
        }, {
            mapid: 6,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 30,
            y: 29
        }, {
            mapid: 6,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 55,
            y: 74
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 65,
            y: 88
        }, {
            mapid: 6,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 23,
            y: 53
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 75,
            y: 83
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 39,
            y: 14
        }, {
            mapid: 6,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 32,
            y: 67
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 82,
            y: 30
        }, {
            mapid: 6,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 73,
            y: 15
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 90,
            y: 60
        }, {
            mapid: 6,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 28,
            y: 81
        }, {
            mapid: 6,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 89,
            y: 82
        }, {
            mapid: 6,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 75,
            y: 65
        }, {
            mapid: 6,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 69,
            y: 48
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 19,
            y: 16
        }, {
            mapid: 6,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 36
        }, {
            mapid: 6,
            name: "Fire Viper",
            type: "MOB",
            icon: 49,
            x: 18,
            y: 87
        }, {
            mapid: 7,
            name: "Hell Town",
            type: "CITY",
            x: 31,
            y: 22
        }, {
            mapid: 7,
            name: "Diablo",
            type: "BOSS",
            cblevel: 800,
            x: 11,
            y: 79
        }, {
            mapid: 7,
            name: "Platinum",
            description: "75 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 48,
            y: 38
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 8,
            y: 69
        }, {
            mapid: 7,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 27,
            y: 53
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 80,
            y: 29
        }, {
            mapid: 7,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 89,
            y: 15
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 40,
            y: 12
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 16,
            y: 76
        }, {
            mapid: 7,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 31,
            y: 59
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 11,
            y: 48
        }, {
            mapid: 7,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 85,
            y: 87
        }, {
            mapid: 7,
            name: "Fire Spirit",
            type: "MOB",
            icon: 191,
            x: 81,
            y: 82
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 13,
            y: 15
        }, {
            mapid: 7,
            name: "Fire Behemoth",
            type: "MOB",
            icon: 88,
            x: 81,
            y: 63
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 71,
            y: 90
        }, {
            mapid: 7,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 51,
            y: 34
        }, {
            mapid: 7,
            name: "Cursed Dragon",
            type: "MOB",
            icon: 26,
            x: 59,
            y: 34
        }, {
            mapid: 7,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 47,
            y: 89
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 26,
            y: 90
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 59,
            y: 67
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 43,
            y: 58
        }, {
            mapid: 7,
            name: "Blood Lizard",
            type: "MOB",
            icon: 90,
            x: 34,
            y: 54
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 47
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 89,
            y: 12
        }, {
            mapid: 7,
            name: "Lava Shroom",
            type: "MOB",
            icon: 41,
            x: 55,
            y: 6
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 87,
            y: 25
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 85,
            y: 10
        }, {
            mapid: 7,
            name: "Fire Shroom",
            type: "MOB",
            icon: 40,
            x: 57,
            y: 8
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 86,
            y: 31
        }, {
            mapid: 7,
            name: "Flame Wyvern",
            type: "MOB",
            icon: 181,
            x: 57,
            y: 11
        }, {
            mapid: 7,
            name: "Archdevil",
            type: "MOB",
            icon: 19,
            x: 59,
            y: 23
        }, {
            mapid: 7,
            name: "Flaming Giant",
            type: "MOB",
            icon: 89,
            x: 70,
            y: 45
        }, {
            mapid: 7,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 85,
            y: 45
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 31,
            y: 32
        }, {
            mapid: 7,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 21,
            y: 49
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 65
        }, {
            mapid: 7,
            name: "Azure",
            description: "60 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 62,
            y: 48
        }, {
            mapid: 7,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 89,
            y: 93
        }, {
            mapid: 7,
            name: "Transfer to Blood River",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 8,
            name: "Clouds Town",
            type: "CITY",
            x: 60,
            y: 72
        }, {
            mapid: 8,
            name: "Acid Dragon Lord",
            type: "BOSS",
            cblevel: 3987,
            x: 46,
            y: 37
        }, {
            mapid: 8,
            name: "Air Altar",
            type: "POI",
            x: 13,
            y: 68
        }, {
            mapid: 8,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 52,
            y: 18
        }, {
            mapid: 8,
            name: "Observer",
            type: "MOB",
            icon: 114,
            x: 29,
            y: 17
        }, {
            mapid: 8,
            name: "Observer",
            type: "MOB",
            icon: 114,
            x: 24,
            y: 32
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 23,
            y: 44
        }, {
            mapid: 8,
            name: "Blood Battlemage",
            type: "MOB",
            icon: 116,
            x: 35,
            y: 49
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 38,
            y: 30
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 40,
            y: 16
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 9,
            y: 91
        }, {
            mapid: 8,
            name: "Baby Griffin",
            type: "MOB",
            icon: 106,
            x: 22,
            y: 81
        }, {
            mapid: 8,
            name: "Griffin",
            type: "MOB",
            icon: 107,
            x: 35,
            y: 90
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 32,
            y: 68
        }, {
            mapid: 8,
            name: "Ettin",
            type: "MOB",
            icon: 115,
            x: 70,
            y: 46
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 84,
            y: 39
        }, {
            mapid: 8,
            name: "Chaos Vortex",
            type: "MOB",
            icon: 174,
            x: 93,
            y: 67
        }, {
            mapid: 8,
            name: "King Observer",
            type: "MOB",
            icon: 113,
            x: 83,
            y: 29
        }, {
            mapid: 8,
            name: "King Observer",
            type: "MOB",
            icon: 113,
            x: 86,
            y: 46
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 89,
            y: 21
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 53,
            y: 15
        }, {
            mapid: 8,
            name: "Wind Protector",
            type: "MOB",
            icon: 58,
            x: 84,
            y: 11
        }, {
            mapid: 8,
            name: "King Observer",
            type: "MOB",
            icon: 113,
            x: 70,
            y: 30
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 65,
            y: 15
        }, {
            mapid: 8,
            name: "Archangel",
            type: "MOB",
            icon: 18,
            x: 11,
            y: 40
        }, {
            mapid: 8,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 57,
            y: 30
        }, {
            mapid: 8,
            name: "Royal Griffin",
            type: "MOB",
            icon: 110,
            x: 54,
            y: 44
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 71,
            y: 54
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 77,
            y: 43
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 76,
            y: 36
        }, {
            mapid: 8,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 94,
            y: 33
        }, {
            mapid: 8,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 63,
            y: 78
        }, {
            mapid: 8,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 53,
            y: 77
        }, {
            mapid: 8,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 57,
            y: 61
        }, {
            mapid: 8,
            name: "King Ruby Dragon",
            icon: 24,
            type: "MOB",
            x: 60,
            y: 68
        }, {
            mapid: 8,
            name: "Ruby Dragon",
            icon: 27,
            type: "MOB",
            x: 69,
            y: 70
        }, {
            mapid: 8,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 19
        }, {
            mapid: 8,
            name: "Transfer to Heaven",
            description: "",
            type: "TRAVEL",
            x: 83,
            y: 83
        }, {
            mapid: 9,
            name: "Heaven Town",
            type: "CITY",
            x: 58,
            y: 16
        }, {
            mapid: 9,
            name: "Demon Portal",
            type: "BOSS",
            cblevel: 1500,
            x: 38,
            y: 9
        }, {
            mapid: 9,
            name: "Nephilim Warrior",
            type: "BOSS",
            cblevel: 3E3,
            x: 26,
            y: 89
        }, {
            mapid: 9,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 18
        }, {
            mapid: 9,
            name: "Zeus",
            icon: 99,
            type: "MOB",
            x: 89,
            y: 40
        }, {
            mapid: 9,
            name: "Flame Phoenix",
            icon: 87,
            type: "MOB",
            x: 73,
            y: 41
        }, {
            mapid: 9,
            name: "Unicorn",
            icon: 245,
            type: "MOB",
            x: 69,
            y: 59
        }, {
            mapid: 9,
            name: "Thunder Bird",
            icon: 258,
            type: "MOB",
            x: 8,
            y: 70
        }, {
            mapid: 9,
            name: "Grendalf The Grey",
            icon: 98,
            type: "MOB",
            x: 58,
            y: 45
        }, {
            mapid: 9,
            name: "Grendalf The Grey",
            icon: 98,
            type: "MOB",
            x: 81,
            y: 15
        }, {
            mapid: 9,
            name: "Thunder Angel",
            icon: 269,
            type: "MOB",
            x: 54,
            y: 62
        }, {
            mapid: 9,
            name: "Confused Merlin",
            icon: 95,
            type: "MOB",
            x: 53,
            y: 74
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 29,
            y: 66
        }, {
            mapid: 9,
            name: "Dwarf Battlemage",
            icon: 94,
            type: "MOB",
            x: 88,
            y: 29
        }, {
            mapid: 9,
            name: "Merlin",
            icon: 96,
            type: "MOB",
            x: 85,
            y: 33
        }, {
            mapid: 9,
            name: "King Black Dragon",
            icon: 108,
            type: "MOB",
            x: 25,
            y: 79
        }, {
            mapid: 9,
            name: "Young Grendalf",
            icon: 97,
            type: "MOB",
            x: 40,
            y: 31
        }, {
            mapid: 9,
            name: "Young Grendalf",
            icon: 97,
            type: "MOB",
            x: 75,
            y: 85
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 16,
            y: 50
        }, {
            mapid: 9,
            name: "Battlemage",
            icon: 93,
            type: "MOB",
            x: 66,
            y: 82
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 20,
            y: 24
        }, {
            mapid: 9,
            name: "Adult Sapphire Dragon",
            icon: 111,
            type: "MOB",
            x: 81,
            y: 51
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 39,
            y: 44
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 23,
            y: 11
        }, {
            mapid: 9,
            name: "King Sapphire Dragon",
            icon: 112,
            type: "MOB",
            x: 85,
            y: 68
        }, {
            mapid: 9,
            name: "King Gilded Dragon",
            icon: 244,
            type: "MOB",
            x: 84,
            y: 84
        }, {
            mapid: 9,
            name: "Death Angel",
            icon: 105,
            type: "MOB",
            x: 39,
            y: 13
        }, {
            mapid: 9,
            name: "Transfer to Clouds",
            description: "",
            type: "TRAVEL",
            x: 15,
            y: 21
        }, {
            mapid: 10,
            name: "Cesis Town",
            type: "CITY",
            x: 58,
            y: 64
        }, {
            mapid: 10,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 51,
            y: 66
        }, {
            mapid: 10,
            name: "Ancient Hydra",
            type: "BOSS",
            cblevel: 1E3,
            x: 60,
            y: 89
        }, {
            mapid: 10,
            name: "Maple",
            description: "35 woodcutting",
            icon: "wood",
            type: "RESOURCE",
            x: 71,
            y: 32
        }, {
            mapid: 10,
            name: "Blue Palm",
            description: "55 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 10,
            y: 38
        }, {
            mapid: 10,
            name: "Magic Oak",
            description: "65 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 77,
            y: 28
        }, {
            mapid: 10,
            name: "Transfer to Reval",
            description: "Leads to Dorpat, Pernau",
            type: "TRAVEL",
            x: 48,
            y: 17
        }, {
            mapid: 10,
            name: "Transfer to Ancient Dungeon",
            description: "",
            type: "TRAVEL",
            x: 20,
            y: 92
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 52,
            y: 35
        }, {
            mapid: 10,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 57,
            y: 80
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 31,
            y: 13
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 17,
            y: 69
        }, {
            mapid: 10,
            name: "Grass Killer",
            type: "MOB",
            icon: 195,
            x: 42,
            y: 61
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 31,
            y: 33
        }, {
            mapid: 10,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 76,
            y: 21
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 21,
            y: 48
        }, {
            mapid: 10,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 35,
            y: 64
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 26,
            y: 75
        }, {
            mapid: 10,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 84,
            y: 85
        }, {
            mapid: 10,
            name: "Emerald Plant",
            type: "MOB",
            icon: 194,
            x: 17,
            y: 83
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 9,
            y: 31
        }, {
            mapid: 10,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 39,
            y: 82
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 43,
            y: 46
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 77,
            y: 15
        }, {
            mapid: 10,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 78,
            y: 39
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 36,
            y: 21
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 48,
            y: 27
        }, {
            mapid: 10,
            name: "Baby Emerald Dragon",
            type: "MOB",
            icon: 125,
            x: 56,
            y: 23
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 67,
            y: 17
        }, {
            mapid: 10,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 87,
            y: 18
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 19,
            y: 34
        }, {
            mapid: 10,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 82,
            y: 51
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 12,
            y: 18
        }, {
            mapid: 10,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 75,
            y: 75
        }, {
            mapid: 10,
            name: "Moss Wyvern",
            type: "MOB",
            icon: 129,
            x: 64,
            y: 84
        }, {
            mapid: 11,
            name: "Walco Town",
            type: "CITY",
            x: 22,
            y: 29
        }, {
            mapid: 11,
            name: "Reaper",
            type: "BOSS",
            cblevel: 600,
            x: 45,
            y: 70
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 29,
            y: 44
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 58,
            y: 33
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 38,
            y: 21
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 35,
            y: 70
        }, {
            mapid: 11,
            name: "Spirit Log",
            description: "45 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 24,
            y: 79
        }, {
            mapid: 11,
            name: "Transfer to Dorpat",
            description: "",
            type: "TRAVEL",
            x: 9,
            y: 84
        }, {
            mapid: 11,
            name: "Illusion Gate",
            description: "Teleports you to Devil's Triangle",
            type: "TRAVEL",
            x: 86,
            y: 85
        }, {
            mapid: 11,
            name: "Shadow Ghost",
            type: "MOB",
            icon: 134,
            x: 16,
            y: 79
        }, {
            mapid: 11,
            name: "Shadow Ghost",
            type: "MOB",
            icon: 134,
            x: 38,
            y: 82
        }, {
            mapid: 11,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 23,
            y: 68
        }, {
            mapid: 11,
            name: "Poltergeist",
            type: "MOB",
            icon: 136,
            x: 20,
            y: 39
        }, {
            mapid: 11,
            name: "Poltergeist",
            type: "MOB",
            icon: 136,
            x: 50,
            y: 82
        }, {
            mapid: 11,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 32,
            y: 20
        }, {
            mapid: 11,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 30,
            y: 35
        }, {
            mapid: 11,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 82,
            y: 82
        }, {
            mapid: 11,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 67,
            y: 53
        }, {
            mapid: 11,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 55,
            y: 45
        }, {
            mapid: 11,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 46,
            y: 74
        }, {
            mapid: 11,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 23,
            y: 55
        }, {
            mapid: 11,
            name: "Spirit",
            type: "MOB",
            icon: 135,
            x: 38,
            y: 82
        }, {
            mapid: 11,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 76,
            y: 39
        }, {
            mapid: 11,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 79,
            y: 70
        }, {
            mapid: 11,
            name: "Skeleton Knight",
            type: "MOB",
            icon: 67,
            x: 73,
            y: 78
        }, {
            mapid: 13,
            name: "Campfire",
            description: "(There is no chest in Pernau)",
            type: "POI",
            x: 90,
            y: 13
        }, {
            mapid: 13,
            name: "Pharaoh",
            type: "BOSS",
            cblevel: 1300,
            x: 12,
            y: 45
        }, {
            mapid: 13,
            name: "Transfer to Reval",
            description: "",
            type: "TRAVEL",
            x: 85,
            y: 80
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 40,
            y: 57
        }, {
            mapid: 13,
            name: "Transfer to Pernau Desert",
            description: "",
            type: "TRAVEL",
            x: 11,
            y: 23
        }, {
            mapid: 13,
            name: "Transfer to Pernau Pyramid",
            description: "",
            type: "TRAVEL",
            x: 37,
            y: 42
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "Leads to Pharaoh",
            type: "TRAVEL",
            x: 55,
            y: 10
        }, {
            mapid: 13,
            name: "Transfer to Lion's Den",
            description: "",
            type: "TRAVEL",
            x: 6,
            y: 32
        }, {
            mapid: 13,
            name: "Transfer to Pharaoh",
            description: "",
            type: "TRAVEL",
            x: 7,
            y: 12
        }, {
            mapid: 13,
            name: "Shopkeeper",
            type: "POI",
            x: 15,
            y: 8
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 83,
            y: 88
        }, {
            mapid: 13,
            name: "Mummy",
            type: "MOB",
            icon: 163,
            x: 53,
            y: 71
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 92
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 88,
            y: 69
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 91,
            y: 55
        }, {
            mapid: 13,
            name: "White Wall",
            type: "MOB",
            icon: 179,
            x: 80,
            y: 55
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 87,
            y: 74
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 66,
            y: 81
        }, {
            mapid: 13,
            name: "Rotting Mummy",
            type: "MOB",
            icon: 164,
            x: 76,
            y: 71
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 92,
            y: 74
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 82,
            y: 58
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 59,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 33,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 91,
            y: 64
        }, {
            mapid: 13,
            name: "Skeleton Mage",
            type: "MOB",
            icon: 177,
            x: 79,
            y: 66
        }, {
            mapid: 13,
            name: "Phantom Skull",
            type: "MOB",
            icon: 170,
            x: 80,
            y: 62
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 76,
            y: 81
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 58,
            y: 85
        }, {
            mapid: 13,
            name: "Ice Mummy",
            type: "MOB",
            icon: 165,
            x: 41,
            y: 71
        }, {
            mapid: 13,
            name: "DarkElf Mage",
            type: "MOB",
            icon: 161,
            x: 58,
            y: 89
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 60,
            y: 91
        }, {
            mapid: 13,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 24,
            y: 65
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 62,
            y: 62
        }, {
            mapid: 13,
            name: "Emerald Mummy",
            type: "MOB",
            icon: 166,
            x: 43,
            y: 59
        }, {
            mapid: 13,
            name: "Sand Golem",
            type: "MOB",
            icon: 162,
            x: 45,
            y: 85
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 39,
            y: 67
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 36,
            y: 64
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 40,
            y: 61
        }, {
            mapid: 13,
            name: "White Hard Wall",
            type: "MOB",
            icon: 180,
            x: 46,
            y: 54
        }, {
            mapid: 13,
            name: "Flame Phoenix",
            type: "MOB",
            icon: 87,
            x: 27,
            y: 69
        }, {
            mapid: 13,
            name: "Sand Centipede",
            type: "MOB",
            icon: 157,
            x: 32,
            y: 36
        }, {
            mapid: 13,
            name: "Rock Centipede",
            type: "MOB",
            icon: 158,
            x: 39,
            y: 19
        }, {
            mapid: 13,
            name: "Fire Centipede",
            type: "MOB",
            icon: 159,
            x: 55,
            y: 33
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 61,
            y: 40
        }, {
            mapid: 13,
            name: "Gilded Mummy",
            type: "MOB",
            icon: 167,
            x: 59,
            y: 19
        }, {
            mapid: 13,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 66,
            y: 45
        }, {
            mapid: 13,
            name: "Diamond Mummy",
            type: "MOB",
            icon: 169,
            x: 79,
            y: 21
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 75,
            y: 43
        }, {
            mapid: 13,
            name: "Deathstalker Scorpion",
            type: "MOB",
            icon: 171,
            x: 89,
            y: 45
        }, {
            mapid: 13,
            name: "Emperor Scorpion",
            type: "MOB",
            icon: 172,
            x: 82,
            y: 41
        }, {
            mapid: 13,
            name: "War Elephant",
            type: "MOB",
            icon: 173,
            x: 85,
            y: 25
        }, {
            mapid: 13,
            name: "Amethyst Mummy",
            type: "MOB",
            icon: 168,
            x: 66,
            y: 13
        }, {
            mapid: 13,
            name: "Lion",
            type: "MOB",
            icon: 190,
            x: 16,
            y: 15
        }, {
            mapid: 13,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 11,
            y: 34
        }, {
            mapid: 13,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 19,
            y: 45
        }, {
            mapid: 13,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 7,
            y: 43
        }, {
            mapid: 14,
            name: "Fishing Guild",
            description: "Requires Fishing Guild permission and 80 fishing.",
            type: "POI",
            x: 79,
            y: 32
        }, {
            mapid: 14,
            name: "Transfer to Dragon's Lair",
            description: "",
            type: "TRAVEL",
            x: 41,
            y: 48
        }, {
            mapid: 14,
            name: "Transfer to Narwa",
            description: "",
            type: "TRAVEL",
            x: 10,
            y: 26
        }, {
            mapid: 14,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 45,
            y: 51
        }, {
            mapid: 14,
            name: "Naga",
            type: "MOB",
            icon: 109,
            x: 26,
            y: 63
        }, {
            mapid: 14,
            name: "Poisonous Behemoth",
            type: "MOB",
            icon: 193,
            x: 36,
            y: 77
        }, {
            mapid: 14,
            name: "Barbarian Berserker",
            type: "MOB",
            icon: 133,
            x: 69,
            y: 74
        }, {
            mapid: 14,
            name: "Barbarian Shaman",
            type: "MOB",
            icon: 132,
            x: 58,
            y: 63
        }, {
            mapid: 14,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 49
        }, {
            mapid: 14,
            name: "Barbarian Ghost",
            type: "MOB",
            icon: 131,
            x: 68,
            y: 34
        }, {
            mapid: 14,
            name: "Grass Snake",
            type: "MOB",
            icon: 130,
            x: 51,
            y: 27
        }, {
            mapid: 14,
            name: "Behemoth",
            type: "MOB",
            icon: 20,
            x: 31,
            y: 35
        }, {
            mapid: 14,
            name: "Dragonfly",
            type: "MOB",
            icon: 120,
            x: 36,
            y: 18
        }, {
            mapid: 14,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 87,
            y: 31
        }, {
            mapid: 14,
            name: "Iron Fishing Rod",
            description: "65 fishing",
            type: "RESOURCE",
            icon: "ironrod",
            x: 89,
            y: 31
        }, {
            mapid: 14,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 88,
            y: 36
        }, {
            mapid: 14,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 85,
            y: 32
        }, {
            mapid: 14,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 88,
            y: 27
        }, {
            mapid: 14,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 87,
            y: 81
        }, {
            mapid: 14,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 12,
            y: 70
        }, {
            mapid: 15,
            name: "Dragon's Lair Outpost",
            description: "",
            type: "CITY",
            x: 49,
            y: 45
        }, {
            mapid: 15,
            name: "Chaotic Dragon",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 71,
            y: 21
        }, {
            mapid: 15,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 69
        }, {
            mapid: 15,
            name: "Ruby Dragon",
            type: "MOB",
            icon: 27,
            x: 49,
            y: 34
        }, {
            mapid: 15,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 48,
            y: 24
        }, {
            mapid: 15,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 54,
            y: 16
        }, {
            mapid: 15,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 68,
            y: 17
        }, {
            mapid: 15,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 61,
            y: 43
        }, {
            mapid: 15,
            name: "Skeletal Dragon",
            type: "MOB",
            icon: 160,
            x: 72,
            y: 39
        }, {
            mapid: 15,
            name: "Void Dragon",
            type: "MOB",
            icon: 254,
            x: 77,
            y: 57
        }, {
            mapid: 15,
            name: "Emerald Dragon",
            type: "MOB",
            icon: 126,
            x: 40,
            y: 40
        }, {
            mapid: 15,
            name: "Adult Emerald Dragon",
            type: "MOB",
            icon: 127,
            x: 32,
            y: 39
        }, {
            mapid: 15,
            name: "King Emerald Dragon",
            type: "MOB",
            icon: 128,
            x: 16,
            y: 42
        }, {
            mapid: 15,
            name: "Adult Black Dragon",
            type: "MOB",
            icon: 249,
            x: 50,
            y: 57
        }, {
            mapid: 15,
            name: "King Black Dragon",
            type: "MOB",
            icon: 108,
            x: 48,
            y: 74
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 62,
            y: 69
        }, {
            mapid: 15,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 74,
            y: 72
        }, {
            mapid: 15,
            name: "Earth Dragon",
            type: "MOB",
            icon: 251,
            x: 12,
            y: 77
        }, {
            mapid: 15,
            name: "Gilded Dragon",
            type: "MOB",
            icon: 248,
            x: 39,
            y: 55
        }, {
            mapid: 15,
            name: "Adult Gilded Dragon",
            type: "MOB",
            icon: 250,
            x: 31,
            y: 65
        }, {
            mapid: 15,
            name: "King Gilded Dragon",
            type: "MOB",
            icon: 244,
            x: 24,
            y: 62
        }, {
            mapid: 15,
            name: "Transfer to Fellin Island",
            description: "",
            type: "TRAVEL",
            x: 44,
            y: 45
        }, {
            mapid: 16,
            name: "No Man's Land Outpost",
            description: "Chest",
            type: "CITY",
            x: 15,
            y: 23
        }, {
            mapid: 16,
            name: "World Tree",
            description: "",
            type: "BOSS",
            cblevel: 3775,
            x: 84,
            y: 42
        }, {
            mapid: 16,
            name: "Fire Stone",
            description: "80 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 93
        }, {
            mapid: 16,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 56,
            y: 47
        }, {
            mapid: 16,
            name: "Fir",
            description: "1 woodcutting",
            type: "RESOURCE",
            icon: "wood",
            x: 10,
            y: 19
        }, {
            mapid: 16,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 16,
            y: 37
        }, {
            mapid: 16,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 19
        }, {
            mapid: 16,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 17,
            y: 35
        }, {
            mapid: 16,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 37,
            y: 14
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 29,
            y: 40
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 47,
            y: 31
        }, {
            mapid: 16,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 17,
            y: 55
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 25,
            y: 42
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 15,
            y: 52
        }, {
            mapid: 16,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 44,
            y: 31
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 20
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 66,
            y: 12
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 17
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 84,
            y: 12
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 66,
            y: 9
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 57,
            y: 17
        }, {
            mapid: 16,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 87,
            y: 8
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 8,
            y: 25
        }, {
            mapid: 16,
            name: "Loot Master",
            description: "(NPC)",
            type: "POI",
            x: 21,
            y: 11
        }, {
            mapid: 16,
            name: "Poisoned Altar",
            type: "POI",
            x: 88,
            y: 90
        }, {
            mapid: 16,
            name: "Legendary Breeding Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 11,
            y: 88
        }, {
            mapid: 16,
            name: "PVP Shopkeeper",
            description: "(NPC) Shop",
            type: "POI",
            x: 82,
            y: 66
        }, {
            mapid: 16,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 13,
            y: 14
        }, {
            mapid: 16,
            name: "Novice Knight",
            type: "MOB",
            icon: 271,
            x: 18,
            y: 27
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 23,
            y: 29
        }, {
            mapid: 16,
            name: "Knight",
            type: "MOB",
            icon: 272,
            x: 49,
            y: 48
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 73,
            y: 17
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 19,
            y: 52
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 14,
            y: 78
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 62,
            y: 53
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 54,
            y: 56
        }, {
            mapid: 16,
            name: "Baron",
            type: "MOB",
            icon: 273,
            x: 65,
            y: 39
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 22,
            y: 61
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 15,
            y: 89
        }, {
            mapid: 16,
            name: "Earl",
            type: "MOB",
            icon: 274,
            x: 74,
            y: 43
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 43,
            y: 87
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 82,
            y: 72
        }, {
            mapid: 16,
            name: "Prince",
            type: "MOB",
            icon: 276,
            x: 70,
            y: 82
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 62,
            y: 81
        }, {
            mapid: 16,
            name: "King",
            type: "MOB",
            icon: 277,
            x: 84,
            y: 87
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 74,
            y: 67
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 68,
            y: 51
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 81,
            y: 42
        }, {
            mapid: 16,
            name: "Marquis",
            type: "MOB",
            icon: 275,
            x: 52,
            y: 64
        }, {
            mapid: 16,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 69,
            y: 54
        }, {
            mapid: 17,
            name: "Ancient Dungeon Outpost",
            description: "Chest",
            type: "CITY",
            x: 44,
            y: 91
        }, {
            mapid: 17,
            name: "Ancient Magician",
            description: "(NPC) Shop",
            type: "POI",
            x: 46,
            y: 86
        }, {
            mapid: 17,
            name: "Ancient Furniture Master",
            description: "(NPC) Shop",
            type: "POI",
            x: 48,
            y: 90
        }, {
            mapid: 17,
            name: "Cannibal Plant",
            description: "",
            type: "BOSS",
            cblevel: 2100,
            x: 41,
            y: 49
        }, {
            mapid: 17,
            name: "Pyrohydra",
            description: "",
            type: "MOB",
            icon: 283,
            x: 13,
            y: 78
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 27,
            y: 63
        }, {
            mapid: 17,
            name: "Diamond Plant",
            description: "",
            type: "MOB",
            icon: 285,
            x: 48,
            y: 48
        }, {
            mapid: 17,
            name: "Emerald Plant",
            description: "",
            type: "MOB",
            icon: 194,
            x: 45,
            y: 48
        }, {
            mapid: 17,
            name: "Grass Killer",
            description: "",
            type: "MOB",
            icon: 195,
            x: 29,
            y: 85
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 55,
            y: 47
        }, {
            mapid: 17,
            name: "Earth Dragon",
            description: "",
            type: "MOB",
            icon: 251,
            x: 56,
            y: 73
        }, {
            mapid: 17,
            name: "Observer Overseer",
            description: "",
            type: "MOB",
            icon: 288,
            x: 48,
            y: 32
        }, {
            mapid: 17,
            name: "Hydra Dragon",
            description: "",
            type: "MOB",
            icon: 286,
            x: 19,
            y: 26
        }, {
            mapid: 17,
            name: "Earthstorm",
            description: "",
            type: "MOB",
            icon: 284,
            x: 13,
            y: 42
        }, {
            mapid: 17,
            name: "Unicorn",
            description: "",
            type: "MOB",
            icon: 245,
            x: 73,
            y: 19
        }, {
            mapid: 17,
            name: "Queen Lizard",
            description: "",
            type: "MOB",
            icon: 282,
            x: 77,
            y: 56
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 69,
            y: 36
        }, {
            mapid: 17,
            name: "Blood Spirit",
            description: "",
            type: "MOB",
            icon: 281,
            x: 70,
            y: 81
        }, {
            mapid: 17,
            name: "Transfer to Cesis",
            description: "",
            type: "TRAVEL",
            x: 79,
            y: 87
        }, {
            mapid: 18,
            name: "Cave Crawler",
            description: "",
            type: "BOSS",
            cblevel: 434,
            x: 50,
            y: 35
        }, {
            mapid: 18,
            name: "Giant Cyclops",
            description: "",
            type: "BOSS",
            cblevel: 450,
            x: 36,
            y: 76
        }, {
            mapid: 18,
            name: "Venus Flytrap",
            description: "",
            type: "BOSS",
            cblevel: 545,
            x: 79,
            y: 80
        }, {
            mapid: 18,
            name: "Grizzly Bear",
            description: "",
            type: "MOB",
            icon: 188,
            x: 83,
            y: 19
        }, {
            mapid: 18,
            name: "Poisoned Shroom",
            description: "",
            type: "MOB",
            icon: 39,
            x: 78,
            y: 40
        }, {
            mapid: 18,
            name: "Golden Shroom",
            description: "",
            type: "MOB",
            icon: 36,
            x: 70,
            y: 36
        }, {
            mapid: 18,
            name: "Dry-Rotted Shroom",
            description: "",
            type: "MOB",
            icon: 37,
            x: 72,
            y: 24
        }, {
            mapid: 18,
            name: "Avatar's Shroom",
            description: "",
            type: "MOB",
            icon: 38,
            x: 65,
            y: 21
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 55,
            y: 30
        }, {
            mapid: 18,
            name: "Archdevil",
            description: "",
            type: "MOB",
            icon: 19,
            x: 17,
            y: 82
        }, {
            mapid: 18,
            name: "Behemoth",
            description: "",
            type: "MOB",
            icon: 20,
            x: 35,
            y: 83
        }, {
            mapid: 18,
            name: "Ettin King",
            description: "",
            type: "MOB",
            icon: 21,
            x: 63,
            y: 78
        }, {
            mapid: 18,
            name: "Transfer to Whiland",
            description: "",
            type: "TRAVEL",
            x: 86,
            y: 14
        }, {
            mapid: 20,
            name: "Brocaliande Forest Town",
            type: "CITY",
            x: 50,
            y: 76
        }, {
            mapid: 20,
            name: "Illusion Gate",
            description: "Teleports you to Devil's Triangle",
            type: "TRAVEL",
            x: 11,
            y: 91
        }, {
            mapid: 20,
            name: "Cathedral Door",
            description: "Enter Cathedral",
            type: "TRAVEL",
            x: 86,
            y: 13
        }, {
            mapid: 20,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 15,
            y: 15
        }, {
            mapid: 20,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 59,
            y: 13
        }, {
            mapid: 20,
            name: "White Gold",
            description: "55 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 10,
            y: 37
        }, {
            mapid: 20,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 42,
            y: 88
        }, {
            mapid: 20,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 40,
            y: 93
        }, {
            mapid: 20,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 14,
            y: 63
        }, {
            mapid: 20,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 70,
            y: 30
        }, {
            mapid: 20,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 30,
            y: 56
        }, {
            mapid: 20,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 20,
            y: 72
        }, {
            mapid: 20,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 21,
            y: 15
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 14,
            y: 51
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 26,
            y: 34
        }, {
            mapid: 20,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 31,
            y: 16
        }, {
            mapid: 20,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 14,
            y: 90
        }, {
            mapid: 20,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 42,
            y: 13
        }, {
            mapid: 20,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 87,
            y: 34
        }, {
            mapid: 20,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 67,
            y: 56
        }, {
            mapid: 20,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 64,
            y: 44
        }, {
            mapid: 20,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 91,
            y: 65
        }, {
            mapid: 20,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 76,
            y: 69
        }, {
            mapid: 20,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 14,
            y: 27
        }, {
            mapid: 20,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 28,
            y: 45
        }, {
            mapid: 20,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 41,
            y: 58
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 85,
            y: 79
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 90,
            y: 81
        }, {
            mapid: 20,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 71,
            y: 77
        }, {
            mapid: 20,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 82,
            y: 34
        }, {
            mapid: 20,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 50,
            y: 33
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 62,
            y: 89
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 76,
            y: 92
        }, {
            mapid: 20,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 71,
            y: 84
        }, {
            mapid: 20,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 69,
            y: 13
        }, {
            mapid: 20,
            name: "Transfer to Wittensten",
            description: "Teleports you to Wittensten",
            type: "TRAVEL",
            x: 93,
            y: 77
        }, {
            mapid: 20,
            name: "Void Tree",
            description: "85 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 37,
            y: 24
        }, {
            mapid: 21,
            name: "Traitor",
            description: "(NPC) tele to Walco's Illusion Gate",
            type: "POI",
            icon: 313,
            x: 55,
            y: 58
        }, {
            mapid: 21,
            name: "Blizzard Altar",
            type: "POI",
            x: 77,
            y: 76
        }, {
            mapid: 21,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 39,
            y: 33
        }, {
            mapid: 21,
            name: "Azurite Vein",
            description: "60 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 61,
            y: 88
        }, {
            mapid: 21,
            name: "Clay",
            description: "0 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 44,
            y: 85
        }, {
            mapid: 21,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 28,
            y: 54
        }, {
            mapid: 21,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 69
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 41,
            y: 88
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 34,
            y: 55
        }, {
            mapid: 21,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 32,
            y: 72
        }, {
            mapid: 21,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 64,
            y: 55
        }, {
            mapid: 21,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 18,
            y: 14
        }, {
            mapid: 21,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 67,
            y: 52
        }, {
            mapid: 21,
            name: "Platinum Vein",
            description: "75 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 89,
            y: 22
        }, {
            mapid: 21,
            name: "Silver Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 70,
            y: 51
        }, {
            mapid: 21,
            name: "Alligator",
            type: "MOB",
            icon: 326,
            x: 79,
            y: 15
        }, {
            mapid: 21,
            name: "Alligator",
            type: "MOB",
            icon: 326,
            x: 50,
            y: 71
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 64,
            y: 27
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 71,
            y: 92
        }, {
            mapid: 21,
            name: "Ancient Golem",
            type: "MOB",
            icon: 325,
            x: 15,
            y: 50
        }, {
            mapid: 21,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 29,
            y: 87
        }, {
            mapid: 21,
            name: "Draman",
            type: "MOB",
            icon: 318,
            x: 23,
            y: 33
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 50,
            y: 60
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 62,
            y: 72
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 8,
            y: 30
        }, {
            mapid: 21,
            name: "Earth Elemental",
            type: "MOB",
            icon: 314,
            x: 51,
            y: 24
        }, {
            mapid: 21,
            name: "Gor-gin",
            type: "MOB",
            icon: 320,
            x: 81,
            y: 35
        }, {
            mapid: 21,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 88,
            y: 86
        }, {
            mapid: 21,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 68,
            y: 43
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 51,
            y: 54
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 77,
            y: 71
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 50,
            y: 41
        }, {
            mapid: 21,
            name: "Ice Elemental",
            type: "MOB",
            icon: 316,
            x: 17,
            y: 65
        }, {
            mapid: 21,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 87,
            y: 46
        }, {
            mapid: 21,
            name: "Iphar",
            type: "MOB",
            icon: 322,
            x: 34,
            y: 18
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 46,
            y: 83
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 48,
            y: 6
        }, {
            mapid: 21,
            name: "Necromancer",
            type: "MOB",
            icon: 327,
            x: 31,
            y: 53
        }, {
            mapid: 21,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 84,
            y: 30
        }, {
            mapid: 21,
            name: "Raaz",
            type: "MOB",
            icon: 319,
            x: 24,
            y: 38
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 22,
            y: 15
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 40,
            y: 64
        }, {
            mapid: 21,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 67,
            y: 58
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 37,
            y: 39
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 58,
            y: 87
        }, {
            mapid: 21,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 92,
            y: 25
        }, {
            mapid: 21,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 69,
            y: 39
        }, {
            mapid: 21,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 85,
            y: 84
        }, {
            mapid: 21,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 81,
            y: 46
        }, {
            mapid: 21,
            name: "Verme",
            type: "MOB",
            icon: 321,
            x: 37,
            y: 21
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 12,
            y: 84
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 64,
            y: 10
        }, {
            mapid: 21,
            name: "Water Elemental",
            type: "MOB",
            icon: 315,
            x: 87,
            y: 62
        }, {
            mapid: 21,
            name: "Redhodium",
            description: "90 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 88,
            y: 80
        }, {
            mapid: 21,
            name: "Dragon's Blood Tree",
            description: "105 woodcutting",
            icon: "wood2",
            type: "RESOURCE",
            x: 89,
            y: 85
        }, {
            mapid: 22,
            name: "Harpy 1",
            type: "MOB",
            icon: 343,
            x: 5,
            y: 9
        }, {
            mapid: 22,
            name: "Harpy 2",
            type: "MOB",
            icon: 344,
            x: 5,
            y: 18
        }, {
            mapid: 22,
            name: "Harpy 3",
            type: "MOB",
            icon: 345,
            x: 5,
            y: 27
        }, {
            mapid: 22,
            name: "Harpy 4",
            type: "MOB",
            icon: 346,
            x: 5,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Lion Turtle",
            type: "MOB",
            icon: 347,
            x: 5,
            y: 45
        }, {
            mapid: 22,
            name: "Harpy 5",
            type: "MOB",
            icon: 348,
            x: 5,
            y: 54
        }, {
            mapid: 22,
            name: "Harpy 6",
            type: "MOB",
            icon: 349,
            x: 5,
            y: 63
        }, {
            mapid: 22,
            name: "Harpy 7",
            type: "MOB",
            icon: 350,
            x: 5,
            y: 72
        }, {
            mapid: 22,
            name: "Harpy 8",
            type: "MOB",
            icon: 351,
            x: 5,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Air Priest",
            type: "MOB",
            icon: 333,
            x: 5,
            y: 92
        }, {
            mapid: 22,
            name: "Dragonbat 1",
            type: "MOB",
            icon: 352,
            x: 14,
            y: 9
        }, {
            mapid: 22,
            name: "Dragonbat 2",
            type: "MOB",
            icon: 353,
            x: 14,
            y: 18
        }, {
            mapid: 22,
            name: "Dragonbat 3",
            type: "MOB",
            icon: 354,
            x: 14,
            y: 27
        }, {
            mapid: 22,
            name: "Dragonbat 4",
            type: "MOB",
            icon: 355,
            x: 14,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Capricorn",
            type: "MOB",
            icon: 356,
            x: 14,
            y: 45
        }, {
            mapid: 22,
            name: "Dragonbat 5",
            type: "MOB",
            icon: 357,
            x: 14,
            y: 54
        }, {
            mapid: 22,
            name: "Dragonbat 6",
            type: "MOB",
            icon: 358,
            x: 14,
            y: 63
        }, {
            mapid: 22,
            name: "Dragonbat 7",
            type: "MOB",
            icon: 359,
            x: 14,
            y: 72
        }, {
            mapid: 22,
            name: "Dragonbat 8",
            type: "MOB",
            icon: 432,
            x: 14,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Earth Priestess",
            type: "MOB",
            icon: 334,
            x: 14,
            y: 92
        }, {
            mapid: 22,
            name: "Ogre 1",
            type: "MOB",
            icon: 360,
            x: 24,
            y: 9
        }, {
            mapid: 22,
            name: "Ogre 2",
            type: "MOB",
            icon: 361,
            x: 24,
            y: 18
        }, {
            mapid: 22,
            name: "Ogre 3",
            type: "MOB",
            icon: 362,
            x: 24,
            y: 27
        }, {
            mapid: 22,
            name: "Ogre 4",
            type: "MOB",
            icon: 363,
            x: 24,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Giant",
            type: "MOB",
            icon: 364,
            x: 24,
            y: 45
        }, {
            mapid: 22,
            name: "Ogre 5",
            type: "MOB",
            icon: 365,
            x: 24,
            y: 54
        }, {
            mapid: 22,
            name: "Ogre 6",
            type: "MOB",
            icon: 366,
            x: 24,
            y: 63
        }, {
            mapid: 22,
            name: "Ogre 7",
            type: "MOB",
            icon: 367,
            x: 24,
            y: 72
        }, {
            mapid: 22,
            name: "Ogre 8",
            type: "MOB",
            icon: 368,
            x: 24,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Water Priest",
            type: "MOB",
            icon: 335,
            x: 24,
            y: 92
        }, {
            mapid: 22,
            name: "Water Elf 1",
            type: "MOB",
            icon: 369,
            x: 33,
            y: 9
        }, {
            mapid: 22,
            name: "Water Elf 2",
            type: "MOB",
            icon: 370,
            x: 33,
            y: 18
        }, {
            mapid: 22,
            name: "Water Elf 3",
            type: "MOB",
            icon: 371,
            x: 33,
            y: 27
        }, {
            mapid: 22,
            name: "Water Elf 4",
            type: "MOB",
            icon: 372,
            x: 33,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Spider Queen",
            type: "MOB",
            icon: 373,
            x: 33,
            y: 45
        }, {
            mapid: 22,
            name: "Water Elf 5",
            type: "MOB",
            icon: 374,
            x: 33,
            y: 54
        }, {
            mapid: 22,
            name: "Water Elf 6",
            type: "MOB",
            icon: 375,
            x: 33,
            y: 63
        }, {
            mapid: 22,
            name: "Water Elf 7",
            type: "MOB",
            icon: 376,
            x: 33,
            y: 72
        }, {
            mapid: 22,
            name: "Water Elf 8",
            type: "MOB",
            icon: 377,
            x: 33,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Fire Priestess",
            type: "MOB",
            icon: 336,
            x: 33,
            y: 92
        }, {
            mapid: 22,
            name: "Survivor",
            description: "(NPC)",
            type: "POI",
            x: 44,
            y: 11
        }, {
            mapid: 22,
            name: "Wisp 1",
            type: "MOB",
            icon: 378,
            x: 42,
            y: 7
        }, {
            mapid: 22,
            name: "Wisp 2",
            type: "MOB",
            icon: 379,
            x: 42,
            y: 18
        }, {
            mapid: 22,
            name: "Wisp 3",
            type: "MOB",
            icon: 380,
            x: 42,
            y: 27
        }, {
            mapid: 22,
            name: "Wisp 4",
            type: "MOB",
            icon: 381,
            x: 42,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Poseidon",
            type: "MOB",
            icon: 382,
            x: 42,
            y: 45
        }, {
            mapid: 22,
            name: "Wisp 5",
            type: "MOB",
            icon: 383,
            x: 42,
            y: 54
        }, {
            mapid: 22,
            name: "Wisp 6",
            type: "MOB",
            icon: 384,
            x: 42,
            y: 63
        }, {
            mapid: 22,
            name: "Wisp 7",
            type: "MOB",
            icon: 385,
            x: 42,
            y: 72
        }, {
            mapid: 22,
            name: "Wisp 8",
            type: "MOB",
            icon: 386,
            x: 42,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Cathedral Guardian",
            type: "MOB",
            icon: 337,
            x: 42,
            y: 92
        }, {
            mapid: 22,
            name: "Swamp Monkey 1",
            type: "MOB",
            icon: 387,
            x: 51,
            y: 9
        }, {
            mapid: 22,
            name: "Swamp Monkey 2",
            type: "MOB",
            icon: 388,
            x: 51,
            y: 18
        }, {
            mapid: 22,
            name: "Swamp Monkey 3",
            type: "MOB",
            icon: 389,
            x: 51,
            y: 27
        }, {
            mapid: 22,
            name: "Swamp Monkey 4",
            type: "MOB",
            icon: 390,
            x: 51,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Headless Knight",
            type: "MOB",
            icon: 391,
            x: 51,
            y: 45
        }, {
            mapid: 22,
            name: "Swamp Monkey 5",
            type: "MOB",
            icon: 392,
            x: 51,
            y: 54
        }, {
            mapid: 22,
            name: "Swamp Monkey 6",
            type: "MOB",
            icon: 393,
            x: 51,
            y: 63
        }, {
            mapid: 22,
            name: "Swamp Monkey 7",
            type: "MOB",
            icon: 394,
            x: 51,
            y: 72
        }, {
            mapid: 22,
            name: "Swamp Monkey 8",
            type: "MOB",
            icon: 395,
            x: 51,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] God's Eye",
            type: "MOB",
            icon: 338,
            x: 51,
            y: 92
        }, {
            mapid: 22,
            name: "Basilisk 1",
            type: "MOB",
            icon: 396,
            x: 61,
            y: 9
        }, {
            mapid: 22,
            name: "Basilisk 2",
            type: "MOB",
            icon: 397,
            x: 61,
            y: 18
        }, {
            mapid: 22,
            name: "Basilisk 3",
            type: "MOB",
            icon: 398,
            x: 61,
            y: 27
        }, {
            mapid: 22,
            name: "Basilisk 4",
            type: "MOB",
            icon: 399,
            x: 61,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Wood Elf",
            type: "MOB",
            icon: 400,
            x: 61,
            y: 45
        }, {
            mapid: 22,
            name: "Basilisk 5",
            type: "MOB",
            icon: 401,
            x: 61,
            y: 54
        }, {
            mapid: 22,
            name: "Basilisk 6",
            type: "MOB",
            icon: 402,
            x: 61,
            y: 63
        }, {
            mapid: 22,
            name: "Basilisk 7",
            type: "MOB",
            icon: 403,
            x: 61,
            y: 72
        }, {
            mapid: 22,
            name: "Basilisk 8",
            type: "MOB",
            icon: 404,
            x: 61,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Zombie Lord",
            type: "MOB",
            icon: 339,
            x: 61,
            y: 92
        }, {
            mapid: 22,
            name: "Crusader 1",
            type: "MOB",
            icon: 405,
            x: 70,
            y: 9
        }, {
            mapid: 22,
            name: "Crusader 2",
            type: "MOB",
            icon: 406,
            x: 70,
            y: 18
        }, {
            mapid: 22,
            name: "Crusader 3",
            type: "MOB",
            icon: 407,
            x: 70,
            y: 27
        }, {
            mapid: 22,
            name: "Crusader 4",
            type: "MOB",
            icon: 408,
            x: 70,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Ice Golem",
            type: "MOB",
            icon: 409,
            x: 70,
            y: 45
        }, {
            mapid: 22,
            name: "Crusader 5",
            type: "MOB",
            icon: 410,
            x: 70,
            y: 54
        }, {
            mapid: 22,
            name: "Crusader 6",
            type: "MOB",
            icon: 411,
            x: 70,
            y: 63
        }, {
            mapid: 22,
            name: "Crusader 7",
            type: "MOB",
            icon: 412,
            x: 70,
            y: 72
        }, {
            mapid: 22,
            name: "Crusader 8",
            type: "MOB",
            icon: 413,
            x: 70,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Holy Knight",
            type: "MOB",
            icon: 340,
            x: 70,
            y: 92
        }, {
            mapid: 22,
            name: "Defender 1",
            type: "MOB",
            icon: 414,
            x: 79,
            y: 9
        }, {
            mapid: 22,
            name: "Defender 2",
            type: "MOB",
            icon: 415,
            x: 79,
            y: 18
        }, {
            mapid: 22,
            name: "Defender 3",
            type: "MOB",
            icon: 416,
            x: 79,
            y: 27
        }, {
            mapid: 22,
            name: "Defender 4",
            type: "MOB",
            icon: 417,
            x: 79,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Lave Golem",
            type: "MOB",
            icon: 418,
            x: 79,
            y: 45
        }, {
            mapid: 22,
            name: "Defender 5",
            type: "MOB",
            icon: 419,
            x: 79,
            y: 54
        }, {
            mapid: 22,
            name: "Defender 6",
            type: "MOB",
            icon: 420,
            x: 79,
            y: 63
        }, {
            mapid: 22,
            name: "Defender 7",
            type: "MOB",
            icon: 421,
            x: 79,
            y: 72
        }, {
            mapid: 22,
            name: "Defender 8",
            type: "MOB",
            icon: 422,
            x: 79,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] Saint Richard",
            type: "MOB",
            icon: 341,
            x: 79,
            y: 92
        }, {
            mapid: 22,
            name: "Gladiator 1",
            type: "MOB",
            icon: 423,
            x: 88,
            y: 9
        }, {
            mapid: 22,
            name: "Gladiator 2",
            type: "MOB",
            icon: 424,
            x: 88,
            y: 18
        }, {
            mapid: 22,
            name: "Gladiator 3",
            type: "MOB",
            icon: 425,
            x: 88,
            y: 27
        }, {
            mapid: 22,
            name: "Gladiator 4",
            type: "MOB",
            icon: 426,
            x: 88,
            y: 36
        }, {
            mapid: 22,
            name: "[Elite] Demon Unicorn",
            type: "MOB",
            icon: 427,
            x: 88,
            y: 45
        }, {
            mapid: 22,
            name: "Gladiator 5",
            type: "MOB",
            icon: 428,
            x: 88,
            y: 54
        }, {
            mapid: 22,
            name: "Gladiator 6",
            type: "MOB",
            icon: 429,
            x: 88,
            y: 63
        }, {
            mapid: 22,
            name: "Gladiator 7",
            type: "MOB",
            icon: 430,
            x: 88,
            y: 72
        }, {
            mapid: 22,
            name: "Gladiator 8",
            type: "MOB",
            icon: 431,
            x: 88,
            y: 81
        }, {
            mapid: 22,
            name: "[Boss] High Priest",
            type: "MOB",
            icon: 342,
            x: 88,
            y: 92
        }, {
            mapid: 22,
            name: "Gate",
            type: "MOB",
            icon: 434,
            x: 94,
            y: 96
        }, {
            mapid: 23,
            name: "Illusion Guild",
            description: "Chest",
            type: "CITY",
            x: 24,
            y: 25
        }, {
            mapid: 23,
            name: "Transfer to Fellen",
            description: "Tele to outside of fishing guild",
            type: "TRAVEL",
            x: 23,
            y: 29
        }, {
            mapid: 23,
            name: "Cage",
            description: "35 fishing",
            icon: "cage",
            type: "RESOURCE",
            x: 12,
            y: 27
        }, {
            mapid: 23,
            name: "Fishing Net",
            description: "5 fishing",
            type: "RESOURCE",
            icon: "net",
            x: 8,
            y: 30
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 14,
            y: 19
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 13,
            y: 13
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 17,
            y: 14
        }, {
            mapid: 23,
            name: "Fishing Rod",
            description: "1 fishing",
            type: "RESOURCE",
            icon: "fish",
            x: 20,
            y: 16
        }, {
            mapid: 23,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "trident",
            x: 13,
            y: 39
        }, {
            mapid: 23,
            name: "Poseidon's Trident",
            description: "95 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 17,
            y: 39
        }, {
            mapid: 23,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 6,
            y: 23
        }, {
            mapid: 23,
            name: "Steel Harpoon",
            description: "63 fishing",
            type: "RESOURCE",
            icon: "steelharp",
            x: 7,
            y: 33
        }, {
            mapid: 23,
            name: "Wooden Harpoon",
            description: "50 fishing",
            type: "RESOURCE",
            icon: "woodharp",
            x: 9,
            y: 24
        }, {
            mapid: 23,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 21,
            y: 69
        }, {
            mapid: 23,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 41,
            y: 72
        }, {
            mapid: 23,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 83
        }, {
            mapid: 23,
            name: "Redhodium Vein",
            description: "90 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 47,
            y: 65
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 24,
            y: 80
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 35,
            y: 58
        }, {
            mapid: 23,
            name: "Silver Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 41,
            y: 80
        }, {
            mapid: 23,
            name: "Transfer",
            description: "transfer to dorpat",
            type: "TRAVEL",
            x: 31,
            y: 74
        }, {
            mapid: 23,
            name: "Pluto Guild Chest",
            description: "Chest",
            type: "CITY",
            x: 39,
            y: 66
        }, {
            mapid: 24,
            name: "Tombstone",
            description: "Respawn Location",
            type: "POI",
            x: 11,
            y: 14
        }, {
            mapid: 24,
            name: "Transfer to Dorpat",
            type: "TRAVEL",
            x: 18,
            y: 10
        }, {
            mapid: 24,
            name: "Every Man's Land",
            description: "Chest",
            type: "CITY",
            x: 18,
            y: 15
        }, {
            mapid: 24,
            name: "Cannibal Plant",
            type: "BOSS",
            cblevel: 2100,
            x: 71,
            y: 76
        }, {
            mapid: 24,
            name: "Nephilim Warrior",
            type: "BOSS",
            cblevel: 3E3,
            x: 78,
            y: 76
        }, {
            mapid: 24,
            name: "Ancient Hydra",
            type: "BOSS",
            cblevel: 1E3,
            x: 85,
            y: 76
        }, {
            mapid: 24,
            name: "Cow",
            type: "MOB",
            icon: 102,
            x: 33,
            y: 32
        }, {
            mapid: 24,
            name: "Cow King",
            type: "MOB",
            icon: 437,
            x: 39,
            y: 77
        }, {
            mapid: 25,
            name: "Moche",
            description: "Chest",
            type: "CITY",
            x: 48,
            y: 63
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 58,
            y: 41
        }, {
            mapid: 25,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 67,
            y: 32
        }, {
            mapid: 25,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 70,
            y: 24
        }, {
            mapid: 25,
            name: "Gray Wizard",
            type: "MOB",
            icon: 1,
            x: 60,
            y: 37
        }, {
            mapid: 25,
            name: "Minotaur",
            type: "MOB",
            icon: 6,
            x: 78,
            y: 10
        }, {
            mapid: 25,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 62,
            y: 12
        }, {
            mapid: 25,
            name: "Sapphire Dragon",
            type: "MOB",
            icon: 14,
            x: 47,
            y: 10
        }, {
            mapid: 25,
            name: "Skeleton",
            type: "MOB",
            icon: 10,
            x: 25,
            y: 12
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 15,
            y: 21
        }, {
            mapid: 25,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 20,
            y: 31
        }, {
            mapid: 25,
            name: "Ghost",
            type: "MOB",
            icon: 9,
            x: 13,
            y: 41
        }, {
            mapid: 25,
            name: "Campfire",
            type: "POI",
            x: 18,
            y: 49
        }, {
            mapid: 25,
            name: "Orc Warrior",
            type: "MOB",
            icon: 4,
            x: 22,
            y: 49
        }, {
            mapid: 25,
            name: "White Rat",
            type: "MOB",
            icon: 1,
            x: 32,
            y: 63
        }, {
            mapid: 25,
            name: "Chicken",
            type: "MOB",
            icon: 100,
            x: 38,
            y: 44
        }, {
            mapid: 25,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 20,
            y: 62
        }, {
            mapid: 25,
            name: "Sand",
            description: "1 mining",
            icon: "spade",
            type: "RESOURCE",
            x: 25,
            y: 92
        }, {
            mapid: 25,
            name: "Desert Runner",
            type: "MOB",
            icon: 44,
            x: 11,
            y: 71
        }, {
            mapid: 25,
            name: "Fire Imp",
            type: "MOB",
            icon: 47,
            x: 19,
            y: 91
        }, {
            mapid: 25,
            name: "Transfer to Reval",
            description: "Leads to Cesis, Pernau",
            type: "TRAVEL",
            x: 46,
            y: 90
        }, {
            mapid: 25,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 57,
            y: 85
        }, {
            mapid: 25,
            name: "Orc Mage",
            type: "MOB",
            icon: 13,
            x: 85,
            y: 33
        }, {
            mapid: 25,
            name: "Silver",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 83,
            y: 94
        }, {
            mapid: 25,
            name: "Green WIzaard",
            type: "MOB",
            icon: 3,
            x: 93,
            y: 77
        }, {
            mapid: 25,
            name: "Transfer to Dorpat",
            description: "Teleports you to Dorpat",
            type: "TRAVEL",
            x: 93,
            y: 42
        }, {
            mapid: 25,
            name: "Woodcutter's Guild",
            description: "Requires Woodcutting guild permission and 80 woodcutting.",
            type: "POI",
            x: 84,
            y: 27
        }, {
            mapid: 26,
            name: "Transfer to Brocaliande Forest",
            description: "Teleports you to Brocaliande Forest",
            type: "TRAVEL",
            x: 10,
            y: 87
        }, {
            mapid: 26,
            name: "Summoned Skull",
            type: "MOB",
            icon: 324,
            x: 22,
            y: 76
        }, {
            mapid: 26,
            name: "Metal Dragon",
            type: "MOB",
            icon: 252,
            x: 13,
            y: 58
        }, {
            mapid: 26,
            name: "Fire Dragon",
            type: "MOB",
            icon: 253,
            x: 12,
            y: 37
        }, {
            mapid: 26,
            name: "Undead Paladin",
            type: "MOB",
            icon: 329,
            x: 51,
            y: 27
        }, {
            mapid: 26,
            name: "Rock Golem",
            type: "MOB",
            icon: 317,
            x: 77,
            y: 15
        }, {
            mapid: 26,
            name: "Ent",
            type: "MOB",
            icon: 323,
            x: 83,
            y: 36
        }, {
            mapid: 26,
            name: "Acient Golem",
            type: "MOB",
            icon: 325,
            x: 87,
            y: 61
        }, {
            mapid: 26,
            name: "Acient Golem",
            type: "MOB",
            icon: 325,
            x: 41,
            y: 75
        }, {
            mapid: 26,
            name: "Gravekeeper",
            type: "MOB",
            icon: 328,
            x: 64,
            y: 85
        }, {
            mapid: 26,
            name: "Wittensten Outpost",
            type: "CITY",
            x: 67,
            y: 51
        }, {
            mapid: 26,
            name: "Campfire",
            type: "POI",
            x: 74,
            y: 51
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 22,
            y: 11
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 10,
            y: 83
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 46,
            y: 85
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 34,
            y: 63
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 60,
            y: 67
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 82,
            y: 62
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 93,
            y: 90
        }, {
            mapid: 27,
            name: "Transfer to Dungeon I",
            type: "TRAVEL",
            x: 87,
            y: 25
        }, {
            mapid: 27,
            name: "Ghost Dragon",
            type: "MOB",
            icon: 23,
            x: 15,
            y: 82
        }, {
            mapid: 27,
            name: "King Sapphire Dragon",
            type: "MOB",
            icon: 112,
            x: 14,
            y: 62
        }, {
            mapid: 27,
            name: "Adult Gilded Dragon",
            type: "MOB",
            icon: 250,
            x: 18,
            y: 46
        }, {
            mapid: 27,
            name: "King Gilded Dragon",
            type: "MOB",
            icon: 244,
            x: 17,
            y: 35
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 7,
            y: 37
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 10,
            y: 11
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 34
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 63,
            y: 71
        }, {
            mapid: 27,
            name: "Black Rat",
            type: "MOB",
            icon: 8,
            x: 8,
            y: 19
        }, {
            mapid: 27,
            name: "Cave Worm",
            type: "MOB",
            icon: 197,
            x: 18,
            y: 16
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 22,
            y: 18
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 87,
            y: 31
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 55,
            y: 43
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 12,
            y: 7
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 61,
            y: 14
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 5,
            y: 83
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 77,
            y: 78
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 81,
            y: 59
        }, {
            mapid: 27,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 79,
            y: 22
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 5,
            y: 88
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 85,
            y: 72
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 73,
            y: 61
        }, {
            mapid: 27,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 73,
            y: 17
        }, {
            mapid: 27,
            name: "Campfire",
            type: "POI",
            x: 7,
            y: 37
        }, {
            mapid: 27,
            name: "Ettin King",
            type: "MOB",
            icon: 21,
            x: 37,
            y: 87
        }, {
            mapid: 27,
            name: "Efreet",
            type: "MOB",
            icon: 22,
            x: 50,
            y: 86
        }, {
            mapid: 27,
            name: "Skeleton Assassin",
            type: "MOB",
            icon: 138,
            x: 36,
            y: 68
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 25,
            y: 68
        }, {
            mapid: 27,
            name: "Skeleton Lord",
            type: "MOB",
            icon: 176,
            x: 29,
            y: 55
        }, {
            mapid: 27,
            name: "Skeleton King",
            type: "MOB",
            icon: 175,
            x: 32,
            y: 51
        }, {
            mapid: 27,
            name: "Dracula's Messenger",
            type: "MOB",
            icon: 444,
            x: 26,
            y: 42
        }, {
            mapid: 27,
            name: "Dracula's Messenger",
            type: "MOB",
            icon: 444,
            x: 43,
            y: 19
        }, {
            mapid: 27,
            name: "Dracula",
            type: "MOB",
            icon: 443,
            x: 30,
            y: 26
        }, {
            mapid: 27,
            name: "Tin",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 28,
            y: 20
        }, {
            mapid: 27,
            name: "Copper",
            description: "1 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 36,
            y: 19
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 43,
            y: 41
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 87,
            y: 63
        }, {
            mapid: 27,
            name: "Hell Demon",
            type: "MOB",
            icon: 446,
            x: 58,
            y: 46
        }, {
            mapid: 27,
            name: "Enchanter",
            type: "MOB",
            icon: 204,
            x: 45,
            y: 51
        }, {
            mapid: 27,
            name: "Orc Overlord",
            type: "BOSS",
            cblevel: 470,
            x: 42,
            y: 58
        }, {
            mapid: 27,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 55,
            y: 58
        }, {
            mapid: 27,
            name: "Paladin",
            type: "MOB",
            icon: 25,
            x: 68,
            y: 73
        }, {
            mapid: 27,
            name: "Dark Knight",
            type: "MOB",
            icon: 29,
            x: 55,
            y: 68
        }, {
            mapid: 27,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 59,
            y: 86
        }, {
            mapid: 27,
            name: "King Ruby Dragon",
            type: "MOB",
            icon: 24,
            x: 82,
            y: 83
        }, {
            mapid: 27,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 69,
            y: 95
        }, {
            mapid: 27,
            name: "Adult Ruby Dragon",
            type: "MOB",
            icon: 184,
            x: 89,
            y: 89
        }, {
            mapid: 27,
            name: "Gold Vein",
            description: "45 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 92,
            y: 94
        }, {
            mapid: 27,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 58,
            y: 91
        }, {
            mapid: 27,
            name: "Gold",
            description: "45 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 87,
            y: 75
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 80,
            y: 57
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 74,
            y: 44
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 68,
            y: 27
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 56,
            y: 8
        }, {
            mapid: 27,
            name: "Undead Demon",
            type: "MOB",
            icon: 445,
            x: 53,
            y: 35
        }, {
            mapid: 27,
            name: "Energy Ghost",
            type: "MOB",
            icon: 137,
            x: 89,
            y: 41
        }, {
            mapid: 27,
            name: "Vampire",
            type: "MOB",
            icon: 11,
            x: 89,
            y: 20
        }, {
            mapid: 27,
            name: "Vampire Lord",
            type: "MOB",
            icon: 28,
            x: 73,
            y: 10
        }, {
            mapid: 27,
            name: "Demon Overlord",
            type: "BOSS",
            cblevel: 470,
            x: 83,
            y: 71
        }, {
            mapid: 27,
            name: "Transfer to Dungeon III",
            description: "Leads to Dungeon IV",
            type: "TRAVEL",
            x: 79,
            y: 83
        }, {
            mapid: 28,
            name: "Transfer to Dungeon II",
            description: "Leads to Dungeon III-I",
            type: "TRAVEL",
            x: 79,
            y: 83
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 44,
            y: 29
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 17,
            y: 81
        }, {
            mapid: 28,
            name: "Transfer to Dungeon IV",
            type: "TRAVEL",
            x: 51,
            y: 58
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 75,
            y: 90
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 69,
            y: 71
        }, {
            mapid: 28,
            name: "Mutated Knight",
            type: "MOB",
            icon: 448,
            x: 57,
            y: 84
        }, {
            mapid: 28,
            name: "Mutated Baron",
            type: "MOB",
            icon: 449,
            x: 82,
            y: 51
        }, {
            mapid: 28,
            name: "Mutated Baron",
            type: "MOB",
            icon: 449,
            x: 71,
            y: 45
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 65,
            y: 42
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 63,
            y: 26
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 85,
            y: 27
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 60,
            y: 21
        }, {
            mapid: 28,
            name: "Mutated Earl",
            type: "MOB",
            icon: 450,
            x: 65,
            y: 31
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 50,
            y: 21
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 27,
            y: 26
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 27,
            y: 13
        }, {
            mapid: 28,
            name: "Royal Cyclops",
            type: "MOB",
            icon: 451,
            x: 17,
            y: 31
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 12,
            y: 28
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 18,
            y: 14
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 15,
            y: 41
        }, {
            mapid: 28,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 9,
            y: 59
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 8,
            y: 69
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 18,
            y: 76
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 21,
            y: 81
        }, {
            mapid: 28,
            name: "Hell Angel",
            type: "MOB",
            icon: 91,
            x: 31,
            y: 91
        }, {
            mapid: 28,
            name: "Soul Eater",
            type: "MOB",
            icon: 460,
            x: 19,
            y: 54
        }, {
            mapid: 28,
            name: "Soul Eater",
            type: "MOB",
            icon: 460,
            x: 26,
            y: 61
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 39,
            y: 75
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 41,
            y: 81
        }, {
            mapid: 28,
            name: "Death Energy",
            type: "MOB",
            icon: 462,
            x: 50,
            y: 79
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 61,
            y: 62
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 69,
            y: 59
        }, {
            mapid: 28,
            name: "Death Shadow",
            type: "MOB",
            icon: 461,
            x: 66,
            y: 52
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 47,
            y: 42
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 38,
            y: 38
        }, {
            mapid: 28,
            name: "Cyclops Ghost",
            type: "MOB",
            icon: 459,
            x: 47,
            y: 30
        }, {
            mapid: 28,
            name: "Blood Eagle",
            type: "BOSS",
            cblevel: 1E4,
            x: 43,
            y: 58
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 65,
            y: 83
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 73,
            y: 26
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 20
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 15,
            y: 70
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 38,
            y: 49
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 35,
            y: 68
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 53,
            y: 67
        }, {
            mapid: 28,
            name: "Campfire",
            type: "POI",
            x: 54,
            y: 48
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 72,
            y: 77
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 86,
            y: 57
        }, {
            mapid: 28,
            name: "Iron",
            description: "25 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 71,
            y: 20
        }, {
            mapid: 28,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 71,
            y: 87
        }, {
            mapid: 28,
            name: "Iron Vein",
            description: "25 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 82,
            y: 42
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 56,
            y: 17
        }, {
            mapid: 16,
            name: "Coal",
            description: "40 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 35,
            y: 15
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 63,
            y: 76
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 30,
            y: 17
        }, {
            mapid: 28,
            name: "Coal Vein",
            description: "40 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 11,
            y: 31
        }, {
            mapid: 28,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 84,
            y: 75
        }, {
            mapid: 28,
            name: "Dragonstone",
            description: "110 mining",
            icon: "pick",
            type: "RESOURCE",
            x: 8,
            y: 85
        }, {
            mapid: 28,
            name: "Dragonstone Vein",
            description: "110 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 81,
            y: 77
        }, {
            mapid: 28,
            name: "Dragonstone Vein",
            description: "110 mining",
            icon: "steelpick",
            type: "RESOURCE",
            x: 12,
            y: 91
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 78,
            y: 88
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 90,
            y: 93
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 85,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 68,
            y: 90
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 58,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 46,
            y: 84
        }, {
            mapid: 29,
            name: "Burning Cyclops Lord",
            type: "MOB",
            icon: 454,
            x: 44,
            y: 94
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 76,
            y: 78
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 79,
            y: 64
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 68,
            y: 71
        }, {
            mapid: 29,
            name: "Burning Cyclops",
            type: "MOB",
            icon: 453,
            x: 62,
            y: 80
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 38,
            y: 82
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 28,
            y: 85
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 24,
            y: 88
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 17,
            y: 89
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 79,
            y: 48
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 77,
            y: 37
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 87,
            y: 38
        }, {
            mapid: 29,
            name: "Demonic Minotaur",
            type: "MOB",
            icon: 455,
            x: 87,
            y: 29
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 80,
            y: 25
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 79,
            y: 15
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 86,
            y: 9
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 77,
            y: 7
        }, {
            mapid: 29,
            name: "Cyclops Battlemage",
            type: "MOB",
            icon: 452,
            x: 67,
            y: 26
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 62,
            y: 26
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 65,
            y: 15
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 49,
            y: 29
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 49,
            y: 19
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 57,
            y: 18
        }, {
            mapid: 29,
            name: "Holy Minotaur",
            type: "MOB",
            icon: 455,
            x: 44,
            y: 8
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 37,
            y: 32
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 25,
            y: 40
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 28,
            y: 30
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 18,
            y: 35
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 25,
            y: 28
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 21,
            y: 20
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 24,
            y: 8
        }, {
            mapid: 29,
            name: "Blood Minotaur",
            type: "MOB",
            icon: 464,
            x: 31,
            y: 17
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 24,
            y: 45
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 21,
            y: 55
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 10,
            y: 55
        }, {
            mapid: 29,
            name: "Ice Minotaur",
            type: "MOB",
            icon: 466,
            x: 10,
            y: 42
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 20,
            y: 71
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 8,
            y: 71
        }, {
            mapid: 29,
            name: "Dragon Hunter",
            type: "MOB",
            icon: 463,
            x: 9,
            y: 83
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 50,
            y: 45
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 47,
            y: 57
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 55,
            y: 60
        }, {
            mapid: 29,
            name: "Death Guardian",
            type: "MOB",
            icon: 456,
            x: 61,
            y: 50
        }, {
            mapid: 29,
            name: "Titan Minotaur",
            type: "BOSS",
            cblevel: 10015,
            x: 42,
            y: 58
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 35,
            y: 87
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 88,
            y: 68
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 89,
            y: 26
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 31,
            y: 34
        }, {
            mapid: 29,
            name: "Campfire",
            type: "POI",
            x: 12,
            y: 78
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            type: "TRAVEL",
            x: 44,
            y: 29
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            type: "TRAVEL",
            x: 17,
            y: 81
        }, {
            mapid: 29,
            name: "Transfer to Dungeon III",
            description: "Leads to Boss Blood Eagle",
            type: "TRAVEL",
            x: 51,
            y: 58
        }, {
            mapid: 30,
            name: "Ice Baby Griffin",
            type: "MOB",
            icon: 476,
            x: 16,
            y: 24
        }, {
            mapid: 30,
            name: "Ice Baby Griffin",
            type: "MOB",
            icon: 476,
            x: 19,
            y: 20
        }, {
            mapid: 30,
            name: "Ice Baby Griffin",
            type: "MOB",
            icon: 476,
            x: 17,
            y: 41
        }, {
            mapid: 30,
            name: "Faith Baby Griffin",
            type: "MOB",
            icon: 475,
            x: 28,
            y: 47
        }, {
            mapid: 30,
            name: "Faith Baby Griffin",
            type: "MOB",
            icon: 475,
            x: 59,
            y: 19
        }, {
            mapid: 30,
            name: "Faith Baby Griffin",
            type: "MOB",
            icon: 475,
            x: 13,
            y: 67
        }, {
            mapid: 30,
            name: "Ice Griffin",
            type: "MOB",
            icon: 478,
            x: 49,
            y: 56
        }, {
            mapid: 30,
            name: "Ice Griffin",
            type: "MOB",
            icon: 478,
            x: 49,
            y: 83
        }, {
            mapid: 30,
            name: "Faith Griffin",
            type: "MOB",
            icon: 477,
            x: 63,
            y: 41
        }, {
            mapid: 30,
            name: "Emerald Turtle",
            type: "MOB",
            icon: 473,
            x: 85,
            y: 18
        }, {
            mapid: 30,
            name: "Sapphire Turtle",
            type: "MOB",
            icon: 472,
            x: 81,
            y: 42
        }, {
            mapid: 30,
            name: "Ruby Turtle",
            type: "MOB",
            icon: 474,
            x: 78,
            y: 75
        }, {
            mapid: 30,
            name: "Ruby Turtle",
            type: "MOB",
            icon: 474,
            x: 93,
            y: 83
        }, {
            mapid: 30,
            name: "Emerald Worm",
            type: "MOB",
            icon: 480,
            x: 54,
            y: 91
        }, {
            mapid: 30,
            name: "Sand Worm",
            type: "MOB",
            icon: 479,
            x: 66,
            y: 86
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 86,
            y: 32
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 86,
            y: 79
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 45,
            y: 92
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 62,
            y: 70
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 59,
            y: 9
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 9,
            y: 19
        }, {
            mapid: 30,
            name: "Campfire",
            type: "POI",
            x: 18,
            y: 81
        }, {
            mapid: 30,
            name: "Transfer to Reval",
            type: "TRAVEL",
            x: 85,
            y: 95
        }, {
            mapid: 30,
            name: "Transfer to Moche I",
            type: "TRAVEL",
            x: 91,
            y: 55
        }, {
            mapid: 30,
            name: "Fletching Table",
            description: "Fletch Arrows Here",
            type: "POI",
            x: 23,
            y: 89
        }, {
            mapid: 31,
            name: "Shadow Dragon",
            type: "MOB",
            icon: 485,
            x: 13,
            y: 85
        }, {
            mapid: 31,
            name: "Shadow Dragon",
            type: "MOB",
            icon: 485,
            x: 19,
            y: 73
        }, {
            mapid: 31,
            name: "Undead Dragon",
            type: "MOB",
            icon: 486,
            x: 14,
            y: 58
        }, {
            mapid: 31,
            name: "Undead Dragon",
            type: "MOB",
            icon: 486,
            x: 27,
            y: 58
        }, {
            mapid: 31,
            name: "Undead Dragon",
            type: "MOB",
            icon: 486,
            x: 19,
            y: 47
        }, {
            mapid: 31,
            name: "Underworld Lord",
            type: "MOB",
            icon: 487,
            x: 13,
            y: 38
        }, {
            mapid: 31,
            name: "Underworld Lord",
            type: "MOB",
            icon: 487,
            x: 30,
            y: 40
        }, {
            mapid: 31,
            name: "Soul Trapper",
            type: "MOB",
            icon: 488,
            x: 39,
            y: 31
        }, {
            mapid: 31,
            name: "Soul Trapper",
            type: "MOB",
            icon: 488,
            x: 14,
            y: 28
        }, {
            mapid: 31,
            name: "Ancient Wyvern",
            type: "MOB",
            icon: 489,
            x: 16,
            y: 13
        }, {
            mapid: 31,
            name: "Ancient Wyvern",
            type: "MOB",
            icon: 489,
            x: 28,
            y: 17
        }, {
            mapid: 31,
            name: "Ancient Wyvern",
            type: "MOB",
            icon: 489,
            x: 55,
            y: 20
        }, {
            mapid: 31,
            name: "Fire Elemental",
            type: "MOB",
            icon: 482,
            x: 72,
            y: 20
        }, {
            mapid: 31,
            name: "Fire Elemental",
            type: "MOB",
            icon: 482,
            x: 89,
            y: 20
        }, {
            mapid: 31,
            name: "Fire Elemental",
            type: "MOB",
            icon: 482,
            x: 83,
            y: 32
        }, {
            mapid: 31,
            name: "Efreet Sultan",
            type: "MOB",
            icon: 481,
            x: 83,
            y: 49
        }, {
            mapid: 31,
            name: "Efreet Sultan",
            type: "MOB",
            icon: 481,
            x: 94,
            y: 44
        }, {
            mapid: 31,
            name: "Fire Overlord",
            type: "MOB",
            icon: 483,
            x: 90,
            y: 66
        }, {
            mapid: 31,
            name: "Fire Overlord",
            type: "MOB",
            icon: 483,
            x: 87,
            y: 83
        }, {
            mapid: 31,
            name: "Flame Observer",
            type: "MOB",
            icon: 484,
            x: 70,
            y: 28
        }, {
            mapid: 31,
            name: "Flame Observer",
            type: "MOB",
            icon: 484,
            x: 54,
            y: 38
        }, {
            mapid: 31,
            name: "Flame Observer",
            type: "MOB",
            icon: 484,
            x: 30,
            y: 73
        }, {
            mapid: 31,
            name: "Raguel The Archangel",
            type: "BOSS",
            cblevel: 2090,
            x: 27,
            y: 88
        }, {
            mapid: 31,
            name: "Campfire",
            type: "POI",
            x: 81,
            y: 12
        }, {
            mapid: 31,
            name: "Campfire",
            type: "POI",
            x: 93,
            y: 57
        }, {
            mapid: 31,
            name: "Campfire",
            type: "POI",
            x: 14,
            y: 65
        }, {
            mapid: 31,
            name: "Campfire",
            type: "POI",
            x: 46,
            y: 18
        }, {
            mapid: 31,
            name: "Void Outpost",
            type: "CITY",
            x: 41,
            y: 20
        }, {
            mapid: 31,
            name: "Transfer to Blood River",
            type: "TRAVEL",
            x: 78,
            y: 82
        }, {
            mapid: 31,
            name: "Transfer to Clouds",
            type: "TRAVEL",
            x: 8,
            y: 67
        }, {
            mapid: 31,
            name: "Tower Of Nature Door",
            description: "Enter Nature Tower",
            type: "TRAVEL",
            x: 40,
            y: 84
        }, {
            mapid: 31,
            name: "Tower Of Ice Door",
            description: "Enter Ice Tower",
            type: "TRAVEL",
            x: 49,
            y: 95
        }, {
            mapid: 31,
            name: "Tower Of Fire Door",
            description: "Enter Fire Tower",
            type: "TRAVEL",
            x: 60,
            y: 97
        }]
    };
    Mods.Newmap.POIfind = [];
    Mods.Newmap.POIfindMap = 0;
    HUD.drawMinimap = function() {
        if (!minimap) {
            getElem("mods_zone_buttondiv").style.visibility = "hidden";
            Mods.Newmap.drawMinimap();
            ctx.hud.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.hud.fillRect(0, 14, 76, 4);
            ctx.hud.fillRect(76, 14, 4, 76);
            ctx.hud.fillRect(0, 90, 80, 4);
            ctx.hud.fillRect(0, 18, 4, 72);
            ctx.globalAlpha = 0;
            ctx.hud.font = "9px Arial";
            ctx.hud.textAlign = "center";
            ctx.hud.fillStyle = "black";
            ctx.hud.fillText("N",
                39.5, 18);
            ctx.hud.fillStyle = "yellow";
            ctx.hud.fillText("N", 40.5, 19);
            var b = [],
                e = [],
                f;
            for (f in players) "undefined" != typeof players[f] && players[f].b_t == BASE_TYPE.PLAYER && (players[f].me ? b.push({
                color: "#55FF55",
                i: players[f].i,
                j: players[f].j
            }) : Mods.findWithAttr(Contacts.friends, "name", players[f].name) ? e.push({
                color: "yellow",
                i: players[f].i,
                j: players[f].j
            }) : 0 <= Contacts.ignores.indexOf(players[f].name) ? b.push({
                color: "#FFFFFF",
                i: players[f].i,
                j: players[f].j
            }) : b.push({
                color: "#00BFFF",
                i: players[f].i,
                j: players[f].j
            }));
            for (f in e) b.push(e[f]);
            if ("undefined" !== typeof Mods.Newmap && "undefined" !== typeof Mods.Newmap.POIfind)
                if (Mods.Newmap.POIfindMap == current_map)
                    for (f in Mods.Newmap.POIfind) b.push(Mods.Newmap.POIfind[f]);
                else Mods.Newmap.POIfind = [];
            for (f in b) {
                col = b[f].color;
                d = translateTileToCoordinates(b[f].i + 13, b[f].j - 9);
                a = 3 * map_increase;
                a = (Math.round((d.x - dest_x) / 8) / 1.01 + .5 | 0) - a;
                d = 14 + Math.round((d.y - dest_y) / 8);
                var g = !1,
                    k = 0,
                    e = [{
                        x: 0,
                        y: 0
                    }, {
                        x: -6,
                        y: -3
                    }, {
                        x: -6,
                        y: 3
                    }],
                    m = [{
                        x: -1,
                        y: 0
                    }, {
                        x: -5,
                        y: -1
                    }, {
                        x: -5,
                        y: 1
                    }];
                2 > a && (k = Math.atan2(d -
                    53.5, a - 39.5), g = !0, d = 39.5 * (d - 53.5) / (39.5 - a) + 53.5, a = 0);
                16 > d && (g || (k = Math.atan2(d - 53.5, a - 39.5), g = !0), a = 39.5 * (a - 39.5) / (53.5 - d) + 39.5, d = 14);
                78 < a && (g || (k = Math.atan2(d - 53.5, a - 39.5), g = !0), d = -39.5 * (d - 53.5) / (39.5 - a) + 53.5, a = 79);
                92 < d && (g || (k = Math.atan2(d - 53.5, a - 39.5), g = !0), a = -39.5 * (a - 39.5) / (53.5 - d) + 39.5, d = 93);
                if (g) {
                    var g = [{
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }],
                        n = [{
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }, {
                            x: 0,
                            y: 0
                        }],
                        p = Math.cos(k),
                        k = Math.sin(k),
                        q;
                    for (q in g) g[q].x = a + p * e[q].x - k * e[q].y, g[q].y = d + k * e[q].x + p * e[q].y, n[q].x = a + p * m[q].x - k * m[q].y, n[q].y =
                        d + k * m[q].x + p * m[q].y;
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = "#000000";
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(g[0].x, g[0].y);
                    ctx.hud.lineTo(g[1].x, g[1].y);
                    ctx.hud.lineTo(g[2].x, g[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath();
                    ctx.hud.fillStyle = col;
                    ctx.hud.beginPath();
                    ctx.hud.moveTo(n[0].x, n[0].y);
                    ctx.hud.lineTo(n[1].x, n[1].y);
                    ctx.hud.lineTo(n[2].x, n[2].y);
                    ctx.hud.fill();
                    ctx.hud.closePath()
                } else ctx.hud.fillStyle = "#000000", ctx.hud.fillRect(a - 2, d - 2, 4, 4), ctx.hud.fillStyle = col, ctx.hud.fillRect(a - 1, d - 1, 2, 2)
            }
        }
    };
    HUD.drawMinimapLarge =
        function() {
            Mods.Newmap.drawMinimapLarge();
            if (minimap) {
                getElem("mods_zone_buttondiv").style.visibility = "";
                Mods.Newmap.zonemapvisible = !1;
                var b = Mods.Newmap.FilterObj(Mods.Newmap.POI[0], {
                    mapid: current_map
                });
                Mods.Newmap.HotSpots = [];
                var e, f, g;
                for (g in b) {
                    var k = Mods.Newmap.translateMapCoords(b[g].x + 6, b[g].y - 3),
                        m = Math.round(k.x) / 1.01 + .5 | 0,
                        k = 14 + Math.round(k.y);
                    e = null;
                    switch (b[g].type) {
                        case "CITY":
                            f = "#55FF55";
                            b[g].icon = "city";
                            break;
                        case "BOSS":
                            f = "red";
                            b[g].icon = "boss";
                            break;
                        case "MOB":
                            f = "transparent";
                            e = npc_base[b[g].icon].img;
                            var n = npc_base[b[g].icon];
                            b[g].cblevel = npc_base[b[g].icon].params.combat_level;
                            b[g].description = n.temp.total_accuracy + "A, " + n.temp.total_strength + "S, " + n.temp.total_defense + "D, " + n.params.health + "Hp";
                            break;
                        case "POI":
                            f = "yellow";
                            b[g].icon = "poi";
                            break;
                        case "TRAVEL":
                            f = "#00FFFF";
                            b[g].icon = "travel";
                            break;
                        case "LOOT":
                            f = "white";
                            b[g].icon = "loot";
                            break;
                        case "RESOURCE":
                            f = "#F5A9E1";
                            break;
                        default:
                            f = "yellow"
                    }
                    switch (b[g].icon) {
                        case "spade":
                            e = item_base[286].img;
                            break;
                        case "pick":
                            e = item_base[23].img;
                            break;
                        case "steelpick":
                            e =
                                item_base[400].img;
                            break;
                        case "wood":
                            e = item_base[22].img;
                            break;
                        case "wood2":
                            e = item_base[152].img;
                            break;
                        case "fish":
                            e = item_base[7].img;
                            break;
                        case "ironrod":
                            e = item_base[1036].img;
                            break;
                        case "net":
                            e = item_base[124].img;
                            break;
                        case "cage":
                            e = item_base[127].img;
                            break;
                        case "woodharp":
                            e = item_base[125].img;
                            break;
                        case "trident":
                            e = item_base[1397].img;
                            break;
                        case "steelharp":
                            e = item_base[126].img;
                            break;
                        case "city":
                            e = {
                                sheet: IMAGE_SHEET.MISC,
                                x: 2,
                                y: 7
                            };
                            break;
                        case "boss":
                            e = item_base[544].img;
                            break;
                        case "poi":
                            e = item_base[1132].img;
                            break;
                        case "travel":
                            e = {
                                sheet: IMAGE_SHEET.SICOS,
                                x: 0,
                                y: 5
                            };
                            break;
                        case "loot":
                            e = {
                                sheet: IMAGE_SHEET.MISC,
                                x: 4,
                                y: 0
                            }
                    }
                    "transparent" != f && (ctx.hud.beginPath(), ctx.hud.arc(m, k, 6, 0, 2 * Math.PI, !1), ctx.hud.fillStyle = f, ctx.hud.fill(), ctx.hud.lineWidth = 1, ctx.hud.strokeStyle = "#000000", ctx.hud.stroke());
                    if (e) {
                        var p, q;
                        "string" == typeof e.hash ? (e.x = 12, e.y = 10, n = getBodyImgNoHalo(e.hash), p = {
                            img: [n],
                            tile_width: 1,
                            tile_height: 1
                        }, p.url = n.toDataURL(), n = 12, q = 10) : (p = IMAGE_SHEET[e.sheet], n = e.x, q = e.y);
                        f = "transparent" == f ? 16 : 12;
                        ctx.hud.drawImage(p.img[0],
                            n * p.tile_width, q * p.tile_height, 32, 32, m - f / 2, k - f / 2, f, f)
                    }
                    Mods.Newmap.HotSpots.push({
                        x: m,
                        y: k,
                        desc: (e ? "<div style='width:32px;height:32px;float:left;background:url(\"" + p.url + '") no-repeat scroll ' + -e.x * p.tile_width + "px " + -e.y * p.tile_height + "px transparent;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div>" : "") + b[g].type + ": <b>" + b[g].name + (b[g].cblevel ? " (" + b[g].cblevel + ")" : "") + "</b><br/>" + (b[g].description ? b[g].description : "")
                    })
                }
                Mods.Newmap.BlinkPos("#55FF55");
                if (-1 != ["Dungeon quest", "No Man's Land",
                        "Cathedral", "Every Man's Land"
                    ].indexOf(map_names[players[0].map]))
                    for (var t in players) players[t].b_t != BASE_TYPE.PLAYER || players[t].me || (k = Mods.Newmap.translateMapCoords(players[t].i + 6, players[t].j - 3), m = Math.round(k.x) / 1.01 + .5 | 0, k = 14 + Math.round(k.y), b = players[t].name, ctx.hud.font = "9px Arial", ctx.hud.textAlign = "center", ctx.hud.fillStyle = "#000", ctx.hud.fillText(b, m - 1, k - 1), ctx.hud.fillStyle = "yellow", ctx.hud.fillText(b, m, k));
                getElem("hud").addEventListener("mousemove", Mods.Newmap.MapCoords, !1)
            }
        };
    Mods.Newmap.ShowZone =
        function() {
            getElem("mods_zone_buttondiv").style.visibility = "hidden";
            Mods.Newmap.zonemapvisible = !0;
            var b = new Image;
            b.onload = function() {
                ctx.hud.drawImage(b, .01 * ctx.hud.canvas.width, .05 * ctx.hud.canvas.height, .98 * ctx.hud.canvas.width, .9 * ctx.hud.canvas.height)
            };
            b.src = "https://mo.mo.ee/world_map_2017_feb.png"
        };
    Mods.Newmap.BlinkPos = function(b, e, f) {
        if (minimap && !Mods.Newmap.zonemapvisible) {
            if (!e && !f) {
                var g = Mods.Newmap.translateMapCoords(players[0].i + 6, players[0].j - 3),
                    k = Math.round(g.x) / 1.01 + .5 | 0,
                    g = 14 + Math.round(g.y);
                e = k;
                f = g
            }
            ctx.hud.fillStyle = b;
            ctx.hud.fillRect(e - 2, f - 2, 4, 4);
            setTimeout(function() {
                Mods.Newmap.BlinkPos("red" == b ? "#55FF55" : "red", e, f)
            }, 1E3)
        }
    };
    Mods.Newmap.translateMapCoords = function(b, e) {
        return {
            x: e * half_tile_width_round + b * half_tile_width_round + dest_x,
            y: b * half_tile_height_round - e * half_tile_height_round + dest_y
        }
    };
    Mods.Newmap.FilterObj = function(b, e) {
        return b.filter(function(b) {
            return Object.keys(e).every(function(g) {
                return b[g] == e[g]
            })
        })
    };
    Mods.Newmap.MouseTranslate = function(b, e) {
        var f = width / wrapper.style.width.replace("px",
                ""),
            g = height / wrapper.style.height.replace("px", "");
        b = (b - (body_offset_x || 0)) * f - dest_x;
        e = (e - (body_offset_y || 0)) * g - dest_y;
        var g = 2 * b / tile_width,
            k = 2 * e / (1.18 * tile_height),
            f = Math.round((g + k) / 2) - 1,
            g = Math.round((g - k) / 2);
        return {
            i: f,
            j: g
        }
    };
    Mods.Newmap.MapCoords = function(b) {
        var e = getElem("mods_newmap_coords"),
            f = getElem("mods_newmap_popup");
        b.clientX = b.clientX || b.pageX || b.touches && b.touches[0].pageX;
        b.clientY = b.clientY || b.pageY || b.touches && b.touches[0].pageY;
        var g = translateMousePositionToScreenPosition(b.clientX,
                b.clientY),
            k = Mods.Newmap.MouseTranslate(1.15 * b.clientX, b.clientY),
            m = Math.round(k.i) - 9,
            k = Math.round(k.j) + 7; - 1 < m && -1 < k && 101 > m && 101 > k && (e.innerHTML = m + "/" + k);
        var m = !1,
            n;
        for (n in Mods.Newmap.HotSpots)
            if (5 > Math.abs(g.x - Mods.Newmap.HotSpots[n].x) && 5 > Math.abs(g.y - Mods.Newmap.HotSpots[n].y)) {
                f.style.top = b.clientY - 40 - (body_offset_y || 0) + "px";
                f.style.left = b.clientX + 10 - (body_offset_x || 0) + "px";
                f.innerHTML = Mods.Newmap.HotSpots[n].desc;
                m = !0;
                break
            }
        e.style.visibility = "";
        f.style.visibility = m ? "" : "hidden";
        if (!minimap ||
            Mods.Newmap.zonemapvisible) getElem("hud").removeEventListener("mousemove", Mods.Newmap.MapCoords, !1), e.style.visibility = "hidden", f.style.visibility = "hidden"
    };
    Mods.timestamp("newmap")
};
Load.newmarket = function() {
    modOptions.newmarket.time = timestamp();
    Handlebars.registerHelper("mod_quantity", function(b) {
        var e = "",
            f = market_results.filter(function(e) {
                return e.id == b
            });
        0 < f.length && (e = f[0].count, f = Mods.Newmarket.OwnedQuantity(f[0].item_id), e = _tmi("You own") + ": <span style='color:" + (f >= e ? "lightgreen" : 0 === f ? "red" : "yellow") + "'>" + f + "</span>");
        return e
    });
    Handlebars.registerHelper("select_states", function(b, e) {
        if (e == Mods.Newmarket.states[b]) return "selected='selected'"
    });
    Mods.Newmarket.market_announce_template =
        function() {
            "undefined" == typeof CompiledTemplate.market_announce_template && (CompiledTemplate.market_announce_template = Handlebars.compile("<div style='border: 1px solid #666; padding: 5px; margin-bottom: 5px; background-color: #111;'><span style='color: #FF0; font-weight: bold; padding-top: 3px; line-height: 20px;'>{{_tm 'Announces'}}: <span id='announce_queued_amount' style='color: #FFF;'>0</span></span><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;announce&apos;)' style='font-size: 0.7em; float: right; margin-bottom: 8px;'>{{_tm 'Announce'}}!</button><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;remove&apos;)' style='font-size: 0.7em; float: right;'>{{_t 'Cancel'}}</button><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;select&apos;)' style='font-size: 0.7em; float: right;'>{{_tm 'Select All'}}</button><button id='announce_expand' class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_announce(&apos;expand&apos;)' style='font-size: 0.7em; float: right;'>{{_tm 'Expand'}}</button><table id='announce_queued_list' class='table scrolling_allowed hidden' style='text-align: center; min-width: 100%; max-width: 100%'><tbody><tr><th style='text-align: left; padding-bottom: 5px;' colspan='2'>{{_tm 'Queued Item'}}</th><th>{{_t 'To'}}</th><th style='text-align: right; padding-right: 3px;'>{{_t 'Remove'}}</th></tr>{{#each results}}<tr style='padding-top: 2px;'><td style='padding-right: 2px;'>{{#if this.type}}<div style='color: #0F0; padding-bottom: 8px;'>[{{_t 'Buy'}}]</div>{{else}}<div style='color: #0F0; padding-bottom: 8px'>[{{_t 'Sell'}}]</div>{{/if}}</td><td style='text-align: left; padding-top: 2px'>{{this.text}}</td><td style='padding-top: 2px;'>{{#if this.to}}{{this.to}}{{else}}<span style='color: #F2A2F2;'>$$</span>{{/if}}</td><td style='padding-left: 8px;'><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_remove_announce({{this.id}})' style='font-size: 0.7em; float: right;'>{{_t 'Remove'}}</button></td></tr>{{/each}}</tbody></table></div>"));
            return CompiledTemplate.market_announce_template
        };
    Mods.Newmarket.transaction_announce = function(b) {
        if (b = "string" == typeof b ? b : !1) switch (b) {
            case "announce":
                b = getElem("announce_list");
                Mods.Newmarket.submitAnnouncement();
                Mods.Newmarket.announceList = {};
                addClass(b, "hidden");
                b.innerHTML = "&nbsp;";
                break;
            case "expand":
                b = getElem("announce_queued_list");
                var e = getElem("announce_expand");
                hasClass(b, "hidden") ? (removeClass(b, "hidden"), e.innerHTML = _tmi("Collapse")) : (addClass(b, "hidden"), e.innerHTML = _tmi("Expand"));
                break;
            case "select":
                var f = market_transaction_offers;
                b = 0;
                for (e in f) f[e].count && f[e].available && (Mods.Newmarket.gatherAnnounce(f[e].id), b++);
                e = hasClass(getElem("announce_queued_list"), "hidden");
                getElem("announce_list").innerHTML = Mods.Newmarket.market_announce_template()({
                    results: Mods.Newmarket.announceList
                });
                getElem("announce_queued_amount").innerHTML = b;
                null === e && removeClass(getElem("announce_queued_list"), "hidden");
                break;
            case "remove":
                b = getElem("announce_list"), Mods.Newmarket.announceList = {}, addClass(b,
                    "hidden"), b.innerHTML = "&nbsp;"
        }
    };
    Mods.Newmarket.transaction_remove_announce = function(b) {
        delete Mods.Newmarket.announceList[b];
        b = 0;
        for (var e in Mods.Newmarket.announceList) b++;
        0 < b ? (e = hasClass(getElem("announce_queued_list"), "hidden"), getElem("announce_list").innerHTML = Mods.Newmarket.market_announce_template()({
            results: Mods.Newmarket.announceList
        }), getElem("announce_queued_amount").innerHTML = b, null === e && removeClass(getElem("announce_queued_list"), "hidden")) : (getElem("announce_list").innerHTML = "&nbsp;",
            addClass(getElem("announce_list"), "hidden"))
    };
    Mods.Newmarket.offerFilter = function(b, e, f) {
        if (void 0 == item_base[b] || "number" != typeof parseInt(e) || 1 > e || "number" != typeof parseInt(f)) return "";
        var g = _tn(item_base[b].name);
        b = "{item:" + b + "}";
        var k = {};
        k.clientText = formatLargeNumber(e, 1) + " " + g + " " + _tm("for") + " " + formatLargeNumber(f, 1) + (1 < e ? " " + _tm("ea") : "");
        k.sendText = formatLargeNumber(e, 1) + " " + b + " for " + formatLargeNumber(f, 1) + (1 < e ? " ea" : "");
        return k
    };
    Mods.Newmarket.gatherAnnounce = function(b) {
        var e = !1,
            f = market_transaction_offers,
            g;
        for (g in f)
            if (f[g].id == b) {
                f = f[g];
                e = !0;
                break
            }
        if (e && 0 !== f.count && 0 !== f.available) {
            var e = f.id,
                k = f.to_player || !1,
                m = f.type,
                n = Mods.Newmarket.offerFilter(f.item_id, f.count, f.price),
                f = Mods.Newmarket.announceList;
            if (0 !== n.sendText.length) {
                f[b] = {
                    id: e,
                    to: k,
                    text: n.clientText,
                    name: n.sendText,
                    type: m
                };
                b = hasClass(getElem("announce_queued_list"), "hidden");
                getElem("announce_list").innerHTML = Mods.Newmarket.market_announce_template()({
                    results: Mods.Newmarket.announceList
                });
                removeClass(getElem("announce_list"), "hidden");
                null === b && removeClass(getElem("announce_queued_list"), "hidden");
                b = 0;
                for (g in f) b++;
                getElem("announce_queued_amount").innerHTML = b
            }
        }
    };
    Mods.Newmarket.clearAnnouncement = function() {
        var b = getElem("announce_list");
        Mods.Newmarket.announceList = {};
        addClass(b, "hidden");
        b.innerHTML = "&nbsp;";
        Mods.Newmarket.announces = {
            messages: [],
            count: 0
        }
    };
    Mods.Newmarket.submitAnnouncement = function() {
        var b, e, f, g, k, m, n, p, q, t, r;
        e = Mods.Newmarket.max_lines();
        b = Mods.Newmarket.announceList;
        f = Mods.Newmarket.announces.messages = [];
        g = "[BUY] ";
        k = "[SELL] ";
        m = {};
        var x = n = 0,
            y = /{item:([0-9]+?)}/;
        for (q in b) p = y.exec(b[q].name), null != p && item_base[p[1]] && "undefined" != item_base[p[1]].name && (x += item_base[p[1]].name.length - p[0].length), !1 !== b[q].to ? (p = 0 === b[q].type ? " [SELL] " : " [BUY] ", m[b[q].to] = m[b[q].to] || [], m[b[q].to].push(p + b[q].name)) : 1 == b[q].type ? 160 > b[q].name.length + g.length + x + 3 ? g += b[q].name + " | " : (f.push(g.slice(0, -3)), g = "[BUY] " + b[q].name + " | ", x = 0, n++) : 0 === b[q].type && (160 > b[q].name.length + k.length + x + 3 ? k += b[q].name + " | " : (f.push(k.slice(0, -3)), k = "[SELL] " + b[q].name + " | ", x = 0, n++));
        0 < g.length - 7 && (f.push(g.slice(0, -3)), x = 0, n++);
        0 < k.length - 7 && (f.push(k.slice(0, -3)), x = 0, n++);
        Mods.Newmarket.announces.count = n;
        b = "";
        for (t in m) {
            b = '/w "' + t + '" My offer:';
            for (r in m[t]) 160 > b.length + m[t][r].length + 6 ? b += m[t][r] + ", " : (b = capitaliseFirstLetter(b.slice(0, -2)) + " is up.", f.push(b), b = '/w "' + t + '" My offer:');
            b = capitaliseFirstLetter(b.slice(0, -2)) + " is up.";
            b.length > ('/w "' + t + '"').length && f.push(b)
        }
        0 !== f.length && (f.sort(function(b, e) {
            return /^\[BUY\]/.test(e) ||
                /^\/w/.test(b) ? 1 : /^\/w/.test(e) || /^\[BUY\]/.test(b) ? -1 : 0
        }), 0 < n ? Mods.Newmarket.allowTrade() ? (e = _tmi("This Announcement uses {count} line.", {
            count: n
        }) + " " + _tmi("You have {count} line available this hour. Post this Announcement?", {
            count: e - Mods.Newmarket.times.length
        }), Popup.prompt(e, Mods.Newmarket.submitAnnouncementCallback, Mods.Newmarket.clearAnnouncement)) : (e = 36E5 + Mods.Newmarket.times[0] - timestamp(), e = Math.ceil(Math.round(e / 6E4 * 10) / 10) + " " + _tm("minutes"), f = _tmi("You have used all announcement lines this hour."),
            f += _tmi("You must wait at least {delay} before you can submit another offer.", {
                delay: e
            }), Popup.dialog(f, null_function)) : Mods.Newmarket.submitAnnouncementCallback())
    };
    Mods.Newmarket.submitAnnouncementCallback = function() {
        var b = Mods.Newmarket.announces.messages,
            e, f = [!1, !1],
            g = 1;
        if (0 < b.length)
            for (e in b) {
                var k = -1 != b[e].indexOf("/w");
                if (!k && !0 !== Contacts.channels.$$) f[0] || (addChatText(_tm("You must be subscribed to [$$] to use the Announce feature. Go to: Filters - Channels - [$$] Subscribe."), void 0, COLOR.TEAL),
                    f[0] = !0);
                else if (k || Mods.Newmarket.allowTrade())(function(b) {
                    setTimeout(function() {
                        Socket.send("message", b)
                    }, 100 * g)
                })(k ? {
                    data: b[e]
                } : {
                    data: b[e],
                    lang: "$$"
                }), k || (Mods.Newmarket.times.push(timestamp()), localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times)), g++;
                else if (!f[1]) {
                    var k = 36E5 + Mods.Newmarket.times[0] - timestamp(),
                        k = Math.ceil(Math.round(k / 6E4 * 10) / 10) + " " + _tm("Minutes").toLowerCase(),
                        m = _tm("You have submitted {lines} or more offers within the last hour.", {
                            lines: Mods.Newmarket.max_lines()
                        }),
                        m = m + _tm("You must wait at least {delay} before you can submit another offer.", {
                            delay: k
                        });
                    addChatText(m, void 0, COLOR.TEAL);
                    f[1] = !0
                }
            }
        Mods.Newmarket.announceList = {}
    };
    Mods.Newmarket.allowTrade = function() {
        for (var b = Mods.Newmarket.max_lines(), e = Mods.Newmarket.times.length; Mods.Newmarket.times[0] + 36E5 < timestamp();) Mods.Newmarket.times.splice(0, 1);
        Mods.Newmarket.times.length != e && (localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times));
        return Mods.Newmarket.times.length >= b ? !1 : !0
    };
    Mods.Newmarket.transaction_click =
        function(b) {
            Mods.Newmarket.saveSelectValue();
            var e = getElem("market_drop_" + b).value;
            "delete" == e && Market.client_cancel_offer(b);
            "resubmit" == e && Market.client_extend_offer(b);
            "announce" == e && Mods.Newmarket.gatherAnnounce(b);
            "edit" == e && Mods.Newmarket.edit(b)
        };
    Mods.Newmarket.transaction_select = function() {
        var b = getElem("market_drop_default").value,
            e = market_transaction_offers,
            f;
        for (f in e) {
            var g = e[f].id,
                k = getElem("market_drop_" + g);
            "undefined" != typeof b && "number" == typeof g && ("delete" == b || "edit" == b ? k.value =
                b : 0 < parseInt(e[f].count) && (e[f].available && "announce" == b ? k.value = b : "resubmit" == b && (k.value = b)))
        }
        Mods.Newmarket.saveSelectValue()
    };
    Mods.Newmarket.saveSelectValue = function() {
        var b = market_transaction_offers,
            e = Mods.Newmarket.states = {},
            f;
        for (f in b) {
            var g = getElem("market_drop_" + b[f].id);
            g && g.value && (e[b[f].id] = g.value)
        }
        e["default"] = getElem("market_drop_default").value
    };
    Mods.Newmarket.OwnedQuantity = function(b) {
        return (b = Mods.findWithAttr(chest_content, "id", b)) && 0 < chest_content[b].count ? chest_content[b].count :
            0
    };
    Mods.Newmarket.MaxQuantity = function(b) {
        if (b) {
            var e = market_results.filter(function(e) {
                return e.id == b
            });
            if (0 < e.length) {
                var f = e[0].item_id,
                    g = e[0].count;
                0 === e[0].type ? getElem("market_offer_amount").value = g : (f = Mods.Newmarket.OwnedQuantity(f), getElem("market_offer_amount").value = f < g ? f : g);
                Market.client_update_total_cost(e[0].id)
            }
        } else getElem("market_new_offer_amount").value = getElem("market_new_offer_count").innerText, Market.client_new_offer_update_total_cost()
    };
    Mods.Newmarket.Tradetoggle = function() {
        var b =
            getElem("settings_tradechannel");
        switch (Mods.Newmarket.tradechatmode) {
            case 0:
                b.innerHTML = _tmi("Trade Chat") + ": " + _tmi("manual join");
                Mods.Newmarket.tradechatmode = 1;
                break;
            default:
                b.innerHTML = _tmi("Trade Chat") + ": " + _tmi("join automatically"), Mods.Newmarket.tradechatmode = 0
        }
        localStorage.tradechatmode = JSON.stringify(Mods.Newmarket.tradechatmode)
    };
    Mods.Newmarket.next = function() {
        getElem("market_search_results").scrollTop = 0;
        50 == market_results.length && ("0" == getElem("market_search_type").value ? (getElem("market_search_min_price").value =
            market_results[market_results.length - 1].price, getElem("market_search_max_price").value = "") : (getElem("market_search_min_price").value = "", getElem("market_search_max_price").value = market_results[market_results.length - 1].price), Market.client_search())
    };
    Mods.Newmarket.togglepopup = function() {
        Mods.Newmarket.popup = !Mods.Newmarket.popup;
        localStorage.marketpopup = JSON.stringify(Mods.Newmarket.popup)
    };
    Mods.Newmarket.equippedinslot = function(b) {
        var e = players[0].temp.inventory,
            f;
        for (f in e)
            if (!0 === e[f].selected &&
                item_base[e[f].id].params.slot == b) return e[f].id;
        return null
    };
    Mods.Newmarket.hidedetails = function(b) {
        if (b = getElem("market_offer_popup")) b.style.visibility = "hidden"
    };
    Mods.Newmarket.details = function(b) {
        if (!Mods.Newmarket.popup) {
            if (null === getElem("market_offer_popup")) {
                var e = document.createElement("div");
                e.className = "marketpopup menu";
                e.id = "market_offer_popup";
                e.style.opacity = "1";
                getElem("wrapper").appendChild(e)
            }
            var f = market_results.filter(function(e) {
                    return e.id == b
                }),
                e = getElem("market_offer_popup"),
                g = new Date(f[0].available_until) - new Date,
                g = g / 1E3,
                g = Math.floor(g / 3600) + _tmi("Hour", {
                    fn: "firstChar"
                }) + " " + Math.floor(g % 3600 / 60) + _tmi("Minute", {
                    fn: "firstChar"
                }),
                k = item_base[f[0].item_id],
                m = "<div style='" + Items.get_background_image(k.b_i) + "width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;float:left;'>&nbsp;</div>",
                m = m + "<table>";
            _tmi("Buying").toUpperCase();
            m += "<tr><td colspan=2>" + (0 === f[0].type ? "<span style='color:lightgreen'>[" + _tmi("You are") + " " + _tmi("Buying").toUpperCase() +
                "]" : "<span style='color:orange'>[" + _tmi("You are") + " " + _tmi("Selling").toUpperCase() + "]") + " <b>" + k.name + "</b></span></td></tr>";
            m += "<tr><td colspan=2 style='color:#3BEEEE'>" + Items.info(f[0].item_id) + "</td></tr>";
            if (1 == f[0].type) var n = Mods.findWithAttr(chest_content, "id", f[0].item_id),
                n = n && 0 < chest_content[n].count ? chest_content[n].count : 0,
                m = m + ("<tr><td style='color:#CCC'>" + _tmi("You own") + ":</td><td style='color:" + (0 < n ? "#00FF00'>" : "#FF0000'>") + n + "</td></tr>");
            else k.b_t != ITEM_CATEGORY.WEAPON && k.b_t !=
                ITEM_CATEGORY.ARMOR && k.b_t != ITEM_CATEGORY.JEWELRY && k.b_t != ITEM_CATEGORY.PET || !k.params.wearable || (n = Mods.Newmarket.equippedinslot(k.params.slot)) && (m += "<tr><td colspan=2 style='color:#F3A7BD'>" + Items.info(n) + "<br/>" + _tmi("Comparing") + ": " + item_base[n].name + "</td></tr>");
            m += "<tr><td style='color:#CCC'>" + _tmi("Dealer") + ":</td><td style='color:" + (Mods.findWithAttr(Contacts.friends, "name", f[0].player) ? "#FFFF00'>(" + _tmi("friend") + ") " : "'>") + f[0].player + "</td></tr>";
            m += "<tr><td style='color:#CCC'>" + _tmi("Expires in") +
                ":</td><td>" + g + "</td></tr><tr><td style='color:#CCC'>" + _tmi("Price", {
                    ns: "interface"
                }) + ":</td><td>" + thousandSeperate(f[0].price) + " " + _tmi("vs") + " " + thousandSeperate(k.params.price) + " (" + _tmi("wiki") + ") = " + Math.round(f[0].price / k.params.price * 100) + "%</td></tr>";
            m += "<tr><td style='color:#CCC'>" + _tmi("Quantity") + ":</td><td>" + f[0].count + " (" + _tmi("total") + " " + thousandSeperate(f[0].count * f[0].price) + " " + _tmi("coins") + ")</td></tr>";
            e.innerHTML = m + "</table>";
            f = getElem("market");
            e.style.position = "absolute";
            e.style.zIndex = "310";
            e.style.left = f.offsetLeft - 25 + "px";
            e.style.top = f.offsetTop - 25 + "px";
            e.style.visibility = ""
        }
    };
    Mods.Newmarket.edit = function(b) {
        var e = market_transaction_offers.filter(function(e) {
            return e.id == b
        });
        if (0 < e.length) {
            var f = e[0].type,
                g = e[0].item_id,
                k = null === e[0].to_player ? "" : e[0].to_player,
                m = e[0].price,
                n = e[0].count;
            Market.client_cancel_offer(b);
            setTimeout(function() {
                Market.open();
                Market.client_new_offer();
                getElem("market_new_offer_search_type").value = f;
                Market.client_update_new_offer_items();
                getElem("market_new_offer_items_item").value = g;
                Market.client_update_new_offer_item_change();
                getElem("market_offer_player").value = k;
                getElem("market_new_offer_price").value = m;
                getElem("market_new_offer_amount").value = n;
                Market.client_new_offer_update_total_cost()
            }, 1E3)
        }
    };
    Mods.Newmarket.eventListener = {
        keys: {
            keydown: [KEY_ACTION.SEND_CHAT]
        },
        fn: function(b, e, f) {
            "keydown" == b && GAME_STATE == GAME_STATES.CHAT && "$$" == getElem("current_channel").value && f == KEY_ACTION.SEND_CHAT && 0 < getElem("my_text").value.length && !/^\//.test(getElem("my_text").value) &&
                ((b = Player.has_lower_permissions(players[0].name), b || Mods.Newmarket.allowTrade()) ? b || (Mods.Newmarket.times.push(timestamp()), localStorage.announceBlock = JSON.stringify(Mods.Newmarket.times)) : (getElem("my_text").value = "", b = 36E5 + Mods.Newmarket.times[0] - timestamp(), b = Math.ceil(Math.round(b / 6E4 * 10) / 10) + " " + _tm("minutes"), addChatText(_tm("You have submitted {num} or more offers within the last hour. You must wait at least {time} before you can submit another offer.", {
                        num: Mods.Newmarket.max_lines(),
                        time: b
                    }),
                    void 0, COLOR.TEAL)))
        }
    };
    Mods.Newmarket.socketOn = {
        actions: ["market_transaction_offers", "login"],
        fn: function(b, e) {
            if ("market_transaction_offers" == b) {
                var f, g, k;
                hasClass(getElem("market"), "hidden") || Timers.set("confirm_submit", function() {
                    Mods.Newmarket.checkSubmit(!0);
                    Timers.clear("confirm_submit")
                }, 1E3);
                f = Mods.Newmarket.announceList;
                g = 0;
                for (k in f) g++;
                0 < g && (getElem("announce_list").innerHTML = Mods.Newmarket.market_announce_template()({
                        results: Mods.Newmarket.announceList
                    }), getElem("announce_queued_amount").innerHTML =
                    g, removeClass(getElem("announce_list"), "hidden"))
            }
        }
    };
    Mods.Newmarket.resubmit = function(b) {
        if (!(Timers.running("checkSubmit") || 0 < Mods.Newmarket.submitHolder.length)) {
            var e = market_transaction_offers.filter(function(e) {
                return e.id == b
            });
            if (0 < e.length) {
                Mods.Newmarket.submitHolder.push(e[0]);
                var f = market_transaction_offers.filter(function(b) {
                    return b.item_id == e[0].item_id && b.type == e[0].type && b.to_player == e[0].to_player && b.price == e[0].price && b.count == e[0].count
                });
                Mods.Newmarket.submitHolder[0].likeoff = f.length;
                Mods.Newmarket.submitHolder[0].timer = 0;
                Market.client_cancel_offer(b);
                Timers.clear("checkSubmit")
            }
        }
    };
    Mods.Newmarket.checkSubmit = function(b, e) {
        var f = Mods.Newmarket.submitHolder;
        if (0 === f.length || f[0] && void 0 == f[0].id || f[0] && 0 < f[0].timer) {
            var g = !0;
            if (f[0] && 0 < f[0].timer) {
                var k = market_transaction_offers.filter(function(b) {
                    return b.item_id == f[0].item_id && b.type == f[0].type && b.to_player == f[0].to_player && b.price == f[0].price && b.count == f[0].count
                });
                k.length >= f[0].likeoff && (g = !1)
            }
            if (g) {
                0 !== f.length && (Mods.consoleLog("resubmit failed: timeout"),
                    addChatText(_tm("Failed to resubmit"), void 0, COLOR.TEAL));
                Mods.Newmarket.submitQueued = !1;
                Timers.clear("checkSubmit");
                Mods.Newmarket.submitHolder = [];
                return
            }
        }
        b && (k = market_transaction_offers.filter(function(b) {
            return b.item_id == f[0].item_id && b.type == f[0].type && b.to_player == f[0].to_player && b.price == f[0].price && b.count == f[0].count
        }), g = k.length >= f[0].likeoff ? !0 : !1, k = market_transaction_offers.filter(function(b) {
            return b.id == f[0].id
        }), g && 0 === k.length ? (g = "" === f[0].to_player || null === f[0].to_player ? _tm("Your offer for {amount} {item} was resubmitted.", {
            amount: f[0].count,
            item: item_base[f[0].item_id].name
        }) : _tm("Your offer for {amount} {item} to {player} was resubmitted.", {
            amount: f[0].count,
            item: item_base[f[0].item_id].name,
            player: f[0].to_player
        }), addChatText(g, void 0, COLOR.TEAL), Mods.Newmarket.submitHolder = [], Mods.Newmarket.submitQueued = !1) : 0 < k.length ? (Mods.Newmarket.submitHolder = [], Mods.Newmarket.submitQueued = !1) : (g = chests[0].filter(function(b) {
            return b.id == f[0].item_id
        }), k = 0 < g.length ? parseInt(g[0].count) : 0, 0 < g.length && k >= f[0].count && (0 < Mods.Newmarket.submitHolder.length &&
            setTimeout(function() {
                var b = Mods.Newmarket.submitHolder;
                0 !== b.length && Socket.send("market_make_new_offer", {
                    type: b[0].type,
                    item_id: b[0].item_id,
                    to_player: null !== b[0].to_player ? b[0].to_player : "",
                    price: b[0].price,
                    count: b[0].count,
                    target_id: chest_npc.id
                })
            }, 100), Mods.Newmarket.submitHolder[0].timer += 1), f[0].id && Timers.set("resubmit", function() {
            Market.client_transactions()
        }, 2E3 * Mods.Newmarket.submitHolder[0].timer + 1500)))
    };
    Market.client_update_new_offer_item_change = function() {
        if (1 == getElem("market_new_offer_search_type").selectedIndex) {
            var b =
                document.getElementById("market_new_offer_items_item");
            b.options[b.selectedIndex].setAttribute("data-count", "50000")
        }
        Mods.Newmarket.old_client_update_new_offer_item_change()
    };
    Mods.Newmarket.max_lines = function() {
        return 2 + players[0].params.market_offers / 5 * 2
    };
    (function() {
        getElem("market").style.overflowY = "";
        getElem("market_search_results").style.overflowY = "auto";
        getElem("market_search_results").style.overflowX = "hidden";
        getElem("market_search_results").style.maxHeight = "230px";
        var b = getElem("market_search_max_price").parentElement;
        b.getElementsByClassName("market_select pointer")[0].onclick = function() {
            Market.client_search();
            getElem("market_search_results").scrollTop = 0
        };
        var e = document.createElement("span");
        e.style.verticalAlign = "middle";
        e.style.fontSize = "10px";
        e.innerHTML = "<input type='checkbox' id='chk_enable_mktpopup' onclick='Mods.Newmarket.togglepopup();'> " + _tmi("Popup");
        b.insertBefore(e, getElem("market_search_item").nextSibling);
        getElem("chk_enable_mktpopup").checked = !Mods.Newmarket.popup;
        e = document.createElement("span");
        e.innerHTML = "<button onclick='Mods.Newmarket.next();' class='market_select pointer'>" + _tmi("Next") + " &gt;&gt;</button>";
        b.appendChild(e);
        Mods.HandlebarsOverides.register("market_client_new_offer_template", "<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td>{{_t 'Type'}}</td><td><select id='market_new_offer_search_type' onchange='Market.client_update_new_offer_items();' class='market_select'><option value='0'>{{_t 'Sell'}}</option><option value='1'>{{_t 'Buy'}}</option></select></td></tr><tr class='offer_line even'><td style='width: 96px;'>{{_t 'Item'}}</td><td id='market_new_offer_items'></td></tr><tr class='offer_line'><td>{{_t 'To'}}</td><td><input type='text' class='market_select' placeholder='{{__t 'Everybody'}}' data-tp='Everybody' id='market_offer_player' list='player_datalist'/></td></tr><tr class='offer_line even'><td>{{_t 'Price'}}</td><td><input type='number' id='market_new_offer_price' onchange='Market.client_new_offer_update_total_cost();' class='market_select'/></td></tr><tr class='offer_line'><td>{{_tm 'Amount'}}</td><td><input id='market_new_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_new_offer_update_total_cost();'> {{_t 'of'}} <span id='market_new_offer_count'>0</span> <button onclick='javascript:Mods.Newmarket.MaxQuantity()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Max'}}</button></td></tr><tr class='offer_line even'><td>{{_t 'Total cost'}}</td><td><b id='market_new_offer_total_cost'>0</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_make_offer()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Make offer'}}</button></td></tr></tbody></table><span>* {{_t 'Each offer lasts 24 hours. You can have {amount} active offers.' amount='helper[market_offers]'}}{{#can_upgrade_market_offers}}<br/><button class='market_select pointer' onclick='Market.upgrade_offers_dialog();'>{{_t 'Upgrade'}}</button>{{/can_upgrade_market_offers}}</span><div style='position: absolute;bottom: 2px;right: 4px;'>{{_t 'You have'}} <span id='market_new_offer_player_coins'></span> {{_t 'coins'}}</div>", !0);
        Mods.HandlebarsOverides.register("market_client_search_results_template", "<table class='table scrolling_allowed' style='margin-bottom:10px;'><tbody class='scrolling_allowed'><tr class='scrolling_allowed'><th style='padding-right:5px;'>{{_t 'Item'}}</th><th>{{_t 'Count'}}</th><th style='padding-left:5px;'>{{_t 'Price'}}</th><th>{{_t 'User'}}</th></tr>{{#each results}}<tr class='{{this.classes}} scrolling_allowed {{#if this.to_player}}green{{/if}}' onclick='Market.client_open_offer({{this.id}})' onmouseenter='Mods.Newmarket.details({{this.id}})' onmouseleave='Mods.Newmarket.hidedetails()'>  <td item_id='{{this.item_id}}' class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td style='text-align:center;' class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{item_price this.price}}</td>  <td class='scrolling_allowed'>{{this.player}}</td></tr>{{/each}}</tbody></table>", !0);
        Mods.HandlebarsOverides.register("market_client_open_offer_template", "<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr class='offer_line'><td style='width: 96px;'>{{_t 'Item'}}</td><td><span style='vertical-align: bottom;margin-right: 4px;padding-bottom: -26px;line-height: 32px;'>{{item_name this.item_id}}</span><div style='{{item_image this.item_id}}width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div></td></tr><tr class='offer_line even'><td>{{_t 'Description'}}</td><td>{{item_stats this.item_id}}</td></tr><tr class='offer_line'><td>{{_t 'Vendor'}}</td><td>{{this.player}}</td></tr><tr class='offer_line even'><td>{{_t 'Price'}}</td><td>{{item_price this.price}}</td></tr><tr class='offer_line'><td>{{_t 'Count'}}</td><td><input id='market_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_update_total_cost({{this.id}});'> of {{this.count}} <button onclick='javascript:Mods.Newmarket.MaxQuantity({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Max'}}</button> {{#if this.type}}{{{mod_quantity this.id}}}{{/if}}</td></tr><tr class='offer_line even'><td>{{_t 'Total cost'}}</td><td><b id='market_total_cost'>{{item_price this.price}}</b></td></tr><tr class='offer_line'><td></td><td><button onclick='javascript:Market.client_accept_offer({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{#if this.type}}{{_t 'Sell'}}{{else}}{{_t 'Buy'}}{{/if}}</button></td></tr></tbody></table><div style='position: absolute;bottom: 2px;right: 4px;'>{{_t 'You have'}} <span id='market_offer_player_coins'></span> {{_t 'coins'}}</div>", !0);
        Mods.HandlebarsOverides.register("market_client_transaction_offers_template", "<div id='announce_list' class='hidden'>&nbsp;</div>{{_t 'Offers'}}<table class='table scrolling_allowed'><tbody><tr><th style='width:12%; text-align:center'>{{_t 'Type'}}</th><th style='width:15%; text-align:center;'>{{_t 'Item'}}</th><th style='width:4%'>#</th><th style='width:19%;'>{{_t 'Price'}}</th><th style='text-align:center; width:18%; padding-left:9px;'>{{_t 'To'}}</th><th style='width:21%; text-align:left; padding-left:9px; position:relative;'>{{_tm 'Select'}}<select id='market_drop_default' class='market_select scrolling allowed' style='width:70px; position:absolute; top:-68%; right:-51%; font-weight:bold;' onchange='Mods.Newmarket.transaction_select()'> <option class='scrolling_allowed' value='delete'{{select_states 'default' 'delete'}}>{{_t 'Delete'}}</option><option class='scrolling_allowed' value='resubmit'{{select_states 'default' 'resubmit'}}>{{_tm 'Resubmit'}}</option><option class='scrolling_allowed' value='announce'{{select_states 'default' 'announce'}}>{{_tm 'Announce'}}</option><option class='scrolling_allowed' value='edit'{{select_states 'default' 'edit'}}>{{_tm 'Edit'}}</option></select></th><th style='width:10%;'></th></tr>{{#each results}}<tr class='scrolling_allowed {{this.classes}} {{#if this.available}}green{{else}}red{{/if}}' {{#if this.available}}{{#if this.count}}{{else}}style='color:yellow'{{/if}}{{/if}}><td class='scrolling_allowed' style='vertical-align:middle; text-align:center;'>{{#if this.type}}{{_t 'Buy'}}{{else}}{{_t 'Sell'}}{{/if}}</td><td class='scrolling_allowed' style='vertical-align:middle; position:relative;'><div title='{{item_name this.item_id}}' item_id='{{this.item_id}}' style='{{item_image this.item_id}} width:32px; height:32px; display:inline-block; margin:0px; margin-left:14px; padding:0px; float:left; '></div></td><td class='scrolling_allowed' style='vertical-align:middle'>{{this.count}}</td><td class='scrolling_allowed' style='vertical-align:middle;'>{{item_price this.price}}</td><td class='scrolling_allowed' style='vertical-align:middle; text-align:left; padding-left:12px;'>{{#if this.to_player}}{{this.to_player}}{{else}}{{_t 'Everybody'}}{{/if}}</td><td class='scrolling_allowed' style='text-align:left; position:relative;'><select id='market_drop_{{this.id}}' class='market_select scrolling allowed' style='margin:0px; margin-left:9px; width:70px; position: absolute; top: 25%;'><option class='scrolling_allowed' value='delete'{{select_states this.id 'delete'}}>{{_t 'Delete'}}</option>{{#if this.count}}<option class='scrolling_allowed' value='resubmit'{{select_states this.id 'resubmit'}}>{{_tm 'Resubmit'}}</option>{{#if this.available}}<option class='scrolling_allowed' value='announce'{{select_states this.id 'announce'}}>{{_tm 'Announce'}}</option>{{/if}}{{/if}}<option class='scrolling_allowed' value='edit'{{select_states this.id 'edit'}}>{{_tm 'Edit'}}</option></select></td><td class='scrolling_allowed' style='text-align:center; position:relative'><button class='market_select pointer scrolling_allowed' onclick='Mods.Newmarket.transaction_click({{this.id}})' style='position: absolute; left: 6px; top: 25%;'>{{_tm 'Go'}}</button></td></tr>{{/each}}</tbody></table>", !0)
    })();
    Mods.timestamp("newmarket")
};
Load.farming = function() {
    modOptions.farming.time = timestamp();
    Mods.Farming.loadDivs = function() {
        null === getElem("mods_farming_holder") && (createElem("div", wrapper, {
            id: "mods_farming_holder",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_template()
        }), createElem("div", wrapper, {
            id: "mods_farming_options",
            className: "menu",
            style: "position: absolute; display: none; z-index: 999;",
            innerHTML: Mods.Farming.farming_queue_option_template(),
            onclick: "Mods.Farming.queueOptions();"
        }))
    };
    Mods.Farming.loadDivs();
    Mods.Farming.lastCtrlTime = 0;
    Mods.Farming.eventListener = {
        keys: {
            keyup: [KEY_ACTION.CTRL],
            keydown: [KEY_ACTION.CTRL, 32]
        },
        fn: function(b, e, f) {
            300 === players[0].map && players[0].name == players[0].params.island && ("keyup" === b && f === KEY_ACTION.CTRL && 50 > timestamp() - Mods.Farming.lastCtrlTime && Mods.Farming.ctrlHeld(!1), "keydown" === b && (f === KEY_ACTION.CTRL && (200 < timestamp() - Mods.Farming.lastCtrlTime ? Mods.Farming.ctrlHeld(!Mods.Farming.ctrlPressed) : Mods.Farming.ctrlHeld(!0), Mods.Farming.lastCtrlTime =
                timestamp()), 300 == players[0].map && 32 === e && GAME_STATE != GAME_STATES.CHAT && (!1 === Mods.Farming.queuePaused ? Mods.Farming.pauseQueue(!1, !1, !0) : Mods.Farming.pauseQueue(!1, !1, !1))))
        }
    };
    Mods.Farming.lastMove = 0;
    Mods.Farming.farmingActions = {
        332: {
            slot: 4,
            name: "Rake"
        },
        333: {
            slot: 3,
            name: "Seed"
        },
        water: {
            slot: 3,
            name: "Water"
        },
        revive: {
            slot: 3,
            name: "Revive"
        },
        harvest: {
            slot: 3,
            name: "Harvest"
        }
    };
    moveInPath = function(b) {
        if (!b.path || b.path && 0 === b.path.length) return !1;
        b.me && 300 == players[0].map && Mods.Farming.options.mods_farming_opt_stop &&
            (1 === Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) ? (players[0].path = [], selected = selected_object = {
                i: null,
                j: null
            }) : Mods.Farming.oldMoveInPath(b)
    };
    Mods.Farming.queueOptions = function(b) {
        if (!0 === b) {
            var e = getElem("mods_farming_options"),
                f = e.style.display;
            e.style.display = "none" == f ? "block" : "none"
        }
        var g = {
                mods_farming_opt_stop: !1,
                mods_farming_opt_save: !0,
                mods_farming_opt_equipped: !0
            },
            k = Mods.Farming.options,
            m;
        for (m in g) e = getElem(m), void 0 == k[m] ? (f = g[m], k[m] = f, e.checked = f) : !1 === b ? e.checked = k[m] : (f = e.checked,
            k[m] = f);
        localStorage.farming_options = JSON.stringify(k)
    };
    Mods.Farming.queueOptions(!1);
    Mods.Farming.findExtendedPath = function(b) {
        if ("object" === typeof b && void 0 !== b.i && void 0 !== b.j) b = map_increase, map_increase = 200, players[0].path = findPathFromTo(players[0], selected_object, players[0]), map_increase = b;
        else return []
    };
    Mods.Farming.ctrlHeld = function(b) {
        Mods.Farming.ctrlPressed = !0 === b ? !0 : !1;
        b = !0 === b ? 1 : !0;
        Mods.Farming.actionState();
        Mods.Farming.pauseQueue(null, !0, b)
    };
    Mods.Farming.setCanvasSize = function() {
        getElem("mods_farming_holder", {
            style: {
                display: 300 == players[0].map && players[0].name == players[0].params.island ? "block" : "none",
                left: 6 + ("block" == getElem("magic_slots").style.display || "block" == getElem("quiver").style.display || "" === getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em"
            }
        });
        getElem("mods_farming_queue").style.height = Math.round(120 * current_ratio_y) + "px";
        getElem("mods_farming_options", {
            style: {
                display: 300 != players[0].map || players[0].name != players[0].params.island ?
                    "none" : getElem("mods_farming_options").style.display,
                left: 18 + parseInt(getElem("mods_farming_holder").style.width.replace("px", "")) + ("block" == getElem("magic_slots").style.display || "block" == getElem("quiver").style.display || "" === getElem("magic_slots").style.left ? 38 : 0) + "px",
                top: Math.ceil(105 * current_ratio_y) + "px",
                width: "145px",
                fontSize: ".7em",
                height: ""
            }
        });
        300 != players[0].map && Mods.Farming.cancelQueue()
    };
    Mods.Farming.onMapChange = function(b) {
        getElem("mods_farming_holder").style.display = 300 == b ? "block" : "none"
    };
    Mods.Farming.hideQueue = function(b, e) {
        var f = getElem("mods_farming_queue"),
            g = b || getElem("mods_farming_opt_hide");
        Mods.Farming.queueHidden || e ? (Mods.Farming.queueHidden = !1, f.style.display = "", g.innerHTML = "Hide queued window") : (Mods.Farming.queueHidden = !0, f.style.display = "none", g.innerHTML = "Show queued window")
    };
    Mods.Farming.actionState = function() {
        var b;
        b = Mods.Farming.ctrlPressed || 1 === Mods.Farming.queuePaused ? "Queuing" : !0 === Mods.Farming.queuePaused ? "Paused" : "Active";
        getElem("mods_farming_action").innerHTML =
            b
    };
    Mods.Farming.pauseQueue = function(b, e, f) {
        e ? Mods.Farming.ctrlPressed || Timers.set("farm_check", function(b) {
            Mods.Farming.checkQueue(0, b)
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : Mods.Farming.ctrlPressed && Mods.Farming.ctrlHeld(!1);
        b = {
            "true": "1",
            1: "false",
            "false": "true"
        };
        Mods.Farming.queuePaused = void 0 !== b[f] ? JSON.parse(b[f]) : Mods.Farming.queuePaused;
        f = getElem("farming_queue_button");
        !0 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !1, Timers.set("farm_check", function(b) {
            Mods.Farming.checkQueue(0,
                b)
        }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 100)), f.innerHTML = "(queue)") : 1 === Mods.Farming.queuePaused ? (Mods.Farming.queuePaused = !0, f.innerHTML = "(resume)") : (Mods.Farming.queuePaused = 1, f.innerHTML = "(pause)", players[0].path = []);
        Mods.Farming.actionState()
    };
    Mods.Farming.addToQueue = function(b) {
        if (players[0].params.island !== players[0].name) Mods.Farming.pauseQueue(!1, !1, !0);
        else if ("object" == typeof b && void 0 != b.id) {
            var e = Mods.Farming.queue,
                f = b.b_i,
                g = b.id,
                k = b.name,
                m = b.i + "_" + b.j + "_" +
                f,
                n = 333 == f || 332 == f ? 1E3 : 2E3,
                p = Mods.Farming.canPerform(g, !1);
            p.action && Mods.Farming.farmingActions[p.action] && (e[m] = {
                id: m,
                obj_id: g,
                item_id: f,
                i: b.i,
                j: b.j,
                delay: n,
                action: p.action
            }, Mods.Farming.sortedQueue.push(m), getElem("mods_farming_queue").innerHTML += Mods.Farming.farming_queue_action_template({
                slot: m,
                action: capitaliseFirstLetter(_tm(Mods.Farming.farmingActions[p.action].name)),
                object: k,
                i: b.i,
                j: b.j
            }), (1 == Mods.Farming.sortedQueue.length || !Timers.running("farm_queue") || 5E3 < timer_holder.farm_queue || 0 ===
                players[0].path.length) && Timers.set("farm_queue", function(b) {
                Mods.Farming.performQueue(0, Mods.Farming.sortedQueue[0])
            }, Math.max(players[0].temp.animate_until - timestamp(), 50)), getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length)
        }
    };
    Mods.Farming.canPerform = function(b, e) {
        if ((null !== e ? e : 1) && 0 === Mods.Farming.sortedQueue.length) return !1;
        var f = objects_data[b];
        if (void 0 == f) return !1;
        var g = f.b_i,
            k = !1;
        if (Mods.Farming.farmingActions[g] && 753 == object_base[g].params.carpentry_item_id) {
            var f = players[0].temp.inventory,
                m;
            for (m in f)
                if (f[m].selected && item_base[f[m].id]) {
                    var n = !1;
                    switch (g) {
                        case 332:
                            if (-1 < item_base[f[m].id].name.indexOf(Mods.Farming.farmingActions[g].name) || -1 < item_base[f[m].id].name.indexOf("Multi-tool")) n = !0;
                            break;
                        case 333:
                            Mods.Farming.isSeed(f[m].id) && (n = !0)
                    }
                    if (n) {
                        k = {
                            status: !0,
                            action: g
                        };
                        break
                    }
                }
            k || !1 !== Mods.Farming.options.mods_farming_opt_equipped || (k = {
                status: 1,
                action: g
            })
        } else object_base[g].params.duration && (g = Farming.plant_ripe(f), m = Farming.plant_rotten(f), f = Inventory.get_watering_can_id(players[0]),
            Inventory.has_equipped(players[0], 2807), g ? k = m && f ? 0 < players[0].temp.water ? {
                status: !0,
                action: "revive"
            } : {
                status: 1,
                action: "revive"
            } : 40 > players[0].temp.inventory.length ? {
                status: !0,
                action: "harvest"
            } : {
                status: 1,
                action: "harvest"
            } : !m && f && (k = 0 < players[0].temp.water ? {
                status: !0,
                action: "water"
            } : {
                status: 1,
                action: "water"
            }));
        return k
    };
    Mods.Farming.performQueue = function(b, e) {
        if (players[0].params.island === players[0].name) {
            300 != players[0].map && Mods.Farming.pauseQueue(!1, !1, !0);
            e = "string" == typeof e ? e : Mods.Farming.sortedQueue[0] ||
                null;
            var f = Mods.Farming.sortedQueue,
                g = Mods.Farming.queue,
                k = g[f[0]];
            if (!Mods.Farming.ctrlPressed && !Mods.Farming.queuePaused)
                if (f["number" == typeof b ? b : 0] != e) Mods.Farming.checkQueue(0, f[0]);
                else {
                    var f = Mods.Farming.canPerform(k.obj_id),
                        m = "boolean" != typeof f ? f.status : f;
                    "object" == typeof f && "water" == g[e].action && "harvest" == f.action && (g[e].action = "harvest");
                    void 0 == k || !0 !== m ? Mods.Farming.pauseQueue(!1, !1, !0) : (g = objects_data[k.obj_id], void 0 != g && g.i == k.i && g.j == k.j && (selected = selected_object = g, Mods.Farming.findExtendedPath(selected_object),
                        0 === players[0].path.length && ActionMenu.act(0), k = k.delay + Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 200), 0 < players[0].path.length && moveInPath(players[0]), Timers.set("farm_check", function(b, e) {
                            Mods.Farming.checkQueue(0, b)
                        }, k)))
                }
        }
    };
    Mods.Farming.checkQueue = function(b, e) {
        if (players[0].params.island === players[0].name)
            if (100 > timestamp() - Mods.Farming.lastMove || players[0].temp.busy || 0 < players[0].path.length || captcha) Timers.set("farm_check", function() {
                Mods.Farming.checkQueue()
            }, 100);
            else {
                Mods.Farming.lastMove =
                    timestamp();
                b = "number" == typeof b ? b : 0;
                e = "string" == typeof e ? e : Mods.Farming.sortedQueue[0] || null;
                var f = Mods.Farming.sortedQueue,
                    g = Mods.Farming.queue[f[b]],
                    k = void 0 !== g ? g.obj_id : null;
                0 === f.length ? Mods.Farming.cancelQueue() : void 0 == g ? Mods.Farming.deleteFromQueue(b) : "number" != typeof b || "string" != typeof e ? Timers.set("farm_check", function(b) {
                    Mods.Farming.checkQueue(0, b)
                }, Math.min(Math.max(players[0].temp.animate_until - timestamp(), 50), 500)) : (g = obj_g(on_map[300][g.i][g.j]), k != g.id ? Mods.Farming.deleteFromQueue(b, !0) : inDistance(players[0].i, players[0].j, g.i, g.j) ? (f = Mods.Farming.canPerform(k), void 0 == k || "object" !== typeof f || !0 !== f.status ? Mods.Farming.pauseQueue(!1, !1, !0) : (selected_object = g, ActionMenu.act(0), Mods.Farming.deleteFromQueue(b, !0))) : f[b] == e ? Mods.Farming.performQueue(b, e) : 0 < f.length && !Timers.running("farm_queue") && Mods.Farming.performQueue(0, f[0]))
            }
    };
    Mods.Farming.deleteFromQueue = function(b, e) {
        e = e || !1;
        var f = Mods.Farming.queue[Mods.Farming.sortedQueue[b]],
            g = void 0 !== f ? f.obj_id : null,
            f = obj_g(on_map[300][f.i][f.j]);
        0 < Mods.Farming.sortedQueue.length && b < Mods.Farming.sortedQueue.length && !Mods.Farming.queuePaused && !Mods.Farming.ctrlPressed && f.id != g && (g = Mods.Farming.sortedQueue[b], delete Mods.Farming.queue[g], Mods.Farming.sortedQueue.splice(b, 1), null !== getElem("mods_farming_" + g) && getElem("mods_farming_queue").removeChild(getElem("mods_farming_" + g)), e && Mods.Farming.checkQueue(b, Mods.Farming.sortedQueue[b]), Timers.set("farming_queue_active", function() {
                Mods.Farming.checkQueue(0)
            }, 2500), getElem("mods_farming_total").innerHTML =
            Mods.Farming.sortedQueue.length)
    };
    Mods.Farming.cancelQueue = function() {
        Timers.clear("farm_check");
        Timers.clear("farm_queue");
        Mods.Farming.queue = {};
        Mods.Farming.sortedQueue = [];
        getElem("mods_farming_queue").innerHTML = "<span style='width: 100%; float: left; display: inline-block; font-weight: bold; color: #999;'><span>Action:&nbsp;&nbsp;Object</span><span style='float: right;'>Coords</span></span>";
        getElem("mods_farming_total").innerHTML = Mods.Farming.sortedQueue.length
    };
    DEFAULT_FUNCTIONS.rake = function(b,
        e) {
        Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.rake(b, e), Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b), 0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]))
    };
    DEFAULT_FUNCTIONS.seed = function(b, e) {
        Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.seed(b, e), Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b), 0 < players[0].path.length && !players[0].temp.busy &&
            moveInPath(players[0]))
    };
    DEFAULT_FUNCTIONS.harvest = function(b, e) {
        var f = Inventory.get_watering_can_id(players[0]);
        f && 0 === players[0].temp.water && 2807 != f ? Mods.Farming.pauseQueue(!1, !1, !0) : Mods.Farming.performActivity(b) ? (Mods.Farming.oldDefault.harvest(b, e), Timers.set("farming_queue_active", function() {
            Mods.Farming.checkQueue(0)
        }, 100)) : (Mods.Farming.findExtendedPath(b), 0 < players[0].path.length && !players[0].temp.busy && moveInPath(players[0]))
    };
    Mods.Farming.performActivity = function(b) {
        if (300 == players[0].map) {
            var e =
                obj_g(b);
            if (!building_mode_enabled && (!0 !== Mods.Farming.queuePaused || Mods.Farming.ctrlPressed) && e.id && e.params && (void 0 !== e.params.rotate || 753 == e.params.carpentry_item_id))
                if (void 0 == Mods.Farming.queue[e.i + "_" + e.j + "_" + e.b_i] && Mods.Farming.addToQueue(e), !Mods.Farming.ctrlPressed && 1 !== Mods.Farming.queuePaused && 0 < Mods.Farming.sortedQueue.length) {
                    b = Mods.Farming.queue[Mods.Farming.sortedQueue[0]];
                    b = obj_g(on_map[300][b.i][b.j]);
                    if (e.id == selected_object.id) return !0;
                    b && (selected = selected_object = b);
                    "object" ==
                    typeof selected_object && selected_object.activities && selected_object.activities[0] && 0 < selected_object.activities[0].length && ActionMenu.act(0);
                    if (b.id != e.id) return !1
                } else return !1;
            else if (!(e && e.id && e.params) || void 0 === e.params.rotate && 753 != e.params.carpentry_item_id) return !1
        }
        return !0
    };
    Mods.Farming.inventoryEquip = function(b, e, f) {
        779 == e && 300 == players[0].map && (selected = selected_object = obj_g(on_map[300][9][10]), Mods.Farming.findExtendedPath(selected), 0 < players[0].path.length ? moveInPath(players[0]) : ActionMenu.act(0));
        return !1
    };
    Mods.Farming.isSeed = function(b) {
        return -1 < item_base[b].name.indexOf("Seed") || "Bag of Worms" == item_base[b].name ? !0 : !1
    };
    Mods.timestamp("farming")
};
Load.gearmd = function() {
    modOptions.gearmd.time = timestamp();
    Mods.Gearmd = {};
    Gearmd = Mods.Gearmd;
    Gearmd.temp = function() {
        clearGear = function() {
            null !== getElem("gear_inv_holder") && document.body.removeChild(getElem("gear_inv_holder"))
        };
        clearGear();
        createElem("div", wrapper, {
            id: "gear_inv_holder",
            className: "menu",
            title: _tm("Click and drag to move this window"),
            onmousedown: function(b) {
                b = b || window.event;
                this.coordinates = {
                    dx: (parseInt(this.style.left) || 0) - b.clientX,
                    dy: (parseInt(this.style.top) || 0) - b.clientY
                };
                this.canMove = !0
            },
            onmousemove: function(b) {
                b = b || window.event;
                this.canMove && "mods_wiki_name" != b.target.id && (this.style.left = Math.min(parseInt(wrapper.style.width) - 100, Math.max(-100, b.clientX + this.coordinates.dx)) + "px", this.style.top = Math.min(parseInt(wrapper.style.height) - 80, Math.max(-80, b.clientY + this.coordinates.dy)) + "px")
            },
            onmouseup: function(b) {
                this.canMove = !1
            },
            style: "position: absolute; top: 100px; width: 190px; left: 45px; float: left; z-index: 999; display: none;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_set",
            style: "position: relative; float: left; width: 108px; height: 100%; display: inline-block;"
        });
        createElem("div", "gear_inv_holder", {
            id: "gear_inv_stats",
            style: "position: relative; float: right; width: 70px; padding: 0px 8px 0px 4px; font-size: 10px;"
        });
        createElem("div", "gear_inv_set", {
            style: "position: relative; float: left; width: 100%; height: 20%; display: inline-block; padding: 0px 4px 4px; font-size: 10px;",
            innerHTML: "<span id='gear_inv_equipped' class='link pointer' style='font-weight: bold' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.toggleEquipped(); Gearmd.updateEquipped();'>" +
                _tmi("Equipped") + "</span><div class='link pointer' style='float: right; font-size: 10px; margin-right: 8px; font-weight: bold; display: block;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.hideStats(this);'></div>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_stats_holder",
            style: "position: relative; width: 100%; display: inline-block; padding: 0px 4px 4px;",
            innerHTML: "<span style='color: yellow; padding-bottom: 4px; width: 100%; display: inline-block;'>Bonuses<span class='link pointer' style='float: right; font-weight: bold; color: #FFF;' onmouseover='javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout='javascript: this.style.color=&apos;#FFF&apos;' onclick='javascript: Gearmd.showEquipment(getElem(&apos;inv_name&apos;).childNodes[0]);'>" +
                _tmi("Close", {
                    ns: "interface"
                }) + "</span></span>"
        });
        createElem("div", "gear_inv_stats", {
            id: "gear_canvas_holder",
            style: "position: relative; float: left; bottom: 4px; right: -7px; width: 66px; height: 66px; background-color: #222;"
        });
        createElem("canvas", "gear_canvas_holder", {
            id: "gear_inv_canvas",
            width: "64px",
            height: "64px",
            style: "border: 1px solid #666;width: 64px;height: 64px;"
        });
        var b = ["Aim", "Power", "Armor", "Magic", "Speed"],
            e;
        for (e in b) {
            var f = b[e],
                g = _tmi(f, {
                    ns: "interface"
                }),
                f = "gear_stats_" + f.toLowerCase();
            createElem("span", "gear_stats_holder", {
                style: "color: #FFF; display: block; width: 100%; padding-bottom: 4px; font-size: 10px;",
                innerHTML: g + "<span id = '" + f + "' style = 'color: #3BEEEE; font-size: 10px; float: right;'> 0 </span>"
            })
        }
        b = "neck helm cape shield chest weapon ring legs gloves pet boots pop".split(" ");
        for (e in b) createElem("div", "gear_inv_set", {
            id: "gear_inv_" + b[e],
            className: "inv_item",
            style: "position: relative; width: 32px; height: 32px; margin: 1px; padding: 0px; border: solid 1px #666666; display: inline-block; font-size: 10px; color: #FFF; text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000; letter-spacing: 1px; text-align: center; background-color: #222;",
            onmouseover: "javascript: this.style.borderColor='#3BEEEE'; this.innerHTML='" + capitaliseFirstLetter(b[e]) + "'",
            onmouseout: "javascript: this.style.borderColor='#666'; this.innerHTML='&nbsp;'",
            onclick: "javascript: Gearmd.changeTryOn(false, false, this);",
            title: capitaliseFirstLetter(b[e]),
            innerHTML: "&nbsp;"
        });
        e = localStorage.tryGear;
        e = "string" == typeof e ? JSON.parse(e) : {
            head: players[0].params.d_head,
            facial_hair: players[0].params.d_facial_hair,
            body: players[0].params.d_body,
            pants: players[0].params.d_pants,
            cape: !1,
            left_hand: !1,
            right_hand: !1,
            shield: !1,
            helmet: !1,
            boots: !1,
            weapon: !1,
            hands: !1
        };
        Gearmd.tryGear = e;
        e = localStorage.showGear;
        e = "string" == typeof e ? JSON.parse(e) : {
            0: !1,
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1,
            8: !1,
            9: !1,
            10: !1,
            11: !1,
            12: !1,
            14: !1
        };
        Gearmd.showGear = e;
        Gearmd.equipped = !0;
        Gearmd.tryEmptyReplace = !1;
        getElem("gear_inv_equipped").setAttribute("title", "Click here to toggle between currently equipped items and your Vanity Set.\nUse the Wiki and search under Items to (Try On) items in your Vanity Set.")
    };
    getElem("inventory").addEventListener("mouseup", function(b) {
        Timers.set("update_equipped", function() {
            Mods.Gearmd.updateEquipped()
        }, 1E3)
    });
    Gearmd.toggleEquipped = function(b) {
        b = "boolean" === typeof b ? b : 0;
        var e = getElem("gear_inv_equipped");
        Gearmd.equipped && 0 === b || !1 === b ? (Gearmd.equipped = !1, e.innerHTML = _tmi("Vanity Set")) : Gearmd.equipped && !0 !== b || (Gearmd.equipped = !0, e.innerHTML = _tmi("Equipped"))
    };
    Gearmd.hideStats = function(b) {
        var e = getElem("gear_inv_stats"),
            f = e.style.display,
            g = getElem("gear_inv_holder");
        "" ===
        f || void 0 == f || null === f ? (e.style.display = " none ", b.innerHTML = " >> ", g.style.width = " 108px ") : (e.style.display = " ", b.innerHTML = " << ", g.style.width = " 190px ")
    };
    Gearmd.showEquipment = function(b, e) {
        var f = getElem("gear_inv_holder");
        b = b || getElem("inv_name").childNodes[0];
        "" != f.style.display || e ? (b.innerHTML = _tmi("Hide Equipment"), f.style.display = "") : (b.innerHTML = _tmi("Show Equipment"), f.style.display = "None");
        Gearmd.updateEquipped()
    };
    Gearmd.getPlayerOutfit = function(b) {
        var e = {},
            f;
        for (f in Gearmd.tryGear) e[f] =
            players[0].params["d_" + f] ? players[0].params["d_" + f] : !Gearmd.equipped || 0 < Gearmd && ("boolean" === typeof Gearmd.tryGear[f] || "head" === f || "facial_hair" === f || "body" === f || "pants" === f) ? Gearmd.tryGear[f] : 0;
        for (var g in e) {
            if (0 < Gearmd.tryGear[g] && !b) {
                var k = item_base[Gearmd.tryGear[g]];
                k.params && "object" === typeof k.params.visible && "undefined" != typeof k.params.visible[g] && (e[g] = k.params.visible[g], "undefined" != typeof k.params.visible.left_hand && (e.left_hand = k.params.visible.left_hand), "undefined" != typeof k.params.visible.right_hand &&
                    (e.right_hand = k.params.visible.right_hand))
            } else if (!0 === e[g] || b || Gearmd.tryEmptyReplace)
                for (f = 0; f < players[0].temp.inventory.length; f++) item = players[0].temp.inventory[f], item.selected && (k = item_base[item.id], k.params && "object" == typeof k.params.visible && "undefined" != typeof k.params.visible[g] && (e[g] = k.params.visible[g]));
            0 < e[g] || (e[g] = 0)
        }
        return e.head + " " + e.facial_hair + " " + e.body + " " + e.pants + " " + e.cape + " " + e.left_hand + " " + e.right_hand + " " + e.shield + " " + e.weapon + " " + e.helmet + " " + e.boots + " " + e.hands
    };
    Gearmd.displayPlayer = function(b) {
        b = getElem("gear_inv_canvas").getContext("2d");
        Draw.clear(b);
        b.drawImage(getBodyImg(Gearmd.getPlayerOutfit(Gearmd.equipped)), 0, 0, 64, 54, 5, 10, 64, 54)
    };
    void 0 == Gearmd.oldShowInventory && (Gearmd.oldShowInventory = BigMenu.show_inventory);
    BigMenu.show_inventory = function() {};
    getElem("inv_name").innerHTML = "<div class = 'link pointer' style = 'font-size: 10px; font-weight: bold; padding-top: 2px; color: #999;' onmouseover = 'javascript: this.style.color=&apos;#3BEEEE&apos;' onmouseout = 'javascript: this.style.color=&apos;#999&apos;' onclick = 'javascript: Gearmd.showEquipment(this);' > " +
        _tmi("Show Equipment") + " </div>";
    getElem("inv_name").setAttribute("title", _tm("Open the gear menu from here."));
    Mods.Gearmd.inventoryClick = function(b) {
        Gearmd.updateEquipped()
    };
    Gearmd.showEquipped = function(b) {
        return b ? !0 : Gearmd.equipped
    };
    Gearmd.updateEquipped = function() {
        var b = Gearmd.equipped,
            e = {
                0: "helm",
                1: "cape",
                2: "chest",
                3: "shield",
                4: "weapon",
                5: "gloves",
                6: "boots",
                7: "neck",
                8: "ring",
                11: "legs",
                12: "pet",
                14: "pop"
            },
            f;
        for (f in e) {
            var g = getElem("gear_inv_" + e[f]);
            null !== g && (g.style.background = "#333 ", g.setAttribute("item_id",
                "false"))
        }
        if (b) {
            f = 0;
            for (var k = players[0].temp.inventory.length; f < k; f++) {
                var m = players[0].temp.inventory[f];
                m.selected && (g = item_base[m.id], m = g.params.slot, e[m] && (m = getElem("gear_inv_" + e[m]), m.style.background = Items.get_background(g.b_i).replace("transparent", "#333"), m.setAttribute("item_id", g.b_i)))
            }
        } else
            for (f in e)
                if (m = Gearmd.showGear[f], !1 !== m) {
                    if (!0 === m)
                        for (k in players[0].temp.inventory)
                            if (g = players[0].temp.inventory[k], g.selected && item_base[g.id].params.slot == f) {
                                m = g.id;
                                break
                            }
                    if (item_base[m] ||
                        m.id && item_base[m.id]) g = m.id ? item_base[m.id] : item_base[m], m = f, m = getElem("gear_inv_" + e[m]), m.style.background = Items.get_background(g.b_i).replace("transparent", "#333"), m.setAttribute("item_id", g.b_i)
                }
        Gearmd.updateStats(b);
        Gearmd.displayPlayer(b)
    };
    Gearmd.updateStats = function(b) {
        var e = {
            aim: 0,
            power: 0,
            armor: 0,
            magic: 0,
            speed: 0
        };
        if (b)
            for (var f = 0; f < players[0].temp.inventory.length; f++) {
                if (b = players[0].temp.inventory[f], b.selected) {
                    b = item_base[b.id];
                    for (var g in e) void 0 !== b.params[g] && (e[g] += b.params[g])
                }
            } else
                for (f in Mods.Gearmd.showGear)
                    if (b =
                        Mods.Gearmd.showGear[f], 0 < b)
                        for (g in b = item_base[b], e) void 0 !== b.params[g] && (e[g] += b.params[g]);
        for (g in e) getElem("gear_stats_" + g).innerHTML = e[g];
        60 < e.speed && (getElem("gear_stats_speed").innerHTML = e.speed + "(60)")
    };
    Gearmd.changeTryOn = function(b, e, f) {
        var g = {
                0: "helm",
                1: "cape",
                2: "chest",
                3: "shield",
                4: "weapon",
                5: "gloves",
                6: "boots",
                7: "neck",
                8: "ring",
                11: "legs",
                12: "pet",
                14: "pop"
            },
            k = {
                helm: "helmet",
                gloves: "hands",
                pop: "right_hand",
                chest: "body",
                legs: "pants"
            };
        if (e && (void 0 == item_base[e] || void 0 == item_base[e].params.slot ||
                void 0 == g[item_base[e].params.slot]) || e && 0 != item_base[e].b_t && 2 != item_base[e].b_t && 4 != item_base[e].b_t && 5 != item_base[e].b_t && 7 != item_base[e].b_t && 9 != item_base[e].b_t) return !1;
        if (b) {
            if (f = item_base[e], b = f.params.slot, void 0 !== b && void 0 !== g[b]) {
                Gearmd.showGear[b] = e;
                k[g[b]] ? Gearmd.tryGear[k[g[b]]] = e : Gearmd.tryGear[g[b]] = e;
                if ("undefined" !== typeof f.params.disable_slot) {
                    var m = f.params.disable_slot;
                    Gearmd.showGear[m] = !1;
                    k[g[m]] ? Gearmd.tryGear[k[g[m]]] = !1 : Gearmd.tryGear[g[m]] = !1
                }
                for (var n in Gearmd.showGear) f =
                    Gearmd.showGear[n], 0 < f && "undefined" != typeof item_base[f].params && (m = item_base[f].params.slot, item_base[f].params.disable_slot === b && (Gearmd.showGear[m] = !1, k[g[m]] ? Gearmd.tryGear[k[g[m]]] = !1 : Gearmd.tryGear[g[m]] = !1))
            }
        } else if (Gearmd.equipped) {
            b = f;
            b = b.id || b;
            b = b.replace("gear_inv_", "");
            for (m in g)
                if (g[m] == b) {
                    b = m;
                    break
                }
            if (0 <= b)
                for (m = 0; m < players[0].temp.inventory.length; m++)
                    if (f = players[0].temp.inventory[m], f.selected && (f = item_base[f.id], f.params.slot == b)) {
                        left_click_cancel = !1;
                        inventoryClick(m);
                        break
                    }
        } else {
            b =
                f;
            b = b.id || b;
            b = b.replace("gear_inv_", "");
            for (m in g)
                if (g[m] == b) {
                    b = m;
                    break
                }
            Gearmd.showGear[b] = !1;
            k[g[b]] ? Gearmd.tryGear[k[g[b]]] = !1 : Gearmd.tryGear[g[b]] = !1
        }
        localStorage.tryGear = JSON.stringify(Gearmd.tryGear);
        localStorage.showGear = JSON.stringify(Gearmd.showGear);
        Gearmd.updateEquipped();
        e && Gearmd.toggleEquipped(!1);
        e && Gearmd.showEquipment(!1, !0)
    };
    Gearmd.temp();
    Gearmd.updateEquipped();
    Mods.timestamp("gearmd")
};
Mods.elemClass = function(b, e, f) {
    if ("object" === typeof f) {
        if ("undefined" === typeof f.className) return !1
    } else if ("undefined" != typeof e) {
        if (f = getElem(e), "object" !== typeof f || "undefined" === typeof f.className) return !1
    } else return !1;
    addClass(f, b);
    for (var g in f.childNodes) "object" === typeof f.childNodes[g] && Mods.elemClass(b, null, f.childNodes[g])
};
Mods.confirmClass = function(b, e, f) {
    if ("object" === typeof f) {
        if ("undefined" === typeof f.className) return !1
    } else if ("undefined" != typeof e) {
        if (ClassValue = 0, f = getElem(e), "object" !== typeof f || "undefined" === typeof f.className) return !1
    } else return !1;
    !hasClass(f, b) && ClassValue++;
    for (var g in f.childNodes) "object" === typeof f.childNodes[g] && Mods.confirmClass(b, null, f.childNodes[g])
};
Mods.initialize();
Mods.loadModOptions();
Mods.elemClass("scrolling_allowed", "mods_form");
Mods.initializeOptionsMenu();
getElem("mods_link").innerHTML = _tmi("wiki", {
    fn: "capitaliseFirstLetter"
}) + " &amp; " + _tmi("mods menu", {
    fn: "capitaliseFirstLetter"
});
getElem("mods_link").setAttribute("onclick", " javascript : removeClass(getElem( 'mods_form'),'hidden'); BigMenu.show(-1);");
getElem("mods_link").style.display = "";
quiet_mod_load ? (Mods.loadSelectedMods(), addClass(getElem("mods_form"), " hidden ")) : Mods.consoleLog("Ready: RPG MO Mods Pack version " + Mods.version);