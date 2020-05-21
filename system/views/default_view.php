<?php
require_once conf::$ROOT . 'system/etc/functions.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8"/>
    <title><?php echo isset($data['title']) ? $data['title'] : conf::$SITE_NAME; ?></title>
    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">

    <?php
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
        sys::inc_no_cache('css', 'css/notification.css');
        sys::inc_no_cache('css', 'css/progress_bar.css');
        sys::inc_no_cache('css', 'css/to_do_list.css');
        sys::inc_no_cache('css', 'css/admin/tasks_edit.css');

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
        sys::inc_no_cache('javascript', 'js/3D/three.min.js');
        sys::inc_no_cache('javascript', 'js/3D/dat.gui.min.js');
        sys::inc_no_cache('javascript', 'js/loadscheme.js');
        sys::inc_no_cache('javascript', 'js/3D/3D.js');
        sys::inc_no_cache('javascript', 'js/shell/shell.js');
        sys::inc_no_cache('javascript', 'js/flowtype.js');
        sys::inc_no_cache('javascript', 'js/create_title_block.js');
        sys::inc_no_cache('javascript', 'js/notification.js');
        sys::inc_no_cache('javascript', 'js/progress_bar.js');
        sys::inc_no_cache('javascript', 'js/to-do-list.js');
        sys::inc_no_cache('javascript', 'js/main.js');
        ?>

    <script src="<?php echo conf::$SITE_URL ?>js/main.js" type="text/javascript"></script>

    <link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
    <link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
    <link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">

    <script>
        var SITE_URL = "<?php echo conf::$SITE_URL ?>";
    </script>

    <style>
        .main_menu .nav > li > a {
            position: relative;
            display: block;
            padding: 3px 10px;
        }
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body class='bg-white'>
<?php require_once("system/views/navbar.php"); ?>
<div id="shell" class="container-fluid myContainer mb-5">
    <div class="row myRow">
    </div>
</div>
<?php require_once("system/views/notification_section.php"); ?>
<?php require_once("system/views/loadingMenu.php"); ?>
</body>
<?php require_once("system/views/progress_bar_view.php"); ?>
</html>
