<?php

class ajax_controller extends Controller {

  function __construct() {
    include "system/models/ajax_model.php";
    $this->model = new ajax_model();
    $this->view = new View();
  }

  function select_user(){
    $data = $this->model->select_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_technologist_info(){
    $data = $this->model->get_technologist_info();
    $this->view->render('', 'ajax_view_json.php', $data);    
  }
  function save_work_place_tech_process(){
    $data = $this->model->save_work_place_tech_process();
    $this->view->render('', 'ajax_view_json.php', $data); 
  }
  function get_work_place_tech_process(){
    $data = $this->model->get_work_place_tech_process();
    $this->view->render('', 'ajax_view_json.php', $data); 
  }
  function save_pdm_standart_products(){
    $data = $this->model->save_pdm_standart_products();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_pdm_standart_products(){
    $data = $this->model->get_pdm_standart_products();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
}

