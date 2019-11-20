// область вызывает событие createdNewMessage после создания сообщения,
// а остальные вкладки получают уведомление о новом сообщении с помощью события newMessage

function shellInit() {
    $("#shell").data("shellInterconnection", {"availableSubscribers": []});
    setMessageHandler();
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

async function prepareShell(json_role_and_round) {
    let role = json_role_and_round.role;
    let round = json_role_and_round.round;

    let data = await getJsonByURLWithoutCallback("json/round_and_role.json");

    // находим id сторон и id областей, присутстующих в данном кабинете
    let available_sides_id = [];
    data.fields.forEach(function (tabByRole) {
        if (tabByRole.role === role) {
            tabByRole.rounds.forEach(function (tabByRound) {
                if (tabByRound.round === round) {
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
            if (side.ID === elem.ID) {
                available_sides.push(side);
            }
        })
    });

    console.log(available_sides);

    // расставляем стороны
    let destination;
    $(".myRow").empty();
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

async function downloadHTML(url) {
    let $html;
    await $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        success: function (html) {
            //console.log("Data loaded");
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

function setEMI() {
    $("#esi_field").append("<h4>ЭСИ</h4>\n" +
        "<p>\n" +
        "    Нанесение размеров отрезков прямых. При нанесении раз­меров формы, изображенной на чертеже отрезками\n" +
        "    прямых, предпочтительно проставлять размеры следующим образом. От концов отрезка проводят две\n" +
        "    параллельные между собой сплош­ные тонкие линии, которые называются выносными линиями (рис. 129, а).\n" +
        "    На расстоянии 10 мм от отрезка и параллельно ему проводят сплошную тонкую линию, называемую размерной\n" +
        "    линией. Размерная линия своими концами упирается в выносные линии и заканчивается стрелками. Начертание\n" +
        "    стрелок показа­но на рисунке 129, б. Выносные линии выходят за размерные на 1—3 мм. Над размерной линией\n" +
        "    проставляют размерное число, которое всегда указывает истинный размер элемента формы (ребра, грани и\n" +
        "    т.д.).\n" +
        "</p>");
}
