let ownTasks = [];
let currentTask = '';
let tasksRoutesMadeRoutesArr;
let tempESI;

function initTasksRoutes() {
    getRoutesFromDB();
    getRoutesFromDBInfo(tasksRoutesMadeRoutesArr);
    addTaskToTable();
    tasks_routes_AddEvent('task_routes_tree');
    if (Role === 'technologist' || Role === 'designer' || Role === 'production_master')
        $('#task_routes_add_button_div')
            .append('<input type="button" id="task_routes_add_button" value="Добавить маршрут" class="btn bg-dark text-white"' +
                ' data-toggle="modal" data-target="#task_routes_add_modalWindow">');

    setInterval(function () {
        console.log(TaskInfoReload);
        if (TaskInfoReload) {

            return;
        }
        getRoutesFromDB();
    }, 20000);


    $('#create_task_route_clearBtn').on('click', function () {
        $('#create_task_route_tbody').find('tr:not(#create_task_route_RouteListAddTr)').remove();
    });
    $('#create_task_route_saveBtn').on('click', function () {
        addTaskToDB();
    });
    $('#tasks_routes').on('click', '.tasks_routes_activeTask', function () {
        let $id = $(this).parents('tr').data('id');
        let but = $(this);
        let $master = $(this).parents('tr').data('master');
        $.ajax({
            url: 'ajax/save_route_type', //ajax/save_route_type
            type: 'POST',
            data: {id: $id, status: 'active'},
            success: function (data) {
                but.parents('td').html('<span class="fa fa-2x fa-check text-success text-center w-100"></span>');
                addMessageToAllDB(`Пользователь <span class="font-weight-bold">${currentName}</span> <span class="font-italic">принял</span> задание от пользователя ` +
                    `<span class="font-weight-bold">${$master.toLocaleLowerCase()}</span>`);
                setActionToBar({
                    id: 'eventApproveTask',
                    type: "approve",
                    field: "Маршруты заданий",
                    text: 'Принято задание'
                });
            }
        })
    });
    $('#tasks_routes').on('click', '.tasks_routes_finishedTask', function () {
        let $id = $(this).parents('tr').data('id');
        let but = $(this);
        let $master = $(this).parents('tr').data('master');
        $.ajax({
            url: 'ajax/save_route_type',//ajax/save_route_type
            type: 'POST',
            data: {id: $id, status: 'finished'},
            success: function (data) {
                but.parents('td').html('<span class="fa fa-times fa-2x w-100' +
                    ' text-danger text-center"></span>');
                addMessageToAllDB(`Пользователь <span class="font-weight-bold">${currentName}</span> <span class="font-italic">отклонил</span> задание от пользователя ` +
                    `<span class="font-weight-bold">${$master.toLocaleLowerCase()}</span>`);
                setActionToBar({
                    id: 'eventCancelTask',
                    type: "cancel",
                    field: "Маршруты заданий",
                    text: 'Отклонил задание'
                });
            }
        })
    });
    $('body').on('click', '.tasks_routes_reloadShell_radio', function () {
        let $this = $(this);
        /*if ($(this).parents('form').find('.tasks_routes_reloadShell_radio:first').get(0) === $(this).get(0)){
            return;
        }*/
        $('.tasks_routes_reloadShell').each(function () {
            if ($this.parents('form').get(0) === $(this).get(0)) {
                TaskInfoReload = $this.attr('value') === 'true';
                if (TaskInfoReload) {
                    if (currentTask !== '') {
                        currentTask.parents('form').find('.tasks_routes_reloadShell_radio_disable').click();
                    }
                    currentTask = $this;
                }
            }
            if ($this.parents('form').get(0) !== $(this).get(0)) {
                $(this).find('input:first').click();
            }
        });
    });

    $('body').on('click', '.tasks_routes_reloadShell_radio_enable', function () {
        let shell = $(this).parents('tr').data('shell');
        if (shell.specification !== 'unchanged') {
            //$('#main-tabs-specification').click();
            $('#main-tabs-specification').parents('li').addClass('bg-danger');
            let interval = setInterval(function () {
                if ($('#specificationTable').html() !== undefined) {
                    setTableByRowDAta(shell.specification);
                    $('#specTableSaveButton').attr('disabled', true);
                    clearInterval(interval);
                }
            }, 500);

        }
        console.log(shell.esi);
        if (shell.esi !== undefined && shell.esi !== 'not-exist' && shell.esi !== 'unchanged') {
            setESI(shell.esi);
            $('.slider_button').removeClass('bg-dark').addClass('bg-danger');
        }

    });

    $('body').on('click', '.tasks_routes_reloadShell_radio_disable', function () {
        taskRouteDisable();
    });

    $('#task_routes_own_routes_update').on('click', function () {
        getRoutesFromDBInfo(tasksRoutesMadeRoutesArr);
        taskRouteDisable();
    });
    if(Round === 3){
        $.ajax({
            type: "POST",
            async: false,
            url: "spec_autoentered_table_ajax/load_product_checked",
            success: function (data) {
                tempESI = {details: convertPdmAndStdInfo(data.checked)};
            }
        })
    }


   /* $.ajax(
        {
            url: '',
            type: 'GET',
            data: {},
            success: function (res) {
                //TaskInfo = JSON.parse(atob(res));
                preventShellEvent();
            }
        }
    )*/
}

function serializeAllInfo() {
    let dataInfo = {
        specification: undefined,
        models: undefined,
        esi: undefined
    };
    let $spec = $('#specificationTable');
    if ($spec.html() === undefined) {
        dataInfo.specification = 'unchanged';
    } else {
        dataInfo.specification = saveSpecTableData($("#specificationTable").find(".specRows"));
    }
    let $pdm = $('#pdm_field');
    if (Round !== 3) {
        dataInfo.models = 'not-exist';
        dataInfo.esi = 'not-exist';
    } else {
        let idModels = collectDataLabels(".left-side");
        dataInfo.models = idModels;
        if (Role === 'designer')
        {
            dataInfo.esi = JSON.stringify(tempESI) !== JSON.stringify({details: convertPdmAndStdInfo(collectDataLabels(".left-side"))})?
            {details: convertPdmAndStdInfo(collectDataLabels(".left-side"))}: 'unchanged';
            console.log(dataInfo.esi);
        }
        else
            dataInfo = 'unchanged';
    }


    /* $.ajax(
         {
             url: '',
             type: 'POST',
             data: {data: btoa(JSON.stringify(dataInfo))},
             success: function (res) {
                 //console.log(res);
             }
         }
     );*/
    return JSON.stringify(dataInfo);
}

function taskRouteDisable() {
    /*let shell = $this.parents('tr').data('shell');
    console.log(shell);*/
    /*if (shell.specification !== 'unchanged') {*/
    $('#specificationTable').find('thead tr').children().remove();
    $('#specificationTable').find('tbody tr').remove();
    createSpecificationTable();
    $('#main-tabs-specification').parents('li').removeClass('bg-danger');
    $('.slider_button').removeClass('bg-danger').addClass('bg-dark');
    $('#specTableSaveButton').removeAttr('disabled');
    console.log('-----------------------');
    console.log(tempESI);
    setESI(tempESI);
    //}
}

function preventShellEvent() {
    $('#specTableSaveButton').attr('disabled', true);
    $('#left-accordion').find('p').attr('disabled', true);
}

function tasks_routes_AddEvent(id) {
    let toggler = document.getElementById(id).getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
}

function tasksRoutesMadeRoutes(id, data) {
    let $routes = $(`#${id}`);
    $routes.find('table').remove();
    for (let i = 0; i < data.length; i++) {
        $routes.append(generateTableForRoutes(data[i]));
    }
    tasks_routes_AddEvent(id);
}

function makeRoute(info) {
    let route = '<ul>';
    route += `<span class="caret">${info.name}</span>`;
    route += '<ul class="nested">' +
        `<li>${info.info}</li>` +
        '</ul>';
    route += '</ul>';
    return route;
}

function generateOwnTasks(selector) {
    let $routes = $(`#${selector}`);
    $routes.find('table').remove();
    let $table = $('<table class="table table-bordered tasks_routes_routeTable"></table>');
    $table.append('<thead class="thead-light">' +
        '<tr>' +
        '<th style="width: 60px">№</th>' +
        '<th>Показ</th>' +
        '<th>Задание</th>' +
        '<th>Статус</th>' +
        '</tr>' +
        '</thead><tbody></tbody>');
    let buttonActiveTask = '<button class="btn bg-dark text-white float-left tasks_routes_activeTask">Принять</button>' +
        '<button class="btn bg-danger text-white float-right tasks_routes_finishedTask">Отклонить</button>';
    ownTasks.sort(function (a, b) {
        if (a.status === "nonactive" && b.status !== 'nonactive')
            return 1;
        if (b.status === "nonactive" && a.status !== 'nonactive')
            return -1;
        return 0;
    });
    ownTasks.reverse();
    ownTasks.forEach(function (value, index) {
            let $tr = $(
                '<tr class="' + `${value.status !== 'nonactive' ? 'bg-light' : ''}">` +
                `<td style="width: 60px">${index + 1}</td>` +
                '<td style="width: 200px">' +
                '<form class="tasks_routes_reloadShell text-center">' + //tasks_routes_reloadShell
                `<input type="radio" value="false" name="own_tasks_routes" id="own_tasks_routes_show_${index}" checked><label value="false" for="own_tasks_routes_show_${index}" ` +
                `class="text-center tasks_routes_reloadShell_radio tasks_routes_reloadShell_radio_disable"` +
                'style="width: 50px">Откл</label>' +
                `<input type="radio" value="true" name="own_tasks_routes" id="own_tasks_routes_hide_${index}"><label value="true" for="own_tasks_routes_hide_${index}"` +
                `class="text-center tasks_routes_reloadShell_radio tasks_routes_reloadShell_radio_enable"` +
                'style="width: 50px">Вкл</label>' +
                '</form></td>' +
                `<td style="width: 250px">${value.task}</td>` +
                '<td style="width: 350px">' +
                `${value.status === 'nonactive' ? buttonActiveTask : value.status === 'active' ? '<span class="fa fa-check text-success text-center w-100 fa-2x"></span>' : '<span class="fa fa-times' +
                    ' text-danger text-center w-100 fa-2x"></span>'}` +
                '</td>' +
                '</tr>');
            $tr.data({'id': value.id, 'master': value.master, shell: value.shell});
            $table.find('tbody').append(
                $tr
            )
        }
    );
    $routes.append($table);

}

function generateTableForRoutes(data) {
    let table = '';
    let tr = '';
    data.forEach(function (value, index) {
            let task = value.task;
            if (task.user === login) {
                AllInfo.forEach(function (allInfo) {
                    if (value.master === allInfo.login) {
                        task.master = allInfo.roleName;
                    }
                });
                task.shell = JSON.parse(value.shell);
                ownTasks.push(task);
            }
            tr += '<tr style="width: 700px">' +

                `<td style="width: 60px">${index + 1}</td>` +
                `<td style="width: 230px">${task.role}</td>` +
                `<td style="width: 230px">${task.name}</td>    ` +
                `<td style="width: 125px">${task.task}</td>    ` +
                `<td style="width: 125px">${task.status === 'nonactive' ? '<span class="fa fa-2x fa-spinner text-primary text-center w-100"></span>' : task.status === 'active' ? '<span class="fa ' +
                    'fa-check text-success text-center w-100 fa-2x"></span>' :
                    '<span class="fa fa-2x fa-times text-danger w-100"></span>'
                }
</td>` +
                '</tr>';
        }
    )
    ;
    table = '<table class="table table-bordered tasks_routes_routeTable">' +
        '<thead class="thead-light">' +
        '<tr>' +
        '<th style="width: 60px">№</th>' +
        '<th style="width: 230px">Должность</th>' +
        '<th style="width: 230px">Пользователь</th>' +
        '<th style="width: 125px">Задание</th>' +
        '<th style="width: 125px">Статус</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        tr +
        '</tbody>' +
        '</table>';
    return table;
}


function delZeroCol(table_block) {
    let $text = $(table_block + '.del_col_text');
    let $number = 0;
    let $tbody = $(table_block + '.table_edit tbody');
    $tbody.find('tr').each(function () {
        $(this).children().each(function (index, elem) {
            //alert($(this).html());
            if (index === $number || index === 1) {
                $(this).remove();
            }
        });
    });
    let $thead = $(table_block + '.table_edit thead');
    $thead.find('th').eq($number).remove();
    $thead.find('th').eq($number).remove();
}

function addTaskToTable() {
    //let UsersNames = getLoginNames('fio');
    //let UsersLogins = getLoginNames();

    let option = '<option disabled selected value>Выберите работника...</option>';

    AllInfo.forEach(function (value, index) {
        option += `<option task-user-name-id="${index}">${value.fio}</option>`;
    });

    $('#create_task_route_RouteListAdd').on('click', function () {
        let route =
            '<td style="width: 25px; max-width: 25px; min-width: 25px" class="create_task_route_delCol text-dark">' +
            '<i class="fa fa-times"></i></td>' +
            `<td style="width: 36px; max-width: 36px; min-width: 36px" class="">${$('#create_task_route_tbody tr').length}</td>` +
            '<td class="create_task_route_selectSpec" style="width: 210px; max-width: 210px; min-width: 210px"></td>' +
            '<td style="width: 200px; max-width: 200px; min-width: 200px">' +
            '<select class="create_task_route_selectNames form-control form-control-sm outline-none shadow-none">' +
            option +
            '</select>' +
            '</td>' +
            '<td style="width: 195px; max-width: 195px; min-width: 195px">' +
            '<select class="form-control form-control-sm outline-none shadow-none create_task_route_task">' +
            '<option>Согласовать</option>' +
            '<option>Утвердить</option>' +
            '<option>Выполнить</option>' +
            '</select>' +
            '</td>' +
            '<td style="width: 200px; max-width: 200px; min-width: 200px">' +
            '<textarea class="form-control border-dark" rows="2"></textarea>' +
            '</td>';
        $('#create_task_route_RouteListAddTr').before(`<tr>${route}</tr>`);
        $('.create_task_route_selectNames').on('change', function () {
            let id = $(this).find('option:selected').attr('task-user-name-id');
            $(this).parents('tr').find('.create_task_route_selectSpec').text(AllInfo[id].roleName);
            $(this).parents('tr').data({user: AllInfo[id].login});
            $(this).parents('tr').removeClass('bg-danger');
        });
        recountListId();
        $('.create_task_route_delCol').on('click', function () {
            $(this).parents('tr').remove();
        });
    });
}

function recountListId() {
    $('#create_task_route_tbody').find('tr:not(#create_task_route_RouteListAddTr)').each(function (index) {
        $(this).find('.create_task_route_listId').text(index + 1);
    });
}

function serializeCreateTaskRoute(addTextarea = false) {
    let data = [];
    let ret = false;
    $('#create_task_route_RouteList tbody').find('tr:not(#create_task_route_RouteListAddTr)').each(function () {
        let login = $(this).data('user');
        if (login === undefined) {
            $(this).addClass('bg-danger');
            ret = true;
        }
        if (!addTextarea) {
            data.push({
                user: $(this).data('user'),
                role: $(this).find('.create_task_route_selectSpec').text(),
                name: $(this).find('.create_task_route_selectNames option:selected').text(),
                task: $(this).find('.create_task_route_task option:selected').text()
            })
        } else {
            data.push({
                user: $(this).data('user'),
                role: $(this).find('.create_task_route_selectSpec').text(),
                name: $(this).find('.create_task_route_selectNames option:selected').text(),
                task: $(this).find('.create_task_route_task option:selected').text(),
                textarea: $(this).find('textarea').val()
            })
        }

    });
    if (ret) {
        return;
    }
    console.log(data);
    return data;
}

function addTaskToDB() {
    let task = serializeCreateTaskRoute();
    if (task === undefined || task.length === 0)
        return;
    let data = {task: task, master: login, shell: serializeAllInfo()};
    console.log(data);
    $.ajax({
        type: 'POST',
        url: 'ajax/save_route',//ajax/save_route
        data: data,
        success: function (res) {
            let taskTA = serializeCreateTaskRoute(true);
            let message = `Пользователь <span class="font-weight-bold">${currentName}</span> создал маршрут со следующими указаниями: <br/>`;
            taskTA.forEach(function (value, index) {
                message += `${index !== 0 ? '; <br/>' : ''}<span class="font-weight-bold">` +
                    `${value.role.toLocaleLowerCase()}</span> -> <span class="font-italic">${value.task.toLocaleLowerCase()}</span>: ${value.textarea}`
            });
            message += '.';
            $.ajax({
                url: 'chat_ajax',//chat_ajax
                type: 'POST',
                data: {type: 'ALL', time: Date.now(), current_login: login, comment: message, function: 'add_comment'},
                success: function (data) {
                    //console.log(data);
                    $('#create_task_route_tbody').find('tr:not(#create_task_route_RouteListAddTr)').remove();
                },
                error: function () {
                    $('#chat_window_text').val('Ошибка загрузки');
                }
            });
            setActionToBar({
                id: 'addTaskToDB',
                type: "addNew",
                field: "Маршруты заданий",
                text: 'Добавлен новый маршрут заданий'
            });
            //$('#task_routes_add_button').attr('disabled', true);
        }
    })
}

function getRoutesFromDB() {
    if (TaskInfoReload) {
        return;
    }
    $.ajax({
        type: 'GET',
        async: false,
        url: 'ajax/get_routes_by_type',
        success: function (res) {
            if (TaskInfoReload) {
                return;
            }
            tasksRoutesMadeRoutesArr = res;
            /* ownTasks = [];
             tasksRoutesMadeRoutes('task_routes_active_routes', res.response.active);
             tasksRoutesMadeRoutes('task_routes_ended_routes', res.response.finished);
             if (!TaskInfoReload) {
                 generateOwnTasks('task_routes_own_routes');
                 return;
             }

             console.log(ownTasks);*/
        }
    });
}

function getRoutesFromDBInfo(res) {
    ownTasks = [];
    tasksRoutesMadeRoutes('task_routes_active_routes', res.response.active);
    tasksRoutesMadeRoutes('task_routes_ended_routes', res.response.finished);
    generateOwnTasks('task_routes_own_routes');
}