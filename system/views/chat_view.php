<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<!--Чат-->
<div id="chat_main">
    <div id="but">
        <div id="span_icon_left" class="icon_default"></div>
    </div>
    <div id="chat_window">
        <ul id="chat_all_DM">
            <li>
                <div><a href="#chat_window_chat">Общие сообщения</a></div>
            </li>
            <li>
                <div><a href="#chat_dm">Личные сообщения</a></div>
            </li>
        </ul>
        <div id="chat_window_chat">
            <ul>

            </ul>
        </div>
        <div id="chat_dm">
            <ul class="chat_dm_ul">

            </ul>

        </div>


        <div id="chat_text_button">
            <textarea placeholder="пиши сюда" id="chat_window_text" class="form-control-sm"></textarea>
            <input id="chat_window_button" role="button" type="button" class="btn-sm btn-primary">
        </div>
    </div>
</div>
