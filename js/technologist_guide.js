function initTechnologistGuide() {
    getJsonByURL("json/technologist_guide.json", setTechnologistGuide, {})
}

function setTechnologistGuide(json, add_data) {
    let field_id = "#technologist_guide_field";
    let field = $(field_id);
    field.append("<div id='technologist_guide_accordion'></div>");
    let field_accord = field.find("#technologist_guide_accordion");
    if (field_accord.children().length) return;
    json.forEach(function (types, index) {
        field_accord.append("<p class='tg_header'>" + types.name + "</p><div class='tg_div accordion' role=\"tablist\" aria-multiselectable=\"true\" id='" + types.type + "'></div>");
       /* types.elements.forEach(function (elem) {
            field.find(".tg_div").last()
                .append("<div class='card'>" +
                    "<div class='card-header' id='card_header_" + index + "' >" +
                    "<h6>" +
                        "<button type='button' data-toggle='collaps' data-target='#colapsible_" + index + "' class='tg_elem_header' " +
                            "aria-expanded='true' aria-controls='colapsible_" + index + "'>"
                            + elem.name +
                        "</button>" +
                        "</h6>"
                    + "</div>" +
                    "<div id='colapsible_" + index + "' class='tg_elem_div collapse' aria-labelledby='card_header_" + index + "' data-parent='#" + types.type +"'>"
                        + "<div class='card-body'>"
                            + elem.text +
                        "</div>" +
                    "</div>" +
                   "</div>")
        });*/

        types.elements.forEach(function (elem) {
            field.find(".tg_div").last()
                .append("<p class='tg_elem_header'>" + elem.name + "</p><div class='tg_elem_div'>" + elem.text + "</div>")
        });

        field.find(".tg_div").last().accordion({
            heightStyle: "content",
            animate: 50,
            collapsible: true,
            active: false
        });
    })
    field_accord.accordion({
        heightStyle: "content",
        animate: 200,
        collapsible: true,
        active: false
    });
}
