<?php
class login_model extends model {
  public function get_data()
  {	
       $return=array();
        $return['title']=  self::title();
        $return['content']=  self::content();
        return $return;
    }
    function title(){
      return conf::$SITE_NAME;
    }
    function content(){

    }
}
?>