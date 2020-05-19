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


}

function setESI(data, setNewInterval = false) {
    //console.log(data)
    if (Round !== 3) return;
    setMainTitleForESI();
    $("#esi_branch_body").empty().append(createNodes(data.details));
    setToggler("esi_field");

    /*if (setNewInterval) setInterval(function () {
        let _data = convertArray(getDataFromSpecTable());
        _data = (_data === 'empty') ? { details: []} : _data;
        if (_data !== 'empty') {
            if (_data.details.length === 0) _data = data;
        }

        //console.log(_data);

        function arraysIdentical(a, b) {
            let i = a.length;
            if (i != b.length) return false;
            while (i--) {
                if (a[i].name !== b[i].name || a[i].description !== b[i].description || a[i].position !== b[i].position
                || a[i].amount !== b[i].amount)
                    return false;
            }
            return true;
        }

        //console.log(_data)

        if (arraysIdentical(_data.details, data.details)) return;
        data = _data;
        //alert()
        $("#esi_branch_body").empty().append(createNodes(_data.details));

        esiSetBranchesNestedFunc();

        //$("#esi_branch_body").find(".detailChildren").trigger("click");

    }, 5000)*/
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
        //console.log(child)
        node +=
            "<li>" +
            "<span class='caret detailChildren'>" + child.name + "</span>" +
            "<ul class='nested'>" +
            "<li class=''>" +
            "<table>" +
            "<tbody>" +
            "<tr>" +
            "<td>" +
            "<div>Обозначение:</div>" +
            "</td>" +
            "<td>" + "<input " + isDisabled + " value='" + child.designation + "' type='text' class='input-group-sm border-0 lastChildInput'>" + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<div>Позиция:</div>" +
            "</td>" +
            "<td>" + "<input " + isDisabled + " value='" + child.position + "' type='text' class='input-group-sm border-0 lastChildInput'>" + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<div>Количество:</div>" +
            "</td>" +
            "<td>" + "<input " + isDisabled + " value='" + child.amount + "' type='text' class='input-group-sm border-0 lastChildInput'>" + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</li>" +
            //_children +
            "</ul>" +
            "</li>";
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
            name: element[2],
            designation: element[1],
            position: element[0],
            amount: element[3],
            children: []
        })
    });
    //console.log(obj);
    return obj;
}

function STDLibClick($but, $main, z_index, target) {
    let css_left = -$main.width() + $but.width() + 'px';
    let css_right = '0px';
    if ($main.attr('style') !== ('z-index: 2147483647; right: ' + css_right + ';')) {
        $main.animate({
                right: css_right
            },
            300, 'linear'
        );
        $main.removeAttr('style');
        $main.attr('style', 'z-index: 2147483647');

        if (target === "create_task_route") $("#create_task_route-side").trigger("create-task-route-opened");
        if (target === "esi") $("#right-side").trigger("esi-opened");
    } else {
        $main.animate({
                right: css_left
            },
            300, 'linear'
        );
        $main.attr('style', 'z-index:' + z_index);
    }
}

function setMainTitleForESI() {
    let $esi_branch_body_header_span = $("#esi_branch_body_header_span");
    $esi_branch_body_header_span.text(`
       ${(getMainTitle().replace(/ /g, "") === "") ? "" : (mainTitle + " - ")} Прибор АБР
    `)
}
