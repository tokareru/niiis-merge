<?php

class ajax_model extends model {

    function get_products_esi() {
        $sql = "SELECT p.id, p.name, p.designation, p.position, p.path_3d, p.path_picture, p.number, e.type
            FROM PRODUCTS_ESI p LEFT JOIN
            ESI_TYPE e on e.id = p.type_id
            ORDER BY id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $response = array();
        foreach ($Q as $row) {
            array_push($response, array("id" => $row["id"], "name" => $row["name"], "designation" => $row["designation"], "position" => $row["position"], "path_3d" => $row["path_3d"], "path_picture" => $row["path_picture"], "number" => $row["number"], "type" => $row["type"]));
        }
        return $response;
    }

    function get_production_task_1_2() {
        $sql = "SELECT * FROM production_task_1_2 where login = :login";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_REQUEST["login"]));
        $Q = $q->fetchAll();
        $response = [];
        foreach ($Q as $row) {
            array_push($response, array("name" => $row["name"], "job" => $row["job"], "techOperation" => $row["techoperation"], "task" => $row["task"]));
        }
        return $response;
    }

    function save_production_task_1_2() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM production_task_1_2 where login = :login";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login" => $_POST["login"]));
            $sql = "INSERT INTO production_task_1_2 (login, name, job, techoperation, task) VALUES ";
            foreach ($_POST["productTasks"] as $row) {
                $sql .= "('" . $_POST["login"] . "', '" . $row["name"] . "', '" . $row["job"] . "', '" . $row["techOperation"] . "', '" . $row["task"] . "'),";
            }
            $sql = substr($sql, 0, -1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_production_task_3() {
        $sql = "SELECT * FROM production_task_3 where login = :login";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_REQUEST["login"]));
        $Q = $q->fetchAll();
        $response = array("login" => $_REQUEST["login"], "productTasks" => array());
        foreach ($Q as $row) {
            array_push($response["productTasks"], array("id" => $row["task_id"]));
        }
        return $response;
    }

    function save_production_task_3() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM production_task_3 where login = :login";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login" => $_POST["login"]));
            $sql = "INSERT INTO production_task_3 (login, task_id) VALUES ";
            foreach ($_POST["productTasks"] as $row) {
                $sql .= "('" . $_POST["login"] . "', " . $row["id"] . "),";
            }
            echo $sql;
            $sql = substr($sql, 0, -1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_route_map_1_2() {
        $sql = "SELECT * FROM route_map_1_2";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $response = array();
        foreach ($Q as $row) {
            array_push($response, array("name" => $row["name"], "equipment" => $row["equipment"], "tools" => $row["tools"]));
        }
        return $response;
    }

    function save_route_map_1_2() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM route_map_1_2";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $sql = "INSERT INTO route_map_1_2 (name,equipment,tools) VALUES ";
            foreach ($_POST["data"] as $row) {
                $sql .= "('" . $row["name"] . "','" . $row["equipment"] . "','" . $row["tools"] . "'),";
            }
            $sql = substr($sql, 0, -1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_route_map_3() {

        function get_lvl_id($str) {
            $result = array("id" => substr($str, 6, strlen($str)), "lvl" => substr($str, 3, stripos($str, 'id') - 3));
            return $result;
        }

        $sql = "SELECT * FROM route_map_3 ORDER BY group_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $group_id = 0;
        $result = array();
        $i = -1;
        foreach ($Q as $row) {
            $lvl_id = get_lvl_id($row["name"]);
            if ($group_id != $row["group_id"]) {
                $group_id = $row["group_id"];
                $result[++$i] = array("name" => $lvl_id, "equipment" => array(), "tools" => array());
                if ($row["dop_type"] == "equipment") {
                    array_push($result[$i]["equipment"], array("id" => $row["dop_id"], "lvl" => 3));
                } elseif ($row["dop_type"] == "tools") {
                    array_push($result[$i]["tools"], array("id" => $row["dop_id"], "lvl" => 3));
                }
            } else {
                if ($row["dop_type"] == "equipment") {
                    array_push($result[$i]["equipment"], array("id" => $row["dop_id"], "lvl" => 3));
                } elseif ($row["dop_type"] == "tools") {
                    array_push($result[$i]["tools"], array("id" => $row["dop_id"], "lvl" => 3));
                }
            }
        }
        return $result;
    }

    function save_route_map_3() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM route_map_3";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $i = 1;
            $sql = "INSERT INTO route_map_3 (name,dop_id,dop_type, group_id) VALUES ";
            foreach ($_POST["data"] as $row) {
                foreach ($row["equipment"] as $eq) {
                    $name = "lvl" . $row["name"]["lvl"] . "id" . $row["name"]["id"];
                    $sql .= "('" . $name . "'," . $eq["id"] . ",'equipment', " . $i . "),";
                }
                foreach ($row["tools"] as $tool) {
                    $name = "'lvl" . $row["name"]["lvl"] . "id" . $row["name"]["id"] . "'";
                    $sql .= "(" . $name . "," . $tool["id"] . ",'tools', " . $i . "),";
                }
                if (!$row["tools"] && !$row["equipment"]) {
                    $name = "'lvl" . $row["name"]["lvl"] . "id" . $row["name"]["id"] . "'";
                    $sql .= "(" . $name . ",null,''," . $i . "),";
                }
                $i++;
            }
            $sql = substr($sql, 0, -1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function save_route() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "SELECT max(task_id) from ROUTE";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $task_id = ++$q->fetchAll()[0][0];
            foreach ($_POST["task"] as $row) {
                $sql = "INSERT INTO ROUTE (login, role, name, task, master, task_id, shell)
                        VALUES (:login, :role, :name, :task, :master, :task_id, :shell)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("login" => $row["user"], "role" => $row["role"], "name" => $row["name"],
                    "task" => $row["task"], "master" => $_POST["master"], "task_id" => $task_id, "shell" => $_POST["shell"]));
            }
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_routes_by_type() {
        $response = array();
        $response["active"] = array();
        $response["finished"] = array();
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '1' ORDER BY task_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $task_id = 0;
        $i = -1;
        foreach ($Q as $row) {
            if ($task_id != ($row["task_id"])) {
                $task_id = $row["task_id"];
                $response["active"][++$i] = array(array("master" => $row["master"],
                        "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            } else {
                array_push($response["active"][$i], array("master" => $row["master"],
                    "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            }
        }
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '0'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $task_id = 0;
        $i = -1;
        foreach ($Q as $row) {
            if ($task_id != ($row["task_id"])) {
                $task_id = $row["task_id"];
                $response["finished"][++$i] = array(array("master" => $row["master"],
                        "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            } else {
                array_push($response["finished"][$i], array("master" => $row["master"],
                    "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            }
        }
        return array("response" => $response);
    }

    function get_routes_by_login() {

        $response = array();
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '1' and master = :login ORDER BY task_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_GET["login"]));
        $Q = $q->fetchAll();
        $response = array();
        $response["active"] = array();
        $task_id = 0;
        $i = -1;
        foreach ($Q as $row) {
            if ($task_id != ($row["task_id"])) {
                $task_id = $row["task_id"];
                $response["active"][++$i] = array(array("master" => $row["master"],
                        "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            } else {
                array_push($response["active"][$i], array("master" => $row["master"],
                    "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            }
        }
        $sql = "SELECT * FROM ROUTE WHERE ACTIVE_SIGN = '0' and login = :login GROUP BY task_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_GET["login"]));
        $Q = $q->fetchAll();
        $response["finished"] = array("master" => $_GET["login"], "task" => array());
        $task_id = 0;
        $i = -1;
        foreach ($Q as $row) {
            if ($task_id != ($row["task_id"])) {
                $task_id = $row["task_id"];
                $response["finished"][++$i] = array(array("master" => $row["master"],
                        "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            } else {
                array_push($response["finished"][$i], array("master" => $row["master"],
                    "task" => array("user" => $row["login"], "role" => $row["role"], "name" => $row["name"], "task" => $row["task"], "id" => $row["id"], "status" => $row["status"]), "shell" => $row["shell"]));
            }
        }
        return array("response" => $response);
    }

    function get_progressbar_actions() {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $sql = "SELECT * FROM LOGS WHERE login = :login";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login" => $_GET["login"]));
            $Q = $q->fetchAll();
            $response = array("progressBarActions" => array());
            foreach ($Q as $row) {
                array_push($response["progressBarActions"], array("id" => $row["operation_id"], "type" => $row["type"],
                    "field" => $row["field"], "text" => $row["text"]));
            }
            return $response;
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }
    
    function save_route_type() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "UPDATE ROUTE set status = '" . $_POST["status"] . "' where id = " . $_POST["id"];
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $sql = "SELECT STATUS, TASK_ID FROM ROUTE WHERE TASK_ID = (SELECT TASK_ID FROM ROUTE WHERE id = :id)";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("id" => $_POST["id"]));
            $Q = $q->fetchAll();
            $is_change = True;
            foreach ($Q as $row) {
                if ($Q[0][0] == "nonactive") {
                    $is_change = False;
                }
            }
            if ($is_change) {
                $sql = "UPDATE ROUTE set active_sign = '0' where task_id = " . $Q[0]["task_id"];
                $q = sys::$PDO->prepare($sql);
                $q->execute();
            }
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function save_progressbar_actions() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "INSERT INTO LOGS (login, operation_id, type, field, text)
                    VALUES (:login, :id, :type, :field, :text)";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("login" => $_POST["login"], "id" => $_POST["action"]["id"],
                "type" => $_POST["action"]["type"], "field" => $_POST["action"]["field"], "text" => $_POST["action"]["text"]));
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    
    // Users Tasks
    function get_user_tasks() {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            
            $sql = "SELECT cnfval as round FROM sys_cnf WHERE cnfname = 'round'";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $temp = $q->fetchAll();
            $round = $round[0]['round'];
            
            $sql = "SELECT * FROM users_tasks WHERE username = :username AND round = :round AND active_sign = 1";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("username" => $_GET["login"], 
                                "round" => $round
                                ));
            $Q = $q->fetchAll();
            $response = array("tasks" => array());
            foreach ($Q as $row) {
                array_push($response["tasks"], 
                            array(
                                "global_id" => $row["task_id"],
                                "id" => $row["task_number"],
                                "text" => $row["text"],
                                "isFinished" => $row["isFinished"], 
                                "trigger" => $row["trigger"],
                                "add_info" => $row["add_info"]
                            ));
            }
            return $response;
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }
    
    function get_user_tasks_by_round() {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $sql = "SELECT * FROM users_tasks WHERE username = :username AND round = :round AND active_sign = 1";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("username" => $_GET["login"], 
                                "round" => $_GET["round"]
                                ));
            $Q = $q->fetchAll();
            $response = array("tasks" => array());
            foreach ($Q as $row) {
                array_push($response["tasks"], 
                            array(
                                "global_id" => $row["task_id"],
                                "id" => $row["task_number"],
                                "text" => $row["text"],
                                "isFinished" => $row["isFinished"], 
                                "trigger" => $row["trigger"],
                                "add_info" => $row["add_info"]
                            ));
            }
            return $response;
        } else {
            return array("response" => "NOT FOUND GET REQUEST");
        }
    }
    
    
    
    function add_user_task() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            
//            $sql = "UPDATE users_tasks SET active_sign = 0 WHERE username = :username AND round = :round";
            $sql = "DELETE FROM users_tasks WHERE username = :username AND round = :round";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("username" => $_POST["login"],
                                "round" => $_POST["round"]
                        ));
            
            
            $sql = "INSERT INTO users_tasks (task_number, username, trigger, add_info, text, round)
                    VALUES ";
//            (:task_number, :username, :trigger, :add_info, :text, :round)
            
             foreach ($_POST["tasks"] as $row) {
                $sql .= "(".$row["id"]
                        .",'".$_POST["login"]
                        ."','".$row["trigger"]
                        ."','".$row["add_info"]
                        ."','".$row["text"]
                        ."',".$_POST["round"]
                        ."),";
            }
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    
    function update_user_task() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            
            $sql = "SELECT cnfval as round FROM sys_cnf WHERE cnfname = 'round'";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $temp = $q->fetchAll();
            $round = $round[0]['round'];
            
            $sql = "UPDATE users_tasks SET isFinished = :isFinished WHERE task_number = :task_number AND username = :username AND round = :round";
            
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("isFinished" => $_POST["isFinished"], 
                                "task_number" => $_POST["id"], 
                                "username" => $_POST["login"],
                                "round" => $round
                        ));
            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    
//    function delete_user_task() {
//        if ($_SERVER["REQUEST_METHOD"] == "POST") {
//            $sql = "UPDATE users_tasks SET active_sign = 0 WHERE task_number = :task_number AND username = :username AND round = :round";
//            
//            $q = sys::$PDO->prepare($sql);
//            $q->execute(array("task_number" => $_POST["id"], 
//                                "username" => $_POST["login"],
//                                "round" => $_POST["round"]
//                        ));
//            return array("response" => 200);
//        } else {
//            return array("response" => "NOT FOUND POST REQUEST");
//        }
//    }
    // --------- users tasks
    
    function get_technologist_info() {

        function get_array_from_string($string) {
            $string = trim($string, ' ');
            $res = explode(',', $string);
            $result = array();
            foreach ($res as $row) {
                array_push($result, array("name" => $row));
            }
            return $result;
        }

        $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.id as third_id, t.FIELDS
FROM technologist_info_3_layout as t left join
technologist_info_2_layout as s on s.id = t.id_2_layout left join
technologist_info_1_layout as f on f.id = t.id_1_layout
ORDER BY third_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $name = "";
        $child_name = "";
        $result = array();
        $i = -1;
        $j = 0;
        foreach ($Q as $row) {
            if ($name != $row["name"]) {
                $j = 0;
                $name = $row["name"];
                array_push($result, array("name" => $name, "lvl" => 1, "id" => $row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl" => 2, "id" => $row["second_id"], "fields" => array(array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]))))));
                $child_name = $row["child_name"];
                $i++;
            } else {
                if ($child_name != $row["child_name"]) {
                    $child_name = $row["child_name"];
                    array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl" => 2, "id" => $row["second_id"], "fields" => array(array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]))));
                    $j++;
                } else {
                    array_push($result[$i]["children"][$j]["fields"], array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]));
                }
            }
        }
        return $result;
    }

    function save_techproccess() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM TECHPROCESS";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $sql = "INSERT INTO TECHPROCESS (id, id_operations, id_parent, fields, is_new) VALUES ";
            foreach ($_POST["techProcess"] as $row) {
                if (count($row["operations"]) > 0) {
                    foreach ($row["operations"] as $operation) {
                        if (count($operation["nodes"]) > 0) {
                            foreach ($operation["nodes"] as $node) {
                                if (count($node["fields"]) > 0) {
                                    foreach ($node["fields"] as $item)
                                        if ($row["lvl"] == "new") {
                                            $sql .= "(" . $node["id"] . ", " . $operation["id"] . ", " . $row["id"] . ", " . $item["id"] . ", '1'),";
                                        } else {
                                            $sql .= "(" . $node["id"] . ", " . $operation["id"] . ", " . $row["id"] . ", " . $item["id"] . ", '0'),";
                                        }
                                } else {
                                    if ($row["lvl"] == "new") {
                                        $sql .= "(" . $node["id"] . ", " . $operation["id"] . ", " . $row["id"] . ", null, '1'),";
                                    } else {
                                        $sql .= "(" . $node["id"] . ", " . $operation["id"] . ", " . $row["id"] . ", null , '0'),";
                                    }
                                }
                            }
                        } else {
                            if ($row["lvl"] == "new") {
                                $sql .= "(null, " . $operation["id"] . ", " . $row["id"] . ", null, '1'),";
                            } else {
                                $sql .= "(null , " . $operation["id"] . ", " . $row["id"] . ", null , '0'),";
                            }
                        }
                    }
                } else {
                    if ($row["lvl"] == "new") {
                        $sql .= "(null, null, " . $row["id"] . ", null, '1'),";
                    } else {
                        $sql .= "(null , null, " . $row["id"] . ", null , '0'),";
                    }
                }
            }
            $sql = substr($sql, 0, -1);
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $sql = "SELECT login FROM USERS WHERE group_user_id = :id";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("id" => 5));
            $Q = $q->fetchAll();
            foreach ($Q as $row) {
                $sql = "DELETE FROM production_task_3 where login = :login";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("login" => $row["login"]));
            }

            return array("response" => 200);
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_techproccess() {
        $sql = "SELECT * FROM TECHPROCESS ORDER BY id_techprocess";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $id = 0;
        $response = array("techProcess" => array());
        $i = -1;
        $j = -1;
        $k = -1;
        $children_id = 0;
        $operation_id = 0;
        foreach ($Q as $row) {
            if ($row["id_parent"] != $id) {
                $j = -1;
                $k = -1;
                $id = $row["id_parent"];
                array_push($response["techProcess"], array("id" => $id, "lvl" => ($row["is_new"]) ? "new" : 1, "operations" => array()));

                ++$i;
                if ($row["id_operations"] != null) {
                    array_push($response["techProcess"][$i]["operations"], array("id" => $row["id_operations"], "lvl" => 3, "nodes" => array()));
                }
                if ($row["id"] != null) {
                    array_push($response["techProcess"][$i]["operations"][++$j]["nodes"], array("id" => $row["id"], "lvl" => 2, "fields" => array()));
                }
                if ($row["fields"] != null) {
                    array_push($response["techProcess"][$i]["operations"][$j]["nodes"][++$k]["fields"], array("id" => $row["fields"], "lvl" => 3));
                }
                $operations_id = $row["id_operations"];
                $children_id = $row["id"];
            } else {
                if ($operations_id != $row["id_operations"]) {
                    $k = -1;
                    $operations_id = $row["id_operations"];
                    array_push($response["techProcess"][$i]["operations"], array("id" => $row["id_operations"], "lvl" => 3, "nodes" => array()));
                    if ($row["id"] != null) {
                        array_push($response["techProcess"][$i]["operations"][++$j]["nodes"], array("id" => $row["id"], "lvl" => 2, "fields" => array()));
                    }
                    if ($row["fields"] != null) {
                        array_push($response["techProcess"][$i]["operations"][$j]["nodes"][++$k]["fields"], array("id" => $row["fields"], "lvl" => 3));
                    }
                    $children_id = $row["id"];
                } else {
                    if ($children_id != $row["id"]) {
                        $children_id = $row["id"];
                        if ($row["id"] != null) {
                            array_push($response["techProcess"][$i]["operations"][$j]["nodes"], array("id" => $row["id"], "lvl" => 2, "fields" => array()));
                        }
                        if ($row["fields"] != null) {
                            array_push($response["techProcess"][$i]["operations"][$j]["nodes"][++$k]["fields"], array("id" => $row["fields"], "lvl" => 3));
                        }
                    } else {
                        if ($row["fields"] != null) {
                            array_push($response["techProcess"][$i]["operations"][$j]["nodes"][$k]["fields"], array("id" => $row["fields"], "lvl" => 3));
                        }
                    }
                }
            }
        }

        return $response;
    }

    function save_work_place_tech_process() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM WORK_PLACE_TECH_PROCESS";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $i = 1;
            foreach ($_POST["save"] as $row) {
                if (!isset($row["empty"])) {
                    $sql = "INSERT INTO WORK_PLACE_TECH_PROCESS(row_id, item_id, lvl)
                            VALUES(:row_id, :item_id, :lvl)";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("row_id" => $i++, "item_id" => $row["id"], "lvl" => $row["lvl"]));
                } else {
                    $sql = "INSERT INTO WORK_PLACE_TECH_PROCESS(row_id, item_id, lvl)
                            VALUES(:row_id, null, null)";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("row_id" => $i++));
                }
            }
            return(array("response" => 200));
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_work_place_tech_process() {
        $sql = "SELECT * FROM WORK_PLACE_TECH_PROCESS";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $result = [];
        foreach ($Q as $row) {
            $sql = "SELECT NAME
                    FROM technologist_info_" . $row["lvl"] . "_layout
                    WHERE id = :id";
            $q1 = sys::$PDO->prepare($sql);
            $q1->execute(array("id" => $row["item_id"]));
            $Q1 = $q1->fetchAll();
            if ($Q1 == null) {
                array_push($result, array("empty" => true));
            } else {
                array_push($result, array("name" => $Q1[0]["name"], "lvl" => $row["lvl"], "id" => $row["item_id"]));
            }
        }
        return $result;
    }

    function save_pdm_standart_products() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "INSERT INTO PRODUCT(model_name, path_3d, description, user_id, type_id)
                 VALUES(:model_name, :path_3d, :descr, :user_id, (select id from product_type where type = :type))";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("model_name" => $_POST["model_name"], "path_3d" => $_POST["path_3d"], "descr" => $_POST["descr"], "user_id" => $_POST["user_id"], "type" => $_POST["type"]));

            return(array("response" => 200));
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }

    function get_pdm_standart_products() {
        $sql = "SELECT p.model_name, p.path_3d, p.description, p.user_id, t.type
                FROM product p LEFT JOIN
                product_type t on p.type_id = t.id
                ORDER BY t.type, p.id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $result = [];
        foreach ($Q as $row) {
            array_push($result, array("model_name" => $row["model_name"], "path_3d" => $row["path_3d"], "descr" => $row["description"], "user_id" => $row["user_id"], "type" => $row["type"]));
        }
        return($result);
    }

}
