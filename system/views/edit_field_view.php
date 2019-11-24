<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<div class="col-md-12">
    <div class="row">
        <div class="col-12">
            <input type="button" class="btn-block btn btn-primary edit_mode_onoff" value="режим редактирования">
        </div>
    </div>
    <div class="row p-3 edit_div_toggle">
        <div class="col-3">
            <input type="button" value="добавить строку" class="btn btn-sm btn-primary add_row">
            <input type="text" row="row" placeholder="номер строки" class="btn border btn-sm add_row_text">
        </div>
        <div class="col-3">
            <input type="button" value="удалить строку: " class="btn btn-sm btn-primary del_row">
            <input type="text" row="row" placeholder="номер строки" class="btn border btn-sm del_row_text">

        </div>
        <!--<div class="col-3">
            <input type="button" value="добавить столбец: " class="btn btn-sm btn-primary add_col_btn">
            <input type="text" col="col" placeholder="номер столбца" class="btn btn-sm border add_col_text">
        </div>
        <div class="col-3">
            <input type="button" value="удалить столбец: " class="btn btn-sm btn-primary del_col_btn">
            <input type="text" col="col" placeholder="номер столбца" class="btn btn-sm border del_col_text">
        </div>-->
        <div class="col-3">
            <button type="button" class="btn btn-sm btn-primary cell_to_readonly_but">сделать ячейку нередактируемой:</button>
            <input type="text" row="row" placeholder="номер строки" class="btn btn-sm border cell_to_readonly_row">
            <input type="text" col="col" placeholder="номер столбца" class="btn btn-sm border cell_to_readonly_col">
        </div>
        <div class="col-3">
            <button type="button" class="btn btn-sm btn-primary cell_to_edit_but">сделать ячейку редактируемой:</button>
            <input type="text" row="row" placeholder="номер строки" class="btn btn-sm border cell_to_edit_but_row">
            <input type="text" col="col" placeholder="номер столбца" class="btn btn-sm border cell_to_edit_but_col">
        </div>
        <div class="col-3">
            <input value="Сохранить табл. на сервер" type="button" class="btn btn-sm btn-primary post_data_button">
        </div>
    </div>
</div>
