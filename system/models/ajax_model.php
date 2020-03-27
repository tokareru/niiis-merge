<?php

class ajax_model extends model {
    function save_route(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
//            print_r($_POST);
            foreach($_POST["task"] as $row){
                $sql = "INSERT INTO ROUTE (login, role, name, task, master)
                        VALUES (:login, :role, :name, :task, :master)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("login" => $row["user"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "master" => $_POST["master"]));  
            }
            return array("response" => 200);
        }else{
            return array("response"=>"NOT FOUND POST REQUEST");
        }    
    }
    function get_routes_by_type(){
        $response = array();
        $response["active"] = array();
        $response["finished"] = array();
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '1'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();

        foreach($Q as $row){
            array_push($response["active"], array("master" => $row["master"], 
                "task"=>array("user"=>$row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"])));
        }
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '0'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();

        foreach($Q as $row){
            array_push($response["finished"], array("master" => $row["master"], 
                "task"=>array("user"=>$row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"])));
        }
        return array("response"=>$response);
    }
    function get_routes_by_login(){

        $response = array();
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '1' and login = :login";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_GET["login"]));
        $Q = $q->fetchAll();
        $response["active"] = array("master" => $_GET["login"], "task" => array());
        foreach($Q as $row){
            array_push($response["active"]["task"], array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"]));
        }
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '0' and login = :login";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_GET["login"]));
        $Q = $q->fetchAll();
        $response["finished"] = array("master" => $_GET["login"], "task" => array());
        foreach($Q as $row){
            array_push($response["finished"]["task"], array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"]));
        }
        
        return array("response"=>$response);
    }
    function get_progressbar_actions(){
        if($_SERVER["REQUEST_METHOD"]=="GET"){
        $sql = "SELECT * FROM LOGS WHERE login = :login";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_GET["login"]));
        $Q = $q->fetchAll();
        $response = array("progressBarActions" => array());
        foreach($Q as $row){
            array_push($response["progressBarActions"], array("id" => $row["operation_id"], "type" => $row["type"], 
                "field" => $row["field"], "text" => $row["text"]));
        }
        return $response;
        }else{
            return array("response"=>"NOT FOUND GET REQUEST");
        }
    }
    function save_progressbar_actions(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            print_r($_POST);
            $sql = "INSERT INTO LOGS (login, operation_id, type, field, text)
                    VALUES (:login, :id, :type, :field, :text)";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login"=>$_POST["login"], "id" => $_POST["action"]["id"], 
                "type" => $_POST["action"]["type"], "field" => $_POST["action"]["field"], "text" => $_POST["action"]["text"]));
            return array("response"=>200);
        }else{
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
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
       $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.id as third_id, t.FIELDS
FROM technologist_info_3_layout as t left join
technologist_info_2_layout as s on s.id = t.id_2_layout left join
technologist_info_1_layout as f on f.id = t.id_1_layout
ORDER BY third_id"; 
       $q = sys::$PDO->prepare($sql);
       $q->execute();
       $Q = $q->fetchAll();
       $name = "";
       $child_name = "";
       $result = array();
       $i = -1;
       $j = 0;
       foreach($Q as $row){
           if($name != $row["name"]){
               $j = 0;
               $name = $row["name"];
               array_push($result,array("name"=>$name, "lvl"=>1, "id"=>$row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields" => array(array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]))))));
               $child_name = $row["child_name"];
               $i++;
           }else{
               if($child_name != $row["child_name"])
               {
                   $child_name = $row["child_name"];
                   array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields"=>array(array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]))));
                   $j++;  
               }
               else{
                   array_push($result[$i]["children"][$j]["fields"], array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]));
               }      
           }
       }
       return $result;
    }
    function save_techproccess(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $sql = "DELETE FROM TECHPROCESS";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $sql = "INSERT INTO TECHPROCESS (id, id_parent, fields, is_new) VALUES ";
            foreach($_POST["techProcess"] as $row){
                if(count($row["children"]) > 0){
                    foreach($row["children"] as $child){
                        if(count($child["fields"]) > 0){
                            foreach($child["fields"] as $item)
                                if ($row["lvl"] == "new"){
                                    $sql .= "(".$child["id"].", ".$row["id"].", ".$item["id"].", '1'),";
                                }
                                else{
                                    $sql .= "(".$child["id"].", ".$row["id"].", ".$item["id"].", '0'),";
                                }
                        }else{
                            if ($row["lvl"] == "new"){
                                $sql .= "(".$child["id"].", ".$row["id"].", null, '1'),";
                            }
                            else{
                                $sql .= "(".$child["id"]." , ".$row["id"].", null , '0'),";
                            }
                        }
                    }
                }
                else{
                    if ($row["lvl"] == "new"){
                        $sql .= "(null, ".$row["id"].", null, '1'),";
                    }
                    else{
                        $sql .= "(null , ".$row["id"].", null , '0'),";
                    }
                }
            }
            $sql = substr($sql,0,-1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            return array("response"=>200);
        }else{
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function get_techproccess(){
            $sql = "SELECT * FROM TECHPROCESS ORDER BY id_techprocess";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $Q = $q->fetchAll();
            $id = 0;
            $response = array("techProcess" => array());
            $i = -1;
            $j = -1;
            $children_id = 0;
            foreach($Q as $row){
                if($row["id_parent"] != $id){
                    $j = -1;
                    $id = $row["id_parent"];
                    array_push($response["techProcess"], array("id"=>$id, "lvl" => ($row["is_new"])? "new" : 1, "children"=>array()));
                    ++$i;
                    if($row["id"] != null){
                        array_push($response["techProcess"][$i]["children"], array("id" => $row["id"], "lvl" => 2, "fields" => array()));
                    }
                    if($row["fields"] != null){
                        array_push($response["techProcess"][$i]["children"][++$j]["fields"], array("id" => $row["fields"], "lvl" => 3));
                    }
                    $children_id = $row["id"];
                }
                else{
                    if($children_id != $row["id"]){
                        $children_id = $row["id"];
                        if($row["id"] != null){
                            array_push($response["techProcess"][$i]["children"], array("id" => $row["id"], "lvl" => 2, "fields" => array()));
                        }
                        if($row["fields"] != null){
                            array_push($response["techProcess"][$i]["children"][++$j]["fields"], array("id" => $row["fields"], "lvl" => 3));
                        }
                    }
                    else{
                        if($row["fields"] != null){
                            array_push($response["techProcess"][$i]["children"][$j]["fields"], array("id" => $row["fields"], "lvl" => 3));
                        }
                    }
                }
            }
            return $response;
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

