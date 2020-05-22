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

    public function get_change_users() {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            $Q = $q->fetchAll();
            return array("users" => $Q);
        } else {
        return array("response" => "NOT FOUND GET REQUEST");
        }
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
        
        $sql = "DELETE FROM LOGS";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM CHAT";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM ROUTE";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM ROUTE_MAP_1_2";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM ROUTE_MAP_3";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM TECHPROCESS";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM production_task_1_2";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "DELETE FROM production_task_3";
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
        $sql = "UPDATE DRAWING_SIZE SET drawing_name = 'scheme', size_1 = default, size_2 = default, size_3 = default";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        $sql = "UPDATE users_tasks SET isFinished = 0 WHERE active_sign = 1";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        
        return array("round" => 1);
    }

    function pdm_edit() {
        $sql = "SELECT id, model_name FROM PRODUCT ORDER BY id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        return $q->fetchAll();
    }
    
    function get_pdm_edit() {
        $sql = "SELECT p.model_name, p.path_3d, p.description, t.type, t.id as type_id FROM PRODUCT as p LEFT JOIN
                product_type as t on t.id = p.type_id
                WHERE p.id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id" => $_REQUEST["id"]));
        $Q = $q->fetchAll();
        $product = $Q[0];
        $sql = "SELECT id, type FROM product_type"; 
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $type = $q->fetchAll();
        $type_options = "";
        foreach ($type as $row) {
            $type_options.= '<option value="'.$row["id"].'" ';
            if($row["id"] == $product["type_id"])
            {
                $type_options.='selected';
            }
            $type_options.= ' >'.$row["type"].'</option>';
        }
            $result = ' <div class="row">
                        <div class="col-2">Название</div> 
                        <div class="col-3"><input class="form-control form-control-sm" id = "model_name" value="'.$product["model_name"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Путь к 3Д модели</div>
                        <div class="col-3"><textarea class="form-control form-control-sm" id = "path_3d" rows = "3">'.$product["path_3d"].'</textarea></div></div>
                        <div class="row">
                        <div class="col-2">Описание</div>    
                        <div class="col-3"><input class="form-control form-control-sm" id = "description" value="'.$product["description"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Тип детали </div>    
                        <div class="col-3"><select class="form-control form-control-sm" id = "type">'.$type_options.'</select></div></div>
                        <button type="submit" class="btn btn-secondary" id="pdm_save">Сохранить</button>';
        return $result;
    }
    
    function save_pdm_edit(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $sql = "UPDATE PRODUCT SET model_name = :model_name, path_3d = :path_3d, description = :description, type_id = :type_id WHERE id = :id";
            $q = sys::$PDO->prepare($sql);
            $q->execute(array("model_name" => $_POST["model_name"], "path_3d" => $_POST["path_3d"], "description" => $_POST["description"], "type_id" => $_POST["type_id"], "id" => $_POST["id"])); 
            return array("response" => 200);
        }else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
    
    function esi_edit() {
        $sql = "SELECT id, name FROM PRODUCTS_ESI ORDER BY id";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        return $q->fetchAll();
    }
    
    function get_esi_edit() {
        $sql = "SELECT id, name, designation, position, path_3d, path_picture, number, type_id
                FROM PRODUCTS_ESI
                WHERE id = :id";
        $q = sys::$PDO->prepare($sql);
        $q->execute(array("id" => $_REQUEST["id"]));
        $Q = $q->fetchAll();
        $product = $Q[0];
        $sql = "SELECT id, type FROM esi_type"; 
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $type = $q->fetchAll();
        $type_options = "";
        $dop_option = "<option selected></option>";
        foreach ($type as $row) {
            $type_options.= '<option value="'.$row["id"].'" ';
            if($row["id"] == $product["type_id"])
            {
                $type_options.='selected';
                $dop_option = "";
            }
            $type_options.= ' >'.$row["type"].'</option>';
        }
        $type_options .= $dop_option;
            $result = ' <div class="row">
                        <div class="col-2">Название</div> 
                        <div class="col-3"><input class="form-control form-control-sm" id = "name" value="'.$product["name"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Описание</div>
                        <div class="col-3"><input class="form-control form-control-sm" id = "designation" value="'.$product["designation"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Позиция</div>    
                        <div class="col-3"><input class="form-control form-control-sm" id = "position" value="'.$product["position"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Количество</div>    
                        <div class="col-3"><input class="form-control form-control-sm" id = "number" value="'.$product["number"].'"></div></div>
                        <div class="row">
                        <div class="col-2">Тип детали </div>    
                        <div class="col-3"><select class="form-control form-control-sm" id = "type">'.$type_options.'</select></div></div>
                        <div class="row">
                        <div class="col-2">Путь к 3Д модели</div>
                        <div class="col-3"><textarea class="form-control form-control-sm" id = "path_3d" rows = "3">'.$product["path_3d"].'</textarea></div></div>
                        <div class="row">
                        <div class="col-2">Путь к изображению</div>
                        <div class="col-3"><textarea class="form-control form-control-sm" id = "path_picture" rows = "3">'.$product["path_picture"].'</textarea></div></div>
                        <div class="row">
                        <div class="col-2">Выберите модель (.stl)</div>
                        <div class="col-3"><input id="file" type="file" accept=".stl"></div></div>
                        <button type="submit" class="btn btn-secondary" id="esi_save">Сохранить</button>';
        return $result;
    }
    function save_esi_edit(){
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if($_POST["number"] == "") $_POST["number"] = "null";
            $sql = "UPDATE PRODUCTS_ESI SET name = '".$_POST["name"]."', designation = '".$_POST["designation"]."', position = ".$_POST["position"].", path_3d = '".$_POST["path_3d"]."', path_picture = '".$_POST["path_picture"]."', number = ".$_POST["number"].", type_id = ".$_POST["type_id"]." WHERE id = ".$_POST["id"];
            $q = sys::$PDO->prepare($sql);
            $q->execute(); 
            echo $sql;
            return array("response" => 200);
        }else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
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
//        function get_array_from_string($string){
//           $string = trim($string,' ');
//           $res = explode(',', $string);
//           $result = array();
//           foreach($res as $row){
//               array_push($result,array("name"=>$row));
//           }
//           return $result;
//        }
//       $sql = "SELECT f.id as first_id, s.id as second_id, f.NAME as name, s.NAME as child_name, t.id as third_id, t.FIELDS
//FROM technologist_info_3_layout as t left join
//technologist_info_2_layout as s on s.id = t.id_2_layout left join
//technologist_info_1_layout as f on f.id = t.id_1_layout
//ORDER BY third_id"; 
//       $q = sys::$PDO->prepare($sql);
//       $q->execute();
//       $Q = $q->fetchAll();
//       $name = "";
//       $child_name = "";
//       $result = array();
//       $i = -1;
//       $j = 0;
//       foreach($Q as $row){
//           if($name != $row["name"]){
//               $j = 0;
//               $name = $row["name"];
//               array_push($result,array("name"=>$name, "lvl"=>1, "id"=>$row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields" => array(array("name" => $row["fields"], "lvl" => 3, "id" => $row["third_id"]))))));
//               $child_name = $row["child_name"];
//               $i++;
//           }else{
//               if($child_name != $row["child_name"])
//               {
//                   $child_name = $row["child_name"];
//                   array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "fields"=>array(array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]))));
//                   $j++;  
//               }
//               else{
//                   array_push($result[$i]["children"][$j]["fields"], array("name"=>$row["fields"], "lvl" => 3, "id" => $row["third_id"]));
//               }      
//           }
//       }
      
        $sql = "SELECT id, name
                FROM technologist_info_1_layout where active_sign = true";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $lay_1 = $q->fetchAll();
        
        $sql = "SELECT id, name
                FROM technologist_info_2_layout where active_sign = true";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $lay_2 = $q->fetchAll();
        $sql = "SELECT id, fields, id_1_layout, id_2_layout
                FROM technologist_info_3_layout where active_sign = true";
        $q = sys::$PDO->prepare($sql);
        $q->execute();
        $lay_3 = $q->fetchAll();
        $result["1_layout"] = $lay_1;
        $result["2_layout"] = $lay_2;
        $result["fields"] = $lay_3;
        
        
//        return $result;
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
    
    function tasks_edit(){
        
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
            <th style="width: 60px">
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
        $type = $row["type"];
        $typeClass = "fa-question";
        if ($type == "save"){
            $typeClass = "fa-save";
        }
        if ($type == "choose"){
            $typeClass = "fa-check-square";
        }
        if ($type == "unselect"){
            $typeClass = "fa-times-circle-o";
        }
        if ($type == "edit"){
            $typeClass = "fa-edit";
        }
        if ($type == "addNew"){
            $typeClass = "fa-plus";
        }
        if ($type == "delete"){
            $typeClass = "fa-minus";
        }
        if ($type == "rowToEdit"){
            $typeClass = "fa-unlock";
        }
        if ($type == "rowToRo"){
            $typeClass = "fa-lock";
        }
        if ($type == "open"){
            $typeClass = "fa-folder";
        }
        if ($type == "clear"){
            $typeClass = "fa-trash-o";
        }
        if ($type == "move"){
            $typeClass = "fa-arrows";
        }
        if ($type == "signIn"){
            $typeClass = "fa-sign-in";
        }
        if ($type == "approve"){
            $typeClass = "fa-check";
        }
        if ($type == "cancel"){
            $typeClass = "fa-times";
        }
        if ($type == "success"){
            $typeClass = "fa-check-circle text-success";
        }
        if ($type == "inProcess"){
            $typeClass = "fa-spinner";
        }
        if ($type == "check"){
            $typeClass = "fa-check";
        }
        if ($type == "print"){
            $typeClass = "fa-print";
        }
        if ($type == "signOut"){
            $typeClass = "fa-sign-out";
        }

        $response .= '<tr>
            <td>
                <div class="font-family-fontAwesome '.$typeClass.'"></div>
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
