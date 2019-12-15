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
    $sql = "SELECT * FROM drawing_main_text";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $main_label = $q->fetchAll();
    
    $sql = "SELECT round FROM system_conf";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $round = $q->fetchAll();
    
    $sql = "SELECT  position,
                    name_short,
                    name_long,
                    count
            FROM    spec_table 
            WHERE   active_sign = True";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $spec_table = $q->fetchAll();
    
    
    $result = array("data" => $main_label,
                    "round"=>$round[0]['round'],
                    "spec_table"=>$spec_table); 
//    var_dump($result);
   return $result;
  }
}
