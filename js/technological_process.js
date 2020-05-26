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

    reloadButton.on("click", function () {
        $(".techNameDropped").remove();
        let thisButton = this;
        startProcessOfSaving(thisButton);
        downloadTechProcess($container, "tech_process_field_drop").then(function () {
            stopProcessOfSaving(thisButton);
        });
    });

    saveButton.click(function () {
        saveTechProcess(this);
    })

}

async function downloadTechProcess($container, fieldId) {
    // json/tech_process.json
    // json/new_techprocess.json
    // ajax/get_techproccess
    $.ajax({
        url: 'json/new_techprocess.json',
        type: 'GET',
        success: function (json) {
            setDetailsArea(json, $("#tech_process_field_drop"), "tech_process_field_drop");
        }
    });
}

function setDetailsArea(json, $field, fieldId) {
    if (json.data != undefined){
            if (json.data.length){
            if (json.data.length)
                json.data.forEach(function (_detailArea) {
                    let detail = getDetailById(_detailArea.id)
                    $field.append(combineDetailArea({
                        name: `${(detail.designation.replace(/ /g, "") === "") ? "" : (detail.designation + " - ")}${detail.name}`,
                        id: _detailArea.id,
                        lvl: 0,
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
        setDropAreaForDetailArea($(".detailsDropArea"), fieldId);
        $(".techProcessDropArea").each(function () {
            setDropAreaForTechName($(this), fieldId);
        });

        /*$(".techOperationsDropArea").each(function () {
            setDropAreaForTechOperation($(this), fieldId)
        });*/

        $(".techNodesDropArea").each(function () {
            setDropAreaForTechNode($(this), fieldId)
        })

        setToggler(fieldId);
        $(".detailDraggableDropped").find("span.caret").trigger("click")
    }
}

function setAllTechProcess(json, $field_drop, fieldId) {
    json.techProcess.forEach(function (techName) {
        let techNameGuide = getTechName(techName.id, techName.lvl).name;
        // находим заданные для этого техпроцесса узлы
        let techNodeGuideNamesArray = [];
        techName.operations.forEach(function (operation) {
            // находим заданные поля для найденных узлов
            let innerNodes = [];
            operation.nodes.forEach(function (_node) {
               innerNodes.push({
                   name: getTechNode(_node.id, _node.lvl).name,
                   id: _node.id,
                   lvl: _node.lvl,
                   fields: _node.fields
               });
            });
            techNodeGuideNamesArray.push({
                name: getTechField(operation.id, operation.lvl).name,
                id: operation.id,
                lvl: operation.lvl,
                nodes: innerNodes
            });
        });
        //console.log(techNodeGuideNamesArray);

        let techProcess = {
            "name": techNameGuide,
            "id": techName.id,
            "lvl": techName.lvl,
            "operations": techNodeGuideNamesArray
        };
        setTechProcess($field_drop, techProcess);
        setToggler(fieldId);
        $field_drop.find(".techNameDropped ").last().find("span").first().trigger("click");
        $field_drop.find(".techNameDropped ").last().find(".techOperation").each(function () {
                $(this).find("span").first().trigger("click");
        })

    });
}

function combineDetailArea(_detail = {name: "", id: 0, lvl: 0, techProcess: []}) {
    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
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
                operations: _techName.operations
            });
        })

    return `
        <li detail-id="${_detail.id}" class="detailDraggableDropped">
            <span class="caret">${_detail.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom border-bottom-color-gray pb-2
             myNested techProcessDropArea border border-color-transparent rounded'>
                ${techNames}
            </ul>
        </li>
    `

}

function setTechProcess($container, data = {name: "", operations: []}) {
    let operations = "";
    if (data.operations.length)
        data.operations.forEach(function (_operataion) {
            operations += combineTechOperation(_operataion);
        });

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
    $container.append(`
        <li class='techNameDropped' tech-id='${data.id}' tech-lvl='${data.lvl}'>
            <span class='caret'>${data.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom border-bottom-color-gray pb-2 myNested techOperationsDropArea border border-color-transparent rounded'>
                ${operations}
            </ul>
        </li>
    `)
}

function combineTechName(techName = {name: "", id: "", lvl: "", operations: []}, isDeleted) {
    let operations = "";
    let shift = "";
    if (techName.shift !== undefined)
        shift = `tech-shift="${techName.shift}"`;

    if (techName.operations.length)
        techName.operations.forEach(function (_operataion) {
            operations += combineTechOperation({
                name: getTechField(_operataion.id, _operataion.lvl).name,
                id: _operataion.id,
                lvl: _operataion.lvl,
                nodes: _operataion.nodes
            }, isDeleted);
        });

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";

    return `
        <li ${shift} class='techNameDropped' tech-id='${techName.id}' tech-lvl='${techName.lvl}'>
            <span class='caret'>${techName.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom pb-2 border-bottom-color-gray myNested techOperationsDropArea border border-color-transparent rounded'>
                ${operations}
            </ul>
        </li>
    `
}

function combineTechOperation(field, isDeleted) {
    let deleteButton = (Role === "technologist" || (isDeleted !== undefined && isDeleted)) ? `<span class='deleteNodeButtonRM'></span>` : "";
    let innerNodes = "";
    if (field.nodes !== undefined)
        if(field.nodes.length)
            field.nodes.forEach(function (_node) {
                innerNodes += combineTechNode({
                    name: getTechNode(_node.id, _node.lvl).name,
                    id: _node.id,
                    lvl: _node.lvl,
                    fields: _node.fields
                });
            });

    return `
        <li class="techOperation" tech-lvl="${field.lvl}" tech-id="${field.id}">
            <span class="mr-2 caret">${field.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class="nested border-bottom techNodesDropArea border border-color-transparent rounded">
                ${innerNodes}
            </ul>
        </li>
    `;
}

function combineTechNode(node) {
    let fields = "";
    // получаем поля
    if (node.fields.length){
        node.fields.forEach(function (_field) {
            fields += combineTechField(getTechField(_field.id, _field.lvl));
        })
    }

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";

    let _node = `
        <li class="techNode" tech-lvl="${node.lvl}" tech-id="${node.id}">
            <span class="caret">${node.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom border-bottom-color-gray pb-2 myNested techFieldsDropArea border border-color-transparent rounded'>
                ${fields}
            </ul>
        </li>
    `;
    return _node;
}

function combineTechField(field) {
    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
    return `
        <li class="techField" tech-lvl="${field.lvl}" tech-id="${field.id}">
            <span class="mr-2">${field.name}</span>${deleteButton}
        </li>
    `;
}

function setDropAreaForDetailArea($detailsDropArea, fieldId) {
    // .detailsDropArea
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
            setDropAreaForTechName($detailsDropArea.find(".techProcessDropArea").last(), fieldId)
            setToggler(fieldId);
            $(".detailDraggableDropped").last().find("span.caret").trigger("click")
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
            /*let techProcess = $(ui.item).find("span.caret").first().text();
            setActionToBar({
                id: `moveTechProcess`,
                type: "move",
                field: "Рабочий стол. Техпроцесс",
                text: `Техпроцесс '${techProcess}' был перемещен`
            });*/
        }
    });
    $detailsDropArea.disableSelection();
}

function setDropAreaForTechName($techNameDropArea, fieldId) {
    $techNameDropArea.droppable({
        tolerance: "pointer",
        accept: ".techName, .techOperationsGuide, .techOperationNodesGuide",
        greedy: true,
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $techNameDropArea;

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
                    setTechProcess($this, {
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
                    });
                    //setDropAreaForTechOperation($this.find(".techOperationsDropArea").last(), fieldId);
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
                }

                setActionToBar({
                    id: `addNewTechOperation`,
                    type: "addNew",
                    field: "Рабочий стол. Техпроцесс",
                    text: `Добавлена техоперация '${techOperationName}'`
                });

                return;
            }

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
                    setTechProcess($this, {
                        name: techName,
                        id: $techName.attr("tech-id"),
                        lvl: $techName.attr("tech-lvl"),
                        operations: operations
                    });
                    //setDropAreaForTechName($this.find(".techOperationsDropArea").last(), fieldId);
                    $this.find(".techNodesDropArea").each(function () {
                        setDropAreaForTechNode($(this), fieldId);
                    })
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

            let name = $draggable.find("span.caret").first().text();
            setTechProcess($this, {
                name: name,
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl"),
                operations: []
            });

            /*let techNodesDropArea = $(".techNodesDropArea").last();
            setDropAreaForTechNode(techNodesDropArea, fieldId);

            techNodesDropArea.find(".techFieldsDropArea").each(function () {
                setDropAreaForTechFields($(this))
            });*/

            //setDropAreaForTechOperation($this.find(".techOperationsDropArea"), fieldId);

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

}

function setDropAreaForTechOperation($techOperationsDropArea, fieldId) {
    $techOperationsDropArea.droppable({
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
    });

    $techOperationsDropArea.sortable({
        items: ".techOperation",
        axis: 'y',
        connectWith: ".techOperationsDropArea",
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

            if ($draggable.hasClass("instruments_list_li")){
                let $techNode = $draggable.parent().parent();
                let techNodeName = $techNode.find("span").first().text();
                let techFieldName = $draggable.find("span").first().text();
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

                    //setDropAreaForTechFields($this.find(".techFieldsDropArea").last());
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
                //setDropAreaForTechFields($this.find(".techFieldsDropArea").last());

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
}

function setDropAreaForTechFields($techFieldsDropArea) {
    $techFieldsDropArea.droppable({
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
    });

    $techFieldsDropArea.sortable({
        items: "li",
        axis: 'y',
        connectWith: ".techFieldsDropArea",
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
    setTechProcess(tech_process_field_drop, {
        name: `Техпроцесс ${id}`,
        id: (Number(id) + diffOfTechProcess).toString(),
        lvl: "new",
        operations: []
    });
    setDropAreaForTechOperation(tech_process_field_drop.find(".techNameDropped").last().find(".techOperationsDropArea"), fieldId);
    setToggler(fieldId);

    tech_process_field_drop.find(".techNameDropped").last().find("span").first().trigger("click");

    setActionToBar({
        id: `addNewTechProcess`,
        type: "addNew",
        field: "Рабочий стол. Техпроцесс",
        text: `Добавлен техпроцесс 'Техпроцесс ${id}'`
    });
}

function saveTechProcess(thisButton) {
    let json = {
        techProcess: []
    };
    let $field = $("#tech_process_field_drop");
    let $techNames = $field.find(".techNameDropped");
    $techNames.each(function () {
        let this_tech_name = $(this);
        let techName = {
            id: this_tech_name.attr("tech-id"),
            lvl: this_tech_name.attr("tech-lvl"),
            operations: []
        };
        let operations = this_tech_name.find(".techOperation");
        if (operations.length)
            operations.each(function () {
                let this_operation = $(this);
                let newOperation = {
                    id: this_operation.attr("tech-id"),
                    lvl: this_operation.attr("tech-lvl"),
                    nodes: []
                };
                let nodes = this_operation.find(".techNode");
                if (nodes.length){
                    nodes.each(function () {
                        let this_node = $(this);
                        let newNode = {
                            id: this_node.attr("tech-id"),
                            lvl: this_node.attr("tech-lvl"),
                            fields: []
                        };

                        let fields = this_node.find(".techField");
                        if (fields.length)
                            fields.each(function () {
                                let this_field = $(this);
                                newNode.fields.push({
                                    id: this_field.attr("tech-id"),
                                    lvl: this_field.attr("tech-lvl")
                                })
                            });

                        newOperation.nodes.push(newNode)
                    })
                }
                techName.operations.push(newOperation);
            });

        json.techProcess.push(techName);
    });
    //console.log(json);
    startProcessOfSaving(thisButton, false);
    $.ajax(
        {
            url: 'ajax/save_techproccess',
            type: 'POST',
            data: json,
            success: function (data) {
                console.log(data);
                madeRouteMapByTechProcess(json);
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
