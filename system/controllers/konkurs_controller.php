<?php
class konkurs_controller extends Controller{
  // конструктор
  function __construct(){
		include "system/models/konkurs_model.php";
		$this->model = new konkurs_model();
		$this->view = new View();
	}
  // действие по умолчанию при загрузке основного представления
	function index(){
		$data = $this->model->get_data();
		$this->view->render('konkurs_view.php', 'default_view.php', $data);
	}
  
  // контроллеры всех действий:
  function save_add(){
    $data = $this->model->save_add();
		$this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_edit(){
    $data = $this->model->save_edit();
		$this->view->render('', 'ajax_view_json.php', $data);
  }
  function edit(){
    $data = $this->model->edit();
		$this->view->render('konkurs_edit_view.php', 'default_view.php', $data);
  }
  function add(){
    $data = $this->model->add();
		$this->view->render('konkurs_add_view.php', 'default_view.php', $data);
  }
  
  function delete(){
    $data = $this->model->delete();
		$this->view->render('', 'ajax_view_json.php', $data);
  }
  
}
?>