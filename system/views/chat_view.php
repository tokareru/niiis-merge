<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<!--Чат-->
<div id="chat_main">
    <div class='border border-info font-weight-bold' id="but">ЧАТ
        <div id="span_icon_left" class="icon_default"></div>
    </div>
    <div id="chat_window" class='bg-white border border-info'>
        <div id="chat_dm">
        <div class="chats_header bg-light"><span class="font-weight-bold">Общий чат</span></div>
        <div class="chat_dm_ul_div bg-dark">
            <ul class="chat_dm_ul">

            </ul>

        </div>
                <div class='chats_div'>


                </div>
                <div class='bg-light' id="chat_text_button">
                            <textarea placeholder="пиши сюда" id="chat_window_text" class="form-control-sm"></textarea>
                            <input id="chat_window_button" role="button" type="button" class="btn-sm btn-primary">
                        </div>
        </div>

    </div>
</div>
