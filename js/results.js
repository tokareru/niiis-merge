var MODUL_NAME='results'
$(function(){
  
  $('select.konkurs').on('change',function(){
    $('.main-form').submit()
  })
  
  // сохранение при потере фокуса
  $('.table-modul').on('change','.ball,.result_type',function(){
    
    var tr=$(this).closest('tr')
    var id=$(tr).attr('data-konk-id')
    var result_type=$(tr).find('.result_type').val()
    var ball=$(tr).find('.ball').val()
    
    $.ajax	({
      url: SITE_URL+MODUL_NAME+"/save_result",
      data: {id:id,result_type:result_type,ball:ball},
      type: "POST",
      async: false,
      success:	function (answer)
      {
        if(answer.result){
          Message('Сохранено');
        }
      }
    });
    
  })
  
});
