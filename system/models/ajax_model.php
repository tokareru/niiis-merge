<?php

class ajax_model extends model {
    function get_technologist_info(){
        function get_array_from_string($string){
           $string = trim($string,' ');
           $res = explode(',', $string);
           $result = array();
           foreach($res as $row){
               array_push($result,array("name"=>$row));
           }
           return $result;
        }
       $sql = "SELECT f.NAME as name, s.NAME as child_name, t.Name as dop_name, t.EQUIPMENT, t.TOOLS
               FROM technologist_info_1_layout f LEFT JOIN
               technologist_info_2_layout s on f.id = s.id_1_layout LEFT JOIN
               technologist_info_3_layout t on s.id = t.id_2_layout"; 
       $q = sys::$PDO->prepare($sql);
       $q->execute();
       $Q = $q->fetchAll();
       $name = "t";
       $result;
       $i = -1;
       foreach($Q as $row){
           if($name != $row["name"]){
               $i++;
               $name = $row["name"];
               $result[$i] = array("name"=>$name, "children" => array(array("name" => $row["child_name"], "tools"=>get_array_from_string($row["tools"]), "equipment" => get_array_from_string($row["equipment"]))));
               
           }else{
               array_push($result[$i]["children"], array("name" => $row["child_name"], "tools"=>array(array("name"=>$row["tools"])), "equipment" => array(array("name"=>$row["equipment"]))));
           }
       }
       return $result;
    }
}

