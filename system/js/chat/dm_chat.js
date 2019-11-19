$(function () {
    initDMChat(countUsers());
});

function initDMChat(count_users) {
    $('#chat_dm').data({'currentDM': '#dm_user_0'});

    generateDMChat(count_users);
    $('#chat_dm').tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $('#chat_dm .chat_dm_ul').find('li').removeClass("ui-corner-top").addClass("ui-corner-left");

    initDMChats();
    setInterval(function () {
        $('#chat_dm').find('div').has('ul').each(function () {
            let $this = $(this);
            let count_mes = 0;
            count_mes = countCommentsNeedToAdd($(this),
                {
                    type: 'DM',
                    current_login: login,
                    login_user_chat_with: $(this).data('login_user_chat_with'),
                    function: 'count_comments'
                });
            if(count_mes === 0)
            {
                return;
            }
            printComments($(this),
                {
                    type: 'DM',
                    current_login: login,
                    login_user_chat_with: $(this).data('login_user_chat_with'),
                    count_messages: count_mes,
                    function: 'print_comment'
                }, false);
            $('#chat_dm').find('a').each(function () {
                if ($(this).attr('href') === ('#' + $this.attr('id'))) {
                    let $chat_dm =  $('#chat_dm');
                    if ($(this).attr('href') !== $chat_dm.data('currentDM')) {
                        $(this).parent().parent().addClass('chat_unread_messages');
                        let temp_count = $chat_dm.find($(this).attr('href'))
                            .data('unread_messages') + count_mes;
                        if(temp_count >= 1000 || $chat_dm.find($(this).attr('href'))
                            .data('unread_messages') === '999+')
                        $chat_dm.find($(this).attr('href'))
                            .data({'unread_messages': "999+"});
                        else $chat_dm.find($(this).attr('href'))
                            .data({'unread_messages': temp_count});

                        $(this).html('<div class="chat_unread_messages_user_name">'
                            +$chat_dm.find($(this).attr('href'))
                                .data('login_user_chat_with') +'</div>'
                            + '<div class="chat_unread_messages_span">' +$chat_dm.
                            find($(this).attr('href'))
                            .data('unread_messages') + '</div>');
                    }
                }
            });

        })
    }, 3000);

    $('#chat_all_DM').on('click', 'li', function () {
        let $attr = $(this).find('a').attr('href');
        if ($attr !== '#chat_window_chat') {
            $('#chat_window').data({'name': $('#chat_dm').data('currentDM')});
            $('.chat_dm_ul').find('a').each(function () {
                if ($(this).attr('href') === $('#chat_dm').data('currentDM')) {
                    $(this).html($('#chat_dm').find($(this).attr('href'))
                        .data('login_user_chat_with'));
                   $('#chat_dm').find($(this).attr('href'))
                        .data({'unread_messages': 0});
                    $(this).removeClass('chat_unread_messages');
                }
            })
        } else $('#chat_window').data({'name': '#chat_window_chat'});
    });

    $('.chat_dm_ul').on('click', 'li', function () {
        $('#chat_window').data({'name': $(this).find('a').attr('href')});
        $('#chat_dm').data({'currentDM': $(this).find('a').attr('href')});
        $(this).find('a').html($('#chat_dm').find( $(this).find('a').attr('href'))
            .data('login_user_chat_with'));
        $('#chat_dm').find( $(this).find('a').attr('href'))
            .data({'unread_messages': 0});
        $(this).removeClass('chat_unread_messages');
    });

}

function generateDMChat(count_users) {
    let loginUsers = getLoginNames();
    let $chat_dm = $('#chat_dm');
    let $dm_li = $chat_dm.find('.chat_dm_ul').eq(0);
    for (let i = 0; i < count_users; i++) {
        $dm_li.append('<li class="dm_tabs_links_li"></li>');
        $dm_li.find('li').eq(i).append('<div class="dm_tabs_links"><a href="#dm_user_' + i +
            '">' + 'user_' + i  + '</a></div>');
    }
    for (let i = 0; i < count_users; i++) {
        console.log(loginUsers[i]);
        $chat_dm.append('<div id="dm_user_' + i + '" class="dm_window"><ul></ul></div>');
        $chat_dm.find('#dm_user_' + i).data({
            'login_user_chat_with': loginUsers[i],
            'count_messages': 0,
            'unread_messages': 0
        });
    }

}

function getLoginNames() {
    let loginUsers = [];
    $.ajax({
        url: 'chat_ajax',
        type: 'POST',
        data: JSON.stringify({current_login: login, function: 'login_users'}),
        success: function (data) {
            let dataLoginUsers = JSON.parse(data);
            for (let login in dataLoginUsers)
            {
                loginUsers.push(login);
            }
        }
    });
    return loginUsers;
}

function initDMChats() {
    $('#chat_dm').find('div').has('ul').each(function (index) {
        printComments($(this), {
            type: 'DM',
            current_login: login,
            login_user_chat_with: $(this).data('login_user_chat_with'),
            count_messages: 100,
            function: 'print_comment'
        });
    });
}

function countUsers() {
    let count = 0;
    $.ajax({
        type: 'POST',
        url: 'chat_ajax',
        data:  JSON.stringify( {function: 'count_users'}),
        success: function (data) {
            let JSONcount = JSON.parse(data);
            count = JSONcount.count;
            console.log(count);
        }
    });
    return count;
}
