/*
function createTabs() {
    getJsonByURL("json/round_and_role.json", setTabs, {
        tabs_id: "#tabs",
    });
}
*/

// устанавливаем доступные области
function setTabs(json, add_data) {
    // очищаем пустышку
    let tabs_id = "#tabs";
    $(tabs_id + " ul").empty();
    $(tabs_id + "-empty").remove();

    // получаем доступные области исходя из раунда
    let availableTabs = json;
    // добавляем области в #tabs и обновляем tabs
    addAvailableTabs(availableTabs, tabs_id);
    $(tabs_id).find(".nav-item").first().children().attr("aria-selected", "true").addClass("active").trigger("click");
    $("#tabs-content").find("div").first().addClass("active");
    //$(".left-side").hide()

    /*$(tabs_id).tabs({
        classes:
            {
                "ui-tabs": "myTabs",
                "ui-tabs-nav": "myTabsNav",
                "ui-tabs-tab": "myTabsTab",
                "ui-tabs-panel": "myTabsPanel",
                'ui-tabs-active': 'bg-primary'
            },
        show: {effect: "fade", duration: 200},
        beforeLoad: function (event, ui) {
            ui.panel.html("<div class='alert alert-info'>Идёт загрузка...</div>");
            ui.jqXHR.fail(function () {
                ui.panel.html("<div class='alert alert-warning'>Не смогли загрузить данную вкладку</div>");
            });
        },
        load: function (event, ui) {
            // после загрузки делаем так, чтобы заголовок вкладки ссылался не на html файл, а на div внутри страницы
            let a = $(ui.tab).children();
            a.attr("href", "#" + ui.panel.attr("id"));
            //вызов функции инициализации области
            let $panel = $(ui.panel);
            $panel.trigger("initialization");
            $panel.trigger("endOfInitialization");
            let myTabsNav = $('.myTabsNav');
            myTabsNav.find('#print_btn').remove();
            myTabsNav.append('<a href="print_report" target="_blank"><input id="print_btn" type="button" value="Печать"><a/>');
        }
    });*/
    //$(tabs_id).tabs("refresh");
}

function chooseTabsByRoleAndRound(json) {
    // место для логики выбора доступных областей
    let current_round = 2;
    let current_role = "designer";
    //console.log("Round: " + current_round + ", Role: " + current_role);
    let test = json;
    return test;
}

// Добавляем вкладки
function addAvailableTabs(data, tableID) {
    let table = $(tableID);
    let tabsContent = $("#tabs-content");
    let ul = table.find("ul");
    ul.addClass('navbar navbar-light');
    let shell = $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    data.forEach(function (elem) {
        //ul.append("<li aria-controls=\"" + elem.ID + "\"><a href=" + elem.URL + ">" + elem.name + "</a></li>");
        ul.append(`
            <li aria-controls="${elem.ID}" class="nav-item">
            <a id="main-tabs-${elem.ID}" class="nav-link" data-toggle="pill" href="${elem.URL}" tab-target="${elem.ID}" role="tab">${elem.name}</a>
            </li>`);
        tabsContent.append("<div class='tabs_div tab-pane' role=\"tabpanel\" id='" + elem.ID + "'></div>");
        ul.find("a").last().one("click", function(){
            downloadAndSetHrefToTab($(this));
        })
            .click(function () {
                //$(this).tab("show");
                tabsContent.find(".tab-pane").not($(`div[id="${elem.ID}"`)).hide();
                tabsContent.find(`div[id="${elem.ID}"`).show();
            });
        //устанавливаем обработчики событий "initialization" и "newMessage"
        setNotifyAndInitHandlers(elem);
        // создаём список доступных областей
        availableSubscribers.push(elem.ID);
    });

    shell.data("shellInterconnection", {"availableSubscribers": availableSubscribers});

/*    table.find("a").click(function (event) {
        //event.preventDefault();
    });*/

}

function downloadAndSetHrefToTab($a) {
    $.ajax({
        type: "GET",
        url: $a.attr("href"),
        dataType: "HTML",
        success: function (html) {
            $("#" + $a.attr("tab-target")).append(html);
            $a.attr("href", "#" + $a.attr("tab-target"));
            $(`#${$a.attr("tab-target")}`).trigger("initialization");
        }
    });
}
