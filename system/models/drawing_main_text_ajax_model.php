<?php

class drawing_main_text_ajax_model extends model {

    public function get_data() {
       
    }

    function save() {
        $i = 1;
        $data = [];
        $sql = "UPDATE DRAWING_MAIN_TEXT SET";
        foreach ($_POST["body"] as $row) {
            $sql .= " field$i = :field$i";
            $data["field$i"] = $row;
        }
        
        $q = sys::$PDO->prepare($sql);
        $q->execute($data);
        $Q = $q->fetchAll();
    }

}
