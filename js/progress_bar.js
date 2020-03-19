let CurrentProgress = [];

function initProgressBar(){
    $.ajax({
        url: 'ajax/get_technologist_info',
        type: 'GET',
        success: function (techJson) {
            techGuideJson = techJson;
            $.ajax({
                url: 'json/progress_bar_actions.json',
                type: 'GET',
                success: function (json) {
                    setActionBar(json)
                }
            })
        }
    })
}

function setActionBar(data) {
    if (data !== undefined){
        if (data.progressBarActions !== undefined){
            data.progressBarActions.forEach(function (action) {
                setActionToBar(action);
            });
        }
    }

    $("#left-scroll-button-progress-bar").on("click", function () {
        document.getElementById("progress-bar-body").scrollLeft -= 200;
    });

    $("#right-scroll-button-progress-bar").on("click", function () {
        document.getElementById("progress-bar-body").scrollLeft += 200;
    });

    // инициализация центральных вкладок
    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        setActionToBar({
            id: "openTab",
            type: "open",
            field: e.target.text,
            text: `Открыта вкладка '${e.target.text}'`
        })
    });
    $("#tabs").find(".nav-item").first().children().trigger("shown.bs.tab");

    // инициализация левых вкладок
    let accordion = $("#left-accordion");
    accordion.on('shown.bs.collapse', function (e) {
        setActionToBar({
            id: "openTab",
            type: "open",
            field: e.target.getAttribute("header-name"),
            text: `Открыта вкладка '${e.target.getAttribute("header-name")}'`
        })
    });
    accordion.find(".collapse").first().addClass("show").trigger("shown.bs.collapse");

    // инициализация чата
    $("#chat_main").on("chat-opened", function () {
        setActionToBar({
            id: "openTab",
            type: "open",
            field: "Чат",
            text: `Открыта вкладка 'Чат'`
        });
    })

    // инициализация ЭСИ
    $("#right-side").on("esi-opened", function () {
        setActionToBar({
            id: "openTab",
            type: "open",
            field: "Электронный состав изделия",
            text: `Открыта вкладка 'Электронный состав изделия'`
        })
    });

    // инициализация Создание маршрута заданий
    $("#create_task_route-side").on("create-task-route-opened", function () {
        setActionToBar({
            id: "openTab",
            type: "open",
            field: "Создание маршрута заданий",
            text: `Открыта вкладка 'Создание маршрута заданий'`
        })
    });
}

function scrollToEndOfProgressBar() {
    let progress_bar =  document.getElementById("progress-bar-body");
    progress_bar.scrollTo( progress_bar.scrollWidth, 0);
}

function setActionToBar(action = {id: "", type: "", field: "", text: ""}) {
    let icon = chooseIconClassByType(action.type);
    let progress_bar_body = $("#progress-bar-body");
    progress_bar_body.append(`
        <li class="nav-item">
             <button type="button" data-trigger="hover" data-container="body" data-toggle="popover"
              data-placement="top" title="${action.field}" data-content="${action.text}"
               class="btn btn-outline-dark mr-1 shadow-none fas ${icon}">
             </button>
        </li>
    `);

    progress_bar_body.find("button").last().popover();

    // прокрутка прогресса до конца прогресса
    scrollToEndOfProgressBar();

    CurrentProgress.push(action);

    //$("button[data-toggle=\"tooltip\"]").tooltip();
/*    $("#progress-bar-body button").last().tooltip({
        classes: {
            "ui-tooltip": "bg-dark text-white small"
        },
        position: { my: "left top+5", at: "left bottom", collision: "flipfit" }
    });*/

}

function chooseIconClassByType(type) {
    if (type === "save"){
        return "fa-save";
    }
    if (type === "choose"){
        return "fa-check-square";
    }
    if (type === "unselect"){
        return "fa-times-circle-o";
    }
    if (type === "edit"){
        return "fa-edit";
    }
    if (type === "addNew"){
        return "fa-plus";
    }
    if (type === "delete"){
        return "fa-minus";
    }
    if (type === "rowToEdit"){
        return "fa-unlock";
    }
    if (type === "rowToRo"){
        return "fa-lock";
    }
    if (type === "open"){
        return "fa-folder";
    }
    if (type === "clear"){
        return "fa-trash-o";
    }
    if (type === "move"){
        return "fa-arrows";
    }
}
