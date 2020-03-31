$(function (){
    
    $("#change_esi").on("change",function(){
        var id = $(this).children("option:selected").val();
        $("#esi").html("загрузка...");
        $.ajax({
           url: "get_esi_edit",
           type: "GET",
           data: {id:id},
           success:function(answer){
               $("#esi").html(answer);
               $("#esi_save").on("click",function(){
                var id = $("#change_esi").children("option:selected").val();
                var name = $("#esi #name").val();
                var designation = $("#esi #designation").val();
                var position = $("#esi #position").val();
                $.ajax({
                   url: "save_esi_edit",
                   type: "POST",
                   data: {id:id, name:name, designation:designation, position:position},
                   success:function(answer){
                        console.log(answer);
                   }
                });
                });
           }
        });
    });
    
    
});


