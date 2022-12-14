let mainTitle = 0;

function createSpecificationTable() {
    //serializeTable();



    if (Round < 3) {
        /*getJsonByURL("spec_table_ajax", generateTable,
            {table_block: "#specificationBlock", edit_mode_div: "#specification_edit", url: "pages/edit_field",
                save_url: "spec_table_ajax/save"});*/
        getJsonByURL("spec_table_ajax", initSpecTable);
    } else {

        getJsonByURL("spec_autoentered_table_ajax", initSpecTable);



        /*$("#left-accordion #pdm_field input").click(function () {
            setTableByPdmAndStd(collectDataLabels(".left-side"));
        });
        $("#left-accordion #std_field input").click(function () {
            setTableByPdmAndStd(collectDataLabels(".left-side"));
        })*/
    }
}

function initSpecTable(json) {
    let $tableBlock = $("#specificationBlock");
    let $table = $("#specificationTable");
    setSpecTable(json);
    SpecTableInfo = json;
    $tableBlock.unbind("click").unbind("change").unbind("keydown");

    $tableBlock.on("click", ".addNewRowToSpecTableButton", function () {
        addNewRowToSpecTable();
        setActionToBar({
            id: "addNewRowToSpecTable",
            type: "addNew",
            field: "Спецификация",
            text: "Добавлена новая строка в таблицу"
        })
    });

    $("#print_report_button").unbind("click").on("click", function () {
        setActionToBar({
            id: "sendToPrint",
            type: "print",
            field: "Спецификация",
            text: "Чертеж и спецификация отправлены на печать"
        }).then(function () {
            let win = window.open(`print_report/scheme_and_spec`, '_blank');
            win.focus();
            triggerToDoTaskEvent("sendToPrint");
        });
    });

    $tableBlock.on("keydown", ".specTableCellInput", function (e) {
        specTableMoveByKey(e, $table, $(this));
    });

    $tableBlock.on("click", ".deleteNodeButtonRM", function () {
        deleteSpecRow(this)
    });

    $tableBlock.on("click", "#specTableSaveButton", function () {
        saveSpecTable(this);
    });

    if (Round !== 3 && Role === "designer") {
        $tableBlock.on("change", ".specTableCellInput", function (event) {
            setActionToBar({
                id: "changeSpecTableCell",
                type: "edit",
                field: "Спецификация",
                text: `Изменена ячейка 'Таблицы спецификации'`
            })
        });
    }

    let printButton = $tableBlock.find("#print_report_button");
    printButton.addClass("d-inline").removeClass("d-none");
    if (Role === "designer" && Round === 3) printButton.addClass("ml-auto")
    if (Role === "designer" && Round !== 3) {
        $tableBlock.find("#specTableSaveButton").removeClass("d-none").addClass("d-inline").removeClass("mr-auto").addClass("mr-2");
    } else {
        $tableBlock.find("#specTableSaveButton").remove();
    }

    if (Role !== "designer" || Round !== 3) {
        $tableBlock.one("click", "#specTableReloadButton", function () {
            let thisBlock = this;
            startProcessOfSaving(thisBlock);
            $tableBlock.find("thead tr").empty();
            $tableBlock.find("tbody").empty();

            createSpecificationTable();
        });
        stopProcessOfSaving(document.getElementById("specTableReloadButton"));
        let reloadButton = $tableBlock.find("#specTableReloadButton");
        reloadButton.removeClass("d-none").addClass("d-inline");
        if (Role !== "designer") reloadButton.addClass("ml-auto");
    }
}

function setSpecTable(json) {
    //console.log(json);
    let $table = $("#specificationTable");
    let $theadTr = $table.find("thead tr");
    let $tbody = $table.find("tbody");
    if (Role === "designer" && Round !== 3)
        $theadTr.append(`<td style="width: 20px"></td>`);
    if (json.thead.length)
        json.thead.forEach(function (_cell, index) {
            $theadTr.append(combineTheadCell(_cell));
            if (index === 0) {
                $theadTr.find(".specTableTheadCell").eq(index).parent().css({
                    'width': 60,
                    'max-width': 60,
                    'min-width': 60,
                });
                $theadTr.find(".specTableTheadCell").eq(index).parent().addClass('pb-0');
            }
            if (index === 1) {
                $theadTr.find(".specTableTheadCell").eq(index).parent().css({
                    'width': 315,
                    'max-width': 315,
                    'min-width': 315
                });
                $theadTr.find(".specTableTheadCell").eq(index).addClass('text-center');
            }
            if (index === 2) {
                $theadTr.find(".specTableTheadCell").eq(index).parent().css({
                    'width': 315,
                    'max-width': 315,
                    'min-width': 315
                });
                $theadTr.find(".specTableTheadCell").eq(index).addClass('text-center');
            }
            if (index === 3) {
                $theadTr.find(".specTableTheadCell").eq(index).parent().css({
                    'width': 80,
                    'max-width': 80,
                    'min-width': 80
                });
            }
            if (index === 4) $theadTr.find(".specTableTheadCell").eq(index).parent().css({
                'width': 130,
                'max-width': 130,
                'min-width': 130,
            });
            //else $theadTr.find(".specTableTheadCell").eq(index).parent().css({'width': 100, 'max-width': 100, 'min-width': 100});
        });
    if (!TaskInfoReload) {
        if (json.tbody === undefined) {
            let temp = [];
            for (let i = 0; i < json.thead.length; i++) {
                temp.push({text: "", readonly: false});
            }
            json.tbody = [{row: temp}];
            console.log(temp);
        }

        if (Round !== 3) {
            if (json.tbody.length)
                json.tbody.forEach(function (_row) {
                    $tbody.append(combineTbodyRow(_row));
                });
            else {
                if (Role === "designer") {
                    $tbody.append(combineTbodyRow({row: [{text: "", readonly: false}]}));
                    $tbody.append(combineTbodyRow({row: [{text: "", readonly: false}]}));
                } else
                    $tbody.append(combineTbodyRow({row: [{text: "", readonly: true}]}));
            }
            if (Role === "designer" && Round !== 3)
                $tbody.append(`
            <tr style="width: 45px;">
                <td style="padding-left: 14px;" class="font-family-fontAwesome font-size-12-em fa-plus addNewRowToSpecTableButton"></td>
            </tr>`
                );
        } else {
            setTableByPdmAndStd();
        }
    }

}

function setTableByRowDAta(data) {
    $('#specificationTable').find('tbody tr').remove();
    data.forEach(function (val) {
        $('#specificationTable').find('tbody').append(combineTbodyRow(val));
    });

}

function combineTheadCell(cell = {text: "", readonly: false}) {
    let disabled = (true) ? `disabled="disabled"` : ``;
    return `
        <td><input class="specTableTheadCell bg-transparent border-0 outline-none shadow-none font-weight-bold" ${disabled} value="${cell.text}"></td>
    `;
}

function combineTbodyRow(row = {
    row: [{text: "", readonly: false}, {text: "", readonly: false}, {
        text: "",
        readonly: false
    }, {text: "", readonly: false}, {text: "", readonly: false}]
}) {
    let deleteButton = (Role === "designer" && Round !== 3) ? `<td><span class="font-family-fontAwesome font-size-12-em deleteNodeButtonRM"></span></td>` : ``;
    let cells = "";
    if (row.row.length)
        row.row.forEach(function (_cell) {
            if (_cell.text !== undefined)
                cells += combineTbodyCell(_cell);
        });
    return `
        <tr class="specRows">
            ${deleteButton}
            ${cells}
        </tr>
    `
}

function combineTbodyCell(cell = {text: "", readonly: false}) {
    let disabled = (Role !== "designer" || Round === 3) ? `disabled="disabled"` : ``;
    return `
        <td class="specTableCell"><input class="specTableCellInput bg-transparent border-0 outline-none shadow-none" ${disabled} value="${cell.text}"></td>
    `;
}

function addNewRowToSpecTable(data) {
    let info;
    if (data !== undefined)
        info = {
            row: [{text: data[0], readonly: false},
                {text: data[1], readonly: false},
                {text: data[2], readonly: false},
                {text: data[3], readonly: false},]
        };

    if (Round !== 3) {
        $("#specificationTable").find("tbody").find('.addNewRowToSpecTableButton').parents('tr').before(combineTbodyRow(info));
    } else {
        $("#specificationTable").find("tbody").append(combineTbodyRow(info));
    }

}

function specTableMoveByKey(e, $table, $input) {
    if (Round !== 3 && Role === "designer" && e.which === 9) {
        e.preventDefault();
        let isNext = false;
        let $inputs = $table.find('.specTableCellInput');
        $inputs.each(function (index) {
            if ($inputs.length === index + 1) {
                $(this).blur();
            }
            if (isNext) {
                $(this).focus();
                isNext = false;
                return;
            }
            if ($input.get(0) === $(this).get(0)) {
                isNext = true;
            }
        })
    }
}

function deleteSpecRow(_this) {
    let $this = $(_this);
    let row = $this.parent().parent();
    row.remove();
    setActionToBar({
        id: "deleteRowOfSpecTable",
        type: "delete",
        field: "Спецификация",
        text: "Удалена строка из таблицы"
    });
}

function emptySpecTable() {
    let specTbody = $("#specificationTable").find("tbody")
    specTbody.find(".specRows").remove();
    specTbody.find(".mainTitleNameRow").remove();
    specTbody.find(".detailsGroupNameRow").remove();
}

function saveSpecTableData($rows) {
    let saveData = [];
    if ($rows.length)
        $rows.each(function (index) {
            let cells = $(this).find(".specTableCell input");
            saveData.push({
                row: [
                    {text: cells.eq(0).val(), readonly: false},
                    {text: cells.eq(1).val(), readonly: false},
                    {text: cells.eq(2).val(), readonly: false},
                    {text: (cells.eq(3).val() !== "Не указано") ? cells.eq(3).val() : "0", readonly: false},
                    {text: (cells.eq(4).val() !== undefined) ? cells.eq(4).val() : "", readonly: false},
                ]
            })
        });
    return saveData;
}

function saveSpecTable(thisButton) {
    let $rows = $("#specificationTable").find(".specRows");
    let saveData = saveSpecTableData($rows);
    console.log(saveData);
    let saveUrl = "";
    if (Round !== 3) {
        saveUrl = "spec_table_ajax/save";
    } else {
        saveUrl = "spec_autoentered_table_ajax/save";
        $.ajax({
            type: "POST",
            url: "spec_autoentered_table_ajax/save_product_checked",
            data: {
                checked: collectDataLabels(".left-side")
            },
            success: function (answer) {
                console.log(answer);
                /*setActionToBar({
                    id: "saveSpecTable",
                    type: "save",
                    field: "Спецификация",
                    text: `Сохранение таблицы 'Спецификация'`
                })*/
            }
        });
    }

    startProcessOfSaving(thisButton, false)
    $.ajax({
        type: "POST",
        url: saveUrl,
        data: {
            thead: [{text: "Позиция", readonly: true}, {text: "Обозначение", readonly: true}, {
                text: "Наименование",
                readonly: true
            }, {text: "Кол.", readonly: true}],
            tbody: saveData,
            login: login
        },
        success: function (answer) {
            console.log(answer);
            stopProcessOfSaving(thisButton, false)
            setActionToBar({
                id: "saveSpecTable",
                type: "save",
                field: "Спецификация",
                text: `Сохранение таблицы 'Спецификация'`
            });
            triggerToDoTaskEvent("saveSpecTable");
        }
    });
}

function setTableByPdmAndStd(checked) {

    emptySpecTable();

    DetailsInfo = getDetailsInfo();
    addTitleBlockRow();

    if (checked === undefined) {
        $.ajax({
            type: "GET",
            url: "spec_autoentered_table_ajax/load_product_checked",
            async: false,
            dataType: "json",
            success: function (json) {
                checked = json;
            },
            error: function (message) {
                //console.log("Can't load the data");
            },
        })
    }

    if (checked.checked !== undefined)
        checked = checked.checked;

    let checked_info = convertPdmAndStdInfo(checked);
    let isPdmGroupNameSet = false;
    let isStdGroupNameSet = false;
    checked_info.forEach(function (_detail) {
        if (!isPdmGroupNameSet && _detail.type === "pdm") {
            isPdmGroupNameSet = true;
            addDetailsGroupRow("Детали");
        }
        if (!isStdGroupNameSet && _detail.type === "standart") {
            isStdGroupNameSet = true;
            addDetailsGroupRow("Стандартные детали");
        }
        addNewRowToSpecTable([_detail.position, _detail.designation, _detail.name, _detail.number]);
    });
}

function convertPdmAndStdInfo(checkedArray) {
    let checkedInfo = [];
    DetailsInfo = getDetailsInfo();
    DetailsInfo.forEach(function (_detail, index) {
        checkedArray.forEach(function (checker, i) {
            if (checker === ("detail-" + (index + 1)))
                checkedInfo.push(_detail);
        });
    });
    return checkedInfo;
}

function addTitleBlockRow() {
    let checkedArray = [];
    let allDetails = getDetailsInfo();
    if (Role !== "designer")
        $.ajax({
            type: "GET",
            url: "spec_autoentered_table_ajax/load_product_checked",
            dataType: "json",
            async: false,
            success: function (json) {
                checkedArray = json.checked;
            }
        });
    else checkedArray = collectDataLabels(".left-side");

    if (checkedArray.length === (getDetailsInfo("pdm").length + getDetailsInfo("std").length)) {
        getMainTitle();
        let $table = $("#specificationTable");
        $table.find("tbody").prepend(`
        <tr class="mainTitleNameRow">
            <td></td>
            <td></td>
            <td class="bold">Документация</td>
            <td></td>
        </tr>
        <tr class="mainTitleNameRow">
            <td></td>
            <td>${mainTitle}</td>
            <td>Сборочный чертеж</td>
            <td></td>
        </tr>
    `);
    }
}

function addDetailsGroupRow(groupName) {
    let $table = $("#specificationTable");
    $table.find("tbody").append(`
        <tr class="detailsGroupNameRow">
            <td></td>
            <td></td>
            <td class="bold">${groupName}</td>
            <td></td>
        </tr>
    `)
}

function getMainTitle() {
    if (mainTitle === 0)
        $.ajax(
            {
                url: 'drawing_main_text_ajax',
                type: 'POST',
                async: false,
                data: {},
                success: function (data) {
                    mainTitle = data[20];
                    //console.log(mainTitle)
                }
            }
        );
    return mainTitle;
}

function convertCheckedDataToSaveData(checked = []) {
    let saveData = [];
    let convertedDetails = convertPdmAndStdInfo(checked);
    if (convertedDetails.length)
        convertedDetails.forEach(function (_detail) {
            saveData.push({
                row: [
                    {text: _detail.position, readonly: false},
                    {text: _detail.designation, readonly: false},
                    {text: _detail.name, readonly: false},
                    {text: _detail.number, readonly: false}
                ]})
        });
    return saveData;
}
