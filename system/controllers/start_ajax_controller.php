<?php
class start_ajax_controller extends Controller{
  function __construct(){
		include "system/models/start_ajax_model.php";
		$this->model = new start_ajax_model();
		$this->view = new View();
	}
	
	function index(){
		$data = $this->model->get_data();
		$this->view->render('', 'ajax_view_json.php', $data);
	}
  // счетчики для менюшки, использовать можно на всех страницах
}
?>