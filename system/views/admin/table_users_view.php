<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2"><?php echo $data["page_name"] ?></h1>
</div>
<div class="mb-md-0">

  <table class="table table-bordered table-condensed table-hover table-sm">
    <thead>
      <tr>
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
            <tr>
                <td>' . $rows['id'] . '</td>
                <td>' . $rows['first_name'] . ' ' . $rows['first_name'] . ' ' . $rows['first_name'] . '</td>
                <td>' . $rows['login'] . '</td>
                <td>' . $rows['password'] . '</td>
                <td><select class="form-control form-control-sm">';
        foreach ($data["group_users"] as $row) {
          echo "<option value=" . $row["group_id"] . " ";
          if ($rows['group_user_id'] == $row["group_id"]) {
            echo "selected";
          } echo ">" . $row["descr"] . "</option>";
        }
        echo '</select></td>
                <td><div class="form-check"><input class="form-check-input" type="checkbox" name="active_sign" ';
        if ($rows['active_sign'] == 1) {
          echo 'checked';
        } echo '></div></td>
            </tr>
        ';
      }
      ?>

    </tbody>
  </table>

</div>