<?php 
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/change_groups_users.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    
    ?>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2"><?php echo 'Группы пользователей' ?></h1>
</div>
<div class="mb-md-0">

  <table class="table table-bordered table-condensed table-hover table-sm" id="table_group_edit">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>id</th>
        <th>Название группы</th>
        <th>Статус группы</th>
        <th>Описание</th>
      </tr>
    </thead>
    <tbody>
      <?php
      foreach ($data as $rows) {
        echo '
            <tr id = "'.$rows["group_id"].'">
                <td class="text-center"><button class = "btn btn-sm btn-secondary edit"><span><i class="fa fa-pencil" aria-hidden="true"></i></span></button></td>
                <td class="text-center"><button class = "btn btn-sm btn-secondary delete"><span><i class="fa fa-times" aria-hidden="true"></i></spawn></button></td> 
                <td id = "id">' . $rows['group_id'] . '</td>
                <td id = "user_group_name">' . $rows["user_group_name"] . '</td>
                <td id = "user_status">' . $rows['user_status'] . '</td>
                <td id = "descr">' . $rows['descr'] . '</td>
            </tr>
        ';
      }
      ?>

    </tbody>
  </table>
  <button class="btn btn-primary add_user" id="add_group_user">Добавить группу</button>
</div>

<div class="modal fade" id="edit_group_users" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Редактирование</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form id = "form_edit">
                    <input hidden id="id">
                    <div id="loading" align="center">Загрузка...</div>
                    <div id="content" hidden="true">
                        <div class="row">
                            <div class="col-4" align="right">
                                Название группы
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="user_group_name" name="user_group_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Статус группы
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="user_status" name="user_status">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Описание
                            </div>
                            <div class="col-6">
                                <textarea class="form-control" id="descr" name="descr"></textarea>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-lastary" data-dismiss="modal">Закрыть</button>
                <button type="submit" class="btn btn-primary" id="save">Сохранить</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="create_group_user" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Добавление</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form id = "form_edit">
                    <input hidden id="id">
                    <div id="content">
                        <div class="row">
                            <div class="col-4" align="right">
                                Название группы
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="user_group_name" name="user_group_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Статус группы
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="user_status" name="user_status">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Описание
                            </div>
                            <div class="col-6">
                                <textarea class="form-control" id="descr" name="descr"></textarea>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-lastary" data-dismiss="modal">Закрыть</button>
                <button type="submit" class="btn btn-primary" id="save">Сохранить</button>
            </div>
        </div>
    </div>
</div>