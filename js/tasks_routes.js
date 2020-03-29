let ownTasks = [];

async function initTasksRoutes() {
    /*$.ajax({
        type: "GET",
        url: "json/tasks_routes.json",
        dataType: "json",
        success: function (json) {
            let html = downloadHTML("pages/tasks_routes_table");

            $("#tasks_composition_div").append(html);
            $("#tasks_list_div_completed").hide();
            setTaskRoutes(json.active, "active_", "#tasks_list_div_active");
            setTaskRoutes(json.completed, "completed_", "#tasks_list_div_completed");

            $("#tasks_active_routes").trigger("click");

            $(".tasks_routes_button").click(function () {
                $("#task_routes_info").hide()
            })

            $("#tasks_active_routes").click(function () {
                $("#tasks_completed_routes").removeAttr("disabled");
                $(this).attr("disabled", "disabled");
                $("#tasks_list_div_active").show();
                $("#tasks_list_div_completed").hide();
                $("#current_task_routes_list").empty().append("Активные")
            })

            $("#tasks_completed_routes").click(function () {
                $("#tasks_active_routes").removeAttr("disabled")
                $(this).attr("disabled", "disabled");
                $("#tasks_list_div_completed").show();
                $("#tasks_list_div_active").hide();
                $("#current_task_routes_list").empty().append("Завершенные");
            })
        },
        error: function (message) {
            console.log("Can't load the data");
        }
    })*/

    let data;
    await getRoutesFromDB().then(res => {
        data = res;
    });
    tasks_routes_AddEvent('task_routes_tree');
    tasksRoutesMadeRoutes('task_routes_active_routes', data.response.active);
    tasksRoutesMadeRoutes('task_routes_ended_routes', data.response.finished);
    addTaskToTable();
    generateOwnTasks('task_routes_own_routes');

    $('#create_task_route_clearBtn').on('click', function () {
        $('#create_task_route_tbody').find('tr:not(#create_task_route_RouteListAddTr)').remove();
    });
    $('#create_task_route_saveBtn').on('click', function () {
        addTaskToDB();
    });

    /*   $.ajax({
           type: 'POST',
           url: 'ajax/get_routes_by_login',
           data: {login: 'productionmaster'},
           success: function (res) {
               console.log("test get_routes_by_login");
               console.log(res);
           }
       })*/

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
    console.log(data);
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
    let $table = $('<table class="table table-bordered tasks_routes_routeTable"></table>');
    $table.append('<thead class="thead-light">' +
        '<tr>' +
        '<th>№</th>' +
        '<th>Задание</th>' +
        '<th>Статус</th>' +
        '</tr>' +
        '</thead><tbody></tbody>');
    ownTasks.forEach(function (value, index) {
        $table.find('tbody').append(
            '<tr>' +
            `<td style="width: 30px">${index + 1}</td>` +
            `<td style="width: 300px">${value.task}</td>` +
            '<td style="width: 300px" class="p-1">' +
            '<button class="btn bg-dark text-white float-left">Принять</button>' +
            '<button class="btn bg-danger text-white float-right">Отклонить</button>' +
            '</td>' +
            '</tr>'
        )
    });
    $routes.append($table);
}

function generateTableForRoutes(data) {
    let table = '';
    let tr = '';
    data.forEach(function (value, index) {
        let task = value.task;
        if (task.user === login) {
            ownTasks.push(task);
        }
        tr += '<tr>' +
            `<td style="width: 55px">${index + 1}</td>` +
            `<td style="width: 230px">${task.role}</td>` +
            `<td style="width: 190px">${task.name}</td>` +
            `<td style="width: 125px">${task.task}</td>` +
            '</tr>';
    });
    table = '<table class="table table-bordered tasks_routes_routeTable">' +
        '<thead class="thead-light">' +
        '<tr>' +
        '<th>№</th>' +
        '<th>Должность</th>' +
        '<th>Пользователь</th>' +
        '<th>Задание</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        tr +
        '</tbody>' +
        '</table>';
    return table;
}

function setTaskRoutes(json_list, type, accord_id) {
    //console.log(json_list)
    json_list.forEach(function (elem, i) {
        let $div = $(accord_id);
        $div.append(
            "<p class='tasks_routes_button_h'>" + elem.name + "</p>" +
            "<button class='btn btn-light tasks_routes_button' id='" + type + i.toString() + "'>" +
            "<p><span class='tasks_routes_span_h'>Тип:</span><span class='tasks_routes_span_t'>" + elem.type + "</span></p>" +
            "<p><span class='tasks_routes_span_h'>Состояние:</span><span class='tasks_routes_span_t'>" + elem.state + "</span></p>" +
            "<p><span class='tasks_routes_span_h'>Инициатор:</span><span class='tasks_routes_span_t'>" + elem.initiator + "</span></p>" +
            "<p><span class='tasks_routes_span_h'>Вр. начала:</span><span class='tasks_routes_span_t'>" + elem.start_time + "</span></p>" +
            "<p><span class='tasks_routes_span_h'>Вр. окончания:</span><span class='tasks_routes_span_t'>" + elem.completion_time + "</span></p>" +
            "</button>");
        $("#" + type + i.toString()).click(function () {
            let $composition = $("#tasks_composition").find("div")
            $("#tasks_composition_div .table_made").empty();
            let tbody = [];

            elem.tasks.forEach(function (tasks) {
                let row = []
                row.push({
                    text: tasks.number,
                    readonly: true
                });
                row.push({
                    text: tasks.type,
                    readonly: true
                });
                row.push({
                    text: tasks.task_state,
                    readonly: true
                });
                row.push({
                    text: tasks.executor,
                    readonly: true
                });
                row.push({
                    text: tasks.initiator,
                    readonly: true
                });
                tbody.push({
                    row: row
                });
            });

            let table_info = {
                thead: [{text: "Номер", readonly: true}, {text: "Вид", readonly: true}, {
                    text: "Состояние",
                    readonly: true
                }, {text: "Исполнитель", readonly: true}, {text: "Инициатор", readonly: true}],
                tbody: tbody
            };
            //console.log(table_info);
            generateTable(table_info, {
                table_block: "#taskRoutesBlock",
                edit_mode_div: "#taskRoutes_edit",
                url: "",
                save_url: ""
            });
            delZeroCol("#taskRoutesBlock ");
            //$("#taskRoutesBlock " + '.table_edit thead').find('th').first().remove();
            /*getJsonByURL("spec_table_ajax", generateTable,
                {table_block : "#taskRoutesBlock", edit_mode_div: "#taskRoutes_edit", url: "pages/edit_field"});*/
        })

    })
    $(accord_id).accordion({
        active: false,
        collapsible: true,
        icons: false,
        animate: 200,
        heightStyle: "content"
    });
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

    let loginLength = getLoginNames().length;
    let UsersRoles = getLoginNames('role');
    let UsersNames = getLoginNames('short_name');
    let UsersLogins = getLoginNames();

    let option = '<option disabled selected value>Выберите работника...</option>';

    UsersNames.forEach(function (value, index) {
        option += `<option task-user-name-id="${index}">${value}</option>`;
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
            $(this).parents('tr').find('.create_task_route_selectSpec').text(UsersRoles[id]);
            $(this).parents('tr').data({user: UsersLogins[id]});
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
    $.ajax({
        type: 'POST',
        url: 'ajax/save_route',//ajax/save_route
        data: {task: task, master: login},
        success: function (res) {
            let taskTA = serializeCreateTaskRoute(true);
            let message = `Пользователь <span class="font-weight-bold">${currentName}</span> создал маршрут со следующими указаниями: <br/>`;
            taskTA.forEach(function (value, index) {
                message += `${index !== 0 ? '; <br/>' : ''}<span class="font-weight-bold">` +
                    `${value.role}</span> -> <span class="font-italic">${value.task.toLocaleLowerCase()}</span>: ${value.textarea}`
            });
            message += '.';
            console.log(message);
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
        }
    })
}

async function getRoutesFromDB() {
    let data;
    await $.ajax({
        type: 'GET',
        url: 'ajax/get_routes_by_type',
        success: function (res) {
            data = res;
        }
    });
    return data;
}
