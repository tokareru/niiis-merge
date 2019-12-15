<?php

class drawing_main_text_ajax_model extends model {

    public function get_data() {
       $sql = "SELECT * FROM DRAWING_MAIN_TEXT";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return $Q[0];
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
