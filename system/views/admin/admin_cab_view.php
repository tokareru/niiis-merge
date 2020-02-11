<?php  sys::inc_no_cache('css', 'css/tablesorter.css');
        sys::inc_no_cache('css', 'css/bootstrap.css');
        sys::inc_no_cache('css', 'css/styles.css');
        sys::inc_no_cache('css', 'css/jquery-ui.structure.css');
        sys::inc_no_cache('css','css/main.css');
        sys::inc_no_cache('css','css/btn_heder.css');
        
        sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
        sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
        sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
        sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
        sys::inc_no_cache('javascript', 'js/mainTabs.js');
        sys::inc_no_cache('javascript', 'js/admin/admin.js');

require_once conf::$ROOT . 'system/etc/functions.php';

// получаем адрес страницы без учета параметров
if($_SERVER['REQUEST_URI'] == '/'){
    $CURRENT_PAGE = 'admin';
    $CURRENT_PAGE_HARD = conf::$SITE_URL;
}
else{
$CURRENT_PAGE = basename($_SERVER['REQUEST_URI']); // получаем адрес
// способ 2
// парсим адрес 
$arr = parse_url($CURRENT_PAGE);
$CURRENT_PAGE_HARD = $CURRENT_PAGE; // сохраняем для жестких ссылок прописанных с учетом параметров в запросе
$CURRENT_PAGE = $arr['path']; // получаем конечный адрес
}
?>
<?php require_once("system/views/header.php"); ?>

<style>
        .main_menu .nav>li>a {
          display: block;
          padding: 3px 10px;
        }
      </style>
    
    
 <div id="all">

    <!--"Шапка"-->
    <table class="heder">
        <tbody>
            <tr>
                <td align="center">
                    <div class="main_name">
                      <div class="page-header" style="color: #337ab7;">
                        <h1>«<?php echo conf::$SITE_NAME;?>» <small></small></h1>
                      </div>
                    </div>
                </td>     
            </tr>
        </tbody>
    </table>
    <!--"Тело"-->
    <table class="total">
        <tr>
            <td class="menu_td">
                    <nav class="main_menu">

                        <nav class="main_menu">
                          <!--class="active"-->
                          <ul class="list-group">
                            <li class="list-group-item">
                              <h5 class="list-group-item-heading">редактирование</h5>
                              <p class="list-group-item-text">
                                <ul class="nav nav-pills nav-stacked">
                                  <li <?php echo ($CURRENT_PAGE == 'admin')?('class="active"'):""?>><a href="<?php echo conf::$SITE_URL ?>" style="padding-right: 0px;padding-left: 5px;">Пользователи<span class="badge pull-right" id="count_abits"></span></a></li> 
                                </ul>
                                <ul class="nav nav-pills nav-stacked">
                                  <li <?php echo ($CURRENT_PAGE == 'technologist_guide_edit')?('class="active"'):""?>><a href="<?php echo conf::$SITE_URL ?>admin_cab/technologist_guide_edit" style="padding-right: 0px;padding-left: 5px;">Справочник технолога<span class="badge pull-right" id="count_abits"></span></a></li> 
                                </ul>
                              </p>
                            </li>
                          </ul>
                          
                        </nav>

                    </td>
                   
                    <td class="content">
                      
                      <?php
                      if ($content_view <> '') {
                        include 'system/views/admin/' . $content_view;
                      }
                      else
                      {
                        ?>
                        <h3><?php echo conf::$SITE_NAME;?></h3>
                        <br>
                        <!--index-content-->
                        
                        <?php
                      }
                      ?>
                        
                    </td>
                </tr>	
            </table>
</div>