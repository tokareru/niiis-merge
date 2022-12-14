/*
function initRouteMap() {
    //getJsonByURL("json/route_map.json", generateTable,
    //    {table_block : "#routeMapBlock", edit_mode_div: "#routeMap_edit", url: "", save_url:""});
}
*/

function initRouteMap() {
    let tech_process_field_drop = $("#tech_process_field_drop");

    $("#tech_process_field_drop").removeClass("tech_process_table");
    let tech_process_table = $("#tech_process_table");

    $("#tech_process_table").addClass("tech_process_table")
    $("#tabs li[aria-controls='route_map_field']").on("click", function () {
        $("#tech_process_field_drop").removeClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("disable");
        $("#tech_process_table").addClass("tech_process_table")
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

    const addMainTitle = (relativeWidths, width, $tr)=>{
        function calcWidth(setting) {
            return width * setting / 100;
        }

        relativeWidths.forEach((res)=>{
            const td = $(`<td colspan="${res.col}" rowspan="${res.rowspan!==undefined? res.rowspan: 1}" style="width:`+
            `${calcWidth(res.col)}px; max-width: ${calcWidth(res.col)}px"></td>`);
            td.text(res.data);
            td.addClass(res.styles);
            $tr.append(td)
        });
    };

    const widthTemp = $table.width();
    const relativeWidthsMainTitle1 = [
        {col: 10, data: '', rowspan: 2},
        {col: 40, data: 'Маршрутная карта', styles: 'p-2 text-center font-size-12-em', rowspan: 2},
        {col: 25, data: `${getDetailsInfo("prim")[0].designation}`, styles: 'p-2 text-center font-size-12-em'},
        {col: 25, data: ''}];

    $($table).find('tbody').prepend('<tr></tr>');
    $($table).find('tbody').prepend('<tr></tr>');
    const mainTitleTr = $($table).find('tbody').find('tr:first');

    const relativeWidthsMainTitle2 = [
        {col: 25, data: `${getDetailsInfo("prim")[0].name}`, styles: 'p-2 text-center font-size-12-em'},
        {col: 5, data: 'Литера', styles: 'text-center'},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        {col: 2, data: ''},
        ];
    //console.log(getDetailsInfo("prim")[0]);
    const mainTitleTr2 =$($table).find('tbody').find('tr').eq(1);

    addMainTitle(relativeWidthsMainTitle1, widthTemp, mainTitleTr);
    addMainTitle(relativeWidthsMainTitle2, widthTemp, mainTitleTr2);



    $($table).find('tbody').append('<tr class="notDeleteButtonRM"></tr>');

   const mainTitleDownTr1 =$($table).find('tbody').find('tr:last');
    const mainTitleDown1 = [
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 7, data: 'Разраб.', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 6, data: 'Лист', styles: 'height-20 p-0 text-center'},
    ];
    const mainTitleDown11 = [
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 7, data: 'Пров.', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '1', styles: 'height-20 p-0', rowspan: 2, styles: 'text-center font-size-12-em text-center'},
    ];
    const mainTitleDown12 = [
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 7, data: 'Нормир.', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
    ];
    const mainTitleDown13 = [
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 9, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
        {col: 4, data: '', styles: 'height-20 p-0'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 7, data: 'Утвердил', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
    ];
    addMainTitle(mainTitleDown1, widthTemp, $($table).find('tbody').find('tr:last'));
    $($table).find('tbody').append('<tr class="notDeleteButtonRM"></tr>');
    addMainTitle(mainTitleDown11, widthTemp, $($table).find('tbody').find('tr:last'));
    $($table).find('tbody').append('<tr class="notDeleteButtonRM"></tr>');
    addMainTitle(mainTitleDown12, widthTemp, $($table).find('tbody').find('tr:last'));
    $($table).find('tbody').append('<tr class="notDeleteButtonRM"></tr>');
    addMainTitle(mainTitleDown13, widthTemp, $($table).find('tbody').find('tr:last'));
    $($table).find('tbody').append('<tr class="notDeleteButtonRM"></tr>');
    const mainTitleDown2 = [
        {col: 4, data: 'Изм.', styles: 'height-20 p-0 text-center'},
        {col: 4, data: 'Лист', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '№ докум.', styles: 'height-20 p-0 text-center'},
        {col: 9, data: 'Подпись', styles: 'height-20 p-0 text-center'},
        {col: 9, data: 'Дата', styles: 'height-20 p-0 text-center'},
        {col: 9, data: 'Изм.', styles: 'height-20 p-0 text-center'},
        {col: 4, data: 'Лист', styles: 'height-20 p-0 text-center'},
        {col: 6, data: '№ докум.', styles: 'height-20 p-0 text-center'},
        {col: 4, data: 'Подпись', styles: 'height-20 p-0 text-center'},
        {col: 5, data: 'Дата', styles: 'height-20 p-0 text-center'},
        {col: 7, data: 'Н.Контр.', styles: 'height-20 p-0 text-center'},
        {col: 5, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 12, data: '', styles: 'height-20 p-0'},
        {col: 6, data: '', styles: 'height-20 p-0'},
    ];
    addMainTitle(mainTitleDown2, widthTemp, $($table).find('tbody').find('tr:last'));

    $($table).find('tbody').find('tr').eq(7).addClass('startPointData');

    // добавить кнопку удаления
    $table.find('tr:not(.notDeleteButtonRM)').each(function (index) {
        let delButton = (Role === "technologist") ? `tech_proc_del_td`: "";
        let delI = (Role === "technologist") ? "fa fa-times" : "";
        if (index > 0 && index < 3)
            return;
        $(this).find('td:first').before(`<td ${index === 0 ?
            'rowspan="3"' : ''}>${index > 7 && index + 1 !== $table.find('tr').length ? '' +
            '<button class="' + delButton + ' bg-white p-0 btn"><i class="' + delI + '"></i></button>' : ''}</td>`);
    });
    $table.find('td:first').addClass('rotateText90').html('<div>Удалить</div>');

    let saveButton = $('#tech_process_save');
    let reloadButton = $("#tech_process_reload")
    if (Role === "technologist") {
        saveButton.show().on('click', function () {
            if (Round === 3) saveTechProcessTableRound3($table, this);
            else saveTechProcessTableRound_1_2($table, this);
        });
    }
    else {
        saveButton.remove();
        reloadButton.addClass("ml-auto")
    }

    // кнопка "добавить новую строку"
    if (Role === "technologist"){
        let addNewRowButton = $("#tech_process_table").find("tbody .startPointData").find("td").first();
        addNewRowButton.append("<span class='route_map_new_row_button'></span>");
        addNewRowButton.find("span").click(function () {
            if (Round === 3) setRouteMapRow();
            else {
                setTechProcessJsonRounds_1_2( [{}], $table)
            }
            setActionToBar({
                id: "addTechRow",
                type: "addNew",
                field: "Маршрутная карта",
                text: `В 'Маршрутную карту' добавлена новая строка`
            });
        });
    }

    reloadButton.on("click", function () {
        let thisButton = this;
        startProcessOfSaving(this);
        $(".newRouteMapRow").remove();
        downloadRouteMap().then(function () {
            stopProcessOfSaving(thisButton);
        });
    });

    tech_process_table.on("routeMapRefresh", function () {
        let thisButton = document.getElementById("tech_process_reload");
        startProcessOfSaving(thisButton)
        $(".newRouteMapRow").remove();
        downloadRouteMap().then(function () {
            stopProcessOfSaving(thisButton);
        });
    })

    // инициализация
    downloadRouteMap().then();

    $table.on('click', '.tech_proc_del_td', function () {
        let $this = $(this);
        let name;
        if (Round === 3)
            name = $this.parent().parent().find("td").eq(4).text();
        else name = $this.parent().parent().find("td").eq(4).find("input").val();
        let text = (name === "") ? `Из 'Маршрутной карты' удалён узел` : `Из 'Маршрутной карты' удалён узел '${name}'`;
        $this.parents('tr').remove();
        setActionToBar({
            id: "deleteNodeFromRouteMap",
            type: "delete",
            field: "Маршрутная карта",
            text: text
        });
    });

    //$("#tech_process_table").find("tbody tr").last().find("td span").first().trigger("click");

    $table.on("click", ".deleteNodeButtonRM", function () {
        let $this = $(this);
        let $td = $this.parent().parent();
        if ($td.hasClass("techProcessCell")){
            deleteKnot($this, true);
            $td.append(`
                <div style="height: 100%;" tech-lvl="0" tech-id="0"></div>
            `)
        }else {
            deleteKnot($this, true);
        }
    })

    $("#routeMapPrintButton").unbind("click").on("click", function () {
        setActionToBar({
            id: "sendToPrintRouteMap",
            type: "print",
            field: "Маршрутная карта",
            text: "Маршрутная карта отправлена на печать"
        }).then(function () {
            let win = window.open(`print_report/route_map`, '_blank');
            win.focus();
            triggerToDoTaskEvent("sendToPrintRouteMap");
        })
    })
}

async function downloadRouteMap() {
    let $table = $('#tech_process_table');
    if (Round === 3){
        if (Role !== "technologist"){
            $.ajax({
                url: techGuideURL,
                type: 'GET',
                success: function (techJson) {
                    techGuideJson = techJson;
                    $.ajax({
                        url: 'ajax/get_route_map_3',
                        type: 'GET',
                        success: function (res) {
                            setTechProcessJson(techGuideJson, res, $table);
                        }
                    })
                }
            })
        }else {
            // ajax/get_work_place_tech_process
            $.ajax({
                url: 'ajax/get_route_map_3 ',
                type: 'GET',
                success: function (res) {
                    loadRouteMap = res;
                    setTechProcessJson(techGuideJson, res, $table);
                }
            })
        }
    }else {
        // инициализация на 1,2 раундах
        // ajax/get_work_place_tech_process
        $.ajax({
            url: 'ajax/get_route_map_1_2',
            type: 'GET',
            success: function (res) {
                loadRouteMap = res;
                setTechProcessJsonRounds_1_2(res, $table);
            }
        })
    }
}

function addStyleTd($table, coords, style) {
    $table.find('tr').eq(coords[1]).children().eq(coords[0]).addClass(style);
}

function collectDataFormRouteMapRound_1_2($table) {
    let saveObj = [];
    let $trs = $table.find('tr.newRouteMapRow');
    $trs.each(function () {
        let $tr = $(this);
        let num_ceh = $tr.find("td").eq(1).find("input").val();
        let num_uch = $tr.find("td").eq(2).find("input").val();
        let num_oper = $tr.find("td").eq(3).find("input").val();
        let name = $tr.find("td").eq(4).find("input").val();
        let eq = $tr.find("td").eq(5).find("input").val();
        let tools = $tr.find("td").eq(6).find("input").val();

        saveObj.push({
            name: name,
            equipment: eq,
            tools: tools,
            num_ceh: num_ceh,
            num_uch: num_uch,
            num_oper: num_oper,
        })
    });
    return saveObj;
}

function saveTechProcessTableRound_1_2($table, thisButton) {
    let saveObj = collectDataFormRouteMapRound_1_2($table);

    console.log(saveObj);
    startProcessOfSaving(thisButton, false);
    $.ajax({
        url: 'ajax/save_route_map_1_2',
        type: 'POST',
        data: {data:saveObj},
        success: function (res) {
            console.log(res);
            stopProcessOfSaving(thisButton, false);
            setActionToBar({
                id: "saveRouteMapTable",
                type: "save",
                field: "Маршрутная карта",
                text: `Сохранение маршрутной карты'`
            });
            triggerToDoTaskEvent("saveRouteMap");

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
    })

}

function collectDataFromRouteMapRound3($table) {
let saveObj = [];
    let $trs = $table.find('tr.newRouteMapRow');
    if ($trs.length){
        $trs.each(function () {
            let $tr = $(this);
            let row = {
                name: {
                    "id": "0",
                    "lvl": "0",
                    "text": ""
                },
                equipment: [],
                tools: []
            };

            // находим название
            let $name = $tr.find("td").eq(4).find("div");
            let nameId = $name.first().attr("tech-id");
            let nameLvl = $name.first().attr("tech-lvl");
            row.name.lvl = nameLvl;
            row.name.id = nameId;
            row.name.text = $name.find("span").first().text();
            //console.log(name, nameId, nameLvl)

            // находим оборудование
            let $eq = $tr.find("td").eq(5).find("ul");
            let equipment = [];
            let $eqLi = $eq.find("li");
            if ($eqLi.length){
                $eqLi.each(function () {
                    let $this = $(this);
                    equipment.push({
                        id: $this.attr("tech-id"),
                        lvl: $this.attr("tech-lvl"),
                        text: $this.find("span").first().text()
                    })
                })
            }
            row.equipment = equipment;
            //console.log(equipment);

            // находим инструменты
            let $tool = $tr.find("td").eq(6).find("ul");
            let tools = [];
            let $toolsLi = $tool.find("li");
            if ($toolsLi.length){
                $toolsLi.each(function () {
                    let $this = $(this);
                    tools.push({
                        id: $this.attr("tech-id"),
                        lvl: $this.attr("tech-lvl"),
                        text: $this.find("span").first().text()
                    })
                })
            }
            row.tools = tools;
            //console.log(tools);
            saveObj.push(row);

        });
    }
    return saveObj;
}

function saveTechProcessTableRound3($table, thisButton) {
    let saveObj = collectDataFromRouteMapRound3($table);

    console.log(saveObj);
    startProcessOfSaving(thisButton, false)
    $.ajax({
        url: 'ajax/save_route_map_3',
        type: 'POST',
        data: {data: saveObj},
        success: function (res) {
            console.log(res);
            stopProcessOfSaving(thisButton, false)
            setActionToBar({
                id: "saveRouteMapTable",
                type: "save",
                field: "Маршрутная карта",
                text: `Сохранение маршрутной карты'`
            });
            triggerToDoTaskEvent("saveRouteMap");

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
    })
}

function setRouteMapRow(data = {name : {id: "0", lvl: "0", text: ""}, equipment: [], tools: []}, techOperationNum = '') {
    let $tbody = $("#tech_process_table tbody");
    let $lastTr = $tbody.find('tr.startPointData');
    let name = data.name;
    let equipment = data.equipment;
    let tools = data.tools;

    let nameStr = "";
    if (name.lvl == "0")
        nameStr = `<div tech-id="0" tech-lvl="0" style="height: 100%;"></div>`;
    else nameStr = combineTechProcessCell(name);

    let equipmentStr = "";
    if (equipment.length)
        equipment.forEach(function (eq) {
            equipmentStr += combineTechProcessCellEquipment({
                id: eq.id,
                lvl: eq.lvl,
                name: getTechField(eq.id).name,
                text: eq.text
            });
        });

    let toolsStr = "";
    if (tools.length)
        tools.forEach(function (tool) {
            toolsStr += combineTechProcessCellTools({
                id: tool.id,
                lvl: tool.lvl,
                name: getTechField(tool.id).name,
                text: tool.text
            });
        });

    let deleteButton = (Role === "technologist") ? `<button class="tech_proc_del_td bg-white p-0 btn"><i class="fa fa-times"></i></button>`: "";
    $(`
        <tr class="newRouteMapRow">
            <td>${deleteButton}</td>
            <td colspan="4" class="tdBorderBlackLeft"></td>
            <td colspan="3" class=""></td>
            <td colspan="4" class="tdBorderBlackRight" style="font-size: 1.1em; text-align: center">${(Number(techOperationNum) < 100 && data.name.lvl == 3) ? "0" : ""}${techOperationNum}</td>
            <td colspan="34" class="techProcessCell">${nameStr}</td>
            <td colspan="12" class="tdBorderBlackLeft techProcessCellEquipment">
               <ul class="horizontal-full mb-1 mt-1">
                    ${equipmentStr}
                </ul> 
            </td>
            <td colspan="12" class="techProcessCellTools">
                <ul class="horizontal-full mb-1 mt-1">
                    ${toolsStr}
                </ul> 
            </td>
            <td colspan="6" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class="tdBorderBlackRight"></td>
        </tr>
    `).insertBefore($lastTr);

    let $trs = $tbody.find("tr");
    let new_tr = $trs.eq($trs.length - 2);
    new_tr.find('.techProcessCell').droppable(
        {
            tolerance: "pointer",
            accept: ".instruments_list_li, .techName, .techOperationsGuide",
            greedy: true,
            drop: function (event, ui) {
                let $draggable = $(ui.draggable);
                let $this = $(this);

                let $draggable_lvl = $draggable.attr("tech-lvl");
                let $draggable_id = $draggable.attr("tech-id");
                let $draggable_name = $draggable.find("span").first().text();

                $this.empty();
                if ($draggable_lvl == "3"){
                    $this.append(
                        combineTechProcessCell({
                            name: $draggable_name,
                            id: $draggable_id,
                            lvl: $draggable_lvl
                        })
                    );
                    setActionToBar({
                        id: "addTechField",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлено название '${$draggable_name}'`
                    });
                }/*else if ($draggable_lvl == "2"){
                    $this.append(
                        combineTechProcessCell({
                            name: $draggable_name,
                            id: $draggable_id,
                            lvl: $draggable_lvl
                        })
                    )
                }*/
                else if ($draggable_lvl == "1"){
                    $this.append(
                        combineTechProcessCell({
                            name: $draggable_name,
                            id: $draggable_id,
                            lvl: $draggable_lvl
                        })
                    );
                    setActionToBar({
                        id: "addTechProcess",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлено название '${$draggable_name}'`
                    });
                }
            }
        }
    );

    new_tr.find(".techProcessCellEquipment ul").droppable(
        {
            tolerance: "pointer",
            accept: ".instruments_list_li, .operationName",
            greedy: true,
            drop: function (event, ui) {
                let $draggable = $(ui.draggable);
                let $this = $(this);

                let $draggable_lvl = $draggable.attr("tech-lvl");
                let $draggable_id = $draggable.attr("tech-id");
                let $draggable_name = $draggable.find("span").first().text();

                if ($draggable_lvl == "3"){
                    $this.append(
                        combineTechProcessCellEquipment({
                            name: $draggable_name,
                            id: $draggable_id,
                            lvl: $draggable_lvl
                        })
                    );
                    setActionToBar({
                        id: "addTechField",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлено оборудование '${$draggable_name}'`
                    });
                }else if ($draggable_lvl == "2"){
                    let fieldsLi = $draggable.find(".instruments_list_li");
                    if (fieldsLi.length)
                        fieldsLi.each(function () {
                            let $li = $(this);
                            let liName = $li.find("span").first().text();
                            $this.append(
                                combineTechProcessCellTools({
                                    name: liName,
                                    id: $li.attr("tech-id"),
                                    lvl: $li.attr("tech-lvl")
                                })
                            );
                            setActionToBar({
                                id: "addTechField",
                                type: "addNew",
                                field: "Маршрутная карта",
                                text: `В 'Маршрутную карту' добавлено оборудование '${liName}'`
                            });
                        });
                }
            }
        }
    );

    new_tr.find(".techProcessCellTools ul").droppable(
        {
            tolerance: "pointer",
            accept: ".instruments_list_li, .operationName",
            greedy: true,
            drop: function (event, ui) {
                let $draggable = $(ui.draggable);
                let $this = $(this);

                let $draggable_lvl = $draggable.attr("tech-lvl");
                let $draggable_id = $draggable.attr("tech-id");
                let $draggable_name = $draggable.find("span").first().text();

                if ($draggable_lvl == "3"){
                    $this.append(
                        combineTechProcessCellTools({
                            name: $draggable_name,
                            id: $draggable_id,
                            lvl: $draggable_lvl
                        })
                    );
                    setActionToBar({
                        id: "addTechField",
                        type: "addNew",
                        field: "Маршрутная карта",
                        text: `В 'Маршрутную карту' добавлен инструмент '${$draggable_name}'`
                    });
                }else if ($draggable_lvl == "2"){
                    let fieldsLi = $draggable.find(".instruments_list_li");
                    if (fieldsLi.length)
                        fieldsLi.each(function () {
                            let $li = $(this);
                            let liName = $li.find("span").first().text();
                            $this.append(
                                combineTechProcessCellTools({
                                    name: liName,
                                    id: $li.attr("tech-id"),
                                    lvl: $li.attr("tech-lvl")
                                })
                            );
                            setActionToBar({
                                id: "addTechField",
                                type: "addNew",
                                field: "Маршрутная карта",
                                text: `В 'Маршрутную карту' добавлен инструмент '${liName}'`
                            });
                        });
                }
            }
        }
    );

}

function combineTechProcessCell(data = {name: "", lvl: "", id: "", text: ""}) {
    let deleteButton = (Role === "technologist") ? `<span class="deleteNodeButtonRM"></span>` : "";
    if (data.text !== undefined)
        data.name = data.text;
    return `
        <div tech-id="${data.id}" tech-lvl="${data.lvl}">
           <span>${data.name}</span>
            ${deleteButton}
        </div>
    `
}

function combineTechProcessCellEquipment(data = {name: "", lvl: "", id: "", text: ""}) {
    let deleteButton = (Role === "technologist") ? `<span class="deleteNodeButtonRM"></span>` : "";
    if (data.text !== undefined)
        data.name = data.text;

    return `
            <li tech-id='${data.id}' tech-lvl="${data.lvl}">
                <span class="mr-2">${data.name}</span>${deleteButton}
            </li>
        `
}

function combineTechProcessCellTools(data = {name: "", lvl: "", id: "", text: ""}) {
    let deleteButton = (Role === "technologist") ? `<span class="deleteNodeButtonRM"></span>` : "";
    if (data.text !== undefined)
        data.name = data.text;
    return `
            <li tech-id='${data.id}' tech-lvl="${data.lvl}">
                <span class="mr-2">${data.name}</span>${deleteButton}
            </li>
        `
}

function setTechProcessJson(json, res, $table) {
    console.log(res);
    let techOperationNum = 10;
    if (res.length)
        res.forEach(function (_row) {
            //console.log(_row)
            // находим название
            let name = "";
            if (_row.name.text === undefined || _row.name.text === "") {
                if (_row.name.lvl == "1") {
                    name = getTechName(_row.name.id, _row.name.lvl);
                } else if (_row.name.lvl == "2") {
                    name = getTechNode(_row.name.id, _row.name.lvl);

                } else if (_row.name.lvl == "3") {
                    name = getTechField(_row.name.id, _row.name.lvl);
                } else if (_row.name.lvl == "5") {
                    name = {
                        id: _row.name.id,
                        lvl: _row.name.lvl,
                        name: _row.name.text,
                        text: _row.name.text
                    }
                }else if (_row.name.lvl == "6") {
                    name = getTechField(_row.name.id, _row.name.lvl);
                }
                else {
                    name = {name: "", lvl: "0", id: "0"}
                }
            }else {
                name = _row.name;
            }

            // находим оборудование
            let equipment = [];
            if (_row.equipment.length){
                _row.equipment.forEach(function (eq) {
                    equipment.push({
                        id: eq.id,
                        lvl: eq.lvl,
                        name: getTechField(eq.id).name,
                        text: eq.text
                    });
                });
            }

            // находим инструменты
            let tools = [];
            if (_row.tools.length){
                _row.tools.forEach(function (tool) {
                    tools.push({
                        id: tool.id,
                        lvl: tool.lvl,
                        name: getTechField(tool.id).name,
                        text: tool.text
                    });
                })
            }

            setRouteMapRow({
                name: name,
                equipment: equipment,
                tools: tools
            }, (name.lvl == 3) ? techOperationNum : '')
            if (name.lvl == 3){
                techOperationNum += 1*10;
            }
        });

    /*$table.on('click', '.tech_proc_del_td', function () {
        alert("qw")
        let $this = $(this);
        let name = $this.parent().parent().find("td").eq(4).text();
        let text = (name === "") ? `Из 'Маршрутной карты' удалён узел` : `Из 'Маршрутной карты' удалён узел '${name}'`;
        $this.parents('tr').remove();
        setActionToBar({
            id: "deleteNodeFromRouteMap",
            type: "delete",
            field: "Маршрутная карта",
            text: text
        });
    });*/
    else{
        if (Role === "technologist") setRouteMapRow();
    }
}

function setTechProcessJsonRounds_1_2(res, $table) {
    console.log(res);
    let $tbody = $("#tech_process_table tbody");
    let $lastTr = $tbody.find('tr.startPointData');
    if (res.length){
        res.forEach(function (row) {
            $(combineRowFor_1_2Rounds({num_ceh: row.num_ceh, num_uch: row.num_uch, num_oper: row.num_oper, name: row.name, equipment: row.equipment, tools: row.tools})).insertBefore($lastTr);
        })
    }else {
        if (Role === "technologist") setTechProcessJsonRounds_1_2( [{}], $table)
    }
}

function combineRowFor_1_2Rounds(data = {num_ceh: "", num_uch: "", num_oper: "", name: "", equipment: "", tools: ""}) {
    let deleteButton = (Role === "technologist") ? `<button class="tech_proc_del_td bg-white p-0 btn"><i class="fa fa-times"></i></button>`: "";
    if (data.name === null || data.name === undefined)
        data.name = "";
    if (data.equipment === null || data.equipment === undefined)
        data.equipment = "";
    if (data.tools === null || data.tools === undefined)
        data.tools = "";
    if (data.num_ceh === null || data.num_ceh === undefined)
        data.num_ceh = "";
    if (data.num_uch === null || data.num_uch === undefined)
        data.num_uch = "";
    if (data.num_oper === null || data.num_oper === undefined)
        data.num_oper = "";
    let disabled = (Role !== "technologist") ? "disabled" : "";

    return `
        <tr class="newRouteMapRow">
            <td>${deleteButton}</td>
            <td colspan="4" class="tdBorderBlackLeft w-3-1">
                <input class="text-align-center border-0 outline-none bg-white" style="font-size: 1.5em;" ${disabled} value="${data.num_ceh}">    
            </td>
            <td colspan="3" class="w-3-1">
                <input class="text-align-center border-0 outline-none bg-white " style="font-size: 1.5em;" ${disabled} value="${data.num_uch}">
            </td>
            <td colspan="4" class="tdBorderBlackRight w-3-1">
                <input class="text-align-center border-0 outline-none bg-white" style="font-size: 1.5em;" ${disabled} value="${data.num_oper}">
            </td>
            <td colspan="34" class="">
                <input class="text-align-center border-0 outline-none bg-white" style="font-size: 1.5em;" ${disabled} value="${data.name}">
            </td>
            <td colspan="12" class="tdBorderBlackLeft">
               <input class="text-align-center border-0 outline-none bg-white" style="font-size: 1.5em;" ${disabled} value="${data.equipment}">
            </td>
            <td colspan="12" class="">
                <input class="text-align-center border-0 outline-none bg-white" style="font-size: 1.5em;" ${disabled} value="${data.tools}">
            </td>
            <td colspan="6" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class=""></td>
            <td colspan="5" class="tdBorderBlackRight"></td>
        </tr>
    `
}

function madeRouteMapByTechProcess(detailsData) {
    let routeMapData = {
        data: []
    };
    let emptyRow = {
        name: {
            id: 0,
            lvl: 0
        },
        equipment: [],
        tools: []
    }

    //

    if (detailsData.data.length)
        detailsData.data.forEach(function (_detail) {
            routeMapData.data.push({
                name: {
                    id: _detail.id,
                    lvl: 5,
                    text: _detail.text
                },
                equipment: [],
                tools: []
            });
            if (_detail.techProcess.length){
                _detail.techProcess.forEach(function (_techProcess) {
                    /*routeMapData.data.push({
                        // формируем заголовок техпроцесса
                        name: {
                            id: _techProcess.id,
                            lvl: _techProcess.lvl,
                            text: _techProcess.text
                        },
                        equipment: [],
                        tools: []
                    });*/
                    // находим техоперации в данном техпроцессе
                    if (_techProcess.operations.length)
                        _techProcess.operations.forEach(function (_operation) {
                            let thatOperationEquipment = [];
                            let thatOperationToolsAndRig = [];
                            let transitions = [];
                            // находим оборудование (id = 5), инструменты (id = 7) и приспособления (id = 4) и техпереходы (id = 2)

                            if (_operation.nodes.length)
                                _operation.nodes.forEach(function (_node) {
                                    if (_node.id === "5")
                                        thatOperationEquipment = _node.fields;
                                    if (_node.id === "7")
                                        thatOperationToolsAndRig = thatOperationToolsAndRig.concat(_node.fields);
                                    if (_node.id === "4")
                                        thatOperationToolsAndRig = thatOperationToolsAndRig.concat(_node.fields);
                                    if (_node.id === "2")
                                        _node.fields.forEach(function (_transition) {
                                            transitions.push({
                                                name: {
                                                    id: _transition.id,
                                                    lvl: 6,
                                                    text: _transition.text
                                                },
                                                tools: [],
                                                equipment: []
                                            })
                                        })
                                });
                            let operationObj = {
                                name: {
                                    id: _operation.id,
                                    lvl: _operation.lvl,
                                    text: _operation.text
                                },
                                tools: thatOperationToolsAndRig,
                                equipment: thatOperationEquipment
                            };

                            routeMapData.data.push(operationObj);
                            transitions.forEach(function (_transition) {
                                routeMapData.data.push(_transition)
                            })
                        })
                    routeMapData.data.push(emptyRow);
                })
            }
        })

    console.log(routeMapData)

    $.ajax({
        url: 'ajax/save_route_map_3',
        type: 'POST',
        data: routeMapData,
        success: function (res) {
            console.log(res);
            $("#tech_process_table").trigger("routeMapRefresh");
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
    })
}
