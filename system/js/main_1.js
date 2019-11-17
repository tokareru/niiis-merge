$(document).ready(function () {
    shellInit();
    createTabs();
    createAccordion();

    //forbidPressRightMouseButton();
});

// получаем информацию о доступных вкладках и передаем информацию в функцию setTabs
function getRoleAndRound(url ,callback) {
    // получаем сведения о роле и раунде
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        success: function (json) {
            //console.log("Data loaded");
            callback(json);
        },
        error: function (message) {
            //console.log("Can't load the data");
        },
    })
}


//блокировка нажатия правой кнопки мыши
function forbidPressRightMouseButton() {
    document.oncontextmenu = function() {return false;};
    $(document).mousedown(function(e){
        if( e.button == 2 ) {
            //alert('Right mouse button!');
            return false;
        }
        return true;
    });
}



