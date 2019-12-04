<?php
// test commit makss56
require_once conf::$ROOT . 'system/etc/functions.php';
// получаем адрес страницы без учета параметров
$CURRENT_PAGE = basename($_SERVER['REQUEST_URI']); // получаем адрес
// способ 1
//$pos = strpos($CURRENT_PAGE, '?'); // получаем позицию знака вопроса
//if($pos) $CURRENT_PAGE = substr($CURRENT_PAGE, 0, $pos); // если знак вопроса есть, получаем подстроку до знака вопроса
// способ 2
// парсим адрес 
$arr = parse_url($CURRENT_PAGE);
$CURRENT_PAGE_HARD = $CURRENT_PAGE; // сохраняем для жестких ссылок прописанных с учетом параметров в запросе
$CURRENT_PAGE = $arr['path']; // получаем конечный адрес
//var_dump($arr);
// ------------- получаем адрес страницы без учета параметров
$IS = $_SESSION['niiis']['is'];
?><!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8"/>
        <title><?php echo isset($data['title']) ? $data['title'] : conf::$SITE_NAME; ?></title>
        
        <?php
        sys::inc_no_cache('javascript', 'js/tablesorter/jquery.tablesorter.js');
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
        sys::inc_no_cache('javascript', 'js/main.js');
        ?>
<!--        <script src="<?php echo conf::$SITE_URL ?>js/tablesorter/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="<?php echo conf::$SITE_URL ?>css/tablesorter.css" rel="stylesheet" type="text/css"/>-->

        <script src="<?php echo conf::$SITE_URL ?>js/main.js" type="text/javascript"></script>

        <link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
        <link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
        <link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">

        <script type="text/javascript" src="<?php echo conf::$SITE_URL ?>js/validator/validator.min.js"></script>

        <script>
            var SITE_URL = "<?php echo conf::$SITE_URL ?>";
            var CURRENT_PAGE = "<?= $CURRENT_PAGE ?>"
        </script>

        <style>
            .main_menu .nav>li>a {
                position: relative;
                display: block;
                padding: 3px 10px;
            }
        </style>
        <title>Demo</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    </head>
    <body class='bg-light'>
    <div class='container'>
        <div class="row">
            <div class="col-1"><a class="medium red awesome" href="<?php echo conf::$SITE_URL.'logout' ?>">Выйти</a></div>
            <div class="col-2">
                <div class="row">
                    <div class="col-3">User:</div>
                    <div class="col-3"><?php echo sys::user_login() ?>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="row">
                    <div class="col-3">Role:</div>
                    <div class="col-6"><?php echo $_SESSION['niiis']['role'] ?>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <div class="row">
                    <div class="col-4">Round:</div>
                    <div class="col-6"><?php echo $_SESSION['niiis']['round'] ?>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <?php if (sys::is_super_admin()){?>
                    <select id="change_role" name="role" class="form-control">
                        <option value="1" <?php if($_SESSION["niiis"]["round"] == 1) echo "selected"; ?>>1 round</option>
                        <option value="2" <?php if($_SESSION["niiis"]["round"] == 2) echo "selected"; ?>>2 round</option>
                        <option value="3" <?php if($_SESSION["niiis"]["round"] == 3) echo "selected"; ?>>3 round</option>
                    </select>
                <?php } ?>
            </div>
        </div>
     </div>
<!--        <div>
            <?php
//            echo '<a class="medium red awesome" href="' . conf::$SITE_URL . 'logout">Выйти</a>';
//            echo '<p>Вы вошли как:</small> ' . sys::user_login() . '</p>';
            ?>
        </div>-->


        <div id="shell" class="container-fluid myContainer">
            <div class="row myRow">
            </div>
        </div>
    </body>
</html>
