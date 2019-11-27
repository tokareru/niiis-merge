<?php
class pages_controller extends Controller{
  function __construct(){
		$this->view = new View();
	}
	
	function index(){
		//$this->view->render('', 'default_view.php', $data);
	}

        function _3D(){
            $this->view->render('', '3D_view.php', '');
        }

        function left_side(){
            $this->view->render('', 'left_side_view.php', '');
        }

        function main_tabs(){
           $this->view->render('', 'main_tabs_view.php', '');
        }

        function right_side(){
             $this->view->render('', 'right_side_view.php', '');
        }

        function scheme_field(){
            $this->view->render('', 'scheme_field_view.php', '');
        }

        function pdm(){
            $this->view->render('', 'pdm_view.php', '');
        }

        function std(){
            $this->view->render('', 'std_view.php', '');
        }

        function esi_field(){
            $this->view->render('', 'esi_field_view.php', '');
        }

        function chat(){
            $this->view->render('', 'chat_view.php', '');
        }

        function specification_field(){
            $this->view->render('', 'specification_field_view.php', '');
        }

        function route_map(){
            $this->view->render('', 'route_map.php', '');
        }

        function edit_field(){
            $this->view->render('', 'edit_field_view.php', '');
        }

        function tasks_routes(){
            $this->view->render('', 'tasks_routes.php', '');
        }

        function tasks_routes_table(){
            $this->view->render('', 'tasks_routes_table.php', '');
        }

        function production_task_field(){
            $this->view->render('', 'production_task_field.php', '');
        }

        function create_task_route(){
            $this->view->render('', 'create_task_route.php', '');
        }

  // счетчики для менюшки, использовать можно на всех страницах
}
?>
