$(function(){
   $.ajax({
      url:"start_ajax",
      success:function(data){
          $.each(data,function(index,elem){
              if(index == 'round'){
                  $("#change_round option[value='"+elem+"']").prop('selected', true);
                  $("#current_round").html(elem);
              }
          });
      }
       
   });
   
   $("#change_round").on("change", function(){
       $("#current_round").html($("#change_round").val());
        var round = $("#change_round").val();
        $.ajax	({
            url: "start_ajax/set_data",
            type: "GET",
            data:{round:round},
            success:	function (answer)
            {
            }
        });
   });
   
   $("#reset").on("click",function(){
      $.ajax({
      url:"admin_cab/reset",
      success:function(data){
          $.each(data,function(index,elem){
              if(index == 'round'){
                  $("#change_round option[value='"+elem+"']").prop('selected', true);
                  $("#current_round").html(elem);
              }
          });
      }
   });
   });
});

