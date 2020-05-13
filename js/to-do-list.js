let UserToDoListTasks = "";

function initToDoList() {
    //json/to_do_list.json
    $.ajax({
        type: 'GET',
        url: 'ajax/get_user_tasks_by_round',
        data: {
            login: login,
            round: Round
        },
        success: function (json) {
            console.log(json)
            //alert(json.tasks.length)
            setToDoList(json)
        }
    })
}

function setToDoList(json) {
    let $toDoListBody = $("#progress-bar-to-do-list");
    let $button = $("#progress-bar-to-do-list-body button");
    $button.on("click", function () {
        $button.find(".toDoNotification").remove();
    })

    if (json.tasks.length)
        json.tasks.forEach(function (_task, index) {
            $toDoListBody.append(combineToDoListTask(_task, index + 1));
            if (_task.trigger !== "openField"){
                $toDoListBody.on(`${_task.trigger}`, function () {
                    let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
                    if ($this.attr("data-is-done") == "true") return;
                    $this.find(".to-do-list-task").addClass("text-success").removeClass("text-dark");
                    $this.find(".to-do-list-task-check").addClass("fa-check").removeClass("fa-spinner");
                    $this.attr("data-is-done", "true");
                    updateToDoListTaskById($this.attr("task-id"), true);
                    setActionToBar({
                        id: "toDoTaskDone",
                        field: `Навигатор`,
                        type: "success",
                        text: `Задание '${_task.text}' выполнено`
                    })
                });

                // сделать задачу невыполненной
                $toDoListBody.on(`${_task.trigger}Revert`, function () {
                    let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
                    if ($this.attr("data-is-done") != "true") return;
                    $this.find(".to-do-list-task").addClass("text-dark").removeClass("text-success");
                    $this.find(".to-do-list-task-check").addClass("fa-spinner").removeClass("fa-check");
                    $this.attr("data-is-done", "false");
                    updateToDoListTaskById($this.attr("task-id"), false);
                    setActionToBar({
                        id: "toDoTaskUnDone",
                        field: `Навигатор`,
                        type: "inProcess",
                        text: `Задание '${_task.text}' изменило статус на 'Выполняется'`
                    })
                })
            }else{
                $toDoListBody.on("openField", function (e, addInfo) {
                    //console.log(addInfo.tabId, _task.add_info)
                    if (_task.add_info === addInfo.tabId){
                        let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
                        console.log($this.attr("data-is-done"))
                        if ($this.attr("data-is-done") == "true") return;
                        $this.find(".to-do-list-task").addClass("text-success").removeClass("text-dark");
                        $this.find(".to-do-list-task-check").addClass("fa-check").removeClass("fa-spinner");
                        $this.attr("data-is-done", "true");
                        updateToDoListTaskById($this.attr("task-id"), true);
                        setActionToBar({
                            id: "toDoTaskDone",
                            field: `Навигатор`,
                            type: "success",
                            text: `Задание '${_task.text}' выполнено`
                        })
                    }
                })
            }
        })
}

function updateToDoListTaskById(id, isFinished) {
    $.ajax({
        type: 'POST',
        url: 'ajax/add_user_task',
        data: {
            id: 1,
            login: login,
            isFinished: isFinished
        },
        success: function (json) {
            console.log(json)
            setToDoList(json)
        }
    })
}

function triggerToDoTaskEvent(eventName, isRevert = false, addInfo = {}) {
    isRevert = (isRevert) ? "Revert" : "";
    $("#progress-bar-to-do-list").trigger(`${eventName}${isRevert}`, addInfo);
}

function combineToDoListTask(task = {id: 0, text: "", isFinished: false}, position) {
    return `
        <li task-id="${task.id}" data-is-done="${task.isFinished}" class="dropdown-item disabled">
           <span class="${(task.isFinished) ? "text-success": "text-dark"} to-do-list-task">${position}. ${task.text}</span>
           <span class="to-do-list-task-check font-family-fontAwesome fa ${(task.isFinished) ? "fa-check": "fa-spinner"}"></span>
        </li>
    `
}

function addToDoTaskTOList(userLogin, round, toDoTask) {
    let oldToDoTaskList;
    $.ajax({
        type: 'GET',
        url: 'json/to_do_list_config.json',
        async: false,
        data: {
            "login": userLogin,
            "round": round
        },
        success: function (json) {
            oldToDoTaskList = json.tasks;
        }
    });
    oldToDoTaskList.push(toDoTask);
    let data = {
        "login": userLogin,
        "round": round,
        "tasks": oldToDoTaskList
    };
    //console.log(data)
    $.ajax({
        type: 'POST',
        url: 'json/to_do_list_config.json',
        data: data,
        success: function (json) {
            console.log(json);
        }
    });

}

/*
список триггеров:
    сохранение главной надписи чертежа saveScheme *
    сохранение таблицы спецификации saveSpecTable *
    создать маршрут createTaskRoute
    принять маршрут acceptTaskRoute
    отклонить маршрут rejectTaskRoute
    выбор всех изделий chooseAllDetails (статус изменяется от того выбраны все детали или нет) *
    сохранение маршрутной карты saveRouteMap *
    сохранение техпроцесса saveTechProcess *
    сохранение задания на производство для ВСЕХ рабочих saveProductionTasks *
    открыть вкладку openField
*/
