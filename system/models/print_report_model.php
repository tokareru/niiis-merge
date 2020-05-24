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
    

    $round = sys::get_current_round();
    if($round == 3){ // получение спецификации для третьего раунда
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
      
      // чтобы отфильтровать только установленные записи, бежим по массиву esi
      $spec_table = array();
      foreach($esi_array as $field=>$value1){
        // каждый раз пробегаем по массиву с отмеченными деталями 
        foreach ($products_query as $product=>$value2){
          if((int)substr($value2['name'], 7) == $value1['id']){ // откусываем "detail-" от строки получая айдишник детали
            // формируем новый массив только тех, кто входит в список отмеченных
            array_push($spec_table, array('id'=>$value1['id'],
                                          'position'=>$value1['position'],
                                          'designation'=>$value1['designation'],
                                          'name'=>$value1['name'],
                                          'number'=>$value1['number'],
                                          'type_id'=>$value1['type_id']));
          }
        }
      }
    } else { // получение спецификации для первого и второго раундов
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
    
    $sql = "SELECT * FROM drawing_size";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $size = $q->fetchAll()[0];
    
    $result = array("data" => $main_label,
                    "round"=>$round,
                    "spec_table"=>$spec_table,
                    "draw_finish" => $draw_finish,
                    "size" => $size
                    ); 
//    var_dump($spec_table);
   return $result;
  }
  
  function route_map(){
    $round = sys::get_current_round();
    
    if($round ==  3){
      $sql = "SELECT * FROM technologist_info_1_layout WHERE active_sign = true";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $lvl_1 = array();
      foreach($Q as $key=>$value) $lvl_1[$value['id']] = $value['name'];
      
      $sql = "SELECT * FROM technologist_info_2_layout WHERE active_sign = true";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $lvl_2 = array();
      foreach($Q as $key=>$value) $lvl_2[$value['id']] = $value['name'];
      
      $sql = "SELECT * FROM technologist_info_3_layout WHERE active_sign = true";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $lvl_3 = array();
      foreach($Q as $key=>$value) $lvl_3[$value['id']] = $value['fields'];
      
      function get_field_info($str, $lvl_1, $lvl_2, $lvl_3) {
        $id = substr($str, 6, strlen($str));
        $lvl = substr($str, 3, stripos($str, 'id') - 3);
        if($lvl == 1) $name = $lvl_1[$id];
        else if($lvl == 2) $name = $lvl_2[$id];
        else if($lvl == 3) $name = $lvl_3[$id];
        else $name = '';
        
        $result = array("id" => $id, 
                        "lvl" => $lvl,
                        "name" => $name
                        );
        return $result;
      }
      
      $sql = "SELECT * FROM route_map_3 ORDER BY group_id";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $group_id = 0;
      $route_map = array();
      $i = -1;
      foreach ($Q as $row) {
        $field_info = get_field_info($row["name"], $lvl_1, $lvl_2, $lvl_3);
        
//        var_dump($lvl_3);
        
        if ($group_id != $row["group_id"]) {
          $group_id = $row["group_id"];
          $route_map[++$i] = array("name" => $field_info['name'], "equipment" => array(), "tools" => array());
          if ($row["dop_type"] == "equipment") {
            array_push($route_map[$i]["equipment"], array("id" => $row["dop_id"], 'name'=>$lvl_3[$row["dop_id"]], "lvl" => 3));
          } elseif ($row["dop_type"] == "tools") {
            array_push($route_map[$i]["tools"], array("id" => $row["dop_id"], 'name'=>$lvl_3[$row["dop_id"]], "lvl" => 3));
          }
        } else {
          if ($row["dop_type"] == "equipment") {
            array_push($route_map[$i]["equipment"], array("id" => $row["dop_id"], 'name'=>$lvl_3[$row["dop_id"]], "lvl" => 3));
          } elseif ($row["dop_type"] == "tools") {
            array_push($route_map[$i]["tools"], array("id" => $row["dop_id"], 'name'=>$lvl_3[$row["dop_id"]], "lvl" => 3));
          }
        }
      }
    }
    
    $result = array("route_map" => $route_map,
                      "round" => $round
                    ); 
    return $result;
  }
  function production_task(){
    
    $round = sys::get_current_round();
    
    
    $result = array("data" => 0
                    ); 
    return $result;
  }
}
