<?php 
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/esi_edit.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    
    ?>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2"><?php echo 'Изделия ЭСИ' ?></h1>
</div>
<div class="mb-md-0"> 
    <div class="row">
        <select class="form-control col-3" id="change_esi">
            <?php 
            foreach ($data as $row) {
                echo '<option value="'.$row["id"].'">'.$row["name"].'</option>';    
            } ?>
        </select>
    </div>
    <br/>
    <div id="esi">
        
    </div>
</div>

