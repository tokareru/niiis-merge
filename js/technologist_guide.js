function initTechnologistGuide() {
    getJsonByURL("json/technologist_guide.json", setTechnologistGuide, {})
}

function setTechnologistGuide(json, add_data) {
    let field_id = "#technologist_guide_field";
    let field = $(field_id);
    field.append("<div id='technologist_guide_accordion'></div>");
    let field_accord = field.find("#technologist_guide_accordion");
    if (field_accord.children().length) return;

    let techs = '';

    json.forEach(function (child) {
        techs += createTechGuideNodes(child);
    })

    $("#technologist_guide_accordion").append(
        "<ul class='col-12 pl-0'>" +
            techs +
        "</ul>"
    )

    let toggler = document.getElementById("technologist_guide_accordion").getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    $("#technologist_guide_accordion").find(".detailChildren").trigger("click");
}


function createTechGuideNodes(tech) {
    let node = '';
    let isDisabled = "disabled";
    console.log(tech);

    let inp = '';

    tech.children.forEach(function (child, i) {
        console.log(child)
        let equip = '';
        child.equipment.forEach(function (eq) {
            equip +=
                "<li class='lastChild instruments_list_li'>" +
                "<span>" + eq.name + "</span>" +
                "</li>";
        });

        let instr = '';
        child.instruments.forEach(function (ins) {
            instr +=
                "<li class='lastChild instruments_list_li'>" +
                    "<span>" + ins.name + "</span>" +
                "</li>"
        });

        inp +=
            "<il>" +
                "<span class='caret'>" + (i + 1).toString() + "." + child.name + "</span>" +
                "<ul class='nested pl-2'>" +
                    "<li>" +
                        "<span class='caret'>Название</span>" +
                        "<ul class='nested pl-2'>" +
                            "<li class='lastChild instruments_list_li'>" +
                                "<span class=''>" + child.name + "</span>" +
                            "</li>" +
                        "</ul>" +
                    "</li>" +
                    "<li>" +
                        "<span class='caret'>Оборудование</span>" +
                        "<ul class='nested pl-2'>" +
                            equip +
                        "</ul>" +
                    "</li>" +
                    "<li>" +
                        "<span class='caret'>Инструменты</span>" +
                        "<ul class='nested pl-2'>" +
                            instr +
                        "</ul>" +
                    "</li>" +
                "</ul>" +
            "</il>";
    });

    node =
        "<li>" +
            "<span class='caret detailChildren'>" + tech.name + "</span>" +
            "<ul class='nested pl-2'>" +
                inp +
            "</ul>" +
        "</li>";

    return node;
}
