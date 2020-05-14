$(function () {
    $("body").css({
        "overflow-y": "scroll"
    })

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
    if(usersData.users.length)
        usersData.users.forEach(function (_userData) {
            let login = _userData[0];
            for (let round = 1; round < 4; round++){
                $.ajax({
                    type: 'GET',
                    url: '../ajax/get_user_tasks_by_round',
                    async: false,
                    data: {
                        'login': login,
                        'round': round
                    },
                    success: function (json) {
                        setUserTasks(json, login, round);
                    }
                });
            }
        });
}

function setUserTasks(data, login, round) {
    let combinedTasks = '';
    if (data.tasks.length)
        data.tasks.forEach(function (_task, index) {
            combinedTasks += combineUserTask(_task, index);
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

function combineUserTask(task = {text: "", trigger: "", add_info: ""}, index) {
    let isOpenFieldTrigger = false;
    let addSelection = combineOpenFieldSelection(task.add_info);
    if (task.trigger === "openField")
        isOpenFieldTrigger = true;

    return `
    <div class="userTask p-2 mb-3 shadow-ssm">
            <div class="h6">Задача №<span class="taskNumber">${index + 1}</span>
                <span class="font-family-fontAwesome taskDeleteButtonSpan fa-times font-size-12-em"></span>
             </div>
            
            <div class="row">
                <div class="col-4  h6">
                    Текст задачи (описание)
                </div>
                <div class="col-4 h6">
                    Условие выполнения задачи
                </div>
                <div class="col-3 h6 ${(isOpenFieldTrigger) ? "": "d-none"} task-trigger-selection-header">
                    Название вкладки
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-4">
                    <textarea class="form-control shadow-none">${task.text}</textarea>
                </div>
                <div class="col-4">
                    ${combineTriggerSelection(task.trigger)}
                </div>
                <div class="${(isOpenFieldTrigger) ? "": "d-none"} task-trigger-selection-body col-3">
                    ${addSelection}
                </div>
            </div>
    </div>
    `
}

function combineTriggerSelection(selectedTriggerName = "") {
    return `
        <select class="form-control task-trigger-selection shadow-none">
            <option ${(selectedTriggerName === "saveScheme") ? "selected": ""} task-description="Сохранить главную надпись чертежа" value="saveScheme">Сохранение главной надписи чертежа</option>
            <option ${(selectedTriggerName === "saveSpecTable") ? "selected": ""} task-description="Сохранить таблицу спецификации" value="saveSpecTable">Сохранение таблицы спецификации</option>
            <option ${(selectedTriggerName === "chooseAllDetails") ? "selected": ""} task-description="Выбрать все изделия" value="chooseAllDetails">Выбор всех изделий</option>
            <option ${(selectedTriggerName === "saveRouteMap") ? "selected": ""} task-description="Сохранить маршрутную карту" value="saveRouteMap">Сохранение маршрутной карты</option>
            <option ${(selectedTriggerName === "saveTechProcess") ? "selected": ""} task-description="Сохранить техпроцесс" value="saveTechProcess">Сохранение техпроцесса</option>
            <option ${(selectedTriggerName === "saveProductionTasks") ? "selected": ""} task-description="Сохранить задание на производство для всех рабочих" value="saveProductionTasks">Сохранение задания на производство для всех рабочих</option>
            <option ${(selectedTriggerName === "openField") ? "selected": ""} task-description="Открыть вкладку" value="openField">Открыть вкладку</option>
            <option ${(selectedTriggerName === "finishScheme") ? "selected": ""} task-description="Завершить чертеж" value="finishScheme">Завершение чертежа</option>
            <option ${(selectedTriggerName === "sendToPrint") ? "selected": ""} task-description="Отправить на печать" value="sendToPrint">Отправить на печать</option>
        </select>
    `
}

function combineOpenFieldSelection(selectedField = "") {
    return `
        <select class="form-control shadow-none open-field-selection">
            <option ${(selectedField === "specification") ? "selected": ""} value="specification">Спецификация</option>   
            <option ${(selectedField === "scheme") ? "selected": ""} value="scheme">Рабочий стол. Чертёж</option>   
            <option ${(selectedField === "fieldBlock") ? "selected": ""} value="fieldBlock">Рабочий стол. 3D</option>   
            <option ${(selectedField === "technological_process_field") ? "selected": ""} value="technological_process_field">Рабочий стол. Техпроцесс</option>   
            <option ${(selectedField === "route_map_field") ? "selected": ""} value="route_map_field">Маршрутная карта</option>   
            <option ${(selectedField === "technologist_guide_field") ? "selected": ""} value="technologist_guide_field">Справочник технолога</option>   
            <option ${(selectedField === "esi_field") ? "selected": ""} value="esi_field">Электронный состав изделия</option>   
            <option ${(selectedField === "std_field") ? "selected": ""} value="std_field">Стандартные изделия</option>   
            <option ${(selectedField === "pdm_field") ? "selected": ""} value="pdm_field">Изделия PDM</option>   
            <option ${(selectedField === "production_task_field") ? "selected": ""} value="production_task_field">Задание на производство</option>   
            <option ${(selectedField === "tasks_routes_field") ? "selected": ""} value="tasks_routes_field">Маршруты заданий</option>   
            <option ${(selectedField === "chat") ? "selected": ""} value="chat">Чат</option>   
            <option ${(selectedField === "work_outside_the_system_field") ? "selected": ""} value="work_outside_the_system_field">Работа вне системы</option>   
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
            $selection.append(combineUserLogin(_user[0]))
        })
}

function combineUserLogin(login) {
    return `
        <option value="${login}">${login}</option>
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
       if ($selection.val() === "openField"){
           $taskTriggerSelectionBody.addClass("d-block").removeClass("d-none");
           $taskTriggerSelectionHeader.addClass("d-block").removeClass("d-none");
           $textarea.val(`Открыть вкладку '${$selectionParent.find(".open-field-selection option:selected").text()}'`)
       }else{
           $taskTriggerSelectionBody.addClass("d-none").removeClass("d-block");
           $taskTriggerSelectionHeader.addClass("d-none").removeClass("d-block");
           $textarea.val(`${$selection.find("option:selected").attr("task-description")}`)
       }
    })

    taskListBody.on("change", ".open-field-selection", function () {
        let $selection = $(this);
        let $selectionParent = $selection.parent().parent().parent();
        let $textarea = $selectionParent.find("textarea");
        $textarea.val(`Открыть вкладку '${$selection.find("option:selected").text()}'`)
    })
}

function addNewTaskToList() {
    let login = $("#userLoginsSelection").val();
    let round = $("#userRoundSelection").val();
    let taskBody = $(`div[task-id="task-${login}-${round}"]`);
    taskBody.append(combineUserTask({text: "", trigger: "", add_info: ""}, taskBody.find(".userTask").length));
    taskBody.find(".userTask").last().find(".task-trigger-selection").trigger("change");
    let body =  document.body;
    body.scrollTo( 0, body.scrollHeight);
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
        let add_info = $task.find(".open-field-selection").val()
        tasks.push({
            id: (index + 1),
            text: (text !== undefined) ? text : "",
            trigger: (trigger !== undefined) ? trigger : "",
            add_info:(trigger === "openField") ? add_info : "",
            isFinished: false
        })
    });
    let data = {
        login: login,
        round: round,
        tasks: tasks
    };
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '../ajax/add_user_task',
        data: data,
        success: function (json) {
            console.log(json)
            setToDoList(json)
        }
    })
}

function deleteTaskFromList($buttonSpan) {
    let task = $buttonSpan.parent().parent();
    let isTaskNumberLast = ( Number(task.find(".taskNumber").text()) === task.parent().find(".taskNumber").length);
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
        $taskNumber.text( index + 1);
    })

}
