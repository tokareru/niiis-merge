function initCreate_task_route() {

    addRows(getLoginNames().length, false, true);

    $('.slider_button_create').on('click', function () {
        STDLibClick($('.slider_button_create'), $('.main_all_create_task'), 25);
    });
    $('#shell').on('click', function () {
        if ($('.main_all_create_task').attr('style') === 'z-index: 999; right: 0px;') {
            $('.slider_button_create').trigger('click');
        }
    });

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

    $('.create_task_route_button').on('click', function () {
        let arr = serializeCreateTaskRoute();
        if (arr.length !== 0) {
            createTaskRouteToServer(arr);
            $('.table_create_task_route').find('tbody').children().remove();
            addRows(getLoginNames().length, false, true);
        }
    });
}

function addRows(count_rows, addInputs, addRolesNames) {
    let UsersRoles = getLoginNames('role');
    let UsersNames = getLoginNames('name');


    let $tbody = $('.table_create_task_route').find('tbody');
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

        let $td = '<td style="text-align: center">' +
            '<input type="checkbox"' +
            '>' +
            '</td>' +
            '<td class="ctr_cell">' + input_div_roles +
            '</td>' +
            '<td class="ctr_cell">' + input_div_names +
            '</td>' +
            '<td>' +
            '<select class="form-control form-control-sm">' +
            '<option value="Согласовать">Согласовать</option>' +
            '<option value="Утвердить">Утвердить</option>' +
            '</select>' +
            '</td>';
        $tbody.append('<tr>' + $td + '</tr>');
    }
}

function serializeCreateTaskRoute() {
    let $table = $('.table_create_task_route');
    let count_rows = $table.find('tr').length - 1;
    let count_cols = $table.find('tr').eq(0).find('th').length;
    let data = [];

    for (let i = 0; i < count_rows; i++) {
        let tempData = [];
        if ($table.find('tbody').find('tr').eq(i).find('td').eq(0).find('input:checkbox:checked').length > 0) {
            for (let j = 1; j < count_cols; j++) {
                if (j !== count_cols - 1)
                    tempData.push($table.find('tbody').find('tr').eq(i).find('td').eq(j).text());
                else {
                    tempData.push($table.find('tbody').find('tr').eq(i).find('td')
                        .eq(j).find('option:selected').text());
                }
            }
            data.push(tempData);
        }
    }
    return data;
}

function createTaskRouteToServer(dataToAjax) {
    $.ajax(
        {
            url: '',
            type: 'POST',
            data: {data: dataToAjax},
            success: function (data) {

            },
            error: function () {

            }
        }
    )
}
