<?php
class login_controller extends Controller{
  function __construct(){
		include "system/models/login_model.php";
		$this->model = new login_model();
		$this->view = new View();
	}
	
	function index(){
		$data = $this->model->get_data();
		$this->view->render('', 'login_view.php', $data);
	}
  
  function program_modal(){
    $data = $this->model->program_modal();
		$this->view->render('', 'login_program_modal_view.php', $data);
  }
  
  function nastavnik_modal(){
    $data = $this->model->nastavnik_modal();
		$this->view->render('', 'login_nastavnik_modal_view.php', $data);
  }
}
?>