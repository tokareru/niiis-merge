<?php

class conf{
  static $ROOT;
  static $PROJECT_NAME;
  static $SITE_URL;
  static $SITE_URL_SHORT;
  static $SITE_PATH;
  static $SITE_NAME;
  static $SESSION_TIME;
  static $DB_SERVER_NAME;
  static $DB_PORT;
  static $DB_NAME;
  static $DB_USER_NAME;
  static $DB_PASSWORD;
  static $SITE_LOCAL;
  static $SITE_SUBDIR_INDEX;  // вложенность сайта - количество дополнительных поддиректорий
  static $YEAR_SMALL_ABIT;  // Год для импорта лицевого счета
  static $VERSION; // Версия - используется для принудительного предотвращения кэширования js,css
}

conf::$VERSION = 2;  // Устанавливается в system.php вызовом sys::version()
conf::$SITE_NAME = 'Цифровая фабрика ИТ-процессов';
conf::$PROJECT_NAME = 'niiis';
conf::$SITE_URL_SHORT = $_SERVER['SERVER_NAME'];
conf::$SITE_PATH = dirname(__FILE__).DIRECTORY_SEPARATOR.'../';
conf::$SESSION_TIME = 2592000;

conf::$ROOT = rtrim($_SERVER['DOCUMENT_ROOT'],'/').'/';
conf::$SITE_URL = 'http://'.$_SERVER['SERVER_NAME'].'/';
conf::$SITE_LOCAL=true;
conf::$SITE_SUBDIR_INDEX=0; // например http://site.ru/level1/level2/ - 2

conf::$DB_SERVER_NAME='62.109.26.219';
conf::$DB_PORT='5432';
conf::$DB_NAME='niiis';
conf::$DB_USER_NAME='site';
conf::$DB_PASSWORD='123qweasd';

error_reporting(0);
ini_set( 'display_errors', 1 );
ini_set("memory_limit", "200M");  // для экспорта надо много

