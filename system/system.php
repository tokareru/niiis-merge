<?php
session_start();

require_once 'base/model.php';
require_once 'base/view.php';
require_once 'base/controller.php';

require_once 'site_configuration.php';
require_once 'system_functions.php';
require_once 'base/route.php';
// Версия для предотвращения кэширования
conf::$VERSION = sys::version();
try {
    //Подключаемся к БД
    sys::db_connect(conf::$DB_SERVER_NAME, conf::$DB_PORT, conf::$DB_USER_NAME, conf::$DB_PASSWORD, conf::$DB_NAME);
    
    //Роутинг запроса
    Route::start();
}
catch (Exception $e) {
    //Обработка исключений
    echo "<br />\r\nError: ".$e->getMessage();
}
?>