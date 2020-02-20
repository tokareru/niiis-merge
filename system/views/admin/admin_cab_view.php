<?php
//require_once conf::$ROOT . 'system/etc/functions.php';
// получаем адрес страницы без учета параметров
if ($_SERVER['REQUEST_URI'] == '/') {
  $CURRENT_PAGE = 'admin';
  $CURRENT_PAGE_HARD = conf::$SITE_URL;
} else {
  $CURRENT_PAGE = basename($_SERVER['REQUEST_URI']); // получаем адрес
// способ 2
// парсим адрес 
  $arr = parse_url($CURRENT_PAGE);
  $CURRENT_PAGE_HARD = $CURRENT_PAGE; // сохраняем для жестких ссылок прописанных с учетом параметров в запросе
  $CURRENT_PAGE = $arr['path']; // получаем конечный адрес
}
?>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Кабинет администратора</title>

    <?php
    sys::inc_no_cache('css', 'css/tablesorter.css');
    sys::inc_no_cache('css', 'css/bootstrap.css');

    sys::inc_no_cache('javascript', 'js/admin/admin.js');
    sys::inc_no_cache('css', 'css/admin_cab.css');
    sys::inc_no_cache('css', 'css/icons-fontawesome.css');
    ?>

  </head>
  <body>
    <!--верхнее меню-->
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" >Администратор</a>

      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="<?php echo conf::$SITE_URL . 'logout' ?>">Выйти</a>
        </li>
      </ul>
    </nav>
    <!--конец верхнего меню-->
    
    <!--начало основного блока контента-->
    <div class="container-fluid">
      <div class="row">

        <!-------------левое меню--------------->
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#"><span data-feather="home"></span>
                  <i class="fas fa-database"></i> Статистика         
                </a>
              </li>
              </ul>
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Операции</span>
                <a class="d-flex align-items-center text-muted">
                  <span data-feather="plus-circle"></span>
                </a>
              </h6>
              <ul class="nav flex-column mb-2">
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <i class="fas fa-user-edit"></i> Пользователи
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <i class="fas fa-user-friends"></i> Группы пользователей
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="<?php echo conf::$SITE_URL ?>admin_cab/technologist_guide_edit">
                    <i class="fas fa-list"></i> Справочник технолога
                  </a>
                </li>
              </ul>
          </div>
        </nav>
        <!-------------конец левого меню--------------->

        <!-------------Основной контент--------------->
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2"><?php echo $CURRENT_PAGE ?></h1>
          </div>
          <div class="mb-md-0">
            <!--вставить содержимое сюда-->
<?php
if ($content_view <> '') {
  include 'system/views/admin/' . $content_view;
} else {
  
}
?>
            <!--конец блока содержимого-->
          </div>
        </main>
      </div>
    </div>
  </body>
</html>