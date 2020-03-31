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

        getJsonByURL(techGuideURL, function (json) {
            techGuideJson = json;
            initProductionTask_3_Rounds();
        }, {});
    }

}

function initProductionTask_3_Rounds() {
    let $workers_drop = $("#workers_drop_area");
    let nameUsers = [];
    let techProcess;

    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        async: false,
        success: function (json) {
            techProcess = json;
        }
    });

    if (Role === "production_master"){
        initTechProcessForProductionTask(techProcess);
        AllInfo.forEach(function (user) {
            if (user.role === "worker") nameUsers.push(user)
        });
        if (nameUsers.length)
            nameUsers.forEach(function (user) {
                $.ajax({
                    url: "ajax/get_production_task_3",
                    type: 'GET',
                    data:{
                        login: user.login
                    },
                    success: function (json) {
                        $workers_drop.append(combineWorkerNode(user));
                        let lastOperations = "";
                        if (json !== null)
                            if (json.productTasks.length)
                                json.productTasks.forEach(function (task) {
                                    //console.log(getTechOperationFromTechProcess( techProcess, json.id))
                                    //lastOperations += combineTechOperation(getTechNameFromTechProcess( techProcess, task.id));
                                    let _techName = getTechNameFromTechProcess(techProcess, task.id);
                                    lastOperations += combineTechName({
                                        id: _techName.techNameId,
                                        lvl: _techName.techNameLvl,
                                        name: _techName.techNameName,
                                        operations: [_techName]
                                    }, true);
                                });
                        let $operationsForWorker = $workers_drop.find(".operationsForWorker").last();
                        $operationsForWorker.append(lastOperations);

                        setToggler("workers_drop_area");
                        $workers_drop.find(".user-login-node-li").last().each(function () {
                            $(this).find(".techNameDropped").each(function () {
                                $(this).find("span.caret").not(".caret-down").first().trigger("click");
                            })
                        }).find("span.caret").not(".caret-down").first().trigger("click");

                        $workers_drop.find(".operationsForWorker").droppable({
                            tolerance: "pointer",
                            drop: function (e, ui) {
                                let $draggable = $(ui.draggable);
                                let $this = $(this);

                                let $parent = $draggable.parent().parent();

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

                                $this.append(combineTechName({
                                    id: $parent.attr("tech-id"),
                                    lvl: $parent.attr("tech-lvl"),
                                    name: $parent.find("span").first().text(),
                                    operations: [workerNode]
                                }, true));

                                //$this.append(combineTechOperation(workerNode));
                                let userName = $this.parent().attr("user-login");
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
                        });
                    }
                });

            });
    } else{
        //json/production_task.json
        //ajax/get_production_task_3
        $.ajax({
            url: "ajax/get_production_task_3",
            type: 'GET',
            data:{
                login: login
            },
            success: function (json) {
                //$workers_drop.append(combineWorkerNode({login: login, role: Role, roleName: "Исполнитель", name: login}));
                let lastOperations = "";
                //console.log(json)

                if (json.productTasks.length)
                    json.productTasks.forEach(function (task) {
                        //console.log(getTechOperationFromTechProcess( techProcess, json.id))
                        //lastOperations += combineTechOperation(getTechNameFromTechProcess( techProcess, task.id));
                        let _techName = getTechNameFromTechProcess(techProcess, task.id);
                        lastOperations += combineTechName({
                            id: _techName.techNameId,
                            lvl: _techName.techNameLvl,
                            name: _techName.techNameName,
                            operations: [_techName]
                        }, false);
                    });
                //console.log(lastOperations)
                $workers_drop.append(lastOperations);
                setToggler("workers_drop_area");
                $workers_drop.find("span.caret").not(".caret-down").trigger("click");
            }
        });
    }

    $(`#production_task_body`).on("click", "#product_task_save_button", function () {
        saveProductionTable_3_Round(nameUsers);
    })
        .on("click", ".deleteNodeButtonRM", function () {
        deleteWorkerTask($(this));
    })
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
            if (index === Number(position)){
                techOperation = _techOperation;
                techOperation.lvl = index;
                techOperation.name = getTechField(techOperation.id, 3).name;
                if (techOperation.nodes.length)
                    techOperation.nodes.forEach(function (_node) {
                        _node.name = getTechNode(_node.id, 2).name
                    })
            }

        });
    //console.log(techOperation)
    return techOperation;
}

function setTechNameFromTechProcess($ul, operations) {

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
            <ul  style='min-height: 35px;' class='nested border-bottom pb-2 operationsForWorker'>
                
            </ul>
        </li>
    `;
}

function initTechProcessForProductionTask(techProcess) {
    /*if (Role !== "technologist"){
        $.ajax({
            url: techGuideURL,
            type: 'GET',
            success: function (json) {
                techGuideJson = json;
                setTechProcessForProductionTask();
            }
        });
    }else {
        setTechProcessForProductionTask();
    }*/
    setTechProcessForProductionTask(techProcess);
}

function setTechProcessForProductionTask(techProcess) {
    let $field = $("#product_tech_process_field_drop");
    setAllTechProcess(techProcess, $field, "product_tech_process_field_drop");

    $(".techNameDropped").each(function () {
        $(this).find("span.caret").first().trigger("click");
    });

    if (Role === "production_master")
        $(".techOperation").draggable({
            helper: 'clone',
            items: "li",
            cancel: ".techFieldsDropArea, .techField, .techNode",
            drag: function (event, ui) {
                let $helper =$ (ui.helper);
                $helper.css("list-style-type", "none !important");
                $helper.find("ul").first().hide();
                $helper.css("z-index", "99999");
                $helper.css("width", "270px");
            }
        })
}

function initProductionTask_1_2_Rounds() {
    $("#production_task_body_round_3").remove();

    let selectUserBody = $("#productionTaskSelectUserBody");
    let nameUsers = [];
    if (Role === "production_master"){
        AllInfo.forEach(function (user) {
            if (user.role === "worker") nameUsers.push(user)
        });
    }
    else{
        selectUserBody.attr("disabled", "disabled");
        let production_task_body_round_1_2 = $("#production_task_body_round_1_2");
        production_task_body_round_1_2.find("form").remove();
        $(`
            <div class="h4">Ваше задание</div>
        `).insertAfter(production_task_body_round_1_2.find(".spec_header").first());

        $("#product_task_save_button").remove();
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

    selectUserBody.change(function (e) {
        let val = this.value;
        $(`#${val}`).toggle();
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

                setProductionTable_1_2_Rounds($tableBlock, `production-current-user-${index}`, json, user.login);
                if (index)
                    $(`#production-current-user-${index}`).hide();
            },
            error: function (message) {
                console.log("Данные не загружены");
                setProductionTable_1_2_Rounds($tableBlock, `production-current-user-${index}`, [], user.login);
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
            id: "deleteRowToProductTable",
            type: "delete",
            field: "Задание на производство",
            text: "Удалена строка из таблицы"
        })
    });

    $(`#production_task_body`).on("click", "#product_task_save_button", function () {
        saveProductionTable_1_2_Rounds($("#prod_task_table_container").find(`#${$("#productionTaskSelectUserBody").val()}`));
    })

    /*generateTable(tableInfo, {
        table_block: "#prod_task_table_block",
        edit_mode_div: "#prod_task_table_edit",
        url: ""
    });*/
}

function setProductionTable_1_2_Rounds($tableBlock, id, data = [{name: "", job: "", techOperation: "", task: ""}], userLogin) {
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
       emptyTd = `<td></td>`;
       newButton = `<tr style="width: 45px;">
                        <td style="padding-left: 14px;" class="font-family-fontAwesome font-size-12-em fa-plus addNewRowToProdTableButton"></td>
                    </tr>`
    }

    $tableBlock.append(`
        <div id="${id}" user-login="${userLogin}">
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
    `)
}

function saveProductionTable_1_2_Rounds($table) {
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
    console.log(saveData);

    $.ajax({
        type: 'POST',
        url: 'ajax/save_production_task_1_2',
        data: {
            productTasks: saveData,
            login: userLogin
        },
        success: function (res) {
            //console.log(res)
            setActionToBar({
                id: "saveWorkerTaskRound3",
                type: "save",
                field: "Задание на производство",
                text: "Задания сохранены"
            })
        }
    })
}

function saveProductionTable_3_Round(users = [{name: "", login: "", role: "", roleName: ""}]) {
    let $workers_drop = $("#workers_drop_area");
    //console.log(users)
    if (users.length)
        users.forEach(function (user = {name: "", login: "", role: "", roleName: ""}) {
            let userLi = $workers_drop.find(`li[user-login='${user.login}']`);
            let saveData = [];
            userLi.find(".techOperation").each(function () {
                saveData.push({
                    id: $(this).attr("tech-id")
                })
            });

            console.log(saveData);
            console.log(user.login);

            $.ajax({
                type: 'POST',
                url: 'ajax/save_production_task_3',
                data: {
                    login: user.login,
                    productTasks: saveData
                },
                success: function (res) {
                    console.log(res)
                }
            })

        });
    setActionToBar({
        id: "saveWorkerTaskRound3",
        type: "save",
        field: "Задание на производство",
        text: "Задания сохранены"
    })
}

function deleteWorkerTask($span) {
    let parent = $span.parent().parent().parent();
    let userName = parent.parent().parent().attr("user-login");
    let operationName = $span.parent().find("span").first().text();
    setActionToBar({
        id: "deleteOperationForWorker",
        type: "delete",
        field: "Задание на производство",
        text: `У пользователя '${userName}' удалили операцию '${operationName}'`
    });
    parent.remove();
}

function combineRowForProdTable(row = {name: "", job: "", techOperation: "", task: ""}) {
    let disabled = (Role !== "production_master") ? `disabled` : ``;
    let deleteButton = (Role === "production_master") ? `<td><span class="font-family-fontAwesome font-size-12-em deleteNodeButtonRM"></span></td>` : ``;
    return `
        <tr class="prodRows">
            ${deleteButton}
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.name}"></td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.job}"</td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.techOperation}"</td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.task}"</td>
        </tr>
    `;
}
