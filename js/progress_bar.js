var CurrentProgress = new Array();

function initProgressBar(){
    $.ajax({
        url: 'ajax/get_technologist_info',
        type: 'GET',
        success: function (techJson) {
            techGuideJson = techJson;
            $.ajax({
                url: 'json/progress_bar_actions.json',
                type: 'GET',
                success: function (json) {
                    setActionBar(json)
                }
            })
        }
    })
}

function setActionBar(data) {
    if (data !== undefined){
        if (data.progressBarActions !== undefined){
            data.progressBarActions.forEach(function (action) {
                setActionToBar(action);
            });
        }
    }

    $("#left-scroll-button-progress-bar").on("click", function () {
        document.getElementById("progress-bar-body").scrollLeft -= 200;
    });

    $("#right-scroll-button-progress-bar").on("click", function () {
        document.getElementById("progress-bar-body").scrollLeft += 200;
    })
}

function setActionToBar(action = {id: "", type: "", field: "", text: ""}) {
    let icon = chooseIconClassByType(action.type);

    $("#progress-bar-body").append(`
        <li class="nav-item">
             <button type="button" data-trigger="hover" data-container="body" data-toggle="popover"
              data-placement="top" title="${action.field}" data-content="${action.text}"
               class="btn btn-outline-dark mr-1 shadow-none fas ${icon}">
             </button>
        </li>
    `);

    $("#progress-bar-body button").last().popover();

    CurrentProgress.push(action);

    //$("button[data-toggle=\"tooltip\"]").tooltip();
/*    $("#progress-bar-body button").last().tooltip({
        classes: {
            "ui-tooltip": "bg-dark text-white small"
        },
        position: { my: "left top+5", at: "left bottom", collision: "flipfit" }
    });*/

}

function chooseIconClassByType(type) {
    if (type === "save"){
        return "fa-save";
    }
    if (type === "choose"){
        return "fa-check-square";
    }
    if (type === "unselect"){
        return "fa-times-circle-o";
    }
    if (type === "edit"){
        return "fa-edit";
    }
    if (type === "addNew"){
        return "fa-plus";
    }
    if (type === "delete"){
        return "fa-minus";
    }
    if (type === "rowToEdit"){
        return "fa-unlock";
    }
    if (type === "rowToRo"){
        return "fa-lock";
    }
    if (type === "open"){
        return "fa-folder";
    }
    if (type === "clear"){
        return "fa-trash-o";
    }
    if (type === "move"){
        return "fa-arrows";
    }
}
