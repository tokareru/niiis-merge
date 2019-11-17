<?php
/**
 * Возвращает login текущего юзера
 * @return string
 */
function user_login() {
  $R = '';
  if (isset($_SESSION['abitprof']['user_id'])) {
    $id = (int) $_SESSION['abitprof']['user_id'];
    $sql="select LOGIN from USERS where ID=:id";
    $q = sys::$PDO->prepare($sql);
    $q->execute(array('id' => $id));
    $result=$q->fetchAll();
    if($result){
      $row=$result[0];
      $R=$row['login'];
    }
  }
  return $R;
}

?>
