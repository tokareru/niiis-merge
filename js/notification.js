function generateNotification(notification) {
    let toast_position = $("#toast-position");
    toast_position.append(
        `
                <div class="toast" role="alert" data-autohide="false" aria-live="assertive"
                     aria-atomic="true">
                    <div class="toast-header">                        
                        <strong class="mr-auto">${notification.mainHeader}</strong>
                        <small class="text-muted">${notification.extraHeader}</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Закрыть">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                    ${notification.text }
                    </div>
                </div>
`
    );
    let toast = toast_position.find(".toast");
    toast.toast("show");
    toast.find("button").last().click(function () {
        toast.remove();
    })
}

function initNotifications() {
    $("#tabs li[aria-controls=\"technological_process_field\"]").on("click", function () {
        generateNotification({
            mainHeader: "Рабочий стол. Техпроцесс",
            extraHeader: "",
            text: "Чтобы создать техпроцесс, перетащите узлы Справочника технолога в центр рабочего стола"
        })
    });
}



