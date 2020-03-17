<?php
require_once conf::$ROOT . 'system/etc/functions.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8"/>
    <title><?php echo isset($data['title']) ? $data['title'] : conf::$SITE_NAME; ?></title>

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
        sys::inc_no_cache('javascript', 'js/main.js');
        sys::inc_no_cache('javascript', 'js/flowtype.js');
        sys::inc_no_cache('javascript', 'js/create_title_block.js');
        sys::inc_no_cache('javascript', 'js/notification.js');
        sys::inc_no_cache('javascript', 'js/progress_bar.js');
        ?>

    <script src="<?php echo conf::$SITE_URL ?>js/main.js" type="text/javascript"></script>

    <link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
    <link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
    <link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">


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
<body class='bg-light'>
<nav id="tabs" class="navbar navbar-expand-xl navbar-dark sticky-top mb-xl-2 bg-dark">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler"
            aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarToggler">
        <div class="ml-auto text-center d-xxl-block d-sm-none"><span
                class="navbar-brand">Цифровая фабрика IT-процессов</span></div>
        <ul class="nav ml-sm-to-xxl-auto nav-pills navbar-nav" id="tabs-fields-ul" role="tablist"
            style="list-style-type: none">
            <li><a href="#tabs-empty"></a></li>
        </ul>
        <?php require_once("system/views/header.php"); ?>
    </div>
</nav>

<div id="shell" class="container-fluid myContainer mb-3">
    <div class="row myRow">
    </div>
</div>
<div id="toast-section" class="">
    <nav class="navbar">
        <button class="btn shadow-none navbar-toggler ml-auto" type="button" data-toggle="collapse"
                data-target="#navbarTogglerNotification" aria-controls="navbarTogglerNotification" aria-expanded="false"
                aria-label="Toggle navigation">
            <span class="btn btn-sm shadow-none fa-bell-slash-o" tabindex="0" id="notificationBell"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerNotification">
            <div id="toast-position" class="custom-toast-position"></div>
        </div>
    </nav>
</div>
</body>
<?php require_once("system/views/progress_bar_view.php"); ?>
</html>
