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

    $('.ctr_cell').on('click', function () {
       $(this).find('.ctr_div_active').removeClass('ctr_div_active').addClass('ctr_div_hidden');
       $(this).find('.ctr_input_hidden').removeClass('ctr_input_hidden').addClass('ctr_input_active')
           .focus();
    });
    $('.ctr_cell').on('focusout',  function () {
        console.log('focusout');
        $(this).find('.ctr_input_active').addClass('ctr_input_hidden').removeClass('ctr_input_active');
        $(this).find('.ctr_div_hidden').addClass('ctr_div_active').removeClass('ctr_div_hidden');
        $(this).find('.ctr_div_active').text( $(this).find('.ctr_input_hidden').val());
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
            '<input type="text" class="ctr_input_hidden">'+
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

