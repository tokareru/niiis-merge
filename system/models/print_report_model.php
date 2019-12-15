<?php
class print_report_model extends model 
{
  public function get_data() 
  {
    $data = array();
    $data['title'] = conf::$SITE_NAME;
    $data['content'] = self::content();
    return $data;
  }
  function content(){
    
    $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q1 = $q->fetchAll();

    return array("users" => $Q, "group_users" => $Q1);
  }
  
  function report_pdf(){
    
  }
}
