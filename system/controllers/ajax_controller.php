<?php

class ajax_controller extends Controller {

  function __construct() {
    include "system/models/ajax_model.php";
    $this->model = new ajax_model();
    $this->view = new View();
  }
  function get_products_esi(){
    $data = $this->model->get_products_esi();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_production_task_1_2(){
    $data = $this->model->get_production_task_1_2();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_production_task_1_2(){
    $data = $this->model->save_production_task_1_2();
    $this->view->render('', 'ajax_view_json.php', $data); 
  }
  function get_production_task_3(){
    $data = $this->model->get_production_task_3();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_production_task_3(){
    $data = $this->model->save_production_task_3();
    $this->view->render('', 'ajax_view_json.php', $data); 
  }
  function get_route_map_1_2(){
    $data = $this->model->get_route_map_1_2();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_route_map_1_2(){
    $data = $this->model->save_route_map_1_2();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_route_map_3(){
    $data = $this->model->get_route_map_3();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_route_map_3(){
    $data = $this->model->save_route_map_3();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_route_type(){
    $data = $this->model->save_route_type();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_route(){
    $data = $this->model->save_route();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_routes_by_type(){
    $data = $this->model->get_routes_by_type();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_routes_by_login(){
    $data = $this->model->get_routes_by_login();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_progressbar_actions(){
    $data = $this->model->get_progressbar_actions();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  
  function save_progressbar_actions(){
    $data = $this->model->save_progressbar_actions();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function select_user(){
    $data = $this->model->select_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_technologist_info(){
    $data = $this->model->get_technologist_info();
    $this->view->render('', 'ajax_view_json.php', $data);    
  }
  function get_techproccess(){
    $data = $this->model->get_techproccess();
    $this->view->render('', 'ajax_view_json.php', $data); 
  }
  function save_techproccess(){
    $data = $this->model->save_techproccess();
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
  // user tasks
  function get_user_tasks(){
    $data = $this->model->get_user_tasks();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_user_tasks_by_round(){
    $data = $this->model->get_user_tasks_by_round();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function add_user_task(){
    $data = $this->model->add_user_task();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function update_user_task(){
    $data = $this->model->update_user_task();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function delete_user_task(){
    $data = $this->model->delete_user_task();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
}

