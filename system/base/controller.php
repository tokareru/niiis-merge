<?php

class controller {

  public $model;
  public $view;

  function __construct() {
    $this->view = new View();
  }

  function index_action() {
    
  }

  /**
   * Показываем страницу "Доступ запрещён" если пользователя нет 
   * ни в одной из групп
   * Список возможных групп см. в методе sys::user_group()
   * @param string $users Группы которым доступ разрешён. 
   * Например: 'admin,ivc,user'
   */
  function allow($users) {

    if (!sys::user_in_group($users)) {
      
      $this->view = new View();
      $this->view->render('access_denied_view.php', 'default_view.php', '');
      exit;
    }
  }

}

?>