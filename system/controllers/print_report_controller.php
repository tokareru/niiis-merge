<?php
class print_report_controller extends Controller{
  function __construct(){
		include "system/models/print_report_model.php";
		$this->model = new print_report_model();
		$this->view = new View();
	}
	
	function scheme_and_spec(){
		$data = $this->model->scheme_and_spec();
		$this->view->render('', 'reports/report_pdf_view.php', $data);
	}
  function route_map(){
		$data = $this->model->route_map();
		$this->view->render('', 'reports/report_route_map_view.php', $data);
	}
  function production_task(){
		$data = $this->model->production_task();
		$this->view->render('', 'reports/report_production_task_view.php', $data);
	}
}
?>