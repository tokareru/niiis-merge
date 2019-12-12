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
}
?>