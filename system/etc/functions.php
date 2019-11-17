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

/**
 * Создаёт option теги из таблицы-справочиника
 * @param string $table_name имя таблицы-справочника
 * @param string $index_name название поля, в котором содержится код строки
 * @param string $text_name названием поля, в котором содержится описание строки
 * @param int $select_id id, у которого будет статус selected (не обязательно)
 * @parap string $where условие выборки (не обязательно)
 * @return string Список из option тегов для вставки в select
 */
function table2select($table_name, $index_name, $text_name, $select_id = 0, $where = '', $order = '') {
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
function table2select_with_all($table_name, $index_name, $text_name, $select_id = 0, $where = '',$order = '') {
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
function table2select_with_no($table_name, $index_name, $text_name, $select_id = 0, $where = '',$order = '') {
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
function konkurs_categ(){
  // Виды Мероприятий
  $sql = "SELECT  KONK_CATEG_ID,KONK_CATEG
          FROM    KONKURS_CATEG
          WHERE   ACTIVE_SIGN=1
          ";
  $result = mssql_query($sql);
  // --Виды Мероприятий
  
  return $result;
}
?>
