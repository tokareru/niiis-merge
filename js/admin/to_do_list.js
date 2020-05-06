$(function () {
    $.ajax({
        url: 'get_change_users',
        type: 'GET',
        success: function (data) {
            console.log(data)
        },
        error: function (data) {
            console.log('error');
        }
    });
})
