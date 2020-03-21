<?php

class admin_cab_model extends model {

    public function get_data() {
        $data = array();
        $data['title'] = conf::$SITE_NAME;
        $data['content'] = self::content();
        return $data;
    }

    function content() {
        
    }

    function settings() {
        $sql = "SELECT * FROM public.users 
        LEFT JOIN public.user_group ON public.users.group_user_id = public.user_group.group_id
        WHERE login = '" . sys::user_login() . "'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return array("user_data" => $Q[0]);
    }

    public function change_users() {
        $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q1 = $q->fetchAll();
        return array("users" => $Q, "group_users" => $Q1, "page" => "users", "page_name" => "Пользователи");
    }
    
    function change_groups_users(){
        $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99 ORDER BY group_id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return $Q;
    }

    function reset() {
        $sql = "DELETE FROM SPEC_TABLE";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "DELETE FROM LOGS";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "UPDATE DRAWING_MAIN_TEXT SET ";
        for ($i = 1; $i <= 50; $i++) {
            if ($i == 1) {
                $sql .= "field$i = ''";
            } else {
                $sql .= ", field$i = ''";
            }
        }
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "UPDATE MODIFY_DATE SET user_id=(select id from users where login=:login), date_change = default";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_SESSION["niiis"]["login"]));
        $Q = $q->fetchAll();
        $sql = "UPDATE SYS_CNF SET cnfval = 'false' where cnfname = 'is_drawing_finished'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "UPDATE SYS_CNF SET cnfval = '1' where cnfname = 'round'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "UPDATE DRAWING_SIZE set drawing_name = default, size_1 = default, size_2 = default, size_3 = default";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        return array("round" => 1);
    }

    function pdm_edit() {
        return array("content" => array("page" => "pdm_edit"));
    }

    function technologist_guide_edit() {

        function get_array_from_string($string) {
            $string = trim($string, ' ');
            $res = explode(',', $string);
            $result = array();
            foreach ($res as $row) {
                array_push($result, array("name" => $row));
            }
            return $result;
        }

        $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.EQUIPMENT, t.TOOLS
               FROM technologist_info_1_layout f LEFT JOIN
               technologist_info_2_layout s on f.id = s.id_1_layout LEFT JOIN
               technologist_info_3_layout t on s.id = t.id_2_layout";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $name = "t";
        $result;
        $i = -1;
        foreach ($Q as $row) {
            if ($name != $row["name"]) {
                $i++;
                $name = $row["name"];
                $result[$i] = array("name" => $name, "lvl" => 1, "id" => $row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl" => 2, "id" => $row["second_id"], "tools" => get_array_from_string($row["tools"]), "equipment" => get_array_from_string($row["equipment"]))));
            } else {
                array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl" => 2, "id" => $row["second_id"], "tools" => array(array("name" => $row["tools"])), "equipment" => array(array("name" => $row["equipment"]))));
            }
        }

        return $result;
    }

    function save_technologist_info() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $save = $_POST["save"];
            $sql = "DELETE FROM technologist_info_1_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($save["layout1"] as $row) {
                $sql = "INSERT INTO technologist_info_1_layout (id, name)
                     VALUES(:id,:name)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("id" => $row["id"], "name" => $row["name"]));
            }
            $sql = "DELETE FROM technologist_info_2_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($save["layout2"] as $row) {
                $sql = "INSERT INTO technologist_info_2_layout (id, id_1_layout, name)
                     VALUES(:id,:parent_id, :name)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("id" => $row["id"], "parent_id" => $row["parent"], "name" => $row["name"]));
            }
            $i = 0;
            $sql = "DELETE FROM technologist_info_3_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($save["layout3"]["tools"] as $row) {
                $sql = "INSERT INTO technologist_info_3_layout (id, id_2_layout, equipment, tools)
                         VALUES(:id, :id_layout,:equipment, :tools)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("id" => $i + 1, "id_layout" => $row["parent"], "equipment" => $save["layout3"]["equipment"][$i++]["name"], "tools" => $row["name"]));
            }
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    function get_group_user_info_by_id(){
        if($_POST["id"] != 99){
            $sql = "
                  SELECT user_group_name, user_status, descr
                  FROM user_group
                  WHERE group_id = :id";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("id"=>$_POST["id"]));
            $Q = $q->fetchAll();
            return $Q[0];
        }
    }
    function save_groups_users_edit() {
        $sql="UPDATE user_group set user_group_name = :user_group_name, user_status = :user_status, descr = :descr
              WHERE group_id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("user_group_name" => $_POST["user_group_name"], "user_status" => $_POST["user_status"], "descr" => $_POST["descr"], "id" => $_POST["id"]));
        return array("response"=>200);
    }
    function add_group_user(){
        $sql = "INSERT INTO user_group (group_id, user_group_name, user_status, descr)
                VALUES(((SELECT group_id FROM user_group WHERE group_id <> 99 ORDER BY group_id DESC
                        limit 1) + 1), :user_group_name, :user_status, :descr);
               ";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("user_group_name" => $_POST["user_group_name"], "user_status" => $_POST["user_status"],  "descr" => $_POST["descr"]));
        $sql = "SELECT group_id FROM user_group WHERE group_id <> 99 ORDER BY group_id DESC
               limit 1";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        return array("id" => $Q[0][0]);
        
    }
    function delete_group_user(){
        $sql = "DELETE FROM user_group WHERE group_id=:id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id" => $_POST["id"]));
        return array("response" => 200);
    }
    function get_user_info_by_id(){
      $sql = "
            SELECT first_name, last_name, otc, login, password
            FROM users
            WHERE id = :id and group_user_id <> 99";
      $q = sys::$PDO->prepare($sql);
      $q->execute(array("id"=>$_POST["id"]));
      $Q = $q->fetchAll();
      return $Q[0];
    }
    
    function save_users_edit() {
        $sql="UPDATE users set last_name = :last_name, first_name = :first_name, otc = :otc, login = :login, password = :password
              WHERE id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("last_name" => $_POST["last_name"], "first_name" => $_POST["first_name"], "otc" => $_POST["otc"], "login" => $_POST["login"], "password" => $_POST["password"], "id" => $_POST["id"]));
        return array("response"=>200);
    }
    function change_user_active_sign(){
        $sql="UPDATE users set active_sign = not active_sign
              WHERE id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id" => $_POST["id"]));
        return array("response"=>200);
    }
    function change_user_role(){
        $sql="UPDATE users set group_user_id = :group_user_id
              WHERE id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("group_user_id" => $_POST["role_id"],"id" => $_POST["id"]));
        return array("response"=>200);
    }
    function add_user(){
        $sql = "INSERT INTO USERS (first_name, last_name, otc, login, password, group_user_id)
                VALUES(:first_name, :last_name, :otc, :login, :password, :group_user_id);
               ";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("first_name" => $_POST["first_name"], "last_name" => $_POST["last_name"],  "otc" => $_POST["otc"],  "login" => $_POST["login"],  "password" => $_POST["password"],  "group_user_id" => $_POST["group_user_id"]));
        $sql = "SELECT id from users where login=:login;
               ";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_POST["login"]));
        $Q = $q->fetchAll();
        return array("id" => $Q[0][0]);
        
    }
    function get_users_groups(){
         $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q1 = $q->fetchAll();
        $data = array("users" => $Q, "group_users" => $Q1);
        $result = '<select class="form-control form-control-sm role" id = "role">';
        foreach ($data["group_users"] as $row) {
          $result .="<option value=" . $row["group_id"] . " ";
          if ($_GET['group_user_id'] == $row["group_id"]) {
            $result .= "selected";
          } $result .= ">" . $row["descr"] . "</option>";
        }
        $result .= "</select>";
        return $result;
    }
    function delete_user(){
        $sql = "DELETE FROM users WHERE id=:id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id" => $_POST["id"]));
        return array("response" => 200);
    }
    function progressbar(){
        $sql = "SELECT u.FIRST_NAME, u.LAST_NAME, u.OTC, l.operation_id, l.type, l.field, l.text, date_trunc('seconds',l.date_create) as date_create
                FROM logs l LEFT JOIN
                users u on l.login = u.login";
        $q =  sys::$PDO->prepare($sql);
        $q->execute();
        return $q->fetchAll();
    }
}
