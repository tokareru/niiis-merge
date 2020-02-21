$(function () {
    let is_load = false;
    $(".edit").on("click",function(){
        is_load = false;
        $('#exampleModal').modal("show");
        var id = $(this).attr("id");
        $('#exampleModal #id').val(id);
         $.ajax({
            url: "get_user_info_by_id",
            type: "POST",
            data: { 
                    id:id,
                   },
            success: function (answer)
            {
                
                $('#exampleModal #first_name').val(answer.first_name);
                $('#exampleModal #last_name').val(answer.last_name);
                $('#exampleModal #otc').val(answer.otc);
                $('#exampleModal #login').val(answer.login);
                $('#exampleModal #password').val(answer.password);
                $('#exampleModal #loading').attr("hidden", "hidden");
                $('#exampleModal #content').removeAttr("hidden");
                is_load = true;
            }
        });
       
    })
    $("#exampleModal #save").on("click", function(){
        if(is_load){
            $.ajax({
                url: "save_users_edit",
                type: "POST",
                data: { 
                        id         : $("#exampleModal #id").val(),
                        first_name : $("#exampleModal #first_name").val(),
                        last_name  : $("#exampleModal #last_name").val(),
                        otc        : $("#exampleModal #otc").val(),
                        login      : $("#exampleModal #login").val(),
                        password   : $("#exampleModal #password").val(), 
                       },
                success: function (answer)
                {
                    console.log(answer);
                    alert("Сохранено");
                    var id = $("#exampleModal #id").val();
                    var changed_row = "#table_edit #"+id+" ";
                    var fio = $("#exampleModal #last_name").val() + ' ' + $("#exampleModal #first_name").val()+ ' ' + $("#exampleModal #otc").val()
                    $(changed_row+"#fio").html(fio);
                    $(changed_row+"#login").html($("#exampleModal #login").val());
                    $(changed_row+"#password").html($("#exampleModal #password").val());
                    $("#exampleModal").modal("hide");
                }
            });
        }
    });
    $(".active_sign").on("change",function(){
        var id = $(this).parents("tr:first").attr("id");
         $.ajax({
            url: "change_user_active_sign",
            type: "POST",
            data: { 
                    id:id,
                   },
            success: function (answer)
            {
                console.log(answer);
            }
        });
    })
});