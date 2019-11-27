<?php

class root_map_model extends model {

    public function get_data() {
        $sql = "SELECT * FROM ROOT_MAP";
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
            $sql = "DELETE FROM SPEC_TABLE";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
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
                $sql = "INSERT INTO SPEC_TABLE(POSITION,NAME_SHORT,NAME_LONG,COUNT,IS_READ_ONLY)
                        VALUES(:position, :name_short, :name_long, :count, :readonly)";
                $q = sys::$PDO->prepare($sql);
                $i = 0;
                $q->execute(array("position" => $row["row"][$i++]["text"], "name_short" => $row["row"][$i++]["text"], "name_long" => $row["row"][$i++]["text"],
                    "count" => $row["row"][$i++]["text"], "readonly" => $readonly_str));
            }
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

}
