function createSpecificationTable() {
    //serializeTable();
    if(Round < 3){
        getJsonByURL("spec_table_ajax", generateTable,
            {table_block: "#specificationBlock", edit_mode_div: "#specification_edit", url: "pages/edit_field",
                save_url: "spec_table_ajax/save"});
    }else {
        getJsonByURL("spec_autoentered_table_ajax", generateTable,
            {table_block: "#specificationBlock", edit_mode_div: "#specification_edit", url: "pages/edit_field",
                save_url: "spec_autoentered_table_ajax/save"});

        $("#left-accordion #pdm_field input").click(function () {
            setTableByPdmAndStd( "#specificationBlock");
        })

        $("#left-accordion #std_field input").click(function () {
            setTableByPdmAndStd("#specificationBlock");
        })
    }
}

function generateTable(json, add_data) {
    //console.log(json)
    let table_block = add_data.table_block + " ";
    let edit_mode_div = add_data.edit_mode_div + " ";
    let url = add_data.url;
    let save_url = add_data.save_url;
    let $table_made = $(table_block + '.table_made');
    $table_made
        .append('<table style="width: 100%" class="table_edit table table-striped table-bordered table-hover">' +
            '</table>');
    $table_made.find('.table_edit').append('<thead></thead>');
    $table_made.find('thead').append('<tr></tr>');
    //кнопка удаления строки
    $table_made.find('thead tr').append('<th style="border-right-color: transparent;"><div class="edit_cell_readonly">' /*+ "\№"*/ + '</div></th>');
    //кнопка "сделать строку редактируемой"
    $table_made.find('thead tr').append('<th class="p-0" style="width: 33px"><div class="edit_cell_readonly">' + '</div></th>');
    $table_made.find('.table_edit').append('<tbody></tbody>');


    if (json.thead > "") {
        json.thead.forEach(function (elem) {
            $table_made.find('thead tr').append('<th class="p-0"><div>' + elem.text + '</div></th>');
        });
    } else {
        for (let i = 0; i < 4; i++) {
            $table_made.find('thead tr').append('<th class="p-0"><div></div></th>');
        }
    }


    if (json.tbody > "") {
        json.tbody.forEach(function (curr_row, rows) {
            $table_made.find('tbody').append('<tr></tr>');
            //кнопка удаления строки
            $table_made.find('tbody tr').last().append('<td class="p-0"><div>' /*+ (rows + 1)*/ + '</div></td>');
            //кнопка "сделать строку редактируемой"
            $table_made.find('tbody tr').last().append('<td class="p-0"><div class="toRoPenCol editCol">' /*+ (rows + 1)*/ + '</div></td>');
            curr_row.row.forEach(function (curr_col, cols) {
                $table_made.find('tbody').find('tr').last().append('<td class="p-0"><div>' + curr_col.text + '</div></td>');
            })
        });
    }

    $table_made.find('tbody').append("<tr><td class='p-0' style='width: 33px'><div class='firstColPlus'>+</div></td></tr>")

    tableData(false, table_block, edit_mode_div, url, save_url);
    if (json.tbody === undefined) {
        $(table_block + " .post_data_button").attr("disabled", "disabled");
    }
    /*json.thead.forEach(function (elem, i) {
        if (elem.readonly) cellToReadOnly(0, i + 1, table_block);
    });
    json.tbody.forEach(function (curr_row, rows) {
        curr_row.row.forEach(function (curr_col, cols) {
            if (curr_col.readonly) cellToReadOnly(rows + 1, cols + 1, table_block);
        })
    });*/

    setRowsNumber(table_block);
    colToReadOnly(0, 'readonly', table_block);
    colToReadOnly(1, 'readonly', table_block);

    // спецификация
    if ((table_block === "#specificationBlock ") && (Role === "approver"
        || Role === "technologist" || Role === "production_master" || Role === "worker")){
        $(table_block).find("tbody tr").each(function (i) {
            $(this).find("td").eq(1).find("div").trigger("click");
        })
        rowToReadOnly(0, table_block + " ");
        delZeroCol(table_block + " ");
        $("#specification_edit").remove();
    }

    // маршрутная карта
    if ((table_block === "#routeMapBlock ") && (Role === "approver" || Role === "production_master" || Role === "worker")){
        $(table_block).find("tbody tr").each(function (i) {
            $(this).find("td").eq(1).find("div").trigger("click");
        });
        rowToReadOnly(0, table_block + " ");
        delZeroCol(table_block + " ");
    }

    // маршруты заданий
    if (table_block === "#taskRoutesBlock "){
        $(table_block).find("tbody tr").each(function (i) {
            $(this).find("td").eq(1).find("div").trigger("click");
        });
        rowToReadOnly(0, table_block + " ");
    }


    if (save_url === "spec_autoentered_table_ajax/save" && $("#pdm_field").length){
        setTableByPdmAndStd(table_block);
    }
}

function postDataFromTable(table_block, save_url) {
    let json = {};
    let tbody = [];
    $(table_block + ".table_made").find("tbody tr").each(function (rows) {
        if (rows < $(table_block + ".table_made").find("tr").length - 2) {
            let row_arr = [];
            $(this).find("td").each(function (cols) {
                if (cols > 1) {
                    let $div = $(this).find("div");
                    let r_o = $div.attr("readonly");
                    if (r_o !== undefined) {
                        row_arr.push({
                            "text": $div.text(),
                            "readonly": true
                        });
                    } else {
                        row_arr.push({
                            "text": $div.text(),
                            "readonly": false
                        });
                    }
                }
            });
            row_arr.push({
                product_id: 1
            })
            let obj = {
                row: row_arr
            };
            tbody.push(obj);
        }

    });

    json = {
        tbody: tbody,
        name_pdm: "pdm_component_",
        login: login
    };
    console.log(json);
    $.ajax({
        type: "POST",
        url: save_url,
        data: json,
        success: function (answer) {
            console.log(answer);
        }
    })
    if (Round === 3){
        //console.log(collectDataLabels(".left-side"))
        $.ajax({
            type: "POST",
            url: "spec_autoentered_table_ajax/save_product_checked",
            data: {
                checked: collectDataLabels(".left-side")
            },
            success: function (answer) {
                console.log(answer);
            }
        })
    }

    $.ajax({
        type: "POST",
        url: "start_ajax/db_change_time",
        data: {
            login: login
        },
        success: function (answer) {
            console.log(answer);
        }
    })
}

function addInputs(table_block) {
    let $table_edit = $(table_block + '.table_edit');
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

function tableData(readonly, table_block, edit_mode_div, url, save_url) {

    let $table_edit = $('.table_edit');
    $table_edit.find('div').each(function () {
        $(this).addClass('edit_cell_div');
    });

    if (!readonly) {
        addInputs(table_block);
        let $edit_mode_div = $(edit_mode_div);
        /*$edit_mode_div.load('pages/edit_field', function () {
            $('.edit_div_toggle').hide();
        });*/

        if (url !== "") {
            let html = downloadHTML(url);
            $edit_mode_div.append(html);
            $(table_block).find('.edit_div_toggle').hide();
        }

        let $table_edit = $('.table_edit');
        $table_edit.on('keydown', '.edit_cell', function (event) {
            moveOnTableByEnter(event, $(this));
        });

        $table_edit.on('click', '.firstCol', function (event) {
            delRow(table_block);
            $(this).parent().parent().remove();
            if ($table_edit.find("tbody").find("tr").first().find("td").length < 2){
                $(table_block + " .post_data_button").attr("disabled", "disabled")
            }
        });

        $table_edit.on('click', '.firstColPlus', function (event) {
            let t_edit = $(this).parents('.table_edit');
            addRow(table_block, t_edit.find("tr").length - 2);
            setRowsNumber(table_block);
            $(table_block + " .post_data_button").removeAttr("disabled")
        });

        $table_edit.on('click', '.toEditPenCol', function (event) {
            let $this = $(this);
            let length = $(this).parents('.table_edit').find("tbody").find("tr").first().find("td").length;
            $this.attr("current", "current")
            $(this).parents('.table_edit').find("tbody").find(".editCol").each(function (i) {
                let check = $(this).attr("current");
                if (check === "current") {
                    $this.removeAttr("current");
                    for (let x = 2; x < length; x++) {
                        cellToEdit(i + 1, x, table_block);
                    }
                }
            })
            $this
                .removeClass("toEditPenCol")
                .addClass("toRoPenCol");
        });

        $table_edit.on('click', '.toRoPenCol', function (event) {
            let $this = $(this);
            let length =$(this).parents('.table_edit').find("tbody").find("tr").first().find("td").length;
            $this.attr("current", "current");
            $(this).parents('.table_edit').find("tbody").find(".editCol").each(function (i) {
                let check = $(this).attr("current");
                if (check === "current") {
                    $this.removeAttr("current");
                    for (let x = 2; x < length; x++) {
                        cellToReadOnly(i + 1, x, table_block);
                    }
                }
            });
            $this
                .removeClass("toRoPenCol")
                .addClass("toEditPenCol");
        });

        $edit_mode_div.on('click', '.edit_mode_onoff', function () {
            $(table_block).find('.edit_div_toggle').slideToggle(50);
        });

        $edit_mode_div.on('click', '.add_row', function () {
            let $text_add_row = $(table_block + '.add_row_text');
            let $index = Number($text_add_row.val()) - 1;
            addRow(table_block, $index);
        });

        $edit_mode_div.on('click', '.del_row', function () {
            delRow(table_block);
        });

        $edit_mode_div.on('click', '.add_col_btn', function () {
            let $text = $(table_block + '.add_col_text');
            let number = Number($text.val());
            addToTableCol($text, number, table_block);
        });

        $edit_mode_div.on('click', '.del_col_btn', function () {
            delCol(table_block);
        });

        $edit_mode_div.on('keyup', 'input', function () {
            let $this = $(this);
            if ($this.attr("col") === "col") {
                unhighlightCol(table_block);
                highlightCol($this.val(), table_block);
            }
            if ($this.attr("row") === "row") {
                unhighlightRow(table_block);
                highlightRow($this.val(), table_block);
            }
        });

        $edit_mode_div.on('click', 'button', function () {
            unhighlightRow(table_block);
            unhighlightCol(table_block);
        });

        $edit_mode_div.on('click', 'input[type=button]', function () {
            unhighlightRow(table_block);
            unhighlightCol(table_block);
        });

        $edit_mode_div.on('click', '.cell_to_readonly_but', function () {
            let $row = $(table_block + ".cell_to_readonly_row");
            let row = Number($row.val());
            let $col = $(table_block + ".cell_to_readonly_col");
            let col = Number($col.val());

            if (col > 0 && col < ($(table_block + ".table_made th").length) && row >= 0 && row < $(table_block + ".table_made tr").length) {
                cellToReadOnly(row, col, table_block);
                $row.attr("placeholder", "номер строки");
                $col.attr("placeholder", "номер столбца");
            } else {
                $row.attr("placeholder", "ошибка!");
                $col.attr("placeholder", "ошибка!");
            }
            $row.val("");
            $col.val("");
        });

        $edit_mode_div.on('click', '.post_data_button', function () {
            postDataFromTable(table_block, save_url);
        });

        $edit_mode_div.on('click', '.cell_to_edit_but', function () {
            let $row = $(table_block + ".cell_to_edit_but_row");
            let row = Number($row.val());
            let $col = $(table_block + ".cell_to_edit_but_col");
            let col = Number($col.val());

            if (col > 0 && col < ($(table_block + ".table_made th").length) && row >= 0 && row < $(table_block + ".table_made tr").length) {
                cellToEdit(row, col, table_block);
                $row.attr("placeholder", "номер строки");
                $col.attr("placeholder", "номер столбца");
            } else {
                $row.attr("placeholder", "ошибка!");
                $col.attr("placeholder", "ошибка!");
            }
            $row.val("");
            $col.val("");
        });


        $table_edit.on('keydown', '.input_text', function (event) {
            modeOnTableBySomeKey(event, $(this), table_block);
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
            $div.html(addToStrHTMLTags($input.val(), table_block));
            $input.val(addToStrHTMLTags($input.val(), table_block));
        });
    }

    $('#spec_field_clear').on('click', function () {
        $table_edit.find('tbody .firstCol').each(function () {
            $(this).click();
        })
    })
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

function addToStrHTMLTags(str_div, table_block) {

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

function addRow(table_block, number) {
    let $tbody = $(table_block + '.table_edit tbody');
    let $td_count = $(table_block + '.table_edit thead').find('th').length;
    let $len_tr = $(table_block + '.table_edit tbody').find('tr').length;
    let $text_add_row = $(table_block + '.add_row_text');
    let $index = number;
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
        console.log("Ошибка")
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
}

function delRow(table_block) {
    let $del_row_text = $(table_block + '.del_row_text');
    let number = Number($del_row_text.val()) - 1;
    $del_row_text.val('');
    let $len_tr = $(table_block + '.table_edit tbody').find('tr').length;
    if (number < 0 || number >= $len_tr) {
        $del_row_text.attr('placeholder', 'ошибка!');
        return;
    }
    $(table_block + '.table_edit tbody').find('tr').eq(number).remove();
    $del_row_text.attr('placeholder', 'номер строки: ');
    setRowsNumber(table_block)
}

function addToTableCol($text, number, table_block) {
    /* let $text = $('#add_col_text');
     let number = Number($text.val());*/
    let count_cols = $(table_block + '.table_edit thead').find('th').length;
    $text.val('');
    //alert(number + ' ' + count_cols);
    let $tbody = $(table_block + '.table_edit tbody');
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
    let $table_thead = $(table_block + '.table_edit thead');
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

function delCol(table_block) {
    let $text = $(table_block + '.del_col_text');
    let $number = Number($text.val());
    let count_cols = $(table_block + '.table_edit tr').find('th').length - 1;
    $text.val('');
    if ($number <= 0 || $number > count_cols) {
        $text.attr('placeholder', 'ошибка!');
        return;
    }
    let $tbody = $(table_block + '.table_edit tbody');
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
    let $thead = $(table_block + '.table_edit thead');
    $thead.find('th').eq($number).remove();
    if ($thead.find('th').length <= 0) {
        $thead.children().remove();
    }
    if ($(table_block + '.table_edit tr').find('th').length === 0) {
        $thead.append('<tr><th class="edit_cell"><div class="edit_cell_div"></div>' +
            '<input type="text" class="input_text edit_cell_input_hide"></th></tr>');
    }
    $text.attr('placeholder', 'номер столбца');
    if (count_cols === 1) {
        addToTableCol($(table_block + '.add_col_text'), 1, table_block);
    }
}

function moveOnTableByEnter(event, $this) {
    if (event.which === 9) {
        event.preventDefault();
        let $table_edit = $this.parents('.table_edit');
        let $td_th = $table_edit.find('td, th');
        let count = $td_th.length;
        let next = false;
        let $prev = $this;
        $td_th.each(function (index) {
            if (count - 1 === index  + 1) {
                $prev.find("input").focusout();
            }
            if (next && $(this).hasClass('edit_cell')) {
                $(this).trigger('click');
                next = false;
                return;
            }
            if ($this.get(0) === $(this).get(0)) {
                next = true;
                $prev = $(this);
            }
        });
    }
}

function modeOnTableBySomeKey(event, $this, table_block) {
    if (event.which === 20) {
        let $index = 0;
        if ($this.parent().parent().html() === $(table_block + '.table_edit thead').find('tr').html()) {
            $this.addClass('temp_tab_input');
            $this.parent().parent().find('th').each(function (index) {
                if ($(this).find('.input_text').hasClass('temp_tab_input')) {
                    $index = index;
                }
            });
            $this.removeClass('temp_tab_input');
            //alert($index);
            let $next = $(table_block + '.table_edit tbody').find('tr').find('td').eq($index);
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


function colToReadOnly($number, $attr, table_block) {
    $(table_block + '.table_edit').find('tbody').children().each(function () {
        let $this_children = $(this).children().eq($number);
        $this_children.removeClass('edit_cell');//.addClass(class_name);
        $this_children.find('.input_text').remove();
        $this_children.find('div').attr($attr, true);
    });
    $(table_block + '.table_edit').find('thead').children().each(function () {
        let $this_children = $(this).children().eq($number);
        $this_children.removeClass('edit_cell');//.addClass(class_name);
        $this_children.find('.input_text').remove();
        $this_children.find('div').attr($attr, true);
    });
}

function cellToReadOnly(row, col, table_block) {
    //заголовок - 0 строка для пользователя
    let $tableCols;
    //важно помнить, что заголовок и тело таблицы находятся в разных тегах,
    //поэтому хотя и визуально 0-я строка идет после заголовка, она будет иметь 0-й индекс
    //а также, что пользователь вводит номер строки на 1 больше
    //нужно учитывать, что нулевой столбец занят номерами строк,
    //однако, учитывая, что пользователь вводит номер столбца на 1 больше, то это нивилируется
    if (row > 0) {
        row--;
        let $tr = $(table_block + '.table_made').find('tbody tr').each(function (index) {
            if (index === row) $tableCols = $(this).find("td");
        });
    } else {
        $tableCols = $(table_block + '.table_made').find("thead th");
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

function cellToEdit(row, col, table_block) {
    if (row > 0) {
        row--;
        let $tr = $(table_block + '.table_made').find('tbody tr').each(function (index) {
            if (index === row) $tableCols = $(this).find("td");
        });
    } else {
        $tableCols = $(table_block + '.table_made').find("thead th");
    }

    $tableCols.each(function (current_col) {
        if (current_col === col) {
            let $this = $(this);
            $this.addClass('edit_cell');
            let div = $this.find("div");
            if (div.attr("readonly")) {
                div.addClass("edit_cell_div")
                    .removeClass("edit_cell_readonly")
                    .removeAttr("readonly");
                let value = $this.find("div").text();
                $this.append("<input type='text' value='" + value + "\'>");
                $this.find("input")
                    .addClass("input_text")
                    .addClass("edit_cell_input_hide");
            }
        }
    })
}

function rowToReadOnly(row, table_block) {
    let $tr = $(table_block + '.table_made').find('tbody td').each(function (index) {
        if (index > 0) cellToReadOnly(row, index, table_block);
    });
}

function serializeTable(table_block) {
    let array_table = Array();
    let $table_made = $(table_block + '.table_made');
    let count_cols = $(table_block + '.table_edit tr').find('th').length;
    let count_rows = $table_made.find('tbody').find('tr').length;
    let temp = Array();
    for (let cols = 0; cols < count_cols; cols++) {
        temp.push($table_made.find('thead tr').children().eq(cols).find('div').text());
    }
    array_table.push(temp);
    for (let rows = 0; rows < count_rows - 1; rows++) {
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

function setRowsNumber(table_block) {
    let $tbody = $(table_block + "tbody");
    $tbody.find("tr").each(function (index) {
        if (index !== $tbody.find("tr").length - 1) {
            let $this = $(this);
            let $first_div = $this.find("td").first().find("div");
            //$first_div.text(index + 1);
            $first_div
                .addClass("firstCol")
                .attr("readonly", "readonly");
            let $td_first = $this.find("td").first();
            $td_first.find("input").remove();
            $td_first.css({
                "width": "33px"
            })
                .attr("readonly", "readonly")
                .removeClass("edit_cell");

            //кнопка редактировать строку
            let $secondCol_div = $this.find("td").eq(1).find("div");
            $secondCol_div
                .addClass("editCol")
                .attr("readonly", "readonly")
                .removeClass("edit_cell_div");
            let $secondCol_td = $this.find("td").eq(1);
            $secondCol_td.find("input").remove();
            $secondCol_td.css({
                "width": "33px"
            })
                .attr("readonly", "readonly")
                .removeClass("edit_cell");
        }
    })


    let $secondCol_div = $tbody.find(".editCol").last();
    $secondCol_div
        .addClass("toRoPenCol")
        .attr("readonly", "readonly")
        .removeClass("edit_cell_div");
    let $secondCol_td = $secondCol_div.parent();
    $secondCol_td.find("input").remove();
    $secondCol_td.css({
        "width": "33px"
    })
        .attr("readonly", "readonly")
        .removeClass("edit_cell");
}

function highlightCol(col, table_block) {
    let $table = $(table_block + ".table_made");
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

function highlightRow(row, table_block) {
    let $table = $(table_block + ".table_made");
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

function unhighlightRow(table_block) {
    let $table = $(table_block + ".table_made");
    $table.find("tbody tr").each(function (rows) {
        $(this).find("td").each(function (cols) {
            if ($(this).css("background-color") === "rgb(255, 247, 189)")
                $(this).css({
                    "background-color": "unset"
                })
        })
    })

}

function unhighlightCol(table_block) {
    let $table = $(table_block + ".table_made");
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
                if ($(this).css("background-color") === "rgb(255, 247, 189)")
                    $(this).css({
                        "background-color": "unset"
                    })
            }
        });
    });
}

function emptyCells() {

}

let spec_table_info = [
    {
        id: "component_1",
        position: 1,
        designation: "Обоз. дет. 1",
        name: "Деталь 1",
        number: 1
    },
    {
        id: "component_2",
        position: 2,
        designation: "Обоз. дет. 2",
        name: "Деталь 2",
        number: 1
    },
    {
        id: "component_3",
        position: 3,
        designation: "Обоз. дет. 3",
        name: "Деталь 3",
        number: 1
    },
    {
        id: "component_4",
        position: 4,
        designation: "Обоз. дет. 4",
        name: "Деталь 4",
        number: 1
    },
    {
        id: "std_component_1",
        position: 5,
        designation: "Обоз. стд. дет. 1",
        name: "Стд. деталь 1",
        number: 4
    },
    {
        id: "std_component_2",
        position: 6,
        designation: "Обоз. стд. дет. 2",
        name: "Стд. деталь 2",
        number: 4
    },
    {
        id: "std_component_3",
        position: 7,
        designation: "Обоз. стд. дет. 3",
        name: "Стд. деталь 3",
        number: 10
    }
]

function setTableByPdmAndStd(tableBlock) {
    let length = Number($(tableBlock).find("tbody tr").length);
    $(tableBlock).find("tbody").find("tr").each(function (number) {
        if ((number < (length - 1)) && length > 1) {
            $(this).remove();
        }
    });
    let array = collectDataLabels(".left-side");
    //console.log(array)

    array.forEach(function (component_id) {
        spec_table_info.forEach(function (comp_info) {
            if (comp_info.id === component_id) {
                addRowByData({
                    position: comp_info.position,
                    designation: comp_info.designation,
                    name: comp_info.name,
                    number: comp_info.number
                }, tableBlock);
            }
        })
    })
}

function addRowByData(data, tableBlock) {
    let position = data.position;
    let designation = data.designation;
    let name = data.name;
    let number = data.number;
    let tbody_lenght = Number($(tableBlock).find("table tr").length);
    $(".firstColPlus ").trigger("click");
    let str =  $(tableBlock).find("tbody tr").eq(tbody_lenght-2);
    let td = str.find("td");
    td.eq(2).find("div").text(tbody_lenght-1);
    td.eq(2).find("input").attr("value", tbody_lenght-1);
    td.eq(3).find("div").text(designation);
    td.eq(3).find("input").attr("value", designation);
    td.eq(4).find("div").text(name);
    td.eq(4).find("input").attr("value", name);
    td.eq(5).find("div").text(number);
    td.eq(5).find("input").attr("value", number);
}
