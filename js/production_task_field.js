//production_task_field
function initProductionTaskField () {
    if (Round < 3)
        initProductionTask_1_2_Rounds();
    else{
        $("#production_task_body_round_1_2").remove();
        getJsonByURL(techGuideURL, function (json) {
            techGuideJson = json;
            initProductionTask_3_Rounds();
        }, {});
    }

}

function initProductionTask_3_Rounds() {
    initTechProcessForProductionTask();
    let $workers_drop = $("#workers_drop_area");
    let nameUsers = [];
    AllInfo.forEach(function (user) {
        if (user.role === "worker") nameUsers.push(user)
    });

    if (nameUsers.length)
        nameUsers.forEach(function (user) {
            $.ajax({
                url: "json/production_task_3.json",
                type: 'GET',
                data:{
                    login: user.login
                },
                success: function (json) {
                    $workers_drop.append(combineWorkerNode(user));
                    let lastOperations = "";
                    if (json !== null)
                        if (json.tasks.length)
                            json.tasks.forEach(function (task) {
                                lastOperations += combineWorkerTaskNode(getTechField(task.id, 3));
                            });
                    let $operationsForWorker = $workers_drop.find(".operationsForWorker").last();
                    $operationsForWorker.append(lastOperations);

                    setToggler("workers_drop_area");
                    $workers_drop.find(".operationsForWorker").droppable({
                        tolerance: "touch",
                        drop: function (e, ui) {
                            let $draggable = $(ui.draggable);
                            let $this = $(this);
                            $this.append(combineWorkerTaskNode(getTechField( $draggable.attr("tech-id"), $draggable.attr("tech-lvl"))));
                            let userName = $this.parent().attr("user-login");
                            let operationName = $draggable.find("span").first().text();

                            setActionToBar({
                                id: "addTaskForWorker",
                                type: "addNew",
                                field: "Задание на производство",
                                text: `Пользователю '${userName}' добавили оперецию '${operationName}'`
                            })

                        }
                    });
                    $workers_drop.find("span.caret").not(".caret-down").trigger("click");
                }
            });
        });

    $(`#production_task_body`).on("click", "#product_task_save_button", function () {
        saveProductionTable_3_Round(nameUsers);
    })
        .on("click", ".deleteNodeButtonRM", function () {
        deleteWorkerTask($(this));
    })
}

function combineWorkerTaskNode(data = { name: "", lvl: "", id: ""}) {

    return `
        <li tech-id="${data.id}" tech-lvl="${data.lvl}">
            <span class="mr-2">${data.name}</span><span class="deleteNodeButtonRM"></span>
        </li>
    `
}

function combineWorkerNode(user = {name: "", login: "", role: "", roleName: ""}) {
    return `
        <li user-login="${user.login}">
            <span class="caret">${user.name}</span>
            <ul  style='min-height: 35px;' class='nested border-bottom pb-2 operationsForWorker'>
                
            </ul>
        </li>
    `;
}

function initTechProcessForProductionTask() {
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
    setTechProcessForProductionTask();
}

function setTechProcessForProductionTask() {
    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        success: function (json) {
            //console.log(json);
            let $field = $("#product_tech_process_field_drop");
            setAllTechProcess(json, $field, "product_tech_process_field_drop");

            $(".techField").draggable({
                helper: 'clone',
                items: "li",
                drag: function (event, ui) {
                    let $helper =$ (ui.helper);
                    $helper.css("list-style-type", "none");
                    $helper.addClass("w-100");
                }
            })
        }
    });
}



function initProductionTask_1_2_Rounds() {
    $("#production_task_body_round_3").remove();

    let selectUserBody = $("#productionTaskSelectUserBody");
    let nameUsers = [];
    AllInfo.forEach(function (user) {
        if (user.role === "worker") nameUsers.push(user)
    });

    nameUsers.forEach(function (user,index) {
        selectUserBody.append(`<option value='production-current-user-${index}'>${user.name}</option>`);
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
        $.ajax({
            type: "GET",
            url: "json/production_task.json",
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

    $tableBlock.on("click", "#addNewRowToProdTableButton", function () {
        let $trs = $("#prod_task_table_container").find(`#${$("#productionTaskSelectUserBody").val()}`).find("tbody tr");
        let lastTr = $trs.last();
        $(combineRowForProdTable()).insertBefore(lastTr)
    });

    $tableBlock.on("click", ".deleteNodeButtonRM", function () {
        let $this = $(this);
        let row = $this.parent().parent();
        row.remove();
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
    if (data !== null)
        if (data.length){
            data.forEach(function (row) {
                trs += combineRowForProdTable(row);
            })
        }else {
            trs = combineRowForProdTable({name: "", job: "", techOperation: "", task: ""});
        }
    //console.log(trs)
    $tableBlock.append(`
        <div id="${id}" user-login="${userLogin}">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="font-weight-bold"><td></td><td>ФИО</td><td>Должность</td><td>Техоперации</td><td>Задание</td></tr>
                </thead>
                <tbody>
                    ${trs}
                    <tr style="width: 45px;">
                        <td style="padding-left: 14px;" class="font-family-fontAwesome font-size-12-em fa-plus" 
                        id="addNewRowToProdTableButton"></tdclass></td>
                    </tr>
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
        url: '',
        data: {
            productTasks: saveData,
            login: userLogin
        },
        success: function (res) {

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
            userLi.find("ul li").each(function () {
                saveData.push({
                    id: $(this).attr("tech-id")
                })
            });

            console.log(saveData);
            $.ajax({
                type: 'POST',
                url: '',
                data: {
                    tasks: saveData,
                    login: user.login
                },
                success: function (res) {

                }
            })

        });
}

function deleteWorkerTask($span) {
    let parent = $span.parent();
    let userName = parent.parent().parent().attr("user-login");
    let operationName = parent.find("span").first().text();
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
    return `
        <tr class="prodRows">
            <td><span class="font-family-fontAwesome font-size-12-em deleteNodeButtonRM"></span></td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.name}"></td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.job}"</td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.techOperation}"</td>
            <td><input ${disabled} class="bg-transparent border-0 outline-none shadow-none w-100 h-100" value="${row.task}"</td>
        </tr>
    `;
}
