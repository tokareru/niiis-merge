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

function initESI() {
    $('#esi_field').append('<button id=\'esi_branch_btn\' class="btn btn-primary btn-block">' +
        'Обновить данные</button>');
    $('#esi_field').find('#esi_branch_btn').data({'init': 0});

    $('#esi_field').on('click', '#esi_branch_btn', function () {
        $('#esi_field').find('.esi_branches_div').children().remove();
        InitBranches();
        initBranchesInside();
        toggleEsiBranchContent();
        hideBranchContent();
        $('#esi_field').find('.esi_branches .esi_branch_switcher').eq(0).click();


        if ($('#esi_field').find('#esi_branch_btn').data('init') === 0) {
            //
            $('#esi_branch_btn').data({'init': 1});
        }


        //getInfoFromSpecTable(1, 2);
    });


}

function InitBranches() {
    addBranches(1);
}

function initBranchesInside() {

    let countRows = $('.table_edit').find('tbody').find('tr').length;
    let countCols = $('.table_edit').find('thead').find('tr').find('th').length;

    let info = serializeTable();
    info.forEach(function (value) {
        console.log(value);
    });

    for (let i = 0; i < countRows; i++) {
        if (i % 2 === 0)
            addBranch(1, [[0]], 'esi_cont_inside1',
                'esi_header_alt1', [info[i+1][3], '']);
        else addBranch(1, [[0]], 'esi_cont_inside1', '',
            [info[i+1][3], '']);
    }
    $('#esi_field').find('.esi_branches').find('.esi_branch')
        .find('.esi_branches').children().each(function (index) {
        $(this).find('.esi_branch_content').append('<div class="esi_branches"></div>');
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][2],info[index + 1][2] ]));
        $(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][4],info[index + 1][4] ]));
        /*$(this).find('.esi_branch_content').find('.esi_branches').append(madeBranch(
            [info[0][1],info[index + 1][1] ]));*/
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

function getInfoFromSpecTable(ind_row, ind_col) {
    alert($('.table_edit').html());
}
