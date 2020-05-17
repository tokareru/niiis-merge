let triggers_availability = "";

$(function () {
    $("body").css({
        "overflow-y": "scroll"
    });

    getTriggersAvailability();

    let usersData = initUserLogins();
    initUserTasks(usersData);
    setOnChangeSelection();

    $("#addNewTaskButton").on("click", function () {
        addNewTaskToList();
    }).removeClass("d-none");

    $("#saveTaskListButton").on("click", function () {
        saveTaskList();
    }).removeClass("d-none");

    $("#task-list-body").on("click", ".taskDeleteButtonSpan", function () {
        deleteTaskFromList($(this));
    });

})

function initUserTasks(usersData) {
    if (usersData.users.length)
        usersData.users.forEach(function (_userData) {
            let login = _userData[0];
            let role = chooseRole(_userData[2]);
            for (let round = 1; round < 4; round++) {
                $.ajax({
                    type: 'GET',
                    url: '../ajax/get_user_tasks_by_round',
                    async: false,
                    data: {
                        'login': login,
                        'round': round
                    },
                    success: function (json) {
                        setUserTasks(json, login, round, role);
                    }
                });
            }
        });
    let taskListBody = $("#task-list-body");
    taskListBody.sortable({
        axis: "y",
        items: "li.userTask",
        classes: {
            "ui-sortable-helper": "border-yellow"
        },
        cursor: "move",
        opacity: "0.98",
        handle: ".taskHeader",
        stop: function (e, ui) {
            let $ui = $(ui);
            $ui.removeClass("bg-success")
            recalculateTasksNumbers();
        },
        sort: function (e, ui) {
            /*let $ui = $(ui);
            $ui.addClass("bg-succes")*/
        }
    });
    taskListBody.disableSelection();
}

function setUserTasks(data, login, round, role) {
    let combinedTasks = '';
    if (data.tasks.length)
        data.tasks.forEach(function (_task, index) {
            combinedTasks += combineUserTask(_task, index, role, round);
        });
    $("#task-list-body").append(combineUserTaskList(combinedTasks, login, round));
}

function combineUserTaskList(combinedTasks, login, round) {
    return `
        <div class="d-none user-task-list" task-id="task-${login}-${round}" task-list-login="${login}" task-list-round="${round}">
            ${combinedTasks}
        </div>
    `;
}

function combineUserTask(task = {text: "", trigger: "", add_info: "", isFinished: false}, index, role, round) {
    let isOpenFieldTrigger = false;
    let addSelection = combineOpenFieldSelection(task.add_info, role, round);
    if (task.trigger === "openField")
        isOpenFieldTrigger = true;

    return `
    <li class="userTask p-2 mb-3 shadow-ssm">
            <div class="h6">Задача №<span class="taskNumber">${index + 1}</span>
                <span class="font-family-fontAwesome taskDeleteButtonSpan fa-times font-size-12-em mr-1"></span>
                <span class="font-family-fontAwesome taskHeader fa-arrows font-size-12-em"></span>
             </div>
            
            <div class="row">
                <div class="col-4 h6">
                    Текст задачи (описание)
                </div>
                <div class="col-3 h6">
                    Условие выполнения задачи
                </div>
                <div class="col-3 h6 ${(isOpenFieldTrigger) ? "" : "d-none"} task-trigger-selection-header">
                    Название вкладки
                </div>
                <div class="col-2 h6 text-center">
                    Выполнено?
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-4">
                    <textarea class="form-control shadow-none">${task.text}</textarea>
                </div>
                <div class="col-3">
                    ${combineTriggerSelection(task.trigger, role, round)}
                </div>
                <div class="${(isOpenFieldTrigger) ? "" : "d-none"} task-trigger-selection-body col-3">
                    ${addSelection}
                </div>
                <div class="col-2 taskStatusDiv">
                    <input ${(task.isFinished) ? "checked" : ""} type="checkbox" class="form-check form-control form-control-sm shadow-none">
                </div>
            </div>
    </li>
    `
}

function combineTriggerSelection(selectedTriggerName = "", role, round) {
    let combinedTriggers = "";
    triggers.forEach(function (_trigger) {
        if (isTriggerAvailable(role, round, _trigger.id))
            combinedTriggers += `
                <option value="${_trigger.id}" ${(selectedTriggerName === _trigger.id) ? "selected" : ""} task-description="${_trigger.description}">${_trigger.name}</option>
            `
    });
    return `
        <select class="form-control task-trigger-selection shadow-none">
            ${combinedTriggers}
        </select>
    `
}

function combineOpenFieldSelection(selectedField = "", role, round) {
    let combinedFields = '';
    fields.forEach(function (_field) {
        if (isFieldAvailable(role, round, _field.id))
            combinedFields += `
                <option ${(selectedField === _field.id) ? "selected" : ""} value="${_field.id}">${_field.name}</option>   
            `
    });

    return `
        <select class="form-control shadow-none open-field-selection">
            ${combinedFields}  
        </select>
    `;
}

function initUserLogins() {
    let usersData;
    $.ajax({
        url: 'get_change_users',
        type: 'GET',
        async: false,
        success: function (data) {
            console.log(data);
            setUserLogins(data);
            usersData = data;
        },
        error: function (data) {
            console.log('error');
        }
    });
    return usersData;
}

function setUserLogins(data) {
    let $selection = $("#userLoginsSelection");
    if (data.users.length)
        data.users.forEach(function (_user) {
            $selection.append(combineUserLogin(_user[0], _user[2]))
        })
}

function combineUserLogin(login, roleId) {
    return `
        <option class="userLogin" value="${login}" user-id="${roleId}">${login}</option>
    `
}

function setOnChangeSelection() {
    let userLoginsSelection = $("#userLoginsSelection");
    let userRoundSelection = $("#userRoundSelection");
    userLoginsSelection.on("change", function (event, data) {
        let currentLogin = userLoginsSelection.val();
        let currentRound = userRoundSelection.val();
        $(".user-task-list.d-block").removeClass("d-block").addClass("d-none");
        $(`div[task-id="task-${currentLogin}-${currentRound}"]`).addClass("d-block").removeClass("d-none");
    });

    userRoundSelection.on("change", function (event, data) {
        let currentLogin = userLoginsSelection.val();
        let currentRound = userRoundSelection.val();
        $(".user-task-list.d-block").removeClass("d-block").addClass("d-none");
        $(`div[task-id="task-${currentLogin}-${currentRound}"]`).addClass("d-block").removeClass("d-none");
    });
    userLoginsSelection.trigger("change");

    let taskListBody = $("#task-list-body");
    taskListBody.on("change", ".task-trigger-selection", function () {
        let $selection = $(this);
        let $selectionParent = $selection.parent().parent().parent();
        let $taskTriggerSelectionBody = $selectionParent.find(".task-trigger-selection-body");
        let $taskTriggerSelectionHeader = $selectionParent.find(".task-trigger-selection-header");
        let $textarea = $selectionParent.find("textarea");
        if ($selection.val() === "openField") {
            $taskTriggerSelectionBody.addClass("d-block").removeClass("d-none");
            $taskTriggerSelectionHeader.addClass("d-block").removeClass("d-none");
            $textarea.val(`Открыть вкладку "${$selectionParent.find(".open-field-selection option:selected").text()}"`)
        } else {
            $taskTriggerSelectionBody.addClass("d-none").removeClass("d-block");
            $taskTriggerSelectionHeader.addClass("d-none").removeClass("d-block");
            $textarea.val(`${$selection.find("option:selected").attr("task-description")}`)
        }
    })

    taskListBody.on("change", ".open-field-selection", function () {
        let $selection = $(this);
        let $selectionParent = $selection.parent().parent().parent();
        let $textarea = $selectionParent.find("textarea");
        $textarea.val(`Открыть вкладку "${$selection.find("option:selected").text()}"`)
    })
}

function addNewTaskToList() {
    let login = $("#userLoginsSelection").val();
    let round = $("#userRoundSelection").val();
    let roleId = Number($(".userLogin:selected").attr("user-id"));
    let taskBody = $(`div[task-id="task-${login}-${round}"]`);
    taskBody.append(combineUserTask({
        text: "",
        trigger: "",
        add_info: "",
        isFinished: false
    }, taskBody.find(".userTask").length, chooseRole(roleId), Number(round)));
    taskBody.find(".userTask").last().find(".task-trigger-selection").trigger("change");
    let body = document.body;
    body.scrollTo(0, body.scrollHeight);
}

function saveTaskList() {
    let login = $("#userLoginsSelection").val();
    let round = $("#userRoundSelection").val();
    let taskBody = $(`div[task-id="task-${login}-${round}"]`);
    let tasks = [];
    taskBody.find(".userTask").each(function (index) {
        let $task = $(this);
        let text = $task.find("textarea").val().toString();
        let trigger = $task.find(".task-trigger-selection").val();
        let add_info = $task.find(".open-field-selection").val();
        let taskStatus = $task.find(".taskStatusDiv").find("input").prop('checked');
        tasks.push({
            id: (index + 1),
            text: (text !== undefined) ? text : "",
            trigger: (trigger !== undefined) ? trigger : "",
            add_info: (trigger === "openField") ? add_info : "",
            isFinished: taskStatus
        })
    });
    let data = {
        login: login,
        round: round,
        tasks: tasks
    };
    //console.log(data);
    $.ajax({
        type: 'POST',
        url: '../ajax/add_user_task',
        data: data,
        success: function (json) {
            console.log(json)
        }
    })
}

function deleteTaskFromList($buttonSpan) {
    let task = $buttonSpan.parent().parent();
    let isTaskNumberLast = (Number(task.find(".taskNumber").text()) === task.parent().find(".taskNumber").length);
    task.remove();
    if (!isTaskNumberLast)
        recalculateTasksNumbers();
}

function recalculateTasksNumbers() {
    let login = $("#userLoginsSelection").val();
    let round = $("#userRoundSelection").val();
    let taskBody = $(`div[task-id="task-${login}-${round}"]`);
    taskBody.find(".taskNumber").each(function (index) {
        let $taskNumber = $(this);
        $taskNumber.text(index + 1);
    })

}

function isTriggerAvailable(role, round, trigger) {
    round = Number(round);
    let triggerInfo = getTriggersAvailability();
    let check = false;
    triggerInfo.forEach(function (_role) {
        if (_role.role === role) {
            _role.rounds.forEach(function (_round) {
                if (_round.round === round) {
                    _round.triggers.forEach(function (_trigger) {
                        if (_trigger.trigger === trigger)
                            check = true;
                    })
                }
            })
        }
    });
    return check;
}

function isFieldAvailable(role, round, field) {
    round = Number(round);
    let triggerInfo = getTriggersAvailability();
    let check = false;
    triggerInfo.forEach(function (_role) {
        if (_role.role === role) {
            _role.rounds.forEach(function (_round) {
                if (_round.round === round) {
                    _round.fields.forEach(function (_field) {
                        if (_field.fieldId === field)
                            check = true;
                    })
                }
            })
        }
    });
    return check;
}

function getTriggersAvailability() {
    // triggers_availability.json
    if (triggers_availability === "")
        $.ajax({
            url: '../json/triggers_availability.json',
            type: 'GET',
            async: false,
            success: function (data) {
                console.log(data);
                triggers_availability = data.data;
            },
            error: function (data) {
                console.log('error');
            }
        });
    return triggers_availability;
}

function chooseRole(id) {
    id = Number(id);
    let role = ""
    if (id === 1)
        role = "designer"
    if (id === 2)
        role = "technologist"
    if (id === 3)
        role = "approver"
    if (id === 4)
        role = "production_master"
    if (id === 5)
        role = "worker"
    return role;
}

let triggers = [
    {
        id: "saveScheme",
        name: "Сохранение главной надписи чертежа",
        description: "Сохранить главную надпись чертежа"
    },
    {
        id: "saveSpecTable",
        name: "Сохранение таблицы спецификации",
        description: "Сохранить таблицу спецификации"
    },
    {
        id: "chooseAllDetails",
        name: "Выбор всех изделий",
        description: "Выбрать все изделия"
    },
    {
        id: "saveRouteMap",
        name: "Сохранение маршрутной карты",
        description: "Сохранить маршрутную карту"
    },
    {
        id: "saveTechProcess",
        name: "Сохранение техпроцесса",
        description: "Сохранить техпроцесс"
    },
    {
        id: "saveProductionTasks",
        name: "Сохранение задания на производство для всех рабочих",
        description: "Сохранить задание на производство для всех рабочих"
    },
    {
        id: "openField",
        name: "Вкладка открыта",
        description: "Открыть вкладку"
    },
    {
        id: "checkMyTaskRoutes",
        name: 'Проверка "Моих маршрутов"',
        description: 'Проверить "Мои маршруты" во вкладке "Маршруты заданий'
    },
    {
        id: "addNewTaskRoute",
        name: "Создание нового маршрута",
        description: 'Создать новый маршрут в "Маршрутах заданий"'
    },
    {
        id: "finishScheme",
        name: "Завершение чертежа",
        description: 'Завершить чертеж'
    },
    {
        id: "sendToPrint",
        name: "На печать отправлено",
        description: 'Отправить на печать'
    }
]

let fields = [
    {
        id: "scheme",
        name: "Рабочий стол. Чертеж"
    },
    {
        id: "fieldBlock",
        name: "Рабочий стол. 3D"
    },
    {
        id: "specification",
        name: "Спецификация"
    },
    {
        id: "route_map_field",
        name: "Маршрутная карта"
    },
    {
        id: "technological_process_field",
        name: "Рабочий стол. Техпроцесс"
    },
    {
        id: "technologist_guide_field",
        name: "Справочник технолога"
    },
    {
        id: "esi_field",
        name: "Электронный состав изделия"
    },
    {
        id: "pdm_field",
        name: "Изделия PDM"
    },
    {
        id: "std_field",
        name: "Стандартные изделия"
    },
    {
        id: "production_task_field",
        name: "Задание на производство"
    },
    {
        id: "tasks_routes_field",
        name: "Маршруты заданий"
    },
    {
        id: "chat",
        name: "Чат"
    },
    {
        id: "work_outside_the_system_field",
        name: "Работа вне системы"
    }
]
