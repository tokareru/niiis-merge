<?php

class drawing_main_text_ajax_model extends model {

    public function get_data() {
       
    }

    function save() {
        $sql = "SELECT * FROM DRAWING_MAIN_TEXT";
        $q = sys::$PDO->prepare($sql);
        $q->execute($data);
        $Q = $q->fetchAll();
        if($Q){
            $sql = "UPDATE DRAWING_MAIN_TEXT SET";
            foreach ($_POST["body"] as $row) {
            $sql .= " field$i = :field$i";
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
            $sql .= " field$i";
            $str.=" :field$i";
            $data["field$i"] = $row;
            $i++;
        }
        $sql.=") ".$str.");";
        $q = sys::$PDO->prepare($sql);
        $q->execute($data);
        $Q = $q->fetchAll();
        }
    }

}
