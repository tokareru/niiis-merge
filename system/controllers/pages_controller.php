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
  // счетчики для менюшки, использовать можно на всех страницах
}
?>