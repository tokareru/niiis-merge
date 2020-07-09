const diffOfTechProcess = 1000;

function technologicalProcessInit() {
    let $container = $("#tech_process_field_drop");
    let tech_process_table = $("#tech_process_table");
    $("#tech_process_table").removeClass("tech_process_table");
    $("#tech_process_field_drop").addClass("tech_process_table");
    $("#tabs li[aria-controls=\"technological_process_field\"]").on("click", function () {
        $("#tech_process_table").removeClass("tech_process_table");
        $("#tech_process_field_drop").addClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("enable");
        //$("#tech_process_table").droppable("disable");
    });

    let reloadButton = $("#tech_process_field_reload_button");
    let saveButton = $("#tech_process_field_save_button");

    if (Role !== "technologist"){
        saveButton.remove();
        $("#tech_process_field_add_node_button").remove();
        reloadButton.addClass("ml-auto");
        $.ajax({
            // ajax/get_technologist_info
            url: techGuideURL,
            type: 'GET',
            success: function (json) {
                techGuideJson = json;
                downloadTechProcess($container, "tech_process_field_drop");
            }
        });
    }else {
        downloadTechProcess($container, "tech_process_field_drop");
    }

    $container.on("click", ".deleteNodeButtonRM", function () {
        deleteKnot($(this))
    });

    $container.on("click", ".showEditInputButton", function () {
        toggleEditNodeForTechProcess($(this))
    })

    $container.on('input', ".editInput", function() {
        let $input = $(this);
        let $buffer = $(".buffer");
        $buffer.text($input.val());
        $input.width($buffer.width());
    });

    reloadButton.on("click", function () {
        $(".detailDraggableDropped").remove();
        let thisButton = this;
        startProcessOfSaving(thisButton);
        downloadTechProcess().then(function () {
            stopProcessOfSaving(thisButton);
        });
    });

    saveButton.click(function () {
        saveTechProcess(this);
    })

}

async function downloadTechProcess() {
    // json/tech_process.json
    // json/new_techprocess.json
    // ajax/get_techproccess
    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        success: function (json) {
            console.log(json)
            setDetailsArea(json, $("#tech_process_field_drop"), "tech_process_field_drop");
        }
    });
}

function setDetailsArea(json, $field, fieldId) {
    if (json !== null)
        if (json.data != undefined){
            if (json.data.length) {
                if (json.data.length)
                    json.data.forEach(function (_detailArea) {
                        let detail = getDetailById(_detailArea.id)
                        $field.append(combineDetailArea({
                            name: `${(detail.designation.replace(/ /g, "") === "") ? "" : (detail.designation + " - ")}${detail.name}`,
                            id: _detailArea.id,
                            lvl: 0,
                            text: _detailArea.text,
                            techProcess: _detailArea.techProcess
                        }))
                    });
            }
            else if (Role !== "technologist"){
                $field.append(`
                    <p class="alert-warning p-2">Технолог еще не создал техпроцесс</p>
                `)
            }
        }
    if (Role === "technologist"){
        setDropAreaForDetailArea($("#tech_process_field_container").find(".detailsDropArea"), fieldId);
        $(".techProcessDropArea").each(function () {
            setDropAreaForTechName($(this), fieldId);
        });

        $(".techOperationsDropArea").each(function () {
            setDropAreaForTechOperation($(this), fieldId)
        });

        $(".techNodesDropArea").each(function () {
            setDropAreaForTechNode($(this), fieldId)
        })
    }
    setToggler(fieldId);
    $("#tech_process_field_container").find(".detailDraggableDropped").find("span.caret").trigger("click")
}

function setAllTechProcess(json, $field_drop, fieldId) {
    if (json.data.length){
        if (json.data.length)
            json.data.forEach(function (_detailArea) {
                let detail = getDetailById(_detailArea.id)
                $field_drop.append(combineDetailArea({
                    name: `${(detail.designation.replace(/ /g, "") === "") ? "" : (detail.designation + " - ")}${detail.name}`,
                    id: _detailArea.id,
                    lvl: 0,
                    techProcess: _detailArea.techProcess
                }))
            });
    }
    setToggler(fieldId);
}

function combineDetailArea(_detail = {name: "", id: 0, lvl: 0, text: "", techProcess: []}, isDeleted = false) {
    let deleteButton = (Role === "technologist" || isDeleted) ? `<span class='deleteNodeButtonRM'></span>` : "";
    let techNames = "";
    if (_detail.techProcess.length)
        _detail.techProcess.forEach(function (_techName) {
            /*let techOperations = "";
            if (_techName.operations.length)
                _techName.operations.forEach(function (_operation) {
                    let techNodes = "";
                })*/
            techNames += combineTechName({
                name: getTechName(_techName.id, _techName.lvl).name,
                id: _techName.id,
                lvl: _techName.lvl,
                text: _techName.text,
                operations: _techName.operations
            }, isDeleted);
        })
    if (_detail.text === undefined)
        _detail.text = _detail.name;
    let edit = ""
    if (Role === "technologist")
        edit = `<input class="editInput d-none" value="${_detail.text}"><span is-active="false"
            class="showEditInputButton mr-1 font-family-fontAwesome fa-edit"></span>`

    return `
        <li detail-id="${_detail.id}" tech-lvl="0" class="detailDraggableDropped">
            <span class="caret d-initial">${_detail.text}</span>${edit}${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom border-bottom-color-gray pb-2
             myNested techProcessDropArea border border-color-transparent rounded'>
                ${techNames}
            </ul>
        </li>
    `

}

function combineTechName(techName = {name: "", id: "", lvl: "", text: "", operations: []}, isDeleted = false) {
    let operations = "";

    if (techName.operations.length)
        techName.operations.forEach(function (_operataion) {
            operations += combineTechOperation({
                name: getTechField(_operataion.id, _operataion.lvl).name,
                id: _operataion.id,
                lvl: _operataion.lvl,
                text: _operataion.text,
                nodes: _operataion.nodes
            }, isDeleted);
        });
    if (techName.text === undefined)
        techName.text = techName.name;
    let deleteButton = (Role === "technologist" || isDeleted) ? `<span class='deleteNodeButtonRM'></span>` : "";
    let edit = ""
    if (Role === "technologist")
        edit = `<input class="editInput d-none" value="${techName.text}"><span is-active="false"
            class="showEditInputButton mr-1 font-family-fontAwesome fa-edit"></span>`

    return `
        <li class='techNameDropped' tech-id='${techName.id}' tech-lvl='${techName.lvl}'>
            <span class='caret d-initial'>${techName.text}</span>${edit}${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom pb-2 border-bottom-color-gray myNested techOperationsDropArea border border-color-transparent rounded'>
                ${operations}
            </ul>
        </li>
    `
}

function combineTechOperation(field = {name: "", id: "", lvl: "", text: "", nodes: []}, isDeleted = false) {
    let deleteButton = (Role === "technologist" || isDeleted) ? `<span class='deleteNodeButtonRM'></span>` : "";
    let innerNodes = "";
    if (field.nodes !== undefined)
        if(field.nodes.length)
            field.nodes.forEach(function (_node) {
                innerNodes += combineTechNode({
                    name: getTechNode(_node.id, _node.lvl).name,
                    id: _node.id,
                    lvl: _node.lvl,
                    text: _node.text,
                    fields: _node.fields
                });
            });
    if (field.text === undefined)
        field.text = field.name;
    let edit = ""
    if (Role === "technologist")
    edit = `<input class="editInput d-none" value="${field.text}"><span is-active="false"
        class="showEditInputButton mr-1 font-family-fontAwesome fa-edit"></span>`;

    return `
        <li class="techOperation" tech-lvl="${field.lvl}" tech-id="${field.id}">
            <span class="mr-2 caret d-initial">${field.text}</span>${edit}${deleteButton}
            <ul style='min-height: 35px;' class="nested border-bottom techNodesDropArea border border-color-transparent rounded">
                ${innerNodes}
            </ul>
        </li>
    `;
}

function combineTechNode(node = {name: "", id: "", lvl: "", text: "", fields: []}) {
    let fields = "";
    // получаем поля
    if (node.fields.length){
        node.fields.forEach(function (_field) {
            fields += combineTechField({
                id: _field.id,
                lvl: _field.lvl,
                text: _field.text,
                name: getTechField(_field.id, _field.lvl).name
            });
        })
    }
    if (node.text === undefined)
        node.text = node.name;

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
    let edit = "";
    if (Role === "technologist")
        edit = `<input class="editInput d-none" value="${node.text}"><span is-active="false" 
            class="showEditInputButton mr-1 font-family-fontAwesome fa-edit"></span>`;

    let _node = `
        <li class="techNode" tech-lvl="${node.lvl}" tech-id="${node.id}">
            <span class="caret d-initial">${node.text}</span>${edit}${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom border-bottom-color-gray pb-2 myNested techFieldsDropArea border border-color-transparent rounded'>
                ${fields}
            </ul>
        </li>
    `;
    return _node;
}

function combineTechField(field = {name: "", id: "", lvl: "", text: ""}) {
    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
    if (field.text === undefined)
        field.text = field.name;
    let edit = "";
    if (Role === "technologist")
        edit = `<input class="editInput d-none" value="${field.text}"><span is-active="false" 
            class="showEditInputButton mr-1 font-family-fontAwesome fa-edit"></span>`;
    return `
        <li class="techField" tech-lvl="${field.lvl}" tech-id="${field.id}">
            <span class="mr-2">${field.text}</span>${edit}${deleteButton}
        </li>
    `;
}

function setDropAreaForDetailArea($detailsDropArea, fieldId) {
    // создаёт корневую зону droppable
    $detailsDropArea.droppable({
        tolerance: "pointer",
        accept: ".detailDraggable",
        greedy: true,
        drop: function (e, ui) {
            let $draggable = $(ui.draggable);
            let thisId = $draggable.attr("tech-id");
            let thisLvl = $draggable.attr("tech-lvl");
            let detail = getDetailById(thisId)
            $detailsDropArea.append(combineDetailArea({
                name: `${(detail.designation.replace(/ /g, "") === "") ? "" : (detail.designation + " - ")}${detail.name}`,
                id: thisId,
                lvl: thisLvl,
                techProcess: []
            }))
            setDropAreaForTechName($detailsDropArea.find(".techProcessDropArea").last(), fieldId);
            setToggler(fieldId);
            let detailDraggableDropped = $(".detailDraggableDropped");
            detailDraggableDropped.last().find("span.caret").trigger("click");

            setActionToBar({
                id: `addNewDetailToTechProcess`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `Добавлена новая деталь '${getDetailById(thisId).name.replace(/"/g, "")}'`
            });
        }
    });

    $detailsDropArea.sortable({
        items: ".detailDraggableDropped",
        axis: 'y',
        stop: function (e, ui) {
            // сортировка техпроцесса
            if ( Math.abs(Number(ui.originalPosition.top - ui.position.top)) <=  18 ){
                //console.log("Not enough to mark sortable");
                return;
            }
            let detailName = $(ui.item).find("span.caret").first().text();
            setActionToBar({
                id: `moveDetail`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Деталь '${detailName}' была перемещена`
            });
        }
    });
    $detailsDropArea.disableSelection();
}

function setDropAreaForTechName($techNameDropArea, fieldId) {
    // создаёт зону droppable в узле детали

    $techNameDropArea.droppable({
        tolerance: "pointer",
        accept: ".techName, .techOperationsGuide, .techOperationNodesGuide",
        greedy: true,
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $techNameDropArea;

            // если перенесенный узел - техоперация
            if ($draggable.hasClass("techOperationsGuide")){
                let $techName = $draggable.parent().parent().parent().parent();
                let thisTechNameId = $techName.attr("tech-id");
                let thisTechNameLvl = $techName.attr("tech-lvl");
                let techName = $techName.find("span").first().text();
                let techOperationName = $draggable.find("span").first().text();
                let thisTechOperationId = $draggable.attr("tech-id");
                let thisTechOperationLvl = $draggable.attr("tech-lvl");

                // находим, есть ли в detailsDropArea techNameDropped с таким же tech-id как и у техпроцесса, из которого
                // мы выташили techOperationsGuide. Берем только первый техпроцесс из техпроцессов с идентичными tech-id
                let $placeholder;
                let isTechNameAlreadyHere = false;
                $techNameDropArea.find(".techNameDropped").each(function () {
                    let thisTechName = $(this);
                    if (thisTechName.attr("tech-id") === thisTechNameId && !isTechNameAlreadyHere){
                        isTechNameAlreadyHere = true;
                        $placeholder = thisTechName.find(".techOperationsDropArea")
                    }
                })
                if (isTechNameAlreadyHere){

                    $placeholder.append(combineTechOperation({
                        name: techOperationName,
                        id: thisTechOperationId,
                        lvl: thisTechOperationLvl,
                        nodes: []
                    }));
                    setDropAreaForTechNode($placeholder.find(".techNodesDropArea").last(), fieldId);
                }else {
                    $this.append(combineTechName({
                        name: techName,
                        id: thisTechNameId,
                        lvl: thisTechNameLvl,
                        operations: [
                            {
                                name: techOperationName,
                                id: thisTechOperationId,
                                lvl: thisTechOperationLvl,
                                nodes: []
                            }
                        ]
                    }));
                    setDropAreaForTechOperation($this.find(".techOperationsDropArea").last(), fieldId);
                    setDropAreaForTechNode($this.find(".techNodesDropArea").last(), fieldId);
                    setActionToBar({
                        id: `addNewTechProcess`,
                        type: "addNew",
                        field: "Рабочий стол. Техпроцесс",
                        text: `Добавлен техпроцесс '${techName}'`
                    });
                }
                setToggler(fieldId);

                if (isTechNameAlreadyHere){
                    $placeholder.parent().find("span.caret").first().not(".caret-down").trigger("click")
                    $placeholder.find(".techOperation").last().find("span").first().trigger("click");
                }else {
                    $this.find(".techNameDropped").last().find("span").first().trigger("click");
                    $this.find(".techNameDropped").last().find(".techOperation").find("span").first().trigger("click");
                    setDropAreaForTechOperation($this.find(".techOperationsDropArea"), fieldId);
                }
                setActionToBar({
                    id: `addNewTechOperation`,
                    type: "addNew",
                    field: "Рабочий стол. Техпроцесс",
                    text: `Добавлена техоперация '${techOperationName}'`
                });

                return;
            }

            // если перенесенный узел - группа техопераций
            if ($draggable.hasClass("techOperationNodesGuide")){
                let $techName = $draggable.parent().parent();
                let thisTechNameId = $techName.attr("tech-id");
                let thisTechNameLvl = $techName.attr("tech-lvl");
                let techName = $techName.find("span").first().text();

                // находим, есть ли в detailsDropArea techNameDropped с таким же tech-id как и у техпроцесса, из которого
                // мы выташили techOperationsGuide. Берем только первый техпроцесс из техпроцессов с идентичными tech-id
                let $placeholder;
                let isTechNameAlreadyHere = false;
                $techNameDropArea.find(".techNameDropped").each(function () {
                    let thisTechName = $(this);
                    if (thisTechName.attr("tech-id") === thisTechNameId && !isTechNameAlreadyHere){
                        isTechNameAlreadyHere = true;
                        $placeholder = thisTechName.find(".techOperationsDropArea")
                    }
                });

                if (!isTechNameAlreadyHere){
                    setActionToBar({
                        id: `addNewTechProcess`,
                        type: "addNew",
                        field: "Рабочий стол. Техпроцесс",
                        text: `Добавлен техпроцесс '${techName}'`
                    });
                }

                let operations = [];
                let $operations = $draggable.find(".techOperationsGuide");
                if ($operations.length)
                    $operations.each(function () {
                        let $operation = $(this);
                        let operationName = $operation.find("span").first().text();
                        operations.push({
                            name: operationName,
                            id: $operation.attr("tech-id"),
                            lvl: $operation.attr("tech-lvl")
                        });

                        setActionToBar({
                            id: `addNewTechOperation`,
                            type: "addNew",
                            field: "Рабочий стол. Техпроцесс",
                            text: `Добавлена техоперация '${operationName}'`
                        });

                        //setDropAreaForTechNode($this.find(".techNodesDropArea").last());
                    });

                if (!isTechNameAlreadyHere){
                    $this.append(combineTechName({
                        name: techName,
                        id: $techName.attr("tech-id"),
                        lvl: $techName.attr("tech-lvl"),
                        operations: operations
                    }));
                    //setDropAreaForTechName($this.find(".techOperationsDropArea").last(), fieldId);
                    $this.find(".techNodesDropArea").each(function () {
                        setDropAreaForTechNode($(this), fieldId);
                    })
                    setDropAreaForTechOperation($this.find(".techOperationsDropArea"), fieldId);
                }else {
                    if (operations.length)
                        operations.forEach(function (_operation) {
                            $placeholder.append(combineTechOperation(_operation));
                            setDropAreaForTechNode($placeholder.find(".techNodesDropArea").last(), fieldId);
                        });
                }

                setToggler(fieldId);
                if (isTechNameAlreadyHere){
                    $placeholder.parent().find("span.caret").first().not(".caret-down").trigger("click");
                    $placeholder.find(".techOperation").each(function () {
                        let $operationField = $(this);
                        if (!$operationField.find("span").first().hasClass("caret-down")) $operationField.find("span").first().trigger("click");
                    });
                }else{
                    $this.find(".techNameDropped").last().find("span").first().trigger("click");
                    $this.find(".techOperation").each(function () {
                        let $operationField = $(this);
                        if (!$operationField.find("span").first().hasClass("caret-down")) $operationField.find("span").first().trigger("click");
                    });
                }

                return;
            }

            // если перенесенный узел - тип техпроцесса
            let name = $draggable.find("span.caret").first().text();
            $this.append(combineTechName({
                name: name,
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl"),
                operations: []
            }));

            let techNodesDropArea = $(".techNodesDropArea").last();
            setDropAreaForTechNode(techNodesDropArea, fieldId);

            techNodesDropArea.find(".techFieldsDropArea").each(function () {
                setDropAreaForTechFields($(this))
            });

            setDropAreaForTechOperation($this.find(".techOperationsDropArea"), fieldId);

            setActionToBar({
                id: `addNewTechProcess`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `Добавлен техпроцесс '${name}'`
            });

            setToggler(fieldId);
            $this.find(".techNameDropped").last().find("span").first().trigger("click");
        }
    });

    $techNameDropArea.sortable({
        items: ".techNameDropped",
        axis: 'y',
        stop: function (e, ui) {
            // сортировка техпроцесса
            if ( Math.abs(Number(ui.originalPosition.top - ui.position.top)) <=  18 ){
                //console.log("Not enough to mark sortable");
                return;
            }
            let techProcess = $(ui.item).find("span.caret").first().text();
            setActionToBar({
                id: `moveTechProcess`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Техпроцесс '${techProcess}' был перемещен`
            });
        }
    });
    $techNameDropArea.disableSelection();

    /*$techNameDropArea.find(".techOperation").each(function () {
        setDropAreaForTechOperation($(this), fieldId);
    })*/

}

function setDropAreaForTechOperation($techOperationsDropArea, fieldId) {
    // создаёт зону droppable в узле типа техоперации

    /*$techOperationsDropArea.droppable({
        tolerance: "pointer",
        accept: ".techOperationsGuide, .techOperationNodesGuide",
        greedy: true,
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $(this);
            let name = $draggable.find("span").first().text();

            if ($draggable.hasClass("techOperationNodesGuide")){
                let operations = [];
                let $operations = $draggable.find(".techOperationsGuide");
                if ($operations.length)
                    $operations.each(function () {
                        let $operation = $(this);
                        let operationName = $operation.find("span").first().text();
                        $this.append(combineTechOperation({
                            name: operationName,
                            id: $operation.attr("tech-id"),
                            lvl: $operation.attr("tech-lvl")
                        }));
                        setActionToBar({
                            id: `addNewTechOperation`,
                            type: "addNew",
                            field: "Рабочий стол. Техпроцесс",
                            text: `Добавлена техоперация '${operationName}'`
                        });
                        setDropAreaForTechNode($this.find(".techNodesDropArea").last());
                    });

                setToggler(fieldId);
                $this.find(".techOperation").each(function () {
                   let $operationField = $(this);
                   if (!$operationField.find("span").first().hasClass("caret-down")) $operationField.find("span").first().trigger("click");
                });

                return;
            }

            $this.append(combineTechOperation({
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl"),
                name: getTechField($draggable.attr("tech-id"), 3).name,
                nodes: []
            }));

            setDropAreaForTechNode($this.find(".techNodesDropArea"), fieldId);

            setActionToBar({
                id: `addNewTechOperation`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `Добавлена техоперация '${name}'`
            });

            setToggler(fieldId);
            $this.find(".techOperation").last().find("span").first().trigger("click");
        }
    });*/

    $techOperationsDropArea.sortable({
        items: ".techOperation",
        axis: 'y',
        stop: function (e, ui) {
            // сортировка техпроцесса
            if ( Math.abs(Number(ui.originalPosition.top - ui.position.top)) <=  18 ){
                //console.log("Not enough to mark sortable");
                return;
            }
            let techProcess = $(ui.item).find("span.caret").first().text();
            setActionToBar({
                id: `moveTechProcess`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Техпроцесс '${techProcess}' был перемещен`
            });
        }
    });
    $techOperationsDropArea.disableSelection();
}

function setDropAreaForTechNode($techNodesDropArea, fieldId) {
    // создаёт зону droppable в узле техоперации

    $techNodesDropArea.droppable({
        tolerance: "pointer",
        accept: ".operationName, .instruments_list_li",
        greedy: true,
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            if ($draggable.find("span").first().text() === "Техоперации") return;
            let $this = $(this);
            let fields = [];
            let parent_name = $this.parent().find("span").first().text();

            // если перенесенный узел - конечное поле
            if ($draggable.hasClass("instruments_list_li")){
                let $techNode = $draggable.parent().parent();
                let techNodeName = $techNode.find("span").first().text();
                let techFieldName = $draggable.find("span").first().text();

                // проверка на то, относится ли перенесенной узел к типу техпроцесса в который его перенесли
                let techNameDraggableId = Number($techNode.parent().parent().attr("tech-id"));
                let thisTechNameId = Number($techNodesDropArea.parent().parent().parent().attr("tech-id"));
                if (thisTechNameId !== techNameDraggableId){
                    generateNotification({
                        mainHeader: "Рабочий стол. Техпроцесс",
                        extraHeader:``,
                        text: `Данный узел отностится к другому типу техпроцесса`
                    }, false, 2000);
                    return;
                }

                let field = {
                    name: techFieldName,
                    id: $draggable.attr("tech-id"),
                    lvl: $draggable.attr("tech-lvl")
                };

                let $techNameUl = $this.parent().find(".techNodesDropArea");
                let $techNodes = $techNameUl.find(".techNode");
                let $placeholder;
                let isThatNodeAlreadyThere = false;
                if ($techNodes.length){
                    $techNodes.each(function () {
                        let _techNode = $(this);
                        if (_techNode.attr("tech-id") === $techNode.attr("tech-id")){
                            $placeholder = _techNode.find("ul").first();
                            isThatNodeAlreadyThere = true;
                        }

                    });
                }

                if (isThatNodeAlreadyThere){
                    $placeholder.append(combineTechField(field));
                    $placeholder.parent().find("span").first().each(function () {
                        let $this = $(this);
                        if (!$this.hasClass("caret-down")) $this.trigger("click");
                    });
                }else {
                    $this.append(combineTechNode({
                        name: techNodeName,
                        id: $techNode.attr("tech-id"),
                        lvl: $techNode.attr("tech-lvl"),
                        fields: [
                            field
                        ]
                    }));

                    setDropAreaForTechFields($this.find(".techFieldsDropArea").last());
                    setToggler(fieldId);
                    $this.find(".techNode").last().find("span").first().trigger("click");
                }

                setActionToBar({
                    id: `addNewTechField`,
                    type: "addNew",
                    field: "Рабочий стол. Техпроцесс",
                    text: `В узел '${techNodeName}' добавлено поле '${techFieldName}'`
                });

                return;
            }

            // проверка на то, относится ли перенесенная группа к типу техпроцесса в который её перенесли
            let techNameDraggableId = Number($draggable.parent().parent().attr("tech-id"));
            let thisTechNameId = Number($techNodesDropArea.parent().parent().parent().attr("tech-id"));
            if (thisTechNameId !== techNameDraggableId){
                generateNotification({
                    mainHeader: "Рабочий стол. Техпроцесс",
                    extraHeader:``,
                    text: `Данный узел отностится к другому типу техпроцесса`
                }, false, 2000);
                return;
            }

            // находим, есть ли в techNodesDropArea techNode с таким же tech-id как и у перенесенного
            let $placeholder;
            let isThatNodeAlreadyThere = false;
            let $techNodes = $this.parent().find(".techNode");
            if ($techNodes.length)
                $techNodes.each(function () {
                   let $node = $(this);
                   if ($node.attr("tech-id") === $draggable.attr("tech-id"))
                       {
                           $placeholder = $node.find(".techFieldsDropArea");
                           isThatNodeAlreadyThere = true;
                       }
                });
            $draggable.find(".instruments_list_li").each(function () {
                let $this = $(this);
                fields.push({
                    name: $this.find("span").first().text(),
                    id: $this.attr("tech-id"),
                    lvl: $this.attr("tech-lvl")
                })
            });

            let name = $draggable.find("span.caret").first().text();

            if (isThatNodeAlreadyThere){
                if (fields.length)
                    fields.forEach(function (_field) {
                        $placeholder.append(combineTechField(_field));
                    });
                $placeholder.parent().find("span").first().each(function () {
                    let $this = $(this);
                    if (!$this.hasClass("caret-down")) $this.trigger("click");
                });

                setActionToBar({
                    id: `addNewTechNode`,
                    type: "addNew",
                    field: "Рабочий стол. Техпроцесс",
                    text: `В техпроцесс '${parent_name}' добавлен узел '${name}'`
                });

            }else {
                let node = combineTechNode({
                    name: name,
                    id: $draggable.attr("tech-id"),
                    lvl: $draggable.attr("tech-lvl"),
                    fields: fields
                });
                $this.append(node);
                setDropAreaForTechFields($this.find(".techFieldsDropArea").last());

                setToggler(fieldId);
                $this.find(".techNode").last().find("span").first().trigger("click");

                setActionToBar({
                    id: `addNewTechNode`,
                    type: "addNew",
                    field: "Рабочий стол. Техпроцесс",
                    text: `В техпроцесс '${parent_name}' добавлен узел '${name}'`
                });
            }

            //$container.find(".techNameDropped").last().find(".caret").first().trigger("click");
        }
    });

    $techNodesDropArea.sortable({
        items: ".techNode",
        axis: 'y',
        connectWith: ".techNodesDropArea",
        stop: function (e, ui) {
            if ( Math.abs(Number(ui.originalPosition.top - ui.position.top)) <=  20 ){
                //console.log("Not enough to mark sortable");
                return;
            }
            let techNode = $(ui.item).find("span.caret").first().text();
            let techProcess = $(ui.item).parent().parent().find("span.caret").first().text();
            setActionToBar({
                id: `moveTechNode`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Узел '${techNode}' техпроцесса '${techProcess}' был перемещен`
            });
        }
    });
    $techNodesDropArea.disableSelection();

    setDropAreaForTechFields($techNodesDropArea.find(".techFieldsDropArea"), fieldId)
}

function setDropAreaForTechFields($techFieldsDropArea) {
    // создаёт зону droppable в узле группы (node)

    /*$techFieldsDropArea.droppable({
        tolerance: "touch",
        accept: ".instruments_list_li",
        cancel: ".techOperationsGuide",
        greedy: true,
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $(this);
            let name = $draggable.find("span").first().text();
            let parent_name = $this.parent().find("span").first().text();
            let field = combineTechField({
                name: name,
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl")
            });
            $this.append(field);

            setActionToBar({
                id: `addNewTechField`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `В узел '${parent_name}' добавлено поле '${name}'`
            });

            //setToggler();
            //$container.find(".techNameDropped").last().find(".caret").first().trigger("click");
        }
    });*/

    $techFieldsDropArea.sortable({
        items: "li",
        axis: 'y',
        stop: function (e, ui) {
            if ( Math.abs(Number(ui.originalPosition.top - ui.position.top)) <=  15 ){
                //console.log("Not enough to mark sortable");
                return;
            }

            let $techNode = $(ui.item).parent().parent();
            let techNode = $techNode.find("span.caret").first().text();
            let techProcess = $techNode.parent().parent().find("span.caret").first().text();
            let techField = $(ui.item).find("span").first().text();
            setActionToBar({
                id: `moveTechField`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Поле '${techField}' узла '${techNode}' техпроцесса '${techProcess}' было перемещено`
            });
        }
    });
    $techFieldsDropArea.find(".techFieldsDropArea").disableSelection();

}

function getTechName(id, lvl) {
    let tchNm = {};
    techGuideJson.forEach(function (techName) {
        if (techName.id.toString() == id.toString())
            tchNm = techName;
    });
    if (lvl == "new")
        tchNm = {
            id: id,
            lvl: "new",
            name: `Техпроцесс ${id - diffOfTechProcess}`,
            operationNames: []
        };
    return tchNm;
}

function getTechNode(id, lvl){
    let _techNode = {};
    techGuideJson.forEach(function (techName) {
        techName.children.forEach(function (techNode) {
            if (techNode.id.toString() == id){
                //console.log(techNode);
                _techNode = techNode;
            }
        })
    });
    return _techNode;
}

function getTechField(id, lvl) {
    let _techField = {};
    techGuideJson.forEach(function (techName) {
        techName.children.forEach(function (techNode) {
            techNode.fields.forEach(function (techField) {
                if (techField.id == id)
                    _techField = techField;
            })
        })
    });

    return _techField;
}

function deleteKnot($this, isRouteMap = false) {
    let $container = $this.parent();
    let lvl = $container.attr("tech-lvl");
    let text = '';
    let name = $container.find("span").first().text();
    let id = "";
    let field = (!isRouteMap) ? `Рабочий стол. Техпроцесс` : `Маршрутная карта`;
    if (lvl == 1 || lvl == "new"){
        id = "deleteTechProcess";
        text = (!isRouteMap) ? `Техпроцесс '${name}' был удален`: `Поле '${name}' было удалено`;
    }
    if (lvl == 2){
        id = "deleteTechNode";
        text = `Узел '${name}' был удален`;
    }
    if (lvl == 3){
        id = "deleteTechField";
        text = `Поле '${name}' было удалено`;
    }
    if (lvl === "0"){
        let detailId = Number($container.attr("detail-id"));
        id = "deleteDetailNode";
        text = `Деталь '${getDetailById(detailId).name.replace(/"/g, "")}' была удалена`;
    }

    setActionToBar({
        id: id,
        type: "delete",
        field: field,
        text: text
    });

    $container.remove();
}

function addNewTechProcess(fieldId) {
    let tech_process_field_drop = $("#tech_process_field_drop");
    let techNameDropped = tech_process_field_drop.find(".techNameDropped");
    let id = techNameDropped.length + 1;
    tech_process_field_drop.append(combineTechName({
        name: `Техпроцесс ${id}`,
        id: (Number(id) + diffOfTechProcess).toString(),
        lvl: "new",
        operations: []
    }));
    //setDropAreaForTechOperation(tech_process_field_drop.find(".techNameDropped").last().find(".techOperationsDropArea"), fieldId);
    setToggler(fieldId);

    tech_process_field_drop.find(".techNameDropped").last().find("span").first().trigger("click");

    setActionToBar({
        id: `addNewTechProcess`,
        type: "addNew",
        field: "Рабочий стол. Техпроцесс",
        text: `Добавлен техпроцесс 'Техпроцесс ${id}'`
    });
}

function collectDataFromTechProcess(detailsDropArea) {
    let detailsJSON = {
        data: []
    };
    detailsDropArea.find(".detailDraggableDropped").each(function () {
        let this_detail = $(this);
        let _text = this_detail.find(".editInput").val();
        if (_text === undefined) _text = this_detail.find("span.caret").first().text();
        let detail = {
            id: this_detail.attr("detail-id"),
            lvl: this_detail.attr("tech-lvl"),
            text: _text,
            techProcess: []
        }
        let $techNames = this_detail.find(".techNameDropped");
        $techNames.each(function () {
            let this_tech_name = $(this);
            let _text = this_tech_name.find(".editInput").val();
            if (_text === undefined) _text = this_tech_name.find("span.caret").first().text();
            let techName = {
                id: this_tech_name.attr("tech-id"),
                lvl: this_tech_name.attr("tech-lvl"),
                text: _text,
                operations: []
            };
            let operations = this_tech_name.find(".techOperation");
            if (operations.length)
                operations.each(function () {
                    let this_operation = $(this);
                    let _text = this_operation.find(".editInput").val();
                    if (_text === undefined) _text = this_operation.find("span.caret").first().text();
                    let newOperation = {
                        id: this_operation.attr("tech-id"),
                        lvl: this_operation.attr("tech-lvl"),
                        text: _text,
                        nodes: []
                    };
                    let nodes = this_operation.find(".techNode");
                    if (nodes.length){
                        nodes.each(function () {
                            let this_node = $(this);
                            let _text = this_node.find(".editInput").val();
                            if (_text === undefined) _text = this_node.find("span.caret").first().text();
                            let newNode = {
                                id: this_node.attr("tech-id"),
                                lvl: this_node.attr("tech-lvl"),
                                text: _text,
                                fields: []
                            };

                            let fields = this_node.find(".techField");
                            if (fields.length)
                                fields.each(function () {
                                    let this_field = $(this);
                                    let _text = this_field.find(".editInput").val();
                                    if (_text === undefined) _text = this_field.find("span").first().text();
                                    newNode.fields.push({
                                        id: this_field.attr("tech-id"),
                                        lvl: this_field.attr("tech-lvl"),
                                        text: _text
                                    })
                                });

                            newOperation.nodes.push(newNode)
                        })
                    }
                    techName.operations.push(newOperation);
                });

            detail.techProcess.push(techName);
        });
        detailsJSON.data.push(detail);
    });
    return detailsJSON;
}

function saveTechProcess(thisButton) {
    let detailsJSON = collectDataFromTechProcess($("#tech_process_field_container").find(".detailsDropArea"));
    console.log(detailsJSON);
    startProcessOfSaving(thisButton, false);
    $.ajax(
        {
            url: 'ajax/save_techproccess',
            type: 'POST',
            data: detailsJSON,
            success: function (data) {
                console.log(data);
                madeRouteMapByTechProcess(detailsJSON);
                stopProcessOfSaving(thisButton, false);
                setActionToBar({
                    id: "saveTechProcess",
                    type: "save",
                    field: "Рабочий стол. Техпроцесс",
                    text: `Сохранение техпроцесса`
                });

                triggerToDoTaskEvent("saveTechProcess")
            },
            error: function (response) {
                console.log(response)
            }
        }
    );
}

function toggleEditNodeForTechProcess($this) {
    let isActive = $this.attr("is-active").toString();
    let $parentLi = $this.parent();
    if (isActive !== "true"){
        // edit
        $parentLi.find("span").first().addClass("d-none").removeClass("d-initial")
        $parentLi.find("input.editInput").first().removeClass("d-none").focus();
        $this.attr("is-active", true);
    }else{
        // end editing
        let $nameSpan = $parentLi.find("span").first();
        let $input = $parentLi.find("input.editInput").first();
        $nameSpan.removeClass("d-none").addClass("d-initial");
        $input.addClass("d-none");
        $nameSpan.text($input.val())
        $this.attr("is-active", false);
    }

}

function setToggler(id = "tech_process_field_drop") {
    let toggler = document.getElementById(id).getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        let f = function (){
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        };
        $(toggler[i]).unbind("click");
        $(toggler[i]).click(f);
    }
}
