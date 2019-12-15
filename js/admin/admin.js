$(function(){
   $.ajax({
      url:"start_ajax",
      success:function(data){
          $.each(data,function(index,elem){
              if(index == 'round'){
                  $("#change_round option[value='"+elem+"']").attr("selected","selected");
                  $("#current_round").html(elem);
              }
          });
      }
       
   });
   $("#change_round").on("change", function(){
       $("#current_round").html($("#change_round").val());
   });
});

