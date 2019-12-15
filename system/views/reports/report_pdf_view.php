<?php 

define('FPDF_FONTPATH', conf::$ROOT.'system/etc/fpdf/font/');
require_once conf::$ROOT.'system/etc/fpdf/fpdf.php';
//require_once conf::$ROOT.'system/etc/fpdf/fpdf_extended.php';


// -----------------------------Подсчет данных----------------------------------
//$ank_id = $_POST['ank_id'];
//$dop_konk_dest = $_POST['dop_konk_dest'];
//
//$last_name = $data['last_name'];

//----------------------------------------------------------------------------------


// -------------------------формирование страницы PDF-------------------------------

$x=10;  // текущая координата X
$y=60;   // текущая координата Y
$dy=4;  // стандартное расстояние между строками
$w=180;  // ширина страницы
$wl=138;  // ширина левого поля
$wr=48;  // ширина правого поля
$border=0;  // рамка у всех выводимых полей, используется для отладки
$fs=11;  // Размер шрифта
$lh=6;  // Высота шрифта

$p = new FPDF('P','mm','A4');
$p->SetFont("Times", "", $fs);
$p->SetAutoPageBreak(0);

// метаданные
$p->SetAuthor("NIIIS"); 
$p->SetTitle("Report"); 
$p->SetSubject("ID"); 

$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->AddFont('timesbd', 'B', 'timesbd.php');
$p->AddFont('verdana', '', 'verdana.php');
$p->AddFont('arial_bold', '', 'arial_bold.php');

$y_headstr = 6;
$y_tabstr = 8;
$x_tabletab = 5;

$p->SetFont('timesbd', 'B', 11);
$p->SetXY(155, $y-5);

$p->Image('images/frame.jpg',0,0,-130);

$p->Output();

?>