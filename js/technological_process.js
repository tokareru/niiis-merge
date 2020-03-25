function technologicalProcessInit() {
    let $container = $("#tech_process_field_drop");
    let tech_process_table = $("#tech_process_table");
    $("#tabs li[aria-controls=\"technological_process_field\"]").on("click", function () {
        $("#tech_process_field_drop").addClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("enable");
        $("#tech_process_table").removeClass("tech_process_table");
        //$("#tech_process_table").droppable("disable");
    });

    $.ajax({
        url: 'json/tech_process.json',
        type: 'GET',
        success: function (json) {
            let $field = $("#tech_process_field_drop");
            if (json.techProcess != undefined){
                if (json.techProcess.length){
                    setAllTechProcess(json);
                    setDropAreaForTechName($("#tech_process_field_drop"));
                    $(".techNodesDropArea").each(function () {
                        setDropAreaForTechNode($(this))
                    });

                    $(".techFieldsDropArea").each(function () {
                        setDropAreaForTechFields($(this))
                    });

                    $(".deleteNodeButtonRM").click(function () {
                        deleteKnot($(this))
                    });

                    $("#tech_process_field_add_node_button").click(function () {
                        addNewTechProcess();
                    });

                    $container.mousedown(function (event) {
                        event.preventDefault();
                        if (event.which === 2) addNewTechProcess();
                    });

                    $("#tech_process_field_save_button").click(function () {
                        saveTechProcess();
                    })

                    /*$container.find(".techNameDropped").each(function () {
                        $(this).find(".caret").first().trigger("click");
                    });*/
                }
            }

        }
    });
}


function setAllTechProcess(json) {
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
        setTechProcess($("#tech_process_field_drop"), techProcess);
        setToggler()

    });
}

function setTechProcess($container, data = {name: "", children: []}) {
    let deleteButton = "";
    let nodes = "";
    if (data.children.length)
        data.children.forEach(function (_node) {
            nodes += combineTechNode(_node);
        });

    $container.append(`
        <li class='techNameDropped' tech-id='${data.id}' tech-lvl='${data.lvl}'>
            <span class='caret'>${data.name}</span><span class='deleteNodeButtonRM'></span>
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

    let _node = `
        <li class="techNode" tech-lvl="${node.lvl}" tech-id="${node.id}">
            <span class="caret">${node.name}</span><span class='deleteNodeButtonRM'></span>
            <ul style='min-height: 35px;' class='nested border-bottom pb-2 myNested techFieldsDropArea'>
                ${fields}
            </ul>
        </li>
    `;
    return _node;
}

function combineTechField(field) {
    return `
        <li class="techField" tech-lvl="${field.lvl}" tech-id="${field.id}">
            <span class="mr-2">${field.name}</span><span class='deleteNodeButtonRM'></span>
        </li>
    `;
}

function setDropAreaForTechName($techNameDropArea) {
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
            setDropAreaForTechNode(techNodesDropArea);

            techNodesDropArea.find(".techFieldsDropArea").each(function () {
                setDropAreaForTechFields($(this))
            });

            $this.find(".deleteNodeButtonRM").click(function () {
                deleteKnot($(this));
            });

            setActionToBar({
                id: `addNewTechProcess`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `Добавлен техпроцесс '${name}'`
            });

            setToggler();
        }
    });

    $techNameDropArea.sortable({
        items: ".techNameDropped",
        axis: 'y',
        stop: function (e, ui) {
            // сортировка техпроцесса
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

function setDropAreaForTechNode($techNodesDropArea) {
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
            $this.find(".techNode").find(".deleteNodeButtonRM").click(function () {
                deleteKnot($(this));
            });
            setToggler();

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
            $this.find(".deleteNodeButtonRM").click(function () {
                deleteKnot($this);
            });

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
            name: `Техпроцесс ${id}`,
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

function deleteKnot($this) {
    let $container = $this.parent();
    let lvl = $container.attr("tech-lvl");
    let text = '';
    let name = $container.find("span").first().text();
    let id = "";
    if (lvl == 1 || lvl == "new"){
        id = "deleteTechProcess";
        text = `Техпроцесс '${name}' был удален`;
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
        field: "Рабочий стол. Техпроцесс",
        text: text
    });

    $container.remove();
}

function addNewTechProcess() {
    let tech_process_field_drop = $("#tech_process_field_drop");
    let techNameDropped = tech_process_field_drop.find(".techNameDropped");
    let id = techNameDropped.length + 1;
    setTechProcess(tech_process_field_drop, {
        name: `Техпроцесс ${id}`,
        id: id.toString(),
        lvl: "new",
        children: []
    });
    setDropAreaForTechNode(tech_process_field_drop.find(".techNameDropped").last().find(".techNodesDropArea"));
    setToggler();
    tech_process_field_drop.find(".techNameDropped").last().find(".deleteNodeButtonRM").click(function () {
        deleteKnot($(this))
    });

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

    /*$.ajax(
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
    );*/
}

function setToggler() {
    let toggler = document.getElementById("tech_process_field_drop").getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        let f = function (){
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        };
        $(toggler[i]).unbind("click");
        $(toggler[i]).click(f);
    }
}








function downloadTechProcess() {
    $.ajax({
        url: 'ajax/get_techproccess',
        type: 'GET',
        success: function (json) {
            let $field = $("#tech_process_field_drop");
            if (json.techProcess != undefined){
                if (json.techProcess.length){
                    json.techProcess.forEach(function (techName) {
                        let info = getTechName(techName.id, techName.lvl);
                        let operationNames = [];
                        let $operationNames = "";
                        if (techName.operationNames.length){
                            operationNames = getOperationNames(techName.operationNames);
                            $operationNames = combineOperationNames(operationNames);
                        }

                        let name = (techName.lvl.toString() == "new") ? ("Техпроцесс " + techName.id) : info.name;
                        let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : ``;
                        $field.append(`
                            <li class='techNameDropped' tech-id='${techName.id}' tech-lvl='${techName.lvl}'>
                                <span class='caret'>${name}</span>${deleteButton}
                                <ul style='min-height: 35px;' class='nested border-bottom pb-2 myNested operationNameDropArea'>
                                    ${$operationNames}
                                </ul>
                            </li>
                        `);

                        let $techNameDropped = $(".techNameDropped").last();

                        if (Role === "technologist")
                            setDeleteButtonToTechName($techNameDropped);
                        setDropAreaForTechName($(".operationNameDropArea").last());

                        if (Role === "technologist") {
                            let $li = $techNameDropped.find(".operationNameDropArea").find("li");
                            if ($li.length){
                                $li.each(function () {
                                    setDeleteButtonToOperationName($(this).find(".deleteNodeButtonRM").last())
                                })
                            }
                        }
                    });

                    if (Role === "technologist")
                        sortOperationNames();
                    setToggler();

                    $container.find(".techNameDropped").each(function () {
                        $(this).find(".caret").first().trigger("click");
                    });
                }
            }

        }
    });

    function getTechName(id, lvl) {
        let tchNm = {};
        techGuideJson.forEach(function (techName) {
            if (techName.lvl == lvl.toString() && techName.id == id.toString()) tchNm = techName;
        });
        if (lvl == "new")
            tchNm = {
                id: id,
                lvl: "new",
                operationNames: []
            };

        return tchNm;
    }

    function getOperationNames(operationNames){
        let operationNamesInfo = [];
        operationNames.forEach(function (_techName) {
            operationNamesInfo.push(getOperationNameInfo(_techName.id, _techName.lvl))
        });
        return operationNamesInfo;
    }

    function getOperationNameInfo(id, lvl) {
        let _operationName = {};
        techGuideJson.forEach(function (techName) {
            techName.children.forEach(function (operationName) {
                if (operationName.id == id && operationName.lvl == lvl)
                    _operationName = operationName;
                if (operationName.lvl == "new" && operationName.id == id)
                    _operationName = {
                        name: "",
                        id: operationName.id,
                        lvl: "new",
                        tools: operationName.tools,
                        equipment: operationName.equipment
                    }
            })
        });
        return _operationName;
    }

    function combineOperationNames(operationNames) {
        let $operationNames = "";
        let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : ``;
        operationNames.forEach(function (operationName) {
            $operationNames += `
            <li tech-lvl='${operationName.lvl}' tech-id='${operationName.lvl}' class='tpLI'>
            <span class='caret'>${operationName.name}</span>${deleteButton}
            <ul class='nested'>
            <table>
            <tbody>
            <tr><td><div>Оборудование:</div></td>
            <td><div class='ml-5 bg-white'>${operationName.equipment[0].name}</div></td>
            </tr>
            <tr><td><div>Инструменты:</div></td>
            <td><div class='ml-5 bg-white'>${operationName.tools[0].name}</div></td>
            </tr>
            </tbody>
            </table>
            </ul>
            </li>
            `
        });
        return $operationNames;
    }
}


function technologicalProcessInit1() {
    let $container = $("#tech_process_field_drop");
    let tech_process_table = $("#tech_process_table");
    $("#tabs li[aria-controls=\"technological_process_field\"]").on("click", function () {
        $("#tech_process_field_drop").addClass("tech_process_table");
        //$("#tech_process_field_drop").droppable("enable");
        $("#tech_process_table").removeClass("tech_process_table");
        //$("#tech_process_table").droppable("disable");
    });

    $container.addClass("tech_process_table");
    tech_process_table.removeClass("tech_process_table");

    if (Role !== "technologist")
        $.ajax({
            url: 'ajax/get_technologist_info',
            type: 'GET',
            success: function (techJson) {
                techGuideJson = techJson;
                downloadTechProcess();
            }
        });
    else downloadTechProcess();

    let tech_process_field_save_button = $("#tech_process_field_save_button");
    let tech_process_field_add_node_button = $("#tech_process_field_add_node_button");

    if (Role !== "technologist"){
        tech_process_field_save_button.remove();
        tech_process_field_add_node_button.remove();
    }else {
        tech_process_field_save_button.click(function () {
            saveTechProcess();
        });

        // добавить новый techName
        tech_process_field_add_node_button.click(function () {
            let $field = $("#tech_process_field_drop");
            let length = $container.find(".techNameDropped").length + 1;
            $field.append(`
            <li class='techNameDropped' tech-id='${length}' tech-lvl='new'>
                 <span class='caret'>Техпроцесс ${length}</span><span class='deleteNodeButtonRM'></span>
                 <ul style='min-height: 35px;' class='nested myNested border-bottom pb-2 operationNameDropArea'>
                 </ul>
            </li>
        `);

            setActionToBar({
                id: `addNewTechNameToTechProcess`,
                type: "addNew",
                field: "Рабочий стол. Техпроцесс",
                text: `В техпроцесс добавлен корневой узел 'Техпроцесс ${length}'`
            });

            let $techNameDropped = $(".techNameDropped").last();
            setDeleteButtonToTechName($techNameDropped);
            setDropAreaForTechName($(".operationNameDropArea").last());

            sortOperationNames();
            setToggler();

            $container.find(".techNameDropped").last().find(".caret").first().trigger("click");
        });

        // добавить новый techName по нажатию на среднею кнопку
        $container.mousedown(function (event) {
            event.preventDefault();
            if (event.which === 2) $("#tech_process_field_add_node_button").trigger("click");
        });

        $container.droppable(
            {
                tolerance: "touch",
                accept: ".techName",
                drop: function (event, ui) {

                    let $draggable = $(ui.draggable);

                    if ($draggable.hasClass("techName")) {
                        setTechName($draggable);
                    }
                    //setToggler();
                    //$container.find(".techNameDropped").last().find(".caret").first().trigger("click");
                }
            }
        );

        $(".tech_process_table").sortable({
            items: ".techNameDropped",
            axis: 'y'
        });
        $(".tech_process_table").disableSelection();
    }

    function setTechName($draggable) {
        let name = $draggable.find("span").first().text();
        $container.append(
            "<li tech-lvl='" + $draggable.attr("tech-lvl") + "' tech-id='" + $draggable.attr("tech-id") + "' class='techNameDropped'>" +
            "<span class='caret'>" + name + "</span><span class='deleteNodeButtonRM'></span>" +
            "<ul style='min-height: 35px;' class='nested myNested border-bottom pb-2 operationNameDropArea'></ul>" +
            "</li>"
        );

        setActionToBar({
            id: `addNewTechNameToTechProcess`,
            type: "addNew",
            field: "Рабочий стол. Техпроцесс",
            text: `В техпроцесс добавлен корневой узел '${name}'`
        });

        $(".deleteNodeButtonRM").last().click(function () {
           $(this).parent().remove();
           setActionToBar({
               id: "deleteTechNameFromTechProcess",
               type: "delete",
               field: "Рабочий стол. Техпроцесс",
               text: `Из техпроцесса удалён узел '${name}'`
           })
        });

        setDropAreaForTechName($(".operationNameDropArea").last());
        sortOperationNames();
        setToggler();
        $container.find(".techNameDropped").last().find(".caret").first().trigger("click");
    }

    function sortOperationNames() {
        let uls = $container.find('ul.operationNameDropArea');
        if (uls.length){
            uls.each(function () {
                $(this).sortable({
                    items: ".tpLI",
                    axis: 'y',
                    connectWith: ".operationNameDropArea",
                    stop: function (event, ui) {
                        let operationName = ui.item.find("span.caret").first().text();
                        setActionToBar({
                            id: `moveTechOperationInTechName`,
                            type: "move",
                            field: "Рабочий стол. Техпроцесс",
                            text: `Техоперация '${operationName}' была перемещена`
                        });

                        /*let operationName = ui.item.find("span.caret").first().text();
                        console.log(ui.placeholder)
                        if (ui.sender !== null){
                            // техоперация перемещена в другой узел
                            let senderName = ui.sender.parent().find("span.caret").first().text();
                            let placeHolderName = ui.placeholder.parent().find("span.caret").first().text();
                            setActionToBar({
                                id: `moveTechOperationToAnotherTechName`,
                                type: "move",
                                field: "Рабочий стол. Техпроцесс",
                                text: `Техоперация '${operationName}' была перемещена из '${senderName}' в '${placeHolderName}'`
                            });
                        }else {
                            let placeHolderName = ui.placeholder.parent().find("span.caret").first().text();
                            setActionToBar({
                                id: `moveTechOperationInTechName`,
                                type: "move",
                                field: "Рабочий стол. Техпроцесс",
                                text: `Техоперация '${operationName}' была перемещена`
                            });
                        }*/
                    }
                });
                $(this).disableSelection();
            });
        }
    }

    function setDeleteButtonToTechName($parent) {
        $parent.find(".deleteNodeButtonRM").first().click(function () {
            let parent = $(this).parent()
            let name = parent.find("span.caret").first().text();
            parent.remove();
            setActionToBar({
                id: "deleteTechNameFromTechProcess",
                type: "delete",
                field: "Рабочий стол. Техпроцесс",
                text: `Из техпроцесса удалён узел '${name}'`
            })
        });
    }
    
    function setTechNameDefault($draggableON) {
        let length = $container.find(".techNameDropped").length + 1;
        $container.append(
            "<li tech-lvl='new' tech-id='" + length + "' class='techNameDropped'>" +
            "<span class='caret'>Техпроцесс " + length + "</span><span class='deleteNodeButtonRM'></span>" +
            "<ul style='min-height: 35px;' class='nested myNested operationNameDropArea'></ul>" +
            "</li>"
        );

        /*setActionToBar({
            id: `addNewTechNameToTechProcess`,
            type: "addNew",
            field: "Рабочий стол. Техпроцесс",
            text: `В техпроцесс добавлен корневой узел 'Техпроцесс ${length}'`
        });*/

        let $this = $(".techNameDropped").last();

        setDeleteButtonToTechName($this);

        setOperationNameToTechName( $container.find(".operationNameDropArea").last(), $draggableON, $this);

        //$container.find(".operationNameDropArea").last().droppable();
        setDropAreaForTechName($container.find(".operationNameDropArea").last());

        sortOperationNames()
    }

    function setOperationNameToTechName( $this,$draggable, parent) {
        let parentName = parent.parent().find("span.caret").first().text();
        let name = $draggable.find(".operationNameField").text();
        let equip = $draggable.find(".operationEquipList").find("li span").first().text();
        let tool = $draggable.find(".operationInstrumentList").find("li span").first().text();
        $this.append(
            "<li tech-lvl='" + $draggable.attr("tech-lvl") + "' tech-id='" + $draggable.attr("tech-id") + "' class='tpLI'>" +
            "<span class='caret'>" + name +  "</span><span class='deleteNodeButtonRM'></span>" +
            "<ul class='nested'>" +
            "<table>" +
            "<tbody>" +
            "<tr><td><div>Оборудование:</div></td>" +
            "<td><div class='ml-5 bg-white'>" + equip + "</div></td>" +
            "</tr>" +
            "<tr><td><div>Инструменты:</div></td>" +
            "<td><div class='ml-5 bg-white'>" +  tool + "</div></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</ul>" +
            "</li>"
        );

        setActionToBar({
            id: `addNewTechOperationToTechProcess`,
            type: "addNew",
            field: "Рабочий стол. Техпроцесс",
            text: `В узел '${parentName}' добавлена операция '${name}'`
        });

        setToggler();

        setDeleteButtonToOperationName($this.find(".deleteNodeButtonRM").last());
    }

    function setDeleteButtonToOperationName($target) {
        $target.click(function () {
            let parent =  $(this).parent();
            let height = parent.parent().css("min-height");
            if ((parent.parent().height() - 15) >= 35){
                parent.parent().css("min-height", (parent.parent().height() - 15) + "px");
            }

            let techName = parent.parent().parent().find("span.caret").first().text();
            let operationName = $target.parent().find("span.caret").first().text();
            setActionToBar({
                id: "deleteOperationNameFromTechProcess",
                type: "delete",
                field: "Рабочий стол. Техпроцесс",
                text: `Из узла '${techName}' удалена операция '${operationName}'`
            });

            parent.remove();
        })
    }

    function downloadTechProcess() {
        $.ajax({
            url: 'ajax/get_techproccess',
            type: 'GET',
            success: function (json) {
                let $field = $("#tech_process_field_drop");
                if (json.techProcess != undefined){
                    if (json.techProcess.length){
                        json.techProcess.forEach(function (techName) {
                            let info = getTechName(techName.id, techName.lvl);
                            let operationNames = [];
                            let $operationNames = "";
                            if (techName.operationNames.length){
                                operationNames = getOperationNames(techName.operationNames);
                                $operationNames = combineOperationNames(operationNames);
                            }

                            let name = (techName.lvl.toString() == "new") ? ("Техпроцесс " + techName.id) : info.name;
                            let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : ``;
                            $field.append(`
                            <li class='techNameDropped' tech-id='${techName.id}' tech-lvl='${techName.lvl}'>
                                <span class='caret'>${name}</span>${deleteButton}
                                <ul style='min-height: 35px;' class='nested border-bottom pb-2 myNested operationNameDropArea'>
                                    ${$operationNames}
                                </ul>
                            </li>
                        `);

                            let $techNameDropped = $(".techNameDropped").last();

                            if (Role === "technologist")
                                setDeleteButtonToTechName($techNameDropped);
                            setDropAreaForTechName($(".operationNameDropArea").last());

                            if (Role === "technologist") {
                                let $li = $techNameDropped.find(".operationNameDropArea").find("li");
                                if ($li.length){
                                    $li.each(function () {
                                        setDeleteButtonToOperationName($(this).find(".deleteNodeButtonRM").last())
                                    })
                                }
                            }
                        });

                        if (Role === "technologist")
                            sortOperationNames();
                        setToggler();

                        $container.find(".techNameDropped").each(function () {
                            $(this).find(".caret").first().trigger("click");
                        });
                    }
                }

            }
        });

        function getTechName(id, lvl) {
            let tchNm = {};
            techGuideJson.forEach(function (techName) {
                if (techName.lvl == lvl.toString() && techName.id == id.toString()) tchNm = techName;
            });
            if (lvl == "new")
                tchNm = {
                    id: id,
                    lvl: "new",
                    operationNames: []
                };

            return tchNm;
        }

        function getOperationNames(operationNames){
            let operationNamesInfo = [];
            operationNames.forEach(function (_techName) {
                operationNamesInfo.push(getOperationNameInfo(_techName.id, _techName.lvl))
            });
            return operationNamesInfo;
        }

        function getOperationNameInfo(id, lvl) {
            let _operationName = {};
            techGuideJson.forEach(function (techName) {
                techName.children.forEach(function (operationName) {
                if (operationName.id == id && operationName.lvl == lvl)
                    _operationName = operationName;
                if (operationName.lvl == "new" && operationName.id == id)
                    _operationName = {
                        name: "",
                        id: operationName.id,
                        lvl: "new",
                        tools: operationName.tools,
                        equipment: operationName.equipment
                    }
            })
            });
            return _operationName;
        }

        function combineOperationNames(operationNames) {
            let $operationNames = "";
            let deleteButton = (Role === "technologist") ? `<span class='deleteNodeButtonRM'></span>` : ``;
            operationNames.forEach(function (operationName) {
                $operationNames += `
            <li tech-lvl='${operationName.lvl}' tech-id='${operationName.lvl}' class='tpLI'>
            <span class='caret'>${operationName.name}</span>${deleteButton}
            <ul class='nested'>
            <table>
            <tbody>
            <tr><td><div>Оборудование:</div></td>
            <td><div class='ml-5 bg-white'>${operationName.equipment[0].name}</div></td>
            </tr>
            <tr><td><div>Инструменты:</div></td>
            <td><div class='ml-5 bg-white'>${operationName.tools[0].name}</div></td>
            </tr>
            </tbody>
            </table>
            </ul>
            </li>
            `
            });
            return $operationNames;
        }
    }

    function setDropAreaForTechName($techName) {
        $techName.droppable({
            accept: ".operationName",
            drop: function (e, u) {
                let $this = $(this);
                //sortOperationNames();
                setOperationNameToTechName( $this,$(u.draggable), $techName);
                //$container.find(".techNameDropped").last().remove();
                //$this.css("min-height", ($this.height() + 15) + "px");
            }
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
                operationNames: []
            };
            let operationsNames = this_tech_name.find(".tpLI");
            if (operationsNames.length){
                operationsNames.each(function () {
                    let this_operation_name = $(this);
                    techName.operationNames.push({
                        id: this_operation_name.attr("tech-id"),
                        lvl: this_operation_name.attr("tech-lvl")
                    })
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
