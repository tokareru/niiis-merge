function generateNotification(notification) {
    let toast_position = $("#toast-position");
    toast_position.append(
        `
                <div class="toast" role="alert" data-autohide="false" aria-live="assertive"
                     aria-atomic="true">
                    <div class="toast-header">                        
                        <strong class="mr-auto">${notification.mainHeader}</strong>
                        <small class="text-muted">${notification.extraHeader}</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
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
