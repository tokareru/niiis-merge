function startProcessOfSaving(thisButton, isReloadButton = true) {
    let $button = $(thisButton);
    let add_classes = (!isReloadButton) ? "ml-2": "";
    $button.append(`
        <span class="${add_classes} font-family-fontAwesome small-spinner-border"></span>
    `);
    if (isReloadButton)
        $button.removeClass("fa-refresh")
}

function stopProcessOfSaving(thisButton, isReloadButton = true) {
    let $button = $(thisButton);
    let $span = $button.find("span")
    $span.addClass("fa-check").addClass("text-success").removeClass("small-spinner-border").fadeOut({
        done: function () {
            $span.remove();
            if (isReloadButton)
                $button.addClass("fa-refresh")
        },
        duration: 800
    });
}
