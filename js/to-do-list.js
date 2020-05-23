let amountOfTasks = 0;
let amountOfCompletedTasks = 0;
let oldToDoTasks = [];
let toDoTaskInterval;

async function initToDoList() {
    clearInterval(toDoTaskInterval);
    let progress_bar_to_do_list = $("#progress-bar-to-do-list");
    let progress_bar_to_do_list_body = $("#progress-bar-to-do-list-body");
    progress_bar_to_do_list_body.unbind("hide.bs.dropdown", preventDropDownFromHidingByClickOnOutside);
    progress_bar_to_do_list_body.on('hide.bs.dropdown', preventDropDownFromHidingByClickOnOutside);
    progress_bar_to_do_list_body.unbind("updateToDoTask");
    progress_bar_to_do_list.unbind("click")
    //json/to_do_list.json
    $.ajax({
        type: 'GET',
        url: 'ajax/get_user_tasks_by_round',
        async: false,
        data: {
            login: login,
            round: Round
        },
        success: function (json) {
            //console.log(json)
            oldToDoTasks = json.tasks;
            setToDoList(json)
        }
    });

    toDoTaskInterval = setInterval(function () {
        $.ajax({
            type: 'GET',
            url: 'ajax/get_user_tasks_by_round',
            data: {
                login: login,
                round: Round
            },
            success: function (json) {
                if (JSON.stringify(json.tasks) !== JSON.stringify(oldToDoTasks)){
                    $("#progress-bar-to-do-list-body").trigger("changeToDoTask");
                    oldToDoTasks = json.tasks;
                }else{
                    //console.log("No changes");
                }
            }
        });
    }, 8000);

    progress_bar_to_do_list.one("click", ".refreshToDoListButton", function () {
        let thisButton = this;
        startProcessOfSaving(thisButton)
        reloadToDoList();
    })

    progress_bar_to_do_list.on("refreshToDoList", function () {
        progress_bar_to_do_list_body.unbind("updateToDoTask");
        progress_bar_to_do_list.unbind("click")
        /*$(".refreshToDoListButton").unbind("updateToDoTask").unbind("refreshToDoList");
        progress_bar_to_do_list.unbind("updateToDoTask").unbind("refreshToDoList");*/
    })

    progress_bar_to_do_list.on("updateShell", function () {
        progress_bar_to_do_list_body.unbind("updateToDoTask");
        progress_bar_to_do_list.unbind("click")
    })
    progress_bar_to_do_list_body.on("updateToDoTask", function () {
        $(".refreshToDoListButton").trigger("click");
    })
}

async function reloadToDoList() {
    let $toDoListBody = $("#progress-bar-to-do-list");
    $toDoListBody.trigger("refreshToDoList");
    initToDoList().then(function () {
        stopProcessOfSaving(document.getElementsByClassName("refreshToDoListButton"))
        let $navbarToggler = $("#navbarToggler");
        //триггерим события для открытых вкладок
        let activeTab = $navbarToggler.find("a.active");
        triggerToDoTaskEvent("openField", 0, {tabId: activeTab.attr("tab-target"), name: activeTab.text()});
        if (Round > 1){
            let $chat_main = $("#chat_main");
            if ($chat_main.attr("chat-opened") == "true")
                $chat_main.trigger("chat-opened", {isReload: true});
        }
        if (Round === 3){
            let $esi = $("#right-side");
            if ($esi.attr("esi-opened") == "true")
                $esi.trigger("esi-opened", {isReload: true});
            let $left_accordion_collapse = $("#left-accordion-collapse");
            if ($left_accordion_collapse.length){
                let activePanel = $left_accordion_collapse.find("div.show").first();
                if (activePanel.length)
                    triggerToDoTaskEvent("openField", 0,
                        {tabId: activePanel.attr("id").replace("collapse-", ""), name: activePanel.attr("header-name")})
            }
        }
        if (Round > 1){
            let myTaskRoutes = $(".myTaskRoutes").find("span.caret-down").first();
            if (myTaskRoutes.length)
                triggerToDoTaskEvent("checkMyTaskRoutes", 0)
        }
    });

}

function preventDropDownFromHidingByClickOnOutside(e) {
    //console.log(e)
    if (e.clickEvent) {
        e.preventDefault();
    }
}

function setToDoList(json) {
    amountOfCompletedTasks = 0;
    amountOfTasks = 0;
    let $toDoListBody = $("#progress-bar-to-do-list");
    let progress_bar_line_body = $("#progress-bar-line-body");
    $toDoListBody.find("li").remove();

    amountOfTasks = json.tasks.length;
    if (json.tasks.length) {
        progress_bar_line_body.addClass("d-flex").removeClass("d-none")
        json.tasks.forEach(function (_task, index) {
            if (_task.isFinished === true) amountOfCompletedTasks++;
            $toDoListBody.append(combineToDoListTask(_task, index + 1));
            if (_task.trigger !== "openField") {
                setTriggerForTask($toDoListBody, _task);
                // сделать задачу невыполненной
                setRevertTriggerForTask($toDoListBody, _task);
            } else {
                setOpenFieldTriggerForTask($toDoListBody, _task);
            }
            $toDoListBody.one("refreshToDoList", function () {
                $toDoListBody.unbind(_task.trigger);
            });
        })
    }
    else{
        $toDoListBody.append(`
            <li class="text-dark m-2"><span class="font-family-fontAwesome fa-times mr-1"></span>Активных задач нет</li>
        `);
        progress_bar_line_body.removeClass("d-flex").addClass("d-none");
    }
    changeProgressLineWidth();
}

function setTriggerForTask($toDoListBody, _task) {
    $toDoListBody.on(`${_task.trigger}`, function () {
        let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
        if ($this.attr("data-is-done") == "true") return;
        amountOfCompletedTasks++;
        changeProgressLineWidth();
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
}

function setOpenFieldTriggerForTask($toDoListBody, _task) {
    $toDoListBody.on("openField", function (e, addInfo) {
        //console.log(addInfo.tabId, _task.add_info)
        if (_task.add_info == addInfo.tabId) {
            let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
            if ($this.attr("data-is-done") == "true") return;
            amountOfCompletedTasks++;
            changeProgressLineWidth();
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

function setRevertTriggerForTask($toDoListBody, _task) {
    $toDoListBody.on(`${_task.trigger}Revert`, function () {
        let $this = $toDoListBody.find(`li[task-id=${_task.id}]`).last();
        if ($this.attr("data-is-done") != "true") return;
        amountOfCompletedTasks--;
        changeProgressLineWidth();
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
            //console.log(json)
        }
    });
    if (oldToDoTasks.length)
        oldToDoTasks.forEach(function (_task) {
            if (_task.id == id)
                _task.isFinished = true;
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

function changeProgressLineWidth() {
    let progress_bar_line = $("#progress-bar-line");
    if (amountOfTasks !== 0)
        progress_bar_line.css("width", `${amountOfCompletedTasks/amountOfTasks*100}%`);
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
