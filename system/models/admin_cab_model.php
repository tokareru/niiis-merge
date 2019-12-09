<?php
class admin_cab_model extends model 
{
  public function get_data() 
  {
    $data = array();
    $data['title'] = conf::$SITE_NAME;
    $data['content'] = self::content();
    return $data;
  }
  function content(){
  }
  function change_users(){
      
  }
}
