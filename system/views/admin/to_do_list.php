<?php
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/to_do_list.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');

    ?>
<link href="../../css/to_do_list.css" rel="stylesheet" type="text/css">
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
<h1 class="h2">Задачи пользователей</h1>
</div>

<div id="contentblock">
<div class="userdatainput">
<div style="min-width: 104px;">Выберите логин пользователя
<select class="form-control col-12" id="change_user_login">
<option></option>

</select>
</div>

<div style="margin-left:10px; margin-right: 10px;">Выберите раунд
<select class="form-control col-12" id="change_user_round">
<option></option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
</select>
</div>

<div id="actionButtons" style="display: none;">
<button id="addTask" class="btn btn-outline-primary">Добавить задачу</button>
<button id="saveUserTasks" class="btn btn-primary" disabled>Сохранить</button>
</div>
</div>



</div>
