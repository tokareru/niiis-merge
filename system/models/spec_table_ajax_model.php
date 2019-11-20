<?php
class spec_table_ajax_model extends model 
{
  public function get_data() 
  {
    $sql = "SELECT * FROM SPEC_TABLE";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $result;
    $i = 0;
    foreach($Q as $row){
        $j = 0;
        $is_readonly = $row["is_read_only"];
        for($k=0; $k < count($row); $k+=2){
            
            if($row["is_read_only"] != $row[$j]){
                $readonly = true;
//                if($is_readonly[$j++] == 'f'){
//                    $readonly = false;
//                }  
                $result[$i]["row"][$j] = array('text' => $row[$j],'readonly'=>$readonly);
                $j++;
            }
        }
        $i++;
    }
    return $result;
  }
}
