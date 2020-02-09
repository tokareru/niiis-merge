async function triggerschemeInit() {
    let fieldscheme = await import('./scheme.js');
    await fieldscheme.initScheme();

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
            field3D.addClass("blur-filter");
            field3D.find("input").attr("disabled", "disabled");
            $("#addToServerTitleBlock").attr("disabled", "disabled");
        }

        schemeMessage();
    }

}

function schemeMessage(){
    $("#field3D").append(
        "<div id=\"dialog-message\" title=\"Область заблокирована\">" +
        "<p class='alert-warning p-1'>" +
        "<span class=\"ui-icon ui-icon-circle-check\"></span>" +
        "Необходимо полностью собрать изделие." +
        "</p>" +
        "</div>");

    $("#dialog-message").dialog({
        modal: false,
        draggable: false,
        appendTo: "#scheme",
        resizable: false,
        position: { my: "center", at: "center", of: "#field3D" }/*,
        buttons: {
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }*/
    });

    $("#dialog-message").parent().css({
        "border": "1px solid #c5c5c5",
        "z-index": "99999999999"
    }).addClass("bg-light");
    $("#dialog-message").parent().find("button").remove();//first().addClass("cross-scheme").addClass("btn");
    $("#dialog-message").parent().find("div").first().addClass("alert-secondary");
}
