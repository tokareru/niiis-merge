<?php
class logout_controller extends Controller{

    //Так как контроллер маленький, тут у нас почти ничего не будет и все действия в контроллере
	function index()
	{
        session_destroy();
        header("location:".conf::$SITE_URL);
	}
}
?>