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

    if (Round !== 3){
        if (Role === "technologist"){
            setNotificationToFieldInitialization("route_map_field", {
                mainHeader: "Маршрутная карта",
                extraHeader:"",
                text: `Чтобы создать маршрутную карту, заполните поля "Наименование и содержание операции", "Оборудование" и "Приспособление и инструмент". Не забудьте сохранить изменения!`
            });
        }
        if (Role === "designer"){
            $.ajax({
                type: "GET",
                url: "drawing_main_text_ajax/is_drawing_finished",
                dataType: "json",
                data: "type=get",
                async: false,
                success: function (answer) {
                    if (answer.is_drawing_finished == false){
                        setNotificationToFieldInitialization("scheme", {
                            mainHeader: "Рабочий стол. Чертёж",
                            extraHeader:"",
                            text: `Соедините точки, чтобы завершить чертёж.`
                        });
                    }
                }
            });

            setNotificationToFieldInitialization("specification", {
                mainHeader: "Спецификация",
                extraHeader:"",
                text: `Заполните таблицу спецификации и не забудьте сохранить изменения.`
            });
            setNotificationToFieldInitialization("scheme", {
                mainHeader: "Рабочий стол. Чертёж",
                extraHeader:"",
                text: `Два раза кликните на размер, чтобы его изменить.`
            });
            setNotificationToFieldInitialization("scheme", {
                mainHeader: "Рабочий стол. Чертёж",
                extraHeader:"",
                text: `Заполните основную надпись чертежа, проставьте размеры и сохраните изменения.`
            });
        }
        if (Role === "production_master"){
            setNotificationToFieldInitialization("production_task_field", {
                mainHeader: "Задание на производство",
                extraHeader:"",
                text: `Чтобы создать задание на производство, выберите пользователя, заполните или измените его таблицу и сохраните изменения.`
            });
        }
    }
    if (Round === 3){
        if (Role === "technologist"){
            setNotificationToFieldInitialization("technological_process_field", {
                mainHeader: "Рабочий стол. Техпроцесс",
                extraHeader: "",
                text: "Чтобы создать техпроцесс, перетащите узлы \"Справочника технолога\" в подсвеченные поля или центр вкладки, чтобы создать следующий порядок: техпроцесс -> техоперация -> узлы техоперации -> элементы узла техоперации."
            });
            /*setNotificationToFieldInitialization("technologist_guide_field", {
                mainHeader: "Справочник технолога",
                extraHeader:"",
                text: "Вы можете перетаскивать узлы \"Справочник технолога\" в области \"Маршрутная карта\" или \"Рабочий стол. Техпроцесс\"."
            });*/
            setNotificationToFieldInitialization("route_map_field", {
                mainHeader: "Маршрутная карта",
                extraHeader:"",
                text: "Для создания маршрутной карты, перетащите узлы \"Справочника технолога\" в таблицу."
            });
        }
        if (Role === "designer"){
            /*$.ajax({
                type: "GET",
                url: "drawing_main_text_ajax/is_drawing_finished",
                dataType: "json",
                data: "type=get",
                async: false,
                success: function (answer) {
                    if (!answer.is_drawing_finished){
                        setNotificationToFieldInitialization("scheme", {
                            mainHeader: "Рабочий стол. Чертёж",
                            extraHeader:"",
                            text: `Соедините точки, чтобы завершить чертёж.`
                        });
                    }
                }
            });*/
            setNotificationToFieldInitialization("pdm_field", {
                mainHeader: "Изделия PDM/Стандартные изделия",
                extraHeader:"",
                text: "Вы можете перетаскивать изделия в область \"Рабочий стол. 3D\"."
            });
            setNotificationToFieldInitialization("scheme", {
                mainHeader: "Рабочий стол. Чертёж",
                extraHeader:"",
                text: `Два раза кликните на размер, чтобы его изменить.`
            });
            setNotificationToFieldInitialization("scheme", {
                mainHeader: "Рабочий стол. Чертёж",
                extraHeader:"",
                text: `Заполните основную надпись чертежа, проставьте размеры и сохраните изменения.`
            });
            setNotificationToFieldInitialization("specification", {
                mainHeader: "Спецификация",
                extraHeader:"",
                text: `Чтобы изменить таблицу спецификации, выберите детали во вкладках "PDM изделия" и "Стандартные изделия".`
            });
            setNotificationToFieldInitialization("fieldBlock", {
                mainHeader: "Рабочий стол. 3D",
                extraHeader:"",
                text: `Выбирайте изделия, чтобы изменить отображпемые детали.`
            });
        }
        if (Role === "production_master"){
            setNotificationToFieldInitialization("production_task_field", {
                mainHeader: "Задание на производство",
                extraHeader:"",
                text: `Для создания задания, перетащите техоперации в поле конкретного рабочего. После создания задания, сохраните изменения.`
            });
        }
    }
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
            /*setActionToBar({
                id: "openTab",
                type: "open",
                field: "Уведомления",
                text: `Открыта вкладка 'Уведомления'`
            })*/
        }
    });
}

function generateNotification(notification, delay = 0) {
    let toast_position = $("#toast-position");
    let button = (notification.button !== undefined)
        ? `<button class="btn btn-dark btn-sm btn-toolbar ml-auto mt-2 ${notification.button.class}">${notification.button.name}</button>` : '';
    let isAutoHide = false;
    if (delay) isAutoHide = true;
    toast_position.append(`
                <div class="toast" role="alert" data-autohide="${isAutoHide}" data-delay="${delay}" aria-live="assertive"
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
