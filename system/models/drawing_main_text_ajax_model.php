<?php

class drawing_main_text_ajax_model extends model {

    public function get_data() {
       $sql = "SELECT * FROM DRAWING_MAIN_TEXT";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return $Q[0];
    }
    function is_drawing_finished(){
        if($_SERVER["REQUEST_METHOD"]=="GET"){
            if($_GET["type"] == 'set')
            {
                $sql = "";
                if (trim($_SERVER['SERVER_NAME'], '/') === '82.146.41.218') {
                    $sql = "UPDATE SYSTEM_CONF SET is_drawing_finished = '1'";
                }else{
                    $sql = "UPDATE SYS_CNF SET cnfval = '1' where cnfname = 'is_drawing_finished'";
                }
                $q = sys::$PDO->prepare($sql);
                $q->execute();
                $Q = $q->fetchAll();
                if($Q){
                    return(array("response"=>200));
                }
                else{
                    return array("response"=>"Unexecute request to db");
                }
            }elseif($_GET["type"] == 'get'){
                $sql = "SELECT is_drawing_finished FROM SYSTEM_CONF";
                $q = sys::$PDO->prepare($sql);
                $q->execute();
                $Q = $q->fetchAll();
                return array("is_drawing_finished"=>$Q[0][0]);
            }
        }else {
            return array("response"=>"NOT FOUND GET REQUEST");
        }
    }
    function save() {
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $sql = "SELECT * FROM DRAWING_MAIN_TEXT";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $Q = $q->fetchAll();
            if($Q){
                $i = 1;
                $sql = "UPDATE DRAWING_MAIN_TEXT SET";
                foreach ($_POST["body"] as $row) {
                if($i != 1){
                $sql .= " ,field$i = :field$i";
                }
                else{
                $sql .= " field$i = :field$i";
                }
                $data["field$i"] = $row;
                $i++;
                }

            $q = sys::$PDO->prepare($sql);
            $q->execute($data);
            $Q = $q->fetchAll();


            }else{
            $i = 1;
            $data = [];
            $sql = "INSERT INTO DRAWING_MAIN_TEXT(";
            $str = "VALUES (";
            foreach ($_POST["body"] as $row) {
                if($i != 1){
                $sql .= " ,field$i";
                $str.=" ,:field$i";
                }
                else{
                $sql .= " field$i";
                $str.=" :field$i";
                }
                $data["field$i"] = $row;
                $i++;
            }
            $sql.=") ".$str.");";
            echo $sql;
            $q = sys::$PDO->prepare($sql);
            $q->execute($data);
            $Q = $q->fetchAll();
            }
                return array("response" => 200);
        }else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function save_size(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $sql = "UPDATE DRAWING_SIZE set drawing_name = :name, size_1 = :size_1, size_2 = :size_2, size_3 = :size_3";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("name" => $_POST["scheme"], "size_1" => $_POST["razm1"], "size_2" => $_POST["razm2"], "size_3" => $_POST["razm3"]));
        }else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function load_size(){
        $sql = "SELECT * FROM DRAWING_SIZE";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return array("scheme" => $Q[0]["drawing_name"], "razm1" => $Q[0]["size_1"], "razm2" => $Q[0]["size_2"], "razm3" => $Q[0]["size_3"]);
    }
}
