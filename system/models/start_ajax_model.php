<?php

class start_ajax_model extends model {

    public function get_data() {
        $Q = [];

        if ($_SERVER["REQUEST_METHOD"] == "GET") {
                $sql = "SELECT date_trunc('seconds',m.DATE_CHANGE) as date_change, u.LOGIN 
            FROM MODIFY_DATE m INNER JOIN
            USERS u on u.id = m.user_id
                ";
                $q = sys::$PDO->prepare($sql);
                $q->execute();
                $Q1 = $q->fetchAll();
                $sql = "SELECT * FROM SYS_CNF";
                $q = sys::$PDO->prepare($sql);
                $q->execute();
                $Q = $q->fetchAll();
                $round = 1;
                foreach ($Q as $row) {
                    if ($row["cnfname"] == 'round') {
                        $round = $row['cnfval'];
                    }
                }
                $_SESSION["niiis"]["round"] = $round - '0';
                return array("login" => sys::user_login(), "role" => $_SESSION['niiis']['role'], "round" => $round - '0',
                    "server_name" => trim($_SERVER['SERVER_NAME'], '/'), "name" => $_SESSION['niiis']['name'], "date_change" => substr($Q1[0]["date_change"], 0, -3), "login_change" => $Q1[0]["login"]);
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }

    function set_data() {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $sql = "UPDATE SYS_CNF SET cnfval=:round_val where cnfname = 'round'";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("round_val" => $_GET["round"]));
            $_SESSION["niiis"]["round"] = $_GET['round'];
            return(array("response" => 200));
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }

    function db_change_time() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "UPDATE MODIFY_DATE SET user_id=(select id from users where login=:login), date_change = default";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login" => $_POST["login"]));
            $Q = $q->fetchAll();
            if ($Q) {
                return(array("response" => 200));
            } else {
                return array("response" => "Unexecute request to db");
            }
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }

}
