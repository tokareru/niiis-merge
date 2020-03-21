<?php sys::inc_no_cache('css', 'css/bootstrap.css');
      sys::inc_no_cache('css', 'css/font-awesome.css');
?>

<?php sys::inc_no_cache('javascript', 'js/admin/change_groups_users.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    
    ?>
<div class="mb-md-0">
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2">Прогресс пользователей</h1>
</div>
<div class="container-fluid">
    <table class="table table-bordered table-condensed table-hover table-sm">
        <thead>
        <tr>
            <th>
                ФИО
            </th>
            <th>
                id операции
            </th>
            <th>
                Тип операции
            </th>
            <th>
                Вкладка операции
            </th>
            <th>
                Текст операции
            </th>
            <th>
                Дата операции
            </th>
        </tr>
        </thead>
        <tbody>
        <?php foreach($data as $row){ ?>
        <tr>
            <td>
                <?php echo $row["first_name"].' '.$row["last_name"].' '.$row["otc"] ?>
            </td>
            <td>
                <?php echo $row["operation_id"] ?>
            </td>
            <td>
                <?php echo $row["type"] ?>
            </td>
            <td>
                <?php echo $row["field"] ?>
            </td>
            <td>
                <?php echo $row["text"] ?>
            </td>
            <td>
                <?php echo sys::strtodatetime($row["date_create"]); ?>
            </td> 
        </tr>
        <?php } ?>
        </tbody>
    </table>
</div>
</div>