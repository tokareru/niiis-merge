function initTechnologistGuide() {
    //getJsonByURL("ajax/get_technologist_info", setTechnologistGuide, {})
    getJsonByURL(techGuideURL, setTechnologistGuide, {})
    /*getJsonByURL("ajax/get_technologist_info", function (json) {
        console.log(json)
    }, {})*/
}

let techGuideJson;
// ajax/get_technologist_info
const techGuideURL = "ajax/get_technologist_info";

function setTechnologistGuide(json, add_data) {
    techGuideJson = json;
    let field_id = "#technologist_guide_field";
    let field = $(field_id);
    field.append("<div id='technologist_guide_accordion'></div>");
    let field_accord = field.find("#technologist_guide_accordion");
    if (field_accord.children().length) return;

    let techs = '';

    json.forEach(function (child) {
        techs += createTechGuideNodes(child);
    });

    $("#technologist_guide_accordion").append(
        "<ul class='col-12 pl-0 pr-0'>" +
            techs +
        "</ul>"
    );

    let toggler = document.getElementById("technologist_guide_accordion").getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }

    $("#technologist_guide_accordion").find(".detailChildren").trigger("click");

    $(".operationName").draggable({
        helper: 'clone',
        appendTo: ".tech_process_table",
        drag: function (event, ui) {
            let $helper =$ (ui.helper);
            $helper.find("ul").hide();
            $helper.find("span").first().css("color", "black !important");
            $helper.find("span").css("background-color", "#dbf4ff");
            $helper.find("li").css("background-color", "#dbf4ff");
            $helper.find("ul").css("background-color", "#dbf4ff");
        }
    });
    $(".techName").draggable({
        helper: 'clone',
        appendTo: ".tech_process_table",
        drag: function (event, ui) {
            let $helper =$ (ui.helper);
            $helper.find("ul").hide();
            $helper.css("list-style-type", "none");
            $helper.find("span").css("color", "black !important");
            $helper.find("span").css("background-color", "#dbf4ff");
            $helper.find("li").css("background-color", "#dbf4ff");
            $helper.find("ul").css("background-color", "#dbf4ff");
        }
    });

    $(".instruments_list_li").draggable({
        helper: 'clone',
        appendTo: ".tech_process_table",
        drag: function (event, ui) {
            let $helper =$ (ui.helper);
            $helper.css("list-style-type", "none");
        }
    });


    field.trigger("endOfInitialization");
}


function createTechGuideNodes(tech) {
    let node = '';
    let isDisabled = "disabled";

    let inp = '';
    console.log(tech.children.length)
    if (tech.children.length){
        tech.children.forEach(function (child, i) {
            //console.log(child);

            let fields = '';
            child.fields.forEach(function (ins) {
                fields +=
                    "<li tech-lvl='" + ins.lvl + "' tech-id='" + ins.id + "' class='lastChild instruments_list_li'>" +
                    "<span>" + ins.name + "</span>" +
                    "</li>";
            });

            inp +=
                "<il tech-lvl='" + child.lvl + "' tech-id='" + child.id + "' class='operationName'>" +
                "<span class='caret'>" + child.name + "</span>" +
                "<ul class='nested pl-3 operationNameUl'>" +
                fields +
                "</ul>" +
                "</il>";
        });

        node =
            "<li tech-lvl='" + tech.lvl + "' tech-id='" + tech.id + "' class='techName'>" +
            "<span class='caret detailChildren'>" + tech.name + "</span>" +
            "<ul class='nested pl-3'>" +
            inp +
            "</ul>" +
            "</li>";
    }


    return node;
}
