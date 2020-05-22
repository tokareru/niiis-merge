<?php
class print_report_model extends model 
{
  public function index() 
  {
    $data = array();
    $data['title'] = conf::$SITE_NAME;
    return $data;
  }
  function scheme_and_spec(){
    $sql = "SELECT * FROM drawing_main_text";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $main_label = $q->fetchAll();
    
    $sql = "SELECT is_drawing_finished FROM system_conf";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $draw_finish = $Q[0]['is_drawing_finished'];
    
    $sql = "SELECT cnfval as round FROM sys_cnf WHERE cnfname = 'round'";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $round = $q->fetchAll();
    if($round[0]['round'] == 3){
      $esi_sql = "SELECT id, position,
                      designation,
                      name,
                      number,
                      type_id
              FROM products_esi
              ORDER BY id ASC, type_id ASC";
      $q = sys::$PDO->prepare($esi_sql);
      $q->execute();
      $esi_array = $q->fetchAll();
      
      
      $products_sql = "SELECT name FROM product_checked
                  WHERE active_sign = true";
      $q = sys::$PDO->prepare($products_sql);
      $q->execute();
      $products_query = $q->fetchAll();
      
//      var_dump($products_query);
//      var_dump($esi_array);
      
      $spec_table = array();
      
//      echo substr("detail-12", 7);
//      echo $esi_array[0]['name'];
      
      foreach($esi_array as $field=>$value1){
        $exist = false;
//        echo $value1['id'].', ';
        
        foreach ($products_query as $product=>$value2){
          
          if((int)substr($value2['name'], 7) == $value1['id']){
            array_push($spec_table, array('id'=>$value1['id'],
                                          'position'=>$value1['position'],
                                          'designation'=>$value1['designation'],
                                          'name'=>$value1['name'],
                                          'number'=>$value1['number'],
                                          'type_id'=>$value1['type_id']));
          }
        }
      }
//      var_dump($esi_array);
//      $spec_table = 0;
    } else {
      $sql = "SELECT  position,
                    name_short,
                    name_long,
                    count,
                    note
            FROM    spec_table 
            WHERE   active_sign = True";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $spec_table = $q->fetchAll();
    }
    
    
    
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
//    var_dump($spec_table);
   return $result;
  }
}
