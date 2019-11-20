<?php
class chat_ajax_model extends model 
{
  public function get_data() 
  {
    if($_SERVER["REQUEST_METHOD"]=="POST"){
        switch ($_POST["function"]) {
                case "print_comment":
                    switch ($_POST["type"]) {
                        case "ALL":
                            $sql = "SELECT u.login, c.time, c.comment 
                                    FROM CHAT c LEFT JOIN
                                         USERS u on c.cur_user = u.id
                                    WHERE ALL_CHAT='1'
                                    Order BY c.time DESC
                                    limit :limit";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("limit" => $_POST["count_messages"]));
                            $Q = $q->fetchAll();
                            $result;
                            $result["response"] = 200;
                            
                            $i = count($Q);
                            foreach($Q as $row){
                                $result[$i]["login"] = $row["login"];
                                $result[$i]["comment"] = $row["comment"];
                                $result[$i]["time"] = $row["time"];
                                $i--;
                            }
                            ksort($result);
                            return $result;
                        case "DM":
                            $sql = "SELECT time, comment
                                    FROM CHAT
                                    WHERE CUR_USER = (select id from USERS WHERE LOGIN = :cur_user) and USER_CHAT_WITH = (select id from USERS WHERE LOGIN = :user_chat_with)
                                    Order BY c.time DESC
                                    limit :limit";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("limit" => $_POST["count_messages"],
                                "cur_user" => $_POST["current_login"], "user_chat_with" => $_POST["login_user_chat_with"]));
                            $Q = $q->fetchAll();
                            $result;
                            $result["response"] = 200;
                            $i = 0;
                            foreach($Q as $row){
                                $result[$i]["login"] = $_POST["current_login"];
                                $result[$i]["comment"] = $row["comment"];
                                $result[$i]["time"] = $row["time"];
                                $i++;
                            }
                            ksort($result);
                            return $result;
                        default:
                            return array("response"=>"TYPE '".$_POST["type"]."' NOT FOUND");
                    }
                    break;
                case "add_comment":
                    switch ($_POST["type"]) {
                        case "ALL":
                            $sql = "INSERT INTO CHAT(ALL_CHAT,CUR_USER,COMMENT)
                                    VALUES(:all,(select ID from USERS WHERE LOGIN=:cur_user),:comment)";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("all"=>'1',"cur_user"=>$_POST["current_login"], "comment" => $_POST["comment"]));
                            return array("response"=>200);
                        case "DM":
                             case "ALL":
                            if($_POST["current_login"] == $_POST["login_user_chat_with"]){
                                $sql = "INSERT INTO CHAT(USER_CHAT_WITH,CUR_USER,COMMENT)
                                        VALUES((select ID from USERS WHERE LOGIN=:user_chat_with),(select ID from USERS WHERE LOGIN=:cur_user),:comment)";
                                $q = sys::$PDO->prepare($sql);
                                $q->execute(array("user_chat_with"=>$_POST["login_user_chat_with"],
                                    "cur_user"=>$_POST["current_login"], "comment" => $_POST["comment"]));
                                return array("response"=>200);
                            }else{
                                return array("response"=>"You can't sent messange by self");
                            }
                        default:
                            return array("response"=>"TYPE '".$_POST["type"]."' NOT FOUND");
                    }
                    break;
                case "count_comments":
                    switch ($_POST["type"]) {
                        case "ALL":
                            $sql = "SELECT COUNT(*) as COUNT
                                    FROM CHAT
                                    WHERE ALL_CHAT = '1'";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute();
                            $Q = $q->fetchAll();
                            return array("count"=>$Q[0]["count"]);
                        case "DM":
                            $sql = "SELECT COUNT(*) as COUNT
                                    FROM CHAT
                                    WHERE CUR_USER = (select id from USERS WHERE LOGIN = :cur_user) and USER_CHAT_WITH = (select id from USERS WHERE LOGIN = :user_chat_with)";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("cur_user" => $_POST["current_login"], 
                                "user_chat_with" => $_POST["login_user_chat_with"]));
                            $Q = $q->fetchAll();
                            return array("count"=>$Q[0]["count"]);
                        default:
                            return array("response"=>"TYPE '".$_POST["type"]."' NOT FOUND");
                    }
                    break;
                case "login_users":
                    $sql = "SELECT LOGIN
                      FROM USERS
                      WHERE LOGIN <> :login";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("login" => $_POST["current_login"]));
                    $Q = $q->fetchAll();
                    $result;
                    $i = 1;
                    foreach($Q as $row){
                        $result["login".$i++] = $row["login"];
                    }
                    return $result;
                case "count_users":
                    $sql = "SELECT COUNT(*) as COUNT
                      FROM USERS";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute();
                    $Q = $q->fetchAll();
                    return array("count"=>$Q[0]["count"]);
                default:
                    return array("response"=>"POST METHOD '".$_POST["function"]."' NOT FOUND");
            }
        }
        else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
       
  }
}
