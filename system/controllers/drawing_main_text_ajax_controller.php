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
        function is_drawing_finished(){
            $data = $this->model->is_drawing_finished();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
        function save_size(){
            $data = $this->model->save_size();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
        function load_size(){
            $data = $this->model->load_size();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
        function save_is_full(){
            $data = $this->model->save_is_full();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
        function load_is_full(){
            $data = $this->model->load_is_full();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
  // счетчики для менюшки, использовать можно на всех страницах
}
?>