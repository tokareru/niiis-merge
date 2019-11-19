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
                            $sql = "SELECT * 
                                    FROM CHAT 
                                    WHERE ALL='1'
                                    limit :limit";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("limit" => $_POST["count_messages"]));
                            return $q->fetchAll();
                        case "DM":
                            $sql = "SELECT * 
                                    FROM CHAT 
                                    WHERE CUR_USER=:cur_user and USER_CHAT_WITH = :user_chat_with
                                    limit :limit";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("limit" => $_POST["count_messages"],
                                "cur_user" => $_POST["current_login"], "user_chat_with" => $_POST["login_user_chat_with"]));
                            return $q->fetchAll();
                    }
                    break;
                case "add_comment":
                    switch ($_POST["type"]) {
                        case "ALL":
                            $sql = "INSERT INTO CHAT(ALL,TIME,CUR_USER,COMMENT)
                                    VALUES(:all,:time,(select USER_ID from CHAT_USERS WHERE USER_NAME=:cur_user),:comment)";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("all"=>1, "time"=>$_POST["time"],
                                "cur_user"=>$_POST["current_login"], "comment" => $_POST["comment"]));
                            return array("response"=>200);
                        case "DM":
                             case "ALL":
                            $sql = "INSERT INTO CHAT(TIME,USER_CHAT_WITH,CUR_USER,COMMENT)
                                    VALUES(:time,(select USER_ID from CHAT_USERS WHERE USER_NAME=:user_chat_with),(select USER_ID from CHAT_USERS WHERE USER_NAME=:cur_user),:comment)";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("user_chat_with"=>$_POST["login_user_chat_with"], "time"=>$_POST["time"],
                                "cur_user"=>$_POST["current_login"], "comment" => $_POST["comment"]));
                            return array("response"=>200);
                    }
                    break;
                case "count_comments":
                    switch ($_POST["type"]) {
                        case "ALL":
                            $sql = "SELECT COUNT(*) as COUNT
                                    FROM CHAT";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute();
                            return $q->fetchAll();
                        case "DM":
                            $sql = "SELECT COUNT(*) as COUNT
                                    FROM CHAT
                                    WHERE CUR_USER=:cur_user and USER_CHAT_WITH = :user_chat_with";
                            $q = sys::$PDO->prepare($sql);
                            $q->execute(array("cur_user" => $_POST["current_login"], 
                                "user_chat_with" => $_POST["login_user_chat_with"]));
                            return $q->fetchAll();
                    }
                    break;
                case "login_users":
                    $sql = "SELECT LOGIN
                      FROM CHAT_USERS
                      WHERE LOGIN <> :login";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute(array("login" => $_POST["current_login"]));
                    return $q->fetchAll();
                case "count_users":
                    $sql = "SELECT COUNT(*) as COUNT
                      FROM CHAT_USERS";
                    $q = sys::$PDO->prepare($sql);
                    $q->execute();
                    return $q->fetchAll();
            }
        }
        else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
       
  }
}
