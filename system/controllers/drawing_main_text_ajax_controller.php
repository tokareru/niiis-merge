<?php
class drawing_main_text_ajax_controller extends Controller{
  function __construct(){
		include "system/models/drawing_main_text_ajax_model.php";
		$this->model = new drawing_main_text_ajax_model();
		$this->view = new View();
	}
	
	function index(){
		$data = $this->model->get_data();
		$this->view->render('', 'ajax_view_json.php', $data);
	}
        function save (){
            $data = $this->model->save();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
  // счетчики для менюшки, использовать можно на всех страницах
}
?>