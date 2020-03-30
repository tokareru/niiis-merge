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
        $sql = "DELETE FROM CHAT";
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

//        function get_array_from_string($string) {
//            $string = trim($string, ' ');
//            $res = explode(',', $string);
//            $result = array();
//            foreach ($res as $row) {
//                array_push($result, array("name" => $row));
//            }
//            return $result;
//        }

        $sql = "SELECT id, name
                FROM technologist_info_1_layout";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q = $q->fetchAll();
        $sql = "SELECT id, name
                FROM technologist_info_2_layout where active_sign = '1'";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $Q1 = $q->fetchAll();
        $sql = "SELECT id, fields
                FROM technologist_info_3_layout where active_sign = '1' and id_1_layout = :id1 and id_2_layout = :id2";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id1"=>$Q[0]["id"], "id2" => $Q1[0]["id"]));
        $Q2 = $q->fetchAll();
        $result["1_layout"] = $Q;
        $result["2_layout"] = $Q1;
        $result["fields"] = $Q2;
        return $result;
    }
    
    function get_fields (){
        $sql = "SELECT id, fields
                FROM technologist_info_3_layout where active_sign = '1' and id_1_layout = :id1 and id_2_layout = :id2";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id1"=>$_REQUEST["id1"], "id2" => $_REQUEST["id2"]));
        $Q = $q->fetchAll();
        $result = "";
        foreach($Q as $row){
            $result.= '<div class="row"><div class="col-3">'
            .'<input class="form-control" id="'.$row["id"].'" value="'.$row["fields"].'" />'
            .'</div></div>';
        }
        return $result;
    }
    
    function get_technologist_info(){
        function get_array_from_string($string){
           $string = trim($string,' ');
           $res = explode(',', $string);
           $result = array();
           foreach($res as $row){
               array_push($result,array("name"=>$row));
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
       foreach($Q as $row){
           if($name != $row["name"]){
               $j = 0;
               $name = $row["name"];
               array_push($result,array("name"=>$name, "lvl"=>1, "id"=>$row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields" => array(array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]))))));
               $child_name = $row["child_name"];
               $i++;
           }else{
               if($child_name != $row["child_name"])
               {
                   $child_name = $row["child_name"];
                   array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields"=>array(array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]))));
                   $j++;  
               }
               else{
                   array_push($result[$i]["children"][$j]["fields"], array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]));
               }      
           }
       }
       return $result;
    }
    
    function save_technologist_info() {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "DELETE FROM technologist_info_3_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $i = 1;
            echo $_POST["data"];
            foreach ($_POST["data"] as $row) {
                echo "a";
                $sql = "INSERT INTO technologist_info_3_layout (id, id_1_layout, id_2_layout, fields)
                         VALUES (".$i++." ,:id_1, :id_2, :fields)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("id_1" => $row["id1"], "id_2" => $row["id2"], "fields" => $row["name"]));
                print($sql);
            }
            return array("response" => 200);
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
        $sql = "SELECT FIRST_NAME, LAST_NAME, OTC, LOGIN
                FROM users
                WHERE active_sign = true and group_user_id <> 99";
        $q =  sys::$PDO->prepare($sql);
        $q->execute();
        return $q->fetchAll();
    }
    function get_logs(){
        $sql = "SELECT operation_id, type, field, text, date_trunc('seconds',date_create) as date_create
                FROM logs
                WHERE login = :login";
        $q =  sys::$PDO->prepare($sql);
        $q->execute(array("login" => $_REQUEST["login"]));
        $data = $q->fetchAll();
        $response = '<table class="table table-bordered table-condensed table-hover table-sm">
        <thead>
        <tr>
            <th>
                id операции
            </th>
            <th>
                Тип операции
            </th>
            <th>
                Вкладка операции
            </th>
            <th>
                Текст операции
            </th>
            <th>
                Дата операции
            </th>
        </tr>
        </thead>
        <tbody>';
        foreach($data as $row){
        $response .= '<tr>
            <td>
                '.$row["operation_id"].'
            </td>
            <td>
                '.$row["type"].'
            </td>
            <td>
                '.$row["field"].'
            </td>
            <td>
                '.$row["text"].'
            </td>
            <td>
                '.sys::strtodatetime($row["date_create"]).'
            </td> 
        </tr>
        ';
        
        }
        $response.= '</tbody>
        </table>';
        return $response;
    }
}
