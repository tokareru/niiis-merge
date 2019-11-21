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
    <!--    <link href="<?php echo conf::$SITE_URL ?>img/favicon.ico" rel="shortcut icon" />-->

         <!--<script type="text/javascript" src="<?php echo conf::$SITE_URL ?>js/jquery-1.11.3.min.js"></script> -->
        <!-- <script type="text/javascript" src="<?php echo conf::$SITE_URL ?>js/jquery-ui/jquery-ui.min.js"></script> -->
<!--        <script src="<?php echo conf::$SITE_URL ?>js/fancybox/jquery.fancybox-1.3.4.pack.js" type="text/javascript"></script>-->
         <!--<link href="<?php echo conf::$SITE_URL ?>js/jquery-ui/jquery-ui.min.css" rel="stylesheet" type="text/css">-->

        <script src="<?php echo conf::$SITE_URL ?>js/tablesorter/jquery.tablesorter.js" type="text/javascript"></script>
        <link href="<?php echo conf::$SITE_URL ?>css/tablesorter.css" rel="stylesheet" type="text/css"/>
        <!--script src="<?php echo conf::$SITE_URL ?>js/combobox.js" type="text/javascript"></script-->

        <!-- bootstrap -->
        <!-- <<link href="<?php echo conf::$SITE_URL ?>css/bootstrap.min.css" rel="stylesheet" type="text/css"/>-->
        <!-- <script src="<?php echo conf::$SITE_URL ?>js/bootstrap.min.js" type="text/javascript"></script> -->

        <script src="<?php echo conf::$SITE_URL ?>js/main.js" type="text/javascript"></script>

        <link href="<?php echo conf::$SITE_URL ?>css/main.css" rel="stylesheet" type="text/css">
        <!--link href="<?php echo conf::$SITE_URL ?>css/jquery-ui-combobox.css" rel="stylesheet" type="text/css"/-->
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
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/3D.css">
        <link rel="stylesheet" href="css/jquery-ui.structure.css">
        <link rel="stylesheet" href="css/left_accordion.css">
        <link rel="stylesheet" href="css/font-awesome.css">
        <link rel="stylesheet" href="css/chat/chat.css">
        <link rel="stylesheet" href="css/chat/dm_chat.css">
        <link rel="stylesheet" href="css/center_side.css">
        <link rel="stylesheet" href="css/specification_table.css">
        <script src="js/libraries/jquery-3.4.1.js"></script>
        <script src="js/libraries/popper.min.js"></script>
        <script src="js/libraries/bootstrap.min.js"></script>
        <script src="js/libraries/jquery-ui.js"></script>
        <script src="js/mainTabs.js"></script>
        <script src="js/left_accordion.js"></script>
        <script src="js/PDM_and_STD_components.js"></script>
        <script src="js/specification_table.js"></script>
        <script src="js/chat/chat.js"></script>
        <script src="js/chat/dm_chat.js"></script>

        <script src="js/3D/three.min.js"></script>
        <script src="js/3D/dat.gui.min.js"></script>

        <script src="js/3D/3D.js"></script>

        <script src="js/shell/shell.js"></script>
        <script src="js/main.js"></script>
    </head>
    <body>

        <div>
            <?php
            echo '<a class="medium red awesome" href="' . conf::$SITE_URL . 'logout">Выйти</a>';
            echo '<p>Вы вошли как:</small> ' . sys::user_login() . '</p>';
            ?>
        </div>
        
<?php if (sys::is_super_admin()){?>
                <div class="col-1">
                    <select id="change_role" name="role" class="form-control">
                        <option value="1" <?php if($_SESSION["niiis"]["round"] == 1) echo "selected"; ?>>1 round</option>
                        <option value="2" <?php if($_SESSION["niiis"]["round"] == 2) echo "selected"; ?>>2 round<option>
                        <option value="3" <?php if($_SESSION["niiis"]["round"] == 3) echo "selected"; ?>>3 round<option>
                    </select>
                </div>
        <div id="shell" class="container-fluid myContainer">
            <div class="row myRow">
            </div>
        </div>
<?php } else{?>
        <div id="shell" class="container-fluid myContainer">
            <div class="row myRow">
            </div>
        </div>
<?php }?>
    </body>
</html>