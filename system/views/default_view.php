<?php
require_once conf::$ROOT . 'system/etc/functions.php';

// получаем адрес страницы без учета параметров
//$CURRENT_PAGE = basename($_SERVER['REQUEST_URI']); // получаем адрес
// способ 1
//$pos = strpos($CURRENT_PAGE, '?'); // получаем позицию знака вопроса
//if($pos) $CURRENT_PAGE = substr($CURRENT_PAGE, 0, $pos); // если знак вопроса есть, получаем подстроку до знака вопроса
// способ 2
// парсим адрес 
//$arr = parse_url($CURRENT_PAGE);
//$CURRENT_PAGE_HARD = $CURRENT_PAGE; // сохраняем для жестких ссылок прописанных с учетом параметров в запросе
//$CURRENT_PAGE = $arr['path']; // получаем конечный адрес

// ------------- получаем адрес страницы без учета параметров
$IS = $_SESSION['niiis']['is'];
?>
<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8"/>
        <title><?php echo isset($data['title']) ? $data['title'] : conf::$SITE_NAME; ?></title>
        
        <script src="<?php echo conf::$SITE_URL ?>js/tablesorter/jquery.tablesorter.js" type="text/javascript"></script>
        <script src="<?php echo conf::$SITE_URL ?>js/main.js" type="text/javascript"></script>
        <script type="text/javascript" src="<?php echo conf::$SITE_URL ?>js/validator/validator.min.js"></script>
        
        <link href="<?php echo conf::$SITE_URL ?>css/tablesorter.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
        <link href="<?php echo conf::$SITE_URL ?>css/menu.css" rel="stylesheet" type="text/css">
        <link href="<?php echo conf::$SITE_URL ?>css/btn_heder.css" rel="stylesheet" type="text/css">

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
        
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="system/css/bootstrap.css">
        <link rel="stylesheet" href="system/css/styles.css">
        <link rel="stylesheet" href="system/css/3D.css">
        <link rel="stylesheet" href="system/css/jquery-ui.structure.css">
        <link rel="stylesheet" href="system/css/left_accordion.css">
        <link rel="stylesheet" href="system/css/font-awesome.css">
        <link rel="stylesheet" href="system/css/chat/chat.css">
        <link rel="stylesheet" href="system/css/chat/dm_chat.css">
        <link rel="stylesheet" href="system/css/center_side.css">
        <link rel="stylesheet" href="system/css/specification_table.css">
        <script src="system/js/libraries/jquery-3.4.1.js"></script>
        <script src="system/js/libraries/popper.min.js"></script>
        <script src="system/js/libraries/bootstrap.min.js"></script>
        <script src="system/js/libraries/jquery-ui.js"></script>
        <script src="system/js/mainTabs.js"></script>
        <script src="system/js/left_accordion.js"></script>
        <script src="system/js/PDM_and_STD_components.js"></script>
        <script src="system/js/specification_table.js"></script>
        <script src="system/js/chat/chat.js"></script>
        <script src="system/js/chat/dm_chat.js"></script>

        <script src="system/js/3D/three.min.js"></script>
        <script src="system/js/3D/dat.gui.min.js"></script>

        <script src="system/js/3D/3D.js"></script>

        <script src="system/js/shell/shell.js"></script>
        <script src="system/js/main.js"></script>
    </head>
    <body>
        <div>
            <?php
            echo '<a class="medium red awesome" href="' . conf::$SITE_URL . 'logout">Выйти</a>';
            echo '<p>Вы вошли как:</small> ' . sys::user_login() . '</p>';
            ?>
        </div>
        
        <div id="shell" class="container-fluid myContainer">
            <div class="row myRow">
            </div>
        </div>
    </body>
</html>
