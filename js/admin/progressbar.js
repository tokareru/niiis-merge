$(function () {
    $("#users").on("change",function(){
        var user =  $(this). children("option:selected"). val();
        $("#table").html("загрузка...");
        $.ajax({
            url:"get_logs",
            data: {login:user},
            success: function(answer){
                $("#table").html(answer);
            }
        })
    }).trigger("change");
});


