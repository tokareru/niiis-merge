<?php
 sys::inc_no_cache('css', 'css/tablesorter.css');
        sys::inc_no_cache('css', 'css/bootstrap.css');
        sys::inc_no_cache('css', 'css/styles.css');
        sys::inc_no_cache('css', 'css/3D.css');
        sys::inc_no_cache('css', 'css/jquery-ui.structure.css');
        sys::inc_no_cache('css', 'css/left_accordion.css');
        sys::inc_no_cache('css', 'css/font-awesome.css');
        sys::inc_no_cache('css', 'css/chat/chat.css');
        sys::inc_no_cache('css', 'css/chat/dm_chat.css');
        sys::inc_no_cache('css', 'css/center_side.css');
        sys::inc_no_cache('css', 'css/specification_table.css');
        sys::inc_no_cache('css', 'css/center_side.css');
        sys::inc_no_cache('css', 'css/scheme.css');
        sys::inc_no_cache('css', 'css/esi_field.css');
        sys::inc_no_cache('css', 'css/esi_field/esi_field.css');
        sys::inc_no_cache('css', 'css/technologist_guide.css');
        sys::inc_no_cache('css', 'css/tasks_routes.css');
        sys::inc_no_cache('css', 'css/production_task_field.css');
        sys::inc_no_cache('css', 'css/technological_process.css');
        sys::inc_no_cache('css', 'css/create_task_route.css');
        sys::inc_no_cache('css', 'css/create_title_block.css');

        sys::inc_no_cache('javascript', 'js/tablesorter/jquery.tablesorter.js');
        sys::inc_no_cache('javascript', 'js/tablesorter/jquery.tablesorter.js');
        sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
        sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
        sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
        sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
        sys::inc_no_cache('javascript', 'js/mainTabs.js');
        sys::inc_no_cache('javascript', 'js/left_accordion.js');
        sys::inc_no_cache('javascript', 'js/PDM_and_STD_components.js');
        sys::inc_no_cache('javascript', 'js/specification_table.js');
        sys::inc_no_cache('javascript', 'js/chat/chat.js');
        sys::inc_no_cache('javascript', 'js/chat/dm_chat.js');
        sys::inc_no_cache('javascript', 'js/esi_field.js');
        sys::inc_no_cache('javascript', 'js/tasks_routes.js');
        sys::inc_no_cache('javascript', 'js/production_task_field.js');
        sys::inc_no_cache('javascript', 'js/technologist_guide.js');
        sys::inc_no_cache('javascript', 'js/route_map.js');
        sys::inc_no_cache('javascript', 'js/technological_process.js');
        sys::inc_no_cache('javascript', 'js/create_task_route.js');
        sys::inc_no_cache('javascript', 'js/3D/three.min.js');
        sys::inc_no_cache('javascript', 'js/3D/dat.gui.min.js');
        sys::inc_no_cache('javascript', 'js/loadscheme.js');
        sys::inc_no_cache('javascript', 'js/3D/3D.js');
        sys::inc_no_cache('javascript', 'js/shell/shell.js');
        sys::inc_no_cache('javascript', 'js/flowtype.js');
        sys::inc_no_cache('javascript', 'js/create_title_block.js');
        sys::inc_no_cache('javascript', 'js/admin/admin.js');
?>
<link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
<link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
<link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">
<div class='container-fluid'>
    <div class="row">
        <div class="col-1"><a class="medium red awesome" href="<?php echo conf::$SITE_URL . 'logout' ?>">Выйти</a></div>
        <div class="col-3">
            <div class="row">
                <div class="col-5">Вы вошли как:</div>
                <div class="col-4"><?php echo sys::user_login();?>
                </div>
            </div>
        </div>
        <div class="col-3">
            <div class="row">
                <div class="col-4">Ваша роль:</div>
                <div class="col-6"><?php echo $_SESSION['niiis']['role'] ?>
                </div>
            </div>
        </div>
        <div class="col-3">
            <div class="row">
                <div class="col-6">Текущий раунд:</div>
                <div class="col-6" id='current_round'><?php echo $_SESSION['niiis']['round'] ?>
                </div>
            </div>
        </div>
        <div class="col-2">
            <?php if (sys::is_super_admin()) { ?>
                <select id="change_round" name="round" class="form-control">
                    <option value="1">1 раунд</option>
                    <option value="2">2 раунд</option>
                    <option value="3">3 раунд</option>
                </select>
            <?php } ?>
        </div>
    </div>
</div>
<div>
    <?php include_once 'system/views/admin/'.$content_view ?>
</div>