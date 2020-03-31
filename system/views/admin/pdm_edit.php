<?php 
    sys::inc_no_cache('css', 'css/font-awesome.css');
    sys::inc_no_cache('javascript', 'js/admin/pdm_edit.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
    
    ?>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2"><?php echo 'Детали' ?></h1>
</div>
<div class="mb-md-0"> 
    <div class="row">
        <select class="form-control col-3" id="pdm">
            <option></option>
            <?php 
            foreach ($data as $row) {
                echo '<option value="'.$row["id"].'">'.$row["model_name"].'</option>';    
            } ?>
        </select>
    </div>
    <br/>
    <div id="change_pdm">
        
    </div>
</div>

