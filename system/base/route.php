<?php

class Route
{
  static $path;
  static $fields;
	static function start()
	{ 
    global $CONF;
		// контроллер и действие по умолчанию
    
    $controller_name = 'default';
    
    $action_name = 'index';
   
		
    $aUrl=parse_url(trim($_SERVER['REQUEST_URI'],'/\\'));
    $path = explode('/', $aUrl['path']);
    
    //array_shift($path); // удаляем первый элемент - год
    for($i=0;$i<conf::$SITE_SUBDIR_INDEX;$i++){
      array_shift($path); // удаляем кол-вол вложенных директорий
    }
    
    self::$path=$path;
    
    if(!isset($path[0]) || !$path[0]){
        $modul = 'default';
    }else{
        $modul = $path[0];
    }
    if(sys::is_autorised()){
        if($_SESSION["niiis"]["role"] === "administrator"){
            if($modul =='default'){
                $modul ='admin_cab';
            }
        }
      require_once conf::$ROOT.'system/etc/functions.php';
      
      if($modul=='ajax'){
        $controller_file = 'ajax_controller.php';
        if(file_exists("system/controllers/".$controller_file)){
          include "system/controllers/".$controller_file;
          $controller_name='ajax_controller';
          if (class_exists($controller_name)){
            $controller = new $controller_name;
            $action = $path[1];
                if (method_exists($controller, $action))
                {
                  // вызываем действие контроллера
                  $param='';
                  if (isset($param))
                            $controller->$action($param);
                        else
                            $controller->$action();
                }
                else
                {
  //          			throw new Exception('action_not_found');
                }
          }else{
            throw New Exception('Controller_class_not_found');
          }
        }
      }else{
        $fields=array();
        $fields['filename']=$modul.'_controller';

        self::$fields=$fields;

  //      if(isset($fields['filename'])){
          $controller_file = $fields['filename'].'.php';
          if(file_exists("system/controllers/".$controller_file)){
            include "system/controllers/".$controller_file;
            $controller_name=$fields['filename'];//$url;//'simple_page_tpl';
            if (class_exists($controller_name)){
              $controller = new $controller_name;
              
              $action = 'index';
              if(isset($path[1])){
                $action = $path[1].'';
              }
                  if (method_exists($controller, $action))
                  {
                    // вызываем действие контроллера
                    $param='';
                    if (isset($param))
                        $controller->$action($param);
                    else
                        $controller->$action();
                  }
                  else
                  {
    //          			throw new Exception('action_not_found');
                  }
            }else{
              throw New Exception('Controller_class_not_found');
            }
          }else{
            throw New Exception('Controller_not_found');
          }
      }
    }else{
      $fields=array();

      $fields['filename']='login_controller';

      self::$fields=$fields;

//      if(isset($fields['filename'])){
        $controller_file = $fields['filename'].'.php';
        if(file_exists("system/controllers/".$controller_file)){
          include "system/controllers/".$controller_file;
          $controller_name=$fields['filename'];//$url;//'simple_page_tpl';
          if (class_exists($controller_name)){
            $controller = new $controller_name;
  //          $action = $path[1];
            $action = 'index';
            if(isset($path[1])){
                $action = $path[1].'';
              }
                if (method_exists($controller, $action))
                {
                  // вызываем действие контроллера
                  $param='';
                  if (isset($param))
                      $controller->$action($param);
                  else
                      $controller->$action();
                }
                else
                {
  //          			throw new Exception('action_not_found');
                }
          }else{
            throw New Exception('Controller_class_not_found');
          }
        }
        else{
          throw New Exception('Controller_not_found');
        }
    }
		
	
	}
    
}
?>