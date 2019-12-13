/*
$(function () {
    initTitleBlock();
});
*/


function initTitleBlock() {

    let $table = $('#table_title_block');
    $table.css({"height": $table.outerWidth() / 3.36 - 11 * 2});
    generateTableRow($table, [6, 6, 6, 9, 11, 10, 10, 7, 6, 6, 6]);

    let $tbody_tr = $table.find('tbody tr');
    changeTableRow($tbody_tr.eq(0),
        [7, 10, 23, 15, 10, 120], $table);
    changeTableRow($tbody_tr.eq(1),
        [7, 10, 23, 15, 10, 120], $table);
    changeTableRow($tbody_tr.eq(2),
        [7, 10, 23, 15, 10, 120], $table);
    changeTableRow($tbody_tr.eq(3),
        [7, 10, 23, 15, 10, 70, 15, 17, 18], $table);
    changeTableRow($tbody_tr.eq(4),
        [7, 10, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table);
    changeTableRow($tbody_tr.eq(5),
        [17, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table);
    changeTableRow($tbody_tr.eq(6),
        [17, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table);
    changeTableRow($tbody_tr.eq(7),
        [17, 23, 15, 10, 70, 20, 30], $table);
    changeTableRow($tbody_tr.eq(8),
        [17, 23, 15, 10, 70, 50], $table);
    changeTableRow($tbody_tr.eq(9),
        [17, 23, 15, 10, 70, 50], $table);
    changeTableRow($tbody_tr.eq(10),
        [17, 23, 15, 10, 70, 50], $table);

    addRowspan(4, 8, $table, 3, [4, 4]);
    addRowspan(5, 8, $table, 3, [5, 5]);
    addRowspan(5, 0, $table, 3, [5, 5]);
    addRowspan(5, 3, $table, 5, [5, 4, 4, 4]);
    addRowspan(5, 4, $table, 3, [5, 5]);
    addRowspan(6, 4, $table, 3, [6, 6]);
    addRowspan(7, 4, $table, 3, [7, 7]);
    addRowspan(8, 4, $table, 3, [8, 8]);
    addRowspan(9, 4, $table, 3, [9, 9]);

    changeTdStyleCol(5, 4, $table);
    changeTdStyleCol(6, 4, $table);
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            changeTdStyleRow(i, j, $table);
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 5; j < 10; j++) {
            changeTdStyleRow(i, j, $table);
        }
    }

    //Графа 1
    addText($table, [''], [[5, 3]], 'text-center font-weight-bold' +
        ' td_fontSize18');
    //Графа 2
    addText($table,[''] ,[[5, 0]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 3
    addText($table,[''] ,[[4, 8]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графы 4
    addText($table,[''] ,[[5, 4]], 'text-center' +
        '');
    //Графы 4
    addText($table,[''] ,[[6, 4]], 'text-center' +
        '');
    //Графы 4
    addText($table,[''] ,[[7, 4]], 'text-center' +
        '');
    //Графа 5
    addText($table,[''] ,[[8, 4]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 6
    addText($table,[''] ,[[9, 4]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 9
    addText($table,[''] ,[[5, 8]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //добавляем текст на 5 строке
    addText($table, ['Изм.', 'Лист', '№ докум.', "Подп.", 'Дата'],
        [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]], '', true);
    //добавляем текст на первый столбец
    addText($table, ['Разраб.', 'Пров.', 'Т. контр.', 'Н. контр.', 'Утв.'],
        [[0, 5], [0, 6], [0, 7], [0, 9], [0, 10]], '', true);
    addText($table, ['Лит.', 'Масса', 'Масштаб'],
        [[6, 3], [7, 3], [8, 3]], '', true);
    addText($table, [ 'Лист', 'Листов'],
        [[4, 7], [5, 7]], '');


    $('.edit_cell_title_block').on('click', function () {
        $(this).find('.title_block_div')
            .addClass('title_block_div_hide').removeClass('title_block_div');
        $(this).find('.title_block_input_hide')
            .addClass('title_block_input');
        console.log($(this).find('.title_block_div_hide').css('font-size'));
        $(this).find('.title_block_input')
            .css({'font-size': $(this).find('.title_block_div_hide').css('font-size') });
        if($(this).find('input').hasClass('title_block_input_hide'))
        {
            $(this).find('.title_block_input').val($(this).find('.title_block_div_hide').text());
        }

        $(this).find('.title_block_input').removeClass('title_block_input_hide').focus();
    });

    $('.edit_cell_title_block').on('focusout', function () {
        $(this).find('.title_block_div_hide')
            .addClass('title_block_div').removeClass('title_block_div_hide');
        $(this).find('.title_block_div').text($(this).find('.title_block_input').val());
        $(this).find('.title_block_input')
            .addClass('title_block_input_hide').removeClass('title_block_input');
    });

    $(window).trigger('resize');
    
    $('#addToServerTitleBlock').on('click', function () {
        addToServerTitleBlock();
    })
}

function changeTableRow($row_tr, settings, $table) {

    let width = $table.width();

    function calcWidth(setting) {
        return Math.floor(width * setting / 185 * 100) / 100;
    }

    $row_tr.children().each(function (index) {
        //console.log('calc: ' + calcWidth(settings[index]) / width * 100);
        $(this).css({
            'width': calcWidth(settings[index])
            , 'max-width': calcWidth(settings[index])
            //, 'min-width': calcWidth(settings[index])
        });
        $(this).attr('colspan', settings[index]);
    });

}

function generateTableRow($table, sett_row) {

    let $tbody = $table.find('tbody');
    for (let i = 0; i < sett_row.length; i++) {
        $tbody.append('<tr></tr>');
        $tbody.find('tr').eq(i).data({'count': sett_row[i]});
        for (let j = 0; j < sett_row[i]; j++) {
            $tbody.find('tr').eq(i)
                .append('<td class="edit_cell_title_block">' +
                    '<div class="title_block_div"></div>' +
                    '<input type="text" class="title_block_input_hide">' +
                    '</td>');
            $tbody.find('tr').eq(i).find('.title_block_div')
                .flowtype(
                    {
                        minFont : 12,
                        maxFont: 50
                    }
                );
        }
    }
    let tr_height = ($tbody.height() - 11 * 2) / 11;
    for (let i = 0; i < sett_row.length; i++) {
        for (let j = 0; j < sett_row[i]; j++) {
            $tbody.find('tr').eq(i).find('td').height(tr_height);
        }
    }
}

function addRowspan(x, y, $table, rowspan, otherCoords) {
    let $tbody = $table.find('tbody');

    $tbody.find('tr').eq(y).children().eq(x).attr('rowspan', rowspan);
    let attr = $tbody.find('tr').eq(y).children().eq(x).attr('colspan');

    for (let i = 1; i < rowspan; i++) {
        let index = otherCoords[i - 1] -
            ($tbody.find('tr').eq(y + i).data('count') -
                $tbody.find('tr').eq(y + i).children().length);
        $tbody.find('tr').eq(y + i).children().eq(index).remove();
    }
}

function changeTdStyleCol(x, y, $table) {
    let $tbody = $table.find('tbody');
    $tbody.find('tr').eq(y).children().eq(x).css({
        'border-width':
            '1px'
    });
    $tbody.find('tr').eq(y).children().eq(x + 1).css({
        'border-width':
            '1px'
    });
}

function changeTdStyleRow(x, y, $table) {
    let $tbody = $table.find('tbody');
    $tbody.find('tr').eq(y).children().eq(x).css({
        'border-bottom-width': '1px'
    });
    $tbody.find('tr').eq(y + 1).children().eq(x).css(
        {'border-top-width': '1px'});
}

function addText($table, text, positions, style, readonly = false) {
    let $tbody = $table.find('tbody');

    for (let i = 0; i < positions.length; i++) {
        if(readonly)
        {
            $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
                .removeClass('edit_cell_title_block').off('click')
                .find('.title_block_div').text(text[i]);
            continue;
        }

        $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
            .find('.title_block_div').text(text[i]);
        $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
            .find('.title_block_input').val(text[i]);
        $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
            .addClass(style);
    }
}

function serializedTitleBlock() {
    let $table = $('#table_title_block');
    let $tbody = $table.find('tbody');
    let serArr = [];
    $tbody.find('tr').each(function () {
        let tempArr = [];
        $(this).find('td').each(function () {
            tempArr.push($(this).find('.title_block_div').text());
        });
        serArr.push(tempArr);
    });
    console.log(serArr);
    return serArr;
}

function addToServerTitleBlock() {
    let serArr = serializedTitleBlock();
    $.ajax(
        {
            url: '',
            type: 'POST',
            data: {data: serArr, function: 'add_title_block'},
            success: function (data) {
                //console.log(data);
            },
            error: function () {
                
            }
        }
    )
}
