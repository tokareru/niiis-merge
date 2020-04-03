function createSpecificationTable() {
    //serializeTable();

    if(Round < 3){
        /*getJsonByURL("spec_table_ajax", generateTable,
            {table_block: "#specificationBlock", edit_mode_div: "#specification_edit", url: "pages/edit_field",
                save_url: "spec_table_ajax/save"});*/
        getJsonByURL("spec_table_ajax", initSpecTable);
    }else {

        getJsonByURL("spec_autoentered_table_ajax", initSpecTable);

        $("#left-accordion #pdm_field input").click(function () {
            setTableByPdmAndStd( collectDataLabels(".left-side"));
        });

        $("#left-accordion #std_field input").click(function () {
            setTableByPdmAndStd(collectDataLabels(".left-side"));
        })
    }
}

function initSpecTable(json) {
    let $tableBlock = $("#specificationBlock");
    let $table = $("#specificationTable");
    setSpecTable(json)

    $table.on("click", ".addNewRowToSpecTableButton", function () {
        addNewRowToSpecTable()
        setActionToBar({
            id: "addNewRowToSpecTable",
            type: "addNew",
            field: "Спецификация",
            text: "Добавлена новая строка в таблицу"
        })
    });

    $table.on("click", ".deleteNodeButtonRM", function () {
        deleteSpecRow(this)
    });

    $tableBlock.on("click", "#specTableSaveButton", function () {
        saveSpecTable();
    });

    if (Role === "designer"){
        $tableBlock.find("#specTableSaveButton").removeClass("d-none");
    }else {
        $tableBlock.find("#specTableSaveButton").remove();
    }
}

function setSpecTable(json) {
    //console.log(json);
    let $table = $("#specificationTable");
    let $theadTr = $table.find("thead tr");
    let $tbody = $table.find("tbody");
    if (Role === "designer"  && Round !== 3)
        $theadTr.append(`<td></td>`);
    if (json.thead.length)
        json.thead.forEach(function (_cell) {
            $theadTr.append(combineTheadCell(_cell))
        });
    if (Round !== 3){
        if (json.tbody.length)
            json.tbody.forEach(function (_row) {
                $tbody.append(combineTbodyRow(_row));
            });
        else {
            if (Role === "designer")
                $tbody.append(combineTbodyRow({row: [{text: "", readonly: false}]}));
            else
                $tbody.append(combineTbodyRow({row: [{text: "", readonly: true}]}));
        }
        if (Role === "designer" && Round !== 3)
            $tbody.append(`
            <tr style="width: 45px;">
                <td style="padding-left: 14px;" class="font-family-fontAwesome font-size-12-em fa-plus addNewRowToSpecTableButton"></td>
            </tr>`
            );
    }else {
        setTableByPdmAndStd();
    }

}

function combineTheadCell(cell = {text: "", readonly: false}) {
    let disabled = (true) ? `disabled="disabled"` : ``;
    return `
        <td><input class="bg-transparent border-0 outline-none shadow-none font-weight-bold" ${disabled} value="${cell.text}"></td>
    `;
}

function combineTbodyRow(row = {row: [{text: "", readonly: false}, {text: "", readonly: false}, {text: "", readonly: false}, {text: "", readonly: false}]}) {
    let deleteButton = (Role === "designer" && Round !== 3) ? `<td><span class="font-family-fontAwesome font-size-12-em deleteNodeButtonRM"></span></td>` : ``;
    let cells = "";
    if (row.row.length)
        row.row.forEach(function (_cell) {
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
    let disabled = ( Role !== "designer" || Round === 3) ? `disabled="disabled"` : ``;
    return `
        <td class="specTableCell"><input class="bg-transparent border-0 outline-none shadow-none" ${disabled} value="${cell.text}"></td>
    `;
}

function addNewRowToSpecTable(data) {
    let info;
    if (data !== undefined)
       info = {row: [{text: data[0], readonly: false}, {text: data[1], readonly: false}, {text: data[2], readonly: false}, {text: data[3], readonly: false}]};
    $("#specificationTable").find("tbody").append(combineTbodyRow(info));

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
    $("#specificationTable").find("tbody").find(".specRows").remove();
}

function saveSpecTable() {
    let $rows = $("#specificationTable").find(".specRows");
    let saveData = [];
    if ($rows.length)
        $rows.each(function () {
            let cells = $(this).find(".specTableCell input");
            saveData.push({
                row: [
                    { text: cells.eq(0).val(), readonly: false},
                    { text: cells.eq(1).val(), readonly: false},
                    { text: cells.eq(2).val(), readonly: false},
                    { text: cells.eq(3).val(), readonly: false}
                ]
            })
        });
    console.log(saveData);
    let saveUrl = "";

    if (Round !== 3){
        saveUrl = "spec_table_ajax/save";
    }else{
        saveUrl = "spec_autoentered_table_ajax";
        $.ajax({
            type: "POST",
            url: "spec_autoentered_table_ajax/save_product_checked",
            data: {
                checked: collectDataLabels(".left-side")
            },
            success: function (answer) {
                console.log(answer);
                setActionToBar({
                    id: "saveSpecTable",
                    type: "save",
                    field: "Спецификация",
                    text: `Сохранение таблицы 'Спецификация'`
                })
            }
        });
    }

    $.ajax({
        type: "POST",
        url: saveUrl,
        data: {
            tbody: saveData,
            login: login
        },
        success: function (answer) {
            console.log(answer);
            setActionToBar({
                id: "saveSpecTable",
                type: "save",
                field: "Спецификация",
                text: `Сохранение таблицы 'Спецификация'`
            })
        }
    });
}

function setTableByPdmAndStd(checked) {
    let $table = $("#specificationTable");
    emptySpecTable();

    DetailsInfo = getDetailsInfo();

    if (checked === undefined){
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

    let checked_info = convertPdmAndStdInfo(checked);
    //console.log(checked_info);

    checked_info.forEach(function (_detail) {
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
