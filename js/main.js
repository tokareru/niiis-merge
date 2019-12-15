  $(function () {
    // Смена пользователя
    $('.select_user').on('change', function () {
      var id = $(this).val();
      $.ajax({
        url: SITE_URL + "ajax/select_user",
        data: {id: id},
        type: "POST",
        async: false,
        success: function (answer) {
          if (answer.result == '1') {
            location.reload();
          }
        }
      })
    })

    jQuery(function ($) {
      $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
      };
      $.datepicker.setDefaults($.datepicker.regional['ru']);
    });
    // заполнение счетчиков значениями
    $.ajax({
      url: SITE_URL + "default/counters",
      type: "POST",
      async: false,
      success: function (answer)
      {
        if (answer.result) {
          $('*').find('#count_programs').html(answer.count_programs);
          $('*').find('#count_nastav').html(answer.count_nastav);
          $('*').find('#count_groups').html(answer.count_groups);
          $('*').find('#count_abits').html(answer.count_abits);
          $('*').find('#count_orgs').html(answer.count_orgs);
          $('*').find('#count_abits').html(answer.count_abits);
          $('*').find('#count_abits_ind').html(answer.count_abits_ind);
          $('*').find('#count_events').html(answer.count_events);
          $('*').find('#count_testprof').html(answer.count_testprof);

        }
      }
    });
      shellInit();
  });

  /**
   * Выводится сообщение на несколько секунд в правом верхнем углу окна,
   * затем исчезает
   * @param {string} text Текст сообщения
   * @param {string} type Тип сообщения - цвет фона.
   * success - зелёный (по умолчанию)
   * danger - красный
   * @returns {undefined}
   */
  function Message(text, type = 'success') {

    var alertType = 'alert-success';
    if (type === 'danger') {
      alertType = 'alert-danger';
    }

    var messdiv = $('<div class="alert ' + alertType + ' alert-dismissible" role="alert" />')
      .html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> ' + text + '')
      .css({});

    if ($('.message_container').length === 0) {
      var cont = $('<div class="message_container" />')
        .css({'position': 'fixed', 'top': 0, 'right': 0});
      $('body').append(cont);
    }
    $('.message_container').append(messdiv);

    $(messdiv).delay(5000).slideUp('slow', function () {
      $(this).remove();
    });

  }
