function initESI() {
    esiGetDataFromServer();

    $("#esi_branch_body_header_span").not(".caret-down").trigger("click");

    $('.slider_button').on('click', function (event) {
        STDLibClick($('.slider_button'), $('.slider_main'), 15, "esi");
    });

    /* $('#shell').on('click', function () {
         if ($('.slider_main').attr('style') === 'z-index: 999; right: 0px;') {
             $('.slider_button').trigger('click');
         }
     });*/

    let $esiBody = $("#right-side");
    $(".detailDraggable").draggable({
        helper: 'clone',
        appendTo: ".tech_process_table",
        drag: function (event, ui) {
            let $helper =$ (ui.helper);
            $helper.removeClass("detailChildren").addClass("text-white")
            $helper.css({
                "list-style-type": "none",
                "z-index": "1000"
            });
            $helper.find("ul").remove()
            $("#tech_process_field_drop").removeClass("border-color-transparent").addClass("border-warning");
        },
        stop: function (e, ui) {
            $("#tech_process_field_drop").removeClass("border-warning").addClass("border-color-transparent");
        }

    });
    $(".reloadButtonForESI").on("click", function () {
        reloadESI();
    })

}

function reloadESI() {
    let reloadButtonForESI = $(".reloadButtonForESI");
    let thisReloadButtonForESI = document.getElementsByClassName("reloadButtonForESI");
    if (Role === 'designer') reloadButtonForESI.remove();
    let checkedDetails = [];
    startProcessOfSaving(thisReloadButtonForESI);
    $.ajax({
        type: "POST",
        async: false,
        url: "spec_autoentered_table_ajax/load_product_checked",
        success: function (data) {
            checkedDetails = data.checked;
            stopProcessOfSaving(thisReloadButtonForESI);
        }
    });
    setESI({details: convertPdmAndStdInfo(checkedDetails)});
}

function setESI(data, setNewInterval = false) {
    if (Round !== 3) return;
    setMainTitleForESI();
    //console.log(data)
    $("#esi_branch_body").empty().append(createNodes(data.details));
    setToggler("esi_field");
}

function esiSetBranchesNestedFunc() {
    let toggler = document.getElementById("esi_field").getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
    $("#esi_branch_body_header_span").trigger("click");
}

function createNodes(children) {
    let node = '';
    let isDisabled = (Role !== 'designer') ? 'disabled' : 'disabled';
    children.forEach(function (child) {
        /*let _children =
            (child.children.length > 0) ?
                "<li>" +
                "<span class='caret detailChildren'>Состав</span>" +
                "<ul class='nested'>" +
                createNodes(child.children) +
                "</ul>" +
                "</li>" : '';*/
        node +=
            `<li tech-lvl="3" tech-id="${child.id}" class="detailDraggable">
                <span class='caret detailChildren'>${(child.designation.replace(/ /g, "") === "") ? "" : (child.designation + " - ")}${child.name} </span>
                <ul class='nested'>
                    <li class=''>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div>Позиция:</div>
                                    </td>
                                    <td>
                                        <input ${isDisabled} value='${child.position}' type='text' class='input-group-sm border-0 lastChildInput'>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>Количество:</div>
                                    </td>
                                    <td>
                                        <input ${isDisabled} value='${child.number}' type='text' class='input-group-sm border-0 lastChildInput'>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </li>
                </ul>
            </li>`;
    });
    return node;
}

function esiNotifyHandler(array) {
    let _data = {
        "details": []
    };
    getDetailsInfo();
    array.forEach(function (component_id) {
        DetailsInfo.forEach(function (component) {
            if (component_id === ("detail" + component.id)) {
                _data.details.push({
                    "name": component.name,
                    "description": component.designation,
                    "amount": component.number,
                    "position": component.position,
                    "children": []
                })
            }
        })
    });
    setESI(_data);
}

function getDataFromSpecTable() {
    let table_block = "#specificationBlock ";
    let array = [];

    $(table_block + ".table_made").find("tbody tr").each(function (rows) {
        if (rows < $(table_block + ".table_made").find("tr").length - 2) {
            let row_arr = [];
            $(this).find("td").each(function (cols) {
                if (Role === "approver"
                    || Role === "technologist" || Role === "production_master" || Role === "worker") {
                    let $div = $(this).find("div");
                    row_arr.push($div.text())
                } else {
                    if (cols > 1) {
                        let $div = $(this).find("div");
                        row_arr.push($div.text())
                    }
                }
            });
            array.push(row_arr);
            //console.log(row_arr)
        }
        if (array.length === 0) array = ["empty"];
    });
    return array;
}

function esiGetDataFromServer() {
    $.ajax({
        type: "GET",
        url: "spec_autoentered_table_ajax/load_product_checked",
        async: false,
        dataType: "json",
        success: function (json) {
            let info = [];
            let checkedArray = [];
            //console.log(json)
            getDetailsInfo().forEach(function (_detail) {
                json.checked.forEach(function (_detailId) {
                    if (_detailId === ("detail-" + _detail.id))
                        checkedArray.push(_detail);
                });
            });
            checkedArray.forEach(function (_detail) {
                info.push([_detail.position, _detail.designation, _detail.name, _detail.number]);
            });
            setESI(convertArray(info), true)
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    })
}

function convertArray(arr) {
    //console.log(arr);
    if (arr[0] === "empty") return "empty";

    let obj = {
        "details": []
    };
    arr.forEach(function (element) {
        obj.details.push({
            id: element[0],
            name: element[2],
            designation: element[1],
            position: element[0],
            number: element[3],
            children: []
        })
    });
    //console.log(obj);
    return obj;
}

function STDLibClick($but, $main, z_index, target) {
    let css_left = -$main.width() + $but.width() + 'px';
    let css_right = '0px';
    let  $right_side =  $("#right-side");
    if ($main.attr('style') !== ('z-index: 999; right: ' + css_right + ';')) {
        $main.animate({
                right: css_right
            },
            300, 'linear'
        );
        $main.removeAttr('style');
        $main.attr('style', 'z-index: 999');

        if (target === "create_task_route") $("#create_task_route-side").trigger("create-task-route-opened");
        if (target === "esi") {
            $right_side.trigger("esi-opened");
            $right_side.attr("esi-opened", "true")
        }
    } else {
        $main.animate({
                right: css_left
            },
            300, 'linear'
        );
        $main.attr('style', 'z-index:' + z_index);
        $right_side.attr("esi-opened", "false")
    }
}

function setMainTitleForESI() {
    let $esi_branch_body_header_span = $("#esi_branch_body_header_span");
    $esi_branch_body_header_span.text(`
       ${getDetailsInfo("prim")[0].designation} - ${getDetailsInfo("prim")[0].name}
    `)
    $esi_branch_body_header_span.parent().attr("tech-lvl", 0).attr(`tech-id`, `${getDetailsInfo("prim")[0].id}`);
}

