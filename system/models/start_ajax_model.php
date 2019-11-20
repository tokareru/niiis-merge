<?php
class start_ajax_model extends model 
{
  public function get_data() 
  {
    if($_SERVER["REQUEST_METHOD"]=="GET"){
            return array("login"=>sys::user_login(),"role"=>$_SESSION['niiis']['role'], "round"=>$_SESSION['niiis']['round']);
        }
        else {
            return array("response"=>"NOT FOUND POST REQUEST");
        }
       
  }
}
