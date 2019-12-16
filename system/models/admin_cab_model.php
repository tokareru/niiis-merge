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
      $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q1 = $q->fetchAll();
      return array("users" => $Q, "group_users" => $Q1, "page"=>"users");
  }
  function change_users(){
      
  }
  function reset(){
    $sql = "DELETE FROM SPEC_TABLE";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $sql = "UPDATE DRAWING_MAIN_TEXT SET ";
    for($i = 1; $i <= 50; $i++){
        if($i == 1){
            $sql.= "field$i = ''";
        }else{
            $sql.= ", field$i = ''";
        }
    }
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $sql = "UPDATE MODIFY_DATE SET user_id=(select id from users where login=:login), date_change = default";
    $q = sys::$PDO->prepare($sql);
    $q->execute(array("login" => $_SESSION["niiis"]["login"]));
    $Q = $q->fetchAll();
    $sql = "UPDATE SYSTEM_CONF SET is_drawing_finished = '0'";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $sql = "UPDATE SYSTEM_CONF SET ROUND=1";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    return array("round"=>1);
  }
  function pdm_edit(){
      return array("content"=>array("page"=>"pdm_edit"));
  }
}
