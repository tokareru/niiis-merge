$(function (){
    
    $("#pdm").on("change",function(){
        var id = $(this).children("option:selected").val();
        $("#change_pdm").html("загрузка...");
        $.ajax({
           url: "get_pdm_edit",
           type: "GET",
           data: {id:id},
           success:function(answer){
               $("#change_pdm").html(answer);
           }
        });
    });
    
});


