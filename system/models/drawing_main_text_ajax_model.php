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

                $sql = "UPDATE SYS_CNF SET cnfval = 'true' where cnfname = 'is_drawing_finished'";
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
              $sql = "SELECT cnfval FROM SYS_CNF where cnfname='is_drawing_finished'";

              
              $q = sys::$PDO->prepare($sql);
              $q->execute();
              $Q = $q->fetchAll();
              
              return array("is_drawing_finished"=>($Q[0][0]=='true')?true:false);
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
    function save_size_and_positions(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $sql = "UPDATE DRAWING_SIZE SET
                          size_1 = :size_1,
                          size_2 = :size_2,
                          size_3 = :size_3,
                          pos_1 = :p1,
                          pos_2 = :p2,
                          pos_3 = :p3,
                          pos_4 = :p4,
                          pos_5 = :p5,
                          pos_6 = :p6,
                          pos_7 = :p7
                    WHERE drawing_name = 'scheme'";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("name" => $_POST["scheme"], 
                "size_1" => $_POST["razm1"], 
                "size_2" => $_POST["razm2"], 
                "size_3" => $_POST["razm3"],
                "p1" => $_POST["p1"],
                "p2" => $_POST["p2"],
                "p3" => $_POST["p3"],
                "p4" => $_POST["p4"],
                "p5" => $_POST["p5"],
                "p6" => $_POST["p6"],
                "p7" => $_POST["p7"]
                    ));
        }else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function load_size_and_positions(){
        $sql = "SELECT * FROM DRAWING_SIZE WHERE drawing_name = 'scheme'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return array("scheme" => $Q[0]["drawing_name"], 
            "razm1" => $Q[0]["size_1"], 
            "razm2" => $Q[0]["size_2"],
            "razm3" => $Q[0]["size_3"],
            "p1" => $Q[0]["pos_1"],
            "p2" => $Q[0]["pos_2"],
            "p3" => $Q[0]["pos_3"],
            "p4" => $Q[0]["pos_4"],
            "p5" => $Q[0]["pos_5"],
            "p6" => $Q[0]["pos_6"],
            "p7" => $Q[0]["pos_7"]
            );
    }
    function save_is_full(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            if ($_POST["isFull"] == "true") {$_POST["isFull"] = "true";}else{ $_POST["isFull"] = "false";}
            $sql = "UPDATE sys_cnf SET cnfval = :isFull WHERE cnfname = 'drawing_is_full'";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("isFull"=> $_POST["isFull"]));
        }else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function load_is_full(){
        $sql = "SELECT cnfval 
                FROM sys_cnf 
                WHERE cnfname = 'drawing_is_full'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return array("isFull"=>$Q[0][0]);
    }
}
