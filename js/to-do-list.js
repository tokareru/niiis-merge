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
            //console.log(json)
            setToDoList(json)
        }
    });

    $("#progress-bar-to-do-list").one("click", ".refreshToDoListButton", function () {
        let $toDoListBody = $("#progress-bar-to-do-list");
        $toDoListBody.trigger("refreshToDoList");
        initToDoList();
    })
}

function setToDoList(json) {
    let $toDoListBody = $("#progress-bar-to-do-list");
    $toDoListBody.empty();
    $toDoListBody.append(`
        <span class="refreshToDoListButton font-size-12-em font-family-fontAwesome fa-refresh"></span>
    `)

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
                        text: `Задание '${_task.text.replace(/"/g, "'")}' выполнено`.replace(/''/g, "'")
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
                        text: `Задание '${_task.text.replace(/"/g, "'")}' изменило статус на 'Выполняется'`.replace(/''/g, "'")
                    })
                })
            }else{
                $toDoListBody.on("openField", function (e, addInfo) {
                    //console.log(addInfo.tabId, _task.add_info)
                    if (_task.add_info == addInfo.tabId){
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
                            text: `Задание '${_task.text.replace(/"/g, "'")}' выполнено`.replace(/''/g, "'")
                        })
                    }
                })
            }
            $toDoListBody.one("refreshToDoList", function () {
                $toDoListBody.unbind(_task.trigger);
            });
        })
    else{
        $toDoListBody.append(`
        <li class="text-dark m-2"><span class="font-family-fontAwesome fa-times mr-1"></span>Активных задач нет</li>
        `)
    }
}

function updateToDoListTaskById(id, isFinished) {
    $.ajax({
        type: 'POST',
        url: 'ajax/update_user_task',
        data: {
            id: id,
            login: login,
            isFinished: isFinished
        },
        success: function (json) {
            console.log(json)
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
    let newToDoTasks = [];
    $.ajax({
        type: 'GET',
        url: 'ajax/get_user_tasks_by_round',
        data: {
            login: userLogin,
            round: round
        },
        success: function (json) {
            toDoTask.id = json.tasks.length + 1;
            if (json.tasks.length)
                json.tasks.forEach(function (_task, _index) {
                    delete _task.global_id;
                    if (_task.trigger !== "checkMyTaskRoutes") {
                        newToDoTasks.push(_task)
                    }
                });
            newToDoTasks.push(toDoTask);
            if (newToDoTasks.length){
                newToDoTasks.forEach(function (_task, index) {
                    _task.id = index + 1;
                })
            }
            let data = {
                login: userLogin,
                round: round,
                tasks: newToDoTasks
            };
            //console.log(data)
            $.ajax({
                type: 'POST',
                url: 'ajax/add_user_task',
                data: data,
                success: function (json) {
                    console.log(json);
                }
            });
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
