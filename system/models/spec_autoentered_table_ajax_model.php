<?php

class spec_autoentered_table_ajax_model extends model {

    public function get_data() {
        $sql = "SELECT * FROM SPEC_AUTOENTERED_TABLE WHERE ACTIVE_SIGN = '1'";
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
    
    function save() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "UPDATE SPEC_AUTOENTERED_TABLE SET ACTIVE_SIGN = '0'";
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
                
                $sql = "INSERT INTO SPEC_AUTOENTERED_TABLE(POSITION,NAME_SHORT,NAME_LONG,COUNT,IS_READ_ONLY, ROUND, PRODUCT_ID, USER_ID)
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
    
    function save_product_checked(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $arr = $_POST["checked"];
            $sql = "SELECT COUNT(NAME) FROM PRODUCT_CHECKED WHERE ACTIVE_SIGN = '0'";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $Q = $q->fetchAll();
            if($Q[0] > 100){
                $sql = "DELETE FROM PRODUCT_CHECKED WHERE ACTIVE_SIGN = '0'";
                $q = sys::$PDO->prepare($sql);
                $q->execute();
                $Q = $q->fetchAll();
            }
            $sql = "UPDATE PRODUCT_CHECKED SET ACTIVE_SIGN='0'";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($arr as $name){
                $sql = "INSERT INTO PRODUCT_CHECKED(NAME)
                        VALUES(:name)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("name"=>$name));
            }
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    function load_product_checked(){
        $sql = "SELECT NAME FROM PRODUCT_CHECKED WHERE ACTIVE_SIGN = '1'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $names = [];
        foreach ($Q as $row) {
            array_push($names,$row["name"]);
        }
        return array("checked"=>$names);
    }

}
