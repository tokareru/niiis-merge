// область вызывает событие createdNewMessage после создания сообщения,
// а остальные вкладки получают уведомление о новом сообщении с помощью события newMessage
let Round;
let Role;
let DateChange;
let LoginChange;
window.namerole;
let prepareShellIsFinished = false;

function shellInit() {
    $("#shell").data("shellInterconnection", {"availableSubscribers": []});
    setMessageHandler();
    let current_round;
    getJsonByURL("start_ajax", prepareShell, {});

    setInterval(function () {
        getJsonByURL("start_ajax", prepareShell, {});
    }, 8000);
}

function interShellMessage(event, data) {
    let shell = $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    //console.log(availableSubscribers);
    //console.log(data);
    //let availableSubscribers = data.destination;
    availableSubscribers.forEach(function (elem) {
        $("#" + elem).trigger("newMessage", data);
    })
}

function sendMessage(data) {
    $("#shell").trigger("createdNewMessage", data);
}

function setNotifyAndInitHandlers(elem) {
    // привязываем данные к области
    let panel = $("#" + elem.ID);
    panel.data("shellInterconnection", elem);
    // привязываем обработчик сообщения области к событию сообщения
    if (elem.notify !== 'none' && elem.notify !== '') {
        let callback = eval(elem.notify);
        panel.on("newMessage", function (event, data) {
            callback(event, data);
        });
    }
    //привязываем обработчик события инициализации области
    let init = $(panel).data("shellInterconnection").init;
    if (init !== "none" && init !== "") {
        let callbackInit = eval(init);
        panel.on("initialization", function (event, data) {
            callbackInit();
        });
    }
}

function setMessageHandler() {
    // привязываем данные о доступных областях и обработчик события createdNewMessage к оболочке
    let shell = $("#shell");
    shell.on("createdNewMessage", function (event, data) {
        interShellMessage(event, data);
    });
}

async function prepareShell(json_role_and_round, add_data) {
    //console.log(json_role_and_round);
    login = json_role_and_round.login;
    currentName = json_role_and_round.name;
    window.namerole = currentName;
    let role = json_role_and_round.role.toString();
    let round = Number(json_role_and_round.round);
    let dateChange = json_role_and_round.date_change.toString();
    let loginChange = json_role_and_round.login_change.toString();

    // проверяем обновления
    let check = (round === Number(Round)) && ((dateChange === DateChange) || (loginChange == login))
        && ((loginChange == LoginChange) || (loginChange == login));
    //console.log(check)
    if (check) return;
    if (!prepareShellIsFinished){
        prepareShellIsFinished = true;
        return;
    }
    console.log("Производится загрузка кабинета");

    $("#change_role").attr("disabled", "disabled");
    let data = await getJsonByURLWithoutCallback("json/round_and_role.json");

    //обновляем данные
    Role = role;
    Round = round;
    LoginChange = loginChange;
    DateChange = dateChange;
    $("#current_round").text(Round);

    // находим id сторон и id областей, присутстующих в данном кабинете
    let available_sides_id = [];

    await data.fields.forEach(function (tabByRole) {
        if (tabByRole.role.toString() === role.toString()) {
            tabByRole.rounds.forEach(function (tabByRound) {
                if (Number(tabByRound.round) === Number(round)) {
                    available_sides_id = tabByRound.available_sides;
                }
            })
        }
    });

    //console.log(available_sides_id);
    // находим стороны, соответсвующие id-сторон кабинета
    let available_sides = [];

    available_sides_id.forEach(function (elem) {
        data.sides.forEach(function (side) {
            if (side.ID.toString() === elem.ID.toString()) {
                available_sides.push(side);
            }
        })
    });

    //console.log(available_sides);

    // расставляем стороны
    let destination;
    $(".myRow").empty();
    $("#chat_main").remove();
    $("#right-side").remove();
    $("#create_task_route-side").remove();
    let i = 0;
    for (const elem of available_sides) {
        let html = await downloadHTML(elem.URL);
        //console.log(html);
        $(elem.parent).append(html);
        // находим области по id
        let available_tabs = [];
        available_sides_id[i].tabs.forEach(function (tab_id) {
            data.available_tabs.forEach(function (av_tab) {
                if (av_tab.ID === tab_id)
                    available_tabs.push(av_tab)
            })
        });

        //console.log(available_tabs);
        // производим инициализацию стороны
        if (elem.init !== "") {
            let callback = eval(available_sides[i].init);
            // отбираем для функции инициализации стороны области, которые относятся к ней
            let curr_fields = [];
            available_tabs.forEach(function (tab) {
                if (tab.location === elem.ID) {
                    curr_fields.push(tab);
                }
            });
            //console.log(curr_fields);

            // вызов функции инициализации стороны
            callback(curr_fields, {});
            i++;
        }
    }

    $("#change_role").removeAttr("disabled");
    /*console.log(available_sides);
    console.log(available_tabs);*/
}

async function getJsonByURLWithoutCallback(url) {
    let $json;
    await $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (json) {
            //console.log("Data loaded");
            $json = json;
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    });
    return $json;
}

function downloadHTML(url) {
    let $html;
    $.ajax({
        type: "GET",
        async: false,
        url: url,
        dataType: "html",
        success: function (html) {
            //console.log("Data loaded");
            //console.log(html)
            $html = html;
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    });
    return $html;
}


function setRightSide(json, add_data) {
    //console.log(json);
    let availableSubscribers = $("#shell").data("shellInterconnection").availableSubscribers;
    for (const elem of json) {
        $("#right-side").append("<div id='" + elem.ID + "'></div>");
        setNotifyAndInitHandlers(elem);
        $("#" + elem.ID).trigger("initialization");
        availableSubscribers.push(elem.ID);
    }
    $("#shell").data("shellInterconnection", {"availableSubscribers": availableSubscribers});
}

// получаем информацию о доступных вкладках и передаем информацию в функцию setTabs
function getJsonByURL(url, callback, add_data) {
    // получаем сведения о роле и раунде
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (json) {
            //console.log("Data loaded");
            callback(json, add_data);
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    })
}


//блокировка нажатия правой кнопки мыши
function forbidPressRightMouseButton() {
    document.oncontextmenu = function () {
        return false;
    };
    $(document).mousedown(function (e) {
        if (e.button == 2) {
            //alert('Right mouse button!');
            return false;
        }
        return true;
    });
}
