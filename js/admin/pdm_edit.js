$(function (){
    
    $("#change_pdm").on("change",function(){
        var id = $(this).children("option:selected").val();
        $("#pdm").html("загрузка...");
        $.ajax({
           url: "get_pdm_edit",
           type: "GET",
           data: {id:id},
           success:function(answer){
               $("#pdm").html(answer);
               $("#pdm_save").on("click",function(){
                var id = $("#change_pdm").children("option:selected").val();
                var model_name = $("#pdm #model_name").val();
                var path_3d = $("#pdm #path_3d").val();
                var description = $("#pdm #description").val();
                var type_id = $("#pdm #type").children("option:selected").val();
                $.ajax({
                   url: "save_pdm_edit",
                   type: "POST",
                   data: {id:id, model_name:model_name, path_3d:path_3d, description:description, type_id:type_id},
                   success:function(answer){
                        console.log(answer);
                   }
                });
                });
           }
        });
    });
    
});


