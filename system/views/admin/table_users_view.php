<?php 
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/table_users.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    ?>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2"><?php echo $data["page_name"] ?></h1>
</div>
<div class="mb-md-0">

  <table class="table table-bordered table-condensed table-hover table-sm" id="table_edit">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>id</th>
        <th>ФИО</th>
        <th>Логин</th>
        <th>Пароль</th>
        <th>Группа пользователя</th>
        <th>Активен</th>
      </tr>
    </thead>
    <tbody>
      <?php
      foreach ($data["users"] as $rows) {
        echo '
            <tr id = "'.$rows["id"].'">
                <td class="text-center"><button class = "btn btn-sm btn-secondary edit"><span><i class="fa fa-pencil" aria-hidden="true"></i></span></button></td>
                <td class="text-center"><button class = "btn btn-sm btn-secondary delete"><span><i class="fa fa-times" aria-hidden="true"></i></spawn></button></td>  
                <td id = "id">' . $rows['id'] . '</td>
                <td id = "fio">' . $rows['last_name'] . ' ' . $rows['first_name'] . ' ' . $rows['otc'] . '</td>
                <td id = "login">' . $rows['login'] . '</td>
                <td id = "password">' . $rows['password'] . '</td>
                <td><select class="form-control form-control-sm role" id = "role">';
        foreach ($data["group_users"] as $row) {
          echo "<option value=" . $row["group_id"] . " ";
          if ($rows['group_user_id'] == $row["group_id"]) {
            echo "selected";
          } echo ">" . $row["descr"] . "</option>";
        }
        echo '</select></td>
                <td><div class="form-check"><input class="form-check-input active_sign" type="checkbox" id = "active_sign" name="active_sign" ';
        if ($rows['active_sign'] == 1) {
          echo 'checked';
        } echo '></div></td>
            </tr>
        ';
      }
      ?>

    </tbody>
  </table>
  <button class="btn btn-primary add_user" id="add_user">Добавить пользователя</button>
</div>

<div class="modal fade" id="edit_users" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            <div class="col-3" align="right">
                                Фамилия
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="last_name" name="last_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3" align="right">
                                Имя
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="first_name" name="first_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3" align="right">
                                Отчество
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="otc" name="otc">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3" align="right">
                                Логин
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="login" name="login">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3" align="right">
                                Пароль
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="password" name="password">
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

<div class="modal fade" id="create_user" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                Фамилия
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="last_name" name="last_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Имя
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="first_name" name="first_name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Отчество
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="otc" name="otc">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Логин
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="login" name="login">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4" align="right">
                                Пароль
                            </div>
                            <div class="col-6">
                                <input class="form-control" id="password" name="password">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4">
                                Группа пользователя
                            </div>
                            <div class="col-6">
                                <select class="form-control role" id = "role">
                                    <?php
                                    foreach ($data["group_users"] as $row) {
                                        echo "<option value=" . $row["group_id"] . " ";
                                        if ($rows['group_user_id'] == $row["group_id"]) {
                                            echo "selected";
                                        } echo ">" . $row["descr"] . "</option>";
                                    }
                                    ?>
                                </select>
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