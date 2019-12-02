function initCreate_task_route() {
    addRows(getLoginNames().length);
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
        serializeCreateTaskRoute();
    });
}

function addRows(count_rows) {

    let $tbody = $('.table_create_task_route').find('tbody');
    for (let i = 0; i < count_rows; i++) {
        let $td = '<td style="text-align: center">' +
            '<input type="checkbox"' +
            '>' +
            '</td>' +
            '<td class="ctr_cell"><div class="ctr_div_active"></div>' +
            '<input type="text" class="ctr_input_hidden">' +
            '</td>' +
            '<td class="ctr_cell"><div class="ctr_div_active"></div>' +
            '<input type="text" class="ctr_input_hidden">' +
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
            tempData.push(true);
        }
        else tempData.push(false);
        for (let j = 1; j < count_cols; j++) {
            if(j !== count_cols - 1 )
                tempData.push($table.find('tbody').find('tr').eq(i).find('td').eq(j).text());
            else {
                tempData.push($table.find('tbody').find('tr').eq(i).find('td')
                    .eq(j).find('option:selected').text());
            }
        }
        data.push(tempData);

    }
    console.log(data);

}
