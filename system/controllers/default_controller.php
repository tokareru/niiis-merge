<?php
class default_controller extends Controller{
  function __construct(){
		include "system/models/default_model.php";
		$this->model = new default_model();
		$this->view = new View();
	}
	
	function index(){
		$data = $this->model->get_data();
		$this->view->render('', 'default_view.php', $data);
	}
  // счетчики для менюшки, использовать можно на всех страницах
  function counters(){
    $data = $this->model->counters();
		$this->view->render('', 'ajax_view_json.php', $data);
  }
  function logout(){
      session_destroy();
        header("location:".conf::$SITE_URL);
  }
}
?>