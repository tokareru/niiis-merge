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
       $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.EQUIPMENT, t.TOOLS
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
            $sql = "DELETE FROM WORK_PLACE_TECH_PROCESS";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $i = 1;
            foreach($_POST["save"] as $row){       
                if(!isset($row["empty"])){
                    $sql = "INSERT INTO WORK_PLACE_TECH_PROCESS(row_id, item_id, lvl)
                            VALUES(:row_id, :item_id, :lvl)";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("row_id"=>$i++, "item_id" => $row["id"], "lvl" => $row["lvl"]));
                }else{
                    $sql = "INSERT INTO WORK_PLACE_TECH_PROCESS(row_id, item_id, lvl)
                            VALUES(:row_id, null, null)";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("row_id"=>$i++));
                }
            }
            return(array("response"=>200));
        }
        else{
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function get_work_place_tech_process(){
        $sql = "SELECT * FROM WORK_PLACE_TECH_PROCESS";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $result = [];
        foreach($Q as $row){
            $sql = "SELECT NAME
                    FROM technologist_info_".$row["lvl"]."_layout
                    WHERE id = :id";
            $q1 = sys::$PDO->prepare($sql);
            $q1->execute(array("id"=>$row["item_id"]));
            $Q1 = $q1->fetchAll();
            if($Q1 == null){
                array_push($result, array("empty"=>true));
            }
            else{
            array_push($result,array("name"=>$Q1[0]["name"], "lvl"=>$row["lvl"], "id"=>$row["item_id"]));
            }
        }
        return $result;
    }
    function save_pdm_standart_products(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
             $sql = "INSERT INTO PRODUCT(model_name, path_3d, description, user_id, type_id)
                 VALUES(:model_name, :path_3d, :descr, :user_id, (select id from product_type where type = :type))";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("model_name" => $_POST["model_name"], "path_3d" => $_POST["path_3d"], "descr" => $_POST["descr"], "user_id" => $_POST["user_id"], "type" => $_POST["type"]));
        
            return(array("response" => 200));
        }
        else{
            return array("response"=>"NOT FOUND POST REQUEST");
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

