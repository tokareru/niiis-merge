/*function createAccordion() {
    getJsonByURL("json/round_and_role.json", setAccordionPanels, {
        accord_id: "#left-accordion"
    });
}*/

function setAccordionPanels(json, add_data) {
    let accord_id = "#left-accordion";
    let accordion = $(accord_id);
    accordion.empty();
    let availablePanels = json;
    let shell =  $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    availablePanels.forEach(function (elem, index) {
        //accordion.append("<p>" + elem.name + "</p><div class='left_accord_div' id='" + elem.ID + "'></div>");
        setLeftPanel(accordion, accord_id, elem, availableSubscribers, true);
    });

    accordion.find(".collapsed").first().removeClass("collapsed").attr("aria-expanded", "true");

    shell.data("shellInterconnection", {"availableSubscribers": availableSubscribers});

    /* $(accord_id).accordion({
         classes:
             {
                 'ui-accordion': 'my_ui-accordion',
                 'ui-accordion-header': 'my_ui-accordion-header',
                 'ui-accordion-header-collapsed': 'my-accordion-header bg-dark',
                 'ui-accordion-content': 'my_ui-accordion-content',
                 'ui-accordion-header-active': 'myAccordionActive'
             },
         icons: false,
         animate: 200,
         heightStyle: "fill"
     });*/
}

function setLeftPanel(accordion, accord_id, elem, availableSubscribers, initMode = 0) {
    let panel = `
            <div class="card" id="accordion-card-${elem.ID}">
                <div class="card-header bg-dark" id="header-${elem.ID}">
                        <h5 class="mb-0 btn-group d-flex" role="group">
                            <button type="button" style="text-decoration: none; color: white;" class="btn btn-block btn-link collapsed" data-toggle="collapse" data-target="#collapse-${elem.ID}" aria-expanded="false" aria-controls="collapse-">
                            ${elem.name}
                            </button>
                            <button type="button" class="reloadButtonToHide leftSideReloadButton font-family-fontAwesome btn btn-dark">
                                <span class="font-family-fontAwesome small-spinner-border"></span>
                            </button>
                        </h5>
                </div>    
                <div id="collapse-${elem.ID}" class="collapse" aria-labelledby="header-${elem.ID}" header-name="${elem.name}" data-parent="${accord_id}">
                    <div id="${elem.ID}" class="card-body">
                    </div>
                </div>
            </div>`
    if (elem.ID === "pdm_field"){
        accordion.prepend(panel)
    }else {
        accordion.append(panel)
    }
    setNotifyAndInitHandlers(elem);
    $("#"+ elem.ID).trigger("initialization");
    availableSubscribers.push(elem.ID);
    let thisCard = $(`#accordion-card-${elem.ID}`);
    thisCard.on("click", ".leftSideReloadButton", function () {
        getDetailsInfo("all", true);
        thisCard.remove();
        if (initMode && thisCard.find("button").first().attr("aria-expanded") == "true"){
            setLeftPanel(accordion, accord_id, elem, availableSubscribers, 1);
        }else{
            setLeftPanel(accordion, accord_id, elem, availableSubscribers, 0);
        }
    })

    setTimeout(function () {
        stopProcessOfSaving(document.getElementsByClassName("leftSideReloadButton"))
    }, 500)

    if (initMode === 1){
        thisCard.find("button").first().trigger("click");
    }
    //console.log(thisCard)
}

function chooseAvailablePanels(json) {
    // место для логики выбора доступных панелей аккордиона
    let current_round = json.current_round;
    let current_role = json.current_role;
    let availablePanels = json.left_accordion;

    return availablePanels;
}
