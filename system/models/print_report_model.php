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
    
    $sql = "SELECT is_drawing_finished FROM system_conf";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $draw_finish = $Q[0]['is_drawing_finished'];
//    var_dump($draw_finish);
    
    $sql = "SELECT cnfval as round FROM sys_cnf WHERE cnfname = 'round'";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $round = $q->fetchAll();
    if($round[0]['round'] == 3){
      $sql = "SELECT position,
                      designation,
                      name,
                      number,
                      type_id
              FROM products_esi
              ORDER BY id ASC, type_id ASC";
    } else {
      $sql = "SELECT  position,
                    name_short,
                    name_long,
                    count
            FROM    spec_table 
            WHERE   active_sign = True";
    }
    
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $spec_table = $q->fetchAll();
    
//    var_dump($spec_table);
    
    $sql = "SELECT * FROM drawing_size";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $size = $q->fetchAll()[0];
    
    $result = array("data" => $main_label,
                    "round"=>$round[0]['round'],
                    "spec_table"=>$spec_table,
                    "draw_finish" => $draw_finish,
                    "size" => $size
                    ); 
    var_dump($result);
   return $result;
  }
}
