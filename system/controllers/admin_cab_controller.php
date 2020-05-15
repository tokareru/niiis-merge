<?php

class admin_cab_controller extends Controller {

  function __construct() {
    if ($_SESSION["niiis"]["role"] === "administrator") {
      include "system/models/admin_cab_model.php";
      $this->model = new admin_cab_model();
      $this->view = new View();
    } else {
      $this->view = new View();
      $this->view->render('', 'admin/admin_error_view.php', '');
    }
  }

  function index() {
//    if ($_SESSION["niiis"]["role"] === "administrator") {
      $data = $this->model->settings();
      $this->view->render('settings_view.php', 'admin/admin_cab_view.php', $data);
//    } 
  }

  function settings() {
    $data = $this->model->settings();
    $this->view->render('', 'admin/admin_cab_view');
  }
  
  function change_users() {
    $data = $this->model->change_users();
    $this->view->render('table_users_view.php', 'admin/admin_cab_view.php', $data);
  }

  function get_change_users(){
    $data = $this->model->get_change_users();
    $this->view->render('', 'ajax_view_json.php', $data);
  }

  function change_groups_users(){
    $data = $this->model->change_groups_users();
    $this->view->render('change_groups_users_view.php', 'admin/admin_cab_view.php', $data);
  }

  function reset() {
    $data = $this->model->reset();
    $this->view->render('', 'ajax_view_json.php', $data);
  }

  function pdm_edit() {
    $data = $this->model->pdm_edit();
    $this->view->render('pdm_edit.php', 'admin/admin_cab_view.php', $data);
  }
  
  function get_pdm_edit() {
    $data = $this->model->get_pdm_edit();
    $this->view->render('', 'ajax_view.php', $data);
  }

  function save_pdm_edit(){
    $data = $this->model->save_pdm_edit();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function esi_edit() {
    $data = $this->model->esi_edit();
    $this->view->render('esi_edit.php', 'admin/admin_cab_view.php', $data);
  }
  
  function get_esi_edit() {
    $data = $this->model->get_esi_edit();
    $this->view->render('', 'ajax_view.php', $data);
  }

  function save_esi_edit(){
    $data = $this->model->save_esi_edit();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  
  function technologist_guide_edit() {
    $data = $this->model->technologist_guide_edit();
    $this->view->render('technologist_guide_edit.php', 'admin/admin_cab_view.php', $data);
  }

  function tasks_edit() {
    $data = $this->model->tasks_edit();
    $this->view->render('tasks_edit.php', 'admin/admin_cab_view.php');
  }

  function get_fields(){
    $data = $this->model->get_fields();
    $this->view->render('', 'ajax_view.php', $data);
  }
  
  function get_technologist_info(){
    $data = $this->model->get_technologist_info();
    $this->view->render('', 'ajax_view_json.php', $data);    
  }
  
  function progressbar(){
    $data = $this->model->progressbar();
    $this->view->render('progressbar.php', 'admin/admin_cab_view.php', $data);
   }
   
  function get_logs(){
    $data = $this->model->get_logs();
    $this->view->render('', 'ajax_view.php', $data);
  }

  function save_technologist_info() {
    $data = $this->model->save_technologist_info();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_group_user_info_by_id(){
    $data = $this->model->get_group_user_info_by_id();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_groups_users_edit(){
    $data = $this->model->save_groups_users_edit();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function add_group_user(){
    $data = $this->model->add_group_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function delete_group_user(){
    $data = $this->model->delete_group_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_user_info_by_id(){
    $data = $this->model->get_user_info_by_id();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function save_users_edit(){
    $data = $this->model->save_users_edit();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function change_user_active_sign(){
    $data = $this->model->change_user_active_sign();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function change_user_role(){
    $data = $this->model->change_user_role();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function add_user(){
    $data = $this->model->add_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
  function get_users_groups(){
    $data = $this->model->get_users_groups();
    $this->view->render('', 'ajax_view.php', $data);
  }
  function delete_user(){
    $data = $this->model->delete_user();
    $this->view->render('', 'ajax_view_json.php', $data);
  }
}

?>
