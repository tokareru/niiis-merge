let login = 'Vasya';
$(function () {
    initAllUsersChat();
});

function initAllUsersChat() {
    let $chat_window_chat = $('#chat_window_chat');
    $('#chat_window').data({'name': '#chat_window_chat'});

    $chat_window_chat.data({'count_messages': 0});
    $('#chat_window').tabs({
        classes:
            {
                'ui-tabs-tab': 'my_ui-tabs-tab',
                'ui-tabs-active': 'my_ui-tabs-active'
            }
    });

    //начальная инициализация общего чата, грузятся последние 100 сообщения
    printComments($chat_window_chat, {type: 'ALL', count_messages: 100});

    setInterval(function () {
        printComments($chat_window_chat,
            {
                type: 'ALL',
                    count_messages: countCommentsNeedToAdd($chat_window_chat, {
                    type: 'ALL',
                    function: 'count_comments'
                }),
                function: 'print_comment'
            }, false);
    }, 100);

    $('#but').on('click', function () {
        chatClick();
    });

    $("#shell").click(function () {

        if($('#but').children().attr('id') === 'span_icon_right')
        {
            $('#but').trigger("click");
        }
    });

    $('#chat_window_text').on('keypress', function (event) {
       if(event.which === 13) {
           event.preventDefault();
           $('#chat_window_button').click();
       }

    });

    $('#chat_window_button').on('click', function (e) {
        e.preventDefault();
        chatMessages($($('#chat_window').data('name')));
    });
}

//функция считывания сообщения из textarea (без валидации)
function chatMessages($chat) {
    let $text = $('#chat_window_text').val();
    if ($text === '') {
        return;
    }
    $('#chat_window_text').val('');
    let count = $chat.data('count_messages') + 1;
    $chat.data({'count_messages': count});

    let date_str = getCurDate(new Date());
    let $text_wUserDate = '<span class="spanTextLogin">' + login + '</span>' +
        '<span class="spanTextDate"> '
        + date_str + ':</span>';
    let $chat_ul = $chat.find('ul');
    $chat_ul.append('<li>'
        + $text_wUserDate + '</li>');
    $chat_ul.append('<li></li>');
    $chat.find('li:last-child').text($text);
    let objData = {};
    if ($chat.attr('id') === 'chat_window_chat')
        objData = {type: 'ALL', time: Date.now(), current_login: login, comment: $text, function: 'add_comment'};
    else {
        objData = {
            type: 'DM',
            time: Date.now(),
            current_login: login,
            login_user_chat_with: $chat.data('login_user_chat_with'),
            comment: $text,
            function: 'add_comment'
        };
    }
    $.ajax({
        url: 'chat_ajax',
        type: 'POST',
        data: objData,
        complete: function(){
            console.log('message added');
        },
        error: function () {
            $('#chat_window_text').val('Ошибка загрузки');
        }
    });
    $chat.scrollTop($chat[0].scrollHeight);
}


//функция сдвига влево/вправо чата
function chatClick() {
    let css_left = -$('#chat_main').width() + $('#but').width() + 'px';
    let css_right = '0px';
    let chat_main = $('#chat_main');
    let chat_but = $('#but');
    if (chat_main.attr('style') !== ('right: ' + css_right + ';')) {
        chat_main.animate({
                right: css_right
            },
            300, 'linear'
        );
        chat_main.removeAttr('style');
        chat_but.children().attr('id', 'span_icon_right');
    } else {
        chat_main.animate({
                right: css_left
            },
            300, 'linear'
        );
        chat_but.children().attr('id', 'span_icon_left');
    }
}

//печать комментов из базы-данных
function printComments($chat, dataToAjax, scrollDown = true) {
    if (dataToAjax.count_messages <= 0)
        return;

    $.ajax({
        url: 'chat_ajax',
        data: dataToAjax,
        type: 'POST',
        success: function (data) {
            addCommentsByData(data, $chat);
        },
        complete: function () {
            if (scrollDown)
                $chat.scrollTop($chat[0].scrollHeight);
        }
    });
}

function countCommentsNeedToAdd($chat, dataToAjax) {
    let count = currentCountMessagesOnServer($chat, dataToAjax);
    if (count - $chat.data('count_messages') < 0)
        return 0;
    return count - $chat.data('count_messages');
}

function currentCountMessagesOnServer($chat, dataToAjax) {
    let count = 0;
    $.ajax({
        url: 'chat_ajax',
        type: 'POST',
        data: dataToAjax, //тип чата (и с кем чат)
        success: function (data) {
            count = data.count;
            console.log('currentCountMessagesOnServer: ' + data.count);
        }
    });
    return count;
}

//Будет заменена модернизированной printComments
//добавление недостающих комментов на текущей странице
function addNewComments() {
    let $count = 0;
    $.ajax({
        url: 'comments.php',
        type: 'POST',
        data: {function: 'count'},
        success: function (data) {
            $count = Number(data);
            if (count_comments < $count) {

                $count -= count_comments;
                $.ajax({
                    url: 'comments.php',
                    type: 'POST',
                    data: {function: 'add_some_comments', count: $count},
                    success: function (data) {
                        addCommentsByData(data);
                    },
                    complete: function () {
                        let $chat_w_chat = $('#chat_window_chat');
                        $chat_w_chat.scrollTop($chat_w_chat[0].scrollHeight);
                    }
                });
                count_comments = Number(data);
            }
        }
    });
}

//добавляет комменты на страничку
function addCommentsByData(data, $chat) {
    let $chat_ul = $chat.find('ul');
    for (let time in data) {
        let date = new Date();
        date.setTime(Number(time));
        let date_str = getCurDate(date);
        let $text_wUserDate = '<span class="spanTextLogin">' + data[time].login + '</span>' +
            '<span class="spanTextDate"> '
            + date_str + ':</span>';
        $chat_ul.append('<li>' + $text_wUserDate + '</li>');
        $chat_ul.append('<li></li>');
        $chat.find('li:last-child').text(data[time].comment);
    }
    let count = $chat.data('count_messages') + data.length;
    $chat.data({'count_messages': count});
}

//следующие функции преобразовывают дату. Проблема в том, что дата
//берется из Date(), который сам берет дату от пользовательского устройства
function getCurDate(date) {
    let str = dateToStr(date) + ' ';
    str += date.getHours() + ':';
    if (date.getMinutes() < 10)
        str += '0' + date.getMinutes();
    else str += date.getMinutes();

    return str;
}

function dateToStr(date) {
    let str = "";
    if (date.getDate() < 10)
        str += "0" + (date.getDate());
    else str += (date.getDate());
    str += ".";
    if (date.getMonth() + 1 < 10)
        str += "0" + (date.getMonth() + 1);
    else str += (date.getMonth() + 1);
    str += ".";
    str += date.getFullYear();
    return str;
}
