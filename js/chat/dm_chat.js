function initChats() {
    initAllUsersChat();
    initDMChat(getLoginNames().length);
    Server_count = initServerCount();

    //console.log('cur login: ' + login);
    /*setInterval(function () {
            $.ajax({
                url: 'chat_ajax',
                type: 'POST',
                async: true,
                data: {
                    type: 'DM',
                    time: Date.now(),
                    current_login: 'designer',
                    login_user_chat_with: 'worker',
                    comment: 'test',
                    function: 'add_comment'
                },
                success: function (data) {
                    console.log('test add mes');
                    console.log(data);
                }
            });
        }, 10000);


    setInterval(function () {
            $.ajax({
                url: 'chat_ajax',
                type: 'POST',
                async: true,
                data: {
                    type: 'DM',
                    current_login: 'designer',
                    login_user_chat_with: 'worker',
                    function: 'count_comments'
                },
                success: function (data) {
                    console.log('test');
                    console.log(data);
                }
            })
        }
        , 10000);*/
}

function initDMChat(count_users) {
    //console.log('cur name: ' + currentName);
    //$('#chat_dm').data({'currentDM': '#dm_user_0'});
    $('#chat_window').data({'name': '#dm_user_0', 'init': true});
    generateDMChat(count_users);
    $('#chat_dm').tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $('#chat_dm .chat_dm_ul').find('li').removeClass("ui-corner-top ")
        .addClass("ui-corner-left");

    //initDMChats();
    let speed = 5000;
    setInterval(function () {
        let $chat_window_chat = $('#dm_user_0');

        if ($('#chat_window').data('init')) {
            //$chat_window_chat.find('ul').append('<li>' + 'Чат загружается...' + '</li>');
        } else speed = 5000;
        addNewComments($chat_window_chat,
            {
                type: 'ALL',
                function: 'count_comments'
            },
            {
                type: 'ALL', count_messages: 0, function: 'print_comment'
            });
        $('#chat_dm').find('.chats_div').children().each(function (index) {
                if (index !== 0) {

                    let $this = $(this);
                    if ($('#chat_window').data('init')) {
                        //$this.find('ul').append('<li>' + 'Чат загружается...' + '</li>');
                    }
                    addNewComments($this,
                        {
                            type: 'DM',
                            current_login: login,
                            login_user_chat_with: $this.data('login_user_chat_with'),
                            function: 'count_comments'
                        }, {
                            type: 'DM',
                            current_login: login,
                            login_user_chat_with: $this.data('login_user_chat_with'),
                            count_messages: 0,
                            function: 'print_comment'
                        }
                    );

                    let count_mes = $(this).data('unread_messages');
                }
                /* console.log('count_mes ' + count_mes);
                 if (count_mes === 0) {
                     return;
                 }*/

                /*$('#chat_dm').find('a').each(function () {
                    if ($(this).attr('href') === ('#' + $this.attr('id'))) {
                        let $chat_dm = $('#chat_dm');
                        if ($(this).attr('href') !== $chat_dm.data('currentDM')) {
                            $(this).parent().parent().addClass('chat_unread_messages');
                            let temp_count = count_mes;
                            if (temp_count >= 1000 || $chat_dm.find($(this).attr('href'))
                                .data('unread_messages') === '999+')
                                $chat_dm.find($(this).attr('href'))
                                    .data({'unread_messages': "999+"});
                            else $chat_dm.find($(this).attr('href'))
                                .data({'unread_messages': temp_count});

                            $(this).html('<div class="chat_unread_messages_user_name">'
                                + $chat_dm.find($(this).attr('href'))
                                    .data('login_user_chat_with') + '</div>'
                                + '<div class="chat_unread_messages_span">' + $chat_dm.find($(this).attr('href'))
                                    .data('unread_messages') + '</div>');
                        }
                    }
                });*/

            }
        );
        if ($('#chat_window').data('init')) {
            $('#chat_window').data({'init': false});
        }
    }, speed);

    /*$('#chat_all_DM').on('click', 'li', function () {
        let $attr = $(this).find('a').attr('href');
        if ($attr !== '#chat_window_chat') {
            let $chat_dm = $('#chat_dm');

            let attr = $('.chat_dm_ul').find('li').eq(0).find('a').attr('href');
            if ($chat_dm.data('currentDM') ===
                $('.chat_dm_ul').find('li').eq(0).find('a').attr('href') &&
                $chat_dm.find(attr).data('scroll') === true) {
                $chat_dm.find(attr).data({'scroll': false});
                $chat_dm.find(attr).scrollTop($chat_dm.find(attr)[0].scrollHeight);
            }

            $('#chat_window').data({'name': $chat_dm.data('currentDM')});
            $('.chat_dm_ul').find('a').each(function () {
                if ($(this).attr('href') === $chat_dm.data('currentDM')) {
                    $(this).html($chat_dm.find($(this).attr('href'))
                        .data('login_user_chat_with'));
                    $chat_dm.find($(this).attr('href'))
                        .data({'unread_messages': 0});
                    $(this).removeClass('chat_unread_messages');
                }
            })
        } else $('#chat_window').data({'name': '#chat_window_chat'});
    });*/

    $('.chat_dm_ul').on('click', 'li', function () {
        let $this = $(this);
        $('.chat_dm_ul').find('.dm_tabs_links_li').each(function () {
            if ($this !== this) {
                if ($(this).hasClass('bg-info')) {
                    $(this).removeClass('bg-info').addClass('bg-dark');
                }
            }
        });
        $this.addClass('bg-info').removeClass('bg-dark');
        let $attr = $(this).find('a').attr('href');
        if ($('#chat_dm').find($attr).data('scroll') === true) {
            $('#chat_dm').find($attr).data({'scroll': false});
            $('#chat_dm').find($attr).scrollTop($('#chat_dm').find($attr)[0].scrollHeight);
        }
        if ($attr !== '#dm_user_0')
            $('.chats_header').html('<span class="font-italic font-weight-light" ' +
                '">Чат с пользователем </span>' +
                '<span class="font-weight-bold">'
                + $('#chat_dm').find($attr).data('name_user') + '</span>');
        else $('.chats_header').html('<span class="font-weight-bold">Общий чат</span>');
        $('#chat_window').data({'name': $attr});
    });

}

function generateDMChat(count_users) {
    //count_users -= 1;
    let loginUsers = getLoginNames();
    let roleUsers = getLoginNames('role');
    let $chat_dm = $('#chat_dm');
    let $dm_li = $chat_dm.find('.chat_dm_ul').eq(0);


    for (let i = 0; i < count_users + 1; i++) {
        if (!i) {
            $dm_li.append('<li class="dm_tabs_links_li bg-info"></li>');
            $dm_li.find('li').eq(i).append('<div class="dm_tabs_links"><a href="#dm_user_0">' +
                'Общий чат</a></div>');
            continue;
        }
        $dm_li.append('<li class="dm_tabs_links_li bg-dark"></li>');
        $dm_li.find('li').eq(i).append('<div class="dm_tabs_links bg-light"><a href="#dm_user_' + i +
            '">' + roleUsers[i - 1] + '</a></div>');
    }
    for (let i = 0; i < count_users + 1; i++) {
        if (!i) {
            $chat_dm.find('.chats_div')
                .append('<div id="dm_user_0" class="dm_window bg-light"><ul></ul></div>');
            $chat_dm.find('.chats_div').find('#dm_user_' + i).data({
                'count_messages': 0,
                'login_user_chat_with': '#dm_user_0',
                'name_user': 'ALL',
                'scroll': false
            });
            continue;
        }
        $chat_dm.find('.chats_div').append('<div id="dm_user_' + i + '" class="dm_window bg-light">' +
            '<ul></ul></div>');
        $chat_dm.find('.chats_div').find('#dm_user_' + i).data({
            'login_user_chat_with': loginUsers[i - 1],
            'count_messages': 0,
            'unread_messages': 0,
            'name_user': roleUsers[i - 1],
            'scroll': false
        });
    }

}

function getLoginNames(loginChoice = "login") {
    let loginUsers = [];
    let nameUsers = [];
    let roleUsers = [];
    //console.log('cur login: ' + login);
    $.ajax({
        url: 'chat_ajax',
        type: 'POST',
        async: false,
        data: {current_login: login, function: 'login_users'},
        success: function (data) {
            let log = login;
            for (let login in data) {
                let name = '';
                if (loginChoice === 'long_name')
                     name = data[login].first_name + " " + data[login].last_name + " " + data[login].otc;
                else if('short_name')
                    name = data[login].first_name + " " + data[login].last_name[0] + "." + data[login].otc[0] +'.';
                    loginUsers.push(data[login].login);
                    nameUsers.push(name);
                    roleUsers.push(data[login].role);
            }
        },
        error: function (data) {
            console.log('error');
        }
    });
    if(loginChoice === "login")
    return loginUsers;
    else if(loginChoice === "short_name" || loginChoice === "long_name")
        return nameUsers;
    else return roleUsers;
}

function initDMChats() {
    $('#chat_dm').find('div').has('ul').each(function (index) {
        console.log('load dm');
        printComments($(this), {
            type: 'DM',
            current_login: login,
            login_user_chat_with: $(this).data('login_user_chat_with'),
            count_messages: Max_count_messages,
            function: 'print_comment'
        }, true);
    });
}

function countUsers() {
    let count = 0;
    $.ajax({
        type: 'POST',
        url: 'chat_ajax',
        async: false,
        data: {function: 'count_users'},
        success: function (data) {
            count = data.count;
            //console.log('count: ' + count);
            console.log('count by using get logins: ' + getLoginNames().length);
        },
        error: function (data) {
            console.log('error');
        }
    });
    return count;
}
