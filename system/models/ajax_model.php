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
       $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.Name as dop_name, t.EQUIPMENT, t.TOOLS
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
               $result[$i] = array("name"=>$name, "lvl"=>1, "id"=>$row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "tools"=>get_array_from_string($row["tools"]), "equipment" => get_array_from_string($row["equipment"]))));
               
           }else{
               array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "tools"=>array(array("name"=>$row["tools"])), "equipment" => array(array("name"=>$row["equipment"]))));
           }
       }
       return $result;
    }
    function save_work_place_tech_process(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            
        }
    }
    function save_pdm_standart_products(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
             $sql = "INSERT INTO PRODUCT(model_name, path_3d, description, user_id, type_id)
                 VALUES(:model_name, :path_3d, :descr, :user_id, (select id from product_type where type = :type))";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("model_name" => $_POST["model_name"], "path_3d" => $_POST["path_3d"], "descr" => $_POST["descr"], "user_id" => $_POST["user_id"], "type" => $_POST["type"]));
        
            return(array("response" => 200));
        }
    }
    function get_pdm_standart_products(){
        $sql = "SELECT p.model_name, p.path_3d, p.description, p.user_id, t.type
                FROM product p LEFT JOIN
                product_type t on p.type_id = t.id
                ORDER BY t.type, p.id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $result = [];
        foreach($Q as $row){
            array_push($result, array("model_name" => $row["model_name"], "path_3d" => $row["path_3d"], "descr" => $row["description"], "user_id" => $row["user_id"], "type" => $row["type"]));
        }
        return($result);
    }
}

