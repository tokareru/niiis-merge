/*
$(function () {
    initTitleBlock();
});
*/


function initTitleBlock() {

    let $table = $('#table_title_block');
    $table.css({"height": $table.outerWidth() / 3.36 - 11 * 2});
    generateTableRow($table, [6, 6, 6, 9, 11, 10, 10, 7, 6, 6, 6]);
    if (Role !== 'designer') {
        $("#addToServerTitleBlock").remove();
    }
    let $tbody_tr = $table.find('tbody tr');
    changeTableRow($tbody_tr.eq(0),
        [7, 10, 23, 15, 10, 120], $table, 185);
    changeTableRow($tbody_tr.eq(1),
        [7, 10, 23, 15, 10, 120], $table, 185);
    changeTableRow($tbody_tr.eq(2),
        [7, 10, 23, 15, 10, 120], $table, 185);
    changeTableRow($tbody_tr.eq(3),
        [7, 10, 23, 15, 10, 70, 15, 17, 18], $table, 185);
    changeTableRow($tbody_tr.eq(4),
        [7, 10, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table, 185);
    changeTableRow($tbody_tr.eq(5),
        [17, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table, 185);
    changeTableRow($tbody_tr.eq(6),
        [17, 23, 15, 10, 70, 5, 5, 5, 17, 18], $table, 185);
    changeTableRow($tbody_tr.eq(7),
        [17, 23, 15, 10, 70, 20, 30], $table, 185);
    changeTableRow($tbody_tr.eq(8),
        [17, 23, 15, 10, 70, 50], $table, 185);
    changeTableRow($tbody_tr.eq(9),
        [17, 23, 15, 10, 70, 50], $table, 185);
    changeTableRow($tbody_tr.eq(10),
        [17, 23, 15, 10, 70, 50], $table, 185);

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
    addText($table, [''], [[5, 0]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 3
    addText($table, [''], [[4, 8]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графы 4
    addText($table, [''], [[5, 4]], 'text-center' +
        '');
    //Графы 4
    addText($table, [''], [[6, 4]], 'text-center' +
        '');
    //Графы 4
    addText($table, [''], [[7, 4]], 'text-center' +
        '');
    //Графа 5
    addText($table, [''], [[8, 4]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 6
    addText($table, [''], [[9, 4]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //Графа 9
    addText($table, [''], [[5, 8]], 'text-center' +
        ' font-weight-bold td_fontSize18');
    //добавляем текст на 5 строке
    addText($table, ['Изм.', 'Лист', '№ докум.', "Подп.", 'Дата'],
        [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]], '', true);
    //добавляем текст на первый столбец
    addText($table, ['Разраб.', 'Пров.', 'Т. контр.', 'Н. контр.', 'Утв.'],
        [[0, 5], [0, 6], [0, 7], [0, 9], [0, 10]], '', true);

    //добавляем данные из БД
    getDataFromServerTitleBlock();


    addText($table, ['Лит.', 'Масса', 'Масштаб'],
        [[6, 3], [7, 3], [8, 3]], '', true);
    addText($table, ['Лист', 'Листов'],
        [[4, 7], [5, 7]], '');


    $('.edit_cell_title_block').on('click', function () {
        $(this).find('.title_block_div')
            .addClass('title_block_div_hide').removeClass('title_block_div');
        $(this).find('.title_block_input_hide')
            .addClass('title_block_input');
        $(this).find('.title_block_input')
            .css({'font-size': $(this).find('.title_block_div_hide').css('font-size')});
        if ($(this).find('input').hasClass('title_block_input_hide')) {
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

    $('.edit_cell_title_block').on('keydown', function (e) {
        if (e.which === 9) {
            e.preventDefault();
            let $table_td = $table.find('td');
            let $this = $(this);
            let next = false;
            let count = $table_td.length;
            $table_td.each(function (index) {
                if (count === index + 1) {
                    $(this).focusout();
                }
                if (next && $(this).hasClass('edit_cell_title_block')) {
                    $(this).trigger('click');
                    next = false;
                    return;
                }
                if ($this.get(0) === $(this).get(0)) {
                    next = true;
                }
            });
        }
    });

    $(window).trigger('resize');

    $('#addToServerTitleBlock').on('click', function () {
        addToServerTitleBlock();
        addToServerRazmer();
        HideInputAndDrawRazmerOnScheme();
        setDrawingStatus();
    })
}

function setDrawingStatus()
{
    $.ajax({
        type: "GET",
        url: "drawing_main_text_ajax/is_drawing_finished",
        dataType: "json",
        data: "type=set",
        success: function (answer) {

        }
    });

    /*$.ajax({
        type: "POST",
        url: "/start_ajax/db_change_time",
        data: {
            login: login
        },
        success: function (answer) {
            console.log(answer);
        }
    })*/
}

function HideInputAndDrawRazmerOnScheme()
{
    for (let i=1;i<4;i++)
    {
        //$("#razmNumber"+i).hide();
        if (i == 1)
        {
            $( "#scheme1" ).append("<canvas id='razmer1'></canvas>");
            let ct = document.getElementById("razmer1").getContext("2d");
            ct.beginPath();
            ct.font = "italic 10pt Arial";
            ct.fillText($("#razmNumber1").val(), 105, 50);
            ct.stroke();
        }
        else
        {
            let j=(i-1)*2;
            ctxs[0].fillText($("#razmNumber"+i).val(), areas3[j].x + Math.abs(areas3[j].x-areas3[j+1].x)/2, areas3[j].y-7);
        }
    }
}

function addToServerRazmer()
{
    if ($("#razmNumber1").val() == undefined ||  $("#razmNumber1").val() == '') {var razm1 = 0;} else {var razm1 = $("#razmNumber1").val();}
    if ($("#razmNumber2").val() == undefined ||  $("#razmNumber2").val() == '') {var razm2 = 0;} else {var razm2 = $("#razmNumber2").val();}
    if ($("#razmNumber3").val() == undefined ||  $("#razmNumber3").val() == '') {var razm3 = 0;} else {var razm3 = $("#razmNumber3").val();}

    $.ajax({
        type: "POST",
        url: "drawing_main_text_ajax/save_size",
        dataType: "json",
        data:
            {
                "scheme":"scheme",
                "razm1":razm1,
                "razm2":razm2,
                "razm3":razm3
            },
        success: function (answer) {
            console.log(answer);
        }
    });

}

function changeTableRow($row_tr, settings, $table, percent) {

    let width = $table.width();

    function calcWidth(setting) {
        return Math.floor(width * setting / percent * 100) / 100;
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

        let $edit_cell = '';
        if (Role === 'designer') {
            $edit_cell = 'edit_cell_title_block';
        }


        for (let j = 0; j < sett_row[i]; j++) {
            $tbody.find('tr').eq(i)
                .append('<td class="' + $edit_cell + '">' +
                    '<div class="title_block_div"></div>' +
                    '<input type="text" class="title_block_input_hide">' +
                    '</td>');
            $tbody.find('tr').eq(i).find('.title_block_div')
                .flowtype(
                    {
                        minFont: 12,
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
        if (index < 0)
            index = 0;
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
        if (readonly) {
            $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
                .removeClass('edit_cell_title_block').off('click')
                .find('.title_block_div').html(text[i]);
            continue;
        }

        $tbody.find('tr').eq(positions[i][1]).children().eq(positions[i][0])
            .find('.title_block_div').html(text[i]);
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
    //1-20 ячейки
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            let tdata = $tbody.find('tr').eq(i).find('td').eq(j).text();
            serArr.push(tdata);
        }
    }
    //21 ячейка
    serArr.push($tbody.find('tr').eq(0).find('td').eq(5).text());
    //22 ячейка
    serArr.push($tbody.find('tr').eq(3).find('td').eq(5).text());

    //23-31 ячейки
    for (let i = 5; i < 8; i++) {
        for (let j = 1; j < 4; j++) {
            let tdata = $tbody.find('tr').eq(i).find('td').eq(j).text();
            serArr.push(tdata);
        }
    }

    //32-35 ячейки
    for (let i = 0; i < 4; i++) {
        let tdata = $tbody.find('tr').eq(8).find('td').eq(i).text();
        serArr.push(tdata);
    }
    //36-41 ячейки
    for (let i = 9; i < 11; i++) {
        for (let j = 1; j < 4; j++) {
            let tdata = $tbody.find('tr').eq(i).find('td').eq(j).text();
            serArr.push(tdata);
        }
    }

    //42 ячейка
    serArr.push($tbody.find('tr').eq(8).find('td').eq(4).text());

    //43-47 ячейки
    for (let i = 5; i < 10; i++) {
        let tdata = $tbody.find('tr').eq(4).find('td').eq(i).text();
        serArr.push(tdata);
    }

    //48-49 ячейки
    for (let i = 4; i < 6; i++) {
        let tdata = $tbody.find('tr').eq(7).find('td').eq(i).text();
        serArr.push(tdata);
    }

    //50 ячейка
    serArr.push($tbody.find('tr').eq(8).find('td').eq(5).text());
    return serArr;
}

function addToServerTitleBlock() {
    let serArr = serializedTitleBlock();
    $.ajax(
        {
            url: 'drawing_main_text_ajax/save',
            type: 'POST',
            data: {body: serArr},
            success: function (data) {
                console.log(data);
                $.ajax({
                    type: "POST",
                    url: "/start_ajax/db_change_time",
                    data: {
                        login: login
                    },
                    success: function (answer) {
                        console.log(answer);
                    }
                })
            },
            error: function () {
            }
        }
    )
}

function getDataFromServerTitleBlock() {

    let ServerData = [];
    let index = 0;

    $.ajax(
        {
            url: 'drawing_main_text_ajax',
            type: 'POST',
            data: {},
            success: function (data) {
                for (let key in data) {
                    if (index > 50)
                        break;
                    ServerData.push(data[index++]);
                }
                addDataToTitleBlock(ServerData);
            },
            error: function () {

            }
        }
    );
}

function addDataToTitleBlock(data) {
    let $table = $('#table_title_block');
    let $tbody = $table.find('tbody');
    let index = 0;
    //1-20 ячейки
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            $tbody.find('tr').eq(i).find('td').eq(j).find('.title_block_div').text(data[index++]);
        }
    }
    //21 ячейка
    $tbody.find('tr').eq(0).find('td').eq(5).find('.title_block_div').text(data[index++]);
    //22 ячейка
    $tbody.find('tr').eq(3).find('td').eq(5).find('.title_block_div').text(data[index++]);

    //23-31 ячейки
    for (let i = 5; i < 8; i++) {
        for (let j = 1; j < 4; j++) {
            $tbody.find('tr').eq(i).find('td').eq(j).find('.title_block_div').text(data[index++]);
        }
    }

    //32-35 ячейки
    for (let i = 0; i < 4; i++) {
        $tbody.find('tr').eq(8).find('td').eq(i).find('.title_block_div').text(data[index++]);
    }
    //36-41 ячейки
    for (let i = 9; i < 11; i++) {
        for (let j = 1; j < 4; j++) {
            $tbody.find('tr').eq(i).find('td').eq(j).find('.title_block_div').text(data[index++]);
        }
    }

    //42 ячейка
    $tbody.find('tr').eq(8).find('td').eq(4).find('.title_block_div').text(data[index++]);

    //43-47 ячейки
    for (let i = 5; i < 10; i++) {
        $tbody.find('tr').eq(4).find('td').eq(i).find('.title_block_div').text(data[index++]);
    }

    //48-49 ячейки
    for (let i = 4; i < 6; i++) {
        $tbody.find('tr').eq(7).find('td').eq(i).find('.title_block_div').text(data[index++]);
    }

    //50 ячейка
    $tbody.find('tr').eq(8).find('td').eq(5).find('.title_block_div').text(data[index++]);

    let worker = '';
    let apprrov = '';
    let confirmer = '';
    if (Round === 3 && Role === 'designer') {
        let UserNames = getLoginNames('short_name');
        let UserRole = getLoginNames('role');
        UserRole.forEach(function (value, index) {
            if (value === 'согласующий')
                apprrov = UserNames[index];
            if (value === 'исполнитель')
                worker = UserNames[index];
            if (value === 'технолог')
                confirmer = UserNames[index];
        });
        addText($table, [worker, confirmer, apprrov],
            [[1, 5], [1, 6], [1, 10]], '', false);
    }
}

function addToServerTitleBlock() {
    let serArr = serializedTitleBlock();
    $.ajax(
        {
            url: 'drawing_main_text_ajax/save',
            type: 'POST',
            data: {body: serArr},
            success: function (data) {
                console.log(data);
                $.ajax({
                    type: "POST",
                    url: "/start_ajax/db_change_time",
                    data: {
                        login: login
                    },
                    success: function (answer) {
                        console.log(answer);
                    }
                })
            },
            error: function () {

            }
        }
    )
}
