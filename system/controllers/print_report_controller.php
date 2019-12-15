<?php
class print_report_controller extends Controller{
  function __construct(){
		include "system/models/print_report_model.php";
		$this->model = new print_report_model();
		$this->view = new View();
	}
	
	function index(){
		$data = $this->model->get_data();
		$this->view->render('', 'reports/report_pdf_view.php', $data);
	}
}
?>