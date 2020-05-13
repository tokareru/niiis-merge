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
}

// Добавляем вкладки
function addAvailableTabs(data, tableID) {
    let table = $(tableID);
    let tabsContent = $("#tabs-content");
    let ul = table.find("ul");
    let shell = $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    data.forEach(function (elem) {
        //ul.append("<li aria-controls=\"" + elem.ID + "\"><a href=" + elem.URL + ">" + elem.name + "</a></li>");
        ul.append(`
            <li aria-controls="${elem.ID}" class="nav-item">
                <a id="main-tabs-${elem.ID}" class="nav-link" data-toggle="pill" href="${elem.URL}"
                tab-target="${elem.ID}" role="tab">
                    ${elem.name}
                </a>
            </li>`);
        tabsContent.append(
            `<div class='tabs_div tab-pane' role="tabpanel" id='${elem.ID}'>
                <div class='loadingDiv mt-5 d-flex justify-content-center'>
                    <strong class='mr-3'>Идёт загрузка...</strong>
                    <div class="spinner-border" role="status" aria-hidden="true"></div>
                </div>
            </div>`);
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
            let target = $a.attr("tab-target");
            let $target = $(`#${target}`);
            $target.find(".loadingDiv").remove();
            $target.append(html);
            $a.attr("href", "#" + target);
            $target.trigger("initialization");
            $target.trigger("endOfInitialization");
        }
    });
}
