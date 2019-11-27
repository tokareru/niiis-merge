function initCreate_task_route() {
    addRows(getLoginNames().length);
    $('.slider_button_create').on('click', function () {
        STDLibClick($('.slider_button_create'), $('.main_all_create_task'), 25);
    });
    $('#shell').on('click', function () {
        if($('.main_all_create_task').attr('style') === 'z-index: 999; right: 0px;')
        {
            $('.slider_button_create').trigger('click');
        }
    });
}

function addRows(count_rows) {

    let $tbody = $('.table_create_task_route').find('tbody');
    for (let i = 0; i < count_rows; i++) {
        let $td = '<td style="text-align: center">' +
            '<input type="checkbox"' +
            '>' +
            '</td>' +
            '<td></td>' +
                '<td>'+
            '</td>' +
            '<td>' +
            '<select class="form-control form-control-sm">' +
            '<option value="1">Согласовать</option>' +
            '<option value="2">Утвердить</option>' +
            '</select>' +
            '</td>';
        $tbody.append('<tr>' + $td + '</tr>');
    }
}

