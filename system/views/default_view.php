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
        <link rel="stylesheet" href="system/css/scheme.css">
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
        <script src="system/js/scheme.js"></script>

        <script src="system/js/shell/shell.js"></script>
        <script src="system/js/main.js"></script>
    </head>
    <body>
        <?php
//      if (sys::is_super_admin()){
//        require_once 'system/views/menu_admin.php';
//      }
        ?>
        <!--        <div id="all">-->
        <div>
            <?php
            echo '<a class="medium red awesome" href="' . conf::$SITE_URL . 'logout">Выйти</a>';
            echo '<p>Вы вошли как:</small> ' . sys::user_login() . '</p>';
            ?>
        </div>
        <!--"Шапка"-->
<!--            <table class="heder">
            <tbody>
                <tr>
                    <td class="hedtdl">

                        <a href="<?= conf::$SITE_URL ?>" title=""><img style="height: 160px;" src="<?= conf::$SITE_URL ?>/img/logo.jpg" alt="НГТУ" title="НГТУ" /></a>
                    </td>
                    <td>
                        <div class="main_name">
                          <div class="page-header" style="color: #337ab7;">
                            <h1>ИС «<?php echo conf::$SITE_NAME; ?>» <small></small></h1>
                          </div>
                        </div>
                    </td>
                    <td class="hedtdr">

                    </td>
                </tr>
            </tbody>
        </table>-->

<!--            <table class="total">
    <tr>
        <td class="menu_td">
        <?php
//if($IS=='abitprof'){
        ?>
              <nav class="main_menu">

                <ul class="list-group">
                  <li class="list-group-item">
                    <h4 class="list-group-item-heading">Школьники</h4>
                    <p class="list-group-item-text">
                      <ul class="nav nav-pills nav-stacked">
                        <li //<?php //echo ($CURRENT_PAGE == 'abits')?('class="active"'):"";   ?>><a href="<?php //echo conf::$SITE_URL;  ?>abits" style="padding-right: 0px;padding-left: 5px;">Список школьников<span class="badge pull-right" id="count_abits"></span></a></li>
                        <li //<?php //echo ($CURRENT_PAGE == 'konkurs_categ')?('class="active"'):"";   ?>><a href="<?php //echo conf::$SITE_URL;  ?>konkurs_categ" style="padding-left: 5px;">Виды мероприятий</a></li>
                        <li //<?php //echo ($CURRENT_PAGE == 'konkurs')?('class="active"'):"";   ?>><a href="<?php //echo conf::$SITE_URL;  ?>konkurs" style="padding-right: 0px;padding-left: 5px;">Мероприятия<span class="badge pull-right" id="count_events"></span></a></li>
                      </ul>
                    </p>
                  </li>
                  <li class="list-group-item">
                    <h4 class="list-group-item-heading">Результаты</h4>
                    <p class="list-group-item-text">
                      <ul class="nav nav-pills nav-stacked">

                      </ul>
                    </p>
                  </li>
                  
                  <li class="list-group-item">
                    <h4 class="list-group-item-heading">Отчеты</h4>
                    <p class="list-group-item-text">
                      <ul class="nav nav-pills nav-stacked">
        <?php
//                                    echo '<li '.(($CURRENT_PAGE == 'report_members')?('class="active"'):"").'><a href="'.conf::$SITE_URL.'report_members" style="padding-left: 5px;">Участники олимпиад</a></li>';
//                                    echo '<li '.(($CURRENT_PAGE == 'report_testprof')?('class="active"'):"").'><a href="'.conf::$SITE_URL.'report_testprof" style="padding-right: 0px;padding-left: 5px;">Тестирование "Профориентатор"<span class="badge pull-right" id="count_testprof"></span></a></li>';
//                                    echo '<li '.(($CURRENT_PAGE == 'report_abits')?('class="active"'):"").'><a href="'.conf::$SITE_URL.'report_abits" style="padding-left: 5px;">Список мотивированных абитуриентов<span class="badge pull-right" id="count_abit_res"></span></a></li>';
//                                    echo '<li '.(($CURRENT_PAGE == 'report_abit_professii')?('class="active"'):"").'><a href="'.conf::$SITE_URL.'report_abit_professii" style="padding-left: 5px;">Профессии</a></li>';
//                                    echo '<li '.(($CURRENT_PAGE == 'report_for_company')?('class="active"'):"").'><a href="'.conf::$SITE_URL.'report_for_company" style="padding-left: 5px;">Для предприятий</a></li>';
        ?>
                      </ul>
                    </p>
                  </li>

                  <li class="list-group-item">Отчеты</li>
                </ul>

              </nav>
        <?php
//}
//if($IS=='nastavniki'){
        ?>
              <nav class="main_menu">
              class="active"
              <ul class="list-group">
                <li class="list-group-item">
                  <h5 class="list-group-item-heading">Наставники</h5>
                  <p class="list-group-item-text">
                    <ul class="nav nav-pills nav-stacked">
                      <li <?php //echo ($CURRENT_PAGE == 'nastavniki')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>nastavniki" style="padding-right: 0px;padding-left: 5px;">Список наставников<span class="badge pull-right" id="count_nastav"></span></a></li>
                      <li <?php //echo ($CURRENT_PAGE == 'category')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>category" style="padding-left: 5px;">Категории</a></li>
                      <li <?php //echo ($CURRENT_PAGE == 'dolzhnosti')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>dolzhnosti" style="padding-left: 5px;">Должности</a></li>
                    </ul>
                  </p>
                </li>
                <li class="list-group-item">
                  <h5 class="list-group-item-heading">Программы занятий</h5>
                  <p class="list-group-item-text">
                    <ul class="nav nav-pills nav-stacked">
                      <li <?php //echo ($CURRENT_PAGE == 'prog_list')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>prog_list" style="padding-right: 0px;padding-left: 5px;">Список программ<span class="badge pull-right" id="count_programs"></span></a></li>
                      общий список тем по всем программам
                      <li <?php //echo ($CURRENT_PAGE == 'prog_subj')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>prog_subj">Темы программ</a></li>
                      <li <?php // echo ($CURRENT_PAGE == 'groups')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>groups" style="padding-right: 0px;padding-left: 5px;">Группы<span class="badge pull-right" id="count_groups"></span></a></li>
                    </ul>
                  </p>
                </li>
                <li class="list-group-item">
                  <h5 class="list-group-item-heading">Организации</h5>
                  <p class="list-group-item-text">
                    <ul class="nav nav-pills nav-stacked">
                        <li <?php //echo ($CURRENT_PAGE == 'org_list')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>org_list" style="padding-right: 0px;padding-left: 5px;">Список организаций<span class="badge pull-right" id="count_orgs"></span></a></li>
                        <li <?php //echo ($CURRENT_PAGE == 'org_type')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>org_type" style="padding-left: 5px;">Типы организаций</a></li>
                    </ul>
                  </p>
                </li>
                <li class="list-group-item">
                  <h5 class="list-group-item-heading">Школьники</h5>
                  <p class="list-group-item-text">
                    <ul class="nav nav-pills nav-stacked">
                      <li <?php //echo ($CURRENT_PAGE == 'abits')?('class="active"'):""  ?>><a href="<?php //echo conf::$SITE_URL;  ?>abits" style="padding-right: 0px;padding-left: 5px;">Список школьников<span class="badge pull-right" id="count_abits"></span></a></li>
                    
                      
                    </ul>
                  </p>
                </li>
                <li class="list-group-item">Отчеты</li>
              </ul>
              
            </nav>
        <?php
//}
        ?>

        </td>
       
        <td class="content">
          
        <?php
//                      if ($content_view <> '') {
//                        include 'system/views/' . $content_view;
//                      }
//                      else
//                      {
        ?>
            <h3>ИС <?php //echo conf::$SITE_NAME; ?></h3>
            <br>
            index-content
            
        <?php
        //}
        ?>
            
        </td>
    </tr>	
</table>
footer
<div id="footer_guarantor">&nbsp;</div>
</div>
<div class="text-center" id="footer1">
<br>НГТУ, <?= date('Y') ?> г 
</div>
a id="move_up" href="#">Наверх</a-->

        <div id="shell" class="container-fluid myContainer">
            <div class="row myRow">
            </div>
        </div>
        <div>
        </div>


    </body>
</html>
