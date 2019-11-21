$(function(){
  // обрабатываем сабмит формы при нажатии на кнопку сохранить
  // функция для добавления
  $('.div-add-category').on('submit', '#form-category-add', function() {
    //параметры для модели
    var params = {};
    params.category_name = $('#category-name').val();
    // передаем запрос в модель
    $.ajax	({
      url: SITE_URL+"category/save_add",
      data: params,
      type: "POST",
      async: false,
      success:	function (answer)
      {
        location.href = SITE_URL+"category";
      }
    });
    // чтобы форма не обрабатывалась сама после наших действий, прервем ее
    return false;
   });
   
   // обрабатываем сабмит формы при нажатии на кнопку сохранить
   // функция для редактирования существующей записи
   $('.div-edit-category').on('submit', '#form-category-edit', function() {
    //параметры для модели
    var params = {};
    params.category_id = $('#category-id').val();
    params.category_name = $('#category-name').val();
    // передаем запрос в модель
    $.ajax	({
      url: SITE_URL+"category/save_edit",
      data: params,
      type: "POST",
      async: false,
      success:	function (answer)
      {
        // при успешном ответе переходим обратно на странцу категорий
        location.href = SITE_URL+"category";
      }
    });
     // чтобы форма не обрабатывалась сама после наших действий, прервем ее
    return false;
   });
  
  $('.table-category').on('click', '.category_remove', function() {
    //параметры для модели
    var params = {};
    params.category_id = $(this).parent().parent().attr('data-id');
    // подтверждение удаления записи
    if (confirm("Удалить запись?")) {
      // передаем запрос в модель
      $.ajax({
        url: "category/delete",
        data: params,
        type: "POST",
        async: false,
        success:	function (answer)
        {
          // при успешном ответе перезагружаем страницу чтобы обновить таблицу
          location.reload();
        }
      });
    }
    
    return false;
  });

});