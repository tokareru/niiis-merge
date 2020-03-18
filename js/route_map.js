/*
function initRouteMap() {
    //getJsonByURL("json/route_map.json", generateTable,
    //    {table_block : "#routeMapBlock", edit_mode_div: "#routeMap_edit", url: "", save_url:""});
}
*/

function initRouteMap() {
    let tech_process_field_drop = $("#tech_process_field_drop");
    let tech_process_table = $("#tech_process_table");
    $("#tabs li[aria-controls='route_map_field']").on("click", function () {
        $("#tech_process_field_drop").removeClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("disable");
        $("#tech_process_table").addClass("tech_process_table");
        //$("#tech_process_table").droppable("enable");
    });
    tech_process_field_drop.removeClass("tech_process_table");
    tech_process_table.addClass("tech_process_table");

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
                    let text = obj.find(".operationNameField").text();
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
                    //console.log($(ui.draggable).attr("tech-lvl"));

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
                    let techName = $(ui.draggable).find("span").first().text();
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
                            tr += techName;
                        }

                        tr += '</td>';
                    }
                    $("<tr tech-lvl='" + $(ui.draggable).attr("tech-lvl") + "' tech-id='" + $(ui.draggable).attr("tech-id") + "'>" + tr + '</tr>').insertBefore($table.find('tr:last'));
                    $(ui.draggable).find(".operationName").each(function () {
                        setCells($(this))
                    });

                    setActionToBar({
                        id: "addTechNameToTechProcess",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлен узел '${techName}'`
                    });

                } else {
                    setCells($(ui.draggable));

                    setActionToBar({
                        id: "addOperationNameToTechProcess",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлена операция '${$(ui.draggable).find(".operationNameField").text()}'`
                    });
                }

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

    // кнопка "добавить новую строку"
    if (Round !== 3){
        let addNewRowButton = $("#tech_process_table").find("tbody tr").last().find("td").first();
        addNewRowButton.append("<span class='route_map_new_row_button'></span>");
        addNewRowButton.find("span").click(function () {
            $("#tech_process_table").find("tbody tr").last().before(
                '<tr>' +
                '<td><button class="tech_proc_del_td bg-white p-0 btn">' +
                '<i class="fa fa-times"></i></button></td><td colspan="4" class="tdBorderBlackLeft">' +
                '</td>' +
                '<td colspan="3" class="techProcessCell"></td>' +
                '<td colspan="4" class="tdBorderBlackRight"></td>' +
                '<td colspan="34" class="techProcessCell"><input class="input-group-sm routeMapInputName routeMapInput"></td>' +
                '<td colspan="12" class="tdBorderBlackLeft techProcessCell"><input class="input-group-sm routeMapInputEquip routeMapInput"></td>' +
                '<td colspan="12" class="techProcessCell"><input class="input-group-sm routeMapInputTool routeMapInput"></td>' +
                '<td colspan="6" class="techProcessCell"></td>' +
                '<td colspan="5" class="techProcessCell"></td>' +
                '<td colspan="5" class="techProcessCell"></td>' +
                '<td colspan="5" class="techProcessCell"></td>' +
                '<td colspan="5" class="techProcessCell"></td>' +
                '<td colspan="5" class="tdBorderBlackRight"></td>' +
                '</tr>'
            )
        });
    }


    if (Round === 3){
        if (Role !== "technologist"){
            $.ajax({
                url: 'ajax/get_technologist_info',
                type: 'GET',
                success: function (techJson) {
                    techGuideJson = techJson;
                    $.ajax({
                        url: 'ajax/get_work_place_tech_process',
                        type: 'GET',
                        success: function (res) {
                            setTechProcessJson(techGuideJson, res, $table);
                        }
                    })
                }
            })
        }else {
            $.ajax({
                url: 'ajax/get_work_place_tech_process',
                type: 'GET',
                success: function (res) {
                    setTechProcessJson(techGuideJson, res, $table);
                }
            })
        }
    }else {
        $table.on('click', '.tech_proc_del_td', function () {
            let $this = $(this);
            let name = $this.parent().parent().find("td").eq(4).text();
            $this.parents('tr').remove();
            setActionToBar({
                id: "deleteNodeFromRouteMap",
                type: "delete",
                field: "Маршрутная карта",
                text: `Из 'Маршрутной карты' удалён узел '${name}'`
            });
        });
        $("#tech_process_table").find("tbody tr").last().find("td span").first().trigger("click");
    }
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

            setActionToBar({
                id: "saveRouteMapTable",
                type: "save",
                field: "Маршрутная карта",
                text: `Сохранение маршрутной карты'`
            });

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
    }

    $table.on('click', '.tech_proc_del_td', function () {
        let $this = $(this);
        let name = $this.parent().parent().find("td").eq(4).text();
        $this.parents('tr').remove();
        setActionToBar({
            id: "deleteNodeFromRouteMap",
            type: "delete",
            field: "Маршрутная карта",
            text: `Из 'Маршрутной карты' удалён узел '${name}'`
        });
    });
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
