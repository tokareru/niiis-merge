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
            <input type="button" class="btn-block btn btn-primary" id="edit_mode_onoff" value="режим редактирования">
        </div>
    </div>
    <div class="row p-3" id="edit_div_toggle">
        <div class="col-3">
            <input type="button" value="добавить строку" id="add_row" class="btn btn-sm btn-primary">
            <input type="text" row="row" placeholder="номер строки" id="add_row_text" class="btn border btn-sm">
        </div>
        <div class="col-3">
            <input type="button" value="удалить строку: " id="del_row" class="btn btn-sm btn-primary">
            <input type="text" row="row" placeholder="номер строки" id="del_row_text" class="btn border btn-sm">

        </div>
        <!--<div class="col-3">
            <input type="button" value="добавить столбец: " id="add_col_btn" class="btn btn-sm btn-primary">
            <input type="text" col="col" placeholder="номер столбца" id="add_col_text" class="btn btn-sm border">
        </div>
        <div class="col-3">
            <input type="button" value="удалить столбец: " id="del_col_btn" class="btn btn-sm btn-primary">
            <input type="text" col="col" placeholder="номер столбца" id="del_col_text" class="btn btn-sm border">
        </div>-->
        <div class="col-3">
            <button type="button" id="cell_to_readonly_but" class="btn btn-sm btn-primary">сделать ячейку нередактируемой:</button>
            <input type="text" row="row" placeholder="номер строки" id="cell_to_readonly_row" class="btn btn-sm border">
            <input type="text" col="col" placeholder="номер столбца" id="cell_to_readonly_col" class="btn btn-sm border">
        </div>
        <div class="col-3">
            <button type="button" id="cell_to_edit_but" class="btn btn-sm btn-primary">сделать ячейку редактируемой:</button>
            <input type="text" row="row" placeholder="номер строки" id="cell_to_edit_but_row" class="btn btn-sm border">
            <input type="text" col="col" placeholder="номер столбца" id="cell_to_edit_but_col" class="btn btn-sm border">
        </div>
        <div class="col-3">
            <input value="Сохранить табл. на сервер" type="button" id="post_data_button" class="btn btn-sm btn-primary">
        </div>
    </div>
</div>
