<?php
// config some dir
//
class conf{
  static $ROOT;
  static $PROJECT_NAME;
  static $SITE_URL;
  static $SITE_URL_SHORT;
  static $SITE_PATH;
  static $SITE_NAME;
  static $SESSION_TIME;
  static $DB_SERVER_NAME;
  static $DB_NAME;
  static $DB_USER_NAME;
  static $DB_PASSWORD;
  static $SITE_LOCAL;
  static $SITE_SUBDIR_INDEX;  // вложенность сайта - количество дополнительных поддиректорий
  static $DB_NAME_ABIT;  // БД Абитуриент.Бак - для импорта
  static $YEAR_SMALL_ABIT;  // Год для импорта лицевого счета
  static $DB_NAME_ABIT_MAG;  // БД Абитуриент.Маг - для импорта
  static $YEAR_SMALL_ABIT_MAG;  // Год для импорта лицевого счета
  static $DB_NAME_DECANAT;  // БД Деканат.Бак - для импорта
  static $DB_NAME_DECANAT_MAG;  // БД Деканат.Маг - для импорта
  static $VERSION; // Версия - используется для принудительного предотвращения кэширования js,css
}

conf::$VERSION = 2;  // Устанавливается в system.php вызовом sys::version()

conf::$SITE_NAME = 'Мотивированный абитуриент';
conf::$PROJECT_NAME = 'niiis';
conf::$SITE_URL_SHORT = $_SERVER['SERVER_NAME'];
conf::$SITE_PATH = dirname(__FILE__).DIRECTORY_SEPARATOR.'../';
conf::$SESSION_TIME = 2592000;
ini_set("memory_limit", "200M");  // для экспорта надо много

if(trim($_SERVER['SERVER_NAME'],'/') === 'abitprof.nntu.ru'){
  conf::$ROOT = rtrim($_SERVER['DOCUMENT_ROOT'],'/').'/';
  conf::$SITE_URL = 'https://'.$_SERVER['SERVER_NAME'].'/';
  conf::$DB_SERVER_NAME='127.0.0.1';
  conf::$DB_NAME='niiis';
  conf::$DB_USER_NAME='dmitry';
  conf::$DB_PASSWORD='ubvyfpbz50';
  conf::$SITE_LOCAL=false;
  conf::$SITE_SUBDIR_INDEX=0; // например http://site.ru/ - 0
  error_reporting(0);
}else{
  conf::$ROOT = rtrim($_SERVER['DOCUMENT_ROOT'],'/').'/';
  conf::$SITE_URL = 'http://'.$_SERVER['SERVER_NAME'].'/';
  conf::$DB_SERVER_NAME='127.0.0.1';
  conf::$DB_NAME='niiis';
  conf::$DB_USER_NAME='dmitry';
  conf::$DB_PASSWORD='ubvyfpbz50';
  conf::$SITE_LOCAL=true;
  conf::$SITE_SUBDIR_INDEX=0; // например http://site.ru/nntu/abit/ - 2
  error_reporting(E_ALL);
  ini_set( 'display_errors', 1 );
}
