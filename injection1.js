/*
 BitSet.js v4.0.0 14/08/2015
 http://www.xarg.org/2014/03/javascript-bit-array/

 Copyright (c) 2016, Robert Eisele (robert@xarg.org)
 Dual licensed under the MIT or GPL Version 2 licenses.


 SoundManager 2: JavaScript Sound for the Web
 ----------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.97a.20150601
*/
var config = {
        http_port: 1337,
        gamescom_game_secret: "f6mwrlcy896ck00b3cylrh9gjd",
        facebook_app_id: "324922124269528"
    },
    Translate = {
        supported_languages: ["en"],
        settings: {
            en: {
                name: "English",
                flag: "EN.png"
            },
            "pt-br": {
                name: "Portugu\u00eas do Brasil",
                flag: "BR.png",
                rules: "https://mo.ee/rules_pt-br.html",
                showrules: !0
            },
            pt: {
                name: "Portugu\u00eas",
                flag: "PT.png",
                rules: "https://mo.ee/rules_pt.html",
                showrules: !0
            },
            ru: {
                name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
                flag: "RU.png"
            },
            de: {
                name: "Deutsch",
                flag: "DE.png"
            },
            es: {
                name: "Espa\u00f1ol",
                flag: "ES.png"
            },
            fr: {
                name: "Fran\u00e7ais",
                flag: "FR.png"
            },
            zh: {
                name: "\u4e2d\u6587",
                flag: "CN.png",
                rules: "https://mo.ee/rules_zh.html",
                showrules: !0
            },
            "zh-tw": {
                name: "\u4e2d\u6587(\u53f0\u7063)",
                flag: "TW.png",
                rules: "https://mo.ee/rules_zh-tw.html",
                showrules: !0
            },
            pl: {
                name: "J\u0119zyk polski",
                flag: "PL.png"
            },
            nl: {
                name: "Nederlands",
                flag: "NL.png"
            },
            sv: {
                name: "Svenska",
                flag: "SE.png"
            },
            it: {
                name: "Italiano",
                flag: "IT.png"
            },
            lt: {
                name: "Lietuvi\u0173 kalba",
                flag: "LT.png"
            },
            et: {
                name: "Eesti keel",
                flag: "EE.png"
            },
            da: {
                name: "Dansk",
                flag: "DK.png"
            },
            cs: {
                name: "\u010ce\u0161tina",
                flag: "CZ.png"
            }
        },
        by_steam: {
            brazilian: "pt-br",
            czech: "cs",
            danish: "da",
            dutch: "nl",
            english: "en",
            french: "fr",
            german: "de",
            italian: "it",
            polish: "pl",
            portuguese: "pt",
            russian: "ru",
            schinese: "zh",
            spanish: "es",
            swedish: "sv",
            tchinese: "zh-tw"
        },
        reverse_by_steam: {
            "pt-br": "brazilian",
            cs: "czech",
            da: "danish",
            nl: "dutch",
            en: "english",
            fr: "french",
            de: "german",
            it: "italian",
            pl: "polish",
            pt: "portuguese",
            ru: "russian",
            zh: "schinese",
            es: "spanish",
            sv: "swedish",
            "zh-tw": "tchinese"
        },
        initialize_language: function(a) {
            a =
                a || 0;
            if (5 != a) {
                var b = "en";
                if (localStorage.lang) b = localStorage.lang || "en";
                else if (Steam.enabled()) {
                    var d = greenworks.getCurrentGameLanguage();
                    default_lang = b = Translate.by_steam[d] || "en"
                } else default_lang && (b = default_lang);
                "en" != b && loadJSON(data_urls[Math.floor(data_urls.length * Math.random())] + "/language?l=" + b + "&t=" + timestamp(), function(a) {
                    a && (a.lang || a.lang_names) && Translate.load_language(b, a)
                }, function() {
                    Translate.initialize_language(a + 1)
                })
            }
        },
        load_language: function(a, b) {
            var d = {},
                e = !1,
                f = !1,
                g = function() {
                    e &&
                        f && Translate.merge_translate(d, a, function() {
                            Translate.supported_languages.push(a);
                            Translate.set_language(a)
                        })
                };
            Translate.load_language_main(0, a, b.lang, function(a) {
                try {
                    d = JSON.merge(d, a), f = !0, g()
                } catch (b) {
                    throw b;
                }
            });
            !b.lang_names || Translate.keep_names ? e = !0 : Translate.load_language_names(0, a, b.lang_names, function(a) {
                try {
                    d = JSON.merge(d, a), e = !0, g()
                } catch (b) {
                    throw b;
                }
            })
        },
        load_language_main: function(a, b, d, e) {
            5 != a && loadJSON(cdn_url + "lang/lang_" + b + ".json?" + d, function(a) {
                return e(a)
            }, function() {
                Translate.load_language_main(a +
                    1, b, d, e)
            })
        },
        load_language_names: function(a, b, d, e) {
            5 != a && loadJSON(cdn_url + "lang/lang_names_" + b + ".json?" + d, function(a) {
                return e(a)
            }, function() {
                Translate.load_language_names(a + 1, b, d, e)
            })
        },
        language_select_form: function(a) {
            var b = document.getElementById("language_select_form");
            hasClass(b, "hidden") && !a && removeClass(b, "hidden");
            a || loadJSON(data_urls[Math.floor(data_urls.length * Math.random())] + "/languages?t=" + timestamp(), function(a) {
                a && a.en && (Translate.settings = a, Translate.language_select_form(!0))
            }, function() {});
            for (var d in Translate.settings) Translate.settings[d].current = d == Translate.lang ? !0 : !1, Translate.settings[d].names = Translate.settings[d]["lang_names_" + d] ? !0 : !1, Translate.settings[d].visible = "en" == d || Translate.settings[d]["lang_" + d] ? !0 : !1;
            document.getElementById("languages_list").innerHTML = HandlebarTemplate.language_list()(Translate.settings);
            Translate.settings[Translate.lang].names ? document.getElementById("translate_names_box").style.visibility = "visible" : document.getElementById("translate_names_box").style.visibility =
                "hidden";
            0 == Translate.keep_names ? document.getElementById("translate_names").checked = !0 : document.getElementById("translate_names").checked = !1;
            setTimeout(function() {
                var a = document.getElementById("lang_div_" + Translate.lang);
                a && (a = a.offsetTop - 6, document.getElementById("languages_list").scrollTop = a)
            }, 50)
        },
        language_select_form_close: function() {
            addClass(document.getElementById("language_select_form"), "hidden");
            2 != socket_status && removeClass(document.getElementById("login_box"), "hidden")
        },
        language_select_form_choose: function(a) {
            localStorage.lang =
                a;
            "en" != a ? Translate.load_language(a, {
                lang: Translate.settings[a]["lang_" + a],
                lang_names: Translate.settings[a]["lang_names_" + a]
            }) : Translate.set_language("en")
        },
        toggle_keep_names: function() {
            Translate.keep_names = !Translate.keep_names;
            Translate.language_select_form(!0);
            var a = Translate.lang;
            Translate.lang = "en";
            Translate.set_language(a);
            localStorage.lang_names = Translate.keep_names ? "false" : "true"
        },
        set_language: function(a) {
            if (a != Translate.lang && -1 != Translate.supported_languages.indexOf(a)) {
                var b = Translate.lang;
                Translate.lang = a;
                CompiledTemplate = {};
                for (var d = document.querySelectorAll("[data-ti]"), e = 0, f = d.length; e < f; e++) d[e].getAttribute("data-ti") || "en" != b || d[e].setAttribute("data-ti", d[e].textContent), d[e].innerHTML = _ti(d[e].getAttribute("data-ti"), d[e].dataset);
                d = document.querySelectorAll("[title]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-title") || "en" != b || d[e].setAttribute("data-title", d[e].title), d[e].title = _ti(d[e].getAttribute("data-title") || d[e].getAttribute("title"), d[e].dataset);
                d = document.querySelectorAll("[data-tu]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tu") || "en" != b || d[e].setAttribute("data-tu", d[e].textContent), d[e].innerHTML = _tu(d[e].getAttribute("data-tu"), d[e].dataset);
                d = document.querySelectorAll("[data-ta]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-ta") || "en" != b || d[e].setAttribute("data-ta", d[e].textContent), d[e].innerHTML = _ta(d[e].getAttribute("data-ta"));
                d = document.querySelectorAll("[data-tq]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tq") || "en" != b || d[e].setAttribute("data-tq", d[e].textContent),
                    d[e].innerHTML = _tq(d[e].getAttribute("data-tq"));
                d = document.querySelectorAll("[data-tn]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tn") || "en" != b || d[e].setAttribute("data-tn", d[e].textContent), "option" == d[e].tagName.toLowerCase() ? d[e].value = _tn(d[e].getAttribute("data-tn")) : d[e].innerHTML = _tn(d[e].getAttribute("data-tn"));
                d = document.querySelectorAll("[data-tp]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tp") || "en" != b || d[e].setAttribute("data-tp", d[e].placeholder), d[e].placeholder = _ti(d[e].getAttribute("data-tp"));
                d = document.querySelectorAll("[data-tit]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tit") || "en" != b || d[e].setAttribute("data-tit", d[e].textContent), d[e].innerHTML = _tit(d[e].getAttribute("data-tit"), d[e].dataset);
                d = document.querySelectorAll("[data-tm]");
                for (e = 0; e < d.length; e++) d[e].getAttribute("data-tm") || "en" != b || d[e].setAttribute("data-tm", d[e].textContent), d[e].innerHTML = _tm(d[e].getAttribute("data-tm"), d[e].dataset);
                Market.init_item_category();
                setCanvasSize(!0);
                Translate.settings[a] && (b = document.getElementById("language_select_button"),
                    b.title = Translate.settings[a].name, b.style.background = 'url("https://mo.mo.ee/flags/' + Translate.settings[a].flag + '")', Translate.settings[a].rules ? setOnClickUrl(document.getElementsByClassName("rules_link_href")[0], Translate.settings[a].rules) : setOnClickUrl(document.getElementsByClassName("rules_link_href")[0], "https://mo.ee/rules.html"));
                Translate.language_select_form(!0)
            }
        },
        fallback: "en",
        lang: "en",
        keep_names: !1,
        fetch_from_server: function(a) {
            var b = {},
                d = !1,
                e = !1;
            Translate.keep_names = !1;
            var f = function() {
                d &&
                    e && Translate.merge_translate(b, a, function() {
                        addChatText("Language " + a + " loaded", void 0, COLOR.GREEN);
                        Translate.supported_languages.push(a);
                        Translate.set_language(a)
                    })
            };
            ServerStorage.get("lang_" + a, function(d) {
                e = !0;
                d ? b = JSON.merge(b, JSON.parse(decode_utf8(lzw_decode(d)))) : addChatText("Language " + a + " has not been translated yet", void 0, COLOR.GREEN);
                f()
            });
            ServerStorage.get("lang_names_" + a, function(a) {
                d = !0;
                a && (b = JSON.merge(b, JSON.parse(decode_utf8(lzw_decode(a)))));
                f()
            })
        },
        translate: function(a, b) {
            if (!a) return "";
            for (var d = Translate.translate_process(a, b), e = /\$(t.?.?)\((.+?)\)/; e.test(d);) {
                var f = e.exec(d),
                    g = _t;
                switch (f[1]) {
                    case "ti":
                        g = _ti;
                        break;
                    case "tc":
                        g = _tc;
                        break;
                    case "te":
                    case "tit":
                    case "ta":
                    case "tq":
                    case "tn":
                    case "tm":
                        g = _tm
                }
                var h = /["|'](.+?)["|'],? ?(\{.+?\})?/.exec(f[2]);
                if (h[2]) try {
                    h[2] = JSON.parse(h[2])
                } catch (l) {
                    console.log("Translation params parse failed", h[2]), h[2] = {}
                }
                g = g(h[1], h[2]);
                d = d.replace(f[0], g)
            }
            for (e = /{(.+?)}/; e.test(d);) f = e.exec(d), "{time}" == f[0] && "object" == typeof b[f[1]] ? (g = _tc(b[f[1]].format, {
                count: b[f[1]].count
            }), d = d.replace(f[0], g)) : "{btime}" == f[0] && "object" == typeof b[f[1]] ? (g = beautifulTimeT(b[f[1]].timestamp, b[f[1]].accuracy, b[f[1]].narrow), d = d.replace(f[0], g)) : "{item_name}" == f[0] ? (g = _tn(b[f[1]]), d = d.replace(f[0], g)) : "{quest}" == f[0] ? (g = _tn(b[f[1]]), _tq(b[f[1]]) != b[f[1]] && (g = _tq(b[f[1]])), d = d.replace(f[0], g)) : d = d.replace(f[0], b[f[1]]);
            d = d.replace(/\[yellow\]/g, "<font color='" + COLOR.YELLOW + "'>");
            d = d.replace(/\[\/yellow\]/g, "</font>");
            d = d.replace(/\[white\]/g, "<font color='" + COLOR.WHITE +
                "'>");
            d = d.replace(/\[\/white\]/g, "</font>");
            d = d.replace(/\[teal\]/g, "<font color='" + COLOR.TEAL + "'>");
            d = d.replace(/\[\/teal\]/g, "</font>");
            d = d.replace(/\[red\]/g, "<font color='" + COLOR.red + "'>");
            d = d.replace(/\[\/red\]/g, "</font>");
            d = d.replace(/\[bold\]/g, "<b>");
            d = d.replace(/\[\/bold\]/g, "</b>");
            return d = d.replace(/\[break\]/g, "</br>")
        },
        missing: {},
        translate_process: function(a, b) {
            var d = Translate,
                e = b.lang || d.lang,
                f = a,
                g = !b.uniq;
            b = b || {};
            b.count && (f += d.pluralize(b.count, e));
            if (b.ns) {
                "names" == b.ns && Translate.keep_names &&
                    (e = Translate.fallback);
                if (!lang[e] || !lang[e][b.ns] || !lang[e][b.ns][f]) {
                    if (e == d.fallback) return a;
                    g && "names" != b.ns && (Translate.missing[b.ns] = Translate.missing[b.ns] || {}, Translate.missing[b.ns][a] = "");
                    return d.translate_process(a, JSON.merge(b, {
                        lang: d.fallback
                    }))
                }
                return lang[e][b.ns][f].sanitizeChat()
            }
            return lang[e] && lang[e][f] ? lang[e][f].sanitizeChat() : e == d.fallback ? a : d.translate_process(a, JSON.merge(b, {
                lang: d.fallback
            }))
        },
        pluralize: function(a, b) {
            var d = Translate.plural_type(a, b);
            return 1 != d ? "_" + d : ""
        },
        plurals: function(a) {
            a = a || "en";
            if (-1 != "ach ak am arn br fil gun ln mfe mg mi oc tg ti tr uz wa".split(" ").indexOf(a) || -1 != "af an ast az bg bn ca da de dev el en eo es es_ar et eu fi fo fur fy gl gu ha he hi hu hy ia it kn ku lb mai ml mn mr nah nap nb ne nl nn no nso pa pap pms ps pt pt_br pt-br rm sco se si so son sq sv sw ta te tk ur yo".split(" ").indexOf(a)) return [1, 2];
            if (-1 != "ay bo cgg fa id ja jbo ka kk km ko ky lo ms sah su th tt ug vi wo zh zh_tw zh-tw".split(" ").indexOf(a)) return [1];
            if (-1 !=
                "be bs dz hr ru sr uk".split(" ").indexOf(a)) return [1, 2, 5];
            if ("ar" == a) return [0, 1, 2, 3, 11, 100];
            if (-1 != ["cs", "sk"].indexOf(a) || -1 != ["csb", "pl"].indexOf(a)) return [1, 2, 5];
            if ("fr" == a) return [1, 2];
            if ("lt" == a) return [1, 2, 10]
        },
        plural_type: function(a, b) {
            b = b || "en";
            if (-1 != "ach ak am arn br fil gun ln mfe mg mi oc tg ti tr uz wa".split(" ").indexOf(b)) return [1, 2][Number(1 < a)];
            if (-1 != "af an ast az bg bn ca da de dev el en eo es es_ar et eu fi fo fur fy gl gu ha he hi hu hy ia it kn ku lb mai ml mn mr nah nap nb ne nl nn no nso pa pap pms ps pt pt_br pt-br rm sco se si so son sq sv sw ta te tk ur yo".split(" ").indexOf(b)) return [1,
                2
            ][Number(1 != a)];
            if (-1 != "ay bo cgg fa id ja jbo ka kk km ko ky lo ms sah su th tt ug vi wo zh zh_tw zh-tw".split(" ").indexOf(b)) return [1];
            if (-1 != "be bs dz hr ru sr uk".split(" ").indexOf(b)) return [1, 2, 5][Number(1 == a % 10 && 11 != a % 100 ? 0 : 2 <= a % 10 && 4 >= a % 10 && (10 > a % 100 || 20 <= a % 100) ? 1 : 2)];
            if ("ar" == b) return [0, 1, 2, 3, 11, 100][Number(0 === a ? 0 : 1 == a ? 1 : 2 == a ? 2 : 3 <= a % 100 && 10 >= a % 100 ? 3 : 11 <= a % 100 ? 4 : 5)];
            if (-1 != ["cs", "sk"].indexOf(b)) return [1, 2, 5][Number(1 == a ? 0 : 2 <= a && 4 >= a ? 1 : 2)];
            if (-1 != ["csb", "pl"].indexOf(b)) return [1, 2, 5][Number(1 ==
                a ? 0 : 2 <= a % 10 && 4 >= a % 10 && (10 > a % 100 || 20 <= a % 100) ? 1 : 2)];
            if ("fr" == b) return [1, 2][Number(2 <= a)];
            if ("lt" == b) return [1, 2, 10][Number(1 == a % 10 && 11 != a % 100 ? 0 : 2 <= a % 10 && (10 > a % 100 || 20 <= a % 100) ? 1 : 2)]
        },
        external_window: !1,
        initialized: !1,
        cleanup_unused: function() {
            var a = [],
                b;
            for (b in lang.en)
                for (var d in lang[Translate.lang][b]) "undefined" != typeof lang.en[b][d] || /_/.test(d) || (a.push(d), delete lang[Translate.lang][b][d])
        },
        merge_translate: function(a, b, d) {
            if (!lang[b]) return lang[b] = a, d();
            var e = [],
                f = 0,
                g;
            for (g in a) {
                lang[b][g] =
                    lang[b][g] || {};
                for (var h in a[g]) !lang[b][g][h] && a[g][h] ? (lang[b][g][h] = a[g][h], f += 1) : a[g][h] && a[g][h] && lang[b][g][h] && a[g][h] != lang[b][g][h] && (translator_lang != b ? (lang[b][g][h] = a[g][h], f += 1) : e.push({
                    ns: g,
                    key: h,
                    orig: lang[b][g][h],
                    other: a[g][h]
                }))
            }
            0 != e.length ? (addChatText(e.length + " conflicts were found and need to be resolved. " + f + " translations were added without conflicts.", void 0, COLOR.PINK), Popup.prompt("Conflicts found! Auto resolve?", function() {
                Translate.auto_resolve_conflicts(e, {
                    total: e.length,
                    current: 0,
                    lang: b
                }, d)
            }, function() {
                Translate.resolve_conflict(e, {
                    total: e.length,
                    current: 0,
                    lang: b
                }, d)
            })) : (addChatText(f + " new translations were added.", void 0, COLOR.GREEN), d())
        },
        resolve_conflict: function(a, b, d) {
            if (0 == a.length) return d();
            var e = a.pop();
            b.current += 1;
            var f = "",
                f = b.current + "/" + b.total + "<br>" + escapeHtml(e.key);
            lang.hints && lang.hints[e.ns] && lang.hints[e.ns][e.key] && (f += " (" + lang.hints[e.ns][e.key] + ")");
            Popup.dual_prompt(f, escapeHtml(e.orig), function() {
                lang[b.lang][e.ns][e.key] = e.orig;
                Translate.resolve_conflict(a,
                    b, d)
            }, escapeHtml(e.other), function() {
                lang[b.lang][e.ns][e.key] = e.other;
                Translate.resolve_conflict(a, b, d)
            }, d)
        },
        auto_resolve_conflicts: function(a, b, d) {
            for (; 0 != a.length;) {
                var e = a.pop();
                b.current += 1;
                lang[b.lang][e.ns][e.key] = e.other
            }
            d()
        },
        open_interface: function() {
            if (!Translate.initialized) {
                for (var a = 0, b = item_base.length; a < b; a++) item_base[a] && (lang.en.names[item_base[a].name] = item_base[a].name, item_base[a].params.desc && (lang.en.item_description[item_base[a].params.desc] = item_base[a].params.desc));
                a = 0;
                for (b = object_base.length; a < b; a++) object_base[a] && object_base[a].name && (lang.en.names[object_base[a].name] = object_base[a].name, object_base[a].params.desc && (lang.en["interface"][object_base[a].params.desc] = object_base[a].params.desc));
                a = 0;
                for (b = npc_base.length; a < b; a++) npc_base[a] && (lang.en.names[npc_base[a].name] = npc_base[a].name, npc_base[a].params.desc && (lang.en["interface"][npc_base[a].params.desc] = npc_base[a].params.desc));
                a = 0;
                for (b = ItemPacks.length; a < b; a++) ItemPacks[a] && ItemPacks[a].enabled && (lang.en.names[ItemPacks[a].name] =
                    ItemPacks[a].name, ItemPacks[a].desc && !ItemPacks[a].is_premium && (lang.en["interface"][ItemPacks[a].desc] = ItemPacks[a].desc));
                a = 0;
                for (b = Achievements.list.length; a < b; a++) Achievements.list[a] && Achievements.list[a].name && (lang.en.achievements[Achievements.list[a].name] = Achievements.list[a].name, lang.en.achievements[Achievements.list[a].desc] = Achievements.list[a].desc);
                a = 0;
                for (b = quests.length; a < b; a++) quests[a] && quests[a].name && (lang.en.quests[quests[a].name] = quests[a].name);
                Translate.initialized = !0;
                Translate.cleanup_unused()
            }
            var d =
                Translate.external_window;
            if (d) d.focus();
            else {
                var b = /{count}/,
                    e = /_/,
                    f = 0,
                    g = 0;
                for (a in lang.en) {
                    lang[Translate.lang][a] = lang[Translate.lang][a] || {};
                    for (var h in lang.en[a])
                        if (!b.test(h)) lang[Translate.lang][a][h] = lang[Translate.lang][a][h] || "", f += 1, "" == lang[Translate.lang][a][h] && (g += 1);
                        else if (!e.test(h))
                        for (var l = Translate.plurals(Translate.lang), m = 0; m < l.length; m++) {
                            var k = "";
                            1 != l[m] && (k = "_" + l[m]);
                            lang[Translate.lang][a][h + k] = lang[Translate.lang][a][h + k] || "";
                            lang.hints[a] = lang.hints[a] || {};
                            lang.hints[a][h +
                                k
                            ] = "Translate so that {count} is equal to " + l[m] + ".";
                            "1" != l[m] && (lang.hints[a][h + k] = lang.hints[a][h + k] + " Don't add trailing _" + l[m]);
                            f += 1;
                            "" == lang[Translate.lang][a][h + k] && (g += 1)
                        }
                }
                addChatText("Translation progress on " + Translate.lang + " " + (f - g) + "/" + f + " (" + ((f - g) / f * 100).toFixed(2) + "%)", void 0, COLOR.TEAL);
                var d = window.open(),
                    v = !1;
                d.changedTranslation = function() {
                    v = !0
                };
                d.onbeforeunload = function(a) {
                    Translate.external_window = !1;
                    if (v) return "undefined" == typeof a && (a = d.event), a && (a.returnValue = "You have unsaved changes, are you sure you want to close?"),
                        "You have unsaved changes, are you sure you want to close?"
                };
                a = document.getElementById("translate_content").cloneNode(!0);
                removeClass(a, "hidden");
                d.document.body.appendChild(a);
                h = document.getElementById("stylesheet").cloneNode(!0);
                h.href = document.getElementById("stylesheet").href;
                d.document.body.appendChild(h);
                h = document.getElementById("game_font").cloneNode(!0);
                d.document.body.appendChild(h);
                a.innerHTML = HandlebarTemplate.translate_interface()(lang[Translate.lang]);
                d.hasClass = hasClass;
                d.removeClass =
                    removeClass;
                d.addClass = addClass;
                d.toggleNS = function(a) {
                    a = d.document.getElementsByClassName("ns_" + a);
                    for (var b = hasClass(a[0], "hidden"), e = 0, f = a.length; e < f; e++) b ? removeClass(a[e], "hidden") : addClass(a[e], "hidden")
                };
                d.applyTranslations = function() {
                    v = !1;
                    for (var a = d.document.getElementsByTagName("textarea"), b = Translate.lang, e = 0, f = a.length; e < f; e++) {
                        var g = a[e],
                            h = /ns_(\w+)/.exec(g.parentElement.parentElement.className)[1];
                        lang[Translate.lang][h][g.id.replace("trans_", "")] = g.value.trim()
                    }
                    Translate.set_language("en");
                    Translate.set_language(b);
                    d.announceProgress()
                };
                var q = timestamp();
                d.saveTranslations = function() {
                    d.applyTranslations();
                    if (1E3 > timestamp() - q) alert("Wait a bit more before pressing Save again");
                    else {
                        q = timestamp();
                        var a = {
                                names: JSON.clone(lang[Translate.lang].names)
                            },
                            b = JSON.clone(lang[Translate.lang]);
                        delete b.names;
                        ServerStorage.set("lang_" + Translate.lang, prepare_pack(JSON.stringify(b)));
                        setTimeout(function() {
                            ServerStorage.set("lang_names_" + Translate.lang, prepare_pack(JSON.stringify(a)))
                        }, 500)
                    }
                };
                d.closeWindow =
                    function() {
                        d.close()
                    };
                d.filterTranslation = function(a) {
                    for (var b = textToRegex(a), e = d.document.getElementsByClassName("translation"), f = 0, g = e.length; f < g; f++) {
                        var h = !1;
                        b.test(e[f].value) ? h = !0 : b.test(e[f].id.replace("trans_", "")) && (h = !0);
                        0 == a.length && (h = !1);
                        h ? removeClass(e[f].parentElement.parentElement, "hidden") : addClass(e[f].parentElement.parentElement, "hidden")
                    }
                };
                d.filterUntranslated = function() {
                    for (var a = d.document.getElementsByClassName("translation"), b = 0, e = a.length; b < e; b++) {
                        var f = !1;
                        "" == a[b].value &&
                            (f = !0);
                        f ? removeClass(a[b].parentElement.parentElement, "hidden") : addClass(a[b].parentElement.parentElement, "hidden")
                    }
                };
                d.filterUntranslatedExceptNames = function() {
                    for (var a = d.document.getElementsByClassName("translation"), b = 0, e = a.length; b < e; b++) {
                        var f = !1;
                        "names" != /ns_(\w+)/.exec(a[b].parentElement.parentElement.className)[1] && "" == a[b].value && (f = !0);
                        f ? removeClass(a[b].parentElement.parentElement, "hidden") : addClass(a[b].parentElement.parentElement, "hidden")
                    }
                };
                d.keyRelease = function(a) {
                    13 == (a.charCode ||
                        a.keyCode) && d.filterTranslation(d.document.getElementById("translate_search").value)
                };
                d.document.getElementById("translate_search").onkeyup = d.keyRelease;
                d.updateFromSource = function() {
                    v = !1;
                    for (var a = d.document.getElementsByTagName("textarea"), b = 0, e = a.length; b < e; b++) {
                        var f = a[b],
                            g = /ns_(\w+)/.exec(f.parentElement.parentElement.className)[1];
                        f.value = lang[Translate.lang][g][f.id.replace("trans_", "")]
                    }
                };
                d.announceProgress = function() {
                    var a = 0,
                        b = 0,
                        d;
                    for (d in lang[Translate.lang]) {
                        lang[Translate.lang][d] = lang[Translate.lang][d] || {};
                        for (var e in lang[Translate.lang][d]) a += 1, "" == lang[Translate.lang][d][e] && (b += 1)
                    }
                    addChatText("Translation progress on " + Translate.lang + " " + (a - b) + "/" + a + " (" + ((a - b) / a * 100).toFixed(2) + "%)", void 0, COLOR.TEAL)
                };
                d.document.onkeyup = function(a) {
                    a.view && (!a.view.opener || a.view.opener && a.view.opener.closed) && (v = !1, a.view.document.body.innerHTML = "Parent window was closed.")
                };
                d.document.body.style["user-select"] = "initial";
                d.document.body.style["-webkit-user-select"] = "initial";
                Translate.external_window = d;
                d.external_window =
                    d
            }
        }
    },
    _t = Translate.translate,
    _tc = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "calendar"
        }, b || {}))
    },
    _te = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "errors"
        }, b || {}))
    },
    _ti = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "interface"
        }, b || {}))
    },
    _tn = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "names"
        }, b || {}))
    },
    _ta = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "achievements"
        }, b || {}))
    },
    _tq = function(a, b) {
        return Translate.translate(a, JSON.merge({
                ns: "quests"
            },
            b || {}))
    },
    _tit = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "item_description"
        }, b || {}))
    },
    _tm = function(a, b) {
        return Translate.translate(a, JSON.merge({
            ns: "mods"
        }, b || {}))
    },
    _tu = function(a, b) {
        return Translate.translate(a, JSON.merge({
            uniq: !0
        }, b || {}))
    },
    lang = lang || {};
lang.en = {
    errors: {
        "Need to be inside a town to use this item": "",
        "Cannot do that yet": "",
        "Cannot do that": "",
        "You need a '{item_name}' to do that": "",
        "You need {amount}x '{item_name}' to do that": "",
        "Your combat level {level} is not within boundaries": "",
        "Player {player} is not ready or is unresponsive.": "",
        "Party cannot be started, you need to be inside a town!": "",
        "Requested party does not exist anymore, refresh list.": "",
        "Friends only!": "",
        "Need to be inside a town to create or join a party quest.": "",
        "Already in a party quest. Leave from it first!": "",
        "Sorry, maximum of 20 active party quests allowed per server. Try again in a few minutes or join another party.": "",
        "This party already has 4 members": "",
        "Cannot ignore a moderator or an admin.": "",
        "Player not found": "",
        "Already upgraded": "",
        "Not enough coins, need {amount} to upgrade": "",
        "Not enough MOS, need {amount} to upgrade": "",
        "This pouch has a limit {amount} of each spell!": "",
        "Not enough free space in your magic pouch!": "",
        "You need a magic pouch!": "",
        "You can only carry same type of arrows in the quiver!": "",
        "Your quiver is full!": "",
        "You need a quiver to store arrows!": "",
        "Warning! There is no email associated with your account. If you lose your password you can't get back in. Your account is also vulnerable to hijacking. Go to Settings -> Player info to secure your account.": "",
        "I need a quiver with arrows to shoot.": "",
        "I am out of arrows.": "",
        "Cannot get a clear shot from here.": "",
        "Invalid target": "",
        "Cannot shoot that far.": "",
        "Shot missed.": "",
        "Not enough arrows left to convert into an item.": "",
        "Can only remove arrows when the chest is open.": "",
        "This pet cannot be used for breeding!": "",
        "You need {level} breeding for {item_name}": "",
        "No permissions": "",
        "Pet not found": "",
        "Not yet ready to breed": "",
        "3 free inventory spaces are required.": "",
        "{count} free inventory space is required.": "",
        "{count} free inventory space is required._2": "{count} free inventory spaces are required.",
        "Already insured": "",
        "Cannot insure a dead pet": "",
        "Not enough coins, need {amount} to insure": "",
        "Not enough MOS, need {amount} to insure": "",
        "Cannot feed a dead pet": "",
        "Pet is not hungry": "",
        "Not enough food": "",
        "Pet does not eat this": "",
        "Nest is already occupied": "",
        "No such pet in inventory": "",
        "Your inventory is full!": "",
        "Maximum size reached!": "",
        "Requires level {level} carpentry": "",
        "Requires level {level} fletching": "",
        "Requires level {level} forging": "",
        "Chest is full!": "",
        "Not enough materials!": "",
        "Remove items from object first!": "",
        "Cannot remove this fence, remove nest first!": "",
        "Needs to be inside a fence!": "",
        "Only 2 nests per pen allowed!": "",
        "Area too small!": "",
        "Only nests are allowed inside the fence!": "",
        "Cannot place a chest so close to a fletching table. There needs to be at least 3 squares between them.": "",
        "Cannot place a fletching table so close to a chest. There needs to be at least 3 squares between them.": "",
        "Cannot remove nest, remove pet first!": "",
        "Need to be standing next to the cathedral entrance!": "",
        "You need a {item_name} to reduce cooldown time": "",
        "Cannot save a search dungeon map!": "",
        "You can't harvest this plant. Revive it with a watering can.": "",
        "Monster is reserved for {time}": "",
        "Other player is blocking multicombat": "",
        "This position is taken.": "",
        "You failed. (missed {percent}%)": "",
        "You failed.": "",
        "I think that I'm missing something.": "",
        "I need a forging hammer to use an anvil.": "",
        "Multilogin prevented! Trading between accounts is forbidden.": "",
        "Your text contained a bad word and was blocked, swearing is prohibited in this channel.": "",
        "Your text contained a bad word and was blocked.": "",
        "Your text contained too much CAPS, we do not tolerate spam.": "",
        "Your text contained too many symbols, we do not tolerate spam.": "",
        "Your text contained too many same characters in a row, we do not tolerate spam.": "",
        "You already sent the same text, we do not tolerate spam.": "",
        "This mailbox is only for friends!": "",
        "I think that I need a better tool.": "",
        "I need a rake to do that.": "",
        "I need a seed to do that.": "",
        "I need to wait {time}.": "",
        "You are out of water.": "",
        "You are already fully healed": "",
        "No streams available": "",
        "Connection lost... attempting to reconnect...": "",
        "Server maintenance... attempting to reconnect...": "",
        "Cannot do that in a fight": "",
        "Can only use this spell in a fight": "",
        "You have been sentenced to jail for getting -5 penalty points or breaking the rules": "",
        "Can only use this command when danger level is 0": "",
        "Need to have a premium account to play on this world. Premium account costs 500 MOS per 30 days. To buy premium write [teal]/premium[/teal] in chat. To test ping of all servers write [teal]/ping all[/teal][break][break]Reasons to go premium:": "",
        "You do not have enough MOS points!": "",
        "Already max size": "",
        "Need to be on your island": "",
        "Already on max level!": "",
        "Not enough {item_name}": "",
        "Not enough MOS": "",
        "Not enough coins": "",
        "Player {player} has already been muted.": "",
        "Already reported {player} in the last 15 minutes.": "",
        "You have too many active offers!": "",
        "Not enough items!": "",
        "Trading between your alts is forbidden! Market locked until next login.": "",
        "Invalid count, refresh offer!": "",
        "Can only buy premium when less than 30 days left.": "",
        "Not enough MOS, need {amount} to go premium.": "",
        "Cannot use reporting while muted": "",
        "Need to be standing next to {target}!": "",
        "Player {player} does not have an island.": "",
        "Need to be inside a town to participate in minigames!": "",
        "No active minigame!": "",
        "{player} is offline": "",
        "Global chat has been temporarily disabled": "",
        "Not enough coins, need {amount} to change theme": "",
        "Not enough MOS, need {amount} to change theme": "",
        "You have not unlocked that theme.": "",
        "Both players have to be level {amount} combat to duel!": "",
        "Need to be idle for 5 seconds before you can log out.": "",
        "You dont have enough achievement points.": "",
        "Not high enough danger level!": "",
        "You need {requirements} to use {item_name}": "",
        "Invalid amount of players": "",
        "Invalid maximum respawns": "",
        "Invalid victory condition": "",
        "Invalid skills": "",
        "Invalid {skill} level": "",
        "Invalid {skill} multiplier": "",
        "Invalid inventory": "",
        "Invalid inventory item at position {position}": "",
        "Illegal inventory item at position {position}": "",
        "Invalid preparation time": "",
        "Invalid arena time": "",
        "Invalid bet amount": "",
        "Invalid maximum bets": "",
        "Invalid value for keep items": "",
        "Invalid value for teams": "",
        "Total time should be between 10 to 45 minutes.": "",
        "A minigame is already running!": "",
        "Server maintenance is happening before arena can end!": "",
        "Server maintenance in less than 30 minutes!": "",
        "No active minigame on world {world}!": "",
        "Arena has already started!": "",
        "Already joined!": "",
        "No free seats!": "",
        "You are banned from participating in arenas!": "",
        "You left the arena!": "",
        "Betting is only possible during preparation time!": "",
        "Already bet maximum amount!": "",
        "Remove item from that slot first!": "",
        "Please check the duel settings and don't double click Accept": "",
        "Not enough coins, need {amount} to create a guild.": "",
        "Not enough MOS, need {amount} to create a guild.": "",
        "Sorry, maximum of {amount} active guilds allowed per world. Try again in a few minutes or go to a different world.": "",
        "You already belong to a guild. You need to leave that guild first.": "",
        "You need to have at least level {amount} combat to start a guild.": "",
        "You are not in any guild!": "",
        "I need to be wearing something before I can enter": "",
        "Cannot duel with a custom look! Go to an armor stand and disable it first.": "",
        "Warning! Other player is using a customized look!": "",
        "No formulas available": "",
        "No formula chosen": "",
        "Missing a component": "",
        "You are using an outdated version of the game that may have some bugs. Clear cache and reload to get up to date version.": "",
        "You are already carrying the maximum amount of water": "",
        "I already have one '{item_name}'": "",
        "Automatic cache cleaning does not work here. Please clear it manually.": "",
        "You are not subscribed to channel {channel}!": "",
        "You need to have an active premium to do that. You can buy it by typing to chat /premium": "",
        "Channel {channel} is already in use.": "",
        "Need to be standing next to the tower entrance!": "",
        "Need to remove excessive items from the pet inventory first!": "",
        "You have excessive pet inventory items from the last pet.": "",
        "You are currently banned from posting offers on market.": "",
        "Scavenger hunt time unknown!": ""
    },
    item_description: {
        "+ {heals} health": "",
        "heals {amount} health per 2 seconds": "",
        accuracy: "",
        strength: "",
        defense: "",
        health: "",
        magic: "",
        archery: "",
        woodcutting: "",
        alchemy: "",
        fletching: "",
        farming: "",
        fishing: "",
        cooking: "",
        jewelry: "",
        carpentry: "",
        forging: "",
        mining: "",
        breeding: "",
        "contains {amount} out of {total} units of water": "",
        aim: "",
        power: "",
        armor: "",
        archery: "",
        "arrow speed": "",
        "arrow max damage": "",
        "arrow range": "",
        "{second}s cooldown": "",
        speed: "",
        range: "",
        "max damage": "",
        uses: "",
        "magic slots": "",
        "holds {amount} arrows": "",
        cooldown: "",
        "can store up to {amount} items": "",
        "blocks {percent}% of magical damage": "",
        "blocks {percent}% of melee damage": "",
        "blocks {percent}% of archery damage": "",
        "restores health {percent}% faster": "",
        head: "",
        back: "",
        body: "",
        "both hands": "",
        "right hand": "",
        "left hand": "",
        hands: "",
        legs: "",
        neck: "",
        fingers: "",
        "use only": "",
        pants: "",
        "+ {amount} inventory slots": "",
        level: "",
        pet: "",
        preservation: "",
        mage: "",
        key: "",
        arrow: "",
        contains: ""
    },
    "interface": {
        Close: "",
        wiki: "",
        "Walk here": "",
        "Pet menu": "",
        Attack: "",
        "Duel with": "",
        Water: "",
        Chop: "",
        Mine: "",
        Dig: "",
        "Trade with": "",
        Catch: "",
        Access: "",
        "Cook on": "",
        Makeover: "",
        Talk: "",
        Rake: "",
        Seed: "",
        Harvest: "",
        "Check loot": "",
        Open: "",
        "Sleep in": "",
        Permissions: "",
        "Remove friend": "",
        "Add friend": "",
        "Remove ignore": "",
        "Remove message": "",
        Chat: "",
        Filters: "",
        Contacts: "",
        Quests: "",
        "Buy items and coins": "",
        "Spectate other players": "",
        "Show login dialog": "",
        Menu: "",
        "Game options": "",
        "Spectate mode": "",
        "Fighting mode": "",
        controlled: "",
        aggressive: "",
        defensive: "",
        accurate: "",
        cordial: "",
        "MOS Market": "",
        "Refer a Friend": "",
        "Visit homepage": "",
        Highscores: "",
        "Game forum": "",
        Logout: "",
        "Enable mods": "",
        "Back to game": "",
        "View another": "",
        Skills: "",
        Accuracy: "",
        Strength: "",
        Defense: "",
        Health: "",
        Magic: "",
        Archery: "",
        Woodcutting: "",
        Alchemy: "",
        Fletching: "",
        Farming: "",
        Fishing: "",
        Cooking: "",
        Jewelry: "",
        Carpentry: "",
        Forging: "",
        Mining: "",
        Breeding: "",
        "Equipment bonus": "",
        Armour: "",
        Power: "",
        Aim: "",
        Speed: "",
        "Total xp": "",
        "Next in": "",
        "Player info": "",
        "First name": "",
        "Last name": "",
        "E-mail": "",
        Country: "",
        Birthday: "",
        Month: "",
        Day: "",
        Year: "",
        Newsletter: "",
        Save: "",
        "Reset password": "",
        "We won`t share your data with anybody.": "",
        "NB! E-mail is required to reset password.": "",
        Security: "",
        "You already have enabled 2-step authentication on your account. Setting it up again will invalidate the previous code.": "",
        "Download an Authenticator App": "",
        "Install an authenticator app like [bold]Google Authenticator[/bold], [bold]Authy[/bold], [bold]Duo Mobile[/bold] or [bold]1Password[/bold] on your mobile or tablet device.": "",
        "Scan this Barcode": "",
        "Use your authenticator app to scan the barcode below.": "",
        "If you cannot scan this barcode, manually enter the following code.": "",
        "Enter your Authentication Code": "",
        "Enter the 6-digit code generated by your authenticator app.": "",
        "Verify and enable": "",
        "Invalid code!": "",
        Continue: "",
        "Remove current": "",
        "Code verified. 2-step authentication enabled.": "",
        "Open pet menu": "",
        "Equipping another pet will remove the previous pet's experience! Continue?": "",
        "Danger level": "",
        "PVP Loot": "",
        Active: "",
        Completed: "",
        "Kill Quests": "",
        "Party Quests": "",
        Achievements: "",
        Task: "",
        Progress: "",
        Location: "",
        Reward: "",
        Restart: "",
        experience: "",
        coins: "",
        "Quest {quest} complete!": "",
        Party: "",
        List: "",
        "Create New": "",
        "Hall of Fame": "",
        Difficulty: "",
        Players: "",
        "Combat level": "",
        Join: "",
        World: "",
        Player: "",
        Points: "",
        Wins: "",
        Plays: "",
        "Items are NOT safe if you die in a party dungeon.": "",
        Easy: "",
        Normal: "",
        Hard: "",
        Hell: "",
        Cooldown: "",
        "Friends only": "",
        "Time remaining": "",
        Create: "",
        "Loading data...": "",
        "No active parties available!": "",
        Leave: "",
        Start: "",
        Kick: "",
        "New difficulty unlocked!": "",
        "Time is up! Quest failed.": "",
        "Kill counts": "",
        started: "",
        "party quest in the world": "",
        Locked: "",
        Earned: "",
        Rewards: "",
        "Achievement '{achievement}' earned!": "",
        "Achievement '{achievement}' unlocked!": "",
        "Confirm purchase of": "",
        Buy: "",
        Download: "",
        Grade: "",
        Common: "",
        Rare: "",
        Legendary: "",
        "Starting another quest will end the current quest! Continue?": "",
        "{btime} until automatic refresh.": "",
        Friends: "",
        Ignore: "",
        Channels: "",
        Actions: "",
        Whisper: "",
        Remove: "",
        Accept: "",
        Reject: "",
        "Insert username": "",
        "Add a new friend": "",
        "Ignore a player": "",
        Channel: "",
        Unsubscribe: "",
        Subscribe: "",
        Offline: "",
        "Remove friend?": "",
        "Remove ignore?": "",
        "Remove member?": "",
        "Destroy channel?": "",
        "Delete tab?": "",
        Invite: "",
        "Create a channel": "",
        "You already own a private channel": "",
        "Channel name (1-3 symbols)": "",
        Owner: "",
        "List moderator": "",
        "Chat moderator": "",
        Member: "",
        Invited: "",
        "Player {player} has invited you to join channel {channel}.": "",
        Yes: "",
        No: "",
        OK: "",
        Cancel: "",
        Max: "",
        Chest: "",
        Market: "",
        "You have": "",
        "Do you want to destroy {item_name}?": "",
        "Do you want to upgrade your chest?": "",
        "Use all": "",
        Use: "",
        Inspect: "",
        Deposit: "",
        "Deposit 1": "",
        "Deposit X": "",
        "Deposit all": "",
        "Withdraw X": "",
        Withdraw: "",
        Destroy: "",
        "How many to withdraw? Maximum is {amount}": "",
        "How many to deposit? Maximum is {amount}": "",
        "Market Buy": "",
        "Market Sell": "",
        "Chest loot: {item_name}": "",
        Search: "",
        Transactions: "",
        "New offer": "",
        Sell: "",
        "Price range": "",
        Min: "",
        "Item name": "",
        All: "",
        "All categories": "",
        "By item": "",
        "By player": "",
        "My chest": "",
        "Too many items match {search}. Please specify!": "",
        "Buying price for this item must be at least {amount} (10%)": "",
        Offers: "",
        Item: "",
        Count: "",
        Price: "",
        User: "",
        Type: "",
        Items: "",
        From: "",
        Description: "",
        Vendor: "",
        "Total cost": "",
        To: "",
        Everybody: "",
        "out of": "",
        "Make offer": "",
        "Each offer lasts 24 hours. You can have {amount} active offers.": "",
        Upgrade: "",
        "Upgrade your max market offers by 5?": "",
        Armors: "",
        Foods: "",
        Jewelry: "",
        Materials: "",
        Tools: "",
        Weapons: "",
        Spells: "",
        Pets: "",
        House: "",
        Jewellery: "",
        "New market transaction: {item_name}": "",
        Shop: "",
        "Buy for {price}": "",
        "Sell one for {price}": "",
        "Sell all": "",
        "Help/forums": "",
        "{count} online": "",
        "{count} online_2": "{count} online",
        Premium: "",
        Password: "",
        "Login/Register": "",
        "By creating a character in this game, you have agreed to follow the rules at": "",
        "Problems with connection? Try https protocol": "",
        "You need to fill in all fields!": "",
        "Password has to be at least 6 symbols!": "",
        "User already logged in!": "",
        "Reload game!": "",
        "Use {provider} to login": "",
        "Account name in use!": "",
        "World is full!": "",
        "Authorization failed! Refresh?": "",
        "Server maintenance": "",
        "Too many accounts for IP": "",
        "Premium only": "",
        "Wrong password": "",
        Connected: "",
        Disconnected: "",
        "Reconnecting in {seconds} seconds": "",
        Reset: "",
        "Instructions sent": "",
        "New password": "",
        "Repeat password": "",
        "Set password": "",
        Back: "",
        "Invalid user": "",
        "Invalid e-mail": "",
        "Passwords do not match": "",
        "Updated!": "",
        "Updating...": "",
        "Your ping to World {world} is: {time}ms": "",
        "Cannot reach World {world}. It might be going through a maintenance.": "",
        "You feel a bit better": "",
        "You feel more experienced": "",
        "{count} coin": "",
        "{count} coin_2": "{count} coins",
        "Loot: {item_name}": "",
        Name: "",
        Gender: "",
        Male: "",
        Female: "",
        Change: "",
        Head: "",
        Shirt: "",
        Pants: "",
        "Facial Hair": "",
        "Pet Nest": "",
        "Access mate`s nest": "",
        "No pet": "",
        "Remove pet": "",
        Breed: "",
        Happiness: "",
        "Happy in {time} minutes": "",
        Hunger: "",
        "Dies from famine in {time} minutes": "",
        "Insure pet": "",
        Likes: "",
        Eats: "",
        Inventory: "",
        "Cancel breeding? Progress will be lost.": "",
        "Breeding failed.": "",
        "Mother {item_name} died giving birth.": "",
        "Do you want to insure your pet in case of death?": "",
        "Warning! Pet {item_name} has reached 75% hunger.": "",
        General: "",
        Results: "",
        Pet: "",
        Parent: "",
        Offspring: "",
        Experience: "",
        "This is a captcha! It is used to make sure you are not a robot. Fill these, because 5 misses = BAN!": "",
        "Accept to receive desktop notifications when you are tabbed out about [teal]2x experience events[/teal], [yellow]whispers[/yellow] and [red]captchas.[/red]": "",
        "An anti-bot captcha challenge has appeared! Do not miss these!": "",
        "{player} sent you a whisper!": "",
        "Current experience rate is 2x": "",
        "Arena starts in 10 minutes": "",
        "Trivia starts in 10 minutes": "",
        "Open build menu": "",
        "Remove objects": "",
        Rotate: "",
        Ground: "",
        Objects: "",
        Current: "",
        "Building menu": "",
        Floors: "",
        Walls: "",
        Island: "",
        Buildings: "",
        "Only available": "",
        "All formulas": "",
        Make: "",
        Place: "",
        carpentry: "",
        "Island theme": "",
        "Dorpat Green": "",
        Sand: "",
        Snow: "",
        "Spring Forest": "",
        "Whiland Green": "",
        "Walco Ground": "",
        Clouds: "",
        "Blood River": "",
        Broceliande: "",
        "Island size": "",
        "current level": "",
        "Provide materials": "",
        Ship: "",
        "Add additional materials to the ship?": "",
        "Upgrade your island to {size}x{size}?": "",
        "Change island theme to {theme}?": "",
        "Map size upgraded!": "",
        "Sleeping in {item_name} healed {amount} health": "",
        "Cathedral run": "",
        Level: "",
        Time: "",
        "Items are safe if you die in a cathedral run.": "",
        "Items are safe if you die in a tower battle.": "",
        "Please release the movement button": "",
        "Cooldown for {item_name} has ended.": "",
        Report: "",
        "Message removed by {player}": "",
        "You have {time} of premium time left": "",
        "Premium account costs 500 MOS per 30 days. Do you want to buy it?": "",
        "Time left:": "",
        "I can cook some raw food on this.": "",
        "I can mix food in here.": "",
        "Requires level 1 fishing and a fishing rod.": "",
        "Requires level 50 fishing and a wooden harpoon.": "",
        "Requires level 5 fishing and a fishing net.": "",
        "Requires level 63 fishing and a steel harpoon.": "",
        "Requires level 35 fishing and a cage.": "",
        "Requires level 65 fishing and an iron fishing rod.": "",
        "Requires level 95 fishing and a Poseidon's trident.": "",
        "Anvil enables me to make different items and enchant them.": "",
        Duelling: "",
        "My stake": "",
        "Other's stake": "",
        Conditions: "",
        "No running": "",
        "No magic": "",
        "Other has accepted": "",
        "Duel!": "",
        "Waiting for other player...": "",
        "Other player has cancelled the duel request.": "",
        "Plant is revived and starts to grow again": "",
        "Plant is feeling refreshed": "",
        "Your watering can is now filled with water": "",
        "enemy blocked {enemy_damage} damage": "",
        "Blocked {damage} magic damage": "",
        "magic damage": "",
        "Blocked {damage} archery damage": "",
        "archery damage": "",
        "You ran away.": "",
        "Enemy has fled.": "",
        "A loot crate has appeared at coordinates {x}, {y}": "",
        Options: "",
        Game: "",
        Video: "",
        Audio: "",
        "Enable notifications": "",
        "Toggle Smoother Interface by leriel": "",
        "Toggle interface transparency": "",
        "Permanent health bar": "",
        "Skill xp effects": "",
        "Block multicombat": "",
        "Auto run away from fights": "",
        "Touch D-pad": "",
        "Show other pets": "",
        "Window to fullscreen": "",
        "Center game screen": "",
        "Interface size": "",
        Music: "",
        on: "",
        off: "",
        "Sound effects": "",
        "Game max size": "",
        "Game grid": "",
        "Allow spectators": "",
        "You attempt to forge...": "",
        "You attempt to smelt...": "",
        "You attempt to open the chest...": "",
        "You attempt to imbue...": "",
        "You attempt to fill with water...": "",
        "You attempt to enchant...": "",
        "You attempt to catch a fish...": "",
        "You attempt to cook...": "",
        "You attempt to cut down a tree...": "",
        "You attempt to mine the rock...": "",
        "You attempt to dig the sand...": "",
        "You attempt to rake the soil...": "",
        "You attempt to plant a seed...": "",
        "You attempt to water a plant...": "",
        "You attempt to harvest a plant...": "",
        "You sleep in a bed...": "",
        "Pet has reached its maximum level": "",
        "Pet needs {item_name} to evolve.": "",
        "Pet experience {xp}/{total} ({percent}%)": "",
        "Pet's chest": "",
        "Make sure evidence is visible in the log. Invalid request can result in a ban. Press 'Submit' to submit report.": "",
        Submit: "",
        "Advertising another game/website": "",
        Cursing: "",
        "Discussing illegal activities": "",
        Insulting: "",
        Trolling: "",
        Scamming: "",
        Spamming: "",
        Other: "",
        Reporting: "",
        Reason: "",
        Rules: "",
        "Optional message": "",
        "Include whispers": "",
        Log: "",
        Last: "",
        "Invalid reports may result in a ban": "",
        "Loading spectator mode...": "",
        "My scores": "",
        Overall: "",
        "Cathedral level": "",
        "Party plays": "",
        "Party points": "",
        "Party wins": "",
        "Scavenger hunt": "",
        "Use the menu to choose a highscore": "",
        Screenname: "",
        "Access to US based server - faster connection": "",
        "Less players in premium world - less competition to kill bosses or other mobs": "",
        "Daily login reward wont be resetted when you miss a day.": "",
        "Write in light blue text instead of white": "",
        "Own a private channel": "",
        "Supporting the game!": "",
        "This is an online game and we require you to create an account first.": "",
        "Choose your username": "",
        "Choose password for your username(minimum 6 symbols)": "",
        "Cabinet menu": "",
        "Items in cabinet": "",
        "Assign points to get experience": "",
        "Anti-bot check": "",
        Refresh: "",
        "Wrong, try again!": "",
        "Captcha points to xp": "",
        "You have [bold]{time}[/bold] to complete this captcha. Otherwise you will lose a captcha point.": "",
        "You have currently": "",
        "captcha points": "",
        Assign: "",
        "point(s) to": "",
        "-5 captcha points = ban for botting": "",
        "Are you sure? Closing this captcha window will give you a -1 captcha point. -5 captcha points = ban": "",
        "Receive {xp} experience": "",
        "Remove skill level": "",
        "Remove 1 level from": "",
        "Buy:": "",
        Balance: "",
        "Credit Card": "",
        Mobile: "",
        "Start payment": "",
        "Choose amount": "",
        points: "",
        free: "",
        "Amount to pay": "",
        "Problems?": "",
        "Click on an item to see its description": "",
        Content: "",
        "Items will be accessible from your chest. Go to a chest, open it, click on 'Market' and 'Transactions'.": "",
        "Are you sure?": "",
        "HOT!": "",
        "NEW!": "",
        "Your MOS points balance is {balance}": "",
        "MOS store prices are currently at -{percent}%": "",
        "Click \u00b4OK\u00b4 after you have authorized the payment.": "",
        "Copy and paste link": "",
        "Click \u00b4Cancel\u00b4 to cancel your payment.": "",
        "Chat filters": "",
        "Tab filters": "",
        "Tab name": "",
        "Green - visible, Red - hidden": "",
        "Skill attempts": "",
        "Skill fails": "",
        "Player chat": "",
        Whispering: "",
        "Join / leave events": "",
        Loot: "",
        "Magic damage": "",
        "Archery damage": "",
        "Spam messages": "",
        Timestamps: "",
        "Disable URLs": "",
        Blacklist: "",
        Word: "",
        Referrals: "",
        "Please share the love!": "",
        "Use the link or buttons below to spread the word.": "",
        "You will earn [bold]{percent}%[/bold] of all MOS purchases made by people you have invited!": "",
        "You`ve invited [bold]{referrals}[/bold], earned [bold]{earned}[/bold] MOS": "",
        "Daily log-in bonus": "",
        "Today is your no. [bold]{amount}[/bold] consecutive login day": "",
        "Day {amount}": "",
        "{time} remaining": "",
        TODAY: "",
        "combat experience": "",
        "Your daily log-in reward": "",
        Trivia: "",
        Question: "",
        Answers: "",
        "Your answer": "",
        Answer: "",
        "Add question": "",
        "Separate possible right answers by a semicolon": "",
        "Top players": "",
        Arena: "",
        "Xp rate": "",
        Skill: "",
        Stats: "",
        "Preparation time": "",
        "Maximum arena time": "",
        "Bet amount": "",
        "Maximum allowed bets": "",
        Teams: "",
        "Keep items on death": "",
        "Victory condition": "",
        "Maximum respawns": "",
        "Last man standing": "",
        "Most kills": "",
        "Total experience": "",
        Members: "",
        "Join Red Team": "",
        "Join Blue Team": "",
        "You may be shuffled into another team if teams are too uneven.": "",
        "Total bets": "",
        "Your bet": "",
        Bet: "",
        "Winnings will only be paid out if you are online and in the same world": "",
        Host: "",
        "Be on the arena map when the arena starts!": "",
        "Stats and inventory will be available after arena has begun.": "",
        Add: "",
        "Start the arena?": "",
        "Red team": "",
        "Blue team": "",
        "Bet {amount} on {target}?": "",
        "Preparation has begun, you have {time}": "",
        "Arena has begun, you have {time}": "",
        "Arena starts in {time} on world {world}, to join type /join and click on a table to register": "",
        "Arena has started on world {world}, good luck with preparations!": "",
        "Bet of {amount} coins placed!": "",
        Recruiting: "",
        Preparation: "",
        "Current arena scores": "",
        xp: "",
        "{count} kill": "",
        "{count} kill_2": "{count} kills",
        "Betting rewards": "",
        "Betting reward": "",
        "Arena on world {world} is over!": "",
        "Winners:": "",
        "Red team won!": "",
        "Blue team won!": "",
        "Team members:": "",
        "Add a new player": "",
        Mailbox: "",
        "Only friends can see and post": "",
        "My message": "",
        Delete: "",
        "Available streams": "",
        "Idle time": "",
        "Refresh list": "",
        "Teleport book": "",
        "Teleport to": "",
        "Secret Boss Scroll": "",
        "Minigames Scroll": "",
        "Current password": "",
        "New account name": "",
        "This process will take about 10 seconds before you can log back in. Make sure you choose an appropriate name.": "",
        "Your character name is inappropriate! Choose a new one! If you log in with an inappropriate username again you will be banned.": "",
        "Make sure you insert the right password and an unique username!": "",
        Wood: "",
        Metal: "",
        Feather: "",
        Result: "",
        Formulas: "",
        XP: "XP",
        Stop: "",
        "Be more careful! However, this time I will let you keep your items...": "",
        "You were killed by {player}": "",
        "You killed {player}": "",
        "You have been killed...": "",
        "{loser} was just slain by {winner}!": "",
        "PVP loot: {item_name}": "",
        "WARNING! You have entered a PvP map. Other players are able to [teal]kill[/teal] you and take your gear. Proceed with caution.": "WARNING! You have entered a PvP map. Other players are able to [teal]kill[/teal] you and take your gear. Proceed with caution.",
        "WARNING! You have entered a PvP map. Other players are able to [teal]kill[/teal] you. Your gear is safe if you die by another player on this map.": "",
        "Currently online": "",
        "We recommend using the latest version of Chrome to play RPG MO": "",
        "You are under attack!": "",
        "{player} has left the game.": "",
        "{player} has joined the game.": "",
        "{player} has just completed the tutorial!": "",
        "You can remove an item from inventory by right mouse clicking on it and choosing Destroy": "",
        "You can remove an item from inventory by long pressing it and choosing Destroy": "",
        "You gained 1 {skill} level!": "",
        "Login successful! Chat is being moderated, please follow the rules at https://mo.ee/rules": "",
        "For help, go to https://forums.mo.ee": "",
        "Warning! Your device might experience problems!": "",
        "In case of problems download Chrome from App Store and open game at https://mo.ee": "",
        "Scavenger hunt! Be at {map} in less than {time} to win a gift.": "",
        "You missed scavenger hunt this time.": "",
        "You have been logged off from the server for not listening to a moderator, follow the rules at https://mo.ee/rules": "",
        "Game update! Please reload.": "",
        "Server maintenance!": "",
        "Purchase of {item_name} is complete.": "",
        "Purchase of {item_name} is complete, items have been added to the market transactions.": "",
        "Thank you for the report. Your report id is {id}.": "",
        "You have been muted for {time} for not following the rules. Don't bring in an alt to speak after you have been muted, as you can be banned for this.": "",
        "You have been banned from posting offers on market for {time}.": "",
        "You muted {player} for {time}": "",
        "You unmuted {player}": "",
        "You have been unmuted.": "",
        "{moderator} muted {player} for {time}": "",
        "You banned {player} for {time}": "",
        "{moderator} banned {player} for {time}": "",
        "{player} bought {amount} {item_name} for {price}": "",
        "{player} sold {amount} {item_name} for {price}": "",
        "{moderator} kicked {player}": "",
        "You have {count} unaccepted item in market.": "",
        "You have {count} unaccepted item in market._2": "You have {count} unaccepted items in market.",
        "Purchase of premium is successful! You can type /premium to see how much time you have left.": "",
        "Removed 1 level!": "",
        "No active experience event": "",
        "You are in World {world}": "",
        "Combat levels": "",
        "System has detected too many messages in a short time. You have been muted for {time}.": "",
        "{player} wishes to duel with you.": "",
        "Sending duel request...": "",
        "Maintenance restart in {time}": "",
        "Restarting...": "",
        "Mature English": "",
        Arabic: "",
        Bulgarian: "",
        Portuguese: "",
        Croatian: "",
        Czech: "",
        Danish: "",
        German: "",
        Greek: "",
        English: "",
        "English 2": "",
        "English 3": "",
        "English 4": "",
        "English 5": "",
        "English 6": "",
        "English 7": "",
        "English 8": "",
        "English 9": "",
        Spanish: "",
        Estonian: "",
        Finnish: "",
        French: "",
        Hindi: "",
        Hungarian: "",
        Italian: "",
        Indonesian: "",
        Japanese: "",
        Korean: "",
        Lithuanian: "",
        Latvian: "",
        Dutch: "",
        Norwegian: "",
        Polish: "",
        Portuguese: "",
        Romanian: "",
        Russian: "",
        Swedish: "",
        Steam: "",
        Thai: "",
        Turkish: "",
        Taiwanese: "",
        Ukrainian: "",
        Vietnamese: "",
        Chinese: "",
        Moderators: "",
        "Market chat": "",
        "How are you liking the game so far?": "",
        "I like it": "",
        "I dont like it": "",
        "Would you help us out by writing a review?": "",
        "Dont ask me again": "",
        "Would you help us out by writing a suggestion?": "",
        "Armor Stand": "",
        Armor: "",
        "Copy look": "",
        "Restore look": "",
        "Who would you like to visit?": "",
        Enchanting: "",
        "Available formulas": "",
        Consumes: "",
        "Last used": "",
        Scroll: "",
        Orbs: "",
        "Make sure to stay in world {world} in order to continue your quest.": "",
        "To continue your quest you need to go to world {to_world}. Continue logging to world {world} instead?": "",
        "Continue? This will delete all your settings.": "",
        "Game Version": "",
        "Translate names": "",
        "Help us translate": "",
        "Scratch Ticket": "",
        "Scratch here": "",
        Claim: "",
        "Close RPG MO": "",
        "Can be bought using a credit card, mobile phone or bitcoins": "",
        "One EXP potion lasts 30 minutes": ""
    },
    achievements: {},
    quests: {
        "Welcome to the world of RPG MO!": "",
        "If you follow all the steps you should get the basic items and knowledge to play.": "",
        "[teal]Inventory[/teal] can be accessed from an icon that looks like a bag of gold and is located on top right of screen. Open it by clicking on it.": "",
        "You can equip and use items by clicking on them. [teal]Skills[/teal] are found under the top right warrior icon.": "",
        "Now move on to the next npc([yellow]Makeover Guy[/yellow]), he can change your appearance. After that just go through the [yellow]Gate[/yellow] to continue with the tutorial.": "",
        "You need to change your look at Makeover Guy before continuing.": "",
        "You need to kill {amount} more rats to pass this gate.": "",
        "Finishing [teal]Quests[/teal], can be very rewarding.": "",
        "Click on Quests tab to see the ongoing quests.": "",
        "Clicking on a quest shows a possible location where it can be completed. Map name is visible when you hover or click the minimap on top left corner.": "",
        "You can reset a completed quest to get a new reward with a [yellow]Repeat Quest Permission[/yellow]": "",
        "Talk to the combat instructor to get a bronze dagger.": "",
        "To fight [teal]enemies[/teal] you need to click on them.": "",
        "There are 5 different fighting modes. Each trains different skills. To change fighting mode click on the statue looking icon on top right and fighting mode from there.": "",
        "[teal]Controlled[/teal] mode trains equally accuracy(ACC), strength(STR), defense(DEF) and health(HP). [teal]Accurate[/teal] trains 3xACC, HP. [teal]Aggressive[/teal] trains 3xSTR, HP. [teal]Defensive[/teal] trains 3xDEF, HP. [teal]Cordial[/teal] trains 2xHP.": "",
        "Monitor your [teal]health bar[/teal] while fighting, if it gets very low you can die. When you die you only keep 2 most expensive items!": "",
        "You can run away from the fight after [teal]3 hits[/teal] by clicking on a nearby free spot.": "",
        "Monsters also drop [teal]loot[/teal] that you can use or sell to merchants or players.": "",
        "Equip your [yellow]Bronze Dagger[/yellow] from inventory and go fight some enemies.": "",
        "To use [teal]magic[/teal] you need to equip a magic pouch.": "",
        "Also you need to put some spells into the magic pouch by clicking on them while the pouch is equipped. Each spell has a short cooldown after use.": "",
        "To do magic damage, you need to click on the spell icon while in combat. Alternatively you can press numbers on your keyboard.": "",
        "Move to the next room": "",
        "You need to use magic on a training dummy to pass this gate.": "",
        "Talk to the magic instructor to get a pouch and spells.": "",
        "I'm here to teach you about [teal]Fishing[/teal].": "",
        "First you need to equip a [bold]Fishing rod[/bold] by clicking on it inside inventory.": "",
        "After you have equipped the [bold]Fishing rod[/bold] you have to stand on the beach line and click the water.": "",
        "You can only fish in places where a yellow text - [yellow]Fish[/yellow] is visible. To fish with a fishing rod, find a tile named Fish - Fishing Rod.": "",
        "Talk to [yellow]Cooking Instructor[/yellow] to find out how to cook the fish.": "",
        "You need to catch a fish to pass this gate.": "",
        "Talk to the fishing instructor to get a free fishing rod.": "",
        "You need to cook a raw fish or a raw rat meat to pass this gate.": "",
        "I'm here to teach you how to do [teal]Cooking[/teal].": "",
        "First you need to catch some fish, [yellow]Fishing Instructor[/yellow] can guide you with that.": "",
        "After you have some raw fish in inventory, you can equip the fish by clicking on it. Equipped items have a yellow outline.": "",
        "To cook the fish, simply stand next to [yellow]Campfire[/yellow] and click on it while the fish is equipped.": "",
        "Eating cooked fish restores [teal]health[/teal], very useful after a heavy battle.": "",
        "You can sell raw and cooked fish to the [yellow]Fishing Master[/yellow].": "",
        "You need to cook a raw fish or a raw rat meat to pass this gate.": "",
        "With [teal]mining[/teal] you can get many different materials that can be used with various skills such as [teal]jewelry[/teal] and [teal]forging[/teal].": "",
        "To start mining you need to equip the [bold]pickaxe[/bold] first. At level 1 you can mine [bold]clay[/bold]. You can also mine [bold]tin[/bold] and [bold]copper[/bold] at that level.": "",
        "As you get higher mining levels you can mine better things like [bold]iron[/bold].": "",
        "You need to mine clay to pass this gate.": "",
        "Talk to the mining instructor to get a free iron pickaxe.": "",
        "With [teal]jewelry[/teal] you can make [bold]moulds[/bold], [bold]rings[/bold] and [bold]necklaces[/bold].": "",
        "To do jewelry you need to mine materials. First you have to start with mining [bold]clay[/bold] to make [bold]ring moulds[/bold]. Equip [bold]clay[/bold] and click on a [yellow]furnace[/yellow] to smelt it into a [bold]ring mould[/bold].": "",
        "You need 3 clay to make 1 ring mould. You can later combine a ring mould with iron, silver and other minerals and gems to produce valuable items.": "",
        "As you get higher jewelry levels you can make better things and use more materials.": "",
        "You need to make a clay mould. Talk to jewelry instructor for instructions.": "",
        "With [teal]forging[/teal] you can make many different items.": "",
        "To start forging you need to equip the [bold]forging hammer[/bold] first and then click on the [yellow]anvil[/yellow]. At level 1 you can make a [bold]bronze dagger[/bold].": "",
        "You can create 1 bronze bar by equipping a tin ore and a copper ore and then clicking on the [yellow]furnace[/yellow]": "",
        "Each item has its own material requirements. Formula for bronze dagger requires 2 bronze bars and a fir log.": "",
        "After choosing bronze dagger formula click on [bold]Make[/bold] to produce that item!": "",
        "You need to mine sand and make a vial in a furnace to pass this gate.": "",
        "Talk to the alchemy instructor to get a free spade.": "",
        "With [teal]Alchemy[/teal] you can make [bold]Vials[/bold] and [bold]potions[/bold].": "",
        "To do alchemy you need to dig sand with a spade for vials. First you have to start with digging [bold]sand[/bold] to make [bold]small vials[/bold]. Equip [bold]sand[/bold] and click on a [yellow]furnace[/yellow] to smelt it into a [bold]vial[/bold].": "",
        "As you get higher alchemy levels you can make better vials and potions.": "",
        "You need to cut a tree to pass this gate.": "",
        "Talk to the woodcutting instructor to get a free woodcutter\u00b4s axe.": "",
        "With [teal]woodcutting[/teal] you can cut trees and get different woods that can be used to create items.": "",
        "To cut a tree you need to equip a [bold]woodcutter's axe[/bold] first and then click on the [yellow]Fir Tree[/yellow].": "",
        "[teal]Inventory[/teal] has a limited amount of slots, so you can store your items in a [yellow]chest[/yellow].": "",
        "When you die, then all the items in the chest will be [teal]safe[/teal].": "",
        "From the chest you can also access the [teal]market[/teal]. It is used to trade with other players.": "",
        "Try putting all your items into [yellow]chest[/yellow].": "",
        "This is the end of tutorial! You are now at the beginners town called Dorpat.": "",
        "You'll find some of the tutorial NPC's in this town too in case you forgot something.": "",
        "I recommend you continue with quests and gain lots of strength. Get wealthy by selling loot to build your very own house.": "",
        "If you ever need help use the chat button on bottom left or just press the [Enter] key. You can also find all kinds of information from our": "",
        "To make sure you always have access to your account in case you forget your password please enter your valid e-mail to the next window.": "",
        "This chest is a place to use your spare keys from party search dungeons.": "",
        "Party dungeons can be accessed under Quests - Party at the bottom.": "",
        "Party dungeons are best played with four players, but they can be started with less.  All party dungeons are timed, so the more players, the better.": "",
        "There are two types - Kill All Monsters and Search. Kill All Monsters have a kill counter under the timer.": "",
        "Search dungeons require ALL players in the party to get a red, yellow, and blue key from the three small chest randomly placed in the dungeon.": "",
        "When a player has all three keys, use it on a big treasure chest in that dungeon (like the one here) to win the dungeon and get an item prize.": "",
        "In a Kill All Monsters dungeon players are awarded coins, experience or MOS points once they have slain all monsters.": "",
        "Somewhere near [teal]Skeletons[/teal] you should find an Illusion gate": "",
        "[yellow]Beware[/yellow] it's full of traps": "",
        "Road to [teal]Reval[/teal] and [teal]Minotaur Maze[/teal] ahead": "",
        "[teal]Dorpat Outpost[/teal] and [teal]Whiland[/teal] on the right": "",
        "[teal]Reval[/teal] on the left, [teal]Minotaur Maze[/teal] ahead": "",
        "[teal]Heaven Gateway[/teal] on the right": "",
        "[teal]Dorpat Outpost[/teal], [teal]Walco[/teal] ahead": "",
        "Road to [teal]Whiland[/teal] is south": "",
        "[teal]Walco[/teal] ahead": "",
        "[teal]Golem Pit[/teal] on the left": ""
    },
    calendar: {
        January: "",
        February: "",
        March: "",
        April: "",
        May: "",
        June: "",
        July: "",
        August: "",
        September: "",
        October: "",
        November: "",
        December: "",
        "{count} second": "",
        "{count} second_2": "{count} seconds",
        "{count} minute": "",
        "{count} minute_2": "{count} minutes",
        "{count} hour": "",
        "{count} hour_2": "{count} hours",
        "{count} day": "",
        "{count} day_2": "{count} days",
        "{count} week": "",
        "{count} week_2": "{count} weeks",
        "{count} month": "",
        "{count} month_2": "{count} months",
        "{count} year": "",
        "{count} year_2": "{count} years",
        Day: "",
        min: ""
    },
    mods: {
        "Enable mods? These are provided by 3rd party and may not work on all devices. Also we are not responsible for any damages that may occur. To unload mods, just refresh your browser or restart your app.": "",
        "new": "",
        updated: "",
        loaded: "",
        load: "",
        "Load mods": "",
        wiki: "",
        "mods menu": "",
        "Select All": "",
        "Select None": "",
        "Load Selected": "",
        "Mod Pack version {version}": "",
        "created by {created} - Maintained by {maintained}": "",
        "New Mods Available!": "",
        "Always enable new mods": "",
        "Mods Updated!": "",
        "reload your browser to enable the updates": "",
        "the {modname} mod is not loaded": "",
        "Mods Info": "",
        "Mods loaded and ready: {RPG MO} Mods Pack version {version}": "",
        "Mod failed to load: {mod} ": "",
        "Please inform the mod developers {names}. Try reloading the game and do not load this mod until this issue can be fixed.": "",
        drops: "",
        "No loot": "",
        avg: "",
        nothing: "",
        sells: "",
        "Enemy magic": "",
        enemy: "",
        you: "",
        "average damage": "",
        "chance to hit": "",
        "Combat Analysis": "",
        "Total magic damage": "",
        "Total magic damage from enemy": "",
        "Average per fight": "",
        hits: "",
        "damage received": "",
        "time to kill": "",
        "Destroy All": "",
        "Check Wiki": "",
        Craft: "",
        Enchant: "",
        Drop: "",
        NPC: "",
        MOB: "",
        BOSS: "",
        "Do you want to destroy all {item_name}?": "",
        Drops: "",
        "The {modname} mod is not loaded": "",
        "Load Mod": "",
        HP: "",
        Sort: "",
        Hide: "",
        "Sort Inventory": "",
        "Inventory Items": "",
        Inventory: "",
        Equipment: "",
        Materials: "",
        "Vendor Price": "",
        Highlight: "",
        "Favorited Items": "",
        "Withdraw 1 or All": "",
        Aggressive: "",
        Passive: "",
        "Info Panel": "",
        "no inspect": "",
        transparent: "",
        full: "",
        Dmg: "",
        CD: "",
        "Exp/Cast": "",
        "Spell Pen": "",
        "Uses/Scroll": "",
        "Buy from": "",
        "Sale to": "",
        Present: "",
        Good: "",
        Great: "",
        Best: "",
        Legendary: "",
        Rare: "",
        Obtained: "",
        Owned: "",
        Value: "",
        "Spell Info": "",
        "Enchant Info": "",
        "Melee Block": "",
        "Magic Block": "",
        "Archery Block": "",
        "Go to the Skills menu and click a skill to set this bar's watched skill.": "",
        "Fullscreen Mode": "",
        on: "",
        off: "",
        "WARNING: May impact game performance.": "",
        Autocast: "",
        Keybindings: "",
        "Deposit All+ in chest": "",
        "Unload pet inventory": "",
        "Load pet inventory": "",
        "Cast all magic": "",
        "Run from fight": "",
        "Destroy all ores/logs in bag": "",
        "Eat food in inventory": "",
        "Toggle inventory": "",
        "You have no food in inventory!": "",
        "Do you want to destroy all {item_type} in your bag?": "",
        ores: "",
        logs: "",
        fishes: "",
        "click to close": "",
        "click to expand": "",
        "When set to (send items), hold Shift and click items in your inventory to send them to your pet chest.": "",
        "Regular click uses/equips the items. Toggle to (use items) to reverse this functionality.": "",
        unload: "",
        "send items = shift+click": "",
        "use items = shift+click": "",
        "You keep this item if you die.": "",
        "These are total adjusted values from your stats and gear.": "",
        DPS: "",
        "Exp/h": "",
        "Level in": "",
        Quest: "",
        AM: "",
        PM: "",
        Volume: "",
        "Please enter new chat tab name": "",
        "Edit Tab Filters": "",
        Rename: "",
        Remove: "",
        "Show Channel": "",
        "Hide Channel": "",
        Revive: "",
        "Click and drag to move this window": "",
        Equipped: "",
        "Vanity Set": "",
        neck: "",
        helm: "",
        cape: "",
        shield: "",
        chest: "",
        weapon: "",
        ring: "",
        legs: "",
        gloves: "",
        pet: "",
        boots: "",
        pop: "",
        "Show Equipment": "",
        "Hide Equipment": "",
        "Open the gear menu from here.": "",
        "Trade Chat": "",
        "join automatically": "",
        "manual join": "",
        Popup: "",
        Next: "",
        "You own": "",
        Collapse: "",
        Expand: "",
        Hour: "",
        Minute: "",
        Minutes: "",
        "You are": "",
        Buying: "",
        Selling: "",
        Comparing: "",
        friend: "",
        Dealer: "",
        "Expires in": "",
        Quantity: "",
        total: "",
        coins: "",
        vs: "",
        "Failed to resubmit": "",
        "Your offer for {amount} {item} was resubmitted.": "",
        "Your offer for {amount} {item} to {player} was resubmitted.": "",
        "You have submitted {num} or more offers within the last hour. You must wait at least {time} before you can submit another offer.": "",
        "This Announcement uses {count} line.": "",
        "This Announcement uses {count} line._2": "These Announcements use {count} lines.",
        "You have {count} line available this hour. Post this Announcement?": "",
        "You have {count} line available this hour. Post this Announcement?_2": "You have {count} lines available this hour. Post this Announcement?",
        "You have used all announcement lines this hour.": "",
        "You must wait at least {delay} before you can submit another offer.": "",
        "You must be subscribed to [$$] to use the Announce feature. Go to: Filters - Channels - [$$] Subscribe.": "",
        "You have submitted {lines} or more offers within the last hour.": "",
        "for": "",
        Select: "",
        Go: "",
        Resubmit: "",
        Edit: "",
        Announce: "",
        Announces: "",
        Amount: "",
        "Queued Item": "",
        ea: "",
        "Several new chat commands available. Type {command} to see a list and usage instructions.": "",
        "{player} was added as a friend.": "",
        "{player} was added to your ignore list!": "",
        "Use this channel to report issues of in-game abuse or harassment to the Chat Moderators.": "",
        "Countdown {end_name} has expired. It has been {time} seconds.": "",
        "Countdown {start_name} started for {time}.": "",
        "Timer {start_name} started.": "",
        "Timer/Countdown {start_name} has been deleted.": "",
        "Timers elapsed": "",
        "Countdowns running": "",
        remaining: "",
        "Timer {timer_name} running:": "",
        "Timer {timer_name} has already elapsed.": "",
        "No timers running": "",
        "No timers have been started. Try {command1} (to start a timer) or {command2} (to start a countdown).": "",
        BUY: "",
        SELL: "",
        "Spam information": "",
        "Colored channels": "",
        "Color channel only": "",
        "Highlight friends": "",
        "Chat moderator color": "",
        "Chat timestamps": "",
        "Disable URL in chat": "",
        "Timestamps on all chat lines": "",
        Tips: "",
        "Player color": "",
        TIP: "",
        "In defensive fight mode, each point of melee damage you deal will give 2 xp to the defense skill and 1 xp to health.": "",
        "In accurate fight mode, each point of melee damage you deal will give 2 xp to the accuracy skill and 1 xp to health.": "",
        "In aggressive fight mode, each point of melee damage you deal will give 2 xp to the strength skill and 1 xp to health.": "",
        "In controlled fight mode, combat xp is equally divided between strength, defense and accuracy. Health will always get 1 xp per damage dealt.": "",
        "In cordial fight mode, each point of melee damage you deal will give 2 xp to the to health skill.": "",
        "Ingame wiki mod is a precious resource to plan your adventure. Access it typing /wiki in the chat line.": "",
        "You can turn tips off from the Game Options menu.": "",
        "If you like RPG MO, consider writing a review and gaining free MOS: https://forums.mo.ee/viewtopic.php?t=3870.": "",
        "There is a Secret Cow Level.": "",
        "The Enhanced Map mod adds several details to the game map, including key resource spots, travel points and boss locations.": "",
        "The Enhanced Market mod adds several helpers for player's market operations, including the ability to resubmit expired offers and compare your equip with the one that is for sale.": "",
        "Your health slowly regenerates over time: you gain 1 health every minute.": "",
        "The more health a mob has, the more time it takes to respawn.": "",
        "Be ready to be hunted down and fight for your life if you go into No Man's Land, the RPG MO PvP area.": "",
        "Don't sell raw fish you get, cook it!": "",
        "Better boots can increase your movement speed.": "",
        "Food heals you. You can get food by killing chickens or by fishing. You may have to cook the food.": "",
        "The forums have a lot of information about this game. You can access them on https://forums.mo.ee/ .": "",
        "Are you lost? Click on the minimap to enlarge it or save entire map with /savemap": "",
        "If you die, you will lose all the items you are carrying but the two most valuable. Beware!": "",
        "Potion of Preservation is a special potion that must be equipped and it will be consumed on death, allowing you to save a total of 7 items from your inventory.": "",
        "If you have a pet equipped and you die you keep the pet. If it is not equipped, but it's in your inventory you may lose it.": "",
        "When you die you do not lose the items you placed in your Pet's inventory.": "",
        "You can buy an island deed from the farmer in Dorpat.": "",
        "To see your combat level, mouse over yourself. To see the level of monsters, position the mouse pointer over them.": "",
        "Public chat is global, meaning everyone online can read it!": "",
        "Players chat is white, moderators chat is green and developers/admins chat is orange.": "",
        'To whisper, type /w "[playersname]" followed by the message.': "",
        "Type /online to bring up a list of players currently online.": "",
        "Type /played to see how much time has passed since your first login.": "",
        "Type /penalty to view or spend your current penalty points.": "",
        "Type /wiki to access the ingame wiki database.": "",
        "Type /xp to check the duration of an ongoing x2 Experience event.": "",
        "x2 Experience server events are triggered by players using special x2 pots from the MOS market.": "",
        "Need help? Don't be afraid to ask! RPG MO is full of helpful players! Further help and guides can be found in the game forums.": "",
        "Higher accuracy will allow you to equip better weapons.": "",
        "Higher defense will allow you to equip better armor.": "",
        "Higher health will allow you to equip better jewelry.": "",
        "Do not ignore Captchas! If you fail or ignore them you will get -5 penalty points and you will go to jail.": "",
        "If you end up in jail, only a Game Moderator or an Admin can decide to free you.": "",
        "You can save up to 5 captcha points. Using Captcha points will add XP to a skill of your choice.": "",
        "You can access the player's market through the chest.": "",
        "Some pets can be purchased from the pet vendor in Dorpat. Better pets are usually available on the market ": "",
        "A pet can extend your inventory space. Pets also give stats boosts.": "",
        "Cross-chatting is bad. If someone is speaking in a chat channel, make sure you answer in the same one.": "",
        "The best way to make money is through gathering professions (especially mining). There will always be players looking for iron, sand or coal in the player's market!": "",
        'Through the market you can place "buy" or "sell" offers, and you can check buy and sell offers from other players.': "",
        "MOS is a special currency that can be acquired with real money. It allows you to buy special items from the MOS store.": "",
        'The MOS Store is accessible from the "Buy items and coins" link at the bottom right of page.': "",
        "To use magic you need to buy and equip a magic pouch, fill it with spell scrolls (all available at Dorpat Magician NPC) and engage in combat.": "",
        "You are allowed to have a max of 5 accounts (alts), but trading items or materials between your own accounts is not allowed.": "",
        "Please check RPG MO Code of Conduct on https://mo.ee/rules": "",
        "World Map": "",
        "Time since you started playing": "",
        "Daily rewards counter": "",
        happened: "",
        ago: "",
        "Online players": "",
        "No players online matching {username}": "",
        "You have joined {channel}.": "",
        "You are already in {channel}.": "",
        "You cannot join {channel}.": "",
        "You have left {channel}.": "",
        "You are not in {channel}.": "",
        "Total exp needed to go from level {startLevel} to {endLevel} : {totalExp}": "",
        "Your total experience for all skills is: {totalExp}": "",
        "List of commands": "",
        "Sorry, currently only avaliable in English": "",
        AFK: "",
        "You are now [AFK]": "",
        "You are no longer [AFK]": "",
        "I am away from my keyboard.": "",
        "The total value of items in your Chest/Inv/Pet + Coins is: {totalValue}": "",
        "Current combat level: {currentLevel}": "",
        Modpack: "",
        "more info": "",
        "FullScreen Mode": "",
        "Enable full-screen mode.": "",
        "This mod allows to display the game on the whole screen. It is only suggested on PC (no mobile devices). WARNING: on slow devices, it may affect game performance. After loading the mod, enable full screen mode in the options menu.": "",
        "Auto Cast": "",
        "Enable auto-casting equipped magic.": "",
        "This mod enables auto-casting magic (which becomes automatic when engaging in combat). It is disabled by default, to turn it on enable Autocast in game options.": "",
        "Enhanced Map": "",
        "Enhances game map with several added details.": "",
        "Map now shows current position and details, including travel signs, mobs, bosses, resource spots and POI. In dungeons, fellow players are shown in the full map. Mimimap shows bigger dots, yellow-colored for friends.": "",
        "Enhanced Market": "",
        "Adds various helpers for market interface.": "",
        "Allows resubmit or edit of market offers, display target player for transactions, highlights offers directed to the player and other market improvements. Adds Trade channel.": "",
        "Tabbed Chat": "",
        "Adds tabs to the chat interface.": "",
        "Every chat tab can have different filters and subscribed channels. Filters are now applied only on active chat. Subscribed channels can be filtered from tabs via right-click menu. Tabs can also be renamed/deleted via context menu.": "",
        "Keybinding Extensions": "",
        "Adds an iterface to manage custom keybindings for various actions.": "",
        "From the game menu, a new 'keybindings' item allows access to mod customization.": "",
        "Gear Screen Mod": "",
        "Enable a gear menu, to show what you have equipped.": "",
        "From your Inventory, click (Show Equipment) to access a gear screen, where you can easily see what you have equipped and what you're missing. This screen can be moved! And click 'Equipped' to switch it to 'Vanity Set.' Using the in-game wiki search under Items, then use (Try On) to equip items to your Vanity Set!": "",
        "Pet Inventory": "",
        "Attaches the pet inventory to the main one.": "",
        "You will see the Pet's inventory beneath your main inventory. You will also be able to transfer items between the two inventories very easily. By default, left-clicking items will send them from your inventory to your Pet's and shift+clicking will cause you to use/equip items. Additional features include: (unload) and (load) to unload/load all pet-inventory items quickly.": "",
        "Mouseover Stats": "",
        "When you mouseover a mob, an item, or an object, you'll be able to see its stats.": "",
        "The stats shown are 'A' for accuracy, 'S' for strength, 'D' for defence, and 'Hp' for health. Objects show a description or required levels. A game options allows to tweak panel appearance.": "",
        "Updated Health Bar": "",
        "Will now display health values for you and your target.": "",
        "You'll see current health values on your and your target's health bars that adjust as you take/deal damage or heal.": "",
        "Chest Interface": "",
        "New options for sorting, withdrawing and depositing.": "",
        "You have several options for how to sort items, including 'inventory first'; you can also use withdraw 'All' to fill your inventory quickly, or deposit 'All+' to deposit all unequipped items at once. (If you Ctrl+click an item in your inventory, All+ will also ignore that item; this is useful for items that you cannot equip.)": "",
        "Right-Click Menu Extensions": "",
        "Right-clicking on mobs: 'Drops', 'Combat Analysis' and wiki access.": "",
        "These are new menu options when you right click on mobs. Item Drops shows all items the mob is able to drop (and accurate drop rates); Combat Analysis shows the expected amount of damage that you and the mob will do. Right click on items/mobs allows wiki search. On a player, allows whispering. On inventory items allow to destroy all similar items and to search wiki. Additionally, this mod will show gathering success rates when used on mining nodes, trees, and fishing spots.": "",
        "Magic Damage Interface": "",
        "Magic damage done now appears over the enemy.": "",
        "When you cast spells, you will see the amount of damage they do appear over the enemy's head. Additionally, new keybinds are available for magic spells: 7 8 9 0 as well as the number pad 1 2 3 4.": "",
        "In-Game Wiki": "",
        "An in-game wiki will now be available in this menu.": "",
        "You can use the wiki to browse the game's database for items/monsters/vendors to see information like stats, drops, vendor availability/prices, and craft recipes. There are plenty of options for searching the wiki (such as by name, by min-skill requirement, by type, etc) to make navigating it and finding what you're looking for easier. On crafting recipes, you can look at crafting formula or learn the formula for later use in the Forge Mod.": "",
        "Miscellaneous Improvements": "",
        "Various improvements of the game's UI.": "",
        "These are 'small' mods that didn't require individual load options. Included at the moment: 1) Indicators for items that will be saved upon death, 2) Toolbar at the top showing various useful information.": "",
        "Chat Extensions": "",
        "Adds chat filters and commands.": "",
        "A new chat filter (found in the Filters menu) has been added that blocks 'spam' messages, including: 'I think I'm missing something.' 'Cannot do that yet.' 'You are under attack!' 'You feel a bit better.' and 'It's a [object name]'; in addition, when you do /online, your friends will be yellow colored, and mods/admins as well with green/orange colors. Another option allows to enable links in chat. The mod also adds newbie tips, shown every 10 minutes (can be disabled from game options). Also, you can right-click a player's name in chat window to ignore, add/remove as friend. Also chat commands (ping, played, wiki...) are added.": "",
        "Farming Improvements": "",
        "Adds the ability to 'queue' farming actions.": "",
        "Queued farming actions (seeding, harvesting and raking) will occur automatically once you are no longer busy with the previous action. You can queue one plot at a time, or the entire farm, if you like. Additional keybinds include: Ctrl (to queue actions) and Space (to toggle between Active and Paused). Also, the Island Deed now sends you on a path straight to the sign for a quick exist.": ""
    },
    names: {
        "Great Deer background": "",
        "Royal Gryffin background": "",
        "Ghost background": "",
        "Sapphire Dragon background": "",
        "Efreet background": "",
        "Alligator background": "",
        "Acid Dragon background": ""
    }
};
lang.hints = {
    errors: {
        "No streams available": "When can't watch anybody in spectate mode",
        "Cannot save a search dungeon map!": "when using /savemap"
    },
    items: {
        "{second}s cooldown": "s - second",
        uses: "X uses of spell or arrows",
        back: "Equipment slot"
    },
    "interface": {
        Water: "Verb, as in water plants",
        Seed: "Verb, planting",
        "out of": "Example use: 1 out of 2",
        Reset: "Example use: Reset password",
        Last: "Example use: Last 5 minutes",
        Answer: "Verb",
        Bet: "Verb",
        Access: "Verb, Access Chest, Access Cabinet",
        Jewelry: "Skill",
        Jewellery: "Market category",
        "Buy:": "In MOS Market before payment options",
        "Touch D-pad": "Only toggleable under settings when using a touch device (mobile, tablet)"
    },
    quests: {
        "If you ever need help use the chat button on bottom left or just press the [Enter] key. You can also find all kinds of information from our": "'..from our wiki', wiki is added as a link"
    },
    calendar: {
        min: "short version of minute"
    },
    mods: {
        load: "As in fill pet inventory",
        "Spell Pen": "Spell Penetration",
        ea: "Each used in market announce",
        "for": "From market announce price part",
        drops: "'Monster name' drops:",
        drops: "Right ",
        vs: "From market popup price vs wiki price",
        BUY: "Market announce",
        SELL: "Market announce"
    }
};
! function(a, b, d) {
    "undefined" != typeof module && module.exports ? module.exports = d() : "function" == typeof define && define.amd ? define(d) : b[a] = d()
}("Fingerprint2", this, function() {
    var a = function(a) {
        this.options = this.extend(a, {
            swfContainerId: "fingerprintjs2",
            swfPath: "flash/compiled/FontList.swf"
        });
        this.nativeForEach = Array.prototype.forEach;
        this.nativeMap = Array.prototype.map
    };
    return a.prototype = {
        extend: function(a, d) {
            if (null == a) return d;
            for (var e in a) null != a[e] && d[e] !== a[e] && (d[e] = a[e]);
            return d
        },
        log: function(a) {
            window.console &&
                console.log(a)
        },
        get: function(a) {
            var d = [],
                d = this.userAgentKey(d),
                d = this.languageKey(d),
                d = this.colorDepthKey(d),
                d = this.screenResolutionKey(d),
                d = this.timezoneOffsetKey(d),
                d = this.sessionStorageKey(d),
                d = this.localStorageKey(d),
                d = this.indexedDbKey(d),
                d = this.addBehaviorKey(d),
                d = this.openDatabaseKey(d),
                d = this.cpuClassKey(d),
                d = this.platformKey(d),
                d = this.doNotTrackKey(d),
                d = this.pluginsKey(d),
                d = this.canvasKey(d),
                d = this.webglKey(d),
                e = this;
            this.fontsKey(d, function(d) {
                d = e.x64hash128(d.join("~~~"), 31);
                return a(d)
            })
        },
        userAgentKey: function(a) {
            return this.options.excludeUserAgent || a.push(navigator.userAgent), a
        },
        languageKey: function(a) {
            return this.options.excludeLanguage || a.push(navigator.language), a
        },
        colorDepthKey: function(a) {
            return this.options.excludeColorDepth || a.push(screen.colorDepth), a
        },
        screenResolutionKey: function(a) {
            return this.options.excludeScreenResolution ? a : this.getScreenResolution(a)
        },
        getScreenResolution: function(a) {
            var d, e;
            return d = this.options.detectScreenOrientation ? screen.height > screen.width ? [screen.height,
                screen.width
            ] : [screen.width, screen.height] : [screen.height, screen.width], "undefined" != typeof d && a.push(d), screen.availWidth && screen.availHeight && (e = this.options.detectScreenOrientation ? screen.availHeight > screen.availWidth ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight] : [screen.availHeight, screen.availWidth]), "undefined" != typeof e && a.push(e), a
        },
        timezoneOffsetKey: function(a) {
            return this.options.excludeTimezoneOffset || a.push((new Date).getTimezoneOffset()), a
        },
        sessionStorageKey: function(a) {
            return !this.options.excludeSessionStorage &&
                this.hasSessionStorage() && a.push("sessionStorageKey"), a
        },
        localStorageKey: function(a) {
            return !this.options.excludeSessionStorage && this.hasLocalStorage() && a.push("localStorageKey"), a
        },
        indexedDbKey: function(a) {
            return !this.options.excludeIndexedDB && this.hasIndexedDB() && a.push("indexedDbKey"), a
        },
        addBehaviorKey: function(a) {
            return document.body && !this.options.excludeAddBehavior && document.body.addBehavior && a.push("addBehaviorKey"), a
        },
        openDatabaseKey: function(a) {
            return !this.options.excludeOpenDatabase && window.openDatabase &&
                a.push("openDatabase"), a
        },
        cpuClassKey: function(a) {
            return this.options.excludeCpuClass || a.push(this.getNavigatorCpuClass()), a
        },
        platformKey: function(a) {
            return this.options.excludePlatform || a.push(this.getNavigatorPlatform()), a
        },
        doNotTrackKey: function(a) {
            return this.options.excludeDoNotTrack || a.push(this.getDoNotTrack()), a
        },
        canvasKey: function(a) {
            return !this.options.excludeCanvas && this.isCanvasSupported() && a.push(this.getCanvasFp()), a
        },
        webglKey: function(a) {
            return !this.options.excludeWebGL && this.isCanvasSupported() &&
                a.push(this.getWebglFp()), a
        },
        fontsKey: function(a, d) {
            return this.options.excludeJsFonts ? this.flashFontsKey(a, d) : this.jsFontsKey(a, d)
        },
        flashFontsKey: function(a, d) {
            return this.options.excludeFlashFonts ? d(a) : this.hasSwfObjectLoaded() && this.hasMinFlashInstalled() ? "undefined" == typeof this.options.swfPath ? d(a) : void this.loadSwfAndDetectFonts(function(e) {
                a.push(e.join(";"));
                d(a)
            }) : d(a)
        },
        jsFontsKey: function(a, d) {
            return setTimeout(function() {
                var e = ["monospace", "sans-serif", "serif"],
                    f = document.getElementsByTagName("body")[0],
                    g = document.createElement("span");
                g.style.fontSize = "72px";
                g.innerHTML = "mmmmmmmmmmlli";
                var h = {},
                    l = {},
                    m;
                for (m in e) g.style.fontFamily = e[m], f.appendChild(g), h[e[m]] = g.offsetWidth, l[e[m]] = g.offsetHeight, f.removeChild(g);
                m = "Abadi MT Condensed Light;Academy Engraved LET;ADOBE CASLON PRO;Adobe Garamond;ADOBE GARAMOND PRO;Agency FB;Aharoni;Albertus Extra Bold;Albertus Medium;Algerian;Amazone BT;American Typewriter;American Typewriter Condensed;AmerType Md BT;Andale Mono;Andalus;Angsana New;AngsanaUPC;Antique Olive;Aparajita;Apple Chancery;Apple Color Emoji;Apple SD Gothic Neo;Arabic Typesetting;ARCHER;Arial;Arial Black;Arial Hebrew;Arial MT;Arial Narrow;Arial Rounded MT Bold;Arial Unicode MS;ARNO PRO;Arrus BT;Aurora Cn BT;AvantGarde Bk BT;AvantGarde Md BT;AVENIR;Ayuthaya;Bandy;Bangla Sangam MN;Bank Gothic;BankGothic Md BT;Baskerville;Baskerville Old Face;Batang;BatangChe;Bauer Bodoni;Bauhaus 93;Bazooka;Bell MT;Bembo;Benguiat Bk BT;Berlin Sans FB;Berlin Sans FB Demi;Bernard MT Condensed;BernhardFashion BT;BernhardMod BT;Big Caslon;BinnerD;Bitstream Vera Sans Mono;Blackadder ITC;BlairMdITC TT;Bodoni 72;Bodoni 72 Oldstyle;Bodoni 72 Smallcaps;Bodoni MT;Bodoni MT Black;Bodoni MT Condensed;Bodoni MT Poster Compressed;Book Antiqua;Bookman Old Style;Bookshelf Symbol 7;Boulder;Bradley Hand;Bradley Hand ITC;Bremen Bd BT;Britannic Bold;Broadway;Browallia New;BrowalliaUPC;Brush Script MT;Calibri;Californian FB;Calisto MT;Calligrapher;Cambria;Cambria Math;Candara;CaslonOpnface BT;Castellar;Centaur;Century;Century Gothic;Century Schoolbook;Cezanne;CG Omega;CG Times;Chalkboard;Chalkboard SE;Chalkduster;Charlesworth;Charter Bd BT;Charter BT;Chaucer;ChelthmITC Bk BT;Chiller;Clarendon;Clarendon Condensed;CloisterBlack BT;Cochin;Colonna MT;Comic Sans;Comic Sans MS;Consolas;Constantia;Cooper Black;Copperplate;Copperplate Gothic;Copperplate Gothic Bold;Copperplate Gothic Light;CopperplGoth Bd BT;Corbel;Cordia New;CordiaUPC;Cornerstone;Coronet;Courier;Courier New;Cuckoo;Curlz MT;DaunPenh;Dauphin;David;DB LCD Temp;DELICIOUS;Denmark;Devanagari Sangam MN;DFKai-SB;Didot;DilleniaUPC;DIN;DokChampa;Dotum;DotumChe;Ebrima;Edwardian Script ITC;Elephant;English 111 Vivace BT;Engravers MT;EngraversGothic BT;Eras Bold ITC;Eras Demi ITC;Eras Light ITC;Eras Medium ITC;Estrangelo Edessa;EucrosiaUPC;Euphemia;Euphemia UCAS;EUROSTILE;Exotc350 Bd BT;FangSong;Felix Titling;Fixedsys;FONTIN;Footlight MT Light;Forte;Franklin Gothic;Franklin Gothic Book;Franklin Gothic Demi;Franklin Gothic Demi Cond;Franklin Gothic Heavy;Franklin Gothic Medium;Franklin Gothic Medium Cond;FrankRuehl;Fransiscan;Freefrm721 Blk BT;FreesiaUPC;Freestyle Script;French Script MT;FrnkGothITC Bk BT;Fruitger;FRUTIGER;Futura;Futura Bk BT;Futura Lt BT;Futura Md BT;Futura ZBlk BT;FuturaBlack BT;Gabriola;Galliard BT;Garamond;Gautami;Geeza Pro;Geneva;Geometr231 BT;Geometr231 Hv BT;Geometr231 Lt BT;Georgia;GeoSlab 703 Lt BT;GeoSlab 703 XBd BT;Gigi;Gill Sans;Gill Sans MT;Gill Sans MT Condensed;Gill Sans MT Ext Condensed Bold;Gill Sans Ultra Bold;Gill Sans Ultra Bold Condensed;Gisha;Gloucester MT Extra Condensed;GOTHAM;GOTHAM BOLD;Goudy Old Style;Goudy Stout;GoudyHandtooled BT;GoudyOLSt BT;Gujarati Sangam MN;Gulim;GulimChe;Gungsuh;GungsuhChe;Gurmukhi MN;Haettenschweiler;Harlow Solid Italic;Harrington;Heather;Heiti SC;Heiti TC;HELV;Helvetica;Helvetica Neue;Herald;High Tower Text;Hiragino Kaku Gothic ProN;Hiragino Mincho ProN;Hoefler Text;Humanst 521 Cn BT;Humanst521 BT;Humanst521 Lt BT;Impact;Imprint MT Shadow;Incised901 Bd BT;Incised901 BT;Incised901 Lt BT;INCONSOLATA;Informal Roman;Informal011 BT;INTERSTATE;IrisUPC;Iskoola Pota;JasmineUPC;Jazz LET;Jenson;Jester;Jokerman;Juice ITC;Kabel Bk BT;Kabel Ult BT;Kailasa;KaiTi;Kalinga;Kannada Sangam MN;Kartika;Kaufmann Bd BT;Kaufmann BT;Khmer UI;KodchiangUPC;Kokila;Korinna BT;Kristen ITC;Krungthep;Kunstler Script;Lao UI;Latha;Leelawadee;Letter Gothic;Levenim MT;LilyUPC;Lithograph;Lithograph Light;Long Island;Lucida Bright;Lucida Calligraphy;Lucida Console;Lucida Fax;LUCIDA GRANDE;Lucida Handwriting;Lucida Sans;Lucida Sans Typewriter;Lucida Sans Unicode;Lydian BT;Magneto;Maiandra GD;Malayalam Sangam MN;Malgun Gothic;Mangal;Marigold;Marion;Marker Felt;Market;Marlett;Matisse ITC;Matura MT Script Capitals;Meiryo;Meiryo UI;Microsoft Himalaya;Microsoft JhengHei;Microsoft New Tai Lue;Microsoft PhagsPa;Microsoft Sans Serif;Microsoft Tai Le;Microsoft Uighur;Microsoft YaHei;Microsoft Yi Baiti;MingLiU;MingLiU_HKSCS;MingLiU_HKSCS-ExtB;MingLiU-ExtB;Minion;Minion Pro;Miriam;Miriam Fixed;Mistral;Modern;Modern No. 20;Mona Lisa Solid ITC TT;Monaco;Mongolian Baiti;MONO;Monotype Corsiva;MoolBoran;Mrs Eaves;MS Gothic;MS LineDraw;MS Mincho;MS Outlook;MS PGothic;MS PMincho;MS Reference Sans Serif;MS Reference Specialty;MS Sans Serif;MS Serif;MS UI Gothic;MT Extra;MUSEO;MV Boli;MYRIAD;MYRIAD PRO;Nadeem;Narkisim;NEVIS;News Gothic;News GothicMT;NewsGoth BT;Niagara Engraved;Niagara Solid;Noteworthy;NSimSun;Nyala;OCR A Extended;Old Century;Old English Text MT;Onyx;Onyx BT;OPTIMA;Oriya Sangam MN;OSAKA;OzHandicraft BT;Palace Script MT;Palatino;Palatino Linotype;Papyrus;Parchment;Party LET;Pegasus;Perpetua;Perpetua Titling MT;PetitaBold;Pickwick;Plantagenet Cherokee;Playbill;PMingLiU;PMingLiU-ExtB;Poor Richard;Poster;PosterBodoni BT;PRINCETOWN LET;Pristina;PTBarnum BT;Pythagoras;Raavi;Rage Italic;Ravie;Ribbon131 Bd BT;Rockwell;Rockwell Condensed;Rockwell Extra Bold;Rod;Roman;Sakkal Majalla;Santa Fe LET;Savoye LET;Sceptre;Script;Script MT Bold;SCRIPTINA;Segoe Print;Segoe Script;Segoe UI;Segoe UI Light;Segoe UI Semibold;Segoe UI Symbol;Serifa;Serifa BT;Serifa Th BT;ShelleyVolante BT;Sherwood;Shonar Bangla;Showcard Gothic;Shruti;Signboard;SILKSCREEN;SimHei;Simplified Arabic;Simplified Arabic Fixed;SimSun;SimSun-ExtB;Sinhala Sangam MN;Sketch Rockwell;Skia;Small Fonts;Snap ITC;Snell Roundhand;Socket;Souvenir Lt BT;Staccato222 BT;Steamer;Stencil;Storybook;Styllo;Subway;Swis721 BlkEx BT;Swiss911 XCm BT;Sylfaen;Synchro LET;System;Tahoma;Tamil Sangam MN;Technical;Teletype;Telugu Sangam MN;Tempus Sans ITC;Terminal;Thonburi;Times;Times New Roman;Times New Roman PS;Traditional Arabic;Trajan;TRAJAN PRO;Trebuchet MS;Tristan;Tubular;Tunga;Tw Cen MT;Tw Cen MT Condensed;Tw Cen MT Condensed Extra Bold;TypoUpright BT;Unicorn;Univers;Univers CE 55 Medium;Univers Condensed;Utsaah;Vagabond;Vani;Verdana;Vijaya;Viner Hand ITC;VisualUI;Vivaldi;Vladimir Script;Vrinda;Westminster;WHITNEY;Wide Latin;Wingdings;Wingdings 2;Wingdings 3;ZapfEllipt BT;ZapfHumnst BT;ZapfHumnst Dm BT;Zapfino;Zurich BlkEx BT;Zurich Ex BT;ZWAdobeF".split(";");
                for (var k = [], v = 0, q = m.length; q > v; v++) {
                    var r = m[v],
                        A = !1,
                        w = void 0;
                    for (w in e) {
                        g.style.fontFamily = r + "," + e[w];
                        f.appendChild(g);
                        var z = g.offsetWidth !== h[e[w]] || g.offsetHeight !== l[e[w]];
                        f.removeChild(g);
                        A = A || z
                    }
                    A && k.push(m[v])
                }
                a.push(k.join(";"));
                d(a)
            }, 1)
        },
        pluginsKey: function(a) {
            return a.push(this.isIE() ? this.getIEPluginsString() : this.getRegularPluginsString()), a
        },
        getRegularPluginsString: function() {
            return this.map(navigator.plugins, function(a) {
                var d = this.map(a, function(a) {
                    return [a.type, a.suffixes].join("~")
                }).join(",");
                return [a.name, a.description, d].join("::")
            }, this).join(";")
        },
        getIEPluginsString: function() {
            return window.ActiveXObject ? this.map("AcroPDF.PDF;Adodb.Stream;AgControl.AgControl;DevalVRXCtrl.DevalVRXCtrl.1;MacromediaFlashPaper.MacromediaFlashPaper;Msxml2.DOMDocument;Msxml2.XMLHTTP;PDF.PdfCtrl;QuickTime.QuickTime;QuickTimeCheckObject.QuickTimeCheck.1;RealPlayer;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);Scripting.Dictionary;SWCtl.SWCtl;Shell.UIHelper;ShockwaveFlash.ShockwaveFlash;Skype.Detection;TDCCtl.TDCCtl;WMPlayer.OCX;rmocx.RealPlayer G2 Control;rmocx.RealPlayer G2 Control.1".split(";"),
                function(a) {
                    try {
                        return new ActiveXObject(a), a
                    } catch (d) {
                        return null
                    }
                }).join(";") : ""
        },
        hasSessionStorage: function() {
            try {
                return !!window.sessionStorage
            } catch (a) {
                return !0
            }
        },
        hasLocalStorage: function() {
            try {
                return !!window.localStorage
            } catch (a) {
                return !0
            }
        },
        hasIndexedDB: function() {
            return !!window.indexedDB
        },
        getNavigatorCpuClass: function() {
            return navigator.cpuClass ? "navigatorCpuClass: " + navigator.cpuClass : "navigatorCpuClass: unknown"
        },
        getNavigatorPlatform: function() {
            return navigator.platform ? "navigatorPlatform: " +
                navigator.platform : "navigatorPlatform: unknown"
        },
        getDoNotTrack: function() {
            return navigator.doNotTrack ? "doNotTrack: " + navigator.doNotTrack : "doNotTrack: unknown"
        },
        getCanvasFp: function() {
            var a = [],
                d = document.createElement("canvas");
            d.width = 2E3;
            d.height = 200;
            var e = d.getContext("2d");
            try {
                e.globalCompositeOperation = "screen"
            } catch (f) {}
            a.push("canvas blending:" + ("screen" === e.globalCompositeOperation ? "yes" : "no"));
            e.rect(0, 0, 10, 10);
            e.rect(2, 2, 6, 6);
            a.push("canvas winding:" + (!1 === e.isPointInPath(5, 5, "evenodd") ?
                "yes" : "no"));
            return e.textBaseline = "top", e.font = "72px 'DamascusLight'", e.fillStyle = "#f60", e.fillRect(2, 0, 1E3, 70), e.fillStyle = "#069", e.fillText("https://github.com/valve for PEACE in Ukraine!", 2, 0), e.font = "72px 'Roboto Condensed'", e.fillStyle = "rgba(102, 204, 0, 0.7)", e.fillText("https://github.com/valve for PEACE in Ukraine!", 4, 2), e.strokeStyle = "rgba(202, 104, 0, 0.9)", e.font = "72px 'Menlo'", e.strokeText("https://github.com/valve for PEACE in Ukraine!", 8, 4), e.globalCompositeOperation = "multiply", e.fillStyle =
                "rgb(255,0,255)", e.beginPath(), e.arc(50, 50, 50, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.fillStyle = "rgb(0,255,255)", e.beginPath(), e.arc(100, 50, 50, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.fillStyle = "rgb(255,255,0)", e.beginPath(), e.arc(75, 100, 50, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), e.fillStyle = "rgb(255,0,255)", e.arc(75, 75, 75, 0, 2 * Math.PI, !0), e.arc(75, 75, 25, 0, 2 * Math.PI, !0), e.fill("evenodd"), a.push("canvas fp:" + d.toDataURL()), a.join("\u00a7")
        },
        getWebglFp: function() {
            var a, d = function(d) {
                return a.clearColor(0,
                    0, 0, 1), a.enable(a.DEPTH_TEST), a.depthFunc(a.LEQUAL), a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT), "[" + d[0] + ", " + d[1] + "]"
            };
            if (a = this.getWebglCanvas(), !a) return null;
            var e = [],
                f = a.createBuffer();
            a.bindBuffer(a.ARRAY_BUFFER, f);
            var g = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
            a.bufferData(a.ARRAY_BUFFER, g, a.STATIC_DRAW);
            f.itemSize = 3;
            f.numItems = 3;
            var g = a.createProgram(),
                h = a.createShader(a.VERTEX_SHADER);
            a.shaderSource(h, "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}");
            a.compileShader(h);
            var l = a.createShader(a.FRAGMENT_SHADER);
            return a.shaderSource(l, "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"), a.compileShader(l), a.attachShader(g, h), a.attachShader(g, l), a.linkProgram(g), a.useProgram(g), g.vertexPosAttrib = a.getAttribLocation(g, "attrVertex"), g.offsetUniform = a.getUniformLocation(g, "uniformOffset"), a.enableVertexAttribArray(g.vertexPosArray), a.vertexAttribPointer(g.vertexPosAttrib, f.itemSize, a.FLOAT, !1, 0, 0), a.uniform2f(g.offsetUniform, 1, 1), a.drawArrays(a.TRIANGLE_STRIP, 0, f.numItems), null != a.canvas && e.push(a.canvas.toDataURL()), e.push("extensions:" + a.getSupportedExtensions().join(";")), e.push("webgl aliased line width range:" + d(a.getParameter(a.ALIASED_LINE_WIDTH_RANGE))), e.push("webgl aliased point size range:" + d(a.getParameter(a.ALIASED_POINT_SIZE_RANGE))), e.push("webgl alpha bits:" + a.getParameter(a.ALPHA_BITS)), e.push("webgl antialiasing:" + (a.getContextAttributes().antialias ? "yes" : "no")), e.push("webgl blue bits:" +
                    a.getParameter(a.BLUE_BITS)), e.push("webgl depth bits:" + a.getParameter(a.DEPTH_BITS)), e.push("webgl green bits:" + a.getParameter(a.GREEN_BITS)), e.push("webgl max anisotropy:" + function(a) {
                    var b, d = a.getExtension("EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || a.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    return d ? (b = a.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === b && (b = 2), b) : null
                }(a)), e.push("webgl max combined texture image units:" + a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
                e.push("webgl max cube map texture size:" + a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE)), e.push("webgl max fragment uniform vectors:" + a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS)), e.push("webgl max render buffer size:" + a.getParameter(a.MAX_RENDERBUFFER_SIZE)), e.push("webgl max texture image units:" + a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS)), e.push("webgl max texture size:" + a.getParameter(a.MAX_TEXTURE_SIZE)), e.push("webgl max varying vectors:" + a.getParameter(a.MAX_VARYING_VECTORS)), e.push("webgl max vertex attribs:" +
                    a.getParameter(a.MAX_VERTEX_ATTRIBS)), e.push("webgl max vertex texture image units:" + a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), e.push("webgl max vertex uniform vectors:" + a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS)), e.push("webgl max viewport dims:" + d(a.getParameter(a.MAX_VIEWPORT_DIMS))), e.push("webgl red bits:" + a.getParameter(a.RED_BITS)), e.push("webgl renderer:" + a.getParameter(a.RENDERER)), e.push("webgl shading language version:" + a.getParameter(a.SHADING_LANGUAGE_VERSION)), e.push("webgl stencil bits:" +
                    a.getParameter(a.STENCIL_BITS)), e.push("webgl vendor:" + a.getParameter(a.VENDOR)), e.push("webgl version:" + a.getParameter(a.VERSION)), e.push("webgl vertex shader high float precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_FLOAT).precision), e.push("webgl vertex shader high float precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_FLOAT).rangeMin), e.push("webgl vertex shader high float precision rangeMax:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_FLOAT).rangeMax),
                e.push("webgl vertex shader medium float precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_FLOAT).precision), e.push("webgl vertex shader medium float precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_FLOAT).rangeMin), e.push("webgl vertex shader medium float precision rangeMax:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_FLOAT).rangeMax), e.push("webgl vertex shader low float precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_FLOAT).precision),
                e.push("webgl vertex shader low float precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_FLOAT).rangeMin), e.push("webgl vertex shader low float precision rangeMax:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_FLOAT).rangeMax), e.push("webgl fragment shader high float precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT).precision), e.push("webgl fragment shader high float precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT).rangeMin),
                e.push("webgl fragment shader high float precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT).rangeMax), e.push("webgl fragment shader medium float precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_FLOAT).precision), e.push("webgl fragment shader medium float precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_FLOAT).rangeMin), e.push("webgl fragment shader medium float precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,
                    a.MEDIUM_FLOAT).rangeMax), e.push("webgl fragment shader low float precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_FLOAT).precision), e.push("webgl fragment shader low float precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_FLOAT).rangeMin), e.push("webgl fragment shader low float precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_FLOAT).rangeMax), e.push("webgl vertex shader high int precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_INT).precision),
                e.push("webgl vertex shader high int precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_INT).rangeMin), e.push("webgl vertex shader high int precision rangeMax:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.HIGH_INT).rangeMax), e.push("webgl vertex shader medium int precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_INT).precision), e.push("webgl vertex shader medium int precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_INT).rangeMin), e.push("webgl vertex shader medium int precision rangeMax:" +
                    a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.MEDIUM_INT).rangeMax), e.push("webgl vertex shader low int precision:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_INT).precision), e.push("webgl vertex shader low int precision rangeMin:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_INT).rangeMin), e.push("webgl vertex shader low int precision rangeMax:" + a.getShaderPrecisionFormat(a.VERTEX_SHADER, a.LOW_INT).rangeMax), e.push("webgl fragment shader high int precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,
                    a.HIGH_INT).precision), e.push("webgl fragment shader high int precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_INT).rangeMin), e.push("webgl fragment shader high int precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_INT).rangeMax), e.push("webgl fragment shader medium int precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_INT).precision), e.push("webgl fragment shader medium int precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,
                    a.MEDIUM_INT).rangeMin), e.push("webgl fragment shader medium int precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_INT).rangeMax), e.push("webgl fragment shader low int precision:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_INT).precision), e.push("webgl fragment shader low int precision rangeMin:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.LOW_INT).rangeMin), e.push("webgl fragment shader low int precision rangeMax:" + a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,
                    a.LOW_INT).rangeMax), e.join("\u00a7")
        },
        isCanvasSupported: function() {
            var a = document.createElement("canvas");
            return !(!a.getContext || !a.getContext("2d"))
        },
        isIE: function() {
            return "Microsoft Internet Explorer" === navigator.appName ? !0 : "Netscape" === navigator.appName && /Trident/.test(navigator.userAgent) ? !0 : !1
        },
        hasSwfObjectLoaded: function() {
            return "undefined" != typeof window.swfobject
        },
        hasMinFlashInstalled: function() {
            return swfobject.hasFlashPlayerVersion("9.0.0")
        },
        addFlashDivNode: function() {
            var a = document.createElement("div");
            a.setAttribute("id", this.options.swfContainerId);
            document.body.appendChild(a)
        },
        loadSwfAndDetectFonts: function(a) {
            window.___fp_swf_loaded = function(d) {
                a(d)
            };
            var d = this.options.swfContainerId;
            this.addFlashDivNode();
            swfobject.embedSWF(this.options.swfPath, d, "1", "1", "9.0.0", !1, {
                onReady: "___fp_swf_loaded"
            }, {
                allowScriptAccess: "always",
                menu: "false"
            }, {})
        },
        getWebglCanvas: function() {
            var a = document.createElement("canvas"),
                d = null;
            try {
                d = a.getContext("webgl") || a.getContext("experimental-webgl")
            } catch (e) {}
            return d ||
                (d = null), d
        },
        each: function(a, d, e) {
            if (null !== a)
                if (this.nativeForEach && a.forEach === this.nativeForEach) a.forEach(d, e);
                else if (a.length === +a.length)
                for (var f = 0, g = a.length; g > f && d.call(e, a[f], f, a) !== {}; f++);
            else
                for (f in a)
                    if (a.hasOwnProperty(f) && d.call(e, a[f], f, a) === {}) break
        },
        map: function(a, d, e) {
            var f = [];
            return null == a ? f : this.nativeMap && a.map === this.nativeMap ? a.map(d, e) : (this.each(a, function(a, b, l) {
                f[f.length] = d.call(e, a, b, l)
            }), f)
        },
        x64Add: function(a, d) {
            a = [a[0] >>> 16, 65535 & a[0], a[1] >>> 16, 65535 & a[1]];
            d = [d[0] >>>
                16, 65535 & d[0], d[1] >>> 16, 65535 & d[1]
            ];
            var e = [0, 0, 0, 0];
            return e[3] += a[3] + d[3], e[2] += e[3] >>> 16, e[3] &= 65535, e[2] += a[2] + d[2], e[1] += e[2] >>> 16, e[2] &= 65535, e[1] += a[1] + d[1], e[0] += e[1] >>> 16, e[1] &= 65535, e[0] += a[0] + d[0], e[0] &= 65535, [e[0] << 16 | e[1], e[2] << 16 | e[3]]
        },
        x64Multiply: function(a, d) {
            a = [a[0] >>> 16, 65535 & a[0], a[1] >>> 16, 65535 & a[1]];
            d = [d[0] >>> 16, 65535 & d[0], d[1] >>> 16, 65535 & d[1]];
            var e = [0, 0, 0, 0];
            return e[3] += a[3] * d[3], e[2] += e[3] >>> 16, e[3] &= 65535, e[2] += a[2] * d[3], e[1] += e[2] >>> 16, e[2] &= 65535, e[2] += a[3] * d[2], e[1] +=
                e[2] >>> 16, e[2] &= 65535, e[1] += a[1] * d[3], e[0] += e[1] >>> 16, e[1] &= 65535, e[1] += a[2] * d[2], e[0] += e[1] >>> 16, e[1] &= 65535, e[1] += a[3] * d[1], e[0] += e[1] >>> 16, e[1] &= 65535, e[0] += a[0] * d[3] + a[1] * d[2] + a[2] * d[1] + a[3] * d[0], e[0] &= 65535, [e[0] << 16 | e[1], e[2] << 16 | e[3]]
        },
        x64Rotl: function(a, d) {
            return d %= 64, 32 === d ? [a[1], a[0]] : 32 > d ? [a[0] << d | a[1] >>> 32 - d, a[1] << d | a[0] >>> 32 - d] : (d -= 32, [a[1] << d | a[0] >>> 32 - d, a[0] << d | a[1] >>> 32 - d])
        },
        x64LeftShift: function(a, d) {
            return d %= 64, 0 === d ? a : 32 > d ? [a[0] << d | a[1] >>> 32 - d, a[1] << d] : [a[1] << d - 32, 0]
        },
        x64Xor: function(a,
            d) {
            return [a[0] ^ d[0], a[1] ^ d[1]]
        },
        x64Fmix: function(a) {
            return a = this.x64Xor(a, [0, a[0] >>> 1]), a = this.x64Multiply(a, [4283543511, 3981806797]), a = this.x64Xor(a, [0, a[0] >>> 1]), a = this.x64Multiply(a, [3301882366, 444984403]), this.x64Xor(a, [0, a[0] >>> 1])
        },
        x64hash128: function(a, d) {
            a = a || "";
            d = d || 0;
            for (var e = a.length % 16, f = a.length - e, g = [0, d], h = [0, d], l = [0, 0], m = [0, 0], k = [2277735313, 289559509], v = [1291169091, 658871167], q = 0; f > q; q += 16) l = [255 & a.charCodeAt(q + 4) | (255 & a.charCodeAt(q + 5)) << 8 | (255 & a.charCodeAt(q + 6)) << 16 | (255 & a.charCodeAt(q +
                7)) << 24, 255 & a.charCodeAt(q) | (255 & a.charCodeAt(q + 1)) << 8 | (255 & a.charCodeAt(q + 2)) << 16 | (255 & a.charCodeAt(q + 3)) << 24], m = [255 & a.charCodeAt(q + 12) | (255 & a.charCodeAt(q + 13)) << 8 | (255 & a.charCodeAt(q + 14)) << 16 | (255 & a.charCodeAt(q + 15)) << 24, 255 & a.charCodeAt(q + 8) | (255 & a.charCodeAt(q + 9)) << 8 | (255 & a.charCodeAt(q + 10)) << 16 | (255 & a.charCodeAt(q + 11)) << 24], l = this.x64Multiply(l, k), l = this.x64Rotl(l, 31), l = this.x64Multiply(l, v), g = this.x64Xor(g, l), g = this.x64Rotl(g, 27), g = this.x64Add(g, h), g = this.x64Add(this.x64Multiply(g, [0, 5]), [0,
                1390208809
            ]), m = this.x64Multiply(m, v), m = this.x64Rotl(m, 33), m = this.x64Multiply(m, k), h = this.x64Xor(h, m), h = this.x64Rotl(h, 31), h = this.x64Add(h, g), h = this.x64Add(this.x64Multiply(h, [0, 5]), [0, 944331445]);
            switch (l = [0, 0], m = [0, 0], e) {
                case 15:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 14)], 48));
                case 14:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 13)], 40));
                case 13:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 12)], 32));
                case 12:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 11)], 24));
                case 11:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 10)], 16));
                case 10:
                    m = this.x64Xor(m, this.x64LeftShift([0, a.charCodeAt(q + 9)], 8));
                case 9:
                    m = this.x64Xor(m, [0, a.charCodeAt(q + 8)]), m = this.x64Multiply(m, v), m = this.x64Rotl(m, 33), m = this.x64Multiply(m, k), h = this.x64Xor(h, m);
                case 8:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 7)], 56));
                case 7:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 6)], 48));
                case 6:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 5)], 40));
                case 5:
                    l = this.x64Xor(l, this.x64LeftShift([0,
                        a.charCodeAt(q + 4)
                    ], 32));
                case 4:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 3)], 24));
                case 3:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 2)], 16));
                case 2:
                    l = this.x64Xor(l, this.x64LeftShift([0, a.charCodeAt(q + 1)], 8));
                case 1:
                    l = this.x64Xor(l, [0, a.charCodeAt(q)]), l = this.x64Multiply(l, k), l = this.x64Rotl(l, 31), l = this.x64Multiply(l, v), g = this.x64Xor(g, l)
            }
            return g = this.x64Xor(g, [0, a.length]), h = this.x64Xor(h, [0, a.length]), g = this.x64Add(g, h), h = this.x64Add(h, g), g = this.x64Fmix(g), h = this.x64Fmix(h), g =
                this.x64Add(g, h), h = this.x64Add(h, g), ("00000000" + (g[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (g[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h[1] >>> 0).toString(16)).slice(-8)
        }
    }, a
});
(function(a) {
    function b(a) {
        a -= a >>> 1 & 1431655765;
        a = (a & 858993459) + (a >>> 2 & 858993459);
        return 16843009 * (a + (a >>> 4) & 252645135) >>> 24
    }

    function d(a, b) {
        for (var d = 0, e, f = 0; f < a.length; f++) d *= 2, e = (a[f] + d) / b | 0, d = (a[f] + d) % b, a[f] = e;
        return d
    }

    function e(a, b) {
        if (null == b) a.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], a._ = 0;
        else if (b instanceof f) a.data = b.data, a._ = b._;
        else switch (typeof b) {
            case "number":
                a.data = [b | 0];
                a._ = 0;
                break;
            case "string":
                var d = 2,
                    e = 32;
                0 === b.indexOf("0b") ? b = b.substr(2) : 0 === b.indexOf("0x") && (b = b.substr(2), d = 16, e = 8);
                a.data =
                    [];
                a._ = 0;
                var h = b.length - e,
                    r = b.length;
                do {
                    var A = parseInt(b.slice(0 < h ? h : 0, r), d);
                    if (isNaN(A)) throw SyntaxError("Invalid param");
                    a.data.push(A | 0);
                    if (0 >= h) break;
                    h -= e;
                    r -= e
                } while (1);
                break;
            default:
                a.data = [0];
                d = a.data;
                if (b instanceof Array) {
                    for (e = b.length - 1; 0 <= e; e--) h = b[e], Infinity === h ? a._ = -1 : (g(a, h), d[h >>> 5] |= 1 << h);
                    break
                }
                if (Uint8Array && b instanceof Uint8Array) {
                    g(a, 8 * b.length);
                    for (e = 0; e < b.length; e++)
                        for (h = b[e], r = 0; 8 > r; r++) A = 8 * e + r, d[A >>> 5] |= (h >> r & 1) << A;
                    break
                }
                throw SyntaxError("Invalid param");
        }
    }

    function f(a) {
        if (!(this instanceof f)) return new f(a);
        e(this, a);
        this.data = this.data.slice()
    }

    function g(a, b) {
        for (var d = b >>> 5, e = a.data, f = a._, g = e.length; d >= g; d--) e[d] = f
    }
    var h = {
        data: [],
        _: 0
    };
    f.prototype = {
        data: [],
        _: 0,
        set: function(a, b) {
            a |= 0;
            g(this, a);
            this.data[a >>> 5] = void 0 === b || b ? this.data[a >>> 5] | 1 << a : this.data[a >>> 5] & ~(1 << a);
            return this
        },
        get: function(a) {
            a |= 0;
            var b = this.data,
                d = a >>> 5;
            return d > b.length ? this._ & 1 : b[d] >>> a & 1
        },
        and: function(a) {
            e(h, a);
            a = this.data;
            for (var b = h.data, d = b.length - 1, f = a.length - 1; f > d; f--) a[f] = 0;
            for (; 0 <= f; f--) a[f] &= b[f];
            this._ &= h._;
            return this
        },
        or: function(a) {
            e(h, a);
            a = this.data;
            for (var b = h.data, d = b.length - 1, f = Math.min(a.length - 1, d); d > f; d--) a[d] = b[d];
            for (; 0 <= d; d--) a[d] |= b[d];
            this._ |= h._;
            return this
        },
        not: function() {
            for (var a = this.data, b = 0; b < a.length; b++) a[b] = ~a[b];
            this._ = ~this._;
            return this
        },
        xor: function(a) {
            e(h, a);
            a = this.data;
            for (var b = h.data, d = this._, f = h._, g = 0, r = a.length - 1, A = b.length - 1, g = r; g > A; g--) a[g] ^= f;
            for (g = A; g > r; g--) a[g] = d ^ b[g];
            for (; 0 <= g; g--) a[g] ^= b[g];
            this._ ^= f;
            return this
        },
        flip: function(a, b) {
            if (void 0 === a) return this.not();
            if (void 0 === b) a |= 0, g(this, a), this.data[a >>> 5] ^= 1 << a;
            else if (a <= b && 0 <= a) {
                g(this, b);
                for (var d = a; d <= b; d++) this.data[d >>> 5] ^= 1 << d
            }
            return this
        },
        andNot: function(a) {
            e(h, a);
            a = this.data;
            for (var b = h.data, d = h._, f = Math.min(a.length, b.length), g = 0; g < f; g++) a[g] &= ~b[g];
            this._ &= ~d;
            return this
        },
        clear: function(a, b) {
            var d = this.data;
            if (void 0 === a) {
                for (var e = d.length - 1; 0 <= e; e--) d[e] = 0;
                this._ = 0
            } else if (void 0 === b) a |= 0, g(this, a), d[a >>> 5] &= ~(1 << a);
            else if (a <= b)
                for (g(this, b), e = a; e <= b; e++) d[e >>> 5] &= ~(1 << e);
            return this
        },
        slice: function(a,
            b) {
            if (void 0 === a) return this.clone();
            if (void 0 === b) {
                b = 32 * this.data.length;
                var d = Object.create(f.prototype);
                d._ = this._;
                d.data = [0];
                for (var e = a; e <= b; e++) d.set(e - a, this.get(e));
                return d
            }
            if (a <= b && 0 <= a) {
                d = Object.create(f.prototype);
                d.data = [0];
                for (e = a; e <= b; e++) d.set(e - a, this.get(e));
                return d
            }
            return null
        },
        setRange: function(a, b, d) {
            for (; a <= b; a++) this.set(a, d);
            return this
        },
        clone: function() {
            var a = Object.create(f.prototype);
            a.data = this.data.slice();
            a._ = this._;
            return a
        },
        toArray: Math.clz32 ? function() {
            for (var a =
                    [], b = this.data, d = b.length - 1; 0 <= d; d--)
                for (var e = b[d]; 0 !== e;) {
                    var f = 31 - Math.clz32(e),
                        e = e ^ 1 << f;
                    a.unshift(32 * d + f)
                }
            0 !== this._ && a.push(Infinity);
            return a
        } : function() {
            for (var a = [], d = this.data, e = 0; e < d.length; e++)
                for (var f = d[e]; 0 !== f;) {
                    var g = f & -f,
                        f = f ^ g;
                    a.push(32 * e + b(g - 1))
                }
            0 !== this._ && a.push(Infinity);
            return a
        },
        to36String: function() {
            return this.toString(36)
        },
        toString: function(a) {
            var b = this.data;
            a || (a = 2);
            if (0 === (a & a - 1) && 36 > a) {
                for (var e = "", f = 2 + Math.log(4294967295) / Math.log(a) | 0, g = b.length - 1; 0 <= g; g--) {
                    var h = b[g];
                    0 > h && (h += 4294967296);
                    h = h.toString(a);
                    "" !== e && (e += Array(f - h.length).join("0"));
                    e += h
                }
                return 0 === this._ ? (e = e.replace(/^0+/, ""), "" === e && (e = "0"), e) : ("1111" + e).replace(/^1+/, "...1111")
            }
            if (2 > a || 36 < a) throw "Invalid base";
            e = [];
            f = [];
            for (g = b.length; g--;)
                for (h = 32; h--;) f.push(b[g] >>> h & 1);
            do e.unshift(d(f, a).toString(a)); while (!f.every(function(a) {
                    return 0 === a
                }));
            return e.join("")
        },
        isEmpty: function() {
            if (0 !== this._) return !1;
            for (var a = this.data, b = a.length - 1; 0 <= b; b--)
                if (0 !== a[b]) return !1;
            return !0
        },
        cardinality: function() {
            if (0 !==
                this._) return Infinity;
            for (var a = 0, d = this.data, e = 0; e < d.length; e++) {
                var f = d[e];
                0 !== f && (a += b(f))
            }
            return a
        },
        msb: Math.clz32 ? function() {
            if (0 !== this._) return Infinity;
            for (var a = this.data, b = a.length; 0 < b--;) {
                var d = Math.clz32(a[b]);
                if (32 !== d) return 32 * b + 32 - 1 - d
            }
            return Infinity
        } : function() {
            if (0 !== this._) return Infinity;
            for (var a = this.data, b = a.length; 0 < b--;) {
                var d = a[b],
                    e = 0;
                if (d) {
                    for (; 0 < (d >>>= 1); e++);
                    return 32 * b + e
                }
            }
            return Infinity
        },
        ntz: function() {
            for (var a = this.data, d = 0; d < a.length; d++) {
                var e = a[d];
                if (0 !== e) return e =
                    (e ^ e - 1) >>> 1, 32 * d + b(e)
            }
            return Infinity
        },
        lsb: function() {
            for (var a = this.data, b = 0; b < a.length; b++) {
                var d = a[b],
                    e = 0;
                if (d) {
                    for (a = d & -d; a >>>= 1; e++);
                    return 32 * b + e
                }
            }
            return this._ & 1
        },
        equals: function(a) {
            e(h, a);
            a = this.data;
            var b = h.data,
                d = this._,
                f = h._,
                g = a.length - 1,
                r = b.length - 1;
            if (f !== d) return !1;
            for (var A = g < r ? g : r, w = 0; w <= A; w++)
                if (a[w] !== b[w]) return !1;
            for (w = g; w > r; w--)
                if (a[w] !== f) return !1;
            for (w = r; w > g; w--)
                if (b[w] !== d) return !1;
            return !0
        }
    };
    f.fromBinaryString = function(a) {
        return new f("0b" + a)
    };
    f.fromDecimalString = function(a) {
        return new f("0b" +
            parseInt(a).toString(2))
    };
    f.fromHexString = function(a) {
        return new f("0x" + a)
    };
    f.from36String = function(a) {
        return new f("0b" + parseInt(a, 36).toString(2))
    };
    "object" === typeof exports ? global.BitSet = f : a.BitSet = f
})(this);
(function(a) {
    function b(a) {
        if (Object.getOwnPropertyNames && Object.defineProperty) {
            var b = Object.getOwnPropertyNames(a),
                d;
            for (d = 0; d < b.length; d += 1) Object.defineProperty(a, b[d], {
                value: a[b[d]],
                writable: !1,
                enumerable: !1,
                configurable: !1
            })
        }
    }

    function d(a) {
        function b(d) {
            Object.defineProperty(a, d, {
                get: function() {
                    return a._getter(d)
                },
                set: function(b) {
                    a._setter(d, b)
                },
                enumerable: !0,
                configurable: !1
            })
        }
        if (Object.defineProperty) {
            if (1E5 < a.length) throw new RangeError("Array too large for polyfill");
            var d;
            for (d = 0; d < a.length; d +=
                1) b(d)
        }
    }

    function e(a, b) {
        var d = 32 - b;
        return a << d >> d
    }

    function f(a, b) {
        var d = 32 - b;
        return a << d >>> d
    }

    function g(a) {
        return [a & 255]
    }

    function h(a) {
        return e(a[0], 8)
    }

    function l(a) {
        return [a & 255]
    }

    function m(a) {
        return f(a[0], 8)
    }

    function k(a) {
        a = E(Number(a));
        return [0 > a ? 0 : 255 < a ? 255 : a & 255]
    }

    function v(a) {
        return [a >> 8 & 255, a & 255]
    }

    function q(a) {
        return e(a[0] << 8 | a[1], 16)
    }

    function r(a) {
        return [a >> 8 & 255, a & 255]
    }

    function A(a) {
        return f(a[0] << 8 | a[1], 16)
    }

    function w(a) {
        return [a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, a & 255]
    }

    function z(a) {
        return e(a[0] <<
            24 | a[1] << 16 | a[2] << 8 | a[3], 32)
    }

    function x(a) {
        return [a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, a & 255]
    }

    function B(a) {
        return f(a[0] << 24 | a[1] << 16 | a[2] << 8 | a[3], 32)
    }

    function p(a, b, d) {
        function e(a) {
            var b = J(a);
            a -= b;
            return .5 > a ? b : .5 < a ? b + 1 : b % 2 ? b + 1 : b
        }
        var f = (1 << b - 1) - 1,
            g, h, k;
        a !== a ? (h = (1 << b) - 1, k = y(2, d - 1), g = 0) : Infinity === a || -Infinity === a ? (h = (1 << b) - 1, k = 0, g = 0 > a ? 1 : 0) : 0 === a ? (k = h = 0, g = -Infinity === 1 / a ? 1 : 0) : (g = 0 > a, a = M(a), a >= y(2, 1 - f) ? (h = N(J(T(a) / O), 1023), k = e(a / y(2, h) * y(2, d)), 2 <= k / y(2, d) && (h += 1, k = 1), h > f ? (h = (1 << b) - 1, k = 0) : (h += f, k -= y(2, d))) :
            (h = 0, k = e(a / y(2, 1 - f - d))));
        for (a = []; d; --d) a.push(k % 2 ? 1 : 0), k = J(k / 2);
        for (d = b; d; --d) a.push(h % 2 ? 1 : 0), h = J(h / 2);
        a.push(g ? 1 : 0);
        a.reverse();
        b = a.join("");
        for (g = []; b.length;) g.push(parseInt(b.substring(0, 8), 2)), b = b.substring(8);
        return g
    }

    function u(a, b, d) {
        var e = [],
            f, g, h;
        for (f = a.length; f; --f)
            for (h = a[f - 1], g = 8; g; --g) e.push(h % 2 ? 1 : 0), h >>= 1;
        e.reverse();
        g = e.join("");
        a = (1 << b - 1) - 1;
        e = parseInt(g.substring(0, 1), 2) ? -1 : 1;
        f = parseInt(g.substring(1, 1 + b), 2);
        g = parseInt(g.substring(1 + b), 2);
        return f === (1 << b) - 1 ? 0 !== g ? NaN : Infinity *
            e : 0 < f ? e * y(2, f - a) * (1 + g / y(2, d)) : 0 !== g ? e * y(2, -(a - 1)) * (g / y(2, d)) : 0 > e ? -0 : 0
    }

    function n(a) {
        return u(a, 11, 52)
    }

    function D(a) {
        return p(a, 11, 52)
    }

    function C(a) {
        return u(a, 8, 23)
    }

    function H(a) {
        return p(a, 8, 23)
    }
    var G = function() {
            var a = Object.prototype.toString,
                b = Object.prototype.hasOwnProperty;
            return {
                Class: function(b) {
                    return a.call(b).replace(/^\[object *|\]$/g, "")
                },
                HasProperty: function(a, b) {
                    return b in a
                },
                HasOwnProperty: function(a, d) {
                    return b.call(a, d)
                },
                IsCallable: function(a) {
                    return "function" === typeof a
                },
                ToInt32: function(a) {
                    return a >>
                        0
                },
                ToUint32: function(a) {
                    return a >>> 0
                }
            }
        }(),
        O = Math.LN2,
        M = Math.abs,
        J = Math.floor,
        T = Math.log,
        N = Math.min,
        y = Math.pow,
        E = Math.round,
        I;
    if (!(I = !Object.defineProperty)) {
        var K;
        try {
            Object.defineProperty({}, "x", {}), K = !0
        } catch (F) {
            K = !1
        }
        I = !K
    }
    I && (Object.defineProperty = function(a, b, d) {
        if (!a === Object(a)) throw new TypeError("Object.defineProperty called on non-object");
        G.HasProperty(d, "get") && Object.prototype.__defineGetter__ && Object.prototype.__defineGetter__.call(a, b, d.get);
        G.HasProperty(d, "set") && Object.prototype.__defineSetter__ &&
            Object.prototype.__defineSetter__.call(a, b, d.set);
        G.HasProperty(d, "value") && (a[b] = d.value);
        return a
    });
    Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function(a) {
        if (a !== Object(a)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
        var b = [],
            d;
        for (d in a) G.HasOwnProperty(a, d) && b.push(d);
        return b
    });
    (function() {
        function e(a, g, h) {
            var k;
            k = function(a, e, g) {
                var h, z, l;
                if (arguments.length && "number" !== typeof arguments[0])
                    if ("object" === typeof arguments[0] && arguments[0].constructor ===
                        k)
                        for (h = arguments[0], this.length = h.length, this.byteLength = this.length * this.BYTES_PER_ELEMENT, this.buffer = new f(this.byteLength), z = this.byteOffset = 0; z < this.length; z += 1) this._setter(z, h._getter(z));
                    else if ("object" !== typeof arguments[0] || arguments[0] instanceof f || "ArrayBuffer" === G.Class(arguments[0]))
                    if ("object" === typeof arguments[0] && (arguments[0] instanceof f || "ArrayBuffer" === G.Class(arguments[0]))) {
                        this.buffer = a;
                        this.byteOffset = G.ToUint32(e);
                        if (this.byteOffset > this.buffer.byteLength) throw new RangeError("byteOffset out of range");
                        if (this.byteOffset % this.BYTES_PER_ELEMENT) throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
                        if (3 > arguments.length) {
                            this.byteLength = this.buffer.byteLength - this.byteOffset;
                            if (this.byteLength % this.BYTES_PER_ELEMENT) throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
                            this.length = this.byteLength / this.BYTES_PER_ELEMENT
                        } else this.length = G.ToUint32(g), this.byteLength = this.length * this.BYTES_PER_ELEMENT;
                        if (this.byteOffset +
                            this.byteLength > this.buffer.byteLength) throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
                    } else throw new TypeError("Unexpected argument type(s)");
                else
                    for (h = arguments[0], this.length = G.ToUint32(h.length), this.byteLength = this.length * this.BYTES_PER_ELEMENT, this.buffer = new f(this.byteLength), z = this.byteOffset = 0; z < this.length; z += 1) l = h[z], this._setter(z, Number(l));
                else {
                    this.length = G.ToInt32(arguments[0]);
                    if (0 > g) throw new RangeError("ArrayBufferView size is not a small enough positive integer.");
                    this.byteLength = this.length * this.BYTES_PER_ELEMENT;
                    this.buffer = new f(this.byteLength);
                    this.byteOffset = 0
                }
                this.constructor = k;
                b(this);
                d(this)
            };
            k.prototype = new p;
            k.prototype.BYTES_PER_ELEMENT = a;
            k.prototype._pack = g;
            k.prototype._unpack = h;
            k.BYTES_PER_ELEMENT = a;
            k.prototype._getter = function(a) {
                if (1 > arguments.length) throw new SyntaxError("Not enough arguments");
                a = G.ToUint32(a);
                if (!(a >= this.length)) {
                    var b = [],
                        d, e;
                    d = 0;
                    for (e = this.byteOffset + a * this.BYTES_PER_ELEMENT; d < this.BYTES_PER_ELEMENT; d += 1, e += 1) b.push(this.buffer._bytes[e]);
                    return this._unpack(b)
                }
            };
            k.prototype.get = k.prototype._getter;
            k.prototype._setter = function(a, b) {
                if (2 > arguments.length) throw new SyntaxError("Not enough arguments");
                a = G.ToUint32(a);
                if (!(a >= this.length)) {
                    var d = this._pack(b),
                        e, f;
                    e = 0;
                    for (f = this.byteOffset + a * this.BYTES_PER_ELEMENT; e < this.BYTES_PER_ELEMENT; e += 1, f += 1) this.buffer._bytes[f] = d[e]
                }
            };
            k.prototype.set = function(a, b) {
                if (1 > arguments.length) throw new SyntaxError("Not enough arguments");
                var d, e, f, g, h, k;
                if ("object" === typeof arguments[0] && arguments[0].constructor ===
                    this.constructor) {
                    d = arguments[0];
                    e = G.ToUint32(arguments[1]);
                    if (e + d.length > this.length) throw new RangeError("Offset plus length of array is out of range");
                    k = this.byteOffset + e * this.BYTES_PER_ELEMENT;
                    e = d.length * this.BYTES_PER_ELEMENT;
                    if (d.buffer === this.buffer) {
                        f = [];
                        g = 0;
                        for (h = d.byteOffset; g < e; g += 1, h += 1) f[g] = d.buffer._bytes[h];
                        for (g = 0; g < e; g += 1, k += 1) this.buffer._bytes[k] = f[g]
                    } else
                        for (g = 0, h = d.byteOffset; g < e; g += 1, h += 1, k += 1) this.buffer._bytes[k] = d.buffer._bytes[h]
                } else if ("object" === typeof arguments[0] &&
                    "undefined" !== typeof arguments[0].length) {
                    d = arguments[0];
                    f = G.ToUint32(d.length);
                    e = G.ToUint32(arguments[1]);
                    if (e + f > this.length) throw new RangeError("Offset plus length of array is out of range");
                    for (g = 0; g < f; g += 1) h = d[g], this._setter(e + g, Number(h))
                } else throw new TypeError("Unexpected argument type(s)");
            };
            k.prototype.subarray = function(a, b) {
                a = G.ToInt32(a);
                b = G.ToInt32(b);
                1 > arguments.length && (a = 0);
                2 > arguments.length && (b = this.length);
                0 > a && (a = this.length + a);
                0 > b && (b = this.length + b);
                var d = this.length;
                a = 0 > a ?
                    0 : a > d ? d : a;
                d = this.length;
                d = (0 > b ? 0 : b > d ? d : b) - a;
                0 > d && (d = 0);
                return new this.constructor(this.buffer, this.byteOffset + a * this.BYTES_PER_ELEMENT, d)
            };
            return k
        }
        var f = function(a) {
            a = G.ToInt32(a);
            if (0 > a) throw new RangeError("ArrayBuffer size is not a small enough positive integer.");
            this.byteLength = a;
            this._bytes = [];
            this._bytes.length = a;
            for (a = 0; a < this.byteLength; a += 1) this._bytes[a] = 0;
            b(this)
        };
        a.ArrayBuffer = a.ArrayBuffer || f;
        var p = function() {},
            u = e(1, g, h),
            y = e(1, l, m),
            N = e(1, k, m),
            E = e(2, v, q),
            F = e(2, r, A),
            I = e(4, w, z),
            J = e(4,
                x, B),
            K = e(4, H, C),
            T = e(8, D, n);
        a.Int8Array = a.Int8Array || u;
        a.Uint8Array = a.Uint8Array || y;
        a.Uint8ClampedArray = a.Uint8ClampedArray || N;
        a.Int16Array = a.Int16Array || E;
        a.Uint16Array = a.Uint16Array || F;
        a.Int32Array = a.Int32Array || I;
        a.Uint32Array = a.Uint32Array || J;
        a.Float32Array = a.Float32Array || K;
        a.Float64Array = a.Float64Array || T
    })();
    (function() {
        function d(a, b) {
            return G.IsCallable(a.get) ? a.get(b) : a[b]
        }

        function e(a) {
            return function(b, e) {
                b = G.ToUint32(b);
                if (b + a.BYTES_PER_ELEMENT > this.byteLength) throw new RangeError("Array index out of range");
                b += this.byteOffset;
                var f = new Uint8Array(this.buffer, b, a.BYTES_PER_ELEMENT),
                    h = [],
                    k;
                for (k = 0; k < a.BYTES_PER_ELEMENT; k += 1) h.push(d(f, k));
                Boolean(e) === Boolean(g) && h.reverse();
                return d(new a((new Uint8Array(h)).buffer), 0)
            }
        }

        function f(a) {
            return function(b, e, f) {
                b = G.ToUint32(b);
                if (b + a.BYTES_PER_ELEMENT > this.byteLength) throw new RangeError("Array index out of range");
                e = new a([e]);
                e = new Uint8Array(e.buffer);
                var h = [],
                    k;
                for (k = 0; k < a.BYTES_PER_ELEMENT; k += 1) h.push(d(e, k));
                Boolean(f) === Boolean(g) && h.reverse();
                (new Uint8Array(this.buffer,
                    b, a.BYTES_PER_ELEMENT)).set(h)
            }
        }
        var g = function() {
                var a = new Uint16Array([4660]),
                    a = new Uint8Array(a.buffer);
                return 18 === d(a, 0)
            }(),
            h = function(a, d, e) {
                if (0 === arguments.length) a = new ArrayBuffer(0);
                else if (!(a instanceof ArrayBuffer || "ArrayBuffer" === G.Class(a))) throw new TypeError("TypeError");
                this.buffer = a || new ArrayBuffer(0);
                this.byteOffset = G.ToUint32(d);
                if (this.byteOffset > this.buffer.byteLength) throw new RangeError("byteOffset out of range");
                this.byteLength = 3 > arguments.length ? this.buffer.byteLength - this.byteOffset :
                    G.ToUint32(e);
                if (this.byteOffset + this.byteLength > this.buffer.byteLength) throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
                b(this)
            };
        h.prototype.getUint8 = e(Uint8Array);
        h.prototype.getInt8 = e(Int8Array);
        h.prototype.getUint16 = e(Uint16Array);
        h.prototype.getInt16 = e(Int16Array);
        h.prototype.getUint32 = e(Uint32Array);
        h.prototype.getInt32 = e(Int32Array);
        h.prototype.getFloat32 = e(Float32Array);
        h.prototype.getFloat64 = e(Float64Array);
        h.prototype.setUint8 = f(Uint8Array);
        h.prototype.setInt8 =
            f(Int8Array);
        h.prototype.setUint16 = f(Uint16Array);
        h.prototype.setInt16 = f(Int16Array);
        h.prototype.setUint32 = f(Uint32Array);
        h.prototype.setInt32 = f(Int32Array);
        h.prototype.setFloat32 = f(Float32Array);
        h.prototype.setFloat64 = f(Float64Array);
        a.DataView = a.DataView || h
    })()
})(this);
! function(a) {
    var b = a.HTMLCanvasElement && a.HTMLCanvasElement.prototype,
        d;
    if (d = a.Blob) try {
        d = Boolean(new Blob)
    } catch (e) {
        d = !1
    }
    var f = d;
    if (d = f && a.Uint8Array) try {
        d = 100 === (new Blob([new Uint8Array(100)])).size
    } catch (g) {
        d = !1
    }
    var h = d,
        l = a.BlobBuilder || a.WebKitBlobBuilder || a.MozBlobBuilder || a.MSBlobBuilder,
        m = (f || l) && a.atob && a.ArrayBuffer && a.Uint8Array && function(a) {
            var b, d, e, g, m, z;
            b = 0 <= a.split(",")[0].indexOf("base64") ? atob(a.split(",")[1]) : decodeURIComponent(a.split(",")[1]);
            d = new ArrayBuffer(b.length);
            e = new Uint8Array(d);
            for (g = 0; g < b.length; g += 1) e[g] = b.charCodeAt(g);
            return m = a.split(",")[0].split(":")[1].split(";")[0], f ? new Blob([h ? e : d], {
                type: m
            }) : (z = new l, z.append(d), z.getBlob(m))
        };
    a.HTMLCanvasElement && !b.toBlob && (b.mozGetAsFile ? b.toBlob = function(a, d, e) {
        e && b.toDataURL && m ? a(m(this.toDataURL(d, e))) : a(this.mozGetAsFile("blob", d))
    } : b.toDataURL && m && (b.toBlob = function(a, b, d) {
        a(m(this.toDataURL(b, d)))
    }));
    "function" == typeof define && define.amd ? define(function() {
        return m
    }) : a.dataURLtoBlob = m
}(this);
var saveAs = saveAs || "undefined" !== typeof navigator && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator) || function(a) {
    if ("undefined" === typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
        var b = a.document,
            d = b.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            e = "download" in d,
            f = function(d) {
                var e = b.createEvent("MouseEvents");
                e.initMouseEvent("click", !0, !1, a, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
                d.dispatchEvent(e)
            },
            g = a.webkitRequestFileSystem,
            h = a.requestFileSystem || g || a.mozRequestFileSystem,
            l = function(b) {
                (a.setImmediate || a.setTimeout)(function() {
                    throw b;
                }, 0)
            },
            m = 0,
            k = function(b) {
                var d = function() {
                    "string" === typeof b ? (a.URL || a.webkitURL || a).revokeObjectURL(b) : b.remove()
                };
                a.chrome ? d() : setTimeout(d, 500)
            },
            v = function(a, b, d) {
                b = [].concat(b);
                for (var e = b.length; e--;) {
                    var f = a["on" + b[e]];
                    if ("function" === typeof f) try {
                        f.call(a, d || a)
                    } catch (g) {
                        l(g)
                    }
                }
            },
            q = function(b, l) {
                var z = this,
                    x = b.type,
                    B = !1,
                    p, u, n = function() {
                        v(z, ["writestart", "progress", "write", "writeend"])
                    },
                    q = function() {
                        if (B || !p) p = (a.URL || a.webkitURL ||
                            a).createObjectURL(b);
                        u ? u.location.href = p : void 0 == a.open(p, "_blank") && "undefined" !== typeof safari && (a.location.href = p);
                        z.readyState = z.DONE;
                        n();
                        k(p)
                    },
                    r = function(a) {
                        return function() {
                            if (z.readyState !== z.DONE) return a.apply(this, arguments)
                        }
                    },
                    H = {
                        create: !0,
                        exclusive: !1
                    },
                    G;
                z.readyState = z.INIT;
                l || (l = "download");
                if (e) p = (a.URL || a.webkitURL || a).createObjectURL(b), d.href = p, d.download = l, f(d), z.readyState = z.DONE, n(), k(p);
                else {
                    a.chrome && x && "application/octet-stream" !== x && (G = b.slice || b.webkitSlice, b = G.call(b, 0,
                        b.size, "application/octet-stream"), B = !0);
                    g && "download" !== l && (l += ".download");
                    if ("application/octet-stream" === x || g) u = a;
                    h ? (m += b.size, h(a.TEMPORARY, m, r(function(a) {
                        a.root.getDirectory("saved", H, r(function(a) {
                            var d = function() {
                                a.getFile(l, H, r(function(a) {
                                    a.createWriter(r(function(d) {
                                        d.onwriteend = function(b) {
                                            u.location.href = a.toURL();
                                            z.readyState = z.DONE;
                                            v(z, "writeend", b);
                                            k(a)
                                        };
                                        d.onerror = function() {
                                            var a = d.error;
                                            a.code !== a.ABORT_ERR && q()
                                        };
                                        ["writestart", "progress", "write", "abort"].forEach(function(a) {
                                            d["on" +
                                                a] = z["on" + a]
                                        });
                                        d.write(b);
                                        z.abort = function() {
                                            d.abort();
                                            z.readyState = z.DONE
                                        };
                                        z.readyState = z.WRITING
                                    }), q)
                                }), q)
                            };
                            a.getFile(l, {
                                create: !1
                            }, r(function(a) {
                                a.remove();
                                d()
                            }), r(function(a) {
                                a.code === a.NOT_FOUND_ERR ? d() : q()
                            }))
                        }), q)
                    }), q)) : q()
                }
            },
            r = q.prototype;
        r.abort = function() {
            this.readyState = this.DONE;
            v(this, "abort")
        };
        r.readyState = r.INIT = 0;
        r.WRITING = 1;
        r.DONE = 2;
        r.error = r.onwritestart = r.onprogress = r.onwrite = r.onabort = r.onerror = r.onwriteend = null;
        return function(a, b) {
            return new q(a, b)
        }
    }
}("undefined" !== typeof self &&
    self || "undefined" !== typeof window && window || this.content);
"undefined" !== typeof module && module.exports ? module.exports = saveAs : "undefined" !== typeof define && null !== define && null != define.amd && define([], function() {
    return saveAs
});
var hidden, visibilityChange;
"undefined" !== typeof document.hidden ? (hidden = "hidden", visibilityChange = "visibilitychange") : "undefined" !== typeof document.mozHidden ? (hidden = "mozHidden", visibilityChange = "mozvisibilitychange") : "undefined" !== typeof document.msHidden ? (hidden = "msHidden", visibilityChange = "msvisibilitychange") : "undefined" !== typeof document.webkitHidden && (hidden = "webkitHidden", visibilityChange = "webkitvisibilitychange");

function handleVisibilityChange() {
    document[hidden] ? pageHidden() : pageVisible()
}
"undefined" === typeof pageVisible && (pageVisible = function() {
    console.log("pageVisible not implemented")
});
"undefined" === typeof pageHidden && (pageHidden = function() {
    console.log("pageHidden not implemented")
});
"undefined" === typeof hidden ? (window.onfocus = function() {
    pageVisible()
}, window.onblur = function() {
    pageHidden()
}) : document.addEventListener(visibilityChange, handleVisibilityChange, !1);
window.console || (console = {
    log: function(a) {
        addLog(a)
    }
});
var touchstart = "touchstart",
    touchmove = "touchmove",
    touchend = "touchend";
window.navigator.msPointerEnabled && (0 < window.navigator.maxTouchPoints || 0 < window.navigator.msMaxTouchPoints) && (touchstart = "MSPointerDown", touchmove = "MSPointerMove", touchend = "MSPointerUp");
(function() {
    var a = function() {
            var a = Array.prototype.slice.call(this.getContext("2d").getImageData(0, 0, this.width, this.height).data),
                b = this.width,
                f = this.height,
                g = [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82];
            Array.prototype.push.apply(g, b.bytes32());
            Array.prototype.push.apply(g, f.bytes32());
            g.push(8, 6, 0, 0, 0);
            Array.prototype.push.apply(g, g.crc32(12, 17).bytes32());
            for (var h = f * (4 * b + 1), l = 0; l < f; l++) a.splice(l * (4 * b + 1), 0, 0);
            b = Math.ceil(h / 32768);
            Array.prototype.push.apply(g, (h + 5 * b + 6).bytes32());
            f = g.length;
            l = h + 5 * b + 6 + 4;
            g.push(73, 68, 65, 84, 120, 1);
            for (var m = 0; m < b; m++) {
                var k = Math.min(32768, h - 32768 * m);
                g.push(m == b - 1 ? 1 : 0);
                Array.prototype.push.apply(g, k.bytes16sw());
                Array.prototype.push.apply(g, (~k).bytes16sw());
                k = a.slice(32768 * m, 32768 * m + k);
                Array.prototype.push.apply(g, k)
            }
            Array.prototype.push.apply(g, a.adler32().bytes32());
            Array.prototype.push.apply(g, g.crc32(f, l).bytes32());
            g.push(0, 0, 0, 0, 73, 69, 78, 68);
            Array.prototype.push.apply(g, g.crc32(g.length - 4, 4).bytes32());
            return "data:image/png;base64," + btoa(g.map(function(a) {
                return String.fromCharCode(a)
            }).join(""))
        },
        b = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(d) {
        slow_mode = !1;
        var e = b.apply(this, arguments);
        if ("data:," == e) return slow_mode = !0, HTMLCanvasElement.prototype.toDataURL = a, this.toDataURL();
        HTMLCanvasElement.prototype.toDataURL = b;
        return e
    }
})();
Storage.prototype.setObject = function(a, b) {
    this.setItem(a, JSON.stringify(b))
};
Storage.prototype.getObject = function(a) {
    return (a = this.getItem(a)) && JSON.parse(a)
};
Number.prototype.toUInt = function() {
    return 0 > this ? this + 4294967296 : this
};
Number.prototype.bytes32 = function() {
    return [this >>> 24 & 255, this >>> 16 & 255, this >>> 8 & 255, this & 255]
};
Number.prototype.bytes16sw = function() {
    return [this & 255, this >>> 8 & 255]
};

function isTouchDevice() {
    return !!("ontouchstart" in window)
}

function hasClass(a, b) {
    return a && "undefined" != typeof a.className ? a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")) : !1
}

function removeClass(a, b) {
    a && "undefined" != typeof a.className && hasClass(a, b) && (a.className = a.className.replace(new RegExp("(\\s|^)" + b + "(\\s|$)"), " ").trim())
}

function addClass(a, b) {
    a && !hasClass(a, b) && (a.className = ((a.className || "") + " " + b).trim())
}

function is_child_of(a, b) {
    if (null != b)
        for (; b.parentNode;)
            if ((b = b.parentNode) == a) return !0;
    return !1
}

function fixOnMouseOut(a, b, d) {
    var e = null;
    a.toElement ? e = a.toElement : a.relatedTarget && (e = a.relatedTarget);
    is_child_of(b, e) || b == e || d()
}

function getParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    a = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(window.location.search);
    return null == a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
}

function getHashParameterByName(a) {
    return decodeURIComponent((RegExp("[#|&]" + a + "=(.+?)(&|$)").exec(window.location.hash) || [, ""])[1])
}

function elementThousandSeparate() {
    if (1 == arguments.length) arguments[0].value = thousandSeperate(arguments[0].value);
    else if (2 == arguments.length) document.getElementById(arguments[1]).innerHTML = thousandSeperate(document.getElementById(arguments[0]).value);
    else return !1
}

function sortSelect(a) {
    for (var b = [], d = 0; d < a.options.length; d++) {
        b[d] = [];
        b[d][0] = a.options[d].text;
        for (var e = [], f = 0; f < a.options[d].attributes.length; f++) e.push({
            name: a.options[d].attributes[f].name,
            value: a.options[d].attributes[f].value
        });
        b[d][1] = e
    }
    for (b.sort(); 0 < a.options.length;) a.options[0] = null;
    for (d = 0; d < b.length; d++)
        for (e = new Option(b[d][0]), a.options[d] = e, f = 0; f < b[d][1].length; f++) a.options[d].setAttribute(b[d][1][f].name, b[d][1][f].value)
}

function updateElementHTML(a, b) {
    var d = document.getElementById(a);
    "undefined" != typeof d && null != d && (d.innerHTML = b)
}

function isPlaceholderSupported() {
    return "placeholder" in document.createElement("input")
}

function makePlaceholder(a, b) {
    isPlaceholderSupported() || "" != a.value || (a.value = b, observeElement(a, "focus", function() {
        a.value == b && (a.value = "")
    }), observeElement(a, "blur", function() {
        "" == a.value && (a.value = b)
    }))
}

function observeElement(a, b, d) {
    a.attachEvent ? a.attachEvent("on" + b, d) : a.addEventListener(b, d, !1)
}
if (!window.CustomEvent || "function" !== typeof window.CustomEvent) {
    var CustomEvent = function(a, b) {
        var d;
        b = b || {
            bubbles: !1,
            cancelable: !1,
            detail: void 0
        };
        d = document.createEvent("CustomEvent");
        d.initCustomEvent(a, b.bubbles, b.cancelable, b.detail);
        return d
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent
}
var EventEmitter = {
    emit: function(a, b, d) {
        b = new CustomEvent(b, {
            detail: d
        });
        a.dispatchEvent(b)
    }
};

function setKypsis(a, b, d) {
    var e = new Date;
    e.setDate(e.getDate() + d);
    b = escape(b) + (null == d ? "" : "; expires=" + e.toUTCString());
    document.cookie = a + "=" + b
}

function getKypsis(a) {
    var b, d, e, f = document.cookie.split(";");
    for (b = 0; b < f.length; b++)
        if (d = f[b].substr(0, f[b].indexOf("=")), e = f[b].substr(f[b].indexOf("=") + 1), d = d.replace(/^\s+|\s+$/g, ""), d == a) return unescape(e)
}
var load_attempts = 0;

function loadRecaptcha() {
    if ("undefined" == typeof grecaptcha) {
        load_attempts += 1;
        if (5 <= load_attempts && 2 == socket_status) return Socket.send("la", {
            la: load_attempts
        });
        LazyLoad.js("https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit", function() {});
        setTimeout(function() {
            loadRecaptcha()
        }, 5E3)
    }
}

function recaptchaLoaded() {}
var CaptchaControl = {
    called: !1,
    render: function() {
        if (CaptchaControl.called) grecaptcha.reset();
        else {
            if ("undefined" == typeof grecaptcha) return Socket.send("la", {
                la: load_attempts
            });
            grecaptcha.render("captcha", {
                sitekey: "6LcYcSMTAAAAAOePUZ-0Opl9CVtoBeD7MrF__fZI",
                theme: "dark",
                size: "normal",
                callback: CaptchaControl.response
            });
            CaptchaControl.called = !0
        }
    },
    response: function(a) {
        Socket.send("captcha", {
            response: a
        });
        setCanvasSize()
    },
    submit: function() {
        Socket.send("captcha", {
            response: grecaptcha.getResponse()
        });
        setCanvasSize()
    }
};

function sendRequest(a, b, d, e) {
    var f = createXMLHTTPObject();
    f && (f.open(d ? "POST" : "GET", a, !0), d && f.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), f.onreadystatechange = function() {
        if (4 == f.readyState) {
            if (200 != f.status && 304 != f.status) return e();
            b(f)
        }
    }, 4 != f.readyState && f.send(d))
}
var XMLHttpFactories = [function() {
    return new XMLHttpRequest
}, function() {
    return new ActiveXObject("Msxml2.XMLHTTP")
}, function() {
    return new ActiveXObject("Msxml3.XMLHTTP")
}, function() {
    return new ActiveXObject("Microsoft.XMLHTTP")
}];

function createXMLHTTPObject() {
    for (var a = !1, b = 0; b < XMLHttpFactories.length; b++) {
        try {
            a = XMLHttpFactories[b]()
        } catch (d) {
            continue
        }
        break
    }
    return a
}

function loadJSON(a, b, d) {
    try {
        sendRequest(a, function(a) {
            b(JSON.parse(a.response || a.responseText))
        }, void 0, function() {
            "undefined" !== typeof d && d()
        })
    } catch (e) {
        "undefined" !== typeof d && d()
    }
}
var interactiveArrows = {};

function interactiveArrow(a, b, d, e, f, g) {
    clearTimeout(interactiveArrows[a]);
    "undefined" == typeof g && (g = timestamp());
    if (!(f < timestamp() - g || b())) {
        var h = "up" == e.toLowerCase() ? 27 : 28,
            h = Magic[h].animation;
        if ("string" == typeof d.id) {
            clearTimeout(interactiveArrows[a + "blink"]);
            var l = document.getElementById(d.id);
            addClass(l, "blink");
            interactiveArrows[a + "blink"] = setTimeout(function() {
                removeClass(l, "blink")
            }, 500)
        } else "string" == typeof d.menu ? addAnimation(h, void 0, void 0, void 0, PlayerQuests.positions.menu_by_name(d.menu)) :
            addAnimation(h, d.i - 1, d.j + 1, d.map);
        interactiveArrows[a] = setTimeout(function() {
            interactiveArrow(a, b, d, e, f, g)
        }, 440)
    }
}

function bindOnPress(a, b) {
    var d = !1,
        e = !1,
        f = 0,
        g = 0;
    a.addEventListener("click", function(a) {
        e || b(a)
    });
    a.addEventListener(touchstart, function(a) {
        e = !0;
        d = !1;
        f = a.clientX || a.touches[0].clientX;
        g = a.clientY || a.touches[0].clientY
    });
    a.addEventListener(touchmove, function(a) {
        d = 15 < Math.abs((a.clientX || a.touches[0].clientX) - f) || 15 < Math.abs((a.clientY || a.touches[0].clientY) - g) ? !0 : !1
    });
    a.addEventListener(touchend, function(a) {
        a.preventDefault();
        d || b(a)
    })
}
var Notifications = {
        options: function() {
            return {
                icon: "https://mo.mo.ee/48x48.png"
            }
        },
        supported: function() {
            return "pokki" != getParameterByName("inapp") && "Notification" in window ? !0 : !1
        },
        enabled: function() {
            return "granted" == Notification.permission
        },
        show: function(a) {
            if ("pokki" == getParameterByName("inapp")) return !1;
            if ("Notification" in window) "denied" != Notification.permission && ("default" != Notification.permission || Notifications.dialog_shown || (Popup.dialog(_ti("Accept to receive desktop notifications when you are tabbed out about [teal]2x experience events[/teal], [yellow]whispers[/yellow] and [red]captchas.[/red]"),
                null_function, "biggest"), Notifications.dialog_shown = !0), "granted" == Notification.permission ? Notifications.create(a) : Notification.requestPermission(function() {
                Notifications.create(a)
            }));
            else if (window.navigator.vibrate) try {
                window.navigator.vibrate(200)
            } catch (b) {}
        },
        create: function(a) {
            if (isActive) - 1 != [_ti("An anti-bot captcha challenge has appeared! Do not miss these!")].indexOf(a) && Music.sound_effect("notification");
            else {
                Music.sound_effect("notification");
                var b = Notifications.options();
                b.body = a;
                var d =
                    new Notification("RPG MO", b);
                d.onshow = function() {
                    setTimeout(function() {
                        d.close()
                    }, 1E4)
                };
                d.onclick = function() {
                    SpectateWindow.active && SpectateWindow.hide_iframe();
                    window.focus()
                }
            }
        },
        dialog_shown: !1
    },
    Fullscreen = {
        supported: function() {
            return document.body.requestFullscreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullscreen
        },
        slave_supported: function() {
            return document.body.webkitRequestFullScreen
        },
        is_enabled: function() {
            return document.fullscreenElement ||
                document.webkitIsFullScreen || document.mozFullScreenElement || document.msFullscreenElement || SpectateWindow.fullscreen
        },
        request: function() {
            document.body.requestFullscreen ? document.body.requestFullscreen() : document.body.mozRequestFullScreen ? document.body.mozRequestFullScreen() : document.body.webkitRequestFullScreen ? document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.body.msRequestFullscreen && document.body.msRequestFullscreen()
        },
        toggle: function() {
            Fullscreen.is_enabled() ? Fullscreen.exit() :
                Fullscreen.request()
        },
        exit: function() {
            document.exitFullScreen ? document.exitFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullScreen ? document.msExitFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
        },
        add_listeners: function() {
            document.addEventListener("webkitfullscreenchange", function() {
                setCanvasSize(!0);
                SpectateWindow.sendMessage({
                    action: "fullscreen_slave",
                    fullscreen: document.webkitIsFullScreen
                })
            }, !1);
            document.addEventListener("mozfullscreenchange",
                function() {
                    setCanvasSize(!0);
                    SpectateWindow.sendMessage({
                        action: "fullscreen_slave",
                        fullscreen: document.mozFullScreenElement
                    })
                }, !1);
            document.addEventListener("msfullscreenchange", function() {
                setCanvasSize(!0);
                SpectateWindow.sendMessage({
                    action: "fullscreen_slave",
                    fullscreen: document.msFullscreenElement
                })
            }, !1);
            document.addEventListener("fullscreenchange", function() {
                setCanvasSize(!0);
                SpectateWindow.sendMessage({
                    action: "fullscreen_slave",
                    fullscreen: document.fullscreenElement
                })
            }, !1)
        },
        center_screen: !0,
        center_toggle: function() {
            Fullscreen.center_screen = !Fullscreen.center_screen;
            setCanvasSize(!0);
            localStorage.center_screen = Fullscreen.center_screen.toString();
            setBackground(current_map)
        }
    },
    flipped_images = {},
    createHorizontalFlipImage = function(a, b) {
        if (IMAGE_SHEET[a.sheet]) {
            var d = IMAGE_SHEET[a.sheet];
            if (!IMAGE_SHEET[a.sheet].img[b]) {
                var e = document.createElement("canvas");
                e.width = d.img[0].width;
                e.height = d.img[0].height;
                IMAGE_SHEET[a.sheet].img[b] = e;
                flipped_images[a.sheet + b] = !0;
                e = IMAGE_SHEET[a.sheet].img[b].getContext("2d");
                flipImage(d.img[0], e, d.img[0].width,
                    d.img[0].height)
            }
        }
    };

function flipImage(a, b, d, e) {
    var f = -1 * d;
    b.save();
    b.scale(-1, 1);
    b.drawImage(a, f, 0, d, e);
    b.restore()
}

function prepareCarpentryObjects() {
    for (var a in IMAGE_SHEET) "string" == typeof IMAGE_SHEET[a] && (IMAGE_SHEET[IMAGE_SHEET[a]].max_x = IMAGE_SHEET[IMAGE_SHEET[a]].img[0].width / IMAGE_SHEET[IMAGE_SHEET[a]].tile_width - 1)
}

function setOnClickUrl(a, b) {
    "undefined" != typeof createExternalLink ? a.onclick = createExternalLink(b) : "1" == getParameterByName("inapp") ? a.onclick = function() {
        redirectUrl(b)
    } : a.onclick = function() {
        window.open(b, "_blank")
    }
}
var UIRules = {
    sheet: void 0,
    create_sheet: function() {
        if (document.createStyleSheet) UIRules.sheet = document.createStyleSheet();
        else {
            var a = document.createElement("style");
            document.getElementsByTagName("head")[0].appendChild(a);
            UIRules.sheet = a.sheet
        }
    },
    add_rule: function(a, b) {
        UIRules.sheet || UIRules.create_sheet();
        return UIRules.sheet.addRule ? (UIRules.sheet.addRule(a, b), UIRules.sheet.rules.length - 1) : UIRules.sheet.insertRule(a + "{" + b + "}", UIRules.sheet.cssRules.length)
    },
    remove_rule: function(a) {
        return UIRules.sheet.removeRule ?
            UIRules.sheet.removeRule(a) : UIRules.sheet.deleteRule(a)
    },
    menu_transparency_rule_index: !1,
    menu_transparency_rule_index2: !1,
    menu_transparency_rule_index3: !1,
    set_menu_transparency: function(a) {
        1 == a ? !1 !== UIRules.menu_transparency_rule_index && (UIRules.remove_rule(UIRules.menu_transparency_rule_index3), UIRules.remove_rule(UIRules.menu_transparency_rule_index2), UIRules.remove_rule(UIRules.menu_transparency_rule_index), UIRules.menu_transparency_rule_index = !1) : !1 === UIRules.menu_transparency_rule_index && (UIRules.menu_transparency_rule_index =
            UIRules.add_rule(".menu", "opacity: 1 !important"), UIRules.menu_transparency_rule_index2 = UIRules.add_rule("#chat", "opacity: 1 !important"), UIRules.menu_transparency_rule_index3 = UIRules.add_rule("#current_channel", "opacity: 1 !important"))
    }
};
(function() {
    function a(a) {
        a || (a = Math.random);
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (var b = 0; 256 > b; b++) this.p[b] = 256 * a();
        for (b = 0; 512 > b; b++) this.perm[b] = this.p[b & 255], this.permMod12[b] = this.perm[b] % 12
    }
    var b = .5 * (Math.sqrt(3) - 1),
        d = (3 - Math.sqrt(3)) / 6,
        e = 1 / 3,
        f = 1 / 6,
        g = (Math.sqrt(5) - 1) / 4,
        h = (5 - Math.sqrt(5)) / 20;
    a.prototype = {
        grad3: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
        grad4: new Float32Array([0,
            1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0
        ]),
        noise2D: function(a, e) {
            var f = this.permMod12,
                g = this.perm,
                h = this.grad3,
                r = 0,
                A = 0,
                w = 0,
                z = (a + e) * b,
                x = Math.floor(a + z),
                B = Math.floor(e + z),
                z = (x + B) * d,
                p = a - (x - z),
                u = e - (B - z),
                n, D;
            p > u ? (n = 1, D = 0) : (n = 0, D = 1);
            var C = p - n + d,
                H =
                u - D + d,
                z = p - 1 + 2 * d,
                G = u - 1 + 2 * d,
                x = x & 255,
                B = B & 255,
                O = .5 - p * p - u * u;
            0 <= O && (r = 3 * f[x + g[B]], O *= O, r = O * O * (h[r] * p + h[r + 1] * u));
            p = .5 - C * C - H * H;
            0 <= p && (A = 3 * f[x + n + g[B + D]], p *= p, A = p * p * (h[A] * C + h[A + 1] * H));
            C = .5 - z * z - G * G;
            0 <= C && (f = 3 * f[x + 1 + g[B + 1]], C *= C, w = C * C * (h[f] * z + h[f + 1] * G));
            return 70 * (r + A + w)
        },
        noise3D: function(a, b, d) {
            var g = this.permMod12,
                h = this.perm,
                r = this.grad3,
                A, w, z = (a + b + d) * e,
                x = Math.floor(a + z),
                B = Math.floor(b + z),
                p = Math.floor(d + z),
                z = (x + B + p) * f;
            A = a - (x - z);
            var u = b - (B - z),
                n = d - (p - z),
                D, C, H, G, O, M;
            A >= u ? u >= n ? (D = 1, H = C = 0, O = G = 1, M = 0) : (A >= n ? (D = 1,
                H = C = 0) : (C = D = 0, H = 1), G = 1, O = 0, M = 1) : u < n ? (C = D = 0, H = 1, G = 0, M = O = 1) : A < n ? (D = 0, C = 1, G = H = 0, M = O = 1) : (D = 0, C = 1, H = 0, O = G = 1, M = 0);
            w = A - D + f;
            var J = u - C + f,
                T = n - H + f;
            a = A - G + 2 * f;
            var N = u - O + 2 * f,
                y = n - M + 2 * f;
            d = A - 1 + 3 * f;
            b = u - 1 + 3 * f;
            var z = n - 1 + 3 * f,
                x = x & 255,
                B = B & 255,
                p = p & 255,
                E = .6 - A * A - u * u - n * n;
            if (0 > E) A = 0;
            else {
                var I = 3 * g[x + h[B + h[p]]],
                    E = E * E;
                A = E * E * (r[I] * A + r[I + 1] * u + r[I + 2] * n)
            }
            u = .6 - w * w - J * J - T * T;
            0 > u ? w = 0 : (D = 3 * g[x + D + h[B + C + h[p + H]]], u *= u, w = u * u * (r[D] * w + r[D + 1] * J + r[D + 2] * T));
            J = .6 - a * a - N * N - y * y;
            0 > J ? a = 0 : (G = 3 * g[x + G + h[B + O + h[p + M]]], J *= J, a = J * J * (r[G] * a + r[G + 1] * N + r[G + 2] * y));
            N = .6 - d * d - b * b - z * z;
            0 > N ? r = 0 : (g = 3 * g[x + 1 + h[B + 1 + h[p + 1]]], N *= N, r = N * N * (r[g] * d + r[g + 1] * b + r[g + 2] * z));
            return 32 * (A + w + a + r)
        },
        noise4D: function(a, b, d, e) {
            var f = this.perm,
                r = this.grad4,
                A, w, z, x = (a + b + d + e) * g,
                B = Math.floor(a + x),
                p = Math.floor(b + x),
                u = Math.floor(d + x),
                n = Math.floor(e + x),
                x = (B + p + u + n) * h;
            A = a - (B - x);
            w = b - (p - x);
            var D = d - (u - x),
                C = e - (n - x);
            e = d = x = b = 0;
            A > w ? b++ : x++;
            A > D ? b++ : d++;
            A > C ? b++ : e++;
            w > D ? x++ : d++;
            w > C ? x++ : e++;
            D > C ? d++ : e++;
            var H, G, O, M, J, T, N, y, E, I;
            H = 3 <= b ? 1 : 0;
            G = 3 <= x ? 1 : 0;
            O = 3 <= d ? 1 : 0;
            M = 3 <= e ? 1 : 0;
            z = 2 <= b ? 1 : 0;
            J = 2 <= x ? 1 : 0;
            T = 2 <= d ? 1 : 0;
            N =
                2 <= e ? 1 : 0;
            a = 1 <= b ? 1 : 0;
            y = 1 <= x ? 1 : 0;
            E = 1 <= d ? 1 : 0;
            I = 1 <= e ? 1 : 0;
            var K = A - H + h,
                F = w - G + h,
                L = D - O + h,
                X = C - M + h,
                U = A - z + 2 * h,
                Y = w - J + 2 * h,
                oa = D - T + 2 * h,
                ca = C - N + 2 * h,
                Z = A - a + 3 * h,
                fa = w - y + 3 * h,
                pa = D - E + 3 * h,
                ka = C - I + 3 * h;
            e = A - 1 + 4 * h;
            d = w - 1 + 4 * h;
            x = D - 1 + 4 * h;
            b = C - 1 + 4 * h;
            var B = B & 255,
                p = p & 255,
                u = u & 255,
                n = n & 255,
                aa = .6 - A * A - w * w - D * D - C * C;
            if (0 > aa) A = 0;
            else {
                var ra = f[B + f[p + f[u + f[n]]]] % 32 * 4,
                    aa = aa * aa;
                A = aa * aa * (r[ra] * A + r[ra + 1] * w + r[ra + 2] * D + r[ra + 3] * C)
            }
            w = .6 - K * K - F * F - L * L - X * X;
            0 > w ? w = 0 : (D = f[B + H + f[p + G + f[u + O + f[n + M]]]] % 32 * 4, w *= w, w = w * w * (r[D] * K + r[D + 1] * F + r[D + 2] * L + r[D + 3] * X));
            D = .6 - U * U - Y *
                Y - oa * oa - ca * ca;
            0 > D ? z = 0 : (z = f[B + z + f[p + J + f[u + T + f[n + N]]]] % 32 * 4, D *= D, z = D * D * (r[z] * U + r[z + 1] * Y + r[z + 2] * oa + r[z + 3] * ca));
            J = .6 - Z * Z - fa * fa - pa * pa - ka * ka;
            0 > J ? a = 0 : (a = f[B + a + f[p + y + f[u + E + f[n + I]]]] % 32 * 4, J *= J, a = J * J * (r[a] * Z + r[a + 1] * fa + r[a + 2] * pa + r[a + 3] * ka));
            y = .6 - e * e - d * d - x * x - b * b;
            0 > y ? r = 0 : (f = f[B + 1 + f[p + 1 + f[u + 1 + f[n + 1]]]] % 32 * 4, y *= y, r = y * y * (r[f] * e + r[f + 1] * d + r[f + 2] * x + r[f + 3] * b));
            return 27 * (A + w + z + a + r)
        }
    };
    "undefined" !== typeof define && define.amd ? define(function() {
        return a
    }) : "undefined" !== typeof window && (window.SimplexNoise = a);
    "undefined" !==
    typeof exports && (exports.SimplexNoise = a);
    "undefined" !== typeof module && (module.exports = a)
})();
(function(a, b, d, e, f, g) {
    function h(a) {
        var b, d = a.length,
            f = this,
            g = 0,
            h = f.i = f.j = 0,
            k = f.S = [];
        for (d || (a = [d++]); g < e;) k[g] = g++;
        for (g = 0; g < e; g++) k[g] = k[h = w & h + a[g % d] + (b = k[g])], k[h] = b;
        (f.g = function(a) {
            for (var b, d = 0, g = f.i, h = f.j, k = f.S; a--;) b = k[g = w & g + 1], d = d * e + k[w & (k[g] = k[h = w & h + b]) + (k[h] = b)];
            f.i = g;
            f.j = h;
            return d
        })(e)
    }

    function l(a, b) {
        var d = [],
            e = (typeof a)[0],
            f;
        if (b && "o" == e)
            for (f in a) try {
                d.push(l(a[f], b - 1))
            } catch (g) {}
        return d.length ? d : "s" == e ? a : a + "\x00"
    }

    function m(a, b) {
        for (var d = a + "", e, f = 0; f < d.length;) b[w & f] = w & (e ^= 19 *
            b[w & f]) + d.charCodeAt(f++);
        return v(b)
    }

    function k(d) {
        try {
            return a.crypto.getRandomValues(d = new Uint8Array(e)), v(d)
        } catch (f) {
            return [+new Date, a, a.navigator && a.navigator.plugins || Math.random().toString(), a.screen, v(b)]
        }
    }

    function v(a) {
        return String.fromCharCode.apply(0, a)
    }
    var q = d.pow(e, f),
        r = d.pow(2, g),
        A = 2 * r,
        w = e - 1;
    d.seedrandom = function(a, g) {
        var B = [],
            p = m(l(g ? [a, v(b)] : 0 in arguments ? a : k(), 3), B),
            u = new h(B);
        m(v(u.S), b);
        d.random = function() {
            for (var a = u.g(f), b = q, d = 0; a < r;) a = (a + d) * e, b *= e, d = u.g(1);
            for (; a >= A;) a /=
                2, b /= 2, d >>>= 1;
            return (a + d) / b
        };
        return p
    };
    m(d.random(), b)
})(this, [], Math, 256, 6, 52);
var JSON;
JSON || (JSON = {});
(function() {
    function a(a) {
        return 10 > a ? "0" + a : a
    }

    function b(a) {
        f.lastIndex = 0;
        return f.test(a) ? '"' + a.replace(f, function(a) {
            var b = l[a];
            return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function d(a, e) {
        var f, l, A, w, z = g,
            x, B = e[a];
        B && "object" === typeof B && "function" === typeof B.toJSON && (B = B.toJSON(a));
        "function" === typeof m && (B = m.call(e, a, B));
        switch (typeof B) {
            case "string":
                return b(B);
            case "number":
                return isFinite(B) ? String(B) : "null";
            case "boolean":
            case "null":
                return String(B);
            case "object":
                if (!B) return "null";
                g += h;
                x = [];
                if ("[object Array]" === Object.prototype.toString.apply(B)) {
                    w = B.length;
                    for (f = 0; f < w; f += 1) x[f] = d(f, B) || "null";
                    A = 0 === x.length ? "[]" : g ? "[\n" + g + x.join(",\n" + g) + "\n" + z + "]" : "[" + x.join(",") + "]";
                    g = z;
                    return A
                }
                if (m && "object" === typeof m)
                    for (w = m.length, f = 0; f < w; f += 1) "string" === typeof m[f] && (l = m[f], (A = d(l, B)) && x.push(b(l) + (g ? ": " : ":") + A));
                else
                    for (l in B) Object.prototype.hasOwnProperty.call(B, l) && (A = d(l, B)) && x.push(b(l) + (g ? ": " : ":") + A);
                A = 0 === x.length ? "{}" : g ? "{\n" + g + x.join(",\n" +
                    g) + "\n" + z + "}" : "{" + x.join(",") + "}";
                g = z;
                return A
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(b) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(a) {
        return this.valueOf()
    });
    var e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        f = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        g, h, l = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        m;
    "function" !== typeof JSON.stringify && (JSON.stringify = function(a, b, e) {
        var f;
        h = g = "";
        if ("number" === typeof e)
            for (f = 0; f < e; f += 1) h += " ";
        else "string" === typeof e && (h = e);
        if ((m = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
        return d("", {
            "": a
        })
    });
    "function" !== typeof JSON.parse && (JSON.parse = function(a, b) {
        function d(a, e) {
            var f, g, h = a[e];
            if (h && "object" === typeof h)
                for (f in h) Object.prototype.hasOwnProperty.call(h, f) && (g = d(h, f), void 0 !== g ? h[f] = g : delete h[f]);
            return b.call(a, e, h)
        }
        var f;
        a = String(a);
        e.lastIndex = 0;
        e.test(a) && (a = a.replace(e, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return f = eval("(" + a + ")"), "function" === typeof b ? d({
            "": f
        }, "") : f;
        throw new SyntaxError("JSON.parse");
    })
})();
var chrsz = 8;

function safe_add(a, b) {
    var d = (a & 65535) + (b & 65535);
    return (a >> 16) + (b >> 16) + (d >> 16) << 16 | d & 65535
}

function S(a, b) {
    return a >>> b | a << 32 - b
}

function R(a, b) {
    return a >>> b
}

function Ch(a, b, d) {
    return a & b ^ ~a & d
}

function Maj(a, b, d) {
    return a & b ^ a & d ^ b & d
}

function Sigma0256(a) {
    return S(a, 2) ^ S(a, 13) ^ S(a, 22)
}

function Sigma1256(a) {
    return S(a, 6) ^ S(a, 11) ^ S(a, 25)
}

function Gamma0256(a) {
    return S(a, 7) ^ S(a, 18) ^ R(a, 3)
}

function Gamma1256(a) {
    return S(a, 17) ^ S(a, 19) ^ R(a, 10)
}

function core_sha256(a, b) {
    var d = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
            3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298
        ],
        e = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
        f = Array(64),
        g, h, l, m, k, v, q, r, A, w, z, x;
    a[b >> 5] |= 128 << 24 - b % 32;
    a[(b + 64 >> 9 << 4) + 15] = b;
    for (A = 0; A < a.length; A += 16) {
        g = e[0];
        h = e[1];
        l = e[2];
        m = e[3];
        k = e[4];
        v = e[5];
        q = e[6];
        r = e[7];
        for (w = 0; 64 > w; w++) f[w] = 16 > w ? a[w + A] :
            safe_add(safe_add(safe_add(Gamma1256(f[w - 2]), f[w - 7]), Gamma0256(f[w - 15])), f[w - 16]), z = safe_add(safe_add(safe_add(safe_add(r, Sigma1256(k)), Ch(k, v, q)), d[w]), f[w]), x = safe_add(Sigma0256(g), Maj(g, h, l)), r = q, q = v, v = k, k = safe_add(m, z), m = l, l = h, h = g, g = safe_add(z, x);
        e[0] = safe_add(g, e[0]);
        e[1] = safe_add(h, e[1]);
        e[2] = safe_add(l, e[2]);
        e[3] = safe_add(m, e[3]);
        e[4] = safe_add(k, e[4]);
        e[5] = safe_add(v, e[5]);
        e[6] = safe_add(q, e[6]);
        e[7] = safe_add(r, e[7])
    }
    return e
}

function str2binb(a) {
    for (var b = [], d = (1 << chrsz) - 1, e = 0; e < a.length * chrsz; e += chrsz) b[e >> 5] |= (a.charCodeAt(e / chrsz) & d) << 24 - e % 32;
    return b
}

function binb2hex(a) {
    for (var b = "", d = 0; d < 4 * a.length; d++) b += "0123456789abcdef".charAt(a[d >> 2] >> 8 * (3 - d % 4) + 4 & 15) + "0123456789abcdef".charAt(a[d >> 2] >> 8 * (3 - d % 4) & 15);
    return b
}

function hex_sha256(a) {
    return binb2hex(core_sha256(str2binb(a), a.length * chrsz))
}
LazyLoad = function(a) {
    function b(b, d) {
        var e = a.createElement(b),
            f;
        for (f in d) d.hasOwnProperty(f) && e.setAttribute(f, d[f]);
        return e
    }

    function d(a) {
        var b = k[a],
            d, e;
        b && (d = b.callback, e = b.urls, e.shift(), v = 0, e.length || (d && d.call(b.context, b.obj), k[a] = null, q[a].length && f(a)))
    }

    function e() {
        var b = navigator.userAgent;
        l = {
            async: !0 === a.createElement("script").async
        };
        (l.webkit = /AppleWebKit\//.test(b)) || (l.ie = /MSIE|Trident/.test(b)) || (l.opera = /Opera/.test(b)) || (l.gecko = /Gecko\//.test(b)) || (l.unknown = !0)
    }

    function f(f,
        v, z, x, B) {
        var p = function() {
                d(f)
            },
            u = "css" === f,
            n = [],
            r, C, H, G;
        l || e();
        if (v)
            if (v = "string" === typeof v ? [v] : v.concat(), u || l.async || l.gecko || l.opera) q[f].push({
                urls: v,
                callback: z,
                obj: x,
                context: B
            });
            else
                for (r = 0, C = v.length; r < C; ++r) q[f].push({
                    urls: [v[r]],
                    callback: r === C - 1 ? z : null,
                    obj: x,
                    context: B
                });
        if (!k[f] && (G = k[f] = q[f].shift())) {
            m || (m = a.head || a.getElementsByTagName("head")[0]);
            v = G.urls;
            r = 0;
            for (C = v.length; r < C; ++r) z = v[r], u ? H = l.gecko ? b("style") : b("link", {
                    href: z,
                    rel: "stylesheet"
                }) : (H = b("script", {
                    src: z
                }), H.async = !1),
                H.className = "lazyload", H.setAttribute("charset", "utf-8"), l.ie && !u && "onreadystatechange" in H && !("draggable" in H) ? H.onreadystatechange = function() {
                    /loaded|complete/.test(H.readyState) && (H.onreadystatechange = null, p())
                } : u && (l.gecko || l.webkit) ? l.webkit ? (G.urls[r] = H.href, h()) : (H.innerHTML = '@import "' + z + '";', g(H)) : H.onload = H.onerror = p, n.push(H);
            r = 0;
            for (C = n.length; r < C; ++r) m.appendChild(n[r])
        }
    }

    function g(a) {
        var b;
        try {
            b = !!a.sheet.cssRules
        } catch (e) {
            v += 1;
            200 > v ? setTimeout(function() {
                g(a)
            }, 50) : b && d("css");
            return
        }
        d("css")
    }

    function h() {
        var a = k.css,
            b;
        if (a) {
            for (b = r.length; 0 <= --b;)
                if (r[b].href === a.urls[0]) {
                    d("css");
                    break
                }
            v += 1;
            a && (200 > v ? setTimeout(h, 50) : d("css"))
        }
    }
    var l, m, k = {},
        v = 0,
        q = {
            css: [],
            js: []
        },
        r = a.styleSheets;
    return {
        css: function(a, b, d, e) {
            f("css", a, b, d, e)
        },
        js: function(a, b, d, e) {
            f("js", a, b, d, e)
        }
    }
}(this.document);
var Handlebars = {};
(function(a, b) {
    a.VERSION = "1.0.0";
    a.COMPILER_REVISION = 4;
    a.REVISION_CHANGES = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: ">= 1.0.0"
    };
    a.helpers = {};
    a.partials = {};
    var d = Object.prototype.toString;
    a.registerHelper = function(b, e, f) {
        if ("[object Object]" === d.call(b)) {
            if (f || e) throw new a.Exception("Arg not supported with multiple helpers");
            a.Utils.extend(this.helpers, b)
        } else f && (e.not = f), this.helpers[b] = e
    };
    a.registerPartial = function(b, e) {
        "[object Object]" === d.call(b) ? a.Utils.extend(this.partials, b) :
            this.partials[b] = e
    };
    a.registerHelper("helperMissing", function(a) {
        if (2 === arguments.length) return b;
        throw Error("Missing helper: '" + a + "'");
    });
    a.registerHelper("blockHelperMissing", function(b, e) {
        var f = e.inverse || function() {},
            g = e.fn,
            h = d.call(b);
        "[object Function]" === h && (b = b.call(this));
        return !0 === b ? g(this) : !1 === b || null == b ? f(this) : "[object Array]" === h ? 0 < b.length ? a.helpers.each(b, e) : f(this) : g(b)
    });
    a.K = function() {};
    a.createFrame = Object.create || function(b) {
        a.K.prototype = b;
        b = new a.K;
        a.K.prototype = null;
        return b
    };
    a.logger = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        level: 3,
        methodMap: {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
        },
        log: function(b, d) {
            if (a.logger.level <= b) {
                var e = a.logger.methodMap[b];
                "undefined" !== typeof console && console[e] && console[e].call(console, d)
            }
        }
    };
    a.log = function(b, d) {
        a.logger.log(b, d)
    };
    a.registerHelper("each", function(b, e) {
        var f = e.fn,
            g = e.inverse,
            h = 0,
            k = "",
            l;
        "[object Function]" === d.call(b) && (b = b.call(this));
        e.data && (l = a.createFrame(e.data));
        if (b && "object" === typeof b)
            if (b instanceof Array)
                for (var m = b.length; h <
                    m; h++) l && (l.index = h), k += f(b[h], {
                    data: l
                });
            else
                for (m in b) b.hasOwnProperty(m) && (l && (l.key = m), k += f(b[m], {
                    data: l
                }), h++);
        0 === h && (k = g(this));
        return k
    });
    a.registerHelper("if", function(b, e) {
        "[object Function]" === d.call(b) && (b = b.call(this));
        return !b || a.Utils.isEmpty(b) ? e.inverse(this) : e.fn(this)
    });
    a.registerHelper("unless", function(b, d) {
        return a.helpers["if"].call(this, b, {
            fn: d.inverse,
            inverse: d.fn
        })
    });
    a.registerHelper("with", function(b, e) {
        "[object Function]" === d.call(b) && (b = b.call(this));
        if (!a.Utils.isEmpty(b)) return e.fn(b)
    });
    a.registerHelper("log", function(b, d) {
        var e = d.data && null != d.data.level ? parseInt(d.data.level, 10) : 1;
        a.log(e, b)
    });
    var e = function() {
        function a() {
            this.yy = {}
        }
        var b = {
                trace: function() {},
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    simpleInverse: 6,
                    statements: 7,
                    statement: 8,
                    openInverse: 9,
                    closeBlock: 10,
                    openBlock: 11,
                    mustache: 12,
                    partial: 13,
                    CONTENT: 14,
                    COMMENT: 15,
                    OPEN_BLOCK: 16,
                    inMustache: 17,
                    CLOSE: 18,
                    OPEN_INVERSE: 19,
                    OPEN_ENDBLOCK: 20,
                    path: 21,
                    OPEN: 22,
                    OPEN_UNESCAPED: 23,
                    CLOSE_UNESCAPED: 24,
                    OPEN_PARTIAL: 25,
                    partialName: 26,
                    params: 27,
                    hash: 28,
                    dataName: 29,
                    param: 30,
                    STRING: 31,
                    INTEGER: 32,
                    BOOLEAN: 33,
                    hashSegments: 34,
                    hashSegment: 35,
                    ID: 36,
                    EQUALS: 37,
                    DATA: 38,
                    pathSegments: 39,
                    SEP: 40,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    14: "CONTENT",
                    15: "COMMENT",
                    16: "OPEN_BLOCK",
                    18: "CLOSE",
                    19: "OPEN_INVERSE",
                    20: "OPEN_ENDBLOCK",
                    22: "OPEN",
                    23: "OPEN_UNESCAPED",
                    24: "CLOSE_UNESCAPED",
                    25: "OPEN_PARTIAL",
                    31: "STRING",
                    32: "INTEGER",
                    33: "BOOLEAN",
                    36: "ID",
                    37: "EQUALS",
                    38: "DATA",
                    40: "SEP"
                },
                productions_: [0, [3, 2],
                    [4, 2],
                    [4, 3],
                    [4, 2],
                    [4, 1],
                    [4, 1],
                    [4, 0],
                    [7, 1],
                    [7,
                        2
                    ],
                    [8, 3],
                    [8, 3],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [11, 3],
                    [9, 3],
                    [10, 3],
                    [12, 3],
                    [12, 3],
                    [13, 3],
                    [13, 4],
                    [6, 2],
                    [17, 3],
                    [17, 2],
                    [17, 2],
                    [17, 1],
                    [17, 1],
                    [27, 2],
                    [27, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [28, 1],
                    [34, 2],
                    [34, 1],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [26, 1],
                    [26, 1],
                    [26, 1],
                    [29, 2],
                    [21, 1],
                    [39, 3],
                    [39, 1]
                ],
                performAction: function(a, b, d, e, f, g, h) {
                    a = g.length - 1;
                    switch (f) {
                        case 1:
                            return g[a - 1];
                        case 2:
                            this.$ = new e.ProgramNode([], g[a]);
                            break;
                        case 3:
                            this.$ = new e.ProgramNode(g[a - 2], g[a]);
                            break;
                        case 4:
                            this.$ = new e.ProgramNode(g[a - 1], []);
                            break;
                        case 5:
                            this.$ = new e.ProgramNode(g[a]);
                            break;
                        case 6:
                            this.$ = new e.ProgramNode([], []);
                            break;
                        case 7:
                            this.$ = new e.ProgramNode([]);
                            break;
                        case 8:
                            this.$ = [g[a]];
                            break;
                        case 9:
                            g[a - 1].push(g[a]);
                            this.$ = g[a - 1];
                            break;
                        case 10:
                            this.$ = new e.BlockNode(g[a - 2], g[a - 1].inverse, g[a - 1], g[a]);
                            break;
                        case 11:
                            this.$ = new e.BlockNode(g[a - 2], g[a - 1], g[a - 1].inverse, g[a]);
                            break;
                        case 12:
                            this.$ = g[a];
                            break;
                        case 13:
                            this.$ = g[a];
                            break;
                        case 14:
                            this.$ = new e.ContentNode(g[a]);
                            break;
                        case 15:
                            this.$ = new e.CommentNode(g[a]);
                            break;
                        case 16:
                            this.$ =
                                new e.MustacheNode(g[a - 1][0], g[a - 1][1]);
                            break;
                        case 17:
                            this.$ = new e.MustacheNode(g[a - 1][0], g[a - 1][1]);
                            break;
                        case 18:
                            this.$ = g[a - 1];
                            break;
                        case 19:
                            this.$ = new e.MustacheNode(g[a - 1][0], g[a - 1][1], "&" === g[a - 2][2]);
                            break;
                        case 20:
                            this.$ = new e.MustacheNode(g[a - 1][0], g[a - 1][1], !0);
                            break;
                        case 21:
                            this.$ = new e.PartialNode(g[a - 1]);
                            break;
                        case 22:
                            this.$ = new e.PartialNode(g[a - 2], g[a - 1]);
                            break;
                        case 24:
                            this.$ = [
                                [g[a - 2]].concat(g[a - 1]), g[a]
                            ];
                            break;
                        case 25:
                            this.$ = [
                                [g[a - 1]].concat(g[a]), null
                            ];
                            break;
                        case 26:
                            this.$ = [
                                [g[a - 1]],
                                g[a]
                            ];
                            break;
                        case 27:
                            this.$ = [
                                [g[a]], null
                            ];
                            break;
                        case 28:
                            this.$ = [
                                [g[a]], null
                            ];
                            break;
                        case 29:
                            g[a - 1].push(g[a]);
                            this.$ = g[a - 1];
                            break;
                        case 30:
                            this.$ = [g[a]];
                            break;
                        case 31:
                            this.$ = g[a];
                            break;
                        case 32:
                            this.$ = new e.StringNode(g[a]);
                            break;
                        case 33:
                            this.$ = new e.IntegerNode(g[a]);
                            break;
                        case 34:
                            this.$ = new e.BooleanNode(g[a]);
                            break;
                        case 35:
                            this.$ = g[a];
                            break;
                        case 36:
                            this.$ = new e.HashNode(g[a]);
                            break;
                        case 37:
                            g[a - 1].push(g[a]);
                            this.$ = g[a - 1];
                            break;
                        case 38:
                            this.$ = [g[a]];
                            break;
                        case 39:
                            this.$ = [g[a - 2], g[a]];
                            break;
                        case 40:
                            this.$ =
                                [g[a - 2], new e.StringNode(g[a])];
                            break;
                        case 41:
                            this.$ = [g[a - 2], new e.IntegerNode(g[a])];
                            break;
                        case 42:
                            this.$ = [g[a - 2], new e.BooleanNode(g[a])];
                            break;
                        case 43:
                            this.$ = [g[a - 2], g[a]];
                            break;
                        case 44:
                            this.$ = new e.PartialNameNode(g[a]);
                            break;
                        case 45:
                            this.$ = new e.PartialNameNode(new e.StringNode(g[a]));
                            break;
                        case 46:
                            this.$ = new e.PartialNameNode(new e.IntegerNode(g[a]));
                            break;
                        case 47:
                            this.$ = new e.DataNode(g[a]);
                            break;
                        case 48:
                            this.$ = new e.IdNode(g[a]);
                            break;
                        case 49:
                            g[a - 2].push({
                                part: g[a],
                                separator: g[a - 1]
                            });
                            this.$ =
                                g[a - 2];
                            break;
                        case 50:
                            this.$ = [{
                                part: g[a]
                            }]
                    }
                },
                table: [{
                    3: 1,
                    4: 2,
                    5: [2, 7],
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    1: [3]
                }, {
                    5: [1, 17]
                }, {
                    5: [2, 6],
                    7: 18,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 6],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 5],
                    6: 20,
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    18: [1, 22],
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 8],
                    14: [2, 8],
                    15: [2,
                        8
                    ],
                    16: [2, 8],
                    19: [2, 8],
                    20: [2, 8],
                    22: [2, 8],
                    23: [2, 8],
                    25: [2, 8]
                }, {
                    4: 29,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    4: 30,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 12],
                    14: [2, 12],
                    15: [2, 12],
                    16: [2, 12],
                    19: [2, 12],
                    20: [2, 12],
                    22: [2, 12],
                    23: [2, 12],
                    25: [2, 12]
                }, {
                    5: [2, 13],
                    14: [2, 13],
                    15: [2, 13],
                    16: [2, 13],
                    19: [2, 13],
                    20: [2, 13],
                    22: [2, 13],
                    23: [2, 13],
                    25: [2, 13]
                }, {
                    5: [2, 14],
                    14: [2, 14],
                    15: [2, 14],
                    16: [2, 14],
                    19: [2, 14],
                    20: [2, 14],
                    22: [2, 14],
                    23: [2, 14],
                    25: [2, 14]
                }, {
                    5: [2, 15],
                    14: [2, 15],
                    15: [2, 15],
                    16: [2, 15],
                    19: [2, 15],
                    20: [2, 15],
                    22: [2, 15],
                    23: [2, 15],
                    25: [2, 15]
                }, {
                    17: 31,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 32,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 33,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    21: 35,
                    26: 34,
                    31: [1, 36],
                    32: [1, 37],
                    36: [1, 28],
                    39: 26
                }, {
                    1: [2, 1]
                }, {
                    5: [2, 2],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 2],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 4],
                    7: 38,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 4],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 9],
                    14: [2, 9],
                    15: [2, 9],
                    16: [2, 9],
                    19: [2, 9],
                    20: [2, 9],
                    22: [2, 9],
                    23: [2, 9],
                    25: [2, 9]
                }, {
                    5: [2, 23],
                    14: [2, 23],
                    15: [2, 23],
                    16: [2, 23],
                    19: [2, 23],
                    20: [2, 23],
                    22: [2, 23],
                    23: [2, 23],
                    25: [2, 23]
                }, {
                    18: [1, 39]
                }, {
                    18: [2, 27],
                    21: 44,
                    24: [2, 27],
                    27: 40,
                    28: 41,
                    29: 48,
                    30: 42,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 28],
                    24: [2, 28]
                }, {
                    18: [2, 48],
                    24: [2, 48],
                    31: [2, 48],
                    32: [2, 48],
                    33: [2, 48],
                    36: [2, 48],
                    38: [2, 48],
                    40: [1, 51]
                }, {
                    21: 52,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    10: 53,
                    20: [1, 54]
                }, {
                    10: 55,
                    20: [1, 54]
                }, {
                    18: [1, 56]
                }, {
                    18: [1, 57]
                }, {
                    24: [1, 58]
                }, {
                    18: [1, 59],
                    21: 60,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 44],
                    36: [2, 44]
                }, {
                    18: [2, 45],
                    36: [2, 45]
                }, {
                    18: [2, 46],
                    36: [2, 46]
                }, {
                    5: [2, 3],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 3],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    14: [2, 17],
                    15: [2, 17],
                    16: [2, 17],
                    19: [2, 17],
                    20: [2, 17],
                    22: [2, 17],
                    23: [2, 17],
                    25: [2, 17]
                }, {
                    18: [2, 25],
                    21: 44,
                    24: [2, 25],
                    28: 61,
                    29: 48,
                    30: 62,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 26],
                    24: [2, 26]
                }, {
                    18: [2, 30],
                    24: [2, 30],
                    31: [2, 30],
                    32: [2, 30],
                    33: [2, 30],
                    36: [2, 30],
                    38: [2, 30]
                }, {
                    18: [2, 36],
                    24: [2, 36],
                    35: 63,
                    36: [1, 64]
                }, {
                    18: [2, 31],
                    24: [2, 31],
                    31: [2, 31],
                    32: [2, 31],
                    33: [2, 31],
                    36: [2, 31],
                    38: [2, 31]
                }, {
                    18: [2, 32],
                    24: [2, 32],
                    31: [2, 32],
                    32: [2, 32],
                    33: [2, 32],
                    36: [2, 32],
                    38: [2, 32]
                }, {
                    18: [2, 33],
                    24: [2, 33],
                    31: [2, 33],
                    32: [2, 33],
                    33: [2, 33],
                    36: [2, 33],
                    38: [2, 33]
                }, {
                    18: [2, 34],
                    24: [2, 34],
                    31: [2, 34],
                    32: [2, 34],
                    33: [2, 34],
                    36: [2, 34],
                    38: [2, 34]
                }, {
                    18: [2, 35],
                    24: [2, 35],
                    31: [2, 35],
                    32: [2, 35],
                    33: [2, 35],
                    36: [2, 35],
                    38: [2, 35]
                }, {
                    18: [2, 38],
                    24: [2, 38],
                    36: [2, 38]
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    37: [1, 65],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    36: [1, 66]
                }, {
                    18: [2, 47],
                    24: [2, 47],
                    31: [2, 47],
                    32: [2, 47],
                    33: [2, 47],
                    36: [2, 47],
                    38: [2, 47]
                }, {
                    5: [2, 10],
                    14: [2, 10],
                    15: [2, 10],
                    16: [2, 10],
                    19: [2, 10],
                    20: [2, 10],
                    22: [2, 10],
                    23: [2, 10],
                    25: [2, 10]
                }, {
                    21: 67,
                    36: [1, 28],
                    39: 26
                }, {
                    5: [2, 11],
                    14: [2, 11],
                    15: [2, 11],
                    16: [2, 11],
                    19: [2, 11],
                    20: [2, 11],
                    22: [2, 11],
                    23: [2,
                        11
                    ],
                    25: [2, 11]
                }, {
                    14: [2, 16],
                    15: [2, 16],
                    16: [2, 16],
                    19: [2, 16],
                    20: [2, 16],
                    22: [2, 16],
                    23: [2, 16],
                    25: [2, 16]
                }, {
                    5: [2, 19],
                    14: [2, 19],
                    15: [2, 19],
                    16: [2, 19],
                    19: [2, 19],
                    20: [2, 19],
                    22: [2, 19],
                    23: [2, 19],
                    25: [2, 19]
                }, {
                    5: [2, 20],
                    14: [2, 20],
                    15: [2, 20],
                    16: [2, 20],
                    19: [2, 20],
                    20: [2, 20],
                    22: [2, 20],
                    23: [2, 20],
                    25: [2, 20]
                }, {
                    5: [2, 21],
                    14: [2, 21],
                    15: [2, 21],
                    16: [2, 21],
                    19: [2, 21],
                    20: [2, 21],
                    22: [2, 21],
                    23: [2, 21],
                    25: [2, 21]
                }, {
                    18: [1, 68]
                }, {
                    18: [2, 24],
                    24: [2, 24]
                }, {
                    18: [2, 29],
                    24: [2, 29],
                    31: [2, 29],
                    32: [2, 29],
                    33: [2, 29],
                    36: [2, 29],
                    38: [2, 29]
                }, {
                    18: [2, 37],
                    24: [2, 37],
                    36: [2,
                        37
                    ]
                }, {
                    37: [1, 65]
                }, {
                    21: 69,
                    29: 73,
                    31: [1, 70],
                    32: [1, 71],
                    33: [1, 72],
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 49],
                    24: [2, 49],
                    31: [2, 49],
                    32: [2, 49],
                    33: [2, 49],
                    36: [2, 49],
                    38: [2, 49],
                    40: [2, 49]
                }, {
                    18: [1, 74]
                }, {
                    5: [2, 22],
                    14: [2, 22],
                    15: [2, 22],
                    16: [2, 22],
                    19: [2, 22],
                    20: [2, 22],
                    22: [2, 22],
                    23: [2, 22],
                    25: [2, 22]
                }, {
                    18: [2, 39],
                    24: [2, 39],
                    36: [2, 39]
                }, {
                    18: [2, 40],
                    24: [2, 40],
                    36: [2, 40]
                }, {
                    18: [2, 41],
                    24: [2, 41],
                    36: [2, 41]
                }, {
                    18: [2, 42],
                    24: [2, 42],
                    36: [2, 42]
                }, {
                    18: [2, 43],
                    24: [2, 43],
                    36: [2, 43]
                }, {
                    5: [2, 18],
                    14: [2, 18],
                    15: [2, 18],
                    16: [2, 18],
                    19: [2, 18],
                    20: [2, 18],
                    22: [2, 18],
                    23: [2, 18],
                    25: [2, 18]
                }],
                defaultActions: {
                    17: [2, 1]
                },
                parseError: function(a, b) {
                    throw Error(a);
                },
                parse: function(a) {
                    var b = [0],
                        d = [null],
                        e = [],
                        f = this.table,
                        g = "",
                        h = 0,
                        k = 0,
                        l = 0;
                    this.lexer.setInput(a);
                    this.lexer.yy = this.yy;
                    this.yy.lexer = this.lexer;
                    this.yy.parser = this;
                    "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});
                    a = this.lexer.yylloc;
                    e.push(a);
                    var z = this.lexer.options && this.lexer.options.ranges;
                    "function" === typeof this.yy.parseError && (this.parseError = this.yy.parseError);
                    for (var x, m, B, v, r = {}, q, w;;) {
                        B =
                            b[b.length - 1];
                        if (this.defaultActions[B]) v = this.defaultActions[B];
                        else {
                            if (null === x || "undefined" == typeof x) x = void 0, x = this.lexer.lex() || 1, "number" !== typeof x && (x = this.symbols_[x] || x);
                            v = f[B] && f[B][x]
                        }
                        if ("undefined" === typeof v || !v.length || !v[0]) {
                            var A = "";
                            if (!l) {
                                w = [];
                                for (q in f[B]) this.terminals_[q] && 2 < q && w.push("'" + this.terminals_[q] + "'");
                                A = this.lexer.showPosition ? "Parse error on line " + (h + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + w.join(", ") + ", got '" + (this.terminals_[x] || x) + "'" : "Parse error on line " +
                                    (h + 1) + ": Unexpected " + (1 == x ? "end of input" : "'" + (this.terminals_[x] || x) + "'");
                                this.parseError(A, {
                                    text: this.lexer.match,
                                    token: this.terminals_[x] || x,
                                    line: this.lexer.yylineno,
                                    loc: a,
                                    expected: w
                                })
                            }
                        }
                        if (v[0] instanceof Array && 1 < v.length) throw Error("Parse Error: multiple actions possible at state: " + B + ", token: " + x);
                        switch (v[0]) {
                            case 1:
                                b.push(x);
                                d.push(this.lexer.yytext);
                                e.push(this.lexer.yylloc);
                                b.push(v[1]);
                                x = null;
                                m ? (x = m, m = null) : (k = this.lexer.yyleng, g = this.lexer.yytext, h = this.lexer.yylineno, a = this.lexer.yylloc,
                                    0 < l && l--);
                                break;
                            case 2:
                                w = this.productions_[v[1]][1];
                                r.$ = d[d.length - w];
                                r._$ = {
                                    first_line: e[e.length - (w || 1)].first_line,
                                    last_line: e[e.length - 1].last_line,
                                    first_column: e[e.length - (w || 1)].first_column,
                                    last_column: e[e.length - 1].last_column
                                };
                                z && (r._$.range = [e[e.length - (w || 1)].range[0], e[e.length - 1].range[1]]);
                                B = this.performAction.call(r, g, k, h, this.yy, v[1], d, e);
                                if ("undefined" !== typeof B) return B;
                                w && (b = b.slice(0, -2 * w), d = d.slice(0, -1 * w), e = e.slice(0, -1 * w));
                                b.push(this.productions_[v[1]][0]);
                                d.push(r.$);
                                e.push(r._$);
                                v = f[b[b.length - 2]][b[b.length - 1]];
                                b.push(v);
                                break;
                            case 3:
                                return !0
                        }
                    }
                }
            },
            d = function() {
                return {
                    EOF: 1,
                    parseError: function(a, b) {
                        if (this.yy.parser) this.yy.parser.parseError(a, b);
                        else throw Error(a);
                    },
                    setInput: function(a) {
                        this._input = a;
                        this._more = this._less = this.done = !1;
                        this.yylineno = this.yyleng = 0;
                        this.yytext = this.matched = this.match = "";
                        this.conditionStack = ["INITIAL"];
                        this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        };
                        this.options.ranges && (this.yylloc.range = [0, 0]);
                        this.offset = 0;
                        return this
                    },
                    input: function() {
                        var a = this._input[0];
                        this.yytext += a;
                        this.yyleng++;
                        this.offset++;
                        this.match += a;
                        this.matched += a;
                        a.match(/(?:\r\n?|\n).*/g) ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++;
                        this.options.ranges && this.yylloc.range[1]++;
                        this._input = this._input.slice(1);
                        return a
                    },
                    unput: function(a) {
                        var b = a.length,
                            d = a.split(/(?:\r\n?|\n)/g);
                        this._input = a + this._input;
                        this.yytext = this.yytext.substr(0, this.yytext.length - b - 1);
                        this.offset -= b;
                        a = this.match.split(/(?:\r\n?|\n)/g);
                        this.match = this.match.substr(0,
                            this.match.length - 1);
                        this.matched = this.matched.substr(0, this.matched.length - 1);
                        d.length - 1 && (this.yylineno -= d.length - 1);
                        var e = this.yylloc.range;
                        this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: d ? (d.length === a.length ? this.yylloc.first_column : 0) + a[a.length - d.length].length - d[0].length : this.yylloc.first_column - b
                        };
                        this.options.ranges && (this.yylloc.range = [e[0], e[0] + this.yyleng - b]);
                        return this
                    },
                    more: function() {
                        this._more = !0;
                        return this
                    },
                    less: function(a) {
                        this.unput(this.match.slice(a))
                    },
                    pastInput: function() {
                        var a = this.matched.substr(0, this.matched.length - this.match.length);
                        return (20 < a.length ? "..." : "") + a.substr(-20).replace(/\n/g, "")
                    },
                    upcomingInput: function() {
                        var a = this.match;
                        20 > a.length && (a += this._input.substr(0, 20 - a.length));
                        return (a.substr(0, 20) + (20 < a.length ? "..." : "")).replace(/\n/g, "")
                    },
                    showPosition: function() {
                        var a = this.pastInput(),
                            b = Array(a.length + 1).join("-");
                        return a + this.upcomingInput() + "\n" + b + "^"
                    },
                    next: function() {
                        if (this.done) return this.EOF;
                        this._input || (this.done = !0);
                        var a, b, d;
                        this._more || (this.match = this.yytext = "");
                        for (var e = this._currentRules(), f = 0; f < e.length && (!(b = this._input.match(this.rules[e[f]])) || a && !(b[0].length > a[0].length) || (a = b, d = f, this.options.flex)); f++);
                        if (a) {
                            if (b = a[0].match(/(?:\r\n?|\n).*/g)) this.yylineno += b.length;
                            this.yylloc = {
                                first_line: this.yylloc.last_line,
                                last_line: this.yylineno + 1,
                                first_column: this.yylloc.last_column,
                                last_column: b ? b[b.length - 1].length - b[b.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column +
                                    a[0].length
                            };
                            this.yytext += a[0];
                            this.match += a[0];
                            this.matches = a;
                            this.yyleng = this.yytext.length;
                            this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]);
                            this._more = !1;
                            this._input = this._input.slice(a[0].length);
                            this.matched += a[0];
                            a = this.performAction.call(this, this.yy, this, e[d], this.conditionStack[this.conditionStack.length - 1]);
                            this.done && this._input && (this.done = !1);
                            if (a) return a
                        } else return "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" +
                            this.showPosition(), {
                                text: "",
                                token: null,
                                line: this.yylineno
                            })
                    },
                    lex: function() {
                        var a = this.next();
                        return "undefined" !== typeof a ? a : this.lex()
                    },
                    begin: function(a) {
                        this.conditionStack.push(a)
                    },
                    popState: function() {
                        return this.conditionStack.pop()
                    },
                    _currentRules: function() {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                    },
                    topState: function() {
                        return this.conditionStack[this.conditionStack.length - 2]
                    },
                    pushState: function(a) {
                        this.begin(a)
                    },
                    options: {},
                    performAction: function(a, b, d, e) {
                        switch (d) {
                            case 0:
                                return b.yytext =
                                    "\\", 14;
                            case 1:
                                "\\" !== b.yytext.slice(-1) && this.begin("mu");
                                "\\" === b.yytext.slice(-1) && (b.yytext = b.yytext.substr(0, b.yyleng - 1), this.begin("emu"));
                                if (b.yytext) return 14;
                                break;
                            case 2:
                                return 14;
                            case 3:
                                return "\\" !== b.yytext.slice(-1) && this.popState(), "\\" === b.yytext.slice(-1) && (b.yytext = b.yytext.substr(0, b.yyleng - 1)), 14;
                            case 4:
                                return b.yytext = b.yytext.substr(0, b.yyleng - 4), this.popState(), 15;
                            case 5:
                                return 25;
                            case 6:
                                return 16;
                            case 7:
                                return 20;
                            case 8:
                                return 19;
                            case 9:
                                return 19;
                            case 10:
                                return 23;
                            case 11:
                                return 22;
                            case 12:
                                this.popState();
                                this.begin("com");
                                break;
                            case 13:
                                return b.yytext = b.yytext.substr(3, b.yyleng - 5), this.popState(), 15;
                            case 14:
                                return 22;
                            case 15:
                                return 37;
                            case 16:
                                return 36;
                            case 17:
                                return 36;
                            case 18:
                                return 40;
                            case 20:
                                return this.popState(), 24;
                            case 21:
                                return this.popState(), 18;
                            case 22:
                                return b.yytext = b.yytext.substr(1, b.yyleng - 2).replace(/\\"/g, '"'), 31;
                            case 23:
                                return b.yytext = b.yytext.substr(1, b.yyleng - 2).replace(/\\'/g, "'"), 31;
                            case 24:
                                return 38;
                            case 25:
                                return 33;
                            case 26:
                                return 33;
                            case 27:
                                return 32;
                            case 28:
                                return 36;
                            case 29:
                                return b.yytext = b.yytext.substr(1, b.yyleng - 2), 36;
                            case 30:
                                return "INVALID";
                            case 31:
                                return 5
                        }
                    },
                    rules: [/^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}\/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/,
                        /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/
                    ],
                    conditions: {
                        mu: {
                            rules: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                            inclusive: !1
                        },
                        emu: {
                            rules: [3],
                            inclusive: !1
                        },
                        com: {
                            rules: [4],
                            inclusive: !1
                        },
                        INITIAL: {
                            rules: [0, 1, 2, 31],
                            inclusive: !0
                        }
                    }
                }
            }();
        b.lexer = d;
        a.prototype = b;
        b.Parser = a;
        return new a
    }();
    a.Parser = e;
    a.parse = function(b) {
        if (b.constructor ===
            a.AST.ProgramNode) return b;
        a.Parser.yy = a.AST;
        return a.Parser.parse(b)
    };
    a.AST = {};
    a.AST.ProgramNode = function(b, d) {
        this.type = "program";
        this.statements = b;
        d && (this.inverse = new a.AST.ProgramNode(d))
    };
    a.AST.MustacheNode = function(a, b, d) {
        this.type = "mustache";
        this.escaped = !d;
        this.hash = b;
        d = this.id = a[0];
        a = this.params = a.slice(1);
        this.isHelper = (this.eligibleHelper = d.isSimple) && (a.length || b)
    };
    a.AST.PartialNode = function(a, b) {
        this.type = "partial";
        this.partialName = a;
        this.context = b
    };
    a.AST.BlockNode = function(b, d, e, f) {
        var g =
            b.id;
        if (g.original !== f.original) throw new a.Exception(g.original + " doesn't match " + f.original);
        this.type = "block";
        this.mustache = b;
        this.program = d;
        (this.inverse = e) && !this.program && (this.isInverse = !0)
    };
    a.AST.ContentNode = function(a) {
        this.type = "content";
        this.string = a
    };
    a.AST.HashNode = function(a) {
        this.type = "hash";
        this.pairs = a
    };
    a.AST.IdNode = function(b) {
        this.type = "ID";
        for (var d = "", e = [], f = 0, g = 0, h = b.length; g < h; g++) {
            var k = b[g].part,
                d = d + ((b[g].separator || "") + k);
            if (".." === k || "." === k || "this" === k) {
                if (0 < e.length) throw new a.Exception("Invalid path: " +
                    d);
                ".." === k ? f++ : this.isScoped = !0
            } else e.push(k)
        }
        this.original = d;
        this.parts = e;
        this.string = e.join(".");
        this.depth = f;
        this.isSimple = 1 === b.length && !this.isScoped && 0 === f;
        this.stringModeValue = this.string
    };
    a.AST.PartialNameNode = function(a) {
        this.type = "PARTIAL_NAME";
        this.name = a.original
    };
    a.AST.DataNode = function(a) {
        this.type = "DATA";
        this.id = a
    };
    a.AST.StringNode = function(a) {
        this.type = "STRING";
        this.original = this.string = this.stringModeValue = a
    };
    a.AST.IntegerNode = function(a) {
        this.type = "INTEGER";
        this.original = this.integer =
            a;
        this.stringModeValue = Number(a)
    };
    a.AST.BooleanNode = function(a) {
        this.type = "BOOLEAN";
        this.bool = a;
        this.stringModeValue = "true" === a
    };
    a.AST.CommentNode = function(a) {
        this.type = "comment";
        this.comment = a
    };
    var f = "description fileName lineNumber message name number stack".split(" ");
    a.Exception = function(a) {
        for (var b = Error.prototype.constructor.apply(this, arguments), d = 0; d < f.length; d++) this[f[d]] = b[f[d]]
    };
    a.Exception.prototype = Error();
    a.SafeString = function(a) {
        this.string = a
    };
    a.SafeString.prototype.toString = function() {
        return this.string.toString()
    };
    var g = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        h = /[&<>"'`]/g,
        l = /[&<>"'`]/,
        m = function(a) {
            return g[a] || "&amp;"
        };
    a.Utils = {
        extend: function(a, b) {
            for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d])
        },
        escapeExpression: function(b) {
            if (b instanceof a.SafeString) return b.toString();
            if (null == b || !1 === b) return "";
            b = b.toString();
            return l.test(b) ? b.replace(h, m) : b
        },
        isEmpty: function(a) {
            return a || 0 === a ? "[object Array]" === d.call(a) && 0 === a.length ? !0 : !1 : !0
        }
    };
    var k = a.Compiler = function() {},
        v =
        a.JavaScriptCompiler = function() {};
    k.prototype = {
        compiler: k,
        disassemble: function() {
            for (var a = this.opcodes, b, d = [], e, f, g = 0, h = a.length; g < h; g++)
                if (b = a[g], "DECLARE" === b.opcode) d.push("DECLARE " + b.name + "=" + b.value);
                else {
                    e = [];
                    for (var k = 0; k < b.args.length; k++) f = b.args[k], "string" === typeof f && (f = '"' + f.replace("\n", "\\n") + '"'), e.push(f);
                    d.push(b.opcode + " " + e.join(" "))
                }
            return d.join("\n")
        },
        equals: function(a) {
            var b = this.opcodes.length;
            if (a.opcodes.length !== b) return !1;
            for (var d = 0; d < b; d++) {
                var e = this.opcodes[d],
                    f = a.opcodes[d];
                if (e.opcode !== f.opcode || e.args.length !== f.args.length) return !1;
                for (var g = 0; g < e.args.length; g++)
                    if (e.args[g] !== f.args[g]) return !1
            }
            b = this.children.length;
            if (a.children.length !== b) return !1;
            for (d = 0; d < b; d++)
                if (!this.children[d].equals(a.children[d])) return !1;
            return !0
        },
        guid: 0,
        compile: function(a, b) {
            this.children = [];
            this.depths = {
                list: []
            };
            this.options = b;
            var d = this.options.knownHelpers;
            this.options.knownHelpers = {
                helperMissing: !0,
                blockHelperMissing: !0,
                each: !0,
                "if": !0,
                unless: !0,
                "with": !0,
                log: !0
            };
            if (d)
                for (var e in d) this.options.knownHelpers[e] = d[e];
            return this.program(a)
        },
        accept: function(a) {
            return this[a.type](a)
        },
        program: function(a) {
            a = a.statements;
            var b;
            this.opcodes = [];
            for (var d = 0, e = a.length; d < e; d++) b = a[d], this[b.type](b);
            this.isSimple = 1 === e;
            this.depths.list = this.depths.list.sort(function(a, b) {
                return a - b
            });
            return this
        },
        compileProgram: function(a) {
            a = (new this.compiler).compile(a, this.options);
            var b = this.guid++,
                d;
            this.usePartial = this.usePartial || a.usePartial;
            this.children[b] = a;
            for (var e = 0,
                    f = a.depths.list.length; e < f; e++) d = a.depths.list[e], 2 > d || this.addDepth(d - 1);
            return b
        },
        block: function(a) {
            var b = a.mustache,
                d = a.program;
            a = a.inverse;
            d && (d = this.compileProgram(d));
            a && (a = this.compileProgram(a));
            var e = this.classifyMustache(b);
            "helper" === e ? this.helperMustache(b, d, a) : "simple" === e ? (this.simpleMustache(b), this.opcode("pushProgram", d), this.opcode("pushProgram", a), this.opcode("emptyHash"), this.opcode("blockValue")) : (this.ambiguousMustache(b, d, a), this.opcode("pushProgram", d), this.opcode("pushProgram",
                a), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue"));
            this.opcode("append")
        },
        hash: function(a) {
            a = a.pairs;
            var b, d;
            this.opcode("pushHash");
            for (var e = 0, f = a.length; e < f; e++) b = a[e], d = b[1], this.options.stringParams ? (d.depth && this.addDepth(d.depth), this.opcode("getContext", d.depth || 0), this.opcode("pushStringParam", d.stringModeValue, d.type)) : this.accept(d), this.opcode("assignToHash", b[0]);
            this.opcode("popHash")
        },
        partial: function(a) {
            var b = a.partialName;
            this.usePartial = !0;
            a.context ? this.ID(a.context) :
                this.opcode("push", "depth0");
            this.opcode("invokePartial", b.name);
            this.opcode("append")
        },
        content: function(a) {
            this.opcode("appendContent", a.string)
        },
        mustache: function(a) {
            var b = this.options,
                d = this.classifyMustache(a);
            "simple" === d ? this.simpleMustache(a) : "helper" === d ? this.helperMustache(a) : this.ambiguousMustache(a);
            a.escaped && !b.noEscape ? this.opcode("appendEscaped") : this.opcode("append")
        },
        ambiguousMustache: function(a, b, d) {
            a = a.id;
            var e = a.parts[0],
                f = null != b || null != d;
            this.opcode("getContext", a.depth);
            this.opcode("pushProgram",
                b);
            this.opcode("pushProgram", d);
            this.opcode("invokeAmbiguous", e, f)
        },
        simpleMustache: function(a) {
            a = a.id;
            "DATA" === a.type ? this.DATA(a) : a.parts.length ? this.ID(a) : (this.addDepth(a.depth), this.opcode("getContext", a.depth), this.opcode("pushContext"));
            this.opcode("resolvePossibleLambda")
        },
        helperMustache: function(a, b, d) {
            b = this.setupFullMustacheParams(a, b, d);
            a = a.id.parts[0];
            if (this.options.knownHelpers[a]) this.opcode("invokeKnownHelper", b.length, a);
            else {
                if (this.options.knownHelpersOnly) throw Error("You specified knownHelpersOnly, but used the unknown helper " +
                    a);
                this.opcode("invokeHelper", b.length, a)
            }
        },
        ID: function(a) {
            this.addDepth(a.depth);
            this.opcode("getContext", a.depth);
            a.parts[0] ? this.opcode("lookupOnContext", a.parts[0]) : this.opcode("pushContext");
            for (var b = 1, d = a.parts.length; b < d; b++) this.opcode("lookup", a.parts[b])
        },
        DATA: function(b) {
            this.options.data = !0;
            if (b.id.isScoped || b.id.depth) throw new a.Exception("Scoped data references are not supported: " + b.original);
            this.opcode("lookupData");
            b = b.id.parts;
            for (var d = 0, e = b.length; d < e; d++) this.opcode("lookup",
                b[d])
        },
        STRING: function(a) {
            this.opcode("pushString", a.string)
        },
        INTEGER: function(a) {
            this.opcode("pushLiteral", a.integer)
        },
        BOOLEAN: function(a) {
            this.opcode("pushLiteral", a.bool)
        },
        comment: function() {},
        opcode: function(a) {
            this.opcodes.push({
                opcode: a,
                args: [].slice.call(arguments, 1)
            })
        },
        declare: function(a, b) {
            this.opcodes.push({
                opcode: "DECLARE",
                name: a,
                value: b
            })
        },
        addDepth: function(a) {
            if (isNaN(a)) throw Error("EWOT");
            0 === a || this.depths[a] || (this.depths[a] = !0, this.depths.list.push(a))
        },
        classifyMustache: function(a) {
            var b =
                a.isHelper,
                d = a.eligibleHelper,
                e = this.options;
            d && !b && (e.knownHelpers[a.id.parts[0]] ? b = !0 : e.knownHelpersOnly && (d = !1));
            return b ? "helper" : d ? "ambiguous" : "simple"
        },
        pushParams: function(a) {
            for (var b = a.length, d; b--;)
                if (d = a[b], this.options.stringParams) d.depth && this.addDepth(d.depth), this.opcode("getContext", d.depth || 0), this.opcode("pushStringParam", d.stringModeValue, d.type);
                else this[d.type](d)
        },
        setupMustacheParams: function(a) {
            var b = a.params;
            this.pushParams(b);
            a.hash ? this.hash(a.hash) : this.opcode("emptyHash");
            return b
        },
        setupFullMustacheParams: function(a, b, d) {
            var e = a.params;
            this.pushParams(e);
            this.opcode("pushProgram", b);
            this.opcode("pushProgram", d);
            a.hash ? this.hash(a.hash) : this.opcode("emptyHash");
            return e
        }
    };
    var q = function(a) {
        this.value = a
    };
    v.prototype = {
        nameLookup: function(a, b) {
            return /^[0-9]+$/.test(b) ? a + "[" + b + "]" : v.isValidJavaScriptVariableName(b) ? a + "." + b : a + "['" + b + "']"
        },
        appendToBuffer: function(a) {
            return this.environment.isSimple ? "return " + a + ";" : {
                appendToBuffer: !0,
                content: a,
                toString: function() {
                    return "buffer += " +
                        a + ";"
                }
            }
        },
        initializeBuffer: function() {
            return this.quotedString("")
        },
        namespace: "Handlebars",
        compile: function(b, d, e, f) {
            this.environment = b;
            this.options = d || {};
            a.log(a.logger.DEBUG, this.environment.disassemble() + "\n\n");
            this.name = this.environment.name;
            this.isChild = !!e;
            this.context = e || {
                programs: [],
                environments: [],
                aliases: {}
            };
            this.preamble();
            this.stackSlot = 0;
            this.stackVars = [];
            this.registers = {
                list: []
            };
            this.compileStack = [];
            this.inlineStack = [];
            this.compileChildren(b, d);
            b = b.opcodes;
            this.i = 0;
            for (w = b.length; this.i <
                w; this.i++) d = b[this.i], "DECLARE" === d.opcode ? this[d.name] = d.value : this[d.opcode].apply(this, d.args);
            return this.createFunctionContext(f)
        },
        nextOpcode: function() {
            return this.environment.opcodes[this.i + 1]
        },
        eat: function() {
            this.i += 1
        },
        preamble: function() {
            var a = [];
            if (this.isChild) a.push("");
            else {
                var b = this.namespace,
                    d = "helpers = this.merge(helpers, " + b + ".helpers);";
                this.environment.usePartial && (d = d + " partials = this.merge(partials, " + b + ".partials);");
                this.options.data && (d += " data = data || {};");
                a.push(d)
            }
            this.environment.isSimple ?
                a.push("") : a.push(", buffer = " + this.initializeBuffer());
            this.lastContext = 0;
            this.source = a
        },
        createFunctionContext: function(b) {
            var d = this.stackVars.concat(this.registers.list);
            0 < d.length && (this.source[1] = this.source[1] + ", " + d.join(", "));
            if (!this.isChild)
                for (var e in this.context.aliases) this.context.aliases.hasOwnProperty(e) && (this.source[1] = this.source[1] + ", " + e + "=" + this.context.aliases[e]);
            this.source[1] && (this.source[1] = "var " + this.source[1].substring(2) + ";");
            this.isChild || (this.source[1] += "\n" +
                this.context.programs.join("\n") + "\n");
            this.environment.isSimple || this.source.push("return buffer;");
            d = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];
            e = 0;
            for (var f = this.environment.depths.list.length; e < f; e++) d.push("depth" + this.environment.depths.list[e]);
            e = this.mergeSource();
            this.isChild || (f = a.COMPILER_REVISION, e = "this.compilerInfo = [" + f + ",'" + a.REVISION_CHANGES[f] + "'];\n" + e);
            if (b) return d.push(e), Function.apply(this, d);
            b = "function " + (this.name || "") + "(" + d.join(",") +
                ") {\n  " + e + "}";
            a.log(a.logger.DEBUG, b + "\n\n");
            return b
        },
        mergeSource: function() {
            for (var a = "", d, e = 0, f = this.source.length; e < f; e++) {
                var g = this.source[e];
                g.appendToBuffer ? d = d ? d + "\n    + " + g.content : g.content : (d && (a += "buffer += " + d + ";\n  ", d = b), a += g + "\n  ")
            }
            return a
        },
        blockValue: function() {
            this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
            var a = ["depth0"];
            this.setupParams(0, a);
            this.replaceStack(function(b) {
                a.splice(1, 0, b);
                return "blockHelperMissing.call(" + a.join(", ") + ")"
            })
        },
        ambiguousBlockValue: function() {
            this.context.aliases.blockHelperMissing =
                "helpers.blockHelperMissing";
            var a = ["depth0"];
            this.setupParams(0, a);
            var b = this.topStack();
            a.splice(1, 0, b);
            a[a.length - 1] = "options";
            this.source.push("if (!" + this.lastHelper + ") { " + b + " = blockHelperMissing.call(" + a.join(", ") + "); }")
        },
        appendContent: function(a) {
            this.source.push(this.appendToBuffer(this.quotedString(a)))
        },
        append: function() {
            this.flushInline();
            var a = this.popStack();
            this.source.push("if(" + a + " || " + a + " === 0) { " + this.appendToBuffer(a) + " }");
            this.environment.isSimple && this.source.push("else { " +
                this.appendToBuffer("''") + " }")
        },
        appendEscaped: function() {
            this.context.aliases.escapeExpression = "this.escapeExpression";
            this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
        },
        getContext: function(a) {
            this.lastContext !== a && (this.lastContext = a)
        },
        lookupOnContext: function(a) {
            this.push(this.nameLookup("depth" + this.lastContext, a, "context"))
        },
        pushContext: function() {
            this.pushStackLiteral("depth" + this.lastContext)
        },
        resolvePossibleLambda: function() {
            this.context.aliases.functionType = '"function"';
            this.replaceStack(function(a) {
                return "typeof " + a + " === functionType ? " + a + ".apply(depth0) : " + a
            })
        },
        lookup: function(a) {
            this.replaceStack(function(b) {
                return b + " == null || " + b + " === false ? " + b + " : " + this.nameLookup(b, a, "context")
            })
        },
        lookupData: function(a) {
            this.push("data")
        },
        pushStringParam: function(a, b) {
            this.pushStackLiteral("depth" + this.lastContext);
            this.pushString(b);
            "string" === typeof a ? this.pushString(a) : this.pushStackLiteral(a)
        },
        emptyHash: function() {
            this.pushStackLiteral("{}");
            this.options.stringParams &&
                (this.register("hashTypes", "{}"), this.register("hashContexts", "{}"))
        },
        pushHash: function() {
            this.hash = {
                values: [],
                types: [],
                contexts: []
            }
        },
        popHash: function() {
            var a = this.hash;
            this.hash = b;
            this.options.stringParams && (this.register("hashContexts", "{" + a.contexts.join(",") + "}"), this.register("hashTypes", "{" + a.types.join(",") + "}"));
            this.push("{\n    " + a.values.join(",\n    ") + "\n  }")
        },
        pushString: function(a) {
            this.pushStackLiteral(this.quotedString(a))
        },
        push: function(a) {
            this.inlineStack.push(a);
            return a
        },
        pushLiteral: function(a) {
            this.pushStackLiteral(a)
        },
        pushProgram: function(a) {
            null != a ? this.pushStackLiteral(this.programExpression(a)) : this.pushStackLiteral(null)
        },
        invokeHelper: function(a, b) {
            this.context.aliases.helperMissing = "helpers.helperMissing";
            var d = this.lastHelper = this.setupHelper(a, b, !0),
                e = this.nameLookup("depth" + this.lastContext, b, "context");
            this.push(d.name + " || " + e);
            this.replaceStack(function(a) {
                return a + " ? " + a + ".call(" + d.callParams + ") : helperMissing.call(" + d.helperMissingParams + ")"
            })
        },
        invokeKnownHelper: function(a, b) {
            var d = this.setupHelper(a,
                b);
            this.push(d.name + ".call(" + d.callParams + ")")
        },
        invokeAmbiguous: function(a, b) {
            this.context.aliases.functionType = '"function"';
            this.pushStackLiteral("{}");
            var d = this.setupHelper(0, a, b),
                e = this.lastHelper = this.nameLookup("helpers", a, "helper"),
                f = this.nameLookup("depth" + this.lastContext, a, "context"),
                g = this.nextStack();
            this.source.push("if (" + g + " = " + e + ") { " + g + " = " + g + ".call(" + d.callParams + "); }");
            this.source.push("else { " + g + " = " + f + "; " + g + " = typeof " + g + " === functionType ? " + g + ".apply(depth0) : " + g +
                "; }")
        },
        invokePartial: function(a) {
            a = [this.nameLookup("partials", a, "partial"), "'" + a + "'", this.popStack(), "helpers", "partials"];
            this.options.data && a.push("data");
            this.context.aliases.self = "this";
            this.push("self.invokePartial(" + a.join(", ") + ")")
        },
        assignToHash: function(a) {
            var b = this.popStack(),
                d, e;
            this.options.stringParams && (e = this.popStack(), d = this.popStack());
            var f = this.hash;
            d && f.contexts.push("'" + a + "': " + d);
            e && f.types.push("'" + a + "': " + e);
            f.values.push("'" + a + "': (" + b + ")")
        },
        compiler: v,
        compileChildren: function(a,
            b) {
            for (var d = a.children, e, f, g = 0, h = d.length; g < h; g++) {
                e = d[g];
                f = new this.compiler;
                var k = this.matchExistingProgram(e);
                null == k ? (this.context.programs.push(""), k = this.context.programs.length, e.index = k, e.name = "program" + k, this.context.programs[k] = f.compile(e, b, this.context), this.context.environments[k] = e) : (e.index = k, e.name = "program" + k)
            }
        },
        matchExistingProgram: function(a) {
            for (var b = 0, d = this.context.environments.length; b < d; b++) {
                var e = this.context.environments[b];
                if (e && e.equals(a)) return b
            }
        },
        programExpression: function(a) {
            this.context.aliases.self =
                "this";
            if (null == a) return "self.noop";
            var b = this.environment.children[a];
            a = b.depths.list;
            for (var d = [b.index, b.name, "data"], e = 0, f = a.length; e < f; e++) b = a[e], 1 === b ? d.push("depth0") : d.push("depth" + (b - 1));
            return (0 === a.length ? "self.program(" : "self.programWithDepth(") + d.join(", ") + ")"
        },
        register: function(a, b) {
            this.useRegister(a);
            this.source.push(a + " = " + b + ";")
        },
        useRegister: function(a) {
            this.registers[a] || (this.registers[a] = !0, this.registers.list.push(a))
        },
        pushStackLiteral: function(a) {
            return this.push(new q(a))
        },
        pushStack: function(a) {
            this.flushInline();
            var b = this.incrStack();
            a && this.source.push(b + " = " + a + ";");
            this.compileStack.push(b);
            return b
        },
        replaceStack: function(a) {
            var b = "",
                d = this.isInline(),
                e;
            d ? (e = this.popStack(!0), e instanceof q ? e = e.value : (b = this.stackSlot ? this.topStackName() : this.incrStack(), b = "(" + this.push(b) + " = " + e + "),", e = this.topStack())) : e = this.topStack();
            a = a.call(this, e);
            d ? ((this.inlineStack.length || this.compileStack.length) && this.popStack(), this.push("(" + b + a + ")")) : (/^stack/.test(e) || (e = this.nextStack()),
                this.source.push(e + " = (" + b + a + ");"));
            return e
        },
        nextStack: function() {
            return this.pushStack()
        },
        incrStack: function() {
            this.stackSlot++;
            this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot);
            return this.topStackName()
        },
        topStackName: function() {
            return "stack" + this.stackSlot
        },
        flushInline: function() {
            var a = this.inlineStack;
            if (a.length) {
                this.inlineStack = [];
                for (var b = 0, d = a.length; b < d; b++) {
                    var e = a[b];
                    e instanceof q ? this.compileStack.push(e) : this.pushStack(e)
                }
            }
        },
        isInline: function() {
            return this.inlineStack.length
        },
        popStack: function(a) {
            var b = this.isInline(),
                d = (b ? this.inlineStack : this.compileStack).pop();
            if (!a && d instanceof q) return d.value;
            b || this.stackSlot--;
            return d
        },
        topStack: function(a) {
            var b = this.isInline() ? this.inlineStack : this.compileStack,
                b = b[b.length - 1];
            return !a && b instanceof q ? b.value : b
        },
        quotedString: function(a) {
            return '"' + a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
        },
        setupHelper: function(a, b, d) {
            var e =
                [];
            this.setupParams(a, e, d);
            a = this.nameLookup("helpers", b, "helper");
            return {
                params: e,
                name: a,
                callParams: ["depth0"].concat(e).join(", "),
                helperMissingParams: d && ["depth0", this.quotedString(b)].concat(e).join(", ")
            }
        },
        setupParams: function(a, b, d) {
            var e = [],
                f = [],
                g = [],
                h, k;
            e.push("hash:" + this.popStack());
            h = this.popStack();
            if ((k = this.popStack()) || h) k || (this.context.aliases.self = "this", k = "self.noop"), h || (this.context.aliases.self = "this", h = "self.noop"), e.push("inverse:" + h), e.push("fn:" + k);
            for (k = 0; k < a; k++) h = this.popStack(),
                b.push(h), this.options.stringParams && (g.push(this.popStack()), f.push(this.popStack()));
            this.options.stringParams && (e.push("contexts:[" + f.join(",") + "]"), e.push("types:[" + g.join(",") + "]"), e.push("hashContexts:hashContexts"), e.push("hashTypes:hashTypes"));
            this.options.data && e.push("data:data");
            e = "{" + e.join(",") + "}";
            d ? (this.register("options", e), b.push("options")) : b.push(e);
            return b.join(", ")
        }
    };
    for (var e = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "),
            r = v.RESERVED_WORDS = {}, A = 0, w = e.length; A < w; A++) r[e[A]] = !0;
    v.isValidJavaScriptVariableName = function(a) {
        return !v.RESERVED_WORDS[a] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(a) ? !0 : !1
    };
    a.precompile = function(b, d) {
        if (null == b || "string" !== typeof b && b.constructor !== a.AST.ProgramNode) throw new a.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + b);
        d = d || {};
        "data" in d || (d.data = !0);
        var e = a.parse(b),
            e = (new k).compile(e, d);
        return (new v).compile(e, d)
    };
    a.compile = function(d, e) {
        if (null ==
            d || "string" !== typeof d && d.constructor !== a.AST.ProgramNode) throw new a.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + d);
        e = e || {};
        "data" in e || (e.data = !0);
        var f;
        return function(g, h) {
            if (!f) {
                var l = a.parse(d),
                    l = (new k).compile(l, e),
                    l = (new v).compile(l, e, b, !0);
                f = a.template(l)
            }
            return f.call(this, g, h)
        }
    };
    a.VM = {
        template: function(b) {
            var d = {
                escapeExpression: a.Utils.escapeExpression,
                invokePartial: a.VM.invokePartial,
                programs: [],
                program: function(b, d, e) {
                    var f = this.programs[b];
                    e ? f = a.VM.program(b, d, e) : f || (f = this.programs[b] = a.VM.program(b, d));
                    return f
                },
                merge: function(b, d) {
                    var e = b || d;
                    b && d && (e = {}, a.Utils.extend(e, d), a.Utils.extend(e, b));
                    return e
                },
                programWithDepth: a.VM.programWithDepth,
                noop: a.VM.noop,
                compilerInfo: null
            };
            return function(e, f) {
                f = f || {};
                var g = b.call(d, a, e, f.helpers, f.partials, f.data),
                    h = d.compilerInfo || [],
                    k = h[0] || 1,
                    l = a.COMPILER_REVISION;
                if (k !== l) {
                    if (k < l) throw "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" +
                        a.REVISION_CHANGES[l] + ") or downgrade your runtime to an older version (" + a.REVISION_CHANGES[k] + ").";
                    throw "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + h[1] + ").";
                }
                return g
            }
        },
        programWithDepth: function(a, b, d) {
            var e = Array.prototype.slice.call(arguments, 3),
                f = function(a, f) {
                    f = f || {};
                    return b.apply(this, [a, f.data || d].concat(e))
                };
            f.program = a;
            f.depth = e.length;
            return f
        },
        program: function(a, b, d) {
            var e = function(a, e) {
                e = e || {};
                return b(a, e.data || d)
            };
            e.program = a;
            e.depth = 0;
            return e
        },
        noop: function() {
            return ""
        },
        invokePartial: function(d, e, f, g, h, k) {
            g = {
                helpers: g,
                partials: h,
                data: k
            };
            if (d === b) throw new a.Exception("The partial " + e + " could not be found");
            if (d instanceof Function) return d(f, g);
            if (a.compile) return h[e] = a.compile(d, {
                data: k !== b
            }), h[e](f, g);
            throw new a.Exception("The partial " + e + " could not be compiled when running in runtime-only mode");
        }
    };
    a.template = a.VM.template
})(Handlebars);
(function(a, b) {
    function d(d, e) {
        function h(a) {
            return k.preferFlash && ua && !k.ignoreFlash && k.flash[a] !== b && k.flash[a]
        }

        function l(a) {
            return function(b) {
                var d = this._s;
                return d && d._a ? a.call(this, b) : null
            }
        }
        this.setupOptions = {
            url: d || null,
            flashVersion: 8,
            debugMode: !0,
            debugFlash: !1,
            useConsole: !0,
            consoleOnly: !0,
            waitForWindowLoad: !1,
            bgColor: "#ffffff",
            useHighPerformance: !1,
            flashPollingInterval: null,
            html5PollingInterval: null,
            flashLoadTimeout: 1E3,
            wmode: null,
            allowScriptAccess: "always",
            useFlashBlock: !1,
            useHTML5Audio: !0,
            forceUseGlobalHTML5Audio: !1,
            ignoreMobileRestrictions: !1,
            html5Test: /^(probably|maybe)$/i,
            preferFlash: !1,
            noSWFCache: !1,
            idPrefix: "sound"
        };
        this.defaultOptions = {
            autoLoad: !1,
            autoPlay: !1,
            from: null,
            loops: 1,
            onid3: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onposition: null,
            onstop: null,
            onfailure: null,
            onfinish: null,
            multiShot: !0,
            multiShotEvents: !1,
            position: null,
            pan: 0,
            stream: !0,
            to: null,
            type: null,
            usePolicyFile: !1,
            volume: 100
        };
        this.flash9Options = {
            isMovieStar: null,
            usePeakData: !1,
            useWaveformData: !1,
            useEQData: !1,
            onbufferchange: null,
            ondataerror: null
        };
        this.movieStarOptions = {
            bufferTime: 3,
            serverURL: null,
            onconnect: null,
            duration: null
        };
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: !0
            },
            mp4: {
                related: ["aac", "m4a", "m4b"],
                type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: !1
            },
            ogg: {
                type: ["audio/ogg; codecs=vorbis"],
                required: !1
            },
            opus: {
                type: ["audio/ogg; codecs=opus",
                    "audio/opus"
                ],
                required: !1
            },
            wav: {
                type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
                required: !1
            }
        };
        this.movieID = "sm2-container";
        this.id = e || "sm2movie";
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.versionNumber = "V2.97a.20150601";
        this.altURL = this.movieURL = this.version = null;
        this.enabled = this.swfLoaded = !1;
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.didFlashBlock = this.muted = !1;
        this.filePattern = null;
        this.filePatterns = {
            flash8: /\.mp3(\?.*)?$/i,
            flash9: /\.mp3(\?.*)?$/i
        };
        this.features = {
            buffering: !1,
            peakData: !1,
            waveformData: !1,
            eqData: !1,
            movieStar: !1
        };
        this.sandbox = {};
        this.html5 = {
            usingFlash: null
        };
        this.flash = {};
        this.ignoreFlash = this.html5Only = !1;
        var m, k = this,
            v = null,
            q = null,
            r, A = navigator.userAgent,
            w = a.location.href.toString(),
            z = document,
            x, B, p, u, n = [],
            D = !1,
            C = !1,
            H = !1,
            G = !1,
            O = !1,
            M, J, T, N, y, E, I, K, F, L, X, U, Y, oa, ca, Z, fa, pa, ka, aa, ra, Ca, la, Ka, Wa, La = null,
            ha = null,
            Da, Xa, Ea, qa, ma, V, Fa = !1,
            Za = !1,
            gb, hb, $a, Pa = 0,
            Ma = null,
            Qa, W = [],
            ia, P = null,
            ba, za, sa, ga, va, Aa, ja, Q, ib = Array.prototype.slice,
            da = !1,
            Ga, ua, ab, jb, ta, Ra, bb = 0,
            Sa, cb = A.match(/(ipad|iphone|ipod)/i),
            db = A.match(/android/i),
            wa = A.match(/msie/i),
            lb = A.match(/webkit/i),
            Ta = A.match(/safari/i) && !A.match(/chrome/i),
            eb = A.match(/opera/i),
            Na = A.match(/(mobile|pre\/|xoom)/i) || cb || db,
            fb = !w.match(/usehtml5audio/i) && !w.match(/sm2\-ignorebadua/i) && Ta && !A.match(/silk/i) && A.match(/OS X 10_6_([3-7])/i),
            Ua = z.hasFocus !== b ? z.hasFocus() : null,
            Ha = Ta && (z.hasFocus === b || !z.hasFocus()),
            xa = !Ha,
            Ia = /(mp3|mp4|mpa|m4a|m4b)/i,
            Ba = z.location ? z.location.protocol.match(/http/i) :
            null,
            Va = Ba ? "" : "http://",
            Oa = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
            ea = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),
            Ja = new RegExp("\\.(" + ea.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.useAltURL = !Ba;
        var na;
        try {
            na = Audio !== b && (eb && opera !== b && 10 > opera.version() ? new Audio(null) : new Audio).canPlayType !== b
        } catch (ya) {
            na = !1
        }
        this.hasHTML5 = na;
        this.setup = function(a) {
            var d = !k.url;
            a !== b && H && P && k.ok();
            T(a);
            if (!da)
                if (Na) {
                    if (!k.setupOptions.ignoreMobileRestrictions || k.setupOptions.forceUseGlobalHTML5Audio) W.push(Y.globalHTML5), da = !0
                } else k.setupOptions.forceUseGlobalHTML5Audio && (W.push(Y.globalHTML5), da = !0);
            if (!Sa && Na)
                if (k.setupOptions.ignoreMobileRestrictions) W.push(Y.ignoreMobile);
                else if (k.setupOptions.useHTML5Audio = !0, k.setupOptions.preferFlash = !1, cb) k.ignoreFlash = !0;
            else if (db && !A.match(/android\s2\.3/i) || !db) da = !0;
            a && (d && fa && a.url !== b && k.beginDelayedInit(), fa || a.url === b || "complete" !== z.readyState ||
                setTimeout(ca, 1));
            Sa = !0;
            return k
        };
        this.supported = this.ok = function() {
            return P ? H && !G : k.useHTML5Audio && k.hasHTML5
        };
        this.getMovie = function(b) {
            return r(b) || z[b] || a[b]
        };
        this.createSound = function(a, d) {
            function e() {
                f = qa(f);
                k.sounds[f.id] = new m(f);
                k.soundIDs.push(f.id);
                return k.sounds[f.id]
            }
            var f, g = null;
            if (!H || !k.ok()) return !1;
            d !== b && (a = {
                id: a,
                url: d
            });
            f = J(a);
            f.url = Qa(f.url);
            f.id === b && (f.id = k.setupOptions.idPrefix + bb++);
            if (V(f.id, !0)) return k.sounds[f.id];
            if (za(f)) g = e(), g._setup_html5(f);
            else {
                if (k.html5Only ||
                    k.html5.usingFlash && f.url && f.url.match(/data\:/i)) return e();
                8 < u && null === f.isMovieStar && (f.isMovieStar = !!(f.serverURL || f.type && f.type.match(Oa) || f.url && f.url.match(Ja)));
                f = ma(f, void 0);
                g = e();
                8 === u ? q._createSound(f.id, f.loops || 1, f.usePolicyFile) : (q._createSound(f.id, f.url, f.usePeakData, f.useWaveformData, f.useEQData, f.isMovieStar, f.isMovieStar ? f.bufferTime : !1, f.loops || 1, f.serverURL, f.duration || null, f.autoPlay, !0, f.autoLoad, f.usePolicyFile), f.serverURL || (g.connected = !0, f.onconnect && f.onconnect.apply(g)));
                f.serverURL || !f.autoLoad && !f.autoPlay || g.load(f)
            }!f.serverURL && f.autoPlay && g.play();
            return g
        };
        this.destroySound = function(a, b) {
            if (!V(a)) return !1;
            var d = k.sounds[a],
                e;
            d.stop();
            d._iO = {};
            d.unload();
            for (e = 0; e < k.soundIDs.length; e++)
                if (k.soundIDs[e] === a) {
                    k.soundIDs.splice(e, 1);
                    break
                }
            b || d.destruct(!0);
            delete k.sounds[a];
            return !0
        };
        this.load = function(a, b) {
            return V(a) ? k.sounds[a].load(b) : !1
        };
        this.unload = function(a) {
            return V(a) ? k.sounds[a].unload() : !1
        };
        this.onposition = this.onPosition = function(a, b, d, e) {
            return V(a) ?
                k.sounds[a].onposition(b, d, e) : !1
        };
        this.clearOnPosition = function(a, b, d) {
            return V(a) ? k.sounds[a].clearOnPosition(b, d) : !1
        };
        this.start = this.play = function(a, b) {
            var d = null,
                e = b && !(b instanceof Object);
            if (!H || !k.ok()) return !1;
            if (V(a, e)) e && (b = {
                url: b
            });
            else {
                if (!e) return !1;
                e && (b = {
                    url: b
                });
                b && b.url && (b.id = a, d = k.createSound(b).play())
            }
            null === d && (d = k.sounds[a].play(b));
            return d
        };
        this.setPosition = function(a, b) {
            return V(a) ? k.sounds[a].setPosition(b) : !1
        };
        this.stop = function(a) {
            return V(a) ? k.sounds[a].stop() : !1
        };
        this.stopAll =
            function() {
                for (var a in k.sounds) k.sounds.hasOwnProperty(a) && k.sounds[a].stop()
            };
        this.pause = function(a) {
            return V(a) ? k.sounds[a].pause() : !1
        };
        this.pauseAll = function() {
            var a;
            for (a = k.soundIDs.length - 1; 0 <= a; a--) k.sounds[k.soundIDs[a]].pause()
        };
        this.resume = function(a) {
            return V(a) ? k.sounds[a].resume() : !1
        };
        this.resumeAll = function() {
            var a;
            for (a = k.soundIDs.length - 1; 0 <= a; a--) k.sounds[k.soundIDs[a]].resume()
        };
        this.togglePause = function(a) {
            return V(a) ? k.sounds[a].togglePause() : !1
        };
        this.setPan = function(a, b) {
            return V(a) ?
                k.sounds[a].setPan(b) : !1
        };
        this.setVolume = function(a, d) {
            var e, f;
            if (a === b || isNaN(a) || d !== b) return V(a) ? k.sounds[a].setVolume(d) : !1;
            e = 0;
            for (f = k.soundIDs.length; e < f; e++) k.sounds[k.soundIDs[e]].setVolume(a)
        };
        this.mute = function(a) {
            var b = 0;
            a instanceof String && (a = null);
            if (a) return V(a) ? k.sounds[a].mute() : !1;
            for (b = k.soundIDs.length - 1; 0 <= b; b--) k.sounds[k.soundIDs[b]].mute();
            return k.muted = !0
        };
        this.muteAll = function() {
            k.mute()
        };
        this.unmute = function(a) {
            a instanceof String && (a = null);
            if (a) return V(a) ? k.sounds[a].unmute() :
                !1;
            for (a = k.soundIDs.length - 1; 0 <= a; a--) k.sounds[k.soundIDs[a]].unmute();
            k.muted = !1;
            return !0
        };
        this.unmuteAll = function() {
            k.unmute()
        };
        this.toggleMute = function(a) {
            return V(a) ? k.sounds[a].toggleMute() : !1
        };
        this.getMemoryUse = function() {
            var a = 0;
            q && 8 !== u && (a = parseInt(q._getMemoryUse(), 10));
            return a
        };
        this.disable = function(d) {
            var e;
            d === b && (d = !1);
            if (G) return !1;
            G = !0;
            for (e = k.soundIDs.length - 1; 0 <= e; e--) la(k.sounds[k.soundIDs[e]]);
            M(d);
            Q.remove(a, "load", I);
            return !0
        };
        this.canPlayMIME = function(a) {
            var b;
            k.hasHTML5 &&
                (b = sa({
                    type: a
                }));
            !b && P && (b = a && k.ok() ? !!(8 < u && a.match(Oa) || a.match(k.mimePattern)) : null);
            return b
        };
        this.canPlayURL = function(a) {
            var b;
            k.hasHTML5 && (b = sa({
                url: a
            }));
            !b && P && (b = a && k.ok() ? !!a.match(k.filePattern) : null);
            return b
        };
        this.canPlayLink = function(a) {
            return a.type !== b && a.type && k.canPlayMIME(a.type) ? !0 : k.canPlayURL(a.href)
        };
        this.getSoundById = function(a, b) {
            return a ? k.sounds[a] : null
        };
        this.onready = function(b, d) {
            if ("function" === typeof b) d || (d = a), y("onready", b, d), E();
            else throw Da("needFunction", "onready");
            return !0
        };
        this.ontimeout = function(b, d) {
            if ("function" === typeof b) d || (d = a), y("ontimeout", b, d), E({
                type: "ontimeout"
            });
            else throw Da("needFunction", "ontimeout");
            return !0
        };
        this._wD = this._writeDebug = function(a, b) {
            return !0
        };
        this._debug = function() {};
        this.reboot = function(b, d) {
            var e, f, g;
            for (e = k.soundIDs.length - 1; 0 <= e; e--) k.sounds[k.soundIDs[e]].destruct();
            if (q) try {
                wa && (ha = q.innerHTML), La = q.parentNode.removeChild(q)
            } catch (h) {}
            ha = La = P = q = null;
            k.enabled = fa = H = Fa = Za = D = C = G = da = k.swfLoaded = !1;
            k.soundIDs = [];
            k.sounds = {};
            bb = 0;
            Sa = !1;
            if (b) n = [];
            else
                for (e in n)
                    if (n.hasOwnProperty(e))
                        for (f = 0, g = n[e].length; f < g; f++) n[e][f].fired = !1;
            k.html5 = {
                usingFlash: null
            };
            k.flash = {};
            k.html5Only = !1;
            k.ignoreFlash = !1;
            a.setTimeout(function() {
                d || k.beginDelayedInit()
            }, 20);
            return k
        };
        this.reset = function() {
            return k.reboot(!0, !0)
        };
        this.getMoviePercent = function() {
            return q && "PercentLoaded" in q ? q.PercentLoaded() : null
        };
        this.beginDelayedInit = function() {
            O = !0;
            ca();
            setTimeout(function() {
                if (Za) return !1;
                ka();
                oa();
                return Za = !0
            }, 20);
            K()
        };
        this.destruct =
            function() {
                k.disable(!0)
            };
        m = function(a) {
            var d, e, f = this,
                g, h, l, m, y, p, r = !1,
                n = [],
                N = 0,
                w, E, x = null,
                A;
            e = d = null;
            this.sID = this.id = a.id;
            this.url = a.url;
            this._iO = this.instanceOptions = this.options = J(a);
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this.isHTML5 = !1;
            this._a = null;
            A = this.url ? !1 : !0;
            this.id3 = {};
            this._debug = function() {};
            this.load = function(a) {
                var d = null,
                    e;
                a !== b ? f._iO = J(a, f.options) : (a = f.options, f._iO = a, x && x !== f.url && (f._iO.url = f.url, f.url = null));
                f._iO.url || (f._iO.url = f.url);
                f._iO.url = Qa(f._iO.url);
                e = f.instanceOptions = f._iO;
                if (!e.url && !f.url) return f;
                if (e.url === f.url && 0 !== f.readyState && 2 !== f.readyState) return 3 === f.readyState && e.onload && Ra(f, function() {
                    e.onload.apply(f, [!!f.duration])
                }), f;
                f.loaded = !1;
                f.readyState = 1;
                f.playState = 0;
                f.id3 = {};
                if (za(e)) d = f._setup_html5(e), d._called_load || (f._html5_canplay = !1, f.url !== e.url && (f._a.src = e.url, f.setPosition(0)), f._a.autobuffer = "auto", f._a.preload = "auto", f._a._called_load = !0);
                else {
                    if (k.html5Only || f._iO.url && f._iO.url.match(/data\:/i)) return f;
                    try {
                        f.isHTML5 = !1, f._iO = ma(qa(e)), f._iO.autoPlay && (f._iO.position || f._iO.from) && (f._iO.autoPlay = !1), e = f._iO, 8 === u ? q._load(f.id, e.url, e.stream, e.autoPlay, e.usePolicyFile) : q._load(f.id, e.url, !!e.stream, !!e.autoPlay, e.loops || 1, !!e.autoLoad, e.usePolicyFile)
                    } catch (g) {
                        aa({
                            type: "SMSOUND_LOAD_JS_EXCEPTION",
                            fatal: !0
                        })
                    }
                }
                f.url = e.url;
                return f
            };
            this.unload = function() {
                0 !== f.readyState && (f.isHTML5 ? (m(), f._a && (f._a.pause(), x = va(f._a))) : 8 === u ? q._unload(f.id, "about:blank") : q._unload(f.id), g());
                return f
            };
            this.destruct = function(a) {
                f.isHTML5 ?
                    (m(), f._a && (f._a.pause(), va(f._a), da || l(), f._a._s = null, f._a = null)) : (f._iO.onfailure = null, q._destroySound(f.id));
                a || k.destroySound(f.id, !0)
            };
            this.start = this.play = function(a, d) {
                var e, g, h, l, kb;
                g = !0;
                g = null;
                d = d === b ? !0 : d;
                a || (a = {});
                f.url && (f._iO.url = f.url);
                f._iO = J(f._iO, f.options);
                f._iO = J(a, f._iO);
                f._iO.url = Qa(f._iO.url);
                f.instanceOptions = f._iO;
                if (!f.isHTML5 && f._iO.serverURL && !f.connected) return f.getAutoPlay() || f.setAutoPlay(!0), f;
                za(f._iO) && (f._setup_html5(f._iO), y());
                1 !== f.playState || f.paused || (e = f._iO.multiShot,
                    e || (f.isHTML5 && f.setPosition(f._iO.position), g = f));
                if (null !== g) return g;
                a.url && a.url !== f.url && (f.readyState || f.isHTML5 || 8 !== u || !A ? f.load(f._iO) : A = !1);
                f.loaded || (0 === f.readyState ? (f.isHTML5 || k.html5Only ? f.isHTML5 ? f.load(f._iO) : g = f : (f._iO.autoPlay = !0, f.load(f._iO)), f.instanceOptions = f._iO) : 2 === f.readyState && (g = f));
                if (null !== g) return g;
                !f.isHTML5 && 9 === u && 0 < f.position && f.position === f.duration && (a.position = 0);
                if (f.paused && 0 <= f.position && (!f._iO.serverURL || 0 < f.position)) f.resume();
                else {
                    f._iO = J(a, f._iO);
                    if ((!f.isHTML5 && null !== f._iO.position && 0 < f._iO.position || null !== f._iO.from && 0 < f._iO.from || null !== f._iO.to) && 0 === f.instanceCount && 0 === f.playState && !f._iO.serverURL) {
                        e = function() {
                            f._iO = J(a, f._iO);
                            f.play(f._iO)
                        };
                        f.isHTML5 && !f._html5_canplay ? (f.load({
                            _oncanplay: e
                        }), g = !1) : f.isHTML5 || f.loaded || f.readyState && 2 === f.readyState || (f.load({
                            onload: e
                        }), g = !1);
                        if (null !== g) return g;
                        f._iO = E()
                    }(!f.instanceCount || f._iO.multiShotEvents || f.isHTML5 && f._iO.multiShot && !da || !f.isHTML5 && 8 < u && !f.getAutoPlay()) && f.instanceCount++;
                    f._iO.onposition && 0 === f.playState && p(f);
                    f.playState = 1;
                    f.paused = !1;
                    f.position = f._iO.position === b || isNaN(f._iO.position) ? 0 : f._iO.position;
                    f.isHTML5 || (f._iO = ma(qa(f._iO)));
                    f._iO.onplay && d && (f._iO.onplay.apply(f), r = !0);
                    f.setVolume(f._iO.volume, !0);
                    f.setPan(f._iO.pan, !0);
                    f.isHTML5 ? 2 > f.instanceCount ? (y(), g = f._setup_html5(), f.setPosition(f._iO.position), g.play()) : (h = new Audio(f._iO.url), l = function() {
                        Q.remove(h, "ended", l);
                        f._onfinish(f);
                        va(h);
                        h = null
                    }, kb = function() {
                        Q.remove(h, "canplay", kb);
                        try {
                            h.currentTime =
                                f._iO.position / 1E3
                        } catch (a) {}
                        h.play()
                    }, Q.add(h, "ended", l), f._iO.volume !== b && (h.volume = Math.max(0, Math.min(1, f._iO.volume / 100))), f.muted && (h.muted = !0), f._iO.position ? Q.add(h, "canplay", kb) : h.play()) : (g = q._start(f.id, f._iO.loops || 1, 9 === u ? f.position : f.position / 1E3, f._iO.multiShot || !1), 9 !== u || g || f._iO.onplayerror && f._iO.onplayerror.apply(f))
                }
                return f
            };
            this.stop = function(a) {
                var b = f._iO;
                1 === f.playState && (f._onbufferchange(0), f._resetOnPosition(0), f.paused = !1, f.isHTML5 || (f.playState = 0), w(), b.to && f.clearOnPosition(b.to),
                    f.isHTML5 ? f._a && (a = f.position, f.setPosition(0), f.position = a, f._a.pause(), f.playState = 0, f._onTimer(), m()) : (q._stop(f.id, a), b.serverURL && f.unload()), f.instanceCount = 0, f._iO = {}, b.onstop && b.onstop.apply(f));
                return f
            };
            this.setAutoPlay = function(a) {
                f._iO.autoPlay = a;
                f.isHTML5 || (q._setAutoPlay(f.id, a), a && (f.instanceCount || 1 !== f.readyState || f.instanceCount++))
            };
            this.getAutoPlay = function() {
                return f._iO.autoPlay
            };
            this.setPosition = function(a) {
                a === b && (a = 0);
                var d = f.isHTML5 ? Math.max(a, 0) : Math.min(f.duration || f._iO.duration,
                    Math.max(a, 0));
                f.position = d;
                a = f.position / 1E3;
                f._resetOnPosition(f.position);
                f._iO.position = d;
                if (!f.isHTML5) a = 9 === u ? f.position : a, f.readyState && 2 !== f.readyState && q._setPosition(f.id, a, f.paused || !f.playState, f._iO.multiShot);
                else if (f._a) {
                    if (f._html5_canplay) {
                        if (f._a.currentTime !== a) try {
                            f._a.currentTime = a, (0 === f.playState || f.paused) && f._a.pause()
                        } catch (e) {}
                    } else if (a) return f;
                    f.paused && f._onTimer(!0)
                }
                return f
            };
            this.pause = function(a) {
                if (f.paused || 0 === f.playState && 1 !== f.readyState) return f;
                f.paused = !0;
                f.isHTML5 ? (f._setup_html5().pause(), m()) : (a || a === b) && q._pause(f.id, f._iO.multiShot);
                f._iO.onpause && f._iO.onpause.apply(f);
                return f
            };
            this.resume = function() {
                var a = f._iO;
                if (!f.paused) return f;
                f.paused = !1;
                f.playState = 1;
                f.isHTML5 ? (f._setup_html5().play(), y()) : (a.isMovieStar && !a.serverURL && f.setPosition(f.position), q._pause(f.id, a.multiShot));
                !r && a.onplay ? (a.onplay.apply(f), r = !0) : a.onresume && a.onresume.apply(f);
                return f
            };
            this.togglePause = function() {
                if (0 === f.playState) return f.play({
                    position: 9 !== u || f.isHTML5 ?
                        f.position / 1E3 : f.position
                }), f;
                f.paused ? f.resume() : f.pause();
                return f
            };
            this.setPan = function(a, d) {
                a === b && (a = 0);
                d === b && (d = !1);
                f.isHTML5 || q._setPan(f.id, a);
                f._iO.pan = a;
                d || (f.pan = a, f.options.pan = a);
                return f
            };
            this.setVolume = function(a, d) {
                a === b && (a = 100);
                d === b && (d = !1);
                f.isHTML5 ? f._a && (k.muted && !f.muted && (f.muted = !0, f._a.muted = !0), f._a.volume = Math.max(0, Math.min(1, a / 100))) : q._setVolume(f.id, k.muted && !f.muted || f.muted ? 0 : a);
                f._iO.volume = a;
                d || (f.volume = a, f.options.volume = a);
                return f
            };
            this.mute = function() {
                f.muted = !0;
                f.isHTML5 ? f._a && (f._a.muted = !0) : q._setVolume(f.id, 0);
                return f
            };
            this.unmute = function() {
                f.muted = !1;
                var a = f._iO.volume !== b;
                f.isHTML5 ? f._a && (f._a.muted = !1) : q._setVolume(f.id, a ? f._iO.volume : f.options.volume);
                return f
            };
            this.toggleMute = function() {
                return f.muted ? f.unmute() : f.mute()
            };
            this.onposition = this.onPosition = function(a, d, e) {
                n.push({
                    position: parseInt(a, 10),
                    method: d,
                    scope: e !== b ? e : f,
                    fired: !1
                });
                return f
            };
            this.clearOnPosition = function(a, b) {
                var d;
                a = parseInt(a, 10);
                if (isNaN(a)) return !1;
                for (d = 0; d < n.length; d++) a !==
                    n[d].position || b && b !== n[d].method || (n[d].fired && N--, n.splice(d, 1))
            };
            this._processOnPosition = function() {
                var a, b;
                a = n.length;
                if (!a || !f.playState || N >= a) return !1;
                for (--a; 0 <= a; a--) b = n[a], !b.fired && f.position >= b.position && (b.fired = !0, N++, b.method.apply(b.scope, [b.position]));
                return !0
            };
            this._resetOnPosition = function(a) {
                var b, d;
                b = n.length;
                if (!b) return !1;
                for (--b; 0 <= b; b--) d = n[b], d.fired && a <= d.position && (d.fired = !1, N--);
                return !0
            };
            E = function() {
                var a = f._iO,
                    b = a.from,
                    d = a.to,
                    e, g;
                g = function() {
                    f.clearOnPosition(d, g);
                    f.stop()
                };
                e = function() {
                    if (null !== d && !isNaN(d)) f.onPosition(d, g)
                };
                null === b || isNaN(b) || (a.position = b, a.multiShot = !1, e());
                return a
            };
            p = function() {
                var a, b = f._iO.onposition;
                if (b)
                    for (a in b)
                        if (b.hasOwnProperty(a)) f.onPosition(parseInt(a, 10), b[a])
            };
            w = function() {
                var a, b = f._iO.onposition;
                if (b)
                    for (a in b) b.hasOwnProperty(a) && f.clearOnPosition(parseInt(a, 10))
            };
            y = function() {
                f.isHTML5 && gb(f)
            };
            m = function() {
                f.isHTML5 && hb(f)
            };
            g = function(a) {
                a || (n = [], N = 0);
                r = !1;
                f._hasTimer = null;
                f._a = null;
                f._html5_canplay = !1;
                f.bytesLoaded =
                    null;
                f.bytesTotal = null;
                f.duration = f._iO && f._iO.duration ? f._iO.duration : null;
                f.durationEstimate = null;
                f.buffered = [];
                f.eqData = [];
                f.eqData.left = [];
                f.eqData.right = [];
                f.failures = 0;
                f.isBuffering = !1;
                f.instanceOptions = {};
                f.instanceCount = 0;
                f.loaded = !1;
                f.metadata = {};
                f.readyState = 0;
                f.muted = !1;
                f.paused = !1;
                f.peakData = {
                    left: 0,
                    right: 0
                };
                f.waveformData = {
                    left: [],
                    right: []
                };
                f.playState = 0;
                f.position = null;
                f.id3 = {}
            };
            g();
            this._onTimer = function(a) {
                var b, g = !1,
                    h = {};
                if (f._hasTimer || a) return f._a && (a || (0 < f.playState || 1 === f.readyState) &&
                    !f.paused) && (b = f._get_html5_duration(), b !== d && (d = b, f.duration = b, g = !0), f.durationEstimate = f.duration, b = 1E3 * f._a.currentTime || 0, b !== e && (e = b, g = !0), (g || a) && f._whileplaying(b, h, h, h, h)), g
            };
            this._get_html5_duration = function() {
                var a = f._iO;
                return (a = f._a && f._a.duration ? 1E3 * f._a.duration : a && a.duration ? a.duration : null) && !isNaN(a) && Infinity !== a ? a : null
            };
            this._apply_loop = function(a, b) {
                a.loop = 1 < b ? "loop" : ""
            };
            this._setup_html5 = function(a) {
                a = J(f._iO, a);
                var b = da ? v : f._a,
                    d = decodeURI(a.url),
                    e;
                da ? d === decodeURI(Ga) && (e = !0) :
                    d === decodeURI(x) && (e = !0);
                if (b) {
                    if (b._s)
                        if (da) b._s && b._s.playState && !e && b._s.stop();
                        else if (!da && d === decodeURI(x)) return f._apply_loop(b, a.loops), b;
                    e || (x && g(!1), b.src = a.url, Ga = x = f.url = a.url, b._called_load = !1)
                } else a.autoLoad || a.autoPlay ? (f._a = new Audio(a.url), f._a.load()) : f._a = eb && 10 > opera.version() ? new Audio(null) : new Audio, b = f._a, b._called_load = !1, da && (v = b);
                f.isHTML5 = !0;
                f._a = b;
                b._s = f;
                h();
                f._apply_loop(b, a.loops);
                a.autoLoad || a.autoPlay ? f.load() : (b.autobuffer = !1, b.preload = "auto");
                return b
            };
            h = function() {
                if (f._a._added_events) return !1;
                var a;
                f._a._added_events = !0;
                for (a in ta) ta.hasOwnProperty(a) && f._a && f._a.addEventListener(a, ta[a], !1);
                return !0
            };
            l = function() {
                var a;
                f._a._added_events = !1;
                for (a in ta) ta.hasOwnProperty(a) && f._a && f._a.removeEventListener(a, ta[a], !1)
            };
            this._onload = function(a) {
                var b = !!a || !f.isHTML5 && 8 === u && f.duration;
                f.loaded = b;
                f.readyState = b ? 3 : 2;
                f._onbufferchange(0);
                f._iO.onload && Ra(f, function() {
                    f._iO.onload.apply(f, [b])
                });
                return !0
            };
            this._onbufferchange = function(a) {
                if (0 === f.playState || a && f.isBuffering || !a && !f.isBuffering) return !1;
                f.isBuffering = 1 === a;
                f._iO.onbufferchange && f._iO.onbufferchange.apply(f, [a]);
                return !0
            };
            this._onsuspend = function() {
                f._iO.onsuspend && f._iO.onsuspend.apply(f);
                return !0
            };
            this._onfailure = function(a, b, d) {
                f.failures++;
                if (f._iO.onfailure && 1 === f.failures) f._iO.onfailure(a, b, d)
            };
            this._onwarning = function(a, b, d) {
                if (f._iO.onwarning) f._iO.onwarning(a, b, d)
            };
            this._onfinish = function() {
                var a = f._iO.onfinish;
                f._onbufferchange(0);
                f._resetOnPosition(0);
                f.instanceCount && (f.instanceCount--, f.instanceCount || (w(), f.playState =
                    0, f.paused = !1, f.instanceCount = 0, f.instanceOptions = {}, f._iO = {}, m(), f.isHTML5 && (f.position = 0)), (!f.instanceCount || f._iO.multiShotEvents) && a && Ra(f, function() {
                    a.apply(f)
                }))
            };
            this._whileloading = function(a, b, d, e) {
                var g = f._iO;
                f.bytesLoaded = a;
                f.bytesTotal = b;
                f.duration = Math.floor(d);
                f.bufferLength = e;
                f.durationEstimate = f.isHTML5 || g.isMovieStar ? f.duration : g.duration ? f.duration > g.duration ? f.duration : g.duration : parseInt(f.bytesTotal / f.bytesLoaded * f.duration, 10);
                f.isHTML5 || (f.buffered = [{
                    start: 0,
                    end: f.duration
                }]);
                (3 !== f.readyState || f.isHTML5) && g.whileloading && g.whileloading.apply(f)
            };
            this._whileplaying = function(a, d, e, g, h) {
                var k = f._iO;
                if (isNaN(a) || null === a) return !1;
                f.position = Math.max(0, a);
                f._processOnPosition();
                !f.isHTML5 && 8 < u && (k.usePeakData && d !== b && d && (f.peakData = {
                    left: d.leftPeak,
                    right: d.rightPeak
                }), k.useWaveformData && e !== b && e && (f.waveformData = {
                    left: e.split(","),
                    right: g.split(",")
                }), k.useEQData && h !== b && h && h.leftEQ && (a = h.leftEQ.split(","), f.eqData = a, f.eqData.left = a, h.rightEQ !== b && h.rightEQ && (f.eqData.right =
                    h.rightEQ.split(","))));
                1 === f.playState && (f.isHTML5 || 8 !== u || f.position || !f.isBuffering || f._onbufferchange(0), k.whileplaying && k.whileplaying.apply(f));
                return !0
            };
            this._oncaptiondata = function(a) {
                f.captiondata = a;
                f._iO.oncaptiondata && f._iO.oncaptiondata.apply(f, [a])
            };
            this._onmetadata = function(a, b) {
                var d = {},
                    e, g;
                e = 0;
                for (g = a.length; e < g; e++) d[a[e]] = b[e];
                f.metadata = d;
                f._iO.onmetadata && f._iO.onmetadata.call(f, f.metadata)
            };
            this._onid3 = function(a, b) {
                var d = [],
                    e, g;
                e = 0;
                for (g = a.length; e < g; e++) d[a[e]] = b[e];
                f.id3 = J(f.id3,
                    d);
                f._iO.onid3 && f._iO.onid3.apply(f)
            };
            this._onconnect = function(a) {
                a = 1 === a;
                if (f.connected = a) f.failures = 0, V(f.id) && (f.getAutoPlay() ? f.play(b, f.getAutoPlay()) : f._iO.autoLoad && f.load()), f._iO.onconnect && f._iO.onconnect.apply(f, [a])
            };
            this._ondataerror = function(a) {
                0 < f.playState && f._iO.ondataerror && f._iO.ondataerror.apply(f)
            }
        };
        pa = function() {
            return z.body || z.getElementsByTagName("div")[0]
        };
        r = function(a) {
            return z.getElementById(a)
        };
        J = function(a, d) {
            var e = a || {},
                f, g;
            f = d === b ? k.defaultOptions : d;
            for (g in f) f.hasOwnProperty(g) &&
                e[g] === b && (e[g] = "object" !== typeof f[g] || null === f[g] ? f[g] : J(e[g], f[g]));
            return e
        };
        Ra = function(b, d) {
            b.isHTML5 || 8 !== u ? d() : a.setTimeout(d, 0)
        };
        N = {
            onready: 1,
            ontimeout: 1,
            defaultOptions: 1,
            flash9Options: 1,
            movieStarOptions: 1
        };
        T = function(a, d) {
            var e, f = !0,
                g = d !== b,
                h = k.setupOptions;
            for (e in a)
                if (a.hasOwnProperty(e))
                    if ("object" !== typeof a[e] || null === a[e] || a[e] instanceof Array || a[e] instanceof RegExp) g && N[d] !== b ? k[d][e] = a[e] : h[e] !== b ? (k.setupOptions[e] = a[e], k[e] = a[e]) : N[e] === b ? f = !1 : k[e] instanceof Function ? k[e].apply(k,
                        a[e] instanceof Array ? a[e] : [a[e]]) : k[e] = a[e];
                    else if (N[e] === b) f = !1;
            else return T(a[e], e);
            return f
        };
        Q = function() {
            function b(a) {
                a = ib.call(a);
                var d = a.length;
                e ? (a[1] = "on" + a[1], 3 < d && a.pop()) : 3 === d && a.push(!1);
                return a
            }

            function d(a, b) {
                var g = a.shift(),
                    h = [f[b]];
                if (e) g[h](a[0], a[1]);
                else g[h].apply(g, a)
            }
            var e = a.attachEvent,
                f = {
                    add: e ? "attachEvent" : "addEventListener",
                    remove: e ? "detachEvent" : "removeEventListener"
                };
            return {
                add: function() {
                    d(b(arguments), "add")
                },
                remove: function() {
                    d(b(arguments), "remove")
                }
            }
        }();
        ta = {
            abort: l(function() {}),
            canplay: l(function() {
                var a = this._s,
                    d;
                if (a._html5_canplay) return !0;
                a._html5_canplay = !0;
                a._onbufferchange(0);
                d = a._iO.position === b || isNaN(a._iO.position) ? null : a._iO.position / 1E3;
                if (this.currentTime !== d) try {
                    this.currentTime = d
                } catch (e) {}
                a._iO._oncanplay && a._iO._oncanplay()
            }),
            canplaythrough: l(function() {
                var a = this._s;
                a.loaded || (a._onbufferchange(0), a._whileloading(a.bytesLoaded, a.bytesTotal, a._get_html5_duration()), a._onload(!0))
            }),
            durationchange: l(function() {
                var a = this._s,
                    b;
                b = a._get_html5_duration();
                isNaN(b) ||
                    b === a.duration || (a.durationEstimate = a.duration = b)
            }),
            ended: l(function() {
                this._s._onfinish()
            }),
            error: l(function() {
                this._s._onload(!1)
            }),
            loadeddata: l(function() {
                var a = this._s;
                a._loaded || Ta || (a.duration = a._get_html5_duration())
            }),
            loadedmetadata: l(function() {}),
            loadstart: l(function() {
                this._s._onbufferchange(1)
            }),
            play: l(function() {
                this._s._onbufferchange(0)
            }),
            playing: l(function() {
                this._s._onbufferchange(0)
            }),
            progress: l(function(a) {
                var b = this._s,
                    d, e, f = 0,
                    f = a.target.buffered;
                d = a.loaded || 0;
                var g = a.total || 1;
                b.buffered = [];
                if (f && f.length) {
                    d = 0;
                    for (e = f.length; d < e; d++) b.buffered.push({
                        start: 1E3 * f.start(d),
                        end: 1E3 * f.end(d)
                    });
                    f = 1E3 * (f.end(0) - f.start(0));
                    d = Math.min(1, f / (1E3 * a.target.duration))
                }
                isNaN(d) || (b._whileloading(d, g, b._get_html5_duration()), d && g && d === g && ta.canplaythrough.call(this, a))
            }),
            ratechange: l(function() {}),
            suspend: l(function(a) {
                var b = this._s;
                ta.progress.call(this, a);
                b._onsuspend()
            }),
            stalled: l(function() {}),
            timeupdate: l(function() {
                this._s._onTimer()
            }),
            waiting: l(function() {
                this._s._onbufferchange(1)
            })
        };
        za = function(a) {
            return a && (a.type || a.url || a.serverURL) ? a.serverURL || a.type && h(a.type) ? !1 : a.type ? sa({
                type: a.type
            }) : sa({
                url: a.url
            }) || k.html5Only || a.url.match(/data\:/i) : !1
        };
        va = function(a) {
            var d;
            a && (d = Ta ? "about:blank" : k.html5.canPlayType("audio/wav") ? "data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w==" : "about:blank", a.src = d, a._called_unload !== b && (a._called_load = !1));
            da && (Ga = null);
            return d
        };
        sa = function(a) {
            if (!k.useHTML5Audio || !k.hasHTML5) return !1;
            var d = a.url || null;
            a = a.type || null;
            var e = k.audioFormats,
                f;
            if (a && k.html5[a] !== b) return k.html5[a] && !h(a);
            if (!ga) {
                ga = [];
                for (f in e) e.hasOwnProperty(f) && (ga.push(f), e[f].related && (ga = ga.concat(e[f].related)));
                ga = new RegExp("\\.(" + ga.join("|") + ")(\\?.*)?$", "i")
            }(f = d ? d.toLowerCase().match(ga) : null) && f.length ? f = f[1] : a && (d = a.indexOf(";"), f = (-1 !== d ? a.substr(0, d) : a).substr(6));
            f && k.html5[f] !== b ? d = k.html5[f] && !h(f) : (a = "audio/" + f, d = k.html5.canPlayType({
                type: a
            }), d = (k.html5[f] = d) && k.html5[a] && !h(a));
            return d
        };
        ja = function() {
            function a(b) {
                var e,
                    f = e = !1;
                if (!d || "function" !== typeof d.canPlayType) return e;
                if (b instanceof Array) {
                    l = 0;
                    for (e = b.length; l < e; l++)
                        if (k.html5[b[l]] || d.canPlayType(b[l]).match(k.html5Test)) f = !0, k.html5[b[l]] = !0, k.flash[b[l]] = !!b[l].match(Ia);
                    e = f
                } else b = d && "function" === typeof d.canPlayType ? d.canPlayType(b) : !1, e = !(!b || !b.match(k.html5Test));
                return e
            }
            if (!k.useHTML5Audio || !k.hasHTML5) return P = k.html5.usingFlash = !0, !1;
            var d = Audio !== b ? eb && 10 > opera.version() ? new Audio(null) : new Audio : null,
                e, f, g = {},
                h, l;
            h = k.audioFormats;
            for (e in h)
                if (h.hasOwnProperty(e) &&
                    (f = "audio/" + e, g[e] = a(h[e].type), g[f] = g[e], e.match(Ia) ? (k.flash[e] = !0, k.flash[f] = !0) : (k.flash[e] = !1, k.flash[f] = !1), h[e] && h[e].related))
                    for (l = h[e].related.length - 1; 0 <= l; l--) g["audio/" + h[e].related[l]] = g[e], k.html5[h[e].related[l]] = g[e], k.flash[h[e].related[l]] = g[e];
            g.canPlayType = d ? a : null;
            k.html5 = J(k.html5, g);
            k.html5.usingFlash = ba();
            P = k.html5.usingFlash;
            return !0
        };
        Y = {};
        Da = function() {};
        qa = function(a) {
            8 === u && 1 < a.loops && a.stream && (a.stream = !1);
            return a
        };
        ma = function(a, b) {
            a && !a.usePolicyFile && (a.onid3 || a.usePeakData ||
                a.useWaveformData || a.useEQData) && (a.usePolicyFile = !0);
            return a
        };
        x = function() {
            return !1
        };
        la = function(a) {
            for (var b in a) a.hasOwnProperty(b) && "function" === typeof a[b] && (a[b] = x)
        };
        Ka = function(a) {
            a === b && (a = !1);
            (G || a) && k.disable(a)
        };
        Wa = function(a) {
            if (a)
                if (a.match(/\.swf(\?.*)?$/i)) {
                    if (a.substr(a.toLowerCase().lastIndexOf(".swf?") + 4)) return a
                } else a.lastIndexOf("/") !== a.length - 1 && (a += "/");
            a = (a && -1 !== a.lastIndexOf("/") ? a.substr(0, a.lastIndexOf("/") + 1) : "./") + k.movieURL;
            k.noSWFCache && (a += "?ts=" + (new Date).getTime());
            return a
        };
        X = function() {
            u = parseInt(k.flashVersion, 10);
            8 !== u && 9 !== u && (k.flashVersion = u = 8);
            var a = k.debugMode || k.debugFlash ? "_debug.swf" : ".swf";
            k.useHTML5Audio && !k.html5Only && k.audioFormats.mp4.required && 9 > u && (k.flashVersion = u = 9);
            k.version = k.versionNumber + (k.html5Only ? " (HTML5-only mode)" : 9 === u ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
            8 < u ? (k.defaultOptions = J(k.defaultOptions, k.flash9Options), k.features.buffering = !0, k.defaultOptions = J(k.defaultOptions, k.movieStarOptions), k.filePatterns.flash9 = new RegExp("\\.(mp3|" +
                ea.join("|") + ")(\\?.*)?$", "i"), k.features.movieStar = !0) : k.features.movieStar = !1;
            k.filePattern = k.filePatterns[8 !== u ? "flash9" : "flash8"];
            k.movieURL = (8 === u ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", a);
            k.features.peakData = k.features.waveformData = k.features.eqData = 8 < u
        };
        ra = function(a, b) {
            if (!q) return !1;
            q._setPolling(a, b)
        };
        Ca = function() {};
        V = this.getSoundById;
        Ea = function() {
            var a = [];
            k.debugMode && a.push("sm2_debug");
            k.debugFlash && a.push("flash_debug");
            k.useHighPerformance && a.push("high_performance");
            return a.join(" ")
        };
        Xa = function() {
            Da("fbHandler");
            var a = k.getMoviePercent(),
                b = {
                    type: "FLASHBLOCK"
                };
            if (k.html5Only) return !1;
            k.ok() ? k.oMC && (k.oMC.className = [Ea(), "movieContainer", "swf_loaded" + (k.didFlashBlock ? " swf_unblocked" : "")].join(" ")) : (P && (k.oMC.className = Ea() + " movieContainer " + (null === a ? "swf_timedout" : "swf_error")), k.didFlashBlock = !0, E({
                type: "ontimeout",
                ignoreInit: !0,
                error: b
            }), aa(b))
        };
        y = function(a, d, e) {
            n[a] === b && (n[a] = []);
            n[a].push({
                method: d,
                scope: e || null,
                fired: !1
            })
        };
        E = function(a) {
            a || (a = {
                type: k.ok() ?
                    "onready" : "ontimeout"
            });
            if (!H && a && !a.ignoreInit || "ontimeout" === a.type && (k.ok() || G && !a.ignoreInit)) return !1;
            var b = {
                    success: a && a.ignoreInit ? k.ok() : !G
                },
                d = a && a.type ? n[a.type] || [] : [],
                e = [],
                f, b = [b],
                g = P && !k.ok();
            a.error && (b[0].error = a.error);
            a = 0;
            for (f = d.length; a < f; a++) !0 !== d[a].fired && e.push(d[a]);
            if (e.length)
                for (a = 0, f = e.length; a < f; a++) e[a].scope ? e[a].method.apply(e[a].scope, b) : e[a].method.apply(this, b), g || (e[a].fired = !0);
            return !0
        };
        I = function() {
            a.setTimeout(function() {
                k.useFlashBlock && Xa();
                E();
                "function" ===
                typeof k.onload && k.onload.apply(a);
                k.waitForWindowLoad && Q.add(a, "load", I)
            }, 1)
        };
        ab = function() {
            if (ua !== b) return ua;
            var d = !1,
                e = navigator,
                f = e.plugins,
                g, h = a.ActiveXObject;
            if (f && f.length)(e = e.mimeTypes) && e["application/x-shockwave-flash"] && e["application/x-shockwave-flash"].enabledPlugin && e["application/x-shockwave-flash"].enabledPlugin.description && (d = !0);
            else if (h !== b && !A.match(/MSAppHost/i)) {
                try {
                    g = new h("ShockwaveFlash.ShockwaveFlash")
                } catch (k) {
                    g = null
                }
                d = !!g
            }
            return ua = d
        };
        ba = function() {
            var a, b, d = k.audioFormats;
            cb && A.match(/os (1|2|3_0|3_1)\s/i) ? (k.hasHTML5 = !1, k.html5Only = !0, k.oMC && (k.oMC.style.display = "none")) : !k.useHTML5Audio || k.html5 && k.html5.canPlayType || (k.hasHTML5 = !1);
            if (k.useHTML5Audio && k.hasHTML5)
                for (b in ia = !0, d) d.hasOwnProperty(b) && d[b].required && (k.html5.canPlayType(d[b].type) ? k.preferFlash && (k.flash[b] || k.flash[d[b].type]) && (a = !0) : (ia = !1, a = !0));
            k.ignoreFlash && (a = !1, ia = !0);
            k.html5Only = k.hasHTML5 && k.useHTML5Audio && !a;
            return !k.html5Only
        };
        Qa = function(a) {
            var b, d, e = 0;
            if (a instanceof Array) {
                b = 0;
                for (d =
                    a.length; b < d; b++)
                    if (a[b] instanceof Object) {
                        if (k.canPlayMIME(a[b].type)) {
                            e = b;
                            break
                        }
                    } else if (k.canPlayURL(a[b])) {
                    e = b;
                    break
                }
                a[e].url && (a[e] = a[e].url);
                a = a[e]
            }
            return a
        };
        gb = function(a) {
            a._hasTimer || (a._hasTimer = !0, !Na && k.html5PollingInterval && (null === Ma && 0 === Pa && (Ma = setInterval($a, k.html5PollingInterval)), Pa++))
        };
        hb = function(a) {
            a._hasTimer && (a._hasTimer = !1, !Na && k.html5PollingInterval && Pa--)
        };
        $a = function() {
            var a;
            if (null !== Ma && !Pa) return clearInterval(Ma), Ma = null, !1;
            for (a = k.soundIDs.length - 1; 0 <= a; a--) k.sounds[k.soundIDs[a]].isHTML5 &&
                k.sounds[k.soundIDs[a]]._hasTimer && k.sounds[k.soundIDs[a]]._onTimer()
        };
        aa = function(d) {
            d = d !== b ? d : {};
            "function" === typeof k.onerror && k.onerror.apply(a, [{
                type: d.type !== b ? d.type : null
            }]);
            d.fatal !== b && d.fatal && k.disable()
        };
        jb = function() {
            if (!fb || !ab()) return !1;
            var a = k.audioFormats,
                b, d;
            for (d in a)
                if (a.hasOwnProperty(d) && ("mp3" === d || "mp4" === d) && (k.html5[d] = !1, a[d] && a[d].related))
                    for (b = a[d].related.length - 1; 0 <= b; b--) k.html5[a[d].related[b]] = !1
        };
        this._setSandboxType = function(a) {};
        this._externalInterfaceOK = function(a) {
            if (k.swfLoaded) return !1;
            k.swfLoaded = !0;
            Ha = !1;
            fb && jb();
            setTimeout(p, wa ? 100 : 1)
        };
        ka = function(a, d) {
            function e(a, b) {
                return '<param name="' + a + '" value="' + b + '" />'
            }
            if (D && C) return !1;
            if (k.html5Only) return X(), k.oMC = r(k.movieID), p(), C = D = !0, !1;
            var f = d || k.url,
                g = k.altURL || f,
                h = pa(),
                l = Ea(),
                m = null,
                m = z.getElementsByTagName("html")[0],
                y, v, n, m = m && m.dir && m.dir.match(/rtl/i);
            a = a === b ? k.id : a;
            X();
            k.url = Wa(Ba ? f : g);
            d = k.url;
            k.wmode = !k.wmode && k.useHighPerformance ? "transparent" : k.wmode;
            null !== k.wmode && (A.match(/msie 8/i) || !wa && !k.useHighPerformance) &&
                navigator.platform.match(/win32|win64/i) && (W.push(Y.spcWmode), k.wmode = null);
            h = {
                name: a,
                id: a,
                src: d,
                quality: "high",
                allowScriptAccess: k.allowScriptAccess,
                bgcolor: k.bgColor,
                pluginspage: Va + "www.macromedia.com/go/getflashplayer",
                title: "JS/Flash audio component (SoundManager 2)",
                type: "application/x-shockwave-flash",
                wmode: k.wmode,
                hasPriority: "true"
            };
            k.debugFlash && (h.FlashVars = "debug=1");
            k.wmode || delete h.wmode;
            if (wa) f = z.createElement("div"), v = ['<object id="' + a + '" data="' + d + '" type="' + h.type + '" title="' + h.title +
                '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">', e("movie", d), e("AllowScriptAccess", k.allowScriptAccess), e("quality", h.quality), k.wmode ? e("wmode", k.wmode) : "", e("bgcolor", k.bgColor), e("hasPriority", "true"), k.debugFlash ? e("FlashVars", h.FlashVars) : "", "</object>"
            ].join("");
            else
                for (y in f = z.createElement("embed"), h) h.hasOwnProperty(y) && f.setAttribute(y, h[y]);
            Ca();
            l = Ea();
            if (h = pa())
                if (k.oMC = r(k.movieID) ||
                    z.createElement("div"), k.oMC.id) n = k.oMC.className, k.oMC.className = (n ? n + " " : "movieContainer") + (l ? " " + l : ""), k.oMC.appendChild(f), wa && (y = k.oMC.appendChild(z.createElement("div")), y.className = "sm2-object-box", y.innerHTML = v), C = !0;
                else {
                    k.oMC.id = k.movieID;
                    k.oMC.className = "movieContainer " + l;
                    y = l = null;
                    k.useFlashBlock || (k.useHighPerformance ? l = {
                        position: "fixed",
                        width: "8px",
                        height: "8px",
                        bottom: "0px",
                        left: "0px",
                        overflow: "hidden"
                    } : (l = {
                            position: "absolute",
                            width: "6px",
                            height: "6px",
                            top: "-9999px",
                            left: "-9999px"
                        }, m &&
                        (l.left = Math.abs(parseInt(l.left, 10)) + "px")));
                    lb && (k.oMC.style.zIndex = 1E4);
                    if (!k.debugFlash)
                        for (n in l) l.hasOwnProperty(n) && (k.oMC.style[n] = l[n]);
                    try {
                        wa || k.oMC.appendChild(f), h.appendChild(k.oMC), wa && (y = k.oMC.appendChild(z.createElement("div")), y.className = "sm2-object-box", y.innerHTML = v), C = !0
                    } catch (q) {
                        throw Error(Da("domError") + " \n" + q.toString());
                    }
                }
            return D = !0
        };
        oa = function() {
            if (k.html5Only) return ka(), !1;
            if (q || !k.url) return !1;
            (q = k.getMovie(k.id)) || (La ? (wa ? k.oMC.innerHTML = ha : k.oMC.appendChild(La),
                La = null, D = !0) : ka(k.id, k.url), q = k.getMovie(k.id));
            "function" === typeof k.oninitmovie && setTimeout(k.oninitmovie, 1);
            return !0
        };
        K = function() {
            setTimeout(F, 1E3)
        };
        L = function() {
            a.setTimeout(function() {
                k.setup({
                    preferFlash: !1
                }).reboot();
                k.didFlashBlock = !0;
                k.beginDelayedInit()
            }, 1)
        };
        F = function() {
            var b, d = !1;
            if (!k.url || Fa) return !1;
            Fa = !0;
            Q.remove(a, "load", K);
            if (ua && Ha && !Ua) return !1;
            H || (b = k.getMoviePercent(), 0 < b && 100 > b && (d = !0));
            setTimeout(function() {
                b = k.getMoviePercent();
                if (d) return Fa = !1, a.setTimeout(K, 1), !1;
                !H &&
                    xa && (null === b ? k.useFlashBlock || 0 === k.flashLoadTimeout ? k.useFlashBlock && Xa() : !k.useFlashBlock && ia ? L() : E({
                        type: "ontimeout",
                        ignoreInit: !0,
                        error: {
                            type: "INIT_FLASHBLOCK"
                        }
                    }) : 0 !== k.flashLoadTimeout && (!k.useFlashBlock && ia ? L() : Ka(!0)))
            }, k.flashLoadTimeout)
        };
        U = function() {
            if (Ua || !Ha) return Q.remove(a, "focus", U), !0;
            Ua = xa = !0;
            Fa = !1;
            K();
            Q.remove(a, "focus", U);
            return !0
        };
        M = function(b) {
            if (H) return !1;
            if (k.html5Only) return H = !0, I(), !0;
            var d = !0,
                e;
            k.useFlashBlock && k.flashLoadTimeout && !k.getMoviePercent() || (H = !0);
            e = {
                type: !ua &&
                    P ? "NO_FLASH" : "INIT_TIMEOUT"
            };
            if (G || b) k.useFlashBlock && k.oMC && (k.oMC.className = Ea() + " " + (null === k.getMoviePercent() ? "swf_timedout" : "swf_error")), E({
                type: "ontimeout",
                error: e,
                ignoreInit: !0
            }), aa(e), d = !1;
            G || (k.waitForWindowLoad && !O ? Q.add(a, "load", I) : I());
            return d
        };
        B = function() {
            var a, d = k.setupOptions;
            for (a in d) d.hasOwnProperty(a) && (k[a] === b ? k[a] = d[a] : k[a] !== d[a] && (k.setupOptions[a] = k[a]))
        };
        p = function() {
            if (H) return !1;
            if (k.html5Only) return H || (Q.remove(a, "load", k.beginDelayedInit), k.enabled = !0, M()), !0;
            oa();
            try {
                q._externalInterfaceTest(!1), ra(!0, k.flashPollingInterval || (k.useHighPerformance ? 10 : 50)), k.debugMode || q._disableDebug(), k.enabled = !0, k.html5Only || Q.add(a, "unload", x)
            } catch (b) {
                return aa({
                    type: "JS_TO_FLASH_EXCEPTION",
                    fatal: !0
                }), Ka(!0), M(), !1
            }
            M();
            Q.remove(a, "load", k.beginDelayedInit);
            return !0
        };
        ca = function() {
            if (fa) return !1;
            fa = !0;
            B();
            Ca();
            !ua && k.hasHTML5 && k.setup({
                useHTML5Audio: !0,
                preferFlash: !1
            });
            ja();
            !ua && P && (W.push(Y.needFlash), k.setup({
                flashLoadTimeout: 1
            }));
            z.removeEventListener && z.removeEventListener("DOMContentLoaded",
                ca, !1);
            oa();
            return !0
        };
        Aa = function() {
            "complete" === z.readyState && (ca(), z.detachEvent("onreadystatechange", Aa));
            return !0
        };
        Z = function() {
            O = !0;
            ca();
            Q.remove(a, "load", Z)
        };
        ab();
        Q.add(a, "focus", U);
        Q.add(a, "load", K);
        Q.add(a, "load", Z);
        z.addEventListener ? z.addEventListener("DOMContentLoaded", ca, !1) : z.attachEvent ? z.attachEvent("onreadystatechange", Aa) : aa({
            type: "NO_DOM2_EVENTS",
            fatal: !0
        })
    }
    if (!a || !a.document) throw Error("SoundManager requires a browser with window and document objects.");
    var e = null;
    a.SM2_DEFER !==
        b && SM2_DEFER || (e = new d);
    "object" === typeof module && module && "object" === typeof module.exports ? (module.exports.SoundManager = d, module.exports.soundManager = e) : "function" === typeof define && define.amd && define(function() {
        return {
            constructor: d,
            getInstance: function(b) {
                !a.soundManager && b instanceof Function && (b = b(d), b instanceof d && (a.soundManager = b));
                return a.soundManager
            }
        }
    });
    a.SoundManager = d;
    a.soundManager = e
})(window);
var astar = {
        init: function(a, b, d) {
            for (var e = Math.max(0, b.x - d), f = Math.min(a.length, b.x + d); e < f; e++)
                for (var g = Math.max(0, b.y - d), h = Math.min(a[0].length, b.y + d); g < h; g++) {
                    var l = a[e][g];
                    l.f = 0;
                    l.g = 0;
                    l.h = 0;
                    l.cost = l.type;
                    l.visited = !1;
                    l.closed = !1;
                    l.parent = null
                }
        },
        heap: function() {
            return new BinaryHeap(function(a) {
                return a.f
            })
        },
        search: function(a, b, d, e, f) {
            var g = 5 + map_increase / 2;
            astar.init(a, b, g + 1);
            f = f || astar.manhattan;
            e = !!e;
            var h = astar.heap();
            for (h.push(b); 0 < h.size();) {
                var l = h.pop();
                if (l === d) {
                    a = l;
                    for (b = []; a.parent;) b.push(a),
                        a = a.parent;
                    return b.reverse()
                }
                l.closed = !0;
                for (var m = astar.neighbors(a, l, e, b, g), k = 0, v = m.length; k < v; k++) {
                    var q = m[k];
                    if (!q.closed && !q.isWall()) {
                        var r = l.g + q.cost,
                            A = q.visited;
                        if (!A || r < q.g) q.visited = !0, q.parent = l, q.h = q.h || f(q.pos, d.pos), q.g = r, q.f = q.g + q.h, A ? h.rescoreElement(q) : h.push(q)
                    }
                }
            }
            return []
        },
        manhattan: function(a, b) {
            var d = Math.abs(b.x - a.x),
                e = Math.abs(b.y - a.y);
            return d + e
        },
        neighbors: function(a, b, d, e, f) {
            var g = [],
                h = b.x;
            b = b.y;
            a[h - 1] && a[h - 1][b] && h - 1 > e.x - f && g.push(a[h - 1][b]);
            a[h + 1] && a[h + 1][b] && h + 1 < e.x + f &&
                g.push(a[h + 1][b]);
            a[h] && a[h][b - 1] && b - 1 > e.y - f && g.push(a[h][b - 1]);
            a[h] && a[h][b + 1] && b + 1 < e.y + f && g.push(a[h][b + 1]);
            d && (a[h - 1] && a[h - 1][b - 1] && g.push(a[h - 1][b - 1]), a[h + 1] && a[h + 1][b - 1] && g.push(a[h + 1][b - 1]), a[h - 1] && a[h - 1][b + 1] && g.push(a[h - 1][b + 1]), a[h + 1] && a[h + 1][b + 1] && g.push(a[h + 1][b + 1]));
            return g
        }
    },
    GraphNodeType = {
        OPEN: 1,
        WALL: 0
    };

function Graph(a) {
    for (var b = [], d = 0; d < a.length; d++) {
        b[d] = [];
        for (var e = 0, f = a[d]; e < f.length; e++) b[d][e] = new GraphNode(d, e, f[e])
    }
    this.input = a;
    this.nodes = b
}
Graph.prototype.toString = function() {
    for (var a = "\n", b = this.nodes, d, e, f, g, h = 0, l = b.length; h < l; h++) {
        d = "";
        e = b[h];
        f = 0;
        for (g = e.length; f < g; f++) d += e[f].type + " ";
        a = a + d + "\n"
    }
    return a
};

function GraphNode(a, b, d) {
    this.data = {};
    this.x = a;
    this.y = b;
    this.pos = {
        x: a,
        y: b
    };
    this.type = d
}
GraphNode.prototype.toString = function() {
    return "[" + this.x + " " + this.y + "]"
};
GraphNode.prototype.isWall = function() {
    return this.type == GraphNodeType.WALL
};

function BinaryHeap(a) {
    this.content = [];
    this.scoreFunction = a
}
BinaryHeap.prototype = {
    push: function(a) {
        this.content.push(a);
        this.sinkDown(this.content.length - 1)
    },
    pop: function() {
        var a = this.content[0],
            b = this.content.pop();
        0 < this.content.length && (this.content[0] = b, this.bubbleUp(0));
        return a
    },
    remove: function(a) {
        var b = this.content.indexOf(a),
            d = this.content.pop();
        b !== this.content.length - 1 && (this.content[b] = d, this.scoreFunction(d) < this.scoreFunction(a) ? this.sinkDown(b) : this.bubbleUp(b))
    },
    size: function() {
        return this.content.length
    },
    rescoreElement: function(a) {
        this.sinkDown(this.content.indexOf(a))
    },
    sinkDown: function(a) {
        for (var b = this.content[a]; 0 < a;) {
            var d = (a + 1 >> 1) - 1,
                e = this.content[d];
            if (this.scoreFunction(b) < this.scoreFunction(e)) this.content[d] = b, this.content[a] = e, a = d;
            else break
        }
    },
    bubbleUp: function(a) {
        for (var b = this.content.length, d = this.content[a], e = this.scoreFunction(d);;) {
            var f = a + 1 << 1,
                g = f - 1,
                h = null;
            if (g < b) {
                var l = this.scoreFunction(this.content[g]);
                l < e && (h = g)
            }
            f < b && this.scoreFunction(this.content[f]) < (null === h ? e : l) && (h = f);
            if (null !== h) this.content[a] = this.content[h], this.content[h] = d, a = h;
            else break
        }
    }
};

function SpriteAtlas(a) {
    this.srcArray = a;
    this.spriteSheetLocation = cdn_url + "sheet/" + a.meta.image + "?" + hex_sha256(a.meta.smartupdate).substr(32);
    this.imgs = {};
    this.SpriteSheet = new Image;
    this.SpriteSheet.crossOrigin = "anonymous";
    this.SpriteSheet.src = this.spriteSheetLocation;
    var b = this;
    this.SpriteSheet.onload = function() {
        for (var a in b.srcArray.frames) b.imgs[b.srcArray.frames[a].filename] = b.createSpriteCanvas(b.srcArray.frames[a].filename)
    };
    this.createSpriteCanvas = function(a) {
        for (var b = 0; b < this.srcArray.frames.length; b++)
            if (this.srcArray.frames[b].filename ==
                a) return a = this.srcArray.frames[b], new this.SpriteCanvas(this.SpriteSheet, a.frame.x, a.frame.y, a.frame.w, a.frame.h);
        alert('Error: Sprite "' + a + '" not found in ' + this.spriteSheetLocation)
    };
    this.SpriteCanvas = function(a, b, f, g, h) {
        var l = document.createElement("canvas");
        l.width = g;
        l.height = h;
        l.getContext("2d").drawImage(a, b, f, g, h, 0, 0, g, h);
        return l
    }
}
(function() {
    var a = !1,
        b = /xyz/.test(function() {
            xyz
        }) ? /\b_super\b/ : /.*/;
    this.Class = function() {};
    Class.extend = function(d) {
        function e() {
            !a && this.init && this.init.apply(this, arguments)
        }
        var f = this.prototype;
        a = !0;
        var g = new this;
        a = !1;
        for (var h in d) g[h] = "function" == typeof d[h] && "function" == typeof f[h] && b.test(d[h]) ? function(a, b) {
            return function() {
                var d = this._super;
                this._super = f[a];
                var e = b.apply(this, arguments);
                this._super = d;
                return e
            }
        }(h, d[h]) : d[h];
        e.prototype = g;
        e.prototype.constructor = e;
        e.extend = arguments.callee;
        return e
    }
})();
var FormHelper = {
        forms: {
            trivia_host: {
                width: 350,
                height: 265,
                title: "Trivia",
                links: [{
                    name: "Start",
                    method: function() {
                        Minigames.trivia.host_start()
                    },
                    marginRight: 115
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("trivia_host_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            trivia: {
                width: 350,
                height: 265,
                title: "Trivia",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("trivia_form").style.display = "none";
                        Minigames.trivia.deactivate_client()
                    },
                    marginRight: 0
                }]
            },
            referrals: {
                width: 312,
                height: 225,
                title: "Referrals",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("referrals_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            consecutive_login: {
                width: 280,
                height: 180,
                title: "Daily log-in bonus",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("consecutive_login_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            arena_host: {
                width: 350,
                height: 265,
                title: "Arena",
                links: [{
                    name: "Skills",
                    method: function() {
                        Minigames.arena.host_skills()
                    },
                    marginRight: 30
                }, {
                    name: "Inventory",
                    method: function() {
                        Minigames.arena.host_inventory()
                    },
                    marginRight: 30
                }, {
                    name: "Start",
                    method: function() {
                        Minigames.arena.host_start()
                    },
                    marginRight: 55
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("arena_host_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            arena: {
                width: 350,
                height: 265,
                title: "Arena",
                links: [{
                    name: "Join",
                    id: "arena_join_bet",
                    method: function() {
                        Minigames.arena.open_client()
                    },
                    marginRight: 30
                }, {
                    name: "Rules",
                    method: function() {
                        Minigames.arena.client_rules()
                    },
                    marginRight: 30
                }, {
                    name: "Stats",
                    method: function() {
                        Minigames.arena.client_stats()
                    },
                    marginRight: 55
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("arena_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            permissions: {
                width: 280,
                height: 180,
                title: "Permissions",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("permissions_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            chat_rules: {
                width: 320,
                height: 240,
                title: "Chat rules",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("chat_rules_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            mailbox: {
                width: 320,
                height: 265,
                close_on_move: !0,
                title: "Mailbox",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("mailbox_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            streams: {
                width: 350,
                height: 300,
                title: "Available streams",
                links: [{
                    name: "Refresh list",
                    method: function() {
                        Spectate.spectate_streams()
                    },
                    marginRight: 65
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("streams_form").style.display = "none";
                        GAME_STATE == GAME_STATES.LOGIN && SpectateWindow.sendMessage({
                            action: "hide_iframe"
                        })
                    },
                    marginRight: 0
                }]
            },
            teleport_book: {
                width: 270,
                height: 100,
                title: "Teleport book",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("teleport_book_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            secret_boss_scroll: {
                width: 270,
                height: 100,
                title: "Secret Boss Scroll",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("secret_boss_scroll_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            minigames_scroll: {
                width: 270,
                height: 100,
                title: "Minigames Scroll",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("minigames_scroll_form").style.display =
                            "none"
                    },
                    marginRight: 0
                }]
            },
            cathedral_run: {
                width: 350,
                height: 265,
                title: "Cathedral run",
                links: [{
                    name: "Start",
                    id: "start_cathedral_run",
                    method: function() {
                        Tower.show_menu()
                    },
                    marginRight: 30
                }, {
                    name: "Hall of Fame",
                    method: function() {
                        Tower.show_hall_of_fame()
                    },
                    marginRight: 30
                }, {
                    name: "Close",
                    method: function() {
                        Tower.close_menu()
                    },
                    marginRight: 0
                }]
            },
            tower: {
                width: 330,
                height: 180,
                title: "Tower",
                links: [{
                    name: "Close",
                    method: function() {
                        Tower.close_menu()
                    },
                    marginRight: 0
                }]
            },
            steam_highscores: {
                width: 515,
                height: 440,
                title: "Highscores",
                links: [{
                    name: "Close",
                    method: function() {
                        Steam.highscore.close()
                    },
                    marginRight: 0
                }]
            },
            rename_dialog: {
                width: 200,
                height: 230,
                title: "Change account name",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("rename_dialog_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            report_dialog: {
                width: 350,
                height: 365,
                title: "Reporting",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("report_dialog_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            fletching: {
                width: 450,
                height: 230,
                close_on_move: !0,
                title: "Fletching",
                links: [{
                    name: "Fletching",
                    method: function() {
                        Fletching.stop();
                        Fletching.open()
                    },
                    marginRight: 20
                }, {
                    name: "Formulas",
                    method: function() {
                        Fletching.stop();
                        Fletching.show_formulas()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("fletching_form").style.display = "none";
                        Fletching.stop()
                    },
                    marginRight: 0
                }],
                on_close: function() {
                    Fletching.stop()
                }
            },
            achievements: {
                width: 350,
                height: 250,
                title: "Achievements",
                links: [{
                    name: "Locked",
                    id: "start_cathedral_run",
                    method: function() {
                        Achievements.open_locked()
                    },
                    marginRight: 20
                }, {
                    name: "Earned",
                    method: function() {
                        Achievements.open_earned()
                    },
                    marginRight: 20
                }, {
                    name: "Rewards",
                    method: function() {
                        Achievements.open_rewards()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("achievements_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            armor_stand: {
                width: 380,
                height: 220,
                close_on_move: !0,
                overflow_allowed: !0,
                title: "Armor Stand",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("armor_stand_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            forging: {
                width: 450,
                height: 230,
                close_on_move: !0,
                overflow_allowed: !0,
                title: "Forging",
                links: [{
                    name: "Enchanting",
                    method: function() {
                        document.getElementById("forging_form").style.display = "none";
                        Forge.enchanting_open()
                    },
                    marginRight: 20
                }, {
                    name: "Formulas",
                    method: function() {
                        document.getElementById("forging_form").style.display = "none";
                        Forge.show_formulas()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("forging_form").style.display = "none"
                    },
                    marginRight: 0
                }],
                on_close: function() {}
            },
            enchanting: {
                width: 450,
                height: 230,
                close_on_move: !0,
                overflow_allowed: !0,
                title: "Enchanting",
                links: [{
                    name: "Forging",
                    method: function() {
                        document.getElementById("enchanting_form").style.display = "none";
                        Forge.forging_open()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("enchanting_form").style.display = "none"
                    },
                    marginRight: 0
                }],
                on_close: function() {}
            },
            formulas: {
                width: 450,
                height: 230,
                close_on_move: !0,
                title: "Formulas",
                links: [{
                    name: "Forging",
                    method: function() {
                        document.getElementById("formulas_form").style.display =
                            "none";
                        Forge.forging_open()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("formulas_form").style.display = "none"
                    },
                    marginRight: 0
                }],
                on_close: function() {}
            },
            quests: {
                width: 350,
                height: 250,
                title: "Quests",
                links: [{
                    name: "Active",
                    method: function() {
                        Quests.show_active()
                    },
                    marginRight: 20
                }, {
                    name: "Completed",
                    method: function() {
                        Quests.show_completed()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("quests_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            pvp_loot: {
                width: 320,
                height: 205,
                title: "PVP Loot",
                close_on_move: !0,
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("pvp_loot_form").style.display = "none"
                    },
                    marginRight: 0
                }],
                on_close: function() {}
            },
            contacts: {
                width: 350,
                height: 250,
                title: "Contacts",
                links: [{
                    name: "Friends",
                    method: function() {
                        Contacts.show_friends()
                    },
                    marginRight: 20
                }, {
                    name: "Ignore",
                    method: function() {
                        Contacts.show_ignore()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("contacts_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            filters: {
                width: 350,
                height: 250,
                title: "Tab filters",
                links: [{
                    name: "Filters",
                    method: function() {
                        ChatSystem.filters(!0)
                    },
                    marginRight: 20
                }, {
                    name: "Channels",
                    method: function() {
                        Contacts.show_channels()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("filters_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            blacklist: {
                width: 450,
                height: 350,
                title: "Blacklist",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("blacklist_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            player_more_info: {
                width: 290,
                height: 265,
                title: "Player info",
                links: [{
                    name: "Security",
                    method: function() {
                        Player.security_info_request()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("player_more_info_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            },
            security: {
                width: 290,
                height: 350,
                title: "Security",
                links: [{
                    name: "Close",
                    method: function() {
                        document.getElementById("security_form").style.display = "none";
                        Player.more_info_dialog()
                    },
                    marginRight: 0
                }]
            },
            breeding_formulas: {
                width: 450,
                height: 300,
                title: "Breeding",
                links: [{
                    name: "General",
                    method: function() {
                        Breeding.formulas_general()
                    },
                    marginRight: 20
                }, {
                    name: "Results",
                    method: function() {
                        Breeding.formulas_results()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("breeding_formulas_form").style.display = "none";
                        300 == current_map && removeClass(document.getElementById("pet_nest_form"), "hidden")
                    },
                    marginRight: 0
                }]
            },
            scratch_ticket: {
                width: 200,
                height: 150,
                title: "Scratch Ticket",
                links: []
            },
            skill_quests: {
                width: 350,
                height: 250,
                title: "Quests",
                close_on_move: !0,
                links: [{
                    name: "Refresh list",
                    method: function() {
                        SkillQuest.request_refresh()
                    },
                    marginRight: 20
                }, {
                    name: "Close",
                    method: function() {
                        document.getElementById("skill_quests_form").style.display = "none"
                    },
                    marginRight: 0
                }]
            }
        },
        get_form: function(a, b) {
            var d = document.getElementById(a + "_form");
            d || (d = FormHelper.create_form(a, b));
            d.style.display = "block";
            FormHelper.forms[a].close_on_move && (windowOpen = !0);
            return {
                dialog: d,
                content: document.getElementById(a + "_form_content")
            }
        },
        is_form_visible: function(a) {
            return (a = document.getElementById(a + "_form")) ? "block" ==
                a.style.display : !1
        },
        hide_form: function(a) {
            if (a = document.getElementById(a + "_form")) a.style.display = "none"
        },
        create_form: function(a, b) {
            var d = FormHelper.forms[a],
                e = document.createElement("div");
            e.id = a + "_form";
            addClass(e, "abstract_form");
            addClass(e, "menu");
            addClass(e, "scrolling_allowed");
            d && d.overflow_allowed && (e.style.overflowY = "visible", e.style.overflowX = "visible");
            b && b.fullscreen ? (e.style.width = "99%", e.style.height = "99%", e.style.marginLeft = "0px", e.style.marginTop = "0px", e.style.left = "0px", e.style.top =
                "0px", e.style.zIndex = 9999) : (e.style.width = d.width + "px", e.style.height = d.height + "px", e.style.marginLeft = -d.width / 2 + "px", e.style.marginTop = -d.height / 2 + "px");
            var f = document.createElement("span");
            addClass(f, "common_border_bottom");
            var g = document.createElement("span");
            addClass(g, "abstract_form_title");
            g.innerHTML = _ti(d.title);
            g.setAttribute("data-ti", d.title);
            f.appendChild(g);
            for (var h in d.links) g = document.createElement("span"), addClass(g, "common_link"), g.style.margin = "0px", g.style.marginBottom = "2px",
                g.style.marginRight = d.links[h].marginRight + "px", g.innerHTML = _ti(d.links[h].name), g.setAttribute("data-ti", d.links[h].name), bindOnPress(g, d.links[h].method), d.links[h].id && (g.id = d.links[h].id), b && b.fullscreen && (g.style.fontSize = "18px"), f.appendChild(g);
            e.appendChild(f);
            f = document.createElement("div");
            addClass(f, "scrolling_allowed");
            f.id = a + "_form_content";
            f.style.height = d.height - 19 + "px";
            f.style.overflowY = "auto";
            f.style.overflowX = "hidden";
            d && d.overflow_allowed && (f.style.overflowY = "visible", f.style.overflowX =
                "visible");
            e.appendChild(f);
            wrapper.appendChild(e);
            d.close_on_move && FormHelper.close_on_move_forms.push(a);
            return e
        },
        focus_id: !1,
        remember_focus: function(a) {
            if ("string" == typeof a) return FormHelper.focus_id = a;
            if ("object" == typeof a) return FormHelper.focus_id = a.id;
            FormHelper.focus_id = document.activeElement ? document.activeElement.id : !1
        },
        restore_focus: function() {
            if (FormHelper.focus_id) {
                var a = document.getElementById(FormHelper.focus_id);
                if (a.value) try {
                    a.selectionStart = a.value.length, a.selectionEnd = a.value.length
                } catch (b) {}
                a.focus()
            }
        },
        close_on_move_forms: [],
        close_on_move: function() {
            for (var a in FormHelper.close_on_move_forms) {
                FormHelper.hide_form(FormHelper.close_on_move_forms[a]);
                var b = FormHelper.forms[FormHelper.close_on_move_forms[a]];
                if ("function" == typeof b.on_close) b.on_close()
            }
        },
        update_item_list_select: function(a, b, d) {
            var e = [
                    [],
                    [358, 1033, 1143, 1240, 1326, 1366, 1872, 1871, 2023, 2026]
                ],
                f = document.getElementById(a + "_category").value;
            a = document.getElementById(a + "_items");
            d = d || a.value;
            a.innerHTML = "";
            for (var g = 0; g < item_categories[f].items.length; g++)
                if (-1 ==
                    e[b].indexOf(item_categories[f].items[g].id)) {
                    var h = document.createElement("option");
                    h.selected = item_categories[f].items[g].id == d ? !0 : !1;
                    h.value = item_categories[f].items[g].id;
                    h.innerHTML = item_categories[f].items[g].name;
                    a.appendChild(h)
                }
        }
    },
    TableSorter;
TableSorter = function() {
    var a, b, d, e, f, g, h, l, m;
    a = h = null;
    d = "";
    m = !1;
    g = function(b) {
        return b.cells.item(a).dataset.sortvalue || b.cells.item(a).textContent.toLowerCase()
    };
    f = function(a, b) {
        var d, e, f;
        e = g(a);
        f = g(b);
        d = parseInt(e, 10);
        m && d && (e = d, f = parseInt(f, 10));
        return e > f ? 1 : e < f ? -1 : 0
    };
    l = function() {
        var a;
        a = "asc" !== d ? "asc" : "desc";
        h.className = (h.className.replace(d, "") + " " + a).trim();
        return d = a
    };
    e = function() {
        h.className = h.className.replace("asc", "").replace("desc", "");
        return d = ""
    };
    b = function(b) {
        var g, q, r, A;
        h && ("span" ==
            h.tagName.toLowerCase() && a !== b.target.parentNode.cellIndex || "th" == h.tagName.toLowerCase() && a !== b.target.cellIndex) && e();
        h = b.target;
        b = !1;
        "span" == h.tagName.toLowerCase() && (b = !0);
        if ("th" === h.nodeName.toLowerCase() || b)
            if (b ? (a = h.parentNode.cellIndex, m = hasClass(h.parentNode, "sort-number"), q = h.parentNode.offsetParent.getElementsByTagName("tbody")[0]) : (a = h.cellIndex, m = hasClass(h, "sort-number"), q = h.offsetParent.getElementsByTagName("tbody")[0]), g = q.rows)
                for (g = Array.prototype.slice.call(g, 0), g = Array.prototype.sort.call(g,
                        f), "asc" === d && Array.prototype.reverse.call(g), l(), q.innerHtml = "", r = 0, A = g.length; r < A; r++) b = g[r], r % 2 ? removeClass(b, "even") : addClass(b, "even"), q.appendChild(b)
    };
    return {
        init: function(a) {
            var d, e, f, g;
            d = a.getElementsByTagName("th");
            g = [];
            e = 0;
            for (f = d.length; e < f; e++) a = d[e], hasClass(a, "no-sort") || (d[e].children && d[e].children[0] && "span" == d[e].children[0].tagName.toLowerCase() ? g.push(a.children[0].onclick = b) : g.push(a.onclick = b));
            return g
        }
    }
}();
! function(a, b, d, e) {
    function f(a, b, d) {
        return setTimeout(k(a, d), b)
    }

    function g(a, b, d) {
        return Array.isArray(a) ? (h(a, d[b], d), !0) : !1
    }

    function h(a, b, d) {
        var f;
        if (a)
            if (a.forEach) a.forEach(b, d);
            else if (a.length !== e)
            for (f = 0; f < a.length;) b.call(d, a[f], f, a), f++;
        else
            for (f in a) a.hasOwnProperty(f) && b.call(d, a[f], f, a)
    }

    function l(b, d, e) {
        var f = "DEPRECATED METHOD: " + d + "\n" + e + " AT \n";
        return function() {
            var d = Error("get-stack-trace"),
                d = d && d.stack ? d.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm,
                    "{anonymous}()@") : "Unknown Stack Trace",
                e = a.console && (a.console.warn || a.console.log);
            return e && e.call(a.console, f, d), b.apply(this, arguments)
        }
    }

    function m(a, b, d) {
        var e = b.prototype;
        b = a.prototype = Object.create(e);
        b.constructor = a;
        b._super = e;
        d && ha(b, d)
    }

    function k(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function v(a, b) {
        return typeof a == Ea ? a.apply(b ? b[0] || e : e, b) : a
    }

    function q(a, b, d) {
        h(w(b), function(b) {
            a.addEventListener(b, d, !1)
        })
    }

    function r(a, b, d) {
        h(w(b), function(b) {
            a.removeEventListener(b, d, !1)
        })
    }

    function A(a, b) {
        for (; a;) {
            if (a == b) return !0;
            a = a.parentNode
        }
        return !1
    }

    function w(a) {
        return a.trim().split(/\s+/g)
    }

    function z(a, b, d) {
        if (a.indexOf && !d) return a.indexOf(b);
        for (var e = 0; e < a.length;) {
            if (d && a[e][d] == b || !d && a[e] === b) return e;
            e++
        }
        return -1
    }

    function x(a) {
        return Array.prototype.slice.call(a, 0)
    }

    function B(a, b, d) {
        for (var e = [], f = [], g = 0; g < a.length;) {
            var h = b ? a[g][b] : a[g];
            0 > z(f, h) && e.push(a[g]);
            f[g] = h;
            g++
        }
        return d && (e = b ? e.sort(function(a, d) {
            return a[b] > d[b]
        }) : e.sort()), e
    }

    function p(a, b) {
        for (var d, f, g =
                b[0].toUpperCase() + b.slice(1), h = 0; h < Da.length;) {
            if (d = Da[h], f = d ? d + g : b, f in a) return f;
            h++
        }
        return e
    }

    function u(b) {
        b = b.ownerDocument || b;
        return b.defaultView || b.parentWindow || a
    }

    function n(a, b) {
        var d = this;
        this.manager = a;
        this.callback = b;
        this.element = a.element;
        this.target = a.options.inputTarget;
        this.domHandler = function(b) {
            v(a.options.enable, [a]) && d.handler(b)
        };
        this.init()
    }

    function D(a) {
        var b = a.options.inputClass;
        return new(b ? b : Pa ? N : Ma ? E : $a ? K : T)(a, C)
    }

    function C(a, b, d) {
        var f, g, h = d.pointers.length;
        f = d.changedPointers.length;
        var k = b & W && 0 === h - f,
            h = b & (P | ba) && 0 === h - f;
        d.isFirst = !!k;
        d.isFinal = !!h;
        k && (a.session = {});
        d.eventType = b;
        b = a.session;
        k = d.pointers;
        h = k.length;
        b.firstInput || (b.firstInput = H(d));
        1 < h && !b.firstMultiple ? b.firstMultiple = H(d) : 1 === h && (b.firstMultiple = !1);
        f = b.firstInput;
        g = (h = b.firstMultiple) ? h.center : f.center;
        var l = d.center = G(k);
        d.timeStamp = V();
        d.deltaTime = d.timeStamp - f.timeStamp;
        d.angle = J(g, l);
        d.distance = M(g, l);
        f = d.center;
        g = b.offsetDelta || {};
        var l = b.prevDelta || {},
            m = b.prevInput || {};
        d.eventType !== W && m.eventType !==
            P || (l = b.prevDelta = {
                x: m.deltaX || 0,
                y: m.deltaY || 0
            }, g = b.offsetDelta = {
                x: f.x,
                y: f.y
            });
        d.deltaX = l.x + (f.x - g.x);
        d.deltaY = l.y + (f.y - g.y);
        d.offsetDirection = O(d.deltaX, d.deltaY);
        g = d.deltaTime;
        f = d.deltaX / g || 0;
        g = d.deltaY / g || 0;
        d.overallVelocityX = f;
        d.overallVelocityY = g;
        d.overallVelocity = ma(f) > ma(g) ? f : g;
        h ? (f = h.pointers, f = M(k[0], k[1], Ga) / M(f[0], f[1], Ga)) : f = 1;
        d.scale = f;
        h ? (h = h.pointers, k = J(k[1], k[0], Ga) + J(h[1], h[0], Ga)) : k = 0;
        d.rotation = k;
        d.maxPointers = b.prevInput ? d.pointers.length > b.prevInput.maxPointers ? d.pointers.length :
            b.prevInput.maxPointers : d.pointers.length;
        g = b.lastInterval || d;
        k = d.timeStamp - g.timeStamp;
        d.eventType != ba && (k > Qa || g.velocity === e) ? (f = d.deltaX - g.deltaX, g = d.deltaY - g.deltaY, l = f / k || 0, m = g / k || 0, k = l, h = m, l = ma(l) > ma(m) ? l : m, f = O(f, g), b.lastInterval = d) : (l = g.velocity, k = g.velocityX, h = g.velocityY, f = g.direction);
        d.velocity = l;
        d.velocityX = k;
        d.velocityY = h;
        d.direction = f;
        b = a.element;
        A(d.srcEvent.target, b) && (b = d.srcEvent.target);
        d.target = b;
        a.emit("hammer.input", d);
        a.recognize(d);
        a.session.prevInput = d
    }

    function H(a) {
        for (var b =
                [], d = 0; d < a.pointers.length;) b[d] = {
            clientX: qa(a.pointers[d].clientX),
            clientY: qa(a.pointers[d].clientY)
        }, d++;
        return {
            timeStamp: V(),
            pointers: b,
            center: G(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }

    function G(a) {
        var b = a.length;
        if (1 === b) return {
            x: qa(a[0].clientX),
            y: qa(a[0].clientY)
        };
        for (var d = 0, e = 0, f = 0; b > f;) d += a[f].clientX, e += a[f].clientY, f++;
        return {
            x: qa(d / b),
            y: qa(e / b)
        }
    }

    function O(a, b) {
        return a === b ? za : ma(a) >= ma(b) ? 0 > a ? sa : ga : 0 > b ? va : Aa
    }

    function M(a, b, d) {
        d || (d = da);
        var e = b[d[0]] - a[d[0]];
        a = b[d[1]] - a[d[1]];
        return Math.sqrt(e *
            e + a * a)
    }

    function J(a, b, d) {
        d || (d = da);
        return 180 * Math.atan2(b[d[1]] - a[d[1]], b[d[0]] - a[d[0]]) / Math.PI
    }

    function T() {
        this.evEl = ab;
        this.evWin = jb;
        this.pressed = !1;
        n.apply(this, arguments)
    }

    function N() {
        this.evEl = bb;
        this.evWin = Sa;
        n.apply(this, arguments);
        this.store = this.manager.session.pointerEvents = []
    }

    function y() {
        this.evTarget = db;
        this.evWin = wa;
        this.started = !1;
        n.apply(this, arguments)
    }

    function E() {
        this.evTarget = Ta;
        this.targetIds = {};
        n.apply(this, arguments)
    }

    function I(a, b) {
        var d = x(a.touches),
            e = this.targetIds;
        if (b &
            (W | ia) && 1 === d.length) return e[d[0].identifier] = !0, [d, d];
        var f, g = x(a.changedTouches),
            h = [],
            k = this.target;
        if (f = d.filter(function(a) {
                return A(a.target, k)
            }), b === W)
            for (d = 0; d < f.length;) e[f[d].identifier] = !0, d++;
        for (d = 0; d < g.length;) e[g[d].identifier] && h.push(g[d]), b & (P | ba) && delete e[g[d].identifier], d++;
        return h.length ? [B(f.concat(h), "identifier", !0), h] : void 0
    }

    function K() {
        n.apply(this, arguments);
        var a = k(this.handler, this);
        this.touch = new E(this.manager, a);
        this.mouse = new T(this.manager, a);
        this.primaryTouch =
            null;
        this.lastTouches = []
    }

    function F(a) {
        a = a.changedPointers[0];
        if (a.identifier === this.primaryTouch) {
            var b = {
                x: a.clientX,
                y: a.clientY
            };
            this.lastTouches.push(b);
            var d = this.lastTouches;
            setTimeout(function() {
                var a = d.indexOf(b); - 1 < a && d.splice(a, 1)
            }, eb)
        }
    }

    function L(a, b) {
        this.manager = a;
        this.set(b)
    }

    function X(a) {
        if (-1 < a.indexOf(xa)) return xa;
        var b = -1 < a.indexOf(Ia),
            d = -1 < a.indexOf(Ba);
        return b && d ? xa : b || d ? b ? Ia : Ba : -1 < a.indexOf(Ha) ? Ha : Ua
    }

    function U(a) {
        this.options = ha({}, this.defaults, a || {});
        this.id = gb++;
        this.manager =
            null;
        a = this.options.enable;
        this.options.enable = a === e ? !0 : a;
        this.state = Oa;
        this.simultaneous = {};
        this.requireFail = []
    }

    function Y(a) {
        return a & Ya ? "cancel" : a & na ? "end" : a & Ja ? "move" : a & ea ? "start" : ""
    }

    function oa(a) {
        return a == Aa ? "down" : a == va ? "up" : a == sa ? "left" : a == ga ? "right" : ""
    }

    function ca(a, b) {
        var d = b.manager;
        return d ? d.get(a) : a
    }

    function Z() {
        U.apply(this, arguments)
    }

    function fa() {
        Z.apply(this, arguments);
        this.pY = this.pX = null
    }

    function pa() {
        Z.apply(this, arguments)
    }

    function ka() {
        U.apply(this, arguments);
        this._input = this._timer =
            null
    }

    function aa() {
        Z.apply(this, arguments)
    }

    function ra() {
        Z.apply(this, arguments)
    }

    function Ca() {
        U.apply(this, arguments);
        this.pCenter = this.pTime = !1;
        this._input = this._timer = null;
        this.count = 0
    }

    function la(a, b) {
        b = b || {};
        var d = b.recognizers;
        return b.recognizers = d === e ? la.defaults.preset : d, new Ka(a, b)
    }

    function Ka(a, b) {
        this.options = ha({}, la.defaults, b || {});
        this.options.inputTarget = this.options.inputTarget || a;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};
        this.element = a;
        this.input = D(this);
        this.touchAction = new L(this, this.options.touchAction);
        Wa(this, !0);
        h(this.options.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]);
            a[3] && b.requireFailure(a[3])
        }, this)
    }

    function Wa(a, b) {
        var d = a.element;
        if (d.style) {
            var e;
            h(a.options.cssProps, function(f, g) {
                e = p(d.style, g);
                b ? (a.oldCssProps[e] = d.style[e], d.style[e] = f) : d.style[e] = a.oldCssProps[e] || ""
            });
            b || (a.oldCssProps = {})
        }
    }

    function La(a, d) {
        var e = b.createEvent("Event");
        e.initEvent(a, !0, !0);
        e.gesture = d;
        d.target.dispatchEvent(e)
    }
    var ha, Da = " webkit Moz MS ms o".split(" "),
        Xa = b.createElement("div"),
        Ea = "function",
        qa = Math.round,
        ma = Math.abs,
        V = Date.now;
    ha = "function" != typeof Object.assign ? function(a) {
        if (a === e || null === a) throw new TypeError("Cannot convert undefined or null to object");
        for (var b = Object(a), d = 1; d < arguments.length; d++) {
            var f = arguments[d];
            if (f !== e && null !== f)
                for (var g in f) f.hasOwnProperty(g) && (b[g] = f[g])
        }
        return b
    } : Object.assign;
    var Fa = l(function(a, b, d) {
            for (var f = Object.keys(b), g = 0; g < f.length;)(!d || d && a[f[g]] === e) && (a[f[g]] =
                b[f[g]]), g++;
            return a
        }, "extend", "Use `assign`."),
        Za = l(function(a, b) {
            return Fa(a, b, !0)
        }, "merge", "Use `assign`."),
        gb = 1,
        hb = /mobile|tablet|ip(ad|hone|od)|android/i,
        $a = "ontouchstart" in a,
        Pa = p(a, "PointerEvent") !== e,
        Ma = $a && hb.test(navigator.userAgent),
        Qa = 25,
        W = 1,
        ia = 2,
        P = 4,
        ba = 8,
        za = 1,
        sa = 2,
        ga = 4,
        va = 8,
        Aa = 16,
        ja = sa | ga,
        Q = va | Aa,
        ib = ja | Q,
        da = ["x", "y"],
        Ga = ["clientX", "clientY"];
    n.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && q(this.element, this.evEl, this.domHandler);
            this.evTarget && q(this.target, this.evTarget,
                this.domHandler);
            this.evWin && q(u(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && r(this.element, this.evEl, this.domHandler);
            this.evTarget && r(this.target, this.evTarget, this.domHandler);
            this.evWin && r(u(this.element), this.evWin, this.domHandler)
        }
    };
    var ua = {
            mousedown: W,
            mousemove: ia,
            mouseup: P
        },
        ab = "mousedown",
        jb = "mousemove mouseup";
    m(T, n, {
        handler: function(a) {
            var b = ua[a.type];
            b & W && 0 === a.button && (this.pressed = !0);
            b & ia && 1 !== a.which && (b = P);
            this.pressed && (b & P && (this.pressed = !1), this.callback(this.manager,
                b, {
                    pointers: [a],
                    changedPointers: [a],
                    pointerType: "mouse",
                    srcEvent: a
                }))
        }
    });
    var ta = {
            pointerdown: W,
            pointermove: ia,
            pointerup: P,
            pointercancel: ba,
            pointerout: ba
        },
        Ra = {
            2: "touch",
            3: "pen",
            4: "mouse",
            5: "kinect"
        },
        bb = "pointerdown",
        Sa = "pointermove pointerup pointercancel";
    a.MSPointerEvent && !a.PointerEvent && (bb = "MSPointerDown", Sa = "MSPointerMove MSPointerUp MSPointerCancel");
    m(N, n, {
        handler: function(a) {
            var b = this.store,
                d = !1,
                e = a.type.toLowerCase().replace("ms", ""),
                e = ta[e],
                f = Ra[a.pointerType] || a.pointerType,
                g = "touch" ==
                f,
                h = z(b, a.pointerId, "pointerId");
            e & W && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (P | ba) && (d = !0);
            0 > h || (b[h] = a, this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }), d && b.splice(h, 1))
        }
    });
    var cb = {
            touchstart: W,
            touchmove: ia,
            touchend: P,
            touchcancel: ba
        },
        db = "touchstart",
        wa = "touchstart touchmove touchend touchcancel";
    m(y, n, {
        handler: function(a) {
            var b = cb[a.type];
            if (b === W && (this.started = !0), this.started) {
                var d, e = x(a.touches);
                d = x(a.changedTouches);
                d = (b & (P | ba) && (e = B(e.concat(d),
                    "identifier", !0)), [e, d]);
                b & (P | ba) && 0 === d[0].length - d[1].length && (this.started = !1);
                this.callback(this.manager, b, {
                    pointers: d[0],
                    changedPointers: d[1],
                    pointerType: "touch",
                    srcEvent: a
                })
            }
        }
    });
    var lb = {
            touchstart: W,
            touchmove: ia,
            touchend: P,
            touchcancel: ba
        },
        Ta = "touchstart touchmove touchend touchcancel";
    m(E, n, {
        handler: function(a) {
            var b = lb[a.type],
                d = I.call(this, a, b);
            d && this.callback(this.manager, b, {
                pointers: d[0],
                changedPointers: d[1],
                pointerType: "touch",
                srcEvent: a
            })
        }
    });
    var eb = 2500;
    m(K, n, {
        handler: function(a, b, d) {
            var e =
                "touch" == d.pointerType,
                f = "mouse" == d.pointerType;
            if (!(f && d.sourceCapabilities && d.sourceCapabilities.firesTouchEvents)) {
                if (e) b & W ? (this.primaryTouch = d.changedPointers[0].identifier, F.call(this, d)) : b & (P | ba) && F.call(this, d);
                else {
                    if (e = f) a: {
                        for (var e = d.srcEvent.clientX, f = d.srcEvent.clientY, g = 0; g < this.lastTouches.length; g++) {
                            var h = this.lastTouches[g],
                                k = Math.abs(e - h.x),
                                h = Math.abs(f - h.y);
                            if (25 >= k && 25 >= h) {
                                e = !0;
                                break a
                            }
                        }
                        e = !1
                    }
                    if (e) return
                }
                this.callback(a, b, d)
            }
        },
        destroy: function() {
            this.touch.destroy();
            this.mouse.destroy()
        }
    });
    var Na = p(Xa.style, "touchAction"),
        fb = Na !== e,
        Ua = "auto",
        Ha = "manipulation",
        xa = "none",
        Ia = "pan-x",
        Ba = "pan-y",
        Va = function() {
            if (!fb) return !1;
            var b = {},
                d = a.CSS && a.CSS.supports;
            return "auto;manipulation;pan-y;pan-x;pan-x pan-y;none".split(";").forEach(function(e) {
                b[e] = d ? a.CSS.supports("touch-action", e) : !0
            }), b
        }();
    L.prototype = {
        set: function(a) {
            "compute" == a && (a = this.compute());
            fb && this.manager.element.style && Va[a] && (this.manager.element.style[Na] = a);
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return h(this.manager.recognizers, function(b) {
                v(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }), X(a.join(" "))
        },
        preventDefaults: function(a) {
            var b = a.srcEvent,
                d = a.offsetDirection;
            if (this.manager.session.prevented) return void b.preventDefault();
            var e = this.actions,
                f = -1 < e.indexOf(xa) && !Va[xa],
                g = -1 < e.indexOf(Ba) && !Va[Ba],
                e = -1 < e.indexOf(Ia) && !Va[Ia];
            if (f) {
                var h = 2 > a.distance,
                    k = 250 > a.deltaTime;
                if (1 === a.pointers.length && h && k) return
            }
            return e && g ? void 0 : f || g && d & ja || e && d & Q ?
                this.preventSrc(b) : void 0
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0;
            a.preventDefault()
        }
    };
    var Oa = 1,
        ea = 2,
        Ja = 4,
        na = 8,
        ya = na,
        Ya = 16;
    U.prototype = {
        defaults: {},
        set: function(a) {
            return ha(this.options, a), this.manager && this.manager.touchAction.update(), this
        },
        recognizeWith: function(a) {
            if (g(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            return a = ca(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
        },
        dropRecognizeWith: function(a) {
            return g(a, "dropRecognizeWith", this) ? this : (a = ca(a,
                this), delete this.simultaneous[a.id], this)
        },
        requireFailure: function(a) {
            if (g(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            return a = ca(a, this), -1 === z(b, a) && (b.push(a), a.requireFailure(this)), this
        },
        dropRequireFailure: function(a) {
            if (g(a, "dropRequireFailure", this)) return this;
            a = ca(a, this);
            a = z(this.requireFail, a);
            return -1 < a && this.requireFail.splice(a, 1), this
        },
        hasRequireFailures: function() {
            return 0 < this.requireFail.length
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(e) {
                d.manager.emit(e,
                    a)
            }
            var d = this,
                e = this.state;
            na > e && b(d.options.event + Y(e));
            b(d.options.event);
            a.additionalEvent && b(a.additionalEvent);
            e >= na && b(d.options.event + Y(e))
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void(this.state = 32)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length;) {
                if (!(this.requireFail[a].state & (32 | Oa))) return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            a = ha({}, a);
            return v(this.options.enable, [this, a]) ? (this.state & (ya | Ya | 32) && (this.state = Oa), this.state = this.process(a), void(this.state &
                (ea | Ja | na | Ya) && this.tryEmit(a))) : (this.reset(), void(this.state = 32))
        },
        process: function(a) {},
        getTouchAction: function() {},
        reset: function() {}
    };
    m(Z, U, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
                d = a.eventType,
                e = b & (ea | Ja);
            a = this.attrTest(a);
            return e && (d & ba || !a) ? b | Ya : e || a ? d & P ? b | na : b & ea ? b | Ja : ea : 32
        }
    });
    m(fa, Z, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: ib
        },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            return a & ja && b.push(Ba), a & Q && b.push(Ia), b
        },
        directionTest: function(a) {
            var b = this.options,
                d = !0,
                e = a.distance,
                f = a.direction,
                g = a.deltaX,
                h = a.deltaY;
            return f & b.direction || (b.direction & ja ? (f = 0 === g ? za : 0 > g ? sa : ga, d = g != this.pX, e = Math.abs(a.deltaX)) : (f = 0 === h ? za : 0 > h ? va : Aa, d = h != this.pY, e = Math.abs(a.deltaY))), a.direction = f, d && e > b.threshold && f & b.direction
        },
        attrTest: function(a) {
            return Z.prototype.attrTest.call(this, a) && (this.state & ea || !(this.state & ea) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX;
            this.pY = a.deltaY;
            var b = oa(a.direction);
            b && (a.additionalEvent = this.options.event + b);
            this._super.emit.call(this, a)
        }
    });
    m(pa, Z, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [xa]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ea)
        },
        emit: function(a) {
            1 !== a.scale && (a.additionalEvent = this.options.event + (1 > a.scale ? "in" : "out"));
            this._super.emit.call(this, a)
        }
    });
    m(ka, U, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 251,
            threshold: 9
        },
        getTouchAction: function() {
            return [Ua]
        },
        process: function(a) {
            var b = this.options,
                d = a.pointers.length === b.pointers,
                e = a.distance < b.threshold,
                g = a.deltaTime > b.time;
            if (this._input = a, !e || !d || a.eventType & (P | ba) && !g) this.reset();
            else if (a.eventType & W) this.reset(), this._timer = f(function() {
                this.state = ya;
                this.tryEmit()
            }, b.time, this);
            else if (a.eventType & P) return ya;
            return 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            this.state === ya && (a && a.eventType & P ? this.manager.emit(this.options.event +
                "up", a) : (this._input.timeStamp = V(), this.manager.emit(this.options.event, this._input)))
        }
    });
    m(aa, Z, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [xa]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ea)
        }
    });
    m(ra, Z, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .3,
            direction: ja | Q,
            pointers: 1
        },
        getTouchAction: function() {
            return fa.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, d = this.options.direction;
            return d & (ja | Q) ? b = a.overallVelocity : d & ja ? b = a.overallVelocityX : d & Q && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && d & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && ma(b) > this.options.velocity && a.eventType & P
        },
        emit: function(a) {
            var b = oa(a.offsetDirection);
            b && this.manager.emit(this.options.event + b, a);
            this.manager.emit(this.options.event, a)
        }
    });
    m(Ca, U, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [Ha]
        },
        process: function(a) {
            var b = this.options,
                d = a.pointers.length === b.pointers,
                e = a.distance < b.threshold,
                g = a.deltaTime < b.time;
            if (this.reset(), a.eventType & W && 0 === this.count) return this.failTimeout();
            if (e && g && d) {
                if (a.eventType != P) return this.failTimeout();
                d = this.pTime ? a.timeStamp - this.pTime < b.interval : !0;
                e = !this.pCenter || M(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp;
                this.pCenter = a.center;
                e && d ? this.count += 1 : this.count = 1;
                this._input = a;
                if (0 === this.count % b.taps) return this.hasRequireFailures() ?
                    (this._timer = f(function() {
                        this.state = ya;
                        this.tryEmit()
                    }, b.interval, this), ea) : ya
            }
            return 32
        },
        failTimeout: function() {
            return this._timer = f(function() {
                this.state = 32
            }, this.options.interval, this), 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            this.state == ya && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    });
    la.VERSION = "2.0.8";
    la.defaults = {
        domEvents: !1,
        touchAction: "compute",
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [aa, {
                enable: !1
            }],
            [pa, {
                    enable: !1
                },
                ["rotate"]
            ],
            [ra, {
                direction: ja
            }],
            [fa, {
                    direction: ja
                },
                ["swipe"]
            ],
            [Ca],
            [Ca, {
                    event: "doubletap",
                    taps: 2
                },
                ["tap"]
            ],
            [ka]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    Ka.prototype = {
        set: function(a) {
            return ha(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
        },
        stop: function(a) {
            this.session.stopped = a ? 2 : 1
        },
        recognize: function(a) {
            var b =
                this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var d, e = this.recognizers,
                    f = b.curRecognizer;
                (!f || f && f.state & ya) && (f = b.curRecognizer = null);
                for (var g = 0; g < e.length;) d = e[g], 2 === b.stopped || f && d != f && !d.canRecognizeWith(f) ? d.reset() : d.recognize(a), !f && d.state & (ea | Ja | na) && (f = b.curRecognizer = d), g++
            }
        },
        get: function(a) {
            if (a instanceof U) return a;
            for (var b = this.recognizers, d = 0; d < b.length; d++)
                if (b[d].options.event == a) return b[d];
            return null
        },
        add: function(a) {
            if (g(a, "add", this)) return this;
            var b = this.get(a.options.event);
            return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
        },
        remove: function(a) {
            if (g(a, "remove", this)) return this;
            if (a = this.get(a)) {
                var b = this.recognizers;
                a = z(b, a); - 1 !== a && (b.splice(a, 1), this.touchAction.update())
            }
            return this
        },
        on: function(a, b) {
            if (a !== e && b !== e) {
                var d = this.handlers;
                return h(w(a), function(a) {
                    d[a] = d[a] || [];
                    d[a].push(b)
                }), this
            }
        },
        off: function(a, b) {
            if (a !== e) {
                var d = this.handlers;
                return h(w(a), function(a) {
                    b ? d[a] && d[a].splice(z(d[a], b), 1) : delete d[a]
                }), this
            }
        },
        emit: function(a, b) {
            this.options.domEvents && La(a, b);
            var d = this.handlers[a] && this.handlers[a].slice();
            if (d && d.length) {
                b.type = a;
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                };
                for (var e = 0; e < d.length;) d[e](b), e++
            }
        },
        destroy: function() {
            this.element && Wa(this, !1);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null
        }
    };
    ha(la, {
        INPUT_START: W,
        INPUT_MOVE: ia,
        INPUT_END: P,
        INPUT_CANCEL: ba,
        STATE_POSSIBLE: Oa,
        STATE_BEGAN: ea,
        STATE_CHANGED: Ja,
        STATE_ENDED: na,
        STATE_RECOGNIZED: ya,
        STATE_CANCELLED: Ya,
        STATE_FAILED: 32,
        DIRECTION_NONE: za,
        DIRECTION_LEFT: sa,
        DIRECTION_RIGHT: ga,
        DIRECTION_UP: va,
        DIRECTION_DOWN: Aa,
        DIRECTION_HORIZONTAL: ja,
        DIRECTION_VERTICAL: Q,
        DIRECTION_ALL: ib,
        Manager: Ka,
        Input: n,
        TouchAction: L,
        TouchInput: E,
        MouseInput: T,
        PointerEventInput: N,
        TouchMouseInput: K,
        SingleTouchInput: y,
        Recognizer: U,
        AttrRecognizer: Z,
        Tap: Ca,
        Pan: fa,
        Swipe: ra,
        Pinch: pa,
        Rotate: aa,
        Press: ka,
        on: q,
        off: r,
        each: h,
        merge: Za,
        extend: Fa,
        assign: ha,
        inherit: m,
        bindFn: k,
        prefixed: p
    });
    ("undefined" != typeof a ? a : "undefined" != typeof self ? self : {}).Hammer =
        la;
    "function" == typeof define && define.amd ? define(function() {
        return la
    }) : "undefined" != typeof module && module.exports ? module.exports = la : a[d] = la
}(window, document, "Hammer");
var generate_qrcode = function(a) {
        function b(a, b) {
            var d;
            a > b && (d = a, a = b, b = d);
            d = b * b;
            d += b;
            d >>= 1;
            d += a;
            B[d] = 1
        }

        function d(a, d) {
            var e;
            x[a + n * d] = 1;
            for (e = -2; 2 > e; e++) x[a + e + n * (d - 2)] = 1, x[a - 2 + n * (d + e + 1)] = 1, x[a + 2 + n * (d + e)] = 1, x[a + e + 1 + n * (d + 2)] = 1;
            for (e = 0; 2 > e; e++) b(a - 1, d + e), b(a + 1, d - e), b(a - e, d - 1), b(a + e, d + 1)
        }

        function e(a) {
            for (; 255 <= a;) a -= 255, a = (a >> 8) + (a & 255);
            return a
        }

        function f(a, b, d, f) {
            var g, h, k;
            for (g = 0; g < f; g++) w[d + g] = 0;
            for (g = 0; g < b; g++) {
                k = r[w[a + g] ^ w[d]];
                if (255 != k)
                    for (h = 1; h < f; h++) w[d + h - 1] = w[d + h] ^ A[e(k + M[f - h])];
                else
                    for (h =
                        d; h < d + f; h++) w[h] = w[h + 1];
                w[d + f - 1] = 255 == k ? 0 : A[e(k + M[0])]
            }
        }

        function g(a, b) {
            var d;
            a > b && (d = a, a = b, b = d);
            d = b + b * b;
            d >>= 1;
            d += a;
            return B[d]
        }

        function h(a) {
            var b, d, e;
            switch (a) {
                case 0:
                    for (b = 0; b < n; b++)
                        for (a = 0; a < n; a++) a + b & 1 || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 1:
                    for (b = 0; b < n; b++)
                        for (a = 0; a < n; a++) b & 1 || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 2:
                    for (b = 0; b < n; b++)
                        for (a = d = 0; a < n; a++, d++) 3 == d && (d = 0), d || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 3:
                    for (b = e = 0; b < n; b++, e++)
                        for (3 == e && (e = 0), d = e, a = 0; a < n; a++, d++) 3 == d && (d = 0), d || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 4:
                    for (b = 0; b < n; b++)
                        for (d = 0, e = b >> 1 & 1, a = 0; a < n; a++, d++) 3 == d && (d = 0, e = !e), e || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 5:
                    for (b = e = 0; b < n; b++, e++)
                        for (3 == e && (e = 0), a = d = 0; a < n; a++, d++) 3 == d && (d = 0), (a & b & 1) + !(!d | !e) || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 6:
                    for (b = e = 0; b < n; b++, e++)
                        for (3 == e && (e = 0), a = d = 0; a < n; a++, d++) 3 == d && (d = 0), (a & b & 1) + (d && d == e) & 1 || g(a, b) || (x[a + b * n] ^= 1);
                    break;
                case 7:
                    for (b = e = 0; b < n; b++, e++)
                        for (3 == e && (e = 0), a = d = 0; a < n; a++, d++) 3 == d && (d = 0), (d && d == e) + (a + b & 1) & 1 || g(a, b) || (x[a + b * n] ^= 1)
            }
        }

        function l(a) {
            var b, d = 0;
            for (b = 0; b <=
                a; b++) 5 <= p[b] && (d += 3 + p[b] - 5);
            for (b = 3; b < a - 1; b += 2) p[b - 2] == p[b + 2] && p[b + 2] == p[b - 1] && p[b - 1] == p[b + 1] && 3 * p[b - 1] == p[b] && (0 == p[b - 3] || b + 3 > a || 3 * p[b - 3] >= 4 * p[b] || 3 * p[b + 3] >= 4 * p[b]) && (d += 40);
            return d
        }
        var m = [0, 11, 15, 19, 23, 27, 31, 16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24, 26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28],
            k = [3220, 1468, 2713, 1235, 3062, 1890, 2119, 1549, 2344, 2936, 1117, 2583, 1330, 2470, 1667, 2249, 2028, 3780, 481, 4011, 142, 3098, 831, 3445, 592, 2517, 1776, 2234, 1951, 2827, 1070, 2660, 1345, 3177],
            v = [30660, 29427, 32170,
                30877, 26159, 25368, 27713, 26998, 21522, 20773, 24188, 23371, 17913, 16590, 20375, 19104, 13663, 12392, 16177, 14854, 9396, 8579, 11994, 11245, 5769, 5054, 7399, 6608, 1890, 597, 3340, 2107
            ],
            q = [1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17, 1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28, 1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22, 1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16, 1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22, 2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28, 2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26, 2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26, 2, 0, 116, 30, 3, 2, 36,
                22, 4, 4, 16, 20, 4, 4, 12, 24, 2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28, 4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24, 2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28, 4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22, 3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24, 5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24, 5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30, 1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28, 5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28, 3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26, 3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28, 4, 4, 116, 28, 17,
                0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30, 2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24, 4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30, 6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30, 8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30, 10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30, 8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30, 3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30, 7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30, 5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30, 13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30, 17, 0, 115, 30, 10, 23,
                46, 28, 10, 35, 24, 30, 19, 35, 15, 30, 17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30, 13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30, 12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30, 6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30, 17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30, 4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30, 20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30, 19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
            ],
            r = [255, 0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105,
                248, 200, 8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207,
                205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175
            ],
            A = [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20,
                40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165,
                87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 0
            ],
            w = [],
            z = [],
            x = [],
            B = [],
            p = [],
            u, n, D, C, H, G, O = 1,
            M = [],
            J, T;
        T = document.createElement("canvas");
        J = T.getContext("2d");
        J.canvas.width = 275;
        J.canvas.height = 275;
        J.fillStyle = "#eee";
        J.fillRect(0, 0, 275, 275);
        return function(a) {
            O = 1;
            var y, E, I, K, F, L, X;
            I = a.length;
            u = 0;
            do
                if (u++, E = 4 * (O - 1) +
                    16 * (u - 1), D = q[E++], C = q[E++], H = q[E++], G = q[E], E = H * (D + C) + C - 3 + (9 >= u), I <= E) break;
            while (40 > u);
            n = 17 + 4 * u;
            K = H + (H + G) * (D + C) + C;
            for (I = 0; I < K; I++) z[I] = 0;
            w = a.slice(0);
            for (I = 0; I < n * n; I++) x[I] = 0;
            for (I = 0; I < (n * (n + 1) + 1) / 2; I++) B[I] = 0;
            for (I = 0; 3 > I; I++) {
                a = E = 0;
                1 == I && (E = n - 7);
                2 == I && (a = n - 7);
                x[a + 3 + n * (E + 3)] = 1;
                for (y = 0; 6 > y; y++) x[a + y + n * E] = 1, x[a + n * (E + y + 1)] = 1, x[a + 6 + n * (E + y)] = 1, x[a + y + 1 + n * (E + 6)] = 1;
                for (y = 1; 5 > y; y++) b(a + y, E + 1), b(a + 1, E + y + 1), b(a + 5, E + y), b(a + y + 1, E + 5);
                for (y = 2; 4 > y; y++) x[a + y + n * (E + 2)] = 1, x[a + 2 + n * (E + y + 1)] = 1, x[a + 4 + n * (E + y)] = 1, x[a + y + 1 +
                    n * (E + 4)] = 1
            }
            if (1 < u)
                for (I = m[u], a = n - 7;;) {
                    for (y = n - 7; y > I - 3;) {
                        d(y, a);
                        if (y < I) break;
                        y -= I
                    }
                    if (a <= I + 9) break;
                    a -= I;
                    d(6, a);
                    d(a, 6)
                }
            x[8 + n * (n - 8)] = 1;
            for (a = 0; 7 > a; a++) b(7, a), b(n - 8, a), b(7, a + n - 7);
            for (y = 0; 8 > y; y++) b(y, 7), b(y + n - 8, 7), b(y, n - 8);
            for (y = 0; 9 > y; y++) b(y, 8);
            for (y = 0; 8 > y; y++) b(y + n - 8, 8), b(8, y);
            for (a = 0; 7 > a; a++) b(8, a + n - 7);
            for (y = 0; y < n - 14; y++) y & 1 ? (b(8 + y, 6), b(6, 8 + y)) : (x[8 + y + 6 * n] = 1, x[6 + n * (8 + y)] = 1);
            if (6 < u)
                for (I = k[u - 7], E = 17, y = 0; 6 > y; y++)
                    for (a = 0; 3 > a; a++, E--) 1 & (11 < E ? u >> E - 12 : I >> E) ? (x[5 - y + n * (2 - a + n - 11)] = 1, x[2 - a + n - 11 + n * (5 - y)] = 1) : (b(5 -
                        y, 2 - a + n - 11), b(2 - a + n - 11, 5 - y));
            for (a = 0; a < n; a++)
                for (y = 0; y <= a; y++) x[y + n * a] && b(y, a);
            K = w.length;
            for (F = 0; F < K; F++) z[F] = w.charCodeAt(F);
            w = z.slice(0);
            y = H * (D + C) + C;
            K >= y - 2 && (K = y - 2, 9 < u && K--);
            F = K;
            if (9 < u) {
                w[F + 2] = 0;
                for (w[F + 3] = 0; F--;) I = w[F], w[F + 3] |= 255 & I << 4, w[F + 2] = I >> 4;
                w[2] |= 255 & K << 4;
                w[1] = K >> 4;
                w[0] = 64 | K >> 12
            } else {
                w[F + 1] = 0;
                for (w[F + 2] = 0; F--;) I = w[F], w[F + 2] |= 255 & I << 4, w[F + 1] = I >> 4;
                w[1] |= 255 & K << 4;
                w[0] = 64 | K >> 4
            }
            for (F = K + 3 - (10 > u); F < y;) w[F++] = 236, w[F++] = 17;
            M[0] = 1;
            for (F = 0; F < G; F++) {
                M[F + 1] = 1;
                for (L = F; 0 < L; L--) M[L] = M[L] ? M[L - 1] ^ A[e(r[M[L]] +
                    F)] : M[L - 1];
                M[0] = A[e(r[M[0]] + F)]
            }
            for (F = 0; F <= G; F++) M[F] = r[M[F]];
            E = y;
            for (F = a = 0; F < D; F++) f(a, H, E, G), a += H, E += G;
            for (F = 0; F < C; F++) f(a, H + 1, E, G), a += H + 1, E += G;
            for (F = a = 0; F < H; F++) {
                for (L = 0; L < D; L++) z[a++] = w[F + L * H];
                for (L = 0; L < C; L++) z[a++] = w[D * H + F + L * (H + 1)]
            }
            for (L = 0; L < C; L++) z[a++] = w[D * H + F + L * (H + 1)];
            for (F = 0; F < G; F++)
                for (L = 0; L < D + C; L++) z[a++] = w[y + F + L * G];
            w = z;
            y = a = n - 1;
            E = K = 1;
            X = (H + G) * (D + C) + C;
            for (F = 0; F < X; F++)
                for (I = w[F], L = 0; 8 > L; L++, I <<= 1) {
                    128 & I && (x[y + n * a] = 1);
                    do K ? y-- : (y++, E ? 0 != a ? a-- : (y -= 2, E = !E, 6 == y && (y--, a = 9)) : a != n - 1 ? a++ : (y -= 2, E = !E, 6 == y && (y--, a -= 8))), K = !K; while (g(y, a))
                }
            w = x.slice(0);
            I = 0;
            a = 3E4;
            for (E = 0; 8 > E; E++) {
                h(E);
                var U = X = L = F = y = void 0,
                    Y = K = 0;
                for (F = 0; F < n - 1; F++)
                    for (y = 0; y < n - 1; y++)
                        if (x[y + n * F] && x[y + 1 + n * F] && x[y + n * (F + 1)] && x[y + 1 + n * (F + 1)] || !(x[y + n * F] || x[y + 1 + n * F] || x[y + n * (F + 1)] || x[y + 1 + n * (F + 1)])) K += 3;
                for (F = 0; F < n; F++) {
                    for (L = X = y = p[0] = 0; y < n; y++)(U = x[y + n * F]) == X ? p[L]++ : p[++L] = 1, X = U, Y += X ? 1 : -1;
                    K += l(L)
                }
                0 > Y && (Y = -Y);
                y = Y;
                count = 0;
                y += y << 2;
                for (y <<= 1; y > n * n;) y -= n * n, count++;
                K += 10 * count;
                for (y = 0; y < n; y++) {
                    for (L = X = F = p[0] = 0; F < n; F++)(U = x[y + n * F]) == X ? p[L]++ : p[++L] =
                        1, X = U;
                    K += l(L)
                }
                y = K;
                y < a && (a = y, I = E);
                if (7 == I) break;
                x = w.slice(0)
            }
            I != E && h(I);
            a = v[I + (O - 1 << 3)];
            for (E = 0; 8 > E; E++, a >>= 1) a & 1 && (x[n - 1 - E + 8 * n] = 1, 6 > E ? x[8 + n * E] = 1 : x[8 + n * (E + 1)] = 1);
            for (E = 0; 7 > E; E++, a >>= 1) a & 1 && (x[8 + n * (n - 7 + E)] = 1, E ? x[6 - E + 8 * n] = 1 : x[7 + 8 * n] = 1);
            qf = x;
            J.lineWidth = 1;
            px = 275;
            px /= n + 4;
            px = Math.round(px);
            J.clearRect(0, 0, 275, 275);
            J.fillStyle = "#fff";
            J.fillRect(0, 0, px * n, px * n);
            J.fillStyle = "#000";
            for (E = 0; E < n; E++)
                for (I = 0; I < n; I++) qf[I * n + E] && J.fillRect(px * (2 + E), px * (2 + I), px, px);
            return T
        }(a)
    },
    Steam = {
        highscore: {
            active: !1,
            initialized: !1,
            type: "around",
            available_types: [{
                name: "Friends",
                value: "friends"
            }, {
                name: "My scores",
                value: "around"
            }, {
                name: "Overall",
                value: "global"
            }],
            skill: "accuracy",
            available_skills: [{
                name: "Accuracy",
                value: "accuracy"
            }, {
                name: "Alchemy",
                value: "alchemy"
            }, {
                name: "Archery",
                value: "archery"
            }, {
                name: "Breeding",
                value: "breeding"
            }, {
                name: "Carpentry",
                value: "carpentry"
            }, {
                name: "Cathedral level",
                value: "cathedral_level"
            }, {
                name: "Cooking",
                value: "cooking"
            }, {
                name: "Defense",
                value: "defense"
            }, {
                name: "Farming",
                value: "farming"
            }, {
                name: "Fishing",
                value: "fishing"
            }, {
                name: "Fletching",
                value: "fletching"
            }, {
                name: "Forging",
                value: "forging"
            }, {
                name: "Health",
                value: "health"
            }, {
                name: "Jewelry",
                value: "jewelry"
            }, {
                name: "Magic",
                value: "magic"
            }, {
                name: "Mining",
                value: "mining"
            }, {
                name: "Party plays",
                value: "party_plays"
            }, {
                name: "Party points",
                value: "party_points"
            }, {
                name: "Party wins",
                value: "party_wins"
            }, {
                name: "Strength",
                value: "strength"
            }, {
                name: "Woodcutting",
                value: "woodcutting"
            }],
            toggle: function() {
                Steam.highscore.active ? Steam.highscore.close() : Steam.highscore.open()
            },
            open: function() {
                Steam.highscore.active = !0;
                var a = FormHelper.get_form("steam_highscores");
                Steam.highscore.initialized || (Steam.highscore.initialized = !0, a.content.innerHTML = HandlebarTemplate.steam_highscores_options()({
                    types: Steam.highscore.available_types,
                    skills: Steam.highscore.available_skills
                }), document.getElementById("steam_highscores_data").innerHTML = _ti("Use the menu to choose a highscore"))
            },
            fetch: function() {
                Steam.highscore.skill = document.getElementById("steam_highscores_skill").value;
                document.getElementById("steam_highscores_data").innerHTML =
                    _ti("Loading data...");
                Socket.send("steam", {
                    sub: "leaderboards",
                    type: Steam.highscore.type,
                    skill: Steam.highscore.skill,
                    steamid: greenworks.getSteamId().staticAccountId
                })
            },
            show: function(a) {
                if (Steam.highscore.active) {
                    for (var b = 0; b < a.length; b++)
                        if (a[0].player == players[0].name) {
                            a[0].me = !0;
                            break
                        }
                    document.getElementById("steam_highscores_data").innerHTML = HandlebarTemplate.steam_highscores()(a)
                }
            },
            close: function() {
                Steam.highscore.active = !1;
                document.getElementById("steam_highscores_form").style.display = "none"
            },
            update_type: function(a) {
                Steam.highscore.type = a;
                Steam.highscore.fetch()
            }
        },
        enabled: function() {
            return "undefined" != typeof greenworks && greenworks && greenworks.initAPI() ? !0 : !1
        },
        report_achievement: function(a) {
            Steam.enabled() && greenworks.activateAchievement(a, null_function, null_function)
        },
        load_previous_settings: function() {
            try {
                localStorage.zoomlevel && (setZoomLevel(localStorage.zoomlevel), document.getElementById("steamzoomlevel").value = localStorage.zoomlevel), setTimeout(function() {
                        Steam.restore_window_size()
                    },
                    1E3)
            } catch (a) {}
        },
        restore_window_size: function() {
            setBrowserWindowSize(width * max_scale, height * max_scale)
        },
        enable_close_button: function() {
            var a = document.getElementById("webkit-close-button");
            removeClass(a, "hidden");
            a.onclick = function() {
                gui.Window.get().close()
            }
        },
        initialize_mods: function() {
            quiet_mod_load = !0;
            localStorage.AKbind || (localStorage.AKbind = '[{"value":0,"enabled":false},{"value":0,"enabled":false},{"value":0,"enabled":false},{"value":0,"enabled":false},{"value":0,"enabled":false},{"value":0,"enabled":false},{"value":"69","enabled":true},{"value":"66","enabled":true},{"value":0,"enabled":false}]',
                localStorage.autocastenabled = "0", localStorage.enableallchatts = "0", localStorage.fullscreenenabled = "0", localStorage.modOptionsLoad = '{"fullscreen":true,"autocast":true,"newmap":true,"newmarket":true,"kbind":true,"gearmd":true,"petinv":true,"mosmob":true,"health":true,"forgem":true,"chestm":true,"rclick":true,"magicm":true,"wikimd":true,"miscmd":true,"chatmd":true,"farming":true}', localStorage.modOptionsNewmod = '{"fullscreen":false,"autocast":false,"newmap":false,"newmarket":false,"kbind":false,"gearmd":false,"petinv":false,"mosmob":false,"health":false,"forgem":false,"chestm":false,"rclick":false,"magicm":false,"wikimd":false,"miscmd":false,"chatmd":false,"farming":false}');
            document.getElementById("mods_link").style.display = "none";
            document.body.appendChild(document.createElement("script")).src = cdn_url + "mod.js?v=" + mod_version
        },
        payment_issues: !1,
        payment_problems: function() {
            Popup.prompt("Make sure you are logged into Steam. Alternatively login and pay from <span onclick='javascript:createExternalLink(\"https://rpg.mo.ee\")()' class='common_link'/>https://rpg.mo.ee</span><br>Try enabling web payments?", function() {
                Steam.payment_issues = !0
            })
        },
        ask_for_review: function() {
            (!players[0].temp.review ||
                "number" == typeof players[0].temp.review && players[0].temp.review < secondstamp()) && setTimeout(function() {
                Socket.send("steam", {
                    sub: "review",
                    steamid: greenworks.getSteamId().staticAccountId
                })
            }, 5E3)
        }
    },
    map_size_x = 100,
    map_size_y = 100,
    map_settings = {},
    chat_filter_positions = {
        attempt: 0,
        fails: 1,
        chat: 2,
        whisper: 3,
        join_leave: 4,
        loot: 5,
        magic: 6,
        archery: 7,
        spam: 8,
        time: 9,
        url: 10
    },
    null_function = function() {};

function create2DArray(a, b) {
    var d = [],
        e = 0;
    for (1 == b && (e = -a); e <= a; e++) d[e] = [];
    return d
}

function thousandSeperate(a) {
    a = a.toString().replace(/,/g, "");
    for (var b = /(-?[0-9]+)([0-9]{3})/; b.test(a);) a = a.replace(b, "$1,$2");
    return a
}

function shortenNumbers(a) {
    return 1E4 < a ? Math.round(a / 10) / 100 + "k" : Math.round(a)
}

function deepObjCopy(a) {
    var b = {};
    if ("object" == typeof a && null != a) {
        "undefined" != typeof a.length && (b = []);
        for (var d in a) "object" == typeof a[d] ? b[d] = deepObjCopy(a[d]) : "string" == typeof a[d] ? b[d] = a[d] : "number" == typeof a[d] ? b[d] = a[d] : "boolean" == typeof a[d] && (1 == a[d] ? b[d] = !0 : b[d] = !1)
    }
    return b
}

function sortArrayOfObjectsByFieldValueAsc(a, b) {
    return a.sort(function(a, e) {
        return a[b] < e[b] ? -1 : a[b] > e[b] ? 1 : 0
    })
}

function sortArrayOfObjectsBy(a, b) {
    return a.sort(function(a, e) {
        for (var f = 0; f < b.length; f++) {
            var g = b[f];
            if ("asc" == g.order) {
                if (a[g.field] < e[g.field]) return -1;
                if (a[g.field] > e[g.field]) return 1
            } else {
                if (a[g.field] > e[g.field]) return -1;
                if (a[g.field] < e[g.field]) return 1
            }
        }
        return 0
    })
}

function sortChannels(a) {
    return a.sort(function(a, d) {
        return a < d ? -1 : a > d ? 1 : 0
    })
}

function sortArrayOfObjectsByFieldValueDesc(a, b) {
    return a.sort(function(a, e) {
        return a[b] > e[b] ? -1 : a[b] < e[b] ? 1 : 0
    })
}
var ArrayHelper = {
    clone: function(a) {
        for (var b = [], d = 0, e = a.length; d < e; d++) b[d] = a[d];
        return b
    },
    unique: function(a) {
        a = a.sort(function(a, b) {
            return 1 * a - 1 * b
        });
        for (var b = [a[0]], d = 1; d < a.length; d++) a[d - 1] !== a[d] && b.push(a[d]);
        return b
    },
    unique2: function(a) {
        var b = {},
            d = [];
        a.forEach(function(a) {
            b[a] = a
        });
        for (var e in b) d.push(b[e]);
        return d
    },
    sample: function(a) {
        return a[a.length * Math.random() << 0]
    },
    shuffle: function(a) {
        var b, d, e;
        for (e = a.length; e; e--) b = Math.floor(Math.random() * e), d = a[e - 1], a[e - 1] = a[b], a[b] = d
    }
};
JSON.merge = function(a, b) {
    var d = deepObjCopy(a),
        e;
    for (e in b) b.hasOwnProperty(e) && (d[e] = b[e]);
    return d
};
JSON.count = function(a) {
    var b = 0,
        d;
    for (d in a) a.hasOwnProperty(d) && ++b;
    return b
};
JSON.clone = function(a) {
    return deepObjCopy(a)
};
String.prototype.sanitizeChat = function() {
    return escapeHtml(this)
};
String.prototype.filterChat = function(a) {
    var b = /()/gi;
    switch (a) {
        case "$$":
        case "E2":
        case "E3":
        case "E4":
        case "E5":
        case "E6":
        case "E7":
        case "E8":
        case "E9":
        case "EN":
            b = swear_regexes.EN;
            break;
        default:
            swear_regexes[a] ? b = swear_regexes[a] : swear_regexes.ALL && (b = swear_regexes.ALL)
    }
    return this.replace(b, function(a) {
        return a.replace(/./g, "*")
    })
};
var entityMap = {
    "&": "",
    "<": "\u227a",
    ">": "\u227b",
    "'": "`"
};

function escapeHtml(a) {
    return String(a).replace(/[&<>']/g, function(a) {
        return entityMap[a]
    })
}
String.prototype.sanitizeLang = function() {
    return "{M}" == this ? this.toString() : this.substring(0, 3).username().sanitizeChat().replace(/["]/g, "").trim().toUpperCase()
};
String.prototype.sanitize = function() {
    return this.replace(/[^A-Za-z-_0-9\u00fc\u00f5\u00f6\u00e4\u00d6\u00c4\u00d5\u00dc\u0161\u0160\u017e\u017d\@#$%^"'; \?!\.,'()\=\+\-\*\/:]/g, "")
};
String.prototype.username = function() {
    return this.sanitize().trim().replace(/ +(?= )/g, "").replace(/\/|\\/g, "").trim()
};
String.prototype.usernamify = function() {
    return this.toLowerCase().username().substr(0, 16)
};
String.prototype.uppercasePercentage = function() {
    var a = this.length,
        b = this.match(/[A-Z]/g);
    return null !== b ? b.length / a : 0
};
String.prototype.symbolPercentage = function() {
    for (var a = 0, b = 0; b < this.length; b++) {
        var d = this.substring(b, b + 1).charCodeAt(0);
        32 == d || 48 <= d && 122 >= d && !(58 <= d && 64 >= d) || a++
    }
    return Math.ceil(a / this.length * 100) / 100
};
String.prototype.longestStreak = function() {
    var a, b, d, e = this.length,
        f = 0;
    for (a = 0; a < e; a++) "" != b && b == this[a] ? d++ : d = 1, b = this[a], d > f && (f = d);
    return f
};
String.prototype.levenshtein = function(a, b) {
    var d = this;
    "undefined" !== typeof b && b || (d = d.toLowerCase(), a = a.toLowerCase());
    if (d == a) return 0;
    var e = d.length,
        f = a.length;
    if (0 === e) return 1 * f;
    if (0 === f) return 1 * e;
    var g = !1;
    try {
        g = !"0" [0]
    } catch (h) {
        g = !0
    }
    g && (d = d.split(""), a = a.split(""));
    var g = Array(f + 1),
        l = Array(f + 1),
        m, k, v, q;
    for (k = 0; k <= f; k++) g[k] = 1 * k;
    for (m = 0; m < e; m++) {
        l[0] = g[0] + 1;
        for (k = 0; k < f; k++) v = g[k] + (d[m] == a[k] ? 0 : 1), q = g[k + 1] + 1, q < v && (v = q), q = l[k] + 1, q < v && (v = q), l[k + 1] = v;
        k = g;
        g = l;
        l = k
    }
    return v = g[f]
};
Filters = {
    applyFilter: function(a, b, d) {
        var e = Filters.getCanvas(a.width, a.height),
            f = e.getContext("2d");
        f.drawImage(a, 0, 0);
        var g;
        a = f.getImageData(0, 0, e.width, e.height);
        var h = [];
        "number" == typeof b.length && (h = b, b = h.pop());
        switch (b.filter) {
            case "darkness":
                g = Filters.brightness(a, -b.darkness);
                break;
            case "brightness":
                g = Filters.brightness(a, b.brightness);
                break;
            case "grayscale":
                g = Filters.grayscale(a);
                break;
            case "tint":
                g = Filters.tint(a, b.amount, b.color);
                break;
            case "blur":
                g = Filters.convolute(a, [1 / 9, 1 / 9, 1 / 9, 1 / 9,
                    1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9
                ])
        }
        f.putImageData(g, 0, 0);
        var l = new Image;
        l.src = e.toDataURL("image/png");
        if ("number" == typeof h.length && 0 < h.length) l.onload = function() {
            return Filters.applyFilter(l, h, d)
        };
        else if ("function" == typeof d) d(l);
        else return l
    },
    brightness: function(a, b) {
        for (var d = a.data, e = 0; e < d.length; e += 4) d[e] += b, d[e + 1] += b, d[e + 2] += b;
        return a
    },
    darken: function(a) {
        for (var b = a.data, d = 0; d < b.length; d += 4) b[d] += -75, b[d + 1] += -75, b[d + 2] += -75;
        return a
    },
    tint: function(a, b, d) {
        for (var e = a.data, f = 0; f < e.length; f += 4) e[f] = b *
            d.r + (1 - b) * e[f], e[f + 1] = b * d.g + (1 - b) * e[f + 1], e[f + 2] = b * d.b + (1 - b) * e[f + 2];
        return a
    },
    grayscale: function(a) {
        for (var b = a.data, d = 0; d < b.length; d += 4) b[d] = b[d + 1] = b[d + 2] = .2126 * b[d] + .7152 * b[d + 1] + .0722 * b[d + 2];
        return a
    },
    getPixels: function(a) {
        var b = this.getCanvas(a.width, a.height),
            d = b.getContext("2d");
        d.drawImage(a, 0, 0);
        return d.getImageData(0, 0, b.width, b.height)
    },
    getCanvas: function(a, b) {
        var d = document.createElement("canvas");
        d.width = a;
        d.height = b;
        return d
    },
    filterImage: function(a, b, d) {
        for (var e = [this.getPixels(b)], f =
                2; f < arguments.length; f++) e.push(arguments[f]);
        a.apply(null, e)
    },
    filterContext: function(a, b, d) {
        for (var e = [b.getImageData(0, 0, b.canvas.width, b.canvas.height)], f = 2; f < arguments.length; f++) e.push(arguments[f]);
        return a.apply(null, e)
    },
    createImageData: function(a, b) {
        return this.tmpCtx.createImageData(a, b)
    },
    convolute: function(a, b, d) {
        var e = Math.round(Math.sqrt(b.length)),
            f = Math.floor(e / 2),
            g = a.data,
            h = a.width;
        a = a.height;
        var l = Filters.createImageData(h, a),
            m = l.data;
        d = d ? 1 : 0;
        for (var k = 0; k < a; k++)
            for (var v = 0; v < h; v++) {
                for (var q =
                        k, r = v, A = 4 * (k * h + v), w = 0, z = 0, x = 0, B = 0, p = 0; p < e; p++)
                    for (var u = 0; u < e; u++) {
                        var n = q + p - f,
                            D = r + u - f;
                        0 <= n && n < a && 0 <= D && D < h && (n = 4 * (n * h + D), D = b[p * e + u], w += g[n] * D, z += g[n + 1] * D, x += g[n + 2] * D, B += g[n + 3] * D)
                    }
                m[A] = w;
                m[A + 1] = z;
                m[A + 2] = x;
                m[A + 3] = B + d * (255 - B)
            }
        return l
    }
};

function rHex() {
    return "#000000".replace(/0/g, function() {
        return (~~(16 * Math.random())).toString(16)
    })
}

function hex2str(a) {
    a = a.toString();
    for (var b = "", d = 0; d < a.length; d += 2) b += String.fromCharCode(parseInt(a.substr(d, 2), 16));
    return b
}

function stringToHex(a) {
    for (var b = "", d = 0, e = a.length, f; d < e; d += 1) f = a.charCodeAt(d), b += f.toString(16);
    return b
}

function timestamp() {
    return (new Date).getTime()
}

function secondstamp() {
    return parseInt(String(Math.round((new Date).getTime() / 1E3)))
}

function toClockTime(a) {
    a = new Date(a);
    return (10 > a.getHours() ? "0" : "") + a.getHours() + ":" + (10 > a.getMinutes() ? "0" : "") + a.getMinutes() + ":" + (10 > a.getSeconds() ? "0" : "") + a.getSeconds()
}
Math.range = function(a, b, d) {
    return Math.max(Math.min(a, d), b)
};
Math.fround = function(a) {
    return 5 < a % 10 ? Math.min(map_size_x, Math.ceil(a)) : Math.max(0, Math.floor(a))
};

function lzw_encode(a) {
    var b = {};
    a = (a + "").split("");
    for (var d = [], e, f = a[0], g = 256, h = 1; h < a.length; h++) e = a[h], null != b[f + e] ? f += e : (d.push(1 < f.length ? b[f] : f.charCodeAt(0)), b[f + e] = g, g++, f = e);
    d.push(1 < f.length ? b[f] : f.charCodeAt(0));
    for (h = 0; h < d.length; h++) d[h] = String.fromCharCode(d[h]);
    return d.join("")
}

function lzw_decode(a) {
    var b = {};
    a = (a + "").split("");
    for (var d = a[0], e = d, f = [d], g = 256, h, l = 1; l < a.length; l++) h = a[l].charCodeAt(0), h = 256 > h ? a[l] : b[h] ? b[h] : e + d, f.push(h), d = h.charAt(0), b[g] = e + d, g++, e = h;
    return f.join("")
}

function encode_utf8(a) {
    return unescape(encodeURIComponent(a))
}

function decode_utf8(a) {
    return decodeURIComponent(escape(a))
}

function prepare_pack(a) {
    return lzw_encode(encode_utf8(a))
}

function open_pack(a) {
    return decode_utf8(lzw_decode(a))
}

function inDistance(a, b, d, e) {
    return 1 >= distance(a, b, d, e)
}

function nearEachOther(a, b) {
    return a && b && a.map == b.map && inDistance(a.i, a.j, b.i, b.j) ? !0 : !1
}

function distance(a, b, d, e) {
    return Math.sqrt(Math.pow(a - d, 2) + Math.pow(b - e, 2))
}

function sortClosestTo(a, b) {
    for (var d = [], e = 0, f = b.length; e < f; e++) d.push({
        i: b[e].i,
        j: b[e].j,
        d: distance(a.i, a.j, b[e].i, b[e].j)
    });
    return d.sort(function(a, b) {
        return a.d - b.d
    })
}

function my_map_array() {
    return [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
}

function capitaliseFirstLetter(a) {
    return a.charAt(0).toUpperCase() + a.slice(1)
}

function aOrAn(a) {
    return /[aeiou]/.test(a.charAt(0).toLowerCase()) ? "an" : "a"
}

function sOrNoS(a) {
    return 1 == a ? "" : "s"
}
var countries = [{
        name: "Afghanistan",
        "short": "AF"
    }, {
        name: "\u00c5land Islands",
        "short": "AX"
    }, {
        name: "Albania",
        "short": "AL"
    }, {
        name: "Algeria",
        "short": "DZ"
    }, {
        name: "American Samoa",
        "short": "AS"
    }, {
        name: "Andorra",
        "short": "AD"
    }, {
        name: "Angola",
        "short": "AO"
    }, {
        name: "Anguilla",
        "short": "AI"
    }, {
        name: "Antarctica",
        "short": "AQ"
    }, {
        name: "Antigua and Barbuda",
        "short": "AG"
    }, {
        name: "Argentina",
        "short": "AR"
    }, {
        name: "Armenia",
        "short": "AM"
    }, {
        name: "Aruba",
        "short": "AW"
    }, {
        name: "Australia",
        "short": "AU"
    }, {
        name: "Austria",
        "short": "AT",
        tax: !0
    }, {
        name: "Azerbaijan",
        "short": "AZ"
    }, {
        name: "Bahamas",
        "short": "BS"
    }, {
        name: "Bahrain",
        "short": "BH"
    }, {
        name: "Bangladesh",
        "short": "BD"
    }, {
        name: "Barbados",
        "short": "BB"
    }, {
        name: "Belarus",
        "short": "BY"
    }, {
        name: "Belgium",
        "short": "BE",
        tax: !0
    }, {
        name: "Belize",
        "short": "BZ"
    }, {
        name: "Benin",
        "short": "BJ"
    }, {
        name: "Bermuda",
        "short": "BM"
    }, {
        name: "Bhutan",
        "short": "BT"
    }, {
        name: "Bolivia",
        "short": "BO"
    }, {
        name: "Bonaire",
        "short": "BQ"
    }, {
        name: "Bosnia and Herzegovina",
        "short": "BA"
    }, {
        name: "Botswana",
        "short": "BW"
    }, {
        name: "Bouvet Island",
        "short": "BV"
    }, {
        name: "Brazil",
        "short": "BR"
    }, {
        name: "Chagos Islands",
        "short": "IO"
    }, {
        name: "Brunei Darussalam",
        "short": "BN"
    }, {
        name: "Bulgaria",
        "short": "BG",
        tax: !0
    }, {
        name: "Burkina Faso",
        "short": "BF"
    }, {
        name: "Burundi",
        "short": "BI"
    }, {
        name: "Cambodia",
        "short": "KH"
    }, {
        name: "Cameroon",
        "short": "CM"
    }, {
        name: "Canada",
        "short": "CA"
    }, {
        name: "Cape Verde",
        "short": "CV"
    }, {
        name: "Cayman Islands",
        "short": "KY"
    }, {
        name: "Central African Republic",
        "short": "CF"
    }, {
        name: "Chad",
        "short": "TD"
    }, {
        name: "Chile",
        "short": "CL"
    }, {
        name: "China",
        "short": "CN"
    }, {
        name: "Christmas Island",
        "short": "CX"
    }, {
        name: "Cocos (Keeling) Islands",
        "short": "CC"
    }, {
        name: "Colombia",
        "short": "CO"
    }, {
        name: "Comoros",
        "short": "KM"
    }, {
        name: "Congo-Brazzaville",
        "short": "CG"
    }, {
        name: "Congo-Kinshasa",
        "short": "CD"
    }, {
        name: "Cook Islands",
        "short": "CK"
    }, {
        name: "Costa Rica",
        "short": "CR"
    }, {
        name: "C\u00f4te d'Ivoire",
        "short": "CI"
    }, {
        name: "Croatia",
        "short": "HR",
        tax: !0
    }, {
        name: "Cuba",
        "short": "CU"
    }, {
        name: "Cura\u00e7ao",
        "short": "CW"
    }, {
        name: "Cyprus",
        "short": "CY",
        tax: !0
    }, {
        name: "Czech Republic",
        "short": "CZ",
        tax: !0
    }, {
        name: "Denmark",
        "short": "DK",
        tax: !0
    }, {
        name: "Djibouti",
        "short": "DJ"
    }, {
        name: "Dominica",
        "short": "DM"
    }, {
        name: "Dominican Republic",
        "short": "DO"
    }, {
        name: "Ecuador",
        "short": "EC"
    }, {
        name: "Egypt",
        "short": "EG"
    }, {
        name: "El Salvador",
        "short": "SV"
    }, {
        name: "Equatorial Guinea",
        "short": "GQ"
    }, {
        name: "Eritrea",
        "short": "ER"
    }, {
        name: "Estonia",
        "short": "EE",
        tax: !0
    }, {
        name: "Ethiopia",
        "short": "ET"
    }, {
        name: "Falkland Islands (Malvinas)",
        "short": "FK"
    }, {
        name: "Faroe Islands",
        "short": "FO"
    }, {
        name: "Fiji",
        "short": "FJ"
    }, {
        name: "Finland",
        "short": "FI",
        tax: !0
    }, {
        name: "France",
        "short": "FR",
        tax: !0
    }, {
        name: "French Guiana",
        "short": "GF"
    }, {
        name: "French Polynesia",
        "short": "PF"
    }, {
        name: "French Southern Territories",
        "short": "TF"
    }, {
        name: "Gabon",
        "short": "GA"
    }, {
        name: "Gambia",
        "short": "GM"
    }, {
        name: "Georgia",
        "short": "GE"
    }, {
        name: "Germany",
        "short": "DE",
        tax: !0
    }, {
        name: "Ghana",
        "short": "GH"
    }, {
        name: "Gibraltar",
        "short": "GI"
    }, {
        name: "Greece",
        "short": "GR",
        tax: !0
    }, {
        name: "Greenland",
        "short": "GL"
    }, {
        name: "Grenada",
        "short": "GD"
    }, {
        name: "Guadeloupe",
        "short": "GP"
    }, {
        name: "Guam",
        "short": "GU"
    }, {
        name: "Guatemala",
        "short": "GT"
    }, {
        name: "Guernsey",
        "short": "GG"
    }, {
        name: "Guinea",
        "short": "GN"
    }, {
        name: "Guinea-Bissau",
        "short": "GW"
    }, {
        name: "Guyana",
        "short": "GY"
    }, {
        name: "Haiti",
        "short": "HT"
    }, {
        name: "Heard Island",
        "short": "HM"
    }, {
        name: "Honduras",
        "short": "HN"
    }, {
        name: "Hong Kong",
        "short": "HK"
    }, {
        name: "Hungary",
        "short": "HU",
        tax: !0
    }, {
        name: "Iceland",
        "short": "IS"
    }, {
        name: "India",
        "short": "IN"
    }, {
        name: "Indonesia",
        "short": "ID"
    }, {
        name: "Iran",
        "short": "IR"
    }, {
        name: "Iraq",
        "short": "IQ"
    }, {
        name: "Ireland",
        "short": "IE",
        tax: !0
    }, {
        name: "Isle of Man",
        "short": "IM"
    }, {
        name: "Israel",
        "short": "IL"
    }, {
        name: "Italy",
        "short": "IT",
        tax: !0
    }, {
        name: "Jamaica",
        "short": "JM"
    }, {
        name: "Japan",
        "short": "JP"
    }, {
        name: "Jersey",
        "short": "JE"
    }, {
        name: "Jordan",
        "short": "JO"
    }, {
        name: "Kazakhstan",
        "short": "KZ"
    }, {
        name: "Kenya",
        "short": "KE"
    }, {
        name: "Kiribati",
        "short": "KI"
    }, {
        name: "Kuwait",
        "short": "KW"
    }, {
        name: "Kyrgyzstan",
        "short": "KG"
    }, {
        name: "Laos",
        "short": "LA"
    }, {
        name: "Latvia",
        "short": "LV",
        tax: !0
    }, {
        name: "Lebanon",
        "short": "LB"
    }, {
        name: "Lesotho",
        "short": "LS"
    }, {
        name: "Liberia",
        "short": "LR"
    }, {
        name: "Libya",
        "short": "LY"
    }, {
        name: "Liechtenstein",
        "short": "LI"
    }, {
        name: "Lithuania",
        "short": "LT",
        tax: !0
    }, {
        name: "Luxembourg",
        "short": "LU",
        tax: !0
    }, {
        name: "Macao",
        "short": "MO"
    }, {
        name: "Macedonia",
        "short": "MK"
    }, {
        name: "Madagascar",
        "short": "MG"
    }, {
        name: "Malawi",
        "short": "MW"
    }, {
        name: "Malaysia",
        "short": "MY"
    }, {
        name: "Maldives",
        "short": "MV"
    }, {
        name: "Mali",
        "short": "ML"
    }, {
        name: "Malta",
        "short": "MT",
        tax: !0
    }, {
        name: "Marshall Islands",
        "short": "MH"
    }, {
        name: "Martinique",
        "short": "MQ"
    }, {
        name: "Mauritania",
        "short": "MR"
    }, {
        name: "Mauritius",
        "short": "MU"
    }, {
        name: "Mayotte",
        "short": "YT"
    }, {
        name: "Mexico",
        "short": "MX"
    }, {
        name: "Micronesia",
        "short": "FM"
    }, {
        name: "Moldova",
        "short": "MD"
    }, {
        name: "Monaco",
        "short": "MC"
    }, {
        name: "Mongolia",
        "short": "MN"
    }, {
        name: "Montenegro",
        "short": "ME"
    }, {
        name: "Montserrat",
        "short": "MS"
    }, {
        name: "Morocco",
        "short": "MA"
    }, {
        name: "Mozambique",
        "short": "MZ"
    }, {
        name: "Myanmar",
        "short": "MM"
    }, {
        name: "Namibia",
        "short": "NA"
    }, {
        name: "Nauru",
        "short": "NR"
    }, {
        name: "Nepal",
        "short": "NP"
    }, {
        name: "Netherlands",
        "short": "NL",
        tax: !0
    }, {
        name: "New Caledonia",
        "short": "NC"
    }, {
        name: "New Zealand",
        "short": "NZ"
    }, {
        name: "Nicaragua",
        "short": "NI"
    }, {
        name: "Niger",
        "short": "NE"
    }, {
        name: "Nigeria",
        "short": "NG"
    }, {
        name: "Niue",
        "short": "NU"
    }, {
        name: "Norfolk Island",
        "short": "NF"
    }, {
        name: "North Korea",
        "short": "KP"
    }, {
        name: "Northern Mariana Islands",
        "short": "MP"
    }, {
        name: "Norway",
        "short": "NO"
    }, {
        name: "Oman",
        "short": "OM"
    }, {
        name: "Pakistan",
        "short": "PK"
    }, {
        name: "Palau",
        "short": "PW"
    }, {
        name: "Palestinian Territories",
        "short": "PS"
    }, {
        name: "Panama",
        "short": "PA"
    }, {
        name: "Papua New Guinea",
        "short": "PG"
    }, {
        name: "Paraguay",
        "short": "PY"
    }, {
        name: "Peru",
        "short": "PE"
    }, {
        name: "Philippines",
        "short": "PH"
    }, {
        name: "Pitcairn",
        "short": "PN"
    }, {
        name: "Poland",
        "short": "PL",
        tax: !0
    }, {
        name: "Portugal",
        "short": "PT",
        tax: !0
    }, {
        name: "Puerto Rico",
        "short": "PR"
    }, {
        name: "Qatar",
        "short": "QA"
    }, {
        name: "R\u00e9union",
        "short": "RE"
    }, {
        name: "Romania",
        "short": "RO",
        tax: !0
    }, {
        name: "Russian Federation",
        "short": "RU"
    }, {
        name: "Rwanda",
        "short": "RW"
    }, {
        name: "Saint Barth\u00e9lemy",
        "short": "BL"
    }, {
        name: "Saint Helena",
        "short": "SH"
    }, {
        name: "Saint Kitts and Nevis",
        "short": "KN"
    }, {
        name: "Saint Lucia",
        "short": "LC"
    }, {
        name: "Saint Martin",
        "short": "MF"
    }, {
        name: "Saint Pierre and Miquelon",
        "short": "PM"
    }, {
        name: "Saint Vincent",
        "short": "VC"
    }, {
        name: "Samoa",
        "short": "WS"
    }, {
        name: "San Marino",
        "short": "SM"
    }, {
        name: "Sao Tome and Principe",
        "short": "ST"
    }, {
        name: "Saudi Arabia",
        "short": "SA"
    }, {
        name: "Senegal",
        "short": "SN"
    }, {
        name: "Serbia",
        "short": "RS"
    }, {
        name: "Seychelles",
        "short": "SC"
    }, {
        name: "Sierra Leone",
        "short": "SL"
    }, {
        name: "Singapore",
        "short": "SG"
    }, {
        name: "Sint Maarten (Dutch part)",
        "short": "SX"
    }, {
        name: "Slovakia",
        "short": "SK",
        tax: !0
    }, {
        name: "Slovenia",
        "short": "SI",
        tax: !0
    }, {
        name: "Solomon Islands",
        "short": "SB"
    }, {
        name: "Somalia",
        "short": "SO"
    }, {
        name: "South Africa",
        "short": "ZA"
    }, {
        name: "South Georgia",
        "short": "GS"
    }, {
        name: "South Korea",
        "short": "KR"
    }, {
        name: "South Sudan",
        "short": "SS"
    }, {
        name: "Spain",
        "short": "ES",
        tax: !0
    }, {
        name: "Sri Lanka",
        "short": "LK"
    }, {
        name: "Sudan",
        "short": "SD"
    }, {
        name: "Suriname",
        "short": "SR"
    }, {
        name: "Svalbard and Jan Mayen",
        "short": "SJ"
    }, {
        name: "Swaziland",
        "short": "SZ"
    }, {
        name: "Sweden",
        "short": "SE",
        tax: !0
    }, {
        name: "Switzerland",
        "short": "CH"
    }, {
        name: "Syrian Arab Republic",
        "short": "SY"
    }, {
        name: "Taiwan",
        "short": "TW"
    }, {
        name: "Tajikistan",
        "short": "TJ"
    }, {
        name: "Tanzania",
        "short": "TZ"
    }, {
        name: "Thailand",
        "short": "TH"
    }, {
        name: "Timor-Leste",
        "short": "TL"
    }, {
        name: "Togo",
        "short": "TG"
    }, {
        name: "Tokelau",
        "short": "TK"
    }, {
        name: "Tonga",
        "short": "TO"
    }, {
        name: "Trinidad and Tobago",
        "short": "TT"
    }, {
        name: "Tunisia",
        "short": "TN"
    }, {
        name: "Turkey",
        "short": "TR"
    }, {
        name: "Turkmenistan",
        "short": "TM"
    }, {
        name: "Turks and Caicos Islands",
        "short": "TC"
    }, {
        name: "Tuvalu",
        "short": "TV"
    }, {
        name: "Uganda",
        "short": "UG"
    }, {
        name: "Ukraine",
        "short": "UA"
    }, {
        name: "United Arab Emirates",
        "short": "AE"
    }, {
        name: "United Kingdom",
        "short": "GB",
        tax: !0
    }, {
        name: "United States",
        "short": "US"
    }, {
        name: "Uruguay",
        "short": "UY"
    }, {
        name: "Uzbekistan",
        "short": "UZ"
    }, {
        name: "Vanuatu",
        "short": "VU"
    }, {
        name: "Vatican City State",
        "short": "VA"
    }, {
        name: "Venezuela",
        "short": "VE"
    }, {
        name: "Viet Nam",
        "short": "VN"
    }, {
        name: "Virgin Islands, British",
        "short": "VG"
    }, {
        name: "Virgin Islands, U.S.",
        "short": "VI"
    }, {
        name: "Wallis and Futuna",
        "short": "WF"
    }, {
        name: "Western Sahara",
        "short": "EH"
    }, {
        name: "Yemen",
        "short": "YE"
    }, {
        name: "Zambia",
        "short": "ZM"
    }, {
        name: "Zimbabwe",
        "short": "ZW"
    }],
    countries_by_name_alpha2 = {
        AF: {
            name: "Afghanistan"
        },
        AX: {
            name: "\u00c5land Islands"
        },
        AL: {
            name: "Albania"
        },
        DZ: {
            name: "Algeria"
        },
        AS: {
            name: "American Samoa"
        },
        AD: {
            name: "Andorra"
        },
        AO: {
            name: "Angola"
        },
        AI: {
            name: "Anguilla"
        },
        AQ: {
            name: "Antarctica"
        },
        AG: {
            name: "Antigua and Barbuda"
        },
        AR: {
            name: "Argentina"
        },
        AM: {
            name: "Armenia"
        },
        AW: {
            name: "Aruba"
        },
        AU: {
            name: "Australia"
        },
        AT: {
            name: "Austria",
            tax: !0
        },
        AZ: {
            name: "Azerbaijan"
        },
        BS: {
            name: "Bahamas"
        },
        BH: {
            name: "Bahrain"
        },
        BD: {
            name: "Bangladesh"
        },
        BB: {
            name: "Barbados"
        },
        BY: {
            name: "Belarus"
        },
        BE: {
            name: "Belgium",
            tax: !0
        },
        BZ: {
            name: "Belize"
        },
        BJ: {
            name: "Benin"
        },
        BM: {
            name: "Bermuda"
        },
        BT: {
            name: "Bhutan"
        },
        BO: {
            name: "Bolivia"
        },
        BQ: {
            name: "Bonaire"
        },
        BA: {
            name: "Bosnia and Herzegovina"
        },
        BW: {
            name: "Botswana"
        },
        BV: {
            name: "Bouvet Island"
        },
        BR: {
            name: "Brazil"
        },
        IO: {
            name: "Chagos Islands"
        },
        BN: {
            name: "Brunei Darussalam"
        },
        BG: {
            name: "Bulgaria",
            tax: !0
        },
        BF: {
            name: "Burkina Faso"
        },
        BI: {
            name: "Burundi"
        },
        KH: {
            name: "Cambodia"
        },
        CM: {
            name: "Cameroon"
        },
        CA: {
            name: "Canada"
        },
        CV: {
            name: "Cape Verde"
        },
        KY: {
            name: "Cayman Islands"
        },
        CF: {
            name: "Central African Republic"
        },
        TD: {
            name: "Chad"
        },
        CL: {
            name: "Chile"
        },
        CN: {
            name: "China"
        },
        CX: {
            name: "Christmas Island"
        },
        CC: {
            name: "Cocos (Keeling) Islands"
        },
        CO: {
            name: "Colombia"
        },
        KM: {
            name: "Comoros"
        },
        CG: {
            name: "Congo-Brazzaville"
        },
        CD: {
            name: "Congo-Kinshasa"
        },
        CK: {
            name: "Cook Islands"
        },
        CR: {
            name: "Costa Rica"
        },
        CI: {
            name: "C\u00f4te d'Ivoire"
        },
        HR: {
            name: "Croatia",
            tax: !0
        },
        CU: {
            name: "Cuba"
        },
        CW: {
            name: "Cura\u00e7ao"
        },
        CY: {
            name: "Cyprus",
            tax: !0
        },
        CZ: {
            name: "Czech Republic",
            tax: !0
        },
        DK: {
            name: "Denmark",
            tax: !0
        },
        DJ: {
            name: "Djibouti"
        },
        DM: {
            name: "Dominica"
        },
        DO: {
            name: "Dominican Republic"
        },
        EC: {
            name: "Ecuador"
        },
        EG: {
            name: "Egypt"
        },
        SV: {
            name: "El Salvador"
        },
        GQ: {
            name: "Equatorial Guinea"
        },
        ER: {
            name: "Eritrea"
        },
        EE: {
            name: "Estonia",
            tax: !0
        },
        ET: {
            name: "Ethiopia"
        },
        FK: {
            name: "Falkland Islands (Malvinas)"
        },
        FO: {
            name: "Faroe Islands"
        },
        FJ: {
            name: "Fiji"
        },
        FI: {
            name: "Finland",
            tax: !0
        },
        FR: {
            name: "France",
            tax: !0
        },
        GF: {
            name: "French Guiana"
        },
        PF: {
            name: "French Polynesia"
        },
        TF: {
            name: "French Southern Territories"
        },
        GA: {
            name: "Gabon"
        },
        GM: {
            name: "Gambia"
        },
        GE: {
            name: "Georgia"
        },
        DE: {
            name: "Germany",
            tax: !0
        },
        GH: {
            name: "Ghana"
        },
        GI: {
            name: "Gibraltar"
        },
        GR: {
            name: "Greece",
            tax: !0
        },
        GL: {
            name: "Greenland"
        },
        GD: {
            name: "Grenada"
        },
        GP: {
            name: "Guadeloupe"
        },
        GU: {
            name: "Guam"
        },
        GT: {
            name: "Guatemala"
        },
        GG: {
            name: "Guernsey"
        },
        GN: {
            name: "Guinea"
        },
        GW: {
            name: "Guinea-Bissau"
        },
        GY: {
            name: "Guyana"
        },
        HT: {
            name: "Haiti"
        },
        HM: {
            name: "Heard Island"
        },
        HN: {
            name: "Honduras"
        },
        HK: {
            name: "Hong Kong"
        },
        HU: {
            name: "Hungary",
            tax: !0
        },
        IS: {
            name: "Iceland"
        },
        IN: {
            name: "India"
        },
        ID: {
            name: "Indonesia"
        },
        IR: {
            name: "Iran"
        },
        IQ: {
            name: "Iraq"
        },
        IE: {
            name: "Ireland",
            tax: !0
        },
        IM: {
            name: "Isle of Man"
        },
        IL: {
            name: "Israel"
        },
        IT: {
            name: "Italy",
            tax: !0
        },
        JM: {
            name: "Jamaica"
        },
        JP: {
            name: "Japan"
        },
        JE: {
            name: "Jersey"
        },
        JO: {
            name: "Jordan"
        },
        KZ: {
            name: "Kazakhstan"
        },
        KE: {
            name: "Kenya"
        },
        KI: {
            name: "Kiribati"
        },
        KW: {
            name: "Kuwait"
        },
        KG: {
            name: "Kyrgyzstan"
        },
        LA: {
            name: "Laos"
        },
        LV: {
            name: "Latvia",
            tax: !0
        },
        LB: {
            name: "Lebanon"
        },
        LS: {
            name: "Lesotho"
        },
        LR: {
            name: "Liberia"
        },
        LY: {
            name: "Libya"
        },
        LI: {
            name: "Liechtenstein"
        },
        LT: {
            name: "Lithuania",
            tax: !0
        },
        LU: {
            name: "Luxembourg",
            tax: !0
        },
        MO: {
            name: "Macao"
        },
        MK: {
            name: "Macedonia"
        },
        MG: {
            name: "Madagascar"
        },
        MW: {
            name: "Malawi"
        },
        MY: {
            name: "Malaysia"
        },
        MV: {
            name: "Maldives"
        },
        ML: {
            name: "Mali"
        },
        MT: {
            name: "Malta",
            tax: !0
        },
        MH: {
            name: "Marshall Islands"
        },
        MQ: {
            name: "Martinique"
        },
        MR: {
            name: "Mauritania"
        },
        MU: {
            name: "Mauritius"
        },
        YT: {
            name: "Mayotte"
        },
        MX: {
            name: "Mexico"
        },
        FM: {
            name: "Micronesia"
        },
        MD: {
            name: "Moldova"
        },
        MC: {
            name: "Monaco"
        },
        MN: {
            name: "Mongolia"
        },
        ME: {
            name: "Montenegro"
        },
        MS: {
            name: "Montserrat"
        },
        MA: {
            name: "Morocco"
        },
        MZ: {
            name: "Mozambique"
        },
        MM: {
            name: "Myanmar"
        },
        NA: {
            name: "Namibia"
        },
        NR: {
            name: "Nauru"
        },
        NP: {
            name: "Nepal"
        },
        NL: {
            name: "Netherlands",
            tax: !0
        },
        NC: {
            name: "New Caledonia"
        },
        NZ: {
            name: "New Zealand"
        },
        NI: {
            name: "Nicaragua"
        },
        NE: {
            name: "Niger"
        },
        NG: {
            name: "Nigeria"
        },
        NU: {
            name: "Niue"
        },
        NF: {
            name: "Norfolk Island"
        },
        KP: {
            name: "North Korea"
        },
        MP: {
            name: "Northern Mariana Islands"
        },
        NO: {
            name: "Norway"
        },
        OM: {
            name: "Oman"
        },
        PK: {
            name: "Pakistan"
        },
        PW: {
            name: "Palau"
        },
        PS: {
            name: "Palestinian Territories"
        },
        PA: {
            name: "Panama"
        },
        PG: {
            name: "Papua New Guinea"
        },
        PY: {
            name: "Paraguay"
        },
        PE: {
            name: "Peru"
        },
        PH: {
            name: "Philippines"
        },
        PN: {
            name: "Pitcairn"
        },
        PL: {
            name: "Poland",
            tax: !0
        },
        PT: {
            name: "Portugal",
            tax: !0
        },
        PR: {
            name: "Puerto Rico"
        },
        QA: {
            name: "Qatar"
        },
        RE: {
            name: "R\u00e9union"
        },
        RO: {
            name: "Romania",
            tax: !0
        },
        RU: {
            name: "Russian Federation"
        },
        RW: {
            name: "Rwanda"
        },
        BL: {
            name: "Saint Barth\u00e9lemy"
        },
        SH: {
            name: "Saint Helena"
        },
        KN: {
            name: "Saint Kitts and Nevis"
        },
        LC: {
            name: "Saint Lucia"
        },
        MF: {
            name: "Saint Martin"
        },
        PM: {
            name: "Saint Pierre and Miquelon"
        },
        VC: {
            name: "Saint Vincent"
        },
        WS: {
            name: "Samoa"
        },
        SM: {
            name: "San Marino"
        },
        ST: {
            name: "Sao Tome and Principe"
        },
        SA: {
            name: "Saudi Arabia"
        },
        SN: {
            name: "Senegal"
        },
        RS: {
            name: "Serbia"
        },
        SC: {
            name: "Seychelles"
        },
        SL: {
            name: "Sierra Leone"
        },
        SG: {
            name: "Singapore"
        },
        SX: {
            name: "Sint Maarten (Dutch part)"
        },
        SK: {
            name: "Slovakia",
            tax: !0
        },
        SI: {
            name: "Slovenia",
            tax: !0
        },
        SB: {
            name: "Solomon Islands"
        },
        SO: {
            name: "Somalia"
        },
        ZA: {
            name: "South Africa"
        },
        GS: {
            name: "South Georgia"
        },
        KR: {
            name: "South Korea"
        },
        SS: {
            name: "South Sudan"
        },
        ES: {
            name: "Spain",
            tax: !0
        },
        LK: {
            name: "Sri Lanka"
        },
        SD: {
            name: "Sudan"
        },
        SR: {
            name: "Suriname"
        },
        SJ: {
            name: "Svalbard and Jan Mayen"
        },
        SZ: {
            name: "Swaziland"
        },
        SE: {
            name: "Sweden",
            tax: !0
        },
        CH: {
            name: "Switzerland"
        },
        SY: {
            name: "Syrian Arab Republic"
        },
        TW: {
            name: "Taiwan"
        },
        TJ: {
            name: "Tajikistan"
        },
        TZ: {
            name: "Tanzania"
        },
        TH: {
            name: "Thailand"
        },
        TL: {
            name: "Timor-Leste"
        },
        TG: {
            name: "Togo"
        },
        TK: {
            name: "Tokelau"
        },
        TO: {
            name: "Tonga"
        },
        TT: {
            name: "Trinidad and Tobago"
        },
        TN: {
            name: "Tunisia"
        },
        TR: {
            name: "Turkey"
        },
        TM: {
            name: "Turkmenistan"
        },
        TC: {
            name: "Turks and Caicos Islands"
        },
        TV: {
            name: "Tuvalu"
        },
        UG: {
            name: "Uganda"
        },
        UA: {
            name: "Ukraine"
        },
        AE: {
            name: "United Arab Emirates"
        },
        GB: {
            name: "United Kingdom",
            tax: !0
        },
        US: {
            name: "United States"
        },
        UY: {
            name: "Uruguay"
        },
        UZ: {
            name: "Uzbekistan"
        },
        VU: {
            name: "Vanuatu"
        },
        VA: {
            name: "Vatican City State"
        },
        VE: {
            name: "Venezuela"
        },
        VN: {
            name: "Viet Nam"
        },
        VG: {
            name: "Virgin Islands, British"
        },
        VI: {
            name: "Virgin Islands, U.S."
        },
        WF: {
            name: "Wallis and Futuna"
        },
        EH: {
            name: "Western Sahara"
        },
        YE: {
            name: "Yemen"
        },
        ZM: {
            name: "Zambia"
        },
        ZW: {
            name: "Zimbabwe"
        }
    },
    vat_by_country = {
        AT: {
            rate: 20,
            abbr: "mwSt."
        },
        BE: {
            rate: 21,
            abbr: "BTW"
        },
        BG: {
            rate: 20,
            abbr: "\u0414\u0414\u0421"
        },
        CY: {
            rate: 19,
            abbr: "\u03a6\u03a0\u0391"
        },
        CZ: {
            rate: 21,
            abbr: "DPH"
        },
        HR: {
            rate: 25,
            abbr: "PDV"
        },
        DK: {
            rate: 25,
            abbr: "moms"
        },
        EE: {
            rate: 20,
            abbr: "km"
        },
        FI: {
            rate: 24,
            abbr: "ALV"
        },
        FR: {
            rate: 20,
            abbr: "TVA"
        },
        DE: {
            rate: 19,
            abbr: "MwSt."
        },
        GR: {
            rate: 24,
            abbr: "\u03a6\u03a0\u0391"
        },
        HU: {
            rate: 27,
            abbr: "\u00c1FA"
        },
        IE: {
            rate: 23,
            abbr: "VAT"
        },
        IT: {
            rate: 22,
            abbr: "IVA"
        },
        LV: {
            rate: 21,
            abbr: "PVN"
        },
        LT: {
            rate: 21,
            abbr: "PVM"
        },
        LU: {
            rate: 17,
            abbr: "TVA"
        },
        MT: {
            rate: 18,
            abbr: "VAT"
        },
        NL: {
            rate: 21,
            abbr: "BTW"
        },
        PL: {
            rate: 23,
            abbr: "PTU"
        },
        PT: {
            rate: 23,
            abbr: "IVA"
        },
        RO: {
            rate: 20,
            abbr: "TVA"
        },
        SK: {
            rate: 20,
            abbr: "DPH"
        },
        SI: {
            rate: 22,
            abbr: "DDV"
        },
        ES: {
            rate: 21,
            abbr: "IVA"
        },
        SE: {
            rate: 25,
            abbr: "Moms"
        },
        GB: {
            rate: 20,
            abbr: "VAT"
        }
    },
    Country = {
        vat_required: function(a) {
            return !(!countries_by_name_alpha2[a] || !countries_by_name_alpha2[a].tax)
        },
        vat: function(a) {
            return vat_by_country[a].rate / 100
        },
        vat_label: function(a) {
            return "+ " + vat_by_country[a].abbr + "(" + vat_by_country[a].rate + "%)"
        },
        abbr: function(a) {
            return vat_by_country[a].abbr
        }
    };

function highscore_search(a, b, d, e) {
    for (; - 1 < e;) return b[e].key > a ? e : 0
}

function validIP(a) {
    if (!a) return !1;
    a = a.split(".");
    if (4 != a.length) return !1;
    for (var b in a)
        if (parseInt(a[b]) != a[b] || 1 > parseInt(a[b]) || 255 < parseInt(a[b])) return !1;
    return !0
}

function isEmail(a) {
    return !!a.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)
}
var randomSalt = function(a) {
        var b, d;
        b = "";
        for (d = 1; 1 <= a ? d <= a : d >= a; 1 <= a ? ++d : --d) b += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%&/()=?,.-_*-+" [79 * Math.random() << 0];
        return b
    },
    htmlRandomSalt = function(a) {
        var b, d;
        b = "";
        for (d = 1; 1 <= a ? d <= a : d >= a; 1 <= a ? ++d : --d) b += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" [62 * Math.random() << 0];
        return b
    },
    totrRandomKey = function(a) {
        var b, d;
        b = "";
        for (d = 1; 1 <= a ? d <= a : d >= a; 1 <= a ? ++d : --d) b += "ABCDEFGHIJKLMNOPQRSTUVWXYZ" [26 * Math.random() << 0];
        return b
    };

function sizeOfEnclosure(a, b, d, e) {
    var f = e.length,
        g = function(a) {
            return 0 > a.i || a.i >= f || 0 > a.j || a.j >= f ? !0 : !1
        };
    if (g({
            i: a,
            j: b
        })) return {
        status: !1,
        error: "out_of_border"
    };
    for (var h = [], l = [{
            i: 1,
            j: 0
        }, {
            i: 0,
            j: 1
        }, {
            i: -1,
            j: 0
        }, {
            i: 0,
            j: -1
        }], m = [], k = 0; k < f; k++) m[k] = [];
    h.push({
        i: a,
        j: b
    });
    m[a][b] = !0;
    b = a = 0;
    for (var v = !0, k = []; 0 < h.length;) {
        var q = h.pop();
        if (m[q.i][q.j]) {
            if (!v) continue
        } else m[q.i][q.j] = !0, a++;
        for (var r in l) {
            v = {
                i: q.i + l[r].i,
                j: q.j + l[r].j
            };
            if (g(v)) return {
                status: !1,
                error: "out_of_border",
                same_position: k
            };
            if (2 != e[v.i][v.j] ||
                m[v.i][v.j]) {
                var A;
                A = e[v.i][v.j] ? !1 : !0;
                A && h.push(v)
            } else if (k.push({
                    i: v.i,
                    j: v.j
                }), m[v.i][v.j] = !0, b++, b >= d) return {
                status: !1,
                error: "same_type_limit",
                same_position: k
            }
        }
        v = !1
    }
    return {
        status: !0,
        area: a,
        same_type: b,
        same_position: k
    }
}
var Validate = {
    position: function(a) {
        return "object" == typeof a && a && "number" == typeof a.i && "number" == typeof a.j ? !0 : !1
    }
};

function escapeRegExp(a) {
    return a.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
}

function textToRegex(a) {
    var b = !1;
    try {
        b = RegExp(a, "i")
    } catch (d) {
        b = RegExp(escapeRegExp(a), "i")
    }
    return b
}

function isFuncNative(a) {
    return !!a && "function" == (typeof a).toLowerCase() && (a === Function.prototype || /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i.test(String(a)))
}
var COLOR = {
        BLACK: "#000000",
        WHITE: "#FFFFFF",
        PREMIUM: "#CCFFFF",
        YELLOW: "#FFFF00",
        FRIEND: "#FFFF00",
        GREEN: "#51EA30",
        LGREEN: "#82FD67",
        PINK: "#F3A7BD",
        BLUE: "#061BB5",
        ORANGE: "#F2982A",
        TEAL: "#3BEEEE",
        PURPLE: "#560F8A",
        RED: "#FF0000",
        RANDOM: function() {
            return "#000000".replace(/0/g, function() {
                return (~~(16 * Math.random())).toString(16)
            })
        }
    },
    CHANNEL_COLOR = {
        EN: "#FFFFFF",
        18: "#99FFC6",
        $$: "#F2A2F2",
        "{M}": "#EAE330",
        "default": "#FFDFC0",
        none: "#DDDD69"
    },
    SpectateWindow = {
        slave: !1,
        iframe: !1,
        active: !1,
        salt: randomSalt(16),
        fullscreen: !1,
        player: !1,
        key: !1,
        onload: function() {
            getHashParameterByName("slave") && (document.getElementById("back_to_game_link").style.display = "block", SpectateWindow.player = getHashParameterByName("player"), SpectateWindow.key = "false" === getHashParameterByName("key") ? !1 : getHashParameterByName("key"), SpectateWindow.init(!!getHashParameterByName("slave"), getHashParameterByName("salt")), real_login_function = function() {
                document.getElementById("donation_button").style.display = "none";
                document.getElementById("spectate_button").style.display =
                    "block"
            }, window.focus())
        },
        connected: function() {
            SpectateWindow.slave && 2E3 < timestamp() - Spectate.last_watch_requested && (SpectateWindow.sendMessage({
                action: "slave_initialized"
            }), Spectate.toggle_spectators_link())
        },
        captcha: function() {
            !SpectateWindow.slave && SpectateWindow.active && SpectateWindow.hide_iframe()
        },
        request_fullscreen: function() {
            SpectateWindow.slave ? SpectateWindow.sendMessage({
                action: "fullscreen"
            }) : Fullscreen.request()
        },
        no_streams_available: function() {
            SpectateWindow.slave && SpectateWindow.sendMessage({
                action: "no_streams"
            })
        },
        hide_iframe: function() {
            SpectateWindow.iframe.style.display = "none";
            SpectateWindow.active = !1;
            pageVisible();
            Timers.set("destroy_iframe", function() {
                SpectateWindow.destroy_iframe()
            }, 2E5);
            SpectateWindow.sendMessage({
                action: "hidden"
            });
            window.focus();
            Music.resumeAll()
        },
        destroy_iframe: function() {
            document.body.removeChild(SpectateWindow.iframe);
            SpectateWindow.iframe = !1;
            Timers.clear("destroy_iframe")
        },
        init: function(a, b) {
            if (SpectateWindow.slave = a) SpectateWindow.salt = b, window.addEventListener("message", SpectateWindow.receiveMessage, !1);
            else if (SpectateWindow.iframe) SpectateWindow.sendMessage({
                action: "activate",
                player: players[0].name
            });
            else {
                var d = document.createElement("iframe");
                d.style.width = "1px";
                d.style.height = "1px";
                d.style.position = "absolute";
                d.style.left = "0px";
                d.style.top = "0px";
                d.style.zIndex = "9999999999";
                d.style.display = "block";
                d.src = SpectateWindow.getSlaveUrl();
                document.body.appendChild(d);
                window.addEventListener("message", SpectateWindow.receiveMessage, !1);
                SpectateWindow.iframe = d;
                addChatText(_ti("Loading spectator mode..."),
                    null, COLOR.WHITE);
                d.contentWindow.location.href = SpectateWindow.getSlaveUrl()
            }
        },
        getOrigin: function() {
            var a = "";
            if (1337 == window.location.port || 1338 == window.location.port) a = ":" + window.location.port;
            return window.location.protocol + "//" + window.location.hostname + a
        },
        getSlaveUrl: function() {
            var a = "";
            "android" == getParameterByName("inapp") ? a = "?inapp=android" : "steam" == getParameterByName("inapp") && (a = "?inapp=steam");
            return SpectateWindow.getOrigin() + window.location.pathname + a + "#slave=true&salt=" + encodeURIComponent(SpectateWindow.salt) +
                "&player=" + encodeURIComponent(players[0].name) + "&key=" + encodeURIComponent(SpectateWindow.key)
        },
        receiveMessage: function(a) {
            var b = a.message ? a.message : a.data;
            if (a.origin !== SpectateWindow.getOrigin()) console.log("Untrusted origin:", a.origin, "should be", SpectateWindow.getOrigin());
            else if (b && b.action && b.slave != SpectateWindow.slave && b.salt == SpectateWindow.salt) switch (b.action) {
                case "activate":
                    SpectateWindow.active = !1;
                    SpectateWindow.player = b.player;
                    pageVisible();
                    (FormHelper.is_form_visible("streams") || GAME_STATE ==
                        GAME_STATES.LOGIN) && Spectate.spectate_streams();
                    window.focus();
                    SpectateWindow.sendMessage({
                        action: "slave_initialized"
                    });
                    "Name" != players[0].name && (Music.resumeAll(), Music.play(players[0].map));
                    break;
                case "hidden":
                    SpectateWindow.active = !0;
                    pageHidden();
                    Music.pauseAll();
                    break;
                case "fullscreen_slave":
                    SpectateWindow.fullscreen = b.fullscreen;
                    setCanvasSize(!0);
                    break;
                case "chat_message":
                    if (SpectateWindow.active) break;
                    chat_history.push({
                        text: b.text,
                        user: b.user,
                        color: b.color,
                        type: b.type,
                        lang: b.lang,
                        to: b.to,
                        id: b.id,
                        server: b.server,
                        data: b.data,
                        time: b.time
                    });
                    chat_history.length > Chat.max_chat_history && chat_history.splice(0, 1);
                    t = chat_history.length - 1;
                    Chat.add_lines(t);
                    break;
                case "remove_line_slave":
                    Chat.remove_line(b.line, b.moderator);
                    break;
                case "channels":
                    Contacts.channels = b.channels;
                    delete Contacts.channels["{M}"];
                    Contacts.update_channel_list();
                    break;
                case "hide_iframe":
                    SpectateWindow.hide_iframe();
                    break;
                case "fullscreen":
                    Fullscreen.request();
                    break;
                case "no_streams":
                    SpectateWindow.hide_iframe();
                    Popup.dialog(_te("No streams available!"),
                        null_function);
                    break;
                case "slave_initialized":
                    SpectateWindow.sendMessage({
                        action: "channels",
                        channels: Contacts.channels
                    });
                    SpectateWindow.iframe.style.display = "block";
                    SpectateWindow.iframe.style.width = "100%";
                    SpectateWindow.iframe.style.height = "100%";
                    SpectateWindow.active = !0;
                    Timers.clear("destroy_iframe");
                    pageHidden();
                    Music.pauseAll();
                    break;
                case "chat":
                    if (Chat.has_client_command(b.data)) {
                        Chat.execute_client_command(b.data);
                        break
                    }
                    Socket.send("message", {
                        data: b.data,
                        lang: b.lang
                    });
                    break;
                case "remove_line":
                    Socket.send("remove_line", {
                        line: b.line
                    })
            }
        },
        sendMessage: function(a) {
            a.slave = SpectateWindow.slave;
            a.salt = SpectateWindow.salt;
            SpectateWindow.slave ? parent.postMessage(a, SpectateWindow.getOrigin()) : SpectateWindow.iframe && SpectateWindow.iframe.contentWindow.postMessage(a, SpectateWindow.getOrigin())
        }
    },
    GAME_STATES = {
        LOGIN: "0",
        GAME: "1",
        EDITOR: "2",
        CHAT: "3",
        SPECTATE: "4"
    },
    GAME_STATE = GAME_STATES.LOGIN;

function setGameState(a) {
    if (GAME_STATE != a) {
        var b = GAME_STATE;
        GAME_STATE == GAME_STATES.LOGIN ? a == GAME_STATES.GAME ? GAME_STATE = a : a == GAME_STATES.SPECTATE && (GAME_STATE = a) : GAME_STATE == GAME_STATES.GAME ? a == GAME_STATES.LOGIN ? GAME_STATE = a : a == GAME_STATES.EDITOR ? GAME_STATE = a : a == GAME_STATES.CHAT ? GAME_STATE = a : a == GAME_STATES.SPECTATE && (GAME_STATE = a) : GAME_STATE == GAME_STATES.EDITOR ? a == GAME_STATES.LOGIN ? GAME_STATE = a : a == GAME_STATES.GAME && (GAME_STATE = a) : GAME_STATE == GAME_STATES.CHAT ? a == GAME_STATES.LOGIN ? GAME_STATE = a : a ==
            GAME_STATES.GAME ? GAME_STATE = a : a == GAME_STATES.SPECTATE && (GAME_STATE = a) : GAME_STATE == GAME_STATES.SPECTATE && (a == GAME_STATES.LOGIN ? GAME_STATE = a : a == GAME_STATES.GAME ? GAME_STATE = a : a == GAME_STATES.CHAT && (GAME_STATE = a));
        if (b == GAME_STATE) throw "Unexpected transition from " + b + " to " + a;
    }
}
var img_hashes = "f61f376221c3fe1dea3f4bb8c39207f2 30b533254c058f47580c3124c2412d85 d2cabb3b664c5c76559f5b7b99e1dcba b5e9e0f058021a7bc8208462effe8004 81e225ef3de2f587fa7ab3896d21c506 6104be221062231a62b1e805d0185d28 854d8e1eb2ec3ea7258b6a2a5c8590e3 66d6d2f9ebcbccc5282b13f33b4a5c1c 7cc807d2c52911c282d6f78a8dad2827 6ba8a224ca9b35592b83141ca38c0f4c f97b4274c254b05f783fefb59698ce72 3057a94beb9dd4d9ac412e7a461c8c02 9a48a99c1061f629e4d0a28391c1b04c 1d83cd94fa15a0b7124db3c88dfc01f5 cb71f335f2a9e3584ce6ddbc56b2a187 cac748fa1467f15112ee0e261a0fec3b 3ab6c8f666bcd5c9d2ab66b054bc20ed 7f655fead6c6683c6b6c07b8f8ad1e35 95faece78ccfec7db3e0b54c65611642 1b389be5a4f135a351c31be20ce01b98 5854d7da153b2c835fc098eac13be60f bcab429c4d3e1c20c8056386d8586336 27eb993371945a463301adc6ad7cd910 9af1e2891a66be9eb9c2268853c3e6f3 fabe3225ba3102a699bc48cce8d47fd3 53a9bf4ecf690493fb4a762ad17eeba3 7a0bf86106cf9290fc58fd74793d2346 0f62ddbeca1ce3820f7e0afc33daeefd 6e6de2429c7f6b588b8c1b44c56540b7 f91d56e257d30c13036ded388e710f2d b5935341a8a9573bea672642886ca352 3a49127a54e8383ed92fcd22438e8a89 f568811d9caac7ba9049559e2c8a0ad7 c6fe6b90dea1ae0d769db4a17a98d6ff 21868fca75aea95ce3de83a8fb52790d a55dadc6afeb2aa6f7f675c9ce65bd94 1b8ae39652a8dbc0d68c55da7405f5e0 af0d495870cce42a7fcc9420bc3257dc b060b161c1709308a22acf16aa19d4c4 5a98089c5906eb4d729986654a44bdd5 046fd83a38d4d51c0344e0997dbc1e25 5a752e2831e214b8b37b07382ae16032 261b5b8a20c30ced8c4b69b4ffd4babf 41c4a2febfc8f5d8d83ab0fd24596009 8d2053508251f664978fddd66a511452 109f2318c4949c61c7b0d4528a000ca4 262ea93f911e987b4752325368d46b0c 23f643ed2eedaf4888332aa3cab05d4f f0f16227ea0bbbae57914e1be1630d6f 1f3bf253992e59db5c236cc30d2500d7 64ce9c6aa5d54388de5342d260724a96 720105a35ed72704984d919f2c027fdc caa47d194c8594c0863f885bef80907f 0e61c7d82c71cea72bd62f95df034831 b70ebe767506c93395e008aad79da474 725f75c3a590886de52856c8aaaf4f80 86f480841089c10b88d38bb42569b8e9 e56508210998bda5b80b7af067532f70 5328e6d86e5322cfc5f36076b921e861 efa41d9c23aa3099ddae209b64725331 8c95d91b6763300d00876ae58bc9e940 a6a6bbca6ac9b2dbc0423fda8058b9bd 940fb3b5b25aa23bb0b290a41667a956 2a7f52b7e43fff3b8120f6af0ca50974 063bb2721fe1d9295112d7b3d5491e67 54af90c139e7bbae8734d94e241640d2".split(" "),
    map_hashes =
    "b65deea76a5169c4c11335e1777965b6 c7c9a158a41f2e8e37afc91142249e3f 0736a3271d803f057c869f0353756eaf ee2c4a083b1ddeccf4fc8a3514b7d3a7 cba3c5f41df84f6f20de01a0cc664f09 45744ae468ff9db86b14aa50e5cab917 eeabccb91ae5ecdf8dbd7a61a44ace55 64b066023da0c4c48416e15078e59440 7c77c92622af0c3645576d61cb23d310 5304b2a1dc5765ebc944385d87265276 d720190ad51e557becae8512a830774c 9f7139877d12eb9bb10cbcbfb6f6a742 14d0173ce148da4706a75c4237173479 84d71f6d3816ccff13f47fc23e2c5660 75cae6daf23d653eaae015802667be2b a98e25d0d87ded6e31ef00639cda96fb 9a6a768119726c4c471fda040d9cef41 4af5347dbfd27b5e86afdf207f8580b0 7f9510e806508886f71e3d6f0abdafc9 4bbecd4c29b06bf86258e7e7b31bf184 ada32023deb823901430b13272ec3a76 e0ca77c49a0a8717e92d704dcbfc3ded 38796119f3fce6c409eaad92bb1fb357 fd386ee4254f568dc8ceba8fb362b76e 070fff9e353ec28a06e9fd580c2e2a2e 35a75709d485bc24d0beede1f6f723fc 396676c65afffda3d999b39cde608ad1 dd84e178fce80a847688225558869a8f ef9885fc33a11ba7b75212b8ba0ec52a 8ed62f91d09d0292a5274989dd03664d daba01e6e17c7bf4d405853c9ae5f2e5 bb6878a1d3864ae228c697dfcf49a661 92bcb751024800f02d19e804793710e9 d12432c5dd023d7ef581496a0d799f7a 8c41807add7cfe0561612ce3c2b8ffc7".split(" "),
    mod_version = "06478c1579312c3a1471f110d2b9c571",
    cdn_url = "https://data.mo.ee/",
    data_urls = ["https://rpg.mo.ee", "https://rpg-de.mo.ee", "https://rpg-ee.mo.ee", "https://rpg-de2.mo.ee"];
try {
    "1239889624.rsc.cdn77.org" == window.location.hostname ? cdn_url = "https://1239889624.rsc.cdn77.org/" : "data.mo.ee" == window.location.hostname ? cdn_url = "https://data.mo.ee/" : 1338 == config.http_port && (cdn_url = "", data_urls = [""])
} catch (e$$148) {}
for (var current_world = 0, world_login_force = 0, total_servers = 8, socket_url = void 0, fp = "", GAME_VERSION = "41", north_in_progress = !1, south_in_progress = !1, west_in_progress = !1, east_in_progress = !1, mouse_over_magic = !1, mouse_over_quiver = !1, vat = 1.2, minimap = !1, active_menu = -1, selected_skill = "health", selected_inv = 0, monster_target_id = -1, selected_shop = 0, shop_npc = 0, quest_master_npc = 0, shop_content = [], chat_blink = !1, chat_text = "", selected_chest = 0, chest_npc = 0, chest_content = [], chests = {}, chest_page = 1, maps = 35, no_render = !1, first_login = !0, quiet_mod_load = !1, skill_xp_effects = !0, dpad_allowed = !0, other_pets_visible = !0, double_xp_timer = 0, ignore_inventory_full = !1, player_quests = [{
            progress: 0,
            quest_id: 0,
            reward_result: 0
        }], map_names = "Dorpat;Dungeon I;Narwa;Whiland;Reval;Rakblood;Blood River;Hell;Clouds;Heaven;Cesis;Walco;Tutorial Island;Pernau;Fellin;Dragon's Lair;No Man's Land;Ancient Dungeon;Lost Woods;Minigames;Broceliande Forest;Devil's Triangle;Cathedral;Illusion Guild;Every Man's Land;Moche I;Wittensten;Dungeon II;Dungeon III;Dungeon IV;Moche II;Void I;Nature Tower;Ice Tower;Fire Tower".split(";"),
        map_music = {}, map_music_files = {
            0: {
                file: "level0",
                pack: 1
            },
            1: {
                file: "level1",
                pack: 1
            },
            2: {
                file: "level2",
                pack: 1
            },
            3: {
                file: "level3",
                pack: 1
            },
            4: {
                file: "level4",
                pack: 1
            },
            5: {
                file: "level5",
                pack: 1
            },
            6: {
                file: "level6",
                pack: 1
            },
            7: {
                file: "level7",
                pack: 1
            },
            8: {
                file: "level8",
                pack: 1
            },
            9: {
                file: "level9",
                pack: 1
            },
            10: {
                file: "level10",
                pack: 1
            },
            11: {
                file: "level11",
                pack: 1
            },
            12: {
                file: "level12",
                pack: 1
            },
            13: {
                file: "level13",
                pack: 1
            },
            14: {
                file: "level14",
                pack: 1
            },
            15: {
                file: "level15",
                pack: 1
            },
            16: {
                file: "level16",
                pack: 1
            },
            17: {
                file: "level17",
                pack: 1
            },
            18: {
                file: "level18",
                pack: 2
            },
            19: {
                file: "level19",
                pack: 2
            },
            20: {
                file: "level20",
                pack: 2
            },
            21: {
                file: "level21",
                pack: 2
            },
            22: {
                file: "level22",
                pack: 2
            },
            23: {
                file: "level23",
                pack: 2
            },
            24: {
                file: "level24",
                pack: 2
            },
            25: {
                file: "level25",
                pack: 2
            },
            26: {
                file: "level26",
                pack: 2
            },
            27: {
                file: "level1",
                pack: 1
            },
            28: {
                file: "level1",
                pack: 1
            },
            29: {
                file: "level1",
                pack: 1
            },
            30: {
                file: "level25",
                pack: 2
            },
            31: {
                file: "level22",
                pack: 2
            },
            32: {
                file: "level23",
                pack: 2
            },
            33: {
                file: "level2",
                pack: 1
            },
            34: {
                file: "level7",
                pack: 1
            },
            100: {
                file: "level100",
                pack: 1
            },
            101: {
                file: "level100",
                pack: 1
            },
            102: {
                file: "level100",
                pack: 1
            },
            103: {
                file: "level100",
                pack: 1
            },
            104: {
                file: "level100",
                pack: 1
            },
            105: {
                file: "level100",
                pack: 1
            },
            106: {
                file: "level100",
                pack: 1
            },
            107: {
                file: "level100",
                pack: 1
            },
            108: {
                file: "level100",
                pack: 1
            },
            109: {
                file: "level100",
                pack: 1
            },
            110: {
                file: "level100",
                pack: 1
            },
            111: {
                file: "level100",
                pack: 1
            },
            112: {
                file: "level100",
                pack: 1
            },
            113: {
                file: "level100",
                pack: 1
            },
            114: {
                file: "level100",
                pack: 1
            },
            115: {
                file: "level100",
                pack: 1
            },
            116: {
                file: "level100",
                pack: 1
            },
            117: {
                file: "level100",
                pack: 1
            },
            118: {
                file: "level100",
                pack: 1
            },
            119: {
                file: "level100",
                pack: 1
            },
            120: {
                file: "level120",
                pack: 1
            },
            121: {
                file: "level120",
                pack: 1
            },
            122: {
                file: "level120",
                pack: 1
            },
            123: {
                file: "level120",
                pack: 1
            },
            124: {
                file: "level120",
                pack: 1
            },
            125: {
                file: "level120",
                pack: 1
            },
            126: {
                file: "level120",
                pack: 1
            },
            127: {
                file: "level120",
                pack: 1
            },
            128: {
                file: "level120",
                pack: 1
            },
            129: {
                file: "level120",
                pack: 1
            },
            130: {
                file: "level120",
                pack: 1
            },
            300: {
                file: "level12",
                pack: 1
            },
            estonia: {
                file: "estonia",
                pack: 1
            }
        }, sound_effects = {}, sound_effect_files = {
            eat: "eat",
            drink: "drinking_potion",
            make_potion: "make_potion",
            cut_gem: "cut_gem",
            cook: "cook",
            woodcut: "woodcut",
            mine: "mine",
            hit: "hit",
            miss: "miss",
            hurt: "hurt",
            hurt_female: "hurt_female",
            teleport: "teleport",
            fish: "fishing",
            carpentry: "carpentry",
            death: "suspense",
            forge: "forge",
            smelt: "smelt",
            notification: "notification",
            rake: "rake",
            dig: "dig",
            archery: "archery",
            fletching: "fletching",
            level_up: "levelup"
        }, admin_initialized = !1, mod_initialized = !1, chat_mod_initialized = !1, current_map = 0, map_json = [], on_map_json = [], map_graphs = {}, node_graphs = {}, i = 0; i < maps; i++) map_graphs[i] = [];
var map_change_in_progress = !1,
    forge_selected = !1,
    captcha = !1,
    captcha_interval = 0,
    captcha_timeout = 180,
    market_results = [],
    touch_hold = !1,
    touch_hold_atk = !1,
    touch_hold_i = 0,
    touch_hold_j = 0,
    last_mos_balance = 0,
    minimum_duelling_level = 30,
    duelling_accept = "",
    duelling_confirm = "",
    building_mode_enabled = !1,
    server_time_delta = 0,
    last_my_text = "";
player_map = [];
for (var auto_connect = !0, spectator_mode = !1, last_screenshot = 0, active_channel = !1, active_channel_first = !0, translator_lang = !1, channel_names = "{M} $$ 18 AR BG BR CS DA DE EL EN E2 E3 E4 E5 E6 E7 E8 E9 ES ET FI FR HI HR HU ID IT JA KO LT LV NL NO PL PT RO RU SV TH TR TW UK VI ZH".split(" "), channel_names_ordered = "EN $$ 18 {M} BR ZH DE TW FR RU ES IT E9 E2 PL E3 SV E5 FI E7 E8 E4 TR E6 AR NL KO RO ET TH HU PT NO JA CS VI DA ID UK BG EL HR HI LT LV".split(" "), channel_names_positions = {}, i = 0; i < channel_names_ordered.length; i++) channel_names_positions[channel_names_ordered[i]] =
    i;
var channel_descriptions = {
        18: "Mature English",
        AR: "Arabic",
        BG: "Bulgarian",
        BR: "Portuguese",
        CS: "Czech",
        DA: "Danish",
        DE: "German",
        EL: "Greek",
        EN: "English",
        E2: "English 2",
        E3: "English 3",
        E4: "English 4",
        E5: "English 5",
        E6: "English 6",
        E7: "English 7",
        E8: "English 8",
        E9: "English 9",
        ES: "Spanish",
        ET: "Estonian",
        FI: "Finnish",
        FR: "French",
        HI: "Hindi",
        HR: "Croatian",
        HU: "Hungarian",
        ID: "Indonesian",
        IT: "Italian",
        JA: "Japanese",
        KO: "Korean",
        LT: "Lithuanian",
        LV: "Latvian",
        NL: "Dutch",
        NO: "Norwegian",
        PL: "Polish",
        PT: "Portuguese",
        RO: "Romanian",
        RU: "Russian",
        SV: "Swedish",
        TH: "Thai",
        TR: "Turkish",
        TW: "Taiwanese",
        UK: "Ukrainian",
        VI: "Vietnamese",
        ZH: "Chinese",
        "{M}": "Moderators",
        $$: "Market chat"
    },
    teleport_locations = {
        Dorpat: {
            to_map: 0,
            to_i: 23,
            to_j: 18,
            radius: 12
        },
        "Moche I": {
            to_map: 25,
            to_i: 48,
            to_j: 64,
            radius: 10
        },
        Narwa: {
            to_map: 2,
            to_i: 68,
            to_j: 37,
            radius: 6
        },
        Whiland: {
            to_map: 3,
            to_i: 29,
            to_j: 93,
            radius: 5
        },
        Reval: {
            to_map: 4,
            to_i: 17,
            to_j: 29,
            radius: 5
        },
        Rakblood: {
            to_map: 5,
            to_i: 34,
            to_j: 68,
            radius: 6
        },
        "Blood River": {
            to_map: 6,
            to_i: 38,
            to_j: 86,
            radius: 7
        },
        Hell: {
            to_map: 7,
            to_i: 31,
            to_j: 20,
            radius: 7
        },
        Clouds: {
            to_map: 8,
            to_i: 61,
            to_j: 74,
            radius: 6
        },
        Heaven: {
            to_map: 9,
            to_i: 59,
            to_j: 17,
            radius: 8
        },
        Cesis: {
            to_map: 10,
            to_i: 58,
            to_j: 64,
            radius: 10
        },
        Walco: {
            to_map: 11,
            to_i: 22,
            to_j: 30,
            radius: 6
        },
        Fellin: {
            to_map: 14,
            to_i: 68,
            to_j: 28,
            radius: 6
        },
        "Dragon's Lair": {
            to_map: 15,
            to_i: 49,
            to_j: 45,
            radius: 8
        },
        "Ancient Dungeon": {
            to_map: 17,
            to_i: 46,
            to_j: 89,
            radius: 5
        },
        "Broceliande Forest": {
            to_map: 20,
            to_i: 55,
            to_j: 72,
            radius: 8
        },
        Wittensten: {
            to_map: 26,
            to_i: 67,
            to_j: 51,
            radius: 6
        },
        "Dungeon IV": {
            to_map: 29,
            to_i: 87,
            to_j: 69,
            radius: 8
        },
        "Void I": {
            to_map: 31,
            to_i: 41,
            to_j: 18,
            radius: 6
        }
    },
    secret_boss_scroll_locations = {
        "Cannibal Plant": {
            to_map: 24,
            to_i: 71,
            to_j: 74
        },
        "Nephilim Warrior": {
            to_map: 24,
            to_i: 78,
            to_j: 74
        },
        "Ancient Hydra": {
            to_map: 24,
            to_i: 85,
            to_j: 74
        }
    },
    premium_text = "$ti('Access to US based server - faster connection')[break]$ti('Less players in premium world - less competition to kill bosses or other mobs')[break]$ti('Daily login reward wont be resetted when you miss a day.')[break]$ti('Write in light blue text instead of white')[break]$ti('Own a private channel')[break]$ti('Supporting the game!') :)";
"undefined" == typeof JSON.clone && (module.exports = {
    maps: maps,
    version: GAME_VERSION
});
var swear_regexes = {
        EN: /(asshole|ass hole|bitch|blowjob|cunt|dickface|dildo|dumbshit|dumb ass|dumbass|faggot|fuck|handjob|hand job|jerkoff|jerk off|nigga|nigger|penis|prick|pussy|queer|shit|sh1t|slut|twat|vagina|wank|whore|nazi|hitler)/gi
    },
    webkit_version = parseInt(getParameterByName("node-webkit-api")),
    isBlurred = !1;
if (1 <= webkit_version) {
    var paypalLink = function() {
            var a = document.getElementById("paypal_form"),
                b = a.action + "?",
                d = [],
                e;
            for (e in a.childNodes) {
                var f = a.childNodes[e];
                f.name && f.value && d.push(f.name + "=" + encodeURIComponent(f.value))
            }
            b += d.join("&");
            createExternalLink(b)()
        },
        supportExternalLinks = function(a) {
            function b(f) {
                "a" === f.nodeName.toLowerCase() && (d = f.getAttribute("href")) && /http/.test(d) && (e = !0);
                d && e ? (createExternalLink(d)(), a.preventDefault()) : f.parentElement && b(f.parentElement)
            }
            var d, e = !1;
            b(a.target)
        },
        useExternalBrowserLinks = function(a) {
            a = a.getElementsByTagName("a");
            for (var b in a) "_blank" == a[b].target && a[b].href && (a[b].onclick = createExternalLink(a[b].href))
        },
        setBrowserWindowSize = function(a, b) {
            gui.Window.get().resizeTo(parseInt(a), parseInt(b))
        },
        setZoomLevel = function(a) {
            gui.Window.get().zoomLevel = a;
            localStorage.zoomlevel = a
        },
        createExternalLink = function(a) {
            return "linux" == process.platform ? function(b) {
                require("child_process").spawn("xdg-open", [a]);
                b && b.preventDefault()
            } : function(b) {
                gui.Shell.openExternal(a);
                b && b.preventDefault()
            }
        },
        takeScreenshot = function() {
            function a(a) {
                var b = require("nw.gui").Window.get();
                width = parseInt(b.window.wrapper.style.width);
                height = parseInt(b.window.wrapper.style.height);
                setTimeout(function() {
                    b.capturePage(function(b) {
                        b = b.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                        require("fs").writeFile(a + "/screenshots/" + secondstamp() + ".png", b, "base64", function(a) {
                            a && Popup.dialog("Cannot save a screenshot!")
                        })
                    }, "png")
                }, 500)
            }
            var b = require("path"),
                d = require("fs"),
                b = b.dirname(process.execPath);
            d.existsSync(b + "/screenshots") ? a(b) : (d.mkdirSync(b + "/screenshots", 502, function(a) {
                a && Popup.dialog("Cannot create screenshots directroy!")
            }), setTimeout(function() {
                "Cannot create screenshots directroy!" != Popup.active_popup_text && takeScreenshot()
            }, 500))
        };
    try {
        observeElement(document, "checksum", function(a) {
            a = a.detail;
            var b = localStorage.last_cache_clean || 0;
            a && a.version > release_version && a.checksum != release_checksum && 3E5 < timestamp() - b && (a = require("nw.gui"), localStorage.last_cache_clean = timestamp(), a.App.clearCache(),
                window.location.reload())
        });
        var gui = require("nw.gui"),
            win = gui.Window.get();
        win.on("focus", function() {
            pageVisible()
        });
        win.on("restore", function() {
            pageVisible()
        });
        win.on("minimize", function() {
            pageHidden()
        });
        win.on("blur", function() {
            isBlurred = !0
        })
    } catch (e$$152) {}
    gui = require("nw.gui")
}
var alternative_login_function = function() {
        real_login_function()
    },
    real_login_function = function() {
        removeClass(document.getElementById("login_box"), "hidden");
        document.getElementById("donation_button").style.display = "none";
        document.getElementById("spectate_button").style.display = "block"
    };

function showResetPassword() {
    addClass(document.getElementById("login_box"), "hidden");
    removeClass(document.getElementById("reset_password_box"), "hidden")
}

function showResetPasswordForm(a, b) {
    addClass(document.getElementById("login_box"), "hidden");
    document.getElementById("reset_password_form_email");
    removeClass(document.getElementById("reset_password_form_box"), "hidden")
}
var using_alternate_login = !1,
    external_library_loaded = !0,
    show_donations = !1;
if ("kongregate" == getParameterByName("inapp")) {
    external_library_loaded = !1;
    kongregate = {
        payments: !1,
        sessionid: ""
    };
    var kongregate_url = "https://www.kongregate.com/javascripts/kongregate_api.js";
    LazyLoad.js(kongregate_url, function() {
        "undefined" != typeof kongregateAPI ? kongregateAPI.loadAPI(function() {
            kongregate.api = kongregateAPI.getAPI();
            var a = function() {
                using_alternate_login = external_library_loaded = !0;
                kongregate.user_id = kongregate.api.services.getUserId();
                kongregate.user_name = kongregate.api.services.getUsername();
                kongregate.token = kongregate.api.services.getGameAuthToken();
                kongregate.payments = !0;
                kongregate.friends = [];
                kongregate.ignores = [];
                alternative_login_function = function() {
                    var a = setInterval(function() {
                        1 == socket_status && finishedLoading && (do_login(kongregate.user_name, kongregate.user_id, "kongregate", kongregate.token), clearInterval(a))
                    }, 100)
                }
            };
            if (kongregate.api.services.isGuest()) {
                kongregate.api.services.showRegistrationBox();
                var b = setInterval(function() {
                    kongregate.api.services.isGuest() ? (addClass(document.getElementById("loading_box"),
                        "hidden"), Popup.dialog("You need to be logged into Kongregate to start playing!", function() {
                        kongregate.api.services.showRegistrationBox()
                    })) : (Popup.dialog_close(), a(), clearInterval(b))
                }, 1E3)
            } else a()
        }) : external_library_loaded = !0
    })
} else if ("steam" == getParameterByName("inapp")) window.addEventListener("load", function() {
    function a() {
        var b = document.getElementById("forceRefreshCanvas");
        b.getContext("2d").clearRect(0, 0, b.width, b.height);
        window.requestAnimationFrame(a)
    }
    var b = document.createElement("canvas");
    b.id = "forceRefreshCanvas";
    b.width = 1;
    b.height = 1;
    b.style.width = "1px";
    b.style.height = "1px";
    document.body.appendChild(b);
    a()
});
else if ("facebook" == getParameterByName("inapp")) window.fbAsyncInit = function() {
        document.getElementById("fb-login-button").style.display = "block";
        window.fbStatusChangeCallback = function(a) {
            "connected" === a.status && FB.api("/me", function(b) {
                do_login(b.first_name.toLowerCase().trim() + b.id.substr(b.id.length - 5), b.id, "facebook", a.authResponse.accessToken)
            })
        };
        FB.init({
            appId: config.facebook_app_id,
            xfbml: !0,
            version: "v2.1"
        })
    },
    function(a, b, d) {
        var e = a.getElementsByTagName(b)[0];
        a.getElementById(d) || (a = a.createElement(b), a.id = d, a.src = "//connect.facebook.net/en_US/sdk.js", e.parentNode.insertBefore(a, e))
    }(document, "script", "facebook-jssdk");
else if (0 < getParameterByName("kongregate_username").length) localStorage.kongregate = JSON.stringify({
    user: getParameterByName("kongregate_username")
});
else if (0 < getParameterByName("NewgroundsAPI_UserName").length) {
    var using_alternate_login = !0,
        user_name = getParameterByName("NewgroundsAPI_UserName"),
        session_id = getParameterByName("NewgroundsAPI_SessionID"),
        provider = "newgrounds",
        alternative_login_function = function() {
            Popup.prompt("Use your Newgrounds account '" + user_name + "' to login?", function() {
                var a = setInterval(function() {
                    1 == socket_status && finishedLoading && (do_login(user_name, session_id, provider), clearInterval(a))
                }, 100)
            }, real_login_function)
        };
    localStorage.newgrounds = JSON.stringify({
        user: getParameterByName("NewgroundsAPI_UserName")
    })
} else if ("gamescom" == getParameterByName("inapp")) {
    external_library_loaded = !1;
    gamescom = {
        payments: !1,
        sessionid: "",
        access_token: getHashParameterByName("accessToken")
    };
    var gamescom_url = "https://s.aolcdn.com/gamesdevcenter/sdk/v2/GamesSDK.min.js";
    LazyLoad.js(gamescom_url, function() {
        "undefined" != typeof GAMESAPI ? (GAMESAPI.setGameSecret(config.gamescom_game_secret), GAMESAPI.beginGameSession(function(a) {
            if (200 == a.statusCode && "Ok" == a.statusText && a.data && a.data.playerInfo && !a.data.playerInfo.isGuest) {
                var b = a.data.playerInfo.gamerHandle,
                    d = a.data.playerInfo.playerId;
                gamescom.payments = !0;
                gamescom.sessionid = d;
                gamescom.user_name = a.data.playerInfo.gamerHandle;
                using_alternate_login = !0;
                alternative_login_function = function() {
                    Popup.prompt("Use your Games.com account '" + b + "' to login?", function() {
                        var a = setInterval(function() {
                            1 == socket_status && finishedLoading && (do_login(b, d, "games.com", gamescom.access_token), clearInterval(a))
                        }, 100)
                    }, real_login_function)
                }
            }
            external_library_loaded = !0
        }), setTimeout(function() {
            external_library_loaded = !0
        }, 5E3)) : external_library_loaded = !0
    })
} else "1321" == getParameterByName("gid") &&
    (mocospace = {
        provider: "mocospace"
    }, mocospace.sessionid = getParameterByName("accessToken"), mocospace.user_name = getParameterByName("displayName"), alternative_login_function = function() {
        Popup.prompt("Use your MocoSpace account '" + mocospace.user_name + "' to login?", function() {
            var a = setInterval(function() {
                1 == socket_status && finishedLoading && (do_login(mocospace.user_name, mocospace.sessionid, mocospace.provider), clearInterval(a))
            }, 100)
        }, real_login_function)
    }, external_library_loaded = using_alternate_login = !0, LazyLoad.js("https://imgmocospace-a.akamaihd.net/wk/js/opensocial/opensocial.js",
        function() {
            "undefined" != typeof MocoSpace && (document.getElementById("donation_button_link").onclick = function() {
                WebPayment.open_mocospace()
            }, document.getElementById("mos_market_link").onclick = function() {
                WebPayment.open_mocospace()
            })
        }));
var map = [],
    on_map = [],
    maps_loaded = {
        0: !0
    },
    online_players = {},
    socket_io_loaded = !1;
/me|org|ee|net|com/.test(window.location.hostname) || (socket_url = void 0);
"WebSocket" in window || "undefined" == typeof socket_url || (socket_url += ":" + config.http_port);
"https:" == window.location.protocol && (socket_url = "https://rpg-de.mo.ee");
LazyLoad.js((socket_url ? socket_url : "") + "/socket.io/socket.io.js", function() {
    socket_io_loaded = !0;
    ServerList.socket_ready()
});

function mobileDevice() {
    return /Android|iPhone|iPad|Mobile|Tablet|Blackberry|WebOS/.test(navigator.userAgent)
}

function modsSupported() {
    return !0
}
var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? !0 : !1,
    Android = navigator.userAgent.match(/(Android)/i) ? !0 : !1;
"android" == getParameterByName("inapp") && (Android = !1);
var lastTap = 0;
mobileDevice() && (document.title = "RPG MO");
document.createElement("canvas").getContext || alert("To play this game you need a browser with canvas support!");
var supports = {};
supports.datalist = !(!document.createElement("datalist") || !window.HTMLDataListElement);
var touch_initialized = !1,
    initialize_touch = function() {
        touch_initialized || (touch_initialized = localStorage.has_touch_screen = !0, setCanvasSize(), removeClass(document.getElementById("settings_dpad"), "hidden"), document.getElementById("settings_dpad").style.display = "block");
        touch_initialized && (GAME_STATE != GAME_STATES.LOGIN && GAME_STATE != GAME_STATES.SPECTATE && dpad_allowed ? (document.getElementById("gamepad").style.display = "block", loadSpecificImage("gamepad"), 16 == players[0].map || 24 == players[0].map || players[0].params.pvp ||
            Player.has_bow(players[0]) && Player.has_arrows(players[0]) ? (document.getElementById("atk_button").style.display = "block", loadSpecificImage("atk_button")) : document.getElementById("atk_button").style.display = "none") : (document.getElementById("gamepad").style.display = "none", document.getElementById("atk_button").style.display = "none"))
    },
    left_click_cancel = !1,
    max_scale = parseFloat(localStorage.max_scale) || 1.5,
    map_increase = parseInt(localStorage.map_increase) || (mobileDevice() ? 2 : 4);
"undefined" !== typeof localStorage.center_screen && (Fullscreen.center_screen = "true" === localStorage.center_screen);
var touch_x, touch_y, touch_last_x, touch_last_y;
window.requestAnimFrame = function(a) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
        window.setTimeout(a, 1E3 / 60)
    }
}();

function initializeNews(a) {
    if (!(768 > (0 < window.innerWidth ? window.innerWidth : screen.width))) {
        base = a ? "https://mo.mo.ee/news.json?t=" : "https://rpg-de.mo.ee/news?t=";
        var b = base + timestamp();
        loadJSON(b, function(a) {
            var b = document.getElementById("news"),
                f;
            for (f in a)
                if (a[f] && a[f].title) {
                    var g = document.createElement("div");
                    addClass(g, "news_item");
                    var h = document.createElement("span");
                    h.innerHTML = a[f].title;
                    addClass(h, "title");
                    addClass(h, "scrolling_allowed");
                    var l = a[f].link;
                    h.rel = l;
                    h.onclick = function() {
                        window.open(this.rel,
                            "_blank")
                    };
                    g.appendChild(h);
                    h = document.createElement("span");
                    h.innerHTML = a[f].date;
                    addClass(h, "date");
                    addClass(h, "scrolling_allowed");
                    g.appendChild(h);
                    h = document.createElement("span");
                    addClass(h, "content");
                    addClass(h, "scrolling_allowed");
                    h.innerHTML = a[f].content;
                    h.rel = l;
                    h.onclick = function() {
                        window.open(this.rel, "_blank")
                    };
                    g.appendChild(h);
                    b.appendChild(g)
                }
        }, function() {
            a || initializeNews(!0)
        })
    }
}
var isActive = !0;

function pageVisible() {
    SpectateWindow.active || (updateBase(), setTimeout(function() {
        Chat.resync()
    }, 500), isActive = !0, isBlurred = !1)
}

function pageHidden() {
    touch_hold_j = touch_hold_i = 0;
    isActive = touch_hold = !1
}
window.onorientationchange = function() {
    noRender()
};
var width = 854,
    height = 480,
    framelimit_delta = 0,
    settings = {
        framelimit: !1
    },
    tile_width = 54,
    half_tile_width = Math.floor(tile_width / 2),
    half_tile_width_round = Math.round(tile_width / 2),
    tile_height = 27,
    half_tile_height = Math.floor(tile_height / 2),
    half_tile_height_round = Math.round(tile_height / 2),
    dest_x = 0 + Math.round(tile_height / 2),
    dest_y = 144 + tile_width,
    dx = 13,
    dy = 13,
    output = "Hello!",
    canvas, c = [],
    ctx = [],
    animation_timestamps = {},
    wrapper, side, side_bottom, menu, selected = {
        i: null,
        j: null
    },
    last_updated = {},
    chat_history = [],
    selected_object = {},
    loading_language = !1,
    tile_count = 0,
    object_count = 0;
map_export = function() {
    for (var a in map_) return a
};
var game_timestamp = {};
game_timestamp.init = timestamp();
window.onload = function() {
    try {
        premium = "true" == localStorage.premium || !1
    } catch (a) {}
    initHandlebars();
    ServerList.fetch();
    imagesTotal = JSON.count(IMAGE_SHEET) / 2;
    game_timestamp.onload = timestamp();
    SpectateWindow.onload();
    start_loading();
    initializeNews();
    Chat.max_chat_history = isMobile() ? 100 : 200;
    1338 == config.http_port && "function" == typeof initDev && initDev();
    "undefined" !== typeof localStorage.skill_xp_effects && (skill_xp_effects = "true" == localStorage.skill_xp_effects, Player.set_skill_xp_effects_text(skill_xp_effects));
    "undefined" !== typeof localStorage.dpad_allowed && (dpad_allowed = "true" == localStorage.dpad_allowed, Player.set_dpad_text(dpad_allowed));
    "undefined" !== typeof localStorage.other_pets && (other_pets_visible = "true" == localStorage.other_pets, Player.set_other_pets_text(other_pets_visible))
};

function start_loading() {
    document.addEventListener("keydown", function(a) {
        var b = !1;
        lastController = "keyboard";
        var d = a.srcElement || a.target;
        if (8 === a.keyCode || 27 === a.keyCode) b = "INPUT" === d.tagName.toUpperCase() && ("TEXT" === d.type.toUpperCase() || "PASSWORD" === d.type.toUpperCase() || "NUMBER" === d.type.toUpperCase() || "EMAIL" === d.type.toUpperCase()) || "TEXTAREA" === d.tagName.toUpperCase() ? d.readOnly || d.disabled : !0;
        if (b) return a.preventDefault(), !1;
        if (("INPUT" !== d.tagName.toUpperCase() || "TEXT" !== d.type.toUpperCase() &&
                "PASSWORD" !== d.type.toUpperCase() && "NUMBER" !== d.type.toUpperCase() && "EMAIL" !== d.type.toUpperCase()) && "TEXTAREA" !== d.tagName.toUpperCase() && "SELECT" !== d.tagName.toUpperCase()) switch (keyMap.action(a)) {
            case KEY_ACTION.UP:
                touch_hold_i = 0;
                touch_hold_j = 1;
                touch_hold = !0;
                break;
            case KEY_ACTION.RIGHT:
                touch_hold_i = 1;
                touch_hold_j = 0;
                touch_hold = !0;
                break;
            case KEY_ACTION.DOWN:
                touch_hold_i = 0;
                touch_hold_j = -1;
                touch_hold = !0;
                break;
            case KEY_ACTION.LEFT:
                touch_hold_i = -1;
                touch_hold_j = 0;
                touch_hold = !0;
                break;
            case KEY_ACTION.ACTIVATE_ATTACK:
                touch_hold_atk = !0
        }
    });
    declareVariablesFromDOM();
    window.onresize = function() {
        setCanvasSize(!0)
    };
    Fullscreen.add_listeners();
    window.addEventListener("storage", function(a) {
        2 == socket_status && "active_user" == a.key && players[0].name != a.newValue && user != a.newValue && (socket.disconnect(), auto_connect = !1, setTimeout(function() {
            socket.socket.reconnect()
        }, 1E3), addChatText(_te("Multilogin prevented! Trading between accounts is forbidden."), !1, COLOR.TEAL))
    }, !1);
    window.onbeforeunload = function(a) {
        Translate.external_window && Translate.external_window.close();
        if (!(2 != socket_status || -1 < ["1", "gamescom", "kongregate", "steam"].indexOf(getParameterByName("inapp")))) {
            var b = ["Leaving so soon? Don't forget to like us on Facebook!", "Leaving so soon? Don't forget to tell your friends about RPG MO!", "Leaving so soon? Help us by buying items from MOS shop, donations keep us going.", "Leaving so soon? Don't forget to follow us on Twitter @RPGMO."],
                b = b[Math.floor(b.length * Math.random())];
            if ("" != getParameterByName("hackernews"))
                if (3E5 < timestamp() - game_timestamp.finished) b =
                    "Thank you for showing interest in our game! Upvoting on HN would really help us :)";
                else return;
                "undefined" == typeof a && (a = window.event);
            a && (a.returnValue = b);
            return b
        }
    };
    document.addEventListener("keyup", function(a) {
        lastController = "keyboard";
        var b = !1,
            d = a.charCode || a.keyCode;
        if (GAME_STATE != GAME_STATES.CHAT && a.altKey && 49 <= d && 57 >= d) Chat.tab_click(d - 49);
        else {
            switch (keyMap.action(a)) {
                case KEY_ACTION.TAKE_SCREENSHOT:
                    "undefined" == typeof greenworks && "function" == typeof takeScreenshot && 1500 < timestamp() - last_screenshot &&
                        (last_screenshot = timestamp(), takeScreenshot());
                    break;
                case KEY_ACTION.TOGGLE_EDITOR:
                    players[0].permissions == PERMISSIONS.ADMIN && "undefined" != typeof Editor && Editor.toggle();
                    break;
                case KEY_ACTION.START_CHAT_SPECTATE:
                    SpectateWindow.player && ChatSystem.toggle();
                    break;
                case KEY_ACTION.NEXT_WHIPSER_TARGET:
                    Chat.whisper_target(1);
                    break;
                case KEY_ACTION.PREVIOUS_WHIPSER_TARGET:
                    Chat.whisper_target(-1);
                    break;
                case KEY_ACTION.START_CHAT:
                    ChatSystem.toggle();
                    touch_hold_j = touch_hold_i = 0;
                    touch_hold = !1;
                    break;
                case KEY_ACTION.HIDE_IFRAME:
                    SpectateWindow.slave &&
                        SpectateWindow.sendMessage({
                            action: "hide_iframe"
                        });
                    break;
                case KEY_ACTION.START_CHAT_SLASH:
                    ChatSystem.toggle();
                    touch_hold_j = touch_hold_i = 0;
                    touch_hold = !1;
                    document.getElementById("my_text").value = "/";
                    document.getElementById("my_text").selectionStart = 1;
                    document.getElementById("my_text").selectionEnd = 1;
                    document.getElementById("my_text").focus();
                    break;
                case KEY_ACTION.BROWSER_BACK:
                    if (document.activeElement && ("number" == document.activeElement.type || "text" == document.activeElement.type || "email" == document.activeElement.type)) return !0;
                    b = !0;
                    break;
                case KEY_ACTION.SWITCH_LANGUAGE_UP:
                    b = !0;
                    document.getElementById("current_channel").selectedIndex = Math.max(0, document.getElementById("current_channel").selectedIndex - 1);
                    Chat.changed_channel();
                    break;
                case KEY_ACTION.SWITCH_LANGUAGE_DOWN:
                    b = !0;
                    document.getElementById("current_channel").selectedIndex = Math.min(document.getElementById("current_channel").length - 1, document.getElementById("current_channel").selectedIndex + 1);
                    Chat.changed_channel();
                    break;
                case KEY_ACTION.SEND_CHAT:
                    var d = document.getElementById("my_text").value,
                        e = document.getElementById("current_channel").value;
                    if (Chat.has_client_command(d)) {
                        if (SpectateWindow.slave) return ChatSystem.toggle(), setTimeout(function() {
                            setCanvasSize(!1)
                        }, 1E3), SpectateWindow.sendMessage({
                            action: "chat",
                            data: d,
                            lang: e
                        });
                        ChatSystem.toggle();
                        setTimeout(function() {
                            setCanvasSize(!1)
                        }, 1E3);
                        Chat.execute_client_command(d);
                        return
                    }
                    if ("/" == d[0] || "/" != d.trim()[0]) d = d.trim();
                    var f = "$$ EN E2 E3 E4 E5 E6 E7 E8 E9".split(" ");
                    d.filterChat(e) != d ? Popup.dialog(_te("Your text contained a bad word and was blocked, swearing is prohibited in this channel."),
                            null_function) : 3 < d.length && "/" != d[0] && 0 <= f.indexOf(e) && .5 <= d.uppercasePercentage() ? Popup.dialog(_te("Your text contained too much CAPS, we do not tolerate spam."), null_function) : 3 < d.length && "/" != d[0] && 0 <= f.indexOf(e) && .5 <= d.symbolPercentage() ? Popup.dialog(_te("Your text contained too many symbols, we do not tolerate spam."), null_function) : 3 < d.length && "/" != d[0] && 6 <= d.longestStreak() ? Popup.dialog(_te("Your text contained too many same characters in a row, we do not tolerate spam."), null_function) : 0 <
                        d.length && "/" != d[0] && 0 <= f.indexOf(e) && d == last_my_text ? Popup.dialog(_te("You already sent the same text, we do not tolerate spam."), null_function) : SpectateWindow.slave ? SpectateWindow.sendMessage({
                            action: "chat",
                            data: d,
                            lang: e
                        }) : Socket.send("message", {
                            data: d,
                            lang: e
                        });
                    12 == current_map && (Chat.filter_enabled(Chat.tab, "chat") || ChatSystem.filter_toggle("chat"));
                    0 <= f.indexOf(e) && (last_my_text = d);
                    ChatSystem.toggle();
                    setTimeout(function() {
                        setCanvasSize(!1)
                    }, 1E3);
                    break;
                case KEY_ACTION.CANCEL_CHAT:
                    ChatSystem.toggle();
                    setTimeout(function() {
                        setCanvasSize(!1)
                    }, 1E3);
                    break;
                case KEY_ACTION.LOGIN:
                    if (SpectateWindow.slave) return;
                    do_login(document.getElementById("login_user").value, document.getElementById("login_pass").value);
                    setTimeout(function() {
                        setCanvasSize(!1)
                    }, 1E3);
                    break;
                case KEY_ACTION.MAGIC_0:
                    Player.client_use_magic(0, !0);
                    break;
                case KEY_ACTION.MAGIC_1:
                    Player.client_use_magic(1, !0);
                    break;
                case KEY_ACTION.MAGIC_2:
                    Player.client_use_magic(2, !0);
                    break;
                case KEY_ACTION.MAGIC_3:
                    Player.client_use_magic(3, !0);
                    break;
                case KEY_ACTION.MAGIC_4:
                    Player.client_use_magic(4, !0);
                    break;
                case KEY_ACTION.UP:
                case KEY_ACTION.DOWN:
                case KEY_ACTION.LEFT:
                case KEY_ACTION.RIGHT:
                    touch_hold = !1;
                    break;
                case KEY_ACTION.ACTIVATE_ATTACK:
                    touch_hold_atk = !1;
                    break;
                case KEY_ACTION.TOGGLE_MINIMAP:
                    editor_enabled && Editor.toggle_minimap();
                    break;
                case KEY_ACTION.EDITOR_GROUND_TILES:
                    editor_enabled && Editor.ground_tiles();
                    break;
                case KEY_ACTION.EDITOR_OBJECT_TILES:
                    editor_enabled && Editor.object_tiles();
                    break;
                case KEY_ACTION.EDITOR_NPC_TILES:
                    editor_enabled && Editor.npc_tiles();
                    break;
                case KEY_ACTION.EDITOR_TILESHEET_PREV:
                    editor_enabled &&
                        Editor.previous_page();
                    break;
                case KEY_ACTION.EDITOR_TILESHEET_NEXT:
                    editor_enabled && Editor.next_page();
                    break;
                case KEY_ACTION.EDITOR_UP:
                    editor_enabled && Editor.editor_up();
                    break;
                case KEY_ACTION.EDITOR_DOWN:
                    editor_enabled && Editor.editor_down();
                    break;
                case KEY_ACTION.EDITOR_LEFT:
                    editor_enabled && Editor.editor_left();
                    break;
                case KEY_ACTION.EDITOR_RIGHT:
                    editor_enabled && Editor.editor_right();
                    break;
                case KEY_ACTION.EDITOR_COPY:
                    editor_enabled && Editor.editor_copy();
                    break;
                case KEY_ACTION.EDITOR_SET_AS_TARGET:
                    editor_enabled &&
                        Editor.editor_set_teleport_position();
                    break;
                case KEY_ACTION.EDITOR_MAKE_TELEPORT:
                    editor_enabled && Editor.editor_make_teleport();
                    break;
                case KEY_ACTION.SHOW_OPTIONS:
                    OptionsMenu.toggle()
            }
            GAME_STATE != GAME_STATES.CHAT || captcha || (document.getElementById("my_text").focus(), Chat.update_string());
            if (b) return a.preventDefault(), !1
        }
    });
    if (!(localStorage.b && parseInt(localStorage.b) > timestamp() || getKypsis("b"))) {
        window.onscroll = function(a) {
            GAME_STATE != GAME_STATES.GAME || captcha || setCanvasSize();
            var b = a.srcElement ||
                a.target;
            if (!(hasClass(b, "scrolling_allowed") || hasClass(b.parentNode, "scrolling_allowed") || b.parentNode && hasClass(b.parentNode.parentNode, "scrolling_allowed"))) return a.preventDefault(), !1
        };
        var a;
        try {
            wrapper.addEventListener("touchmove", function(a) {
                if (10 < Math.abs(a.touches[0].clientX - touch_x) || 10 < Math.abs(a.touches[0].clientY - touch_y)) prevent_touchend_default = !0;
                var b = a.srcElement || a.target;
                hasClass(b, "scrolling_allowed") || hasClass(b.parentNode, "scrolling_allowed") || b.parentNode && hasClass(b.parentNode.parentNode,
                    "scrolling_allowed") || a.preventDefault()
            }), wrapper.addEventListener(touchstart, function(b) {
                Android && b.stopPropagation();
                has_touch_screen = !0;
                left_click_cancel = prevent_touchend_default = !1;
                touch_x = b.clientX || b.touches[0].clientX;
                touch_y = b.clientY || b.touches[0].clientY;
                touch_last_x = b.pageX || b.touches[0].pageX;
                touch_last_y = b.pageX || b.touches[0].pageY;
                initialize_touch();
                GAME_STATE == GAME_STATES.GAME && (a = setTimeout(function() {
                    left_click_cancel = !0;
                    regular_oncontextmenu(b)
                }, 1E3));
                2 == socket_status && "hud" == b.target.id &&
                    b.preventDefault()
            }), wrapper.addEventListener(touchend, function(b) {
                b.stopPropagation();
                clearTimeout(a);
                prevent_touchend_default || left_click_cancel ? b.preventDefault() : regular_onclick(b)
            }), document.getElementById("gamepad").addEventListener(touchstart, function(a) {
                a.preventDefault()
            }), document.getElementById("gamepad").addEventListener(touchend, function(a) {
                a.preventDefault()
            }), document.getElementById("sw_but").addEventListener(touchstart, function(a) {
                selected_object = {};
                touch_hold_i = 0;
                touch_hold_j = -1;
                touch_hold = !0;
                Music.play(players[0].map);
                a.preventDefault()
            }), document.getElementById("sw_but").addEventListener(touchend, function(a) {
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("se_but").addEventListener(touchstart, function(a) {
                selected_object = {};
                touch_hold_i = 1;
                touch_hold_j = 0;
                touch_hold = !0;
                Music.play(players[0].map);
                a.preventDefault()
            }), document.getElementById("se_but").addEventListener(touchend, function(a) {
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("ne_but").addEventListener(touchstart,
                function(a) {
                    selected_object = {};
                    touch_hold_i = 0;
                    touch_hold_j = 1;
                    touch_hold = !0;
                    Music.play(players[0].map);
                    a.preventDefault()
                }), document.getElementById("ne_but").addEventListener(touchend, function(a) {
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("nw_but").addEventListener(touchstart, function(a) {
                selected_object = {};
                touch_hold_i = -1;
                touch_hold_j = 0;
                touch_hold = !0;
                Music.play(players[0].map);
                a.preventDefault()
            }), document.getElementById("nw_but").addEventListener(touchend, function(a) {
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("mi_but").addEventListener(touchstart, function(a) {
                for (var b = [{
                        i: players[0].i + touch_hold_i,
                        j: players[0].j + touch_hold_j
                    }, {
                        i: players[0].i,
                        j: players[0].j + 1
                    }, {
                        i: players[0].i + 1,
                        j: players[0].j
                    }, {
                        i: players[0].i - 1,
                        j: players[0].j
                    }, {
                        i: players[0].i,
                        j: players[0].j - 1
                    }, {
                        i: players[0].i + touch_hold_i,
                        j: players[0].j + touch_hold_j
                    }], d = b.pop(); !on_map[current_map][d.i][d.j] && 0 < b.length;) d = b.pop();
                b = document.getElementById("gamepad").getBoundingClientRect();
                ActionMenu.create({
                    clientX: b.right -
                        130,
                    clientY: b.top - 100
                }, d);
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("mi_but").addEventListener(touchend, function(a) {
                touch_hold = !1;
                a.preventDefault()
            }), document.getElementById("atk_button").addEventListener(touchstart, function(a) {
                touch_hold_atk = !0;
                document.getElementById("atk_button").style.backgroundPositionX = "-73px";
                a.preventDefault()
            }), document.getElementById("atk_button").addEventListener(touchend, function(a) {
                document.getElementById("atk_button").style.backgroundPositionX = "0px";
                touch_hold_atk = !1;
                a.preventDefault()
            }), setInterval(function() {
                if (touch_hold && !movementInProgress(players[0]) && !Timers.running("set_target")) {
                    players[0].temp.busy && inAFight && 500 < timestamp() - lastRunAwayAttempt && (Socket.send("run_from_fight", {}), lastRunAwayAttempt = timestamp());
                    var a = {
                        i: players[0].i + touch_hold_i,
                        j: players[0].j + touch_hold_j
                    };
                    findPathFromTo(players[0], a, players[0]);
                    if (map_walkable(players[0].map, a.i, a.j)) {
                        players[0].path = [a];
                        var b = players[0].i + 2 * touch_hold_i,
                            d = players[0].j + 2 * touch_hold_j;
                        if (on_map[current_map][b] && on_map[current_map][b][d] && on_map[current_map][b][d].b_t == BASE_TYPE.NPC) {
                            if (b = objects_data[on_map[current_map][b][d].id], (b.params.aggressive && players[0].temp.target_id != b.id && players[0].params.combat_level < FIGHT.calculate_monster_level(b) + 20 || 100 <= current_map || 16 == current_map || Player.has_bow(players[0])) && !Timers.running("set_target")) {
                                if (touch_hold_atk && Player.has_bow(players[0])) return Player.set_target(a);
                                Socket.send("set_target", {
                                    target: b.id
                                });
                                Timers.set("set_target",
                                    null_function, 100)
                            }
                        } else touch_hold_atk && !Timers.running("set_target") && Player.set_target(a)
                    } else selected_object = obj_g(on_map[current_map][a.i] && on_map[current_map][a.i][a.j]), "object" == typeof selected_object && selected_object.activities[0] && 0 < selected_object.activities[0].length ? ActionMenu.act(0) : Tower.by_map[current_map] && Tower.button_abuse()
                }
            }, 16)
        } catch (b) {
            throw b;
        }
        setCanvasSize();
        tile_count = BASE_TYPE[BASE_TYPE.GROUND].length;
        object_count = BASE_TYPE[BASE_TYPE.OBJECT].length;
        load_user_data();
        if (!LOAD(0))
            for (var d =
                    0; d < map_size_x; d++)
                for (var e = 0; e < map_size_y; e++) {
                    var f = Math.round(50 * Math.random());
                    f >= BASE_TYPE[BASE_TYPE.GROUND].length && (f = 0);
                    f = 0;
                    map[d][e] = createObject(JSON.merge(BASE_TYPE[BASE_TYPE.GROUND][f], {
                        i: d,
                        j: e
                    }));
                    map[d][e].blocking ? on_map[d][e] = !1 : (f = Math.round(10 * Math.random()), on_map[d][e] = 1 > f ? createObject(JSON.merge(BASE_TYPE[BASE_TYPE.OBJECT][f], {
                        i: d,
                        j: e
                    })) : !1)
                }
        imageGround = [];
        imageObject = [];
        imageGraphics = [];
        for (d = 0; d < Math.max(tile_count, object_count); d++) imageGround[d] = new Image, imageObject[d] = new Image,
            imageGraphics[d] = new Image;
        imageGround[0].src = cdn_url + "selected.png";
        wrapper.onclick = function(a) {
            touch_initialized || regular_onclick(a)
        };
        holdEvent(wrapper, regular_oncontextmenu, 1E3);
        wrapper.oncontextmenu = regular_oncontextmenu;
        wrapper.onmousemove = regular_onmousemove;
        for (var g in IMAGE_SHEET) "object" == typeof IMAGE_SHEET[g] && (IMAGE_SHEET[g].url = cdn_url + IMAGE_SHEET[g].url + "?" + img_hashes[parseInt(g) - 1] + window.location.hostname, IMAGE_SHEET[g].img = [], IMAGE_SHEET[g].tile_half_width_floor = IMAGE_SHEET[g].tile_width /
            2 << 0, IMAGE_SHEET[g].tile_half_height_floor = IMAGE_SHEET[g].tile_height / 2 << 0, IMAGE_SHEET[g].img[0] = getImage(IMAGE_SHEET[g].url, function() {
                updateLoading()
            }));
        for (d in sprite) "undefined" == typeof IMAGE_SHEET[sprite[d].meta.image] && (IMAGE_SHEET[sprite[d].meta.image] = {}, IMAGE_SHEET[sprite[d].meta.image].sprite = new SpriteAtlas(sprite[d]), IMAGE_SHEET[sprite[d].meta.image].tile_width = 0, IMAGE_SHEET[sprite[d].meta.image].tile_height = 0);
        var h = setInterval(function() {
                var a = !1,
                    b;
                for (b in IMAGE_SHEET)
                    if ("object" ==
                        typeof IMAGE_SHEET[b] && !IMAGE_SHEET[b].sprite) {
                        if (!IMAGE_SHEET[b].img[0].complete) return !1;
                        !IMAGE_SHEET[b].filters || IMAGE_SHEET[b].img[1] || /Android|iPhone|iPad|Mobile|Tablet|Blackberry|WebOS/.test(navigator.userAgent) || (IMAGE_SHEET[b].img[1] = Filters.applyFilter(IMAGE_SHEET[b].img[0], {
                            filter: "brightness",
                            brightness: 50
                        }), a = !0)
                    }
                ServerList.socket_url || (a = !0);
                socket_io_loaded || (a = !0);
                external_library_loaded || (a = !0);
                for (var d in sprite) IMAGE_SHEET[sprite[d].meta.image].sprite.SpriteSheet.complete || (a = !0);
                if (a) return !1;
                IMAGE_SHEET.achievement_active = {
                    img: [getImage(cdn_url + "img/achievements/active.jpg", null_function)]
                };
                IMAGE_SHEET.achievement_inactive = {
                    img: [getImage(cdn_url + "img/achievements/inactive.jpg", null_function)]
                };
                prepareCarpentryObjects();
                prepareTopImages();
                game_timestamp.loaded = timestamp();
                addClass(document.getElementById("loading_box"), "hidden");
                getParameterByName("reset_email") ? showResetPasswordForm(getParameterByName("reset_email"), getParameterByName("reset_code")) : getParameterByName("unsubscribe_id") ?
                    (addClass(document.getElementById("login_box"), "hidden"), Popup.prompt("Unsubscribe from e-mail alerts?", function() {
                        socket.emit("unsubscribe_email", {
                            id: getParameterByName("unsubscribe_id"),
                            code: getParameterByName("unsubscribe_code"),
                            sk: c_sk
                        });
                        Popup.dialog("You won't be receiving any special offers or newsletters anymore!", function() {
                            alternative_login_function()
                        })
                    }, function() {
                        alternative_login_function()
                    })) : alternative_login_function();
                clearInterval(h);
                calculateMonsterCombats();
                preloadPlayer();
                resetMapShift();
                try {
                    Editor.toggle_minimap(), Editor.toggle_minimap(), drawMap()
                } catch (e) {}
                refreshHUD();
                loadRecaptcha();
                makePlaceholder(document.getElementById("login_user"), "User");
                setTimeout(function() {
                    iOS || setCanvasSize()
                }, 2500);
                iOS && (document.getElementById("my_text").style.left = "63px");
                animateUntil("all", 0);
                render();
                finishedLoading = !0;
                setInterval(function() {
                    garbageCollector()
                }, 6E4);
                initDOMEvents();
                BigMenu.init_inventory();
                Forge.init();
                Fletching.init();
                Translate.initialize_language();
                Market.init_item_category();
                WebPayment.init();
                setCanvasSize();
                Music.init();
                setBackground(0);
                a = new Fingerprint2({
                    swfPath: "swf/FontList.swf",
                    excludeUserAgent: !0
                });
                try {
                    a.get(function(a) {
                        fp = a
                    })
                } catch (f) {}
                document.getElementById("chat_button").style.display = "block";
                document.getElementById("filters_button").style.display = "block";
                document.getElementById("contacts_button").style.display = "block";
                document.getElementById("quests_button").style.display = "block";
                document.getElementById("spectate_button").style.display = "block";
                document.getElementById("multicombat_indicator_icon").style.background =
                    Items.get_background_image(2023).replace("background:", "").replace(";", "");
                try {
                    OptionsMenu.initialize_settings()
                } catch (g) {}
                if ("gamescom" == getParameterByName("inapp")) document.getElementById("top_left").style.display = "none", show_donations = !0, gamescom.payments ? (document.getElementById("donation_button_link").onclick = function() {
                        WebPayment.open_gamescom()
                    }, document.getElementById("mos_market_link").onclick = function() {
                        WebPayment.open_gamescom()
                    }, GAMESAPI.TRANSACTION.getTransactionHistory(function(a) {
                        if (a &&
                            a.data && 0 < a.data.length) {
                            var b = 1E4,
                                d;
                            for (d in a.data) a.data[d].amount && a.data[d].assetId && a.data[d].orderId && (WebPayment.report_aol_payment(a.data[d].amount, a.data[d].assetId, a.data[d].orderId, b), b += 1500)
                        }
                    }, function() {})) : (document.getElementById("donation_button_link").onclick = function() {
                        Popup.dialog("Log in to Games.com to enable payments", null_function)
                    }, document.getElementById("mos_market_link").onclick = function() {
                        Popup.dialog("Log in to Games.com to enable payments", null_function)
                    }), modsSupported() &&
                    (document.getElementById("mods_link").style.display = "block", document.getElementById("spectate_mode_link").style.display = "block");
                else if ("yandex" == getParameterByName("inapp") || "amazon" == getParameterByName("inapp")) document.getElementById("top_left").style.display = "none", document.getElementById("donation_button").style.display = "none", document.getElementById("mos_market_link").style.display = "none", document.getElementById("mods_link").style.display = "block";
                else if ("kongregate" == getParameterByName("inapp")) "undefined" !=
                    typeof kongregate.api && kongregate.payments && (show_donations = !0, document.getElementById("donation_button_link").onclick = function() {
                        WebPayment.open_kongregate()
                    }, document.getElementById("mos_market_link").onclick = function() {
                        WebPayment.open_kongregate()
                    }, kongregate.api.mtx.requestUserItemList(null, function(a) {
                        a.success && 0 < a.data.length && WebPayment.check_kongregate_payment()
                    })), modsSupported() && (document.getElementById("mods_link").style.display = "block", document.getElementById("spectate_mode_link").style.display =
                        "block"), document.getElementById("top_left").innerHTML = "RPG MO", document.getElementById("logout_link").style.display = "none", document.getElementById("login_user").style.display = "none", document.getElementById("login_pass").style.display = "none", document.getElementById("login_register_button").style.display = "none", document.getElementById("invite_link").style.display = "inline-block", document.getElementById("invite_link").onclick = function() {
                        Player.show_referrals()
                    };
                else if ("steam" == getParameterByName("inapp")) {
                    show_donations = !0;
                    document.getElementById("donation_button_link").onclick = function() {
                        WebPayment.open_steam()
                    };
                    document.getElementById("mos_market_link").onclick = function() {
                        WebPayment.open_steam()
                    };
                    modsSupported() && (document.getElementById("mods_link").style.display = "block", document.getElementById("spectate_mode_link").style.display = "block");
                    document.getElementById("top_left").innerHTML = "RPG MO";
                    document.getElementById("invite_link").style.display = "inline-block";
                    document.getElementById("invite_link").onclick = function() {
                        Player.show_referrals()
                    };
                    try {
                        useExternalBrowserLinks(document);
                        var a = [{
                                name: "homepage_link",
                                link: "https://mo.ee"
                            }, {
                                name: "forums_link",
                                link: "https://forums.mo.ee"
                            }, {
                                name: "rules_link_href",
                                link: "https://mo.ee/rules"
                            }],
                            A;
                        for (A in a) {
                            var w = document.getElementsByClassName(a[A].name),
                                z;
                            for (z in w) w[z].onclick = createExternalLink(a[A].link)
                        }
                        w = document.getElementsByClassName("highscores_link");
                        for (z in w) w[z].onclick = function() {
                            Steam.highscore.toggle()
                        }
                    } catch (x) {}
                    if (Fullscreen.supported() && !SpectateWindow.slave || Fullscreen.slave_supported()) document.getElementById("settings_webkitfullscreen").style.display =
                        "block", document.getElementById("settings_webkitfullscreen_spectate").style.display = "block", document.getElementById("settings_steamzoomlevel").style.display = "block";
                    Steam.load_previous_settings();
                    Steam.initialize_mods();
                    Steam.enable_close_button();
                    document.title = "RPG MO - Early Access"
                } else {
                    if ("pokki" == getParameterByName("inapp")) _open = window.open, window.open = function(a) {
                            return function(a, b, d) {
                                parent.pokki.openURLInDefaultBrowser(a);
                                return _open(a, b, d)
                            }
                        }(window.open), A = document.getElementById("paypal_form"),
                        A.method = "get", A.addEventListener("submit", function(a) {
                            var b = a.srcElement.action + "?",
                                d = [],
                                e;
                            for (e in a.srcElement) a.srcElement[e] && null != a.srcElement[e] && "INPUT" == a.srcElement[e].tagName && d.push(a.srcElement[e].name + "=" + encodeURIComponent(a.srcElement[e].value));
                            b += d.join("&");
                            parent.pokki.openURLInDefaultBrowser(b)
                        }, !1), document.getElementById("regular_payment_btc").style.display = "none";
                    else if ("1" == getParameterByName("inapp"))
                        for (A in document.getElementById("regular_payment_btc").style.display =
                            "none", document.getElementById("regular_payment_other").style.paddingRight = "40px", document.getElementById("top_left").style.display = "none", document.getElementById("help_forums_link").onclick = function(a) {
                                redirectUrl("https://forums.mo.ee");
                                a.preventDefault()
                            }, a = [{
                                name: "homepage_link",
                                link: "https://mo.ee"
                            }, {
                                name: "highscores_link",
                                link: "https://mo.ee/highscore.html"
                            }, {
                                name: "forums_link",
                                link: "https://forums.mo.ee"
                            }, {
                                name: "rules_link_href",
                                link: "https://mo.ee/rules"
                            }], a)
                            for (z in w = document.getElementsByClassName(a[A].name),
                                w) w[z].onclick = new Function("redirectUrl('" + a[A].link + "');");
                    else "android" == getParameterByName("inapp") && (Chat.chat_position_up = !0, setTimeout(function() {
                        setCanvasSize(!0)
                    }, 2E3));
                    modsSupported() && (document.getElementById("mods_link").style.display = "block", document.getElementById("spectate_mode_link").style.display = "block");
                    if (1 <= getParameterByName("node-webkit-api")) {
                        try {
                            window.open = function(a) {
                                createExternalLink(a)()
                            }, document.getElementById("paypal_form").onsubmit = function(a) {
                                paypalLink();
                                a.preventDefault();
                                return !1
                            }, document.body.addEventListener("click", supportExternalLinks, !1)
                        } catch (B) {}
                        if (Fullscreen.supported() && !SpectateWindow.slave || Fullscreen.slave_supported()) document.getElementById("settings_webkitfullscreen").style.display = "block", document.getElementById("settings_webkitfullscreen_spectate").style.display = "block", document.getElementById("settings_steamzoomlevel").style.display = "block";
                        Steam.load_previous_settings();
                        Steam.initialize_mods()
                    }
                    show_donations = !0;
                    document.getElementById("top_left").innerHTML =
                        "RPG MO";
                    mobileDevice() || document.getElementById("login_user").focus();
                    if (Fullscreen.supported() && !SpectateWindow.slave || Fullscreen.slave_supported()) document.getElementById("settings_webkitfullscreen").style.display = "block", document.getElementById("settings_webkitfullscreen_spectate").style.display = "block";
                    document.getElementById("invite_link").style.display = "inline-block";
                    document.getElementById("invite_link").onclick = function() {
                        Player.show_referrals()
                    }
                }
                game_timestamp.finished = timestamp();
                reportLoading()
            },
            100)
    }
}
var imagesLoaded = 0,
    imagesTotal = 50,
    finishedLoading = !1,
    updateLoading = function() {
        imagesLoaded++;
        if (!finishedLoading) {
            var a = Math.round(imagesLoaded / imagesTotal * 100);
            document.getElementById("top_left").innerHTML = "RPG MO - Loading... " + a + "%"
        }
    },
    enableMods = function() {
        Popup.prompt(_tm("Enable mods? These are provided by 3rd party and may not work on all devices. Also we are not responsible for any damages that may occur. To unload mods, just refresh your browser or restart your app."), function() {
            document.getElementById("mods_link").style.display = "none";
            document.getElementById("mods_link").removeAttribute("data-ti");
            document.body.appendChild(document.createElement("script")).src = cdn_url + "mod.js?v=" + mod_version
        })
    },
    redirectUrl = function(a) {
        var b = window.location.protocol + "//" + window.location.hostname + window.location.pathname + ("string" === typeof window.location.search ? window.location.search : "");
        window.location = window.location.protocol + "//" + window.location.hostname + "/redirect.html?url=" + encodeURIComponent(a) + "&back_url=" + encodeURIComponent(b)
    },
    reportLoading =
    function() {
        var a = Math.round((game_timestamp.finished - game_timestamp.init) / 1E3);
        5 >= a ? _gaq.push(["_trackPageview", "/loadtime_5"]) : 10 >= a ? _gaq.push(["_trackPageview", "/loadtime_10"]) : 20 >= a ? _gaq.push(["_trackPageview", "/loadtime_20"]) : 40 >= a ? _gaq.push(["_trackPageview", "/loadtime_40"]) : 80 >= a ? _gaq.push(["_trackPageview", "/loadtime_80"]) : 160 >= a ? _gaq.push(["_trackPageview", "/loadtime_160"]) : _gaq.push(["_trackPageview", "/loadtime_high"])
    },
    reportTimes = function(a) {
        return {
            onload: Math.round((a.onload - a.init) / 1E3),
            loaded: Math.round((a.loaded - a.onload) / 1E3),
            finished: Math.round((a.finished - a.loaded) / 1E3),
            connected: Math.round((a.connected - a.finished) / 1E3),
            total: Math.round((a.connected - a.init) / 1E3)
        }
    },
    default_lang;
default_lang = navigator.userLanguage ? navigator.userLanguage : navigator.language ? navigator.language : "en";
default_lang = default_lang.toLowerCase().replace("_", "-");
"pt-br" != default_lang && "zh-tw" != default_lang && (default_lang = default_lang.split("-")[0]);
"cz" == default_lang && (default_lang = "cs");
"jp" == default_lang && (default_lang = "ja");
Translate.keep_names = "false" == localStorage.lang_names;
observeElement(document, "checksum", function(a) {
    if ((a = a.detail) && a.version > release_version && a.checksum != release_checksum && (addChatText(_te("You are using an outdated version of the game that may have some bugs. Clear cache and reload to get up to date version."), void 0, COLOR.PINK), !(1 <= webkit_version || SpectateWindow.slave || getParameterByName("cache") == a.checksum))) {
        var b = SpectateWindow.getOrigin() + window.location.pathname + window.location.search,
            d = "cache=" + a.checksum,
            b = getParameterByName("cache") ? b.replace(getParameterByName("cache"),
                a.checksum) : /\?/.test(b) ? b + "&" + d : b + "?" + d;
        window.location = b
    }
});
Draw = {};
var effects = {},
    minimap_scale = .125;
Draw.pointInsideCanvas = function(a, b) {
    return 0 <= a && a <= width && 0 <= b && b <= height ? !0 : !1
};
Draw.drawToMap = function(a, b, d, e, f, g) {
    if (minimap) return Draw.minimap(a, b, d, e, f);
    if ("undefined" != typeof b)
        if ("undefined" != typeof b.sheet_file) e = IMAGE_SHEET[b.sheet_file].sprite.imgs[b.file], "undefined" != typeof e && (g = d.x, d = d.y, g -= e.width, d -= e.height, g += 54 + (b.h - 1) * half_tile_width, a.drawImage(e, g << 0, d + 27 << 0));
        else if ("undefined" != typeof b.hash) a.drawImage(getBodyImg(b.hash), 0, 0, 64, 54, d.x, d.y - 23, 64, 54);
    else {
        e = IMAGE_SHEET[b.sheet];
        f = IMAGE_SHEET[b.sheet].tile_width * b.x;
        var h = IMAGE_SHEET[b.sheet].tile_height *
            b.y;
        if (!(0 > f || 0 > h)) {
            var l = "undefined" == typeof d.relative ? !0 : d.relative,
                m = b.layer || 0,
                k = 0,
                v = 0;
            "undefined" != typeof b.pos && (k = b.pos._x, v = b.pos._y);
            if (l) {
                var l = e.img[m],
                    m = e.tile_width,
                    q = e.tile_height,
                    k = k + d.x - IMAGE_SHEET[b.sheet].tile_half_width_floor + half_tile_width;
                d = v + d.y - 12 - IMAGE_SHEET[b.sheet].tile_half_height_floor + half_tile_height;
                v = e.tile_width;
                e = e.tile_height;
                (!g || Draw.pointInsideCanvas(k, d) || Draw.pointInsideCanvas(k + v, d) || Draw.pointInsideCanvas(k, d + e) || Draw.pointInsideCanvas(k + v, d + e) || 47 == b.sheet ||
                    40 == b.sheet) && a.drawImage(l, f, h, m, q, k, d, v, e)
            } else a.drawImage(e.img[m], f, h, e.tile_width, e.tile_height, d.x, d.y, e.tile_width, e.tile_height)
        }
    }
};
Draw.minimap = function(a, b, d, e, f) {
    if ("undefined" != typeof b) {
        if (b.sheet) {
            var g = IMAGE_SHEET[b.sheet],
                h = IMAGE_SHEET[b.sheet].tile_width * b.x,
                l = IMAGE_SHEET[b.sheet].tile_height * b.y,
                m = Math.floor(IMAGE_SHEET[b.sheet].tile_width / 2) - 36,
                k = Math.floor(IMAGE_SHEET[b.sheet].tile_height / 2) - 18;
            if (0 > h || 0 > l) return
        }(f = "undefined" == typeof d.relative ? !0 : d.relative) ? (e = d.x + half_tile_width, d = d.y + half_tile_height - 12) : (e = d.x, d = d.y);
        d = minimap && .125 == minimap_scale ? d + 40 : d + 1200;
        a.translate(e, d);
        var v = b.layer || 0;
        a.save();
        a.scale(minimap_scale,
            minimap_scale);
        "undefined" != typeof b.sheet_file ? (g = IMAGE_SHEET[b.sheet_file].sprite.imgs[b.file], "undefined" != typeof g && (h = 36 - g.width, l = 30 - g.height, h += b.h * half_tile_width, l += Math.round(13.5), .125 == minimap_scale && (h += 5 * tile_width), a.drawImage(g, h, l))) : "undefined" != typeof b.hash ? a.drawImage(getBodyImg(b.hash), 0, 0, 64, 54, 8, -6, 64, 54) : f ? a.drawImage(g.img[v], h, l, g.tile_width, g.tile_height, -m, -k, g.tile_width, g.tile_height) : a.drawImage(g.img[v], h, l, g.tile_width, g.tile_height, 0, 0, g.tile_width, g.tile_height);
        a.restore();
        a.translate(-e, -d)
    }
};
Draw.drawPlayer = function(a, b, d) {
    a.drawImage(getBodyImg(b.params.hash), 0, 0, 64, 54, d.x, d.y - 23, 64, 54)
};
Draw.clear = function(a) {
    a.clearRect(0, 0, a.canvas.width, a.canvas.height)
};
var experimental_fullscreen = !1,
    fullscreen_mode = !1,
    fullscreen_x = -344,
    fullscreen_y = 1218;

function updateBaseWork() {
    if (!(!isActive || no_render || Android && GAME_STATE != GAME_STATES.GAME || "undefined" == typeof players[0])) {
        var a = players[0].mx,
            b = players[0].my;
        if (minimap) dx = dy = 0, Draw.clear(ctx.base_show), Draw.clear(ctx.objects_show), Draw.clear(ctx.players_show);
        else {
            if (fullscreen_mode) {
                var d = -a + tile_width,
                    e = 0;
                0 > d && (e = -d, d = 0);
                var f = -b,
                    g = 0;
                0 > f && (g = -f, f = 0);
                var h = Math.min(height - f, height + g);
                ctx.base_show.drawImage(c.base, d, f, width - e, h, e, g, width - e, h)
            } else Draw.clear(ctx.base_show), ctx.base_show.drawImage(c.base,
                a, b, width, height);
            null != selected.i && (d = translateTileToCoordinates(selected.i, selected.j, !0), d.visible && ctx.base_show.drawImage(imageGround[0], d.x + a, d.y + b));
            drawMap(!1, !0, !1);
            Draw.clear(ctx.objects_show);
            ctx.objects_show.drawImage(c.objects, a, b, width, height)
        }
    }
}

function updateBase() {
    !isActive || no_render || Android && GAME_STATE != GAME_STATES.GAME || "undefined" == typeof players[0] || (settings.update_base = !0)
}

function refreshHUD() {
    Draw.clear(ctx.hud);
    HUD.drawMinimap();
    HUD.drawMenu()
}
var lastRender = new Date,
    renderCount = 0,
    bigIcons = !1;

function renderHandle1000ms() {
    1338 == window.location.port && (document.getElementById("top_left").innerHTML = "FPS: " + (renderCount + .5 | 0));
    movementInProgress(players[0]) && (55 > renderCount ? (settings.framelimit = !1, 18 > renderCount && (settings.framelimit = !0)) : settings.framelimit = !1);
    renderCount = 0
}

function playersPath(a) {
    if (0 < players[a].path.length && !players[a].temp.busy && !movementInProgress(players[a])) moveInPath(players[a]);
    else if ("0" != a && !movementInProgress(players[a]) && (players[a].temp.dest.i != players[a].i || players[a].temp.dest.j != players[a].j) && map_walkable(players[a].map, players[a].temp.dest.i, players[a].temp.dest.j)) {
        var b = findPathFromTo(players[a], players[a].temp.dest, players[a]),
            d = !1;
        if (0 < b.length)
            for (var e in b)
                if (map_visible(b[e].i, b[e].j)) {
                    d = !0;
                    break
                }
        d ? players[a].path = b : (players[a].i =
            players[a].temp.to.i = players[a].temp.dest.i, players[a].j = players[a].temp.to.j = players[a].temp.dest.j)
    }
}

function movePlayers() {
    var a = !1,
        b = (new Date).getTime(),
        d = !1,
        e;
    for (e in players)
        if (playersPath(e), 0 < players[e].temp.animate_until) {
            players[e].mx = 0;
            players[e].my = 0;
            var a = Math.round(tile_width - tile_width * ((players[e].temp.animate_until - b) / ctime(players[e]))) / 2 << 0,
                f = Math.round(tile_height - tile_height * ((players[e].temp.animate_until - b) / ctime(players[e]))) / 2 << 0;
            players[e].temp.to.j > players[e].j ? (players[e].mx = -a, players[e].my = f) : players[e].temp.to.j < players[e].j ? (players[e].mx = a, players[e].my = -f) : players[e].temp.to.i >
                players[e].i ? (players[e].mx = -a, players[e].my = -f) : players[e].temp.to.i < players[e].i && (players[e].mx = a, players[e].my = f);
            players[e].mx = Math.round(Math.range(players[e].mx, -tile_width / 2, tile_width / 2));
            players[e].my = Math.round(Math.range(players[e].my, -tile_height / 2, tile_height / 2));
            players[e].temp.animate_until < b ? (players[e].temp.animate_until = 0, a = !0, players[e].me ? resetMapShift() : d = !0) : a = !0
        }
    return {
        draw_minimap: d,
        update_base: a
    }
}

function render() {
    requestAnimFrame(function() {
        render()
    });
    if (!(!isActive || no_render || Android && GAME_STATE != GAME_STATES.GAME)) {
        var a = new Date;
        if (settings.framelimit)
            if (40 <= a - framelimit_delta) framelimit_delta = a;
            else return;
        1E3 < a - lastRender && (renderHandle1000ms(), lastRender = a);
        renderCount++;
        a = movePlayers();
        if (a.update_base || settings.update_base || settings.draw_objects) drawObjects(), updateBaseWork();
        (a.draw_minimap || settings.update_minimap) && HUD.drawMinimap();
        settings.update_base = !1;
        settings.draw_objects = !1;
        settings.update_minimap = !1;
        runAnimations()
    }
}

function runAnimations() {
    if (!isEmpty(effects)) {
        var a = timestamp();
        Draw.clear(ctx.effects);
        for (var b in effects) {
            var d = effects[b],
                e = d.duration,
                f;
            if ("undefined" != typeof d.x) f = {
                x: d.x,
                y: d.y
            };
            else if (d.arrow) {
                var g = translateTileToCoordinates(d.from.i, d.from.j),
                    h = translateTileToCoordinates(d.to.i, d.to.j);
                f = (a - d.start) / d.duration * 160;
                f = (f - .0025 * f * f) / 100 + .04;
                f = {
                    x: g.x + half_tile_width - (g.x - h.x) * f + players[0].mx,
                    y: g.y + half_tile_height - (g.y - h.y) * f + players[0].my
                }
            } else f = translateTileToCoordinates(d.i, d.j), f.x +=
                players[0].mx, f.y += players[0].my;
            d.until > a && d.map == current_map && (d.i || d.j) && map_visible(d.i, d.j) ? (e = Math.round((a - d.start) / e * d.animation.length), Draw.drawToMap(ctx.effects, {
                sheet: d.animation.sheet,
                x: e,
                y: d.animation.row,
                relative: !1
            }, f)) : d.until > a && d.map == current_map && d.arrow ? Draw.pointInsideCanvas(f.x - 11, f.y - 16) && ctx.effects.drawImage(Fletching.get_arrow_combat_img_radian(d.arrow, Archery.angle_radians(g, h)), f.x - 11, f.y - 16) : delete effects[b]
        }
    }
}

function addAnimation(a, b, d, e, f) {
    var g = Math.round(a.length / a.speed * 1E3),
        h = timestamp() + "" + (1E3 * Math.random() << 0);
    effects[h] = {
        animation: a,
        until: g + timestamp(),
        start: timestamp(),
        duration: g,
        i: b,
        j: d,
        map: e
    };
    "undefined" != typeof f && (effects[h].i = players[0].i, effects[h].j = players[0].j, effects[h].map = players[0].map, effects[h].x = f.x, effects[h].y = f.y)
}

function addArrow(a, b, d, e, f) {
    if (map_visible(b.i, b.j) || map_visible(d.i, d.j)) {
        var g = translateTileToCoordinates(b.i, b.j),
            h = translateTileToCoordinates(d.i, d.j);
        distance(g.x, g.y, h.x, h.y);
        g = timestamp() + "" + (1E3 * Math.random() << 0);
        effects[g] = {
            arrow: a,
            until: f + timestamp(),
            start: timestamp(),
            duration: f,
            from: b,
            to: d,
            map: e
        }
    }
}

function isEmpty(a) {
    for (var b in a) return !1;
    return !0
}

function animateUntil(a, b) {
    var d = timestamp();
    "object" == typeof a && a.temp.animate_until < d + b && (a.temp.animate_until = d + b)
}

function drawObject(a, b) {
    var d = {
        x: a.x,
        y: a.y
    };
    if (b.b_t == BASE_TYPE.PLAYER || b.b_t == BASE_TYPE.PET) d.x -= b.mx, d.y -= b.my, b.b_t == BASE_TYPE.PET && (d.y += 2);
    var e = ctx.objects,
        f = fullscreen_mode;
    minimap && (e = ctx.minimap, f = !1);
    if ("object" == typeof b && (!minimap || minimap && b.b_t == BASE_TYPE.OBJECT || 1 == minimap_scale && b.b_t != BASE_TYPE.PLAYER && b.b_t != BASE_TYPE.PET)) return b.b_t == BASE_TYPE.PLAYER ? Draw.drawPlayer(e, b, d) : Draw.drawToMap(e, b.img, d, void 0, void 0, f)
}

function drawGround() {
    var a = iMapBegin() + "" + iMapTo() + "" + dx,
        b = jMapBegin() + "" + jMapTo() + "" + dy,
        d = current_map;
    if (last_draw_ground.i != a || last_draw_ground.j != b || last_draw_ground.map != d || editor_enabled) {
        last_draw_ground = {
            i: a,
            j: b,
            map: d
        };
        a = 1;
        if (Carpentry.player_map) switch (Carpentry.player_map.tiles) {
            case 6:
                a = 58;
                break;
            case 7:
                a = 23;
                break;
            case 8:
                a = 302
        }
        Draw.clear(ctx.base);
        b = iMapBegin();
        for (d = iMapTo(); b < d; b++)
            for (var e = jMapTo(), f = jMapBegin(); e >= f; e--) {
                var g = !1;
                if ("undefined" == typeof map[current_map] || "undefined" ==
                    typeof map[current_map][b + dx] || "undefined" == typeof map[current_map][b + dx][e + dy])
                    if (300 == current_map) g = ground_base[a];
                    else continue;
                var g = g || obj_g(map[current_map][b + dx][e + dy]),
                    h = ctx.base,
                    l = 0;
                minimap ? (h = ctx.minimap, l = 16 * minimap_scale) : l += 16;
                if ("undefined" != typeof g) {
                    var m = translateTileToCoordinates(b + dx, e + dy);
                    m.y += l;
                    "object" == typeof g.top ? Draw.drawToMap(h, ground_images[g.b_i], m) : Draw.drawToMap(h, g.img, m)
                }
            }
        Timers.set("update_location_toolbar", Toolbar.update_current_location, 10)
    }
}
var last_draw_ground = {
    i: -1,
    j: -1,
    map: -1
};

function drawGroundFull() {
    var a = players[0].i,
        b = players[0].j,
        d = current_map;
    if (last_draw_ground.i != a || last_draw_ground.j != b || last_draw_ground.map != d) {
        last_draw_ground = {
            i: a,
            j: b,
            map: d
        };
        Draw.clear(ctx.base);
        var d = b * half_tile_width + a * half_tile_width + fullscreen_x,
            b = Math.round(a * (half_tile_height + .5) - b * (half_tile_height + .5)) + fullscreen_y,
            a = d - tile_width,
            b = b + 0,
            e = d = 0;
        0 > a && (d = -a, a = 0);
        0 > b && (e = -b + 0, b = 0);
        ctx.base.drawImage(c.ground, a, b, large_offscreen_canvas_width - d, height - e - 0, d, e, large_offscreen_canvas_width - d,
            height - e - 0)
    }
}

function collectPlayerCoordinates() {
    player_map = my_map_array();
    var a = timestamp(),
        b;
    for (b in players) "object" == typeof players[b] && ("0" == b || players[b].b_t == BASE_TYPE.PET || 95E3 < players[b].ttl - a) && ("undefined" == typeof player_map[players[b].i][players[b].j] && (player_map[players[b].i][players[b].j] = []), player_map[players[b].i][players[b].j].push(players[b]))
}

function drawObjects() {
    if (map[current_map]) {
        Draw.clear(ctx.objects);
        collectPlayerCoordinates();
        for (var a = iMapBegin(), b = iMapTo(); a < b; a++)
            for (var d = jMapTo(), e = jMapBegin(); d >= e; d--) {
                var f = a + dx,
                    g = d + dy;
                if (player_map[f] && player_map[f][g] && 1 != minimap_scale)
                    for (var h = translateTileToCoordinates(f, g, !1), l = 0, m = player_map[f][g].length; l < m; l++) drawObject(h, player_map[f][g][l]);
                else on_map[current_map][f] && on_map[current_map][f][g] && !fullscreen_mode && (h = translateTileToCoordinates(f, g, !1), drawObject(h, obj_g(on_map[current_map][f][g])))
            }
    }
}

function drawMap(a, b, d) {
    if (no_render || Android && GAME_STATE != GAME_STATES.GAME || !map[current_map]) return !1;
    "undefined" == typeof a && (a = !0);
    "undefined" == typeof b && (b = !0);
    "undefined" == typeof d && (d = !0);
    minimap && (dx = dy = 0);
    a && !fullscreen_mode && drawGround();
    a && !minimap && fullscreen_mode && last_rendered_map != current_map && "undefined" != typeof map[current_map] && (renderGround(), last_rendered_map = current_map);
    a && !minimap && fullscreen_mode && drawGroundFull();
    b && (settings.draw_objects = !0, minimap && (drawObjects(), settings.draw_objects = !1));
    d && (players[0].mx = 0, players[0].my = 0, settings.update_minimap = !0, updateBase())
}

function toggleMaxScale() {
    switch (parseFloat(max_scale)) {
        case 2.25:
            max_scale = .75;
            break;
        case 2:
            max_scale = 2.25;
            break;
        case 1.75:
            max_scale = 2;
            break;
        case 1.5:
            max_scale = 1.75;
            break;
        case 1.25:
            max_scale = 1.5;
            break;
        case 1:
            max_scale = 1.25;
            break;
        case .75:
            max_scale = 1
    }
    1 <= parseInt(getParameterByName("node-webkit-api")) && setBrowserWindowSize(width * max_scale, height * max_scale);
    localStorage.max_scale = max_scale;
    setCanvasSize(!0)
}

function toggleGridSize() {
    switch (parseFloat(map_increase)) {
        case 4:
            map_increase = -2;
            break;
        case 2:
            map_increase = 4;
            break;
        case 0:
            map_increase = 2;
            break;
        case -2:
            map_increase = 0
    }
    localStorage.map_increase = map_increase;
    resetMapShift();
    drawMap();
    setCanvasSize(!0)
}
last_updated.set_canvas_size_new_width = 0;
last_updated.set_canvas_size_new_height = 0;

function setCanvasSize(a) {
    noRender();
    if (GAME_STATE == GAME_STATES.CHAT) return !1;
    if (!(!a && last_updated.set_canvas_size && last_updated.set_canvas_size > timestamp())) {
        last_updated.set_canvas_size = timestamp() + 250;
        var b = !1,
            d = !1,
            d = width / height;
        d > window.innerWidth / window.innerHeight ? (b = Math.round(Math.min(window.innerWidth, width * max_scale)), d = Math.round(Math.min(window.innerWidth / d, height * max_scale))) : (b = Math.round(Math.min(window.innerHeight * d, width * max_scale)), d = Math.round(Math.min(window.innerHeight, height *
            max_scale)));
        var e = 48;
        640 >= window.innerWidth ? (bigIcons = !0, e = 80) : bigIcons = !1;
        navigator.userAgent.match(/Android|mobile/i) ? window.scrollTo(0, 1) : window.scrollTo(0, 0);
        if (a || b != last_updated.set_canvas_size_new_width || d != last_updated.set_canvas_size_new_height) {
            last_updated.set_canvas_size_new_width = b;
            last_updated.set_canvas_size_new_height = d;
            massAssignText([{
                name: "settings_game_size_value",
                text: max_scale + "x"
            }, {
                name: "settings_game_grid_value",
                text: map_increase + 9 + "x" + (map_increase + 9)
            }, {
                name: "settings_centerscreen_value",
                text: Fullscreen.center_screen ? "on" : "off",
                translate: _ti
            }]);
            if (b && b != wrapper.style.width || d && d != wrapper.style.height || a) {
                wrapper.style.width = b + "px";
                wrapper.style.height = d + "px";
                current_ratio_x = b / width;
                current_ratio_y = d / height;
                for (var f in c) "undefined" != typeof c[f] && -1 == ["base", "objects", "players", "minimap"].indexOf(f) && (c[f].style.width = Math.round(width * current_ratio_x) + "px", c[f].style.height = Math.round(height * current_ratio_y) + "px");
                side.style.left = null;
                1.5 * b < window.innerWidth ? side.style.left = wrapper.offsetWidth -
                    80 - 5 + "px" : side.style.right = "5px";
                side_bottom.style.top = null;
                1.2 * d < window.innerHeight ? side_bottom.style.top = wrapper.offsetHeight - 40 - 10 + "px" : side_bottom.style.bottom = "10px;";
                a = Math.min(16, Math.round(16 * current_ratio_y));
                var b = Math.round(16 * current_ratio_y),
                    g = Math.min(14, Math.round(14 * current_ratio_y));
                f = Math.min(12, Math.round(12 * current_ratio_y));
                var d = Math.min(22, Math.round(20 * current_ratio_y)),
                    h = Math.round(Math.min(13 * current_ratio_y, 16));
                document.getElementById("toolbar_main_holder").style.fontSize =
                    h + "px";
                document.getElementById("toolbar_padding_holder").style.paddingTop = Math.floor(1.5 * current_ratio_y) + "px";
                document.getElementById("exp_toolbar_popup").style.top = Math.round(18 * current_ratio_y) + "px";
                document.getElementById("skills_menu").style.top = e * current_ratio_y + "px";
                document.getElementById("skills_menu").style.fontSize = g + "px";
                var l = UIHelper("skill_width");
                document.getElementById("skills_menu").style.width = l + "px";
                document.getElementById("skills_menu").style.maxWidth = l + "px";
                for (var l = document.getElementsByClassName("skill"),
                        m = 0, k = l.length; m < k; m++) l[m].style.fontSize = g + "px";
                l = document.getElementsByClassName("level");
                m = 0;
                for (k = l.length; m < k; m++) l[m].style.fontSize = f + "px";
                document.getElementById("inventory").style.top = e * current_ratio_y + "px";
                document.getElementById("small_pet_menu").style.top = e * current_ratio_y + "px";
                document.getElementById("small_build_menu").style.top = e * current_ratio_y + "px";
                document.getElementById("small_wilderness_menu").style.top = e * current_ratio_y + "px";
                document.getElementById("settings").style.top = e * current_ratio_y +
                    "px";
                document.getElementById("settings_spectate").style.top = e * current_ratio_y + "px";
                BigMenu.adjust_settings();
                m = document.getElementById("player_healthbar");
                m.style.top = Math.round(16 * current_ratio_y) + "px";
                m.style.left = Math.round(82 * current_ratio_y) + "px";
                e = Math.round(22 * current_ratio_y);
                g = Math.round(150 * current_ratio_x);
                l = Math.floor((e - a - 2) / 2);
                m.style.width = g + "px";
                m.style.height = e + "px";
                k = document.getElementById("player_xp_bar");
                k.style.left = m.style.left;
                k.style.width = m.style.width;
                document.getElementById("player_xp_name").style.fontSize =
                    h + "px";
                h = document.getElementById("multicombat_indicator");
                h.style.height = Math.max(32, Math.round(22 * current_ratio_y)) + "px";
                h.style.lineHeight = Math.max(32, Math.round(22 * current_ratio_y)) + "px";
                h.style.top = Math.round(16 * current_ratio_y) + "px";
                h.style.left = Math.round(234 * current_ratio_y) + "px";
                h.style.fontSize = a + "px";
                document.getElementById("player_health_name").style.top = l + "px";
                document.getElementById("player_health_name").style.fontSize = a + "px";
                h = document.getElementById("enemy_healthbar");
                h.style.top = Math.round(16 *
                    current_ratio_y + e + 4) + "px";
                h.style.left = Math.round(82 * current_ratio_y) + "px";
                h.style.height = e + "px";
                h.style.width = g + "px";
                document.getElementById("enemy_health_name").style.top = l + "px";
                document.getElementById("enemy_health_name").style.fontSize = a + "px";
                Chat.set_sizes();
                document.getElementById("player_hit").style.width = Math.ceil(20 * current_ratio_x) + "px";
                document.getElementById("player_hit").style.height = Math.ceil(20 * current_ratio_y) + "px";
                document.getElementById("player_burst").style.display = "block";
                document.getElementById("enemy_hit").style.width =
                    Math.ceil(20 * current_ratio_x) + "px";
                document.getElementById("enemy_hit").style.height = Math.ceil(20 * current_ratio_y) + "px";
                document.getElementById("enemy_burst").style.display = "block";
                document.getElementById("player_damage").style.fontSize = a + "px";
                document.getElementById("player_damage").style.top = Math.floor(2 * Math.min(current_ratio_x, current_ratio_y)) + "px";
                document.getElementById("enemy_damage").style.fontSize = a + "px";
                document.getElementById("enemy_damage").style.top = Math.floor(2 * Math.min(current_ratio_x,
                    current_ratio_y)) + "px";
                document.getElementById("object_selector_info").style.left = Math.ceil(400 * current_ratio_x) + "px";
                document.getElementById("object_selector_info").style.top = Math.ceil(16 * current_ratio_y) + "px";
                document.getElementById("object_selector_info").style.fontSize = a + "px";
                document.getElementById("quiver").style.top = Math.ceil(132 * current_ratio_y) + "px";
                document.getElementById("magic_slots").style.top = Math.ceil(132 * current_ratio_y) + "px";
                document.getElementById("build_menu").style.top = Math.ceil(50 *
                    current_ratio_y) + "px";
                document.getElementById("carpentry_remove_menu").style.top = Math.ceil(50 * current_ratio_y) + "px";
                document.getElementById("chat_button").style.left = Math.ceil(15 * current_ratio_x) + "px";
                document.getElementById("chat_button").style.bottom = Math.ceil(2 * current_ratio_y) + "px";
                document.getElementById("chat_button").style.width = Math.ceil(107 * current_ratio_y) + "px";
                document.getElementById("chat_button").style.height = b + "px";
                document.getElementById("chat_button").style.lineHeight = b + "px";
                document.getElementById("chat_button").style.fontSize =
                    a + "px";
                document.getElementById("filters_button").style.left = Math.ceil(138 * current_ratio_x) + "px";
                document.getElementById("filters_button").style.bottom = Math.ceil(2 * current_ratio_y) + "px";
                document.getElementById("filters_button").style.width = Math.ceil(107 * current_ratio_y) + "px";
                document.getElementById("filters_button").style.height = b + "px";
                document.getElementById("filters_button").style.lineHeight = b + "px";
                document.getElementById("filters_button").style.fontSize = a + "px";
                document.getElementById("contacts_button").style.left =
                    Math.ceil(261 * current_ratio_x) + "px";
                document.getElementById("contacts_button").style.bottom = Math.ceil(2 * current_ratio_y) + "px";
                document.getElementById("contacts_button").style.width = Math.ceil(107 * current_ratio_y) + "px";
                document.getElementById("contacts_button").style.height = b + "px";
                document.getElementById("contacts_button").style.lineHeight = b + "px";
                document.getElementById("contacts_button").style.fontSize = a + "px";
                document.getElementById("quests_button").style.left = Math.ceil(384 * current_ratio_x) + "px";
                document.getElementById("quests_button").style.bottom =
                    Math.ceil(2 * current_ratio_y) + "px";
                document.getElementById("quests_button").style.width = Math.ceil(107 * current_ratio_y) + "px";
                document.getElementById("quests_button").style.height = b + "px";
                document.getElementById("quests_button").style.lineHeight = b + "px";
                document.getElementById("quests_button").style.fontSize = a + "px";
                document.getElementById("dungeon_info").style.top = Math.ceil(94 * current_ratio_y) + "px";
                document.getElementById("dungeon_info").style.width = Math.ceil(80 * current_ratio_x) + "px";
                document.getElementById("dungeon_time").style.fontSize =
                    d + "px";
                document.getElementById("dungeon_goal").style.fontSize = f + "px";
                document.getElementById("gamepad").style.bottom = Math.ceil(12 * current_ratio_y) + "px";
                document.getElementById("atk_button").style.bottom = Math.ceil(12 * current_ratio_y + 38) + "px";
                touch_initialized ? document.getElementById("donation_button").style.left = Math.ceil(500 * current_ratio_x) + "px" : document.getElementById("donation_button").style.right = Math.ceil(20 * current_ratio_x) + "px";
                document.getElementById("donation_button").style.bottom = Math.ceil(1 *
                    current_ratio_y) + "px";
                document.getElementById("donation_button").style.fontSize = a - 1 + "px";
                document.getElementById("spectate_button").style.bottom = Math.ceil(1 * current_ratio_y) + "px";
                document.getElementById("spectate_button").style.fontSize = a - 1 + "px";
                BigMenu.update_double_xp_position();
                try {
                    Draw.clear(ctx.hud), HUD.drawMenu()
                } catch (v) {}
            }
            Fullscreen.supported() || SpectateWindow.fullscreen || Fullscreen.center_screen ? Fullscreen.is_enabled() || Fullscreen.center_screen ? (a = window.innerWidth / 2 - parseInt(wrapper.style.width) /
                2, wrapper.style.left != parseInt(a) && (wrapper.style.left = a + "px", body_offset_x = a), a = window.innerHeight / 2 - parseInt(wrapper.style.height) / 2, wrapper.style.top != parseInt(a) && (wrapper.style.top = a + "px", body_offset_y = a)) : (wrapper.style.top = "0px", wrapper.style.left = "0px", body_offset_y = body_offset_x = 0) : (wrapper.style.top = "0px", wrapper.style.left = "0px", body_offset_y = body_offset_x = 0);
            0 != body_offset_y || 0 != body_offset_x ? (wrapper.style.boxShadow = "0px 0px 10px 0px black", document.body.style.backgroundSize = "cover") :
                wrapper.style.boxShadow = "none";
            Toolbar.check_for_width()
        }
    }
}
HUD = {
    drawMenu: function() {
        var a = IMAGE_SHEET[IMAGES.ACTIVITIES[0].sheet].tile_width,
            b = IMAGE_SHEET[IMAGES.ACTIVITIES[0].sheet].tile_height;
        bigIcons && (a *= 2, b *= 2);
        for (var d = -1, e = 0, f = IMAGES.ACTIVITIES.length; e < f; e++)
            if (IMAGES.ACTIVITIES[e].visible) {
                d++;
                var g = IMAGES.ACTIVITIES[e],
                    h = IMAGE_SHEET[g.sheet];
                ctx.hud.drawImage(h.img[0], IMAGE_SHEET[g.sheet].tile_width * g.x, IMAGE_SHEET[g.sheet].tile_height * g.y, h.tile_width, h.tile_height, Math.round(width - a * (d + 1)), 16, a, b)
            }
        Draw.drawToMap(ctx.hud, IMAGES.GUI[0], {
            x: 0,
            y: 0,
            relative: !1
        });
        Draw.drawToMap(ctx.hud, IMAGES.GUI[1], {
            x: 0,
            y: height - 24,
            relative: !1
        })
    },
    drawMinimapLarge: function() {
        Draw.clear(ctx.hud);
        ctx.hud.drawImage(c.minimap, 0, 0)
    },
    drawMinimap: function() {
        var a = players[0].i,
            b = players[0].j;
        editor_enabled && (a = dx, b = dy);
        var d = b * Math.round(tile_width / 16) + a * Math.round(tile_width / 16) - 20,
            a = a * Math.round(tile_height / 16) - b * Math.round(tile_height / 16) + 190;
        ctx.hud.clearRect(0, 14, 80, 80);
        ctx.hud.drawImage(c.minimap, Math.max(d, 0), Math.max(a, 0), 80, 80, 0, 14, 80, 80);
        for (var e in players) "undefined" !=
            typeof players[e] && (d = translateTileToCoordinates(players[e].i + 13, players[e].j - 9), a = 3 * map_increase, a = (Math.round((d.x - dest_x) / 8) / 1.01 + .5 | 0) - a, d = 14 + Math.round((d.y - dest_y) / 8), 0 < a && 14 < d && 80 > a && 94 > d && (ctx.hud.fillStyle = players[e].me ? "#55FF55" : "#FFFFFF", ctx.hud.fillRect(a - 1, d, 1, 1)))
    },
    setRegularButtons: function() {
        var a = document.getElementById("action_button1"),
            b = document.getElementById("action_button2");
        a.style.display = "none";
        b.style.display = "none";
        if (selected_object && selected_object.params) {
            var d = selected_object.activities[0],
                e = selected_object.activities[1];
            d && (a.innerHTML = d, a.style.display = "block");
            e && (b.innerHTML = e, b.style.display = "block")
        }
    }
};
ActionMenu = {
    create: function(a, b, d) {
        b = b || translateMousePosition(a.clientX, a.clientY);
        if (map_visible(b.i, b.j)) {
            selected_object = obj_g(on_map[current_map][b.i][b.j]);
            if (!(selected_object instanceof Object)) {
                for (var e in players)
                    if ("0" != e && players[e].i == b.i && players[e].j == b.j)
                        if (players[e].b_t == BASE_TYPE.PLAYER) {
                            var f = ["Walk here", "Duel with", "Cancel"];
                            if (16 == players[0].map || 24 == players[0].map) f = ["Attack", "Walk here", "Cancel"], players[e].params.combat_level > FIGHT.calculate_monster_level(players[0]) && player_target !=
                                players[e].name && (f = ["Walk here", "Attack", "Cancel"]);
                            else if (19 == players[0].map || 22 == players[0].map) f = ["Walk here", "Cancel"], !players[e].params.pvp || players[0].temp.team && players[0].temp.team == players[e].temp.team || (f = ["Attack", "Walk here", "Cancel"]);
                            selected_object = {
                                activities: f,
                                name: players[e].name,
                                i: b.i,
                                j: b.j,
                                id: players[e].id,
                                fn: function(a, b) {
                                    switch (a) {
                                        case "walk here":
                                            active_menu = -1;
                                            BigMenu.show(active_menu);
                                            selected = b;
                                            players[0].path = findPathFromTo(players[0], b, players[0]);
                                            break;
                                        case "duel with":
                                            active_menu = -1;
                                            BigMenu.show(active_menu);
                                            selected_object = void 0;
                                            needsProximity(players[0], players[b.id], 1, !0, !0) ? Socket.send("duel_request", {
                                                player: b.name
                                            }) : selected_object = {};
                                            break;
                                        case "attack":
                                            player_target = b.name;
                                            if (Player.has_bow(players[0])) return selected_object = players[b.id], Archery.client_use(players[0], selected_object);
                                            needsProximity(players[0], players[b.id], 1, !0, !0) ? Socket.send("attack_player", {
                                                player: b.name
                                            }) : selected_object = {};
                                            break;
                                        case "cancel":
                                            selected_object = {}
                                    }
                                }
                            };
                            break
                        } else if (players[e].b_t ==
                    BASE_TYPE.PET && players[e].params.owner == players[0].id) {
                    selected_object = {
                        activities: ["Walk here", "Pet menu", "Cancel"],
                        name: players[e].name,
                        i: b.i,
                        j: b.j,
                        fn: function(a, b) {
                            switch (a) {
                                case "walk here":
                                    active_menu = -1;
                                    BigMenu.show(active_menu);
                                    selected = b;
                                    players[0].path = findPathFromTo(players[0], b, players[0]);
                                    break;
                                case "pet menu":
                                    active_menu = -1;
                                    BigMenu.show(active_menu);
                                    selected_object = void 0;
                                    Pet.init_menu();
                                    break;
                                case "cancel":
                                    selected_object = {}
                            }
                        }
                    };
                    break
                }
                selected_object instanceof Object || (selected_object = {
                    activities: ["Walk here", "Cancel"],
                    name: "",
                    i: b.i,
                    j: b.j,
                    fn: function(a, b) {
                        switch (a) {
                            case "walk here":
                                active_menu = -1;
                                BigMenu.show(active_menu);
                                selected = b;
                                players[0].path = findPathFromTo(players[0], b, players[0]);
                                break;
                            case "cancel":
                                selected_object = {}
                        }
                    }
                })
            }
            d || (d = document.getElementById("action_menu"), addClass(d, "hidden"), d.style.top = a.clientY + 10 + "px", d.style.left = a.clientX + "px", d.innerHTML = ActionMenu.action(selected_object, 0) + ActionMenu.action(selected_object, 1) + ActionMenu.action(selected_object, 2), 0 < d.innerHTML.length &&
                removeClass(d, "hidden"))
        }
    },
    act: function(a) {
        selected_object && selected_object.activities && selected_object.activities[a] && selected_object.fn(selected_object.activities[a].toLowerCase(), selected_object, players[0]);
        ActionMenu.hide()
    },
    hide: function() {
        var a = document.getElementById("action_menu");
        addClass(a, "hidden")
    },
    action: function(a, b) {
        if (a && a.activities[b] && 0 < a.activities[b].length) {
            var d = a.activities[b];
            if ("Harvest" == a.activities[b]) d = Farming.next_action(a).action;
            else if ("Rotate" == a.activities[b] &&
                (!my_island() || 300 != current_map)) return "";
            return "<span class='line' onclick='ActionMenu.act(" + b + ")'>" + _ti(d) + (0 <= ["Walk here", "Cancel"].indexOf(d) ? "" : "<span class='item'>" + _tn(a.name) + "</span>") + "</span>"
        }
        return ""
    },
    custom_create: function(a, b) {
        var d = document.getElementById("action_menu");
        addClass(d, "hidden");
        d.style.top = a.clientY + 10 + "px";
        d.style.left = a.clientX + "px";
        for (var e = "", f = 0; f < b.length; f++) e += ActionMenu.custom_action(f, b[f].method, b[f].name, b[f].func);
        0 < e.length && (d.innerHTML = e, removeClass(d,
            "hidden"))
    },
    custom_action: function(a, b, d, e) {
        ActionMenu.act_func[a] = e;
        return "<span class='line' onclick='ActionMenu.act_custom(" + a + ")'>" + _ti(b) + "<span class='item'>" + _tn(d) + "</span></span>"
    },
    act_custom: function(a) {
        var b = document.getElementById("action_menu");
        addClass(b, "hidden");
        ActionMenu.act_func[a]()
    },
    act_func: {}
};

function elementXY(a) {
    a = document.getElementById(a).getBoundingClientRect();
    return {
        left: a.left,
        top: a.top
    }
}
InvMenu = {
    active: 0,
    create: function(a) {
        if (null != document.getElementById("inv_" + a)) {
            var b = players[0].temp.inventory[a];
            if ("undefined" != typeof b) {
                var d = item_base[b.id],
                    e = elementXY("inv_" + a),
                    f = document.getElementById("action_menu");
                addClass(f, "hidden");
                f.style.top = e.top + 10 + "px";
                f.style.left = e.left - 100 + "px";
                e = "";
                if (d.params.archery_speed || 10 == d.params.slot) e = "<span class='line' onclick='InvMenu.use_all(" + b.id + ")'>" + _ti("Use all") + "<span class='item'>" + _tn(d.name) + "</span></span>";
                f.innerHTML = "<span class='line' onclick='InvMenu.use(" +
                    a + ")'>" + _ti("Use") + "<span class='item'>" + _tn(d.name) + "</span></span>" + e + "<span class='line' onclick='InvMenu.inspect(" + a + ")'>" + _ti("Inspect") + "<span class='item'>" + _tn(d.name) + "</span></span>";
                Chest.is_open() && (f.innerHTML += "<span class='line' onclick='InvMenu.deposit(1," + a + ")'>" + _ti("Deposit 1") + "<span class='item'>" + _tn(d.name) + "</span></span>", 1 < Inventory.get_item_count(players[0], b.id) && (f.innerHTML += "<span class='line' onclick='InvMenu.deposit(40," + a + ")'>" + _ti("Deposit all") + "<span class='item'>" +
                    _tn(d.name) + "</span></span>"), 0 < Chest.player_chest_item_count(0, b.id) && 40 > players[0].temp.inventory.length && (f.innerHTML += "<span class='line' onclick='InvMenu.withdraw(" + a + ")'>" + _ti("Withdraw X") + "<span class='item'>" + _tn(d.name) + "</span></span>"));
                f.innerHTML += "<span class='line' onclick='InvMenu.destroy_item(" + a + ")'>" + _ti("Destroy") + "<span class='item'>" + _tn(d.name) + "</span></span>";
                f.innerHTML += "<span class='line' onclick='InvMenu.destroy_item_all(" + a + ")'>" + _tm("Destroy All") + "<span class='item'>" +
                    _tn(d.name) + "</span></span>";
                0 < f.innerHTML.length && removeClass(f, "hidden");
                setTimeout(function() {
                    BigMenu.show(2)
                }, 2)
            }
        }
    },
    use: function(a) {
        inventoryClick(a);
        InvMenu.hide()
    },
    use_all: function(a) {
        Socket.send("use_all", {
            id: a
        });
        InvMenu.hide()
    },
    destroy_item: function(a) {
        InvMenu.hide();
        var b = players[0].temp.inventory[a];
        "undefined" != typeof b && Popup.prompt(_ti("Do you want to destroy {item_name}?", {
            item_name: item_base[b.id].name
        }), function() {
            Socket.send("inventory_destroy", {
                item_id: b.id
            })
        })
    },
    destroy_item_all: function(a) {
        InvMenu.hide();
        var b = players[0].temp.inventory[a];
        "undefined" != typeof b && Popup.prompt(_tm("Do you want to destroy all {item_name}?", {
            item_name: item_base[b.id].name
        }), function() {
            Socket.send("inventory_destroy", {
                item_id: b.id,
                all: !0
            })
        })
    },
    inspect: function(a) {
        a = players[0].temp.inventory[a];
        "undefined" != typeof a && Items.get_info(a.id);
        InvMenu.hide()
    },
    deposit: function(a, b) {
        var d = players[0].temp.inventory[b];
        if ("undefined" != typeof d) {
            a = Math.min(a, Inventory.get_item_count(players[0], d.id));
            var e = Chest.player_find_item_index(0,
                d.id);
            if ("undefined" == typeof e) return addChatText(_te("Chest is full!"), null, COLOR.PINK);
            "undefined" != typeof Mods && Mods.Chestm.tempChest && (e = Mods.Chestm.tempChest[d.id]);
            Socket.send("chest_deposit", {
                item_id: d.id,
                item_slot: e,
                target_id: chest_npc.id,
                target_i: chest_npc.i,
                target_j: chest_npc.j,
                amount: a
            });
            InvMenu.hide()
        }
    },
    last_withdraw_amount: 1,
    withdraw: function(a) {
        var b = players[0].temp.inventory[a];
        if ("undefined" != typeof b) {
            a = Math.min(40 - players[0].temp.inventory.length, Chest.player_chest_item_count(0,
                b.id));
            var d = Math.min(InvMenu.last_withdraw_amount, a),
                e = Chest.player_find_item_index(0, b.id);
            "undefined" != typeof Mods && Mods.Chestm.tempChest && (e = Mods.Chestm.tempChest[b.id]);
            d = {
                min: 1,
                max: a,
                default_value: d,
                max_visible: !0
            };
            Popup.number_input_prompt(_ti("How many to withdraw? Maximum is {amount}", {
                amount: a
            }), d, function(a) {
                InvMenu.last_withdraw_amount = a;
                Socket.send("chest_withdraw", {
                    item_id: b.id,
                    item_slot: e,
                    target_id: chest_npc.id,
                    target_i: chest_npc.i,
                    target_j: chest_npc.j,
                    amount: a
                })
            });
            InvMenu.hide()
        }
    },
    hide: function() {
        var a = document.getElementById("inventory");
        addClass(a, "hidden");
        ActionMenu.hide()
    }
};
var ChestMenu = {
    create: function(a, b) {
        selected_chest = a;
        if (null != document.getElementById("chest_" + a)) {
            var d = item_base[b],
                e = elementXY("chest_" + a),
                f = document.getElementById("action_menu");
            addClass(f, "hidden");
            f.style.top = e.top + 10 + "px";
            f.style.left = e.left - 100 + "px";
            f.innerHTML = "";
            40 > players[0].temp.inventory.length && (1 < Chest.player_chest_item_count(0, b) ? f.innerHTML += "<span class='line' onclick='ChestMenu.withdraw(false, " + b + ");'>" + _ti("Withdraw X") + "<span class='item'>" + _tn(d.name) + "</span></span>" : 0 < Chest.player_chest_item_count(0,
                b) && (f.innerHTML += "<span class='line' onclick='ChestMenu.withdraw(1);'>" + _ti("Withdraw") + "<span class='item'>" + _tn(d.name) + "</span></span>"));
            1 < Inventory.get_item_count(players[0], b) ? f.innerHTML += "<span class='line' onclick='ChestMenu.deposit(false, " + b + ");'>" + _ti("Deposit X") + "<span class='item'>" + _tn(d.name) + "</span></span>" : 0 < Inventory.get_item_count(players[0], b) && (f.innerHTML += "<span class='line' onclick='ChestMenu.deposit(1);'>" + _ti("Deposit") + "<span class='item'>" + _tn(d.name) + "</span></span>");
            f.innerHTML += "<span class='line' onclick='Market.find_buy(" + b + ");ActionMenu.hide();'>" + _ti("Market Buy") + "<span class='item'>" + _tn(d.name) + "</span></span>";
            f.innerHTML += "<span class='line' onclick='Market.find_sell(" + b + ");ActionMenu.hide();'>" + _ti("Market Sell") + "<span class='item'>" + _tn(d.name) + "</span></span>";
            f.innerHTML += "<span class='line' onclick='ActionMenu.hide();'>" + _ti("Cancel") + "</span>";
            0 < f.innerHTML.length && removeClass(f, "hidden")
        }
    },
    last_withdraw_amount: 1,
    withdraw: function(a, b) {
        if (a) Chest.withdraw(a);
        else {
            var d = Math.min(40 - players[0].temp.inventory.length, Chest.player_chest_item_count(0, b)),
                e = Math.min(ChestMenu.last_withdraw_amount, d),
                e = {
                    min: 1,
                    max: d,
                    default_value: e,
                    max_visible: !0
                };
            Popup.number_input_prompt(_ti("How many to withdraw? Maximum is {amount}", {
                amount: d
            }), e, function(a) {
                ChestMenu.last_withdraw_amount = a;
                Chest.withdraw(a)
            })
        }
        ActionMenu.hide()
    },
    deposit: function(a, b) {
        if (a) Chest.deposit(a);
        else {
            var d = Inventory.get_item_count(players[0], b),
                e = {
                    min: 1,
                    max: d,
                    default_value: d
                };
            Popup.number_input_prompt(_ti("How many to deposit? Maximum is {amount}", {
                amount: d
            }), e, function(a) {
                Chest.deposit(a)
            })
        }
        ActionMenu.hide()
    }
};
BigMenu = {
    adjust_settings: function() {
        var a = 0,
            a = Math.max(TopIcons.visible * (bigIcons ? 64 : 32) * current_ratio_x - 210, 0);
        document.getElementById("settings").style.right = a + "px";
        document.getElementById("settings_spectate").style.right = a + "px"
    },
    update_double_xp_position: function() {
        var a = TopIcons.visible,
            b = bigIcons ? 64 : 32,
            d = document.getElementById("double_xp_holder");
        d.style.right = Math.round((b * a + 4) * current_ratio_x) + "px";
        d.style.top = 23 * current_ratio_y + "px"
    },
    set_double_xp: function() {
        var a = document.getElementById("double_xp_holder");
        if (double_xp_timer < timestamp()) return addClass(a, "hidden");
        removeClass(a, "hidden");
        document.getElementById("double_xp_timer_value").textContent = doubleXPTimeLeft();
        Timers.set("double_xp_timer", function() {
            BigMenu.set_double_xp()
        }, 1E3)
    },
    show: function(a) {
        var b = document.getElementById("skills_menu");
        addClass(b, "hidden-hack");
        var d = document.getElementById("inventory");
        addClass(d, "hidden");
        var e = document.getElementById("settings");
        addClass(e, "hidden");
        var f = document.getElementById("settings_spectate");
        addClass(f,
            "hidden");
        var g = document.getElementById("small_pet_menu");
        addClass(g, "hidden");
        var h = document.getElementById("small_build_menu");
        addClass(h, "hidden");
        var l = document.getElementById("small_wilderness_menu");
        addClass(l, "hidden");
        3 == a ? (BigMenu.show_skills(), removeClass(b, "hidden-hack")) : 2 == a ? (BigMenu.show_inventory(), removeClass(d, "hidden")) : 0 == a ? (GAME_STATE == GAME_STATES.SPECTATE ? removeClass(f, "hidden") : removeClass(e, "hidden"), BigMenu.adjust_settings()) : 5 == a ? removeClass(g, "hidden") : 4 == a ? (removeClass(h,
            "hidden"), h.innerHTML = HandlebarTemplate.small_build_menu()({
            building: !0,
            remove: 300 == current_map || 0 <= guild_data.permissions.indexOf(players[0].name)
        })) : 6 == a && (BigMenu.show_wilderness(), removeClass(l, "hidden"))
    },
    show_skills: function() {
        document.getElementById("skills_menu");
        for (var a in skills[0]) document.getElementById("skill_" + a).innerHTML = skills[0][a].current + "/" + skills[0][a].level, selected_skill == a && (document.getElementById("skill_name").innerHTML = _ti(capitaliseFirstLetter(a)), document.getElementById("total_xp").innerHTML =
            Math.round(skills[0][a].xp), document.getElementById("next_xp").innerHTML = Math.round(Level.xp_for_level(skills[0][a].level + 1) - skills[0][a].xp));
        document.getElementById("status_aim").innerHTML = players[0].temp.aim;
        document.getElementById("status_power").innerHTML = players[0].temp.power;
        document.getElementById("status_armor").innerHTML = players[0].temp.armor;
        document.getElementById("status_magic").innerHTML = players[0].temp.magic;
        document.getElementById("status_archery").innerHTML = players[0].temp.archery;
        document.getElementById("status_speed").innerHTML = " " + 2 * (players[0].params.speed - 150)
    },
    show_inventory: function() {
        "undefined" != typeof players[0].temp.inventory[selected_inv] ? document.getElementById("inv_name").innerHTML = _tn(item_base[players[0].temp.inventory[selected_inv].id].name) : document.getElementById("inv_name").innerHTML = "&nbsp;"
    },
    show_wilderness: function() {
        document.getElementById("danger_level").innerHTML = Player.danger_level(players[0])
    },
    show_remove_skill_dialog: function() {
        document.getElementById("remove_skill").style.display =
            "block"
    },
    hide_remove_skill_dialog: function() {
        document.getElementById("remove_skill").style.display = "none"
    },
    init_inventory: function() {
        for (var a = 0; 40 > a; a++) {
            var b = document.getElementById("inv_" + a);
            removeClass(b, "selected");
            "undefined" != typeof players[0].temp.inventory[a] ? (b.style.background = Items.get_background(players[0].temp.inventory[a].id), players[0].temp.inventory[a].selected && addClass(b, "selected")) : b.style.background = ""
        }
        document.getElementById("inv_coins").innerHTML = thousandSeperate(players[0].temp.coins) +
            " " + _ti("coins")
    },
    open_chest: function(a, b) {
        for (var d = 0; 60 > d; d++) {
            var e = document.getElementById("chest_" + d);
            e.style.background = "";
            e.childNodes[0].innerHTML = "&nbsp;"
        }
        chest_page = b;
        BigMenu.update_chest(a);
        removeClass(document.getElementById("chest"), "hidden");
        for (d = 2; 5 >= d; d++) document.getElementById("chest_page_" + d).innerHTML = "+";
        addClass(document.getElementById("chest_page_3"), "hidden");
        addClass(document.getElementById("chest_page_4"), "hidden");
        addClass(document.getElementById("chest_page_5"), "hidden");
        removeClass(document.getElementById("chest_page_1"), "active_link");
        removeClass(document.getElementById("chest_page_2"), "active_link");
        removeClass(document.getElementById("chest_page_3"), "active_link");
        removeClass(document.getElementById("chest_page_4"), "active_link");
        removeClass(document.getElementById("chest_page_5"), "active_link");
        addClass(document.getElementById("chest_page_" + chest_page), "active_link");
        2 <= players[0].params.chest_pages && (document.getElementById("chest_page_2").innerHTML = "2", removeClass(document.getElementById("chest_page_3"),
            "hidden"), 3 <= players[0].params.chest_pages && (document.getElementById("chest_page_3").innerHTML = "3", removeClass(document.getElementById("chest_page_4"), "hidden"), 4 <= players[0].params.chest_pages && (document.getElementById("chest_page_4").innerHTML = "4", removeClass(document.getElementById("chest_page_5"), "hidden"), 5 <= players[0].params.chest_pages && (document.getElementById("chest_page_5").innerHTML = "5"))))
    },
    update_chest: function(a) {
        chest_content = a;
        document.getElementById("chest_coins_amount").innerHTML =
            thousandSeperate(players[0].temp.coins);
        for (var b = chest_page - 1, d = 60 * b, e = Math.min(a.length, 60 * b + 60); d < e; d++) {
            var f = document.getElementById("chest_" + (d - 60 * b)),
                g = item_base[a[d].id];
            g.b_i == chest_item_id && (selected_chest = d - 60 * b);
            f.style.background = Items.get_background(g.b_i);
            for (var f = f.childNodes[0], g = a[d].count, h = Inventory.get_item_count(players[0], a[d].id), l = "", m = 0, k = 6 - g.toString().length - h.toString().length; m < k; m++) l += "&nbsp;";
            f.innerHTML = g + l + h
        }
        BigMenu.update_chest_selection()
    },
    update_chest_selection: function() {
        var a =
            chest_page - 1,
            a = parseInt(selected_chest) + 60 * a;
        if ("undefined" != typeof chest_content[a]) {
            var b = item_base[chest_content[a].id];
            document.getElementById("chest_item").innerHTML = _tn(b.name);
            0 < chest_content[a].count ? (document.getElementById("chest_withdraw").innerHTML = _ti("Withdraw"), 8 <= chest_content[a].count ? document.getElementById("chest_withdraw_8").innerHTML = "8" : document.getElementById("chest_withdraw_8").innerHTML = "", document.getElementById("chest_destroy").innerHTML = _ti("Destroy")) : (document.getElementById("chest_withdraw").innerHTML =
                "", document.getElementById("chest_withdraw_8").innerHTML = "", document.getElementById("chest_destroy").innerHTML = "");
            0 != chest_content[a].count && (document.getElementById("chest_destroy").innerHTML = _ti("Destroy"));
            0 < Inventory.get_item_count(players[0], b.b_i) ? (document.getElementById("chest_deposit").innerHTML = _ti("Deposit"), document.getElementById("chest_deposit_all").innerHTML = _ti("All")) : (document.getElementById("chest_deposit").innerHTML = "", document.getElementById("chest_deposit_all").innerHTML = "")
        } else document.getElementById("chest_item").innerHTML =
            "", document.getElementById("chest_withdraw").innerHTML = "", document.getElementById("chest_withdraw_8").innerHTML = "", document.getElementById("chest_destroy").innerHTML = "", document.getElementById("chest_deposit").innerHTML = "", document.getElementById("chest_deposit_all").innerHTML = ""
    },
    open_makeover: function(a) {
        document.getElementById("makeover_form").style.display = "block";
        document.getElementById("makeover_player_name").innerHTML = players[0].name;
        current_makeover_conf = {
            head: players[0].params.d_head,
            body: players[0].params.d_body,
            facial_hair: players[0].params.d_facial_hair,
            pants: players[0].params.d_pants
        };
        BigMenu.update_makeover()
    },
    update_makeover: function() {
        var a = document.getElementById("makeover_character").getContext("2d"),
            b = getEmptyPlayer(),
            d = current_makeover_conf;
        b.params.hash = d.head + " " + d.facial_hair + " " + d.body + " " + d.pants + " 0 0 0 0 0 0 0";
        a.clearRect(0, 0, 64, 64);
        Draw.drawPlayer(a, b, {
            x: 6,
            y: 32,
            relative: !1
        }); - 1 < GENDER_HEADS[GENDER.FEMALE].indexOf(d.head) ? addClass(document.getElementById("makeover_facial_hair"), "hidden") :
            removeClass(document.getElementById("makeover_facial_hair"), "hidden")
    },
    open_shop: function(a) {
        BigMenu.update_shop(a);
        removeClass(document.getElementById("shop"), "hidden")
    },
    update_shop: function(a) {
        if (shop_content && shop_content.length != a.length)
            for (var b = 0; 60 > b; b++) {
                var d = document.getElementById("shop_" + b);
                d.style.background = "";
                d.childNodes[0].innerHTML = "&nbsp;"
            }
        shop_content = a;
        document.getElementById("shop_coins_amount").innerHTML = thousandSeperate(players[0].temp.coins);
        for (var b = 0, e = a.length; b < e; b++) {
            var d =
                document.getElementById("shop_" + b),
                f = item_base[a[b].id],
                g = a[b].count,
                h = "";
            0 < g && (h = "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), ");
            d.style.background = h + Items.get_background(f.b_i);
            for (var d = d.childNodes[0], f = Inventory.get_item_count(players[0], a[b].id), h = "", l = 0, m = 6 - g.toString().length - f.toString().length; l < m; l++) h += "&nbsp;";
            0 < f && (f = "<span style='color:" + COLOR.GREEN + "'>" + f + "</span>");
            d.innerHTML = g + h + f
        }
        BigMenu.update_shop_selection()
    },
    update_shop_selection: function() {
        if ("undefined" !=
            typeof shop_content[selected_shop]) {
            var a = item_base[shop_content[selected_shop].id];
            document.getElementById("shop_item").innerHTML = _tn(a.name);
            0 < shop_content[selected_shop].count ? document.getElementById("shop_buy").innerHTML = _ti("Buy for {price}", {
                price: thousandSeperate(a.params.price)
            }) : document.getElementById("shop_buy").innerHTML = "";
            if (0 < Inventory.get_item_count(players[0], a.b_i)) {
                var b = Math.floor(a.params.price / 2);
                shop_npc && shop_npc.temp.general && (b = Math.floor(a.params.price * shop_npc.temp.general));
                document.getElementById("shop_sell").innerHTML = _ti("Sell one for {price}", {
                    price: thousandSeperate(b)
                });
                document.getElementById("shop_sell_all").innerHTML = _ti("Sell all")
            } else document.getElementById("shop_sell").innerHTML = "", document.getElementById("shop_sell_all").innerHTML = ""
        } else document.getElementById("shop_item").innerHTML = "", document.getElementById("shop_buy").innerHTML = "", document.getElementById("shop_sell").innerHTML = "", document.getElementById("shop_sell_all").innerHTML = ""
    },
    in_a_fight: function(a,
        b) {
        "undefined" !== typeof a && (document.getElementById("player_health").style.width = Math.round(a.temp.health / a.params.health * 100) + "%", document.getElementById("player_health_name").innerHTML = a.name, removeClass(document.getElementById("player_healthbar"), "hidden"), inAFight = !0, Timers.clear("player_using_skill" + players[0].id));
        "undefined" !== typeof b && (FIGHT.multi_combat(b) && (monster_target_id != b.id && (document.getElementById("multicombat_percent").innerHTML = "0%"), removeClass(document.getElementById("multicombat_indicator"),
            "hidden")), monster_target_id = b.id, document.getElementById("enemy_health").style.width = Math.round(b.temp.health / b.params.health * 100) + "%", document.getElementById("enemy_health_name").innerHTML = _tn(b.name) + "(" + FIGHT.calculate_monster_level(b) + ")", removeClass(document.getElementById("enemy_healthbar"), "hidden"), lastRunAwayAttempt = timestamp())
    },
    in_a_fight_hide: function(a) {
        if (a == monster_target_id || a == players[0].id) players[0].temp.healthbar || addClass(document.getElementById("player_healthbar"), "hidden"),
            addClass(document.getElementById("enemy_healthbar"), "hidden"), addClass(document.getElementById("multicombat_indicator"), "hidden"), inAFight = !1
    },
    show_damage: function(a, b, d) {
        if ("0" == b.id) var e = "player_hit";
        else b.b_t == BASE_TYPE.NPC ? e = "enemy_hit" : b.b_t == BASE_TYPE.PLAYER && (e = "player_hit");
        0 < a && b.anim ? addAnimation(Magic[b.anim].animation, b.i, b.j, b.map) : 0 == a && addAnimation(Magic[HIT_ANIMATION.BLOCK].animation, b.i, b.j, b.map);
        var f = document.getElementById(e).cloneNode(!0);
        f.id = e + b.id + (new Date).getTime();
        removeClass(f,
            "hidden");
        b = translateTileToCoordinates(b.i, b.j);
        f.innerHTML = document.getElementById(e).innerHTML;
        d && addClass(f.childNodes[0], "player_hit_max");
        f.childNodes[1].innerHTML = a;
        wrapper.appendChild(f);
        f.style.left = (b.x + 16 + players[0].mx) * current_ratio_x + "px";
        f.style.top = (b.y - 40 + players[0].my) * current_ratio_y + "px";
        addClass(f, "opacity_100");
        setTimeout(function() {
            decreaseOpacity(f, 150, 10)
        }, 150)
    },
    show_use_skill: function(a, b) {
        if (!map_visible(b.i, b.j)) return !1;
        var d = document.getElementById("use_tool").cloneNode(!0);
        d.id = "use_tool" + Math.random() + (new Date).getTime();
        removeClass(d, "hidden");
        var e = translateTileToCoordinates(b.i, b.j),
            f;
        if ("object" == typeof a) {
            f = a[0];
            var g = 1500 / a.length,
                h = function(a, b, d, e) {
                    a && b.length != d && (a.style.background = Items.get_background(b[d]).replace("transparent", "#AAAAAA"), setTimeout(function() {
                        h(a, b, d + 1, e)
                    }, e))
                };
            setTimeout(function() {
                h(d, a, 1, g)
            }, g)
        } else f = a;
        d.style.background = Items.get_background(item_base[f].b_i).replace("transparent", "#AAAAAA");
        wrapper.appendChild(d);
        d.style.left = (e.x +
            players[0].mx + half_tile_width_round) * current_ratio_x - 16 + "px";
        d.style.top = (e.y + players[0].my - half_tile_height_round) * current_ratio_y - 36 + "px";
        addClass(d, "opacity_100");
        setTimeout(function() {
            decreaseOpacity(d, 150, 10)
        }, 150)
    },
    show_skill_xp_effect: function(a, b) {
        if (0 != a && !inAFight && -1 == ["health"].indexOf(b)) {
            var d = document.createElement("span");
            d.id = "skill_xp_effect" + Math.random() + (new Date).getTime();
            d.className = "skill_xp_effect_holder opacity_100";
            d.innerHTML = '<span class="skill_xp_effect"><span style="color:' +
                COLOR.TEAL + '">' + _ti(capitaliseFirstLetter(b)) + "</span> +" + a + _ti("xp") + "</span>";
            var e = players[0],
                f = translateTileToCoordinates(e.i, e.j);
            d.style.left = (f.x + e.mx + half_tile_width_round) * current_ratio_x - 150 + "px";
            d.style.top = (f.y + 32 + e.my) * current_ratio_y + "px";
            wrapper.appendChild(d);
            setTimeout(function() {
                decreaseOpacity(d, 100, 10)
            }, 100);
            var g = 0;
            requestAnimationFrame(function l(a) {
                g || (g = a);
                var b = (a - g) / 1E3;
                g = a;
                a = parseInt(d.style.top);
                d.style.top = a - 1 * current_ratio_y * b + "px";
                d.parentNode && requestAnimationFrame(l)
            })
        }
    },
    show_quiver: function() {
        var a = document.getElementById("quiver");
        players[0].params.archery && players[0].params.archery.quiver ? (a.style.display = "block", a.style.height = "33px", a.innerHTML = HandlebarTemplate.quiver()(players[0].params.archery)) : a.style.display = "none"
    },
    show_magic_slots: function() {
        var a = document.getElementById("magic_slots");
        0 == players[0].params.magic_slots ? a.style.display = "none" : (a.style.display = "block", a.style.height = 33 * players[0].params.magic_slots + "px", a.innerHTML = HandlebarTemplate.magic_slots()({
            magics: players[0].params.magics.slice(0,
                players[0].params.magic_slots)
        }), BigMenu.update_magic_slots())
    },
    update_magic_slots: function(a) {
        var b = 0,
            d = players[0].params.magic_slots - 1;
        "undefined" != typeof a && (d = b = a);
        for (a = b; a <= d; a++) b = document.getElementById("magic_slot_" + a), null != b && players[0].params.magics[a].ready && (b.style.backgroundPosition = "0px -64px")
    }
};

function decreaseOpacity(a, b, d) {
    var e = /opacity_([0-9]{1,3})/.exec(a.className)[1].trim();
    0 < e ? (removeClass(a, "opacity_" + e), addClass(a, "opacity_" + (e - d)), setTimeout(function() {
        decreaseOpacity(a, b, d)
    }, b)) : a.parentNode.removeChild(a)
}

function updateMouseSelector(a) {
    if (!mouse_over_magic && !mouse_over_quiver) {
        a.clientX = a.clientX || a.pageX || a.touches && a.touches[0].pageX;
        a.clientY = a.clientY || a.pageY || a.touches && a.touches[0].pageY;
        var b = translateMousePosition(a.clientX, a.clientY);
        a = "";
        var d = "#FFFF00";
        if (b && map_visible(b.i, b.j) && on_map[current_map] && on_map[current_map][b.i] && on_map[current_map][b.i]) {
            var e;
            (e = obj_g(on_map[current_map][b.i][b.j])) || (e = player_map[b.i] && player_map[b.i][b.j] ? player_map[b.i][b.j][0] : !1);
            e && e.name && "Name" !=
                e.name && (a = e.name, e.b_t == BASE_TYPE.PLAYER ? (d = "#FFFFFF", a += "(" + FIGHT.calculate_monster_level(e) + ")") : a = _tn(a), e.b_t == BASE_TYPE.NPC && (a = e.type == OBJECT_TYPE.SHOP ? a + "(NPC)" : a + ("(" + FIGHT.calculate_monster_level(e) + ")")), editor_enabled && (a += "(i: " + b.i + ", j:" + b.j + ")", e.blocking && (a += "(B)")))
        }
        editor_enabled && (e = b.i - dx, b = b.j - dy, 10 < b && 11 > e && 1 < e && (b = e - 2 + 9 * (16 - b) + editor_page * editor_page_size, b < BASE_TYPE[tileset].length && 0 <= b && b < (editor_page + 1) * editor_page_size && (a = BASE_TYPE[tileset][b].name, BASE_TYPE[tileset][b].blocking &&
            (a += "(B)"))));
        document.getElementById("object_selector_info").innerHTML = a;
        document.getElementById("object_selector_info").style.color = d
    }
}
var MapTimer = {
    title: function() {
        return !1
    },
    end_time: 0,
    map: -1,
    decrease: !0,
    init: function(a, b, d, e) {
        MapTimer.title = a;
        MapTimer.map = d;
        MapTimer.end_time = b;
        MapTimer.decrease = e;
        Timers.set("map_timer_display", function() {
            MapTimer.update()
        }, 1E3)
    },
    format_time: function(a) {
        var b = Math.floor(a / 60);
        a -= 60 * b;
        10 > a && (a = "0" + a);
        return b + ":" + a
    },
    update: function() {
        document.getElementById("dungeon_info").style.display = "block";
        MapTimer.set_title();
        var a;
        a = MapTimer.decrease ? -secondsPastDelta(MapTimer.end_time) : secondsPastDelta(MapTimer.end_time);
        if (0 >= a) MapTimer.hide();
        else {
            var b = Math.floor(a / 60),
                d = a - 60 * b;
            10 > d && (d = "0" + d);
            document.getElementById("dungeon_time").innerHTML = MapTimer.format_time(a);
            0 >= parseInt(b) && 0 >= parseInt(d) ? MapTimer.hide() : MapTimer.map != current_map ? MapTimer.hide() : Timers.set("map_timer_display", function() {
                MapTimer.update()
            }, 1E3)
        }
    },
    set_title: function() {
        var a = !1;
        try {
            a = MapTimer.title()
        } catch (b) {}
        a ? (document.getElementById("dungeon_goal").style.display = "block", document.getElementById("dungeon_goal").innerHTML = a) : document.getElementById("dungeon_goal").style.display =
            "none"
    },
    hide: function() {
        document.getElementById("dungeon_info").style.display = "none";
        Timers.clear("map_timer_display")
    }
};

function saveMapToFile() {
    var a = fullscreen_mode;
    fullscreen_mode = !1;
    minimap && Editor.toggle_minimap(!0);
    c.minimap = document.createElement("canvas");
    c.minimap.width = 6.4 * width;
    c.minimap.height = 6 * height;
    ctx.minimap = c.minimap.getContext("2d");
    minimap_scale = 1;
    Editor.toggle_minimap();
    c.minimap.toBlob(function(a) {
        saveAs(a, "map" + current_map + ".png")
    });
    c.minimap = document.createElement("canvas");
    c.minimap.width = width;
    c.minimap.height = height;
    ctx.minimap = c.minimap.getContext("2d");
    fullscreen_mode = a;
    Editor.toggle_minimap(!0);
    minimap_scale = .125;
    setCanvasSize(!0);
    Editor.toggle_minimap();
    Editor.toggle_minimap();
    refreshHUD()
}
var original_translateTileToCoordinates, last_rendered_map = -1;

function renderGround() {
    original_translateTileToCoordinates = original_translateTileToCoordinates || translateTileToCoordinates; - 1 == last_rendered_map && (translateTileToCoordinates = function(a, b, d) {
        if (!minimap || minimap && 1 == minimap_scale) var e = (a - dx) * tile_height / 2 - (b - dy) * tile_height / 2 + dest_y,
            e = 0 != a % 2 ? 0 != b % 2 ? Math.floor(e) : Math.ceil(e) : 0 != b % 2 ? Math.ceil(e) : Math.floor(e);
        else return original_translateTileToCoordinates(a, b, d);
        return {
            x: (b - dy) * half_tile_width_round + (a - dx) * half_tile_width_round + dest_x,
            y: e,
            visible: d &&
                a - dx >= iMapBegin() && a - dx < iMapTo() && b - dy >= jMapBegin() && b - dy <= jMapTo() ? !0 : !1
        }
    });
    timestamp();
    fullscreen_mode = !1;
    minimap && Editor.toggle_minimap(!0);
    c.minimap_ = c.minimap;
    c.minimap = document.createElement("canvas");
    c.minimap.width = 6.4 * width;
    c.minimap.height = 6 * height;
    ctx.minimap = c.minimap.getContext("2d");
    minimap_scale = 1;
    Editor.toggle_minimap(!0);
    c.ground = c.minimap;
    c.minimap = c.minimap_;
    delete c.minimap_;
    ctx.minimap = c.minimap.getContext("2d");
    Editor.toggle_minimap(!0);
    minimap_scale = .125;
    setCanvasSize(!0);
    Editor.toggle_minimap();
    Editor.toggle_minimap();
    refreshHUD();
    fullscreen_mode = !0
}

function getGroundTileImg(a) {
    var b = 1;
    if (Carpentry.player_map) switch (Carpentry.player_map.tiles) {
        case 6:
            b = 58;
            break;
        case 7:
            b = 23;
            break;
        case 8:
            b = 302
    }
    var d;
    map[current_map][a.i] && map[current_map][a.i][a.j] || (d = ground_base[b]);
    d = d || obj_g(map[current_map][a.i][a.j]);
    a = d.img;
    "object" == typeof d.top && (a = ground_images[d.b_i]);
    return a
}

function renderGroundPiece(a, b) {
    var d = function(a, b) {
            return [{
                i: a - 1,
                j: b + 1,
                comp: "source-atop"
            }, {
                i: a - 1,
                j: b,
                comp: "source-atop"
            }, {
                i: a,
                j: b + 1,
                comp: "source-atop"
            }, {
                i: a,
                j: b,
                comp: "source-over"
            }, {
                i: a,
                j: b - 1,
                comp: "source-atop"
            }, {
                i: a + 1,
                j: b,
                comp: "source-atop"
            }, {
                i: a + 1,
                j: b - 1,
                comp: "source-atop"
            }]
        },
        e = document.createElement("canvas");
    e.width = 80;
    e.height = 60;
    var f = e.getContext("2d"),
        g = d(players[0].i - 13, players[0].j - 1),
        h = d(b.i, b.j),
        d = translateTileToCoordinates(g[3].i, g[3].j);
    Draw.drawToMap(f, a, d);
    for (d = 0; d < g.length; d++) {
        var l =
            g[d],
            l = translateTileToCoordinates(l.i, l.j),
            m = getGroundTileImg(h[d]);
        f.globalCompositeOperation = g[d].comp;
        Draw.drawToMap(f, m, l)
    }
    d = b.i;
    g = b.j;
    f = g * half_tile_width + d * half_tile_width + fullscreen_x;
    g = Math.round(d * (half_tile_height + .5) - g * (half_tile_height + .5)) + fullscreen_y;
    ctx.ground = c.ground.getContext("2d");
    ctx.ground.drawImage(e, f - 14 + width / 2 - half_tile_width - 6, g - 20 + height / 2 - tile_height - half_tile_height - 2);
    last_draw_ground.map = -1;
    drawGroundFull();
    settings.update_base = !0
}

function saveParamImgToFile(a, b) {
    getBodyImgNoHalo(b).toBlob(function(b) {
        saveAs(b, a + ".png")
    })
}

function saveArrowImgToFile(a, b) {
    Fletching.get_arrow_inventory_img(b).toBlob(function(b) {
        saveAs(b, a + ".png")
    })
}

function saveImgToFile(a, b) {
    var d = IMAGE_SHEET[b.sheet],
        e = document.createElement("canvas");
    e.width = d.tile_width;
    e.height = d.tile_height;
    e.getContext("2d").drawImage(d.img[0], d.tile_width * b.x, d.tile_height * b.y, d.tile_width, d.tile_height, 0, 0, d.tile_width, d.tile_height);
    e.toBlob(function(b) {
        saveAs(b, a + ".png")
    })
}

function saveCanvasToFile(a, b) {
    b.toBlob(function(b) {
        saveAs(b, a + ".png")
    })
}
var Toolbar = {
    vdom: {},
    set: function(a, b, d) {
        Toolbar.vdom[a] && Toolbar.vdom[a] == b || (document.getElementById(d).innerHTML = b, Toolbar.vdom[a] = b)
    },
    update_current_world: function() {
        var a = HandlebarTemplate.toolbar_current_world()({
            current: ServerList.world
        });
        Toolbar.set("current_world", a, "current_world_toolbar")
    },
    click_current_world: function() {
        -1 != [GAME_STATES.GAME, GAME_STATES.CHAT].indexOf(GAME_STATE) && 0 == Player.danger_level(players[0]) && (hasClass(document.getElementById("my_text"), "hidden") && ChatSystem.toggle(),
            document.getElementById("my_text").value = "/world ", Chat.update_string())
    },
    update_current_location: function() {
        Toolbar.set("location_map", map_names[players[0].map], "location_toolbar_map");
        Toolbar.set("location_coords", " (" + players[0].i + ", " + players[0].j + ")", "location_toolbar_coords")
    },
    quest_hidden: !0,
    active_quest: -1,
    update_quest: function(a) {
        if ("undefined" != typeof a) try {
            localStorage.toolbar_quest = a
        } catch (b) {}
        if (("skill_quest" == a || "undefined" == typeof a && "skill_quest" == Toolbar.active_quest) && -1 != players[0].sq.id) return Toolbar.update_skill_quest();
        var d = Quests.active_quests();
        if (0 == d.length) addClass(document.getElementById("quest_toolbar"), "hidden"), Toolbar.quest_hidden = !0;
        else {
            if (Toolbar.quest_hidden) {
                removeClass(document.getElementById("quest_toolbar"), "hidden");
                Toolbar.quest_hidden = !1;
                try {
                    a = localStorage.toolbar_quest;
                    if ("skill_quest" == a && -1 != players[0].sq.id) return Toolbar.update_skill_quest();
                    a = parseInt(a)
                } catch (e) {}
            }
            a = a || Toolbar.active_quest || -1; - 1 != a && player_quests[a] && player_quests[a].progress != quests[a].amount || (a = d[0].id);
            Toolbar.active_quest =
                a;
            Toolbar.set("current_quest", " (" + player_quests[a].progress + "/" + quests[a].amount + ") " + _tn(npc_base[quests[a].npc_id].name), "quest_toolbar_current")
        }
    },
    update_skill_quest: function() {
        if (-1 == players[0].sq.id) return Toolbar.update_quest();
        Toolbar.quest_hidden && (removeClass(document.getElementById("quest_toolbar"), "hidden"), Toolbar.quest_hidden = !1);
        Toolbar.active_quest = "skill_quest";
        var a = SkillQuest.quests[players[0].sq.id];
        Toolbar.set("current_quest", " (" + players[0].sq.progress + "/" + Math.round(SkillQuest.ITEM_MULTIPLIER[players[0].sq.grade] *
            a.amount) + ") " + _tn(item_base[a.item_id].name), "quest_toolbar_current")
    },
    stats_hidden: !0,
    update_stats: function() {
        if (Toolbar.stats_hidden) {
            removeClass(document.getElementById("stats_toolbar"), "hidden");
            Toolbar.stats_hidden = !1;
            var a = ["Accuracy", "Strength", "Defense", "Magic", "Archery"],
                b = "\n",
                d;
            for (d in a) b += _ti(a[d]).substring(0, 1) + " / ";
            b = b.slice(0, -3);
            document.getElementById("stats_toolbar").setAttribute("title", _tm("These are total adjusted values from your stats and gear.") + b)
        }
        a = !1;
        for (b = 0; b < players[0].params.magic_slots; b++) players[0].params.magics[b] &&
            (d = Magic[players[0].params.magics[b].id].params.penetration, a = a || d, a = Math.min(a, d));
        Toolbar.set("current_stats", " " + (Math.floor(players[0].temp.total_accuracy) + " / " + Math.floor(players[0].temp.total_strength) + " / " + Math.floor(players[0].temp.total_defense) + " / " + Math.floor(players[0].temp.magic / 1.2 + skills[0].magic.level + (a || 0)) + " / " + Math.floor(players[0].temp.total_archery)), "stats_toolbar_current")
    },
    dps_hidden: !0,
    dps_mode: !1,
    dps_average_hits: [],
    dps_average: 0,
    dps_max: 0,
    exp_skills: {},
    exp_average: 0,
    exp_average_xp: [],
    exp_hidden: !0,
    toggle_dps_exp_mode: function() {
        Toolbar.dps_mode ? (Toolbar.exp_average = 0, Toolbar.exp_average_xp = [], Toolbar.exp_skills = {}, Toolbar.dps_mode = !1) : (Toolbar.dps_max = 0, Toolbar.dps_average = 0, Toolbar.dps_average_hits = [], addClass(document.getElementById("exp_toolbar_popup"), "hidden"), Toolbar.dps_mode = !0);
        Toolbar.update_dps_exp();
        try {
            localStorage.toolbar_dps_mode = Toolbar.dps_mode ? "true" : "false"
        } catch (a) {}
    },
    dps_exp_initialized: !1,
    update_dps_exp: function() {
        if (!Toolbar.dps_exp_initialized) {
            Toolbar.dps_exp_initialized = !0;
            try {
                "undefined" !== typeof localStorage.toolbar_dps_mode && (Toolbar.dps_mode = "true" === localStorage.toolbar_dps_mode)
            } catch (a) {}
        }
        Toolbar.dps_mode ? Toolbar.update_dps() : Toolbar.update_exp()
    },
    update_dps: function() {
        Toolbar.dps_hidden && (removeClass(document.getElementById("dps_toolbar"), "hidden"), Toolbar.dps_hidden = !1);
        Toolbar.exp_hidden || (addClass(document.getElementById("exp_toolbar"), "hidden"), Toolbar.exp_hidden = !0);
        Toolbar.set("current_dps", " " + Math.round(100 * Toolbar.dps_average) / 100 + " (" + Math.round(100 *
            Toolbar.dps_max) / 100 + ")", "dps_toolbar_current")
    },
    update_exp: function() {
        Toolbar.exp_hidden && (removeClass(document.getElementById("exp_toolbar"), "hidden"), Toolbar.exp_hidden = !1);
        Toolbar.dps_hidden || (addClass(document.getElementById("dps_toolbar"), "hidden"), Toolbar.dps_hidden = !0);
        var a;
        a = 1E4 < Toolbar.exp_average ? Math.round(Toolbar.exp_average / 10) / 100 + "k" : Math.round(Toolbar.exp_average);
        Toolbar.set("current_exp", " " + a, "exp_toolbar_current")
    },
    update_exp_popup: function() {
        for (var a = {}, b = 0, d = Toolbar.exp_average_xp.length; b <
            d; b++) {
            var e = Toolbar.exp_average_xp[b];
            a[e.skill] ? (a[e.skill].xp += e.xp_delta, a[e.skill].min_time = Math.min(a[e.skill].min_time, e.time), a[e.skill].max_time = Math.max(a[e.skill].max_time, e.time)) : (a[e.skill] = {}, a[e.skill].min_time = e.time, a[e.skill].max_time = e.time, a[e.skill].xp = e.xp_delta)
        }
        var b = [],
            f;
        for (f in a)
            if (d = 3600 * a[f].xp / ((a[f].max_time - a[f].min_time) / 1E3), isFinite(d) && !isNaN(d)) {
                var e = Level.xp_for_level(skills[0][f].level + 1),
                    g = Level.xp_for_level(skills[0][f].level),
                    h = e - skills[0][f].xp,
                    e = Math.round((skills[0][f].xp -
                        g) / (e - g) * 100),
                    l = Math.floor(h / (d / 3600)),
                    h = parseInt(l / 3600),
                    g = parseInt(l / 60) % 60,
                    l = l % 60,
                    h = (10 > h ? "0" + h : h) + ":" + (10 > g ? "0" + g : g) + ":" + (10 > l ? "0" + l : l);
                b.push({
                    skill: _ti(capitaliseFirstLetter(f)) + " (" + e + "%)",
                    xp: 1E4 < d ? Math.round(d / 10) / 100 + "k" : Math.round(d),
                    time: h
                })
            }
        document.getElementById("exp_toolbar_popup").innerHTML = HandlebarTemplate.toolbar_exp_popup()(b);
        removeClass(document.getElementById("exp_toolbar_popup"), "hidden")
    },
    hide_exp_popup: function() {
        addClass(document.getElementById("exp_toolbar_popup"), "hidden")
    },
    data_exp_mode_process: function(a) {
        var b = timestamp(),
            d = b,
            e;
        a.skill ? (e = {}, e[a.skill] = a.stats) : e = a;
        for (var f in e) Toolbar.exp_skills[f] && Toolbar.exp_skills[f].xp < e[f].xp && (a = {}, a.skill = f, a.xp_delta = e[f].xp - Toolbar.exp_skills[f].xp, a.time = b, Toolbar.exp_average_xp.push(a)), Toolbar.exp_skills[f] = {}, Toolbar.exp_skills[f].xp = e[f].xp, Toolbar.exp_skills[f].level = e[f].level;
        if (0 < Toolbar.exp_average_xp.length)
            for (; Toolbar.exp_average_xp[0] && Toolbar.exp_average_xp[0].time + 18E4 < b;) Toolbar.exp_average_xp.shift();
        e = Toolbar.exp_average = 0;
        for (f = Toolbar.exp_average_xp.length; e < f; e++) Toolbar.exp_average += Toolbar.exp_average_xp[e].xp_delta, Toolbar.exp_average_xp[e].time < d && (d = Toolbar.exp_average_xp[e].time);
        Toolbar.exp_average = 3600 * Toolbar.exp_average / ((b - d) / 1E3);
        if (!isFinite(Toolbar.exp_average) || isNaN(Toolbar.exp_average)) Toolbar.exp_average = 0;
        Toolbar.update_exp()
    },
    data_dps_mode_process: function(a) {
        var b = timestamp(),
            d = {};
        d.damage = a;
        d.time = b;
        a = b - 5E3;
        Toolbar.dps_average_hits.push(d);
        Toolbar.dps_average = 0;
        if (0 <
            Toolbar.dps_average_hits.length) {
            for (; Toolbar.dps_average_hits[0] && Toolbar.dps_average_hits[0].time + 6E4 < b;) Toolbar.dps_average_hits.shift();
            for (var d = 0, e = Toolbar.dps_average_hits.length; d < e; d++) Toolbar.dps_average += Toolbar.dps_average_hits[d].damage, Toolbar.dps_average_hits[d].time < a && (a = Toolbar.dps_average_hits[d].time)
        }
        Toolbar.dps_average /= (b - a) / 1E3;
        Toolbar.dps_average > Toolbar.dps_max && (Toolbar.dps_max = Toolbar.dps_average);
        Toolbar.update_dps()
    },
    exp_bar_skill: "health",
    exp_bar_last_xp: -1,
    exp_bar_initialized: !1,
    update_exp_bar: function(a) {
        if (!Toolbar.exp_bar_initialized) {
            Toolbar.exp_bar_initialized = !0;
            try {
                "undefined" !== typeof localStorage.toolbar_exp_bar_skill && (Toolbar.exp_bar_skill = localStorage.toolbar_exp_bar_skill)
            } catch (b) {}
        }
        if (skills[0][Toolbar.exp_bar_skill].xp != Toolbar.exp_bar_last_xp || a) {
            a = Toolbar.exp_bar_skill;
            var d = Level.xp_for_level(skills[0][a].level + 1),
                e = Math.round(d - skills[0][a].xp),
                d = Math.round(d - Level.xp_for_level(skills[0][a].level)),
                e = d - e,
                f = (Math.floor(e / d * 1E4) / 100).toFixed(2),
                g = d - e;
            1E5 <
                d && (d = Math.round(d / 100) / 10 + "k");
            1E5 < e && (e = Math.round(e / 100) / 10 + "k");
            var h = " (" + f + "%)";
            document.getElementById("player_xp_name").textContent = skills[0][a].level + " " + _ti(capitaliseFirstLetter(a)) + " " + e + " / " + d + h;
            document.getElementById("player_xp_name").getBoundingClientRect().width > parseInt(document.getElementById("player_xp_bar").style.width) && (1E5 < g && (g = Math.round(g / 100) / 10 + "k"), document.getElementById("player_xp_name").textContent = _ti(capitaliseFirstLetter(a)) + " " + g + " " + h);
            document.getElementById("player_xp_bar_front").style.width =
                f + "%"
        }
    },
    set_exp_bar_skill: function(a) {
        Toolbar.exp_bar_skill = a;
        Toolbar.exp_bar_last_xp = -1;
        Toolbar.update_exp_bar(!0);
        localStorage.toolbar_exp_bar_skill = a
    },
    check_for_width: function() {
        document.getElementById("toolbar_main_holder").getBoundingClientRect().left < document.getElementById("player_xp_bar").getBoundingClientRect().right && (document.getElementById("stats_toolbar").style.display = "none")
    }
};

function getImage(a, b) {
    var d = document.createElement("img");
    d.crossOrigin = "anonymous";
    d.src = a;
    d.onload = b || function() {};
    return d
}

function movementInProgress(a) {
    return a.i != a.temp.to.i || a.j != a.temp.to.j ? !0 : !1
}

function iMapBegin() {
    return west_in_progress ? -1 : 0
}

function iMapTo() {
    return east_in_progress ? 10 + map_increase : minimap ? 99 : 9 + map_increase
}

function jMapBegin() {
    return south_in_progress ? -1 : 0
}

function jMapTo() {
    return north_in_progress ? 9 + map_increase : minimap ? 99 : 8 + map_increase
}

function ctime(a) {
    return Math.max(0, 1200 - 6 * Math.min(a.params.speed, 180))
}

function resetMovement(a, b) {
    "undefined" == typeof b && (b = !0);
    a && (a.mx = 0, a.my = 0, Timers.clear(a.id + "move"), b && (a.temp.dest = {
        i: a.i,
        j: a.j
    }), a.temp.to = {
        i: a.i,
        j: a.j
    }, a.temp.animate_until = 0, updateBase())
}

function highPerformance() {
    return slow_mode ? !1 : !0
}
var body_offset_x = 0,
    body_offset_y = 0;

function translateMousePositionToScreenPosition(a, b) {
    var d = width / wrapper.style.width.replace("px", ""),
        e = height / wrapper.style.height.replace("px", "");
    a -= body_offset_x;
    b -= body_offset_y;
    return {
        x: a * d,
        y: b * e
    }
}

function translateMousePosition(a, b) {
    var d = width / wrapper.style.width.replace("px", ""),
        e = height / wrapper.style.height.replace("px", "");
    a -= body_offset_x;
    b -= body_offset_y;
    a = a * d - dest_x;
    b = b * e - dest_y;
    var e = 2 * a / tile_width,
        f = 2 * b / tile_height,
        d = Math.round((e + f) / 2) - 1,
        e = Math.round((e - f) / 2);
    return {
        i: d + dx,
        j: e + dy
    }
}

function translateTileToCoordinates(a, b, d) {
    return {
        x: (b - dy) * half_tile_width_round + (a - dx) * half_tile_width_round + dest_x,
        y: (a - dx) * half_tile_height_round - (b - dy) * half_tile_height_round + dest_y,
        visible: d && a - dx >= iMapBegin() && a - dx < iMapTo() && b - dy >= jMapBegin() && b - dy <= jMapTo() ? !0 : !1
    }
}

function openMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("menu_button").blur()
}

function closeMenu() {
    document.getElementById("menu").style.display = "none"
}

function map_visible(a, b, d, e) {
    "undefined" == typeof d && (d = dx, e = dy);
    return a - d >= iMapBegin() && a - d < iMapTo() && b - e >= jMapBegin() && b - e <= jMapTo() ? !0 : !1
}

function map_walkable(a, b, d) {
    return "undefined" == typeof on_map[a] || "undefined" == typeof on_map[a][b] || "undefined" == typeof on_map[a][b][d] || on_map[a][b][d].blocking ? !1 : 1 == node_graphs[a].nodes[b][d].type
}
var map_interactive_options = function(a, b) {};

function getClosestWalkablePosition(a, b, d) {
    return map_walkable(a, b + 1, d) ? {
        map: a,
        i: b + 1,
        j: d
    } : map_walkable(a, b - 1, d) ? {
        map: a,
        i: b - 1,
        j: d
    } : map_walkable(a, b, d + 1) ? {
        map: a,
        i: b,
        j: d + 1
    } : map_walkable(a, b, d - 1) ? {
        map: a,
        i: b,
        j: d - 1
    } : !1
}

function getClosestWalkablePositions(a, b, d) {
    var e = [];
    map_walkable(a, b + 1, d) && e.push({
        map: a,
        i: b + 1,
        j: d
    });
    map_walkable(a, b - 1, d) && e.push({
        map: a,
        i: b - 1,
        j: d
    });
    map_walkable(a, b, d + 1) && e.push({
        map: a,
        i: b,
        j: d + 1
    });
    map_walkable(a, b, d - 1) && e.push({
        map: a,
        i: b,
        j: d - 1
    });
    return e
}

function findPathFromTo(a, b, d) {
    if (minimap) return [];
    if (0 == node_graphs[d.map].nodes[b.i][b.j].type) {
        b = sortClosestTo(a, [{
            i: Math.max(b.i - 1, 0),
            j: b.j
        }, {
            i: Math.min(b.i + 1, map_size_x),
            j: b.j
        }, {
            i: b.i,
            j: Math.max(b.j - 1, 0)
        }, {
            i: b.i,
            j: Math.min(b.j + 1, map_size_y)
        }]);
        for (b.reverse(); 0 < b.length && 0 == node_graphs[d.map].nodes[b[b.length - 1].i][b[b.length - 1].j].type;) b.pop();
        if (0 == b.length) return [];
        b = b[b.length - 1]
    }
    a = astar.search(node_graphs[d.map].nodes, node_graphs[d.map].nodes[a.i][a.j], node_graphs[d.map].nodes[b.i][b.j]);
    if (0 == a.length) return [];
    d = [];
    for (b = a.length - 1; 0 <= b; b--) d.push({
        i: a[b].x,
        j: a[b].y
    });
    console.log(d);
    return d
}

function declareVariablesFromDOM() {
    c.base = document.createElement("canvas");
    c.base.width = width;
    c.base.height = height;
    ctx.base = c.base.getContext("2d");
    c.base_show = document.getElementById("base_show");
    ctx.base_show = c.base_show.getContext("2d");
    c.objects = document.createElement("canvas");
    c.objects.width = width;
    c.objects.height = height;
    ctx.objects = c.objects.getContext("2d");
    c.objects_show = document.getElementById("objects_show");
    ctx.objects_show = c.objects_show.getContext("2d");
    c.players = document.createElement("canvas");
    c.players.width = width;
    c.players.height = height;
    ctx.players = c.players.getContext("2d");
    c.players_show = document.getElementById("players_show");
    ctx.players_show = c.players_show.getContext("2d");
    c.effects = document.getElementById("effects");
    ctx.effects = c.effects.getContext("2d");
    c.hud = document.getElementById("hud");
    ctx.hud = c.hud.getContext("2d");
    c.minimap = document.createElement("canvas");
    c.minimap.width = width;
    c.minimap.height = height;
    ctx.minimap = c.minimap.getContext("2d");
    wrapper = document.getElementById("wrapper");
    side = document.getElementById("side");
    side_bottom = document.getElementById("side-bottom");
    canvas = document.getElementById("wrapper");
    Filters.tmpCanvas = document.createElement("canvas");
    Filters.tmpCtx = Filters.tmpCanvas.getContext("2d");
    setStatus("Disconnected", !1)
}

function setStatus(a, b, d) {
    var e = document.getElementById("connection_status");
    e.innerHTML = _ti(a, d || {});
    document.getElementById("connection_status_img").src = cdn_url + "img/" + (b ? "ok" : "no") + ".png";
    d ? e.removeAttribute("data-ti") : e.setAttribute("data-ti", a)
}

function setResetStatus(a, b) {
    document.getElementById("reset_password_status").innerHTML = _ti(a) + ' <img src="' + cdn_url + "img/" + (b ? "ok" : "no") + '.png" />'
}

function setResetFormStatus(a, b) {
    document.getElementById("reset_password_form_status").innerHTML = _ti(a) + ' <img src="' + cdn_url + "img/" + (b ? "ok" : "no") + '.png" />'
}

function moveNorth(a) {
    a.j++;
    a.me ? (dy += 1, north_in_progress = !1, drawMap(), finishedMovement()) : (a.temp.animate_until = timestamp(), drawMap(!1, !0, !1))
}

function moveSouth(a) {
    a.j--;
    a.me ? (--dy, south_in_progress = !1, drawMap(), finishedMovement()) : (a.temp.animate_until = timestamp(), drawMap(!1, !0, !1))
}

function moveWest(a) {
    a.i--;
    a.me ? (--dx, west_in_progress = !1, drawMap(), finishedMovement()) : (a.temp.animate_until = timestamp(), drawMap(!1, !0, !1))
}

function moveEast(a) {
    a.i++;
    a.me ? (dx += 1, east_in_progress = !1, drawMap(), finishedMovement()) : (a.temp.animate_until = timestamp(), drawMap(!1, !0, !1))
}

function finishedMovement(a) {
    0 == players[0].path.length && "object" == typeof selected_object && selected_object.activities && selected_object.activities[0] && 0 < selected_object.activities[0].length && inDistance(players[0].i, players[0].j, selected_object.i, selected_object.j) && ActionMenu.act(0)
}

function confirmSelected() {
    void 0 != selected.id || void 0 == selected_object || void 0 == selected_object.id || void 0 != selected.i && 0 != distance(selected.i, selected.j, selected_object.i, selected_object.j) || (selected = selected_object);
    0 == players[0].path.length && 1 != Math.abs(players[0].temp.to.i - selected.i) + Math.abs(players[0].temp.to.j - selected.j) && (selected_object = {}, selected = {});
    void 0 == selected.i && (selected_object = {})
}

function moveInPath(a) {
    var b = a.path.pop();
    map_walkable(a.map, b.i, b.j) && inDistance(b.i, b.j, a.i, a.j) ? (a.me && (Socket.send("move", JSON.merge(b, {
        t: timestamp()
    })), 16 != a.map && 24 != a.map || BigMenu.show_wilderness(), windowOpen && (windowOpen = !1, closeAllActiveWindows())), a.temp.to = b, a.me && confirmSelected(), animateUntil(a, ctime(a)), b.j > a.j ? (a.me && (north_in_progress = !0), Timers.set(a.id + "move", function() {
        moveNorth(a);
        a = null
    }, ctime(a))) : b.j < a.j ? (a.me && (south_in_progress = !0), Timers.set(a.id + "move", function() {
        moveSouth(a);
        a = null
    }, ctime(a))) : b.i < a.i ? (a.me && (west_in_progress = !0), Timers.set(a.id + "move", function() {
        moveWest(a);
        a = null
    }, ctime(a))) : b.i > a.i && (a.me && (east_in_progress = !0), Timers.set(a.id + "move", function() {
        moveEast(a);
        a = null
    }, ctime(a))), a.me && drawMap()) : a.path = []
}

function resetMapShift(a) {
    var b = dx,
        d = dy;
    dx = players[0].i - 4 - map_increase / 2;
    dy = players[0].j - 4 - map_increase / 2;
    (dx != b || dy != d || a) && drawMap()
}

function garbageCollector() {
    for (var a in players) "undefined" == typeof players[a] || 0 == a || /pet/.test(a) ? /pet/.test(a) && "undefined" == typeof players[a.substr(0, a.length - 3)] && players[0].name + "'s pet" != players[a].name && delete players[a] : players[a].ttl < timestamp() && (delete players[a], delete players[a + "pet"])
}
var Level = {
    find_by_xp: function(a, b) {
        for (var d = b || 1; a > Level.xp_for_level(d) - 1;) d++;
        return d - 1
    },
    xp_for_level: function(a) {
        return Math.round(50 * (Math.pow(1.11, a - 1) - 1) / (1.11 - 1))
    }
};

function initDOMEvents() {
    bindOnPress(document.getElementById("login_register_button"), function() {
        do_login(document.getElementById("login_user").value, document.getElementById("login_pass").value);
        return !1
    });
    bindOnPress(document.getElementById("chat_button"), ChatSystem.toggle);
    bindOnPress(document.getElementById("filters_button"), function() {
        ChatSystem.filters(!1)
    });
    bindOnPress(document.getElementById("contacts_button"), Contacts.toggle);
    bindOnPress(document.getElementById("quests_button"), Quests.toggle);
    bindOnPress(document.getElementById("open_pet_menu"), function() {
        Pet.init_menu();
        BigMenu.show(-1)
    });
    bindOnPress(document.getElementById("game_options"), OptionsMenu.toggle);
    bindOnPress(document.getElementById("spectate_mode_link"), function() {
        SpectateWindow.init(!1)
    });
    bindOnPress(document.getElementById("combat_style"), Player.change_combat_style);
    bindOnPress(document.getElementById("player_info"), Player.request_more_info);
    document.getElementById("mods_link").onclick = enableMods;
    bindOnPress(document.getElementById("logout_link"),
        function() {
            Player.request_client_logout()
        });
    bindOnPress(document.getElementById("options_form_close"), function() {
        document.getElementById("options_form").style.display = "none"
    });
    bindOnPress(document.getElementById("options_form_show_game"), OptionsMenu.show_game);
    bindOnPress(document.getElementById("options_form_show_video"), OptionsMenu.show_video);
    bindOnPress(document.getElementById("options_form_show_audio"), OptionsMenu.show_audio);
    bindOnPress(document.getElementById("mos_market_close"), function() {
        document.getElementById("payment_form").style.display =
            "none"
    });
    bindOnPress(document.getElementById("popup_prompt_confirm"), Popup.prompt_confirm);
    bindOnPress(document.getElementById("popup_prompt_decline"), Popup.prompt_decline);
    bindOnPress(document.getElementById("dual_prompt_choice1"), Popup.dual_prompt_confirm_first);
    bindOnPress(document.getElementById("dual_prompt_choice2"), Popup.dual_prompt_confirm_second);
    bindOnPress(document.getElementById("dual_prompt_decline"), Popup.dual_prompt_decline);
    bindOnPress(document.getElementById("input_prompt_confirm"),
        Popup.input_prompt_confirm);
    bindOnPress(document.getElementById("input_prompt_close"), Popup.input_prompt_close);
    bindOnPress(document.getElementById("number_input_prompt_confirm"), Popup.number_input_prompt_confirm);
    bindOnPress(document.getElementById("number_input_prompt_confirm_max"), Popup.number_input_prompt_confirm_max);
    bindOnPress(document.getElementById("number_input_prompt_close"), Popup.number_input_prompt_cancel);
    bindOnPress(document.getElementById("dialog_prompt_close"), function() {
        Popup.dialog_close()
    });
    bindOnPress(document.getElementById("shop_buy"), Shop.buy);
    bindOnPress(document.getElementById("shop_sell"), function() {
        Shop.sell(!1)
    });
    bindOnPress(document.getElementById("shop_sell_all"), function() {
        Shop.sell(!0)
    });
    bindOnPress(document.getElementById("shop_close"), function() {
        addClass(document.getElementById("shop"), "hidden");
        Shop.deactivate_update()
    });
    bindOnPress(document.getElementById("chest_page_1"), function() {
        Chest.change_page(1)
    });
    bindOnPress(document.getElementById("chest_page_2"), function() {
        Chest.change_page(2)
    });
    bindOnPress(document.getElementById("chest_page_3"), function() {
        Chest.change_page(3)
    });
    bindOnPress(document.getElementById("chest_page_4"), function() {
        Chest.change_page(4)
    });
    bindOnPress(document.getElementById("chest_page_5"), function() {
        Chest.change_page(5)
    });
    bindOnPress(document.getElementById("chest_withdraw"), function() {
        Chest.withdraw(1)
    });
    bindOnPress(document.getElementById("chest_withdraw_8"), function() {
        Chest.withdraw(8)
    });
    bindOnPress(document.getElementById("chest_destroy"), Chest.destroy);
    bindOnPress(document.getElementById("chest_deposit"),
        function() {
            Chest.deposit(1)
        });
    bindOnPress(document.getElementById("chest_deposit_all"), function() {
        Chest.deposit(99)
    });
    bindOnPress(document.getElementById("chest_close"), function() {
        addClass(document.getElementById("chest"), "hidden")
    });
    bindOnPress(document.getElementById("chest_market_link"), function() {
        Market.open(!1)
    });
    var a = new Hammer(document.getElementById("chest"));
    a.on("swipeleft", Chest.next_page);
    a.on("swiperight", Chest.last_page);
    bindOnPress(document.getElementById("market_search_open"), function() {
        Market.open(!0)
    });
    bindOnPress(document.getElementById("market_transactions_open"), Market.client_transactions);
    bindOnPress(document.getElementById("market_new_offer_open"), Market.client_new_offer);
    bindOnPress(document.getElementById("market_close"), function() {
        addClass(document.getElementById("market"), "hidden");
        Chest.change_page(chest_page)
    });
    bindOnPress(document.getElementById("market_search_button"), Market.client_search);
    bindOnPress(document.getElementById("makeover_gender_link"), function() {
        Makeover.gender();
        BigMenu.update_makeover()
    });
    bindOnPress(document.getElementById("makeover_head_link"), function() {
        current_makeover_conf = Makeover.next(current_makeover_conf, "head");
        BigMenu.update_makeover()
    });
    bindOnPress(document.getElementById("makeover_facial_hair_link"), function() {
        current_makeover_conf = Makeover.next(current_makeover_conf, "facial_hair");
        BigMenu.update_makeover()
    });
    bindOnPress(document.getElementById("makeover_body_link"), function() {
        current_makeover_conf = Makeover.next(current_makeover_conf, "body");
        BigMenu.update_makeover()
    });
    bindOnPress(document.getElementById("makeover_pants_link"), function() {
        current_makeover_conf = Makeover.next(current_makeover_conf, "pants");
        BigMenu.update_makeover()
    });
    bindOnPress(document.getElementById("duel_window_close"), function() {
        document.getElementById("duelling_form").style.display = "none";
        Socket.send("duel_cancel", {})
    });
    bindOnPress(document.getElementById("duelling_no_running"), Duel.send_settings);
    bindOnPress(document.getElementById("duelling_no_magic"), Duel.send_settings);
    bindOnPress(document.getElementById("duelling_accept"),
        Duel.duel_button);
    bindOnPress(document.getElementById("quests_party_form_list"), function() {
        PartyQuests.show_list()
    });
    bindOnPress(document.getElementById("quests_party_form_create"), PartyQuests.show_new);
    bindOnPress(document.getElementById("quests_party_form_hall_of_fame"), function() {
        PartyQuests.show_hall_of_fame()
    });
    bindOnPress(document.getElementById("quests_party_form_close"), function() {
        document.getElementById("quests_party_form").style.display = "none"
    });
    bindOnPress(document.getElementById("building_form_close"),
        function() {
            document.getElementById("building_form").style.display = "none"
        });
    bindOnPress(document.getElementById("building_form_floors"), function() {
        Carpentry.init("floors")
    });
    bindOnPress(document.getElementById("building_form_walls"), function() {
        Carpentry.init("walls")
    });
    bindOnPress(document.getElementById("building_form_objects"), function() {
        Carpentry.init("furniture")
    });
    bindOnPress(document.getElementById("building_form_map"), Carpentry.show_map_upgrades);
    bindOnPress(document.getElementById("building_form_buildings"),
        Carpentry.show_buildings);
    for (var b in skills[0]) document.getElementById("skill_" + b).parentElement.onmouseover = new Function("selected_skill = '" + b + "';BigMenu.show_skills();"), bindOnPress(document.getElementById("skill_" + b).parentElement, new Function("Toolbar.set_exp_bar_skill('" + b + "');selected_skill = '" + b + "';BigMenu.show_skills();"));
    document.getElementById("skills_menu").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("skills_menu"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    for (a =
        0; 24 > a; a++) b = document.createElement("div"), b.id = "duel_inv_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b, new Function("Duel.stake(" + a + ")")), document.getElementById("duelling_inventory").appendChild(b);
    for (a = 0; 36 > a; a++) b = document.createElement("div"), b.id = "pet_inv_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b, new Function("Pet.menu_add(" + a + ")")), document.getElementById("pet_inventory").appendChild(b);
    for (a = 0; 24 > a; a++) b = document.createElement("div"), b.id = "pet_chest_" +
        a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b, new Function("Pet.menu_remove(" + a + ")")), document.getElementById("pet_chest").appendChild(b);
    for (a = 0; 24 > a; a++) b = document.createElement("div"), b.id = "cabinet_inv_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b, new Function("Chest.cabinet_add(" + a + ")")), document.getElementById("cabinet_inventory").appendChild(b);
    for (a = 0; 20 > a; a++) b = document.createElement("div"), b.id = "cabinet_chest_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b,
        new Function("Chest.cabinet_remove(" + a + ")")), document.getElementById("cabinet_chest").appendChild(b);
    for (a = 0; 4 > a; a++) b = document.createElement("div"), b.id = "duel_my_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", bindOnPress(b, new Function("Duel.stake_remove(" + a + ")")), document.getElementById("duelling_my_stake").appendChild(b);
    for (a = 0; 4 > a; a++) b = document.createElement("div"), b.id = "duel_other_" + a, addClass(b, "inv_item"), b.innerHTML = "&nbsp;", document.getElementById("duelling_others_stake").appendChild(b);
    for (a = 0; 40 > a; a++) {
        b = document.createElement("div");
        b.id = "inv_" + a;
        addClass(b, "inv_item");
        b.innerHTML = "&nbsp;";
        b.onmouseover = new Function("selected_inv = '" + a + "';BigMenu.show_inventory();");
        b.onclick = new Function("inventoryClick(" + a + ");left_click_cancel=true;");
        b.oncontextmenu = new Function("inventoryRClick(" + a + ");");
        holdEvent(b, new Function("inventoryRClick(" + a + ");"), 1E3);
        try {
            b.addEventListener(touchstart, function(a) {
                a.preventDefault();
                left_click_cancel = !1;
                if (a.target || a.targetTouches && a.targetTouches[0].target) {
                    try {
                        var b =
                            /[0-9]{1,2}/.exec(a.target && a.target.id || a.targetTouches[0].target.id)[0]
                    } catch (d) {
                        b = 0
                    }
                    last_inventory_slot = b;
                    GAME_STATE == GAME_STATES.GAME && (touch_timer = setTimeout(new Function("left_click_cancel=true;inventoryRClick(" + b + ");"), 1E3))
                }
            }), b.addEventListener(touchend, function(a) {
                clearTimeout(touch_timer);
                left_click_cancel || (inventoryClick(last_inventory_slot), left_click_cancel = !0)
            })
        } catch (d) {}
        document.getElementById("inventory").appendChild(b)
    }
    a = document.createElement("span");
    a.id = "inv_coins";
    document.getElementById("inventory").appendChild(a);
    b = document.createElement("span");
    b.id = "inv_name";
    addClass(b, "inv_item_name");
    b.innerHTML = "&nbsp;";
    document.getElementById("inventory").appendChild(b);
    document.getElementById("inventory").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("inventory"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    for (a = 0; 60 > a; a++) b = document.createElement("div"), b.id = "shop_" + a, addClass(b, "inv_item"), b.innerHTML = '<span class="inv_numbers">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>', bindOnPress(b, new Function("selected_shop = '" +
        a + "';BigMenu.update_shop_selection();")), b.oncontextmenu = new Function("Shop.item_info(" + a + ");"), document.getElementById("shop_item_holder").appendChild(b);
    for (a = 0; 60 > a; a++) {
        b = document.createElement("div");
        b.id = "chest_" + a;
        addClass(b, "inv_item");
        b.innerHTML = '<span class="inv_numbers">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        bindOnPress(b, new Function("selected_chest = '" + a + "';BigMenu.update_chest_selection();"));
        b.oncontextmenu = new Function("Chest.item_info(" + a + ");Chest.right_click(" + a + ");");
        holdEvent(b,
            new Function("Chest.right_click(" + a + ");"), 1E3);
        try {
            b.addEventListener(touchstart, function(a) {
                a.preventDefault();
                left_click_cancel = !1;
                if (a.target || a.targetTouches && a.targetTouches[0].target) {
                    try {
                        var b = /[0-9]{1,2}/.exec(a.target && a.target.id || a.targetTouches[0].target.id)[0]
                    } catch (d) {
                        b = 0
                    }
                    selected_chest = b;
                    GAME_STATE == GAME_STATES.GAME && (touch_timer = setTimeout(new Function("left_click_cancel=true;Chest.right_click(" + b + ");"), 1E3))
                }
            }), b.addEventListener(touchend, function(a) {
                clearTimeout(touch_timer);
                left_click_cancel ||
                    (BigMenu.update_chest_selection(), left_click_cancel = !0)
            })
        } catch (e) {}
        document.getElementById("chest_item_holder").appendChild(b)
    }
    document.getElementById("settings").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("settings"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    document.getElementById("settings_spectate").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("settings_spectate"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    document.getElementById("small_pet_menu").onmouseout =
        function(a) {
            fixOnMouseOut(a, document.getElementById("small_pet_menu"), function() {
                BigMenu.show(-1);
                active_menu = -1
            })
        };
    document.getElementById("small_build_menu").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("small_build_menu"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    document.getElementById("small_wilderness_menu").onmouseout = function(a) {
        fixOnMouseOut(a, document.getElementById("small_wilderness_menu"), function() {
            BigMenu.show(-1);
            active_menu = -1
        })
    };
    Chat.initialize_chat();
    bindOnPress(document.getElementById("dps_toolbar"),
        Toolbar.toggle_dps_exp_mode);
    bindOnPress(document.getElementById("exp_toolbar"), Toolbar.toggle_dps_exp_mode);
    bindOnPress(document.getElementById("current_world_toolbar"), Toolbar.click_current_world)
}

function inventoryClick(a) {
    clearInterval(inventory_auto_action);
    if (players[0].temp.busy) return !1;
    if (!(Android && 500 > timestamp() - lastTap)) {
        mobileDevice() || (lastTap = timestamp());
        if (left_click_cancel) return !1;
        a = players[0].temp.inventory[a];
        if ("undefined" == typeof a) return !1;
        a.selected ? Inventory.unequip(players[0], a.id) && (BigMenu.init_inventory(), Socket.send("unequip", {
            data: {
                id: a.id
            }
        }), Player.update_combat_attributes(players[0]), BigMenu.show_magic_slots(), BigMenu.show_quiver()) : Inventory.equip(players[0],
            a.id) && (BigMenu.init_inventory(), Socket.send("equip", {
            data: {
                id: a.id
            }
        }), Player.update_combat_attributes(players[0]), BigMenu.show_quiver())
    }
}

function inventoryRClick(a) {
    clearInterval(inventory_auto_action);
    if ("undefined" != typeof a) {
        if ("undefined" == typeof players[0].temp.inventory[a]) return !1;
        InvMenu.create(a)
    }
}

function penalty_bonus() {
    Socket.send("captcha_bonus", {
        skill: document.getElementById("penalty_bonus_skill").value,
        amount: parseInt(document.getElementById("penalty_bonus_points").value)
    })
}

function mouseOverMagic(a) {
    players[0].params.magics[a] && (a = Magic[players[0].params.magics[a].id].name, document.getElementById("object_selector_info").innerHTML = _tn(a), document.getElementById("object_selector_info").style.color = COLOR.WHITE, mouse_over_magic = !0)
}

function mouseOutMagic(a) {
    mouse_over_magic = !1
}

function mouseOverQuiver() {
    if (players[0].params.archery && players[0].params.archery.id) {
        var a = item_base[players[0].params.archery.id].name;
        document.getElementById("object_selector_info").innerHTML = _tn(a);
        document.getElementById("object_selector_info").style.color = COLOR.WHITE;
        mouse_over_quiver = !0
    }
}

function mouseOutQuiver(a) {
    mouse_over_quiver = !1
}

function holdEvent(a, b, d) {
    var e;
    a.onmousedown = function(a) {
        GAME_STATE != GAME_STATES.GAME || touch_initialized || (left_click_cancel = !1, e = setTimeout(function() {
            left_click_cancel = !0;
            b(a)
        }, d))
    };
    a.onmouseup = function() {
        clearTimeout(e)
    }
}

function minutesPastDelta(a) {
    return Math.floor(secondsPastDelta(a) / 60)
}

function secondsPastDelta(a) {
    return secondstamp() - server_time_delta - a
}

function closeAllActiveWindows() {
    Popup.prompt_close();
    Popup.dual_prompt_close();
    Popup.input_prompt_close();
    Popup.number_input_prompt_close();
    Popup.dialog_close(!0);
    addClass(document.getElementById("chest"), "hidden");
    addClass(document.getElementById("shop"), "hidden");
    Shop.deactivate_update();
    addClass(document.getElementById("market"), "hidden");
    document.getElementById("duelling_form").style.display = "none";
    document.getElementById("makeover_form").style.display = "none";
    document.getElementById("cabinet_form").style.display =
        "none";
    document.getElementById("cabinet_form").style.display = "none";
    addClass(document.getElementById("pet_nest_form"), "hidden");
    FormHelper.close_on_move()
}

function canUseHouseDeed(a) {
    var b = map_names[a.map],
        d = a.i;
    a = a.j;
    if (teleport_locations[b]) {
        var e = teleport_locations[b].to_i,
            f = teleport_locations[b].to_j,
            b = teleport_locations[b].radius;
        if (e - b < d && e + b > d && f - b < a && f + b > a) return !0
    }
    return !1
}
var monsters_by_level = [];

function calculateMonsterCombats() {
    for (var a = 0, b = npc_base.length; a < b; a++) npc_base[a].type != OBJECT_TYPE.ENEMY || npc_base[a].params.no_dungeon || (npc_base[a].params.combat_level = FIGHT.calculate_monster_level(npc_base[a]), monsters_by_level[npc_base[a].params.combat_level] = monsters_by_level[npc_base[a].params.combat_level] || [], monsters_by_level[npc_base[a].params.combat_level].push(parseInt(a)))
}

function noRender(a, b) {
    Android && (no_render = !0, Draw.clear(ctx.base_show), Draw.clear(ctx.base), Draw.clear(ctx.objects_show), Draw.clear(ctx.objects), Draw.clear(ctx.players_show), Draw.clear(ctx.players), Draw.clear(ctx.effects), a || Timers.set("no_render", function() {
        no_render = !1
    }, b || 500))
}

function setBackground(a) {
    removeClass(wrapper, "level300");
    removeClass(document.body, "level300");
    for (var b = 0; b < maps; b++) removeClass(wrapper, "level" + b), removeClass(document.body, "level" + b);
    addClass(wrapper, "level" + backgroundLevel(a));
    0 == body_offset_x && 0 == body_offset_y || addClass(document.body, "level" + backgroundLevel(a))
}

function backgroundLevel(a) {
    return 100 <= a && 120 > a ? 1 : 120 <= a && 130 >= a ? 0 : a
}
var loaded_specific_images = {};

function loadSpecificImage(a) {
    if (!loaded_specific_images[a]) {
        var b = "",
            d = "";
        switch (a) {
            case "gamepad":
                b = "url('sheet/gamepad.png') transparent";
                break;
            case "atk_button":
                b = "url('sheet/atk_button.png') transparent";
                break;
            case "market_example_small":
                d = "https://mo.mo.ee/small/market_example_small.gif"
        }
        "" == d && "" == b && console.log("No such image " + a);
        var e = document.getElementById(a);
        "" != d ? e.src = d : "" != b && (e.style.background = b);
        loaded_specific_images[a] = !0
    }
}

function my_island() {
    return map_names[300] == players[0].name + "'s Island"
}

function extract_island_owner() {
    return map_names[300].replace("'s Island", "")
}