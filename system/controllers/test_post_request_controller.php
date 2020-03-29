<?php
class test_post_request_controller extends Controller{
  function __construct(){
		$this->view = new View();
	}
	
	function index(){
		$this->view->render('', 'test_post_request_view.php', "");
	}
}
?>