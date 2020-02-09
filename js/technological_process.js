function technologicalProcessInit() {
    /*//initTree("#techProcessBlock ")
    //init_tech_process();
    let toggler = document.getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    $("#myUL").find("span").first().trigger("click");*/

    let $table = $('#tech_process_table');

    //количество технологических процессов
    let countProcess = 2;


    let arrProcess = [10, 12, 12, 12];
    for (let i = 0; i < countProcess; i++)
        arrProcess.push(12);

    generateTableRow($table, arrProcess);

    $('#tech_process_table').droppable(
        {
            tolerance: "touch",
            drop: function (event, ui) {

                function setCells(obj) {
                    let text = obj.find(".operationNameField").text()
                    let instruments = [];
                    let equipment = [];
                    obj.find(".operationInstrumentList li span").each(function () {
                        instruments.push($(this).text())
                    });
                    instruments = instruments.join(", ");

                    obj.find(".operationEquipList li span").each(function () {
                        equipment.push($(this).text())
                    });
                    equipment = equipment.join(", ");

                    //console.log(text);
                    //console.log(instruments);
                    //console.log(equipment);

                    let tr = '<td><button class="tech_proc_del_td bg-white p-0 btn">' +
                        '<i class="fa fa-times"></i></button></td>';
                    let $lastTr = $table.find('tr:last');
                    for (let i = 1; i < 13; i++) {
                        tr += '<td colspan="' + $lastTr.find('td').eq(i).attr('colspan') + '"';
                        if (i === 1 || i === 5) {
                            tr += 'class="tdBorderBlackLeft techProcessCell">';
                        } else if (i === 3 || i === 12) {
                            tr += 'class="tdBorderBlackRight">';
                        } else {
                            tr += 'class="techProcessCell">';
                        }

                        if (i === 4) {
                            tr += text;
                        }
                        if (i === 5) {
                            tr += equipment;
                        }
                        if (i === 6) {
                            tr += instruments;
                        }
                        tr += '</td>';
                    }
                    $("<tr tech-lvl='" + $(obj).attr("tech-lvl") + "' tech-id='" + $(obj).attr("tech-id") + "'>" + tr + '</tr>').insertBefore($table.find('tr:last'));
                }

                if ($(ui.draggable).hasClass("techName")) {
                    console.log($(ui.draggable).attr("tech-lvl"));
                    if ($("#technological_process_field").find("tbody tr").length > 6)
                        $("<tr empty='empty'>" +
                            "<td><button class=\"tech_proc_del_td bg-white p-0 btn\"><i class=\"fa fa-times\"></i></button>" +
                            "</td><td colspan='4'" +
                            " class='tdBorderBlackLeft'></td><td colspan='3'></td><td colspan='4' class='tdBorderBlackRight'></td>" +
                            "<td colspan='34'></td><td colspan='12' class='tdBorderBlackLeft'></td><td colspan='12'></td>" +
                            "<td colspan='6'></td><td colspan='5'></td><td colspan='5'></td><td colspan='5'></td>" +
                            "<td colspan='5'></td><td colspan='5' class='tdBorderBlackRight'></td></tr>"
                        ).insertBefore($table.find('tr:last'));
                    let tr = '<td><button class="tech_proc_del_td bg-white p-0 btn">' +
                        '<i class="fa fa-times"></i></button></td>';
                    let $lastTr = $table.find('tr:last');
                    for (let i = 1; i < 13; i++) {
                        tr += '<td colspan="' + $lastTr.find('td').eq(i).attr('colspan') + '"';
                        if (i === 1 || i === 5) {
                            tr += 'class="tdBorderBlackLeft">';
                        } else if (i === 3 || i === 12) {
                            tr += 'class="tdBorderBlackRight">';
                        } else {
                            tr += 'class="techProcessCell">';
                        }
                        if (i === 4) {
                            tr += $(ui.draggable).find("span").first().text();
                        }

                        tr += '</td>';
                    }
                    $("<tr tech-lvl='" + $(ui.draggable).attr("tech-lvl") + "' tech-id='" + $(ui.draggable).attr("tech-id") + "'>" + tr + '</tr>').insertBefore($table.find('tr:last'));
                    $(ui.draggable).find(".operationName").each(function () {
                        setCells($(this))
                    });
                } else setCells($(ui.draggable));

                $table.on('click', '.tech_proc_del_td', function () {
                    $(this).parents('tr').remove();
                });
            }

        }
    );

    let $tbody_tr = $table.find('tbody tr');

    //генерируются надписи
    changeTableRow($tbody_tr.eq(0),
        [11, 34, 12, 12, 6, 5, 5, 5, 5, 5], $table, 100);
    changeTableRow($tbody_tr.eq(1),
        [4, 3, 4, 34, 12, 12, 6, 5, 5, 5, 5, 5], $table, 100);
    changeTableRow($tbody_tr.eq(2),
        [4, 3, 4, 34, 12, 12, 6, 5, 5, 5, 5, 5], $table, 100);
    changeTableRow($tbody_tr.eq(3),
        [4, 3, 4, 34, 12, 12, 6, 5, 5, 5, 5, 5], $table, 100);

    addRowspan(1, 0, $table, 4, [3, 3, 3, 3]);
    addRowspan(2, 0, $table, 4, [4, 4, 4, 4]);
    addRowspan(3, 0, $table, 4, [5, 5, 5, 5]);
    addRowspan(4, 0, $table, 2, [6]);
    addRowspan(5, 0, $table, 2, [7]);
    addRowspan(6, 0, $table, 2, [8]);
    addRowspan(7, 0, $table, 2, [9]);
    addRowspan(8, 0, $table, 4, [10, 10, 10]);
    addRowspan(9, 0, $table, 2, [11]);

    addRowspan(0, 1, $table, 3, [0, 0, 0]);
    addRowspan(1, 1, $table, 3, [1, 1, 1]);
    addRowspan(2, 1, $table, 3, [2, 2, 2]);

    addRowspan(0, 2, $table, 2, [0, 0, 0]);
    addRowspan(1, 2, $table, 2, [1, 1, 1]);
    addRowspan(2, 2, $table, 2, [2, 2, 2]);
    addRowspan(3, 2, $table, 2, [3, 3, 3]);
    addRowspan(4, 2, $table, 2, [4, 4, 4]);

    addText($table, ['Номер'], [[0, 0]], 'text-center');
    addText($table, ['Наименование<br> и содержание операции'],
        [[1, 0]], 'text-center td_fontSize18 p-3');
    addText($table, ['Оборудование <br>(код, наименование, инвентарный номер)'],
        [[2, 0]], 'text-center p-1');
    addText($table, ['Приспособление <br/> и <br/> инструмент<br/>(код, наименование)'],
        [[3, 0]], 'text-center p-1');
    addText($table, ['Коэфф.<br>шт. вр.'],
        [[4, 0]], 'text-center p-0 td_fontSize12 rotateText90');
    addText($table, ['Кол. раб.'],
        [[5, 0]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Кол. одн.<br>обраб. дет.'],
        [[6, 0]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Код тариф<br>сетки'],
        [[7, 0]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Объем производственной<br> партии'],
        [[8, 0]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Тп.З'],
        [[9, 0]], 'text-center p-0 td_fontSize12');

    addText($table, ['Цеха'],
        [[0, 1]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Участка'],
        [[1, 1]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');
    addText($table, ['Операции'],
        [[2, 1]], 'text-center pl-1 pr-1 td_fontSize12 rotateText90');

    addText($table, ['Код профессии'],
        [[0, 2]], 'text-center p-1 pt-2 td_fontSize12 rotateText90');
    addText($table, ['Разр. раб.'],
        [[1, 2]], 'text-center p-1 pt-2 td_fontSize12 rotateText90');
    addText($table, ['Ед. нормир.'],
        [[2, 2]], 'text-center p-1 pt-2 td_fontSize12 rotateText90');
    addText($table, ['Код вида нормы'],
        [[3, 2]], 'text-center p-1 pt-2 td_fontSize12 rotateText90');
    addText($table, ['Тшт'],
        [[4, 2]], 'text-center p-1 pt-2 td_fontSize12');


    for (let i = 0; i < countProcess; i++) {
        addStyleTd($table, [0, i + 4], 'tdBorderBlackLeft');
        addStyleTd($table, [2, i + 4], 'tdBorderBlackRight');
    }

    addStyleTd($table, [0, 4], 'tdBorderBlackTop');
    addStyleTd($table, [1, 4], 'tdBorderBlackTop');
    addStyleTd($table, [2, 4], 'tdBorderBlackTop');

    addStyleTd($table, [0, 5], 'tdBorderBlackBottom');
    addStyleTd($table, [1, 5], 'tdBorderBlackBottom');
    addStyleTd($table, [2, 5], 'tdBorderBlackBottom');

    for (let i = 0; i < countProcess; i++) {
        addStyleTd($table, [4, i + 4], 'tdBorderBlackLeft');
        addStyleTd($table, [11, i + 4], 'tdBorderBlackRight');
    }

    for (let i = 0; i < 8; i++) {
        addStyleTd($table, [4 + i, 4], 'tdBorderBlackTop');
        addStyleTd($table, [4 + i, 5], 'tdBorderBlackBottom');
    }


    for (let i = 0; i < countProcess; i++) {
        changeTableRow($tbody_tr.eq(i + 4),
            [4, 3, 4, 34, 12, 12, 6, 5, 5, 5, 5, 5], $table, 100);
    }

    $table.find('tr').each(function (index) {
        if (index > 0 && index < 3)
            return;
        $(this).find('td:first').before(`<td ${index === 0 ?
            'rowspan="3"' : ''}>${index > 4 && index + 1 !== $table.find('tr').length ? '' +
            '<button class="tech_proc_del_td bg-white p-0 btn"><i class="fa fa-times"></i></button>' : ''}</td>`);
    });
    $table.find('td:first').addClass('rotateText90').html('<div>Удалить</div>');


    $('#tech_process_save').on('click', function () {
        saveTechProcessTable($table);
    });

    $.ajax({
        url: 'ajax/get_work_place_tech_process',
        type: 'GET',
        success: function (res) {
            setTechProcessJson(techGuideJson, res, $table);
        }
    })
}

function addStyleTd($table, coords, style) {
    $table.find('tr').eq(coords[1]).children().eq(coords[0]).addClass(style);
}

function saveTechProcessTable($table) {
    let saveObj = [];
    $table.find('tr').each(function () {
        let attrLvl = $(this).attr('tech-lvl');
        if (attrLvl === undefined) {
            if ($(this).attr('empty') !== undefined) {
                saveObj.push({empty: true});
                return;
            } else return;
        }
        saveObj.push({lvl: attrLvl, id: $(this).attr('tech-id')});
    });
    console.log(saveObj);
    $.ajax({
        url: 'ajax/save_work_place_tech_process',
        type: 'POST',
        data: {save: saveObj},
        success: function (res) {
            console.log(res);
        }
    })
}

function setTechProcessJson(json, res, $table) {
    let $lastTr = $table.find('tr:last');
    for (let lvl in res) {
        let level = res[lvl].lvl;
        let idProc = res[lvl].id;
        //console.log(`${level} ${idProc}`);
        let proc = findProcInJson(json, level, idProc);
        let attr = '';
        if (proc !== undefined) {
            attr += `tech-lvl="${level}" tech-id="${idProc}"`;
        } else {
            attr += 'empty="empty"'
        }
        $(`<tr ${attr}>` + madeTr(proc, $lastTr) + '</tr>').insertBefore($lastTr);

        $table.on('click', '.tech_proc_del_td', function () {
            $(this).parents('tr').remove();
        });
    }
}

function findProcInJson(json, lvl, id) {
    for (let proc in json) {
        if (json[proc].id === id && json[proc].lvl === lvl) {
            return {name: json[proc].name};

        } else {
            for (let child in json[proc]['children']) {
                //console.log(json[proc]['children'][child]);
                if (json[proc]['children'][child].lvl === lvl && json[proc]['children'][child].id === id) {
                    //console.log('right ' + json[proc]['children'][child].lvl + ' ' + json[proc]['children'][child].id);
                    let tools = [];
                    for (let tool in json[proc]['children'][child].tools) {
                        tools.push(json[proc]['children'][child].tools[tool].name);
                    }

                    let equips = [];
                    for (let equip in json[proc]['children'][child].equipment) {
                        equips.push(json[proc]['children'][child].equipment[equip].name);
                    }

                    return {
                        name: json[proc]['children'][child].name,
                        tools: tools.join(','),
                        equipment: equips.join(',')
                    }
                }
            }
        }
    }
}

function madeTr(vals, $lastTr) {
    let tr = '<td><button class="tech_proc_del_td bg-white p-0 btn">' +
        '<i class="fa fa-times"></i></button></td>';
    if (vals === undefined) {
        vals = {name: undefined, tools: undefined, equipment: undefined};
    }
    for (let i = 1; i < 13; i++) {
        tr += '<td colspan="' + $lastTr.find('td').eq(i).attr('colspan') + '"';
        if (i === 1) {
            tr += 'class="tdBorderBlackLeft">';
        } else if (i === 3) {
            tr += 'class="tdBorderBlackRight">';
        } else if (i === 4 && vals.name !== undefined) {
            tr += 'class="techProcessCell">' + vals.name;
        } else if (i === 5) {
            tr += 'class="tdBorderBlackLeft techProcessCell"';
            if (vals.equipment !== undefined)
                tr += '>' + vals.equipment;
        } else if (i === 6 && vals.tools !== undefined) {
            tr += 'class="techProcessCell">' + vals.tools;
        } else if (i === 12) {
            tr += 'class="tdBorderBlackRight">';
        } else {
            tr += 'class="techProcessCell">';
        }

        tr += '</td>';
    }

    return tr;
}

/*function init_tech_process() {
    /!* $('#esi_field').append('<button id=\'techProcessBlock_field_btn\' class="btn btn-custom btn-block">' +
         'Обновить данные</button>');*!/
    $('#techProcessBlock_field').find('#techProcessBlock_field_btn').data({'init': 0});

    $('#techProcessBlock_field').on('click', '#techProcessBlock_field_btn', function () {
        $('#techProcessBlock_field').find('.esi_branches_div').children().remove();
        InitBranches_tech_process();
        initBranchesInside_tech_process();
        toggleEsiBranchContent_tech_process();
        hideBranchContent_tech_process();
        $('#techProcessBlock_field').find('.esi_branches .esi_branch_switcher').eq(0).click();


        if ($('#techProcessBlock_field').find('#techProcessBlock_field_btn').data('init') === 0) {
            //
            $('#techProcessBlock_field_btn').data({'init': 1});
        }


        //getInfoFromSpecTable(1, 2);
    });

   /!* $('.slider_button').on('click', function () {
        STDLibClick($('.slider_button'), $('.slider_main'));
    });

    $('#shell').on('click', function () {
        if($('.slider_main').attr('style') === 'z-index: 999; right: 0px;')
        {
            $('.slider_button').trigger('click');
        }
    });*!/
}

function InitBranches_tech_process() {
    addBranches_tech_process(1);
}

function initBranchesInside_tech_process() {

    //let info = serializeTable('#specificationBlock ');
    let info = [
        ["1-1", "1-2", "Вложеность1-1", "Название"],
        ["2-1", "2-2", "Зн вл 1-1", "Изделие 1"],
        ["3-1", "3-2", "Вложеность1-2", "Изделие 2"],
        ["4-1", "4-2", "Зн вл 1-2", "Изделие 3"],
    ]
    console.log(info)
    let countRows = info.length;
    let countCols = info[0].length;
    let zeroCol = 0;
    for (let i = 1; i < countRows; i++) {
        console.log(info[i][3]);
        if (i % 2 === 0)
            addBranch_tech_process(1, [[0]], 'esi_cont_inside1',
                'esi_header_alt1', [info[i][3], '']);
        else addBranch_tech_process(1, [[0]], 'esi_cont_inside1', '',
            [info[i][3], '']);
    }
    $('#techProcessBlock_field').find('.esi_branches').find('.esi_branch')
        .find('.esi_branches').children().each(function (index) {
        $(this).find('.esi_branch_content').append('<div class="esi_branches"></div>');
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch_tech_process(
            [info[0][2], info[index + 1][2]]));
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch_tech_process(
            [info[0][4], info[index + 1][4]]));
        /!*$(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][1],info[index + 1][1] ]));*!/
    });
}

function addBranches_tech_process(count) {
    let $esi_branches = $('#techProcessBlock_field').find('.esi_branches_div');
    let $branches = madeBranches_tech_process(count);

    $esi_branches.append($branches);
}

function madeBranches_tech_process(count) {
    let $branches = '<div class="esi_branches">';
    for (let i = 0; i < count; i++) {
        $branches += madeBranch_tech_process();
    }
    $branches += '</div>';
    return $branches;
}

function toggleEsiBranchContent_tech_process() {

    $('.esi_branch_switcher').on('click', function () {
        let $this = $(this);
        $this.parent().parent().find('.esi_branch_content_row').eq(0).slideToggle(300);
        let $this_i = $this.find('i');
        if ($this_i.hasClass('esi_branch_switcher_plus')) {
            $this_i.removeClass('esi_branch_switcher_plus')
                .addClass('esi_branch_switcher_minus');
            $this_i.removeClass('fa-plus').addClass(' fa-minus');
        } else {
            $this_i.removeClass('esi_branch_switcher_minus')
                .addClass('esi_branch_switcher_plus');
            $this_i.removeClass('fa-minus').addClass(' fa-plus');
        }
    })
}

function hideBranchContent_tech_process() {
    $('#techProcessBlock_field').find('.esi_branch').each(function () {
        $(this).find('.esi_branch_content_row')
            .each(function () {
                $(this).attr('style', 'display: none');
            });
    })
}

function madeBranch_tech_process(info = ['Техпроцесс', ''], classNameHeader = '', classNameCont = '') {
    let $branch = '';
    $branch = '<div class="esi_branch">' +
        '<div class="esi_branch_sh">' +
        '<div class="esi_branch_switcher"><i class="fa fa-plus esi_branch_switcher_plus text-secondary">' +
        '</i></div>' +
        '<div class="esi_branch_header ' + classNameHeader + '">' + info[0] + '</div>' +
        '</div>' +
        '<div class="esi_branch_content_row">' +
        '<div class="esi_branch_content_noNiv"></div>' +
        '<div class="esi_branch_content ' + classNameCont + '">' +
        info[1] +
        '</div>' +
        '</div>' +
        '</div>';
    return $branch;
}


//params: [[a0] ,[a1, b1], [a2, b2], ...]  a0 - индекс главной ветви,
// aN - из какой ветви, bN - в какую
function addBranch_tech_process(depth, params, classNameCont, classNameHeader, info) {
    let $branch = $('#techProcessBlock_field').find('.esi_branches:first')
        .children().eq(params[0][0])
        .find('.esi_branch_content').eq(0);
    let $depth = $branch;
    for (let i = 1; i < depth; i++) {
        $depth = $branch.find('.esi_branches').children().eq(params[i][0])
            .find('.esi_branch_content').eq(0);
        if (i + 1 === depth)
            params[i][1] = 0;
        $branch = $branch.find('.esi_branches').children().eq(params[i][1]);
    }
    if (!$depth.children().hasClass('esi_branches')) {
        $depth.append('<div class="esi_branches"></div>');
    }
    $depth.find('.esi_branches').append(madeBranch_tech_process(info, classNameHeader, classNameCont));
}*/


//ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

/*
function initTree(treeBlock) {
    /!* $('#esi_field').append('<button id=\'esi_branch_btn\' class="btn btn-custom btn-block">' +
         'Обновить данные</button>');*!/
    $(treeBlock + ' .treeField').find('.tree_branch_btn').data({'init': 0});
    $(treeBlock + ' .treeField').on('click', '.tree_branch_btn', function () {
        $(treeBlock + ' .treeField').find('.esi_branches_div').children().remove();
        InitTreeBranches(treeBlock);
        initTreeBranchesInside(treeBlock);
        toggleTreeBranchContent(treeBlock);
        hideTreeBranchContent(treeBlock);
        $(treeBlock + ' .treeField').find('.esi_branches .esi_branch_switcher').eq(0).click();


        if ($(treeBlock + ' .treeField').find('.tree_branch_btn').data('init') === 0) {
            //
            $(treeBlock + ' .tree_branch_btn').data({'init': 1});
        }


        //getInfoFromSpecTable(1, 2);
    });

    /!*$(treeBlock + '.slider_button').on('click', function () {
        STDLibClick($(treeBlock + '.slider_button'), $(treeBlock + '.slider_main'));
    });

    $('#shell').on('click', function () {
        if($('.slider_main').attr('style') === 'z-index: 999; right: 0px;')
        {
            $('.slider_button').trigger('click');
        }
    });*!/
}

function InitTreeBranches(treeBlock) {
    addTreeBranches(1, treeBlock);
}

function initTreeBranchesInside(treeBlock) {

    let info = serializeTable('#specificationBlock ');
    let countRows = info.length;
    let countCols = info[0].length;
    for (let i = 1; i < countRows; i++) {
        console.log(info[i][3]);
        if (i % 2 === 0)
            addTreeBranch(1, [[0]], 'esi_cont_inside1',
                'esi_header_alt1', [info[i][3], ''], treeBlock);
        else addTreeBranch(1, [[0]], 'esi_cont_inside1', '',
            [info[i][3], ''], treeBlock);
    }
    $(treeBlock + ' .treeField').find('.esi_branches').find('.esi_branch')
        .find('.esi_branches').children().each(function (index) {
        $(this).find('.esi_branch_content').append('<div class="esi_branches"></div>');
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeTreeBranch(
            [info[0][2], info[index + 1][2]]), treeBlock);
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeTreeBranch(
            [info[0][4], info[index + 1][4]]), treeBlock);
        /!*$(this).find('.esi_branch_content').find('.esi_branches').append(madeTreeBranch(
            [info[0][1],info[index + 1][1] ]));*!/
    });
}

function addTreeBranches(count, treeBlock) {
    let $esi_branches = $(treeBlock + ' .treeField').find('.esi_branches_div');
    let $branches = madeTreeBranches(count, treeBlock);

    $esi_branches.append($branches);
}

function madeTreeBranches(count, treeBlock) {
    let $branches = '<div class="esi_branches">';
    for (let i = 0; i < count; i++) {
        $branches += madeTreeBranch(treeBlock);
    }
    $branches += '</div>';
    return $branches;
}

function toggleTreeBranchContent(treeBlock) {
    $(treeBlock + ' .esi_branch_switcher').on('click', function () {
        let $this = $(this);
        $this.parent().parent().find('.esi_branch_content_row').eq(0).slideToggle(300);
        let $this_i = $this.find('i');
        if ($this_i.hasClass('esi_branch_switcher_plus')) {
            $this_i.removeClass('esi_branch_switcher_plus')
                .addClass('esi_branch_switcher_minus');
            $this_i.removeClass('fa-plus').addClass(' fa-minus');
        } else {
            $this_i.removeClass('esi_branch_switcher_minus')
                .addClass('esi_branch_switcher_plus');
            $this_i.removeClass('fa-minus').addClass(' fa-plus');
        }
    })
}

function hideTreeBranchContent(treeBlock) {
    $(treeBlock + ' .treeField').find('.esi_branch').each(function () {
        $(this).find('.esi_branch_content_row')
            .each(function () {
                $(this).attr('style', 'display: none');
            });
    })
}

function madeTreeBranch(info = ['Модель', ''], classNameHeader = '', classNameCont = '', treeBlock) {
    let $branch = '';
    $branch = '<div class="esi_branch">' +
        '<div class="esi_branch_sh">' +
        '<div class="esi_branch_switcher"><i class="fa fa-plus esi_branch_switcher_plus text-secondary">' +
        '</i></div>' +
        '<div class="esi_branch_header ' + classNameHeader + '">' + info[0] + '</div>' +
        '</div>' +
        '<div class="esi_branch_content_row">' +
        '<div class="esi_branch_content_noNiv"></div>' +
        '<div class="esi_branch_content ' + classNameCont + '">' +
        info[1] +
        '</div>' +
        '</div>' +
        '</div>';
    return $branch;
}


//params: [[a0] ,[a1, b1], [a2, b2], ...]  a0 - индекс главной ветви,
// aN - из какой ветви, bN - в какую
function addTreeBranch(depth, params, classNameCont, classNameHeader, info, treeBlock) {
    let $branch = $(treeBlock + ' .treeField').find('.esi_branches:first')
        .children().eq(params[0][0])
        .find('.esi_branch_content').eq(0);
    let $depth = $branch;
    for (let i = 1; i < depth; i++) {
        $depth = $branch.find('.esi_branches').children().eq(params[i][0])
            .find('.esi_branch_content').eq(0);
        if (i + 1 === depth)
            params[i][1] = 0;
        $branch = $branch.find('.esi_branches').children().eq(params[i][1]);
    }
    if (!$depth.children().hasClass('esi_branches')) {
        $depth.append('<div class="esi_branches"></div>');
    }
    $depth.find('.esi_branches').append(madeTreeBranch(info, classNameHeader, classNameCont, treeBlock));
}

/!*function addContent($esi_branch, content, treeBlock) {
    $esi_branch.find('.esi_branch_content').append(content);
}*!/


/!*
function STDLibClick($but, $main) {
    let css_left = -$main.width() + $but.width() + 'px';
    let css_right = '0px';
    if ($main.attr('style') !== ('z-index: 999; right: ' + css_right + ';')) {
        $main.animate({
                right: css_right
            },
            300, 'linear'
        );
        $main.removeAttr('style');
        $main.attr('style','z-index: 999');
    } else {
        $main.animate({
                right: css_left
            },
            300, 'linear'
        );
        $main.attr('style','z-index: 15');
    }
}
*!/
*/
