// область вызывает событие createdNewMessage после создания сообщения,
// а остальные вкладки получают уведомление о новом сообщении с помощью события newMessage

function shellInit() {
    $("#shell").data("shellInterconnection", {"availableSubscribers": []});
    setMessageHandler();
}

function interShellMessage(event, data) {
    let shell = $("#shell");
    let availableSubscribers =  shell.data("shellInterconnection").availableSubscribers;
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
