let schemeState = "unlocked";

async function triggerschemeInit() {
    let fieldscheme = await import('./scheme.js');
    await fieldscheme.initScheme();

    if (Round === 3){
        schemeMessage();
    }

    if (Round === 3 && Role === 'designer') {
        let field3D = $("#field3DAll");

        field3D.click(function (event) {
            let amountOfChecked = $("#left-accordion").find("input:checked").length;
            let amountOfInputs = $("#left-accordion").find("input").length;

            if (amountOfChecked !== amountOfInputs) {
                event.preventDefault();
            }
        });

        let amountOfChecked = $("#left-accordion").find("input:checked").length;
        let amountOfInputs = $("#left-accordion").find("input").length;

        if (amountOfChecked !== amountOfInputs) {
            blockScheme();
            //triggerToDoTaskEvent("chooseAllDetails", true);
        }/*else
            triggerToDoTaskEvent("chooseAllDetails", false);*/
    }
    if (Round === 3 && Role !== 'designer'){
        $.ajax({
            type: "GET",
            url: "drawing_main_text_ajax/load_is_full",
            dataType: "json",
            data: "json",
            success: function (json) {
                //console.log(json);
                if (json.isFull == "false"){
                    blockScheme();
                }else {
                    unlockScheme()
                }
            }
        });

        setInterval(function () {
            if (!TaskInfoReload){
                $.ajax({
                    type: "GET",
                    url: "drawing_main_text_ajax/load_is_full",
                    dataType: "json",
                    data: "json",
                    success: function (json) {
                        if (json.isFull == "false"){
                            blockScheme();
                        }else {
                            unlockScheme()
                        }
                    }
                });
            }
        }, 5000)
    }

}

function blockScheme() {
    let field3D = $("#field3DAll");
    field3D.addClass("blur-filter");
    field3D.find("input").attr("disabled", "disabled");
    $("#addToServerTitleBlock").attr("disabled", "disabled");
    $("#dialog-message").dialog( "open" );
    if (schemeState === 'unlocked') triggerEventOnField("scheme", "schemeBlock");
    schemeState = "blocked";
}

function unlockScheme() {
    let field3D = $("#field3DAll");
    field3D.removeClass("blur-filter");
    field3D.find("input").removeAttr("disabled");
    $("#addToServerTitleBlock").removeAttr("disabled");
    $( "#dialog-message" ).dialog( "close" );
    schemeState = "unlocked";
}

function schemeMessage(){
    $("#field3D").append(
        "<div id=\"dialog-message\" title=\"?????????????? ??????????????????????????\">" +
        "<p class='p-1'>" +
        "<span class=\"ui-icon ui-icon-circle-check\"></span>" +
        "???????????????????? ?????????????????? ?????????????? ??????????????." +
        "</p>" +
        "</div>");

    $("#dialog-message").dialog({
        modal: false,
        draggable: false,
        appendTo: "#scheme",
        resizable: false,
        autoOpen: false,
        position: { my: "center", at: "center", of: "#field3D" }/*,
        buttons: {
            "??????????????": function () {
                $(this).dialog("close");
            }
        }*/
    });

    $("#dialog-message").parent().css({
        "border": "1px solid #c5c5c5",
        "z-index": "999"
    }).addClass("bg-light");
    $("#dialog-message").parent().find("button").remove();//first().addClass("cross-scheme").addClass("btn");
    $("#dialog-message").parent().find("div").first().addClass("alert-secondary");
}
