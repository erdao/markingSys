var hoverColor;
var clickColor;
var theme;
var normalForeground;
var hoverForeground;

var lastClickRowHeader = null;
var lastClickColumnHeader = null;

var isSort = false;

var themeswitchtime = 300;

var themeSources = new Array();
//分别是 header背景色，hover背景色，click背景色，正常前景色，hover前景色，header前景色
themeSources["theme0"] = new Array("#775d5c", "#857063", "#857043", "#000000", "#ffffff", "ffffff");
themeSources["theme1"] = new Array("#c3c366", "#d7e2d1", "#d4c9c5", "#000000", "#000000", "000000");
themeSources["theme2"] = new Array("#86a3c3", "#bdd3e1", "#80d1ca", "#000000", "#000000", "ffffff");
themeSources["theme3"] = new Array("#663d5b", "#cfbeb7", "#9b708b", "#000000", "#ffffff", "ffffff");
themeSources["theme4"] = new Array("#c5dddf", "#d4e3e6", "#86a3c3", "#000000", "#000000", "000000");
themeSources["theme5"] = new Array("#2d2d2d", "#8d8d8d", "#6d6d6d", "#000000", "#ffffff", "ffffff");


function switchTheme(key) {
    theme = themeSources[key];
    $(".rowheader,.columnheader").css({ "background-color": theme[0], "color": theme[5] });
    hoverColor = theme[1];
    clickColor = theme[2];
    normalForeground = theme[3];
    hoverForeground = theme[4];
    $("#submitbutton").css({ "background-color": theme[0], "color": theme[5] });

}

$(function() {
    $(document).ready(function() {
        switchTheme("theme1");

        $(".switchthemecontainer").slideUp();

        for (item in themeSources) {
            var newdt = $("<div></div>").css("background-color", themeSources[item][0]);
            newdt.attr("class", "selectiondiv");
            newdt.attr("id", item);
            $(".switchthemecontainer").append(newdt);
        }

        $(".selectiondiv").click(function() {
            switchTheme($(this).attr("id"));
        });
    });

    $(".swichtheme").click(function() {
        $(".switchthemecontainer").slideToggle(themeswitchtime);
    });




    $(".rowheader[name!='-1']").click(function() {
        var currentRowHeader = $(this)[0];
        if ($(currentRowHeader).attr("topclick") == "1") {
            $(currentRowHeader).attr("topclick", "");
            var tds = $("td[name=" + $(currentRowHeader).attr("name") + "]");
            $.each(tds, function(index, element) {
                if ($(element).attr("leftclick") != 1) {
                    $(element).children("input").css("color", normalForeground);
                }
                $(element).css({ "background-color": "" });
                $(element).attr("topclick", "");
            })
            lastClickRowHeader = null;
        } else {
            $(currentRowHeader).attr("topclick", "1");
            var tds = $("td[name=" + $(currentRowHeader).attr("name") + "]");
            $.each(tds, function(index, element) {
                $(element).css({ "background-color": clickColor });
                $(element).attr("topclick", "1");
                $(element).children("input").css("color", hoverForeground);
            })
            if (lastClickRowHeader != null) {
                $(lastClickRowHeader).attr("topclick", "");
                var tds = $("td[name=" + $(lastClickRowHeader).attr("name") + "]");
                $.each(tds, function(index, element) {
                    if ($(element).attr("leftclick") != 1) {
                        $(element).children("input").css("color", normalForeground);
                    }
                    $(element).css({ "background-color": "" });
                    $(element).attr("topclick", "");

                })
            }
            lastClickRowHeader = currentRowHeader;
        }
    });


    $(".columnheader").click(function() {
        var parentTh = $(this).closest(".rowchild");
        if (parentTh.attr("leftclick") == "1") {
            parentTh.attr("leftclick", "");
            parentTh.css({ "background-color": "" });
            $(parentTh).find("td[topclick!=" + "1" + "]").find("input").css("color", normalForeground)
            $(parentTh).find("td").attr("leftclick", "");
            lastClickColumnHeader = null;
        } else {
            parentTh.css("background-color", clickColor);
            $(parentTh).find("td").find("input").css("color", hoverForeground)
            $(parentTh).find("td").attr("leftclick", "1");
            parentTh.attr("leftclick", "1");
            if (lastClickColumnHeader != null) {
                lastClickColumnHeader.css({ "background-color": "" });
                $(lastClickColumnHeader).find("td[topclick!=" + "1" + "]").find("input").css("color", normalForeground)
                $(lastClickColumnHeader).find("td[topclick!=" + "1" + "]").attr("color", "")
                lastClickColumnHeader.attr("leftclick", "");
                lastClickColumnHeader.find("td").attr("leftclick", "");
            }
            lastClickColumnHeader = parentTh;
        }
    });

    $(".rowheader").hover(function() {
            if ($(this).attr("topclick") != "1") {
                $.each($("td[name=" + $(this).attr("name") + "][leftclick!=" + "1" + "]"), function(index, element) {
                    $(element).css({ "background-color": hoverColor });
                    $(element).children("input").css("color", hoverForeground);
                })
            }
        },
        function() {
            if ($(this).attr("topclick") != "1") {
                $.each($("td[name=" + $(this).attr("name") + "][leftclick!=" + "1" + "]"), function(index, element) {
                    $(element).css({ "background-color": "" });
                    $(element).children("input").css("color", normalForeground);
                })
            }
        })


    $(".rowchild").hover(function() {
            if ($(this).attr("leftclick") != "1") {
                $(this).css({ "background-color": hoverColor });
                $(this).find("td[topclick!=" + "1" + "]").children("input").css("color", hoverForeground);
            }
        },
        function() {
            if ($(this).attr("leftclick") != "1") {
                $(this).css({ "background-color": "" });
                $(this).find("td[topclick!=" + "1" + "]").children("input").css("color", normalForeground);
            }
        })

    $(".rowheader[name!='-1']").dblclick(function() {
        var currentName = $($(this)[0]).attr("name");
        var rowchildCount = $(".rowchild").length;

        for (i = rowchildCount - 1; i > 0; i--) {
            for (j = 0; j < i; j++) {
                var currentTds = $($(".rowchild")[j]).children("td[name=" + currentName + "]");
                var currentValueString = $(currentTds[0]).children("input")[0].value;
                var currentValue = parseFloat(currentValueString);

                var nextTds = $($(".rowchild")[j + 1]).children("td[name=" + currentName + "]");
                var nextValueString = $(nextTds[0]).children("input")[0].value;
                var nextValue = parseFloat(nextValueString);
                if (isNaN(currentValue)) {
                    currentValue = 100000;
                }
                if (isNaN(currentValue)) {
                    nextValue = 100000;
                }
                if (isSort ? currentValue > nextValue : currentValue < nextValue) {
                    switchTr($(".rowchild")[j], $(".rowchild")[j + 1]);
                }
            }
        }
        isSort = !isSort;
    });

    function switchTr(tr0, tr1) {
        $(tr0).insertAfter(tr1);
    };
})