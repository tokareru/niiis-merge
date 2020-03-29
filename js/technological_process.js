const diffOfTechProcess = 1000;

function technologicalProcessInit() {
    let $container = $("#tech_process_field_drop");
    let tech_process_table = $("#tech_process_table");
    $("#tabs li[aria-controls=\"technological_process_field\"]").on("click", function () {
        $("#tech_process_field_drop").addClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("enable");
        $("#tech_process_table").removeClass("tech_process_table");
        //$("#tech_process_table").droppable("disable");
    });

    if (Role !== "technologist"){
        $("#tech_process_field_save_button").remove();
        $("#tech_process_field_add_node_button").remove();
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

}

function downloadTechProcess($container, fieldId) {
    // json/tech_process.json
    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        success: function (json) {
            console.log(json);
            let $field = $("#tech_process_field_drop");
            if (json.techProcess != undefined){
                if (json.techProcess.length){
                    setAllTechProcess(json, $("#tech_process_field_drop"), "tech_process_field_drop");
                    /*$container.find(".techNameDropped").each(function () {
                        $(this).find(".caret").first().trigger("click");
                    });*/
                }
            }
            if (Role === "technologist"){
                setDropAreaForTechName($("#tech_process_field_drop"), fieldId);
                $(".techNodesDropArea").each(function () {
                    setDropAreaForTechNode($(this), fieldId)
                });

                $(".techFieldsDropArea").each(function () {
                    setDropAreaForTechFields($(this))
                });

                $("#tech_process_field_add_node_button").click(function () {
                    addNewTechProcess("#tech_process_field_drop");
                });

                $container.mousedown(function (event) {
                    event.preventDefault();
                    if (event.which === 2 && Role === "technologist") addNewTechProcess("#tech_process_field_drop");
                });

                $("#tech_process_field_save_button").click(function () {
                    saveTechProcess();
                })
            }

        }
    });
}

function setAllTechProcess(json, $field_drop, fieldId) {
    json.techProcess.forEach(function (techName) {
        let techNameGuide = getTechName(techName.id, techName.lvl).name;
        // находим заданные для этого техпроцесса узлы
        let techNodeGuideNamesArray = [];
        techName.children.forEach(function (node) {
            // находим заданные поля для найденных узлов
            let innerFields = [];
            node.fields.forEach(function (_field) {
               innerFields.push({
                   name: getTechField(_field.id, _field.lvl).name,
                   id: _field.id,
                   lvl: _field.lvl
               });
            });

            techNodeGuideNamesArray.push({
                name: getTechNode(node.id, node.lvl).name,
                id: node.id,
                lvl: node.lvl,
                fields: innerFields
            });
        });
        //console.log(techNodeGuideNamesArray);

        let techProcess = {
            "name": techNameGuide,
            "id": techName.id,
            "lvl": techName.lvl,
            "children": techNodeGuideNamesArray
        };
        setTechProcess($field_drop, techProcess);
        setToggler(fieldId)

    });
}

function setTechProcess($container, data = {name: "", children: []}) {
    let nodes = "";
    if (data.children.length)
        data.children.forEach(function (_node) {
            nodes += combineTechNode(_node);
        });

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";
    $container.append(`
        <li class='techNameDropped' tech-id='${data.id}' tech-lvl='${data.lvl}'>
            <span class='caret'>${data.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom pb-2 myNested techNodesDropArea'>
                ${nodes}
            </ul>
        </li>
    `)
}

function combineTechNode(node) {
    let fields = "";
    // получаем поля
    if (node.fields.length){
        node.fields.forEach(function (_field) {
            fields += combineTechField(_field);
        })
    }

    let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : "";

    let _node = `
        <li class="techNode" tech-lvl="${node.lvl}" tech-id="${node.id}">
            <span class="caret">${node.name}</span>${deleteButton}
            <ul style='min-height: 35px;' class='nested border-bottom pb-2 myNested techFieldsDropArea'>
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

function setDropAreaForTechName($techNameDropArea, fieldId) {
    $techNameDropArea.droppable({
        tolerance: "touch",
        accept: ".techName",
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $(this);
            let nodes = [];
            $draggable.find(".operationName").each(function () {
                let $ul = $(this);
                let fields = [];
                $ul.find(".operationNameUl li").each(function () {
                    let $this = $(this);
                    fields.push({
                        name: $this.find("span").first().text(),
                        id: $this.attr("tech-lvl"),
                        lvl: $this.attr("tech-id")
                    })
                });
                nodes.push({
                    name: $ul.find("span.caret").first().text(),
                    id: $ul.attr("tech-id"),
                    lvl: $ul.attr("tech-lvl"),
                    fields: fields
                })
            });

            let name = $draggable.find("span.caret").first().text();
            setTechProcess($("#tech_process_field_drop"), {
                name: name,
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl"),
                children: nodes
            });

            let techNodesDropArea = $(".techNodesDropArea").last();
            setDropAreaForTechNode(techNodesDropArea, fieldId);

            techNodesDropArea.find(".techFieldsDropArea").each(function () {
                setDropAreaForTechFields($(this))
            });

            setActionToBar({
                id: `addNewTechProcess`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `Добавлен техпроцесс '${name}'`
            });

            setToggler(fieldId);
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

function setDropAreaForTechNode($techNodesDropArea, fieldId) {
    $techNodesDropArea.droppable({
        tolerance: "touch",
        accept: ".operationName",
        drop: function (event, ui) {
            let $draggable = $(ui.draggable);
            let $this = $(this);
            let fields = [];
            let parent_name = $this.parent().find("span").first().text();
            $draggable.find(".instruments_list_li").each(function () {
                let $this = $(this);
                fields.push({
                    name: $this.find("span").first().text(),
                    id: $this.attr("tech-lvl"),
                    lvl: $this.attr("tech-id")
                })
            });
            let name = $draggable.find("span.caret").first().text();
            let node = combineTechNode({
                name: name,
                id: $draggable.attr("tech-id"),
                lvl: $draggable.attr("tech-lvl"),
                fields: fields
            });
            $this.append(node);
            setDropAreaForTechFields($this.find(".techFieldsDropArea").last());

            setToggler(fieldId);

            setActionToBar({
                id: `addNewTechNode`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `В техпроцесс '${parent_name}' добавлена узел '${name}'`
            });

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
            $this.append(field)

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
        children: []
    });
    setDropAreaForTechNode(tech_process_field_drop.find(".techNameDropped").last().find(".techNodesDropArea"), fieldId);
    setToggler(fieldId);

    setActionToBar({
        id: `addNewTechProcess`,
        type: "addNew",
        field: "Рабочий стол. Техпроцесс",
        text: `Добавлен техпроцесс 'Техпроцесс ${id}'`
    });
}

function saveTechProcess() {
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
            children: []
        };
        let nodes = this_tech_name.find(".techNode");
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

                techName.children.push(newNode)
            })
        }
        json.techProcess.push(techName);
    });
    console.log(json);

    $.ajax(
        {
            url: 'ajax/save_techproccess',
            type: 'POST',
            data: json,
            success: function (data) {
                console.log(data);

                setActionToBar({
                    id: "saveTechProcess",
                    type: "save",
                    field: "Рабочий стол. Техпроцесс",
                    text: `Сохранение техпроцесса`
                });
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
