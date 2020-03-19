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
        accordion.append(
            `<div class="card">
                    <div class="card-header bg-dark" id="header-${elem.ID}">
                        <h5 class="mb-0">
                            <button style="text-decoration: none; color: white;" class="btn btn-block btn-link collapsed" data-toggle="collapse" data-target="#collapse-${elem.ID}" aria-expanded="false" aria-controls="collapse-">
                            ${elem.name}
                            </button>
                        </h5>
                    </div>

                <div id="collapse-${elem.ID}" class="collapse" aria-labelledby="header-${elem.ID}" header-name="${elem.name}" data-parent="${accord_id}">
                    <div id="${elem.ID}" class="card-body">
                    </div>
                </div>
            </div>`
        );
        setNotifyAndInitHandlers(elem);
        $("#"+ elem.ID).trigger("initialization");
        availableSubscribers.push(elem.ID);
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

function chooseAvailablePanels(json) {
    // место для логики выбора доступных панелей аккордиона
    let current_round = json.current_round;
    let current_role = json.current_role;
    let availablePanels = json.left_accordion;

    return availablePanels;
}
