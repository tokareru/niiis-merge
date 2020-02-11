<?php
class admin_cab_controller extends Controller{
  function __construct(){
                if($_SESSION["niiis"]["role"] === "administrator"){    
                    include "system/models/admin_cab_model.php";
                    $this->model = new admin_cab_model();
                    $this->view = new View();
                }else{
                    $this->view = new View();
                }
	}
	
	function index(){
                if($_SESSION["niiis"]["role"] === "administrator"){    
                    $data = $this->model->get_data();
                    $this->view->render('table_users_view.php', 'admin/admin_cab_view.php', $data);
                }else{
                    $this->view->render('', 'admin/admin_error_view.php','');
                }
	}
        function change_users(){
            $data = $this->model->change_users();
            $this->view->render('','admin/admin_cab_view');
        }
        function reset(){
            $data = $this->model->reset();
            $this->view->render('', 'ajax_view_json.php', $data);
        }
        function pdm_edit(){
            $data = $this->model->pdm_edit();
            $this->view->render('pdm_edit.php', 'admin/admin_cab_view.php', $data);
        }
        function technologist_guide_edit(){
            $data = $this->model->technologist_guide_edit();
            $this->view->render('technologist_guide_edit.php', 'admin/admin_cab_view.php', $data);
        }
        function save_technologist_info(){
            $data = $this->model->save_technologist_info();
            $this->view->render('', 'ajax_view_json.php', $data);    
        }
}
?>