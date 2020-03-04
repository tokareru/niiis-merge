function initNotifications() {
    setNotificationToFieldInitialization("technological_process_field", {
        mainHeader: "Рабочий стол. Техпроцесс",
        extraHeader: "",
        text: "Чтобы создать техпроцесс, перетащите узлы Справочника технолога в центр рабочего стола"
    });

    setNotificationToField("scheme", "schemeBlock", {
        mainHeader: "Рабочий стол. Чертёж",
        extraHeader: "",
        text: "Область заблокирована. Необходимо полностью собрать изделие."
    });

    setNotificationToFieldInitialization("technologist_guide_field", {
        mainHeader: "Справочник технолога",
        extraHeader:"",
        text: "Вы можете перетаскивать узлы справочника в Маршрутную карту или в Рабочий стол. Техпроцесс."
    })

}

function generateNotification(notification) {
    let toast_position = $("#toast-position");
    toast_position.append(
        `
                <div class="toast" role="alert" data-autohide="false" aria-live="assertive"
                     aria-atomic="true">
                    <div class="toast-header">                        
                        <strong class="mr-auto">${notification.mainHeader}</strong>
                        <small class="text-muted">${notification.extraHeader}</small>
                        <button type="button" class="ml-2 mb-1 close btn shadow-none" data-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                    ${notification.text}
                    </div>
                </div>
`
    );
    let toast = toast_position.find(".toast").last();
    toast.toast("show");
    toast.find("button").click(function () {
        toast.remove();
    })
}

function setNotificationToField(fieldName, eventName, notification = {mainHeader: "",  extraHeader: "", text: ""}) {
    $("#" + fieldName).on(eventName, function () {
        generateNotification(notification);
    });
}

function setNotificationToFieldInitialization(fieldName, notification) {
    setNotificationToField(fieldName, "initialization", notification);
}

function triggerEventOnField(fieldName, eventName) {
    $("#" + fieldName).trigger(eventName);
}






/*
Как добавлять и вызывать уведомления:
1) Если уведомление появляется при каком-то событии, а не при инициализации вкладки, то:
    * Придумайте название события и сделайте вызов функции triggerEventOnField(fieldName, eventName)
       (где fieldName - область к которой привязывется событие eventName, eventName - название события)
       в том месте где есть, например, некоторая проверка условия, т.е логические операторы или в любом другом месте кода
       области. Для установки уведомления используйте setNotificationToField(fieldName, eventName, notification).
    * В случае если вам нужно сообщение, которое бы появлялось при инициализации,
      то используте либо функцию для установки уведомления setNotificationToFieldInitialization(fieldName, notification) в пункте 2,
      либо примите имя события как "initialization".
      Делать вызов фунции triggerEventOnField(fieldName, eventName) не нужно.

2) В файле notification.js в функции initNotifications() устанавливайте уведомления с помощью
   setNotificationToField(fieldName, eventName, notification) или
   с помощью  setNotificationToFieldInitialization(fieldName, notification)
*/
