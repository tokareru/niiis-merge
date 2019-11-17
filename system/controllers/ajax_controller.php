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
  
}

