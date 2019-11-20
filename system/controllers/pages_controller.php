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
            $this->view->render('', 'shell/left_side_view.php', '');
        }

        function main_tabs(){
           $this->view->render('', 'shell/main_tabs_side_view.php', '');
        }

        function right_side(){
             $this->view->render('', 'shell/right_side_view.php', '');
        }

        function pdm(){
            $this->view->render('', 'pdm_view.php', '');
        }

        function std(){
            $this->view->render('', 'std_view.php', '');
        }

        function esi(){
            $this->view->render('', 'esi_view.php', '');
        }

        function chat(){
            $this->view->render('', 'chat_view.php', '');
        }

        function specification(){
            $this->view->render('', 'specification_view.php', '');
        }


  // счетчики для менюшки, использовать можно на всех страницах
}
?>
