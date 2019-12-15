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
                $sql = "UPDATE SYSTEM_CONF SET is_drawing_finished = '1'";
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
            return array("response"=>"NOT FOUND POST REQUEST");
        }
    }
    function save() {
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
    }

}
