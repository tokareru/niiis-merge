<?php
class start_ajax_model extends model 
{
  public function get_data() 
  {
    if($_SERVER["REQUEST_METHOD"]=="GET"){
        $sql = "SELECT * FROM SYSTEM_CONF";
         $q = sys::$PDO->prepare($sql);
          $q->execute();
          $Q = $q->fetchAll();
          $_SESSION["niiis"]["round"] = $Q[0]["round"];
            return array("login"=>sys::user_login(),"role"=>$_SESSION['niiis']['role'], "round"=>$Q[0]["round"],
                "server_name"=>trim($_SERVER['SERVER_NAME'],'/'),"name"=> $_SESSION['niiis']['name']   );
        }
        else {
            return array("response"=>"NOT FOUND GET REQUEST");
        }
       
  }
  function set_data(){
      if($_SERVER["REQUEST_METHOD"]=="GET"){
          $sql = "UPDATE SYSTEM_CONF SET round=:round";
          $q = sys::$PDO->prepare($sql);
          $q->execute(array("round" => $_GET["round"]));
          $_SESSION["niiis"]["round"] = $_GET['round'];
          return(array("response"=>200));
        }
        else {
            return array("response"=>"NOT FOUND GET REQUEST");
        }
  }
}
