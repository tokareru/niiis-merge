function startProcessOfSaving(thisButton) {
    let $button = $(thisButton);
    $button.append(`
        <span class="ml-2 font-family-fontAwesome small-spinner-border"></span>
    `)
}

function stopProcessOfSaving(thisButton) {
    let $button = $(thisButton);
    let $span = $button.find("span")
    $span.addClass("fa-check").addClass("text-success").removeClass("small-spinner-border").fadeOut({
        done: function () {
            $span.remove();
        },
        duration: 800
    });
}
