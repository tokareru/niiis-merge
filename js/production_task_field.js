//production_task_field

function initProductionTaskField () {
    if (Round < 3)
        initProductionTask_1_2_Rounds();
    else{
        $("#production_task_body_round_1_2").remove();
        let $header = $("#worker_product_list_header");
        if (Role !== "production_master"){
            $("#product_task_save_button").remove();
            $("#product_tech_process_field_container").parent().remove();
            $header.text("Ваши задачи")
        }else{
            $header.text("Список рабочих");
        }

        if (Role !== "production_master")
            $("#product_task_reload_button").addClass("ml-auto")

        getJsonByURL(techGuideURL, function (json) {
            techGuideJson = json;
            initProductionTask_3_Rounds();
        }, {});
    }

}

function initProductionTask_3_Rounds() {
    let production_task_body = $(`#production_task_body`);
    production_task_body.unbind("click");
    let $workers_drop = $("#workers_drop_area");
    let nameUsers = [];
    let techProcess;
    // 'ajax/get_techproccess'
    // 'json/new_techprocess.json'
    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        async: false,
        success: function (json) {
            techProcess = json;
        }
    });

    if (techProcess === undefined || techProcess === null){
        $("#product_tech_process_field_drop").append(`
            <p class="alert-warning p-2 alertMessage">Невозможно создать задания на производство, так как не существует техпроцесса</p>
        `);
        $("#product_task_save_button").attr("disabled", "true");
    }
    else if (techProcess.data.length === 0){
        $("#product_tech_process_field_drop").append(`
            <p class="alert-warning p-2 alertMessage">Невозможно создать задания на производство, так как не существует техпроцесса</p>
        `);
        $("#product_task_save_button").attr("disabled", "true");
    }else {
        $("#product_task_save_button").removeAttr("disabled");
    }
    if (Role === "production_master"){
        initProductTaskForProductMasterFor3Round($workers_drop, techProcess, nameUsers);
    } else{
        initProductTaskForWorkerFor3Round($workers_drop, techProcess);
    }

    production_task_body.on("click", "#product_task_save_button", function () {
        saveProductionTable_3_Round(nameUsers, this);
    })
        .on("click", ".deleteNodeButtonRM", function () {
            deleteWorkerTask($(this));
        });

    production_task_body.on("click", "#product_task_reload_button", function () {
        reloadProductionTask_3_Round(this)
    });
}

function initProductTaskForProductMasterFor3Round($workers_drop, techProcess, nameUsers) {
    setTechProcessForProductionTask(techProcess);
    AllInfo.forEach(function (user) {
        if (user.role === "worker") nameUsers.push(user)
    });
    //ajax/get_production_task_3
    if (nameUsers.length)
        nameUsers.forEach(function (user) {
            $.ajax({
                url: "ajax/get_production_task_3",
                type: 'GET',
                data:{
                    login: user.login
                },
                success: function (json) {
                    //console.log(json);
                    json = {
                        data: (json !== null && json !== undefined) ? json : []
                    }
                    stopProcessOfSaving(document.getElementById("product_task_reload_button"))
                    $workers_drop.append(combineWorkerNode(user));
                    let $workerArea = $workers_drop.find(".operationsForWorker").last();
                    if (json === null || json === undefined){
                        json = {
                            data: []
                        }
                    }
                    if (json.data.length)
                        json.data.forEach(function (_detailArea) {
                            let detail = getDetailById(_detailArea.id)
                            $workerArea.append(combineDetailArea({
                                name: `${(detail.designation.replace(/ /g, "") === "") ? "" : (detail.designation + " - ")}${detail.name}`,
                                id: _detailArea.id,
                                lvl: 0,
                                text: _detailArea.text,
                                techProcess: _detailArea.techProcess
                            }, true))
                        });

                    setToggler("workers_drop_area");
                    $workers_drop.find(".user-login-node-li").last().each(function () {
                        $(this).find(".detailDraggableDropped").each(function () {
                            let _detail = $(this);
                            _detail.find(".techNameDropped").each(function () {
                                let _techName = $(this);
                                _techName.find("span.caret").first().trigger("click");
                            });
                            _detail.find("span.caret").first().trigger("click")
                        })
                    }).find("span.caret").first().trigger("click");

                    $workers_drop.find(".operationsForWorker").droppable({
                        tolerance: "pointer",
                        accept: ".techOperation",
                        drop: function (e, ui) {
                            let $draggable = $(ui.draggable);
                            let $this = $(this);
                            setDropAreaForProductMaster($draggable, $this)
                        }
                    });
                }
            });

        });
    else {
        $("#workers_drop_area").append(`
            <p class="alert-warning p-2">Невозможно создать задания на производство, так как список рабочих пуст</p>
        `);
        $("#product_task_save_button").attr("disabled", "true");
    }
}

function setDropAreaForProductMaster($draggable, $this) {
    let $parentTechName = $draggable.parent().parent();
    let $parentDetail = $parentTechName.parent().parent();

    let id = $draggable.attr("tech-id");
    let lvl = $draggable.attr("tech-lvl");

    let nodes = [];
    let $nodes = $draggable.find(".techNode");
    if ($nodes.length)
        $nodes.each(function () {
            let $node = $(this);
            let fields = [];
            let $fields = $node.find(".techField");
            if ($fields.length)
                $fields.each(function () {
                    let $field = $(this);
                    fields.push({
                        id: $field.attr("tech-id"),
                        lvl: $field.attr("tech-lvl"),
                        name: $field.find("span.caret").first().text()
                    })

                });
            nodes.push({
                id: $node.attr("tech-id"),
                lvl: $node.attr(("tech-lvl")),
                name: $node.find("span").first().text(),
                fields: fields
            })

        });

    let workerNode = {
        name: getTechField( id, lvl).name,
        id: id,
        lvl: lvl,
        nodes: nodes
    };

    // ищем, есть ли у рабочего такая же деталь
    let draggableDetailId = Number($parentDetail.attr("detail-id"));
    let draggableDetailName = $parentDetail.find("span.caret").first().text();
    let isDetailAlreadyHere = false;
    let detailPlaceholder = $this;
    $this.find(".detailDraggableDropped").each(function () {
        let thisDetail = $(this);
        if (Number(thisDetail.attr("detail-id")) === draggableDetailId && !isDetailAlreadyHere) {
            isDetailAlreadyHere = true;
            detailPlaceholder = thisDetail;
        }
    });

    if (!isDetailAlreadyHere){
        detailPlaceholder.append(combineDetailArea({
            id: draggableDetailId,
            lvl: 0,
            name: draggableDetailName,
            text: draggableDetailName,
            techProcess: []
        }, true));
        $this = $this.find(".techProcessDropArea").last();
    }else{
        $this = detailPlaceholder.find(".techProcessDropArea").last();
    }

    let placeholderTechName = $this;
    let check = false;
    $this.find(".techNameDropped").each(function () {
        let $this = $(this);
        if (Number($this.attr("tech-id")) === Number($parentTechName.attr("tech-id"))){
            placeholderTechName = $this.find(".techOperationsDropArea");
            check = true;
        }
    });

    if (check){
        placeholderTechName.append(combineTechOperation(workerNode, true));
        setToggler("workers_drop_area");
        placeholderTechName.parent().parent().parent().find("span.caret").first().not(".caret-down").trigger("click")
        placeholderTechName.parent().find("span").first().not(".caret-down").trigger("click")
    }else{
        placeholderTechName.append(combineTechName({
            id: $parentTechName.attr("tech-id"),
            lvl: $parentTechName.attr("tech-lvl"),
            name: $parentTechName.find("span").first().text(),
            operations: [workerNode]
        }, true));
        //console.log(placeholder.find(".techNameDropped").last().find("span").first().not("caret-down"));
        setToggler("workers_drop_area");
        placeholderTechName.parent().find("span.caret").first().not(".caret-down").trigger("click");
        placeholderTechName.find(".techNameDropped").last().find("span").first().trigger("click");
    }

    //$this.append(combineTechOperation(workerNode));
    let userName = $this.parent().parent().parent().attr("user-login");
    let operationName = $draggable.find("span").first().text();
    //$draggable.remove()
    setToggler("workers_drop_area");

    setActionToBar({
        id: "addTaskForWorker",
        type: "addNew",
        field: "Задание на производство",
        text: `Пользователю '${userName}' добавили оперецию '${operationName}'`
    })
}

function initProductTaskForWorkerFor3Round($workers_drop, techProcess) {
    //json/production_task.json
    //ajax/get_production_task_3
    // ajax/get_techproccess
    // json/new_techprocess.json
    $.ajax({
        url: "ajax/get_production_task_3",
        type: 'GET',
        data:{
            login: login
        },
        success: function (json) {
            console.log(json)
            json = {
                data: (json !== null && json !== undefined) ? json : []
            }
            stopProcessOfSaving(document.getElementById("product_task_reload_button"))
            let lastOperations = "";
            let techOperations = [];
            $(".techProcessCol").remove();
            $(".workerAreaCol").addClass("mx-auto");
            if (json.data.length){
                setAllTechProcess(json, $workers_drop, "workers_drop_area");
                setToggler("workers_drop_area");
                $workers_drop.find(".detailDraggableDropped").each(function () {
                    let _detail = $(this);
                    _detail.find(".techNameDropped").each(function () {
                        let _techName = $(this);
                        _techName.find("span.caret").first().trigger("click");
                    });
                    _detail.find("span.caret").first().trigger("click")
                });
            }else {
                $("#workers_drop_area").append(`
                     <p class="alert-warning p-2">У вас нет задач, так как их не сделал мастер производства</p>
                `)
            }
        }
    });
}

function getTechNameFromTechProcess(techProcess, position) {
    let techOperation = {};
    let techOperations = [];
    techProcess.techProcess.forEach(function (techName) {
        if (techName.operations.length)
            techName.operations.forEach(function (_techOperation) {
                _techOperation.techNameId = techName.id;
                _techOperation.techNameName = getTechName(techName.id, techName.lvl).name;
                _techOperation.techNameLvl = techName.lvl;
                techOperations.push(_techOperation);
            })
    });
    if (techOperations.length)
        techOperations.forEach(function (_techOperation, index) {
            if ((index + 0) === Number(position)){
                techOperation = _techOperation;
                techOperation.lvl = index;
                techOperation.name = getTechField(techOperation.id, 3).name;
                if (techOperation.nodes.length)
                    techOperation.nodes.forEach(function (_node) {
                        _node.name = getTechNode(_node.id, 2).name;
                    })
            }

        });
    //console.log(techOperation)
    return techOperation;
}

function sortTechOperationsToTechName(techOperations = [{id: "", lvl: "", nodes: [], techNameId: "", techNameLvl: "", techNameName: "", name: ""}], techProcess) {
    let techNames = [];
    if (techOperations.length)
        techOperations.forEach(function (_techOperation, index) {
            if (!isTechNameAlreadyThere(techNames, _techOperation.techNameId))
                techNames.push({
                    id: _techOperation.techNameId,
                    lvl: _techOperation.techNameLvl,
                    name: _techOperation.techNameName,
                    shift: _techOperation.lvl,
                    operations: [_techOperation]
                });
            else {
                techNames.forEach(function (_techName) {
                    if (Number(_techName.id) === Number(_techOperation.techNameId))
                        _techName.operations.push(_techOperation)
                })

            }
        });

    //console.log(techNames);
    return techNames;
}

function isTechNameAlreadyThere(techNames = [], techNameId) {
    let check = false;
    if (techNames.length)
        techNames.forEach(function (_techName) {
            if (Number(_techName.id) === Number(techNameId))
                check = true;
        });
    return check;
}

function combineWorkerTaskNode(data = { name: "", lvl: "", id: ""}) {
    let deleteButton = (Role === "production_master") ? `<span class="deleteNodeButtonRM"></span>` : ``;
    return `
        <li tech-id="${data.id}" tech-lvl="${data.lvl}">
            <span class="mr-2">${data.name}</span>${deleteButton}
        </li>
    `
}

function combineWorkerNode(user = {name: "", login: "", role: "", roleName: ""}) {
    return `
        <li class="user-login-node-li" user-login="${user.login}">
            <span class="caret">${user.name}</span>
            <ul  style='min-height: 35px;' class='nested border-bottom pb-2 operationsForWorker border border-color-transparent rounded'>
                
            </ul>
        </li>
    `;
}

function setTechProcessForProductionTask(techProcess) {
    let $field = $("#product_tech_process_field_drop");
    setAllTechProcess(techProcess, $field, "product_tech_process_field_drop");

    $field.find(".detailDraggableDropped").each(function () {
        let _detail = $(this);
        _detail.find(".techNameDropped").each(function () {
            let _techName = $(this);
            /*_techName.find(".techOperation").each(function () {
                $(this).find("span.caret").first().trigger("click");
            });*/
            _techName.find("span.caret").first().trigger("click");
        });
        _detail.find("span.caret").first().trigger("click")
    });

    if (Role === "production_master")
        $field.find(".techOperation").draggable({
            helper: 'clone',
            items: ".techOperation",
            cancel: ".techFieldsDropArea, .techField, .techNode",
            drag: function (event, ui) {
                let $helper = $(ui.helper);
                $helper.css("list-style-type", "none !important");
                $helper.find("ul").first().hide();
                $helper.css("z-index", "9999999999 !important");
                $helper.css("width", "270px");
                $(".operationsForWorker").addClass("border-warning").removeClass('border-color-transparent')
            },
            stop: function (e, ui) {
                $(".operationsForWorker").addClass("border-color-transparent").removeClass('border-warning')
            }

        })
}

function initProductionTask_1_2_Rounds() {
    $("#production_task_body_round_3").remove();
    let production_task_body_round_1_2 = $("#production_task_body_round_1_2");
    let selectUserBody = $("#productionTaskSelectUserBody");
    let nameUsers = [];
    if (Role === "production_master"){
        AllInfo.forEach(function (user) {
            if (user.role === "worker") nameUsers.push(user)
        });
    }
    else{
        selectUserBody.attr("disabled", "disabled");

        production_task_body_round_1_2.find("form").remove();
        $(`
            <div class="h4">Ваше задание</div>
        `).insertAfter(production_task_body_round_1_2.find(".spec_header").first());

        $("#product_task_save_button").remove();
        $("#product_task_reload_button").addClass("ml-auto");
        nameUsers.push({
            name: login,
            login: login,
            role: Role,
            roleName: "Мастер производства"
        })
    }

    nameUsers.forEach(function (user,index) {
        selectUserBody.append(`<option value='production-current-user-${index}'>${user.login}</option>`);
    });

    let productionTaskPrintLink = $("#productionTaskPrintLink");
    productionTaskPrintLink.unbind("click");
    productionTaskPrintLink.on("click", function (e) {
        e.preventDefault();
        let currentLogin = selectUserBody.find("option:selected").text();
        if (Role === "worker") currentLogin = login;
        setActionToBar({
            id: "sendToPrintProductionTask",
            type: "print",
            field: "Задание на производство",
            text: `Задание на производство отправлено на печать для пользователя ${currentLogin}`
        }).then(function () {
            let win = window.open(`print_report/production_task?user=${currentLogin}`, '_blank');
            win.focus();
            if (Role === "worker"){
                triggerToDoTaskEvent("sendToPrintProdWork");
            }else{
                $(`.prodTaskTableBody[user-login='${currentLogin}']`).attr("data-printed", true)
                let prodTablesLength = $(".prodTaskTableBody").length;
                let prodPrintedTablesLength = $(".prodTaskTableBody[data-printed='true']").length;
                if (prodTablesLength === prodPrintedTablesLength)
                    triggerToDoTaskEvent("sendToPrintProdTask");
            }
        });

    })

    selectUserBody.change(function (e) {
        let val = this.value;
        let $div = $(`#${val}`);
        //let userLogin = $div.attr("user-login");
        $div.toggle();
        //$("#productionTaskPrintLink").attr("href", `print_report/production_task?user=${userLogin}`)
        $("#prod_task_table_container").find("div").each(function () {
            if ($(this).attr("id") !== val) $(this).hide();
        });
        /*nameUsers.forEach(function (user, index) {
            if (val !== ("production-current-user-" + index)){
                //console.log("production-current-user-" + index)
                $('production-current-user-${index}').hide()
            }
        })*/
    });

    let $tableBlock = $("#prod_task_table_container");

    nameUsers.forEach(function (user, index) {
        //console.log(user.login)
        $.ajax({
            type: "GET",
            url: "ajax/get_production_task_1_2",
            dataType: "json",
            data: {
                login: user.login
            },
            success: function (json) {
                if (json.length || Role === "production_master"){
                    setProductionTable_1_2_Rounds($tableBlock, `production-current-user-${index}`, json, user.login, false, false);
                    if (index)
                        $(`#production-current-user-${index}`).hide();
                }else {
                    $(`#prod_task_table_container`).append(`
                        <p class="alert-warning p-2">Заданий нет</p>
                    `);
                }
            },
            error: function (message) {
                console.log("Данные не загружены");
                setProductionTable_1_2_Rounds($tableBlock, `production-current-user-${index}`, [], user.login, false, false);
                if (index)
                    $(`#production-current-user-${index}`).hide();
            }
        })
    });

    $tableBlock.on("click", ".addNewRowToProdTableButton", function () {
        let $trs = $("#prod_task_table_container").find(`#${$("#productionTaskSelectUserBody").val()}`).find("tbody tr");
        let lastTr = $trs.last();
        $(combineRowForProdTable()).insertBefore(lastTr);
        setActionToBar({
            id: "addNewRowToProductTable",
            type: "addNew",
            field: "Задание на производство",
            text: "Добавлена новая строка в таблицу"
        })
    });

    $tableBlock.on("click", ".deleteNodeButtonRM", function () {
        let $this = $(this);
        let row = $this.parent().parent();
        row.remove();
        setActionToBar({
            id: "deleteRowOfProductTable",
            type: "delete",
            field: "Задание на производство",
            text: "Удалена строка из таблицы"
        })
    });

    $(`#production_task_body`).on("click", "#product_task_save_button", function () {
        saveProductionTable_1_2_Rounds($("#prod_task_table_container").find(`#${$("#productionTaskSelectUserBody").val()}`), this);
    })

    $(`#production_task_body`).on("click", "#product_task_reload_button", function () {
        reloadProductionTask_1_2_Rounds($tableBlock, this);
    })

    /*generateTable(tableInfo, {
        table_block: "#prod_task_table_block",
        edit_mode_div: "#prod_task_table_edit",
        url: ""
    });*/
}

function reloadProductionTask_1_2_Rounds($tableBlock, thisButton) {
    startProcessOfSaving(thisButton);
    let $table;
    if (Role === "production_master"){
        $table = $("#prod_task_table_container").find(`#${$("#productionTaskSelectUserBody").val()}`);
    }else {
        $table = $tableBlock.find("div").first();
    }

    let index = $table.attr("id");
    let userLogin = $table.attr("user-login");
    let isSaved = Boolean($table.attr("data-saved"));
    let isPrinted = Boolean($table.attr("data-printed"));
    $table.remove();
    $.ajax({
        type: "GET",
        url: "ajax/get_production_task_1_2",
        dataType: "json",
        data: {
            login: userLogin
        },
        success: function (json) {
            setProductionTable_1_2_Rounds($tableBlock, index, json, userLogin, isSaved, isPrinted);
            stopProcessOfSaving(thisButton);
        },
        error: function (message) {
            console.log("Данные не загружены");
            setProductionTable_1_2_Rounds($tableBlock, index, [], userLogin, isSaved, isPrinted);
            stopProcessOfSaving(thisButton);
        }
    })
}

function reloadProductionTask_3_Round(thisButton) {
    startProcessOfSaving(thisButton)
    $("#product_tech_process_field_drop").empty();
    $("#workers_drop_area").empty();
    initProductionTask_3_Rounds();
}

function setProductionTable_1_2_Rounds($tableBlock, id, data = [{name: "", job: "", techOperation: "", task: ""}], userLogin, isSaved = false, isPrinted = false) {
    let trs = "";
    //console.log(data)
    if (data !== null)
        if (data.length){
            data.forEach(function (row) {
                trs += combineRowForProdTable(row);
            })
        }else {
            trs = combineRowForProdTable({name: "", job: "", techOperation: "", task: ""});
        }
    //console.log(trs)
    let emptyTd = '';
    let newButton = "";
    if (Role === "production_master"){
       emptyTd = `<td style="width: 20px"></td>`;
       newButton = `<tr style="width: 45px;">
                        <td style="padding-left: 14px;" class="font-family-fontAwesome font-size-12-em fa-plus addNewRowToProdTableButton"></td>
                    </tr>`
    }

    $tableBlock.append(`
        <div id="${id}" class="prodTaskTableBody" user-login="${userLogin}" data-saved="${isSaved}" data-printed="${isPrinted}">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="font-weight-bold">${emptyTd}<td>ФИО</td><td>Должность</td><td>Техоперации</td><td>Задание</td></tr>
                </thead>
                <tbody>
                    ${trs}
                    ${newButton}
                </tbody>
            </table>
        </div>
    `);

    let $table = $tableBlock.find("table").last();

    $table.on("keydown", ".prodRowsInput", function (e) {
        prodTableMoveByKey(e, $table, $(this));
    });

    if (Round !== 3 && Role === "production_master"){
        $table.on("change", ".prodRowsInput", function (event) {
            setActionToBar({
                id: "changeProdTableCell",
                type: "edit",
                field: "Задание на производство",
                text: `Изменена ячейка таблицы 'Задание на производство'`
            })
        });
    }

}

function prodTableMoveByKey(e, $table, $input) {
    if (Round !== 3 && Role === "production_master" && e.which === 9){
        e.preventDefault();
        let isNext = false;
        let $inputs = $table.find('.prodRowsInput');
        $inputs.each(function (index) {
            if ($inputs.length === index + 1){
                $(this).blur();
            }
            if (isNext){
                $(this).focus();
                isNext = false;
                return;
            }
            if ($input.get(0) === $(this).get(0)){
                isNext = true;
            }
        })
    }
}

function saveProductionTable_1_2_Rounds($table, thisButton) {
    let userLogin = $table.attr("user-login");
    let $rows = $table.find("tbody .prodRows");
    let saveData = [];
    if ($rows.length)
        $rows.each(function () {
            let $this = $(this);
            let $inputs = $this.find("td input");
            saveData.push({
                name: $inputs.eq(0).val(),
                job: $inputs.eq(1).val(),
                techOperation: $inputs.eq(2).val(),
                task: $inputs.eq(3).val()
            })
        });
    //console.log(saveData);
    startProcessOfSaving(thisButton, false)
    $.ajax({
        type: 'POST',
        url: 'ajax/save_production_task_1_2',
        data: {
            productTasks: saveData,
            login: userLogin
        },
        success: function (res) {
            //console.log(res)
            $table.attr("data-saved", "true");
            stopProcessOfSaving(thisButton, false)
            setActionToBar({
                id: "saveWorkerTaskRound3",
                type: "save",
                field: "Задание на производство",
                text: "Задания сохранены"
            });

            let amountOfSavedProductionTasksSaved = $("#prod_task_table_container div[data-saved=true]").length;
            let amountOfSavedProductionTasks = $("#prod_task_table_container table").length;

            if (amountOfSavedProductionTasks === amountOfSavedProductionTasksSaved)
                triggerToDoTaskEvent("saveProductionTasks");
        }
    })
}

function saveProductionTable_3_Round(users = [{name: "", login: "", role: "", roleName: ""}], thisButton) {
    let $workers_drop = $("#workers_drop_area");
    //console.log(users)
    let saveCount = 0;
    startProcessOfSaving(thisButton, false)
    if (users.length)
        users.forEach(function (user = {name: "", login: "", role: "", roleName: ""}) {
            let userLi = $workers_drop.find(`li[user-login='${user.login}']`);
            let saveData = collectDataFromTechProcess(userLi);
            let data = {
                login: user.login,
                productTasks: saveData.data
            };
            console.log(data);
            //console.log(user.login);
            $.ajax({
                type: 'POST',
                url: 'ajax/save_production_task_3',
                data: data,
                success: function (res) {
                    //console.log(res);
                },
                complete: function () {
                    saveCount++;
                    if (saveCount === users.length) stopProcessOfSaving(thisButton, false)
                }
            })

        });
    setActionToBar({
        id: "saveWorkerTaskRound3",
        type: "save",
        field: "Задание на производство",
        text: "Задания сохранены"
    });
    triggerToDoTaskEvent("saveProductionTasks");
}

function deleteWorkerTask($span) {
    let $thisNode = $span.parent();
    let parentName = $thisNode.find("span").first().text();
    let thisNodeLvl = Number($thisNode.attr("tech-lvl"));
    let $worker;
    let text = "";
    if (thisNodeLvl === 0){
        $worker = $thisNode.parent().parent();
        text = `У пользователя '${$worker.attr("user-login")}' удалили из задания деталь '${parentName}'`
        $thisNode.remove();
    } else if (thisNodeLvl === 1){
        $worker = $thisNode.parent().parent().parent().parent();
        text = `У пользователя '${$worker.attr("user-login")}' удалили техпроцесс '${parentName}'`;
        let thisParent = $thisNode.parent();
        if (thisParent.find(".techNameDropped").length - 1 <= 0){
            thisParent.parent().remove();
        }else {
            $thisNode.remove();
        }
    }else if (thisNodeLvl === 3){
        $worker = $thisNode.parent().parent().parent().parent().parent().parent();
        text = `У пользователя '${$worker.attr("user-login")}' удалили техоперацию '${parentName}'`;
        let thisParent = $thisNode.parent();
        if (thisParent.find(".techOperation").length - 1 <= 0){
            let $techName = thisParent.parent();
            let $detail = $techName.parent().parent();
            if ($detail.find(".techNameDropped").length - 1 <= 0){
                $detail.remove();
            }else{
                $techName.remove();
            }
        }else {
            $thisNode.remove();
        }
    }
    //console.log($worker)

    setActionToBar({
        id: "deleteOperationForWorker",
        type: "delete",
        field: "Задание на производство",
        text: text
    });
}

function combineRowForProdTable(row = {name: "", job: "", techOperation: "", task: ""}) {
    let disabled = (Role !== "production_master") ? `disabled` : ``;
    let deleteButton = (Role === "production_master") ? `<td><span class="font-family-fontAwesome font-size-12-em deleteNodeButtonRM"></span></td>` : ``;
    return `
        <tr class="prodRows">
            ${deleteButton}
            <td><input ${disabled} class="prodRowsInput bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.name}"></td>
            <td><input ${disabled} class="prodRowsInput bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.job}"</td>
            <td><input ${disabled} class="prodRowsInput bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.techOperation}"</td>
            <td><input ${disabled} class="prodRowsInput bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.task}"</td>
        </tr>
    `;
}
