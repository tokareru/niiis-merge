<?php
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/tasks_edit.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    sys::inc_no_cache('css', 'css/admin/tasks_edit.css');
    sys::inc_no_cache('css', 'css/styles.css');

    ?>
<div class="pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Задачи пользователей</h1>
    <div class="row">
        <div  class="col-3 h5">
            Выберите пользователя
        </div>
        <div  class="col-3 h5">
            Выберите раунд
        </div>
    </div>
    <div class="row mb-3">
        <div  class="col-3">
            <select class="form-control-sm shadow-none" id="userLoginsSelection">
            </select>
        </div>
        <div  class="col-3">
            <select class="form-control-sm shadow-none" id="userRoundSelection">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
        </div>
    </div>
    <ul id="task-list-body" class="list-unstyled">

    </ul>
    <div class="mb-3 mt-2">
        <button class="btn-outline-dark btn btn-sm mr-2 d-none" id="addNewTaskButton">Добавить новую задачу</button>
        <button class="btn-outline-dark btn btn-sm d-none" id="saveTaskListButton">Сохранить</button>
    </div>
</div>
