let loginLength = 0;
let UsersRoles;
let UsersNames;
let UsersLogins;

function initCreate_task_route() {
   /* loginLength = AllInfo.length;
    UsersRoles = getLoginNames('role');
    UsersNames = getLoginNames('short_name');
    UsersLogins = getLoginNames();
    initCreateTaskRoute();*/
}

function addRows(count_rows, addInputs, addRolesNames) {

    let $tbody = $('.table_create_task_route').find('tbody');
    $tbody.html(null);
    let otherTaskInfo = 'привязать к ' + '<br/>' +
        '<select class="form-control form-control-sm outline-none shadow-none">' +
        '<option value="3D-модель сборки">3D-модель сборки</option>' +
        '<option value="Сборочный чертеж">Сборочный чертеж</option>' +
        '<option value="Спецификация">Спецификация</option>' +
        '<option value="Техпроцесс">Техпроцесс</option>' +
        '<option value="Маршрутная карта">Маршрутная карта</option>' +
        '<option value="ЭСИ">ЭСИ</option>' +
        '<option value="Задание на производство">Задание на производство</option>' +
        '</select>' +
        'с комментарием' + '<textarea class="form-control"></textarea>';

    for (let i = 0; i < count_rows; i++) {
        let input_div_roles = '';
        let input_div_names = '';
        let role = '';
        let name = '';
        if (addRolesNames) {
            role = UsersRoles[i];
            name = UsersNames[i];
        }
        if (addInputs) {
            input_div_roles = '<div class="ctr_div_active">' + role + '</div>' +
                '<input type="text" class="ctr_input_hidden" value="' + role + '">';
            input_div_names = '<div class="ctr_div_active">' + name + '</div>' +
                '<input type="text" class="ctr_input_hidden" value="' + name + '">';
        } else {
            input_div_roles = role;
            input_div_names = name;
        }

        let $td =
            '<td style="text-align: center; width: 63px" class="create_task_route_nunb">' + (i + 1) + '</td>' +
            '<td style="text-align: center; width: 105px">' +
            '<input type="checkbox"' +
            '>' +
            '</td>' +
            '<td class="ctr_cell" style="width: 116px">' + input_div_roles +
            '</td>' +
            '<td class="ctr_cell" style="width: 136px">' + input_div_names +
            '</td>' +
            '<td style="width: 156px" class="create_task_route_select">' +
            '<select class="form-control form-control-sm outline-none shadow-none">' +
            '<option value="Согласовать">Согласовать</option>' +
            '<option value="Утвердить">Утвердить</option>' +
            '</select>' + otherTaskInfo +
            '</td>';
        $tbody.append('<tr>' + $td + '</tr>');
        $tbody.find('tr').eq(i).data({'login': UsersLogins[i]});
        // $tbody.find('th, td').width($('#create_task_route_main').width() / 5);
    }

    $('#content_create_task_route_route').on('change', function () {

        let select_task = $('#content_create_task_route_route option:selected').text();
        console.log(select_task);
        if (select_task === 'Маршрут согласования/утверждения') {
            $tbody.find('.create_task_route_select').each(function () {
                $(this).html(
                    '<select class="form-control form-control-sm outline-none shadow-none">' +
                    '<option value="Согласовать">Согласовать</option>' +
                    '<option value="Утвердить">Утвердить</option>' +
                    '</select>' + otherTaskInfo)
            })
        } else if (select_task === 'Маршрут выдачи задания') {
            $tbody.find('.create_task_route_select').each(function () {
                $(this).html(
                    '<select class="form-control form-control-sm outline-none shadow-none">' +
                    '<option value="Выполнить">Выполнить</option></select>' + otherTaskInfo)
            })
        }
    });

    $('.table_create_task_route tbody').sortable(
        {
            axis: 'y',
            placeholder: 'bg-secondary',
            update: function () {
                changeCounting('.table_create_task_route tbody', '.create_task_route_nunb');
            },
            classes: {
                'ui-sortable-helper': 'bg-white'
            },
            handle: '.create_task_route_nunb'
        }
    );
}

function changeCounting(selector, findSel) {
    $(selector).find(findSel).each(function (index) {
        $(this).text(index + 1);
        //console.log($(this).text());
    })
}

function initSingleTable() {
    $('.table_create_task_route').css({'height': 50});
    let $tbody = $('.table_create_task_route').find('tbody');

    let $td = '<td class="ctr_cell">' + 1 +
        '</td>' +
        '<td style="text-align: center">' +
        '<input type="checkbox" checked' +
        '>' +
        '</td>' +
        '<td class="ctr_cell">' + "Вы" +
        '</td>' +
        '<td class="ctr_cell">' + "Вы" +
        '</td>' +
        '<td>' +
        '<select class="form-control form-control-sm">' +
        '<option value="Принять">Принять</option>' +
        '<option value="Отклонить">Отклонить</option>' +
        '</select>' +
        '</td>';
    $tbody.append('<tr>' + $td + '</tr>');
    $tbody.find('tr').eq(0).data({'login': login});

}

/*function serializeCreateTaskRoute() {
    let $table = $('.table_create_task_route');
    let count_rows = $table.find('tr').length - 1;
    let count_cols = $table.find('tr').eq(0).find('th').length;
    let data = [];

    for (let i = 0; i < count_rows; i++) {
        let tempData = [];
        if ($table.find('tbody').find('tr').eq(i).find('td').eq(0).find('input:checkbox:checked').length > 0) {
            let user_login = $table.find('tbody').find('tr').eq(i).data('login');
            tempData.push(user_login);
            tempData.push($table.find('tbody').find('tr').eq(i).find('td')
                .eq(3).find('option:selected').text());
            data.push(tempData);
        }
    }
    console.log(data);
    return data;
}*/

function createTaskRouteToServer(dataToAjax) {
    $.ajax(
        {
            url: '',
            type: 'POST',
            data: {data: dataToAjax, function: 'add_create_task_route'},
            success: function (data) {

            },
            error: function () {

            }
        }
    )
}

function getCreateTaskRouteSingle() {
    $.ajax(
        {
            url: '',
            type: 'POST',
            data: {login: login, function: 'get_create_task_route'},
            success: function (data) {
                // data:{isExist: true/false}
                //console.log(data);
            },
            error: function () {

            }
        })
}

function createTaskRouteHandler(dataToAjax) {
    $.ajax(
        {
            url: '',
            type: 'POST',
            data: {login: login, data: dataToAjax, function: 'change_create_task_route'},
            success: function (data) {
                //console.log(data);
            },
            error: function () {

            }
        })
}

function initCreateTaskRoute() {
    createTaskRouteEvents([true, true]);
}

function createTaskRouteEvents(settings) {

    if (settings[0] === true)
        addRows(loginLength, false, true);
    else {
        initSingleTable(); //будет удалено
        setInterval(function () {
            getCreateTaskRouteSingle();
        }, 10000)
    }

    $('.slider_button_create').on('click', function () {
        STDLibClick($('.slider_button_create'), $('.main_all_create_task'), 25, "create_task_route");
    });
    /* $('#shell').on('click', function () {
         if ($('.main_all_create_task').attr('style') === 'z-index: 999; right: 0px;') {
             $('.slider_button_create').trigger('click');
         }
     });*/

    $('.ctr_cell').on('click', function () {
        $(this).find('.ctr_div_active').removeClass('ctr_div_active').addClass('ctr_div_hidden');
        $(this).find('.ctr_input_hidden').removeClass('ctr_input_hidden').addClass('ctr_input_active')
            .focus();
    });
    $('.ctr_cell').on('focusout', function () {
        $(this).find('.ctr_input_active').addClass('ctr_input_hidden').removeClass('ctr_input_active');
        $(this).find('.ctr_div_hidden').addClass('ctr_div_active').removeClass('ctr_div_hidden');
        $(this).find('.ctr_div_active').text($(this).find('.ctr_input_hidden').val());
    });

    $('#create_task_route_clear').on('click', function () {
        addRows(loginLength, false, true);
        $('#content_create_task_route_route option:first').prop('selected', true);
    })

    /* $('.create_task_route_button').on('click', function () {
         if (settings[1] === true) {
             let arr = serializeCreateTaskRoute();
             if (arr.length !== 0) {
                 createTaskRouteToServer(arr);
                 $('.table_create_task_route').find('tbody').children().remove();
                 addRows(getLoginNames().length, false, true);
                 $('.slider_button_create').trigger('click');
             }
         } else {
             let arr = serializeCreateTaskRoute();
             $('.table_create_task_route').find('tbody').children().remove();
             initSingleTable();
             createTaskRouteHandler(arr);
             $('.slider_button_create').trigger('click');
         }

     });*/
}
