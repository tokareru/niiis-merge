function initESI() {
    esiGetDataFromServer();

    /*let data = {
        "details": [
            {
                "description": "дт 1",
                "name": "Деталь 1",
                "position": 1,
                "amount": 1,
                "id": 1,
                "children": [
                    {
                        "description": "дт 1.1",
                        "name": "Деталь 1.1",
                        "position": 1,
                        "amount": 1,
                        "id": 1_1,
                        "children": []
                    },
                    {
                        "description": "дт 1.2",
                        "name": "Деталь 1.2",
                        "position": 1,
                        "amount": 1,
                        "id": 1_2,
                        "children": []
                    }
                ]
            },
            {
                "description": "дт 2",
                "name": "Деталь 2",
                "position": 1,
                "amount": 2,
                "id": 2,
                "children": [
                    {
                        "description": "дт 2.1",
                        "name": "Деталь 2.1",
                        "position": 1,
                        "amount": 1,
                        "id": 2_1,
                        "children": []
                    },
                    {
                        "description": "дт 2.2",
                        "name": "Деталь 2.2",
                        "position": 1,
                        "amount": 1,
                        "id": 1,
                        "children": []
                    }
                ]
            },
            {
                "description": "дт 3",
                "name": "Деталь 3",
                "position": 1,
                "amount": 3,
                "id": 3,
                "children": []
            },
            {
                "description": "дт 4",
                "name": "Деталь 4",
                "position": 1,
                "amount": 4,
                "id": 4,
                "children": []
            }
        ]
    }*/

    $('.slider_button').on('click', function () {
        STDLibClick($('.slider_button'), $('.slider_main'), 15);
    });

    $('#shell').on('click', function () {
        if ($('.slider_main').attr('style') === 'z-index: 999; right: 0px;') {
            $('.slider_button').trigger('click');
        }
    });




}

function setESI(data) {
    try {
        $("#esi_branch_body").empty().append(createNodes(data.details));
        esiSetBranchesNestedFunc();
    }catch (e) {
        
    }

    setInterval(function () {
        let _data = convertArray(getDataFromSpecTable());
        //console.log(_data)

        function arraysIdentical(a, b) {
            let i = a.length;
            if (i != b.length) return false;
            while (i--) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        }

        if (arraysIdentical(_data, data) || _data === undefined) return;
        data = _data;
        $("#esi_branch_body").empty().append(createNodes(_data.details));

        esiSetBranchesNestedFunc();

        //$("#esi_branch_body").find(".detailChildren").trigger("click");

    }, 5000)
}

function esiSetBranchesNestedFunc() {
    let toggler = document.getElementById("esi_field").getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
}

function createNodes(children) {
    let node = '';
    let isDisabled = (Role !== 'designer') ? 'disabled' : '';
    children.forEach(function (child) {
        let _children =
            (child.children.length > 0) ?
            "<li>" +
                "<span class='caret detailChildren'>Состав</span>" +
                "<ul class='nested'>" +
                    createNodes(child.children) +
                "</ul>" +
            "</li>" : '';
        node +=
            "<li>" +
                "<span class='caret detailChildren'>" + child.name + "</span>" +
                "<ul class='nested'>" +
                    "<li>" +
                        "<span class='caret'>Название</span>" +
                        "<ul class='nested'>" +
                            "<li class='lastChild'>" +
                                "<input " + isDisabled + " value='" + child.name + "' type='text' class='input-group-sm border-0 lastChildInput'>" +
                            "</li>" +
                        "</ul>" +
                    "</li>" +
                    "<li>" +
                        "<span class='caret'>Обозначение</span>" +
                        "<ul class='nested'>" +
                            "<li class='lastChild'>" +
                                "<input " + isDisabled + " value='" + child.description + "' type='text' class='input-group-sm border-0 lastChildInput'>" +
                            "</li>" +
                        "</ul>" +
                    "</li>" +
                    "<li>" +
                        "<span class='caret'>Позиция</span>" +
                        "<ul class='nested'>" +
                            "<li class='lastChild'>" +
                                "<input " + isDisabled + " value='" + child.position + "' type='text' class='input-group-sm border-0 lastChildInput'>" +
                            "</li>" +
                        "</ul>" +
                    "</li>" +
                    "<li>" +
                        "<span class='caret'>Количество</span>" +
                        "<ul class='nested'>" +
                            "<li class='lastChild'>" +
                                "<input " + isDisabled + " value='" + child.amount + "' type='text' class='input-group-sm border-0 lastChildInput'>" +
                            "</li>" +
                        "</ul>" +
                    "</li>" +
                    _children +
                "</ul>" +
            "</li>";
    });
    return node;
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
                }else{
                if (cols > 1){
                    let $div = $(this).find("div");
                    row_arr.push($div.text())
                }
            }
            });
            array.push(row_arr);
            //console.log(row_arr)
        }

    });
    return array;
}

function esiGetDataFromServer() {
    $.ajax({
        type: "GET",
        url: "spec_autoentered_table_ajax",
        async: false,
        dataType: "json",
        success: function (json) {
            let arr = [];
            json.tbody.forEach(function (row) {
                arr.push([row.row[0].text, row.row[1].text, row.row[2].text, row.row[3].text]);
            })
            console.log(arr)
            setESI(convertArray(arr))
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    })
}

function convertArray(arr) {
    //console.log(arr);
    let obj = {
        "details": []
    };
    arr.forEach(function (element) {
        obj.details.push({
            name: element[2],
            description: element[1],
            position: element[0],
            amount: element[3],
            children: []
        })
    });
    //console.log(obj);
    return obj;
}

function STDLibClick($but, $main, z_index) {
    let css_left = -$main.width() + $but.width() + 'px';
    let css_right = '0px';
    if ($main.attr('style') !== ('z-index: 999; right: ' + css_right + ';')) {
        $main.animate({
                right: css_right
            },
            300, 'linear'
        );
        $main.removeAttr('style');
        $main.attr('style', 'z-index: 999');
    } else {
        $main.animate({
                right: css_left
            },
            300, 'linear'
        );
        $main.attr('style', 'z-index:' + z_index);
    }
}


/*$(function () {
    addBranches(5);
    toggleEsiBranchContent();

   /!* addBranch( 1, [[0]]);
    addBranch( 1, [[0]]);
    addBranch( 2, [[0], [0]]);
    addBranch( 2, [[0], [1]]);
    addBranch( 2, [[0], [1]]);
    addBranch( 1, [[1]]);
    addBranch( 3, [[0], [0, 1], [1]]);*!/
    //addBranch( 3, [[0], [0, 1], [0]], true);
    hideBranchContent();
});*/
/*

function initESI() {
    $('#esi_field').find('#esi_branch_btn').data({'init': 0});

    $('#esi_field').on('click', '#esi_branch_btn', function () {
        $('#esi_field').find('.esi_branches_div').children().remove();
        InitBranches();
        initBranchesInside();
        toggleEsiBranchContent();
        hideBranchContent();
        $('#esi_field').find('.esi_branches .esi_branch_switcher').eq(0).click();


        if ($('#esi_field').find('#esi_branch_btn').data('init') === 0) {
            $('#esi_branch_btn').data({'init': 1});
        }
    });

    $('.slider_button').on('click', function () {
        STDLibClick($('.slider_button'), $('.slider_main'), 15);
    });

    $('#shell').on('click', function () {
        if ($('.slider_main').attr('style') === 'z-index: 999; right: 0px;') {
            $('.slider_button').trigger('click');
        }
    });
}

function InitBranches() {
    addBranches(1);
}

function initBranchesInside() {

    let info = serializeTable('#specificationBlock ');
    let countRows = info.length;
    let countCols = info[0].length;
    for (let i = 1; i < countRows; i++) {
        if (i % 2 === 0)
            addBranch(1, [[0]], 'esi_cont_inside1',
                'esi_header_alt1', [info[i][3], '']);
        else addBranch(1, [[0]], 'esi_cont_inside1', '',
            [info[i][3], '']);
    }
    $('#esi_field').find('.esi_branches').find('.esi_branch')
        .find('.esi_branches').children().each(function (index) {
        $(this).find('.esi_branch_content').append('<div class="esi_branches"></div>');
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][2], info[index + 1][2]]));
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][4], info[index + 1][4]]));
        /!*$(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][1],info[index + 1][1] ]));*!/
    });
}

function addBranches(count) {
    let $esi_branches = $('#esi_field').find('.esi_branches_div');
    let $branches = madeBranches(count);

    $esi_branches.append($branches);
}

function madeBranches(count) {
    let $branches = '<div class="esi_branches">';
    for (let i = 0; i < count; i++) {
        $branches += madeBranch();
    }
    $branches += '</div>';
    return $branches;
}

function toggleEsiBranchContent() {

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

function hideBranchContent() {
    $('#esi_field').find('.esi_branch').each(function () {
        $(this).find('.esi_branch_content_row')
            .each(function () {
                $(this).attr('style', 'display: none');
            });
    })
}

function madeBranch(info = ['Модель', ''], classNameHeader = '', classNameCont = '') {
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
function addBranch(depth, params, classNameCont, classNameHeader, info) {
    let $branch = $('#esi_field').find('.esi_branches:first')
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
    $depth.find('.esi_branches').append(madeBranch(info, classNameHeader, classNameCont));
}

function addContent($esi_branch, content) {
    $esi_branch.find('.esi_branch_content').append(content);
}

*/


