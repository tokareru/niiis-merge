function createAccordion(id) {
    getJsonByURL("json/round_and_role.json", setAccordionPanels, {
        accord_id: id
    });
}

function setAccordionPanels(json, add_data) {
    let accordion = $(add_data.accord_id);
    accordion.empty();
    let availablePanels = chooseAvailablePanels(json);
    let shell =  $("#shell");
    let availableSubscribers = shell.data("shellInterconnection").availableSubscribers;
    availablePanels.forEach(function (elem) {
        accordion.append("<p>" + elem.name + "</p><div id='" + elem.fieldID.replace(/#/, "") + "'></div>");
        setNotifyAndInitHandlers(elem);
        $("#"+ elem.ID).trigger("initialization");
        availableSubscribers.push(elem.ID);
    });
    shell.data("shellInterconnection", {"availableSubscribers": availableSubscribers});

    $(add_data.accord_id).accordion({
        classes:
            {
                'ui-accordion': 'my_ui-accordion',
                'ui-accordion-header': 'my_ui-accordion-header',
                'ui-accordion-header-collapsed': 'my_ui-accordion-header-collapsed',
                'ui-accordion-content': 'my_ui-accordion-content',
                'ui-accordion-header-active': 'myAccordionActive'
            },
        icons: false,
        heightStyle: "fill",
    });
}

function chooseAvailablePanels(json) {
    // место для логики выбора доступных панелей аккордиона
    let current_round = json.current_round;
    let current_role = json.current_role;
    let availablePanels = json.left_accordion;

    return availablePanels;
}

