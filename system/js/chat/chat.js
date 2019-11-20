let login = "";
let Max_count_messages = 20;
let Server_count = initServerCount();


function initAllUsersChat() {
    let $chat_window_chat = $('#chat_window_chat');
    $('#chat_window').data({'name': '#chat_window_chat'});

    $chat_window_chat.data({'count_messages': 0, login_user_chat_with: '#chat_window_chat'});
    $('#chat_window').tabs({
        classes:
            {
                'ui-tabs-tab': 'my_ui-tabs-tab',
                'ui-tabs-active': 'my_ui-tabs-active'
            }
    });

    //начальная инициализация общего чата, грузятся последние 100 сообщения
    printComments($chat_window_chat, {
        type: 'ALL', count_messages: Max_count_messages, function: 'print_comment'
    }, true);

    setInterval(function () {
        addNewComments($chat_window_chat,
            {
                type: 'ALL',
                function: 'count_comments'
            },
            {
                type: 'ALL', count_messages: 0, function: 'print_comment'
            })

    }, 5000);

    $('#but').on('click', function () {
        chatClick();
    });

    $("#shell").click(function () {

        if ($('#but').children().attr('id') === 'span_icon_right') {
            $('#but').trigger("click");
        }
    });

    $('#chat_window_text').on('keypress', function (event) {
        if (event.which === 13) {
            event.preventDefault();
            $('#chat_window_button').click();
        }

    });

    $('#chat_window_button').on('click', function (e) {
        e.preventDefault();
        chatMessages($($('#chat_window').data('name')));
    });
}

function initServerCount() {
    console.log('cur login: ' + login);
    let count = 0;
    let arrOfServerCount = {'#chat_window_chat': 0};

        $.ajax({
            url: 'chat_ajax',
            type: 'POST',
            async: false,
            data: {current_login: login, function: 'login_users'},
            success: function (data) {
                for (let login in data) {
                    arrOfServerCount[data[login]] = 0;
                }
            },
        });
    for (let key in arrOfServerCount)
    {
        let dataObj = {};
        if (key === '#chat_window_chat')
            dataObj = {type: 'ALL',
                function: 'count_comments'};
        else {
           dataObj = {type: 'DM',
                current_login: login,
                login_user_chat_with: key,
                function: 'count_comments'};
        }
        $.ajax({
            url: 'chat_ajax',
            type: 'POST',
            async: true,
            data: dataObj,
            success: function (data) {
                arrOfServerCount[key] = data.count;
            }
        });
    }
    /*for (let key in arrOfServerCount)
        console.log('key: ' + key + ' val: ' + arrOfServerCount[key]);*/
    return arrOfServerCount;
}
//функция считывания сообщения из textarea (без валидации)
function chatMessages($chat) {
    let $text = $('#chat_window_text').val();
    if ($text === '') {
        return;
    }
    $('#chat_window_text').val('');
    console.log('old count: ' + $chat.data('count_messages'));
    let count = $chat.data('count_messages') + 1;
    $chat.data({'count_messages': count});
    Server_count[$chat.data('login_user_chat_with')] += 1;
    console.log('new count: ' + $chat.data('count_messages'));
    console.log('message added');

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
        complete: function () {

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
function printComments($chat, dataToAjax, init_count = false, scrollDown = true) {
    if (dataToAjax.count_messages <= 0) {
        return;
    }

    $.ajax({
        url: 'chat_ajax',
        data: dataToAjax,
        type: 'POST',
        success: function (data) {
            addCommentsByData(data, $chat, init_count);
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
        async: true,
        data: dataToAjax, //тип чата (и с кем чат)
        success: function (data) {
            count = data.count;
            console.log(data);
            console.log('currentCountMessagesOnServer: ' + data.count);
        }
    });
    return count;
}

function addNewComments($chat, dataToAjaxCount, dataToAjaxPrint) {
    console.log($chat.data('login_user_chat_with') + ' cur count: ' + $chat.data('count_messages'));
    let count = 0;
    let curCount = $chat.data('count_messages');
    $.ajax({
        url: 'chat_ajax',
        type: 'POST',
        async: true,
        data: dataToAjaxCount, //тип чата (и с кем чат)
        success: function (data) {
            count = data.count;
            let login_other_user =  $chat.data('login_user_chat_with');
            console.log('count: ' + count+ ' Server_count[login_other_user]' +Server_count[login_other_user] );
            if (count > Server_count[login_other_user]) {
                let count_to_ajax = count - Server_count[login_other_user];
                Server_count[login_other_user] = count;
                dataToAjaxPrint.count_messages += count_to_ajax;
                console.log(dataToAjaxPrint);
                console.log($chat.data('login_user_chat_with') + ' new count: ' + (count_to_ajax));
                printComments($chat, dataToAjaxPrint);
                $chat.data({'count_messages': count_to_ajax});
                //console.log('$chat.data("unread_messages: ' + $chat.data("unread_messages"));
                if ($chat.data("unread_messages") !== undefined)
                    $chat.data({"unread_messages": count_to_ajax});
            }
        }
    });

}

//добавляет комменты на страничку
function addCommentsByData(data, $chat, init_count) {
    let $chat_ul = $chat.find('ul');
    /*for (let time in data) {
        //console.log('key: ' + time + ' login & comment:' + data[time].login + " " + data[time].comment);
        console.log('key: '+ time);
        for (let key in data[time])
            console.log('val: '+ data[time][key]+ ' key: '+ key);
    }*/
    let countMes = 0;
    for (let key in data) {
        if (key !== 'response') {
            countMes++;
            //let date = new Date();
            //date.setTime(Number(data[key].time));
            let date_str = data[key].time;
            let $text_wUserDate = '<span class="spanTextLogin">' + data[key].login + '</span>' +
                '<span class="spanTextDate"> '
                + date_str + ':</span>';
            $chat_ul.append('<li>' + $text_wUserDate + '</li>');
            $chat_ul.append('<li></li>');
            $chat.find('li:last-child').text(data[key].comment);
        }
    }
    if (init_count) {
        let count = $chat.data('count_messages') + countMes;
        $chat.data({'count_messages': count});
    }

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
