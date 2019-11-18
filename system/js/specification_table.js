function createSpecificationTable() {
    //serializeTable();
    getJsonByURL("json/spec_table.json", generateTable, {});
}

function generateTable(json) {
    let count_cols = json.cols;
    let count_rows = json.rows;
    let table = '';
    let $table_made = $('.table_made');
    $table_made
        .append('<table style="width: 100%" class="table_edit table table-striped table-bordered table-hover">' +
            '</table>');
    $table_made.find('.table_edit').append('<thead style="background-color: #0a78bf"></thead>');
    $table_made.find('thead').append('<tr></tr>');
    $table_made.find('thead tr').append('<th class="p-0"><div class="edit_cell_readonly">' + "\№" + '</div></th>');
    json.thead.forEach(function (elem) {
        $table_made.find('thead tr').append('<th class="p-0"><div>' + elem.text + '</div></th>');
    });

    $table_made.find('.table_edit').append('<tbody></tbody>');
    json.tbody.forEach(function (curr_row, rows) {
        $table_made.find('tbody').append('<tr></tr>');
        $table_made.find('tbody tr').last().append('<td class="p-0"><div>' + (rows + 1) + '</div></td>');
        curr_row.row.forEach(function (curr_col, cols) {
            $table_made.find('tbody').find('tr').last().append('<td class="p-0"><div>' + curr_col.text + '</div></td>');
        })
    });

    tableData(false);
    json.thead.forEach(function (elem, i) {
        if (elem.readonly) cellToReadOnly(0, i + 1);
    });
    json.tbody.forEach(function (curr_row, rows) {
        curr_row.row.forEach(function (curr_col, cols) {
            if (curr_col.readonly) cellToReadOnly(rows + 1, cols + 1);
        })
    });

    setRowsNumber();
    colToReadOnly(0, 'readonly');
}

function addInputs() {
    let $table_edit = $('.table_edit');
    $table_edit.find('tbody').find('td').addClass('edit_cell');
    $table_edit.find('.edit_cell').append('<input class="input_text" type="text">');
    $table_edit.find('.edit_cell').each(function (index, elem) {
        $(this).find('.input_text').attr('value', $(this).find('div').text())
            .addClass('edit_cell_input_hide');
    });
    $table_edit.find('thead').find('th').addClass('edit_cell')
        .append('<input class="input_text"  type="text">');
    $table_edit.find('thead').find('.edit_cell').each(function (index, elem) {
        $(this).find('.input_text').attr('value', $(this).find('div').text())
            .addClass('edit_cell_input_hide');
    });
}

function tableData(readonly) {

    let $table_edit = $('.table_edit');
    $table_edit.find('div').each(function () {
        $(this).addClass('edit_cell_div');
    });

    if (!readonly) {
        addInputs();
        let $edit_mode_div = $('#specification_edit');
        $edit_mode_div.load('pages/edit.html', function () {
            $('#edit_div_toggle').hide();
        });
        let $table_edit = $('.table_edit');
        $table_edit.on('keypress', '.input_text', function (event) {
            moveOnTableByEnter(event, $(this));
        });


        $edit_mode_div.on('click', '#edit_mode_onoff', function () {
            $('#edit_div_toggle').toggle(300);
        });

        $edit_mode_div.on('click', '#add_row', function () {
            addRow();
        });

        $edit_mode_div.on('click', '#del_row', function () {
            delRow();
        });

        $edit_mode_div.on('click', '#add_col_btn', function () {
            let $text = $('#add_col_text');
            let number = Number($text.val());
            addToTableCol($text, number);
        });

        $edit_mode_div.on('click', '#del_col_btn', function () {
            delCol();
        });

        $edit_mode_div.on('keyup', 'input', function () {
            let $this = $(this);
            if ($this.attr("col") === "col") {
                unhighlightCol();
                highlightCol($this.val());
            }
            if ($this.attr("row") === "row") {
                unhighlightRow();
                highlightRow($this.val());
            }
        });

        $edit_mode_div.on('click', 'button', function () {
            unhighlightRow();
            unhighlightCol();
        });

        $edit_mode_div.on('click', 'input[type=button]', function () {
            unhighlightRow();
            unhighlightCol();
        });

        $edit_mode_div.on('click', '#cell_to_readonly_but', function () {
            let $row = $("#cell_to_readonly_row");
            let row = Number($row.val());
            let $col = $("#cell_to_readonly_col");
            let col = Number($col.val());

            if (col > 0 && col < ($(".table_made th").length - 1) && row >= 0 && row < $(".table_made tr").length) {
                cellToReadOnly(row, col);
            } else {
                $row.attr("placeholder", "ошибка!");
                $col.attr("placeholder", "ошибка!");
            }
            $row.val("");
            $col.val("");
        });


        $table_edit.on('keydown', '.input_text', function (event) {
            modeOnTableBySomeKey(event, $(this));
        });

        $table_edit.on('click', '.edit_cell', function () {
            let $this = $(this);
            $this.find('div').addClass('edit_cell_div_hide')
                .removeClass('edit_cell_div');
            $this.find('.input_text')
                .addClass('edit_cell_input')
                .removeClass('edit_cell_input_hide')
                .focus();
            //$this.parent().children().addClass("p-0");
            //$this.height(Math.round(parent_height * 0.5));
        });
        $table_edit.on('focusout', '.edit_cell .input_text', function () {
            let $input = $(this);
            $input.removeClass('edit_cell_input').addClass('edit_cell_input_hide');
            let $parent = $input.parent();
            let $div = $parent.find('div').removeClass('edit_cell_div_hide')
                .addClass('edit_cell_div');
            $div.html(addToStrHTMLTags($input.val()));
            $input.val(addToStrHTMLTags($input.val()));
        });
    }
}

function validateDiv(str_div) {
    let index_less = 0;
    let index_more = 0;
    let switcher = true;
    let new_str = '';
    for (let i = 0; i < str_div.length; i++) {
        if (str_div[i] === '<') {
            switcher = false;
            continue;
        }
        if (str_div[i] === '>') {
            switcher = true;
            continue;
        }
        if (switcher)
            new_str += str_div[i];
    }
    return new_str;
}

function addToStrHTMLTags(str_div) {

    let str_left = '';
    let str_right = '';
    if (str_div.indexOf('<i>') !== -1) {
        str_left += '<i>';
        str_right += '</i>';
    }
    if (str_div.indexOf('<h') !== -1 && str_div[str_div.indexOf('<h') + 3] === '>') {
        str_left += '<h' + str_div[str_div.indexOf('<h') + 2] + '>';
        str_right = '</h' + str_div[str_div.indexOf('<h') + 2] + '>' + str_right;
    }
    let str_new = str_left + validateDiv(str_div) + str_right;
    return str_new;
}

function addRow() {
    let $tbody = $('.table_edit tbody');
    let $td_count = $('.table_edit thead').find('th').length;
    let $len_tr = $('.table_edit tbody').find('tr').length;
    let $text_add_row = $('#add_row_text');
    let $index = Number($text_add_row.val()) - 1;
    $text_add_row.val('');
    $text_add_row.attr('placeholder', 'номер строки');
    let isZeroRows = false;
    if ($len_tr === 0) {
        $tbody.append('<tr></tr>');
        isZeroRows = true;
        $len_tr = 1;
        $index = 1;
    }

    if ($index >= $len_tr + 1 || $index < 0) {
        $text_add_row.attr('placeholder', 'ошибка!');
        return;
    }
    let $new_tr = '<tr>';
    for (let i = 0; i < $td_count; i++) {
        $new_tr += '<td class="edit_cell p-0">' +
            '<div class="edit_cell_div"></div><input type="text"' +
            'class="input_text edit_cell_input_hide" value=""></td>';
    }
    $new_tr += '</tr>';
    if ($index < $len_tr && $index >= 0) {
        let neighbourElem = $tbody.find('tr').eq($index);
        $($new_tr).insertBefore(neighbourElem);
        let $edit_div = neighbourElem.prev().find('.edit_cell').eq(1);
        $edit_div.find('div')
            .removeClass('edit_cell_div').addClass('edit_cell_div_hide');
        $edit_div.find('input')
            .removeClass('edit_cell_input_hide').addClass('edit_cell_input').focus();
    } else if ($index === $len_tr) {
        let neighbourElem = $tbody.find('tr').eq($index - 1);
        $($new_tr).insertAfter(neighbourElem);
        let $edit_div = neighbourElem.next().find('.edit_cell').eq(1);
        $edit_div.find('div')
            .removeClass('edit_cell_div').addClass('edit_cell_div_hide');
        $edit_div.find('input')
            .removeClass('edit_cell_input_hide').addClass('edit_cell_input').focus();
    }
    if (isZeroRows) {
        $tbody.find('tr:first').remove();
    }
    setRowsNumber();
}

function delRow() {
    let $del_row_text = $('#del_row_text');
    let number = Number($del_row_text.val()) - 1;
    $del_row_text.val('');
    let $len_tr = $('.table_edit tbody').find('tr').length;
    if (number < 0 || number >= $len_tr) {
        $del_row_text.attr('placeholder', 'ошибка!');
        return;
    }
    $('.table_edit tbody').find('tr').eq(number).remove();
    $del_row_text.attr('placeholder', 'номер строки: ');
    setRowsNumber()
}

function addToTableCol($text, number) {
    /* let $text = $('#add_col_text');
     let number = Number($text.val());*/
    let count_cols = $('.table_edit thead').find('th').length;
    $text.val('');
    //alert(number + ' ' + count_cols);
    let $tbody = $('.table_edit tbody');
    if (number <= 0 || number > count_cols) {
        $text.attr('placeholder', 'ошибка!');
        return;
    }

    if (number < count_cols) {
        $tbody.find('tr').each(function () {
            $(this).children().each(function (index, elem) {
                //alert($(this).html());
                if (index === number) {
                    $('<td class="edit_cell p-0"><div class="edit_cell_div"></div>' +
                        '<input type="text" class="input_text edit_cell_input_hide"></td>')
                        .insertBefore($(this));
                }
            });
        });
    } else {
        $tbody.find('tr').each(function () {
            $(this).children().each(function (index, elem) {
                //alert($(this).html());
                if (index + 1 === number) {
                    $('<td class="edit_cell p-o"><div class="edit_cell_div"></div>' +
                        '<input type="text" class="input_text edit_cell_input_hide"></td>')
                        .insertAfter($(this));
                }
            });
        });
    }
    let $table_thead = $('.table_edit thead');
    if (number === count_cols) {
        $('<th class="edit_cell p-0"><div class="edit_cell_div"></div>' +
            '<input type="text" class="input_text edit_cell_input_hide"></th>')
            .insertAfter($table_thead.find('th').eq(number - 1));
    } else {
        $('<th class="edit_cell p-0"><div class="edit_cell_div"></div>' +
            '<input type="text" class="input_text edit_cell_input_hide"></th>')
            .insertBefore($table_thead.find('th').eq(number));
    }
    $text.attr('placeholder', 'номер столбца');
    $table_thead.find('th').eq(number).find('div')
        .removeClass('edit_cell_div').addClass('edit_cell_div_hide');
    $table_thead.find('th').eq(number).find('.input_text')
        .removeClass('edit_cell_input').addClass('edit_cell_input').focus();
}

function delCol() {
    let $text = $('#del_col_text');
    let $number = Number($text.val());
    let count_cols = $('.table_edit tr').find('th').length - 1;
    $text.val('');
    if ($number <= 0 || $number > count_cols) {
        $text.attr('placeholder', 'ошибка!');
        return;
    }
    let $tbody = $('.table_edit tbody');
    $tbody.find('tr').each(function () {
        $(this).children().each(function (index, elem) {
            //alert($(this).html());
            if (index === $number) {
                $(this).remove();
            }
        });
        if ($(this).find('td').length <= 0) {
            $(this).remove();
        }
    });
    let $thead = $('.table_edit thead');
    $thead.find('th').eq($number).remove();
    if ($thead.find('th').length <= 0) {
        $thead.children().remove();
    }
    if ($('.table_edit tr').find('th').length === 0) {
        $thead.append('<tr><th class="edit_cell"><div class="edit_cell_div"></div>' +
            '<input type="text" class="input_text edit_cell_input_hide"></th></tr>');
    }
    $text.attr('placeholder', 'номер столбца');
    if (count_cols === 1) {
        addToTableCol($('#add_col_text'), 1);
    }
}

function moveOnTableByEnter(event, $this) {
    if (event.which === 13) {
        let $next = $this.parent().next();
        $next.addClass("p-0");
        //alert($next.html());
        if ($next.find('div').attr('readonly') === 'readonly' ||
            $next.find('div').attr('disabled') === 'disabled') {
            while ($next.find('div').attr('readonly') === 'readonly' ||
            $next.find('div').attr('disabled') === 'disabled') {
                $next = $next.next();
            }
        }
        //if($next.find(''))
        if ($next.html() !== undefined) {
            //alert($next.find('input').text());
            $next.find('div').removeClass('edit_cell_div').addClass('edit_cell_div_hide');
            $next.find('.input_text').removeClass('edit_cell_input_hide')
                .addClass('edit_cell_input');
            //$this.blur();
            $next.find('.input_text').focus();
        } else {
            let count_cols = $('.table_edit tr').find('th').length;


            let $new_tr = $this.parent().parent().next().children().first();
            let $arr_td = $this.parent().parent(); //$this.parent().parent().next().html()
            //alert($arr_td.next().html());
            let td_loop_end = true;
            while (($arr_td.next().html() !== '' && $arr_td.next().html() !== undefined) && td_loop_end) {
                for (let i = 0; i < count_cols; i++) {
                    $new_tr = $arr_td.next().children().eq(i);
                    //alert($new_tr.html());
                    if ($new_tr.html() === undefined || (i + 1 === count_cols)) {
                        $arr_td = $arr_td.next();
                        break;
                    }
                    if ($new_tr.find('div').attr('disabled') !== 'disabled' &&
                        $new_tr.find('div').attr('readonly') !== 'readonly') {
                        td_loop_end = false;
                        break;
                    }
                }
                if ($new_tr.next().html() === undefined) {
                    $this.blur();
                    return;
                }
            }
            let $tbody_tr = $new_tr.parent();
            if ($new_tr.html() !== undefined && $tbody_tr.html() !== undefined) {
                $new_tr.find('div')
                    .removeClass('edit_cell_div').addClass('edit_cell_div_hide');
                $new_tr.find('.input_text').removeClass('edit_cell_input_hide')
                    .addClass('edit_cell_input');
                $new_tr.find('.input_text').focus();
                $new_tr.addClass("p-0");
            } else {
                $this.blur();
            }
        }

    }
}

function modeOnTableBySomeKey(event, $this) {
    if (event.which === 20) {
        let $index = 0;
        if ($this.parent().parent().html() === $('.table_edit thead').find('tr').html()) {
            $this.addClass('temp_tab_input');
            $this.parent().parent().find('th').each(function (index) {
                if ($(this).find('.input_text').hasClass('temp_tab_input')) {
                    $index = index;
                }
            });
            $this.removeClass('temp_tab_input');
            //alert($index);
            let $next = $('.table_edit tbody').find('tr').find('td').eq($index);
            //alert($next.html());
            $next.find('.input_text').removeClass('edit_cell_input_hide')
                .addClass('edit_cell_input');
            //alert($next.find('input').html());
            $next.find('div').removeClass('edit_cell_div')
                .addClass('edit_cell_div_hide');
            $next.find('.input_text').focus();
        } else {
            let $index = 0;
            $this.addClass('temp_tab_input');
            $this.parent().parent().find('td').each(function (index) {
                    if ($(this).find('.input_text').hasClass('temp_tab_input')) {
                        $index = index;
                    }
                }
            );
            $this.removeClass('temp_tab_input');
            let $next = $this.parent().parent().next().children().eq($index);
            if ($next.find('.input_text').html() !== undefined) {
                $next.find('.input_text').removeClass('edit_cell_input_hide')
                    .addClass('edit_cell_input');
                $next.find('div').removeClass('edit_cell_div')
                    .addClass('edit_cell_div_hide');
                $next.find('.input_text').focus();
            } else {
                $this.blur();
            }
        }
    }
}


function colToReadOnly($number, $attr) {
    $('.table_edit').find('tbody').children().each(function () {
        let $this_children = $(this).children().eq($number);
        $this_children.removeClass('edit_cell');//.addClass(class_name);
        $this_children.find('.input_text').remove();
        $this_children.find('div').attr($attr, true);
    });
    $('.table_edit').find('thead').children().each(function () {
        let $this_children = $(this).children().eq($number);
        $this_children.removeClass('edit_cell');//.addClass(class_name);
        $this_children.find('.input_text').remove();
        $this_children.find('div').attr($attr, true);
    });
}

function cellToReadOnly(row, col) {
    //заголовок - 0 строка для пользователя
    let $tableCols;
    //важно помнить, что заголовок и тело таблицы находятся в разных тегах,
    //поэтому хотя и визуально 0-я строка идет после заголовка, она будет иметь 0-й индекс
    //а также, что пользователь вводит номер строки на 1 больше
    //нужно учитывать, что нулевой столбец занят номерами строк,
    //однако, учитывая, что пользователь вводит номер столбца на 1 больше, то это нивилируется
    if (row > 0) {
        row--;
        let $tr = $('.table_made').find('tbody tr').each(function (index) {
            if (index === row) $tableCols = $(this).find("td");
        });
    } else {
        $tableCols = $('.table_made').find("thead th");
    }

    $tableCols.each(function (current_col) {
        if (current_col === col) {
            let $this = $(this);
            $this.find("div").attr("readonly", "readonly");
            $this.removeClass('edit_cell');
            $this.find("div").removeClass("edit_cell_div").addClass("edit_cell_readonly");
            $this.find('.input_text').remove();
        }
    })

}

function rowToReadOnly(row) {
    let $tr = $('.table_made').find('tbody td').each(function (index) {
        if (index > 0) cellToReadOnly(row, index);
    });
}

function serializeTable() {
    let array_table = Array();
    let $table_made = $('.table_made');
    let count_cols = $('.table_edit tr').find('th').length;
    let count_rows = $table_made.find('tbody').find('tr').length;
    //alert(count_rows + ' ' + count_cols);
    let temp = Array();
    for (let cols = 0; cols < count_cols; cols++) {
        temp.push($table_made.find('thead tr').children().eq(cols).find('div').text());
    }
    array_table.push(temp);
    for (let rows = 0; rows < count_rows; rows++) {
        let temp = Array();
        let $each_tr = $table_made.find('tbody tr').eq(rows);
        for (let cols = 0; cols < count_cols; cols++) {
            let $find_div = $each_tr.find('td').eq(cols).find('div');
            if ($find_div.html().indexOf('<input') === -1) {
                temp.push($find_div.text());
            } else {
                temp.push('<input type="checkbox"  '
                    + $find_div.find('input').attr('checked') +
                    ' value="' + $find_div.find('input').attr('value') + '"' + '>');
            }

        }
        array_table.push(temp);
        //alert(temp);
    }
    return array_table;
}

function setRowsNumber() {
    let $tbody = $("#spec_main tbody");
    $tbody.find("tr").each(function (index) {
        let $this = $(this);
        let $first_div = $this.find("td").first().find("div")
        $first_div.text(index + 1);
        $first_div
            .addClass("firstCol")
            .attr("readonly", "readonly");
        let $td_first = $this.find("td").first();
        $td_first.find("input").remove();
        $td_first.css({
            "width": "1vw"
        })
            .attr("readonly", "readonly")
            .removeClass("edit_cell");
    })
}

function highlightCol(col) {
    let $table = $(".table_made");
    /*$table.find("thead th").each(function (index) {
        console.log(index);
        if (index === Number(col) && index !== 0) {
            $(this).css({
                "background-color": "red"
            })
        }
    });*/

    $table.find("tbody tr").each(function (rows) {
        $(this).find("td").each(function (cols) {
            if (cols === Number(col) && cols !== 0) {
                $(this).css({
                    "background-color": "rgb(255, 247, 189)"
                })
            }
        });
    });
}

function highlightRow(row) {
    let $table = $(".table_made");
    /*$table.find("thead tr").each(function (index) {
        if (index === Number(row)) {
            $(this).find("th").each(function (index) {
                if (index >0)
                    $(this).css({
                    "background-color": "red"
                })
            })
        }
    });*/

    if (row > 0) {
        $table.find("tbody tr").each(function (rows) {
            if ((rows) === (Number(row) - 1))
                $(this).find("td").each(function (cols) {
                    if (cols > 0)
                        $(this).css({
                            "background-color": "rgb(255, 247, 189)"
                        })
                })
        })
    }

}

function unhighlightRow() {
    let $table = $(".table_made");
    $table.find("tbody tr").each(function (rows) {
        $(this).find("td").each(function (cols) {
            if ($(this).css("background-color") === "rgb(255, 247, 189)")
                $(this).css({
                    "background-color": "unset"
                })
        })
    })

}

function unhighlightCol() {
    let $table = $(".table_made");
    $table.find("thead th").each(function (index) {
        if (index !== 0) {
            if ($(this).css("background-color") === "rgb(255, 247, 189)")
                $(this).css({
                    "background-color": "unset"
                })
        }
    });

    $table.find("tbody tr").each(function (rows) {
        $(this).find("td").each(function (cols) {
            if (cols !== 0) {
                console.log($(this).css("background-color"))
                if ($(this).css("background-color") === "rgb(255, 247, 189)")
                    $(this).css({
                        "background-color": "unset"
                    })
            }
        });
    });
}
