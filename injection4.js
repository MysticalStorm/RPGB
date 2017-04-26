var ChatSystem = {
    toggle: function() {
        GAME_STATE == GAME_STATES.GAME || GAME_STATE == GAME_STATES.SPECTATE && SpectateWindow.player ? Chat.set_visible() || (noRender(), document.getElementById("chat").style.display = "block", Chat.chat_position_up && (document.getElementById("my_text").style.display = "block", document.getElementById("my_text").style.zIndex = 240), removeClass(document.getElementById("my_text"), "hidden"), removeClass(document.getElementById("current_channel"), "hidden"), document.getElementById("my_text").value =
            "", document.getElementById("my_text").focus(), setGameState(GAME_STATES.CHAT), Chat.set_sizes()) : GAME_STATE != GAME_STATES.CHAT || Chat.set_visible() || (document.getElementById("chat").style.display = "block", Chat.chat_position_up && setTimeout(function() {
                document.getElementById("my_text").style.display = "none"
            }, 50), addClass(document.getElementById("my_text"), "hidden"), addClass(document.getElementById("current_channel"), "hidden"), document.getElementById("my_text").blur(), document.getElementById("chat").style.top =
            "auto", spectator_mode || 2 != socket_status ? setGameState(GAME_STATES.SPECTATE) : setGameState(GAME_STATES.GAME), Chat.set_sizes(), Android || setTimeout(function() {
                setCanvasSize()
            }, 16))
    },
    whisper: function(a) {
        Chat.set_visible();
        document.getElementById("chat").style.display = "block";
        document.getElementById("chat").style.bottom = 40 * current_ratio_y + "px";
        removeClass(document.getElementById("my_text"), "hidden");
        removeClass(document.getElementById("current_channel"), "hidden");
        document.getElementById("my_text").value =
            '/w "' + a.username() + '" ';
        document.getElementById("my_text").value = '/w "' + a.username() + '" ';
        a = document.getElementById("my_text").value.length;
        document.getElementById("my_text").selectionStart = a;
        document.getElementById("my_text").selectionEnd = a;
        document.getElementById("my_text").focus();
        Chat.update_string();
        setGameState(GAME_STATES.CHAT)
    },
    filters_init: function() {
        var a = Chat.tab_settings[Chat.tab];
        document.getElementById("filters_form_content").innerHTML = HandlebarTemplate.tab_filters()({
            name: a.n,
            "delete": 1 <
                Chat.tab_settings.length,
            left: 0 < Chat.tab
        });
        for (var b = "attempt fails chat whisper join_leave loot magic archery spam time url".split(" "), d = 0; d < b.length; d++) {
            var e = document.getElementById("filter_" + b[d]);
            a.f.get(chat_filter_positions[b[d]]) ? addClass(e, "red") : addClass(e, "green")
        }
    },
    filters: function(a) {
        if (GAME_STATE == GAME_STATES.GAME || GAME_STATE == GAME_STATES.CHAT) FormHelper.is_form_visible("filters") && !a ? FormHelper.hide_form("filters") : (FormHelper.get_form("filters"), ChatSystem.filters_init())
    },
    filter_toggle: function(a) {
        var b =
            Chat.tab_settings[Chat.tab],
            d = document.getElementById("filter_" + a);
        b.f.get(chat_filter_positions[a]) ? (b.f.set(chat_filter_positions[a], 0), removeClass(d, "red"), addClass(d, "green")) : (b.f.set(chat_filter_positions[a], 1), removeClass(d, "green"), addClass(d, "red"));
        Chat.tabs_server_sync()
    }
};

function addLog(a, b) {
    addChatText(a, "Sys", b || COLOR.GREEN)
}
var last_cannot_message = 0,
    last_ignore_message = 0;

function addChatText(a, b, d, e, f, g, h, l, m) {
    l = l || !1;
    "object" == typeof a && (b = a.user || a.name, d = a.color, e = a.type, f = a.lang, g = a.to, h = a.server, l = a.id, a = a.text, m = m || a.data || {});
    if ("undefined" == typeof e || "join_leave" != e || Contacts.are_friends(b))
        if ("undefined" == typeof f || "{M}" == f || Contacts.channels[f]) {
            "undefined" != typeof f && "{M}" == f && (Chat.set_visible(), a = a.replace("@" + players[0].name + " ", ""));
            if (e && "cannot" == e) {
                if (1E3 > timestamp() - last_cannot_message) return;
                last_cannot_message = timestamp()
            } - 1 < Contacts.ignores.indexOf(b) ?
                "undefined" != typeof g && 1E4 < timestamp() - last_ignore_message && !h && (last_ignore_message = timestamp(), Socket.send("message", {
                    data: '/w "' + b + '" [Ignored] This player does not receive your messages.',
                    lang: document.getElementById("current_channel").value,
                    silent: !0
                })) : (chat_history.push({
                        text: a,
                        user: b,
                        color: d,
                        type: e,
                        lang: f,
                        to: g,
                        id: l,
                        server: h,
                        data: m,
                        time: timestamp(),
                        added: !1
                    }), chat_history.length > Chat.max_chat_history && chat_history.splice(0, 1), "whisper" == e && b != players[0].name ? (Notifications.show(_ti("{player} sent you a whisper!", {
                        player: b.sanitize()
                    })), Chat.add_whisper(b.sanitize()), Chat.set_visible()) : b || a != _ti("Current experience rate is 2x") ? !b && (new RegExp(_ti("Arena starts in {time} on world {world}, to join type /join and click on a table to register", {
                        time: {
                            format: "{count} minute",
                            count: 10
                        }
                    }))).test(a) ? Notifications.show(_ti("Arena starts in 10 minutes")) : !b && (new RegExp(_ti("Trivia starts in 10 minutes"))).test(a) && Notifications.show(_ti("Trivia starts in 10 minutes")) : Notifications.show(_ti("Current experience rate is 2x")),
                    "{M}" != f || Contacts.channels["{M}"] || Contacts.add_channel("{M}"), SpectateWindow.iframe && SpectateWindow.sendMessage({
                        action: "chat_message",
                        text: a,
                        user: b,
                        color: d,
                        type: e,
                        lang: f,
                        to: g,
                        id: l,
                        server: h,
                        data: m,
                        time: timestamp()
                    }), isActive && (t = chat_history.length - 1, Chat.add_lines(t)))
        }
}
var Skills = {
        can_perform: function(a, b, d) {
            if (-1 != a.temp.fight_id || -1 != a.temp.duel_id) return {
                status: !1,
                reason: "Cannot do that in a fight"
            };
            if (a.temp.busy) {
                if (Timers.running("player_using_skill" + a.id)) return {
                    status: !1,
                    reason: "Cannot do that yet"
                };
                a.temp.busy = !1
            }
            if (-42 == b) {
                var e = object_base[42];
                e.map = a.map
            } else "object" == typeof b && b ? "item" == b.type && (e = item_base[b.id], e.map = a.map) : e = objects_data[b];
            if ("undefined" == typeof e || "undefined" == typeof e.params || "undefined" == typeof e.params.results || "object" != typeof b &&
                42 != e.b_i && 1 < distance(a.i, a.j, e.i, e.j) || e.map != a.map) return {
                status: !1,
                reason: "Cannot do that yet"
            };
            if (40 == a.temp.inventory.length && 0 <= ["woodcutting", "fishing", "mining"].indexOf(e.params.results[0].skill)) return {
                status: !1,
                reason: "Your inventory is full!"
            };
            b = Inventory.get_item_counts(a);
            var f = !1,
                g = !0,
                h;
            for (h in e.params.results) {
                var l = e.params.results[h],
                    m = !0;
                if (l.requires_one_from) {
                    var k = l.requires_one_from,
                        m = !1,
                        v;
                    for (v in k)
                        if (Inventory.has_equipped(a, k[v])) {
                            m = !0;
                            f = k[v];
                            break
                        }
                } else
                    for (v in k = l.requires,
                        k)
                        if (!Inventory.has_equipped(a, k[v])) {
                            m = !1;
                            break
                        } if (m)
                    for (var q in l.returns)
                        if (l.returns[q].level <= Player.skills(a)[l.skill].current) {
                            var m = !0,
                                k = {},
                                r;
                            for (r in l.returns[q].consumes)
                                if (k = l.returns[q].consumes[r], "undefined" == typeof b[k.id] || b[k.id] < k.count) {
                                    m = !1;
                                    break
                                }
                            if (m) return a.temp.busy = !0, Timers.set("player_using_skill" + a.id, function() {
                                    a.temp.busy = !1
                                }, l.returns[q].duration || 2E3), Player.request_captcha(a.id, !1), "undefined" == typeof iamserver && e.params && e.params.results && e.params.results[h].continuous &&
                                "undefined" == typeof d && Player.auto_action(e), {
                                    status: !0,
                                    result: h,
                                    returns: q,
                                    tool: f
                                }
                        } else g = !1
            }
            return {
                status: !1,
                reason: "I think that I'm missing something.",
                type: "cannot",
                has_levels: g
            }
        }
    },
    Chest = {
        upgrade_prices: {
            1: 5E5,
            2: 3E6,
            3: 9E6,
            4: 2E7
        },
        upgrade_prices_mos: {
            1: 50,
            2: 300,
            3: 900,
            4: 2E3
        },
        open: function(a, b, d) {
            chest_content = a;
            chests[0] = a;
            b && Chest.change_page(chest_page);
            d && Carpentry.init(d)
        },
        withdraw: function(a) {
            var b = chest_page - 1,
                b = parseInt(selected_chest) + 60 * b;
            chest_item_id = chest_content[b].id;
            Socket.send("chest_withdraw", {
                item_id: chest_content[b].id,
                item_slot: b,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j,
                amount: a
            })
        },
        deposit: function(a) {
            var b = chest_page - 1,
                b = parseInt(selected_chest) + 60 * b;
            chest_item_id = chest_content[b].id;
            Socket.send("chest_deposit", {
                item_id: chest_content[b].id,
                item_slot: b,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j,
                amount: a
            })
        },
        destroy: function() {
            var a = chest_page - 1,
                b = parseInt(selected_chest) + 60 * a;
            chest_item_id = chest_content[b].id;
            Popup.prompt(_ti("Do you want to destroy {item_name}?", {
                item_name: item_base[chest_item_id].name
            }), function() {
                Socket.send("chest_destroy", {
                    item_id: chest_content[b].id,
                    item_slot: b,
                    target_id: chest_npc.id,
                    target_i: chest_npc.i,
                    target_j: chest_npc.j
                })
            })
        },
        get_content: function(a) {
            var b = JSON.clone(chests[a]),
                d = {},
                e = clients[a].temp.inventory,
                f;
            for (f in b) d[b[f].id] = !0;
            for (var g in e) d[e[g].id] || (b.length < Player.chest_size(clients[a]) && b.push({
                id: e[g].id,
                count: 0
            }), d[e[g].id] = !0);
            return b
        },
        sort_player_chest: function(a) {
            "undefined" != typeof chests[a] && chests[a].sort(function(a,
                d) {
                if (item_base[a.id].b_t < item_base[d.id].b_t) return -1;
                if (item_base[a.id].b_t > item_base[d.id].b_t) return 1;
                if (item_base[a.id].params && item_base[d.id].params) {
                    if (item_base[a.id].params.slot < item_base[d.id].params.slot) return -1;
                    if (item_base[a.id].params.slot > item_base[d.id].params.slot) return 1;
                    if (item_base[a.id].params.price < item_base[d.id].params.price) return -1;
                    if (item_base[a.id].params.price > item_base[d.id].params.price) return 1;
                    if (item_base[a.id].b_i < item_base[d.id].b_i) return -1;
                    if (item_base[a.id].b_i >
                        item_base[d.id].b_i) return 1
                }
                return 0
            })
        },
        player_find_item_index: function(a, b, d) {
            "undefined" == typeof d && (d = chests[a]);
            a = 0;
            for (var e = d.length; a < e; a++)
                if (d[a].id == b) return a
        },
        player_chest_item_count: function(a, b) {
            var d = Chest.player_find_item_index(a, b);
            return "undefined" != typeof d ? chests[a][d].count : 0
        },
        player_decrease_item_count: function(a, b, d) {
            b = Chest.player_find_item_index(a, b);
            return "undefined" != typeof b && (a = chests[a], a[b].count >= d) ? (a[b].count -= d, 0 == a[b].count && a.splice(b, 1), !0) : !1
        },
        change_page: function(a) {
            a >
                players[0].params.chest_pages ? Chest.player_upgrade() : hasClass(document.getElementById("market"), "hidden") || hasClass(document.getElementById("market_transactions"), "hidden") ? (addClass(document.getElementById("market"), "hidden"), BigMenu.open_chest(chest_content, a)) : Market.open_specific("transactions")
        },
        last_page: function() {
            1 < chest_page && Chest.change_page(chest_page - 1)
        },
        next_page: function() {
            chest_page < players[0].params.chest_pages + 1 && Chest.change_page(chest_page + 1)
        },
        player_upgrade: function() {
            Popup.dual_prompt(_ti("Do you want to upgrade your chest?"),
                thousandSeperate(Chest.upgrade_prices[players[0].params.chest_pages]) + " " + _ti("coins"),
                function() {
                    Socket.send("chest_upgrade", {
                        upgrade: !0,
                        type: "coins"
                    })
                }, thousandSeperate(Chest.upgrade_prices_mos[players[0].params.chest_pages]) + " MOS",
                function() {
                    Socket.send("chest_upgrade", {
                        upgrade: !0,
                        type: "mos"
                    })
                })
        },
        player_chest_full: function(a) {
            return chests[a].length >= Player.chest_size(clients[a]) ? !0 : !1
        },
        is_open: function() {
            return !hasClass(document.getElementById("chest"), "hidden")
        },
        can_access: function(a, b, d, e,
            f, g, h) {
            a = clients[a];
            if ("undefined" == typeof d || "undefined" == typeof e || "undefined" == typeof a || a.temp.busy || MarketServer.transaction_in_progress(a.id, "market_add_new_offer") || 19 == a.map) return !1;
            if (300 == a.map) {
                if (f) {
                    b = {
                        i: g - 10,
                        j: h - 10
                    };
                    if (!PlayerMap.can_see(a.name, a.params.island, b)) return !1;
                    b = PlayerMap.get_object(a.params.island, b);
                    if (!b || !b.activities || b.activities[0] != ACTIVITIES.ACCESS || 1 < distance(a.i, a.j, g, h)) return !1
                }
                return !0
            }
            b = objects_data[b];
            return "undefined" == typeof b || 1 < distance(a.i, a.j, b.i, b.j) ||
                b.map != a.map || !b.activities || b.activities && b.activities[0] != ACTIVITIES.ACCESS ? !1 : !0
        },
        item_info: function(a) {
            a += 60 * (chest_page - 1);
            chest_content[a] && Items.get_info(chest_content[a].id)
        },
        pvp_loot_put: function(a) {
            Socket.send("pvp_loot_put", {
                item_id: a,
                target_id: loot_master_id
            })
        },
        cabinet_open: function(a) {
            if (last_cabinet) {
                windowOpen = !0;
                var b = object_base[last_cabinet.b_i],
                    d = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items || [];
                300 == current_map || 120 <= current_map && current_map <= 120 + Guild.max_allowed ||
                    a || Socket.send("carpentry", {
                        sub: "cabinet_open",
                        cabinet: {
                            map: current_map,
                            i: last_cabinet.i,
                            j: last_cabinet.j
                        }
                    });
                document.getElementById("cabinet_form").style.display = "block";
                for (a = 0; 20 > a; a++) b.params.stores > a ? document.getElementById("cabinet_chest_" + a).style.display = "inline-block" : document.getElementById("cabinet_chest_" + a).style.display = "none";
                for (a = 0; 24 > a; a++) {
                    var e = document.getElementById("cabinet_inv_" + a);
                    removeClass(e, "selected");
                    if ("undefined" != typeof players[0].temp.inventory[a]) {
                        var f = item_base[players[0].temp.inventory[a].id];
                        e.style.background = Items.get_background(f.b_i)
                    } else e.style.background = ""
                }
                for (a = 0; a < b.params.stores; a++) e = document.getElementById("cabinet_chest_" + a), removeClass(e, "selected"), "undefined" != typeof d[a] ? (f = item_base[d[a]], e.style.background = Items.get_background(f.b_i)) : e.style.background = ""
            }
        },
        cabinet_add: function(a) {
            var b = object_base[last_cabinet.b_i],
                d = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items || [];
            !players[0].temp.busy && b.params.stores > d.length && players[0].temp.inventory.length >
                a && Socket.send("carpentry", {
                    sub: "cabinet_add",
                    inventory_slot: a,
                    cabinet: {
                        i: last_cabinet.i,
                        j: last_cabinet.j,
                        map: current_map
                    }
                })
        },
        cabinet_remove: function(a) {
            var b = on_map[current_map][last_cabinet.i][last_cabinet.j].params.items || [];
            !players[0].temp.busy && b.length > a && 40 > players[0].temp.inventory.length && Socket.send("carpentry", {
                sub: "cabinet_remove",
                cabinet_slot: a,
                cabinet: {
                    i: last_cabinet.i,
                    j: last_cabinet.j,
                    map: current_map
                }
            })
        },
        right_click: function(a) {
            var b = chest_content[parseInt(a) + 60 * (chest_page - 1)];
            b &&
                ChestMenu.create(a, parseInt(b.id))
        }
    },
    Forge = {
        enchantingChancesArmor: {
            176: function(a) {
                return 20 > a ? .5 : 50 > a ? .35 : 80 > a ? .25 : 100 > a ? .15 : .05
            },
            177: function(a) {
                return 20 > a ? .7 : 50 > a ? .5 : 80 > a ? .4 : 100 > a ? .25 : .15
            },
            178: function(a) {
                return 20 > a ? .9 : 50 > a ? .6 : 80 > a ? .45 : 100 > a ? .35 : .25
            },
            179: function(a) {
                return 20 > a ? 1 : 50 > a ? .75 : 80 > a ? .55 : 100 > a ? .45 : .35
            }
        },
        enchantingChancesWeapon: {
            64: function(a) {
                return 20 > a ? .5 : 50 > a ? .35 : 80 > a ? .25 : 100 > a ? .15 : .05
            },
            173: function(a) {
                return 20 > a ? .7 : 50 > a ? .5 : 80 > a ? .4 : 100 > a ? .25 : .15
            },
            174: function(a) {
                return 20 > a ? .9 :
                    50 > a ? .6 : 80 > a ? .45 : 100 > a ? .35 : .25
            },
            175: function(a) {
                return 20 > a ? 1 : 50 > a ? .75 : 80 > a ? .55 : 100 > a ? .45 : .35
            }
        },
        enchantingChancesJewelry: {
            1125: function(a) {
                return 20 > a ? .5 : 50 > a ? .35 : 80 > a ? .25 : 100 > a ? .15 : .05
            },
            1126: function(a) {
                return 20 > a ? .7 : 50 > a ? .5 : 80 > a ? .4 : 100 > a ? .25 : .15
            },
            1127: function(a) {
                return 20 > a ? .9 : 50 > a ? .6 : 80 > a ? .45 : 100 > a ? .35 : .25
            },
            1128: function(a) {
                return 20 > a ? 1 : 50 > a ? .75 : 80 > a ? .55 : 100 > a ? .45 : .35
            }
        },
        enchantingChancesCapes: {
            1303: function(a) {
                return 20 > a ? .5 : 50 > a ? .35 : 80 > a ? .25 : 100 > a ? .15 : .05
            },
            1304: function(a) {
                return 20 > a ? .7 : 50 >
                    a ? .5 : 80 > a ? .4 : 100 > a ? .25 : .15
            },
            1305: function(a) {
                return 20 > a ? .9 : 50 > a ? .6 : 80 > a ? .45 : 100 > a ? .35 : .25
            },
            1306: function(a) {
                return 20 > a ? 1 : 50 > a ? .75 : 80 > a ? .55 : 100 > a ? .45 : .35
            }
        },
        init: function() {
            var a = [],
                b = 0,
                d = [],
                e;
            for (e in FORGE_FORMULAS) {
                for (var b = 0, a = {}, d = FORGE_FORMULAS[e].pattern, f = 0; f < d.length; f++)
                    for (var g = 0; g < d[f].length; g++) 0 <= d[f][g] && (b++, a[d[f][g]] = "undefined" == typeof a[d[f][g]] ? 1 : a[d[f][g]] + 1);
                FORGE_FORMULAS[e].material_count = b;
                FORGE_FORMULAS[e].materials = a;
                b = 0;
                for (f in a) b += a[f] * (FORGE_MATERIAL_XP[f] || 0);
                FORGE_FORMULAS[e].xp = b;
                FORGE_FORMULAS[e].overall_level = FORGE_FORMULAS[e].level || FORGE_FORMULAS[e].fletching_level;
                FORGE_FORMULAS[e].id = e
            }
        },
        available_formulas: function() {
            var a = Inventory.get_item_counts(players[0]),
                b = JSON.count(FORGE_FORMULAS),
                d = [],
                e = 0;
            a: for (; e < b; e++) {
                var f = FORGE_FORMULAS[e];
                if (!(f.level && f.level > skills[0].forging.current || f.fletching_level && f.fletching_level > skills[0].fletching.current)) {
                    for (var g in f.materials)
                        if (!a[g] || f.materials[g] > a[g]) continue a;
                    d.push(FORGE_FORMULAS[e])
                }
            }
            return d =
                sortArrayOfObjectsByFieldValueDesc(d, "overall_level")
        },
        last_form: "forging",
        open: function() {
            if (selected && 36 == selected.b_i && inDistance(players[0].i, players[0].j, selected.i, selected.j)) switch (Forge.last_form) {
                case "forging":
                    Forge.forging_open();
                    break;
                case "enchanting":
                    Forge.enchanting_open();
                    break;
                case "formulas":
                    Forge.show_formulas()
            }
        },
        last_used_formulas: [],
        active_formula: !1,
        formula_page: 0,
        forging_open: function() {
            Forge.last_form = "forging";
            var a = Inventory.get_item_counts(players[0]),
                b = Forge.available_formulas(),
                d = Math.ceil(b.length / 30),
                e = Math.min(Forge.formula_page, d - 1),
                b = b.slice(30 * e, 30 * e + 30),
                e = FormHelper.get_form("forging"),
                f = !1,
                g = !1;
            "number" == typeof Forge.active_formula && (g = FORGE_FORMULAS[Forge.active_formula], Forge.formula_available(g.id, a) && (f = g.item_id));
            for (var h = [], l = 0; l < Forge.last_used_formulas.length; l++) Forge.formula_available(Forge.last_used_formulas[l], a) && h.push(Forge.last_used_formulas[l]);
            h = h.slice(Math.max(0, h.length - 5), h.length);
            for (l = 0; l < h.length; l++) h[l] = FORGE_FORMULAS[h[l]];
            var m = l = !1;
            "boolean" == typeof f && (l = "No formula chosen");
            0 == b.length && (m = "No formulas available");
            g && 6 < JSON.count(g.materials) && (h = []);
            e.content.innerHTML = HandlebarTemplate.forging()({
                formulas: b,
                last_used: h.reverse(),
                last_used_visible: 0 < h.length,
                active_formula: Forge.active_formula,
                active_item: f,
                consumes: "boolean" != typeof f && g && g.materials,
                multiplier: a[f] && a[f] + "x",
                progress: 0,
                pages: d,
                percent: Math.floor(100 * (g && g.chance)),
                error: l,
                error2: m
            });
            Forge.make_in_progress && (a = document.getElementById("forging-make"),
                addClass(a, "hidden"))
        },
        formula_available: function(a, b) {
            b || (b = Inventory.get_item_counts(players[0]));
            var d = FORGE_FORMULAS[a],
                e = d.materials,
                f;
            for (f in e)
                if ("undefined" == typeof b[f] || e[f] > b[f]) return !1;
            return skills[0].forging.current < d.level || skills[0].fletching.current < d.fletching_level ? !1 : !0
        },
        formula_click: function(a) {
            Forge.make_in_progress || (Forge.active_formula = parseInt(a), Forge.forging_open())
        },
        formula_page_click: function(a) {
            Forge.formula_page = a;
            Forge.forging_open()
        },
        make_in_progress: !1,
        make: function() {
            if (!Forge.make_in_progress) {
                Forge.make_in_progress = !0;
                var a = document.getElementById("forging-progress"),
                    b = document.getElementById("forging-progress-span"),
                    d, e = 0,
                    f = document.getElementById("forging-make");
                addClass(f, "hidden");
                d = setInterval(function() {
                    e += 5;
                    100 < e ? (clearInterval(d), Forge.make_in_progress = !1, Forge.open()) : (b.innerHTML = Math.floor(e) + "%", a.style.width = e + "%")
                }, 110);
                for (f = 0; f < Forge.last_used_formulas.length; f++)
                    if (Forge.last_used_formulas[f] == Forge.active_formula) {
                        Forge.last_used_formulas.splice(f, 1);
                        break
                    }
                Forge.last_used_formulas.push(Forge.active_formula);
                addChatText(_ti("You attempt to forge..."), null, COLOR.YELLOW, "attempt");
                Socket.send("forge", {
                    target_id: selected.id,
                    formula: Forge.active_formula
                });
                Music.sound_effect("forge")
            }
        },
        enchant_in_progress: !1,
        enchant_item: void 0,
        enchant_scroll: void 0,
        enchant_orbs: 0,
        enchanting_open: function() {
            Forge.last_form = "enchanting";
            var a = Inventory.get_item_counts(players[0]);
            void 0 == typeof Forge.enchant_item || a[Forge.enchant_item] || (Forge.enchant_item = void 0);
            void 0 == typeof Forge.enchant_scroll || a[Forge.enchant_scroll] ||
                (Forge.enchant_scroll = void 0);
            Forge.enchant_orbs = Math.min(Forge.enchant_orbs, a[593]) || 0;
            var b = FormHelper.get_form("enchanting"),
                d = Forge.enchant_item,
                e = Forge.enchant_scroll,
                f = Forge.enchant_orbs,
                g = void 0,
                h = !1,
                l = 0;
            "undefined" != typeof d && e && Forge.enchant_item_req_scroll_type(d) == Forge.enchant_scroll_type(e) && (g = item_base[d].params.enchant_id, l = Forge.enchant_chance(d, e, f));
            "undefined" == typeof g && (h = "Missing a component");
            var m = [],
                k;
            for (k in a) Forge.enchant_item_type(k) && m.push({
                id: k,
                count: a[k]
            });
            for (k =
                m.length; 20 > k; k++) m.push({});
            b.content.innerHTML = HandlebarTemplate.enchanting()({
                inventory: m,
                item: d,
                scroll: e,
                orbs: f,
                enchant_result: g,
                orb_img: 0 < f ? 593 : void 0,
                progress: 0,
                percent: l,
                error: h
            });
            Forge.enchant_in_progress && (a = document.getElementById("enchanting-make"), addClass(a, "hidden"))
        },
        enchanting_inv_click: function(a) {
            switch (Forge.enchant_item_type(a)) {
                case "orb":
                    var b = Inventory.get_item_counts(players[0]);
                    Forge.enchant_orbs = Math.min(b[a], Math.min(3, Forge.enchant_orbs + 1));
                    break;
                case "item":
                    Forge.enchant_item =
                        a;
                    break;
                case "scroll":
                    Forge.enchant_scroll = a
            }
            Forge.enchanting_open()
        },
        enchanting_remove_orb: function() {
            Forge.enchant_orbs = Math.max(0, Forge.enchant_orbs - 1);
            Forge.enchanting_open()
        },
        enchant_item_type: function(a) {
            return 593 == a ? "orb" : item_base[a].params.enchant_id ? "item" : Forge.enchant_scroll_type(a) ? "scroll" : !1
        },
        enchant_scroll_type: function(a) {
            return Forge.enchantingChancesArmor[a] ? "armor" : Forge.enchantingChancesWeapon[a] ? "weapon" : Forge.enchantingChancesJewelry[a] ? "jewelry" : Forge.enchantingChancesCapes[a] ?
                "cape" : !1
        },
        enchant_chance: function(a, b, d) {
            var e = Forge.enchant_item_req_scroll_type(a);
            a = item_base[a];
            var f = a.params.enchant_bonus || 0;
            switch (e) {
                case "armor":
                    f += Forge.enchantingChancesArmor[b](a.params.min_defense || a.params.min_magic || a.params.min_archery);
                    break;
                case "weapon":
                    f += Forge.enchantingChancesWeapon[b](a.params.min_magic || a.params.min_strength || a.params.min_accuracy || a.params.min_archery);
                    break;
                case "jewelry":
                    f += Forge.enchantingChancesJewelry[b](a.params.min_health || a.params.min_jewelry);
                    break;
                case "cape":
                    f += Forge.enchantingChancesCapes[b](a.params.min_defense || a.params.min_strength || a.params.min_archery || a.params.min_magic)
            }
            return Math.floor(100 * f + 10 * d)
        },
        enchant_item_req_scroll_type: function(a) {
            a = item_base[a].params;
            return 1 == a.slot ? "cape" : a.min_accuracy || a.min_archery && -1 != [4, 3].indexOf(a.slot) ? "weapon" : a.min_defense || a.min_magic || a.min_archery ? "armor" : a.min_health || a.min_jewelry ? "jewelry" : !1
        },
        enchant_make: function() {
            if (!Forge.enchant_in_progress) {
                var a = {
                    base_item: Forge.enchant_item,
                    scroll: Forge.enchant_scroll,
                    orbs: Forge.enchant_orbs
                };
                Forge.enchant_in_progress = !0;
                var b = document.getElementById("enchanting-progress"),
                    d = document.getElementById("enchanting-progress-span"),
                    e, f = 0,
                    g = document.getElementById("enchanting-make");
                addClass(g, "hidden");
                e = setInterval(function() {
                    f += 5;
                    100 < f ? (clearInterval(e), Forge.enchant_in_progress = !1, Forge.open()) : (d.innerHTML = Math.floor(f) + "%", b.style.width = f + "%")
                }, 110);
                addChatText(_ti("You attempt to enchant..."), null, COLOR.YELLOW, "attempt");
                Socket.send("forge", {
                    target_id: selected.id,
                    formula: a
                });
                Music.sound_effect("forge")
            }
        },
        formula_type: "forging",
        show_formulas: function() {
            Forge.last_form = "formulas";
            for (var a = [], b = Object.keys(FORGE_FORMULAS), d = 0; d < b.length; d++) "forging" == Forge.formula_type && FORGE_FORMULAS[d].level ? a.push(JSON.clone(FORGE_FORMULAS[d])) : "fletching" == Forge.formula_type && FORGE_FORMULAS[d].fletching_level && a.push(JSON.clone(FORGE_FORMULAS[d]));
            "forging" == Forge.formula_type ? sortArrayOfObjectsByFieldValueAsc(a, "level") : sortArrayOfObjectsByFieldValueAsc(a,
                "fletching_level");
            FormHelper.get_form("formulas").content.innerHTML = HandlebarTemplate.forging_formulas()(a);
            document.getElementById("forging_search").value = Forge.forging_search;
            Forge.update_search();
            TableSorter.init(document.getElementById("forging_formulas_table"))
        },
        forging_search: "",
        update_search: function() {
            Forge.forging_search = document.getElementById("forging_search").value;
            for (var a = RegExp(escapeRegExp(Forge.forging_search), "i"), b = document.getElementsByClassName("forging_formula_line"), d = 0, e =
                    b.length; d < e; d++) {
                for (var f = b[d].children, g = !1, h = 0; h < f.length; h++)
                    if (a.test(f[h].textContent) || f[h].children[0] && a.test(f[h].children[0].title)) {
                        g = !0;
                        break
                    }
                g ? removeClass(b[d], "hidden") : addClass(b[d], "hidden")
            }
        }
    },
    FORGE_FORMULAS = {
        0: {
            item_id: 0,
            level: 1,
            chance: 1,
            pattern: [
                [34],
                [34],
                [29]
            ]
        },
        1: {
            item_id: 37,
            level: 3,
            chance: 1,
            pattern: [
                [34, 34],
                [34, 34]
            ]
        },
        2: {
            item_id: 38,
            level: 2,
            chance: 1,
            pattern: [
                [34],
                [34],
                [34],
                [29]
            ]
        },
        3: {
            item_id: 27,
            level: 5,
            chance: 1,
            pattern: [
                [-1, 34, -1],
                [34, 34, 34]
            ]
        },
        4: {
            item_id: 1,
            level: 9,
            chance: 1,
            pattern: [
                [-1,
                    34, -1
                ],
                [34, 29, 34],
                [-1, 34, -1]
            ]
        },
        5: {
            item_id: 39,
            level: 7,
            chance: 1,
            pattern: [
                [34],
                [34],
                [34]
            ]
        },
        6: {
            item_id: 40,
            level: 11,
            chance: 1,
            pattern: [
                [34, 34],
                [34, 34],
                [34, 34]
            ]
        },
        7: {
            item_id: 41,
            level: 15,
            chance: 1,
            pattern: [
                [34, 34, 34],
                [34, 34, 34],
                [-1, 29, -1],
                [-1, 29, -1]
            ]
        },
        8: {
            item_id: 42,
            level: 17,
            chance: .9,
            pattern: [
                [-1, 34, 34, -1],
                [34, 29, 29, 34],
                [34, 29, 29, 34],
                [-1, 34, 34, -1]
            ]
        },
        9: {
            item_id: 43,
            level: 20,
            chance: .9,
            pattern: [
                [34, 34, 34],
                [34, 34, 34],
                [34, 34, 34]
            ]
        },
        10: {
            item_id: 51,
            level: 20,
            chance: .6,
            pattern: [
                [50],
                [50],
                [313]
            ]
        },
        11: {
            item_id: 25,
            level: 24,
            chance: .6,
            pattern: [
                [50, 50],
                [50, 50]
            ]
        },
        12: {
            item_id: 52,
            level: 29,
            chance: .6,
            pattern: [
                [-1, 50, -1],
                [50, 50, 50]
            ]
        },
        13: {
            item_id: 53,
            level: 30,
            chance: .6,
            pattern: [
                [-1, 50, -1],
                [50, 313, 50],
                [-1, 50, -1]
            ]
        },
        14: {
            item_id: 36,
            level: 20,
            chance: .6,
            pattern: [
                [50, 313, 50],
                [-1, 313, -1]
            ]
        },
        15: {
            item_id: 54,
            level: 22,
            chance: .6,
            pattern: [
                [-1, 313, -1],
                [50, 313, 50],
                [-1, 50, -1],
                [-1, 50, -1]
            ]
        },
        16: {
            item_id: 55,
            level: 31,
            chance: .6,
            pattern: [
                [-1, 50, -1],
                [50, 50, 50],
                [-1, 313, -1],
                [-1, 313, -1]
            ]
        },
        17: {
            item_id: 56,
            level: 25,
            chance: .6,
            pattern: [
                [50, 50, -1],
                [-1, 50, -1],
                [313,
                    313, 313
                ],
                [-1, 313, -1]
            ]
        },
        18: {
            item_id: 57,
            level: 23,
            chance: .6,
            pattern: [
                [50, 50],
                [50, 50],
                [313, 313]
            ]
        },
        19: {
            item_id: 2,
            level: 32,
            chance: .6,
            pattern: [
                [50, 50],
                [50, 50],
                [50, 50]
            ]
        },
        20: {
            item_id: 58,
            level: 26,
            chance: .6,
            pattern: [
                [50],
                [50],
                [50]
            ]
        },
        21: {
            item_id: 59,
            level: 28,
            chance: .6,
            pattern: [
                [50, 50, 50],
                [50, 50, 313],
                [-1, -1, 313],
                [-1, 313, 313]
            ]
        },
        22: {
            item_id: 60,
            level: 27,
            chance: .6,
            pattern: [
                [50, 50, 50],
                [50, 50, 313],
                [-1, 50, 313],
                [-1, -1, 313]
            ]
        },
        23: {
            item_id: 61,
            level: 33,
            chance: .6,
            pattern: [
                [-1, 50, -1],
                [50, -1, 50],
                [50, -1, 50]
            ]
        },
        24: {
            item_id: 18,
            level: 35,
            chance: .6,
            pattern: [
                [50, 50, 50],
                [50, 50, 50],
                [-1, 313, -1],
                [-1, 313, -1]
            ]
        },
        25: {
            item_id: 62,
            level: 37,
            chance: .6,
            pattern: [
                [-1, -1, 50, 50],
                [-1, -1, 50, 50],
                [313, 313, 50, 50],
                [-1, -1, 50, 50]
            ]
        },
        26: {
            item_id: 67,
            level: 40,
            chance: .1,
            pattern: [
                [50, 50, 50, 50],
                [50, 50, 50, 50],
                [50, 50, 50, 50],
                [313, 313, 313, 313]
            ]
        },
        27: {
            item_id: 2036,
            fletching_level: 12,
            chance: .5,
            pattern: [
                [264, -1, -1, 264],
                [264, -1, -1, 264],
                [264, -1, -1, 264],
                [264, -1, -1, 264]
            ]
        },
        28: {
            item_id: 65,
            level: 36,
            chance: .6,
            pattern: [
                [-1, 50, 50, -1],
                [50, 313, 313, 50],
                [50, 313, 313, 50],
                [-1, 50, 50, -1]
            ]
        },
        29: {
            item_id: 66,
            level: 39,
            chance: .1,
            pattern: [
                [50, 50, 50],
                [50, 50, 50],
                [50, 50, 50]
            ]
        },
        30: {
            item_id: 125,
            level: 35,
            chance: .1,
            pattern: [
                [29, 29, 29],
                [-1, 29, -1],
                [-1, 29, -1],
                [-1, 29, -1]
            ]
        },
        31: {
            item_id: 188,
            level: 44,
            chance: .7,
            pattern: [
                [291, 291],
                [291, 291]
            ]
        },
        32: {
            item_id: 143,
            level: 41,
            chance: .65,
            pattern: [
                [296, 296, 296],
                [291, 291, 291],
                [-1, 291, -1],
                [291, 291, -1]
            ]
        },
        33: {
            item_id: 142,
            level: 40,
            chance: .65,
            pattern: [
                [-1, 296, -1],
                [291, 296, 291],
                [-1, 291, -1],
                [-1, 291, -1]
            ]
        },
        34: {
            item_id: 141,
            level: 43,
            chance: .65,
            pattern: [
                [296, 296, 296],
                [-1, 291, 291],
                [-1, 291, 291]
            ]
        },
        35: {
            item_id: 146,
            level: 42,
            chance: .6,
            pattern: [
                [-1, -1, 291, 291],
                [-1, -1, 296, 291],
                [-1, 296, -1, -1],
                [296, -1, -1, -1]
            ]
        },
        36: {
            item_id: 191,
            level: 48,
            chance: .5,
            pattern: [
                [291, 291],
                [291, 291],
                [291, 291]
            ]
        },
        37: {
            item_id: 189,
            level: 54,
            chance: .5,
            pattern: [
                [-1, 291, -1],
                [291, -1, 291],
                [291, -1, 291]
            ]
        },
        38: {
            item_id: 147,
            level: 46,
            chance: .55,
            pattern: [
                [296, 291],
                [296, 291],
                [296, 291],
                [296, -1]
            ]
        },
        39: {
            item_id: 144,
            level: 49,
            chance: .5,
            pattern: [
                [291, 291, 291],
                [-1, 296, 296],
                [-1, 296, 296],
                [-1, -1, 296]
            ]
        },
        40: {
            item_id: 140,
            level: 50,
            chance: .5,
            pattern: [
                [291, 291, 291],
                [291, 291, 291],
                [-1, 296, -1],
                [-1, 296, -1]
            ]
        },
        41: {
            item_id: 139,
            level: 56,
            chance: .45,
            pattern: [
                [-1, -1, 291, 291],
                [-1, -1, 291, 291],
                [296, 296, 291, 291],
                [-1, -1, 291, 291]
            ]
        },
        42: {
            item_id: 193,
            level: 55,
            chance: .45,
            pattern: [
                [-1, 291, -1],
                [291, 291, 291],
                [291, 291, 291],
                [-1, 291, -1]
            ]
        },
        43: {
            item_id: 190,
            level: 60,
            chance: .3,
            pattern: [
                [291, 291, 291],
                [291, 291, 291],
                [291, 291, 291]
            ]
        },
        44: {
            item_id: 148,
            level: 52,
            chance: .2,
            pattern: [
                [-1, -1, 291, 291],
                [-1, 291, 296, 291],
                [-1, 296, 296, 291],
                [296, -1, -1, -1]
            ]
        },
        45: {
            item_id: 149,
            level: 53,
            chance: .2,
            pattern: [
                [-1, 291, 291, -1],
                [-1, 291, 291, -1],
                [-1, 291, 291, -1],
                [291, 291, 291, 291]
            ]
        },
        46: {
            item_id: 145,
            level: 58,
            chance: .1,
            pattern: [
                [-1, -1, 291, 291],
                [-1, 291, 291, 291],
                [296, 291, 291, -1],
                [296, 296, -1, -1]
            ]
        },
        47: {
            item_id: 339,
            level: 47,
            chance: .4,
            pattern: [
                [-1, 291, -1],
                [291, 291, 291]
            ]
        },
        48: {
            item_id: 340,
            level: 71,
            chance: .35,
            pattern: [
                [-1, 201, -1],
                [216, 201, 250]
            ]
        },
        49: {
            item_id: 342,
            level: 75,
            chance: .2,
            pattern: [
                [-1, 199, -1],
                [231, 199, 254]
            ]
        },
        50: {
            item_id: 344,
            level: 80,
            chance: .3,
            pattern: [
                [-1, 197, -1],
                [224, 197, 252]
            ]
        },
        51: {
            item_id: 366,
            level: 10,
            chance: .55,
            pattern: [
                [274, 274],
                [274, 274]
            ]
        },
        52: {
            item_id: 368,
            level: 15,
            chance: .5,
            pattern: [
                [271, 273, 271],
                [271, 273, 271],
                [272, 274, 272]
            ]
        },
        53: {
            item_id: 367,
            level: 1,
            chance: .25,
            pattern: [
                [369, 369, 369],
                [369, 369, 369],
                [369, -1, 369]
            ]
        },
        54: {
            item_id: 359,
            level: 1,
            chance: .15,
            pattern: [
                [367, 1303, 371]
            ]
        },
        55: {
            item_id: 359,
            level: 1,
            chance: .25,
            pattern: [
                [367, 1304, 371]
            ]
        },
        56: {
            item_id: 346,
            level: 1,
            chance: .25,
            pattern: [
                [370, 370, 370],
                [370, 370, 370],
                [370, -1, 370]
            ]
        },
        57: {
            item_id: 360,
            level: 1,
            chance: .15,
            pattern: [
                [346, 1303, 371]
            ]
        },
        58: {
            item_id: 360,
            level: 1,
            chance: .25,
            pattern: [
                [346, 1304, 371]
            ]
        },
        59: {
            item_id: 35,
            level: 80,
            chance: .3,
            pattern: [
                [384, 201, 384],
                [384, 201, 384],
                [384, 201, 384]
            ]
        },
        60: {
            item_id: 138,
            level: 65,
            chance: .4,
            pattern: [
                [-1, 201, -1],
                [384, 201, 384],
                [-1, 384, -1],
                [-1, 384, -1]
            ]
        },
        61: {
            item_id: 394,
            level: 77,
            chance: .3,
            pattern: [
                [384, 384, 384],
                [384, 216, 384],
                [-1, 201, -1],
                [-1, 201, -1]
            ]
        },
        62: {
            item_id: 365,
            level: 1,
            chance: .3,
            pattern: [
                [396, 397, 398, 399]
            ]
        },
        63: {
            item_id: 393,
            level: 75,
            chance: .3,
            pattern: [
                [-1, -1, 384, 384],
                [-1, 216, 201, 384],
                [-1, 201, 384, 384],
                [201, -1, -1, -1]
            ]
        },
        64: {
            item_id: 426,
            level: 10,
            chance: .8,
            pattern: [
                [199],
                [313],
                [313],
                [313]
            ]
        },
        65: {
            item_id: 428,
            level: 40,
            chance: .5,
            pattern: [
                [197],
                [29],
                [29],
                [29]
            ]
        },
        66: {
            item_id: 434,
            level: 1,
            chance: .8,
            pattern: [
                [29],
                [29],
                [29],
                [29]
            ]
        },
        67: {
            item_id: 435,
            level: 30,
            chance: .5,
            pattern: [
                [50],
                [50]
            ]
        },
        68: {
            item_id: 438,
            level: 20,
            chance: .5,
            pattern: [
                [199, 199],
                [296, 296],
                [296, 296],
                [296, 296]
            ]
        },
        69: {
            item_id: 442,
            level: 40,
            chance: .4,
            pattern: [
                [386, 386],
                [595, 595],
                [595, 595],
                [595, 595]
            ]
        },
        70: {
            item_id: 440,
            level: 30,
            chance: .4,
            pattern: [
                [197, 197],
                [594, 594],
                [594, 594],
                [594, 594]
            ]
        },
        71: {
            item_id: 472,
            level: 40,
            chance: .15,
            pattern: [
                [153, 176, 219]
            ]
        },
        72: {
            item_id: 472,
            level: 40,
            chance: .25,
            pattern: [
                [153, 177, 219]
            ]
        },
        73: {
            item_id: 359,
            level: 1,
            chance: .35,
            pattern: [
                [367, 1305, 371]
            ]
        },
        74: {
            item_id: 359,
            level: 1,
            chance: .5,
            pattern: [
                [367, 1306, 371]
            ]
        },
        75: {
            item_id: 360,
            level: 1,
            chance: .35,
            pattern: [
                [346, 1305, 371]
            ]
        },
        76: {
            item_id: 360,
            level: 1,
            chance: .5,
            pattern: [
                [346, 1306, 371]
            ]
        },
        77: {
            item_id: 472,
            level: 40,
            chance: .35,
            pattern: [
                [153, 178, 219]
            ]
        },
        78: {
            item_id: 472,
            level: 40,
            chance: .5,
            pattern: [
                [153, 179, 219]
            ]
        },
        79: {
            item_id: 473,
            level: 13,
            chance: 1,
            pattern: [
                [-1, 34, 34, -1],
                [-1, 34, 34, -1],
                [34, -1, -1, 34]
            ]
        },
        80: {
            item_id: 474,
            level: 34,
            chance: .6,
            pattern: [
                [-1, 50, 50, -1],
                [-1, 50, 50, -1],
                [50, -1, -1, 50]
            ]
        },
        81: {
            item_id: 475,
            level: 51,
            chance: .35,
            pattern: [
                [-1, 291, 291, -1],
                [-1, 291, 291, -1],
                [291, -1, -1, 291]
            ]
        },
        82: {
            item_id: 476,
            level: 73,
            chance: .4,
            pattern: [
                [-1, 250, 250, -1],
                [-1, 384, 384, -1],
                [384, -1, -1, 384]
            ]
        },
        83: {
            item_id: 477,
            level: 76,
            chance: .5,
            pattern: [
                [-1, 371, 371, -1],
                [-1, 384, 384, -1],
                [384, -1, -1, 384]
            ]
        },
        84: {
            item_id: 478,
            level: 82,
            chance: .3,
            pattern: [
                [-1, 658, 658, -1],
                [-1, 386, 386, -1],
                [386, -1, -1, 386]
            ]
        },
        85: {
            item_id: 497,
            level: 45,
            chance: .4,
            pattern: [
                [291],
                [291],
                [291]
            ]
        },
        86: {
            item_id: 498,
            level: 68,
            chance: .5,
            pattern: [
                [250],
                [250],
                [384]
            ]
        },
        87: {
            item_id: 500,
            level: 75,
            chance: .5,
            pattern: [
                [252],
                [252],
                [384]
            ]
        },
        88: {
            item_id: 499,
            level: 75,
            chance: .25,
            pattern: [
                [500],
                [263],
                [197]
            ]
        },
        89: {
            item_id: 499,
            level: 75,
            chance: .45,
            pattern: [
                [500],
                [258],
                [197]
            ]
        },
        90: {
            item_id: 499,
            level: 75,
            chance: .65,
            pattern: [
                [500],
                [257],
                [197]
            ]
        },
        91: {
            item_id: 499,
            level: 75,
            chance: .85,
            pattern: [
                [500],
                [262],
                [197]
            ]
        },
        92: {
            item_id: 501,
            level: 80,
            chance: .5,
            pattern: [
                [256],
                [195],
                [195]
            ]
        },
        93: {
            item_id: 502,
            level: 80,
            chance: .25,
            pattern: [
                [501],
                [263],
                [197]
            ]
        },
        94: {
            item_id: 502,
            level: 80,
            chance: .45,
            pattern: [
                [501],
                [258],
                [197]
            ]
        },
        95: {
            item_id: 502,
            level: 80,
            chance: .65,
            pattern: [
                [501],
                [257],
                [197]
            ]
        },
        96: {
            item_id: 502,
            level: 80,
            chance: .85,
            pattern: [
                [501],
                [262],
                [197]
            ]
        },
        97: {
            item_id: 173,
            level: 1,
            chance: .7,
            pattern: [
                [64, 64, 64, 64]
            ]
        },
        98: {
            item_id: 174,
            level: 1,
            chance: .6,
            pattern: [
                [173, 173, 173]
            ]
        },
        99: {
            item_id: 177,
            level: 1,
            chance: .7,
            pattern: [
                [176, 176, 176, 176]
            ]
        },
        100: {
            item_id: 178,
            level: 1,
            chance: .6,
            pattern: [
                [177,
                    177, 177
                ]
            ]
        },
        101: {
            item_id: 159,
            level: 93,
            chance: .3,
            pattern: [
                [658, 252, 658],
                [658, 252, 658],
                [658, 252, 658]
            ]
        },
        102: {
            item_id: 664,
            level: 80,
            chance: .3,
            pattern: [
                [658, 658],
                [658, 658]
            ]
        },
        103: {
            item_id: 665,
            level: 88,
            chance: .4,
            pattern: [
                [-1, 658, -1],
                [658, 252, 658],
                [658, 252, 658]
            ]
        },
        104: {
            item_id: 666,
            level: 90,
            chance: .3,
            pattern: [
                [658, 658, 658],
                [658, 658, 224],
                [-1, -1, 224],
                [-1, 597, 224]
            ]
        },
        105: {
            item_id: 668,
            level: 95,
            chance: .4,
            pattern: [
                [658, 224, 658],
                [658, 224, 658],
                [-1, 597, -1],
                [-1, 597, -1]
            ]
        },
        106: {
            item_id: 797,
            level: 10,
            chance: .8,
            pattern: [
                [272],
                [272],
                [270]
            ]
        },
        107: {
            item_id: 799,
            level: 15,
            chance: .6,
            pattern: [
                [-1, 270, -1],
                [272, 270, 272],
                [-1, 272, -1],
                [-1, 272, -1]
            ]
        },
        108: {
            item_id: 801,
            level: 13,
            chance: .5,
            pattern: [
                [273, 273, 273],
                [-1, 272, -1],
                [-1, 270, -1],
                [273, 273, 273]
            ]
        },
        109: {
            item_id: 436,
            level: 10,
            chance: .6,
            pattern: [
                [201, 201],
                [29, 29],
                [29, 29],
                [29, 29]
            ]
        },
        110: {
            item_id: 910,
            level: 70,
            chance: .4,
            pattern: [
                [911, 911],
                [253, 253],
                [253, 253],
                [253, 253]
            ]
        },
        111: {
            item_id: 904,
            level: 95,
            chance: .05,
            pattern: [
                [34, 50, 291],
                [384, 658]
            ]
        },
        112: {
            item_id: 909,
            level: 95,
            chance: .3,
            pattern: [
                [666, 904,
                    668
                ],
                [904, -1, 904]
            ]
        },
        113: {
            item_id: 891,
            level: 1,
            chance: 1,
            pattern: [
                [-1, 901, -1],
                [900, 898, 903]
            ]
        },
        114: {
            item_id: 896,
            level: 1,
            chance: 1,
            pattern: [
                [711, 895, 710]
            ]
        },
        115: {
            item_id: 585,
            level: 75,
            chance: .25,
            pattern: [
                [500],
                [263],
                [201]
            ]
        },
        116: {
            item_id: 585,
            level: 75,
            chance: .45,
            pattern: [
                [500],
                [258],
                [201]
            ]
        },
        117: {
            item_id: 585,
            level: 75,
            chance: .65,
            pattern: [
                [500],
                [257],
                [201]
            ]
        },
        118: {
            item_id: 585,
            level: 75,
            chance: .85,
            pattern: [
                [500],
                [262],
                [201]
            ]
        },
        119: {
            item_id: 584,
            level: 75,
            chance: .25,
            pattern: [
                [500],
                [263],
                [195]
            ]
        },
        120: {
            item_id: 584,
            level: 75,
            chance: .45,
            pattern: [
                [500],
                [258],
                [195]
            ]
        },
        121: {
            item_id: 584,
            level: 75,
            chance: .65,
            pattern: [
                [500],
                [257],
                [195]
            ]
        },
        122: {
            item_id: 584,
            level: 75,
            chance: .85,
            pattern: [
                [500],
                [262],
                [195]
            ]
        },
        123: {
            item_id: 583,
            level: 75,
            chance: .25,
            pattern: [
                [500],
                [263],
                [199]
            ]
        },
        124: {
            item_id: 583,
            level: 75,
            chance: .45,
            pattern: [
                [500],
                [258],
                [199]
            ]
        },
        125: {
            item_id: 583,
            level: 75,
            chance: .65,
            pattern: [
                [500],
                [257],
                [199]
            ]
        },
        126: {
            item_id: 583,
            level: 75,
            chance: .85,
            pattern: [
                [500],
                [262],
                [199]
            ]
        },
        127: {
            item_id: 932,
            level: 38,
            chance: .7,
            pattern: [
                [50, 50],
                [50, 50],
                [254,
                    254
                ]
            ]
        },
        128: {
            item_id: 934,
            level: 45,
            chance: .5,
            pattern: [
                [50, 254, 50],
                [50, 254, 50],
                [50, 254, 50]
            ]
        },
        129: {
            item_id: 936,
            level: 40,
            chance: .6,
            pattern: [
                [-1, 254, 254, -1],
                [-1, 50, 50, -1],
                [50, -1, -1, 50]
            ]
        },
        130: {
            item_id: 938,
            level: 31,
            chance: .6,
            pattern: [
                [-1, 231, -1],
                [50, 231, 50],
                [-1, 50, -1],
                [-1, 50, -1]
            ]
        },
        131: {
            item_id: 940,
            level: 32,
            chance: .6,
            pattern: [
                [-1, 231, 231],
                [231, -1, -1],
                [231, 50, -1],
                [50, 50, -1]
            ]
        },
        132: {
            item_id: 942,
            level: 33,
            chance: .5,
            pattern: [
                [231, 231],
                [231, 231],
                [231, 231],
                [50, 50]
            ]
        },
        133: {
            item_id: 944,
            level: 44,
            chance: .5,
            pattern: [
                [-1, -1, 231, 231],
                [-1, -1, 231, 231],
                [50, 50, 231, 231],
                [-1, -1, 231, 231]
            ]
        },
        134: {
            item_id: 951,
            level: 55,
            chance: .3,
            pattern: [
                [949, 949, 949],
                [949, 949, 949]
            ]
        },
        135: {
            item_id: 952,
            level: 70,
            chance: .3,
            pattern: [
                [950, 950, 950],
                [950, 950, 950]
            ]
        },
        136: {
            item_id: 953,
            level: 1,
            chance: .4,
            pattern: [
                [359, 947, 360]
            ]
        },
        137: {
            item_id: 969,
            level: 88,
            chance: .6,
            pattern: [
                [-1, 982, 982, -1],
                [-1, 982, 982, -1],
                [982, -1, -1, 982]
            ]
        },
        138: {
            item_id: 962,
            level: 94,
            chance: .6,
            pattern: [
                [982, 982, 982],
                [982, 982, 982],
                [982, 982, 982],
                [982, 982, 982]
            ]
        },
        139: {
            item_id: 977,
            level: 86,
            chance: .6,
            pattern: [
                [982, 982],
                [982, 982]
            ]
        },
        140: {
            item_id: 982,
            level: 85,
            chance: .4,
            pattern: [
                [983, 983],
                [983, 983]
            ]
        },
        141: {
            item_id: 974,
            level: 95,
            chance: .3,
            pattern: [
                [981, 981, 981],
                [981, 981, 981],
                [911, -1, 911],
                [911, -1, 911]
            ]
        },
        142: {
            item_id: 1032,
            level: 97,
            chance: .3,
            pattern: [
                [981, 981, 981, 981],
                [981, 981, 981, 981],
                [911, 911, 911, 911]
            ]
        },
        143: {
            item_id: 972,
            level: 99,
            chance: .3,
            pattern: [
                [981, 981, 981, 981],
                [981, 981, 981, 981],
                [-1, 981, 981, -1],
                [911, 911, 911, 911]
            ]
        },
        144: {
            item_id: 968,
            level: 99,
            chance: .2,
            pattern: [
                [201, 201, 197, 197],
                [199, 199, 199, 195],
                [195,
                    386, 388, 390
                ]
            ]
        },
        145: {
            item_id: 966,
            level: 99,
            chance: .3,
            pattern: [
                [968, 35, 934, 968],
                [968, 159, 160, 968],
                [-1, 158, -1, -1]
            ]
        },
        146: {
            item_id: 980,
            level: 75,
            chance: .3,
            pattern: [
                [388, 450, 388],
                [388, -1, 388]
            ]
        },
        147: {
            item_id: 985,
            level: 84,
            chance: .3,
            pattern: [
                [388, 456, 388],
                [388, -1, 388],
                [388, -1, 388]
            ]
        },
        148: {
            item_id: 987,
            level: 80,
            chance: .3,
            pattern: [
                [388, -1, 388],
                [388, 482, 388]
            ]
        },
        149: {
            item_id: 976,
            level: 16,
            chance: .9,
            pattern: [
                [-1, 34, -1],
                [34, -1, 34],
                [34, -1, 34]
            ]
        },
        150: {
            item_id: 587,
            level: 80,
            chance: .25,
            pattern: [
                [501],
                [263],
                [195]
            ]
        },
        151: {
            item_id: 587,
            level: 80,
            chance: .45,
            pattern: [
                [501],
                [258],
                [195]
            ]
        },
        152: {
            item_id: 587,
            level: 80,
            chance: .65,
            pattern: [
                [501],
                [257],
                [195]
            ]
        },
        153: {
            item_id: 587,
            level: 80,
            chance: .85,
            pattern: [
                [501],
                [262],
                [195]
            ]
        },
        154: {
            item_id: 586,
            level: 80,
            chance: .25,
            pattern: [
                [501],
                [263],
                [201]
            ]
        },
        155: {
            item_id: 586,
            level: 80,
            chance: .45,
            pattern: [
                [501],
                [258],
                [201]
            ]
        },
        156: {
            item_id: 586,
            level: 80,
            chance: .65,
            pattern: [
                [501],
                [257],
                [201]
            ]
        },
        157: {
            item_id: 586,
            level: 80,
            chance: .85,
            pattern: [
                [501],
                [262],
                [201]
            ]
        },
        158: {
            item_id: 588,
            level: 80,
            chance: .25,
            pattern: [
                [501],
                [263],
                [199]
            ]
        },
        159: {
            item_id: 588,
            level: 80,
            chance: .45,
            pattern: [
                [501],
                [258],
                [199]
            ]
        },
        160: {
            item_id: 588,
            level: 80,
            chance: .65,
            pattern: [
                [501],
                [257],
                [199]
            ]
        },
        161: {
            item_id: 588,
            level: 80,
            chance: .85,
            pattern: [
                [501],
                [262],
                [199]
            ]
        },
        162: {
            item_id: 986,
            level: 92,
            chance: .4,
            pattern: [
                [388, 867, 388],
                [388, 454, 388]
            ]
        },
        163: {
            item_id: 984,
            level: 86,
            chance: .4,
            pattern: [
                [388, 863, 388],
                [-1, 451, -1]
            ]
        },
        164: {
            item_id: 979,
            level: 89,
            chance: .4,
            pattern: [
                [388, 859, 388],
                [-1, 483, -1]
            ]
        },
        165: {
            item_id: 1038,
            level: 98,
            chance: .2,
            pattern: [
                [981, 981, 981, -1],
                [981, 981, 981, -1],
                [981, 981, 981, -1],
                [911, 911, 911, 981]
            ]
        },
        166: {
            item_id: 1037,
            level: 96,
            chance: .3,
            pattern: [
                [167, 904]
            ]
        },
        167: {
            item_id: 175,
            level: 1,
            chance: .8,
            pattern: [
                [174, 174, 174]
            ]
        },
        168: {
            item_id: 179,
            level: 1,
            chance: .8,
            pattern: [
                [178, 178, 178]
            ]
        },
        169: {
            item_id: 1053,
            level: 1,
            chance: 1,
            pattern: [
                [710, 1048, 710]
            ]
        },
        170: {
            item_id: 1049,
            level: 1,
            chance: 1,
            pattern: [
                [1048],
                [710],
                [710]
            ]
        },
        171: {
            item_id: 1063,
            level: 1,
            chance: 1,
            pattern: [
                [1062, 710, 691],
                [710, -1, 710]
            ]
        },
        172: {
            item_id: 1064,
            level: 1,
            chance: 1,
            pattern: [
                [895, 697, 895],
                [710, 710, 710]
            ]
        },
        173: {
            item_id: 1078,
            level: 72,
            chance: .3,
            pattern: [
                [388, 1074, 388],
                [388, -1, 388]
            ]
        },
        174: {
            item_id: 1079,
            level: 84,
            chance: .4,
            pattern: [
                [388, 1076, 388],
                [-1, 1077, -1]
            ]
        },
        175: {
            item_id: 1080,
            level: 75,
            chance: .4,
            pattern: [
                [-1, 195, -1],
                [216, 195, 224]
            ]
        },
        176: {
            item_id: 1065,
            level: 79,
            chance: .3,
            pattern: [
                [-1, 224, -1],
                [386, 224, 386]
            ]
        },
        177: {
            item_id: 1066,
            level: 84,
            chance: .5,
            pattern: [
                [-1, 224, -1],
                [982, 224, 982]
            ]
        },
        178: {
            item_id: 1067,
            level: 90,
            chance: .3,
            pattern: [
                [981, 911],
                [981, 911],
                [981, 911],
                [981, 911]
            ]
        },
        179: {
            item_id: 1068,
            level: 98,
            chance: .3,
            pattern: [
                [968, 968],
                [340,
                    1080
                ],
                [344, 1065],
                [342, -1]
            ]
        },
        180: {
            item_id: 1126,
            level: 1,
            chance: .7,
            pattern: [
                [1125, 1125, 1125, 1125]
            ]
        },
        181: {
            item_id: 1127,
            level: 1,
            chance: .6,
            pattern: [
                [1126, 1126, 1126]
            ]
        },
        182: {
            item_id: 1128,
            level: 1,
            chance: .8,
            pattern: [
                [1127, 1127, 1127]
            ]
        },
        183: {
            item_id: 1147,
            level: 1,
            chance: .1,
            pattern: [
                [1146, 1145, 1144]
            ]
        },
        184: {
            item_id: 1148,
            level: 1,
            chance: 1,
            pattern: [
                [1147, 447, 1147]
            ]
        },
        185: {
            item_id: 766,
            level: 1,
            chance: 1,
            pattern: [
                [765, 765, 765, 765]
            ]
        },
        186: {
            item_id: 1125,
            level: 1,
            chance: .9,
            pattern: [
                [64, 176]
            ]
        },
        187: {
            item_id: 176,
            level: 1,
            chance: .9,
            pattern: [
                [64, 1125]
            ]
        },
        188: {
            item_id: 64,
            level: 1,
            chance: .9,
            pattern: [
                [176, 1125]
            ]
        },
        189: {
            item_id: 1126,
            level: 1,
            chance: .9,
            pattern: [
                [173, 177]
            ]
        },
        190: {
            item_id: 177,
            level: 1,
            chance: .9,
            pattern: [
                [173, 1126]
            ]
        },
        191: {
            item_id: 173,
            level: 1,
            chance: .9,
            pattern: [
                [177, 1126]
            ]
        },
        192: {
            item_id: 1127,
            level: 1,
            chance: .9,
            pattern: [
                [174, 178]
            ]
        },
        193: {
            item_id: 178,
            level: 1,
            chance: .9,
            pattern: [
                [174, 1127]
            ]
        },
        194: {
            item_id: 174,
            level: 1,
            chance: .9,
            pattern: [
                [178, 1127]
            ]
        },
        195: {
            item_id: 1128,
            level: 1,
            chance: .9,
            pattern: [
                [175, 179]
            ]
        },
        196: {
            item_id: 179,
            level: 1,
            chance: .9,
            pattern: [
                [175, 1128]
            ]
        },
        197: {
            item_id: 175,
            level: 1,
            chance: .9,
            pattern: [
                [179, 1128]
            ]
        },
        198: {
            item_id: 1150,
            level: 1,
            chance: .01,
            pattern: [
                [6, 6, 6, 6],
                [6, 6, 6, 6],
                [-1, 6, 6, -1]
            ]
        },
        199: {
            item_id: 1174,
            level: 1,
            chance: .9,
            pattern: [
                [1172, 1172, 1172, 1172],
                [1173, 1172, 1172, 1173],
                [1172, 1172, 1172, 1172]
            ]
        },
        200: {
            item_id: 1171,
            level: 1,
            chance: 1,
            pattern: [
                [1172, 1174, 1174, 1172],
                [1173, 1172, 1172, 1173],
                [1172, 1172, 1172, 1172],
                [1172, 1173, 1173, 1172]
            ]
        },
        201: {
            item_id: 589,
            level: 68,
            chance: .25,
            pattern: [
                [498],
                [263],
                [197]
            ]
        },
        202: {
            item_id: 589,
            level: 68,
            chance: .45,
            pattern: [
                [498],
                [258],
                [197]
            ]
        },
        203: {
            item_id: 589,
            level: 68,
            chance: .65,
            pattern: [
                [498],
                [257],
                [197]
            ]
        },
        204: {
            item_id: 589,
            level: 68,
            chance: .85,
            pattern: [
                [498],
                [262],
                [197]
            ]
        },
        205: {
            item_id: 590,
            level: 68,
            chance: .25,
            pattern: [
                [498],
                [263],
                [199]
            ]
        },
        206: {
            item_id: 590,
            level: 68,
            chance: .45,
            pattern: [
                [498],
                [258],
                [199]
            ]
        },
        207: {
            item_id: 590,
            level: 68,
            chance: .65,
            pattern: [
                [498],
                [257],
                [199]
            ]
        },
        208: {
            item_id: 590,
            level: 68,
            chance: .85,
            pattern: [
                [498],
                [262],
                [199]
            ]
        },
        209: {
            item_id: 591,
            level: 68,
            chance: .25,
            pattern: [
                [498],
                [263],
                [195]
            ]
        },
        210: {
            item_id: 591,
            level: 68,
            chance: .45,
            pattern: [
                [498],
                [258],
                [195]
            ]
        },
        211: {
            item_id: 591,
            level: 68,
            chance: .65,
            pattern: [
                [498],
                [257],
                [195]
            ]
        },
        212: {
            item_id: 591,
            level: 68,
            chance: .85,
            pattern: [
                [498],
                [262],
                [195]
            ]
        },
        213: {
            item_id: 592,
            level: 68,
            chance: .25,
            pattern: [
                [498],
                [263],
                [201]
            ]
        },
        214: {
            item_id: 592,
            level: 68,
            chance: .45,
            pattern: [
                [498],
                [258],
                [201]
            ]
        },
        215: {
            item_id: 592,
            level: 68,
            chance: .65,
            pattern: [
                [498],
                [257],
                [201]
            ]
        },
        216: {
            item_id: 592,
            level: 68,
            chance: .85,
            pattern: [
                [498],
                [262],
                [201]
            ]
        },
        217: {
            item_id: 258,
            level: 1,
            chance: .7,
            pattern: [
                [263,
                    263, 263, 263
                ]
            ]
        },
        218: {
            item_id: 257,
            level: 1,
            chance: .6,
            pattern: [
                [258, 258, 258]
            ]
        },
        219: {
            item_id: 1261,
            level: 98,
            chance: .4,
            pattern: [
                [1201, 951]
            ]
        },
        220: {
            item_id: 1296,
            level: 90,
            chance: .5,
            pattern: [
                [890, 1307]
            ]
        },
        221: {
            item_id: 1263,
            level: 105,
            chance: .5,
            pattern: [
                [1308, 1232, 1308]
            ]
        },
        222: {
            item_id: 1271,
            level: 38,
            chance: .3,
            pattern: [
                [50, 50, 50, 50],
                [50, 50, 50, 50],
                [50, 195, 195, 50],
                [-1, -1, 195, -1]
            ]
        },
        223: {
            item_id: 1298,
            level: 56,
            chance: .35,
            pattern: [
                [1301, 1301, 1301, 1301],
                [1301, 1301, 1301, 1301],
                [195, 195, 195, 195],
                [-1, 195, 195, -1]
            ]
        },
        224: {
            item_id: 1284,
            level: 30,
            chance: .5,
            pattern: [
                [197, 202, 202, 197],
                [197, 202, 202, 197],
                [-1, 202, 202, 197]
            ]
        },
        225: {
            item_id: 1273,
            level: 50,
            chance: .3,
            pattern: [
                [216, 250, 250, 216],
                [216, 250, 250, 216],
                [216, 250, 250, 216]
            ]
        },
        226: {
            item_id: 1288,
            level: 58,
            chance: .4,
            pattern: [
                [252, 224, 252],
                [252, 224, 252],
                [252, -1, 252]
            ]
        },
        227: {
            item_id: 1259,
            level: 105,
            chance: .4,
            pattern: [
                [1296, 1277]
            ]
        },
        228: {
            item_id: 1279,
            level: 100,
            chance: .5,
            pattern: [
                [388, 388, 388, 388],
                [388, 388, 388, 388],
                [-1, -1, -1, 1212]
            ]
        },
        229: {
            item_id: 1304,
            level: 1,
            chance: .7,
            pattern: [
                [1303, 1303, 1303, 1303]
            ]
        },
        230: {
            item_id: 1305,
            level: 1,
            chance: .6,
            pattern: [
                [1304, 1304, 1304]
            ]
        },
        231: {
            item_id: 1306,
            level: 1,
            chance: .8,
            pattern: [
                [1305, 1305, 1305]
            ]
        },
        232: {
            item_id: 1309,
            level: 80,
            chance: 1,
            pattern: [
                [608, 1312, 1312, 1312]
            ]
        },
        233: {
            item_id: 1310,
            level: 80,
            chance: 1,
            pattern: [
                [608, 1311, 1311, 1311]
            ]
        },
        234: {
            item_id: 1339,
            level: 80,
            chance: 1,
            pattern: [
                [1340, 1341, 1342, 1343],
                [447, -1, -1, -1]
            ]
        },
        235: {
            item_id: 1362,
            level: 80,
            chance: 1,
            pattern: [
                [994, 1E3, 1004, 1009]
            ]
        },
        236: {
            item_id: 1363,
            level: 80,
            chance: 1,
            pattern: [
                [995, 999, 1005, 1010]
            ]
        },
        237: {
            item_id: 765,
            level: 1,
            chance: 1,
            pattern: [
                [764, 764, 764, 764]
            ]
        },
        238: {
            item_id: 1397,
            level: 1,
            chance: .1,
            pattern: [
                [1399, 1398]
            ]
        },
        239: {
            item_id: 1437,
            level: 1,
            chance: .1,
            pattern: [
                [1438, 1438, 1438],
                [1438, 1438, 1438],
                [1438, 1438, 1438]
            ]
        },
        240: {
            item_id: 1436,
            level: 1,
            chance: .1,
            pattern: [
                [1438, 1438],
                [1438, 1438],
                [1438, 1438]
            ]
        },
        241: {
            item_id: 1449,
            level: 90,
            chance: .6,
            pattern: [
                [1448],
                [255],
                [597]
            ]
        },
        242: {
            item_id: 1451,
            level: 103,
            chance: .4,
            pattern: [
                [1448, 1448, 1448],
                [1448, 1448, 255],
                [-1, 1448, 255],
                [-1, -1, 597]
            ]
        },
        243: {
            item_id: 1453,
            level: 115,
            chance: .3,
            pattern: [
                [-1,
                    1448, 1448, -1
                ],
                [-1, 1448, 1448, -1],
                [597, 1448, 1448, 597],
                [597, 255, 255, 597]
            ]
        },
        244: {
            item_id: 1469,
            level: 110,
            chance: .15,
            pattern: [
                [-1, 1448, 1448, -1],
                [1448, 255, 255, 1448],
                [1448, 597, 597, 1448],
                [-1, 1448, 1448, -1]
            ]
        },
        245: {
            item_id: 1478,
            level: 120,
            chance: .15,
            pattern: [
                [1448, 255, 1448],
                [1448, 255, 1448],
                [1448, 255, 1448]
            ]
        },
        246: {
            item_id: 1489,
            level: 100,
            chance: .4,
            pattern: [
                [-1, 1448, -1],
                [1448, -1, 1448],
                [1448, -1, 1448]
            ]
        },
        247: {
            item_id: 1498,
            level: 84,
            chance: .3,
            pattern: [
                [-1, 658, 658, -1],
                [-1, 195, 195, -1],
                [195, -1, -1, 195]
            ]
        },
        248: {
            item_id: 1500,
            level: 118,
            chance: .3,
            pattern: [
                [-1, 255, 255, -1],
                [-1, 1448, 1448, -1],
                [1448, -1, -1, 1448]
            ]
        },
        249: {
            item_id: 1582,
            level: 106,
            chance: .4,
            pattern: [
                [-1, 1448, -1],
                [255, 1448, 255]
            ]
        },
        250: {
            item_id: 1266,
            level: 1,
            chance: .5,
            pattern: [
                [1302, 1302, 1302],
                [1302, 1302, 1302],
                [1302, -1, 1302]
            ]
        },
        251: {
            item_id: 1457,
            level: 115,
            chance: .25,
            pattern: [
                [1579, 1579],
                [1579, 1579],
                [1579, 1579],
                [255, 255]
            ]
        },
        252: {
            item_id: 1471,
            level: 115,
            chance: .25,
            pattern: [
                [-1, 1579, 1579, -1],
                [1579, 255, 255, 1579],
                [1579, 255, 255, 1579],
                [-1, 1579, 1579, -1]
            ]
        },
        253: {
            item_id: 1480,
            level: 115,
            chance: .25,
            pattern: [
                [1579, 255, 1579],
                [1579, 255, 1579],
                [1579, 255, 1579]
            ]
        },
        254: {
            item_id: 1491,
            level: 115,
            chance: .25,
            pattern: [
                [-1, 1579, -1],
                [1579, -1, 1579],
                [255, -1, 255]
            ]
        },
        255: {
            item_id: 1504,
            level: 115,
            chance: .25,
            pattern: [
                [-1, 255, 255, -1],
                [-1, 1579, 1579, -1],
                [1579, -1, -1, 1579]
            ]
        },
        256: {
            item_id: 1584,
            level: 115,
            chance: .25,
            pattern: [
                [-1, 1579, -1],
                [255, 1579, 255]
            ]
        },
        257: {
            item_id: 1586,
            level: 120,
            chance: .2,
            pattern: [
                [-1, 1581, -1],
                [256, 1581, 256]
            ]
        },
        258: {
            item_id: 1459,
            level: 120,
            chance: .2,
            pattern: [
                [1581, 1581],
                [1581, 1581],
                [1581, 1581],
                [256, 256]
            ]
        },
        259: {
            item_id: 1473,
            level: 120,
            chance: .2,
            pattern: [
                [-1, 1581, 1581, -1],
                [1581, 256, 256, 1581],
                [1581, 256, 256, 1581],
                [-1, 1581, 1581, -1]
            ]
        },
        260: {
            item_id: 1482,
            level: 120,
            chance: .2,
            pattern: [
                [1581, 256, 1581],
                [1581, 256, 1581],
                [1581, 256, 1581]
            ]
        },
        261: {
            item_id: 1493,
            level: 120,
            chance: .2,
            pattern: [
                [-1, 1581, -1],
                [1581, -1, 1581],
                [256, -1, 256]
            ]
        },
        262: {
            item_id: 1506,
            level: 120,
            chance: .2,
            pattern: [
                [-1, 256, 256, -1],
                [-1, 1581, 1581, -1],
                [1581, -1, -1, 1581]
            ]
        },
        263: {
            item_id: 1627,
            level: 1,
            chance: .5,
            pattern: [
                [1626, 1007]
            ]
        },
        264: {
            item_id: 1629,
            level: 1,
            chance: .5,
            pattern: [
                [1626, 1008]
            ]
        },
        265: {
            item_id: 1631,
            level: 1,
            chance: .4,
            pattern: [
                [1626, 1009]
            ]
        },
        266: {
            item_id: 1633,
            level: 1,
            chance: .4,
            pattern: [
                [1626, 1010]
            ]
        },
        267: {
            item_id: 1635,
            level: 1,
            chance: .3,
            pattern: [
                [1626, 1011]
            ]
        },
        268: {
            item_id: 1637,
            level: 1,
            chance: .3,
            pattern: [
                [1626, 1362, 1363]
            ]
        },
        269: {
            item_id: 1680,
            level: 1,
            chance: .1,
            pattern: [
                [296, 1012, 1012],
                [296, 1012, 1012],
                [296, 1012, 1012],
                [296, 1012, 1012]
            ]
        },
        270: {
            item_id: 1667,
            level: 115,
            chance: .25,
            pattern: [
                [1579, 1579],
                [1579, 1579],
                [1579, 1579],
                [1579, 1579]
            ]
        },
        271: {
            item_id: 1649,
            level: 115,
            chance: .25,
            pattern: [
                [1579],
                [1579],
                [1579],
                [1579]
            ]
        },
        272: {
            item_id: 1669,
            level: 120,
            chance: .2,
            pattern: [
                [1581, 1581],
                [1581, 1581],
                [1581, 1581],
                [1581, 1581]
            ]
        },
        273: {
            item_id: 1651,
            level: 120,
            chance: .2,
            pattern: [
                [1581],
                [1581],
                [1581],
                [1581]
            ]
        },
        274: {
            item_id: 1686,
            level: 8,
            chance: .55,
            pattern: [
                [274],
                [274],
                [274]
            ]
        },
        275: {
            item_id: 1688,
            level: 90,
            chance: .25,
            pattern: [
                [1687],
                [263],
                [197]
            ]
        },
        276: {
            item_id: 1688,
            level: 90,
            chance: .45,
            pattern: [
                [1687],
                [258],
                [197]
            ]
        },
        277: {
            item_id: 1688,
            level: 90,
            chance: .65,
            pattern: [
                [1687],
                [257],
                [197]
            ]
        },
        278: {
            item_id: 1688,
            level: 90,
            chance: .85,
            pattern: [
                [1687],
                [262],
                [197]
            ]
        },
        279: {
            item_id: 1689,
            level: 90,
            chance: .25,
            pattern: [
                [1687],
                [263],
                [201]
            ]
        },
        280: {
            item_id: 1689,
            level: 90,
            chance: .45,
            pattern: [
                [1687],
                [258],
                [201]
            ]
        },
        281: {
            item_id: 1689,
            level: 90,
            chance: .65,
            pattern: [
                [1687],
                [257],
                [201]
            ]
        },
        282: {
            item_id: 1689,
            level: 90,
            chance: .85,
            pattern: [
                [1687],
                [262],
                [201]
            ]
        },
        283: {
            item_id: 1690,
            level: 90,
            chance: .25,
            pattern: [
                [1687],
                [263],
                [199]
            ]
        },
        284: {
            item_id: 1690,
            level: 90,
            chance: .45,
            pattern: [
                [1687],
                [258],
                [199]
            ]
        },
        285: {
            item_id: 1690,
            level: 90,
            chance: .65,
            pattern: [
                [1687],
                [257],
                [199]
            ]
        },
        286: {
            item_id: 1690,
            level: 90,
            chance: .85,
            pattern: [
                [1687],
                [262],
                [199]
            ]
        },
        287: {
            item_id: 1691,
            level: 90,
            chance: .25,
            pattern: [
                [1687],
                [263],
                [195]
            ]
        },
        288: {
            item_id: 1691,
            level: 90,
            chance: .45,
            pattern: [
                [1687],
                [258],
                [195]
            ]
        },
        289: {
            item_id: 1691,
            level: 90,
            chance: .65,
            pattern: [
                [1687],
                [257],
                [195]
            ]
        },
        290: {
            item_id: 1691,
            level: 90,
            chance: .85,
            pattern: [
                [1687],
                [262],
                [195]
            ]
        },
        291: {
            item_id: 1693,
            level: 90,
            chance: .25,
            pattern: [
                [1692],
                [263],
                [197]
            ]
        },
        292: {
            item_id: 1693,
            level: 90,
            chance: .45,
            pattern: [
                [1692],
                [258],
                [197]
            ]
        },
        293: {
            item_id: 1693,
            level: 90,
            chance: .65,
            pattern: [
                [1692],
                [257],
                [197]
            ]
        },
        294: {
            item_id: 1693,
            level: 90,
            chance: .85,
            pattern: [
                [1692],
                [262],
                [197]
            ]
        },
        295: {
            item_id: 1696,
            level: 90,
            chance: .25,
            pattern: [
                [1692],
                [263],
                [201]
            ]
        },
        296: {
            item_id: 1696,
            level: 90,
            chance: .45,
            pattern: [
                [1692],
                [258],
                [201]
            ]
        },
        297: {
            item_id: 1696,
            level: 90,
            chance: .65,
            pattern: [
                [1692],
                [257],
                [201]
            ]
        },
        298: {
            item_id: 1696,
            level: 90,
            chance: .85,
            pattern: [
                [1692],
                [262],
                [201]
            ]
        },
        299: {
            item_id: 1694,
            level: 90,
            chance: .25,
            pattern: [
                [1692],
                [263],
                [199]
            ]
        },
        300: {
            item_id: 1694,
            level: 90,
            chance: .45,
            pattern: [
                [1692],
                [258],
                [199]
            ]
        },
        301: {
            item_id: 1694,
            level: 90,
            chance: .65,
            pattern: [
                [1692],
                [257],
                [199]
            ]
        },
        302: {
            item_id: 1694,
            level: 90,
            chance: .85,
            pattern: [
                [1692],
                [262],
                [199]
            ]
        },
        303: {
            item_id: 1695,
            level: 90,
            chance: .25,
            pattern: [
                [1692],
                [263],
                [195]
            ]
        },
        304: {
            item_id: 1695,
            level: 90,
            chance: .45,
            pattern: [
                [1692],
                [258],
                [195]
            ]
        },
        305: {
            item_id: 1695,
            level: 90,
            chance: .65,
            pattern: [
                [1692],
                [257],
                [195]
            ]
        },
        306: {
            item_id: 1695,
            level: 90,
            chance: .85,
            pattern: [
                [1692],
                [262],
                [195]
            ]
        },
        307: {
            item_id: 1698,
            level: 90,
            chance: .25,
            pattern: [
                [1697],
                [263],
                [197]
            ]
        },
        308: {
            item_id: 1698,
            level: 90,
            chance: .45,
            pattern: [
                [1697],
                [258],
                [197]
            ]
        },
        309: {
            item_id: 1698,
            level: 90,
            chance: .65,
            pattern: [
                [1697],
                [257],
                [197]
            ]
        },
        310: {
            item_id: 1698,
            level: 90,
            chance: .85,
            pattern: [
                [1697],
                [262],
                [197]
            ]
        },
        311: {
            item_id: 1699,
            level: 90,
            chance: .25,
            pattern: [
                [1697],
                [263],
                [201]
            ]
        },
        312: {
            item_id: 1699,
            level: 90,
            chance: .45,
            pattern: [
                [1697],
                [258],
                [201]
            ]
        },
        313: {
            item_id: 1699,
            level: 90,
            chance: .65,
            pattern: [
                [1697],
                [257],
                [201]
            ]
        },
        314: {
            item_id: 1699,
            level: 90,
            chance: .85,
            pattern: [
                [1697],
                [262],
                [201]
            ]
        },
        315: {
            item_id: 1700,
            level: 90,
            chance: .25,
            pattern: [
                [1697],
                [263],
                [199]
            ]
        },
        316: {
            item_id: 1700,
            level: 90,
            chance: .45,
            pattern: [
                [1697],
                [258],
                [199]
            ]
        },
        317: {
            item_id: 1700,
            level: 90,
            chance: .65,
            pattern: [
                [1697],
                [257],
                [199]
            ]
        },
        318: {
            item_id: 1700,
            level: 90,
            chance: .85,
            pattern: [
                [1697],
                [262],
                [199]
            ]
        },
        319: {
            item_id: 1701,
            level: 90,
            chance: .25,
            pattern: [
                [1697],
                [263],
                [195]
            ]
        },
        320: {
            item_id: 1701,
            level: 90,
            chance: .45,
            pattern: [
                [1697],
                [258],
                [195]
            ]
        },
        321: {
            item_id: 1701,
            level: 90,
            chance: .65,
            pattern: [
                [1697],
                [257],
                [195]
            ]
        },
        322: {
            item_id: 1701,
            level: 90,
            chance: .85,
            pattern: [
                [1697],
                [262],
                [195]
            ]
        },
        323: {
            item_id: 1703,
            level: 99,
            chance: .25,
            pattern: [
                [1702],
                [263],
                [197]
            ]
        },
        324: {
            item_id: 1703,
            level: 99,
            chance: .45,
            pattern: [
                [1702],
                [258],
                [197]
            ]
        },
        325: {
            item_id: 1703,
            level: 99,
            chance: .65,
            pattern: [
                [1702],
                [257],
                [197]
            ]
        },
        325: {
            item_id: 1703,
            level: 99,
            chance: .85,
            pattern: [
                [1702],
                [262],
                [197]
            ]
        },
        326: {
            item_id: 1704,
            level: 99,
            chance: .25,
            pattern: [
                [1702],
                [263],
                [201]
            ]
        },
        327: {
            item_id: 1704,
            level: 99,
            chance: .45,
            pattern: [
                [1702],
                [258],
                [201]
            ]
        },
        328: {
            item_id: 1704,
            level: 99,
            chance: .65,
            pattern: [
                [1702],
                [257],
                [201]
            ]
        },
        329: {
            item_id: 1704,
            level: 99,
            chance: .85,
            pattern: [
                [1702],
                [262],
                [201]
            ]
        },
        330: {
            item_id: 1705,
            level: 99,
            chance: .25,
            pattern: [
                [1702],
                [263],
                [199]
            ]
        },
        331: {
            item_id: 1705,
            level: 99,
            chance: .45,
            pattern: [
                [1702],
                [258],
                [199]
            ]
        },
        332: {
            item_id: 1705,
            level: 99,
            chance: .65,
            pattern: [
                [1702],
                [257],
                [199]
            ]
        },
        333: {
            item_id: 1705,
            level: 99,
            chance: .85,
            pattern: [
                [1702],
                [262],
                [199]
            ]
        },
        334: {
            item_id: 1706,
            level: 99,
            chance: .25,
            pattern: [
                [1702],
                [263],
                [195]
            ]
        },
        335: {
            item_id: 1706,
            level: 99,
            chance: .45,
            pattern: [
                [1702],
                [258],
                [195]
            ]
        },
        336: {
            item_id: 1706,
            level: 99,
            chance: .65,
            pattern: [
                [1702],
                [257],
                [195]
            ]
        },
        337: {
            item_id: 1706,
            level: 99,
            chance: .85,
            pattern: [
                [1702],
                [262],
                [195]
            ]
        },
        338: {
            item_id: 1708,
            level: 94,
            chance: .25,
            pattern: [
                [1707],
                [263],
                [197]
            ]
        },
        339: {
            item_id: 1708,
            level: 94,
            chance: .45,
            pattern: [
                [1707],
                [258],
                [197]
            ]
        },
        340: {
            item_id: 1708,
            level: 94,
            chance: .65,
            pattern: [
                [1707],
                [257],
                [197]
            ]
        },
        341: {
            item_id: 1708,
            level: 94,
            chance: .85,
            pattern: [
                [1707],
                [262],
                [197]
            ]
        },
        342: {
            item_id: 1709,
            level: 94,
            chance: .25,
            pattern: [
                [1707],
                [263],
                [201]
            ]
        },
        343: {
            item_id: 1709,
            level: 94,
            chance: .45,
            pattern: [
                [1707],
                [258],
                [201]
            ]
        },
        344: {
            item_id: 1709,
            level: 94,
            chance: .65,
            pattern: [
                [1707],
                [257],
                [201]
            ]
        },
        345: {
            item_id: 1709,
            level: 94,
            chance: .85,
            pattern: [
                [1707],
                [262],
                [201]
            ]
        },
        346: {
            item_id: 1710,
            level: 94,
            chance: .25,
            pattern: [
                [1707],
                [263],
                [199]
            ]
        },
        347: {
            item_id: 1710,
            level: 94,
            chance: .45,
            pattern: [
                [1707],
                [258],
                [199]
            ]
        },
        348: {
            item_id: 1710,
            level: 94,
            chance: .65,
            pattern: [
                [1707],
                [257],
                [199]
            ]
        },
        349: {
            item_id: 1710,
            level: 94,
            chance: .85,
            pattern: [
                [1707],
                [262],
                [199]
            ]
        },
        350: {
            item_id: 1711,
            level: 94,
            chance: .25,
            pattern: [
                [1707],
                [263],
                [195]
            ]
        },
        351: {
            item_id: 1711,
            level: 94,
            chance: .45,
            pattern: [
                [1707],
                [258],
                [195]
            ]
        },
        352: {
            item_id: 1711,
            level: 94,
            chance: .65,
            pattern: [
                [1707],
                [257],
                [195]
            ]
        },
        353: {
            item_id: 1711,
            level: 94,
            chance: .85,
            pattern: [
                [1707],
                [262],
                [195]
            ]
        },
        354: {
            item_id: 1707,
            level: 94,
            chance: .15,
            pattern: [
                [1448],
                [1448],
                [1448]
            ]
        },
        355: {
            item_id: 1702,
            level: 99,
            chance: .35,
            pattern: [
                [968],
                [968],
                [968]
            ]
        },
        356: {
            item_id: 1712,
            level: 115,
            chance: .25,
            pattern: [
                [1579],
                [1579],
                [1579]
            ]
        },
        357: {
            item_id: 1713,
            level: 115,
            chance: .25,
            pattern: [
                [1712],
                [263],
                [197]
            ]
        },
        358: {
            item_id: 1713,
            level: 115,
            chance: .45,
            pattern: [
                [1712],
                [258],
                [197]
            ]
        },
        359: {
            item_id: 1713,
            level: 115,
            chance: .65,
            pattern: [
                [1712],
                [257],
                [197]
            ]
        },
        360: {
            item_id: 1713,
            level: 115,
            chance: .85,
            pattern: [
                [1712],
                [262],
                [197]
            ]
        },
        361: {
            item_id: 1714,
            level: 115,
            chance: .25,
            pattern: [
                [1712],
                [263],
                [201]
            ]
        },
        362: {
            item_id: 1714,
            level: 115,
            chance: .45,
            pattern: [
                [1712],
                [258],
                [201]
            ]
        },
        363: {
            item_id: 1714,
            level: 115,
            chance: .65,
            pattern: [
                [1712],
                [257],
                [201]
            ]
        },
        364: {
            item_id: 1714,
            level: 115,
            chance: .85,
            pattern: [
                [1712],
                [262],
                [201]
            ]
        },
        365: {
            item_id: 1715,
            level: 115,
            chance: .25,
            pattern: [
                [1712],
                [263],
                [199]
            ]
        },
        366: {
            item_id: 1715,
            level: 115,
            chance: .45,
            pattern: [
                [1712],
                [258],
                [199]
            ]
        },
        367: {
            item_id: 1715,
            level: 115,
            chance: .65,
            pattern: [
                [1712],
                [257],
                [199]
            ]
        },
        368: {
            item_id: 1715,
            level: 115,
            chance: .85,
            pattern: [
                [1712],
                [262],
                [199]
            ]
        },
        369: {
            item_id: 1716,
            level: 115,
            chance: .25,
            pattern: [
                [1712],
                [263],
                [195]
            ]
        },
        370: {
            item_id: 1716,
            level: 115,
            chance: .45,
            pattern: [
                [1712],
                [258],
                [195]
            ]
        },
        371: {
            item_id: 1716,
            level: 115,
            chance: .65,
            pattern: [
                [1712],
                [257],
                [195]
            ]
        },
        372: {
            item_id: 1716,
            level: 115,
            chance: .85,
            pattern: [
                [1712],
                [262],
                [195]
            ]
        },
        373: {
            item_id: 1717,
            level: 120,
            chance: .2,
            pattern: [
                [1581],
                [1581],
                [1581]
            ]
        },
        374: {
            item_id: 1718,
            level: 120,
            chance: .25,
            pattern: [
                [1717],
                [263],
                [197]
            ]
        },
        375: {
            item_id: 1718,
            level: 120,
            chance: .45,
            pattern: [
                [1717],
                [258],
                [197]
            ]
        },
        376: {
            item_id: 1718,
            level: 120,
            chance: .65,
            pattern: [
                [1717],
                [257],
                [197]
            ]
        },
        377: {
            item_id: 1718,
            level: 120,
            chance: .85,
            pattern: [
                [1717],
                [262],
                [197]
            ]
        },
        378: {
            item_id: 1719,
            level: 120,
            chance: .25,
            pattern: [
                [1717],
                [263],
                [201]
            ]
        },
        379: {
            item_id: 1719,
            level: 120,
            chance: .45,
            pattern: [
                [1717],
                [258],
                [201]
            ]
        },
        380: {
            item_id: 1719,
            level: 120,
            chance: .65,
            pattern: [
                [1717],
                [257],
                [201]
            ]
        },
        381: {
            item_id: 1719,
            level: 120,
            chance: .85,
            pattern: [
                [1717],
                [262],
                [201]
            ]
        },
        382: {
            item_id: 1720,
            level: 120,
            chance: .25,
            pattern: [
                [1717],
                [263],
                [199]
            ]
        },
        383: {
            item_id: 1720,
            level: 120,
            chance: .45,
            pattern: [
                [1717],
                [258],
                [199]
            ]
        },
        384: {
            item_id: 1720,
            level: 120,
            chance: .65,
            pattern: [
                [1717],
                [257],
                [199]
            ]
        },
        385: {
            item_id: 1720,
            level: 120,
            chance: .85,
            pattern: [
                [1717],
                [262],
                [199]
            ]
        },
        386: {
            item_id: 1721,
            level: 120,
            chance: .25,
            pattern: [
                [1717],
                [263],
                [195]
            ]
        },
        387: {
            item_id: 1721,
            level: 120,
            chance: .45,
            pattern: [
                [1717],
                [258],
                [195]
            ]
        },
        388: {
            item_id: 1721,
            level: 120,
            chance: .65,
            pattern: [
                [1717],
                [257],
                [195]
            ]
        },
        389: {
            item_id: 1721,
            level: 120,
            chance: .85,
            pattern: [
                [1717],
                [262],
                [195]
            ]
        },
        390: {
            item_id: 1697,
            level: 90,
            chance: .3,
            pattern: [
                [981, 911],
                [981, 911],
                [981, 911]
            ]
        },
        391: {
            item_id: 1722,
            level: 34,
            chance: .7,
            pattern: [
                [50],
                [50],
                [254]
            ]
        },
        392: {
            item_id: 1726,
            level: 1,
            chance: .25,
            pattern: [
                [663],
                [263],
                [197]
            ]
        },
        393: {
            item_id: 1726,
            level: 1,
            chance: .45,
            pattern: [
                [663],
                [258],
                [197]
            ]
        },
        394: {
            item_id: 1726,
            level: 1,
            chance: .65,
            pattern: [
                [663],
                [257],
                [197]
            ]
        },
        395: {
            item_id: 1726,
            level: 1,
            chance: .85,
            pattern: [
                [663],
                [262],
                [197]
            ]
        },
        396: {
            item_id: 1736,
            level: 1,
            chance: .25,
            pattern: [
                [663],
                [263],
                [195]
            ]
        },
        397: {
            item_id: 1736,
            level: 1,
            chance: .45,
            pattern: [
                [663],
                [258],
                [195]
            ]
        },
        398: {
            item_id: 1736,
            level: 1,
            chance: .65,
            pattern: [
                [663],
                [257],
                [195]
            ]
        },
        399: {
            item_id: 1736,
            level: 1,
            chance: .85,
            pattern: [
                [663],
                [262],
                [195]
            ]
        },
        400: {
            item_id: 1746,
            level: 1,
            chance: .25,
            pattern: [
                [663],
                [263],
                [201]
            ]
        },
        401: {
            item_id: 1746,
            level: 1,
            chance: .45,
            pattern: [
                [663],
                [258],
                [201]
            ]
        },
        402: {
            item_id: 1746,
            level: 1,
            chance: .65,
            pattern: [
                [663],
                [257],
                [201]
            ]
        },
        403: {
            item_id: 1746,
            level: 1,
            chance: .85,
            pattern: [
                [663],
                [262],
                [201]
            ]
        },
        404: {
            item_id: 1756,
            level: 1,
            chance: .25,
            pattern: [
                [663],
                [263],
                [199]
            ]
        },
        405: {
            item_id: 1756,
            level: 1,
            chance: .45,
            pattern: [
                [663],
                [258],
                [199]
            ]
        },
        406: {
            item_id: 1756,
            level: 1,
            chance: .65,
            pattern: [
                [663],
                [257],
                [199]
            ]
        },
        407: {
            item_id: 1756,
            level: 1,
            chance: .85,
            pattern: [
                [663],
                [262],
                [199]
            ]
        },
        408: {
            item_id: 1766,
            level: 75,
            chance: .5,
            pattern: [
                [256],
                [195],
                [386]
            ]
        },
        409: {
            item_id: 1770,
            level: 75,
            chance: .25,
            pattern: [
                [1766],
                [263],
                [199]
            ]
        },
        410: {
            item_id: 1770,
            level: 75,
            chance: .45,
            pattern: [
                [1766],
                [258],
                [199]
            ]
        },
        411: {
            item_id: 1770,
            level: 75,
            chance: .65,
            pattern: [
                [1766],
                [257],
                [199]
            ]
        },
        412: {
            item_id: 1770,
            level: 75,
            chance: .85,
            pattern: [
                [1766],
                [262],
                [199]
            ]
        },
        413: {
            item_id: 1768,
            level: 75,
            chance: .25,
            pattern: [
                [1766],
                [263],
                [201]
            ]
        },
        414: {
            item_id: 1768,
            level: 75,
            chance: .45,
            pattern: [
                [1766],
                [258],
                [201]
            ]
        },
        415: {
            item_id: 1768,
            level: 75,
            chance: .65,
            pattern: [
                [1766],
                [257],
                [201]
            ]
        },
        416: {
            item_id: 1768,
            level: 75,
            chance: .85,
            pattern: [
                [1766],
                [262],
                [201]
            ]
        },
        417: {
            item_id: 1769,
            level: 75,
            chance: .25,
            pattern: [
                [1766],
                [263],
                [195]
            ]
        },
        418: {
            item_id: 1769,
            level: 75,
            chance: .45,
            pattern: [
                [1766],
                [258],
                [195]
            ]
        },
        419: {
            item_id: 1769,
            level: 75,
            chance: .65,
            pattern: [
                [1766],
                [257],
                [195]
            ]
        },
        420: {
            item_id: 1769,
            level: 75,
            chance: .85,
            pattern: [
                [1766],
                [262],
                [195]
            ]
        },
        421: {
            item_id: 1767,
            level: 75,
            chance: .25,
            pattern: [
                [1766],
                [263],
                [197]
            ]
        },
        422: {
            item_id: 1767,
            level: 75,
            chance: .45,
            pattern: [
                [1766],
                [258],
                [197]
            ]
        },
        423: {
            item_id: 1767,
            level: 75,
            chance: .65,
            pattern: [
                [1766],
                [257],
                [197]
            ]
        },
        424: {
            item_id: 1767,
            level: 75,
            chance: .85,
            pattern: [
                [1766],
                [262],
                [197]
            ]
        },
        425: {
            item_id: 1809,
            level: 80,
            chance: 1,
            pattern: [
                [1007, 1008, 1009, 1010]
            ]
        },
        426: {
            item_id: 1808,
            level: 80,
            chance: 1,
            pattern: [
                [1007, 1008, 1009],
                [1010, 1011, -1]
            ]
        },
        427: {
            item_id: 1804,
            level: 80,
            chance: 1,
            pattern: [
                [1809, 1809]
            ]
        },
        428: {
            item_id: 1805,
            level: 80,
            chance: 1,
            pattern: [
                [1362, 1362]
            ]
        },
        429: {
            item_id: 1806,
            level: 80,
            chance: 1,
            pattern: [
                [1363, 1363]
            ]
        },
        430: {
            item_id: 1807,
            level: 80,
            chance: 1,
            pattern: [
                [1808, 1808]
            ]
        },
        431: {
            item_id: 1869,
            level: 1,
            chance: .25,
            pattern: [
                [1870, 1870, 1870, 1870],
                [1868, 1870, 1870, 1868],
                [1868, 1868, 1868, 1868],
                [1868, 1868, 1868, 1868]
            ]
        },
        432: {
            item_id: 1874,
            level: 10,
            chance: .9,
            pattern: [
                [-1, -1, 34],
                [34, 34, -1]
            ]
        },
        433: {
            item_id: 1875,
            level: 20,
            chance: .7,
            pattern: [
                [-1, -1, 50],
                [50, 50, -1]
            ]
        },
        434: {
            item_id: 1876,
            level: 40,
            chance: .65,
            pattern: [
                [-1, -1, 291],
                [291, 291, -1]
            ]
        },
        435: {
            item_id: 1877,
            level: 65,
            chance: .65,
            pattern: [
                [-1, -1, 384],
                [384, 384, -1]
            ]
        },
        436: {
            item_id: 1878,
            level: 75,
            chance: .05,
            pattern: [
                [-1, -1, 202],
                [202, 202]
            ]
        },
        437: {
            item_id: 400,
            level: 41,
            chance: .45,
            pattern: [
                [291, 291, 291, 291],
                [-1, 296, 296, -1],
                [-1, 296, 296, -1],
                [-1, 296, 296, -1]
            ]
        },
        438: {
            item_id: 2024,
            level: 1,
            chance: .08,
            pattern: [
                [2025, 1886, 2025],
                [2025, 1886, 2025],
                [2025, 1886, 2025],
                [2025,
                    1886, 2025
                ]
            ]
        },
        439: {
            item_id: 2024,
            level: 1,
            chance: .03,
            pattern: [
                [2025, 50, 2025],
                [2025, 50, 2025],
                [2025, 50, 2025],
                [2025, 50, 2025]
            ]
        },
        440: {
            item_id: 1302,
            level: 1,
            chance: 1,
            pattern: [
                [2033, -1, 2033],
                [-1, 2033],
                [2033, -1, 2033]
            ]
        },
        441: {
            item_id: 2034,
            fletching_level: 1,
            chance: .5,
            pattern: [
                [29, 29],
                [265, 29],
                [29, 29]
            ]
        },
        442: {
            item_id: 2063,
            fletching_level: 5,
            chance: .3,
            pattern: [
                [29, 29, 29],
                [-1, -1, 29],
                [-1, -1, 29],
                [265, 29, 29]
            ]
        },
        443: {
            item_id: 2065,
            fletching_level: 15,
            chance: .5,
            pattern: [
                [314, 314],
                [265, 314],
                [314, 314]
            ]
        },
        444: {
            item_id: 2067,
            fletching_level: 18,
            chance: .3,
            pattern: [
                [314, 314, 314],
                [-1, -1, 314],
                [-1, -1, 314],
                [265, 314, 314]
            ]
        },
        445: {
            item_id: 2069,
            fletching_level: 25,
            chance: .55,
            pattern: [
                [313, 313],
                [-1, 313],
                [266, 313],
                [201, 313]
            ]
        },
        446: {
            item_id: 2071,
            fletching_level: 28,
            chance: .35,
            pattern: [
                [313, 313, 313],
                [-1, 201, 313],
                [-1, 201, 313],
                [266, 313, 313]
            ]
        },
        447: {
            item_id: 2073,
            fletching_level: 35,
            chance: .4,
            pattern: [
                [296, 296, 296],
                [-1, -1, 296],
                [266, -1, 296],
                [254, 254, 254]
            ]
        },
        448: {
            item_id: 2075,
            fletching_level: 38,
            chance: .3,
            pattern: [
                [296, 296, 296],
                [254, 254, 296],
                [254, 254, 296],
                [266, 296,
                    296
                ]
            ]
        },
        449: {
            item_id: 2077,
            fletching_level: 45,
            chance: .3,
            pattern: [
                [594, 594, 594],
                [-1, -1, 594],
                [266, -1, 594],
                [254, 254, 254]
            ]
        },
        450: {
            item_id: 2079,
            fletching_level: 48,
            chance: .3,
            pattern: [
                [594, 594, 594],
                [254, 254, 594],
                [254, 254, 594],
                [266, 594, 594]
            ]
        },
        451: {
            item_id: 2081,
            fletching_level: 55,
            chance: .3,
            pattern: [
                [595, 595, 595],
                [-1, -1, 595],
                [1012, -1, 595],
                [254, 254, 254]
            ]
        },
        452: {
            item_id: 2083,
            fletching_level: 58,
            chance: .3,
            pattern: [
                [595, 595, 595],
                [254, 254, 595],
                [254, 254, 595],
                [1012, 595, 595]
            ]
        },
        453: {
            item_id: 2085,
            fletching_level: 67,
            chance: .3,
            pattern: [
                [596, 596, 596],
                [-1, -1, 596],
                [1012, -1, 596],
                [216, 216, 216]
            ]
        },
        454: {
            item_id: 2087,
            fletching_level: 72,
            chance: .3,
            pattern: [
                [596, 596, 596],
                [216, 216, 596],
                [216, 216, 596],
                [1012, 596, 596]
            ]
        },
        455: {
            item_id: 2089,
            fletching_level: 83,
            chance: .35,
            pattern: [
                [597, 597, 597],
                [-1, -1, 597],
                [1013, 1013, 597],
                [252, 252, 252]
            ]
        },
        456: {
            item_id: 2091,
            fletching_level: 88,
            chance: .5,
            pattern: [
                [597, 597, 597, 597],
                [-1, 252, 252, 597],
                [-1, 252, 252, 597],
                [-1, 1013, 1013, 597]
            ]
        },
        457: {
            item_id: 2100,
            fletching_level: 95,
            chance: .3,
            pattern: [
                [2129, 2129, 2129],
                [-1, -1, 2129],
                [371, 371, 2129],
                [195, 195, 195]
            ]
        },
        458: {
            item_id: 2102,
            fletching_level: 99,
            chance: .3,
            pattern: [
                [2129, 2129, 2129, 2129],
                [-1, 195, 195, 2129],
                [-1, 371, 195, 2129],
                [-1, 371, 371, 2129]
            ]
        },
        459: {
            item_id: 2104,
            fletching_level: 106,
            chance: .3,
            pattern: [
                [2130, 2130, 2130, 2130],
                [255, 255, 255, 2130],
                [255, 255, 195, 195],
                [-1, -1, 195, 195]
            ]
        },
        460: {
            item_id: 2106,
            fletching_level: 110,
            chance: .3,
            pattern: [
                [2130, 2130, 2130, 2130],
                [195, 255, 255, 2130],
                [195, 195, 255, 2130],
                [195, 195, 255, 2130]
            ]
        },
        461: {
            item_id: 2108,
            fletching_level: 111,
            chance: .6,
            pattern: [
                [2100,
                    2104
                ]
            ]
        },
        462: {
            item_id: 2110,
            fletching_level: 112,
            chance: .6,
            pattern: [
                [2102, 2106]
            ]
        },
        463: {
            item_id: 2120,
            fletching_level: 114,
            chance: .1,
            pattern: [
                [2130, 2130, 2130, 2130],
                [1581, 1581, 1581, 2130],
                [1581, 1581, 1581, 1014],
                [-1, -1, 1581, 1014]
            ]
        },
        464: {
            item_id: 2121,
            fletching_level: 119,
            chance: .1,
            pattern: [
                [1581, 2130, 2130, 2130],
                [1581, 1581, 1581, 2130],
                [1581, 1581, 1581, 1014],
                [-1, -1, 1581, 1014]
            ]
        },
        465: {
            item_id: 2131,
            fletching_level: 6,
            chance: .5,
            pattern: [
                [-1, 264, -1],
                [264, -1, 264],
                [264, -1, 264]
            ]
        },
        466: {
            item_id: 2133,
            fletching_level: 22,
            chance: .5,
            pattern: [
                [-1, 264, -1],
                [264, -1, 264],
                [259, -1, 259]
            ]
        },
        467: {
            item_id: 2135,
            fletching_level: 26,
            chance: .7,
            pattern: [
                [-1, 259, -1],
                [259, -1, 259],
                [254, -1, 254]
            ]
        },
        468: {
            item_id: 2137,
            fletching_level: 33,
            chance: .3,
            pattern: [
                [-1, 291, -1],
                [291, -1, 291],
                [250, -1, 250]
            ]
        },
        469: {
            item_id: 2139,
            fletching_level: 43,
            chance: .5,
            pattern: [
                [-1, 250, -1],
                [250, -1, 250],
                [216, -1, 216]
            ]
        },
        470: {
            item_id: 2143,
            fletching_level: 53,
            chance: .7,
            pattern: [
                [-1, 371, -1],
                [197, -1, 197],
                [197, -1, 197]
            ]
        },
        471: {
            item_id: 2145,
            fletching_level: 63,
            chance: .1,
            pattern: [
                [-1, 371, -1],
                [252, -1, 252],
                [252, -1, 252]
            ]
        },
        472: {
            item_id: 2147,
            fletching_level: 73,
            chance: .3,
            pattern: [
                [-1, 195, -1],
                [195, -1, 195],
                [252, -1, 252]
            ]
        },
        473: {
            item_id: 2149,
            fletching_level: 83,
            chance: .2,
            pattern: [
                [-1, 255, -1],
                [255, -1, 255],
                [255, -1, 255]
            ]
        },
        474: {
            item_id: 2151,
            fletching_level: 103,
            chance: .7,
            pattern: [
                [-1, 1579, -1],
                [1579, -1, 1579],
                [255, -1, 255]
            ]
        },
        475: {
            item_id: 2153,
            fletching_level: 106,
            chance: .6,
            pattern: [
                [-1, 1579, -1],
                [1579, -1, 1579],
                [256, -1, 256]
            ]
        },
        476: {
            item_id: 2155,
            fletching_level: 116,
            chance: .1,
            pattern: [
                [-1, 371, -1],
                [1581, -1, 1581],
                [1581, -1, 1581]
            ]
        },
        477: {
            item_id: 2183,
            fletching_level: 7,
            chance: .5,
            pattern: [
                [-1, 264, 264, -1],
                [-1, 264, 264, -1],
                [264, -1, -1, 264]
            ]
        },
        478: {
            item_id: 2185,
            fletching_level: 14,
            chance: .5,
            pattern: [
                [-1, 259, 259, -1],
                [-1, 259, 259, -1],
                [264, -1, -1, 264]
            ]
        },
        479: {
            item_id: 2187,
            fletching_level: 28,
            chance: .6,
            pattern: [
                [-1, 259, 259, -1],
                [-1, 259, 259, -1],
                [254, -1, -1, 254]
            ]
        },
        480: {
            item_id: 2189,
            fletching_level: 36,
            chance: .2,
            pattern: [
                [-1, 291, 291, -1],
                [-1, 291, 291, -1],
                [250, -1, -1, 250]
            ]
        },
        481: {
            item_id: 2191,
            fletching_level: 46,
            chance: .5,
            pattern: [
                [-1, 250,
                    250, -1
                ],
                [-1, 250, 250, -1],
                [216, -1, -1, 216]
            ]
        },
        482: {
            item_id: 2195,
            fletching_level: 56,
            chance: .7,
            pattern: [
                [-1, 371, 197, -1],
                [-1, 197, 197, -1],
                [197, -1, -1, 197]
            ]
        },
        483: {
            item_id: 2197,
            fletching_level: 66,
            chance: .1,
            pattern: [
                [-1, 371, 252, -1],
                [-1, 252, 252, -1],
                [252, -1, -1, 252]
            ]
        },
        484: {
            item_id: 2199,
            fletching_level: 76,
            chance: .3,
            pattern: [
                [-1, 195, 195, -1],
                [-1, 195, 195, -1],
                [252, -1, -1, 252]
            ]
        },
        485: {
            item_id: 2201,
            fletching_level: 86,
            chance: .2,
            pattern: [
                [-1, 255, 255, -1],
                [-1, 255, 255, -1],
                [255, -1, -1, 255]
            ]
        },
        486: {
            item_id: 2203,
            fletching_level: 104,
            chance: .7,
            pattern: [
                [-1, 1579, 1579, -1],
                [-1, 1579, 1579, -1],
                [255, -1, -1, 255]
            ]
        },
        487: {
            item_id: 2205,
            fletching_level: 107,
            chance: .6,
            pattern: [
                [-1, 1579, 1579, -1],
                [-1, 1579, 1579, -1],
                [256, -1, -1, 256]
            ]
        },
        488: {
            item_id: 2207,
            fletching_level: 118,
            chance: .1,
            pattern: [
                [-1, 371, 1581, -1],
                [-1, 1581, 1581, -1],
                [1581, -1, -1, 1581]
            ]
        },
        489: {
            item_id: 2123,
            fletching_level: 20,
            chance: .5,
            pattern: [
                [264, -1, -1, 271],
                [264, -1, -1, 271],
                [264, -1, -1, 271],
                [264, -1, -1, 271]
            ]
        },
        490: {
            item_id: 2038,
            fletching_level: 26,
            chance: .7,
            pattern: [
                [259, -1, -1, 264],
                [259, -1, -1,
                    264
                ],
                [259, -1, -1, 264],
                [259, -1, -1, 264]
            ]
        },
        491: {
            item_id: 2040,
            fletching_level: 32,
            chance: .6,
            pattern: [
                [259, -1, -1, 254],
                [259, -1, -1, 254],
                [259, -1, -1, 259],
                [259, -1, -1, 259]
            ]
        },
        492: {
            item_id: 2042,
            fletching_level: 50,
            chance: .3,
            pattern: [
                [250, -1, -1, 291],
                [250, -1, -1, 291],
                [250, -1, -1, 291],
                [250, -1, -1, 291]
            ]
        },
        493: {
            item_id: 2044,
            fletching_level: 62,
            chance: .5,
            pattern: [
                [250, -1, -1, 216],
                [250, -1, -1, 216],
                [250, -1, -1, 250],
                [250, -1, -1, 250]
            ]
        },
        494: {
            item_id: 2048,
            fletching_level: 74,
            chance: .7,
            pattern: [
                [197, -1, -1, 371],
                [197, -1, -1, 197],
                [197, -1, -1, 197],
                [197, -1, -1, 197]
            ]
        },
        495: {
            item_id: 2050,
            fletching_level: 82,
            chance: .1,
            pattern: [
                [252, -1, -1, 252],
                [252, -1, -1, 252],
                [252, -1, -1, 252],
                [252, -1, -1, 252]
            ]
        },
        496: {
            item_id: 2052,
            fletching_level: 88,
            chance: .3,
            pattern: [
                [252, -1, -1, 195],
                [252, -1, -1, 195],
                [252, -1, -1, 195],
                [252, -1, -1, 195]
            ]
        },
        497: {
            item_id: 2054,
            fletching_level: 96,
            chance: .2,
            pattern: [
                [255, -1, -1, 255],
                [255, -1, -1, 255],
                [255, -1, -1, 255],
                [255, -1, -1, 255]
            ]
        },
        498: {
            item_id: 2125,
            fletching_level: 100,
            chance: .3,
            pattern: [
                [371, -1, -1, 371],
                [255, -1, -1, 255],
                [255, -1, -1, 255],
                [255, -1, -1, 255]
            ]
        },
        499: {
            item_id: 2056,
            fletching_level: 104,
            chance: .7,
            pattern: [
                [1579, -1, -1, 255],
                [1579, -1, -1, 255],
                [1579, -1, -1, 255],
                [1579, -1, -1, 255]
            ]
        },
        500: {
            item_id: 2058,
            fletching_level: 106,
            chance: .6,
            pattern: [
                [1579, -1, -1, 256],
                [1579, -1, -1, 256],
                [1579, -1, -1, 256],
                [1579, -1, -1, 256]
            ]
        },
        501: {
            item_id: 2127,
            fletching_level: 110,
            chance: .5,
            pattern: [
                [1579, -1, -1, 371],
                [1579, -1, -1, 1581],
                [1579, -1, -1, 1581],
                [1579, -1, -1, 1581]
            ]
        },
        502: {
            item_id: 2060,
            fletching_level: 113,
            chance: .1,
            pattern: [
                [1581, -1, -1, 371],
                [1581, -1, -1, 1581],
                [1581, -1, -1,
                    1581
                ],
                [1581, -1, -1, 1581]
            ]
        },
        503: {
            item_id: 2209,
            fletching_level: 5,
            chance: .5,
            pattern: [
                [-1, 264, -1],
                [264, 264, 264]
            ]
        },
        504: {
            item_id: 2211,
            fletching_level: 20,
            chance: .7,
            pattern: [
                [-1, 259, -1],
                [264, 259, 264]
            ]
        },
        505: {
            item_id: 2213,
            fletching_level: 30,
            chance: .6,
            pattern: [
                [-1, 259, -1],
                [254, 259, 254]
            ]
        },
        506: {
            item_id: 2215,
            fletching_level: 40,
            chance: .3,
            pattern: [
                [-1, 250, -1],
                [250, 291, 250]
            ]
        },
        507: {
            item_id: 2217,
            fletching_level: 50,
            chance: .5,
            pattern: [
                [-1, 250, -1],
                [250, 216, 250]
            ]
        },
        508: {
            item_id: 2221,
            fletching_level: 60,
            chance: .7,
            pattern: [
                [-1,
                    197, -1
                ],
                [197, 371, 197]
            ]
        },
        509: {
            item_id: 2223,
            fletching_level: 70,
            chance: .1,
            pattern: [
                [-1, 252, -1],
                [252, 371, 252]
            ]
        },
        510: {
            item_id: 2225,
            fletching_level: 80,
            chance: .3,
            pattern: [
                [-1, 195, -1],
                [195, 252, 195]
            ]
        },
        511: {
            item_id: 2227,
            fletching_level: 90,
            chance: .2,
            pattern: [
                [-1, 255, -1],
                [255, 255, 255]
            ]
        },
        512: {
            item_id: 2229,
            fletching_level: 100,
            chance: .7,
            pattern: [
                [-1, 1579, -1],
                [1579, 255, 1579]
            ]
        },
        513: {
            item_id: 2231,
            fletching_level: 105,
            chance: .6,
            pattern: [
                [-1, 1579, -1],
                [1579, 256, 1579]
            ]
        },
        514: {
            item_id: 2233,
            fletching_level: 115,
            chance: .1,
            pattern: [
                [371,
                    1581, -1
                ],
                [1581, 1581, 1581]
            ]
        },
        515: {
            item_id: 2157,
            fletching_level: 9,
            chance: .5,
            pattern: [
                [264, 264],
                [264, 264],
                [264, 264],
                [264, 264]
            ]
        },
        516: {
            item_id: 2241,
            fletching_level: 19,
            chance: .5,
            pattern: [
                [264, 271],
                [264, 271],
                [264, 271],
                [264, 271]
            ]
        },
        517: {
            item_id: 2159,
            fletching_level: 24,
            chance: .7,
            pattern: [
                [259, 264],
                [259, 264],
                [259, 264],
                [259, 264]
            ]
        },
        518: {
            item_id: 2161,
            fletching_level: 29,
            chance: .6,
            pattern: [
                [259, 254],
                [259, 254],
                [259, 259],
                [259, 259]
            ]
        },
        519: {
            item_id: 2163,
            fletching_level: 39,
            chance: .3,
            pattern: [
                [250, 291],
                [250, 291],
                [250, 291],
                [250, 291]
            ]
        },
        520: {
            item_id: 2165,
            fletching_level: 49,
            chance: .5,
            pattern: [
                [250, 216],
                [250, 216],
                [250, 250],
                [250, 250]
            ]
        },
        521: {
            item_id: 2169,
            fletching_level: 59,
            chance: .7,
            pattern: [
                [197, 371],
                [197, 197],
                [197, 197],
                [197, 197]
            ]
        },
        522: {
            item_id: 2171,
            fletching_level: 69,
            chance: .1,
            pattern: [
                [252, 252],
                [252, 252],
                [252, 252],
                [252, 252]
            ]
        },
        523: {
            item_id: 2173,
            fletching_level: 79,
            chance: .3,
            pattern: [
                [252, 195],
                [252, 195],
                [252, 195],
                [252, 195]
            ]
        },
        524: {
            item_id: 2175,
            fletching_level: 89,
            chance: .2,
            pattern: [
                [255, 255],
                [255, 255],
                [255, 255],
                [255, 255]
            ]
        },
        525: {
            item_id: 2243,
            fletching_level: 99,
            chance: .3,
            pattern: [
                [371, 371],
                [255, 255],
                [255, 255],
                [255, 255]
            ]
        },
        526: {
            item_id: 2177,
            fletching_level: 105,
            chance: .7,
            pattern: [
                [1579, 255],
                [1579, 255],
                [1579, 255],
                [1579, 255]
            ]
        },
        527: {
            item_id: 2179,
            fletching_level: 110,
            chance: .6,
            pattern: [
                [1579, 256],
                [1579, 256],
                [1579, 256],
                [1579, 256]
            ]
        },
        528: {
            item_id: 2245,
            fletching_level: 115,
            chance: .5,
            pattern: [
                [1579, 371],
                [1579, 1581],
                [1579, 1581],
                [1579, 1581]
            ]
        },
        529: {
            item_id: 2181,
            fletching_level: 120,
            chance: .1,
            pattern: [
                [1581, 371],
                [1581, 1581],
                [1581, 1581],
                [1581, 1581]
            ]
        },
        530: {
            item_id: 2235,
            fletching_level: 11,
            chance: .5,
            pattern: [
                [-1, 264, -1],
                [264, -1, 264],
                [271, -1, 271]
            ]
        },
        531: {
            item_id: 2237,
            fletching_level: 93,
            chance: .3,
            pattern: [
                [-1, 255, -1],
                [255, -1, 255],
                [371, -1, 371]
            ]
        },
        532: {
            item_id: 2239,
            fletching_level: 113,
            chance: .5,
            pattern: [
                [-1, 1579, -1],
                [1579, -1, 1579],
                [371, -1, 371]
            ]
        },
        533: {
            item_id: 2247,
            fletching_level: 14,
            chance: .5,
            pattern: [
                [-1, 264, 264, -1],
                [-1, 264, 264, -1],
                [271, -1, -1, 271]
            ]
        },
        534: {
            item_id: 2249,
            fletching_level: 96,
            chance: .3,
            pattern: [
                [-1, 255, 255, -1],
                [-1, 255, 255, -1],
                [371, -1, -1, 371]
            ]
        },
        535: {
            item_id: 2251,
            fletching_level: 114,
            chance: .6,
            pattern: [
                [-1, 1579, 1579, -1],
                [-1, 1579, 1579, -1],
                [371, -1, -1, 1581]
            ]
        },
        536: {
            item_id: 2253,
            fletching_level: 10,
            chance: .5,
            pattern: [
                [-1, 264, -1],
                [271, 264, 271]
            ]
        },
        537: {
            item_id: 2255,
            fletching_level: 95,
            chance: .3,
            pattern: [
                [-1, 255, -1],
                [371, 255, 371]
            ]
        },
        538: {
            item_id: 2257,
            fletching_level: 110,
            chance: .5,
            pattern: [
                [-1, 371, -1],
                [1579, 1579, 1579]
            ]
        },
        539: {
            item_id: 369,
            level: 1,
            chance: 1,
            pattern: [
                [2260, -1, 2260],
                [-1, 2260],
                [2260, -1, 2260]
            ]
        },
        540: {
            item_id: 370,
            level: 1,
            chance: 1,
            pattern: [
                [2261, -1, 2261],
                [-1, 2261],
                [2261, -1, 2261]
            ]
        },
        541: {
            item_id: 949,
            level: 1,
            chance: 1,
            pattern: [
                [2262, -1, 2262],
                [-1, 2262],
                [2262, -1, 2262]
            ]
        },
        542: {
            item_id: 950,
            level: 1,
            chance: 1,
            pattern: [
                [2263, -1, 2263],
                [-1, 2263],
                [2263, -1, 2263]
            ]
        },
        543: {
            item_id: 371,
            level: 1,
            chance: 1,
            pattern: [
                [2264, -1, 2264],
                [-1, 2264],
                [2264, -1, 2264]
            ]
        },
        544: {
            item_id: 2808,
            level: 1,
            chance: 1,
            pattern: [
                [2797, 2798, 2799, 2800],
                [2801]
            ]
        },
        545: {
            item_id: 2809,
            level: 1,
            chance: 1,
            pattern: [
                [2802, 2803, 2804, 2805],
                [2806]
            ]
        },
        546: {
            item_id: 2261,
            level: 1,
            chance: 1,
            pattern: [
                [370]
            ]
        },
        547: {
            item_id: 2262,
            level: 1,
            chance: 1,
            pattern: [
                [949]
            ]
        },
        548: {
            item_id: 2263,
            level: 1,
            chance: 1,
            pattern: [
                [950]
            ]
        },
        549: {
            item_id: 2264,
            level: 1,
            chance: 1,
            pattern: [
                [371]
            ]
        },
        550: {
            item_id: 2502,
            fletching_level: 30,
            chance: .5,
            pattern: [
                [197, 202, 202, 197],
                [197, 202, 202, 197],
                [197, 202, 202, -1]
            ]
        },
        551: {
            item_id: 2506,
            fletching_level: 58,
            chance: .4,
            pattern: [
                [252, 224, 252],
                [252, 224, 252],
                [252, 252, -1]
            ]
        },
        552: {
            item_id: 2510,
            fletching_level: 55,
            chance: .3,
            pattern: [
                [949, 949],
                [949, 949],
                [949, 949]
            ]
        },
        553: {
            item_id: 2518,
            fletching_level: 90,
            chance: .5,
            pattern: [
                [1307, 890]
            ]
        },
        554: {
            item_id: 2520,
            fletching_level: 100,
            chance: .5,
            pattern: [
                [388, 388, 388],
                [388, 388, 388],
                [388, 388, 1212]
            ]
        },
        555: {
            item_id: 2522,
            fletching_level: 98,
            chance: .4,
            pattern: [
                [1201, 2510]
            ]
        },
        556: {
            item_id: 2526,
            fletching_level: 105,
            chance: .5,
            pattern: [
                [1308],
                [1232],
                [1308]
            ]
        },
        557: {
            item_id: 2544,
            fletching_level: 68,
            chance: .25,
            pattern: [
                [498],
                [263],
                [1301]
            ]
        },
        558: {
            item_id: 2544,
            fletching_level: 68,
            chance: .45,
            pattern: [
                [498],
                [258],
                [1301]
            ]
        },
        559: {
            item_id: 2544,
            fletching_level: 68,
            chance: .65,
            pattern: [
                [498],
                [257],
                [1301]
            ]
        },
        560: {
            item_id: 2544,
            fletching_level: 68,
            chance: .85,
            pattern: [
                [498],
                [262],
                [1301]
            ]
        },
        561: {
            item_id: 2545,
            fletching_level: 75,
            chance: .25,
            pattern: [
                [500],
                [263],
                [1301]
            ]
        },
        562: {
            item_id: 2545,
            fletching_level: 75,
            chance: .45,
            pattern: [
                [500],
                [258],
                [1301]
            ]
        },
        563: {
            item_id: 2545,
            fletching_level: 75,
            chance: .65,
            pattern: [
                [500],
                [257],
                [1301]
            ]
        },
        564: {
            item_id: 2545,
            fletching_level: 75,
            chance: .85,
            pattern: [
                [500],
                [262],
                [1301]
            ]
        },
        565: {
            item_id: 2546,
            fletching_level: 75,
            chance: .25,
            pattern: [
                [1766],
                [263],
                [1301]
            ]
        },
        566: {
            item_id: 2546,
            fletching_level: 75,
            chance: .45,
            pattern: [
                [1766],
                [258],
                [1301]
            ]
        },
        567: {
            item_id: 2546,
            fletching_level: 75,
            chance: .65,
            pattern: [
                [1766],
                [257],
                [1301]
            ]
        },
        568: {
            item_id: 2546,
            fletching_level: 75,
            chance: .85,
            pattern: [
                [1766],
                [262],
                [1301]
            ]
        },
        569: {
            item_id: 2547,
            fletching_level: 80,
            chance: .25,
            pattern: [
                [501],
                [263],
                [1301]
            ]
        },
        570: {
            item_id: 2547,
            fletching_level: 80,
            chance: .45,
            pattern: [
                [501],
                [258],
                [1301]
            ]
        },
        571: {
            item_id: 2547,
            fletching_level: 80,
            chance: .65,
            pattern: [
                [501],
                [257],
                [1301]
            ]
        },
        572: {
            item_id: 2547,
            fletching_level: 80,
            chance: .85,
            pattern: [
                [501],
                [262],
                [1301]
            ]
        },
        573: {
            item_id: 2548,
            fletching_level: 1,
            chance: .25,
            pattern: [
                [663],
                [263],
                [1301]
            ]
        },
        574: {
            item_id: 2548,
            fletching_level: 1,
            chance: .45,
            pattern: [
                [663],
                [258],
                [1301]
            ]
        },
        575: {
            item_id: 2548,
            fletching_level: 1,
            chance: .65,
            pattern: [
                [663],
                [257],
                [1301]
            ]
        },
        576: {
            item_id: 2548,
            fletching_level: 1,
            chance: .85,
            pattern: [
                [663],
                [262],
                [1301]
            ]
        },
        577: {
            item_id: 2575,
            fletching_level: 90,
            chance: .25,
            pattern: [
                [1687],
                [263],
                [1301]
            ]
        },
        578: {
            item_id: 2575,
            fletching_level: 90,
            chance: .45,
            pattern: [
                [1687],
                [258],
                [1301]
            ]
        },
        579: {
            item_id: 2575,
            fletching_level: 90,
            chance: .65,
            pattern: [
                [1687],
                [257],
                [1301]
            ]
        },
        580: {
            item_id: 2575,
            fletching_level: 90,
            chance: .85,
            pattern: [
                [1687],
                [262],
                [1301]
            ]
        },
        581: {
            item_id: 2576,
            fletching_level: 90,
            chance: .25,
            pattern: [
                [1692],
                [263],
                [1301]
            ]
        },
        582: {
            item_id: 2576,
            fletching_level: 90,
            chance: .45,
            pattern: [
                [1692],
                [258],
                [1301]
            ]
        },
        583: {
            item_id: 2576,
            fletching_level: 90,
            chance: .65,
            pattern: [
                [1692],
                [257],
                [1301]
            ]
        },
        584: {
            item_id: 2576,
            fletching_level: 90,
            chance: .85,
            pattern: [
                [1692],
                [262],
                [1301]
            ]
        },
        585: {
            item_id: 2577,
            fletching_level: 90,
            chance: .25,
            pattern: [
                [1697],
                [263],
                [1301]
            ]
        },
        586: {
            item_id: 2577,
            fletching_level: 90,
            chance: .45,
            pattern: [
                [1697],
                [258],
                [1301]
            ]
        },
        587: {
            item_id: 2577,
            fletching_level: 90,
            chance: .65,
            pattern: [
                [1697],
                [257],
                [1301]
            ]
        },
        588: {
            item_id: 2577,
            fletching_level: 90,
            chance: .85,
            pattern: [
                [1697],
                [262],
                [1301]
            ]
        },
        589: {
            item_id: 2578,
            fletching_level: 99,
            chance: .25,
            pattern: [
                [1702],
                [263],
                [1301]
            ]
        },
        590: {
            item_id: 2578,
            fletching_level: 99,
            chance: .45,
            pattern: [
                [1702],
                [258],
                [1301]
            ]
        },
        591: {
            item_id: 2578,
            fletching_level: 99,
            chance: .65,
            pattern: [
                [1702],
                [257],
                [1301]
            ]
        },
        592: {
            item_id: 2578,
            fletching_level: 99,
            chance: .85,
            pattern: [
                [1702],
                [262],
                [1301]
            ]
        },
        593: {
            item_id: 2579,
            fletching_level: 94,
            chance: .25,
            pattern: [
                [1707],
                [263],
                [1301]
            ]
        },
        594: {
            item_id: 2579,
            fletching_level: 94,
            chance: .45,
            pattern: [
                [1707],
                [258],
                [1301]
            ]
        },
        595: {
            item_id: 2579,
            fletching_level: 94,
            chance: .65,
            pattern: [
                [1707],
                [257],
                [1301]
            ]
        },
        596: {
            item_id: 2579,
            fletching_level: 94,
            chance: .85,
            pattern: [
                [1707],
                [262],
                [1301]
            ]
        },
        597: {
            item_id: 2580,
            fletching_level: 115,
            chance: .25,
            pattern: [
                [1712],
                [263],
                [1301]
            ]
        },
        598: {
            item_id: 2580,
            fletching_level: 115,
            chance: .45,
            pattern: [
                [1712],
                [258],
                [1301]
            ]
        },
        599: {
            item_id: 2580,
            fletching_level: 115,
            chance: .65,
            pattern: [
                [1712],
                [257],
                [1301]
            ]
        },
        600: {
            item_id: 2580,
            fletching_level: 115,
            chance: .85,
            pattern: [
                [1712],
                [262],
                [1301]
            ]
        },
        601: {
            item_id: 2581,
            fletching_level: 120,
            chance: .25,
            pattern: [
                [1717],
                [263],
                [1301]
            ]
        },
        602: {
            item_id: 2581,
            fletching_level: 120,
            chance: .45,
            pattern: [
                [1717],
                [258],
                [1301]
            ]
        },
        603: {
            item_id: 2581,
            fletching_level: 120,
            chance: .65,
            pattern: [
                [1717],
                [257],
                [1301]
            ]
        },
        604: {
            item_id: 2581,
            fletching_level: 120,
            chance: .85,
            pattern: [
                [1717],
                [262],
                [1301]
            ]
        },
        605: {
            item_id: 2588,
            level: 99,
            chance: .3,
            pattern: [
                [2135, 2139],
                [181, 2147],
                [665, 968],
                [968, 968]
            ]
        },
        606: {
            item_id: 2524,
            level: 105,
            chance: .4,
            pattern: [
                [2518, 2517]
            ]
        },
        607: {
            item_id: 2516,
            level: 1,
            chance: .4,
            pattern: [
                [2512, 947, 2514]
            ]
        },
        608: {
            item_id: 2590,
            level: 99,
            chance: .3,
            pattern: [
                [936, 476],
                [477, 478],
                [1498, 968],
                [968, 968]
            ]
        },
        609: {
            item_id: 23,
            level: 20,
            chance: 1,
            pattern: [
                [50, 50, 50],
                [29, 29, 29],
                [-1, 29, -1],
                [-1, 29, -1]
            ]
        },
        610: {
            item_id: 2514,
            level: 1,
            chance: .15,
            pattern: [
                [2498, 1303, 2498]
            ]
        },
        611: {
            item_id: 2514,
            level: 1,
            chance: .25,
            pattern: [
                [2498, 1304, 2498]
            ]
        },
        612: {
            item_id: 2514,
            level: 1,
            chance: .35,
            pattern: [
                [2498, 1305, 2498]
            ]
        },
        613: {
            item_id: 2514,
            level: 1,
            chance: .5,
            pattern: [
                [2498, 1306, 2498]
            ]
        },
        614: {
            item_id: 2724,
            level: 20,
            chance: .9,
            pattern: [
                [34, 34, 34, 34],
                [34, 34, 34, 34],
                [34, 34, 34, 34]
            ]
        },
        615: {
            item_id: 2726,
            level: 23,
            chance: .35,
            pattern: [
                [271, 271, 273, 274],
                [271, 271, 273, 274],
                [272, 272, 274, 274]
            ]
        },
        616: {
            item_id: 2734,
            level: 95,
            chance: .3,
            pattern: [
                [666, 904, 668],
                [904, 904, 904]
            ]
        },
        617: {
            item_id: 2738,
            level: 115,
            chance: .25,
            pattern: [
                [1579, 1579, 1579],
                [1579, 1579, 1579],
                [1579, 1579, 1579],
                [255, 255, 255]
            ]
        },
        618: {
            item_id: 2740,
            level: 120,
            chance: .2,
            pattern: [
                [1581, 1581, 1581],
                [1581, 1581, 1581],
                [1581, 1581, 1581],
                [256, 256, 256]
            ]
        },
        619: {
            item_id: 2732,
            level: 1,
            chance: .3,
            pattern: [
                [2793, 2794, 2795, 2796]
            ]
        },
        620: {
            item_id: 2874,
            level: 99,
            chance: .3,
            pattern: [
                [981, 981, 981, 981],
                [981, 981, 981, 981],
                [-1, 911, 911, -1],
                [911, 911, 911, 911]
            ]
        },
        621: {
            item_id: 2876,
            level: 94,
            chance: .6,
            pattern: [
                [-1, 982, 982, -1],
                [982, 982, 982, 982],
                [982, 982, 982, 982],
                [-1, 982, 982, -1]
            ]
        },
        622: {
            item_id: 2880,
            level: 1,
            chance: 1,
            pattern: [
                [971, 973, 975, 1039],
                [1884]
            ]
        },
        623: {
            item_id: 2881,
            level: 1,
            chance: 1,
            pattern: [
                [1507, 1483, 1494, 1587],
                [1474]
            ]
        },
        624: {
            item_id: 2882,
            level: 1,
            chance: 1,
            pattern: [
                [1472, 1481, 1492, 1505],
                [1585]
            ]
        },
        625: {
            item_id: 2883,
            level: 1,
            chance: 1,
            pattern: [
                [1470, 1479, 1490, 1501],
                [1583]
            ]
        },
        626: {
            item_id: 2884,
            level: 1,
            chance: 1,
            pattern: [
                [1640, 965, 1468, 1488],
                [1503]
            ]
        },
        627: {
            item_id: 2885,
            level: 1,
            chance: 1,
            pattern: [
                [963, 970, 978, 1883],
                [2877]
            ]
        },
        628: {
            item_id: 2886,
            level: 1,
            chance: 1,
            pattern: [
                [967, 1885, 2589, 2591],
                [2879]
            ]
        },
        629: {
            item_id: 2887,
            level: 1,
            chance: 1,
            pattern: [
                [1827, 1894, 873, 882]
            ]
        },
        630: {
            item_id: 2888,
            level: 1,
            chance: 1,
            pattern: [
                [1895, 874, 883, 1828]
            ]
        },
        631: {
            item_id: 2889,
            level: 1,
            chance: 1,
            pattern: [
                [1896, 875, 884, 1829]
            ]
        },
        632: {
            item_id: 2890,
            level: 1,
            chance: 1,
            pattern: [
                [1897, 876, 885, 1830]
            ]
        },
        633: {
            item_id: 2891,
            level: 1,
            chance: 1,
            pattern: [
                [1898, 1575, 1577, 1831]
            ]
        },
        634: {
            item_id: 2892,
            level: 1,
            chance: 1,
            pattern: [
                [1576, 1578, 1832, 1899]
            ]
        },
        635: {
            item_id: 2893,
            level: 1,
            chance: 1,
            pattern: [
                [1603, 1607, 1611, 1615]
            ]
        },
        636: {
            item_id: 2894,
            level: 1,
            chance: 1,
            pattern: [
                [1617, 1605, 1609, 1613]
            ]
        },
        637: {
            item_id: 2895,
            level: 1,
            chance: 1,
            pattern: [
                [1781, 1785, 1789,
                    1793
                ]
            ]
        },
        638: {
            item_id: 2896,
            level: 1,
            chance: 1,
            pattern: [
                [1795, 1783, 1787, 1791]
            ]
        },
        639: {
            item_id: 2897,
            level: 1,
            chance: 1,
            pattern: [
                [2142, 2168, 2194, 2220],
                [2047]
            ]
        },
        640: {
            item_id: 2898,
            level: 1,
            chance: 1,
            pattern: [
                [2144, 2170, 2196, 2222],
                [2049]
            ]
        },
        641: {
            item_id: 2899,
            level: 1,
            chance: 1,
            pattern: [
                [2146, 2172, 2198, 2224],
                [2051]
            ]
        },
        642: {
            item_id: 2900,
            level: 1,
            chance: 1,
            pattern: [
                [2150, 2176, 2202, 2228],
                [2055]
            ]
        },
        643: {
            item_id: 2901,
            level: 1,
            chance: 1,
            pattern: [
                [2238, 2244, 2250, 2256],
                [2126]
            ]
        },
        644: {
            item_id: 2902,
            level: 1,
            chance: 1,
            pattern: [
                [2148,
                    2174, 2200, 2226
                ],
                [2053]
            ]
        },
        645: {
            item_id: 2903,
            level: 1,
            chance: 1,
            pattern: [
                [2057, 2152, 2178, 2204],
                [2230]
            ]
        },
        646: {
            item_id: 2904,
            level: 1,
            chance: 1,
            pattern: [
                [2232, 2059, 2154, 2180],
                [2206]
            ]
        },
        647: {
            item_id: 2905,
            level: 1,
            chance: 1,
            pattern: [
                [2128, 2240, 2246, 2252],
                [2258]
            ]
        },
        648: {
            item_id: 2906,
            level: 1,
            chance: 1,
            pattern: [
                [2156, 2182, 2208, 2234],
                [2061]
            ]
        },
        649: {
            item_id: 2878,
            level: 99,
            chance: .3,
            pattern: [
                [968, 166, 161, 968],
                [968, 167, 169, 968],
                [-1, 171, -1, -1]
            ]
        },
        650: {
            item_id: 2911,
            level: 1,
            chance: .25,
            pattern: [
                [2908, 2909, 2910, 2910],
                [2910, 2910,
                    2910, 2910
                ]
            ]
        },
        651: {
            item_id: 2911,
            level: 1,
            chance: .01,
            pattern: [
                [2910]
            ]
        },
        652: {
            item_id: 2927,
            level: 1,
            chance: .75,
            pattern: [
                [1085, 2918]
            ]
        },
        653: {
            item_id: 2929,
            level: 1,
            chance: .75,
            pattern: [
                [1086, 2919]
            ]
        },
        654: {
            item_id: 2931,
            level: 1,
            chance: .75,
            pattern: [
                [1087, 2921]
            ]
        },
        655: {
            item_id: 2933,
            level: 1,
            chance: .75,
            pattern: [
                [1088, 2920]
            ]
        },
        656: {
            item_id: 2935,
            level: 1,
            chance: .75,
            pattern: [
                [2553, 2926]
            ]
        },
        657: {
            item_id: 2937,
            level: 1,
            chance: .75,
            pattern: [
                [1089, 2918]
            ]
        },
        658: {
            item_id: 2939,
            level: 1,
            chance: .75,
            pattern: [
                [1090, 2919]
            ]
        },
        659: {
            item_id: 2941,
            level: 1,
            chance: .75,
            pattern: [
                [1091, 2921]
            ]
        },
        660: {
            item_id: 2943,
            level: 1,
            chance: .75,
            pattern: [
                [1092, 2920]
            ]
        },
        661: {
            item_id: 2945,
            level: 1,
            chance: .75,
            pattern: [
                [1093, 2918, 2918]
            ]
        },
        662: {
            item_id: 2947,
            level: 1,
            chance: .75,
            pattern: [
                [1094, 2919, 2919]
            ]
        },
        663: {
            item_id: 2949,
            level: 1,
            chance: .75,
            pattern: [
                [1095, 2921, 2921]
            ]
        },
        664: {
            item_id: 2951,
            level: 1,
            chance: .75,
            pattern: [
                [1096, 2920, 2920]
            ]
        },
        665: {
            item_id: 2953,
            level: 1,
            chance: .75,
            pattern: [
                [1097, 2922, 2922]
            ]
        },
        666: {
            item_id: 2955,
            level: 1,
            chance: .75,
            pattern: [
                [1098, 2918, 2918, 2918, 2918]
            ]
        },
        667: {
            item_id: 2957,
            level: 1,
            chance: .75,
            pattern: [
                [1099, 2919, 2919, 2919, 2919]
            ]
        },
        668: {
            item_id: 2959,
            level: 1,
            chance: .75,
            pattern: [
                [1100, 2921, 2921, 2921, 2921]
            ]
        },
        669: {
            item_id: 2961,
            level: 1,
            chance: .75,
            pattern: [
                [1101, 2920, 2920, 2920, 2920]
            ]
        },
        670: {
            item_id: 2963,
            level: 1,
            chance: .75,
            pattern: [
                [1102, 2922, 2922, 2922]
            ]
        },
        671: {
            item_id: 2965,
            level: 1,
            chance: .75,
            pattern: [
                [1103, 2923, 2923, 2923]
            ]
        },
        672: {
            item_id: 2967,
            level: 1,
            chance: .75,
            pattern: [
                [1104, 2924, 2924, 2924]
            ]
        },
        673: {
            item_id: 2969,
            level: 1,
            chance: .75,
            pattern: [
                [2559, 2926, 2926, 2926,
                    2926
                ]
            ]
        },
        674: {
            item_id: 2971,
            level: 1,
            chance: .75,
            pattern: [
                [2557, 2926, 2926]
            ]
        },
        675: {
            item_id: 2973,
            level: 1,
            chance: .75,
            pattern: [
                [2555, 2926]
            ]
        },
        676: {
            item_id: 2975,
            level: 1,
            chance: .75,
            pattern: [
                [1927, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918]
            ]
        },
        677: {
            item_id: 2977,
            level: 1,
            chance: .75,
            pattern: [
                [1929, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919]
            ]
        },
        678: {
            item_id: 2979,
            level: 1,
            chance: .75,
            pattern: [
                [1931, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921]
            ]
        },
        679: {
            item_id: 2981,
            level: 1,
            chance: .75,
            pattern: [
                [1933, 2920,
                    2920, 2920, 2920, 2920, 2920
                ]
            ]
        },
        680: {
            item_id: 2983,
            level: 1,
            chance: .75,
            pattern: [
                [1935, 2922, 2922, 2922, 2922, 2922, 2922]
            ]
        },
        681: {
            item_id: 2985,
            level: 1,
            chance: .75,
            pattern: [
                [1937, 2923, 2923, 2923, 2923, 2923]
            ]
        },
        682: {
            item_id: 2987,
            level: 1,
            chance: .75,
            pattern: [
                [1939, 2924, 2924, 2924, 2924, 2924]
            ]
        },
        683: {
            item_id: 2989,
            level: 1,
            chance: .75,
            pattern: [
                [1941, 2925, 2925, 2925, 2925, 2925]
            ]
        },
        684: {
            item_id: 2991,
            level: 1,
            chance: .75,
            pattern: [
                [2572, 2926, 2926, 2926, 2926, 2926, 2926]
            ]
        },
        685: {
            item_id: 2993,
            level: 1,
            chance: .75,
            pattern: [
                [1105, 2918]
            ]
        },
        686: {
            item_id: 2995,
            level: 1,
            chance: .75,
            pattern: [
                [1106, 2919]
            ]
        },
        687: {
            item_id: 2997,
            level: 1,
            chance: .75,
            pattern: [
                [1107, 2921]
            ]
        },
        688: {
            item_id: 2999,
            level: 1,
            chance: .75,
            pattern: [
                [1108, 2920]
            ]
        },
        689: {
            item_id: 3001,
            level: 1,
            chance: .75,
            pattern: [
                [2561, 2926]
            ]
        },
        690: {
            item_id: 3003,
            level: 1,
            chance: .75,
            pattern: [
                [1109, 2918]
            ]
        },
        691: {
            item_id: 3005,
            level: 1,
            chance: .75,
            pattern: [
                [1110, 2919]
            ]
        },
        692: {
            item_id: 3007,
            level: 1,
            chance: .75,
            pattern: [
                [1111, 2921]
            ]
        },
        693: {
            item_id: 3009,
            level: 1,
            chance: .75,
            pattern: [
                [1112, 2920]
            ]
        },
        694: {
            item_id: 3011,
            level: 1,
            chance: .75,
            pattern: [
                [2563,
                    2926
                ]
            ]
        },
        695: {
            item_id: 3013,
            level: 1,
            chance: .75,
            pattern: [
                [1113, 2918, 2918, 2918]
            ]
        },
        696: {
            item_id: 3015,
            level: 1,
            chance: .75,
            pattern: [
                [1114, 2919, 2919, 2919]
            ]
        },
        697: {
            item_id: 3017,
            level: 1,
            chance: .75,
            pattern: [
                [1115, 2921, 2921, 2921]
            ]
        },
        698: {
            item_id: 3019,
            level: 1,
            chance: .75,
            pattern: [
                [1116, 2920, 2920, 2920]
            ]
        },
        699: {
            item_id: 3021,
            level: 1,
            chance: .75,
            pattern: [
                [1117, 2922, 2922, 2922]
            ]
        },
        700: {
            item_id: 3023,
            level: 1,
            chance: .75,
            pattern: [
                [2565, 2926, 2926]
            ]
        },
        701: {
            item_id: 3025,
            level: 1,
            chance: .75,
            pattern: [
                [1118, 2918, 2918, 2918, 2918, 2918, 2918]
            ]
        },
        702: {
            item_id: 3027,
            level: 1,
            chance: .75,
            pattern: [
                [1119, 2919, 2919, 2919, 2919, 2919, 2919]
            ]
        },
        703: {
            item_id: 3029,
            level: 1,
            chance: .75,
            pattern: [
                [1120, 2921, 2921, 2921, 2921, 2921, 2921]
            ]
        },
        704: {
            item_id: 3031,
            level: 1,
            chance: .75,
            pattern: [
                [1121, 2920, 2920, 2920, 2920, 2920, 2920]
            ]
        },
        705: {
            item_id: 3033,
            level: 1,
            chance: .75,
            pattern: [
                [1122, 2922, 2922, 2922, 2922, 2922, 2922]
            ]
        },
        706: {
            item_id: 3035,
            level: 1,
            chance: .75,
            pattern: [
                [1123, 2923, 2923, 2923, 2923, 2923]
            ]
        },
        707: {
            item_id: 3037,
            level: 1,
            chance: .75,
            pattern: [
                [1124, 2924, 2924, 2924, 2924]
            ]
        },
        708: {
            item_id: 3039,
            level: 1,
            chance: .75,
            pattern: [
                [2567, 2926, 2926, 2926, 2926, 2926]
            ]
        },
        709: {
            item_id: 3041,
            level: 1,
            chance: .75,
            pattern: [
                [1943, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918, 2918]
            ]
        },
        710: {
            item_id: 3043,
            level: 1,
            chance: .75,
            pattern: [
                [1945, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919, 2919]
            ]
        },
        711: {
            item_id: 3045,
            level: 1,
            chance: .75,
            pattern: [
                [1947, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921, 2921]
            ]
        },
        712: {
            item_id: 3047,
            level: 1,
            chance: .75,
            pattern: [
                [1949, 2920, 2920, 2920, 2920, 2920, 2920, 2920, 2920]
            ]
        },
        713: {
            item_id: 3049,
            level: 1,
            chance: .75,
            pattern: [
                [1951, 2922, 2922, 2922, 2922, 2922, 2922, 2922, 2922]
            ]
        },
        714: {
            item_id: 3051,
            level: 1,
            chance: .75,
            pattern: [
                [1952, 2923, 2923, 2923, 2923, 2923, 2923, 2923]
            ]
        },
        715: {
            item_id: 3053,
            level: 1,
            chance: .75,
            pattern: [
                [1954, 2924, 2924, 2924, 2924, 2924, 2924]
            ]
        },
        716: {
            item_id: 3055,
            level: 1,
            chance: .75,
            pattern: [
                [1956, 2925, 2925, 2925, 2925, 2925, 2925]
            ]
        },
        717: {
            item_id: 3057,
            level: 1,
            chance: .75,
            pattern: [
                [2574, 2926, 2926, 2926, 2926, 2926, 2926, 2926, 2926]
            ]
        },
        718: {
            item_id: 3059,
            fletching_level: 1,
            chance: .04,
            pattern: [
                [2025,
                    2025, 2025, 50
                ],
                [2025, 2025, 2025, 50],
                [2025, 2025, 2025, 50],
                [2025, 2025, 2025, 50]
            ]
        },
        719: {
            item_id: 3059,
            fletching_level: 1,
            chance: .08,
            pattern: [
                [2025, 2025, 2025, 1886],
                [2025, 2025, 2025, 1886],
                [2025, 2025, 2025, 1886],
                [2025, 2025, 2025, 1886]
            ]
        },
        720: {
            item_id: 3069,
            level: 1,
            chance: 1,
            pattern: [
                [3066, 3067, 3068]
            ]
        }
    },
    FORGE_MATERIAL_XP = {
        34: 10,
        29: 5,
        314: 7,
        265: 5,
        266: 7,
        1012: 12,
        1013: 18,
        1014: 25,
        264: 5,
        259: 10,
        50: 20,
        291: 30,
        1301: 30,
        296: 10,
        64: 40,
        173: 80,
        174: 120,
        175: 150,
        176: 40,
        177: 80,
        178: 120,
        179: 150,
        1125: 40,
        1126: 80,
        1127: 120,
        1128: 150,
        1303: 40,
        1304: 80,
        1305: 120,
        1306: 150,
        1581: 100,
        1579: 85,
        1302: 5,
        371: 80,
        369: 30,
        370: 30,
        949: 60,
        950: 70,
        256: 70,
        255: 65,
        252: 60,
        250: 40,
        199: 30,
        201: 20,
        216: 30,
        270: 2,
        271: 4,
        272: 4,
        273: 4,
        274: 2,
        202: 15,
        384: 45,
        396: 35,
        397: 35,
        398: 35,
        399: 35,
        2793: 35,
        2794: 35,
        2795: 35,
        2796: 35,
        197: 40,
        386: 50,
        153: 40,
        219: 20,
        1438: 10,
        263: 30,
        258: 40,
        257: 50,
        262: 60,
        195: 60,
        658: 60,
        1448: 75,
        597: 26,
        2129: 30,
        2130: 34,
        313: 8,
        594: 13,
        595: 17,
        596: 20,
        1868: 8,
        1870: 8,
        224: 40,
        254: 25,
        253: 50,
        911: 100,
        231: 20,
        584: 165,
        947: 480,
        983: 10,
        982: 40,
        981: 30,
        968: 300,
        388: 85,
        390: 95,
        904: 200,
        1399: 100,
        1398: 100,
        1312: 120,
        1311: 120,
        1886: 40,
        2910: 50,
        2919: 35,
        2918: 25,
        2923: 95,
        2924: 105,
        2921: 50,
        2922: 60,
        2926: 35,
        2925: 120,
        2920: 70
    },
    Market = {
        max_market_offers: 20,
        upgrade_prices: {
            5: 2E6,
            10: 5E6,
            15: 15E6
        },
        upgrade_prices_mos: {
            5: 200,
            10: 500,
            15: 1500
        },
        upgrade_offers_dialog: function() {
            Popup.dual_prompt(_ti("Upgrade your max market offers by 5?"), thousandSeperate(Market.upgrade_prices[players[0].params.market_offers]) + " " + _ti("coins"), function() {
                    Socket.send("market_upgrade", {
                        type: "coins"
                    })
                }, thousandSeperate(Market.upgrade_prices_mos[players[0].params.market_offers]) +
                " MOS",
                function() {
                    Socket.send("market_upgrade", {
                        type: "mos"
                    })
                })
        },
        open: function(a) {
            "undefined" == typeof a && (a = !1);
            addClass(document.getElementById("chest"), "hidden");
            a || (document.getElementById("market_search_category").value = -1, document.getElementById("market_search_results").innerHTML = "", Market.update_search_item_list(), Market.new_offer = !0);
            removeClass(document.getElementById("market"), "hidden");
            removeClass(document.getElementById("market_search_area"), "hidden");
            addClass(document.getElementById("market_offer_area"),
                "hidden");
            addClass(document.getElementById("market_new_offer"), "hidden");
            addClass(document.getElementById("market_transactions"), "hidden");
            windowOpen = !0
        },
        open_specific: function(a) {
            switch (a) {
                case "new_offer":
                    Market.client_new_offer();
                    break;
                case "transactions":
                    Market.client_transactions()
            }
        },
        update_search_item_list: function() {
            var a = document.getElementById("market_search_category").value,
                b = document.getElementById("market_search_item");
            if (-2 == a) removeClass(document.getElementById("market_search_item_input"),
                "hidden"), addClass(document.getElementById("market_search_item"), "hidden"), addClass(document.getElementById("market_search_player_input"), "hidden");
            else if (-3 == a) removeClass(document.getElementById("market_search_player_input"), "hidden"), addClass(document.getElementById("market_search_item"), "hidden"), addClass(document.getElementById("market_search_item_input"), "hidden");
            else if (-4 == a) addClass(document.getElementById("market_search_player_input"), "hidden"), addClass(document.getElementById("market_search_item"),
                "hidden"), addClass(document.getElementById("market_search_item_input"), "hidden");
            else {
                var d = b.children;
                addClass(document.getElementById("market_search_item_input"), "hidden");
                addClass(document.getElementById("market_search_player_input"), "hidden");
                removeClass(document.getElementById("market_search_item"), "hidden");
                for (var e = -1; e < item_categories[a].items.length; e++) {
                    var f = !!d[e + 1],
                        g = d[e + 1] || document.createElement("option");
                    g.selected = -1 == e ? !0 : !1;
                    g.value = -1 == e ? -1 : item_categories[a].items[e].id; - 1 == e ?
                        (g.textContent = "-- " + _ti("All") + " --", g.setAttribute("data-tu", "-- $ti('All') --")) : g.textContent = _tn(item_categories[a].items[e].name);
                    f || b.appendChild(g)
                }
                for (; item_categories[a].items.length < d.length - 1;) b.removeChild(d[d.length - 1])
            }
        },
        init_item_category: function() {
            item_categories = {};
            item_categories.length = ITEM_CATEGORY_COUNT;
            item_categories[-1] = {
                id: -1,
                name: "-- " + _ti("All categories") + " --",
                key: "-- $ti('All categories') --",
                items: []
            };
            item_categories[-2] = {
                id: -2,
                name: "-- " + _ti("By item") + " --",
                key: "-- $ti('By item') --",
                items: []
            };
            item_categories[-3] = {
                id: -3,
                name: "-- " + _ti("By player") + " --",
                key: "-- $ti('By player') --",
                items: []
            };
            item_categories[-4] = {
                id: -4,
                name: "-- " + _ti("My chest") + " --",
                key: "-- $ti('My chest') --",
                items: []
            };
            for (var a = 0; a < ITEM_CATEGORY_COUNT; a++) item_categories[a] = {
                id: a,
                name: _ti(ITEM_CATEGORY[a]),
                key: ITEM_CATEGORY[a],
                items: []
            };
            for (var a = 0, b = item_base.length; a < b; a++) item_base[a].params.no_buy || (item_categories[item_base[a].b_t].items.push({
                    id: a,
                    count: 1E4,
                    name: item_base[a].name,
                    trans: _tn(item_base[a].name)
                }),
                item_categories[-1].items.push({
                    id: a,
                    count: 1E4,
                    name: item_base[a].name,
                    trans: _tn(item_base[a].name)
                }));
            var d = document.getElementById("market_search_category");
            if ("undefined" != typeof d) {
                d.innerHTML = "";
                for (a = -4; a < ITEM_CATEGORY_COUNT; a++) item_categories[a].items = sortArrayOfObjectsByFieldValueAsc(item_categories[a].items, "trans"), b = document.createElement("option"), b.selected = -1 == a ? !0 : !1, b.value = item_categories[a].id, b.innerHTML = item_categories[a].name, 0 > a ? b.setAttribute("data-tu", item_categories[a].key) :
                    b.setAttribute("data-ti", item_categories[a].key), d.appendChild(b);
                if (supports.datalist) {
                    var e = item_categories[-1].items,
                        f = document.getElementById("item_datalist");
                    f.innerHTML = "";
                    a = 0;
                    for (b = e.length; a < b; a++) {
                        var g = new Option(e[a].name, e[a].name);
                        g.setAttribute("data-tn", e[a].name);
                        f.appendChild(g)
                    }
                }
                d.value = -1
            }
        },
        is_near: function(a, b) {
            if ("undefined" == typeof a || "object" != typeof b || !b) return !1;
            if (300 == a.map && "undefined" != typeof iamserver) {
                var d = {
                    i: b.i - 10,
                    j: b.j - 10
                };
                if (!PlayerMap.can_see(a.name, a.params.island,
                        d)) return !1;
                d = PlayerMap.get_object(a.params.island, d);
                return !d || !d.activities || d.activities[0] != ACTIVITIES.ACCESS || 1 < distance(a.i, a.j, b.i, b.j) ? !1 : !0
            }
            return 1 >= distance(a.i, a.j, b.i, b.j) && a.map == b.map ? !0 : !1
        },
        client_search: function() {
            var a = document.getElementById("market_search_type").value,
                b = document.getElementById("market_search_category").value,
                d = !1;
            if ("-2" == b) {
                for (var e = -1, f = [], g = document.getElementById("market_search_item_input").value.toLowerCase(), h = 0, l = item_base.length; h < l; h++) - 1 != _tn(item_base[h].name).toLowerCase().indexOf(g) &&
                    f.push(h);
                if (300 < f.length) return Popup.dialog(_ti("Too many items match {search}. Please specify!", {
                    search: g
                }), null_function)
            } else if ("-3" == b) e = -1, f = [], d = document.getElementById("market_search_player_input").value.toLowerCase();
            else if ("-4" == b)
                for (e = -1, f = [], h = 0, l = chests[0].length; h < l; h++) f.push(parseInt(chests[0][h].id));
            else e = document.getElementById("market_search_item").value, f = [];
            g = document.getElementById("market_search_max_price").value;
            h = document.getElementById("market_search_min_price").value;
            Timers.running("market_cooldown") || (Socket.send("market_search", {
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j,
                options: {
                    type: a,
                    item_id: e,
                    item_ids: f,
                    category_id: b,
                    max_price: g,
                    min_price: h,
                    player: d
                }
            }), Timers.set("market_cooldown", null_function, 200))
        },
        client_search_results: function(a) {
            for (var b = 0, d = a.length; b < d; b++) a[b].classes = b % 2 ? "row even" : "row";
            market_results = a;
            document.getElementById("market_search_results").innerHTML = Market.client_search_results_template()({
                results: a
            })
        },
        client_transaction_offers: function(a) {
            for (var b =
                    0, d = a.length; b < d; b++) a[b].available = parseInt(a[b].available), a[b].classes = b % 2 ? "row even" : "row";
            market_transaction_offers = a;
            document.getElementById("market_transaction_offers").innerHTML = Market.client_transaction_offers_template()({
                results: a
            })
        },
        client_transaction_items: function(a) {
            for (var b = 0; b < a.length; b++) a[b].classes = b % 2 ? "row even" : "row", 0 == a[b].count && (a[b].item_id = -1, a[b].count = a[b].total_price, a[b].total_price = 0);
            market_transaction_items = a;
            document.getElementById("market_transaction_items").innerHTML =
                Market.client_transaction_items_template()({
                    results: a
                })
        },
        client_get_offer_index: function(a) {
            for (var b = 0, d = market_results.length; b < d; b++)
                if (market_results[b].id == a) return b;
            return -1
        },
        client_open_offer: function(a) {
            a = Market.client_get_offer_index(a);
            "undefined" != typeof market_results[a] && (addClass(document.getElementById("market_search_area"), "hidden"), addClass(document.getElementById("market_new_offer"), "hidden"), removeClass(document.getElementById("market_offer_area"), "hidden"), document.getElementById("market_offer_area").innerHTML =
                Market.client_open_offer_template()(market_results[a]), Market.client_update_coins_amount())
        },
        client_new_offer: function() {
            addClass(document.getElementById("market_search_area"), "hidden");
            addClass(document.getElementById("market_offer_area"), "hidden");
            addClass(document.getElementById("market_transactions"), "hidden");
            removeClass(document.getElementById("market_new_offer"), "hidden");
            document.getElementById("market_new_offer").innerHTML = Market.client_new_offer_template()();
            Market.client_update_new_offer_items();
            Market.client_update_coins_amount()
        },
        client_transactions: function() {
            addClass(document.getElementById("market_search_area"), "hidden");
            addClass(document.getElementById("market_offer_area"), "hidden");
            addClass(document.getElementById("market_new_offer"), "hidden");
            removeClass(document.getElementById("market_transactions"), "hidden");
            Socket.send("market_transaction", {
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            })
        },
        client_update_coins_amount: function() {
            var a = thousandSeperate(players[0].temp.coins);
            updateElementHTML("market_offer_player_coins", a);
            updateElementHTML("market_new_offer_player_coins", a)
        },
        client_accept_offer: function(a) {
            var b = {
                count: parseInt(document.getElementById("market_offer_amount").value),
                id: a,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            };
            a = market_results[Market.client_get_offer_index(a)];
            if (0 == a.type) {
                if (players[0].temp.coins < b.count * a.price) return addChatText(_te("Not enough coins"), void 0, COLOR.PINK)
            } else if (Chest.player_chest_item_count(0, a.item_id) <
                b.count) return addChatText(_te("Not enough items!"), void 0, COLOR.PINK);
            Socket.send("market_accept_offer", b)
        },
        client_accept_item: function(a) {
            Timers.running("accept_item" + a) || (Socket.send("market_accept_item", {
                id: a,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            }), Timers.set("accept_item" + a, null_function, 1E4))
        },
        client_cancel_offer: function(a) {
            Socket.send("market_cancel_offer", {
                id: a,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            })
        },
        client_extend_offer: function(a) {
            Socket.send("market_extend_offer", {
                id: a,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            })
        },
        client_make_offer: function(a) {
            a = {
                type: parseInt(document.getElementById("market_new_offer_search_type").value),
                item_id: parseInt(document.getElementById("market_new_offer_items_item").value),
                to_player: document.getElementById("market_offer_player").value,
                price: parseInt(document.getElementById("market_new_offer_price").value),
                count: parseInt(document.getElementById("market_new_offer_amount").value),
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j
            };
            var b = item_base[a.item_id];
            if (!a.to_player && 1 == a.type && a.price < Math.floor(.1 * b.params.price)) return Popup.dialog(_ti("Buying price for this item must be at least {amount} (10%)", {
                amount: Math.floor(.1 * b.params.price)
            }), null_function);
            Socket.send("market_make_new_offer", a)
        },
        client_update_new_offer_items: function() {
            var a = document.getElementById("market_new_offer_search_type").value;
            document.getElementById("market_new_offer_items").innerHTML = "";
            "0" == a ? (document.getElementById("market_new_offer_items").innerHTML =
                Market.client_items_template()(chest_content), sortSelect(document.getElementById("market_new_offer_items_item"))) : (a = -1, 0 < arguments.length && (a = arguments[0]), document.getElementById("market_new_offer_items").innerHTML = Market.client_category_template()(item_categories) + Market.client_items_template()(item_categories[a].items), document.getElementById("market_new_offer_items_category").value = a);
            Market.client_update_new_offer_item_change()
        },
        client_update_new_offer_item_change: function() {
            var a = document.getElementById("market_new_offer_items_item"),
                b;
            "" === a.value ? b = 0 : (b = a.options[a.selectedIndex], b = b.getAttribute("data-count"), document.getElementById("market_new_offer_price").value = item_base[a.value].params.price);
            document.getElementById("market_new_offer_count").innerHTML = b;
            Market.client_new_offer_update_total_cost()
        },
        client_update_new_offer_category_change: function() {
            Market.client_update_new_offer_items(document.getElementById("market_new_offer_items_category").value)
        },
        client_items_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_items_template &&
                (CompiledTemplate.market_client_items_template = Handlebars.compile("<select class='market_select' style='min-width:140px;max-width:140px;' name='' onchange='Market.client_update_new_offer_item_change();' id='market_new_offer_items_item'>{{#each this}}{{#if this.count}}<option value='{{this.id}}' data-count='{{this.count}}'>{{item_name this.id}}</option>{{/if}}{{/each}}</select>"));
            return CompiledTemplate.market_client_items_template
        },
        client_category_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_category_template &&
                (CompiledTemplate.market_client_category_template = Handlebars.compile("<select style='min-width:140px;max-width:140px;' class='market_select' name='' onchange='Market.client_update_new_offer_category_change();' id='market_new_offer_items_category'><option value='-1' data-ti='All categories'>-- {{__t 'All categories'}} --</option><option value='-2' data-ti='By item'>-- {{__t 'By item'}} --</option><option value='-3' data-ti='By player'>-- {{__t 'By player'}} --</option><option value='-4' data-ti='My chest'>-- {{__t 'My chest'}} --</option>{{#each this}}{{#not_negative this.id}}<option value='{{this.id}}'>{{this.name}}</option>{{/not_negative}}{{/each}}</select>"));
            return CompiledTemplate.market_client_category_template
        },
        client_update_total_cost: function(a) {
            a = Market.client_get_offer_index(a);
            var b = parseInt(document.getElementById("market_offer_amount").value);
            0 < b && b <= market_results[a].count ? document.getElementById("market_total_cost").innerHTML = thousandSeperate(market_results[a].price * b) : document.getElementById("market_total_cost").innerHTML = ""
        },
        client_new_offer_update_total_cost: function() {
            var a = parseInt(document.getElementById("market_new_offer_price").value),
                a = Math.range(a, 0, 9999999999);
            document.getElementById("market_new_offer_price").value = a;
            var b = parseInt(document.getElementById("market_new_offer_amount").value),
                d = parseInt(document.getElementById("market_new_offer_count").innerHTML),
                b = Math.range(b, 1, d);
            document.getElementById("market_new_offer_amount").value = b;
            document.getElementById("market_new_offer_total_cost").innerHTML = thousandSeperate(a * b)
        },
        client_search_results_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_search_results_template &&
                (CompiledTemplate.market_client_search_results_template = Handlebars.compile("<table class='table scrolling_allowed' style='margin-bottom:10px;'><tbody class='scrolling_allowed'><tr class='scrolling_allowed'><th style='padding-right:5px;'>{{_t 'Item'}}</th><th>{{_t 'Count'}}</th><th style='padding-left:5px;'>{{_t 'Price'}}</th><th>{{_t 'User'}}</th></tr>{{#each results}}<tr class='{{this.classes}} scrolling_allowed' onclick='Market.client_open_offer({{this.id}})'>  <td class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td style='text-align:center;' class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{item_price this.price}}</td>  <td class='scrolling_allowed'>{{this.player}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.market_client_search_results_template
        },
        client_transaction_offers_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_transaction_offers_template && (CompiledTemplate.market_client_transaction_offers_template = Handlebars.compile("{{_t 'Offers'}}<table class='table scrolling_allowed'><tbody><tr><th>{{_t 'Type'}}</th><th>{{_t 'Item'}}</th><th>{{_t 'Count'}}</th><th>{{_t 'Price'}}</th><th></th></tr>{{#each results}}<tr class='scrolling_allowed {{this.classes}} {{#if this.available}}green{{else}}red{{/if}}' onclick='Market.client_cancel_offer({{this.id}})'>  <td class='scrolling_allowed'>{{#if this.type}}{{_t 'Buy'}}{{else}}{{_t 'Sell'}}{{/if}}</td>  <td class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{item_price this.price}}</td>  <td class='scrolling_allowed'><b>{{_t 'Remove'}}</b></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.market_client_transaction_offers_template
        },
        client_transaction_items_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_transaction_items_template && (CompiledTemplate.market_client_transaction_items_template = Handlebars.compile("{{_t 'Items'}}<table class='table scrolling_allowed'><tbody><tr><th>{{_t 'Item'}}</th><th>{{_t 'Count'}}</th><th>{{_t 'From'}}</th><th></th></tr>{{#each results}}<tr class='scrolling_allowed {{this.classes}}{{#if this.reason}} tooltip' title='{{this.reason}}'{{else}}'{{/if}} onclick='Market.client_accept_item({{this.id}})'>  <td class='scrolling_allowed'>{{item_name this.item_id}}</td>  <td class='scrolling_allowed'>{{this.count}}</td>  <td class='scrolling_allowed'>{{this.from_player}}</td>  <td class='scrolling_allowed'><b>{{_t 'Accept'}}</b></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.market_client_transaction_items_template
        },
        client_open_offer_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_open_offer_template && (CompiledTemplate.market_client_open_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr style='line-height:28px' class='offer_line'><td style='width: 96px;'>{{_t 'Item'}}</td><td><span style='vertical-align: bottom;margin-right: 4px;padding-bottom: -26px;line-height: 32px;'>{{item_name this.item_id}}</span><div style='{{item_image this.item_id}}width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;'>&nbsp;</div></td></tr><tr style='line-height:28px' class='offer_line even'><td>{{_t 'Description'}}</td><td>{{item_stats this.item_id}}</td></tr><tr style='line-height:28px' class='offer_line'><td>{{_t 'Vendor'}}</td><td>{{this.player}}</td></tr><tr style='line-height:28px' class='offer_line even'><td>{{_t 'Price'}}</td><td>{{item_price this.price}}</td></tr><tr style='line-height:28px' class='offer_line'><td>{{_t 'Count'}}</td><td><input id='market_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_update_total_cost({{this.id}});'> of {{this.count}}</td></tr><tr style='line-height:28px' class='offer_line even'><td>{{_t 'Total cost'}}</td><td><b id='market_total_cost'>{{item_price this.price}}</b></td></tr><tr style='line-height:28px' class='offer_line'><td></td><td><button onclick='javascript:Market.client_accept_offer({{this.id}})' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{#if this.type}}{{_t 'Sell'}}{{else}}{{_t 'Buy'}}{{/if}}</button></td></tr></tbody></table><div style='position: absolute;bottom: 2px;right: 4px;'>{{_t 'You have'}} <span id='market_offer_player_coins'></span> {{_t 'coins'}}</div>"));
            return CompiledTemplate.market_client_open_offer_template
        },
        client_new_offer_template: function() {
            "undefined" == typeof CompiledTemplate.market_client_new_offer_template && (CompiledTemplate.market_client_new_offer_template = Handlebars.compile("<table style='text-align: left;border: 1px #666666 solid;width: 100%;margin: 0px;margin-top: 20px;' class='table'><tbody><tr style='line-height:28px' class='offer_line'><td>{{_t 'Type'}}</td><td><select id='market_new_offer_search_type' onchange='Market.client_update_new_offer_items();' class='market_select'><option value='0' data-ti='Sell'>{{__t 'Sell'}}</option><option value='1' data-ti='Buy'>{{__t 'Buy'}}</option></select></td></tr><tr style='line-height:28px' class='offer_line even'><td style='width: 96px;'>{{_t 'Item'}}</td><td id='market_new_offer_items'></td></tr><tr style='line-height:28px' class='offer_line'><td>{{_t 'To'}}</td><td><input type='text' class='market_select' placeholder='{{__t 'Everybody'}}' data-tp='Everybody' id='market_offer_player' list='player_datalist'/></td></tr><tr style='line-height:28px' class='offer_line even'><td>{{_t 'Price'}}</td><td><input type='number' id='market_new_offer_price' onchange='Market.client_new_offer_update_total_cost();' class='market_select'/></td></tr><tr style='line-height:28px' class='offer_line'><td>{{_t 'Count'}}</td><td><input id='market_new_offer_amount' type='number' autocomplete='off' style='width:85px;' value='1' class='market_select' onchange='Market.client_new_offer_update_total_cost();'> {{_t 'out of'}} <span id='market_new_offer_count'>0</span></td></tr><tr style='line-height:28px' class='offer_line even'><td>{{_t 'Total cost'}}</td><td><b id='market_new_offer_total_cost'>0</b></td></tr><tr style='line-height:28px' class='offer_line'><td></td><td><button onclick='javascript:Market.client_make_offer()' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Make offer'}}</button></td></tr></tbody></table><span>* {{_t 'Each offer lasts 24 hours. You can have {amount} active offers.' amount='helper[market_offers]'}}{{#can_upgrade_market_offers}}<br/><button class='market_select pointer' onclick='Market.upgrade_offers_dialog();'>{{_t 'Upgrade'}}</button>{{/can_upgrade_market_offers}}</span><div style='position: absolute;bottom: 2px;right: 4px;'>{{_t 'You have'}} <span id='market_new_offer_player_coins'></span> {{_t 'coins'}}</div>"));
            return CompiledTemplate.market_client_new_offer_template
        },
        new_offer: !0,
        find_buy: function(a) {
            chest_npc && Market.is_near(players[0], chest_npc) && Market.market_search(0, a)
        },
        find_sell: function(a) {
            chest_npc && Market.is_near(players[0], chest_npc) && Market.market_search(1, a)
        },
        market_search: function(a, b) {
            Market.open(!1);
            document.getElementById("market_search_category").value = "-1";
            document.getElementById("market_search_type").value = a;
            document.getElementById("market_search_item").value = b;
            Timers.set("market_search",
                function() {
                    Market.client_search()
                }, 100)
        }
    },
    Duel = {
        dialog: function(a) {
            document.getElementById("duelling_form").style.display = "block";
            document.getElementById("duelling_no_running").checked = a.running_not_allowed;
            document.getElementById("duelling_no_magic").checked = a.magic_not_allowed;
            for (var b = 0; 4 > b; b++) {
                var d = document.getElementById("duel_my_" + b);
                d.style.background = "";
                d = document.getElementById("duel_other_" + b);
                d.style.background = ""
            }
            duelling_options = a;
            var e = Duel.hash(a);
            duel_inventory = [];
            for (b = 0; 24 > b; b++)
                if (d =
                    document.getElementById("duel_inv_" + b), removeClass(d, "selected"), "undefined" != typeof players[0].temp.inventory[b]) {
                    duel_inventory[b] = players[0].temp.inventory[b];
                    var f = item_base[players[0].temp.inventory[b].id];
                    d.style.background = Items.get_background(f.b_i)
                } else d.style.background = "";
            my_stake = [];
            other_stake = [];
            document.getElementById("duelling_accept").innerHTML = _ti("Accept");
            addClass(document.getElementById("duelling_other"), "hidden");
            a.attacker == players[0].id ? (my_stake = a.first_stake, other_stake =
                a.second_stake, duelling_options.first_accept == e && (document.getElementById("duelling_accept").innerHTML = _ti("Duel!"), duelling_options.first_confirm == e && (document.getElementById("duelling_accept").innerHTML = _ti("Waiting for other player..."))), duelling_options.second_accept == e && duelling_options.second_confirm == e && removeClass(document.getElementById("duelling_other"), "hidden")) : (my_stake = a.second_stake, other_stake = a.first_stake, duelling_options.second_accept == e && (document.getElementById("duelling_accept").innerHTML =
                _ti("Duel!"), duelling_options.second_confirm == e && (document.getElementById("duelling_accept").innerHTML = _ti("Waiting for other player..."))), duelling_options.first_accept == e && duelling_options.first_confirm == e && removeClass(document.getElementById("duelling_other"), "hidden"));
            for (b = 0; b < my_stake.length; b++) d = document.getElementById("duel_my_" + b), removeClass(d, "selected"), "undefined" != typeof my_stake[b] ? (f = item_base[my_stake[b]], d.style.background = Items.get_background(f.b_i)) : d.style.background = "";
            for (b =
                0; b < other_stake.length; b++) d = document.getElementById("duel_other_" + b), removeClass(d, "selected"), "undefined" != typeof other_stake[b] ? (f = item_base[other_stake[b]], d.style.background = Items.get_background(f.b_i)) : d.style.background = ""
        },
        stake: function(a) {
            "undefined" != typeof players[0].temp.inventory[a] && Socket.send("duel_stake", {
                inventory_slot: a
            })
        },
        stake_remove: function(a) {
            "undefined" != typeof my_stake[a] && Socket.send("duel_stake_remove", {
                slot: a
            })
        },
        send_settings: function() {
            Socket.send("duel_settings", {
                running_not_allowed: document.getElementById("duelling_no_running").checked,
                magic_not_allowed: document.getElementById("duelling_no_magic").checked
            })
        },
        last_button_press: 0,
        duel_button: function() {
            if (1E3 > timestamp() - Duel.last_button_press) return Popup.dialog(_te("Please check the duel settings and don't double click Accept"), null_function);
            Duel.last_button_press = timestamp();
            var a = Duel.hash(duelling_options),
                b = !1;
            duelling_options.attacker == players[0].id ? duelling_options.first_accept == a && (b = !0) : duelling_options.second_accept == a && (b = !0);
            b ? Socket.send("duel_confirm", {
                hash: a
            }) : Socket.send("duel_accept", {
                hash: a
            })
        },
        hash: function(a) {
            var b = a.magic_not_allowed ? "t" : "f",
                b = b + (a.running_not_allowed ? "t" : "f"),
                b = b + ("f" + a.first_stake.join("!"));
            return b += "s" + a.second_stake.join("?")
        }
    },
    CompiledTemplate = {},
    HandlebarTemplate = {
        player_more_info: function() {
            "undefined" == typeof CompiledTemplate.player_more_info && (CompiledTemplate.player_more_info = Handlebars.compile("<table><tr><td>{{_t 'First name'}}</td><td><input type='text' id='first_name' value='{{this.first_name}}' class='market_select'/></td></tr><tr><td>{{_t 'Last name'}}</td><td><input type='text' id='last_name' value='{{this.last_name}}' class='market_select'/></td></tr><tr><td>{{_t 'E-mail'}}</td><td><input type='email' id='email' value='{{this.email}}' class='market_select'/></td></tr><tr><td>{{_t 'Country'}}</td><td><select id='country' class='market_select' value='{{this.country}}'>{{#each this.countries}}<option value='{{this.short}}'>{{this.name}}</option>{{/each}}</select></td></tr><tr><td>{{_t 'Birthday'}}</td><td><select id='month' class='market_select' placeholder='{{__t 'Month'}}'>{{#each this.months}}<option value='{{this.short}}'>{{this.name}}</option>{{/each}}</select><select id='day' class='market_select' placeholder='{{__t 'Day'}}'>{{#each this.days}}<option value='{{this}}'>{{this}}</option>{{/each}}</select><select id='year' class='market_select' placeholder='{{__t 'Year'}}'>{{#each this.years}}<option value='{{this}}'>{{this}}</option>{{/each}}</select></td></tr><tr><td>{{_t 'Newsletter'}}</td><td><input type='checkbox' id='newsletter' {{#if this.newsletter}}checked{{/if}}/></td></tr><tr><td></td><td><button class='market_select pointer' onclick='Player.save_more_info();'>{{_t 'Save'}}</button>&nbsp;&nbsp;&nbsp;<button class='market_select pointer' onclick=\"Player.save_more_info();reset_password(document.getElementById('email').value);Popup.dialog('Check your e-mail for further instructions.', null_function);\">{{_t 'Reset password'}}</button></td></tr></table><br/>{{_t 'We won`t share your data with anybody.'}} <br/>{{_t 'NB! E-mail is required to reset password.'}}"));
            return CompiledTemplate.player_more_info
        },
        referral_dialog: function() {
            "undefined" == typeof CompiledTemplate.referral_dialog && (CompiledTemplate.referral_dialog = Handlebars.compile("\r\n      <h4>{{_t 'Please share the love!'}}</h4>\r\n      <span>{{_t 'Use the link or buttons below to spread the word.'}}</span>\r\n      <br><br>\r\n      <span>{{_t 'You will earn [bold]{percent}%[/bold] of all MOS purchases made by people you have invited!' percent=30}}</span>\r\n      <br><br>\r\n      <input class='market_select' type='text' value='http://rpg-de.mo.ee/?ref={{this.player}}' style='width:308px;'/>\r\n      <br><br>\r\n      <div id='social_media_32'>\r\n        <a class='facebook' href='https://www.facebook.com/sharer/sharer.php?u={{this.url}}' target='_blank' title='Facebook'></a>\r\n        <a class='twitter' href='https://twitter.com/intent/tweet?text={{this.title}}%20pic.twitter.com/ocjsjK1XrQ&url={{this.url}}&via=RPGMO' target='_blank' title='Twitter'></a>\r\n        <a class='googleplus' href='https://plus.google.com/share?url={{this.url}}' target='_blank' title='Google+'></a>\r\n        <a class='pinterest' href='https://www.pinterest.com/pin/create/button/?url={{this.url}}&description={{this.title}}&media=https%3A%2F%2Fmo.mo.ee%2Fimg%2Fpinterest.jpg' target='_blank' title='Pinterest'></a>\r\n        <a class='tumblr' href='https://www.tumblr.com/share/link?url={{this.url}}&name=RPG%20MO&description={{this.title}}&' target='_blank' title='Tumblr'></a>\r\n        <a class='vk' href='https://vk.com/share.php?url={{this.url}}&title=RPG%20MO&description={{this.title}}&image=https%3A%2F%2Fmo.mo.ee%2Fimg%2Ficon310x150.png&noparse=true' target='_blank' title='VK'></a>\r\n        <a class='email' href='mailto:?subject=RPG%20MO&body={{this.url}}' target='_blank' title='E-mail'></a>\r\n      </div>\r\n      <br>\r\n      <span>{{_t 'You`ve invited [bold]{referrals}[/bold], earned [bold]{earned}[/bold] MOS' referrals=this.referrals earned=this.total_earned}}</span>\r\n      "));
            return CompiledTemplate.referral_dialog
        },
        referral_dialog_kongregate: function() {
            "undefined" == typeof CompiledTemplate.referral_dialog_kongregate && (CompiledTemplate.referral_dialog_kongregate = Handlebars.compile("\r\n      <h4>{{_t 'Please share the love!'}}</h4>\r\n      <span>Invite your Kongregate friends!</span>\r\n      <br><br>\r\n      <span>{{_t 'You will earn [bold]{percent}%[/bold] of all MOS purchases made by people you have invited!' percent=30}}</span>\r\n      <br><br>\r\n      <button class='market_select' onclick='Player.show_kongregate_invite_box(\"{{this.player}}\")'>Start inviting</button>\r\n      <br><br>\r\n      <br>\r\n      <span>{{_t 'You`ve invited [bold]{referrals}[/bold], earned [bold]{earned}[/bold] MOS' referrals=this.referrals earned=this.total_earned}}</span>\r\n      "));
            return CompiledTemplate.referral_dialog_kongregate
        },
        referral_dialog_mocospace: function() {
            "undefined" == typeof CompiledTemplate.referral_dialog_kongregate && (CompiledTemplate.referral_dialog_kongregate = Handlebars.compile("\r\n      <h4>{{_t 'Please share the love!'}}</h4>\r\n      <span>Invite your MocoSpace friends!</span>\r\n      <br><br>\r\n      <span>{{_t 'You will earn [bold]{percent}%[/bold] of all MOS purchases made by people you have invited!' percent=30}}!</span>\r\n      <br><br>\r\n      <button class='market_select' onclick='Player.show_mocospace_invite_box(\"{{this.player}}\")'>Start inviting</button>\r\n      <br><br>\r\n      <br>\r\n      <span>{{_t 'You`ve invited [bold]{referrals}[/bold], earned [bold]{earned}[/bold] MOS' referrals=this.referrals earned=this.total_earned}}</span>\r\n      "));
            return CompiledTemplate.referral_dialog_kongregate
        },
        consecutive_login_dialog: function() {
            "undefined" == typeof CompiledTemplate.consecutive_login_dialog && (CompiledTemplate.consecutive_login_dialog = Handlebars.compile("\r\n      <span>{{_t 'Today is your no. [bold]{amount}[/bold] consecutive login day' amount=this.day}}</span><br><br>\r\n      {{#each this.days}}\r\n        <div style='width: 80px;text-align: center;border: solid 1px #666666;float: left; margin-right: {{this.margin_right}}px;'>\r\n          <div style='background: rgb(97, 97, 97);'>{{_t 'Day {amount}' amount=this.day}}</div>\r\n          <div style='background: {{this.bgcolor}};height: 48px;padding-top: 16px;'>\r\n          <div style='width: 32px; height: 32px; {{reward_background this.reward}};margin-left: 23px;' onclick='addChatText(\"{{__t 'Description'}}: {{reward_description this.reward}}\", undefined, COLOR.TEAL);'>&nbsp;</div>\r\n          </div><span>{{_tu this.message}}</span>\r\n        </div>\r\n      {{/each}}\r\n      "));
            return CompiledTemplate.consecutive_login_dialog
        },
        magic_slots: function() {
            "undefined" == typeof CompiledTemplate.magic_slots && (CompiledTemplate.magic_slots = Handlebars.compile("{{#each this.magics}}<div class='magic_outer' style='{{magic_image this.id}}'><div class='magic_inner' id='magic_slot_{{this.i}}' onclick='Player.client_use_magic({{this.i}})' onmouseover='mouseOverMagic({{this.i}})' onmouseout='mouseOutMagic({{this.i}})'>{{this.count}}</div></div>{{/each}}"));
            return CompiledTemplate.magic_slots
        },
        quiver: function() {
            "undefined" == typeof CompiledTemplate.quiver && (CompiledTemplate.quiver = Handlebars.compile("<div class='quiver_outer' style='{{item_image this.id}}'><div class='quiver_inner' id='quiver_slot' onmouseover='mouseOverQuiver()' onmouseout='mouseOutQuiver()' onclick='Archery.remove_arrows();'>{{this.count}}</div></div>"));
            return CompiledTemplate.quiver
        },
        carpentry_formulas: function() {
            "undefined" == typeof CompiledTemplate.carpentry_formulas && (CompiledTemplate.carpentry_formulas = Handlebars.compile("<button class='market_select pointer scrolling_allowed' onclick='Carpentry.only_available_formulas(true);'>{{_t 'Only available'}}</button><button class='market_select pointer scrolling_allowed' onclick='Carpentry.only_available_formulas(false);'>{{_t 'All formulas'}}</button><br/>{{#each this}}{{#carpentry_formula_available this.id}}<span class='carpentry_formula scrolling_allowed'><span>{{item_name this.item_id}}</span><div style='width: 54px;height: 49px;margin-left: 33px;{{carpentry_image this.item_id 0}}' item_id='{{this.item_id}}'></div>{{#each this.consumes}}<span style='display: block;' class='scrolling_allowed'><div class='small_material_icon tooltip scrolling_allowed' title='{{item_name this.id}}' style='{{item_image this.id}}'></div><span style='{{#chest_count this.id this.count}}{{else}}color:red;font-weight:bold;text-shadow: 1px 1px 1px black;{{/chest_count}}'>{{this.count}}</span></span>{{/each}}<div style='position:absolute; bottom: 5px;width: 100%;' class='scrolling_allowed'>{{#met_level_requirements \"carpentry\" this.level}}{{#if this.craftable}}{{#carpentry_has_enough_materials this.id}}<span class='common_link' onclick='Carpentry.make({{this.id}})'>{{_t 'Make'}}</span>{{/carpentry_has_enough_materials}}{{/if}}{{else}}<span>{{this.level}} {{_t 'carpentry'}}</span>{{/met_level_requirements}}<span class='common_link {{#chest_count this.item_id 1}}{{else}}hidden{{/chest_count}}' onclick='Carpentry.place({{this.id}})'>{{_t 'Place'}}</span></div></span>{{/carpentry_formula_available}}{{/each}}"));
            return CompiledTemplate.carpentry_formulas
        },
        carpentry_buildings_menu: function() {
            "undefined" == typeof CompiledTemplate.carpentry_buildings_menu && (CompiledTemplate.carpentry_buildings_menu = Handlebars.compile("{{#each this}}<span class='scrolling_allowed' style='display:block; padding-bottom: 10px;'><span class='scrolling_allowed' style='display:block; padding-bottom:2px;'>{{_t this.name}} {{#if this.show_level}}({{_t 'current level'}} {{this.level}}){{/if}}</span><div class='health health-red scrolling_allowed' style='width: 215px;height:22px'><div class='health-green scrolling_allowed' style='width:{{this.percent}}%;'>&nbsp;</div><span class='scrolling_allowed' style='line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 215px;'>{{this.percent}}%</span></div>{{#if this.can_provide_materials}}<button class='market_select pointer scrolling_allowed' id='building_menu_button' onclick='Carpentry.building_button(\"{{this.name}}\");' style='line-height: 18px;padding: 1px;margin: 0px 0px 0px 255px;width:115px;'>{{_t 'Provide materials'}}</button>{{/if}}</span>{{/each}}"));
            return CompiledTemplate.carpentry_buildings_menu
        },
        small_build_menu: function() {
            "undefined" == typeof CompiledTemplate.small_build_menu && (CompiledTemplate.small_build_menu = Handlebars.compile("{{#if this.building}}<span class='common_link' style='line-height:30px;display:block;' onclick='Build.menu()'>{{_t 'Open build menu'}}</span>{{/if}}{{#if this.remove}}<span class='common_link' style='line-height:30px;display:block;' onclick='Build.remove_mode()'>{{_t 'Remove objects'}}</span>{{/if}}"));
            return CompiledTemplate.small_build_menu
        },
        build_menu: function() {
            "undefined" == typeof CompiledTemplate.build_menu && (CompiledTemplate.build_menu = Handlebars.compile("<span style='border-bottom: 1px solid gray; display: block; text-align:right;margin: 0px;' class='common_link' onclick='Carpentry.place_close();'>{{_t 'Close'}}</span><span style='width: 100%;display: block;'>{{item_name this.item_id}}</span><div style='width: 54px;height: 49px;margin-left: 23px;{{carpentry_image this.item_id this.rotate}}'></div><span style='border-top: 1px solid gray;width: 100%;display: block;margin: 0px;' class='common_link' onclick='Carpentry.place_rotate({{this.id}});'>{{_t 'Rotate'}}</span>"));
            return CompiledTemplate.build_menu
        },
        carpentry_remove_menu: function() {
            "undefined" == typeof CompiledTemplate.carpentry_remove_menu && (CompiledTemplate.carpentry_remove_menu = Handlebars.compile("<span style='border-bottom: 1px solid gray; display: block; text-align:right;margin: 0px;' class='common_link' onclick='Carpentry.place_close();'>{{_t 'Close'}}</span><span style='width: 100%;display: block;'>{{_t 'Current'}}:<br/>{{#if this}}{{_t 'Ground'}}{{else}}{{_t 'Objects'}}{{/if}}</span><span style='border-top: 1px solid gray;width: 100%;display: block;margin: 0px;line-height:30px;' class='common_link' onclick='Carpentry.category=\"floors\";Carpentry.remove_menu();'>{{_t 'Ground'}}</span><span style='width: 100%;display: block;margin: 0px;line-height:30px;' class='common_link' onclick='Carpentry.category=\"walls\";Carpentry.remove_menu();'>{{_t 'Objects'}}</span>"));
            return CompiledTemplate.carpentry_remove_menu
        },
        contacts_friends: function() {
            "undefined" == typeof CompiledTemplate.contacts_friends && (CompiledTemplate.contacts_friends = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:330px;width:330px' id='contacts_friends'><thead><tr><th>{{_t 'Player'}}</th><th>{{_t 'World'}}</th><th colspan='2' class='no-sort'>{{_t 'Actions'}}</th></tr></thead><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' >  <td class='{{#if this.online}}green{{else}}red{{/if}} scrolling_allowed'>{{this.name}}</td>  <td class='{{#if this.online}}green{{else}}red{{/if}} scrolling_allowed'>{{this.world}}</td>{{#if this.friend}}  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='ChatSystem.whisper(\"{{this.name}}\");'>{{_t 'Whisper'}}</button></td>  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.remove_friend(\"{{this.name}}\");'>{{_t 'Remove'}}</button></td>{{else}}  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.add_friend(\"{{this.name}}\");'>{{_t 'Accept'}}</button></td>  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.reject_friend(\"{{this.name}}\");'>{{_t 'Reject'}}</button></td>{{/if}}</tr>{{/each}}</tbody></table><button class='market_select pointer' style='margin-bottom:10px' onclick='Popup.input_prompt(\"{{__t 'Insert username'}}\", Contacts.add_friend, \"player_datalist\");'>{{_t 'Add a new friend'}}</button>"));
            return CompiledTemplate.contacts_friends
        },
        contacts_ignore: function() {
            "undefined" == typeof CompiledTemplate.contacts_ignore && (CompiledTemplate.contacts_ignore = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:330px;width:330px' id='contacts_ignores'><thead><tr><th>{{_t 'Player'}}</th><th class='no-sort'>{{_t 'Actions'}}</th></tr></thead><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' >  <td class='scrolling_allowed'>{{this}}</td>  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.remove_ignore(\"{{this}}\");'>{{_t 'Remove'}}</button></td></tr>{{/each}}</tbody></table><button class='market_select pointer scrolling_allowed' style='margin-bottom:10px' onclick='Popup.input_prompt(\"{{__t 'Insert username'}}\", Contacts.ignore_player, \"player_datalist\");'>{{_t 'Ignore a player'}}</button>"));
            return CompiledTemplate.contacts_ignore
        },
        contacts_channels: function() {
            "undefined" == typeof CompiledTemplate.contacts_channels && (CompiledTemplate.contacts_channels = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:330px;width:330px;margin-bottom:5px' id='contacts_channels'><thead><tr><th>{{_t 'Channel'}}</th><th class='no-sort'>{{_t 'Actions'}}</th></tr></thead><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' >  <td class='scrolling_allowed{{#private_channel this}} premium{{/private_channel}}'>{{this}} - {{channel_description this}}</td>{{#private_channel this}}<td class'scrolling_allowed>{{#not_subscribed_to_channel this}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.join_private_channel(\"{{this}}\");'>{{_t 'Subscribe'}}</button>{{else}}{{#channel_permission this 'invited'}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.join_private_channel(\"{{this}}\");'>{{_t 'Subscribe'}}</button>{{/channel_permission}}{{#channel_permission this 'joined'}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.show_members_request(\"{{this}}\");'>{{_t 'List'}}</button>{{/channel_permission}}{{#channel_permission this 'joined_non_owner'}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.leave_private_channel(\"{{this}}\");'>{{_t 'Unsubscribe'}}</button>{{/channel_permission}}{{#channel_permission this 'owner'}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.destroy_private_channel(\"{{this}}\");'>{{_t 'Destroy'}}</button>{{/channel_permission}}</td></tr><tr class='scrolling_allowed'><td colspan='2' id='channel_members_{{this}}'></td>{{/not_subscribed_to_channel}}{{else}}{{#subscribed_to_channel this}}  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.remove_channel(\"{{this}}\");'>{{_t 'Unsubscribe'}}</button></td>{{else}}  <td class='scrolling_allowed'><button class='market_select pointer scrolling_allowed' onclick='Contacts.add_channel(\"{{this}}\");'>{{_t 'Subscribe'}}</button></td>{{/subscribed_to_channel}}{{/private_channel}}</tr>{{/each}}</tbody></table>{{#owns_private_channel}}{{_t 'You already own a private channel'}}{{else}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.create_private_channel();'>{{_t 'Create a channel'}}</button>{{/owns_private_channel}}<div style='height:1px;width:100%;margin-bottom:10px;display:block;'></div>"));
            return CompiledTemplate.contacts_channels
        },
        channel_members: function() {
            "undefined" == typeof CompiledTemplate.channel_members && (CompiledTemplate.channel_members = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:328px;width:328px;margin-right:0px;'><thead><tr><th>{{_t 'Player'}}</th><th>{{_t 'Permissions'}}</th><th>{{_t 'Actions'}}</th></tr></thead><tbody>{{#each this.members}}<tr class='{{cycle_table}} scrolling_allowed' >  <td class='scrolling_allowed'>{{player}}</td>  <td class='scrolling_allowed'>{{#channel_permission this.channel 'owner'}}{{#has_channel_permission this.permissions 'joined'}}<select class='market_select' onchange='Contacts.change_permission_private_channel(\"{{player}}\", \"{{this.channel}}\")' id='private_channel_{{player}}_{{this.channel}}'><option value='1'{{selected 1 this.permissions}}>{{permissions_name 1}}</option><option value='3'{{selected 3 this.permissions}}>{{permissions_name 3}}</option><option value='7'{{selected 7 this.permissions}}>{{permissions_name 7}}</option></select>{{else}}{{permissions_name this.permissions}}{{/has_channel_permission}}{{else}}{{permissions_name this.permissions}}{{/channel_permission}}</td>  <td class='scrolling_allowed'>{{#channel_permission this.channel 'member_moderator'}}<button class='market_select pointer scrolling_allowed' onclick='Contacts.remove_private_channel_member(\"{{channel}}\", \"{{player}}\");'>{{_t 'Remove'}}</button>{{/channel_permission}}</td></tr>{{/each}}</tbody></table>{{#channel_permission this.channel 'member_moderator'}}<button class='market_select pointer scrolling_allowed' style='margin-bottom:2px;margin-top:2px;' onclick='Contacts.last_private_channel=\"{{this.channel}}\";Popup.input_prompt(\"{{__t 'Insert username'}}\", Contacts.invite_private_channel_member, \"player_datalist\");'>{{_t 'Invite'}}</button>{{/channel_permission}}"));
            return CompiledTemplate.channel_members
        },
        quests_active: function() {
            "undefined" == typeof CompiledTemplate.quests_active && (CompiledTemplate.quests_active = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr class='scrolling_allowed'><th>{{_t 'Task'}}</th><th>{{_t 'Progress'}}</th></tr>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed tooltip' title='{{__t 'Location'}}: {{this.location}}' onclick='Toolbar.update_quest({{this.id}})'>  <td class='scrolling_allowed' style='padding:0px;margin:0px;'><div style='width:32px;height:32px;display:inline-block;margin:0;padding:0;{{npc_image this.npc_id}}'></div><span style='line-height:32px;padding:0px;margin:0px;vertical-align:bottom;' class='scrolling_allowed'>{{_tq this.name}}</span></td>  <td class='scrolling_allowed'>{{this.progress}}/{{this.amount}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.quests_active
        },
        quests_completed: function() {
            "undefined" == typeof CompiledTemplate.quests_completed && (CompiledTemplate.quests_completed = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr><th>{{_t 'Task'}}</th><th></th></tr>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed tooltip' title='{{__t 'Reward'}} {{quest_reward this.id this.reward_result}}'>  <td class='scrolling_allowed' style='padding:0px;margin:0px;'><div style='width:32px;height:32px;display:inline-block;margin:0;padding:0;{{npc_image this.npc_id}}'></div><span style='line-height:32px;padding:0px;margin:0px;vertical-align:bottom;' class='scrolling_allowed'>{{_tq this.name}}</span></td>  <td class='scrolling_allowed'><button class='market_select pointer' onclick='Quests.restart(\"{{this.id}}\");'>{{_t 'Restart'}}</button></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.quests_completed
        },
        quests_party_list: function() {
            "undefined" == typeof CompiledTemplate.quests_party_list && (CompiledTemplate.quests_party_list = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed'>  <td class='scrolling_allowed' style='max-width: 140px;text-overflow: ellipsis;overflow: hidden;'>   <span class='scrolling_allowed'>{{this.name}}</span></td>  <td class='scrolling_allowed tooltip' title='{{__t 'Difficulty'}}' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.difficulty}}</span></td>  <td class='scrolling_allowed tooltip' title='{{__t 'Players'}}' style='min-width:30px;'>   <span class='scrolling_allowed'>{{this.players}}/4</span></td>  <td class='scrolling_allowed tooltip' title='{{__t 'Combat level'}}' style='min-width:55px;'>   <span class='scrolling_allowed'>{{this.levels_min}}-{{this.levels_max}}</span></td>{{#if this.combat}} {{#if this.join}}  <td class='scrolling_allowed' style='min-width:48px;'><button class='market_select pointer' onclick='Socket.send(\"party_quest\",{sub: \"join_party\", party_id:{{this.id}} });'>{{_t 'Join'}}{{this.extra}}</button></td> {{else}}  <td class='scrolling_allowed' style='min-width:48px;'><button class='market_select pointer' onclick='Player.request_client_logout(\"{{this.world}}\");'>{{_t 'World'}} {{this.world}}{{this.extra}}</button></td> {{/if}}{{else}} {{#if this.join}}  <td class='scrolling_allowed' style='min-width:48px;'><button class='market_select pointer' onclick='PartyQuests.not_within_boundaries();'>{{_t 'Join'}}{{this.extra}}</button></td> {{else}}  <td class='scrolling_allowed' style='min-width:48px;'><button class='market_select pointer' onclick='PartyQuests.not_within_boundaries();'>{{_t 'World'}} {{this.world}}{{this.extra}}</button></td> {{/if}}{{/if}}</tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.quests_party_list
        },
        quests_hall_of_fame: function() {
            "undefined" == typeof CompiledTemplate.quests_hall_of_fame && (CompiledTemplate.quests_hall_of_fame = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr><th></th><th>{{_t 'Player'}}</th><th>{{_t 'Points'}}</th><th>{{_t 'Wins'}}</th><th>{{_t 'Plays'}}</th></tr>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' {{#if this.me}}style='font-weight:bold'{{/if}}>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.position}}</span></td>  <td class='scrolling_allowed' style='max-width: 140px;text-overflow: ellipsis;overflow: hidden;'>   <span class='scrolling_allowed'>{{this.player}}</span></td>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.points}}</span></td>  <td class='scrolling_allowed' style='min-width:30px;'>   <span class='scrolling_allowed'>{{this.wins}}</span></td>  <td class='scrolling_allowed' style='min-width:55px;'>   <span class='scrolling_allowed'>{{this.plays}}</span></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.quests_hall_of_fame
        },
        quests_new: function() {
            "undefined" == typeof CompiledTemplate.quests_new && (CompiledTemplate.quests_new = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr class='scrolling_allowed'><td colspan='2'><font color='" + COLOR.PINK + "' style='font-weight:bold;text-shadow:0px 0px 2px #000000;'>{{_t 'Items are NOT safe if you die in a party dungeon.'}}</font></td></tr><tr class='{{cycle_table}} scrolling_allowed'>  <td class='scrolling_allowed' style='vertical-align:middle'>   <span class='scrolling_allowed'>{{_t 'Difficulty'}}</span></td>  <td class='scrolling_allowed'> <select id='quest_difficulty' class='market_select' onchange='PartyQuests.update_difficulty_cooldown();' style='min-width:100px'> <option value='0' data-ti='Easy'>{{__t 'Easy'}}</option> <option value='1' {{#if this.normal_disabled}}disabled{{/if}} data-ti='Normal'>{{__t 'Normal'}}</option> <option value='2' {{#if this.hard_disabled}}disabled{{/if}} data-ti='Hard'>{{__t 'Hard'}}</option> <option value='3' {{#if this.hell_disabled}}disabled{{/if}} data-ti='Hell'>{{__t 'Hell'}}</option> </select>   </td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_t 'Cooldown'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><span id='difficulty_cooldown'></span></td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>   <input type='checkbox' id='quest_friends_only' onclick='void(0);'><label for='quest_friends_only'>{{_t 'Friends only'}}</label>  </td>  <td class='scrolling_allowed'>   </td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{#if timer}}{{_t 'Time remaining'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><span id='quest_new_time_remaining'>{{_tc '{count} minute' count=this.time_remaining}}</span></td><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>-1x {{_tu '{item_name}' item_name='helper[item_name,1031]'}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:PartyQuests.reduce_time();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_tc '{count} minute' count=-60}}</button>{{else}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:PartyQuests.create_new();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Create'}}</button>{{/if}}  </td></tr></tbody></table>"));
            return CompiledTemplate.quests_new
        },
        quests_active_party: function() {
            "undefined" == typeof CompiledTemplate.quests_active_party && (CompiledTemplate.quests_active_party = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr class='{{cycle_table}} scrolling_allowed'>  <td class='scrolling_allowed' style='vertical-align:middle'>   <span class='scrolling_allowed'>{{_t 'Difficulty'}}</span></td>  <td class='scrolling_allowed'>{{this.difficulty}}</td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>   {{_t 'Combat level'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{this.levels_min}}-{{this.levels_max}}   </td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_t 'Players'}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{this.player_count}}/4</td></tr>{{#each this.players}}<tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{this.name}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{#if this.owner}}<button class='market_select pointer' onclick='Socket.send(\"party_quest\",{sub: \"kick_party\", party_id:{{this.id}}, player: \"{{this.name}}\" });'>{{_t 'Kick'}}</button>{{/if}}</td></tr>{{/each}}<tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button class='market_select pointer' onclick='Socket.send(\"party_quest\",{sub: \"leave_party\", party_id:{{this.id}} });'>{{_t 'Leave'}}</button></td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{#if this.owner}}<button class='market_select pointer' onclick='Socket.send(\"party_quest\",{sub: \"start_party\", party_id:{{this.id}} });'>{{_t 'Start'}}</button>{{/if}}</td></tr></tbody></table>"));
            return CompiledTemplate.quests_active_party
        },
        loot_master_results: function() {
            "undefined" == typeof CompiledTemplate.loot_master_results && (CompiledTemplate.loot_master_results = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:100%' id='loot_master_table'><thead><tr><th>{{_t 'Item'}}</th><th class='sort-number'>{{_t 'Count'}}</th></tr></thead><tbody>{{#each results}}<tr class='{{cycle_table}} scrolling_allowed' onclick='Chest.pvp_loot_put({{this.item_id}})'>  <td class='scrolling_allowed' item_id='{{this.item_id}}'>{{item_name this.item_id}}</td>  <td class='scrolling_allowed'>{{this.count}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.loot_master_results
        },
        pet_nest: function() {
            "undefined" == typeof CompiledTemplate.pet_nest && (CompiledTemplate.pet_nest = Handlebars.compile('<span class="common_border_bottom"><span style="float:left; font-weight: bold;color:#FFFF00;">{{_t "Pet Nest"}}</span>{{#if this.other_nest}}<span class="common_link" style="margin: 0px;margin-bottom: 2px;margin-right: 20px;" onclick="Breeding.other({{this.other_nest.i}},{{this.other_nest.j}});">{{_t "Access mate`s nest"}}</span>{{/if}}<span class="common_link" style="margin: 0px;margin-bottom: 2px;margin-right: 20px;" onclick="Breeding.formulas();">{{_t "Formulas"}}</span><span class="common_link" style="margin:0px;margin-bottom:2px;" onclick="addClass(document.getElementById(\'pet_nest_form\'),\'hidden\');">{{_t "Close"}}</span></span><span style="float:right;line-height:20px;width:180px;">{{_t "Inventory"}}</span><span style="line-height:20px;">{{#if this.pet_item_id}}{{item_name this.pet_item_id}}{{else}}{{_t "No pet"}}{{/if}}</span><br/><div class="inv_item" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.pet_item_id}}" item_id="{{this.pet_item_id}}">&nbsp;</div>{{#if this.pet_id}}<button class="market_select pointer" onclick="Breeding.cancel();" style="margin-left:3px;">{{_t "Remove pet"}}</button>{{/if}}{{#if this.breed}}<button class="market_select pointer" onclick="Breeding.breed();" style="margin-left:20px;">{{_t "Breed"}}</button>{{/if}}<div id="pet_nest_inventory" style="float:right;width:180px;">{{#each this.inventory}}<div class="inv_item" style="{{item_image this.id}}" onclick="Breeding.inventory_click({{#if this.i}}{{this.i}}{{else}}false{{/if}}, {{#if ../pet_id}}true{{else}}false{{/if}});" item_id="{{this.id}}">&nbsp;</div>{{/each}}</div><br/>{{#if this.pet_id}}<span>{{_t "Happiness"}}</span><div class="health health-red scrolling_allowed tooltip" style="width: 180px;height:22px;margin-top: 5px;" title="{{__t "Happy in {time} minutes" time=this.happiness_time}}"><div class="health-green scrolling_allowed" style="width:{{this.happiness}}%;">&nbsp;</div><span class="scrolling_allowed" style="line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 180px;">{{this.happiness}}%</span></div>{{#if this.show_hunger}}<span style="display:block; padding-top: 2px;">{{_t "Hunger"}}</span><div class="health health-green scrolling_allowed tooltip" style="width: 180px;height:22px;position:relative;margin-top: 5px;" title="{{__t "Dies from famine in {time} minutes" time=this.hunger_time}}"><div class="health-red scrolling_allowed" style="width:{{this.hunger}}%;position:absolute;height:100%;max-width:100%;min-width:0%;">&nbsp;</div><span class="scrolling_allowed" style="line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 180px;">{{this.hunger}}%</span></div>{{else}}<br><br><br>{{/if}}{{#if this.insure}}<button class="market_select pointer" onclick="Breeding.insure({{this.pet_id}})" style="float:right; color:rgb(255, 116, 116);">{{_t "Insure pet"}}</button>{{/if}}<span style="line-height: 34px;margin-right: 5px;">{{_t "Likes"}}</span>{{#each this.likes}}<div class="inv_item tooltip" title="{{item_name this}}" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this}}" item_id="{{this}}">&nbsp;</div>{{/each}}<br/><span style="line-height: 34px;margin-right: 5px;">{{_t "Eats"}}</span>{{#each this.eats}}<div class="inv_item tooltip" title="{{item_name this}}" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this}}" item_id="{{this}}">&nbsp;</div>{{/each}}{{/if}}'));
            return CompiledTemplate.pet_nest
        },
        trivia_host: function() {
            "undefined" == typeof CompiledTemplate.trivia_host && (CompiledTemplate.trivia_host = Handlebars.compile("\r\n      <table class='scrolling_allowed'>\r\n        {{#each this}}\r\n        <tr class='scrolling_allowed'>\r\n          <td class='scrolling_allowed'>\r\n          {{_t 'Question'}} {{inc @index}}&nbsp;&nbsp;&nbsp;<span class='common_link' onclick='Minigames.trivia.remove_question({{@index}})'>{{_t 'Remove'}}</span>\r\n          </td></tr><tr class='scrolling_allowed'><td class='scrolling_allowed'>\r\n            <input type='text' id='trivia_host_question_{{@index}}' onchange='Minigames.trivia.update_question({{@index}})' value='{{this.question}}' style='width:100%'/>\r\n          </td></tr><tr class='scrolling_allowed'><td class='scrolling_allowed'>\r\n            {{_t 'Answers'}}<i>({{_t 'Separate possible right answers by a semicolon'}})</i>\r\n          </td></tr><tr class='scrolling_allowed'><td class='scrolling_allowed'>\r\n            <input type='text' id='trivia_host_question_answers_{{@index}}' onchange='Minigames.trivia.update_question({{@index}})' value='{{this.answers}}' style='width:100%'/>\r\n          </td>\r\n        </tr><tr class='scrolling_allowed' style='line-height:10px;'><td>&nbsp;</td></tr>\r\n        {{/each}}\r\n          <tr style='line-height: 22px;'><td><span class='common_link' onclick='Minigames.trivia.add_question()'>{{_t 'Add question'}}</span></td></tr>\r\n        </table>\r\n      "));
            return CompiledTemplate.trivia_host
        },
        trivia_client: function() {
            "undefined" == typeof CompiledTemplate.trivia_client && (CompiledTemplate.trivia_client = Handlebars.compile("\r\n      <table class='scrolling_allowed' style='width:100%'>\r\n        <tr>\r\n          <td style='width:50%; vertical-align: top;'>\r\n            <h3>{{_t 'Top players'}}:</h3>\r\n            {{#each this.scores}}\r\n              {{#if this.visible}}\r\n                {{#if this.bold}}<b>{{else}}<span>{{/if}}\r\n                {{this.name}} - {{this.score}}\r\n                {{#if this.bold}}</b>{{else}}</span>{{/if}}\r\n                <br>\r\n              {{/if}}\r\n            {{/each}}\r\n          </td>\r\n          <td style='vertical-align: top;'>\r\n            <b>{{this.question}}</b><br><br>\r\n            {{#if this.button}}\r\n              <input type='text' placeholder='{{__t 'Your answer'}}' class='market_select' style='width:171px;' id='trivia_answer'/>\r\n            <br>\r\n            <input type='submit' value='{{__t 'Answer'}}' style='float:right' class='market_select pointer' onclick='Minigames.trivia.submit_answer();'/>\r\n            {{/if}}\r\n            <br><br>\r\n            <span style='float: right;bottom: 2px;position: absolute;right: 2px;'>{{_t 'Time remaining'}}: <b id='trivia_time_remaining'>1:00</b></span>\r\n          </td>\r\n        </tr>\r\n      </table>\r\n      "));
            return CompiledTemplate.trivia_client
        },
        arena_host_skills: function() {
            "undefined" == typeof CompiledTemplate.arena_host_skills && (CompiledTemplate.arena_host_skills = Handlebars.compile("\r\n      <table class='scrolling_allowed' style='width:100%'>\r\n        <tr><th>{{_t 'Skill'}}</th><th>{{_t 'Level'}}</th><th>{{_t 'Xp rate'}}</th></tr>\r\n        {{#each this}}\r\n        <tr class='scrolling_allowed'>\r\n          <td style='text-align: center' class='scrolling_allowed'>{{_t this.name}}</td>\r\n          <td style='text-align: center' class='scrolling_allowed'><input type='number' style='width:100px' class='market_select scrolling_allowed' id='arena_host_skill_{{@key}}' value='{{this.level}}' onchange='Minigames.arena.update_skills(this)'/></td>\r\n          <td style='text-align: center' class='scrolling_allowed'><input type='number' style='width:100px' class='market_select scrolling_allowed' id='arena_host_multiplier_{{@key}}' value='{{this.multiplier}}' onchange='Minigames.arena.update_skills(this)'/></td>\r\n        </tr>\r\n        {{/each}}\r\n      </table>\r\n      "));
            return CompiledTemplate.arena_host_skills
        },
        arena_host_inventory: function() {
            "undefined" == typeof CompiledTemplate.arena_host_inventory && (CompiledTemplate.arena_host_inventory = Handlebars.compile("\r\n        {{item_categories_select 'arena_host_inventory' '1'}}\r\n        <select id='arena_host_inventory_items' class='market_select' style='max-width:150px;' onchange='Minigames.arena.host_inventory_update_description();'></select>\r\n        <button class='market_select' onclick='Minigames.arena.host_inventory_add_item()'>{{__t 'Add'}}</button>\r\n        <div id='arena_host_inventory_item_img' class='inv_item'>&nbsp;</div><span id='arena_host_inventory_item_description'></span>\r\n        <br><br>{{_t 'Inventory'}}:<br>\r\n        {{#each this}}\r\n        <div onclick='Minigames.arena.host_inventory_remove_item({{@index}})' oncontextmenu='Items.get_info({{this.id}})' class='inv_item tooltip' title='{{item_name this.id}}' style='border:solid 1px #666666;display:inline-block;width:32px;height:32px;margin: 0px; margin-top: 3px;{{item_image this.id}}'>&nbsp;</div>\r\n        {{/each}}\r\n      "));
            return CompiledTemplate.arena_host_inventory
        },
        arena_host_start: function() {
            "undefined" == typeof CompiledTemplate.arena_host_start && (CompiledTemplate.arena_host_start = Handlebars.compile("\r\n        <div style='line-height: 20px;'>\r\n        <table>\r\n        <tr><td style='width: 150px;'>{{_t 'Preparation time'}}</td><td style='width:60px;'><input id='arena_host_start_preparation_time' onchange='Minigames.arena.host_start_update(this)' value='{{this.preparation_time}}' style='width: 50px' class='market_select' type='number'/></td><td>{{_tc 'min'}}</td></tr>\r\n        <tr><td>{{_t 'Maximum arena time'}}</td><td><input id='arena_host_start_maximum_time' onchange='Minigames.arena.host_start_update(this)' value='{{this.maximum_arena_time}}' style='width: 50px' class='market_select' type='number'/></td><td>{{_tc 'min'}}</td></tr>\r\n        <tr><td>{{_t 'Bet amount'}}</td><td><input id='arena_host_start_bet_amount' onchange='Minigames.arena.host_start_update(this)' value='{{this.bet_amount}}' style='width: 50px' class='market_select' type='number'/></td><td>{{_t 'coins'}}</td></tr>\r\n        <tr><td>{{_t 'Maximum allowed bets'}}</td><td><input id='arena_host_start_maximum_bets' onchange='Minigames.arena.host_start_update(this)' value='{{this.maximum_bets}}' style='width: 50px' class='market_select' type='number'/></td><td></td></tr>\r\n        <tr><td>{{_t 'Teams'}}</td><td><input id='arena_host_start_teams' onchange='Minigames.arena.host_start_update(this)' {{#if this.teams}}checked{{/if}} type='checkbox' /></td><td></td></tr>\r\n        <tr><td>{{_t 'Keep items on death'}}</td><td><input id='arena_host_start_keep_items' onchange='Minigames.arena.host_start_update(this)' {{#if this.keep_items}}checked{{/if}} type='checkbox' /></td><td></td></tr>\r\n        <tr><td>{{_t 'Victory condition'}}</td><td colspan='2'><select id='arena_host_start_victory_condition' onchange='Minigames.arena.host_start_update(this)' value='{{this.victory_condition}}' style='width: 140px' class='market_select'>\r\n        <option value='0'>{{__t 'Last man standing'}}</option>\r\n        <option value='1'>{{__t 'Most kills'}}</option>\r\n        <option value='2'>{{__t 'Total experience'}}</option>\r\n        </select></td><td></td></tr>\r\n        <tr><td>{{_t 'Maximum respawns'}}</td><td><input id='arena_host_start_maximum_respawns' onchange='Minigames.arena.host_start_update(this)' value='{{this.maximum_respawns}}' style='width: 50px' class='market_select' type='number'/></td><td></td></tr>\r\n        </table>\r\n        </div>\r\n        <button class='market_select' onclick='Minigames.arena.host_start_start()'>{{__t 'Start'}}</button>\r\n      "));
            return CompiledTemplate.arena_host_start
        },
        arena_client_join: function() {
            "undefined" == typeof CompiledTemplate.arena_client_join && (CompiledTemplate.arena_client_join = Handlebars.compile("\r\n        <div style='line-height: 20px;'>\r\n        {{_t 'Players'}} {{this.players}}/{{this.max_players}}<br>\r\n        {{#if this.join_button}}\r\n          {{#if this.teams}}\r\n            <button class='market_select' onclick='Minigames.arena.client_join_button(\"red\");'>{{__t 'Join Red Team'}}</button> {{_t 'Members'}}: {{this.red_players}}\r\n            <br>\r\n            <button class='market_select' onclick='Minigames.arena.client_join_button(\"blue\");'>{{__t 'Join Blue Team'}}</button> {{_t 'Members'}}: {{this.blue_players}}\r\n            <br><br>\r\n            {{_t 'You may be shuffled into another team if teams are too uneven.'}}\r\n          {{else}}\r\n          <button class='market_select' onclick='Minigames.arena.client_join_button();'>{{__t 'Join'}}</button>\r\n          {{/if}}\r\n        {{/if}}\r\n        </div>\r\n      "));
            return CompiledTemplate.arena_client_join
        },
        arena_client_bet: function() {
            "undefined" == typeof CompiledTemplate.arena_client_bet && (CompiledTemplate.arena_client_bet = Handlebars.compile("\r\n        <div style='line-height: 20px;'>\r\n        {{cycle_init}}\r\n        <table class='table scrolling_allowed' style='min-width:330px;width:330px;'><tr><th>{{_t 'Name'}}</th><th>{{_t 'Total bets'}}</th><th>{{_t 'Your bet'}}</th><th></th></tr>\r\n          {{#each this.bets}}\r\n            {{#if this.name}}\r\n            <tr class='{{cycle_table}} scrolling_allowed'>\r\n            <td>{{this.name}}</td>\r\n            <td>{{this.total}}</td>\r\n            <td>{{this.my}}</td>\r\n            <td>\r\n              <button class='market_select' onclick='Minigames.arena.client_bet_make_bet({{this.id}})'>\r\n              {{__t 'Bet'}} {{../bet_amount}}\r\n              </button></td>\r\n            </tr>\r\n            {{/if}}\r\n          {{/each}}\r\n        </table>\r\n        </div>\r\n        <br><div>{{_t 'Winnings will only be paid out if you are online and in the same world'}}</div>\r\n      "));
            return CompiledTemplate.arena_client_bet
        },
        arena_client_rules: function() {
            "undefined" == typeof CompiledTemplate.arena_client_rules && (CompiledTemplate.arena_client_rules = Handlebars.compile("\r\n        <div style='line-height: 20px;'>\r\n        {{cycle_init}}\r\n        <table class='table' style='min-width:330px;width:330px;'>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Preparation time'}}</td><td>{{this.preparation_time}} {{_tc 'min'}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Maximum arena time'}}</td><td>{{this.maximum_arena_time}} {{_tc 'min'}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Bet amount'}}</td><td>{{this.bet_amount}} {{_t 'coins'}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Maximum allowed bets'}}</td><td>{{this.maximum_bets}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Keep items on death'}}</td><td>{{#if this.keep_items}}{{_t 'Yes'}}{{else}}{{_t 'No'}}{{/if}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Maximum respawns'}}:</td><td>{{this.maximum_respawns}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Victory condition'}}:</td><td>{{_t this.victory_condition}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td>{{_t 'Host'}}</td><td>{{this.host}}</td></tr>\r\n          <tr class='{{cycle_table}}'><td colspan='2'>{{_t 'Be on the arena map when the arena starts!'}}</td></tr>\r\n        </table>\r\n        </div>\r\n      "));
            return CompiledTemplate.arena_client_rules
        },
        arena_client_stats: function() {
            "undefined" == typeof CompiledTemplate.arena_client_stats && (CompiledTemplate.arena_client_stats = Handlebars.compile("\r\n        <div style='line-height: 20px;'>\r\n        {{#if this.available}}\r\n        <div style='float:left;max-width:175px;'><table class='table scrolling_allowed' style='width: 175px;min-width: 100%;max-width: 175px;'><tr><th>{{_t 'Skill'}}</th><th>{{_t 'Level'}}</th><th>{{_t 'Xp rate'}}</th></tr>\r\n        {{cycle_init}}\r\n        {{#each this.data.skills}}\r\n        <tr class='{{cycle_table}} scrolling_allowed'>\r\n          <td>{{_t this.name}}</td>\r\n          <td>{{this.level}}</td>\r\n          <td>{{this.multiplier}}</td>\r\n        </tr>\r\n        {{/each}}</table></div>\r\n        <div style='float:right;width:45%;'>{{_t 'Inventory'}}:<br>\r\n        {{#each this.data.inventory}}\r\n        <div onclick='Items.get_info({{this.id}})' oncontextmenu='Items.get_info({{this.id}})' class='inv_item tooltip scrolling_allowed' title='{{item_name this.id}}' style='border:solid 1px #666666;display:inline-block;width:32px;height:32px;margin: 0px; margin-top: 3px;{{item_image this.id}}' item_id='{{this.id}}'>&nbsp;</div>\r\n        {{/each}}</div>\r\n        {{else}}\r\n        {{_t 'Stats and inventory will be available after arena has begun.'}}\r\n        {{/if}}\r\n        </div>\r\n      "));
            return CompiledTemplate.arena_client_stats
        },
        permissions_form: function() {
            "undefined" == typeof CompiledTemplate.permissions_form && (CompiledTemplate.permissions_form = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:280px;width:280px'><tbody>{{#foreach this.allowed}}{{#if $first}}<tr><th>{{_t 'Name'}}</th><th>&nbsp;</th></tr>{{/if}}<tr class='{{cycle_table}} scrolling_allowed' >  <td>{{this}}</td>  <td>{{#if ../remove_allowed}}<button class='market_select pointer' onclick='Carpentry.permissions_remove(\"{{this}}\");'>{{__t 'Remove'}}</button>{{/if}}</td></tr>{{/foreach}}</tbody></table>{{#if this.add_button_visible}}<button class='market_select pointer' onclick='Popup.input_prompt(\"{{__t 'Insert username'}}\", Carpentry.permissions_add, \"player_datalist\");'>{{__t 'Add a new player'}} {{this.current}}/{{this.maximum}}</button>{{/if}}"));
            return CompiledTemplate.permissions_form
        },
        mailbox_form: function() {
            "undefined" == typeof CompiledTemplate.mailbox_form && (CompiledTemplate.mailbox_form = Handlebars.compile("{{cycle_init}}{{#if this.owner}}<input type='checkbox' id='mailbox_friends_toggle' {{#if this.friends_only}}checked{{/if}} onclick='Mailbox.friends_toggle();' id='mailbox_friends_toggle' /><label for='mailbox_friends_toggle'>{{_t 'Only friends can see and post'}}</label><hr style='margin: 0.5em 0'>{{/if}}{{_t 'My message'}}<div style='float:right'><button class='market_select hidden' onclick='Mailbox.save_message();' id='mailbox_save_button'>{{__t 'Save'}}</button><button class='market_select' onclick='Mailbox.delete_message(\"{{this.me}}\");'>{{__t 'Delete'}}</button></div><textarea style='width:300px;margin-top:10px;' id='mailbox_my_message' onkeyup='Mailbox.change_my_message();' onchange='Mailbox.change_my_message();'>{{this.my_message}}</textarea><hr style='margin: 0.5em 0'>{{#each this.messages}}<div class='{{cycle_table}} scrolling_allowed' style='padding-top: 10px; padding-bottom: 10px;'><b>{{this.from_player}}</b> - {{this.date}}{{#if ../owner}}<div style='float:right'><button class='market_select' onclick='Mailbox.delete_message(\"{{this.from_player}}\");'>{{__t 'Delete'}}</button></div>{{/if}}<div>{{this.message}}</div></div>{{/each}}"));
            return CompiledTemplate.mailbox_form
        },
        streams_form: function() {
            "undefined" == typeof CompiledTemplate.streams_form && (CompiledTemplate.streams_form = Handlebars.compile("{{cycle_init}}<input type='text' class='market_select' style='width:330px;' placeholder='{{__t 'Search'}}' oninput='Spectate.filter_window(this.value)' value=''><table class='table scrolling_allowed' style='min-width:330px;width:330px'><thead><tr><th>{{_t 'Player'}}</th><th>{{_t 'Location'}}</th><th class='sort-number'>{{_t 'Idle time'}}</th><th class='sort-number'>{{_t 'Combat level'}}</th></tr></thead><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed spectate_row' onclick='Spectate.watch({{this.server}}, \"{{this.name}}\");'>  <td class='scrolling_allowed {{#if this.red}}red{{/if}}'>{{this.name}}</td>  <td class='scrolling_allowed'>{{this.location}}</td>  <td class='scrolling_allowed' data-sortvalue='{{this.idle_value}}'>{{this.idle}}</td>  <td class='scrolling_allowed'>{{this.combat_level}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.streams_form
        },
        teleport_book_form: function() {
            "undefined" == typeof CompiledTemplate.teleport_book_form && (CompiledTemplate.teleport_book_form = Handlebars.compile("<div style='margin-top: 12px; line-height: 20px;text-align: center;'>{{_t 'Teleport to'}} <select id='teleport_book_location' class='market_select'>{{#each this}}<option value=\"{{this}}\">{{this}}</option>{{/each}}</select><br><button style='margin-top: 14px;' class='market_select pointer' onclick='Player.teleport_book_call();'>{{__t 'OK'}}</button></div>"));
            return CompiledTemplate.teleport_book_form
        },
        secret_boss_scroll_form: function() {
            "undefined" == typeof CompiledTemplate.secret_boss_scroll_form && (CompiledTemplate.secret_boss_scroll_form = Handlebars.compile("<div style='margin-top: 12px; line-height: 20px;text-align: center;'>{{_t 'Teleport to'}} <select id='secret_boss_scroll_location' class='market_select'>{{#each this}}<option value=\"{{this}}\">{{this}}</option>{{/each}}</select><br><button style='margin-top: 14px;' class='market_select pointer' onclick='Player.secret_boss_scroll_call();'>{{__t 'OK'}}</button></div>"));
            return CompiledTemplate.secret_boss_scroll_form
        },
        minigames_scroll_form: function() {
            "undefined" == typeof CompiledTemplate.minigames_scroll_form && (CompiledTemplate.minigames_scroll_form = Handlebars.compile("<div style='margin-top: 12px; line-height: 20px;text-align: center;'>{{_t 'Teleport to'}} <select id='minigames_scroll_location' class='market_select'>{{#each this}}<option value=\"{{this}}\">{{__t this}}</option>{{/each}}</select><br><button style='margin-top: 14px;' class='market_select pointer' onclick='Minigames.use_scroll_call();'>{{__t 'OK'}}</button></div>"));
            return CompiledTemplate.minigames_scroll_form
        },
        cathedral_hall_of_fame: function() {
            "undefined" == typeof CompiledTemplate.cathedral_hall_of_fame && (CompiledTemplate.cathedral_hall_of_fame = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr><th></th><th>{{_t 'Player'}}</th><th>{{_t 'Level'}}</th><th>{{_t 'Time'}}</th><th>{{_t 'Plays'}}</th></tr>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' {{#if this.me}}style='font-weight:bold'{{/if}}>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.position}}</span></td>  <td class='scrolling_allowed' style='max-width: 140px;text-overflow: ellipsis;overflow: hidden;'>   <span class='scrolling_allowed'>{{this.player}}</span></td>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.level}}</span></td>  <td class='scrolling_allowed' style='min-width:30px;'>   <span class='scrolling_allowed'>{{time this.time}}</span></td>  <td class='scrolling_allowed' style='min-width:55px;'>   <span class='scrolling_allowed'>{{this.plays}}</span></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.cathedral_hall_of_fame
        },
        cathedral_new: function() {
            "undefined" == typeof CompiledTemplate.cathedral_new && (CompiledTemplate.cathedral_new = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr class='scrolling_allowed'><td colspan='2'><font color='" + COLOR.TEAL + "' style='font-weight:bold;text-shadow:0px 0px 2px #000000;'>{{_t 'Items are safe if you die in a cathedral run.'}}</font></td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_t 'Cooldown'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_tc '{count} hour' count=48}}</td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{#if timer}}{{_t 'Time remaining'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><span id='cathedral_time_remaining'>{{_tc '{count} minute' count=this.time_remaining}}</span></td><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>-1x {{_tu '{item_name}' item_name='helper[item_name,1031]'}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:Tower.client_reduce_time();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_tc '{count} minute' count=-60}}</button>{{else}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:Tower.client_start();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Start'}}</button>{{/if}}  </td></tr></tbody></table>"));
            return CompiledTemplate.cathedral_new
        },
        tower_new: function() {
            "undefined" == typeof CompiledTemplate.tower_new && (CompiledTemplate.tower_new = Handlebars.compile("{{cycle_init}}<table class='table scrolling_allowed' style='min-width:320px;width:320px'><tbody><tr class='scrolling_allowed'><td colspan='2'><font color='" + COLOR.TEAL + "' style='font-weight:bold;text-shadow:0px 0px 2px #000000;'>{{_t 'Items are safe if you die in a tower battle.'}}</font></td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_t 'Cooldown'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{_tc '{count} hour' count=48}}</td></tr><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>{{#if timer}}{{_t 'Time remaining'}}  </td>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><span>{{_tc '{count} minute' count=this.time_remaining}}</span></td><tr class='{{cycle_table}} scrolling_allowed' style='vertical-align:middle'>  <td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'>-1x {{_tu '{item_name}' item_name='helper[item_name,1031]'}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:Tower.client_reduce_time();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_tc '{count} minute' count=-60}}</button>{{else}}</td><td class='scrolling_allowed' style='vertical-align:middle;height: 24px;'><button onclick='javascript:Tower.client_start();' class='market_select pointer' style='margin: 0px;font-weight: bold;'>{{_t 'Start'}}</button>{{/if}}  </td></tr></tbody></table>"));
            return CompiledTemplate.tower_new
        },
        steam_highscores_options: function() {
            "undefined" == typeof CompiledTemplate.steam_highscores_options && (CompiledTemplate.steam_highscores_options = Handlebars.compile("<div><select id='steam_highscores_skill' onchange='Steam.highscore.fetch()' class='market_select'>{{#each this.skills}}<option value='{{this.value}}'>{{__t this.name}}</option>{{/each}}</select>{{#each this.types}}<a class='common_link' onclick='Steam.highscore.update_type(\"{{this.value}}\")'>{{_t this.name}}</a>{{/each}}</div><div id='steam_highscores_data' style='margin-top:10px;'>{{_t 'Loading data...'}}</div>"));
            return CompiledTemplate.steam_highscores_options
        },
        steam_highscores: function() {
            "undefined" == typeof CompiledTemplate.steam_highscores && (CompiledTemplate.steam_highscores = Handlebars.compile("{{cycle_init}}<div style='height:380px;display:block;overflow-x:hidden;'><table class='table scrolling_allowed' style='min-width:500px;width:500px;'><tbody><tr><th></th><th>{{_t 'Screenname'}}</th><th>{{_t 'Player'}}</th><th>{{_t 'Points'}}</th></tr>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed' {{#if this.me}}style='font-weight:bold'{{/if}}>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.rank}}</span></td>  <td class='scrolling_allowed' style='max-width: 240px;text-overflow: ellipsis;overflow: hidden;'>   <span class='scrolling_allowed'>{{this.screenname}}</span></td>  <td class='scrolling_allowed' style='max-width: 140px;text-overflow: ellipsis;overflow: hidden;'>   <span class='scrolling_allowed'>{{this.player}}</span></td>  <td class='scrolling_allowed' style='min-width:58px;'>   <span class='scrolling_allowed'>{{this.score}}</span></td></tr>{{/each}}</tbody></table></div>"));
            return CompiledTemplate.steam_highscores
        },
        rename_account: function() {
            "undefined" == typeof CompiledTemplate.rename_account && (CompiledTemplate.rename_account = Handlebars.compile("<table><tr><td><input type='password' id='rename_account_pass' value='' class='market_select' placeholder='{{__t 'Current password'}}' oninput='Player.rename.update();' style='margin:10px;'/></td></tr><tr><td><input type='text' id='rename_account_user' value='' class='market_select' placeholder='{{__t 'New account name'}}' oninput='Player.rename.update();' style='margin:10px;'/></td></tr><tr><td><button class='market_select pointer' onclick='Player.rename.action();' style='margin:10px;'>{{__t 'Change'}}</button></td></td><tr><td>{{_t 'This process will take about 10 seconds before you can log back in. Make sure you choose an appropriate name.'}}</td></table>"));
            return CompiledTemplate.rename_account
        },
        report_dialog: function() {
            "undefined" == typeof CompiledTemplate.report_dialog && (CompiledTemplate.report_dialog = Handlebars.compile("{{_t 'Reporting'}} <b>{{this.name}}</b><br>{{_t 'Reason'}} <select id='report_dialog_reason' class='market_select'>{{#each this.rules}}<option value='{{this.value}}'>{{__t this.name}}</option>{{/each}}</select><button class='market_select pointer same_height_button' onclick='Player.show_rules();'>{{__t 'Rules'}}</button><br>{{_t 'Optional message'}} <input type='text' id='report_dialog_message' class='market_select'/><br>{{#if this.whispers}}{{else}}<input type='checkbox' onchange='Report.toggle_whispers();' id='report_dialog_whispers' {{#if this.whispers}}checked{{/if}}/> <label for='report_dialog_whispers'>{{_t 'Include whispers'}}</label><br>{{_t 'Channels'}} <span id='report_dialog_channels'></span>{{/if}}<br>{{_t 'Log'}} - {{_t 'Last'}} <button class='market_select pointer' onclick='Report.set_time(5);'>5 {{_tc 'min'}}</button> <button class='market_select pointer' onclick='Report.set_time(10);'>10 {{_tc 'min'}}</button> <button class='market_select pointer' onclick='Report.set_time(15);'>15 {{_tc 'min'}}</button><br><div style='background-color: rgba(138, 138, 138, 0.3); border: 1px dashed #717171;height:128px;overflow:auto;overflow-x:hidden;user-select:text;' id='report_dialog_chat' class='scrolling_allowed'>...</div><input type='button' value='{{__t 'Submit'}}' class='market_select pointer' onclick='Report.send_confirm();'/> <b>{{_t 'Invalid reports may result in a ban'}}</b>"));
            return CompiledTemplate.report_dialog
        },
        report_channels_selected: function() {
            "undefined" == typeof CompiledTemplate.report_channels_selected && (CompiledTemplate.report_channels_selected = Handlebars.compile("{{#each this}}<span onclick='Report.remove_channel(\"{{this}}\")' class='common_link'>[{{this}}]</span> {{/each}}"));
            return CompiledTemplate.report_channels_selected
        },
        report_channels_dropdown: function() {
            "undefined" == typeof CompiledTemplate.report_channels_dropdown && (CompiledTemplate.report_channels_dropdown =
                Handlebars.compile("<select id='report_dialog_channels_select' class='market_select'>{{#each this}}<option value='{{this}}'>{{__t this}}</option>{{/each}}</select><button class='market_select pointer same_height_button' onclick='Report.add_channel()'>{{__t 'Add'}}</button>"));
            return CompiledTemplate.report_channels_dropdown
        },
        report_dialog_mod_list: function() {
            "undefined" == typeof CompiledTemplate.report_dialog_mod_list && (CompiledTemplate.report_dialog_mod_list = Handlebars.compile("{{cycle_init}}<table class='table' style='min-width:100%;width:100%'><thead><tr><th>Id</th><th>Name</th><th>Age</th><th>Status</th><th>Handler</th></tr></thead><tbody>{{#each this}}<tr class='{{cycle_table}} scrolling_allowed {{#if this.approved}}green{{/if}}{{#if this.disapproved}}red{{/if}}{{#if this.neutral}}orange{{/if}}' onclick='Report.open_report({{this.id}})'>  <td>{{this.id}}</td>  <td>{{this.name}}</td>  <td>{{this.created}}</td>  <td>{{this.status}}</td>  <td>{{this.handler}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.report_dialog_mod_list
        },
        report_dialog_mod: function() {
            "undefined" == typeof CompiledTemplate.report_dialog_mod && (CompiledTemplate.report_dialog_mod = Handlebars.compile("<button class='market_select pointer' onclick='Report.open_report_request();'>Back</button><br>Report of <b>{{this.name}}</b> by <select onchange='Report.show_report(this.value)' id='report_dialog_reporter'>{{#each this.reporters}}<option value='{{this}}'{{selected this ../reporter}}>{{this}}</option>{{/each}}</select><br>Reason(s) {{this.reasons}} <button class='market_select pointer same_height_button' onclick='Player.show_rules();'>Rules</button><br>Optional message(s) {{cycle_init}}{{#each this.optionals}}<div class='{{cycle_table}} scrolling_allowed'>{{this}}</div>{{/each}}<br>Log<br><div style='background-color: rgba(138, 138, 138, 0.3); border: 1px dashed #717171;height:128px;overflow:auto;overflow-x:hidden;user-select:text;' id='report_dialog_chat'>...</div>{{#if this.approved}}Approved{{else}}<button class='market_select pointer' onclick='Report.approve_report();'>Approve</button>{{/if}}{{#if this.disapproved}}Disapproved{{else}}<button class='market_select pointer' onclick='Report.disapprove_report();'>Disapprove</button>{{/if}}{{#if this.neutral}}Neutral{{else}}<button class='market_select pointer' onclick='Report.neutral_report();'>Neutral</button>{{/if}}{{#if this.muted}}1 hour mute by server{{/if}}"));
            return CompiledTemplate.report_dialog_mod
        },
        island_theme_dropdown: function() {
            "undefined" == typeof CompiledTemplate.island_theme_dropdown && (CompiledTemplate.island_theme_dropdown = Handlebars.compile("<span class='scrolling_allowed' style='display:block; padding-bottom: 10px;'><span class='scrolling_allowed' style='display:block; padding-bottom:2px;'>{{_t 'Island theme'}}</span><select id='island_theme_dropdown' class='market_select' style='width: 215px;height:22px'>{{#each this.tiles}}<option value='{{this.id}}'{{selected this.id ../current}} data-ti='{{this.name}}'>{{__t this.name}}</option>{{/each}}</select><button class='market_select pointer' style='line-height: 18px;padding: 1px;margin: 0px 0px 0px 38px;width:115px;' onclick='Carpentry.change_island_theme();'>{{_t 'Change'}}</button></span>"));
            return CompiledTemplate.island_theme_dropdown
        },
        fletching: function() {
            "undefined" == typeof CompiledTemplate.fletching && (CompiledTemplate.fletching = Handlebars.compile('<span style="float:right;line-height:20px;width:180px;">{{_t "Inventory"}}</br><div id="fletching_inventory" style="float:right;width:180px;">{{#each this.inventory}}<div class="inv_item" style="{{item_image this.id}}" onclick="Fletching.inventory_click({{#if this.id}}{{this.id}}{{else}}false{{/if}});" item_id="{{this.id}}">{{this.count}}&nbsp;</div>{{/each}}</div></span><span style="line-height:20px;"><table style="width: 180px; text-align: center;"><tr><td style="width: 60px;">{{_t "Metal"}}</td><td style="width: 60px;">{{_t "Wood"}}</td><td style="width: 60px;">{{_t "Feather"}}</td></tr><tr><td><div class="inv_item" style="{{item_image this.metal}}" item_id="{{this.metal}}">&nbsp;</div></td><td><div class="inv_item" style="{{item_image this.wood}}" item_id="{{this.wood}}">&nbsp;</div></td><td><div class="inv_item" style="{{item_image this.feather}}" item_id="{{this.feather}}">&nbsp;</div></td></tr><tr><td colspan="3"><span class="arrow-s" style="border-bottom:6px dotted transparent"></span></td></tr><tr><td colspan="3"><span style="line-height: 34px; position:absolute; left: 50px;">{{this.multiplier}}</span><div style="{{item_image this.arrow}}" class="inv_item {{#if this.arrow}}tooltip{{/if}}"  title="{{#if this.arrow}}{{item_name this.arrow}}{{/if}}" item_id="{{this.arrow}}">&nbsp;</div></td></tr></table><div class="health health-red scrolling_allowed" style="width: 180px;height:22px;position:relative;margin-top: 5px;"><div class="health-green scrolling_allowed" id="fletching-progress" style="width:{{this.progress}}%;position:absolute;height:100%;max-width:100%;min-width:0%;">&nbsp;</div><span class="scrolling_allowed" style="line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 180px;" id="fletching-progress-span">{{this.progress}}%</span></div><table style="width: 180px; text-align: center;"><tr><td colspan="3">{{#if this.error}}<span style="color:' +
                COLOR.PINK + ';font-weight:bold;text-shadow: 1px 1px 1px black;">{{this.error}}</span>{{else}}<button id="fletching-make" class="market_select pointer" style="line-height: 20px;margin-top: 6px;" onclick="Fletching.make();">{{__t "Make"}}</button><button id="fletching-stop" class="market_select pointer hidden" style="line-height: 20px;margin-top: 6px;" onclick="Fletching.stop();">{{__t "Stop"}}</button>{{/if}}</td></tr></table></span>'));
            return CompiledTemplate.fletching
        },
        fletching_formulas: function() {
            "undefined" ==
            typeof CompiledTemplate.fletching_formulas && (CompiledTemplate.fletching_formulas = Handlebars.compile('{{cycle_init}}<div style="float:right;width: 150px;line-height: 20px;margin-right: 27px;"><input class="market_select" type="text" id="fletching_search" placeholder="{{__t "Search"}}" onchange="Fletching.update_search()"></div><table style="width:250px;line-height:35px;text-align:left;" id="fletching_formulas_table"><thead><tr style="line-height:20px;text-align:center;"><th class="sort-number">{{_t "Level"}}</th><th class="no-sort">{{_t "Materials"}}</th><th class="sort-number">{{_t "XP"}}</th><th class="no-sort">{{_t "Result"}}</th></tr></thead><tbody>{{#each this}}<tr class="{{cycle_table}} scrolling_allowed fletching_formula_line"><td>{{this.level}}</td><td>{{#each this.pattern}}<div class="inv_item tooltip scrolling_allowed" style="{{item_image this}}" title="{{item_name this}}" onclick="Items.get_info({{this}});" item_id="{{this}}">&nbsp;</div>{{/each}}</td><td>{{this.xp}}</td><td><div class="inv_item tooltip scrolling_allowed" style="{{item_image this.item_id}}" title="{{item_name this.item_id}}" onclick="Items.get_info({{this.item_id}});" item_id="{{this.item_id}}">&nbsp;</div></td></tr>{{/each}}</tbody></table>'));
            return CompiledTemplate.fletching_formulas
        },
        achievements: function() {
            "undefined" == typeof CompiledTemplate.achievements && (CompiledTemplate.achievements = Handlebars.compile('{{cycle_init}}<table style="width: 350px;;margin-bottom:10px;">{{#each this}}<tr class="{{cycle_table}} scrolling_allowed"><td style="width: 64px;height:64px;padding-left: 3px;" class="scrolling_allowed"><span class="scrolling_allowed" style=\'{{achievement_image this.img this.completed}};width:64px;height:64px;display:block;\'></span></td><td style="padding-left:5px;" class="scrolling_allowed"><div style="position:relative;" class="scrolling_allowed"><span style="position: absolute;right: 20px;top:0px;display: block;font-size: smaller;color: yellow;">{{this.value}}</span><b class="scrolling_allowed" style="line-height:18px;">{{_ta this.name}}</b><br/>{{_ta this.desc}}<br/>{{achievements_progress this.progress this.completed}}</div></td></tr>{{/each}}</table>'));
            return CompiledTemplate.achievements
        },
        achievement_rewards: function() {
            "undefined" == typeof CompiledTemplate.achievement_rewards && (CompiledTemplate.achievement_rewards = Handlebars.compile('{{cycle_init}}<table style="width: 350px;margin-bottom:10px;"><tr class="scrolling_allowed"><td style="width:230px;">{{_t "Completed"}} {{this.completed}}/{{this.total}}</td><td>{{_t "Points"}} {{this.points}}/{{this.total_points}}</td></tr><tr style="margin-top: 10px;display: block;"><td></td><td></td></tr>{{#each this.rewards}}<tr class="{{cycle_table}} scrolling_allowed" style="line-height: 19px;"><td class="scrolling_allowed">{{_tn this.name}}</td><td class="scrolling_allowed"><div style="position:relative;" class="scrolling_allowed"><span style="position: absolute;right: 15px;top:0px;display: block;"><button class="market_select scrolling_allowed" onclick="Achievements.buy_reward({{@index}});">{{#if this.download}}{{_t "Download"}}{{else}}{{_t "Buy"}}{{/if}}</button></span>{{#if this.download}}{{else}}<b>{{this.cost}}</b>{{/if}}</div></td></tr>{{/each}}</table>'));
            return CompiledTemplate.achievement_rewards
        },
        quest_types: function() {
            "undefined" == typeof CompiledTemplate.quest_types && (CompiledTemplate.quest_types = Handlebars.compile('<div style="width: 100%; overflow: hidden; vertical-align: middle; text-align: center;"><button class="market_select" onclick="Quests.show_active();" style="margin-top: 10px; padding: 20px; width: 100%;">{{_t "Kill Quests"}}</button><br><button class="market_select" onclick="document.getElementById(\'quests_form\').style.display=\'none\';PartyQuests.show_list();" style="margin-top: 10px; padding: 20px; width: 100%;">{{_t "Party Quests"}}</button><br><button class="market_select" onclick="document.getElementById(\'quests_form\').style.display=\'none\';Achievements.open_locked()" style="margin-top: 10px; padding: 20px; width: 100%;">{{_t "Achievements"}}</button></div>'));
            return CompiledTemplate.quest_types
        },
        translate_interface: function() {
            "undefined" == typeof CompiledTemplate.translate_interface && (CompiledTemplate.translate_interface = Handlebars.compile('{{cycle_init}}<div class="abstract_form menu scrolling_allowed" style="width:98%;height:auto;display:block;margin-left:-49%;margin-top:-25%;height:97%;overflow-y:scroll;"><button class="market_select" onclick="applyTranslations();" style="margin-right: 30px;">Apply translations</button><button class="market_select" onclick="filterUntranslated();" style="margin-right: 30px;">Only untranslated</button><button class="market_select" onclick="filterUntranslatedExceptNames();" style="margin-right: 30px;">Only untranslated non-names</button><input type="text" id="translate_search" class="market_select" placeholder="Search" value="" style="margin-right: 30px;"><button class="market_select" onclick="saveTranslations();" style="margin-right: 30px;">Save translations</button><button class="market_select" onclick="closeWindow();" style="margin-right: 30px;">Close</button><table style="color: white;">{{#each this}}{{store "ns" @key}}{{store "counter" 0}}<tr colspan="3"><td><span class="toggle" style="color: #79FBFB; font-weight: bold; font-size: large;" onclick="toggleNS(\'{{@key}}\')">{{@key}}</span></td></tr><tr class="hidden ns_{{fetch "ns"}}"><th>Num</th><th style="width:50%;">English</th><th>Translation</th></tr>{{#each this}}{{incr "counter"}}<tr class="{{cycle_table}} ns_{{fetch "ns"}} hidden"><td style="width:1%;">{{fetch "counter"}}.</td><td style="width: 49%;" {{translation_hint @key}}>{{@key}}</td><td style="width:50%;"><textarea style="width:100%; height:auto;" id="trans_{{@key}}" class="translation" oninput="changedTranslation();">{{this}}</textarea></td></tr>{{/each}}{{/each}}</table></div>'));
            return CompiledTemplate.translate_interface
        },
        armor_stand: function() {
            "undefined" == typeof CompiledTemplate.armor_stand && (CompiledTemplate.armor_stand = Handlebars.compile('<div style=\'width: 100px;display:inline-block;overflow-x:\'>{{_t \'Armor\'}}<br><div class="inv_item tooltip" title="{{item_name this.head}} ({{__tit "head"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.head}}" onclick="ArmorStand.remove_item({{this.head}})">&nbsp;</div><div class="inv_item tooltip" title="{{item_name this.back}} ({{__tit "back"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.back}}" onclick="ArmorStand.remove_item({{this.back}})">&nbsp;</div><br><div class="inv_item tooltip" title="{{item_name this.body}} ({{__tit "body"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.body}}" onclick="ArmorStand.remove_item({{this.body}})">&nbsp;</div><div class="inv_item tooltip" title="{{item_name this.hands}} ({{__tit "hands"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.hands}}" onclick="ArmorStand.remove_item({{this.hands}})">&nbsp;</div><br><div class="inv_item tooltip" title="{{item_name this.pants}} ({{__tit "pants"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.pants}}" onclick="ArmorStand.remove_item({{this.pants}})">&nbsp;</div><br><div class="inv_item tooltip" title="{{item_name this.legs}} ({{__tit "legs"}})" style="display:inline-block;width:32px;height:32px;margin: 2px;{{item_image this.legs}}" onclick="ArmorStand.remove_item({{this.legs}})">&nbsp;</div></div><div style=\'display:inline-block;width:275px;\'>{{_t \'Inventory\'}}<br>{{#each this.inventory}}<div class="inv_item {{#if this}}tooltip{{/if}}" title="{{#if this}}{{item_name this.id}}{{/if}}" style="display:inline-block;width:32px;height:32px;margin: 2px;{{#if this}}{{item_image this.id}}{{/if}}" {{#if this}}onclick="ArmorStand.inventory_click({{this.pos}})"{{/if}}>&nbsp;</div>{{/each}}<br>{{#if this.copy}}<button class=\'market_select\' onclick=\'ArmorStand.copy_look();\' style=\'margin: 2px;\'>{{__t \'Copy look\'}}</button>{{/if}}{{#if this.restore}}<button class=\'market_select\' onclick=\'ArmorStand.restore_look();\' style=\'margin: 2px;\'>{{__t \'Restore look\'}}</button>{{/if}}</div>'));
            return CompiledTemplate.armor_stand
        },
        forging: function() {
            "undefined" == typeof CompiledTemplate.forging && (CompiledTemplate.forging = Handlebars.compile('<span style="float:right;line-height:20px;width:220px;">{{#if error2}}<span style="margin-top:5px;display:block;color:' + COLOR.PINK + ';font-weight:bold;text-shadow: 1px 1px 1px black;">{{_te error2}}</span>{{else}}{{_t "Available formulas"}}{{/if}} {{#check pages ">" 1}}<span class="common_link" onclick="Forge.formula_page_click(0);">1</span>{{/check}} {{#check pages ">" 1}}<span class="common_link" onclick="Forge.formula_page_click(1);">2</span>{{/check}}</br><div style="width:220px; height: 180px;">{{#each this.formulas}}<div class="inv_item tooltip" style="{{item_image this.item_id}}" onclick="Forge.formula_click({{this.id}});" title="{{item_name this.item_id}}" item_id="{{this.item_id}}">&nbsp;</div>{{/each}}</div></span><span style="line-height:20px;">{{#if this.last_used_visible}}{{_t "Last used"}}<br>{{/if}}{{#each this.last_used}}<div class="inv_item tooltip" style="{{item_image this.item_id}}" onclick="Forge.formula_click({{this.id}});" title="{{item_name this.item_id}}" item_id="{{this.item_id}}">&nbsp;</div>{{/each}}{{#if this.last_used_visible}}<br>{{/if}}{{#if this.consumes}}<div style="background-color:#444444;width:220px;padding-bottom:3px;">{{_t "Consumes"}}<br>{{#each this.consumes}}<div class="inv_item tooltip" style="{{item_image @key}}" title="{{item_name @key}}" item_id="{{@key}}">{{this}}&nbsp;</div>{{/each}}</div>{{/if}}<table style="width: 180px; text-align: center;"><tr><td><span style="line-height: 34px; position:absolute; left: 50px;">{{this.multiplier}}</span><div style="{{item_image this.active_item}}" class="inv_item {{#if this.active_item}}tooltip{{/if}}"  {{#if this.active_item}}title="{{item_name this.active_item}}" onclick="Items.get_info({{this.active_item}});" item_id="{{this.active_item}}"{{/if}}>&nbsp;</div></td></tr></table><div class="health health-red scrolling_allowed" style="width: 180px;height:22px;position:relative;margin-top: 5px;"><div class="health-green scrolling_allowed" id="forging-progress" style="width:{{this.progress}}%;position:absolute;height:100%;max-width:100%;min-width:0%;">&nbsp;</div><span class="scrolling_allowed" style="line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 180px;" id="forging-progress-span">{{this.progress}}%</span></div><table style="width: 180px; text-align: center;"><tr><td colspan="3">{{#if this.error}}<span style="margin-top:5px;display:block;color:' +
                COLOR.PINK + ';font-weight:bold;text-shadow: 1px 1px 1px black;">{{_te this.error}}</span>{{else}}<button id="forging-make" class="market_select pointer" style="line-height: 20px;margin-top: 6px;" onclick="Forge.make();">{{__t "Make"}} ({{this.percent}}%)</button>{{/if}}</td></tr></table></span>'));
            return CompiledTemplate.forging
        },
        forging_formulas: function() {
            "undefined" == typeof CompiledTemplate.forging_formulas && (CompiledTemplate.forging_formulas = Handlebars.compile('{{cycle_init}}<div style="float:right;width: 150px;line-height: 20px;margin-right: 27px;"><input class="market_select" type="text" id="forging_search" placeholder="{{__t "Search"}}" onchange="Forge.update_search()" /><button class="market_select pointer" style="line-height: 20px;margin-top: 6px;" onclick="Forge.formula_type=\'forging\';Forge.show_formulas();">{{__t "Forging"}}</button><button class="market_select pointer" style="line-height: 20px;margin-top: 6px;" onclick="Forge.formula_type=\'fletching\';Forge.show_formulas();">{{__t "Fletching"}}</button></div><table style="width:250px;line-height:35px;text-align:left;" id="forging_formulas_table"><thead><tr style="line-height:20px;text-align:center;"><th class="sort-number">{{_t "Level"}}</th><th class="no-sort">{{_t "Materials"}}</th><th class="sort-number">{{_t "XP"}}</th><th class="no-sort">{{_t "Result"}}</th></tr></thead><tbody>{{#each this}}<tr class="{{cycle_table}} scrolling_allowed forging_formula_line"><td>{{this.level}}{{this.fletching_level}}</td><td>{{#each this.materials}}<div class="inv_item tooltip" style="{{item_image @key}}" title="{{item_name @key}}" item_id="{{@key}}">{{this}}&nbsp;</div>{{/each}}</td><td>{{this.xp}}</td><td><div class="inv_item tooltip scrolling_allowed" style="{{item_image this.item_id}}" title="{{item_name this.item_id}}" onclick="Items.get_info({{this.item_id}});" item_id="{{this.item_id}}">&nbsp;</div></td></tr>{{/each}}</tbody></table>'));
            return CompiledTemplate.forging_formulas
        },
        enchanting: function() {
            "undefined" == typeof CompiledTemplate.enchanting && (CompiledTemplate.enchanting = Handlebars.compile('<span style="float:right;line-height:20px;width:180px;">{{_t "Inventory"}}</br><div id="enchanting_inventory" style="float:right;width:180px;">{{#each this.inventory}}<div class="inv_item {{#if this.id}}tooltip{{/if}}" title="{{item_name this.id}}" style="{{item_image this.id}}" onclick="Forge.enchanting_inv_click({{#if this.id}}{{this.id}}{{else}}false{{/if}});" item_id="{{this.id}}">{{this.count}}&nbsp;</div>{{/each}}</div></span><span style="line-height:20px;"><table style="width: 180px; text-align: center;"><tr><td style="width: 60px;">{{_t "Item"}}</td><td style="width: 60px;">{{_t "Scroll"}}</td><td style="width: 60px;">{{_t "Orbs"}}</td></tr><tr><td><div class="inv_item {{#if this.item}}tooltip{{/if}}" style="{{item_image this.item}}" title="{{item_name this.item}}" item_id="{{this.item}}">&nbsp;</div></td><td><div class="inv_item {{#if this.scroll}}tooltip{{/if}}" style="{{item_image this.scroll}}" title="{{item_name this.scroll}}" item_id="{{this.scroll}}">&nbsp;</div></td><td><div class="inv_item" style="text-align:left;{{item_image this.orb_img}}" onclick="Forge.enchanting_remove_orb();" item_id="{{this.orb_img}}">{{this.orbs}}&nbsp;</div></td></tr><tr><td colspan="3"><span class="arrow-s" style="border-bottom:6px dotted transparent"></span></td></tr><tr><td colspan="3"><span style="line-height: 34px; position:absolute; left: 50px;"></span><div style="{{item_image this.enchant_result}}" class="inv_item {{#if this.enchant_result}}tooltip{{/if}}"  {{#if this.enchant_result}}title="{{item_name this.enchant_result}}" onclick="Items.get_info({{this.enchant_result}});" item_id="{{this.enchant_result}}"{{/if}}>&nbsp;</div></td></tr></table><div class="health health-red scrolling_allowed" style="width: 180px;height:22px;position:relative;margin-top: 5px;"><div class="health-green scrolling_allowed" id="enchanting-progress" style="width:{{this.progress}}%;position:absolute;height:100%;max-width:100%;min-width:0%;">&nbsp;</div><span class="scrolling_allowed" style="line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 180px;" id="enchanting-progress-span">{{this.progress}}%</span></div><table style="width: 180px; text-align: center;"><tr><td colspan="3">{{#if this.error}}<span style="color:' +
                COLOR.PINK + ';font-weight:bold;text-shadow: 1px 1px 1px black;">{{_te this.error}}</span>{{else}}<button id="enchanting-make" class="market_select pointer" style="line-height: 20px;margin-top: 6px;" onclick="Forge.enchant_make();">{{__t "Enchant"}} ({{this.percent}}%)</button>{{/if}}</td></tr></table></span>'));
            return CompiledTemplate.enchanting
        },
        language_list: function() {
            "undefined" == typeof CompiledTemplate.language_list && (CompiledTemplate.language_list = Handlebars.compile('{{#each this}}{{#if this.visible}}<div id="lang_div_{{@key}}" class="language_div scrolling_allowed{{#if this.current}} language_div_selected{{/if}}" onclick="Translate.language_select_form_choose(\'{{@key}}\');"><span class="language_flag scrolling_allowed" style="background-image: url(\'https://mo.mo.ee/flags/{{flag}}\');"></span><span class="language_name scrolling_allowed">{{name}}</span></div>{{/if}}{{/each}}'));
            return CompiledTemplate.language_list
        },
        tab_filters: function() {
            "undefined" == typeof CompiledTemplate.tab_filters && (CompiledTemplate.tab_filters = Handlebars.compile('<input type="text" id="tab_name_search_input" autocomplete="off" value="{{this.name}}" class="market_select" placeholder="{{__t "Tab name"}}" style="margin-bottom:5px;" onchange="Chat.update_tab_name()" /> {{#if this.delete}}<button class="market_select pointer" onclick="Chat.delete_tab();">{{_t "Delete"}}</button>{{/if}}{{#if this.left}}<button class="market_select pointer" onclick="Chat.move_left_tab();">&lt;</button>{{/if}}<span style="display:block">{{_t "Green - visible, Red - hidden"}}</span><div style="float:left;width:50%;"><span id="filter_attempt" onclick="ChatSystem.filter_toggle(\'attempt\')" class="wide_link pointer">{{_t "Skill attempts"}}</span><span id="filter_fails" onclick="ChatSystem.filter_toggle(\'fails\')" class="wide_link pointer">{{_t "Skill fails"}}</span><span id="filter_chat" onclick="ChatSystem.filter_toggle(\'chat\')" class="wide_link pointer">{{_t "Player chat"}}</span><span id="filter_whisper" onclick="ChatSystem.filter_toggle(\'whisper\')" class="wide_link pointer">{{_t "Whispering"}}</span><span id="filter_join_leave" onclick="ChatSystem.filter_toggle(\'join_leave\')" class="wide_link pointer">{{_t "Join / leave events"}}</span><span id="filter_loot" onclick="ChatSystem.filter_toggle(\'loot\')" class="wide_link pointer">{{_t "Loot"}}</span></div><div style="float:right;width:50%;"><span id="filter_magic" onclick="ChatSystem.filter_toggle(\'magic\')" class="wide_link pointer">{{_t "Magic damage"}}</span><span id="filter_archery" onclick="ChatSystem.filter_toggle(\'archery\')" class="wide_link pointer">{{_t "Archery damage"}}</span><span id="filter_spam" onclick="ChatSystem.filter_toggle(\'spam\')" class="wide_link pointer">{{_t "Spam messages"}}</span><span id="filter_time" onclick="ChatSystem.filter_toggle(\'time\')" class="wide_link pointer">{{_t "Timestamps"}}</span><span id="filter_url" onclick="ChatSystem.filter_toggle(\'url\')" class="wide_link pointer">{{_t "Disable URLs"}}</span></div>'));
            return CompiledTemplate.tab_filters
        },
        blacklist: function() {
            "undefined" == typeof CompiledTemplate.blacklist && (CompiledTemplate.blacklist = Handlebars.compile('<table class="table scrolling_allowed" style="width:100%">{{cycle_init}}<tr><th style="text-align:left">{{_t "Word"}}</th><th style="text-align:left">{{_t "Channels"}}</th><th></th></tr>{{#each words}}<tr class="{{cycle_table}}"><td style="text-align:left;">{{this}}</td><td id="blacklist_channels_{{this}}" style="text-align:left;"></td><td style="width:52px;"><button class="market_select" onclick="Chat.blacklist_remove_word(\'{{this}}\')">{{__t "Delete"}}</button></td></tr>{{/each}}</table><button class="market_select" onclick="Chat.blacklist_add_word()">{{__t "Add"}}</button><br>EN channel applies to E2-E9 and $$ as well. A space in the word matches the one without as well.'));
            return CompiledTemplate.blacklist
        },
        blacklist_channels_selected: function() {
            "undefined" == typeof CompiledTemplate.blacklist_channels_selected && (CompiledTemplate.blacklist_channels_selected = Handlebars.compile("{{#if this.all}}<span style='margin:10px'>{{_t 'All'}}</span>{{else}}{{#each this.channels}}<span onclick='Chat.blacklist_remove_channel(\"{{../word}}\",\"{{this.value}}\")' class='common_link'>[{{this.name}}]</span> {{/each}}{{/if}}"));
            return CompiledTemplate.blacklist_channels_selected
        },
        blacklist_channels_dropdown: function() {
            "undefined" ==
            typeof CompiledTemplate.blacklist_channels_dropdown && (CompiledTemplate.blacklist_channels_dropdown = Handlebars.compile("<select id='blacklist_channels_select_{{word}}' class='market_select'>{{#each this.channels}}<option value='{{this.value}}'>{{this.name}}</option>{{/each}}</select><button class='market_select pointer same_height_button' onclick='Chat.blacklist_add_channel(\"{{word}}\")'>{{__t 'Add'}}</button>"));
            return CompiledTemplate.blacklist_channels_dropdown
        },
        security_info: function() {
            "undefined" ==
            typeof CompiledTemplate.security_info && (CompiledTemplate.security_info = Handlebars.compile("<h4>1. {{_t 'Download an Authenticator App'}}</h4>{{_t 'Install an authenticator app like [bold]Google Authenticator[/bold], [bold]Authy[/bold], [bold]Duo Mobile[/bold] or [bold]1Password[/bold] on your mobile or tablet device.'}}<br><br><h4>2. {{_t 'Scan this Barcode'}}</h4>{{_t 'Use your authenticator app to scan the barcode below.'}}<div id='security_info_barcode'></div><br>{{_t 'If you cannot scan this barcode, manually enter the following code.'}}<br><input type='text class='market_select' id='security_code_search_form' value='{{manual_code}}' autocomplete='off' size='30' readonly='readonly'/><br><br><h4>3. {{_t 'Enter your Authentication Code'}}</h4>{{_t 'Enter the 6-digit code generated by your authenticator app.'}}<br><br><input type='number' max='999999' id='security_verify_totp' /><span style='color:red;line-height: 20px;padding-left: 5px;' class='hidden' id='security_verify_invalid'>{{__t 'Invalid code!'}}</span><br><br><button class='market_select' style='margin-bottom:40px;' onclick='Player.security_verify_totp();'>{{__t 'Verify and enable'}}</button>"));
            return CompiledTemplate.security_info
        },
        breeding_formulas_general: function() {
            "undefined" == typeof CompiledTemplate.breeding_formulas_general && (CompiledTemplate.breeding_formulas_general = Handlebars.compile('{{cycle_init}}<div style="float:right;width: 120px;line-height: 20px;margin-right: 10px;"><input class="market_select" type="text" id="breeding_formulas_search" placeholder="{{__t "Search"}}" onchange="Breeding.formulas_general_update_search()" style="width:120px;"></div><table style="width:300px;line-height:35px;text-align:center;" id="breeding_formulas_general_table"><thead><tr style="line-height:20px;text-align:center;"><th class="sort-number">{{_t "Level"}}</th><th class="no-sort">{{_t "Pet"}}</th><th class="sort-number">{{_t "Hunger"}}</th><th class="no-sort">{{_t "Eats"}}</th><th class="sort-number">{{_t "Happiness"}}</th></tr></thead><tbody>{{#each this}}<tr class="{{cycle_table}} scrolling_allowed breeding_formula_line"><td>{{this.level}}</td><td><div class="inv_item tooltip scrolling_allowed" style="{{item_image this.item_id}}" title="{{item_name this.item_id}}" onclick="Breeding.formulas_results(\'{{item_name this.item_id}}\');" item_id="{{this.item_id}}">&nbsp;</div></td><td>{{this.eat_interval}}</td><td>{{#each this.eats}}<div class="inv_item tooltip scrolling_allowed" style="{{item_image this.id}}" title="{{item_name this.id}} ({{this.restores}}%)" onclick="Items.get_info({{this.id}});" item_id="{{this.id}}">&nbsp;</div>{{/each}}</td><td>{{this.happiness}}</td></tr>{{/each}}</tbody></table>'));
            return CompiledTemplate.breeding_formulas_general
        },
        breeding_formulas_results: function() {
            "undefined" == typeof CompiledTemplate.breeding_formulas_results && (CompiledTemplate.breeding_formulas_results = Handlebars.compile('{{cycle_init}}<div style="float:right;width: 120px;line-height: 20px;margin-right: 10px;"><input class="market_select" type="text" id="breeding_formulas_search" placeholder="{{__t "Search"}}" onchange="Breeding.formulas_general_update_search()" style="width:120px;"></div><table style="width:300px;line-height:35px;text-align:center;" id="breeding_formulas_results_table"><thead><tr style="line-height:20px;text-align:center;"><th class="sort-number">{{_t "Level"}}</th><th class="no-sort">{{_t "Parent"}}</th><th class="no-sort">{{_t "Parent"}}</th><th class="sort-number">{{_t "Time"}}</th><th class="no-sort">{{_t "Offspring"}}</th><th class="sort-number">{{_t "XP"}}</th></tr></thead><tbody>{{#each this}}<tr class="{{cycle_table}} scrolling_allowed breeding_formula_line"><td>{{this.level}}</td><td><div class="inv_item tooltip scrolling_allowed" style="{{item_image this.parent1}}" title="{{item_name this.parent1}}" onclick="Breeding.formulas_general(\'{{item_name this.parent1}}\');" item_id="{{this.parent1}}">&nbsp;</div></td><td><div class="inv_item tooltip scrolling_allowed" style="{{item_image this.parent2}}" title="{{item_name this.parent2}}" onclick="Breeding.formulas_general(\'{{item_name this.parent2}}\');" item_id="{{this.parent2}}">&nbsp;</div></td><td>{{this.time}}</td><td>{{#each this.offspring}}<div class="inv_item tooltip scrolling_allowed" style="{{item_image this.id}}" title="{{item_name this.id}} ({{#if this.show_both}}{{this.min}}-{{this.max}}{{else}}{{this.min}}{{/if}}%)" onclick="Items.get_info({{this.id}});" item_id="{{this.id}}">&nbsp;</div>{{/each}}</td><td>{{this.xp}}</td></tr>{{/each}}</tbody></table>'));
            return CompiledTemplate.breeding_formulas_results
        },
        scratch_ticket: function() {
            "undefined" == typeof CompiledTemplate.scratch_ticket && (CompiledTemplate.scratch_ticket = Handlebars.compile('<div style="text-align:center"><canvas id="scratch_ticket_scratch" style="position:absolute;width: 208px;height: 75px;top: 21px;" width="208" height="75"></canvas><div style="margin-top:20px;"><div class="inv_item" style="{{reward_background this.item1}}margin-right:20px;">&nbsp;</div><div class="inv_item" style="{{reward_background this.item2}}">&nbsp;</div><div class="inv_item" style="{{reward_background this.item3}}margin-left:20px;">&nbsp;</div></div><br><button class=\'market_select\' style=\'margin-top:20px;display:none;\' onclick=\'ScratchTicket.claim();\' id=\'scratch_ticket_accept\'>{{__t \'Claim\'}}{{this.desc}}</button></div>'));
            return CompiledTemplate.scratch_ticket
        },
        toolbar_current_world: function() {
            "undefined" == typeof CompiledTemplate.toolbar_current_world && (CompiledTemplate.toolbar_current_world = Handlebars.compile("<span class='toolbar_dark' data-ti='World'>{{__t 'World'}}</span> {{this.current}}"));
            return CompiledTemplate.toolbar_current_world
        },
        toolbar_exp_popup: function() {
            "undefined" == typeof CompiledTemplate.toolbar_exp_popup && (CompiledTemplate.toolbar_exp_popup = Handlebars.compile("<table style='text-align:right;text-indent: 10px;'><thead><tr><th>{{_t 'Skill'}}</th><th>{{_tm 'Exp/h'}}</th><th>{{_tm 'Level in'}}</th></tr></thead><tbody>{{cycle_init}}{{#each this}}<tr class='{{cycle_table}}'><td>{{this.skill}}</td><td>{{this.xp}}</td><td>{{this.time}}</td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.toolbar_exp_popup
        },
        skill_quests_available: function() {
            "undefined" == typeof CompiledTemplate.skill_quests_available && (CompiledTemplate.skill_quests_available = Handlebars.compile("{{cycle_init}}<div style='float:right;'>{{_t '{btime} until automatic refresh.' btime=this.btime}} {{_t 'Points'}} {{this.points}}</div><table class='table scrolling_allowed' style='min-width:320px;width:320px;line-height:32px;position:relative;'><tbody><tr class='scrolling_allowed' style='line-height:26px;'><th>{{_t 'Task'}}</th><th>{{_t 'Grade'}}</th><th>{{_t 'Reward'}}</th><th>{{_t 'Points'}}</th><th></th></tr>{{#each this.quests}}<tr class='{{cycle_table_small}} scrolling_allowed tooltip' title='{{__t this.skill}} - {{item_name this.item_id}}'>  <td class='scrolling_allowed' style='padding:0px;margin:0px;'><div style='width:32px;height:32px;display:inline-block;margin:0;padding:0;{{item_image this.item_id}}' item_id='{{this.item_id}}'></div><span style='line-height:32px;padding:0px;margin:0px;vertical-align:bottom;' class='scrolling_allowed'>{{this.amount}}</span></td>  <td class='scrolling_allowed'>{{_t this.grade_name}}</td>  <td class='scrolling_allowed'>{{#if this.item_reward}}<div style='width:32px;height:32px;display:inline-block;margin:0;padding:0;{{item_image this.item_reward_id}}' item_id='{{this.item_reward_id}}' onclick='Items.get_info({{this.item_reward_id}})'></div>{{else}} {{skill_quest_reward this.quest_id this.grade this.reward}}{{/if}}</td>  <td class='scrolling_allowed'>{{this.points}}</td><td class='scrolling_allowed'><button class='market_select pointer' onclick='SkillQuest.client_start(\"{{this.quest_id}}\");'>{{_t 'Start'}}</button></td></tr>{{/each}}</tbody></table>"));
            return CompiledTemplate.skill_quests_available
        }
    },
    handlebars_cycle_table = !1,
    handlebars_numbers = 0,
    handlebar_helper_initialized = !1;

function initHandlebars() {
    if (!handlebar_helper_initialized) {
        handlebar_helper_initialized = !0;
        Handlebars.registerHelper("foreach", function(a, b) {
            return b.inverse && !a.length ? b.inverse(this) : a.map(function(d, h) {
                d.$index = h;
                d.$first = 0 === h;
                d.$last = h === a.length - 1;
                return b.fn(d)
            }).join("")
        });
        Handlebars.registerHelper("inc", function(a) {
            return a + 1
        });
        Handlebars.registerHelper("time", function(a) {
            return MapTimer.format_time(a)
        });
        Handlebars.registerHelper("text_capitalise", function(a) {
            return capitaliseFirstLetter(a)
        });
        Handlebars.registerHelper("reward_background", function(a) {
            if (a.item_id) a = Items.get_background_image(a.item_id);
            else {
                var b = IMAGE_SHEET[a.sheet];
                a = 'background:url("' + b.url + '") no-repeat scroll ' + -a.x * b.tile_width + "px " + -a.y * b.tile_height + "px transparent;"
            }
            return a
        });
        Handlebars.registerHelper("item_categories_select", function(a, b) {
            var d = document.getElementById(a + "_category"),
                h = -1;
            d && (h = d.value);
            for (var d = "<select value='" + h + "' id='" + a + "_category' class='market_select' onchange='FormHelper.update_item_list_select(\"" +
                    a + '", ' + b + ")'>", l = -1; l < ITEM_CATEGORY_COUNT; l++) d += "<option " + (l == h ? "selected='true'" : "") + " value='" + item_categories[l].id + "'>" + item_categories[l].name + "</option>";
            return new Handlebars.SafeString(d + "</select>")
        });
        Handlebars.registerHelper("reward_description", function(a) {
            return a.item_id ? _tn(item_base[a.item_id].name) + Items.info(a.item_id) : _tu(a.desc)
        });
        Handlebars.registerHelper("item_name", function(a) {
            return -1 == a ? _ti("coins") : "undefined" == typeof a ? "" : _tn(item_base[a].name)
        });
        Handlebars.registerHelper("cycle_init",
            function() {
                handlebars_cycle_table = !1;
                return ""
            });
        Handlebars.registerHelper("cycle_table", function() {
            return (handlebars_cycle_table = !handlebars_cycle_table) ? "row even" : "row"
        });
        Handlebars.registerHelper("cycle_table_small", function() {
            return (handlebars_cycle_table = !handlebars_cycle_table) ? "row_small even" : "row_small"
        });
        Handlebars.registerHelper("item_stats", function(a) {
            return 0 <= a ? Items.info(a).trim() : ""
        });
        Handlebars.registerHelper("quest_reward", function(a, b) {
            return Quests.show_reward(a, b)
        });
        Handlebars.registerHelper("skill_quest_reward",
            function(a, b, d) {
                a = SkillQuest.show_reward(a, b, d);
                return _tu(a.text, a.params || {})
            });
        Handlebars.registerHelper("item_price", function(a) {
            return thousandSeperate(a)
        });
        Handlebars.registerHelper("item_image", Items.get_background_image);
        Handlebars.registerHelper("npc_image", function(a) {
            a = npc_base[a];
            if (a.img.hash) return 'background:url("' + getBodyImgNoHalo(a.img.hash).toDataURL("image/png") + '") no-repeat scroll -12px -10px transparent';
            var b = IMAGE_SHEET[a.img.sheet];
            return 'background:url("' + b.url + '") no-repeat scroll ' +
                -a.img.x * b.tile_width + "px " + -a.img.y * b.tile_height + "px transparent;"
        });
        Handlebars.registerHelper("magic_image", function(a) {
            a = Magic[a];
            var b = IMAGE_SHEET[a.img.sheet];
            return 'background:url("' + b.url + '") no-repeat scroll ' + -a.img.x * b.tile_width + "px " + -a.img.y * b.tile_height + "px transparent;"
        });
        Handlebars.registerHelper("carpentry_image", function(a, b) {
            var d = item_base[a],
                d = BASE_TYPE[d.params.carpentry_type][d.params.carpentry_id],
                h = d.top || d.img;
            if ("undefined" != typeof h.sheet_file) {
                var l = IMAGE_SHEET[h.sheet_file].sprite.imgs[h.file];
                return "background-image:url(" + l.toDataURL("image/png") + ");background-repeat:no-repeat;"
            }
            l = IMAGE_SHEET[h.sheet];
            return 1 == b % 2 && d.params.horizontal_flip ? (h = IMAGE_SHEET[d.img.sheet].max_x, h = JSON.merge(JSON.clone(d.img), {
                    x: h - d.img.x,
                    layer: Math.round(b / 2)
                }), createHorizontalFlipImage(d.img, b), 'background:url("' + l.img[h.layer].toDataURL("image/png") + '") no-repeat scroll ' + -h.x * l.tile_width + "px " + -h.y * l.tile_height + "px transparent;") : 'background:url("' + l.url + '") no-repeat scroll ' + -(h.x + b) * l.tile_width + "px " +
                -h.y * l.tile_height + "px transparent;"
        });
        var a = function(a, b, d, h) {
            for (var l = /^helper\[(.+?)\]$/, m = Object.keys(h.hash), k = 0; k < m.length; k++)
                if (l.test(h.hash[m[k]])) {
                    var v = l.exec(h.hash[m[k]])[1].split(",");
                    h.hash[m[k]] = Handlebars.helpers[v[0]](v[1] || void 0)
                }
            l = "";
            for (k in h.hash) l += " data-" + k + "='" + h.hash[k].toString().replace(/'/g, "'") + "'";
            return new Handlebars.SafeString("<span data-" + a + "='" + d.toString().replace(/'/g, "'") + "'" + l + ">" + Handlebars.Utils.escapeExpression(b(d, h.hash || {})).replace(RegExp("&lt;b&gt;",
                "g"), "<b>").replace(RegExp("&lt;/b&gt;", "g"), "</b>") + "</span>")
        };
        Handlebars.registerHelper("_t", function(b, d) {
            return a("ti", _ti, b, d)
        });
        Handlebars.registerHelper("_tit", function(b, d) {
            return a("tit", _tit, b, d)
        });
        Handlebars.registerHelper("__tit", function(a, b) {
            for (var d = /^helper\[(.+?)\]$/, h = Object.keys(b.hash), l = 0; l < h.length; l++)
                if (d.test(b.hash[h[l]])) {
                    var m = d.exec(b.hash[h[l]])[1].split(",");
                    b.hash[h[l]] = Handlebars.helpers[m[0]](m[1] || void 0)
                }
            return _tit(a, b.hash || {})
        });
        Handlebars.registerHelper("__t",
            function(a, b) {
                for (var d = /^helper\[(.+?)\]$/, h = Object.keys(b.hash), l = 0; l < h.length; l++)
                    if (d.test(b.hash[h[l]])) {
                        var m = d.exec(b.hash[h[l]])[1].split(",");
                        b.hash[h[l]] = Handlebars.helpers[m[0]](m[1] || void 0)
                    }
                return _ti(a, b.hash || {})
            });
        Handlebars.registerHelper("_tm", function(b, d) {
            return a("tm", _tm, b, d)
        });
        Handlebars.registerHelper("__tm", function(a, b) {
            for (var d = /^helper\[(.+?)\]$/, h = Object.keys(b.hash), l = 0; l < h.length; l++)
                if (d.test(b.hash[h[l]])) {
                    var m = d.exec(b.hash[h[l]])[1].split(",");
                    b.hash[h[l]] = Handlebars.helpers[m[0]](m[1] ||
                        void 0)
                }
            return _tm(a, b.hash || {})
        });
        Handlebars.registerHelper("_ta", function(b, d) {
            return a("ta", _ta, b, d)
        });
        Handlebars.registerHelper("_tq", function(b, d) {
            return a("tq", _tq, b, d)
        });
        Handlebars.registerHelper("_tn", function(b, d) {
            return a("tn", _tn, b, d)
        });
        Handlebars.registerHelper("_te", function(b, d) {
            return a("te", _te, b, d)
        });
        Handlebars.registerHelper("_tu", function(a, b) {
            for (var d = /^helper\[(.+?)\]$/, h = Object.keys(b.hash), l = 0; l < h.length; l++)
                if (d.test(b.hash[h[l]])) {
                    var m = d.exec(b.hash[h[l]])[1].split(",");
                    b.hash[h[l]] = Handlebars.helpers[m[0]](m[1] || void 0)
                }
            return _tu(a, b.hash || {})
        });
        Handlebars.registerHelper("_tc", function(a, b) {
            return _tc(a, b.hash || {})
        });
        Handlebars.registerHelper("chest_count", function(a, b, d) {
            return Chest.player_chest_item_count(0, a) < b ? d.inverse(this) : d.fn(this)
        });
        Handlebars.registerHelper("level_requirement", function(a, b) {
            return skills[0][a].current >= b ? !0 : !1
        });
        Handlebars.registerHelper("carpentry_formula_available", function(a, b) {
            var d = function() {
                    if (!h.craftable || skills[0].carpentry.current <
                        h.level) return !1;
                    for (var a in h.consumes) {
                        var b = h.consumes[a],
                            d = Chest.player_chest_item_count(0, b.id);
                        if (b.count > d) return !1
                    }
                    return !0
                },
                h = CARPENTRY_FORMULAS[Carpentry.category][a];
            return !Carpentry.only_available || h && (0 < Chest.player_chest_item_count(0, h.item_id) || d()) ? b.fn(this) : b.inverse(this)
        });
        Handlebars.registerHelper("carpentry_has_enough_materials", function(a, b) {
            var d = CARPENTRY_FORMULAS[Carpentry.category][a];
            return d && function() {
                if (!d.craftable || skills[0].carpentry.current < d.level) return !1;
                for (var a in d.consumes) {
                    var b =
                        d.consumes[a],
                        e = Chest.player_chest_item_count(0, b.id);
                    if (b.count > e) return !1
                }
                return !0
            }() ? b.fn(this) : b.inverse(this)
        });
        Handlebars.registerHelper("met_level_requirements", function(a, b, d) {
            return skills[0][a].current >= b ? d.fn(this) : d.inverse(this)
        });
        Handlebars.registerHelper("subscribed_to_channel", function(a, b) {
            return Chat.tab_settings[Chat.tab].channels[a] ? b.fn(this) : b.inverse(this)
        });
        Handlebars.registerHelper("not_subscribed_to_channel", function(a, b) {
            return Chat.tab_settings[Chat.tab].channels[a] ? b.inverse(this) :
                b.fn(this)
        });
        Handlebars.registerHelper("private_channel", function(a, b) {
            return Contacts.private_channels[a] ? b.fn(this) : b.inverse(this)
        });
        Handlebars.registerHelper("channel_permission", function(a, b, d) {
            return Contacts.channel_permissions(a, b) ? d.fn(this) : d.inverse(this)
        });
        Handlebars.registerHelper("has_channel_permission", function(a, b, d) {
            return Contacts.has_decimal_channel_permission(a, b) ? d.fn(this) : d.inverse(this)
        });
        Handlebars.registerHelper("has_premium", function(a) {
            return Player.has_premium(clients[0].temp.premium_until) ?
                a.fn(this) : a.inverse(this)
        });
        Handlebars.registerHelper("owns_private_channel", function(a) {
            return Contacts.owns_private_channel() ? a.fn(this) : a.inverse(this)
        });
        Handlebars.registerHelper("permissions_name", function(a) {
            return _ti(Contacts.permissions_name(a))
        });
        Handlebars.registerHelper("not_negative", function(a, b) {
            return 0 <= a ? b.fn(this) : b.inverse(this)
        });
        Handlebars.registerHelper("market_offers", function() {
            return players[0].params.market_offers
        });
        Handlebars.registerHelper("channel_description", function(a) {
            return _ti(channel_descriptions[a])
        });
        Handlebars.registerHelper("can_upgrade_market_offers", function(a) {
            return players[0].params.market_offers < Market.max_market_offers ? a.fn(this) : a.inverse(this)
        });
        Handlebars.registerHelper("selected", function(a, b) {
            return a === b ? " selected" : ""
        });
        var b = {};
        Handlebars.registerHelper("achievement_image", function(a, d) {
            var g = JSON.stringify(a) + d.toString();
            if (!b[g]) {
                var h = document.createElement("canvas");
                h.width = 64;
                h.height = 64;
                var l = h.getContext("2d");
                l.drawImage(IMAGE_SHEET[d ? "achievement_active" : "achievement_inactive"].img[0],
                    0, 0);
                for (var m = 0; m < a.length; m++) {
                    var k = document.createElement("canvas"),
                        v = a[m],
                        q, r;
                    v.img.arrow ? (q = {
                        img: [Fletching.get_arrow_inventory_img(v.item_id)],
                        tile_width: 32,
                        tile_height: 32
                    }, r = {
                        x: 0,
                        y: 0
                    }) : (r = v.img, q = IMAGE_SHEET[r.sheet]);
                    var A = q.tile_width * r.x,
                        w = q.tile_height * r.y;
                    k.width = q.tile_width * v.zoom;
                    k.height = q.tile_height * v.zoom;
                    r = k.getContext("2d");
                    2 == v.zoom && (r.mozImageSmoothingEnabled = !1, r.webkitImageSmoothingEnabled = !1, r.msImageSmoothingEnabled = !1, r.imageSmoothingEnabled = !1, r.scale(2, 2));
                    r.drawImage(q.img[0],
                        A, w, q.tile_width, q.tile_height, 0, 0, q.tile_width, q.tile_height);
                    d || (q = Filters.filterContext(Filters.grayscale, r), q = Filters.darken(q), r.putImageData(q, 0, 0));
                    l.drawImage(k, v.x, v.y)
                }
                h = h.toDataURL("image/png");
                b[g] = 'background:url("' + h + '") no-repeat scroll 0px 0px transparent;'
            }
            return b[g]
        });
        Handlebars.registerHelper("achievements_progress", function(a, b) {
            var d = "";
            if (b) return "";
            if (a) {
                var h = Achievements.progress_info(a),
                    l = h.percent,
                    h = h.start,
                    m;
                a.skill ? m = _ti(capitaliseFirstLetter(a.skill)) + " " + h + "/" + a.end :
                    "consecutive_logins" == a.type || "account_age" == a.type ? m = _tc("Day") + " " + h + "/" + a.end : "mos" == a.type && (m = "MOS " + h + "/" + a.end);
                d += "<div class='health health-red scrolling_allowed' style='width: 215px;height:22px;margin-top:6px;'><div class='health-green scrolling_allowed' style='width:" + l + "%;'>&nbsp;</div><span class='scrolling_allowed' style='line-height: 22px; vertical-align: middle; text-align: center; position: absolute; width: 215px;'>" + m + "</span></div>"
            }
            return new Handlebars.SafeString(d)
        });
        var d = {};
        Handlebars.registerHelper("store", function(a, b) {
            d[a] = b;
            return ""
        });
        Handlebars.registerHelper("fetch", function(a) {
            return d[a]
        });
        Handlebars.registerHelper("incr", function(a, b) {
            d[a] += 1;
            return ""
        });
        Handlebars.registerHelper("translation_hint", function(a) {
            var b = d.ns;
            return lang.hints && lang.hints[b] && lang.hints[b][a] ? new Handlebars.SafeString('class="tooltip" title="' + lang.hints[b][a] + '"') : ""
        });
        Handlebars.registerHelper("check", function(a, b, d, h) {
            switch (b) {
                case "==":
                    return a == d ? h.fn(this) : h.inverse(this);
                case "===":
                    return a === d ? h.fn(this) : h.inverse(this);
                case "<":
                    return a < d ? h.fn(this) : h.inverse(this);
                case "<=":
                    return a <= d ? h.fn(this) : h.inverse(this);
                case ">":
                    return a > d ? h.fn(this) : h.inverse(this);
                case ">=":
                    return a >= d ? h.fn(this) : h.inverse(this);
                case "&&":
                    return a && d ? h.fn(this) : h.inverse(this);
                case "||":
                    return a || d ? h.fn(this) : h.inverse(this);
                default:
                    return h.inverse(this)
            }
        });
        Market.client_search_results_template();
        Market.client_open_offer_template()
    }
}
var Popup = {
        prompt_active: !1,
        prompt: function(a, b, d) {
            Popup.prompt_active = !0;
            removeClass(document.getElementById("prompt"), "hidden");
            document.getElementById("prompt_question").innerHTML = a;
            Popup.active_popup_text = a;
            Popup.prompt_callback_variable = b;
            Popup.prompt_callback_no_variable = "function" == typeof d ? d : function() {};
            windowOpen = !0
        },
        prompt_close: function() {
            Popup.active_popup_text = "";
            Popup.prompt_active = !1;
            addClass(document.getElementById("prompt"), "hidden")
        },
        prompt_confirm: function() {
            Popup.prompt_close();
            Popup.prompt_callback_variable()
        },
        prompt_decline: function() {
            Popup.prompt_close();
            Popup.prompt_callback_no_variable()
        },
        dual_prompt_active: !1,
        dual_prompt: function(a, b, d, e, f, g) {
            Popup.active_popup_text = a;
            Popup.dual_prompt_active = !0;
            removeClass(document.getElementById("dual_prompt"), "hidden");
            document.getElementById("dual_prompt_question").innerHTML = a;
            Popup.prompt_callback_variable1 = d;
            document.getElementById("dual_prompt_choice1").innerHTML = b;
            Popup.prompt_callback_variable2 = f;
            document.getElementById("dual_prompt_choice2").innerHTML =
                e;
            Popup.prompt_callback_no_variable = "function" == typeof g ? g : function() {};
            windowOpen = !0
        },
        dual_prompt_close: function() {
            Popup.active_popup_text = "";
            Popup.dual_prompt_active = !1;
            addClass(document.getElementById("dual_prompt"), "hidden")
        },
        dual_prompt_confirm_first: function() {
            Popup.dual_prompt_close();
            Popup.prompt_callback_variable1()
        },
        dual_prompt_confirm_second: function() {
            Popup.dual_prompt_close();
            Popup.prompt_callback_variable2()
        },
        dual_prompt_decline: function() {
            Popup.dual_prompt_close();
            Popup.prompt_callback_no_variable()
        },
        number_input_prompt_active: !1,
        number_input_max_value: 0,
        number_input_prompt: function(a, b, d, e) {
            Popup.active_popup_text = a;
            removeClass(document.getElementById("number_input_prompt"), "hidden");
            addClass(document.getElementById("number_input_prompt_confirm_max"), "hidden");
            document.getElementById("number_input_prompt_question").innerHTML = a;
            document.getElementById("number_input_prompt_answer").value = "undefined" == typeof b.default_value ? 0 : b.default_value;
            try {
                "number" != typeof b.max && (b.max = 99999999999), document.getElementById("number_input_prompt_answer").max =
                    b.max, Popup.number_input_max_value = b.max, b.max_visible && removeClass(document.getElementById("number_input_prompt_confirm_max"), "hidden"), "number" != typeof b.min && (b.min = -99999999999), document.getElementById("number_input_prompt_answer").min = b.min
            } catch (f) {}
            GAME_STATE == GAME_STATES.CHAT && ChatSystem.toggle();
            document.getElementById("number_input_prompt_answer").focus();
            Popup.number_input_prompt_callback_variable = d;
            Popup.number_input_prompt_callback_no_variable = e || null_function;
            windowOpen = Popup.number_input_prompt_active = !0
        },
        number_input_prompt_confirm: function() {
            Popup.number_input_prompt_close();
            Popup.number_input_prompt_callback_variable(document.getElementById("number_input_prompt_answer").value)
        },
        number_input_prompt_confirm_max: function() {
            Popup.number_input_prompt_close();
            Popup.number_input_prompt_callback_variable(Popup.number_input_max_value)
        },
        number_input_prompt_cancel: function() {
            Popup.number_input_prompt_callback_no_variable();
            Popup.number_input_prompt_close()
        },
        number_input_prompt_close: function() {
            Popup.active_popup_text =
                "";
            addClass(document.getElementById("number_input_prompt"), "hidden");
            Timers.set("close_number_input_prompt", function() {
                Popup.number_input_prompt_active = !1
            }, 10)
        },
        input_prompt: function(a, b, d, e) {
            Popup.active_popup_text = a;
            supports.datalist && (document.getElementById("input_prompt_answer").setAttribute("list", ""), "string" == typeof d && document.getElementById("input_prompt_answer").setAttribute("list", d));
            "undefined" == typeof e ? document.getElementById("input_prompt_answer").oninput = null_function : document.getElementById("input_prompt_answer").oninput =
                function(a) {
                    this.value = e(this.value)
                };
            removeClass(document.getElementById("input_prompt"), "hidden");
            document.getElementById("input_prompt_question").innerHTML = a;
            document.getElementById("input_prompt_answer").value = "";
            GAME_STATE == GAME_STATES.CHAT && ChatSystem.toggle();
            document.getElementById("input_prompt_answer").focus();
            Popup.input_prompt_callback_variable = b;
            windowOpen = Popup.input_prompt_active = !0
        },
        input_prompt_confirm: function() {
            Popup.input_prompt_close();
            Popup.input_prompt_callback_variable(document.getElementById("input_prompt_answer").value)
        },
        input_prompt_close: function() {
            Popup.active_popup_text = "";
            addClass(document.getElementById("input_prompt"), "hidden");
            Popup.input_prompt_active = !1
        },
        input_prompt_active: !1,
        prompt_callback_variable: !1,
        prompt_callback_no_variable: !1,
        dialog_no_force: !1,
        dialog_active: !1,
        dialog: function(a, b, d, e) {
            Popup.dialog_active = !0;
            Popup.active_popup_text = a;
            removeClass(document.getElementById("dialog"), "dialog_big");
            removeClass(document.getElementById("dialog"), "dialog_biggest");
            "undefined" != typeof d && addClass(document.getElementById("dialog"),
                "dialog_" + d);
            removeClass(document.getElementById("dialog"), "hidden");
            document.getElementById("dialog_text").innerHTML = a;
            Popup.dialog_callback_variable = b;
            Popup.dialog_no_force = e || !1;
            windowOpen = !0
        },
        on_top_dialog: function(a, b, d) {
            document.getElementById("dialog").style.zIndex = 1E4;
            Popup.dialog(a, function() {
                document.getElementById("dialog").style.zIndex = 500;
                b()
            }, d)
        },
        dialog_close: function(a) {
            Popup.dialog_active = !1;
            Popup.active_popup_text = "";
            addClass(document.getElementById("dialog"), "hidden");
            if (!a || Popup.dialog_no_force) Popup.dialog_callback_variable(),
                Popup.dialog_no_force && (Popup.dialog_callback_variable = null_function)
        },
        accept: function() {
            hasClass(document.getElementById("prompt"), "hidden") ? hasClass(document.getElementById("dialog"), "hidden") ? hasClass(document.getElementById("input_prompt"), "hidden") ? hasClass(document.getElementById("number_input_prompt"), "hidden") || Popup.number_input_prompt_confirm() : Popup.input_prompt_confirm() : Popup.dialog_close() : Popup.prompt_confirm()
        },
        dialog_callback_variable: !1,
        input_prompt_callback_variable: !1,
        active_popup_text: ""
    },
    WebPayment = {
        init: function() {},
        price_multiplier: 1,
        open: function(a) {
            if ("Name" != players[0].name) {
                var b = document.getElementById("payment_form");
                if ("block" != b.style.display || a) {
                    a || _gaq.push(["_trackPageview", "/open_mos_market"]);
                    document.getElementById("payment_aol").style.display = "none";
                    document.getElementById("payment_credit_card").style.display = "none";
                    document.getElementById("payment_bitcoin").style.display = "none";
                    document.getElementById("payment_mocospace").style.display = "none";
                    document.getElementById("payment_kongregate").style.display =
                        "none";
                    document.getElementById("payment_steam").style.display = "none";
                    document.getElementById("payment_item_preview").style.display = "none";
                    document.getElementById("payment_form").style.display = "block";
                    document.getElementById("payment_main").style.display = "block";
                    a = JSON.clone(ItemPacks);
                    for (b = 0; b < a.length; b++)(a[b].name = _tn(a[b].name), 0 != a[b].mos || a[b].no_discount || (a[b].price_mos = Math.round(a[b].price_mos * WebPayment.price_multiplier)), a[b].enabled) ? a[b].is_premium && !Player.can_buy_premium(players[0].temp.premium_until) ?
                        (a.splice(b, 1), --b) : a[b].is_rename && ("undefined" != typeof provider || Player.has_lower_permissions(players[0].name)) && (a.splice(b, 1), --b) : (a.splice(b, 1), --b);
                    sortArrayOfObjectsBy(a, [{
                        field: "price_mos",
                        order: "asc"
                    }, {
                        field: "name",
                        order: "asc"
                    }]);
                    for (var b = 0, d = a.length; b < d; b++) a[b].classes = b % 2 ? "row even" : "row";
                    document.getElementById("payment_items").innerHTML = WebPayment.items_template()({
                        results: a
                    })
                } else b.style.display = "none"
            }
        },
        open_gamescom: function(a) {
            document.getElementById("regular_payment_options").style.display =
                "none";
            document.getElementById("gamescom_payment_options").style.display = "inline";
            WebPayment.open(a)
        },
        open_kongregate: function(a) {
            document.getElementById("regular_payment_options").style.display = "none";
            document.getElementById("kongregate_payment_options").style.display = "inline";
            WebPayment.open(a)
        },
        open_steam: function(a) {
            document.getElementById("regular_payment_options").style.display = "none";
            document.getElementById("steam_payment_options").style.display = "inline";
            WebPayment.open(a)
        },
        open_mocospace: function(a) {
            document.getElementById("regular_payment_options").style.display =
                "none";
            document.getElementById("mocospace_payment_options").style.display = "inline";
            WebPayment.open(a)
        },
        update: function() {
            var a = document.getElementById("payment_item_pack_id");
            "Name" == players[0].name && (document.getElementById("payment_form").style.display = "none");
            document.getElementById("paypal_hash").value = players[0].name + "|" + a.value + "|1";
            document.getElementById("paypal_amount").value = ItemPacks[a.value].price_usd.toFixed(2);
            document.getElementById("payment_sum").innerHTML = ItemPacks[a.value].price_usd.toFixed(2);
            for (var b = "", d = 0; d < ItemPacks[a.value].items.length; d++) {
                var e = WebPayment.item_img(ItemPacks[a.value].items[d].id),
                    f = item_base[ItemPacks[a.value].items[d].id].name;
                1 < ItemPacks[a.value].items[d].count && (b += ItemPacks[a.value].items[d].count + "x");
                b += "<span style='" + e + 'width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;\' class="tooltip" title="' + f + '" onclick="Items.get_info(' + ItemPacks[a.value].items[d].id + ')" item_id="' + ItemPacks[a.value].items[d].id + '">&nbsp;</span>'
            }
            0 < ItemPacks[a.value].coins &&
                (b += "<div>+ " + thousandSeperate(ItemPacks[a.value].coins) + " coins</div>");
            document.getElementById("payment_content").innerHTML = b
        },
        update_credit: function(a) {
            "Name" == players[0].name && (document.getElementById("payment_form").style.display = "none");
            var b = ItemPacks[a];
            document.getElementById("paypal_hash").value = players[0].name + "|" + a + "|1";
            document.getElementById("paypal_amount").value = b.price_usd.toFixed(2);
            document.getElementById("payment_sum").innerHTML = b.price_usd.toFixed(2)
        },
        aol_update_credit: function(a) {
            "Name" ==
            players[0].name && (document.getElementById("payment_form").style.display = "none");
            var b = ItemPacks[a];
            document.getElementById("aol_start_payment_link").onclick = function() {
                WebPayment.aol_start(b.price_usd.toFixed(2), players[0].name + "|" + a + "|1")
            };
            document.getElementById("aol_payment_sum").innerHTML = b.price_usd.toFixed(2)
        },
        kongregate_update_credit: function(a) {
            "Name" == players[0].name && (document.getElementById("payment_form").style.display = "none");
            var b = ItemPacks[a];
            document.getElementById("kongregate_start_payment_link").onclick =
                function() {
                    WebPayment.kongregate_start(a)
                };
            document.getElementById("kongregate_payment_sum").innerHTML = 13 * Math.round(b.price_usd.toFixed(2))
        },
        mocospace_update_credit: function(a) {
            "Name" == players[0].name && (document.getElementById("payment_form").style.display = "none");
            var b = ItemPacks[a];
            document.getElementById("mocospace_start_payment_link").onclick = function() {
                WebPayment.mocospace_start(b)
            };
            document.getElementById("mocospace_payment_sum").innerHTML = 161 * Math.round(b.price_usd.toFixed(2))
        },
        steam_update_credit: function(a) {
            "Name" ==
            players[0].name && (document.getElementById("payment_form").style.display = "none");
            document.getElementById("steam_error").style.display = "none";
            document.getElementById("steam_options").style.display = "block";
            document.getElementById("steam_loading").style.display = "none";
            var b = ItemPacks[a];
            document.getElementById("steam_start_payment_link").onclick = function() {
                WebPayment.steam_start(b)
            };
            document.getElementById("steam_payment_sum").innerHTML = b.price_usd.toFixed(2);
            document.getElementById("steam_payment_vat").innerHTML =
                "";
            Country.vat_required(players[0].temp.country) && (document.getElementById("steam_payment_vat").innerHTML = " + " + Country.abbr(players[0].temp.country) + " ")
        },
        update_bitcoin: function(a) {
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_bitcoin").style.display = "block";
            document.getElementById("btc_options").style.display = "block";
            document.getElementById("btc_loading").style.display = "none";
            var b = [30, 40, 4, 2],
                d;
            for (d in b) {
                var e = b[d],
                    f = document.getElementById("btc_" +
                        e);
                a[e] ? (document.getElementById("btc_" + e + "_link").href = "https://coinbase.com/checkouts/" + a[e], f.style.display = "block") : f.style.display = "none"
            }
        },
        item_img: function(a) {
            return Items.get_background_image(item_base[a].b_i)
        },
        mobile: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_mobile"]);
            isMobile() && (document.getElementById("payment_form").style.display = "none");
            window.open("https://fortumo.com/mobile_payments/b6e3084243736cfc5568a026abffe0a9?cuid=" + encodeURIComponent(players[0].name), "_blank")
        },
        bitcoin: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_bitcoin"]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_bitcoin").style.display = "block";
            document.getElementById("btc_options").style.display = "none";
            document.getElementById("btc_loading").style.display = "block";
            Socket.send("btc_open")
        },
        other: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_paymentwall"]);
            window.open("https://api.paymentwall.com/api/ps/?key=e20340eef8f99c10151ed523382907fb&uid=" +
                encodeURIComponent(players[0].name) + "&widget=p10_1", "_blank")
        },
        credit_card: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_credit_card"]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_credit_card").style.display = "block";
            document.getElementById("credits_2100").checked = !0;
            document.getElementById("payment_vat").innerHTML = "";
            Country.vat_required(players[0].temp.country) && (document.getElementById("payment_vat").innerHTML = " + " + Country.abbr(players[0].temp.country));
            WebPayment.update_credit(4)
        },
        kongregate: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_kongregate"]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_kongregate").style.display = "block";
            document.getElementById("kongregate_credits_2100").checked = !0;
            WebPayment.kongregate_update_credit(4)
        },
        kongregate_start: function(a) {
            kongregate.api.mtx.purchaseItems([a + ""], function(a) {
                a.success && WebPayment.check_kongregate_payment()
            })
        },
        mocospace: function() {
            _gaq.push(["_trackPageview",
                "/open_mos_market_mocospace"
            ]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_mocospace").style.display = "block";
            document.getElementById("mocospace_credits_2100").checked = !0;
            WebPayment.mocospace_update_credit(4)
        },
        mocospace_start: function(a) {
            var b = 161 * Math.round(a.price_usd.toFixed(2));
            MocoSpace.goldTransaction(b, a.name, {
                onSuccess: function(d, e, f) {
                    LazyLoad.js("https://rpg-de.mo.ee/payments/mocospace/?player=" + encodeURIComponent(players[0].name.toLowerCase()) +
                        "&token=" + encodeURIComponent(f) + "&timestamp=" + encodeURIComponent(e) + "&amount=" + encodeURIComponent(b) + "&item=" + encodeURIComponent(a.id) + "&id=" + encodeURIComponent(d),
                        function() {})
                },
                onError: function(a) {
                    alert("Error getting item: " + a);
                    WebPayment.open(!0)
                },
                onAbort: function() {
                    WebPayment.open(!0)
                },
                onAsync: function() {}
            }, a.img)
        },
        aol: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_aol"]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_aol").style.display =
                "block";
            document.getElementById("aol_credits_2100").checked = !0;
            WebPayment.aol_update_credit(4)
        },
        aol_start: function(a, b) {
            GAMESAPI.TRANSACTION.startTransaction(a, b, "RPGMO_MOS_CREDITS", function(a) {
                a && a.data && a.data.assetId && a.data.amount && a.data.orderId && WebPayment.report_aol_payment(a.data.amount, a.data.assetId, a.data.orderId)
            }, function(a) {})
        },
        steam: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_steam"]);
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_steam").style.display =
                "block";
            document.getElementById("steam_options").style.display = "none";
            document.getElementById("steam_error").style.display = "none";
            document.getElementById("steam_loading").style.display = "block";
            if ("undefined" == typeof greenworks || !greenworks || !greenworks.initAPI() || !greenworks.getSteamId()) return WebPayment.steam_failed();
            Socket.send("steam", {
                sub: "open",
                steamid: greenworks.getSteamId().staticAccountId
            })
        },
        steam_failed: function() {
            _gaq.push(["_trackPageview", "/open_mos_market_failed_steam"]);
            document.getElementById("steam_error").style.display =
                "block";
            document.getElementById("steam_options").style.display = "none";
            document.getElementById("steam_loading").style.display = "none"
        },
        steam_start: function(a) {
            Socket.send("steam", {
                sub: "start_payment",
                steamid: greenworks.getSteamId().staticAccountId,
                item_pack_id: a.id,
                web: "linux" == process.platform || Steam.payment_issues
            })
        },
        items_template: function() {
            "undefined" == typeof web_payment_items_template && (web_payment_items_template = Handlebars.compile("<table class='table scrolling_allowed'><tbody class='scrolling_allowed'><tr><th style='width:265px;'>{{_t 'Item'}}</th><th>{{_t 'Price'}}</th><th></th></tr>{{#each results}}<tr class='{{this.classes}} scrolling_allowed' onclick='WebPayment.open_offer({{this.id}})'>  <td class='scrolling_allowed' style='width:265px;'>{{#if this.is_hot}}<font color='red'>{{_t 'HOT!'}} </font>{{/if}}{{#if this.is_new}}<font color='yellow'>{{_t 'NEW!'}} </font>{{/if}}{{this.name}}</td>  <td class='scrolling_allowed'>{{this.price_mos}}</td>  <td class='scrolling_allowed'><button onclick='WebPayment.buy({{this.id}})' class='market_select pointer'>{{__t 'Buy'}}</button></td></tr>{{/each}}</tbody></table>"));
            return web_payment_items_template
        },
        open_offer: function(a) {
            web_payment_active = a;
            var b = "";
            ItemPacks[a].desc && (b = "<p>" + _ti(ItemPacks[a].desc) + "</p>");
            70 == a && (b = "<p>" + _tu(ItemPacks[a].desc) + "</p>");
            for (var d = 0; d < ItemPacks[a].items.length; d++) {
                var e = WebPayment.item_img(ItemPacks[a].items[d].id),
                    f = _tn(item_base[ItemPacks[a].items[d].id].name);
                1 < ItemPacks[a].items[d].count && (b += ItemPacks[a].items[d].count + "x");
                b += "<span style='" + e + 'width: 32px;height: 32px;display: inline-block;margin: 0px;padding: 0px;\' class="tooltip" title="' +
                    f + '" onclick="Items.get_info(' + ItemPacks[a].items[d].id + ')" item_id="' + ItemPacks[a].items[d].id + '">&nbsp;</span>'
            }
            0 < ItemPacks[a].coins && (b += "<div>+ " + thousandSeperate(ItemPacks[a].coins) + " " + _ti("coins") + "</div>");
            document.getElementById("payment_main").style.display = "none";
            document.getElementById("payment_item_preview").style.display = "block";
            loadSpecificImage("market_example_small");
            document.getElementById("payment_content").innerHTML = b
        },
        buy: function(a) {
            "undefined" == typeof a ? a = web_payment_active :
                web_payment_active = a;
            last_mos_balance < Math.round(ItemPacks[a].price_mos * WebPayment.price_multiplier) ? Popup.dialog(_te("You do not have enough MOS points!"), function() {
                WebPayment.open(!0);
                "undefined" != typeof kongregate && WebPayment.kongregate()
            }) : Popup.prompt(_ti("Are you sure?"), function() {
                ItemPacks[a].is_premium ? Socket.send("premium", {
                    accept: !0
                }) : ItemPacks[a].is_rename ? Player.rename.dialog() : Socket.send("web_payment_buy", {
                    item_pack_id: a
                })
            })
        },
        set_balance: function(a) {
            document.getElementById("payment_mos_amount").innerHTML =
                a
        },
        report_aol_payment: function(a, b, d, e) {
            setTimeout(function() {
                LazyLoad.js("https://rpg-de.mo.ee/payments/gamescom/?price=" + encodeURIComponent(a) + "&assetid=" + encodeURIComponent(b) + "&orderid=" + encodeURIComponent(d) + "&sessionid=" + encodeURIComponent(gamescom.sessionid) + "&access_token=" + encodeURIComponent(gamescom.access_token) + "&t=" + timestamp(), function() {})
            }, e || 1E3)
        },
        check_kongregate_payment: function() {
            "name" == players[0].name.toLowerCase() ? setTimeout(function() {
                    WebPayment.check_kongregate_payment()
                },
                1E3) : setTimeout(function() {
                LazyLoad.js("https://rpg-de.mo.ee/payments/kongregate/?user_id=" + encodeURIComponent(kongregate.api.services.getUserId()) + "&player=" + encodeURIComponent(players[0].name.toLowerCase()) + "&game_auth_token=" + encodeURIComponent(kongregate.api.services.getGameAuthToken()) + "&t=" + timestamp(), function() {})
            }, 1E3)
        }
    },
    mtgox = !1;

function detectMobile(a) {
    return /android|mobile crosswalk|; wv\)|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,
        4))
}

function isMobile() {
    return detectMobile(navigator.userAgent || navigator.vendor || window.opera)
}
var Pet = {
        client_init: function(a) {
            if ("undefined" != typeof a.pet.id && a.pet.enabled) {
                if ("undefined" != typeof players[a.id + "pet"])
                    if (a.pet.id != players[a.id + "pet"].id) delete players[a.id + "pet"];
                    else return;
                if (a.me || other_pets_visible) players[a.id + "pet"] = getPlayersPet(a), a.me && GAME_STATE != GAME_STATES.SPECTATE && TopIcons.show("pet"), Timers.set("move_pet" + a.id + "pet", function() {
                    Pet.walk(a)
                }, parseInt(5E3 * Math.random()))
            }
        },
        client_init_breeding: function(a, b) {
            var d = "300_" + b.i + "_" + b.j;
            players[d] && players[d].temp.pet_id ==
                a || (players[d] = getPlayersPet(players[0]), players[d].params.orig_i = b.i, players[d].params.orig_j = b.j, b = getClosestWalkablePosition(current_map, b.i, b.j) || b, players[d].name = extract_island_owner() + "'s pet", players[d].img = pets[a].img, players[d].i = b.i, players[d].j = b.j, players[d].temp.to.i = b.i, players[d].temp.to.j = b.j, players[d].temp.dest.i = b.i, players[d].temp.dest.j = b.j, players[d].temp.pet_id = a, Timers.set("move_pet" + d + "pet", function() {
                    Pet.walk_breeder(d)
                }, parseInt(1E3 * Math.random())))
        },
        client_deinit: function(a) {
            a.me &&
                TopIcons.hide("pet");
            delete players[a.id + "pet"];
            Timers.clear("move_pet" + a.id + "pet")
        },
        walk: function(a) {
            var b = a.me ? 0 : a.id;
            if ("undefined" == typeof players[b]) Pet.client_deinit(a);
            else if (0 == b && a.id != players[0].id) a.me = !1, Pet.client_deinit(a);
            else if (players[b].pet.enabled)
                if ("undefined" == typeof players[a.id + "pet"]) Pet.client_init(players[b]);
                else {
                    var b = players[b],
                        d = players[a.id + "pet"];
                    12 < distance(b.i, b.j, d.i, d.j) && (d.i = b.i, d.j = b.j, d.temp.to.i = b.i, d.temp.to.j = b.j);
                    d.map = b.map;
                    d.temp.dest.i = b.i - 2 + (4 * Math.random() <<
                        0);
                    d.temp.dest.j = b.j - 2 + (4 * Math.random() << 0);
                    Timers.set("move_pet" + a.id + "pet", function() {
                        Pet.walk(a)
                    }, 5E3 + 5E3 * Math.random() << 0)
                }
            else Pet.client_deinit(a)
        },
        walk_breeder: function(a) {
            if ("undefined" != typeof players[a]) {
                var b = players[a];
                if ("undefined" != typeof on_map[b.map][b.params.orig_i][b.params.orig_j] && on_map[b.map][b.params.orig_i][b.params.orig_j] && "undefined" != typeof on_map[b.map][b.params.orig_i][b.params.orig_j].params.pet_id)
                    if (100 <= Breeding.get_pet_hunger(null, {
                            i: players[a].params.orig_i,
                            j: players[a].params.orig_j
                        })) delete players[a];
                    else {
                        var d = 3 * Math.random() << 0,
                            e = 2 * Math.random() << 0;
                        0 != d && (2 == d && (d = -1), b.temp.dest.i = b.i, b.temp.dest.j = b.j, e ? b.temp.dest.i += d : b.temp.dest.j += d);
                        map_walkable(b.map, b.temp.dest.i, b.temp.dest.j) || (b.temp.to.i = b.i, b.temp.to.j = b.j, b.temp.dest.i = b.i, b.temp.dest.j = b.j);
                        Timers.set("move_pet" + a + "pet", function() {
                            Pet.walk_breeder(a)
                        }, 1E3 + 500 * Math.random() << 0)
                    }
                else delete players[a]
            }
        },
        init_menu: function() {
            BigMenu.show(-1);
            document.getElementById("pet_form").style.display = "block";
            for (var a = 0; 24 > a; a++) pets[players[0].pet.id].params.inventory_slots >
                a ? document.getElementById("pet_chest_" + a).style.display = "inline-block" : document.getElementById("pet_chest_" + a).style.display = "none";
            for (a = 0; 36 > a; a++) {
                var b = document.getElementById("pet_inv_" + a);
                removeClass(b, "selected");
                if ("undefined" != typeof players[0].temp.inventory[a]) {
                    var d = item_base[players[0].temp.inventory[a].id];
                    b.style.background = Items.get_background(d.b_i)
                } else b.style.background = ""
            }
            for (a = 0; a < pets[players[0].pet.id].params.inventory_slots; a++) b = document.getElementById("pet_chest_" + a), removeClass(b,
                "selected"), "undefined" != typeof players[0].pet.chest[a] ? (d = item_base[players[0].pet.chest[a]], b.style.background = Items.get_background(d.b_i)) : b.style.background = "";
            a = "";
            a = pets[players[0].pet.id];
            a = a.params.xp_required ? _ti("Pet experience {xp}/{total} ({percent}%)", {
                xp: Math.round(players[0].pet.xp),
                total: a.params.xp_required,
                percent: Math.floor(players[0].pet.xp / a.params.xp_required * 100)
            }) : a.params.requires_stone ? _ti("Pet needs {item_name} to evolve.", {
                item_name: item_base[710].name
            }) : _ti("Pet has reached its maximum level");
            document.getElementById("pet_settings").innerHTML = a
        },
        menu_add: function(a) {
            !Timers.running("pet_chest_add") && !players[0].temp.busy && pets[players[0].pet.id].params.inventory_slots > players[0].pet.chest.length && players[0].temp.inventory.length > a && (Socket.send("pet_chest_add", {
                inventory_slot: a
            }), Timers.set("pet_chest_add", null_function, 80))
        },
        menu_load: function() {
            Timers.running("pet_chest_load") || (!players[0].temp.busy && pets[players[0].pet.id].params.inventory_slots > players[0].pet.chest.length && Socket.send("pet_chest_load", {}), Timers.set("pet_chest_load", null_function, 250))
        },
        menu_remove: function(a) {
            !Timers.running("pet_chest_remove") && !players[0].temp.busy && players[0].pet.chest.length > a && 40 > players[0].temp.inventory.length && (Socket.send("pet_chest_remove", {
                slot: a
            }), Timers.set("pet_chest_remove", null_function, 80))
        },
        menu_unload: function() {
            Timers.running("pet_chest_unload") || (!players[0].temp.busy && 0 < players[0].pet.chest.length && 40 > players[0].temp.inventory.length && Socket.send("pet_chest_unload", {}), Timers.set("pet_chest_unload",
                null_function, 250))
        },
        move_client: function(a, b) {
            Socket.send("inventory", {
                sub: "pet_move",
                from_slot: a,
                to_slot: b
            })
        },
        move: function(a, b, d) {
            var e = clients[a];
            "undefined" != typeof e && e.pet && e.pet.enabled && "number" == typeof b && "number" == typeof b && b != d && (d > clients[a].pet.chest.length && (d = clients[a].pet.chest.length), clients[a].pet.chest[b] && (b = clients[a].pet.chest.splice(b, 1)[0], clients[a].pet.chest.splice(d, 0, b), Player.send_pet_data(a)))
        }
    },
    pets = [];
pets[1] = createObject({
    b_i: 1,
    b_t: BASE_TYPE.PET,
    name: "Baby Ruby Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 0,
        y: 0
    },
    params: {
        item_id: 669,
        xp_required: 1E5,
        inventory_slots: 3,
        next_pet_item_id: 671,
        level: 1,
        eats: {
            285: .15,
            494: .075
        },
        eat_interval: 5,
        happiness: 10,
        insurance_cost: [6E4, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[2] = createObject({
    b_i: 2,
    b_t: BASE_TYPE.PET,
    name: "Gray Dog [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 9,
        y: 0
    },
    params: {
        item_id: 670,
        xp_required: 1E5,
        inventory_slots: 0,
        next_pet_item_id: 674,
        level: 1,
        eats: {
            494: .1
        },
        eat_interval: 5,
        happiness: 5,
        insurance_cost: [15E3, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[3] = createObject({
    b_i: 3,
    b_t: BASE_TYPE.PET,
    name: "Ruby Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 5,
        y: 2
    },
    params: {
        item_id: 671,
        xp_required: 5E5,
        inventory_slots: 6,
        next_pet_item_id: 672,
        level: 2,
        eats: {
            285: .12,
            494: .06
        },
        eat_interval: 5,
        happiness: 12,
        insurance_cost: [78E3, 6],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[4] = createObject({
    b_i: 4,
    b_t: BASE_TYPE.PET,
    name: "King Ruby Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 0,
        y: 4
    },
    params: {
        item_id: 672,
        inventory_slots: 7,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 673,
        level: 3,
        eats: {
            285: .075,
            494: .025
        },
        eat_interval: 8,
        happiness: 20,
        insurance_cost: [97500, 7],
        breeding_level: 58,
        likes: [{
            pet_id: 5,
            xp: 868,
            returns: [{
                pet_id: 117,
                base_chance: .6,
                max_chance: .85
            }, {
                pet_id: 231,
                base_chance: .05,
                max_chance: .05
            }]
        }, {
            pet_id: 38,
            xp: 1388,
            returns: [{
                pet_id: 114,
                base_chance: .6,
                max_chance: .83
            }, {
                pet_id: 116,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 244,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 245,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 42,
            xp: 859,
            returns: [{
                pet_id: 106,
                base_chance: .6,
                max_chance: .83
            }, {
                pet_id: 105,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 224,
                base_chance: .1,
                max_chance: .1
            }, {
                pet_id: 225,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[5] = createObject({
    b_i: 5,
    b_t: BASE_TYPE.PET,
    name: "Chaotic Ruby Dragon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 1,
        y: 1
    },
    params: {
        item_id: 673,
        inventory_slots: 11,
        level: 4,
        eats: {
            283: .05,
            238: .25
        },
        eat_interval: 10,
        happiness: 30,
        insurance_cost: [397500, 30],
        breeding_level: 80
    }
}, 1);
pets[6] = createObject({
    b_i: 6,
    b_t: BASE_TYPE.PET,
    name: "Gray Wolf [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 17,
        y: 0
    },
    params: {
        item_id: 674,
        inventory_slots: 3,
        level: 2,
        eats: {
            8: .25,
            271: .3
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [19500, 2],
        breeding_level: 1,
        likes: [{
            pet_id: 6,
            xp: 136,
            returns: [{
                pet_id: 62,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 63,
                base_chance: .05,
                max_chance: .08
            }]
        }]
    }
}, 1);
pets[7] = createObject({
    b_i: 7,
    b_t: BASE_TYPE.PET,
    name: "Brown Dog [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 11,
        y: 0
    },
    params: {
        item_id: 675,
        xp_required: 1E5,
        inventory_slots: 0,
        next_pet_item_id: 676,
        level: 1,
        eats: {
            494: .1
        },
        eat_interval: 5,
        happiness: 5,
        insurance_cost: [15E3, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[8] = createObject({
    b_i: 8,
    b_t: BASE_TYPE.PET,
    name: "Brown Wolf [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 18,
        y: 0
    },
    params: {
        item_id: 676,
        inventory_slots: 3,
        level: 2,
        eats: {
            8: .25,
            272: .5
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [19500, 2],
        breeding_level: 1,
        likes: [{
            pet_id: 8,
            xp: 136,
            returns: [{
                pet_id: 72,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 63,
                base_chance: .06,
                max_chance: .08
            }]
        }]
    }
}, 1);
pets[9] = createObject({
    b_i: 9,
    b_t: BASE_TYPE.PET,
    name: "Baby Dinosaur [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 12,
        y: 0
    },
    params: {
        item_id: 677,
        xp_required: 1E5,
        inventory_slots: 6,
        next_pet_item_id: 678,
        level: 1,
        eats: {
            760: .3,
            271: .45,
            274: .6
        },
        eat_interval: 5,
        happiness: 5,
        insurance_cost: [6E4, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[10] = createObject({
    b_i: 10,
    b_t: BASE_TYPE.PET,
    name: "Dinosaur [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 3,
        y: 4
    },
    params: {
        item_id: 678,
        xp_required: 5E5,
        inventory_slots: 8,
        next_pet_item_id: 679,
        level: 2,
        eats: {
            760: .2,
            271: .3,
            274: .4
        },
        eat_interval: 5,
        happiness: 10,
        insurance_cost: [78E3, 6],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[11] = createObject({
    b_i: 11,
    b_t: BASE_TYPE.PET,
    name: "Spiky Dinosaur [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 3,
        y: 1
    },
    params: {
        item_id: 679,
        inventory_slots: 9,
        level: 3,
        eats: {
            760: .1,
            271: .15,
            274: .2
        },
        eat_interval: 5,
        happiness: 20,
        insurance_cost: [97500, 7],
        breeding_level: 60,
        likes: [{
            pet_id: 11,
            xp: 342,
            returns: [{
                pet_id: 127,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 128,
                base_chance: .06,
                max_chance: .1
            }]
        }, {
            pet_id: 32,
            xp: 294,
            returns: [{
                pet_id: 99,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 100,
                base_chance: .06,
                max_chance: .1
            }]
        }]
    }
}, 1);
pets[12] = createObject({
    b_i: 12,
    b_t: BASE_TYPE.PET,
    name: "White Horse [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 19,
        y: 0
    },
    params: {
        item_id: 680,
        xp_required: 5E5,
        inventory_slots: 9,
        next_pet_item_id: 681,
        level: 1,
        eats: {
            757: .05,
            758: .15,
            785: .3
        },
        eat_interval: 8,
        happiness: 24,
        insurance_cost: [3E5, 23],
        breeding_level: 75
    }
}, 1);
pets[13] = createObject({
    b_i: 13,
    b_t: BASE_TYPE.PET,
    name: "Unicorn [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 0,
        y: 1
    },
    params: {
        item_id: 681,
        inventory_slots: 11,
        next_pet_item_id: 886,
        requires_stone: !0,
        stones: 2,
        level: 2,
        eats: {
            757: .025,
            758: .07,
            785: .15
        },
        eat_interval: 12,
        happiness: 36,
        insurance_cost: [39E4, 30],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[14] = createObject({
    b_i: 14,
    b_t: BASE_TYPE.PET,
    name: "Baby Observer [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 11,
        y: 1
    },
    params: {
        item_id: 682,
        xp_required: 1E5,
        inventory_slots: 2,
        next_pet_item_id: 683,
        level: 1,
        eats: {
            268: .15,
            269: .24
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [55800, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[15] = createObject({
    b_i: 15,
    b_t: BASE_TYPE.PET,
    name: "Observer [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 5,
        y: 4
    },
    params: {
        item_id: 683,
        xp_required: 5E5,
        inventory_slots: 5,
        next_pet_item_id: 684,
        level: 2,
        eats: {
            268: .1,
            269: .16
        },
        eat_interval: 6,
        happiness: 18,
        insurance_cost: [72540, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[16] = createObject({
    b_i: 16,
    b_t: BASE_TYPE.PET,
    name: "King Observer [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 6,
        y: 4
    },
    params: {
        item_id: 684,
        inventory_slots: 6,
        next_pet_item_id: 685,
        requires_stone: !0,
        stones: 2,
        level: 3,
        eats: {
            268: .05,
            269: .08
        },
        eat_interval: 6,
        happiness: 28,
        insurance_cost: [90675, 7],
        breeding_level: 45,
        likes: [{
            pet_id: 16,
            xp: 477,
            returns: [{
                pet_id: 119,
                base_chance: .7,
                max_chance: .85
            }]
        }, {
            pet_id: 52,
            xp: 1890,
            returns: [{
                pet_id: 97,
                base_chance: .65,
                max_chance: .83
            }, {
                pet_id: 75,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 236,
                base_chance: .07,
                max_chance: .07
            }, {
                pet_id: 237,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[17] = createObject({
    b_i: 17,
    b_t: BASE_TYPE.PET,
    name: "Demonic Observer [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 2,
        y: 1
    },
    params: {
        item_id: 685,
        inventory_slots: 10,
        level: 4,
        eats: {
            268: .15,
            269: .2
        },
        eat_interval: 8,
        happiness: 30,
        insurance_cost: [390675, 30],
        breeding_level: 77,
        likes: [{
            pet_id: 55,
            xp: 3212,
            returns: [{
                pet_id: 78,
                base_chance: .6,
                max_chance: .86
            }, {
                pet_id: 266,
                base_chance: .07,
                max_chance: .07
            }]
        }]
    }
}, 1);
pets[18] = createObject({
    b_i: 18,
    b_t: BASE_TYPE.PET,
    name: "Ghost [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 1,
        y: 5
    },
    params: {
        item_id: 686,
        xp_required: 1E5,
        inventory_slots: 1,
        next_pet_item_id: 687,
        level: 1,
        eats: {
            269: .3,
            233: .4,
            1300: .6,
            1301: .8
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [18E3, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[19] = createObject({
    b_i: 19,
    b_t: BASE_TYPE.PET,
    name: "Nightmare Ghost [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 4,
        y: 5
    },
    params: {
        item_id: 687,
        inventory_slots: 3,
        level: 2,
        eats: {
            269: .15,
            233: .2,
            1300: .3,
            1301: .4
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [23400, 2],
        breeding_level: 5,
        likes: [{
            pet_id: 19,
            xp: 164,
            returns: [{
                pet_id: 137,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 122,
                base_chance: .05,
                max_chance: .1
            }]
        }, {
            pet_id: 42,
            xp: 1094,
            returns: [{
                pet_id: 65,
                base_chance: .58,
                max_chance: .75
            }, {
                pet_id: 129,
                base_chance: .06,
                max_chance: .1
            }, {
                pet_id: 226,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 227,
                base_chance: .03,
                max_chance: .03
            }]
        }]
    }
}, 1);
pets[20] = createObject({
    b_i: 20,
    b_t: BASE_TYPE.PET,
    name: "Angel [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 9,
        y: 1
    },
    params: {
        item_id: 688,
        xp_required: 1E5,
        inventory_slots: 6,
        next_pet_item_id: 689,
        level: 1,
        eats: {
            225: .45,
            1150: 1
        },
        eat_interval: 10,
        happiness: 10,
        insurance_cost: [36E4, 28],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[21] = createObject({
    b_i: 21,
    b_t: BASE_TYPE.PET,
    name: "Archangel [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 4,
        y: 0
    },
    params: {
        item_id: 689,
        xp_required: 5E5,
        inventory_slots: 9,
        next_pet_item_id: 690,
        level: 2,
        eats: {
            225: .3,
            1150: .7
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [468E3, 36],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[22] = createObject({
    b_i: 22,
    b_t: BASE_TYPE.PET,
    name: "Sacred Archangel [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 3,
        y: 0
    },
    params: {
        item_id: 690,
        inventory_slots: 10,
        next_pet_item_id: 691,
        requires_stone: !0,
        stones: 4,
        level: 3,
        eats: {
            225: .15,
            1150: .5
        },
        eat_interval: 10,
        happiness: 30,
        insurance_cost: [585E3, 45],
        breeding_level: 82,
        likes: [{
            pet_id: 53,
            xp: 2558,
            returns: [{
                pet_id: 131,
                base_chance: .38,
                max_chance: .58
            }, {
                pet_id: 132,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 259,
                base_chance: .06,
                max_chance: .06
            }, {
                pet_id: 260,
                base_chance: .04,
                max_chance: .04
            }]
        }]
    }
}, 1);
pets[23] = createObject({
    b_i: 23,
    b_t: BASE_TYPE.PET,
    name: "Saint Archangel [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 5,
        y: 0
    },
    params: {
        item_id: 691,
        inventory_slots: 13,
        level: 4,
        eats: {
            1150: .25,
            225: .05
        },
        eat_interval: 20,
        happiness: 50,
        insurance_cost: [1185E3, 91],
        breeding_level: 95,
        likes: [{
            pet_id: 23,
            xp: 4157,
            returns: [{
                pet_id: 83,
                base_chance: .6,
                max_chance: .836
            }, {
                pet_id: 82,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 261,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 262,
                base_chance: .03,
                max_chance: .03
            }]
        }, {
            pet_id: 26,
            xp: 2185,
            returns: [{
                pet_id: 85,
                base_chance: .55,
                max_chance: .72
            }, {
                pet_id: 84,
                base_chance: .06,
                max_chance: .1
            }, {
                pet_id: 125,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 263,
                base_chance: .07,
                max_chance: .07
            }, {
                pet_id: 264,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 265,
                base_chance: .03,
                max_chance: .03
            }]
        }]
    }
}, 1);
pets[24] = createObject({
    b_i: 24,
    b_t: BASE_TYPE.PET,
    name: "Skeleton [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 9,
        y: 4
    },
    params: {
        item_id: 692,
        xp_required: 2E5,
        inventory_slots: 0,
        next_pet_item_id: 693,
        level: 1,
        eats: {
            233: .45,
            1300: .9,
            1301: 1,
            221: 1
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [37200, 3],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[25] = createObject({
    b_i: 25,
    b_t: BASE_TYPE.PET,
    name: "Skeleton Warrior [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 0,
        y: 5
    },
    params: {
        item_id: 693,
        xp_required: 8E5,
        inventory_slots: 2,
        next_pet_item_id: 694,
        level: 2,
        eats: {
            233: .3,
            1300: .6,
            1301: .8,
            221: 2
        },
        eat_interval: 6,
        happiness: 23,
        insurance_cost: [48360, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[26] = createObject({
    b_i: 26,
    b_t: BASE_TYPE.PET,
    name: "Skeleton King [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 8,
        y: 0
    },
    params: {
        item_id: 694,
        inventory_slots: 4,
        next_pet_item_id: 711,
        requires_stone: !0,
        stones: 4,
        level: 3,
        eats: {
            233: .15,
            1300: .3,
            1301: .4,
            221: .5
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [60450, 5],
        breeding_level: 12
    }
}, 1);
pets[27] = createObject({
    b_i: 27,
    b_t: BASE_TYPE.PET,
    name: "Skeleton Overlord [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 10,
        y: 0
    },
    params: {
        item_id: 711,
        inventory_slots: 9,
        level: 4,
        eats: {
            270: .1,
            271: .15
        },
        eat_interval: 12,
        happiness: 35,
        insurance_cost: [660450, 51],
        breeding_level: 85
    }
}, 1);
pets[28] = createObject({
    b_i: 28,
    b_t: BASE_TYPE.PET,
    name: "Baby Griffin [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 0,
        y: 2
    },
    params: {
        item_id: 695,
        xp_required: 15E4,
        inventory_slots: 2,
        next_pet_item_id: 696,
        level: 1,
        eats: {
            762: .45,
            80: .15,
            1300: .9,
            1301: 1
        },
        eat_interval: 6,
        happiness: 10,
        insurance_cost: [58200, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[29] = createObject({
    b_i: 29,
    b_t: BASE_TYPE.PET,
    name: "Griffin [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.MONSTER532,
        x: 4,
        y: 1
    },
    params: {
        item_id: 696,
        xp_required: 3E5,
        inventory_slots: 5,
        next_pet_item_id: 697,
        level: 2,
        eats: {
            762: .3,
            80: .1,
            1300: .6,
            1301: .8
        },
        eat_interval: 6,
        happiness: 15,
        insurance_cost: [75660, 6],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[30] = createObject({
    b_i: 30,
    b_t: BASE_TYPE.PET,
    name: "Royal Griffin [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.MONSTER532,
        x: 5,
        y: 1
    },
    params: {
        item_id: 697,
        inventory_slots: 6,
        level: 3,
        eats: {
            762: .15,
            80: .05,
            1300: .3,
            1301: .4
        },
        eat_interval: 6,
        happiness: 20,
        insurance_cost: [94575, 7],
        breeding_level: 50
    }
}, 1);
pets[31] = createObject({
    b_i: 31,
    b_t: BASE_TYPE.PET,
    name: "Emerald Geko [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.MONSTER532,
        x: 3,
        y: 1
    },
    params: {
        item_id: 698,
        xp_required: 7E5,
        inventory_slots: 4,
        next_pet_item_id: 699,
        level: 1,
        eats: {
            268: .1,
            267: 1
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [54E3, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[32] = createObject({
    b_i: 32,
    b_t: BASE_TYPE.PET,
    name: "Moss Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 7,
        y: 4
    },
    params: {
        item_id: 699,
        inventory_slots: 6,
        level: 2,
        eats: {
            268: .05,
            267: .5
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [70200, 5],
        breeding_level: 30,
        likes: [{
            pet_id: 16,
            xp: 340,
            returns: [{
                pet_id: 87,
                base_chance: .55,
                max_chance: .72
            }, {
                pet_id: 88,
                base_chance: .06,
                max_chance: .1
            }, {
                pet_id: 108,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 32,
            xp: 295,
            returns: [{
                pet_id: 144,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 102,
                base_chance: .06,
                max_chance: .1
            }]
        }]
    }
}, 1);
pets[33] = createObject({
    b_i: 33,
    b_t: BASE_TYPE.PET,
    name: "Ruby Geko [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.MONSTER532,
        x: 2,
        y: 1
    },
    params: {
        item_id: 700,
        xp_required: 7E5,
        inventory_slots: 4,
        next_pet_item_id: 701,
        level: 1,
        eats: {
            94: .1,
            206: .3,
            1300: .6,
            1301: .8
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [54E3, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[34] = createObject({
    b_i: 34,
    b_t: BASE_TYPE.PET,
    name: "Flame Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 8,
        y: 4
    },
    params: {
        item_id: 701,
        inventory_slots: 6,
        level: 2,
        eats: {
            94: .05,
            206: .15,
            1300: .3,
            1301: .4
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [70200, 5],
        breeding_level: 25,
        likes: [{
            pet_id: 34,
            xp: 369,
            returns: [{
                pet_id: 145,
                base_chance: .6,
                max_chance: .75
            }, {
                pet_id: 93,
                base_chance: .06,
                max_chance: .1
            }]
        }, {
            pet_id: 32,
            xp: 369,
            returns: [{
                pet_id: 101,
                base_chance: .6,
                max_chance: .73
            }, {
                pet_id: 146,
                base_chance: .06,
                max_chance: .1
            }]
        }]
    }
}, 1);
pets[35] = createObject({
    b_i: 35,
    b_t: BASE_TYPE.PET,
    name: "Baby Black Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 6,
        y: 0
    },
    params: {
        item_id: 702,
        xp_required: 2E5,
        inventory_slots: 3,
        next_pet_item_id: 703,
        level: 1,
        eats: {
            285: .45,
            494: .15
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [15E4, 11],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[36] = createObject({
    b_i: 36,
    b_t: BASE_TYPE.PET,
    name: "Black Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 4,
        y: 2
    },
    params: {
        item_id: 703,
        xp_required: 6E5,
        inventory_slots: 6,
        next_pet_item_id: 704,
        level: 2,
        eats: {
            285: .3,
            494: .1
        },
        eat_interval: 6,
        happiness: 18,
        insurance_cost: [195E3, 15],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[37] = createObject({
    b_i: 37,
    b_t: BASE_TYPE.PET,
    name: "King Black Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 3,
        y: 4
    },
    params: {
        item_id: 704,
        inventory_slots: 7,
        next_pet_item_id: 705,
        requires_stone: !0,
        stones: 3,
        level: 3,
        eats: {
            285: .15,
            494: .05
        },
        eat_interval: 6,
        happiness: 24,
        insurance_cost: [243750, 19],
        breeding_level: 73,
        likes: [{
            pet_id: 5,
            xp: 1125,
            returns: [{
                pet_id: 113,
                base_chance: .6,
                max_chance: .83
            }, {
                pet_id: 96,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 232,
                base_chance: .07,
                max_chance: .07
            }, {
                pet_id: 233,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 38,
            xp: 1644,
            returns: [{
                pet_id: 107,
                base_chance: .56,
                max_chance: .832
            }, {
                pet_id: 86,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 246,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 247,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 42,
            xp: 1116,
            returns: [{
                pet_id: 115,
                base_chance: .6,
                max_chance: .86
            }, {
                pet_id: 228,
                base_chance: .05,
                max_chance: .05
            }]
        }]
    }
}, 1);
pets[38] = createObject({
    b_i: 38,
    b_t: BASE_TYPE.PET,
    name: "Blood Black Dragon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 7,
        y: 5
    },
    params: {
        item_id: 705,
        inventory_slots: 11,
        level: 4,
        eats: {
            1150: .25,
            239: .05
        },
        eat_interval: 12,
        happiness: 35,
        insurance_cost: [693750, 53],
        breeding_level: 86
    }
}, 1);
pets[39] = createObject({
    b_i: 39,
    b_t: BASE_TYPE.PET,
    name: "Baby Emerald Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 2,
        y: 0
    },
    params: {
        item_id: 706,
        xp_required: 1E5,
        inventory_slots: 3,
        next_pet_item_id: 707,
        level: 1,
        eats: {
            285: .3,
            760: .24,
            494: .09
        },
        eat_interval: 8,
        happiness: 16,
        insurance_cost: [57E3, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[40] = createObject({
    b_i: 40,
    b_t: BASE_TYPE.PET,
    name: "Emerald Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 3,
        y: 2
    },
    params: {
        item_id: 707,
        xp_required: 5E5,
        inventory_slots: 6,
        next_pet_item_id: 708,
        level: 2,
        eats: {
            285: .2,
            760: .16,
            494: .06
        },
        eat_interval: 8,
        happiness: 16,
        insurance_cost: [74100, 6],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[41] = createObject({
    b_i: 41,
    b_t: BASE_TYPE.PET,
    name: "King Emerald Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 4,
        y: 4
    },
    params: {
        item_id: 708,
        inventory_slots: 7,
        next_pet_item_id: 709,
        requires_stone: !0,
        stones: 2,
        level: 3,
        eats: {
            285: .1,
            760: .08,
            494: .03
        },
        eat_interval: 8,
        happiness: 25,
        insurance_cost: [92625, 7],
        breeding_level: 48,
        likes: [{
            pet_id: 5,
            xp: 1288,
            returns: [{
                pet_id: 118,
                base_chance: .6,
                max_chance: .835
            }, {
                pet_id: 94,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 234,
                base_chance: .07,
                max_chance: .07
            }, {
                pet_id: 235,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 38,
            xp: 2068,
            returns: [{
                pet_id: 80,
                base_chance: .5,
                max_chance: .86
            }, {
                pet_id: 248,
                base_chance: .07,
                max_chance: .07
            }]
        }, {
            pet_id: 42,
            xp: 1276,
            returns: [{
                pet_id: 81,
                base_chance: .6,
                max_chance: .835
            }, {
                pet_id: 95,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 229,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 230,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[42] = createObject({
    b_i: 42,
    b_t: BASE_TYPE.PET,
    name: "Cursed Dragon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 6,
        y: 5
    },
    params: {
        item_id: 709,
        inventory_slots: 11,
        level: 4,
        eats: {
            274: .05,
            275: .1
        },
        eat_interval: 8,
        happiness: 30,
        insurance_cost: [392625, 30],
        breeding_level: 79
    }
}, 1);
pets[43] = createObject({
    b_i: 43,
    b_t: BASE_TYPE.PET,
    name: "Pegasus [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 18,
        y: 1
    },
    params: {
        item_id: 886,
        inventory_slots: 13,
        level: 3,
        eats: {
            100: .05,
            106: .08
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [84E4, 65],
        breeding_level: 90,
        likes: [{
            pet_id: 45,
            xp: 1789,
            returns: [{
                pet_id: 143,
                base_chance: .5,
                max_chance: .721
            }, {
                pet_id: 142,
                base_chance: .06,
                max_chance: .1
            }, {
                pet_id: 112,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 254,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 255,
                base_chance: .03,
                max_chance: .03
            }, {
                pet_id: 256,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 43,
            xp: 2947,
            returns: [{
                pet_id: 120,
                base_chance: .6,
                max_chance: .834
            }, {
                pet_id: 130,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 257,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 258,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[44] = createObject({
    b_i: 44,
    b_t: BASE_TYPE.PET,
    name: "Donkey [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 13,
        y: 1
    },
    params: {
        item_id: 887,
        inventory_slots: 4,
        level: 1,
        eats: {
            757: .25,
            758: .4,
            760: .5,
            785: .7
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [19500, 2],
        breeding_level: 3,
        likes: [{
            pet_id: 44,
            xp: 125,
            returns: [{
                pet_id: 138,
                base_chance: .5,
                max_chance: .58
            }, {
                pet_id: 139,
                base_chance: .06,
                max_chance: .1
            }]
        }, {
            pet_id: 12,
            xp: 620,
            returns: [{
                pet_id: 141,
                base_chance: .55,
                max_chance: .72
            }, {
                pet_id: 109,
                base_chance: .06,
                max_chance: .1
            }, {
                pet_id: 135,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 221,
                base_chance: .1,
                max_chance: .1
            }, {
                pet_id: 222,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 223,
                base_chance: .03,
                max_chance: .03
            }]
        }, {
            pet_id: 45,
            xp: 410,
            returns: [{
                pet_id: 136,
                base_chance: .65,
                max_chance: .84
            }, {
                pet_id: 134,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[45] = createObject({
    b_i: 45,
    b_t: BASE_TYPE.PET,
    name: "Horror Steed [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 19,
        y: 1
    },
    params: {
        item_id: 888,
        xp_required: 8E5,
        inventory_slots: 9,
        next_pet_item_id: 889,
        level: 1,
        eats: {
            757: .05,
            758: .15,
            760: .2
        },
        eat_interval: 6,
        happiness: 24,
        insurance_cost: [18E4, 14],
        breeding_level: 68
    }
}, 1);
pets[46] = createObject({
    b_i: 46,
    b_t: BASE_TYPE.PET,
    name: "Nightmare Steed [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 0,
        y: 2
    },
    params: {
        item_id: 889,
        inventory_slots: 11,
        next_pet_item_id: 890,
        requires_stone: !0,
        stones: 4,
        level: 2,
        eats: {
            757: .1,
            758: .3,
            760: .4
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [234E3, 18],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[47] = createObject({
    b_i: 47,
    b_t: BASE_TYPE.PET,
    name: "Underworld Steed [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 1,
        y: 2
    },
    params: {
        item_id: 890,
        inventory_slots: 13,
        level: 3,
        eats: {
            757: .05,
            758: .25
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [834E3, 64],
        breeding_level: 88,
        likes: [{
            pet_id: 47,
            xp: 2926,
            returns: [{
                pet_id: 89,
                base_chance: .5,
                max_chance: .75
            }, {
                pet_id: 74,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 249,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 250,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 56,
            xp: 2639,
            returns: [{
                pet_id: 73,
                base_chance: .6,
                max_chance: .68
            }, {
                pet_id: 110,
                base_chance: .06,
                max_chance: .09
            }, {
                pet_id: 111,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 251,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 252,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 253,
                base_chance: .03,
                max_chance: .03
            }]
        }]
    }
}, 1);
pets[48] = createObject({
    b_i: 48,
    b_t: BASE_TYPE.PET,
    name: "Baby Cupid [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 2,
        y: 2
    },
    params: {
        item_id: 891,
        xp_required: 7E5,
        inventory_slots: 4,
        next_pet_item_id: 892,
        level: 1,
        eats: {
            494: .15,
            1368: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[49] = createObject({
    b_i: 49,
    b_t: BASE_TYPE.PET,
    name: "Cupid [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 3,
        y: 2
    },
    params: {
        item_id: 892,
        xp_required: 1E6,
        inventory_slots: 8,
        next_pet_item_id: 893,
        level: 2,
        eats: {
            494: .1,
            1368: .2
        },
        eat_interval: 6,
        happiness: 46,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[50] = createObject({
    b_i: 50,
    b_t: BASE_TYPE.PET,
    name: "Cupid Archer [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 4,
        y: 2
    },
    params: {
        item_id: 893,
        xp_required: 13E5,
        inventory_slots: 12,
        next_pet_item_id: 894,
        level: 3,
        eats: {
            494: .05,
            1368: .1
        },
        eat_interval: 6,
        happiness: 48,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[51] = createObject({
    b_i: 51,
    b_t: BASE_TYPE.PET,
    name: "Lady-Killer [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 5,
        y: 2
    },
    params: {
        item_id: 894,
        inventory_slots: 16,
        level: 4,
        eats: {
            494: .025,
            1368: .05
        },
        eat_interval: 6,
        happiness: 60,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[52] = createObject({
    b_i: 52,
    b_t: BASE_TYPE.PET,
    name: "Efreet [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 0,
        y: 0
    },
    params: {
        item_id: 895,
        inventory_slots: 6,
        level: 1,
        eats: {
            245: .15,
            244: .2
        },
        eat_interval: 10,
        happiness: 35,
        insurance_cost: [627900, 48],
        breeding_level: 83,
        likes: [{
            pet_id: 52,
            xp: 2203,
            returns: [{
                pet_id: 98,
                base_chance: .25,
                max_chance: .3
            }, {
                pet_id: 92,
                base_chance: .25,
                max_chance: .3
            }, {
                pet_id: 147,
                base_chance: .05,
                max_chance: .1
            }, {
                pet_id: 76,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 238,
                base_chance: .03,
                max_chance: .03
            }, {
                pet_id: 239,
                base_chance: .03,
                max_chance: .03
            }, {
                pet_id: 240,
                base_chance: .03,
                max_chance: .03
            }, {
                pet_id: 241,
                base_chance: .02,
                max_chance: .02
            }]
        }, {
            pet_id: 27,
            xp: 2260,
            returns: [{
                pet_id: 77,
                base_chance: .54,
                max_chance: .72
            }, {
                pet_id: 79,
                base_chance: .02,
                max_chance: .02
            }, {
                pet_id: 242,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 243,
                base_chance: .02,
                max_chance: .02
            }]
        }]
    }
}, 1);
pets[53] = createObject({
    b_i: 53,
    b_t: BASE_TYPE.PET,
    name: "Diablo [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 1,
        y: 0
    },
    params: {
        item_id: 896,
        inventory_slots: 16,
        level: 5,
        eats: {
            122: .1,
            222: .2
        },
        eat_interval: 20,
        happiness: 50,
        insurance_cost: [873402, 67],
        breeding_level: 93
    }
}, 1);
pets[54] = createObject({
    b_i: 54,
    b_t: BASE_TYPE.PET,
    name: "Nephilim Slave [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 9,
        y: 0
    },
    params: {
        item_id: 1062,
        inventory_slots: 16,
        level: 1,
        eats: {
            229: .2,
            244: .4
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [6E4, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[55] = createObject({
    b_i: 55,
    b_t: BASE_TYPE.PET,
    name: "Nephilim Protector [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 0,
        y: 1
    },
    params: {
        item_id: 1063,
        inventory_slots: 14,
        level: 5,
        eats: {
            229: .1,
            244: .2
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [1440600, 111],
        breeding_level: 98
    }
}, 1);
pets[56] = createObject({
    b_i: 56,
    b_t: BASE_TYPE.PET,
    name: "Flame Phoenix [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 6,
        y: 0
    },
    params: {
        item_id: 1064,
        inventory_slots: 9,
        level: 5,
        eats: {
            245: .1,
            244: .2
        },
        eat_interval: 10,
        happiness: 38,
        insurance_cost: [670479, 52],
        breeding_level: 85
    }
}, 1);
pets[57] = createObject({
    b_i: 57,
    b_t: BASE_TYPE.PET,
    name: "Angry Witch [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 6,
        y: 2
    },
    params: {
        item_id: 1139,
        inventory_slots: 16,
        level: 1,
        eats: {
            494: .15,
            1368: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[58] = createObject({
    b_i: 58,
    b_t: BASE_TYPE.PET,
    name: "Rudolph [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ANIMALS,
        x: 8,
        y: 0
    },
    params: {
        item_id: 1147,
        inventory_slots: 16,
        level: 1,
        eats: {
            757: .15,
            758: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[59] = createObject({
    b_i: 59,
    b_t: BASE_TYPE.PET,
    name: "Piglet [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 7,
        y: 2
    },
    params: {
        item_id: 1150,
        inventory_slots: 3,
        next_pet_item_id: 1151,
        requires_stone: !0,
        stones: 3,
        level: 1,
        eats: {
            760: .3,
            758: .15
        },
        eat_interval: 4,
        happiness: 12,
        insurance_cost: [12E4, 7],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[60] = createObject({
    b_i: 60,
    b_t: BASE_TYPE.PET,
    name: "Pig [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 8,
        y: 2
    },
    params: {
        item_id: 1151,
        inventory_slots: 4,
        next_pet_item_id: 1155,
        requires_stone: !0,
        stones: 3,
        level: 2,
        eats: {
            760: .2,
            758: .1
        },
        eat_interval: 4,
        happiness: 16,
        insurance_cost: [36E4, 20],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[61] = createObject({
    b_i: 61,
    b_t: BASE_TYPE.PET,
    name: "Armored Pig [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 9,
        y: 2
    },
    params: {
        item_id: 1155,
        inventory_slots: 7,
        level: 3,
        eats: {
            760: .1,
            758: .05
        },
        eat_interval: 4,
        happiness: 20,
        insurance_cost: [57E4, 32],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[62] = createObject({
    b_i: 62,
    b_t: BASE_TYPE.PET,
    name: "Gray Werewolf [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 7,
        y: 1
    },
    params: {
        item_id: 1166,
        inventory_slots: 3,
        level: 1,
        eats: {
            8: .25,
            272: .5
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [54122, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[63] = createObject({
    b_i: 63,
    b_t: BASE_TYPE.PET,
    name: "Warg [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 1,
        y: 1
    },
    params: {
        item_id: 1167,
        inventory_slots: 5,
        level: 1,
        eats: {
            8: .25,
            272: .5
        },
        eat_interval: 6,
        happiness: 18,
        insurance_cost: [62252, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[64] = createObject({
    b_i: 64,
    b_t: BASE_TYPE.PET,
    name: "Swamp Guru [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 2,
        y: 1
    },
    params: {
        item_id: 1168,
        inventory_slots: 1,
        level: 1,
        eats: {
            494: .05,
            283: .5
        },
        eat_interval: 6,
        happiness: 6,
        insurance_cost: [49551, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[65] = createObject({
    b_i: 65,
    b_t: BASE_TYPE.PET,
    name: "Ghost Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 4,
        y: 0
    },
    params: {
        item_id: 1169,
        inventory_slots: 7,
        level: 1,
        eats: {
            210: .15,
            217: .5
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [577442, 44],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[66] = createObject({
    b_i: 66,
    b_t: BASE_TYPE.PET,
    name: "Kobalos [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 11,
        y: 2
    },
    params: {
        item_id: 1170,
        inventory_slots: 1,
        level: 1,
        eats: {
            220: .15,
            236: .35
        },
        eat_interval: 6,
        happiness: 8,
        insurance_cost: [16200, 1],
        breeding_level: 1,
        likes: [{
            pet_id: 6,
            xp: 124,
            returns: [{
                pet_id: 64,
                base_chance: .65,
                max_chance: .85
            }]
        }, {
            pet_id: 8,
            xp: 124,
            returns: [{
                pet_id: 64,
                base_chance: .65,
                max_chance: .85
            }]
        }]
    }
}, 1);
pets[67] = createObject({
    b_i: 67,
    b_t: BASE_TYPE.PET,
    name: "Leprechaun [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 10,
        y: 2
    },
    params: {
        item_id: 1171,
        inventory_slots: 12,
        level: 1,
        eats: {
            494: .15,
            1368: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[68] = createObject({
    b_i: 68,
    b_t: BASE_TYPE.PET,
    name: "Lion [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ANIMALS,
        x: 6,
        y: 0
    },
    params: {
        item_id: 1175,
        inventory_slots: 1,
        level: 1,
        eats: {
            494: .05,
            78: .2
        },
        eat_interval: 6,
        happiness: 16,
        insurance_cost: [55620, 4],
        breeding_level: 8,
        likes: [{
            pet_id: 71,
            xp: 768,
            returns: [{
                pet_id: 91,
                base_chance: .5,
                max_chance: .86
            }]
        }]
    }
}, 1);
pets[69] = createObject({
    b_i: 69,
    b_t: BASE_TYPE.PET,
    name: "Desert Scorpion [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 7,
        y: 2
    },
    params: {
        item_id: 1176,
        xp_required: 75E4,
        inventory_slots: 1,
        next_pet_item_id: 1177,
        level: 1,
        eats: {
            8: .15,
            10: .3
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [53220, 3],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[70] = createObject({
    b_i: 70,
    b_t: BASE_TYPE.PET,
    name: "Deathstalker Scorpion [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 9,
        y: 2
    },
    params: {
        item_id: 1177,
        inventory_slots: 3,
        next_pet_item_id: 1178,
        requires_stone: !0,
        stones: 1,
        level: 2,
        eats: {
            8: .1,
            10: .2
        },
        eat_interval: 6,
        happiness: 18,
        insurance_cost: [69186, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[71] = createObject({
    b_i: 71,
    b_t: BASE_TYPE.PET,
    name: "Emperor Scorpion [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.UNIQUES,
        x: 0,
        y: 3
    },
    params: {
        item_id: 1178,
        inventory_slots: 7,
        level: 3,
        eats: {
            8: .05,
            10: .1
        },
        eat_interval: 6,
        happiness: 24,
        insurance_cost: [236482, 18],
        breeding_level: 70
    }
}, 1);
pets[72] = createObject({
    b_i: 72,
    b_t: BASE_TYPE.PET,
    name: "Brown Werewolf [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 4,
        y: 1
    },
    params: {
        item_id: 1179,
        inventory_slots: 3,
        level: 1,
        eats: {
            8: .25,
            272: .5
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [54122, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[73] = createObject({
    b_i: 73,
    b_t: BASE_TYPE.PET,
    name: "Dark Pegasus [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 7,
        y: 1
    },
    params: {
        item_id: 1180,
        inventory_slots: 10,
        level: 1,
        eats: {
            757: .025,
            758: .05,
            785: .1
        },
        eat_interval: 10,
        happiness: 50,
        insurance_cost: [2088216, 160],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[74] = createObject({
    b_i: 74,
    b_t: BASE_TYPE.PET,
    name: "Sleipnir [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 8,
        y: 1
    },
    params: {
        item_id: 1181,
        inventory_slots: 20,
        level: 1,
        eats: {
            757: .025,
            758: .05,
            785: .1
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [3125498, 240],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[75] = createObject({
    b_i: 75,
    b_t: BASE_TYPE.PET,
    name: "HellKyte [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 9,
        y: 1
    },
    params: {
        item_id: 1182,
        inventory_slots: 13,
        level: 1,
        eats: {
            225: .05,
            1150: .25
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [1346465, 103],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[76] = createObject({
    b_i: 76,
    b_t: BASE_TYPE.PET,
    name: "Ifrit [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 6,
        y: 1
    },
    params: {
        item_id: 1183,
        inventory_slots: 16,
        level: 1,
        eats: {
            245: .015,
            244: .025
        },
        eat_interval: 25,
        happiness: 80,
        insurance_cost: [2706085, 208],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[77] = createObject({
    b_i: 77,
    b_t: BASE_TYPE.PET,
    name: "Death Knight [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 11,
        y: 1
    },
    params: {
        item_id: 1184,
        inventory_slots: 9,
        level: 1,
        eats: {
            760: .01,
            271: .015,
            274: .02
        },
        eat_interval: 60,
        happiness: 90,
        insurance_cost: [1788229, 137],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[78] = createObject({
    b_i: 78,
    b_t: BASE_TYPE.PET,
    name: "Shiva [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 9,
        y: 0
    },
    params: {
        item_id: 1185,
        inventory_slots: 12,
        level: 1,
        eats: {
            760: .01,
            271: .025,
            274: .025
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [2541809, 195],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[79] = createObject({
    b_i: 79,
    b_t: BASE_TYPE.PET,
    name: "Fire Overlord [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 6,
        y: 1
    },
    params: {
        item_id: 1186,
        inventory_slots: 14,
        level: 1,
        eats: {
            122: .01,
            222: .02
        },
        eat_interval: 40,
        happiness: 120,
        insurance_cost: [2414110, 186],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[80] = createObject({
    b_i: 80,
    b_t: BASE_TYPE.PET,
    name: "Lionhead Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 9,
        y: 1
    },
    params: {
        item_id: 1187,
        inventory_slots: 6,
        level: 1,
        eats: {
            275: .15,
            276: .3
        },
        eat_interval: 40,
        happiness: 80,
        insurance_cost: [1091488, 84],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[81] = createObject({
    b_i: 81,
    b_t: BASE_TYPE.PET,
    name: "Horntail [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 6,
        y: 2
    },
    params: {
        item_id: 1188,
        inventory_slots: 4,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 12,
        happiness: 60,
        insurance_cost: [673527, 52],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[82] = createObject({
    b_i: 82,
    b_t: BASE_TYPE.PET,
    name: "Rael [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 3,
        y: 2
    },
    params: {
        item_id: 1189,
        inventory_slots: 19,
        level: 1,
        eats: {
            225: .025,
            1150: .01
        },
        eat_interval: 120,
        happiness: 380,
        insurance_cost: [4440906, 341],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[83] = createObject({
    b_i: 83,
    b_t: BASE_TYPE.PET,
    name: "Cursed Archangel [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 5,
        y: 1
    },
    params: {
        item_id: 1190,
        inventory_slots: 9,
        level: 1,
        eats: {
            225: .1,
            1150: .2
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [3289560, 253],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[84] = createObject({
    b_i: 84,
    b_t: BASE_TYPE.PET,
    name: "Jophiel the archangel [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 4,
        y: 1
    },
    params: {
        item_id: 1191,
        inventory_slots: 12,
        level: 1,
        eats: {
            225: .1,
            1150: .2
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [1987987, 152],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[85] = createObject({
    b_i: 85,
    b_t: BASE_TYPE.PET,
    name: "Michael the archangel [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 0,
        y: 2
    },
    params: {
        item_id: 1192,
        inventory_slots: 5,
        level: 1,
        eats: {
            225: .05,
            1150: .1
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [1728684, 132],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[86] = createObject({
        b_i: 86,
        b_t: BASE_TYPE.PET,
        name: "Obsidian Dragon [Legendary]",
        type: OBJECT_TYPE.DUMMY,
        img: {
            sheet: IMAGE_SHEET.BOSS3,
            x: 6,
            y: 0
        },
        params: {
            item_id: 1193,
            inventory_slots: 16,
            level: 1,
            eats: {
                275: .05,
                276: .1
            },
            eat_interval: 20,
            happiness: 80,
            insurance_cost: [1756687, 135],
            breeding_level: 103,
            likes: [{
                pet_id: 217,
                xp: 4535,
                returns: [{
                    pet_id: 197,
                    base_chance: .02,
                    max_chance: .02
                }, {
                    pet_id: 191,
                    base_chance: .02,
                    max_chance: .02
                }, {
                    pet_id: 275,
                    base_chance: .1,
                    max_chance: .1
                }, {
                    pet_id: 274,
                    base_chance: .08,
                    max_chance: .08
                }]
            }]
        }
    },
    1);
pets[87] = createObject({
    b_i: 87,
    b_t: BASE_TYPE.PET,
    name: "Ancient Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 3,
        y: 1
    },
    params: {
        item_id: 1194,
        inventory_slots: 5,
        level: 1,
        eats: {
            268: .025,
            267: .05
        },
        eat_interval: 10,
        happiness: 60,
        insurance_cost: [223294, 17],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[88] = createObject({
    b_i: 88,
    b_t: BASE_TYPE.PET,
    name: "Hydra [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 8,
        y: 0
    },
    params: {
        item_id: 1195,
        inventory_slots: 8,
        level: 1,
        eats: {
            268: .05,
            269: .08
        },
        eat_interval: 20,
        happiness: 120,
        insurance_cost: [256788, 20],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[89] = createObject({
    b_i: 89,
    b_t: BASE_TYPE.PET,
    name: "Wildfire Steed [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 3,
        y: 0
    },
    params: {
        item_id: 1196,
        inventory_slots: 10,
        level: 1,
        eats: {
            757: .015,
            758: .075
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [2315184, 178],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[90] = createObject({
    b_i: 90,
    b_t: BASE_TYPE.PET,
    name: "Giant Troll [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 4,
        y: 2
    },
    params: {
        item_id: 1197,
        inventory_slots: 3,
        level: 1,
        eats: {
            275: .15,
            276: .2
        },
        eat_interval: 5,
        happiness: 20,
        insurance_cost: [98880, 8],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[91] = createObject({
    b_i: 91,
    b_t: BASE_TYPE.PET,
    name: "Manticore [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 5,
        y: 2
    },
    params: {
        item_id: 1198,
        inventory_slots: 5,
        level: 1,
        eats: {
            494: .015,
            78: .05
        },
        eat_interval: 15,
        happiness: 60,
        insurance_cost: [405438, 32],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[92] = createObject({
    b_i: 92,
    b_t: BASE_TYPE.PET,
    name: "Fire Elemental [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 4,
        y: 0
    },
    params: {
        item_id: 1199,
        inventory_slots: 6,
        level: 1,
        eats: {
            245: .15,
            244: .2
        },
        eat_interval: 20,
        happiness: 70,
        insurance_cost: [1743050, 134],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[93] = createObject({
    b_i: 93,
    b_t: BASE_TYPE.PET,
    name: "Rathalos [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 5,
        y: 1
    },
    params: {
        item_id: 1200,
        inventory_slots: 8,
        level: 1,
        eats: {
            94: .025,
            206: .075,
            1300: .15,
            1301: .2
        },
        eat_interval: 50,
        happiness: 60,
        insurance_cost: [224106, 17],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[94] = createObject({
    b_i: 94,
    b_t: BASE_TYPE.PET,
    name: "Saint Dragon [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 7,
        y: 0
    },
    params: {
        item_id: 1201,
        inventory_slots: 13,
        level: 1,
        eats: {
            283: .015,
            238: .025
        },
        eat_interval: 20,
        happiness: 80,
        insurance_cost: [918396, 70],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[95] = createObject({
    b_i: 95,
    b_t: BASE_TYPE.PET,
    name: "Ancient Ironbelly [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 5,
        y: 0
    },
    params: {
        item_id: 1202,
        inventory_slots: 15,
        level: 1,
        eats: {
            274: .015,
            275: .025
        },
        eat_interval: 30,
        happiness: 80,
        insurance_cost: [909261, 69],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[96] = createObject({
    b_i: 96,
    b_t: BASE_TYPE.PET,
    name: "Archsky Dragon [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 10,
        y: 2
    },
    params: {
        item_id: 1203,
        inventory_slots: 15,
        level: 1,
        eats: {
            283: .015,
            238: .05
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [1201573, 92],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[97] = createObject({
    b_i: 97,
    b_t: BASE_TYPE.PET,
    name: "Flame Observer [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 11,
        y: 2
    },
    params: {
        item_id: 1204,
        inventory_slots: 4,
        level: 1,
        eats: {
            245: .075,
            244: .1
        },
        eat_interval: 25,
        happiness: 70,
        insurance_cost: [997381, 76],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[98] = createObject({
    b_i: 98,
    b_t: BASE_TYPE.PET,
    name: "Efreet Sultan [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 2,
        y: 1
    },
    params: {
        item_id: 1205,
        inventory_slots: 5,
        level: 1,
        eats: {
            245: .075,
            244: .1
        },
        eat_interval: 25,
        happiness: 70,
        insurance_cost: [1743050, 134],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[99] = createObject({
    b_i: 99,
    b_t: BASE_TYPE.PET,
    name: "Spiked Emerald Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 2,
        y: 1
    },
    params: {
        item_id: 1206,
        inventory_slots: 5,
        level: 1,
        eats: {
            268: .025,
            267: .1
        },
        eat_interval: 10,
        happiness: 60,
        insurance_cost: [232767, 18],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[100] = createObject({
    b_i: 100,
    b_t: BASE_TYPE.PET,
    name: "Spiked Ruby Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 6,
        y: 0
    },
    params: {
        item_id: 1207,
        inventory_slots: 6,
        level: 1,
        eats: {
            268: .025,
            267: .1
        },
        eat_interval: 10,
        happiness: 60,
        insurance_cost: [267682, 20],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[101] = createObject({
    b_i: 101,
    b_t: BASE_TYPE.PET,
    name: "Magma Wyvern [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 7,
        y: 0
    },
    params: {
        item_id: 1208,
        inventory_slots: 5,
        level: 1,
        eats: {
            268: .01,
            267: .025
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [194875, 15],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[102] = createObject({
    b_i: 102,
    b_t: BASE_TYPE.PET,
    name: "Swamp Wyvern [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 6,
        y: 0
    },
    params: {
        item_id: 1209,
        inventory_slots: 8,
        level: 1,
        eats: {
            268: .01,
            267: .025
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [224106, 17],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[103] = createObject({
    b_i: 103,
    b_t: BASE_TYPE.PET,
    name: "Naga [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 0,
        y: 1
    },
    params: {
        item_id: 1210,
        inventory_slots: 5,
        level: 2,
        eats: {
            230: .1,
            228: .05
        },
        eat_interval: 6,
        happiness: 28,
        insurance_cost: [82500, 6],
        breeding_level: 38,
        likes: [{
            pet_id: 103,
            xp: 578,
            returns: [{
                pet_id: 148,
                base_chance: .58,
                max_chance: .77
            }, {
                pet_id: 104,
                base_chance: .04,
                max_chance: .08
            }]
        }]
    }
}, 1);
pets[104] = createObject({
    b_i: 104,
    b_t: BASE_TYPE.PET,
    name: "Gorgon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 9,
        y: 0
    },
    params: {
        item_id: 1211,
        inventory_slots: 7,
        level: 1,
        eats: {
            230: .05,
            228: .025
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [263373, 20],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[105] = createObject({
    b_i: 105,
    b_t: BASE_TYPE.PET,
    name: "Rubysoul Dragon [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 1,
        y: 2
    },
    params: {
        item_id: 1212,
        inventory_slots: 11,
        level: 1,
        eats: {
            274: .015,
            275: .025
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [918396, 70],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[106] = createObject({
    b_i: 106,
    b_t: BASE_TYPE.PET,
    name: "Crystal Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 3,
        y: 0
    },
    params: {
        item_id: 1213,
        inventory_slots: 6,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [680293, 52],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[107] = createObject({
    b_i: 107,
    b_t: BASE_TYPE.PET,
    name: "Undead Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 1,
        y: 3
    },
    params: {
        item_id: 1214,
        inventory_slots: 10,
        level: 1,
        eats: {
            1150: .25,
            239: .05
        },
        eat_interval: 35,
        happiness: 70,
        insurance_cost: [1301250, 100],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[108] = createObject({
    b_i: 108,
    b_t: BASE_TYPE.PET,
    name: "Observer Worm [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 2,
        y: 3
    },
    params: {
        item_id: 1215,
        inventory_slots: 9,
        level: 1,
        eats: {
            268: .05,
            267: .25
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [320985, 25],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[109] = createObject({
    b_i: 109,
    b_t: BASE_TYPE.PET,
    name: "Royal Horse [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 3,
        y: 3
    },
    params: {
        item_id: 1216,
        inventory_slots: 11,
        level: 1,
        eats: {
            757: .025,
            758: .07,
            785: .09
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [507591, 39],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[110] = createObject({
    b_i: 110,
    b_t: BASE_TYPE.PET,
    name: "Lava Pegasus [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 4,
        y: 1
    },
    params: {
        item_id: 1217,
        inventory_slots: 14,
        level: 1,
        eats: {
            245: .05,
            244: .075
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [2401449, 184],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[111] = createObject({
    b_i: 111,
    b_t: BASE_TYPE.PET,
    name: "Nightmare Pegasus [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 5,
        y: 0
    },
    params: {
        item_id: 1218,
        inventory_slots: 18,
        level: 1,
        eats: {
            245: .025,
            244: .05
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [3001811, 231],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[112] = createObject({
    b_i: 112,
    b_t: BASE_TYPE.PET,
    name: "Sun Pegasus [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 6,
        y: 3
    },
    params: {
        item_id: 1219,
        inventory_slots: 16,
        level: 1,
        eats: {
            100: .025,
            106: .04
        },
        eat_interval: 30,
        happiness: 120,
        insurance_cost: [2035155, 156],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[113] = createObject({
    b_i: 113,
    b_t: BASE_TYPE.PET,
    name: "Flaming Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 8,
        y: 1
    },
    params: {
        item_id: 1220,
        inventory_slots: 7,
        level: 1,
        eats: {
            220: .03,
            236: .1
        },
        eat_interval: 20,
        happiness: 80,
        insurance_cost: [890055, 68],
        breeding_level: 102,
        likes: [{
            pet_id: 86,
            xp: 4643,
            returns: [{
                pet_id: 153,
                base_chance: .3,
                max_chance: .35
            }, {
                pet_id: 154,
                base_chance: .05,
                max_chance: .1
            }, {
                pet_id: 269,
                base_chance: .05,
                max_chance: .05
            }, {
                pet_id: 270,
                base_chance: .03,
                max_chance: .03
            }]
        }]
    }
}, 1);
pets[114] = createObject({
    b_i: 114,
    b_t: BASE_TYPE.PET,
    name: "Lava Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 9,
        y: 0
    },
    params: {
        item_id: 1221,
        inventory_slots: 6,
        level: 1,
        eats: {
            8: .015,
            10: .025
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [1098255, 84],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[115] = createObject({
        b_i: 115,
        b_t: BASE_TYPE.PET,
        name: "White Belly Dragon [Common]",
        type: OBJECT_TYPE.DUMMY,
        img: {
            sheet: IMAGE_SHEET.BOSS3,
            x: 3,
            y: 1
        },
        params: {
            item_id: 1222,
            inventory_slots: 7,
            level: 1,
            eats: {
                230: .03,
                228: .03
            },
            eat_interval: 20,
            happiness: 74,
            insurance_cost: [883288, 68],
            breeding_level: 100,
            likes: [{
                pet_id: 116,
                xp: 4150,
                returns: [{
                    pet_id: 151,
                    base_chance: .3,
                    max_chance: .35
                }, {
                    pet_id: 152,
                    base_chance: .05,
                    max_chance: .1
                }, {
                    pet_id: 267,
                    base_chance: .05,
                    max_chance: .05
                }, {
                    pet_id: 268,
                    base_chance: .03,
                    max_chance: .03
                }]
            }]
        }
    },
    1);
pets[116] = createObject({
    b_i: 116,
    b_t: BASE_TYPE.PET,
    name: "Underworld Dragon [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 3,
        y: 1
    },
    params: {
        item_id: 1223,
        inventory_slots: 13,
        level: 1,
        eats: {
            8: .01,
            10: .02
        },
        eat_interval: 20,
        happiness: 74,
        insurance_cost: [1482643, 114],
        breeding_level: 101
    }
}, 1);
pets[117] = createObject({
    b_i: 117,
    b_t: BASE_TYPE.PET,
    name: "Fire Heart Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 1,
        y: 1
    },
    params: {
        item_id: 1224,
        inventory_slots: 8,
        level: 1,
        eats: {
            283: .025,
            238: .15
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [687060, 53],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[118] = createObject({
    b_i: 118,
    b_t: BASE_TYPE.PET,
    name: "Deragonite [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 0,
        y: 1
    },
    params: {
        item_id: 1225,
        inventory_slots: 4,
        level: 1,
        eats: {
            283: .025,
            238: .05
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [680293, 52],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[119] = createObject({
    b_i: 119,
    b_t: BASE_TYPE.PET,
    name: "Ice Observer [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 6,
        y: 1
    },
    params: {
        item_id: 1226,
        inventory_slots: 5,
        level: 1,
        eats: {
            268: .05,
            269: .08
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [251713, 19],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[120] = createObject({
    b_i: 120,
    b_t: BASE_TYPE.PET,
    name: "Cloudcaller [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 1,
        y: 1
    },
    params: {
        item_id: 1227,
        inventory_slots: 10,
        level: 1,
        eats: {
            100: .05,
            106: .08
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [2331840, 179],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[121] = createObject({
    b_i: 121,
    b_t: BASE_TYPE.PET,
    name: "Centaur [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 0,
        y: 1
    },
    params: {
        item_id: 1228,
        inventory_slots: 5,
        level: 1,
        eats: {
            264: .05,
            760: .1,
            239: .2
        },
        eat_interval: 6,
        happiness: 28,
        insurance_cost: [77076, 6],
        breeding_level: 33,
        likes: [{
            pet_id: 30,
            xp: 602,
            returns: [{
                pet_id: 126,
                base_chance: .6,
                max_chance: .86
            }]
        }]
    }
}, 1);
pets[122] = createObject({
    b_i: 122,
    b_t: BASE_TYPE.PET,
    name: "Demon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 4,
        y: 1
    },
    params: {
        item_id: 1229,
        inventory_slots: 7,
        level: 1,
        eats: {
            269: .15,
            233: .2,
            1300: .3,
            1301: .4
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [74702, 8],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[123] = createObject({
    b_i: 123,
    b_t: BASE_TYPE.PET,
    name: "Dark Guru [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 3,
        y: 1
    },
    params: {
        item_id: 1230,
        inventory_slots: 1,
        level: 1,
        eats: {
            494: .05,
            283: .5
        },
        eat_interval: 6,
        happiness: 6,
        insurance_cost: [49551, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[124] = createObject({
    b_i: 124,
    b_t: BASE_TYPE.PET,
    name: "Shadow Werewolf [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 10,
        y: 1
    },
    params: {
        item_id: 1231,
        inventory_slots: 3,
        level: 1,
        eats: {
            8: .25,
            272: .5
        },
        eat_interval: 6,
        happiness: 12,
        insurance_cost: [6E4, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[125] = createObject({
    b_i: 125,
    b_t: BASE_TYPE.PET,
    name: "Raguel the archangel [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 1,
        y: 0
    },
    params: {
        item_id: 1232,
        inventory_slots: 17,
        level: 1,
        eats: {
            225: .05,
            1150: .1
        },
        eat_interval: 60,
        happiness: 180,
        insurance_cost: [2484984, 191],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[126] = createObject({
    b_i: 126,
    b_t: BASE_TYPE.PET,
    name: "Winged Centaur [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 0,
        y: 3
    },
    params: {
        item_id: 1233,
        inventory_slots: 6,
        level: 1,
        eats: {
            762: .15,
            80: .05,
            1300: .3,
            1301: .4
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [238251, 18],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[127] = createObject({
    b_i: 127,
    b_t: BASE_TYPE.PET,
    name: "Ankylosaurus [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 4,
        y: 3
    },
    params: {
        item_id: 1234,
        inventory_slots: 4,
        level: 1,
        eats: {
            760: .05,
            271: .075,
            274: .1
        },
        eat_interval: 10,
        happiness: 40,
        insurance_cost: [270660, 21],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[128] = createObject({
    b_i: 128,
    b_t: BASE_TYPE.PET,
    name: "Tyrannosaurus [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 9,
        y: 2
    },
    params: {
        item_id: 1235,
        inventory_slots: 7,
        level: 1,
        eats: {
            760: .05,
            271: .075,
            274: .1
        },
        eat_interval: 15,
        happiness: 60,
        insurance_cost: [311259, 24],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[129] = createObject({
    b_i: 129,
    b_t: BASE_TYPE.PET,
    name: "Shadow Dragon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 2,
        y: 0
    },
    params: {
        item_id: 1236,
        inventory_slots: 9,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 15,
        happiness: 60,
        insurance_cost: [664059, 51],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[130] = createObject({
    b_i: 130,
    b_t: BASE_TYPE.PET,
    name: "Marble Unicorn [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 8,
        y: 2
    },
    params: {
        item_id: 1237,
        inventory_slots: 18,
        level: 1,
        eats: {
            100: .025,
            106: .04
        },
        eat_interval: 30,
        happiness: 120,
        insurance_cost: [3147984, 242],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[131] = createObject({
    b_i: 131,
    b_t: BASE_TYPE.PET,
    name: "Underworld Lord [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 7,
        y: 2
    },
    params: {
        item_id: 1238,
        inventory_slots: 7,
        level: 1,
        eats: {
            122: .05,
            222: .1
        },
        eat_interval: 40,
        happiness: 120,
        insurance_cost: [2857061, 219],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[132] = createObject({
    b_i: 132,
    b_t: BASE_TYPE.PET,
    name: "Lord Of Destruction [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 3,
        y: 0
    },
    params: {
        item_id: 1239,
        inventory_slots: 14,
        level: 1,
        eats: {
            122: .05,
            222: .1
        },
        eat_interval: 40,
        happiness: 160,
        insurance_cost: [3857033, 296],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[133] = createObject({
    b_i: 133,
    b_t: BASE_TYPE.PET,
    name: "Game Master [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 2,
        y: 0
    },
    params: {
        item_id: 1240,
        inventory_slots: 24,
        level: 1
    }
}, 1);
pets[134] = createObject({
    b_i: 134,
    b_t: BASE_TYPE.PET,
    name: "Ruby Horse [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 8,
        y: 0
    },
    params: {
        item_id: 1241,
        inventory_slots: 13,
        level: 1,
        eats: {
            757: .005,
            758: .05,
            785: .05
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [371012, 28],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[135] = createObject({
    b_i: 135,
    b_t: BASE_TYPE.PET,
    name: "Winged Sapphire Demon [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 0,
        y: 1
    },
    params: {
        item_id: 1242,
        inventory_slots: 15,
        level: 1,
        eats: {
            757: .01,
            758: .015,
            785: .025
        },
        eat_interval: 8,
        happiness: 24,
        insurance_cost: [634489, 49],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[136] = createObject({
    b_i: 136,
    b_t: BASE_TYPE.PET,
    name: "Bone Horse [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 5,
        y: 1
    },
    params: {
        item_id: 1244,
        inventory_slots: 6,
        level: 1,
        eats: {
            757: .01,
            758: .1,
            785: .15
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [274824, 21],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[137] = createObject({
    b_i: 137,
    b_t: BASE_TYPE.PET,
    name: "Disembodied Spirit [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 7,
        y: 1
    },
    params: {
        item_id: 1245,
        inventory_slots: 2,
        level: 1,
        eats: {
            269: .15,
            233: .2,
            1300: .3,
            1301: .4
        },
        eat_interval: 12,
        happiness: 32,
        insurance_cost: [64958, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[138] = createObject({
    b_i: 138,
    b_t: BASE_TYPE.PET,
    name: "Royal Donkey [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 12,
        y: 2
    },
    params: {
        item_id: 1246,
        inventory_slots: 5,
        level: 1,
        eats: {
            757: .15,
            758: .2,
            760: .25,
            785: .35
        },
        eat_interval: 6,
        happiness: 24,
        insurance_cost: [37368, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[139] = createObject({
    b_i: 139,
    b_t: BASE_TYPE.PET,
    name: "Undead Donkey [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 13,
        y: 2
    },
    params: {
        item_id: 1247,
        inventory_slots: 7,
        level: 1,
        eats: {
            757: .15,
            758: .2,
            760: .25,
            785: .35
        },
        eat_interval: 12,
        happiness: 48,
        insurance_cost: [47863, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[140] = createObject({
    b_i: 140,
    b_t: BASE_TYPE.PET,
    name: "Shadow Guru [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 2,
        y: 2
    },
    params: {
        item_id: 1248,
        inventory_slots: 1,
        level: 1,
        eats: {
            494: .05,
            283: .5
        },
        eat_interval: 6,
        happiness: 6,
        insurance_cost: [53550, 3],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[141] = createObject({
    b_i: 141,
    b_t: BASE_TYPE.PET,
    name: "Hinny [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 9,
        y: 0
    },
    params: {
        item_id: 1249,
        inventory_slots: 8,
        level: 1,
        eats: {
            757: .025,
            758: .07,
            785: .09
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [441384, 34],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[142] = createObject({
    b_i: 142,
    b_t: BASE_TYPE.PET,
    name: "Crystallized Pegasus [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 2,
        y: 1
    },
    params: {
        item_id: 1250,
        inventory_slots: 13,
        level: 1,
        eats: {
            100: .05,
            106: .08
        },
        eat_interval: 30,
        happiness: 60,
        insurance_cost: [1628124, 125],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[143] = createObject({
    b_i: 143,
    b_t: BASE_TYPE.PET,
    name: "Demonic Unicorn [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 14,
        y: 2
    },
    params: {
        item_id: 1251,
        inventory_slots: 7,
        level: 1,
        eats: {
            100: .05,
            106: .08
        },
        eat_interval: 30,
        happiness: 40,
        insurance_cost: [1415760, 109],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[144] = createObject({
    b_i: 144,
    b_t: BASE_TYPE.PET,
    name: "Lindworm [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 5,
        y: 0
    },
    params: {
        item_id: 1252,
        inventory_slots: 5,
        level: 1,
        eats: {
            268: .025,
            267: .25
        },
        eat_interval: 16,
        happiness: 32,
        insurance_cost: [194875, 15],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[145] = createObject({
    b_i: 145,
    b_t: BASE_TYPE.PET,
    name: "Soul Trapper [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 4,
        y: 0
    },
    params: {
        item_id: 1253,
        inventory_slots: 5,
        level: 1,
        eats: {
            94: .025,
            206: .075,
            1300: .15,
            1301: .2
        },
        eat_interval: 12,
        happiness: 48,
        insurance_cost: [194875, 15],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[146] = createObject({
    b_i: 146,
    b_t: BASE_TYPE.PET,
    name: "Dream Collector [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 7,
        y: 0
    },
    params: {
        item_id: 1254,
        inventory_slots: 10,
        level: 1,
        eats: {
            268: .01,
            267: .025
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [263097, 20],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[147] = createObject({
    b_i: 147,
    b_t: BASE_TYPE.PET,
    name: "Genie [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 15,
        y: 2
    },
    params: {
        item_id: 1255,
        inventory_slots: 9,
        level: 1,
        eats: {
            245: .05,
            244: .075
        },
        eat_interval: 25,
        happiness: 90,
        insurance_cost: [2004507, 154],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[148] = createObject({
    b_i: 148,
    b_t: BASE_TYPE.PET,
    name: "Euryale [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 8,
        y: 0
    },
    params: {
        item_id: 1256,
        inventory_slots: 3,
        level: 1,
        eats: {
            230: .05,
            228: .025
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [229020, 17],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[149] = createObject({
    b_i: 149,
    b_t: BASE_TYPE.PET,
    name: "Medusa [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 1,
        y: 1
    },
    params: {
        item_id: 1257,
        xp_required: 15E4,
        inventory_slots: 2,
        next_pet_item_id: 1210,
        level: 1,
        eats: {
            230: .1,
            228: .05
        },
        eat_interval: 7,
        happiness: 14,
        insurance_cost: [66E3, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[150] = createObject({
    b_i: 150,
    b_t: BASE_TYPE.PET,
    name: "Giant Bunny [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 16,
        y: 2
    },
    params: {
        item_id: 1258,
        inventory_slots: 16,
        level: 1,
        eats: {
            494: .15,
            1368: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[151] = createObject({
    b_i: 151,
    b_t: BASE_TYPE.PET,
    name: "Mylanth [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 4,
        y: 0
    },
    params: {
        item_id: 1344,
        inventory_slots: 14,
        level: 1,
        eats: {
            1150: .15,
            239: .025
        },
        eat_interval: 60,
        happiness: 140,
        insurance_cost: [3664286, 281],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[152] = createObject({
    b_i: 152,
    b_t: BASE_TYPE.PET,
    name: "Tesselth [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 5,
        y: 0
    },
    params: {
        item_id: 1345,
        inventory_slots: 14,
        level: 1,
        eats: {
            1150: .15,
            239: .025
        },
        eat_interval: 70,
        happiness: 210,
        insurance_cost: [4213929, 324],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[153] = createObject({
    b_i: 153,
    b_t: BASE_TYPE.PET,
    name: "Xirador [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 5,
        y: 1
    },
    params: {
        item_id: 1346,
        inventory_slots: 14,
        level: 1,
        eats: {
            275: .025,
            276: .05
        },
        eat_interval: 40,
        happiness: 160,
        insurance_cost: [3673678, 282],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[154] = createObject({
    b_i: 154,
    b_t: BASE_TYPE.PET,
    name: "Xalanth [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 0,
        y: 0
    },
    params: {
        item_id: 1347,
        inventory_slots: 14,
        level: 1,
        eats: {
            275: .025,
            276: .05
        },
        eat_interval: 40,
        happiness: 200,
        insurance_cost: [4213929, 324],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[155] = createObject({
    b_i: 155,
    b_t: BASE_TYPE.PET,
    name: "Jewelry Donkey 1st Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 0,
        y: 2
    },
    params: {
        item_id: 1810,
        xp_required: 2E5,
        inventory_slots: 8,
        next_pet_item_id: 1811,
        level: 1
    }
}, 1);
pets[156] = createObject({
    b_i: 156,
    b_t: BASE_TYPE.PET,
    name: "Jewelry Donkey 2nd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 0,
        y: 2
    },
    params: {
        item_id: 1811,
        xp_required: 6E5,
        inventory_slots: 12,
        next_pet_item_id: 1812,
        level: 2
    }
}, 1);
pets[157] = createObject({
    b_i: 157,
    b_t: BASE_TYPE.PET,
    name: "Jewelry Donkey 3rd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 0,
        y: 2
    },
    params: {
        item_id: 1812,
        inventory_slots: 16,
        level: 3
    }
}, 1);
pets[158] = createObject({
    b_i: 158,
    b_t: BASE_TYPE.PET,
    name: "Mining Donkey 1st Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 1,
        y: 2
    },
    params: {
        item_id: 1813,
        xp_required: 2E5,
        inventory_slots: 8,
        next_pet_item_id: 1814,
        level: 1
    }
}, 1);
pets[159] = createObject({
    b_i: 159,
    b_t: BASE_TYPE.PET,
    name: "Mining Donkey 2nd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 1,
        y: 2
    },
    params: {
        item_id: 1814,
        xp_required: 6E5,
        inventory_slots: 12,
        next_pet_item_id: 1815,
        level: 2
    }
}, 1);
pets[160] = createObject({
    b_i: 160,
    b_t: BASE_TYPE.PET,
    name: "Mining Donkey 3rd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 1,
        y: 2
    },
    params: {
        item_id: 1815,
        inventory_slots: 16,
        level: 3
    }
}, 1);
pets[161] = createObject({
    b_i: 161,
    b_t: BASE_TYPE.PET,
    name: "Woodcutting Donkey 1st Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 2,
        y: 2
    },
    params: {
        item_id: 1816,
        xp_required: 2E5,
        inventory_slots: 8,
        next_pet_item_id: 1817,
        level: 1
    }
}, 1);
pets[162] = createObject({
    b_i: 162,
    b_t: BASE_TYPE.PET,
    name: "Woodcutting Donkey 2nd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 2,
        y: 2
    },
    params: {
        item_id: 1817,
        xp_required: 6E5,
        inventory_slots: 12,
        next_pet_item_id: 1818,
        level: 2
    }
}, 1);
pets[163] = createObject({
    b_i: 163,
    b_t: BASE_TYPE.PET,
    name: "Woodcutting Donkey 3rd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 2,
        y: 2
    },
    params: {
        item_id: 1818,
        inventory_slots: 16,
        level: 3
    }
}, 1);
pets[164] = createObject({
    b_i: 164,
    b_t: BASE_TYPE.PET,
    name: "Fishing Donkey 1st Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 3,
        y: 2
    },
    params: {
        item_id: 1819,
        xp_required: 2E5,
        inventory_slots: 8,
        next_pet_item_id: 1820,
        level: 1
    }
}, 1);
pets[165] = createObject({
    b_i: 165,
    b_t: BASE_TYPE.PET,
    name: "Fishing Donkey 2nd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 3,
        y: 2
    },
    params: {
        item_id: 1820,
        xp_required: 6E5,
        inventory_slots: 12,
        next_pet_item_id: 1821,
        level: 2
    }
}, 1);
pets[166] = createObject({
    b_i: 166,
    b_t: BASE_TYPE.PET,
    name: "Fishing Donkey 3rd Grade [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 3,
        y: 2
    },
    params: {
        item_id: 1821,
        inventory_slots: 16,
        level: 3
    }
}, 1);
pets[167] = createObject({
    b_i: 167,
    b_t: BASE_TYPE.PET,
    name: "King Pumpkin [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 11,
        y: 2
    },
    params: {
        item_id: 1869,
        inventory_slots: 16,
        level: 1,
        eats: {
            494: .15,
            1368: .3
        },
        eat_interval: 6,
        happiness: 32,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[168] = createObject({
    b_i: 168,
    b_t: BASE_TYPE.PET,
    name: "Baby Sapphire Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 5,
        y: 0
    },
    params: {
        item_id: 2592,
        xp_required: 1E5,
        inventory_slots: 3,
        next_pet_item_id: 2593,
        level: 1,
        eats: {
            285: .15,
            494: .075
        },
        eat_interval: 5,
        happiness: 10,
        insurance_cost: [6E4, 4],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[169] = createObject({
    b_i: 169,
    b_t: BASE_TYPE.PET,
    name: "Sapphire Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 0,
        y: 2
    },
    params: {
        item_id: 2593,
        xp_required: 5E5,
        inventory_slots: 6,
        next_pet_item_id: 2594,
        level: 2,
        eats: {
            285: .12,
            494: .06
        },
        eat_interval: 5,
        happiness: 12,
        insurance_cost: [78E3, 5],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[170] = createObject({
    b_i: 170,
    b_t: BASE_TYPE.PET,
    name: "King Sapphire Dragon [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 1,
        y: 4
    },
    params: {
        item_id: 2594,
        inventory_slots: 7,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 2595,
        level: 3,
        eats: {
            285: .075,
            494: .025
        },
        eat_interval: 8,
        happiness: 20,
        insurance_cost: [97500, 7],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[171] = createObject({
    b_i: 171,
    b_t: BASE_TYPE.PET,
    name: "Storm Sapphire Dragon [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.DRAGONS,
        x: 2,
        y: 5
    },
    params: {
        item_id: 2595,
        inventory_slots: 11,
        level: 4,
        eats: {
            283: .05,
            238: .25
        },
        eat_interval: 10,
        happiness: 30,
        insurance_cost: [397500, 30],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[172] = createObject({
    b_i: 172,
    b_t: BASE_TYPE.PET,
    name: "Devil Baby Cupid [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 17,
        y: 2
    },
    params: {
        item_id: 2596,
        xp_required: 1E5,
        inventory_slots: 6,
        next_pet_item_id: 2597,
        level: 1,
        eats: {
            225: .45,
            1150: 1
        },
        eat_interval: 10,
        happiness: 10,
        insurance_cost: [36E4, 28],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[173] = createObject({
    b_i: 173,
    b_t: BASE_TYPE.PET,
    name: "Devil Cupid [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 18,
        y: 2
    },
    params: {
        item_id: 2597,
        xp_required: 5E5,
        inventory_slots: 8,
        next_pet_item_id: 2598,
        level: 2,
        eats: {
            225: .3,
            1150: .7
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [468E3, 36],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[174] = createObject({
    b_i: 174,
    b_t: BASE_TYPE.PET,
    name: "Devil Cupid Archer [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 19,
        y: 2
    },
    params: {
        item_id: 2598,
        inventory_slots: 9,
        next_pet_item_id: 2599,
        requires_stone: !0,
        stones: 4,
        level: 3,
        eats: {
            225: .15,
            1150: .5
        },
        eat_interval: 10,
        happiness: 30,
        insurance_cost: [585E3, 45],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[175] = createObject({
    b_i: 175,
    b_t: BASE_TYPE.PET,
    name: "Cupid Of Chaos [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 0,
        y: 3
    },
    params: {
        item_id: 2599,
        inventory_slots: 12,
        level: 4,
        eats: {
            1150: .25,
            225: .05
        },
        eat_interval: 20,
        happiness: 50,
        insurance_cost: [1185E3, 91],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[176] = createObject({
    b_i: 176,
    b_t: BASE_TYPE.PET,
    name: "Dragonhorse [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 8,
        y: 1
    },
    params: {
        item_id: 2748,
        inventory_slots: 8,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [673527, 52],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[177] = createObject({
    b_i: 177,
    b_t: BASE_TYPE.PET,
    name: "Ercinee [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 9,
        y: 1
    },
    params: {
        item_id: 2749,
        inventory_slots: 9,
        level: 1,
        eats: {
            236: .15,
            241: .2
        },
        eat_interval: 20,
        happiness: 70,
        insurance_cost: [174E4, 133],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[178] = createObject({
    b_i: 178,
    b_t: BASE_TYPE.PET,
    name: "Baby Hippogriff [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 1,
        y: 3
    },
    params: {
        item_id: 2750,
        inventory_slots: 8,
        xp_required: 5E5,
        next_pet_item_id: 2751,
        level: 1,
        eats: {
            762: .45,
            80: .15,
            1300: .9,
            1301: 1
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [3E5, 23],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[179] = createObject({
    b_i: 179,
    b_t: BASE_TYPE.PET,
    name: "Hippogriff [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 2,
        y: 3
    },
    params: {
        item_id: 2751,
        inventory_slots: 10,
        requires_stone: !0,
        stones: 3,
        next_pet_item_id: 2752,
        level: 2,
        eats: {
            762: .35,
            80: .1,
            1300: .6,
            1301: .8
        },
        eat_interval: 15,
        happiness: 30,
        insurance_cost: [39E4, 30],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[180] = createObject({
    b_i: 180,
    b_t: BASE_TYPE.PET,
    name: "Adult Hippogriff [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 10,
        y: 0
    },
    params: {
        item_id: 2752,
        inventory_slots: 12,
        level: 3,
        eats: {
            762: .25,
            80: .08,
            1300: .5,
            1301: .6
        },
        eat_interval: 20,
        happiness: 40,
        insurance_cost: [84E4, 64],
        breeding_level: 54,
        likes: [{
            pet_id: 30,
            xp: 1639,
            returns: [{
                pet_id: 185,
                base_chance: .4,
                max_chance: .53
            }]
        }]
    }
}, 1);
pets[181] = createObject({
    b_i: 181,
    b_t: BASE_TYPE.PET,
    name: "Typhon [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 4,
        y: 2
    },
    params: {
        item_id: 2753,
        inventory_slots: 18,
        level: 1,
        eats: {
            275: .025,
            276: .05
        },
        eat_interval: 40,
        happiness: 200,
        insurance_cost: [5476112, 421],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[182] = createObject({
    b_i: 182,
    b_t: BASE_TYPE.PET,
    name: "Leshy [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 6,
        y: 1
    },
    params: {
        item_id: 2754,
        inventory_slots: 4,
        xp_required: 1E5,
        next_pet_item_id: 2755,
        level: 1,
        eats: {
            230: .2,
            228: .08
        },
        eat_interval: 7,
        happiness: 14,
        insurance_cost: [186E3, 14],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[183] = createObject({
    b_i: 183,
    b_t: BASE_TYPE.PET,
    name: "Leshy Warrior [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 7,
        y: 1
    },
    params: {
        item_id: 2755,
        inventory_slots: 7,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 2756,
        level: 2,
        eats: {
            230: .15,
            228: .06
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [241800, 19],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[184] = createObject({
    b_i: 184,
    b_t: BASE_TYPE.PET,
    name: "Leshy General [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 8,
        y: 1
    },
    params: {
        item_id: 2756,
        inventory_slots: 11,
        level: 3,
        eats: {
            230: .1,
            228: .05
        },
        eat_interval: 15,
        happiness: 30,
        insurance_cost: [391800, 30],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[185] = createObject({
    b_i: 185,
    b_t: BASE_TYPE.PET,
    name: "Yllerion [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 5,
        y: 2
    },
    params: {
        item_id: 2757,
        inventory_slots: 10,
        level: 1,
        eats: {
            1150: .15,
            239: .025,
            230: .015
        },
        eat_interval: 120,
        happiness: 240,
        insurance_cost: [918396, 71],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[186] = createObject({
    b_i: 186,
    b_t: BASE_TYPE.PET,
    name: "Kilin [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 11,
        y: 0
    },
    params: {
        item_id: 2758,
        inventory_slots: 14,
        level: 1,
        eats: {
            283: .015,
            238: .05
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [246E4, 189],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[187] = createObject({
    b_i: 187,
    b_t: BASE_TYPE.PET,
    name: "Jormungandr [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 9,
        y: 1
    },
    params: {
        item_id: 2759,
        inventory_slots: 20,
        level: 1,
        eats: {
            122: .05,
            222: .1
        },
        eat_interval: 50,
        happiness: 150,
        insurance_cost: [5912713, 454],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[188] = createObject({
    b_i: 188,
    b_t: BASE_TYPE.PET,
    name: "Baby Hieracosphinx [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 3,
        y: 3
    },
    params: {
        item_id: 2760,
        inventory_slots: 8,
        xp_required: 5E5,
        next_pet_item_id: 2761,
        level: 1,
        eats: {
            762: .55,
            80: .15,
            1300: .9,
            1301: 1
        },
        eat_interval: 8,
        happiness: 16,
        insurance_cost: [237E3, 18],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[189] = createObject({
    b_i: 189,
    b_t: BASE_TYPE.PET,
    name: "Hieracosphinx [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 4,
        y: 3
    },
    params: {
        item_id: 2761,
        inventory_slots: 11,
        xp_required: 9E5,
        next_pet_item_id: 2762,
        level: 2,
        eats: {
            762: .45,
            80: .1,
            1300: .7,
            1301: .9
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [308100, 23],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[190] = createObject({
        b_i: 190,
        b_t: BASE_TYPE.PET,
        name: "Adult Hieracosphinx [Rare]",
        type: OBJECT_TYPE.DUMMY,
        img: {
            sheet: IMAGE_SHEET.BOSS2,
            x: 6,
            y: 2
        },
        params: {
            item_id: 2762,
            inventory_slots: 12,
            level: 3,
            eats: {
                762: .35,
                80: .08,
                1300: .5,
                1301: .7
            },
            eat_interval: 13,
            happiness: 26,
            insurance_cost: [385125, 29],
            breeding_level: 88,
            likes: [{
                pet_id: 217,
                xp: 2129,
                returns: [{
                    pet_id: 176,
                    base_chance: .4,
                    max_chance: .53
                }, {
                    pet_id: 186,
                    base_chance: .04,
                    max_chance: .08
                }, {
                    pet_id: 271,
                    base_chance: .07,
                    max_chance: .07
                }, {
                    pet_id: 272,
                    base_chance: .04,
                    max_chance: .04
                }]
            }]
        }
    },
    1);
pets[191] = createObject({
    b_i: 191,
    b_t: BASE_TYPE.PET,
    name: "Garm [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 7,
        y: 2
    },
    params: {
        item_id: 2763,
        inventory_slots: 17,
        level: 1,
        eats: {
            8: .025,
            271: .01
        },
        eat_interval: 60,
        happiness: 120,
        insurance_cost: [3929125, 302],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[192] = createObject({
    b_i: 192,
    b_t: BASE_TYPE.PET,
    name: "Baby Chemosit [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 5,
        y: 3
    },
    params: {
        item_id: 2764,
        inventory_slots: 9,
        xp_required: 6E5,
        next_pet_item_id: 2765,
        level: 1,
        eats: {
            8: .25,
            271: .3
        },
        eat_interval: 10,
        happiness: 20,
        insurance_cost: [36E4, 27],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[193] = createObject({
    b_i: 193,
    b_t: BASE_TYPE.PET,
    name: "Chemosit [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 8,
        y: 2
    },
    params: {
        item_id: 2765,
        inventory_slots: 11,
        requires_stone: !0,
        stones: 3,
        next_pet_item_id: 2766,
        level: 2,
        eats: {
            8: .2,
            271: .25
        },
        eat_interval: 13,
        happiness: 26,
        insurance_cost: [468E3, 36],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[194] = createObject({
    b_i: 194,
    b_t: BASE_TYPE.PET,
    name: "Adult Chemosit [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 9,
        y: 2
    },
    params: {
        item_id: 2766,
        inventory_slots: 13,
        level: 3,
        eats: {
            8: .1,
            271: .15
        },
        eat_interval: 16,
        happiness: 29,
        insurance_cost: [918E3, 70],
        breeding_level: 109,
        likes: [{
            pet_id: 90,
            xp: 1639,
            returns: [{
                pet_id: 122,
                base_chance: .25,
                max_chance: .3
            }, {
                pet_id: 176,
                base_chance: .11,
                max_chance: .14
            }, {
                pet_id: 201,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 273,
                base_chance: .05,
                max_chance: .05
            }]
        }]
    }
}, 1);
pets[195] = createObject({
    b_i: 195,
    b_t: BASE_TYPE.PET,
    name: "Bucentaur [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 9,
        y: 3
    },
    params: {
        item_id: 2767,
        inventory_slots: 17,
        level: 1,
        eats: {
            1150: .1
        },
        eat_interval: 120,
        happiness: 240,
        insurance_cost: [5609125, 421],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[196] = createObject({
    b_i: 196,
    b_t: BASE_TYPE.PET,
    name: "Amphisbaena [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 10,
        y: 0
    },
    params: {
        item_id: 2768,
        inventory_slots: 14,
        level: 1,
        eats: {
            268: .05,
            269: .08
        },
        eat_interval: 40,
        happiness: 120,
        insurance_cost: [144E4, 111],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[197] = createObject({
    b_i: 197,
    b_t: BASE_TYPE.PET,
    name: "Catoblepas [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 10,
        y: 1
    },
    params: {
        item_id: 2769,
        inventory_slots: 18,
        level: 1,
        eats: {
            757: .0015,
            758: .002,
            785: .009
        },
        eat_interval: 60,
        happiness: 60,
        insurance_cost: [2811E3, 216],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[198] = createObject({
    b_i: 198,
    b_t: BASE_TYPE.PET,
    name: "Arachne [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 11,
        y: 1
    },
    params: {
        item_id: 2770,
        inventory_slots: 17,
        level: 1,
        eats: {
            274: .015,
            275: .005
        },
        eat_interval: 120,
        happiness: 120,
        insurance_cost: [5321112, 409],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[199] = createObject({
    b_i: 199,
    b_t: BASE_TYPE.PET,
    name: "Gegenees [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS,
        x: 11,
        y: 3
    },
    params: {
        item_id: 2771,
        inventory_slots: 17,
        level: 1,
        eats: {
            1150: .1,
            239: .0025
        },
        eat_interval: 120,
        happiness: 280,
        insurance_cost: [4860336, 373],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[200] = createObject({
    b_i: 200,
    b_t: BASE_TYPE.PET,
    name: "Aspidochelone [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 10,
        y: 0
    },
    params: {
        item_id: 2772,
        inventory_slots: 19,
        level: 1,
        eats: {
            283: .01,
            238: .02
        },
        eat_interval: 40,
        happiness: 460,
        insurance_cost: [5007048, 385],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[201] = createObject({
    b_i: 201,
    b_t: BASE_TYPE.PET,
    name: "Bies [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 10,
        y: 1
    },
    params: {
        item_id: 2773,
        inventory_slots: 20,
        level: 1,
        eats: {
            268: .0025,
            267: .025
        },
        eat_interval: 50,
        happiness: 120,
        insurance_cost: [4728E3, 363],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[202] = createObject({
    b_i: 202,
    b_t: BASE_TYPE.PET,
    name: "Quetzalcoatl [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS4,
        x: 11,
        y: 0
    },
    params: {
        item_id: 2774,
        inventory_slots: 19,
        level: 1,
        eats: {
            1150: .1,
            239: .05
        },
        eat_interval: 120,
        happiness: 360,
        insurance_cost: [4803361, 369],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[203] = createObject({
    b_i: 203,
    b_t: BASE_TYPE.PET,
    name: "Ember Eurynomos [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 10,
        y: 1
    },
    params: {
        item_id: 2775,
        inventory_slots: 7,
        xp_required: 16E5,
        next_pet_item_id: 2776,
        level: 1,
        eats: {
            245: .15,
            244: .2
        },
        eat_interval: 30,
        happiness: 120,
        insurance_cost: [132E4, 101],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[204] = createObject({
    b_i: 204,
    b_t: BASE_TYPE.PET,
    name: "Fire Eurynomos [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 10,
        y: 2
    },
    params: {
        item_id: 2776,
        inventory_slots: 10,
        requires_stone: !0,
        stones: 3,
        next_pet_item_id: 2777,
        level: 2,
        eats: {
            245: .12,
            244: .18
        },
        eat_interval: 38,
        happiness: 140,
        insurance_cost: [1716E3, 132],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[205] = createObject({
    b_i: 205,
    b_t: BASE_TYPE.PET,
    name: "Hellfire Eurynomos [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 11,
        y: 0
    },
    params: {
        item_id: 2777,
        inventory_slots: 13,
        level: 3,
        eats: {
            245: .1,
            244: .15
        },
        eat_interval: 45,
        happiness: 160,
        insurance_cost: [2166E3, 166],
        breeding_level: 118,
        likes: [{
            pet_id: 42,
            xp: 4488,
            returns: [{
                pet_id: 81,
                base_chance: .6,
                max_chance: .835
            }, {
                pet_id: 202,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 229,
                base_chance: .13,
                max_chance: .13
            }, {
                pet_id: 280,
                base_chance: .09,
                max_chance: .09
            }]
        }, {
            pet_id: 53,
            xp: 5332,
            returns: [{
                pet_id: 131,
                base_chance: .38,
                max_chance: .58
            }, {
                pet_id: 195,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 259,
                base_chance: .08,
                max_chance: .08
            }, {
                pet_id: 281,
                base_chance: .04,
                max_chance: .04
            }]
        }]
    }
}, 1);
pets[206] = createObject({
    b_i: 206,
    b_t: BASE_TYPE.PET,
    name: "Shadow Aerico [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 0,
        y: 0
    },
    params: {
        item_id: 2778,
        inventory_slots: 10,
        xp_required: 9E5,
        next_pet_item_id: 2779,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 30,
        happiness: 90,
        insurance_cost: [12E5, 92],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[207] = createObject({
    b_i: 207,
    b_t: BASE_TYPE.PET,
    name: "Night Aerico [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 1,
        y: 0
    },
    params: {
        item_id: 2779,
        inventory_slots: 13,
        requires_stone: !0,
        stones: 3,
        next_pet_item_id: 2780,
        level: 2,
        eats: {
            274: .02,
            275: .04
        },
        eat_interval: 35,
        happiness: 100,
        insurance_cost: [156E4, 120],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[208] = createObject({
    b_i: 208,
    b_t: BASE_TYPE.PET,
    name: "Void Aerico [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 2,
        y: 0
    },
    params: {
        item_id: 2780,
        inventory_slots: 15,
        level: 3,
        eats: {
            274: .015,
            275: .035
        },
        eat_interval: 35,
        happiness: 120,
        insurance_cost: [201E4, 154],
        breeding_level: 106,
        likes: [{
            pet_id: 22,
            xp: 4552,
            returns: [{
                pet_id: 85,
                base_chance: .3,
                max_chance: .45
            }, {
                pet_id: 84,
                base_chance: .12,
                max_chance: .16
            }, {
                pet_id: 181,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 263,
                base_chance: .14,
                max_chance: .14
            }, {
                pet_id: 264,
                base_chance: .1,
                max_chance: .1
            }, {
                pet_id: 278,
                base_chance: .09,
                max_chance: .09
            }]
        }, {
            pet_id: 17,
            xp: 5165,
            returns: [{
                pet_id: 85,
                base_chance: .3,
                max_chance: .45
            }, {
                pet_id: 77,
                base_chance: .12,
                max_chance: .16
            }, {
                pet_id: 198,
                base_chance: .02,
                max_chance: .04
            }, {
                pet_id: 263,
                base_chance: .13,
                max_chance: .13
            }, {
                pet_id: 242,
                base_chance: .09,
                max_chance: .09
            }, {
                pet_id: 279,
                base_chance: .07,
                max_chance: .07
            }]
        }]
    }
}, 1);
pets[209] = createObject({
    b_i: 209,
    b_t: BASE_TYPE.PET,
    name: "Shadow Keres [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 3,
        y: 0
    },
    params: {
        item_id: 2781,
        inventory_slots: 9,
        xp_required: 75E4,
        next_pet_item_id: 2782,
        level: 1,
        eats: {
            274: .025,
            275: .05
        },
        eat_interval: 25,
        happiness: 75,
        insurance_cost: [51E4, 39],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[210] = createObject({
    b_i: 210,
    b_t: BASE_TYPE.PET,
    name: "Night Keres [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 4,
        y: 0
    },
    params: {
        item_id: 2782,
        inventory_slots: 12,
        requires_stone: !0,
        stones: 3,
        next_pet_item_id: 2783,
        level: 2,
        eats: {
            274: .02,
            275: .045
        },
        eat_interval: 30,
        happiness: 80,
        insurance_cost: [663E3, 51],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[211] = createObject({
    b_i: 211,
    b_t: BASE_TYPE.PET,
    name: "Void Keres [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS5,
        x: 5,
        y: 0
    },
    params: {
        item_id: 2783,
        inventory_slots: 14,
        level: 3,
        eats: {
            274: .015,
            275: .035
        },
        eat_interval: 35,
        happiness: 90,
        insurance_cost: [1113E3, 85],
        breeding_level: 100,
        likes: [{
            pet_id: 32,
            xp: 2075,
            returns: [{
                pet_id: 114,
                base_chance: .4,
                max_chance: .65
            }, {
                pet_id: 196,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 244,
                base_chance: .12,
                max_chance: .12
            }, {
                pet_id: 277,
                base_chance: .07,
                max_chance: .07
            }]
        }, {
            pet_id: 55,
            xp: 5165,
            returns: [{
                pet_id: 84,
                base_chance: .2,
                max_chance: .35
            }, {
                pet_id: 199,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 264,
                base_chance: .1,
                max_chance: .1
            }, {
                pet_id: 276,
                base_chance: .07,
                max_chance: .07
            }]
        }]
    }
}, 1);
pets[212] = createObject({
    b_i: 212,
    b_t: BASE_TYPE.PET,
    name: "Baby Afrit [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 6,
        y: 3
    },
    params: {
        item_id: 2784,
        inventory_slots: 2,
        xp_required: 6E5,
        next_pet_item_id: 2785,
        level: 1,
        eats: {
            245: .25,
            244: .35
        },
        eat_interval: 10,
        happiness: 30,
        insurance_cost: [234E3, 18],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[213] = createObject({
    b_i: 213,
    b_t: BASE_TYPE.PET,
    name: "Afrit [Common]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 7,
        y: 3
    },
    params: {
        item_id: 2785,
        inventory_slots: 5,
        xp_required: 8E5,
        next_pet_item_id: 2786,
        level: 2,
        eats: {
            245: .2,
            244: .3
        },
        eat_interval: 13,
        happiness: 39,
        insurance_cost: [304200, 23],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[214] = createObject({
    b_i: 214,
    b_t: BASE_TYPE.PET,
    name: "Adult Afrit [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 11,
        y: 1
    },
    params: {
        item_id: 2786,
        inventory_slots: 9,
        level: 3,
        eats: {
            245: .2,
            244: .3
        },
        eat_interval: 13,
        happiness: 39,
        insurance_cost: [380250, 29],
        breeding_level: 83,
        likes: [{
            pet_id: 52,
            xp: 602,
            returns: [{
                pet_id: 52,
                base_chance: .4,
                max_chance: .53
            }]
        }]
    }
}, 1);
pets[215] = createObject({
    b_i: 215,
    b_t: BASE_TYPE.PET,
    name: "Baby Cockatrice [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.PETS,
        x: 8,
        y: 3
    },
    params: {
        item_id: 2787,
        inventory_slots: 8,
        xp_required: 1E6,
        next_pet_item_id: 2788,
        level: 1,
        eats: {
            762: .45,
            80: .15,
            1300: .9,
            1301: 1
        },
        eat_interval: 10,
        happiness: 40,
        insurance_cost: [51E4, 39],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[216] = createObject({
    b_i: 216,
    b_t: BASE_TYPE.PET,
    name: "Cockatrice [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 12,
        y: 0
    },
    params: {
        item_id: 2788,
        inventory_slots: 11,
        xp_required: 15E5,
        next_pet_item_id: 2789,
        level: 2,
        eats: {
            762: .4,
            80: .1,
            1300: .8,
            1301: .9
        },
        eat_interval: 12,
        happiness: 60,
        insurance_cost: [663E3, 51],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[217] = createObject({
    b_i: 217,
    b_t: BASE_TYPE.PET,
    name: "Adult Cockatrice [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 13,
        y: 0
    },
    params: {
        item_id: 2789,
        inventory_slots: 13,
        level: 3,
        eats: {
            762: .3,
            80: .05,
            1300: .7,
            1301: .8
        },
        eat_interval: 15,
        happiness: 75,
        insurance_cost: [828750, 64],
        breeding_level: 88,
        likes: []
    }
}, 1);
pets[218] = createObject({
    b_i: 218,
    b_t: BASE_TYPE.PET,
    name: "Baby Valvran [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 14,
        y: 0
    },
    params: {
        item_id: 2790,
        inventory_slots: 10,
        xp_required: 11E5,
        next_pet_item_id: 2791,
        level: 1,
        eats: {
            762: .4,
            80: .1,
            1300: .8,
            1301: .9
        },
        eat_interval: 20,
        happiness: 60,
        insurance_cost: [228E4, 175],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[219] = createObject({
    b_i: 219,
    b_t: BASE_TYPE.PET,
    name: "Valvran [Rare]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 15,
        y: 0
    },
    params: {
        item_id: 2791,
        inventory_slots: 13,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 2792,
        level: 2,
        eats: {
            762: .35,
            80: .08,
            1300: .7,
            1301: .8
        },
        eat_interval: 25,
        happiness: 75,
        insurance_cost: [2964E3, 228],
        breeding_level: 1,
        likes: []
    }
}, 1);
pets[220] = createObject({
    b_i: 220,
    b_t: BASE_TYPE.PET,
    name: "Adult Valvran [Legendary]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS3,
        x: 16,
        y: 0
    },
    params: {
        item_id: 2792,
        inventory_slots: 15,
        level: 3,
        eats: {
            762: .25,
            80: .06,
            1300: .5,
            1301: .8
        },
        eat_interval: 25,
        happiness: 100,
        insurance_cost: [3564E3, 274],
        breeding_level: 119,
        likes: [{
            pet_id: 86,
            xp: 9334,
            returns: [{
                pet_id: 177,
                base_chance: .35,
                max_chance: .55
            }, {
                pet_id: 187,
                base_chance: .04,
                max_chance: .04
            }, {
                pet_id: 282,
                base_chance: .12,
                max_chance: .12
            }, {
                pet_id: 283,
                base_chance: .08,
                max_chance: .08
            }]
        }, {
            pet_id: 205,
            xp: 10052,
            returns: [{
                pet_id: 77,
                base_chance: .44,
                max_chance: .6
            }, {
                pet_id: 200,
                base_chance: .04,
                max_chance: .08
            }, {
                pet_id: 242,
                base_chance: .1,
                max_chance: .1
            }, {
                pet_id: 284,
                base_chance: .08,
                max_chance: .08
            }]
        }]
    }
}, 1);
pets[221] = createObject({
    b_i: 221,
    b_t: BASE_TYPE.PET,
    name: "Hinny [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2810,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1249,
        level: 1
    }
}, 1);
pets[222] = createObject({
    b_i: 222,
    b_t: BASE_TYPE.PET,
    name: "Royal Horse [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2811,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1216,
        level: 1
    }
}, 1);
pets[223] = createObject({
    b_i: 223,
    b_t: BASE_TYPE.PET,
    name: "Winged Sapphire Demon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2812,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1242,
        level: 1
    }
}, 1);
pets[224] = createObject({
    b_i: 224,
    b_t: BASE_TYPE.PET,
    name: "Crystal Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2813,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1213,
        level: 1
    }
}, 1);
pets[225] = createObject({
    b_i: 225,
    b_t: BASE_TYPE.PET,
    name: "Rubysoul Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2814,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1212,
        level: 1
    }
}, 1);
pets[226] = createObject({
    b_i: 226,
    b_t: BASE_TYPE.PET,
    name: "Ghost Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2815,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1169,
        level: 1
    }
}, 1);
pets[227] = createObject({
    b_i: 227,
    b_t: BASE_TYPE.PET,
    name: "Shadow Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2816,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1236,
        level: 1
    }
}, 1);
pets[228] = createObject({
    b_i: 228,
    b_t: BASE_TYPE.PET,
    name: "White Belly Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2817,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1222,
        level: 1
    }
}, 1);
pets[229] = createObject({
    b_i: 229,
    b_t: BASE_TYPE.PET,
    name: "Horntail [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2818,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1188,
        level: 1
    }
}, 1);
pets[230] = createObject({
    b_i: 230,
    b_t: BASE_TYPE.PET,
    name: "Ancient Ironbelly [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2819,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1202,
        level: 1
    }
}, 1);
pets[231] = createObject({
    b_i: 231,
    b_t: BASE_TYPE.PET,
    name: "Fire Heart Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2820,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1224,
        level: 1
    }
}, 1);
pets[232] = createObject({
    b_i: 232,
    b_t: BASE_TYPE.PET,
    name: "Flaming Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2821,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1220,
        level: 1
    }
}, 1);
pets[233] = createObject({
    b_i: 233,
    b_t: BASE_TYPE.PET,
    name: "Archsky Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2822,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1203,
        level: 1
    }
}, 1);
pets[234] = createObject({
    b_i: 234,
    b_t: BASE_TYPE.PET,
    name: "Deragonite [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2823,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1225,
        level: 1
    }
}, 1);
pets[235] = createObject({
    b_i: 235,
    b_t: BASE_TYPE.PET,
    name: "Saint Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2824,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1201,
        level: 1
    }
}, 1);
pets[236] = createObject({
    b_i: 236,
    b_t: BASE_TYPE.PET,
    name: "Flame Observer [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2825,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1204,
        level: 1
    }
}, 1);
pets[237] = createObject({
    b_i: 237,
    b_t: BASE_TYPE.PET,
    name: "HellKyte [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2826,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1182,
        level: 1
    }
}, 1);
pets[238] = createObject({
    b_i: 238,
    b_t: BASE_TYPE.PET,
    name: "Efreet Sultan [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2827,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1205,
        level: 1
    }
}, 1);
pets[239] = createObject({
    b_i: 239,
    b_t: BASE_TYPE.PET,
    name: "Fire Elemental [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2828,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1199,
        level: 1
    }
}, 1);
pets[240] = createObject({
    b_i: 240,
    b_t: BASE_TYPE.PET,
    name: "Genie [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2829,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1255,
        level: 1
    }
}, 1);
pets[241] = createObject({
    b_i: 241,
    b_t: BASE_TYPE.PET,
    name: "Ifrit [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2830,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1183,
        level: 1
    }
}, 1);
pets[242] = createObject({
    b_i: 242,
    b_t: BASE_TYPE.PET,
    name: "Death Knight [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2831,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1184,
        level: 1
    }
}, 1);
pets[243] = createObject({
    b_i: 243,
    b_t: BASE_TYPE.PET,
    name: "Fire Overlord [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2832,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1186,
        level: 1
    }
}, 1);
pets[244] = createObject({
    b_i: 244,
    b_t: BASE_TYPE.PET,
    name: "Lava Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2833,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1221,
        level: 1
    }
}, 1);
pets[245] = createObject({
    b_i: 245,
    b_t: BASE_TYPE.PET,
    name: "Underworld Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2834,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1223,
        level: 1
    }
}, 1);
pets[246] = createObject({
    b_i: 246,
    b_t: BASE_TYPE.PET,
    name: "Undead Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2835,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1214,
        level: 1
    }
}, 1);
pets[247] = createObject({
    b_i: 247,
    b_t: BASE_TYPE.PET,
    name: "Obsidian Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2836,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1193,
        level: 1
    }
}, 1);
pets[248] = createObject({
    b_i: 248,
    b_t: BASE_TYPE.PET,
    name: "Lionhead Dragon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2837,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1187,
        level: 1
    }
}, 1);
pets[249] = createObject({
    b_i: 249,
    b_t: BASE_TYPE.PET,
    name: "Wildfire Steed [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2838,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1196,
        level: 1
    }
}, 1);
pets[250] = createObject({
    b_i: 250,
    b_t: BASE_TYPE.PET,
    name: "Sleipnir [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2839,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1181,
        level: 1
    }
}, 1);
pets[251] = createObject({
    b_i: 251,
    b_t: BASE_TYPE.PET,
    name: "Dark Pegasus [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2840,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1180,
        level: 1
    }
}, 1);
pets[252] = createObject({
    b_i: 252,
    b_t: BASE_TYPE.PET,
    name: "Lava Pegasus [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2841,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1217,
        level: 1
    }
}, 1);
pets[253] = createObject({
    b_i: 253,
    b_t: BASE_TYPE.PET,
    name: "Nightmare Pegasus [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2842,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1218,
        level: 1
    }
}, 1);
pets[254] = createObject({
    b_i: 254,
    b_t: BASE_TYPE.PET,
    name: "Demonic Unicorn [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2843,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1251,
        level: 1
    }
}, 1);
pets[255] = createObject({
    b_i: 255,
    b_t: BASE_TYPE.PET,
    name: "Crystallized Pegasus [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2844,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1250,
        level: 1
    }
}, 1);
pets[256] = createObject({
    b_i: 256,
    b_t: BASE_TYPE.PET,
    name: "Sun Pegasus [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2845,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1219,
        level: 1
    }
}, 1);
pets[257] = createObject({
    b_i: 257,
    b_t: BASE_TYPE.PET,
    name: "Cloudcaller [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2846,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1227,
        level: 1
    }
}, 1);
pets[258] = createObject({
    b_i: 258,
    b_t: BASE_TYPE.PET,
    name: "Marble Unicorn [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2847,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1237,
        level: 1
    }
}, 1);
pets[259] = createObject({
    b_i: 259,
    b_t: BASE_TYPE.PET,
    name: "Underworld Lord [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2848,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1238,
        level: 1
    }
}, 1);
pets[260] = createObject({
    b_i: 260,
    b_t: BASE_TYPE.PET,
    name: "Lord Of Destruction [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2849,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1239,
        level: 1
    }
}, 1);
pets[261] = createObject({
    b_i: 261,
    b_t: BASE_TYPE.PET,
    name: "Cursed Archangel [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2850,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1190,
        level: 1
    }
}, 1);
pets[262] = createObject({
    b_i: 262,
    b_t: BASE_TYPE.PET,
    name: "Rael [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2851,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1189,
        level: 1
    }
}, 1);
pets[263] = createObject({
    b_i: 263,
    b_t: BASE_TYPE.PET,
    name: "Michael the archangel [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2852,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1192,
        level: 1
    }
}, 1);
pets[264] = createObject({
    b_i: 264,
    b_t: BASE_TYPE.PET,
    name: "Jophiel the archangel [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2853,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 1191,
        level: 1
    }
}, 1);
pets[265] = createObject({
    b_i: 265,
    b_t: BASE_TYPE.PET,
    name: "Raguel the archangel [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2854,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1232,
        level: 1
    }
}, 1);
pets[266] = createObject({
    b_i: 266,
    b_t: BASE_TYPE.PET,
    name: "Shiva [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 0,
        y: 8
    },
    params: {
        item_id: 2855,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 1,
        next_pet_item_id: 1185,
        level: 1
    }
}, 1);
pets[267] = createObject({
    b_i: 267,
    b_t: BASE_TYPE.PET,
    name: "Mylanth [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2856,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1344,
        level: 1
    }
}, 1);
pets[268] = createObject({
    b_i: 268,
    b_t: BASE_TYPE.PET,
    name: "Tesselth [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2857,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 1345,
        level: 1
    }
}, 1);
pets[269] = createObject({
    b_i: 269,
    b_t: BASE_TYPE.PET,
    name: "Xirador [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2858,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 1346,
        level: 1
    }
}, 1);
pets[270] = createObject({
    b_i: 270,
    b_t: BASE_TYPE.PET,
    name: "Xalanth [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2859,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 1347,
        level: 1
    }
}, 1);
pets[271] = createObject({
    b_i: 271,
    b_t: BASE_TYPE.PET,
    name: "Dragonhorse [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2860,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 2748,
        level: 1
    }
}, 1);
pets[272] = createObject({
    b_i: 272,
    b_t: BASE_TYPE.PET,
    name: "Kilin [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 2,
        y: 8
    },
    params: {
        item_id: 2861,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 4,
        next_pet_item_id: 2758,
        level: 1
    }
}, 1);
pets[273] = createObject({
    b_i: 273,
    b_t: BASE_TYPE.PET,
    name: "Bies [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2862,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2773,
        level: 1
    }
}, 1);
pets[274] = createObject({
    b_i: 274,
    b_t: BASE_TYPE.PET,
    name: "Garm [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2863,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2763,
        level: 1
    }
}, 1);
pets[275] = createObject({
    b_i: 275,
    b_t: BASE_TYPE.PET,
    name: "Catoblepas [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2864,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2769,
        level: 1
    }
}, 1);
pets[276] = createObject({
    b_i: 276,
    b_t: BASE_TYPE.PET,
    name: "Gegenees [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2865,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2771,
        level: 1
    }
}, 1);
pets[277] = createObject({
    b_i: 277,
    b_t: BASE_TYPE.PET,
    name: "Amphisbaena [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2866,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2768,
        level: 1
    }
}, 1);
pets[278] = createObject({
    b_i: 278,
    b_t: BASE_TYPE.PET,
    name: "Typhon [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2867,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2753,
        level: 1
    }
}, 1);
pets[279] = createObject({
    b_i: 279,
    b_t: BASE_TYPE.PET,
    name: "Arachne [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2868,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2770,
        level: 1
    }
}, 1);
pets[280] = createObject({
    b_i: 280,
    b_t: BASE_TYPE.PET,
    name: "Quetzalcoatl [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2869,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2774,
        level: 1
    }
}, 1);
pets[281] = createObject({
    b_i: 281,
    b_t: BASE_TYPE.PET,
    name: "Bucentaur [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2870,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2767,
        level: 1
    }
}, 1);
pets[282] = createObject({
    b_i: 282,
    b_t: BASE_TYPE.PET,
    name: "Ercinee [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 1,
        y: 8
    },
    params: {
        item_id: 2871,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 2,
        next_pet_item_id: 2749,
        level: 1
    }
}, 1);
pets[283] = createObject({
    b_i: 283,
    b_t: BASE_TYPE.PET,
    name: "Jormungandr [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2872,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2759,
        level: 1
    }
}, 1);
pets[284] = createObject({
    b_i: 284,
    b_t: BASE_TYPE.PET,
    name: "Aspidochelone [Egg]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.ALCHEMY,
        x: 3,
        y: 8
    },
    params: {
        item_id: 2873,
        inventory_slots: 0,
        requires_stone: !0,
        stones: 6,
        next_pet_item_id: 2772,
        level: 1
    }
}, 1);
pets[285] = createObject({
    b_i: 285,
    b_t: BASE_TYPE.PET,
    name: "Santa's Sleigh [Ancient]",
    type: OBJECT_TYPE.DUMMY,
    img: {
        sheet: IMAGE_SHEET.BOSS2,
        x: 0,
        y: 3
    },
    params: {
        item_id: 2911,
        inventory_slots: 24,
        level: 1,
        eats: {
            29: .01
        },
        eat_interval: 10,
        happiness: 90,
        insurance_cost: [1, 1],
        breeding_level: 1,
        likes: []
    }
}, 1);

function copyPetLikes() {
    for (var a = 1, b = pets.length; a < b; a++)
        if (pets[a].name != item_base[pets[a].params.item_id].name && console.log("Name mismatch? pets[" + a + "] is " + pets[a].name + " and item_base[" + pets[a].params.item_id + "] is " + item_base[pets[a].params.item_id].name), a != item_base[pets[a].params.item_id].params.pet && console.log("Pet " + a + " points to item_base[" + pets[a].params.item_id + "] that does not have same pet id"), pets[a].params.likes)
            for (var d in pets[a].params.likes) {
                var e = pets[a].params.likes[d].pet_id;
                if (pets[e]) {
                    pets[e].params.likes || (pets[e].params.likes = []);
                    var f = ["eats", "eat_interval", "happiness", "insurance_cost", "breeding_level"],
                        g;
                    for (g in f) "undefined" == typeof pets[e].params[f[g]] && console.log("Pet " + a + " likes pet " + e + " that has no " + f[g] + "!");
                    var f = !1,
                        h;
                    for (h in pets[e].params.likes)
                        if (pets[e].params.likes[h].pet_id == a) {
                            f = !0;
                            break
                        }
                    f || (pets[e].params.likes.push(JSON.clone(pets[a].params.likes[d])), pets[e].params.likes[pets[e].params.likes.length - 1].pet_id = a)
                } else console.log("Pet " + a + " likes invalid pet " +
                    e)
            }
        calculateBreedingValues()
}

function calculateBreedingValues() {
    if (1338 == config.http_port && "undefined" == typeof iamserver) {
        calculateFoodPrices();
        for (var a = 1; a < pets.length; a++)
            if (pets[a].params.breeding_level) {
                var b = item_base[pets[a].params.item_id],
                    d = pets[a].params.insurance_cost[0],
                    e = pets[a].params.insurance_cost[1];
                1 < b.params.price && .01 < Math.abs(d / b.params.price - .6) && console.log(b.name, "Price", b.params.price, "Insurance price", d, "Does not equal 0.6", d / b.params.price);
                if (pets[a].params.likes)
                    for (var f = 0; f < pets[a].params.likes.length; f++) {
                        for (var g =
                                0, h = pets[a].params.likes[f].returns, l = pets[pets[a].params.likes[f].pet_id].params.insurance_cost[0], m = pets[pets[a].params.likes[f].pet_id].params.insurance_cost[1], k = 0; k < h.length; k++) g += h[k].max_chance * item_base[pets[h[k].pet_id].params.item_id].params.price * .5;
                        var h = pets[a].params.food_price + pets[pets[a].params.likes[f].pet_id].params.food_price,
                            k = g - (b.params.price / 2 + h),
                            v = g - h;
                        console.log("Average profit ", g - (d + l + h), pets[a].name, "and", pets[pets[a].params.likes[f].pet_id].name);
                        0 < k && console.log("Average profit (no insurance) ",
                            k, pets[a].name, "and", pets[pets[a].params.likes[f].pet_id].name);
                        console.log("Average profit per MOS insurance ", v / (e + m), pets[a].name, "and", pets[pets[a].params.likes[f].pet_id].name)
                    } else console.log("Missing likes from pet", pets[a].name)
            }
    }
}

function calculateFoodPrices() {
    for (var a = 1; a < pets.length; a++)
        if (pets[a].params.breeding_level) {
            var b = pets[a],
                d = 9999999999,
                e;
            for (e in b.params.eats) d = Math.min(item_base[e].params.price * Math.ceil(1 / b.params.eats[e]), d);
            b.params.food_price = b.params.happiness / b.params.eat_interval * d
        }
}
"undefined" == typeof iamserver && copyPetLikes();
var Build = {
        menu: function() {
            document.getElementById("building_form").style.display = "block";
            var a, b;
            300 == current_map ? (b = document.getElementsByClassName("guild_map"), a = document.getElementsByClassName("player_map")) : (a = document.getElementsByClassName("guild_map"), b = document.getElementsByClassName("player_map"));
            for (var d = 0; d < b.length; d++) b[d].style.display = "none";
            for (d = 0; d < a.length; d++) a[d].style.display = "inline";
            a = "none";
            if (300 == current_map || 0 <= guild_data.permissions.indexOf(players[0].name)) a = "inline";
            b = document.getElementsByClassName("permissions_enabled");
            for (d = 0; d < b.length; d++) b[d].style.display = a;
            "inline" == a ? Carpentry.init() : Carpentry.show_buildings()
        },
        remove_mode: function() {
            Carpentry.remove_menu()
        }
    },
    Carpentry = {
        ship_upgrades: {
            0: {
                items: {
                    29: 300
                },
                mos: 20
            },
            1: {
                items: {
                    314: 150
                },
                mos: 20
            },
            2: {
                items: {
                    313: 100
                },
                mos: 20
            },
            3: {
                items: {
                    296: 75
                },
                mos: 20
            },
            4: {
                items: {
                    594: 50
                },
                mos: 20
            },
            5: {
                items: {
                    595: 25
                },
                mos: 20
            },
            6: {
                items: {
                    265: 50
                },
                mos: 20
            },
            7: {
                items: {
                    266: 30
                },
                mos: 20
            }
        },
        island_theme_prices: {
            coins: 1E6,
            mos: 100
        },
        map_max_size: 25,
        upgrade_prices: {
            13: 25E4,
            14: 5E5,
            15: 1E6,
            16: 2E6,
            17: 4E6,
            18: 8E6,
            19: 16E6,
            20: 2E7,
            21: 22E6,
            22: 24E6,
            23: 26E6,
            24: 28E6
        },
        upgrade_prices_mos: {
            13: 25,
            14: 50,
            15: 100,
            16: 200,
            17: 400,
            18: 800,
            19: 1600,
            20: 2E3,
            21: 2200,
            22: 2400,
            23: 2600,
            24: 2800
        },
        random_tiles: {
            0: [0, 0, 0, 62, 62, 62, 63, 63, 63, 64, 64, 64, 65, 65, 65, 0, 0, 0, 62, 62, 62, 63, 63, 63, 64, 64, 64, 65, 65, 65, 66, 67, 68, 69, 190, 2],
            1: [93, 94, 95, 96, 97, 93, 94, 95, 96, 97, 93, 94, 95, 96, 97, 93, 94, 95, 96, 97, 3, 157, 158, 159, 290, 291, 292, 293, 294, 295, 296, 297],
            2: [19, 19, 19, 19, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134],
            3: [70,
                71, 72, 73, 74, 75, 76, 70, 71, 72, 73, 74, 75, 76, 70, 71, 72, 73, 74, 75, 76, 70, 71, 72, 73, 74, 75, 76, 77, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213
            ],
            4: [78, 79, 80, 81, 82, 83, 84, 78, 79, 80, 81, 82, 83, 84, 78, 79, 80, 81, 82, 83, 84, 78, 79, 80, 81, 82, 83, 84, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225],
            5: [85, 86, 87, 88, 89, 90, 91, 92, 85, 86, 87, 88, 89, 90, 91, 92, 85, 86, 87, 88, 89, 90, 91, 92, 85, 86, 87, 88, 89, 90, 91, 92, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237],
            6: [38, 57],
            7: [12, 20, 22, 12, 20, 22, 109, 110, 111, 112, 113],
            8: [331, 332, 333, 331, 332, 333, 331, 332,
                333, 334, 335, 336
            ]
        },
        tile_names: [{
            id: 0,
            name: "Dorpat Green"
        }, {
            id: 1,
            name: "Sand"
        }, {
            id: 2,
            name: "Snow"
        }, {
            id: 3,
            name: "Spring Forest"
        }, {
            id: 4,
            name: "Whiland Green"
        }, {
            id: 5,
            name: "Walco Ground"
        }, {
            id: 6,
            name: "Clouds"
        }, {
            id: 7,
            name: "Blood River"
        }, {
            id: 8,
            name: "Broceliande"
        }],
        last_screen: !1,
        init: function(a) {
            BigMenu.show(-1);
            "undefined" == typeof a && (a = "floors");
            var b = document.getElementById("carpentry_formulas");
            Carpentry.category = a;
            for (var d = [], e = 0, f = CARPENTRY_FORMULAS[a].length; e < f; e++) {
                var g = CARPENTRY_FORMULAS[a][e];
                (!g.island ||
                    g.island && 300 == current_map) && d.push(g)
            }
            b.innerHTML = HandlebarTemplate.carpentry_formulas()(d)
        },
        only_available_formulas: function(a) {
            Carpentry.only_available = a;
            Carpentry.init(Carpentry.category)
        },
        show_buildings: function() {
            Carpentry.last_screen = "buildings";
            var a = document.getElementById("carpentry_formulas"),
                b;
            b = 300 == current_map ? [{
                name: "Ship",
                percent: Math.round((Carpentry.player_map.ship || 0) / 8 * 100)
            }] : [{
                name: "Shrine",
                percent: 23,
                show_level: !0,
                level: 0
            }, {
                name: "Hall",
                percent: 10,
                show_level: !0,
                level: 0
            }, {
                name: "Barracks",
                percent: 0,
                show_level: !0,
                level: 0
            }, {
                name: "Mine",
                percent: 0,
                show_level: !0,
                level: 0
            }];
            for (var d in b) b[d].can_provide_materials = 100 > b[d].percent ? !0 : !1;
            a.innerHTML = HandlebarTemplate.carpentry_buildings_menu()(b)
        },
        travel_to: function(a) {
            Socket.send("message", {
                data: "/sailto " + a,
                lang: "EN"
            })
        },
        show_map_upgrades: function() {
            Carpentry.last_screen = "map";
            var a = document.getElementById("carpentry_formulas"),
                b = [{
                    name: "Island size",
                    percent: Math.round((Carpentry.player_map.size.x - 13) / (Carpentry.map_max_size - 13) * 100),
                    show_level: !0,
                    level: Carpentry.player_map.size.x
                }],
                d;
            for (d in b) b[d].can_provide_materials = 100 > b[d].percent ? !0 : !1;
            a.innerHTML = HandlebarTemplate.carpentry_buildings_menu()(b);
            a.innerHTML += HandlebarTemplate.island_theme_dropdown()({
                tiles: Carpentry.tile_names,
                current: Carpentry.player_map.tiles
            })
        },
        building_button: function(a) {
            switch (a) {
                case "Ship":
                    var b = Carpentry.ship_upgrades[Carpentry.player_map.ship || 0],
                        d = [],
                        e;
                    for (e in b.items) d.push(b.items[e] + " " + _tn(item_base[e].name));
                    Popup.dual_prompt(_ti("Add additional materials to the ship?"),
                        d.join(", "),
                        function() {
                            Socket.send("player_map_build", {
                                name: a,
                                type: "items"
                            })
                        }, b.mos + " MOS",
                        function() {
                            Socket.send("player_map_build", {
                                name: a,
                                type: "mos"
                            })
                        }, null_function);
                    break;
                case "Island size":
                    Carpentry.island_size_upgrade()
            }
        },
        island_size_upgrade: function() {
            var a = Carpentry.player_map.size.x,
                b = a + 1;
            BigMenu.show(-1);
            document.getElementById("carpentry_formulas");
            a == Carpentry.map_max_size ? Popup.dialog(_te("Maximum size reached!"), function() {}) : Popup.dual_prompt(_ti("Upgrade your island to {size}x{size}?", {
                size: b
            }), thousandSeperate(Carpentry.upgrade_prices[a]) + " " + _ti("coins"), function() {
                Socket.send("player_map_upgrade", {
                    upgrade: !0,
                    type: "coins"
                })
            }, thousandSeperate(Carpentry.upgrade_prices_mos[a]) + " MOS", function() {
                Socket.send("player_map_upgrade", {
                    upgrade: !0,
                    type: "mos"
                })
            })
        },
        change_island_theme: function() {
            var a = document.getElementById("island_theme_dropdown").value;
            if (a != (Carpentry.player_map.tiles || 0)) {
                if (Carpentry.player_map.unlocked_themes && -1 != Carpentry.player_map.unlocked_themes.indexOf(parseInt(a))) return Socket.send("player_map", {
                    sub: "change_theme",
                    new_theme: a,
                    type: "free"
                });
                Popup.dual_prompt(_ti("Change island theme to {theme}?", {
                    theme: _ti(Carpentry.tile_names[a].name)
                }), thousandSeperate(Carpentry.island_theme_prices.coins) + " " + _ti("coins"), function() {
                    Socket.send("player_map", {
                        sub: "change_theme",
                        new_theme: a,
                        type: "coins"
                    })
                }, thousandSeperate(Carpentry.island_theme_prices.mos) + " MOS", function() {
                    Socket.send("player_map", {
                        sub: "change_theme",
                        new_theme: a,
                        type: "mos"
                    })
                })
            }
        },
        remove_menu: function() {
            BigMenu.show(-1);
            var a = document.getElementById("carpentry_remove_menu");
            a.innerHTML = HandlebarTemplate.carpentry_remove_menu()("floors" == Carpentry.category);
            a.style.display = "block";
            building_mode_enabled = !0;
            Carpentry.mode = "remove"
        },
        make: function(a) {
            Music.sound_effect("carpentry");
            Socket.send("carpentry", {
                sub: "make",
                category: Carpentry.category,
                id: a
            })
        },
        place: function(a, b) {
            document.getElementById("building_form").style.display = "none";
            "undefined" == typeof b && (b = 0);
            Carpentry.rotate = b;
            var d = document.getElementById("build_menu");
            d.innerHTML = HandlebarTemplate.build_menu()({
                category: Carpentry.category,
                id: a,
                item_id: CARPENTRY_FORMULAS[Carpentry.category][a].item_id,
                rotate: b
            });
            d.style.display = "block";
            Carpentry.id = a;
            building_mode_enabled = !0;
            Carpentry.mode = "add"
        },
        place_close: function() {
            var a = document.getElementById("build_menu");
            a.style.display = "none";
            a = document.getElementById("carpentry_remove_menu");
            a.style.display = "none";
            building_mode_enabled = !1
        },
        place_rotate: function(a) {
            var b = item_base[CARPENTRY_FORMULAS[Carpentry.category][a].item_id],
                d = 0;
            Carpentry.rotate < (BASE_TYPE[b.params.carpentry_type][b.params.carpentry_id].params.img_rotates ||
                0) && (d = Carpentry.rotate + 1);
            Carpentry.place(a, d)
        },
        build_regular_click: function(a) {
            if (300 != current_map || !(10 > a.i || 10 > a.j || "undefined" == typeof map[current_map][a.i] || "undefined" == typeof map[current_map][a.i][a.j] || 10 == a.i && 10 == a.j)) switch (Carpentry.mode) {
                case "add":
                    for (var b = CARPENTRY_FORMULAS[Carpentry.category][Carpentry.id], d = item_base[b.item_id], d = BASE_TYPE[d.params.carpentry_type][d.params.carpentry_id], e = 1;
                        "undefined" != typeof objects_data[e];) e++;
                    a.id = e;
                    a.map = current_map;
                    a.params = {
                        rotate: Carpentry.rotate
                    };
                    if (300 == current_map && (d = createObject(JSON.merge(d, a)), updateObjectImage(d), objects_data[a.id] = d, "floors" != Carpentry.category)) try {
                        var f = on_map[current_map][a.i][a.j];
                        if (0 < f.params.items.length) {
                            addChatText(_te("Remove items from object first!"), null, COLOR.PINK);
                            break
                        }
                    } catch (g) {}
                    1 == Chest.player_chest_item_count(0, b.item_id) && Carpentry.place_close();
                    Socket.send("carpentry", {
                        sub: "add",
                        category: Carpentry.category,
                        id: Carpentry.id,
                        position: {
                            i: a.i - (300 == current_map ? 10 : 0),
                            j: a.j - (300 == current_map ? 10 : 0),
                            r: Carpentry.rotate ||
                                void 0
                        }
                    });
                    break;
                case "remove":
                    if (300 == current_map)
                        if ("floors" == Carpentry.category) {
                            if (f = map[current_map][a.i] && map[current_map][a.i][a.j], !(f && ground_base[f.b_i].params && ground_base[f.b_i].params.carpentry_item_id)) return !1
                        } else {
                            f = on_map[current_map][a.i] && on_map[current_map][a.i][a.j];
                            try {
                                if (0 < f.params.items.length) {
                                    addChatText(_te("Remove items from object first!"), null, COLOR.PINK);
                                    break
                                }
                            } catch (h) {}
                            if (f && object_base[f.b_i].params && object_base[f.b_i].params.carpentry_item_id) {
                                if (332 == f.b_i || 333 ==
                                    f.b_i) b = Carpentry.player_map.tiles || 0, d = ground_base[Carpentry.random_tiles[b][Math.floor(Math.random() * Carpentry.random_tiles[b].length)]], map[current_map][a.i][a.j] = {
                                    b_t: d.b_t,
                                    b_i: d.b_i
                                };
                                drawMap()
                            } else return !1
                        }
                    Socket.send("carpentry", {
                        sub: "remove",
                        category: Carpentry.category,
                        position: {
                            i: a.i - (300 == current_map ? 10 : 0),
                            j: a.j - (300 == current_map ? 10 : 0)
                        }
                    })
            }
        },
        permissions_open: function() {
            windowOpen = !0;
            var a, b, d = !0;
            300 == players[0].map ? (a = on_map[current_map][last_permissions.i][last_permissions.j].params.allowed ||
                [], b = 5) : (a = guild_data.members, b = a.length, d = !1);
            var e = FormHelper.get_form("permissions"),
                f = a.length;
            e.content.innerHTML = HandlebarTemplate.permissions_form()({
                allowed: a,
                current: f,
                maximum: b,
                add_button_visible: f < b,
                remove_allowed: d
            })
        },
        permissions_remove: function(a) {
            Socket.send("carpentry", {
                sub: "access_remove",
                position: {
                    i: last_permissions.i - (300 == current_map ? 10 : 0),
                    j: last_permissions.j - (300 == current_map ? 10 : 0)
                },
                name: a
            })
        },
        permissions_add: function(a) {
            Socket.send("carpentry", {
                sub: "access_add",
                position: {
                    i: last_permissions.i -
                        (300 == current_map ? 10 : 0),
                    j: last_permissions.j - (300 == current_map ? 10 : 0)
                },
                name: a
            })
        },
        category: "floors",
        only_available: !0,
        rotate: 0,
        id: 0,
        mode: "add"
    },
    CARPENTRY_FORMULAS = {
        floors: [{
            id: 0,
            item_id: 730,
            level: 1,
            consumes: [{
                id: 29,
                count: 100
            }]
        }, {
            id: 1,
            item_id: 731,
            level: 10,
            consumes: [{
                id: 314,
                count: 200
            }]
        }, {
            id: 2,
            item_id: 732,
            level: 25,
            consumes: [{
                id: 313,
                count: 300
            }]
        }, {
            id: 3,
            item_id: 825,
            level: 35,
            consumes: [{
                id: 296,
                count: 400
            }]
        }, {
            id: 4,
            item_id: 830,
            level: 45,
            consumes: [{
                id: 594,
                count: 500
            }]
        }, {
            id: 5,
            item_id: 836,
            level: 55,
            consumes: [{
                id: 595,
                count: 600
            }]
        }, {
            id: 6,
            item_id: 842,
            level: 65,
            consumes: [{
                id: 596,
                count: 700
            }]
        }, {
            id: 7,
            item_id: 848,
            level: 80,
            consumes: [{
                id: 597,
                count: 800
            }]
        }, {
            id: 8,
            item_id: 2601,
            level: 90,
            consumes: [{
                id: 2129,
                count: 600
            }]
        }, {
            id: 9,
            item_id: 2608,
            level: 100,
            consumes: [{
                id: 2130,
                count: 500
            }]
        }],
        walls: [{
            id: 0,
            item_id: 734,
            level: 1,
            consumes: [{
                id: 29,
                count: 200
            }]
        }, {
            id: 1,
            item_id: 740,
            level: 13,
            consumes: [{
                id: 314,
                count: 300
            }]
        }, {
            id: 2,
            item_id: 746,
            level: 33,
            consumes: [{
                id: 313,
                count: 400
            }, {
                id: 34,
                count: 200
            }]
        }, {
            id: 3,
            item_id: 752,
            level: 45,
            island: !0,
            consumes: [{
                id: 50,
                count: 10
            }, {
                id: 29,
                count: 50
            }]
        }, {
            id: 4,
            item_id: 824,
            level: 42,
            consumes: [{
                id: 296,
                count: 600
            }, {
                id: 34,
                count: 400
            }]
        }, {
            id: 5,
            item_id: 829,
            level: 52,
            consumes: [{
                id: 594,
                count: 500
            }, {
                id: 50,
                count: 300
            }]
        }, {
            id: 6,
            item_id: 835,
            level: 62,
            consumes: [{
                id: 595,
                count: 600
            }, {
                id: 50,
                count: 400
            }]
        }, {
            id: 7,
            item_id: 841,
            level: 74,
            consumes: [{
                id: 596,
                count: 600
            }, {
                id: 291,
                count: 300
            }]
        }, {
            id: 8,
            item_id: 847,
            level: 93,
            consumes: [{
                id: 597,
                count: 500
            }, {
                id: 384,
                count: 300
            }]
        }, {
            id: 9,
            item_id: 1357,
            level: 53,
            consumes: [{
                id: 29,
                count: 300
            }, {
                id: 313,
                count: 300
            }, {
                id: 594,
                count: 300
            }]
        }, {
            id: 10,
            item_id: 2603,
            level: 103,
            consumes: [{
                id: 2129,
                count: 400
            }, {
                id: 384,
                count: 300
            }]
        }, {
            id: 11,
            item_id: 2610,
            level: 120,
            consumes: [{
                id: 2130,
                count: 150
            }, {
                id: 658,
                count: 70
            }]
        }, {
            id: 12,
            item_id: 2699,
            level: 1,
            consumes: [{
                id: 29,
                count: 150
            }, {
                id: 187,
                count: 50
            }]
        }, {
            id: 13,
            item_id: 2700,
            level: 13,
            consumes: [{
                id: 314,
                count: 250
            }, {
                id: 187,
                count: 50
            }]
        }, {
            id: 14,
            item_id: 2701,
            level: 33,
            consumes: [{
                id: 313,
                count: 400
            }, {
                id: 34,
                count: 150
            }, {
                id: 187,
                count: 50
            }]
        }, {
            id: 15,
            item_id: 2702,
            level: 42,
            consumes: [{
                id: 296,
                count: 600
            }, {
                id: 34,
                count: 350
            }, {
                id: 187,
                count: 50
            }]
        }, {
            id: 16,
            item_id: 2703,
            level: 52,
            consumes: [{
                id: 594,
                count: 500
            }, {
                id: 50,
                count: 250
            }, {
                id: 187,
                count: 80
            }]
        }, {
            id: 17,
            item_id: 2704,
            level: 62,
            consumes: [{
                id: 595,
                count: 600
            }, {
                id: 50,
                count: 350
            }, {
                id: 187,
                count: 80
            }]
        }, {
            id: 18,
            item_id: 2705,
            level: 74,
            consumes: [{
                id: 596,
                count: 600
            }, {
                id: 291,
                count: 250
            }, {
                id: 187,
                count: 100
            }]
        }, {
            id: 19,
            item_id: 2706,
            level: 93,
            consumes: [{
                id: 597,
                count: 500
            }, {
                id: 384,
                count: 250
            }, {
                id: 187,
                count: 130
            }]
        }, {
            id: 20,
            item_id: 2707,
            level: 103,
            consumes: [{
                id: 2129,
                count: 400
            }, {
                id: 384,
                count: 250
            }, {
                id: 187,
                count: 130
            }]
        }, {
            id: 21,
            item_id: 2708,
            level: 120,
            consumes: [{
                id: 2130,
                count: 150
            }, {
                id: 658,
                count: 60
            }, {
                id: 187,
                count: 150
            }]
        }],
        furniture: [{
            id: 0,
            item_id: 753,
            level: 1,
            island: !0,
            consumes: [{
                id: 287,
                count: 35
            }]
        }, {
            id: 1,
            item_id: 753,
            level: 1,
            island: !0,
            consumes: [{
                id: 288,
                count: 25
            }]
        }, {
            id: 2,
            item_id: 753,
            level: 1,
            island: !0,
            consumes: [{
                id: 289,
                count: 15
            }]
        }, {
            id: 3,
            item_id: 753,
            level: 1,
            island: !0,
            consumes: [{
                id: 290,
                count: 15
            }]
        }, {
            id: 4,
            item_id: 733,
            level: 1,
            consumes: [{
                id: 29,
                count: 20
            }]
        }, {
            id: 5,
            item_id: 735,
            level: 3,
            consumes: [{
                id: 29,
                count: 75
            }]
        }, {
            id: 6,
            item_id: 736,
            level: 10,
            consumes: [{
                id: 29,
                count: 30
            }]
        }, {
            id: 7,
            item_id: 737,
            level: 6,
            island: !0,
            consumes: [{
                id: 29,
                count: 140
            }]
        }, {
            id: 8,
            item_id: 738,
            level: 8,
            consumes: [{
                id: 29,
                count: 150
            }]
        }, {
            id: 9,
            item_id: 739,
            level: 10,
            consumes: [{
                id: 314,
                count: 20
            }]
        }, {
            id: 10,
            item_id: 741,
            level: 14,
            consumes: [{
                id: 314,
                count: 75
            }]
        }, {
            id: 11,
            item_id: 742,
            level: 25,
            consumes: [{
                id: 314,
                count: 50
            }]
        }, {
            id: 12,
            item_id: 743,
            level: 24,
            island: !0,
            consumes: [{
                id: 314,
                count: 200
            }]
        }, {
            id: 13,
            item_id: 744,
            level: 20,
            consumes: [{
                id: 314,
                count: 150
            }]
        }, {
            id: 14,
            item_id: 745,
            level: 25,
            consumes: [{
                id: 313,
                count: 20
            }]
        }, {
            id: 15,
            item_id: 747,
            level: 28,
            consumes: [{
                id: 313,
                count: 75
            }]
        }, {
            id: 16,
            item_id: 748,
            level: 35,
            consumes: [{
                id: 313,
                count: 60
            }]
        }, {
            id: 17,
            item_id: 749,
            level: 34,
            island: !0,
            consumes: [{
                id: 313,
                count: 200
            }]
        }, {
            id: 18,
            item_id: 750,
            level: 30,
            consumes: [{
                id: 313,
                count: 150
            }]
        }, {
            id: 19,
            item_id: 768,
            level: 35,
            consumes: [{
                id: 296,
                count: 30
            }]
        }, {
            id: 20,
            item_id: 769,
            level: 45,
            consumes: [{
                id: 594,
                count: 30
            }]
        }, {
            id: 21,
            item_id: 770,
            level: 55,
            consumes: [{
                id: 595,
                count: 30
            }]
        }, {
            id: 22,
            item_id: 771,
            level: 65,
            consumes: [{
                id: 596,
                count: 40
            }]
        }, {
            id: 23,
            item_id: 772,
            level: 80,
            consumes: [{
                id: 597,
                count: 50
            }]
        }, {
            id: 24,
            item_id: 826,
            level: 37,
            consumes: [{
                id: 296,
                count: 75
            }]
        }, {
            id: 25,
            item_id: 853,
            level: 40,
            consumes: [{
                id: 296,
                count: 150
            }]
        }, {
            id: 26,
            item_id: 827,
            level: 45,
            consumes: [{
                id: 296,
                count: 70
            }]
        }, {
            id: 27,
            item_id: 828,
            level: 44,
            island: !0,
            consumes: [{
                id: 296,
                count: 250
            }]
        }, {
            id: 28,
            item_id: 831,
            level: 49,
            consumes: [{
                id: 594,
                count: 105
            }]
        }, {
            id: 29,
            item_id: 832,
            level: 55,
            consumes: [{
                id: 594,
                count: 80
            }]
        }, {
            id: 30,
            item_id: 833,
            level: 54,
            island: !0,
            consumes: [{
                id: 594,
                count: 300
            }]
        }, {
            id: 31,
            item_id: 834,
            level: 50,
            consumes: [{
                id: 594,
                count: 210
            }]
        }, {
            id: 32,
            item_id: 837,
            level: 58,
            consumes: [{
                id: 595,
                count: 105
            }]
        }, {
            id: 33,
            item_id: 840,
            level: 60,
            consumes: [{
                id: 595,
                count: 210
            }]
        }, {
            id: 34,
            item_id: 839,
            level: 64,
            island: !0,
            consumes: [{
                id: 595,
                count: 400
            }]
        }, {
            id: 35,
            item_id: 838,
            level: 65,
            consumes: [{
                id: 595,
                count: 90
            }]
        }, {
            id: 36,
            item_id: 843,
            level: 70,
            consumes: [{
                id: 596,
                count: 150
            }]
        }, {
            id: 37,
            item_id: 844,
            level: 80,
            consumes: [{
                id: 596,
                count: 100
            }]
        }, {
            id: 38,
            item_id: 845,
            level: 78,
            island: !0,
            consumes: [{
                id: 596,
                count: 500
            }]
        }, {
            id: 39,
            item_id: 846,
            level: 70,
            consumes: [{
                id: 596,
                count: 300
            }]
        }, {
            id: 40,
            item_id: 849,
            level: 83,
            consumes: [{
                id: 597,
                count: 180
            }]
        }, {
            id: 41,
            item_id: 850,
            level: 95,
            consumes: [{
                id: 597,
                count: 120
            }]
        }, {
            id: 42,
            item_id: 851,
            level: 98,
            island: !0,
            consumes: [{
                id: 597,
                count: 800
            }]
        }, {
            id: 43,
            item_id: 852,
            level: 90,
            consumes: [{
                id: 597,
                count: 360
            }]
        }, {
            id: 44,
            item_id: 1129,
            level: 1
        }, {
            id: 45,
            item_id: 1130,
            level: 1
        }, {
            id: 46,
            item_id: 1131,
            level: 1,
            consumes: [{
                id: 31,
                count: 250
            }, {
                id: 1138,
                count: 1
            }]
        }, {
            id: 47,
            item_id: 1132,
            level: 1
        }, {
            id: 48,
            item_id: 1133,
            level: 1
        }, {
            id: 49,
            item_id: 1134,
            level: 1
        }, {
            id: 50,
            item_id: 1135,
            level: 1
        }, {
            id: 51,
            item_id: 1136,
            level: 1
        }, {
            id: 52,
            item_id: 1137,
            level: 1
        }, {
            id: 53,
            item_id: 1165,
            level: 1,
            consumes: [{
                id: 1014,
                count: 10
            }, {
                id: 50,
                count: 50
            }]
        }, {
            id: 54,
            item_id: 1165,
            level: 1,
            consumes: [{
                id: 1012,
                count: 30
            }, {
                id: 50,
                count: 50
            }]
        }, {
            id: 55,
            item_id: 1243,
            level: 50,
            island: !0,
            consumes: [{
                id: 29,
                count: 300
            }, {
                id: 758,
                count: 100
            }, {
                id: 760,
                count: 100
            }]
        }, {
            id: 56,
            item_id: 1360,
            level: 48,
            island: !0,
            consumes: [{
                id: 594,
                count: 50
            }, {
                id: 50,
                count: 100
            }]
        }, {
            id: 57,
            item_id: 2027,
            level: 65,
            island: !0,
            consumes: [{
                id: 594,
                count: 500
            }, {
                id: 50,
                count: 180
            }, {
                id: 34,
                count: 1E3
            }]
        }, {
            id: 58,
            item_id: 1771,
            level: 30,
            island: !0,
            consumes: [{
                id: 1425,
                count: 20
            }]
        }, {
            id: 59,
            item_id: 1772,
            level: 45,
            island: !0,
            consumes: [{
                id: 1426,
                count: 20
            }]
        }, {
            id: 60,
            item_id: 1773,
            level: 70,
            island: !0,
            consumes: [{
                id: 1427,
                count: 20
            }]
        }, {
            id: 61,
            item_id: 1774,
            level: 80,
            island: !0,
            consumes: [{
                id: 1428,
                count: 20
            }]
        }, {
            id: 62,
            item_id: 1775,
            level: 90,
            island: !0,
            consumes: [{
                id: 1429,
                count: 20
            }]
        }, {
            id: 63,
            item_id: 1776,
            level: 95,
            island: !0,
            consumes: [{
                id: 1430,
                count: 20
            }]
        }, {
            id: 64,
            item_id: 1777,
            level: 105,
            island: !0,
            consumes: [{
                id: 1431,
                count: 20
            }]
        }, {
            id: 65,
            item_id: 1778,
            level: 110,
            island: !0,
            consumes: [{
                id: 1432,
                count: 20
            }]
        }, {
            id: 66,
            item_id: 1779,
            level: 1
        }, {
            id: 67,
            item_id: 2600,
            level: 90,
            island: !0,
            consumes: [{
                id: 2129,
                count: 50
            }]
        }, {
            id: 68,
            item_id: 2602,
            level: 93,
            island: !0,
            consumes: [{
                id: 2129,
                count: 180
            }]
        }, {
            id: 69,
            item_id: 2604,
            level: 108,
            island: !0,
            consumes: [{
                id: 2129,
                count: 600
            }]
        }, {
            id: 70,
            item_id: 2605,
            level: 100,
            island: !0,
            consumes: [{
                id: 2129,
                count: 360
            }]
        }, {
            id: 71,
            item_id: 2606,
            level: 105,
            island: !0,
            consumes: [{
                id: 2129,
                count: 120
            }]
        }, {
            id: 72,
            item_id: 2607,
            level: 100,
            island: !0,
            consumes: [{
                id: 2130,
                count: 50
            }]
        }, {
            id: 73,
            item_id: 2609,
            level: 113,
            island: !0,
            consumes: [{
                id: 2130,
                count: 100
            }]
        }, {
            id: 74,
            item_id: 2611,
            level: 118,
            island: !0,
            consumes: [{
                id: 2130,
                count: 500
            }]
        }, {
            id: 75,
            item_id: 2612,
            level: 110,
            island: !0,
            consumes: [{
                id: 2130,
                count: 300
            }]
        }, {
            id: 76,
            item_id: 2613,
            level: 115,
            island: !0,
            consumes: [{
                id: 2130,
                count: 120
            }]
        }, {
            id: 77,
            item_id: 2614,
            level: 1
        }, {
            id: 78,
            item_id: 2615,
            level: 1
        }, {
            id: 79,
            item_id: 2616,
            level: 1
        }, {
            id: 80,
            item_id: 2617,
            level: 1
        }, {
            id: 81,
            item_id: 2618,
            level: 1
        }, {
            id: 82,
            item_id: 2619,
            level: 1
        }, {
            id: 83,
            item_id: 2620,
            level: 1
        }, {
            id: 84,
            item_id: 2621,
            level: 1
        }, {
            id: 85,
            item_id: 2622,
            level: 1
        }, {
            id: 86,
            item_id: 2623,
            level: 1
        }, {
            id: 87,
            item_id: 2624,
            level: 1
        }, {
            id: 88,
            item_id: 2625,
            level: 1
        }, {
            id: 89,
            item_id: 2626,
            level: 1
        }, {
            id: 90,
            item_id: 2627,
            level: 1
        }, {
            id: 91,
            item_id: 2628,
            level: 1
        }, {
            id: 92,
            item_id: 2629,
            level: 1
        }, {
            id: 93,
            item_id: 2630,
            level: 1
        }, {
            id: 94,
            item_id: 2631,
            level: 1
        }, {
            id: 95,
            item_id: 2632,
            level: 1
        }, {
            id: 96,
            item_id: 2633,
            level: 1
        }, {
            id: 97,
            item_id: 2634,
            level: 1
        }, {
            id: 98,
            item_id: 2635,
            level: 1
        }, {
            id: 99,
            item_id: 2636,
            level: 1
        }, {
            id: 100,
            item_id: 2626,
            level: 1
        }, {
            id: 101,
            item_id: 2637,
            level: 1
        }, {
            id: 102,
            item_id: 2638,
            level: 1
        }, {
            id: 103,
            item_id: 2639,
            level: 1
        }]
    },
    CARPENTRY_MATERIAL_XP = {
        29: .1,
        314: 1,
        313: 1.5,
        296: 5,
        187: 1.5,
        34: 3,
        288: 2,
        287: 1.5,
        289: 2.5,
        290: 3.5,
        594: 10,
        595: 18,
        596: 25,
        597: 35,
        50: 6,
        31: 3,
        291: 10,
        384: 15,
        1014: 25,
        1425: 20,
        1426: 25,
        1427: 30,
        1428: 35,
        1429: 40,
        1430: 45,
        1431: 50,
        1432: 55,
        2129: 40,
        2130: 45,
        658: 25
    },
    type;
for (type in CARPENTRY_FORMULAS)
    for (var id in CARPENTRY_FORMULAS[type]) {
        var formula = CARPENTRY_FORMULAS[type][id],
            item = item_base[formula.item_id];
        formula.craftable = !0;
        "undefined" == typeof formula.consumes && (formula.craftable = !1);
        "floors" == type ? (ground_base[item.params.carpentry_id].params = ground_base[item.params.carpentry_id].params || {}, ground_base[item.params.carpentry_id].params.carpentry_item_id = formula.item_id) : (object_base[item.params.carpentry_id].params = object_base[item.params.carpentry_id].params || {}, object_base[item.params.carpentry_id].params.carpentry_item_id = formula.item_id)
    }
var Farming = {
        plant_rotten: function(a) {
            var b = 0;
            a && a.params && a.params.secondstamp ? b = a.params.secondstamp : a && a.t && (b = a.t);
            return 604800 < secondsPastDelta(b) ? !0 : !1
        },
        plant_ripe: function(a) {
            return 0 >= a.base().params.duration - minutesPastDelta(a.params.secondstamp) ? !0 : !1
        },
        next_action: function(a) {
            var b = Farming.plant_rotten(a);
            a = Farming.plant_ripe(a);
            var d = Inventory.get_watering_can_id(players[0]);
            Inventory.has_equipped(players[0], 2807);
            return b && d ? {
                    action: "Water"
                } : b && !d ? {
                    action: "Harvest",
                    error: "need_watering_can"
                } :
                !a && d ? {
                    action: "Water"
                } : {
                    action: "Harvest"
                }
        }
    },
    Contacts = {
        friends: [],
        ignores: [],
        channels: {},
        list_add: function(a, b) {
            "ignores" == a ? (Contacts.ignores.push(b), Contacts.ignores = ArrayHelper.unique2(Contacts.ignores)) : Contacts.are_friends(b) || Contacts.friends.push({
                name: b,
                online: !1,
                world: _ti("Offline"),
                friend: !0
            })
        },
        list_remove: function(a, b) {
            if ("ignores" == a) {
                var d = Contacts.ignores.indexOf(b); - 1 < d && Contacts.ignores.splice(d, 1)
            } else
                for (d in Contacts.friends)
                    if (Contacts.friends[d] && Contacts.friends[d].name == b) {
                        Contacts.friends.splice(d,
                            1);
                        break
                    }
        },
        merge_kongregate_friends: function(a, b) {
            var d = [],
                e;
            for (e in a) "friends" == a[e].status && d.push(a[e].with_player);
            for (e in b) d.push(b[e].usernamify());
            d = ArrayHelper.unique2(d);
            for (e in d) d[e] = {
                status: "friends",
                with_player: d[e]
            };
            return d
        },
        toggle: function() {
            if (GAME_STATE == GAME_STATES.GAME || GAME_STATE == GAME_STATES.CHAT) FormHelper.is_form_visible("contacts") ? FormHelper.hide_form("contacts") : (FormHelper.get_form("contacts"), Contacts.show_friends())
        },
        show_friends: function() {
            if (FormHelper.is_form_visible("contacts")) {
                for (var a in Contacts.friends) Contacts.friends[a] &&
                    (Contacts.friends[a].online = online_players[Contacts.friends[a].name] || !1, Contacts.friends[a].world = online_players[Contacts.friends[a].name] ? _ti("World") + " " + online_players[Contacts.friends[a].name] : _ti("Offline"));
                document.getElementById("contacts_form_content").innerHTML = HandlebarTemplate.contacts_friends()(Contacts.friends);
                TableSorter.init(document.getElementById("contacts_friends"))
            }
        },
        are_friends: function(a) {
            for (var b in Contacts.friends)
                if (Contacts.friends[b].name == a) return !0;
            return !1
        },
        is_ignored: function(a) {
            return 0 <=
                Contacts.ignores.indexOf(a) ? !0 : !1
        },
        show_ignore: function() {
            FormHelper.is_form_visible("contacts") && (document.getElementById("contacts_form_content").innerHTML = HandlebarTemplate.contacts_ignore()(Contacts.ignores), TableSorter.init(document.getElementById("contacts_ignores")))
        },
        update_channel_list: function() {
            var a = document.getElementById("current_channel"),
                b = a.selectedIndex,
                d = a.value;
            a.innerHTML = "";
            channel_names = ArrayHelper.unique2(channel_names);
            sortChannels(channel_names);
            a.style.visibility = "visible";
            for (var e = !1, f = 0; f < channel_names.length; f++) Chat.tab_settings[Chat.tab].channels[channel_names[f]] && (e = new Option(channel_names[f], channel_names[f]), e.style.color = CHANNEL_COLOR[channel_names[f]] || CHANNEL_COLOR["default"], a.appendChild(e), e = !0);
            d && Chat.tab_settings[Chat.tab].channels[d] ? (a.value = d, Chat.channel_color()) : Chat.update_channel_selection(b);
            e || (a.style.visibility = "hidden")
        },
        show_channels: function() {
            Contacts.update_channel_list();
            FormHelper.is_form_visible("filters") && (document.getElementById("filters_form_content").innerHTML =
                HandlebarTemplate.contacts_channels()(channel_names), TableSorter.init(document.getElementById("contacts_channels")))
        },
        can_join_channel: function(a) {
            return "18" == a && 18 > Player.age ? (Player.request_more_info(), document.getElementById("filters_form").style.display = "none", !1) : !0
        },
        add_channel: function(a) {
            Contacts.can_join_channel(a) && (Contacts.channels[a] || (Socket.send("contacts", {
                sub: "add_channel",
                channel: a
            }), Contacts.channels[a] = !0), Chat.tab_settings[Chat.tab].channels[a] = !0, Chat.tabs_server_sync(), Contacts.show_channels())
        },
        remove_channel: function(a, b) {
            delete Chat.tab_settings[Chat.tab].channels[a];
            b || Contacts.show_channels();
            for (var d = 0; d < Chat.tab_settings.length; d++)
                if (Chat.tab_settings[d].channels[a]) return;
            Socket.send("contacts", {
                sub: "remove_channel",
                channel: a
            });
            delete Contacts.channels[a];
            Chat.tabs_server_sync()
        },
        new_channels: [],
        save_channel: function(a) {
            Contacts.new_channels.push(a);
            var b = !1;
            Contacts.channels[a] || (b = !0);
            Contacts.clean_channels();
            Contacts.channels[a] || (Contacts.channels[a] = !0, channel_names.unshift(a),
                Chat.tab_settings[Chat.tab].channels[a] = !0, Contacts.show_channels(), Chat.tabs_server_sync(), b && (document.getElementById("current_channel").value = a, Chat.changed_channel()))
        },
        private_channels: {},
        save_private_channel: function(a, b, d) {
            0 != d && (Contacts.channels[a] = !0); - 1 == channel_names.indexOf(a) && channel_names.push(a);
            channel_descriptions[a] = b;
            Contacts.private_channels[a] = BitSet.fromDecimalString(d);
            if ("Invited" != Contacts.permissions_name(d)) {
                b = !1;
                for (d = 0; d < Chat.tab_settings.length; d++)
                    if (Chat.tab_settings[d].channels[a]) {
                        b = !0;
                        break
                    }
                b || (Chat.tab_settings[Chat.tab].channels[a] = !0, Chat.tabs_server_sync())
            }
        },
        create_private_channel: function() {
            if (!Player.has_premium(players[0].temp.premium_until)) return Popup.dialog(_te("You need to have an active premium to do that. You can buy it by typing to chat /premium"), null_function);
            Popup.input_prompt("Channel name (1-3 symbols)", function(a) {
                Socket.send("contacts", {
                    sub: "create_private_channel",
                    channel: a
                })
            }, void 0, function(a) {
                return a.sanitizeLang()
            })
        },
        owns_private_channel: function() {
            for (var a in Contacts.private_channels)
                if (Contacts.channel_permissions(a,
                        "owner")) return !0;
            return !1
        },
        join_private_channel: function(a) {
            Chat.tab_settings[Chat.tab].channels[a] = !0;
            Contacts.channel_permissions(a, "invited") && (Contacts.channels[a] = !0, Contacts.private_channels[a].set(0, 1), Socket.send("contacts", {
                sub: "join_private_channel",
                channel: a
            }));
            Contacts.show_channels();
            Chat.tabs_server_sync()
        },
        leave_private_channel: function(a) {
            Contacts.channel_permissions(a, "joined_non_owner") && (delete Chat.tab_settings[Chat.tab].channels[a], Chat.tabs_server_sync(), Popup.prompt(_ti("Are you sure?"),
                function() {
                    Contacts.cleanup_private_channel(a);
                    Socket.send("contacts", {
                        sub: "leave_private_channel",
                        channel: a
                    });
                    Contacts.show_channels()
                }, null_function))
        },
        show_members_request: function(a) {
            Contacts.channel_permissions(a, "joined") && Socket.send("contacts", {
                sub: "private_channel_members",
                channel: a
            })
        },
        remove_private_channel_member: function(a, b) {
            Contacts.channel_permissions(a, "member_moderator") && Popup.prompt(_ti("Remove member?"), function() {
                Socket.send("contacts", {
                    sub: "remove_private_channel_member",
                    channel: a,
                    player: b
                });
                setTimeout(function() {
                    Contacts.show_members_request(a)
                }, 50)
            }, null_function)
        },
        last_private_channel: "",
        invite_private_channel_member: function(a) {
            var b = Contacts.last_private_channel;
            Contacts.channel_permissions(b, "member_moderator") && (Socket.send("contacts", {
                sub: "invite_private_channel_member",
                channel: b,
                player: a
            }), setTimeout(function() {
                Contacts.show_members_request(b)
            }, 50))
        },
        reset_private_channels: function() {
            for (var a in Contacts.private_channels) Contacts.cleanup_private_channel(a)
        },
        cleanup_private_channel: function(a) {
            delete Contacts.channels[a];
            var b = channel_names.indexOf(a); - 1 < b && channel_names.splice(b, 1);
            delete channel_descriptions[a];
            delete Contacts.private_channels[a];
            for (b = 0; b < Chat.tab_settings.length; b++) delete Chat.tab_settings[b].channels[a];
            Chat.tabs_server_sync()
        },
        change_permission_private_channel: function(a, b) {
            var d = document.getElementById("private_channel_" + a + "_" + b).value;
            Socket.send("contacts", {
                sub: "set_permissions_private_channel_member",
                channel: b,
                player: a,
                permission: d
            });
            setTimeout(function() {
                    Contacts.show_members_request(b)
                },
                50)
        },
        destroy_private_channel: function(a) {
            Contacts.channel_permissions(a, "owner") && (delete Chat.tab_settings[Chat.tab].channels[a], Chat.tabs_server_sync(), Popup.prompt(_ti("Destroy channel?"), function() {
                Contacts.cleanup_private_channel(a);
                Socket.send("contacts", {
                    sub: "destroy_private_channel",
                    channel: a
                });
                Contacts.show_channels()
            }, null_function))
        },
        delete_channel: function(a) {
            if (Contacts.channels[a]) {
                delete Contacts.channels[a];
                var b = channel_names.indexOf(a); - 1 < b && channel_names.splice(b, 1);
                for (b = 0; b < Chat.tab_settings.length; b++) Chat.tab_settings[b].channels[a] &&
                    delete Chat.tab_settings[b].channels[a];
                Chat.tabs_server_sync();
                Contacts.show_channels()
            }
        },
        clean_channels: function() {
            for (var a in Contacts.new_channels) Contacts.delete_channel(Contacts.new_channels[a])
        },
        add_friend: function(a) {
            a = a.toLowerCase();
            Socket.send("contacts", {
                sub: "add_friend",
                name: a.username()
            });
            Contacts.list_add("friends", a.username());
            Contacts.show_friends()
        },
        remove_friend: function(a, b) {
            var d = function() {
                Socket.send("contacts", {
                    sub: "remove_friend",
                    name: a.username()
                });
                Contacts.list_remove("friends",
                    a.username());
                Contacts.show_friends()
            };
            if (b) return d();
            Popup.prompt(_ti("Remove friend?"), function() {
                d()
            })
        },
        reject_friend: function(a) {
            Contacts.list_remove("friends", a.username());
            Contacts.show_friends()
        },
        ignore_player: function(a) {
            a = a.toLowerCase();
            Player.has_lower_permissions(a) ? addChatText(_te("Cannot ignore a moderator or an admin."), null, COLOR.PINK) : (Socket.send("contacts", {
                sub: "ignore_player",
                name: a.username()
            }), Contacts.list_add("ignores", a.username()), Contacts.show_ignore())
        },
        remove_ignore: function(a,
            b) {
            var d = function() {
                Socket.send("contacts", {
                    sub: "remove_ignore",
                    name: a.username()
                });
                Contacts.list_remove("ignores", a.username());
                Contacts.show_ignore()
            };
            if (b) return d();
            Popup.prompt(_ti("Remove ignore?"), function() {
                d()
            })
        },
        channel_permissions: function(a, b) {
            return Contacts.private_channels[a] ? Contacts.has_channel_permission(Contacts.private_channels[a], b) : !1
        },
        has_channel_permission: function(a, b) {
            if (!a) return !1;
            switch (b) {
                case "invited":
                    return 0 == a.toString(10);
                case "joined":
                    return 0 != a.toString(10);
                case "joined_non_owner":
                    return 0 != a.toString(10) && !a.get(3);
                case "chat_moderator":
                    return !!a.get(1) || !!a.get(3) || !1;
                case "member_moderator":
                    return !!a.get(2) || !!a.get(3) || !1;
                case "owner":
                    return !!a.get(3) || !1
            }
        },
        has_decimal_channel_permission: function(a, b) {
            var d = BitSet.fromDecimalString(a);
            return Contacts.has_channel_permission(d, b)
        },
        permissions_name: function(a) {
            a = BitSet.fromDecimalString(a);
            return a.get(3) ? "Owner" : a.get(2) ? "List moderator" : a.get(1) ? "Chat moderator" : a.get(0) ? "Member" : "Invited"
        }
    },
    Music = {
        initialized: !1,
        music_allowed: !1,
        sfx_allowed: !0,
        playing: -1,
        type: ".mp3",
        init: function() {
            if (0 <= ["desura", "torrent", "steam"].indexOf(getParameterByName("inapp")) || 1 <= getParameterByName("node-webkit-api")) Music.type = ".ogg";
            for (var a in map_music_files) map_music_files[a].file += Music.type;
            for (a in sound_effect_files) sound_effect_files[a] += Music.type;
            "undefined" != typeof localStorage.music_allowed ? Music.music_allowed = JSON.parse(localStorage.music_allowed) : getParameterByName("music") && (Music.music_allowed = !0);
            "undefined" != typeof localStorage.sfx_allowed && (Music.sfx_allowed = JSON.parse(localStorage.sfx_allowed));
            soundManager.setup({
                url: "swf/",
                debugMode: !1,
                debugFlash: !1,
                preferFlash: !1,
                onready: function() {
                    Music.initialized = !0
                }
            });
            Music.toggle(!0);
            Music.toggle_sfx(!0)
        },
        toggle: function(a) {
            a || (Music.music_allowed = !Music.music_allowed, (localStorage.music_allowed = Music.music_allowed) ? (Music.playing = -1, Music.play(players[0].map), _gaq.push(["_trackPageview", "/music_on"])) : (Music.stop(), _gaq.push(["_trackPageview",
                "/music_off"
            ])));
            massAssignText([{
                name: "settings_music_value",
                text: Music.music_allowed ? "on" : "off",
                translate: _ti
            }])
        },
        toggle_sfx: function(a) {
            a || (Music.sfx_allowed = !Music.sfx_allowed, (localStorage.sfx_allowed = Music.sfx_allowed) ? _gaq.push(["_trackPageview", "/sfx_on"]) : _gaq.push(["_trackPageview", "/sfx_off"]));
            massAssignText([{
                name: "settings_sfx_value",
                text: Music.sfx_allowed ? "on" : "off",
                translate: _ti
            }])
        },
        allowed: function() {
            return Music.music_allowed ? Music.initialized ? !0 : (Music.init(), !1) : !1
        },
        play: function(a,
            b) {
            if (!Music.allowed() || Music.playing == a && 1 != b) return !1;
            soundManager.stopAll();
            if (SpectateWindow.slave && SpectateWindow.active) return !1;
            Music.playing = a;
            if ("undefined" == typeof map_music_files[a]) return !1;
            map_music[a] ? map_music[a].loaded && map_music[a].music.play() : Music.load(a)
        },
        sound_effect: function(a) {
            if (!Music.sfx_allowed) return !1;
            if (!Music.initialized) return Music.init(), !1;
            if (SpectateWindow.slave && SpectateWindow.active) return !1;
            if ("undefined" == typeof sound_effect_files[a]) return console.log("Invalid sound effect",
                a), !1;
            sound_effects[a] || Music.load_sfx(a, !0);
            5E3 < timestamp() - sound_effects[a].started_playing && (sound_effects[a].playing = !1);
            if (sound_effects[a].playing) return !1;
            sound_effects[a].loaded && (sound_effects[a].playing = !0, sound_effects[a].started_playing = timestamp(), sound_effects[a].music.play())
        },
        get_url_host: function(a) {
            var b = getParameterByName("music");
            "included" == b && (b = 1);
            return b && b >= a ? (require("path"), "file://" + process.cwd() + "/music/") : "https://music.mo.ee/"
        },
        load: function(a) {
            map_music[a] = {};
            map_music[a].loaded = !1;
            map_music[a].music = soundManager.createSound({
                id: "level" + a,
                url: Music.get_url_host(map_music_files[a].pack) + map_music_files[a].file,
                autoLoad: !0,
                autoPlay: !0,
                onload: function() {
                    map_music[a].loaded = !0
                },
                onfinish: function() {
                    Music.play(a, !0)
                },
                volume: 50
            })
        },
        load_sfx: function(a, b) {
            sound_effects[a] && sound_effects[a].loaded || (sound_effects[a] = {}, sound_effects[a].loaded = !1, sound_effects[a].music = soundManager.createSound({
                id: "sfx" + a,
                url: "https://music.mo.ee/sfx/" + sound_effect_files[a],
                autoLoad: !0,
                autoPlay: b ||
                    !1,
                onload: function() {
                    sound_effects[a].loaded = !0;
                    sound_effects[a].started_playing = 0;
                    sound_effects[a].playing = !1
                },
                onfinish: function() {
                    sound_effects[a].started_playing = 0;
                    sound_effects[a].playing = !1
                },
                volume: 25
            }))
        },
        preload_sfx: function() {
            if (Music.sfx_allowed && -1 == ["android"].indexOf(getParameterByName("inapp")))
                for (var a in sound_effect_files) Music.load_sfx(a)
        },
        pauseAll: function() {
            soundManager.pauseAll()
        },
        resumeAll: function() {
            soundManager.resumeAll()
        },
        stop: function() {
            soundManager.stopAll()
        },
        use_item: function(a) {
            var b =
                item_base[a];
            if (0 <= [304, 305, 306, 307, 308, 309, 310, 311, 312, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 401, 795, 796, 1023, 1024, 1033, 1081, 1367, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420, 2491, 2492, 2493, 2494, 2495].indexOf(parseInt(a))) return Music.sound_effect("drink");
            if (b.b_t == ITEM_CATEGORY.FOOD) return Music.sound_effect("eat");
            if (0 <= [194, 196, 198, 200, 385, 387, 389, 297, 1300, 1900, 1901, 1902, 1903, 1904, 1905,
                    1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 2696, 2697, 2698
                ].indexOf(parseInt(a))) return Music.sound_effect("cut_gem")
        },
        use_object: function(a) {}
    },
    Quests = {
        last_opened: "active",
        toggle: function() {
            if (GAME_STATE == GAME_STATES.GAME || GAME_STATE == GAME_STATES.CHAT) FormHelper.is_form_visible("quests") ? FormHelper.hide_form("quests") : (FormHelper.get_form("quests"), Quests.show_types())
        },
        show_types: function() {
            Quests.last_opened = "types";
            document.getElementById("quests_form_content").innerHTML =
                HandlebarTemplate.quest_types()()
        },
        active_quests: function() {
            for (var a = [], b = 0; b < player_quests.length; b++) player_quests[b].progress < quests[b].amount && a.push(JSON.merge(quests[b], player_quests[b]));
            return a
        },
        show_active: function() {
            Quests.last_opened = "active";
            var a = Quests.active_quests();
            document.getElementById("quests_form_content").innerHTML = HandlebarTemplate.quests_active()(a);
            Toolbar.update_quest()
        },
        show_completed: function() {
            Quests.last_opened = "completed";
            for (var a = [], b = 0; b < player_quests.length; b++) player_quests[b].progress ==
                quests[b].amount && a.push(JSON.merge(quests[b], player_quests[b]));
            document.getElementById("quests_form_content").innerHTML = HandlebarTemplate.quests_completed()(a)
        },
        show_reward: function(a, b) {
            switch (b) {
                case 0:
                    return quests[a].reward[0] + " " + _ti("experience");
                case 1:
                    return quests[a].reward[1] + " " + _ti("coins");
                case 2:
                    return quests[a].reward[2] + " MOS"
            }
        },
        restart: function(a) {
            players[0].temp.busy ? addChatText(_te("Cannot do that yet"), void 0, COLOR.PINK) : 0 < Inventory.get_item_count(players[0], 1031) ? (Socket.send("reset_quest", {
                quest_id: a
            }), player_quests[a].progress = 0, Quests.show_active()) : addChatText(_te("You need a '{item_name}' to do that", {
                item_name: item_base[1031].name
            }), void 0, COLOR.PINK)
        },
        refresh: function() {
            if (FormHelper.is_form_visible("quests")) switch (Quests.last_opened) {
                case "show_types":
                    Quests.show_types();
                    break;
                case "active":
                    Quests.show_active();
                    break;
                case "completed":
                    Quests.show_completed()
            }
            Toolbar.update_quest()
        }
    },
    quests = [{
        id: 0,
        name: "Journey Begins",
        type: 0,
        npc_id: 1,
        amount: 5,
        location: "Tutorial Island, Dorpat",
        reward: [15, 49, 1]
    }, {
        id: 1,
        name: "Poultry Slaughtering",
        type: 0,
        npc_id: 101,
        amount: 20,
        location: "Dorpat",
        reward: [20, 65, 1]
    }, {
        id: 2,
        name: "Slay Greybeards",
        type: 0,
        npc_id: 0,
        amount: 15,
        location: "Dorpat",
        reward: [30, 98, 1]
    }, {
        id: 3,
        name: "Need Some Meat",
        type: 0,
        npc_id: 102,
        amount: 20,
        location: "Dorpat",
        reward: [32, 105, 1]
    }, {
        id: 4,
        name: "Wizards Gaining Skill",
        type: 0,
        npc_id: 3,
        amount: 20,
        location: "Dorpat",
        reward: [68, 223, 1]
    }, {
        id: 5,
        name: "Have Some Shroom",
        type: 0,
        npc_id: 32,
        amount: 25,
        location: "Whiland",
        reward: [70, 230, 1]
    }, {
        id: 6,
        name: "Learn To Hunt",
        type: 0,
        npc_id: 103,
        amount: 20,
        location: "Whiland",
        reward: [90, 295, 1]
    }, {
        id: 7,
        name: "Orcs Invasion Part 1",
        type: 0,
        npc_id: 4,
        amount: 25,
        location: "Dorpat",
        reward: [125, 411, 1]
    }, {
        id: 8,
        name: "Orcs Invasion Part 2",
        type: 0,
        npc_id: 13,
        amount: 24,
        location: "Dorpat",
        reward: [144, 472, 1]
    }, {
        id: 9,
        name: "Mining Some Golems Part 1",
        type: 0,
        npc_id: 60,
        amount: 27,
        location: "Rakblood",
        reward: [183, 603, 2]
    }, {
        id: 10,
        name: "Ghostbuster",
        type: 0,
        npc_id: 9,
        amount: 30,
        location: "Walco",
        reward: [186, 611, 2]
    }, {
        id: 11,
        name: "Too Many Bears",
        type: 0,
        npc_id: 104,
        amount: 30,
        location: "Whiland",
        reward: [228, 749, 2]
    }, {
        id: 12,
        name: "Explore Explorers",
        type: 0,
        npc_id: 187,
        amount: 35,
        location: "Rakblood",
        reward: [266, 874, 2]
    }, {
        id: 13,
        name: "Small Ones Can Burn",
        type: 0,
        npc_id: 47,
        amount: 40,
        location: "Reval",
        reward: [364, 1200, 2]
    }, {
        id: 14,
        name: "Twilight",
        type: 0,
        npc_id: 11,
        amount: 40,
        location: "Dungeon",
        reward: [422, 1388, 2]
    }, {
        id: 15,
        name: "Shadow Land",
        type: 0,
        npc_id: 134,
        amount: 50,
        location: "Walco",
        reward: [540, 1755, 2]
    }, {
        id: 16,
        name: "Mining Some Golems Part 2",
        type: 0,
        npc_id: 62,
        amount: 50,
        location: "Rakblood",
        reward: [624, 2501, 2]
    }, {
        id: 17,
        name: "Undead Domination",
        type: 0,
        npc_id: 135,
        amount: 65,
        location: "Walco",
        reward: [702, 2308, 2]
    }, {
        id: 18,
        name: "What Animal Is That",
        type: 0,
        npc_id: 16,
        amount: 70,
        location: "Dungeon",
        reward: [907, 2983, 2]
    }, {
        id: 19,
        name: "World Is Weird",
        type: 0,
        npc_id: 199,
        amount: 70,
        location: "Dungeon",
        reward: [1042, 3424, 2]
    }, {
        id: 20,
        name: "Go Fishing",
        type: 0,
        npc_id: 49,
        amount: 100,
        location: "Blood River",
        reward: [1152, 3788, 2]
    }, {
        id: 21,
        name: "Dont Look Into The Eyes",
        type: 0,
        npc_id: 109,
        amount: 85,
        location: "Cesis",
        reward: [1183,
            3890, 2
        ]
    }, {
        id: 22,
        name: "More Than 100 Legs",
        type: 0,
        npc_id: 157,
        amount: 90,
        location: "Pernau",
        reward: [1620, 5326, 3]
    }, {
        id: 23,
        name: "Angels Deserve To Die",
        type: 0,
        npc_id: 18,
        amount: 120,
        location: "Clouds",
        reward: [1987, 6534, 3]
    }, {
        id: 24,
        name: "Floating Eyes",
        type: 0,
        npc_id: 114,
        amount: 200,
        location: "Clouds",
        reward: [2592, 8523, 3]
    }, {
        id: 25,
        name: "Some Strong Hits",
        type: 0,
        npc_id: 200,
        amount: 200,
        location: "Dungeon",
        reward: [3840, 12626, 3]
    }, {
        id: 26,
        name: "There Is A Boss",
        type: 0,
        npc_id: 124,
        amount: 10,
        location: "Reval",
        reward: [5500,
            18085, 4
        ]
    }, {
        id: 27,
        name: "Need Some Fire",
        type: 0,
        npc_id: 71,
        amount: 250,
        location: "Narwa",
        reward: [5320, 17493, 3]
    }, {
        id: 28,
        name: "Two Head, Still Dead",
        type: 0,
        npc_id: 115,
        amount: 250,
        location: "Clouds",
        reward: [5740, 18874, 3]
    }, {
        id: 29,
        name: "World Is Alive",
        type: 0,
        npc_id: 64,
        amount: 250,
        location: "Rakblood",
        reward: [6440, 21176, 3]
    }, {
        id: 30,
        name: "Big Cat",
        type: 0,
        npc_id: 190,
        amount: 300,
        location: "Pernau",
        reward: [7560, 24858, 3]
    }, {
        id: 31,
        name: "Wow, Shiny",
        type: 0,
        npc_id: 27,
        amount: 250,
        location: "Blood River",
        reward: [7700, 25319, 3]
    }, {
        id: 32,
        name: "Crystals Are Alive",
        type: 0,
        npc_id: 126,
        amount: 250,
        location: "Cesis",
        reward: [8400, 27620, 3]
    }, {
        id: 33,
        name: "Merged Elements",
        type: 0,
        npc_id: 74,
        amount: 270,
        location: "Narwa",
        reward: [9072, 29830, 3]
    }, {
        id: 34,
        name: "Ice Ice Baby",
        type: 0,
        npc_id: 54,
        amount: 300,
        location: "Narwa",
        reward: [9240, 30382, 3]
    }, {
        id: 35,
        name: "Wish I Could Use A Pickaxe",
        type: 0,
        npc_id: 184,
        amount: 250,
        location: "Hell",
        reward: [9750, 32059, 3]
    }, {
        id: 36,
        name: "Like Fire",
        type: 0,
        npc_id: 88,
        amount: 250,
        location: "Hell",
        reward: [10200, 33539, 4]
    }, {
        id: 37,
        name: "One Hit, Two Deaths",
        type: 0,
        npc_id: 172,
        amount: 250,
        location: "Pernau",
        reward: [10500, 34526, 4]
    }, {
        id: 38,
        name: "Satan's Job",
        type: 0,
        npc_id: 105,
        amount: 250,
        location: "Heaven",
        reward: [16500, 54255, 4]
    }, {
        id: 39,
        name: "Must Be High",
        type: 0,
        npc_id: 245,
        amount: 320,
        location: "Heaven",
        reward: [17280, 56820, 4]
    }, {
        id: 40,
        name: "Like A Rainbow",
        type: 0,
        npc_id: 75,
        amount: 350,
        location: "Narwa",
        reward: [16800, 72041, 4]
    }, {
        id: 41,
        name: "Battle Of Gods",
        type: 0,
        npc_id: 99,
        amount: 300,
        location: "Heaven",
        reward: [18E3, 59187, 4]
    }, {
        id: 42,
        name: "No Turning Back",
        type: 0,
        npc_id: 251,
        amount: 250,
        location: "Dragon's Lair",
        reward: [18750, 61653, 4]
    }, {
        id: 43,
        name: "Death Through Metal",
        type: 0,
        npc_id: 252,
        amount: 300,
        location: "Dragon's Lair",
        reward: [22500, 73984, 4]
    }, {
        id: 44,
        name: "Nothing But Darkness",
        type: 0,
        npc_id: 254,
        amount: 300,
        location: "Dragon's Lair",
        reward: [27E3, 88781, 4]
    }, {
        id: 45,
        name: "Hope Is Strongest",
        type: 0,
        npc_id: 155,
        amount: 30,
        location: "Hell",
        reward: [36E3, 118375, 5]
    }, {
        id: 46,
        name: "Death Lord",
        type: 0,
        npc_id: 255,
        amount: 20,
        location: "Pernau",
        reward: [41400, 136131, 5]
    }, {
        id: 47,
        name: "Grinding Continues",
        type: 0,
        npc_id: 284,
        amount: 300,
        location: "Ancient Dungeon",
        reward: [42400, 141131, 5]
    }, {
        id: 48,
        name: "A Little More",
        type: 0,
        npc_id: 286,
        amount: 300,
        location: "Ancient Dungeon",
        reward: [46400, 151131, 5]
    }, {
        id: 49,
        name: "Stop the Demons",
        type: 0,
        npc_id: 156,
        amount: 20,
        location: "Heaven",
        reward: [48600, 152131, 5]
    }, {
        id: 50,
        name: "Big and Red",
        type: 0,
        npc_id: 256,
        amount: 20,
        location: "Dragon's Lair",
        reward: [56800, 176320, 5]
    }, {
        id: 51,
        name: "Got Wings?",
        type: 0,
        npc_id: 257,
        amount: 20,
        location: "Heaven",
        reward: [67800,
            189720, 5
        ]
    }, {
        id: 52,
        name: "Woodcutting",
        type: 0,
        npc_id: 278,
        amount: 5,
        location: "No Man's Land",
        reward: [35E3, 1E5, 5]
    }, {
        id: 53,
        name: "Acid Lord",
        type: 0,
        npc_id: 154,
        amount: 10,
        location: "Clouds",
        reward: [65E3, 125E3, 5]
    }, {
        id: 54,
        name: "Blood Eagle",
        type: 0,
        npc_id: 457,
        amount: 5,
        location: "Dungeon III",
        reward: [81250, 156E3, 5]
    }, {
        id: 55,
        name: "Titan Minotaur",
        type: 0,
        npc_id: 458,
        amount: 5,
        location: "Dungeon IV",
        reward: [85E3, 16E4, 5]
    }],
    PartyQuests = {
        difficulty_names: {
            0: "Easy",
            1: "Normal",
            2: "Hard",
            3: "Hell"
        },
        difficulty_cooldowns: {
            0: 3,
            1: 6,
            2: 12,
            3: 18
        },
        difficulty_durations: {
            0: 40,
            1: 50,
            2: 55,
            3: 65
        },
        not_within_boundaries: function() {
            addChatText(_te("Your combat level {level} is not within boundaries", {
                level: players[0].params.combat_level
            }), void 0, COLOR.ORANGE)
        },
        show_list: function(a) {
            Timers.clear("quest_show_new");
            document.getElementById("quests_party_form").style.display = "block";
            document.getElementById("quests_party_form_content").innerHTML = _ti("Loading data...");
            if ("undefined" == typeof a) Socket.send("party_quest", {
                sub: "party_list"
            });
            else {
                a =
                    sortArrayOfObjectsByFieldValueAsc(a, "name");
                for (var b in a) null == a[b] ? a.splice(b, 1) : (a[b].difficulty = _ti(PartyQuests.difficulty_names[a[b].difficulty]), a[b].players = a[b].players.length, a[b].extra = a[b].friends_only ? "\u2665" : "", a[b].join = current_world == a[b].world, a[b].combat = players[0].params.combat_level >= a[b].levels_min && players[0].params.combat_level <= a[b].levels_max);
                0 == a.length ? document.getElementById("quests_party_form_content").innerHTML = _ti("No active parties available!") : (document.getElementById("quests_party_form").style.display =
                    "block", document.getElementById("quests_party_form_content").innerHTML = HandlebarTemplate.quests_party_list()(a))
            }
        },
        show_hall_of_fame: function(a) {
            Timers.clear("quest_show_new");
            document.getElementById("quests_party_form").style.display = "block";
            document.getElementById("quests_party_form_content").innerHTML = _ti("Loading data...");
            if ("undefined" == typeof a) Socket.send("party_quest", {
                sub: "hall_of_fame"
            });
            else {
                a = a.reverse();
                for (var b in a) a[b].player == players[0].name && (a[b].me = !0);
                switch (a.length) {
                    case 13:
                        a.splice(8,
                            2);
                        break;
                    case 12:
                        a.splice(9, 1)
                }
                document.getElementById("quests_party_form_content").innerHTML = HandlebarTemplate.quests_hall_of_fame()(a)
            }
        },
        show_new: function() {
            var a = {};
            a.normal_disabled = 1 > players[0].temp.quest_diff;
            a.hard_disabled = 2 > players[0].temp.quest_diff;
            a.hell_disabled = 3 > players[0].temp.quest_diff;
            a.timer = 0 > minutesPastDelta(players[0].temp.quest_cooldown);
            a.time_remaining = -minutesPastDelta(players[0].temp.quest_cooldown);
            document.getElementById("quests_party_form").style.display = "block";
            document.getElementById("quests_party_form_content").innerHTML =
                HandlebarTemplate.quests_new()(a);
            PartyQuests.update_difficulty_cooldown();
            a.timer && Timers.set("quest_show_new", function() {
                "block" == document.getElementById("quests_party_form").style.display && PartyQuests.show_new()
            }, 500)
        },
        update_difficulty_cooldown: function() {
            var a = PartyQuests.difficulty_cooldowns[document.getElementById("quest_difficulty").value];
            document.getElementById("difficulty_cooldown").innerHTML = _tc("{count} hour", {
                count: a
            })
        },
        reduce_time: function() {
            0 < Inventory.get_item_count(players[0], 1031) ?
                Socket.send("party_quest", {
                    sub: "reduce_time"
                }) : addChatText(_te("You need a '{item_name}' to do that", {
                    item_name: item_base[1031].name
                }), void 0, COLOR.PINK)
        },
        create_new: function() {
            if (!PartyQuests.creation_in_progress) {
                PartyQuests.creation_in_progress = !0;
                Timers.set("creation_in_progress", function() {
                    PartyQuests.creation_in_progress = !1
                }, 5E3);
                var a = document.getElementById("quest_difficulty").value,
                    b = document.getElementById("quest_friends_only").checked,
                    d = [];
                if (b) {
                    for (var e in Contacts.friends) d.push(Contacts.friends[e].name);
                    d.push(players[0].name)
                }
                Socket.send("party_quest", {
                    sub: "create_new",
                    settings: {
                        difficulty: a,
                        friends_only: b,
                        whitelist: d
                    }
                })
            }
        },
        show_active_party: function(a) {
            a.difficulty = _ti(PartyQuests.difficulty_names[a.difficulty]);
            a.player_count = a.players.length;
            a.owner = !1;
            a.name == players[0].name && (a.owner = !0);
            for (var b in a.players) a.players[b] = {
                name: a.players[b],
                owner: a.owner && a.players[b] != players[0].name,
                id: a.id
            };
            Contacts.channels[a.channel] || Contacts.save_channel(a.channel);
            document.getElementById("quests_party_form_content").innerHTML =
                HandlebarTemplate.quests_active_party()(a)
        },
        leave_party: function(a) {
            "block" == document.getElementById("quests_party_form").style.display ? (Contacts.delete_channel(a.channel), PartyQuests.show_list()) : setTimeout(function() {
                Contacts.delete_channel(a.channel)
            }, 6E4)
        },
        kill_all_rewards: [{
            health: 10,
            reward: [50, 50, 1]
        }, {
            health: 20,
            reward: [200, 200, 1]
        }, {
            health: 30,
            reward: [400, 400, 1]
        }, {
            health: 40,
            reward: [800, 800, 1]
        }, {
            health: 50,
            reward: [1600, 1600, 1]
        }, {
            health: 60,
            reward: [3200, 3200, 2]
        }, {
            health: 70,
            reward: [6400, 6400, 2]
        }, {
            health: 80,
            reward: [12800, 12800, 2]
        }, {
            health: 90,
            reward: [20800, 20800, 2]
        }, {
            health: 100,
            reward: [30800, 30800, 3]
        }],
        max_allowed: 20
    },
    PlayerQuests = {
        positions: {
            menu_by_name: function(a) {
                return {
                    x: width - (bigIcons ? 64 : 32) - TopIcons.get_x(a) - 12,
                    y: TopIcons.bottom_y() + 12
                }
            }
        },
        fetch_player: function(a) {
            a = clients[a];
            return "undefined" == typeof a ? !1 : a
        },
        set_quest_step: function(a, b, d) {
            a = clients[a];
            "undefined" == typeof a.quests[b] && (a.quests[b] = {
                step: 1
            });
            a.quests[b].step = d
        },
        1: {
            positions: {
                gate_1: {
                    i: 32,
                    j: 22,
                    map: 12
                },
                makeover: {
                    i: 31,
                    j: 19,
                    map: 12
                },
                quest_instructor: {
                    i: 31,
                    j: 28,
                    map: 12,
                    id: 2477
                },
                combat_instructor: {
                    i: 34,
                    j: 25,
                    map: 12,
                    id: 2484
                },
                gate_2: {
                    i: 32,
                    j: 33,
                    map: 12
                },
                magic_instructor: {
                    i: 31,
                    j: 38,
                    map: 12,
                    id: 2737
                },
                fishing_instructor: {
                    i: 38,
                    j: 48,
                    map: 12,
                    id: 2468
                },
                cooking_instructor: {
                    i: 40,
                    j: 40,
                    map: 12,
                    id: 2466
                },
                fishing_shop: {
                    i: 39,
                    j: 43,
                    map: 12,
                    id: 2465
                },
                fishing_spot: {
                    i: 35,
                    j: 52,
                    map: 12,
                    id: 2532
                },
                campfire: {
                    i: 39,
                    j: 40,
                    map: 12,
                    id: 9308
                },
                mining_instructor: {
                    i: 43,
                    j: 42,
                    map: 12,
                    id: 7791
                },
                clay: {
                    i: 45,
                    j: 44,
                    map: 12,
                    id: 3601
                },
                jewelry_instructor: {
                    i: 49,
                    j: 41,
                    map: 12,
                    id: 2489
                },
                furnace: {
                    i: 49,
                    j: 45,
                    map: 12,
                    id: 7663
                },
                forging_instructor: {
                    i: 58,
                    j: 42,
                    map: 12,
                    id: 7797
                },
                anvil: {
                    i: 58,
                    j: 40,
                    map: 12,
                    id: 9310
                },
                furnace_forging: {
                    i: 59,
                    j: 47,
                    map: 12,
                    id: 9318
                },
                alchemy_instructor: {
                    i: 66,
                    j: 42,
                    map: 12,
                    id: 595
                },
                woodcutting_instructor: {
                    i: 70,
                    j: 51,
                    map: 12,
                    id: 2703
                },
                chest_instructor: {
                    i: 79,
                    j: 46,
                    map: 12,
                    id: 7800
                },
                chest: {
                    i: 81,
                    j: 50,
                    map: 12,
                    id: 2705
                }
            },
            client: function(a) {
                if (12 != current_map) return !0;
                switch (a.params.quest_step) {
                    case 1:
                        if (players[0].quests[1] && 1 == players[0].quests[1].step && 0 == players[0].params.d_head && 0 == players[0].params.d_facial_hair &&
                            0 == players[0].params.d_body && 0 == players[0].params.d_pants) return addChatText(_tq("You need to change your look at Makeover Guy before continuing."), null, COLOR.TEAL), interactiveArrow("makeover", function() {
                                var a = "block" == document.getElementById("makeover_form").style.display || 1 < players[0].quests[1].step;
                                a && setTimeout(function() {
                                    interactiveArrow("gate", function() {
                                        return 1 < players[0].quests[1].step
                                    }, PlayerQuests[1].positions.gate_1, "down", 6E4)
                                }, 5E3);
                                return a
                            }, PlayerQuests[1].positions.makeover, "down",
                            3E4), !1;
                        interactiveArrow("quest_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.quest_instructor.id
                        }, PlayerQuests[1].positions.quest_instructor, "down", 6E4);
                        break;
                    case 2:
                        if (5 > player_quests[0].progress) return addChatText(_tq("You need to kill {amount} more rats to pass this gate.", {
                            amount: 5 - player_quests[0].progress
                        }), null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0], 0) && (addChatText(_tq("Talk to the combat instructor to get a bronze dagger."), null,
                            COLOR.TEAL), interactiveArrow("combat_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.combat_instructor.id
                        }, PlayerQuests[1].positions.combat_instructor, "down", 6E4)), !1;
                        interactiveArrow("magic_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.magic_instructor.id
                        }, PlayerQuests[1].positions.magic_instructor, "down", 6E4);
                        break;
                    case 3:
                        if (0 == skills[0].magic.xp) return addChatText(_tq("You need to use magic on a training dummy to pass this gate."),
                            null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0], 444) && addChatText(_tq("Talk to the magic instructor to get a pouch and spells."), null, COLOR.TEAL), !1;
                        interactiveArrow("fishing_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.fishing_instructor.id
                        }, PlayerQuests[1].positions.fishing_instructor, "down", 6E4);
                        break;
                    case 4:
                        if (0 == skills[0].fishing.xp) return addChatText(_tq("You need to catch a fish to pass this gate."), null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0],
                            7) && addChatText(_tq("Talk to the fishing instructor to get a free fishing rod."), null, COLOR.TEAL), !1;
                        if (0 == skills[0].cooking.xp) return addChatText(_tq("You need to cook a raw fish or a raw rat meat to pass this gate."), null, COLOR.TEAL), !1;
                        interactiveArrow("mining_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.mining_instructor.id
                        }, PlayerQuests[1].positions.mining_instructor, "down", 6E4);
                        break;
                    case 5:
                        if (0 == skills[0].mining.xp) return addChatText(_tq("You need to mine clay to pass this gate."),
                            null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0], 23) && (addChatText(_tq("Talk to the mining instructor to get a free iron pickaxe."), null, COLOR.TEAL), interactiveArrow("mining_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.mining_instructor.id
                        }, PlayerQuests[1].positions.mining_instructor, "down", 6E4)), !1;
                        if (0 == skills[0].jewelry.xp) return addChatText(_tq("You need to make a clay mould. Talk to jewelry instructor for instructions."), null, COLOR.TEAL),
                            interactiveArrow("jewelry_instructor", function() {
                                return selected_object && selected_object.id == PlayerQuests[1].positions.jewelry_instructor.id
                            }, PlayerQuests[1].positions.jewelry_instructor, "down", 6E4), !1;
                        interactiveArrow("forging_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.forging_instructor.id
                        }, PlayerQuests[1].positions.forging_instructor, "down", 6E4);
                        break;
                    case 6:
                        interactiveArrow("alchemy_instructor", function() {
                            return selected_object && selected_object.id ==
                                PlayerQuests[1].positions.alchemy_instructor.id
                        }, PlayerQuests[1].positions.alchemy_instructor, "down", 6E4);
                        break;
                    case 7:
                        if (0 == skills[0].alchemy.xp) return addChatText(_tq("You need to mine sand and make a vial in a furnace to pass this gate."), null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0], 286) && (addChatText(_tq("Talk to the alchemy instructor to get a free spade."), null, COLOR.TEAL), interactiveArrow("alchemy_instructor", function() {
                                return selected_object && selected_object.id == PlayerQuests[1].positions.alchemy_instructor.id
                            },
                            PlayerQuests[1].positions.alchemy_instructor, "down", 6E4)), !1;
                        interactiveArrow("woodcutting_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.woodcutting_instructor.id
                        }, PlayerQuests[1].positions.woodcutting_instructor, "down", 6E4);
                        break;
                    case 8:
                        if (0 == skills[0].woodcutting.xp) return addChatText(_tq("You need to cut a tree to pass this gate."), null, COLOR.TEAL), 0 == Inventory.get_item_count(players[0], 22) && (addChatText(_tq("Talk to the woodcutting instructor to get a free woodcutter\u00b4s axe."),
                            null, COLOR.TEAL), interactiveArrow("woodcutting_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.woodcutting_instructor.id
                        }, PlayerQuests[1].positions.woodcutting_instructor, "down", 6E4)), !1;
                        interactiveArrow("chest_instructor", function() {
                            return selected_object && selected_object.id == PlayerQuests[1].positions.chest_instructor.id
                        }, PlayerQuests[1].positions.chest_instructor, "down", 6E4);
                        break;
                    case 9:
                        Chat.filter_enabled(Chat.tab, "chat") || ChatSystem.filter_toggle("chat")
                }
                return !0
            },
            server: function(a, b) {
                var d = PlayerQuests.fetch_player(a);
                if (!d || 12 != d.map) return !0;
                switch (b.params.quest_step) {
                    case 1:
                        PlayerQuests.set_quest_step(a, "1", 2);
                        break;
                    case 2:
                        PlayerQuests.set_quest_step(a, "1", 3);
                        break;
                    case 3:
                        PlayerQuests.set_quest_step(a, "1", 4);
                        break;
                    case 4:
                        PlayerQuests.set_quest_step(a, "1", 5);
                        break;
                    case 5:
                        PlayerQuests.set_quest_step(a, "1", 6);
                        break;
                    case 6:
                        PlayerQuests.set_quest_step(a, "1", 7);
                        break;
                    case 7:
                        PlayerQuests.set_quest_step(a, "1", 8);
                        break;
                    case 8:
                        PlayerQuests.set_quest_step(a, "1",
                            9);
                        break;
                    case 9:
                        clients[a].quests[1] = {
                            finished: !0
                        }
                }
                return !0
            }
        }
    },
    dungeon_size = 100,
    dungeon_side_width = 8;

function randomCoords() {
    return {
        x: dungeon_side_width + Math.random2() * (dungeon_size - dungeon_side_width) << 0,
        y: dungeon_side_width + Math.random2() * (dungeon_size - dungeon_side_width) << 0
    }
}

function randomSize() {
    return Math.round(2 * Math.random2()) + 20
}

function beginCenter(a) {
    for (var b = {
            x: Math.round(dungeon_size / 2),
            y: Math.round(dungeon_size / 2)
        }; !a[b.x][b.y];)
        if (--b.x, --b.y, b.x < dungeon_side_width && b.y < dungeon_side_width) return !1;
    return b
}
var _random_numbers = [];

function randomFill() {
    _random_numbers = [];
    for (var a = 0; 256 > a; a++) _random_numbers.push(Math.random2())
}

function random256() {
    return _random_numbers.pop()
}

function generateAccessibilityGraph(a, b) {
    for (var d = 0, e = [b], f = [], g = 0; g < dungeon_size; g++) f[g] = [];
    for (; 0 < e.length;) g = e.splice(0, 1)[0], a[g.x] && a[g.x][g.y] && !f[g.x][g.y] && (d++, f[g.x][g.y] = !0, e.push({
        x: g.x - 1,
        y: g.y
    }), e.push({
        x: g.x + 1,
        y: g.y
    }), e.push({
        x: g.x,
        y: g.y - 1
    }), e.push({
        x: g.x,
        y: g.y + 1
    }));
    return {
        area: d,
        graph: f
    }
}

function generateMap(a) {
    var b = map_increase;
    map_increase = 400;
    var d = Math.random;
    timestamp();
    var e, f, g = [],
        h = {},
        l = [];
    Math.seedrandom(a.map_seed);
    Math.random2 = Math.random;
    Math.random = d;
    randomFill();
    for (var m = new SimplexNoise(random256), k = 0; k < dungeon_size; k++) g[k] = [];
    for (var v = 0; v < dungeon_size; v++)
        for (var q = 0; q < dungeon_size; q++) {
            var r = 1 > 8 * m.noise2D(v / randomSize(), q / randomSize()) ? 256 : 0;
            if (v < dungeon_side_width || q < dungeon_side_width || v > dungeon_size - dungeon_side_width || q > dungeon_size - dungeon_side_width) r = 0;
            g[v][q] = r && 1;
            r && (e = e || {
                x: v,
                y: q
            }, f = {
                x: v,
                y: q
            })
        }
    var A = new Graph(g);
    a.center && (e = beginCenter(g) || e);
    var w = A.nodes[e.x][e.y],
        z = A.nodes[f.x][f.y],
        m = astar.search(A.nodes, w, z);
    200 < m.length && (l = generateAccessibilityGraph(g, e));
    if (200 < m.length && 3500 < l.area) {
        l = l.graph;
        for (k = 0; k < dungeon_size; k++) h[k] = {};
        l[e.x][e.y] = !1;
        l[f.x][f.y] = !1;
        Math.seedrandom(a.game_seed);
        Math.random2 = Math.random;
        Math.random = d;
        d = [];
        for (v = {
                x: 0,
                y: 0
            }; 50 > d.length || 20 > distance(z.x, z.y, v.x, v.y);) k = randomCoords(), l[k.x][k.y] && (v = A.nodes[k.x][k.y],
            d = astar.search(A.nodes, w, v));
        l[v.x][v.y] = !1;
        q = [];
        for (r = {
                x: 0,
                y: 0
            }; 50 > q.length || 20 > distance(v.x, v.y, r.x, r.y) || 20 > distance(z.x, z.y, r.x, r.y);) k = randomCoords(), l[k.x][k.y] && (r = A.nodes[k.x][k.y], q = astar.search(A.nodes, w, r));
        l[r.x][r.y] = !1;
        for (var x = [], B = {
                x: 0,
                y: 0
            }; 50 > x.length || 20 > distance(r.x, r.y, B.x, B.y) || 20 > distance(v.x, v.y, B.x, B.y) || 20 > distance(z.x, z.y, B.x, B.y);) k = randomCoords(), l[k.x][k.y] && (B = A.nodes[k.x][k.y], x = astar.search(A.nodes, w, B));
        l[B.x][B.y] = !1;
        for (w = A = 0; A < a.monsters + 5 || 5E3 < w;) k = randomCoords(),
            l[k.x][k.y] && !h[k.x][k.y] && (h[k.x][k.y] = !0, A++), w++;
        for (k = 0; k < dungeon_size; k++) 0 == JSON.count(h[k]) && delete h[k];
        map_increase = b;
        return {
            grid: g,
            enemies: h,
            points: {
                begin: {
                    x: e.x,
                    y: e.y,
                    path: m
                },
                end: f,
                1: {
                    x: v.x,
                    y: v.y,
                    path: d
                },
                2: {
                    x: r.x,
                    y: r.y,
                    path: q
                },
                3: {
                    x: B.x,
                    y: B.y,
                    path: x
                }
            }
        }
    }
    map_increase = b;
    return !1
}

function rotateMap(a, b) {
    if (0 != b.rotate) {
        var d = rotate90;
        switch (b.rotate) {
            case 1:
                d = rotate90;
                break;
            case 2:
                d = rotate180;
                break;
            case 3:
                d = rotate270
        }
        for (var e = [], f = 0; f < dungeon_size; f++) e[f] = [];
        for (f = 0; f < dungeon_size; f++)
            for (var g = 0; g < dungeon_size; g++) {
                var h = d({
                    x: f,
                    y: g
                });
                e[h.x][h.y] = a.grid[f][g]
            }
        var l = {};
        for (f in a.enemies)
            for (g in a.enemies[f]) h = d({
                x: parseInt(f),
                y: parseInt(g)
            }), l[h.x] = l[h.x] || {}, l[h.x][h.y] = !0;
        for (f in a.points) h = d(a.points[f]), a.points[f] = h, a.points[f].path = [h];
        a.grid = e;
        a.enemies = l
    }
    return a
}
var rotate90 = function(a) {
        return {
            x: dungeon_size - 1 - a.y,
            y: a.x
        }
    },
    rotate180 = function(a) {
        return {
            x: dungeon_size - 1 - a.x,
            y: dungeon_size - 1 - a.y
        }
    },
    rotate270 = function(a) {
        return {
            x: a.y,
            y: dungeon_size - 1 - a.x
        }
    };

function loadCustomMap(a, b, d) {
    randomMapCleanup(b.dungeon_id);
    map_names[a] = b.name || "Dungeon quest";
    var e = generateMap(b),
        e = rotateMap(e, b),
        f = Math.random;
    Math.seedrandom("reset");
    Math.seedrandom(b.map_seed);
    Math.random2 = Math.random;
    Math.random = f;
    map_graphs[a] = [];
    map[a] = [];
    on_map[a] = [];
    map_settings[a] = {};
    map_settings[a].respawn = !!parseInt(b.type);
    map_settings[a].monsters = b.monsters;
    map_settings[a].monsters_left = b.monsters_left;
    for (f = 0; f <= dungeon_size; f++) {
        map_graphs[a][f] = [];
        map[a][f] = [];
        on_map[a][f] =
            [];
        for (var g = 0; g <= dungeon_size; g++)
            if (100 == g || 100 == f) map_graphs[a][f][g] = 1, map[a][f][g] = !1, on_map[a][f][g] = !1;
            else {
                map_graphs[a][f][g] = e.grid[f][g];
                var h = 0;
                try {
                    h = e.grid[f - 1][g] + e.grid[f + 1][g] + e.grid[f - 1][g - 1] + e.grid[f + 1][g - 1] + e.grid[f][g - 1] + e.grid[f - 1][g + 1] + e.grid[f + 1][g + 1] + e.grid[f][g + 1]
                } catch (l) {
                    h = 0
                }
                map[a][f][g] = {
                    b_t: BASE_TYPE.GROUND,
                    b_i: groundTileFor(b.theme, !e.grid[f][g], h)
                };
                on_map[a][f][g] = objectTileFor(b.theme, !e.grid[f][g], h)
            }
    }
    node_graphs[a] = new Graph(map_graphs[a]);
    if (0 == b.type) placeObjectDungeon({
        i: e.points["1"].x,
        j: e.points["1"].y,
        map: a
    }, 446), node_graphs[a].nodes[e.points["1"].x][e.points["1"].y].type = 0, 2 > b.difficulty && (placeObjectDungeon({
        i: e.points["2"].x,
        j: e.points["2"].y,
        map: a
    }, 446), node_graphs[a].nodes[e.points["2"].x][e.points["2"].y].type = 0, 1 > b.difficulty && (placeObjectDungeon({
        i: e.points["3"].x,
        j: e.points["3"].y,
        map: a
    }, 446), node_graphs[a].nodes[e.points["3"].x][e.points["3"].y].type = 0));
    else if (1 == b.type) {
        g = [1057, 1058, 1059];
        h = [e.points["1"], e.points["2"], e.points["3"]];
        for (f = 0; f < h.length; f++) {
            var m =
                h[f];
            placeObjectDungeon({
                i: m.x,
                j: m.y,
                map: a,
                params: {
                    contains_id: g.pop()
                }
            }, 442);
            node_graphs[a].nodes[m.x][m.y].type = 0
        }
        placeObjectDungeon({
            i: e.points.end.x,
            j: e.points.end.y,
            map: a
        }, Math.min(443 + b.difficulty, 445));
        node_graphs[a].nodes[e.points.end.x][e.points.end.y].type = 0
    } else 2 == b.type && (node_graphs[a].nodes[e.points["1"].x][e.points["1"].y].type = 0, placeObjectDungeon({
        i: e.points["1"].x,
        j: e.points["1"].y,
        map: a
    }, 471));
    h = "undefined" != typeof iamserver;
    for (f = 0; f <= dungeon_size; f++)
        if (e.enemies[f])
            for (g = 0; g <=
                dungeon_size; g++) e.enemies[f][g] && placeNPC({
                i: parseInt(f),
                j: parseInt(g),
                map: a
            }, chooseEnemy(b.monster_level), h);
    if ("undefined" == typeof d) return e;
    for (f = 0; f <= dungeon_size; f++)
        for (g = 0; g <= dungeon_size; g++) d.map[f] && d.map[f][g] && (map[a][f][g] = {
            b_t: BASE_TYPE.GROUND,
            b_i: d.map[f][g].i
        }), d.on_map[f] && d.on_map[f][g] && (node_graphs[a].nodes[f][g].type = 0, placeObjectDungeon({
            i: f,
            j: g,
            map: a,
            r: d.on_map[f][g].r
        }, d.on_map[f][g].i));
    return e
}

function groundTileFor(a, b, d) {
    if (b && 8 > d) switch (a) {
        case 0:
            return 303;
        case 1:
            return 6;
        case 2:
            return 23;
        case 3:
            return 1;
        case 4:
            return [380, 381, 382, 383, 384, 385][Math.floor(6 * Math.random2())]
    } else switch (a) {
        case 0:
            return a = [4, 5, 8, 21, 4, 5, 8, 21, 4, 5, 8, 21, 98, 99, 100, 100, 101, 98, 99, 100, 100, 101, 98, 99, 100, 100, 101, 311, 312, 313, 314, 315], 0 == d && a.push(329, 330, 329, 330, 329, 330, 329, 330, 329, 330), a[Math.floor(Math.random() * a.length)];
        case 1:
            return [14, 16, 17, 14, 16, 17, 14, 16, 17, 103, 104, 105, 106, 107, 103, 104, 105, 106, 107, 103, 104,
                105, 106, 107, 316, 317, 318, 319, 320
            ][Math.floor(29 * Math.random2())];
        case 2:
            return [12, 20, 22][Math.floor(3 * Math.random2())];
        case 3:
            return [0, 62, 63, 64, 65, 66, 67, 68, 69, 190, 195, 196, 197, 198, 199, 200, 201][Math.floor(17 * Math.random2())];
        case 4:
            return [376, 377, 378, 379][Math.floor(4 * Math.random2())]
    }
}

function objectTileFor(a, b, d) {
    if (!b || 8 > d) {
        switch (a) {
            case 1:
                a = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 128
                };
                var e = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 129
                    },
                    f = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 177
                    },
                    g = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 178
                    },
                    h = [!1, !1, !1, !1, !1, !1];
                0 != d || b || h.push(a, e, f, g);
                return h[Math.floor(Math.random2() * h.length)];
            case 2:
                return a = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 182
                }, e = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 179
                }, f = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 146
                }, g = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 177
                }, h = [!1, !1, !1, !1, !1, !1], 0 != d || b || h.push(a, e, f, g), h[Math.floor(Math.random2() *
                    h.length)];
            case 3:
                a = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 235
                };
                var e = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 236
                    },
                    f = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 237
                    },
                    g = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 1
                    },
                    l = {
                        b_t: BASE_TYPE.OBJECT,
                        b_i: 14
                    },
                    h = [!1, !1, !1, !1, !1, !1];
                0 != d || b || h.push(a, e, f, g, l);
                return h[Math.floor(Math.random2() * h.length)];
            case 4:
                return a = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 122
                }, e = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 123
                }, f = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 124
                }, g = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 128
                }, l = {
                    b_t: BASE_TYPE.OBJECT,
                    b_i: 146
                }, h = [!1, !1, !1, !1, !1, !1], 0 != d || b || h.push(a, e, f,
                    g, l), h[Math.floor(Math.random2() * h.length)]
        }
        return !1
    }
    switch (a) {
        case 0:
            e = [375, 376, 377, 378][Math.floor(4 * Math.random2())];
            break;
        case 1:
            e = [394, 395, 396, 397, 421, 422, 423][Math.floor(7 * Math.random2())];
            break;
        case 2:
            e = [122, 123, 124, 122, 123, 124, 122, 123, 124, 126][Math.floor(10 * Math.random2())];
            break;
        case 3:
            e = [238, 239, 240, 241, 242, 243, 251, 252, 253, 254, 255][Math.floor(11 * Math.random2())];
            break;
        case 4:
            e = [122, 123, 124, 122, 123, 124, 122, 123, 124, 126][Math.floor(10 * Math.random2())]
    }
    return {
        b_t: BASE_TYPE.OBJECT,
        b_i: e
    }
}

function chooseEnemy(a) {
    for (a = Math.min(a, 325);;) {
        var b = Math.max(1, a - Math.floor(40 * Math.random2()));
        if (monsters_by_level[b]) return monsters_by_level[b][Math.floor(Math.random2() * monsters_by_level[b].length)]
    }
}

function randomMapCleanup(a) {
    var b = 4E4,
        d;
    20 > a ? (b += 1E3 * a, d = b + 1E3) : 20 <= a && (b = b + 2E4 + 5E3 * (a - 20), d = b + 5E3);
    for (var e = 0; e < fights.length; e++) fights[e] && fights[e].second.map == a + 100 && (Timers.clear("fights_" + e), fights[e].second.temp.health = 0, FIGHT.multi_step(e), FIGHT.remove(e));
    for (e = b; e < d; e++) delete objects_data[e];
    delete map_graphs[a + 100];
    delete node_graphs[a + 100];
    delete map[a + 100];
    delete on_map[a + 100]
}
var guild_ids = {},
    Guild = {
        guild_deed_id: 1143,
        price: 1E7,
        price_mos: 1E3,
        max_allowed: 9,
        msg: {
            not_available: "Sorry, maximum of 10 active guilds allowed per server. Try again in a few minutes or go to a different world.",
            already_in_guild: "You already belong to a guild. You need to leave that guild first.",
            combat_70_to_create_guild: "You need to have at least level 70 combat to start a guild.",
            not_inside_town: "Need to be inside a town to use this item",
            guild_deed_required: "You need a '{item_name}' to do that",
            not_enough_coins_for_guild: "Not enough coins, need " + thousandSeperate(1E7) + " to create a guild.",
            not_enough_mos_for_guild: "Not enough MOS, need " + thousandSeperate(1E3) + " to create a guild.",
            not_in_a_guild: "You are not in any guild!"
        },
        guild_buildings: {
            crystal: [{
                obj_id: 471
            }],
            hall: [{
                obj_id: 473
            }],
            shrine: [{
                obj_id: 472
            }],
            barracks: [{
                obj_id: 475
            }],
            mine: [{
                obj_id: 474
            }]
        }
    },
    guild_maps = {},
    guild_maps_data = {},
    guild_map_saves = {},
    GuildMap = {};
Guild.guild_buildings_by_id = {};
for (i in Guild.guild_buildings)
    for (j in Guild.guild_buildings[i]) Guild.guild_buildings_by_id[Guild.guild_buildings[i][j].obj_id] = JSON.merge(Guild.guild_buildings[i][j], {
        category: i,
        level: parseInt(j) + 1
    });
var Breeding = {
        nest_id: 479,
        open_nest: function() {
            windowOpen = !0;
            var a = (pet_nest = on_map[pet_nest.map][pet_nest.i][pet_nest.j]) && pet_nest.params && pet_nest.params.pet_id,
                b = void 0;
            pet_nest.params.other_nest && on_map[pet_nest.map][pet_nest.params.other_nest.i + 10][pet_nest.params.other_nest.j + 10] && (b = pet_nest.params.other_nest);
            var d = {
                pet_item_id: "undefined" == typeof a ? void 0 : pets[a].params.item_id,
                pet_id: "undefined" == typeof a ? void 0 : a,
                inventory: Breeding.inventory_get_pets(),
                other_nest: b,
                happiness: 0,
                hunger: 0,
                breed: !1,
                insure: !1
            };
            if ("undefined" != typeof a) {
                d.likes = [];
                for (var e in pets[a].params.likes) d.likes.push(pets[pets[a].params.likes[e].pet_id].params.item_id);
                d.eats = [];
                for (e in pets[a].params.eats) d.eats.push(e);
                d.insure = !0;
                d.inventory = Breeding.inventory_get_foods(d.pet_id);
                d.hunger_time = pets[a].params.eat_interval;
                d.hunger = Breeding.get_pet_hunger(null, pet_nest);
                d.happiness_time = pets[a].params.happiness;
                d.happiness = Breeding.get_pet_happiness(null, pet_nest);
                d.show_hunger = !Breeding.in_zoo_state({
                    i: pet_nest.i,
                    j: pet_nest.j
                });
                100 <= d.hunger && (d.insure = !1);
                pet_nest.params.insured && (d.insure = !1);
                Breeding.ready_to_breed(null, pet_nest) && (d.breed = !0)
            }
            Breeding.activate_pet_alert(pet_nest);
            var f = document.getElementById("pet_nest_form"),
                g = HandlebarTemplate.pet_nest()(d);
            Timers.set("draw_pet_nest", function() {
                f.innerHTML = g;
                removeClass(f, "hidden");
                Timers.set("refresh_pet_nest", function() {
                    hasClass(document.getElementById("pet_nest_form"), "hidden") || Breeding.open_nest()
                }, Math.max(1E4, (d.hunger_time || 1) / 100 * 6E4))
            }, 1)
        },
        other: function(a, b) {
            (pet_nest = on_map[300][a + 10][b + 10]) && Breeding.open_nest()
        },
        inventory_get_pets: function() {
            var a = [],
                b;
            for (b in players[0].temp.inventory) item_base[players[0].temp.inventory[b].id].b_t == ITEM_CATEGORY.PET && a.push({
                id: players[0].temp.inventory[b].id,
                i: b
            });
            return Breeding.inventory_format(a)
        },
        inventory_get_foods: function(a) {
            var b = [];
            if ("undefined" != typeof a && pets[a])
                for (var d in pets[a].params.eats)
                    for (var e in players[0].temp.inventory) item_base[players[0].temp.inventory[e].id].b_i ==
                        d && b.push({
                            id: players[0].temp.inventory[e].id,
                            i: e
                        });
            return Breeding.inventory_format(b)
        },
        inventory_format: function(a) {
            if (15 < a.length) return a.slice(0, 15);
            for (var b = 15 - a.length, d = 0; d < b; d++) a.push({
                id: void 0,
                i: !1
            });
            return a
        },
        inventory_click: function(a, b) {
            if ("undefined" != typeof a && !1 !== a) {
                var d = item_base[players[0].temp.inventory[a].id];
                if (b) Socket.send("breeding", {
                    sub: "feed_pet",
                    position: Breeding.get_nest_position(),
                    item_id: d.b_i
                });
                else {
                    var e = pets[d.params.pet];
                    e.params.breeding_level <= skills[0].breeding.current ?
                        Socket.send("breeding", {
                            sub: "place_pet",
                            position: Breeding.get_nest_position(),
                            item_id: d.b_i
                        }) : "undefined" == typeof e.params.breeding_level ? addChatText(_te("This pet cannot be used for breeding!"), null, COLOR.PINK, "cannot") : addChatText(_te("You need {level} breeding for {item_name}", {
                            level: e.params.breeding_level,
                            item_name: e.name
                        }), null, COLOR.PINK, "cannot")
                }
            }
        },
        cancel: function() {
            var a = function() {
                Socket.send("breeding", {
                    sub: "cancel",
                    position: Breeding.get_nest_position()
                })
            };
            100 == Breeding.get_pet_hunger(null,
                Breeding.get_nest_position()) ? a() : Popup.prompt(_ti("Cancel breeding? Progress will be lost."), function() {
                a()
            }, function() {});
            Breeding.open_nest()
        },
        breed: function() {
            Socket.send("breeding", {
                sub: "breed",
                position: Breeding.get_nest_position()
            });
            Breeding.open_nest()
        },
        insure: function(a) {
            Popup.dual_prompt(_ti("Do you want to insure your pet in case of death?"), thousandSeperate(pets[a].params.insurance_cost[0]) + " " + _ti("coins"), function() {
                Socket.send("breeding", {
                    sub: "insure",
                    type: "coins",
                    position: Breeding.get_nest_position()
                });
                Timers.set("refresh_pet_nest", function() {
                    hasClass(document.getElementById("pet_nest_form"), "hidden") || Breeding.open_nest()
                }, 1E3)
            }, thousandSeperate(pets[a].params.insurance_cost[1]) + " MOS", function() {
                Socket.send("breeding", {
                    sub: "insure",
                    type: "mos",
                    position: Breeding.get_nest_position()
                });
                Timers.set("refresh_pet_nest", function() {
                    hasClass(document.getElementById("pet_nest_form"), "hidden") || Breeding.open_nest()
                }, 1E3)
            })
        },
        get_nest_position: function() {
            return {
                i: pet_nest.i,
                j: pet_nest.j,
                map: pet_nest.map
            }
        },
        get_other_nest: function(a,
            b) {},
        pet_x_likes_pet_y: function(a, b) {
            for (var d = 0; d < pets[a].params.likes.length; d++)
                if (pets[a].params.likes[d].pet_id == b) return !0;
            return !1
        },
        ready_to_breed: function(a, b) {
            if (100 == Breeding.get_pet_happiness(a, b))
                if ("undefined" == typeof iamserver) {
                    var d = on_map[300][b.i][b.j];
                    if (d.params.other_nest && on_map[d.map][d.params.other_nest.i + 10][d.params.other_nest.j + 10]) {
                        var e = JSON.clone(d.params.other_nest);
                        e.i += 10;
                        e.j += 10;
                        if (100 == Breeding.get_pet_happiness(a, e) && Breeding.pet_x_likes_pet_y(d.params.pet_id, on_map[d.map][e.i][e.j].params.pet_id)) return !0
                    }
                } else if (d =
                PlayerMap.get_packed_object(a, b), d.ot_n && PlayerMap.can_edit(a, a, d.ot_n) && (e = PlayerMap.get_packed_object(a, d.ot_n), 100 == Breeding.get_pet_happiness(a, d.ot_n) && Breeding.pet_x_likes_pet_y(d.pet_id, e.pet_id))) return !0;
            return !1
        },
        activate_pet_alert: function(a) {
            if (!spectator_mode) {
                var b = "breeding_" + a.i + "_" + a.j,
                    d = Breeding.get_pet_hunger(null, a);
                if (my_island() && 0 <= d && 75 > d && !Breeding.in_zoo_state(a)) {
                    a = on_map[300][a.i][a.j].params.pet_id;
                    var e = pets[a],
                        f = pets[a].params.eat_interval,
                        f = (75 - d) / 100 * pets[a].params.eat_interval *
                        6E4;
                    Timers.set(b, function() {
                        addChatText(_ti("Warning! Pet {item_name} has reached 75% hunger.", {
                            item_name: e.name
                        }), void 0, COLOR.PINK)
                    }, f)
                } else Timers.clear(b)
            }
        },
        in_zoo_state: function(a) {
            if (my_island()) {
                var b = on_map[300][a.i][a.j];
                if (b && b.params) {
                    a = b.params.last_ate;
                    var d = b.params.secondstamp;
                    if ((b = pets[b.params.pet_id]) && d + 60 * b.params.happiness <= a + 60 * b.params.eat_interval) return !0
                }
            }
        },
        get_pet_hunger: function(a, b) {
            var d = 100;
            if ("undefined" == typeof iamserver) {
                var e = on_map[300][b.i][b.j];
                if (!e || !e.params) return d;
                var f = e.params.pet_id,
                    g = e.params.last_ate,
                    e = e.params.secondstamp
            } else if (PlayerMap.can_edit(a, a, b)) e = PlayerMap.get_packed_object(a, b), f = e.pet_id, g = e.l_a, e = e.t;
            else return 100;
            var h = pets[f];
            if (h) {
                if (e + 60 * h.params.happiness <= g + 60 * h.params.eat_interval) return 0;
                d = pets[f].params.eat_interval;
                d = Math.floor(secondsPastDelta(g) / (60 * d) * 100)
            }
            return Math.range(d, 0, 100)
        },
        get_pet_happiness: function(a, b) {
            var d = 0;
            if ("undefined" == typeof iamserver) var e = on_map[300][b.i][b.j],
                f = e.params.pet_id,
                e = e.params.secondstamp;
            else if (PlayerMap.can_edit(a, a, b)) e = PlayerMap.get_packed_object(a, b), f = e.pet_id, e = e.t;
            else return 0;
            pets[f] && (d = Breeding.get_pet_hunger(a, b), f = pets[f].params.happiness, d = 100 <= d ? 0 : Math.floor(secondsPastDelta(e) / (60 * f) * 100));
            return Math.range(d, 0, 100)
        },
        formulas: function() {
            addClass(document.getElementById("pet_nest_form"), "hidden");
            Breeding.formulas_general()
        },
        formulas_general: function(a) {
            for (var b = [], d = 1, e = pets.length; d < e; d++) {
                var f = pets[d].params;
                if (f.breeding_level) {
                    var g = {
                            item_id: f.item_id,
                            name: _tn(item_base[f.item_id].name),
                            level: f.breeding_level,
                            eat_interval: f.eat_interval,
                            happiness: f.happiness,
                            insurance: f.insurance_cost,
                            eats: []
                        },
                        h;
                    for (h in f.eats) g.eats.push({
                        id: h,
                        restores: Math.round(100 * f.eats[h])
                    });
                    g.eats = sortArrayOfObjectsByFieldValueDesc(g.eats, "restores");
                    b.push(g)
                }
            }
            sortArrayOfObjectsBy(b, [{
                field: "level",
                order: "asc"
            }, {
                field: "name",
                order: "asc"
            }]);
            FormHelper.get_form("breeding_formulas").content.innerHTML = HandlebarTemplate.breeding_formulas_general()(b);
            document.getElementById("breeding_formulas_search").value =
                a || Breeding.formulas_search;
            Breeding.formulas_general_update_search();
            TableSorter.init(document.getElementById("breeding_formulas_general_table"))
        },
        formulas_search: "",
        formulas_general_update_search: function() {
            Breeding.formulas_search = document.getElementById("breeding_formulas_search").value;
            for (var a = RegExp(escapeRegExp(Breeding.formulas_search), "i"), b = document.getElementsByClassName("breeding_formula_line"), d = 0, e = b.length; d < e; d++) {
                for (var f = b[d].children, g = !1, h = 0; h < f.length; h++)
                    if (a.test(f[h].textContent) ||
                        f[h].children[0] && a.test(f[h].children[0].title) || f[h].children[1] && a.test(f[h].children[1].title) || f[h].children[2] && a.test(f[h].children[2].title) || f[h].children[3] && a.test(f[h].children[3].title) || f[h].children[4] && a.test(f[h].children[4].title) || f[h].children[5] && a.test(f[h].children[5].title) || f[h].children[6] && a.test(f[h].children[6].title)) {
                        g = !0;
                        break
                    }
                g ? removeClass(b[d], "hidden") : addClass(b[d], "hidden")
            }
        },
        formulas_results: function(a) {
            for (var b = [], d = 1, e = pets.length; d < e; d++) {
                var f = pets[d].params;
                if (f.breeding_level && f.likes && 0 != f.likes.length) {
                    for (var g = 0; g < f.likes.length; g++) {
                        var h = f.likes[g];
                        if (!(h.pet_id < d)) {
                            for (var l = pets[h.pet_id].params, l = {
                                    parent1: f.item_id,
                                    parent2: l.item_id,
                                    level: Math.max(f.breeding_level, l.breeding_level),
                                    time: Math.max(f.happiness, l.happiness),
                                    xp: h.xp,
                                    offspring: []
                                }, m = 0; m < h.returns.length; m++) {
                                var k = h.returns[m],
                                    k = {
                                        id: pets[k.pet_id].params.item_id,
                                        min: Math.round(100 * k.base_chance),
                                        max: Math.round(100 * k.max_chance)
                                    };
                                k.show_both = k.min != k.max;
                                l.offspring.push(k)
                            }
                            sortArrayOfObjectsByFieldValueDesc(l.offspring,
                                "min");
                            b.push(l)
                        }
                    }
                    sortArrayOfObjectsByFieldValueAsc(b, "level")
                }
            }
            FormHelper.get_form("breeding_formulas").content.innerHTML = HandlebarTemplate.breeding_formulas_results()(b);
            document.getElementById("breeding_formulas_search").value = a || Breeding.formulas_search;
            Breeding.formulas_general_update_search();
            TableSorter.init(document.getElementById("breeding_formulas_results_table"))
        }
    },
    Minigames = {
        active: !1,
        type: void 0,
        id: "not active",
        scroll_id: 2026,
        use_scroll_dialog: function() {
            FormHelper.get_form("minigames_scroll").content.innerHTML =
                HandlebarTemplate.minigames_scroll_form()(["Arena", "Trivia"])
        },
        use_scroll_call: function() {
            FormHelper.hide_form("minigames_scroll");
            Socket.send("minigames", {
                sub: "default",
                command: "use_scroll",
                name: document.getElementById("minigames_scroll_location").value
            })
        },
        trivia: {
            player_position: {
                i: 10,
                j: 86,
                map: 19
            },
            host_position: {
                i: 9,
                j: 95,
                map: 19
            },
            settings: {
                questions: 10,
                host: !1
            },
            questions: [],
            possible_answers: [],
            current_question: 0,
            current_timer: 0,
            scores: [],
            open_host: function() {
                FormHelper.get_form("trivia_host").content.innerHTML =
                    HandlebarTemplate.trivia_host()(Minigames.trivia.questions)
            },
            open_client: function() {
                var a = FormHelper.get_form("trivia"),
                    b = JSON.clone(Minigames.trivia.scores),
                    b = sortArrayOfObjectsByFieldValueDesc(b, "score"),
                    d = !1,
                    e;
                for (e in b)
                    if (b[e].name == players[0].name) {
                        b[e].bold = !0;
                        b[e].question == Minigames.trivia.current_question && (d = !0);
                        break
                    }
                e = "";
                var f = !1,
                    g = document.getElementById("trivia_answer");
                g && !d && (e = g.value, document.activeElement && "trivia_answer" == document.activeElement.id && (f = !0));
                a.content.innerHTML =
                    HandlebarTemplate.trivia_client()({
                        button: 0 < Minigames.trivia.current_question && !d,
                        question: 0 < Minigames.trivia.current_question ? Minigames.trivia.questions[Minigames.trivia.current_question - 1].question : "Waiting...",
                        scores: b.splice(0, 16)
                    });
                g && !d && (document.getElementById("trivia_answer").value = e, f ? (document.getElementById("trivia_answer").selectionStart = e.length, document.getElementById("trivia_answer").selectionEnd = e.length, document.getElementById("trivia_answer").focus()) : GAME_STATE == GAME_STATES.GAME &&
                    document.getElementById("trivia_answer").focus());
                Minigames.trivia.update_time()
            },
            update_time: function() {
                if (FormHelper.is_form_visible("trivia")) {
                    Timers.set("update_time", function() {
                        Minigames.trivia.update_time()
                    }, 1E3);
                    var a = "-";
                    0 < 1E3 * -secondsPastDelta(Minigames.trivia.current_timer) && (a = beautifulTime(1E3 * -secondsPastDelta(Minigames.trivia.current_timer), 0), document.getElementById("trivia_answer") && GAME_STATE == GAME_STATES.GAME && document.getElementById("trivia_answer").focus());
                    document.getElementById("trivia_time_remaining").innerHTML =
                        a;
                    19 != players[0].map && FormHelper.hide_form("trivia")
                }
            },
            process_answer: function(a) {
                return (a + "").trim().toLowerCase()
            },
            validate_sanitize_questions: function(a) {
                var b = Minigames.trivia;
                if (!a || a.constructor !== Array) return {
                    ok: !1,
                    msg: "Invalid questions"
                };
                var d = [],
                    e;
                for (e in a) {
                    if ("object" !== typeof a[e] || !a[e].question || !a[e].answers) return {
                        ok: !1,
                        msg: "Question " + (parseInt(e) + 1) + " is invalid."
                    };
                    a[e].question = escapeHtml(a[e].question);
                    a[e].answers = escapeHtml(b.process_answer(a[e].answers));
                    if ("" == a[e].question ||
                        "" == a[e].answers) return {
                        ok: !1,
                        msg: "Question " + (parseInt(e) + 1) + " is invalid."
                    };
                    d.push({
                        question: a[e].question,
                        answers: a[e].answers
                    })
                }
                return 10 > d.length ? {
                    ok: !1,
                    msg: "10 questions is minimum"
                } : 45 < d.length ? {
                    ok: !1,
                    msg: "45 questions is maximum"
                } : {
                    ok: !0,
                    questions: d
                }
            },
            host_start: function() {
                var a = Minigames.trivia,
                    b = a.validate_sanitize_questions(a.questions);
                if (!b.ok) return addChatText(b.msg, void 0, COLOR.PINK);
                Minigames.trivia.open_host();
                Popup.prompt("Start the trivia?", function() {
                    Socket.send("minigames", {
                        sub: "trivia",
                        command: "start",
                        questions: a.questions
                    });
                    FormHelper.hide_form("trivia_host")
                }, null_function)
            },
            update_question: function(a) {
                Minigames.trivia.questions[a].question = document.getElementById("trivia_host_question_" + a).value;
                Minigames.trivia.questions[a].answers = document.getElementById("trivia_host_question_answers_" + a).value
            },
            remove_question: function(a) {
                Minigames.trivia.questions.splice(a, 1);
                Minigames.trivia.open_host()
            },
            add_question: function() {
                Minigames.trivia.questions.push({
                    question: "",
                    answers: ""
                });
                Minigames.trivia.open_host()
            },
            handle_client: function(a) {
                var b = Minigames.trivia;
                switch (a.command) {
                    case "open_host":
                        b.open_host();
                        break;
                    case "open_client":
                        b.open_client();
                        break;
                    case "data":
                        Minigames.trivia.scores = a.scores;
                        for (var d in Minigames.trivia.scores) Minigames.trivia.scores[d].name == players[0].name && (Minigames.trivia.scores[d].visible = !0);
                        Minigames.trivia.questions = a.questions;
                        Minigames.trivia.current_question = a.current_question;
                        Minigames.trivia.current_timer = a.current_timer;
                        FormHelper.is_form_visible("trivia") && Minigames.trivia.open_client();
                        break;
                    case "close":
                        FormHelper.hide_form("trivia")
                }
            },
            request_host: function() {
                Socket.send("minigames", {
                    sub: "trivia",
                    command: "request_host"
                })
            },
            request_client: function() {
                Socket.send("minigames", {
                    sub: "trivia",
                    command: "request_client"
                })
            },
            deactivate_client: function() {
                Socket.send("minigames", {
                    sub: "trivia",
                    command: "deactivate_client"
                })
            },
            submit_answer: function() {
                Socket.send("minigames", {
                    sub: "trivia",
                    command: "answer",
                    answer: document.getElementById("trivia_answer").value
                });
                document.getElementById("trivia_answer").value =
                    ""
            }
        }
    },
    arenablock_list_names = {};
Minigames.arena = {
    victory_conditions: {
        LAST_MAN_STANDING: 0,
        MOST_KILLS: 1,
        TOTAL_EXPERIENCE: 2,
        0: "Last man standing",
        1: "Most kills",
        2: "Total experience"
    },
    settings: {
        max_players: 16,
        maximum_respawns: 0,
        victory_condition: 0,
        skills: getEmptySkills(),
        inventory: [],
        preparation_time: 15,
        maximum_arena_time: 15,
        bet_amount: 2500,
        maximum_bets: 5,
        host: !1,
        keep_items: !1,
        teams: !1
    },
    xp_start: 0,
    current_timer: !1,
    start_time: 0,
    finish_time: 0,
    scores: [],
    players: {},
    bets: [],
    total_bets: 0,
    stage: 0,
    eliminated_counter: 0,
    xp_interval: 0,
    player_position: {
        i: 72,
        j: 27,
        map: 19
    },
    host_position: {
        i: 76,
        j: 23,
        map: 19
    },
    island_positions: [{
        i: 95,
        j: 5
    }, {
        i: 95,
        j: 14
    }, {
        i: 95,
        j: 23
    }, {
        i: 95,
        j: 32
    }, {
        i: 95,
        j: 41
    }, {
        i: 86,
        j: 41
    }, {
        i: 77,
        j: 41
    }, {
        i: 68,
        j: 41
    }, {
        i: 59,
        j: 41
    }, {
        i: 59,
        j: 32
    }, {
        i: 59,
        j: 23
    }, {
        i: 59,
        j: 14
    }, {
        i: 59,
        j: 5
    }, {
        i: 68,
        j: 5
    }, {
        i: 77,
        j: 5
    }, {
        i: 86,
        j: 5
    }],
    arena_positions: [{
        i: 84,
        j: 15
    }, {
        i: 84,
        j: 19
    }, {
        i: 84,
        j: 24
    }, {
        i: 84,
        j: 28
    }, {
        i: 84,
        j: 32
    }, {
        i: 80,
        j: 32
    }, {
        i: 75,
        j: 32
    }, {
        i: 71,
        j: 32
    }, {
        i: 67,
        j: 32
    }, {
        i: 67,
        j: 28
    }, {
        i: 67,
        j: 24
    }, {
        i: 67,
        j: 19
    }, {
        i: 67,
        j: 15
    }, {
        i: 71,
        j: 15
    }, {
        i: 75,
        j: 15
    }, {
        i: 80,
        j: 15
    }],
    open_client: function(a) {
        var b = Minigames.arena;
        a && (b.settings = a.settings, b.players = a.players, b.red_players = a.red_players, b.blue_players = a.blue_players, b.scores = a.scores, b.stage = a.stage, b.bets = a.bets);
        FormHelper.get_form("arena");
        a = document.getElementById("arena_join_bet");
        0 === b.scores.length ? (a.innerHTML = _ti("Join"), b.client_join()) : (a.innerHTML = _ti("Bet"), b.client_bet())
    },
    client_join: function() {
        var a = Minigames.arena;
        FormHelper.get_form("arena").content.innerHTML = HandlebarTemplate.arena_client_join()({
            players: a.players,
            max_players: a.settings.max_players,
            join_button: a.players < a.settings.max_players,
            teams: a.settings.teams,
            red_players: a.red_players,
            blue_players: a.blue_players
        })
    },
    client_join_button: function(a) {
        Socket.send("minigames", {
            sub: "arena",
            command: "client_join",
            team: a
        })
    },
    client_bet: function() {
        var a = Minigames.arena;
        FormHelper.get_form("arena").content.innerHTML = HandlebarTemplate.arena_client_bet()({
            bet_amount: a.settings.bet_amount,
            bets: a.client_bet_bets()
        })
    },
    client_bet_bets: function() {
        var a = Minigames.arena,
            b = [],
            d;
        for (d in a.scores) {
            var e = {
                id: d,
                total: 0,
                my: 0,
                name: !1
            };
            a.scores[d] && a.scores[d].name && (e.name = a.scores[d].name);
            for (var f in a.bets[d]) a.bets[d][f].name === players[0].name && (e.my += a.settings.bet_amount * a.bets[d][f].bet_count), e.total += a.settings.bet_amount * a.bets[d][f].bet_count;
            b.push(e)
        }
        a.settings.teams && 0 < a.settings.stage && (b = b.splice(0, 2), b[0] = b[0] || {
                id: 0,
                my: 0,
                total: 0
            }, b[0].name = _ti("Red team"), a.scores[0] = a.scores[0] || {
                index: 0
            }, a.scores[0].name = _ti("Red team"), b[1] = b[1] || {
                id: 1,
                my: 0,
                total: 0
            }, b[1].name = _ti("Blue team"), a.scores[1] =
            a.scores[1] || {
                index: 1
            }, a.scores[1].name = _ti("Blue team"));
        return b
    },
    client_bet_make_bet: function(a) {
        var b = Minigames.arena;
        b.settings.teams && 0 < b.settings.stage && (b.scores[0] = b.scores[0] || {
            index: 0
        }, b.scores[0].name = _ti("Red team"), b.scores[1] = b.scores[1] || {
            index: 1
        }, b.scores[1].name = _ti("Blue team"));
        Popup.prompt(_ti("Bet {amount} on {target}?", {
            amount: b.settings.bet_amount,
            target: b.scores[a].name
        }), function() {
            Socket.send("minigames", {
                sub: "arena",
                command: "client_make_bet",
                id: a
            })
        }, null_function)
    },
    client_rules: function() {
        var a =
            Minigames.arena,
            b = FormHelper.get_form("arena"),
            d = JSON.clone(a.settings);
        d.victory_condition = a.victory_conditions[d.victory_condition];
        b.content.innerHTML = HandlebarTemplate.arena_client_rules()(d)
    },
    client_stats: function() {
        var a = Minigames.arena,
            b = FormHelper.get_form("arena"),
            d = JSON.clone(a.settings);
        delete d.skills.breeding;
        delete d.skills.carpentry;
        delete d.skills.farming;
        for (var e in d.skills) d.skills[e] && "undefined" != typeof d.skills[e].current && (d.skills[e].name = capitaliseFirstLetter(e));
        b.content.innerHTML =
            HandlebarTemplate.arena_client_stats()({
                data: d,
                available: 0 < a.stage
            })
    },
    open_host: function() {
        Minigames.arena.host_skills()
    },
    host_skills: function() {
        var a = FormHelper.get_form("arena_host");
        Minigames.arena.settings.skills || (Minigames.arena.settings.skills = getEmptySkills());
        var b = JSON.clone(Minigames.arena.settings.skills),
            d;
        for (d in b) b[d] && "undefined" != typeof b[d].current && (b[d].name = capitaliseFirstLetter(d));
        delete b.breeding;
        delete b.carpentry;
        delete b.farming;
        a.content.innerHTML = HandlebarTemplate.arena_host_skills()(b)
    },
    update_skills: function(a) {
        var b = JSON.clone(Minigames.arena.settings.skills);
        delete b.breeding;
        delete b.carpentry;
        delete b.farming;
        for (var d in b) {
            var b = Math.range(parseInt(document.getElementById("arena_host_skill_" + d).value), 1, 150) || 1,
                e = Math.range(parseInt(document.getElementById("arena_host_multiplier_" + d).value), 1, 1E3) || 1;
            Minigames.arena.settings.skills[d].level = b;
            Minigames.arena.settings.skills[d].current = b;
            Minigames.arena.settings.skills[d].xp = Level.xp_for_level(b);
            Minigames.arena.settings.skills[d].multiplier =
                e
        }
        FormHelper.remember_focus(a.id);
        Minigames.arena.host_skills();
        FormHelper.restore_focus()
    },
    host_inventory_active_id: -1,
    host_inventory: function() {
        var a = FormHelper.get_form("arena_host");
        Minigames.arena.settings.inventory || (Minigames.arena.settings.inventory = []);
        a.content.innerHTML = HandlebarTemplate.arena_host_inventory()(Minigames.arena.settings.inventory);
        FormHelper.update_item_list_select("arena_host_inventory", 1, Minigames.arena.host_inventory_active_id || -1);
        Minigames.arena.host_inventory_update_description()
    },
    host_inventory_update_description: function() {
        Minigames.arena.host_inventory_active_id = document.getElementById("arena_host_inventory_items").value;
        document.getElementById("arena_host_inventory_item_img").style.cssText = "display:inline-block;width:32px;height:32px;margin: 0px; margin-top: 3px;" + Items.get_background_image(Minigames.arena.host_inventory_active_id);
        document.getElementById("arena_host_inventory_item_description").innerHTML = Items.info(Minigames.arena.host_inventory_active_id).trim()
    },
    host_inventory_add_item: function() {
        40 >
            Minigames.arena.settings.inventory.length && Minigames.arena.settings.inventory.push({
                id: parseInt(document.getElementById("arena_host_inventory_items").value),
                selected: !1
            });
        Minigames.arena.host_inventory()
    },
    host_inventory_remove_item: function(a) {
        Minigames.arena.settings.inventory.splice(a, 1);
        Minigames.arena.host_inventory()
    },
    host_start: function() {
        FormHelper.get_form("arena_host").content.innerHTML = HandlebarTemplate.arena_host_start()(Minigames.arena.settings);
        el = document.getElementById("arena_host_start_victory_condition");
        el.options[Minigames.arena.settings.victory_condition].selected = !0
    },
    host_start_update: function(a) {
        var b = document.getElementById("arena_host_start_preparation_time");
        Minigames.arena.settings.preparation_time = Math.range(parseInt(b.value), 1, 30) || 1;
        var b = document.getElementById("arena_host_start_maximum_time"),
            d = 5;
        1338 == config.http_port && (d = 1);
        Minigames.arena.settings.maximum_arena_time = Math.range(parseInt(b.value), d, 30) || d;
        b = document.getElementById("arena_host_start_bet_amount");
        Minigames.arena.settings.bet_amount =
            Math.range(parseInt(b.value), 1E3, 1E4) || 1E3;
        b = document.getElementById("arena_host_start_maximum_bets");
        Minigames.arena.settings.maximum_bets = Math.range(parseInt(b.value), 1, 16) || 1;
        b = document.getElementById("arena_host_start_victory_condition");
        Minigames.arena.settings.victory_condition = parseInt(b.value) || 0;
        b = document.getElementById("arena_host_start_maximum_respawns");
        Minigames.arena.settings.maximum_respawns = Math.range(parseInt(b.value), 0, 100) || 0;
        0 == Minigames.arena.settings.victory_condition && (Minigames.arena.settings.maximum_respawns =
            0);
        Minigames.arena.settings.keep_items = document.getElementById("arena_host_start_keep_items").checked;
        Minigames.arena.settings.teams = document.getElementById("arena_host_start_teams").checked;
        FormHelper.remember_focus(a.id);
        Minigames.arena.host_start();
        FormHelper.restore_focus()
    },
    host_start_start: function() {
        Popup.prompt(_ti("Start the arena?"), function() {
            Socket.send("minigames", {
                sub: "arena",
                command: "start",
                settings: Minigames.arena.settings
            });
            FormHelper.hide_form("arena_host")
        }, null_function)
    },
    handle_client: function(a) {
        var b =
            Minigames.arena;
        switch (a.command) {
            case "open_host":
                b.open_host();
                break;
            case "open_client":
                b.open_client(a.data);
                break;
            case "map_timer":
                MapTimer.init(function() {
                    return _tu(a.data.title)
                }, a.data.end_time, 19, !0)
        }
    },
    request_host: function() {
        Socket.send("minigames", {
            sub: "arena",
            command: "request_host"
        })
    },
    request_client: function() {
        Socket.send("minigames", {
            sub: "arena",
            command: "request_client"
        })
    }
};
var Mailbox = {
        id: 520,
        last_opened: 0,
        show: function(a) {
            var b = {
                    my_message: "",
                    owner: my_island(),
                    friends_only: last_mailbox.params.friends_only || !1,
                    me: players[0].name
                },
                d;
            for (d in a) a[d].date = a[d].date.split("T")[0];
            for (var e in a)
                if (a[e].from_player == players[0].name) {
                    b.my_message = a[e].message;
                    a.splice(e, 1);
                    break
                }
            b.messages = a;
            FormHelper.get_form("mailbox").content.innerHTML = HandlebarTemplate.mailbox_form()(b)
        },
        friends_toggle: function() {
            var a = document.getElementById("mailbox_friends_toggle");
            Socket.send("mailbox", {
                sub: "toggle_friends",
                friends_only: a.checked,
                position: {
                    i: last_mailbox.i - (300 == current_map ? 10 : 0),
                    j: last_mailbox.j - (300 == current_map ? 10 : 0)
                }
            })
        },
        change_my_message: function() {
            var a = document.getElementById("mailbox_my_message");
            a.value = a.value.filterChat("EN").sanitizeChat().substr(0, 160);
            removeClass(document.getElementById("mailbox_save_button"), "hidden")
        },
        delete_message: function(a) {
            Socket.send("mailbox", {
                sub: "delete",
                name: a,
                position: {
                    i: last_mailbox.i - (300 == current_map ? 10 : 0),
                    j: last_mailbox.j - (300 == current_map ?
                        10 : 0)
                }
            });
            Mailbox.request()
        },
        save_message: function(a) {
            a = document.getElementById("mailbox_my_message");
            Socket.send("mailbox", {
                sub: "save",
                message: a.value,
                position: {
                    i: last_mailbox.i - (300 == current_map ? 10 : 0),
                    j: last_mailbox.j - (300 == current_map ? 10 : 0)
                }
            });
            addClass(document.getElementById("mailbox_save_button"), "hidden")
        },
        request: function() {
            1E3 > timestamp() - Mailbox.last_opened || (Mailbox.last_opened = timestamp(), Socket.send("mailbox", {
                sub: "request",
                position: {
                    i: last_mailbox.i - (300 == current_map ? 10 : 0),
                    j: last_mailbox.j -
                        (300 == current_map ? 10 : 0)
                }
            }))
        }
    },
    spectator_player = {},
    total_spectators = 0,
    Spectate = {
        key: !1,
        keys: [],
        add_key: function(a) {
            -1 == Spectate.keys.indexOf(a) && Spectate.keys.push(a)
        },
        last_stream_time: 0,
        last_stream_list: [],
        server_streams_received: {},
        list_up_to_date: function() {
            return 1E4 > timestamp() - Spectate.last_stream_time
        },
        spectate_request: function(a) {
            socket.emit("spectator", {
                sub: "request",
                player: a,
                options: {
                    player: SpectateWindow.player,
                    key: SpectateWindow.key
                }
            })
        },
        spectate_stop: function() {
            socket.emit("spectator", {
                sub: "stop"
            })
        },
        spectate_streams: function() {
            5E3 < timestamp() - Spectate.last_stream_time ? (socket.emit("spectator", {
                sub: "streams",
                options: {
                    player: SpectateWindow.player,
                    key: SpectateWindow.key
                }
            }), Spectate.last_stream_time = timestamp()) : FormHelper.get_form("streams")
        },
        last_watch_requested: 0,
        watch: function(a, b) {
            Spectate.last_watch_requested = timestamp();
            document.getElementById("streams_form").style.display = "none";
            spectator_mode && Spectate.spectate_stop();
            ServerList.connect_by_prefix(a, function() {
                Spectate.spectate_request(b)
            })
        },
        set_spectator_text: function() {
            massAssignText([{
                name: "settings_spectators_value",
                text: players[0].temp.allow_spectators ? "on" : "off",
                translate: _ti
            }]);
            document.getElementById("settings_spectators").style.display = "block"
        },
        toggle_spectators: function() {
            Socket.send("set_spectators", {
                status: !players[0].temp.allow_spectators
            })
        },
        toggle_spectators_link: function() {
            SpectateWindow.slave ? Spectate.spectate_streams() : hasClass(document.getElementById("login_box"), "hidden") ? (removeClass(document.getElementById("login_box"),
                "hidden"), FormHelper.hide_form("streams"), document.getElementById("spectate_button_link").innerHTML = _ti("Spectate other players")) : (Spectate.spectate_streams(), addClass(document.getElementById("login_box"), "hidden"), document.getElementById("spectate_button_link").innerHTML = _ti("Show login dialog"))
        },
        filter_window: function(a) {
            a = RegExp(escapeRegExp(a), "i");
            for (var b = document.getElementsByClassName("spectate_row"), d = 0, e = b.length; d < e; d++) {
                for (var f = b[d].children, g = !1, h = 0; h < f.length; h++)
                    if (a.test(f[h].textContent)) {
                        g = !0;
                        break
                    }
                g ? removeClass(b[d], "hidden") : addClass(b[d], "hidden")
            }
        }
    },
    Tower = {
        active: "",
        entrance_positions: {
            cathedral: {
                i: 86,
                j: 13,
                map: 20
            },
            tower_nature: {
                i: 39,
                j: 81,
                map: 31
            },
            tower_ice: {
                i: 46,
                j: 91,
                map: 31
            },
            tower_fire: {
                i: 58,
                j: 93,
                map: 31
            }
        },
        maps: {
            cathedral: 22,
            tower_nature: 32,
            tower_ice: 33,
            tower_fire: 34
        },
        obj_names: {
            cathedral: object_base[522].name,
            tower_nature: object_base[603].name,
            tower_ice: object_base[604].name,
            tower_fire: object_base[602].name
        },
        by_map: {
            22: "cathedral",
            32: "tower_nature",
            33: "tower_ice",
            34: "tower_fire"
        },
        max_level: {
            cathedral: "102",
            tower_nature: "45",
            tower_ice: "66",
            tower_fire: "89"
        },
        cooldown: 2880,
        monster_positions: {
            cathedral: {},
            tower_nature: {},
            tower_ice: {},
            tower_fire: {}
        },
        monster_position_last: {
            cathedral: {},
            tower_nature: {},
            tower_ice: {},
            tower_fire: {}
        },
        start_monster: {
            cathedral: 343,
            tower_nature: 490,
            tower_ice: 535,
            tower_fire: 601
        },
        show_menu: function() {
            var a = "cathedral" == Tower.active ? "cathedral_run" : "tower",
                b = FormHelper.get_form(a),
                d = {};
            d.timer = !Tower.enough_time_has_passed(players[0], Tower.active);
            d.time_remaining =
                Tower.time_left(players[0], Tower.active);
            b.content.innerHTML = "cathedral" == Tower.active ? HandlebarTemplate.cathedral_new()(d) : HandlebarTemplate.tower_new()(d);
            d.timer && Timers.set("cathedral_run", function() {
                FormHelper.is_form_visible(a) && Tower.show_menu()
            }, 500)
        },
        close_menu: function() {
            Timers.clear("cathedral_run");
            "cathedral" == Tower.active ? FormHelper.hide_form("cathedral_run") : FormHelper.hide_form("tower")
        },
        client_start: function() {
            Tower.close_menu();
            Tower.standing_next_to_entrance(players[0], Tower.active) ?
                Socket.send("tower", {
                    sub: "start",
                    tower: Tower.active
                }) : "cathedral" == Tower.active ? addChatText(_te("Need to be standing next to the cathedral entrance!"), void 0, COLOR.PINK) : addChatText(_te("Need to be standing next to the tower entrance!"), void 0, COLOR.PINK)
        },
        client_reduce_time: function() {
            Tower.standing_next_to_entrance(players[0], Tower.active) ? 0 < Inventory.get_item_count(players[0], 1031) ? Socket.send("tower", {
                sub: "reduce_time",
                tower: Tower.active
            }) : addChatText(_te("You need a {item_name} to reduce cooldown time", {
                item_name: item_base[1031].name
            }), void 0, COLOR.PINK) : ("cathedral" == Tower.active ? addChatText(_te("Need to be standing next to the cathedral entrance!"), void 0, COLOR.PINK) : addChatText(_te("Need to be standing next to the tower entrance!"), void 0, COLOR.PINK), Tower.close_menu())
        },
        init_timer: function() {
            var a = Tower.by_map[players[0].map];
            a && MapTimer.init(function() {
                return players[0].temp.cathedral_level + "/" + Tower.max_level[a]
            }, players[0].temp[a + "_time"], Tower.maps[a], !1)
        },
        show_hall_of_fame: function(a) {
            Timers.clear("cathedral_run");
            if (FormHelper.is_form_visible("cathedral_run")) {
                var b = FormHelper.get_form("cathedral_run");
                b.content.innerHTML = _ti("Loading data...");
                if ("undefined" == typeof a) Socket.send("tower", {
                    sub: "hall_of_fame",
                    tower: Tower.active
                });
                else {
                    a = a.reverse();
                    for (var d in a) a[d].player == players[0].name && (a[d].me = !0);
                    switch (a.length) {
                        case 13:
                            a.splice(8, 2);
                            break;
                        case 12:
                            a.splice(9, 1)
                    }
                    b.content.innerHTML = HandlebarTemplate.cathedral_hall_of_fame()(a)
                }
            }
        },
        standing_next_to_entrance: function(a, b) {
            var d = Tower.entrance_positions[b];
            return d && a.map == d.map && 0 == distance(a.i, a.j, d.i, d.j)
        },
        time_left: function(a, b) {
            return Math.max(0, Tower.cooldown - minutesPastDelta(a.temp[b + "_time"]))
        },
        enough_time_has_passed: function(a, b) {
            return !Tower.time_left(a, b)
        },
        button_abuse_last: 0,
        button_abuse_start: 0,
        button_abuse_warned: !1,
        button_abuse_executed: !1,
        button_abuse: function() {
            var a = timestamp();
            500 < a - Tower.button_abuse_last && (Tower.button_abuse_start = a, Tower.button_abuse_warned = !1, Tower.button_abuse_executed = !1);
            Tower.button_abuse_last = a;
            3E4 < a - Tower.button_abuse_start &&
                !Tower.button_abuse_executed ? (Socket.send("tower", {
                    sub: "button_abuse",
                    tower: Tower.by_map[current_map]
                }), Tower.button_abuse_executed = !0) : 15E3 < a - Tower.button_abuse_start && !Tower.button_abuse_warned && (addChatText(_ti("Please release the movement button"), null, COLOR.PINK), Tower.button_abuse_warned = !0)
        },
        initialize_alerts: function() {
            for (var a in Tower.maps) Tower.initialize_alert(a)
        },
        initialize_alert: function(a) {
            Tower.time_left(players[0], a) ? Timers.set("tower_alert" + a, function() {
                addChatText(_ti("Cooldown for {item_name} has ended.", {
                    item_name: Tower.obj_names[a]
                }), void 0, COLOR.TEAL)
            }, 6E4 * Tower.time_left(players[0], a)) : Timers.clear("tower_alert" + a)
        }
    };