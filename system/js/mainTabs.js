function createTabs() {
    getRoleAndRound("json/round_and_role.json", setTabs);
}

// устанавливаем доступные области
function setTabs(json) {
    // очищаем пустышку
    $("#tabs ul").empty();
    $("#tabs #empty-tab-1").remove();

    // получаем доступные области исходя из раунда
    let availableTabs = chooseTabsByRoleAndRound(json);
    // добавляем области в #tabs и обновляем tabs
    addAvailableTabs(availableTabs, "#tabs");

    $("#tabs").tabs({
        classes:
            {
                "ui-tabs": "myTabs",
                "ui-tabs-nav": "myTabsNav",
                "ui-tabs-tab": "myTabsTab",
                "ui-tabs-panel": "myTabsPanel",
                'ui-tabs-active': 'myTabsActive'
            },
        show: {effect: "fade", duration: 200},
        beforeLoad: function (event, ui) {
            ui.panel.html("Loading...");
            ui.jqXHR.fail(function () {
                ui.panel.html("<div class='alert alert-warning'>Couldn't load this tab</div>");
            });
        },
        load: function (event, ui) {
            // после загрузки делаем так, чтобы заголовок вкладки ссылался не на html файл, а на div внутри страницы
            let a = $(ui.tab).children();
            a.attr("href", "#" + ui.panel.attr("id"));
            //вызов функции инициализации области
            $(ui.panel).trigger("initialization");
        }
    });
    //$("#tabs").tabs("refresh");
}

function chooseTabsByRoleAndRound(json) {
    // место для логики выбора доступных областей
    let current_round = json.current_round;
    let current_role = json.current_role;
    //console.log("Round: " + current_round + ", Role: " + current_role);
    let test = json.tabs;
    return test;
}

// Добавляем вкладки
function addAvailableTabs(data, tableID) {
    let table = $(tableID);
    let ul = table.find("ul");
    let shell = $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    data.forEach(function (elem) {
        ul.append("<li aria-controls=\"" + elem.ID + "\"><a href=" + elem.URL + ">" + elem.name + "</a></li>");
        table.append("<div class='tabs_div' id='" + elem.ID + "'></div>");
        //устанавливаем обработчики событий "initialization" и "newMessage"
        setNotifyAndInitHandlers(elem);
        // создаём список доступных областей
        availableSubscribers.push(elem.ID);
    });

    shell.data("shellInterconnection", {"availableSubscribers": availableSubscribers});

    table.find("a").click(function (event) {
        event.preventDefault();
    });

}
