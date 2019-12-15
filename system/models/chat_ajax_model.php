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
                            $sql = "SELECT g.DESCR as login, date_trunc('minute',c.time) as time, c.comment 
                                    FROM CHAT c LEFT JOIN
                                    USERS u on c.cur_user = u.id inner join
                                    USER_GROUP g on g.group_id = u.group_user_id
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
                                $result[$i]["time"] = sys::strtodatetime($row["time"]);
                                
                                $i--;
                            }
                            ksort($result);
                            return $result;
                        case "DM":
                            $sql = "SELECT date_trunc('seconds',c.time) as time, c.comment, g.DESCR as login
                                    FROM CHAT c left join 
                                    USERS u on c.cur_user=u.id inner join
                                    USER_GROUP g on g.group_id = u.group_user_id
                                    WHERE CUR_USER in (select id from USERS WHERE LOGIN = :cur_user or LOGIN = :user_chat_with) and USER_CHAT_WITH in (select id from USERS WHERE LOGIN = :cur_user or LOGIN = :user_chat_with)
                                    Order BY c.time DESC
                                    limit :limit";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("limit" => $_POST["count_messages"],
                                "cur_user" => $_POST["current_login"], "user_chat_with" => $_POST["login_user_chat_with"]));
                            $Q = $q->fetchAll();
                            $result;
                            $result["response"] = 200;
                            $i = count($Q);
                            foreach($Q as $row){
                                $result[$i]["login"] = $row["login"];
                                $result[$i]["comment"] = $row["comment"];
                                $result[$i]["time"] = sys::strtodatetime($row["time"]);
                                $i--;
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
                            $Q = $q->fetchAll(); 
                            if($Q){
                            return(array("response"=>200));
                            }
                            else{
                                return array("response"=>"Unexecute request to db");
                            }
                        case "DM":
                             case "ALL":
                            if($_POST["current_login"] != $_POST["login_user_chat_with"]){
                                $sql = "INSERT INTO CHAT(USER_CHAT_WITH,CUR_USER,COMMENT)
                                        VALUES((select ID from USERS WHERE LOGIN=:user_chat_with),(select ID from USERS WHERE LOGIN=:cur_user),:comment)";
                                $q = sys::$PDO->prepare($sql);
                                $q->execute(array("user_chat_with"=>$_POST["login_user_chat_with"],
                                    "cur_user"=>$_POST["current_login"], "comment" => $_POST["comment"]));
                                $Q = $q->fetchAll(); 
                                if($Q){
                                return(array("response"=>200));
                                }
                                else{
                                    return array("response"=>"Unexecute request to db");
                                }
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
                                    WHERE CUR_USER in (select id from USERS WHERE LOGIN = :cur_user or LOGIN = :user_chat_with) and USER_CHAT_WITH in (select id from USERS WHERE LOGIN = :cur_user or LOGIN = :user_chat_with)";
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
                    $sql = "SELECT g.user_group_name, u.login, u.first_name, u.last_name, u.otc
                      FROM USER_GROUP g inner join 
                      USERS u on g.group_id = u.group_user_id
                      WHERE u.LOGIN <> :login and g.GROUP_ID <> 99";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("login" => $_POST["current_login"]));
                    $Q = $q->fetchAll();
                    $result;
                    $i = 1;
                    foreach($Q as $row){
                        $result["user".$i++] = array("login"=>$row["login"],"first_name"=>$row["first_name"],"last_name"=>$row["last_name"],"otc"=>$row["otc"],"role"=>$row["user_group_name"]);
                        
                    }
                    return $result;
                case "count_users":
                    $sql = "SELECT COUNT(*) as COUNT
                      FROM USERS
                      WHERE group_user_id <>99";
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
