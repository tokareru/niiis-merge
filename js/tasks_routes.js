function initTasksRoutes() {
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

    tasks_routes_AddEvent('task_routes_tree');
    tasksRoutesMadeRoutes('task_routes_active_routes', 5);
    tasksRoutesMadeRoutes('task_routes_ended_routes', 5);
    addTaskToTable();

    $('#create_task_route_clearBtn').on('click', function () {
        $('#create_task_route_tbody').find('tr:not(#create_task_route_RouteListAddTr)').remove();
    });
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

function tasksRoutesMadeRoutes(id, count) {
    let $routes = $(`#${id}`);
    let date = new Date();
    for (let i = 0; i < count; i++) {
        $routes.append(`<li>${makeRoute({
            name: `Маршрут ${i + 1}`, info: generateInfoForRoute(
                {
                    name: `Маршрут ${i + 1}`,
                    type: 'Тестовый тип',
                    exist: id === 'task_routes_active_routes' ? 'Активный' : 'Завершенный',
                    inits: 'The Man Who Sold The World',
                    start: date.toDateString(),
                    end: id === 'task_routes_active_routes' ? '-' : date.toDateString(),
                    table: {
                        number: i + 1,
                        type: 'Тестовый вид',
                        exist: id === 'task_routes_active_routes' ? 'Активный' : 'Завершенный',
                        worker: currentName,
                        inits: 'The Man Who Sold The World'
                    }
                }
            )
        })}</li>`);
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

function generateInfoForRoute(infos) {
    let info = '<ul>';
    info += `<li><span>Название: ${infos.name}</span></li>`;
    info += `<li><span>Тип: ${infos.type}</span></li>`;
    info += `<li><span>Состояние: ${infos.exist}</span></li>`;
    info += `<li><span>Инициализатор: ${infos.inits}</span></li>`;
    info += `<li><span>Время запуска: ${infos.start}</span></li>`;
    info += `<li><span>Время завершения: ${infos.end}</span></li>`;

    info += '<li><span class="font-weight-bold">' +
        'Состав маршрута' +
        '</span></li>';
    info += generateTableForRoutes(infos.table);
    info += '</ul>';
    return info;
}

function generateTableForRoutes(data) {
    return '<table class="table table-bordered">' +
        '<thead class="thead-light">' +
        '<tr>' +
        '<th>Порядковый номер задания</th>' +
        '<th>Вид задания</th>' +
        '<th>Состояние задания</th>' +
        '<th>Исполнитель</th>' +
        '<th>Инициатор</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        `<td>${data.number}</td>` +
        `<td>${data.type}</td>` +
        `<td>${data.exist}</td>` +
        `<td>${data.worker}</td>` +
        `<td>${data.inits}</td>` +
        '</tr>' +
        '</tbody>' +
        '</table>';
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
            '<td style="width: 36px; max-width: 36px; min-width: 36px" class=""></td>' +
            '<td class="create_task_route_selectSpec" style="width: 210px; max-width: 210px; min-width: 210px"></td>' +
            '<td style="width: 200px; max-width: 200px; min-width: 200px">' +
            '<select class="create_task_route_selectNames form-control form-control-sm outline-none shadow-none">' +
            option +
            '</select>' +
            '</td>' +
            '<td style="width: 195px; max-width: 195px; min-width: 195px">' +
            '<select class="form-control form-control-sm outline-none shadow-none">' +
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

function serializeCreateTaskRoute() {

}