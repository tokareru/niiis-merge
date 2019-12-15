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
$page = $data["content"]["page"];
?>
<link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
<link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
<link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">
<?php require_once("system/views/header.php"); ?>
<div>
    <div>
    <ul class="nav nav-pills">
        <li class="nav-item">
          <a class="nav-link <?php if($page == "users") echo "active"; ?>" href="<?php echo conf::$SITE_URL ?>">Пользователи</a>
        </li>
        <li class="nav-item">
            <a class="nav-link <?php if($page == "pdm_edit") echo "active"; ?>" href="admin_cab/pdm_edit">Редактирование pdm</a>
        </li>
    </ul>
</div>
    <?php include_once 'system/views/admin/'.$content_view ?>
</div>