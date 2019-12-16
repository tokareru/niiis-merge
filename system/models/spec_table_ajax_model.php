<?php

class spec_table_ajax_model extends model {

    public function get_data() {
        $sql = "SELECT * FROM SPEC_TABLE WHERE ACTIVE_SIGN = '1'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $result["thead"] = array(array('text' => "Поз.", 'readonly' => true), array('text' => "Обозначение", 'readonly' => true), array('text' => "Наименование", 'readonly' => true), array('text' => "Кол.", 'readonly' => true));
        $i = 0;

        foreach ($Q as $row) {
            $j = 0;
            $is_readonly = $row["is_read_only"];
            for ($k = 0; $k < count($row) - 2; $k += 2) {

                if ($row["is_read_only"] != $row[$j]) {
                    $readonly = true;
                    if ($is_readonly[$j] == 'f') {
                        $readonly = false;
                    }
                    if($row[$j] == null){
                        $row[$j] = '';
                    }
                    $result['tbody'][$i]["row"][$j] = array('text' => $row[$j], 'readonly' => $readonly);

                    $j++;
                }
            }
            $i++;
        }
        return $result;
    }
    function save_product(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "INSERT PRODUCT(MODEL_NAME, PATH_3D, DESCRIPTION, USER_ID, TYPE_ID)
                    VALUES(:model_name, :path_3d, :description, (SELECT ID FROM USERS WHERE LOGIN = :login), 
                    (SELECT TYPE_ID FROM PRODUCT_TYPE WHERE TYPE=:type))
                    ";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("model_name" => $_POST["model_name"], "path_3d"=>$path_3d, 
                "description"=>$description, "login"=>$login, "type"=>$type));
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    
    function save() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "UPDATE SPEC_TABLE SET ACTIVE_SIGN = '0'";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $Q = $_POST['tbody'];
            $sql = "SELECT round from system_conf";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $round = $q->fetchAll()[0][0];
            $Q = $_POST['tbody'];
            foreach ($Q as $row) {
                $readonly_str = "";
                for ($i = 0; $i < 4; $i++) {
                    $bool = $row["row"][$i]["readonly"];
                    if ($bool == "true") {
                        $readonly_str .= "t";
                    } else {
                        $readonly_str .= "f";
                    }
                }
                
                $sql = "INSERT INTO SPEC_TABLE(POSITION,NAME_SHORT,NAME_LONG,COUNT,IS_READ_ONLY, ROUND, PRODUCT_ID, USER_ID)
                        VALUES(:position, :name_short, :name_long, :count, :readonly, :round, :product_id, (SELECT ID FROM USERS WHERE login=:login))";
                $q = sys::$PDO->prepare($sql);
                $i = 1;
                $pos=null;
                $kol=null;
                if($row["row"][0]["text"] != ""){
                    $pos = $row["row"][0]["text"];
                }
                if($row["row"][3]["text"] != ""){
                    $kol = $row["row"][3]["text"];
                }
                
                $q->execute(array("position" =>$pos, "name_short" => $row["row"][$i++]["text"], "name_long" => $row["row"][$i++]["text"],
                    "count" => $kol, "readonly" => $readonly_str,'round'=> $round, 'product_id'=>$row["row"][4]["product_id"], 'login'=> $_POST['login']));
            }
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

}
