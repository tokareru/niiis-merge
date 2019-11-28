function technologicalProcessInit() {
    //initTree("#techProcessBlock ")
    //init_tech_process();
    let toggler = document.getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    $("#myUL").find("span").first().trigger("click");
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