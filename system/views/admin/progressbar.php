<?php 
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/progressbar.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    sys::inc_no_cache('css', 'css/styles.css');
    ?>
<div class="mb-md-0">
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2">Прогресс пользователей</h1>
</div>
<div class="container-fluid">
    <div class="row">
        <div class="col-2">Выберите пользователя:</div>
        <div class="col-4">
            <select class="custom-select" id="users">
                <option></option>
                <?php foreach($data as $row){ 
                    echo '<option value="'.$row["login"].'">'.$row["last_name"].' '.$row["first_name"].' '.$row["otc"].'</option>';
                 } ?>
            </select>
        </div>
    </div>
    <br/>
    <div id="table">
        
    </div>
</div>
</div>
