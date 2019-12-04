<?php

class sys {

  static $mysqli, $mssql_link,$PDO;

  
  static function db_connect($db_host, $user, $password, $db) {

    sys::$mssql_link = $dbconn3 = pg_connect("host=82.146.41.218 port=5432 dbname=niiis user=dmitry password=ubvyfpbz50");
    if (!sys::$mssql_link) {
      throw new Exception("Failed to connect to database");
    }
    
    $PDO = new PDO("pgsql:host='82.146.41.218';dbname=$db", "dmitry", "ubvyfpbz50");
    sys::$PDO=$PDO;
  }

  static function db_disconnect() {
    mssql_close();
  }

  //Проверка авторизации пользователя
  static function is_autorised() {
    if (isset($_SESSION['niiis']['user_id'])){
      return true;
    }else{
      return false;
    }
  }

  static function secure($text) {
//       return str_replace("'", "''",$text);
    return str_replace("'", "''", str_replace('%', '[%]', str_replace('_', '[_]', $text)));
//       return mysql_real_escape_string($text);
  }

  //Авторизация пользователя
  static function autorization($name, $password, $is) {
    //Проверяем наличие такого пользователя с email
    $SQL = "SELECT 
            ug.DESCR, u.ID,ug.USER_STATUS
            FROM USERS AS u 
            inner join USER_GROUP ug on ug.GROUP_ID=u.GROUP_USER_ID
            where u.LOGIN=:login and u.PASSWORD=:password and u.ACTIVE_SIGN='1'";
    $R = array('result' => '0');
    $autorization = '';
    $ip = $_SERVER['REMOTE_ADDR'];
    $q = sys::$PDO->prepare($SQL);
    $q->execute(array('login'=>sys::secure($name),'password'=>sys::secure($password)));
    $result = $q->fetchAll();
    
    if ($result) {
      // нашли юзера с заданным логином, паролем

        $row = $result[0];
        $_SESSION['niiis']['user_id'] = (int) $row['id'];
        $_SESSION['niiis']['user_status'] = $row['user_status'];
        $_SESSION['niiis']['is'] = $is;
        $_SESSION['niiis']['round'] = 1;
        $_SESSION['niiis']['role'] = $row['user_status'];
        $_SESSION['niiis']['name'] = $row['descr'];
      
      
      // если admin, можем менять пользователей не делая relogin
      // В остальных случаях не использовать $_SESSION['hostel']['is_super_admin'] !
      // для проверки принадлежности к админу, а использовать sys::user_group()
      if($row['user_status']==='administrator'){
        sys::session_set('is_super_admin', 1, false);
      }else{
        sys::session_set('is_super_admin', 0, false);
      }
     
      // --если admin, можем менять пользователей не делая relogin
      
      $R = array('result' => '1');
    } else {
      $R = array('result' => '0');
    }

    return $R;
  }

  static function check_ip($ip, $mask) {
    $re = ' {^ ( (\*|\d+).(\*|\d+).(\*|\d+).(\*|\d+) )$ }xs';
    preg_match($re, $ip, $IP_us);
    preg_match($re, $mask, $IP_db);

    for ($k = 2; $k < 6; $k++)
      if ($IP_db[$k] == '*')
        $IP_db[$k] = $IP_us[$k];

    if ($IP_us[2] == $IP_db[2] && $IP_us[3] == $IP_db[3] && $IP_us[4] == $IP_db[4] && $IP_us[5] == $IP_db[5]) // Проверка на совпадение IP
      return true;
    else
      return false;
  }
 

  static function generate($type = 'salt') {
    $uniq = false;
    while (!$uniq) {
      $arr = array('q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
          'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
          'z', 'x', 'c', 'v', 'b', 'n', 'm',
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
      $salt = '';
      for ($i = 0; $i < 20; $i++) {
        $index = rand(0, count($arr) - 1);
        $salt .= $arr[$index];
      }
      switch ($type) {
        case 'salt':
          $SQL = "SELECT count(*) FROM users WHERE password_s='" . $salt . "'";
          break;
        case 'email':
          $SQL = "SELECT count(*) FROM users WHERE email_activation_string='" . $salt . "'";
          break;
        case 'session':
          $SQL = "SELECT count(*) FROM sessions WHERE hash='" . $salt . "'";
          break;
      }
      sys::$mysqli->real_query($SQL);
      $result = sys::$mysqli->store_result();
      $result = $result->fetch_row();
      if ($result[0] === '0')
        $uniq = true;
    }
    return $salt;
  }

  /**
   * Возвращает true, если файл с данным id загружен на сервер
   * @param type $id номер файла
   */
  static function check_user_file($user, $id) {
    $ank_id = (int) $user;
    $file_id = (int) $id;
    $target_dir = "registration/uploads/";
    $target_file = $target_dir . $ank_id . '_' . $file_id . '.jpg';
    return file_exists($target_file);
  }
  
  /**
  * Возвращает login текущего юзера
  * @return string
  */
  static function user_login() {
  $R = '';
  if (isset($_SESSION['niiis']['user_id'])) {
    $id = (int) $_SESSION['niiis']['user_id'];
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

  /**
  * Создаёт option теги из таблицы-справочиника
  * @param string $table_name имя таблицы-справочника
  * @param string $index_name название поля, в котором содержится код строки
  * @param string $text_name названием поля, в котором содержится описание строки
  * @param int $select_id id, у которого будет статус selected (не обязательно)
  * @parap string $where условие выборки (не обязательно)
  * @return string Список из option тегов для вставки в select
  */
  static function table2select($table_name, $index_name, $text_name, $select_id = 0, $where = '', $order = '') {
    if ($where !== '') {
      $where = "WHERE " . $where;
    }
    if ($order !== '') {
      $order = " ORDER BY " . $order;
    }
    $rows = mssql_query("SELECT $index_name, $text_name FROM $table_name " . $where . $order);
    $return = '';
    if (empty($select_id))
      $return .= "<option></option>\r\n";
    while ($row = mssql_fetch_row($rows)) {
      if ($select_id != 0 && $select_id === $row[0]) {
        $return.="<option value='$row[0]' selected>$row[1]</option>\r\n";
      } else {
        $return.="<option value='$row[0]'>$row[1]</option>\r\n";
      }
    }
    return $return;
  }

  /**
  * Создаёт option теги из таблицы-справочиника + тэг "Все"
  * @param string $table_name имя таблицы-справочника
  * @param string $index_name название поля, в котором содержится код строки
  * @param string $text_name названием поля, в котором содержится описание строки
  * @param int $select_id id, у которого будет статус selected (не обязательно)
  * @parap string $where условие выборки (не обязательно)
  * @return string Список из option тегов для вставки в select
  */
  static function table2select_with_all($table_name, $index_name, $text_name, $select_id = 0, $where = '',$order = '') {
    if ($where !== '') {
      $where = "WHERE " . $where;
    }
    if ($order !== '') {
      $order = " ORDER BY " . $order;
    }
   //  return "SELECT $index_name, $text_name FROM $table_name " . $where . $order;
    $rows = mssql_query("SELECT $index_name, $text_name FROM $table_name " . $where . $order);
    $return = '';
    $return .= '<option value="0">Все</option>';
    while ($row = mssql_fetch_row($rows)) {
      if ($select_id === $row[0]) {
        $return.="<option value='$row[0]' selected>$row[1]</option>\r\n";
      } else {
        $return.="<option value='$row[0]'>$row[1]</option>\r\n";
      }
    }
    return $return;
  }

  /**
  * Создаёт option теги из таблицы-справочиника + пустой тэг "" - значение не выбрано
  * @param string $table_name имя таблицы-справочника
  * @param string $index_name название поля, в котором содержится код строки
  * @param string $text_name названием поля, в котором содержится описание строки
  * @param int $select_id id, у которого будет статус selected (не обязательно)
  * @parap string $where условие выборки (не обязательно)
  * @return string Список из option тегов для вставки в select
  */
  static function table2select_with_no($table_name, $index_name, $text_name, $select_id = 0, $where = '',$order = '') {
    if ($where !== '') {
      $where = "WHERE " . $where;
    }
    if ($order !== '') {
      $order = " ORDER BY " . $order;
    }
   //  return "SELECT $index_name, $text_name FROM $table_name " . $where . $order;
    $rows = mssql_query("SELECT $index_name, $text_name FROM $table_name " . $where . $order);
    $return = '';
    $return .= '<option value="0"></option>';
    while ($row = mssql_fetch_row($rows)) {
      if ($select_id === $row[0]) {
        $return.="<option value='$row[0]' selected>$row[1]</option>\r\n";
      } else {
        $return.="<option value='$row[0]'>$row[1]</option>\r\n";
      }
    }
    return $return;
  }

  /**
  * Для меню
  * @return type
  */
  static function konkurs_categ(){
    // Виды Мероприятий
    $sql = "SELECT  KONK_CATEG_ID,KONK_CATEG
            FROM    KONKURS_CATEG
            WHERE   ACTIVE_SIGN=1
            ";
    $result = mssql_query($sql);
    // --Виды Мероприятий

    return $result;
  }
  
  /**
   * Установка переменных сессии
   * Если есть n_token сессии и $cookie_set=true, сохраняем сессию в базу и обновляем n_token
   * @param type $var
   * @param type $val
   * @param type $cookie_set
   */
  static function session_set($var,$val,$cookie_set=true){
    $_SESSION['niiis'][$var]=$val;

    if($cookie_set && isset($_COOKIE['n_token'])){
      // Установим куки
      sys::cookie_set();
    }
  }
  
  static function cookie_set(){
    $user_id=(int)sys::session('user_id');
//      $is_super_user=empty(sys::session('is_super_admin'))?0:1;
    if(!empty($user_id)){
      $expire=time()+conf::$SESSION_TIME;
      $token=hash('sha256', $user_id.microtime());
      $ip=$_SERVER['REMOTE_ADDR'];
      $agent=mb_substr($_SERVER['HTTP_USER_AGENT'],0,1000);

      $session='';
      $i=0;
      foreach($_SESSION['niiis'] as $k=>$v){
        if($i++ !== 0){$session.=",";}
        $session.="$k=$v";
      }

      $sql="update user_session set active=0 where user_id=:user_id and site=:site and ip=:ip and agent=:agent";
      $q=sys::$PDO->prepare($sql);
      $q->execute(array('user_id'=>$user_id,'site'=>conf::$SITE_URL_SHORT,'ip'=>$ip,'agent'=>$agent));

      $sql="insert into user_session (user_id,token,ip,session,agent,date_create,active,site) values (:user_id,:token,:ip,:session,:agent,getdate(),1,:site)";
      $q=sys::$PDO->prepare($sql);
      $q->execute(array('user_id'=>$user_id,'token'=>$token,'ip'=>$ip,'session'=>$session,'agent'=>$agent,'site'=>conf::$SITE_URL_SHORT));

      setcookie('n_token', $token, $expire, $path='/', $domain='', $secure=false, $httponly=true);
    }
  }
  
  static function cookie_reset(){
    setcookie('n_token', '', strtotime('01.01.2000'), $path='/', $domain='');
  }
  
  static function session($var){
    if(isset($_SESSION['niiis'][$var])){
      return $_SESSION['niiis'][$var];
    }else{
      return FALSE;
    }
  }
  
  /**
   * Находится ли текущий пользователь в одной из групп, переданных в $groups
   * @param string $groups Группы через запятую
   * @return boolean
   */
  static function user_in_group($groups){
    $R=false;
    
    $Groups=explode(',',$groups);
    
    $UG=sys::user_group();  // Массив с правами пользователя
    
    foreach($Groups as $group){
      if(isset($UG[$group])){
        $R=true;
        break;
      }
    }
    return $R;
  }
  
  //Проверка на супер админа
  static function is_super_admin(){
    if (!empty(sys::session('is_super_admin'))){
      return true;
    }
    else{
      return false;
    }
  }
  
  /**
   * Возвращает массив статусов пользователя
   * Сейчас у каждого пользователя возможен только один статус, 
   * однако массив сделан на всякий случай на будущее, для более гибкой настройки
   * Возможные статусы: admin,user,reader
   * Таблица статусов: user_group
   * @return array Например: array['user']=true
   */
  static function user_group(){
    $R=array();
    $R[sys::session('user_status')]=true;
    return $R;
  }
  
  /**
   * Версия по времени изменения файла для предотвращения кэширования
   * @return string 4 последних символа (секунды) 
   */
  static function version(){
    $version='';
    $filename=conf::$SITE_PATH.'.deployment';
    if(file_exists($filename)){
      $filetime=filemtime ( $filename );
      $version=substr($filetime, -4);
    }
    
    return $version;
  }
  static function strtodatetime($str){
//      return date('d.m.Y H:m', strtotime($str));
       $date = explode("-", $str);
       $time = explode(' ',$date[2])[1];
       $date[2] =  explode(' ',$date[2])[0];
       $time = explode(':',$time);
       $datetime = $date[2].'.'.$date[1].'.'.$date[0].' '.$time[0].':'.$time[1];
       return $datetime;
  }
  
  /**
   * Функция возвращает строку для инклуда файла предотвращая кэширование
   * необходимо передать тип файла, css или javascript
   * и путь файла от корневой директории
   */
  static function inc_no_cache($type, $path){
      if($type == 'css'){
          echo '<link href="'.conf::$SITE_URL.$path.'?'.rand(1,999999).'" rel="stylesheet" type="text/css">';
      } else if($type == 'javascript'){
          echo '<script src="'.conf::$SITE_URL.$path.'?'.rand(1,999999).'" type="text/javascript"></script>';
      }
  }
}

