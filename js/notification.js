function initNotifications() {
    initBell();
    $("#shell").off("dataChanged");

    setNotificationToField("shell", "dataChanged",{
        mainHeader: "Обновление кабинета",
        extraHeader: "",
        text: "Появилось обновление кабинета. Нажмите на кнопку, чтобы обновить кабинет",
        button: {
            name: "Обновить",
            class: "updateShellButton",
            triggeredEvent: "updateShell",
            target: "#shell"
        }
    });

    setNotificationToFieldInitialization("technological_process_field", {
        mainHeader: "Рабочий стол. Техпроцесс",
        extraHeader: "",
        text: "Чтобы создать техпроцесс, перетащите узлы \"Справочника технолога\" в центр рабочего стола. Вы можете создать новый узел техпроцесса, нажав на колёсико мышки в центре экрана."
    });

    setNotificationToField("scheme", "schemeBlock", {
        mainHeader: "Рабочий стол. Чертёж",
        extraHeader: "",
        text: "Область заблокирована. Необходимо полностью собрать изделие."
    });

    setNotificationToFieldInitialization("technologist_guide_field", {
        mainHeader: "Справочник технолога",
        extraHeader:"",
        text: "Вы можете перетаскивать узлы \"Справочник технолога\" в \"Маршрутную карту\" или в \"Рабочий стол. Техпроцесс\"."
    });

    setNotificationToFieldInitialization("pdm_field", {
        mainHeader: "Изделия PDM",
        extraHeader:"",
        text: "Вы можете перетаскивать изделия в область \"Рабочий стол. 3D\"."
    });

    setNotificationToFieldInitialization("std_field", {
        mainHeader: "Стандартные изделия",
        extraHeader:"",
        text: "Вы можете перетаскивать изделия в область \"Рабочий стол. 3D\"."
    })
}

function initBell() {
    let $toastSection = $("#toast-section");
    let $notificationBell = $("#notificationBell");
    /*$notificationBell.popover({
        content: "Уведомлений нет",
        placement: "left",
        trigger: 'focus'
    });*/

    $toastSection.on("newNotification", function () {
        let $navbar = $("#navbarTogglerNotification");
        let $notificationBell = $("#notificationBell");
        if ($navbar.hasClass("show")){
            $notificationBell.removeClass("fa-bell-o").removeClass("fa-bell-slash-o").removeClass("fa-bell-slash").addClass("fa-bell");
        }else{
            $notificationBell.removeClass("fa-bell-o").removeClass("fa-bell-slash-o").removeClass("fa-bell").addClass("fa-bell-slash");
        }
        //$notificationBell.popover('hide').popover("disable");
    });

    $("#toast-position").click(function () {
        $notificationBell.removeClass("fa-bell-slash").removeClass("fa-bell-slash-o").addClass("fa-bell-o");
    });

    $notificationBell.on("click", function () {
        let $notificationBell = $("#notificationBell");
        //$notificationBell.popover('update');
        if ($notificationBell.hasClass("fa-bell") || $notificationBell.hasClass("fa-bell-o")){
            $notificationBell.removeClass("fa-bell-o").removeClass("fa-bell").addClass("fa-bell-slash-o");

        }else {
            $notificationBell.removeClass("fa-bell-slash").removeClass("fa-bell-slash-o").addClass("fa-bell-o");
            setActionToBar({
                id: "openTab",
                type: "open",
                field: "Уведомления",
                text: `Открыта вкладка 'Уведомления'`
            })
        }
    });
}

function generateNotification(notification) {
    let toast_position = $("#toast-position");
    let button = (notification.button !== undefined)
        ? `<button class="btn btn-dark btn-sm btn-toolbar ml-auto mt-2 ${notification.button.class}">${notification.button.name}</button>` : '';
    toast_position.append(
        `
                <div class="toast" role="alert" data-autohide="false" aria-live="assertive"
                     aria-atomic="true">
                    <div class="toast-header">                        
                        <strong class="mr-auto">${notification.mainHeader}</strong>
                        <small class="text-muted">${notification.extraHeader}</small>
                        <button type="button" class="ml-2 mb-1 close btn shadow-none notificationCloseButton" data-dismiss="toast" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                    ${notification.text}
                    ${button}
                    </div>
                </div>
        `
    );
    let toast = toast_position.find(".toast").last();
    toast.toast("show");
    toast.find("button.notificationCloseButton").click(function () {
        toast.remove();
        let $notificationBell = $('#notificationBell');
        $notificationBell.removeClass("fa-bell").addClass("fa-bell-o");
        /*if ($("#navbarTogglerNotification").find(".toast").length === 0){
            $notificationBell.popover("enable").one("click", function () {
                $(this).popover("show");
            })
        }*/
    });

    if (notification.button !== undefined) {
        $(notification.button.target).off(notification.button.triggeredEvent, notification.button.target);
        //$(`.${notification.button.class}`).off("click", `.${notification.button.class}`);
        $(`.toast-body button`).last().on("click", function () {
            $(notification.button.target).trigger(notification.button.triggeredEvent);
        });
    }

    $("#toast-section").trigger("newNotification")

}

function setNotificationToField(fieldName, eventName, notification = {mainHeader: "",  extraHeader: "", text: "", button: { name: "", class: "", triggeredEvent: "", target: ""}}) {
    $("#" + fieldName).on(eventName, function () {
        generateNotification(notification);
    });
}

function setNotificationToFieldInitialization(fieldName, notification) {
    setNotificationToField(fieldName, "endOfInitialization", notification);
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
      либо примите имя события как "endOfInitialization".
      Делать вызов фунции triggerEventOnField(fieldName, eventName) не нужно.

2) В файле notification.js в функции initNotifications() устанавливайте уведомления с помощью
   setNotificationToField(fieldName, eventName, notification) или
   с помощью  setNotificationToFieldInitialization(fieldName, notification)
*/
