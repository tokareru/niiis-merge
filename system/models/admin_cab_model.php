<?php
class admin_cab_model extends model 
{
  public function get_data() 
  {
    $data = array();
    $data['title'] = conf::$SITE_NAME;
    $data['content'] = self::content();
    return $data;
  }
  function content(){
      $sql = "SELECT * FROM USERS WHERE group_user_id <> 99 ORDER BY id";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q = $q->fetchAll();
      $sql = "SELECT * FROM USER_GROUP WHERE group_id <> 99";
      $q = sys::$PDO->prepare($sql);
      $q->execute();
      $Q1 = $q->fetchAll();
      return array("users" => $Q, "group_users" => $Q1, "page"=>"users");
  }
  function change_users(){
      
  }
  function reset(){
    $sql = "DELETE FROM SPEC_TABLE";
    $q = sys::$PDO->prepare($sql);
    $q->execute();
    $Q = $q->fetchAll();
    $sql = "UPDATE DRAWING_MAIN_TEXT SET ";
    for($i = 1; $i <= 50; $i++){
        if($i == 1){
            $sql.= "field$i = ''";
        }else{
            $sql.= ", field$i = ''";
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
    return array("round"=>1);
  }
  function pdm_edit(){
      return array("content"=>array("page"=>"pdm_edit"));
  }
  function technologist_guide_edit(){
      function get_array_from_string($string){
           $string = trim($string,' ');
           $res = explode(',', $string);
           $result = array();
           foreach($res as $row){
               array_push($result,array("name"=>$row));
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
       foreach($Q as $row){
           if($name != $row["name"]){
               $i++;
               $name = $row["name"];
               $result[$i] = array("name"=>$name, "lvl"=>1, "id"=>$row["first_id"], "children" => array(array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "tools"=>get_array_from_string($row["tools"]), "equipment" => get_array_from_string($row["equipment"]))));
               
           }else{
               array_push($result[$i]["children"], array("name" => $row["child_name"], "lvl"=>2, "id" => $row["second_id"], "tools"=>array(array("name"=>$row["tools"])), "equipment" => array(array("name"=>$row["equipment"]))));
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
                $q->execute(array("id"=>$row["id"],"name" => $row["name"]));
            }
            $sql = "DELETE FROM technologist_info_2_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($save["layout2"] as $row) {
                $sql = "INSERT INTO technologist_info_2_layout (id, id_1_layout, name)
                     VALUES(:id,:parent_id, :name)";
                $q = sys::$PDO->prepare($sql);
                $q->execute(array("id"=>$row["id"],"parent_id"=>$row["parent"],"name" => $row["name"]));
            }
            $i = 0;
             $sql = "DELETE FROM technologist_info_3_layout";
            $q = sys::$PDO->prepare($sql);
            $q->execute();
            foreach ($save["layout3"]["tools"] as $row) {
                    $sql = "INSERT INTO technologist_info_3_layout (id, id_2_layout, equipment, tools)
                         VALUES(:id, :id_layout,:equipment, :tools)";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("id"=>$i+1,"id_layout"=>$row["parent"],"equipment"=>$save["layout3"]["equipment"][$i++]["name"],"tools" => $row["name"]));
            }
        } else {
            return array("response" => "NOT FOUND POST REQUEST");
        }
    }
}
