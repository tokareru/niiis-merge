$(function(){
  
  // Скролл наверх
  $('.nav-tabs a').click(function (e) 
  {
//    location.hash=$(this).attr('href')
    $(this).tab('show');
    
//    var hash = window.location.hash.substr(1);  
//    var scrollPos = $('a[name="'+hash+'"]').offset().top;
    $("html, body").animate({ scrollTop: 0 }, 0); 
                
    return false;
  });
  // --Скролл наверх
  
  
  $('.show_program').on('click',function(){
    var modal=$('#showProgramModal');

    var prog_id = $(this).parent().parent().attr('data-id');
//    var prog_id = 0;
//    // читаем переменную со страницы чтобы определить селект
//    var prog_id_in_page = $('.abit_groups').find('.program_id').val()
    $.ajax	({
      url: "login/program_modal",
      type: "POST",
      data:{prog_id:prog_id},
      async: false,
      success:	function (answer)
      {
        // заполняем модаль
        $('.show_program_modal_body').html(answer);
        // показываем ее
        $(modal).modal();
      }
    });
    return false;
  })
  
  $('.show_nastavnik').on('click',function(){
    var modal=$('#showNastavnikModal');

    var nast_id = $(this).parent().attr('data-id');
//    var prog_id = 0;
//    // читаем переменную со страницы чтобы определить селект
//    var prog_id_in_page = $('.abit_groups').find('.program_id').val()
    $.ajax	({
      url: "login/nastavnik_modal",
      type: "POST",
      data:{nast_id:nast_id},
      async: false,
      success:	function (answer)
      {
        // заполняем модаль
        $('.show_nastavnik_modal_body').html(answer);
        // показываем ее
        $(modal).modal();
      }
    });
    return false;
  })
  
});