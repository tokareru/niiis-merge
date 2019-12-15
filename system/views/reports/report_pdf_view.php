<?php 

define('FPDF_FONTPATH', conf::$ROOT.'system/etc/fpdf/font/');
require_once conf::$ROOT.'system/etc/fpdf/fpdf.php';
require_once conf::$ROOT.'system/etc/fpdf/fpdf_extended.php';


// -----------------------------Подсчет данных----------------------------------
//$ank_id = $_POST['ank_id'];
//$dop_konk_dest = $_POST['dop_konk_dest'];
//
//$last_name = $data['last_name'];
//$first_name = $data['first_name'];
//$otc = $data['otc'];
//$fio = $data['fio'];
//$bday = $data['bday'];
//$sch_name = $data['sch_name'];
//$sch_place = $data['sch_place'];
//$konk_result = $data['konk_result'];
//$dop_konk_result = $data['dop_konk_result'];
//$summ_id = $data['summ_id'];
//
//$red_cert = $data['red_cert'];
//$olymp_win = $data['olymp_win'];

//var_dump($konk_result);
//----------------------------------------------------------------------------------


// -------------------------формирование страницы PDF-------------------------------
//$GX = $data['X'];
//$GY = $data['Y'];
//$GX = 30;
//$GY = 5;
$x=10;  // текущая координата X
$y=60;   // текущая координата Y
$dy=4;  // стандартное расстояние между строками
$w=180;  // ширина страницы
$wl=138;  // ширина левого поля
$wr=48;  // ширина правого поля
$border=0;  // рамка у всех выводимых полей, используется для отладки
$fs=11;  // Размер шрифта
$lh=6;  // Высота шрифта

//$pdf = new PDF('P','mm','A4');
$p = new ExtPDF('P','mm','A4');
$p->SetFont("Times", "", $fs);
$p->SetAutoPageBreak(0);
//$p->SetGXY($GX, $GY);

// метаданные
$p->SetAuthor("NIIIS"); 
$p->SetTitle("Отчет"); 
$p->SetSubject("ID"); 
// ----------,

$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->AddFont('timesbd', 'B', 'timesbd.php');
$p->AddFont('verdana', '', 'verdana.php');
$p->AddFont('arial_bold', '', 'arial_bold.php');

$y_headstr = 6;
$y_tabstr = 8;
$x_tabletab = 5;


$p->SetFont('timesbd', 'B', 11);
$p->printL($p,30, $y, 'БЛАНК УЧЕТА ИНДИВИДУАЛЬНЫХ ДОСТИЖЕНИЙ');
$p->printL($p,160, $y, $dop_konk_dest);
$p->SetXY(155, $y-5);
$p->Cell(40, 10, '', 1);


$y+=10;

$p->SetFont('timesbd', 'B', 11);
$p->printL($p,18, $y, 'ФИО:');
$p->SetFont('times', '', 14);
$p->printL($p,33, $y, $fio);
$y+=6;

//$p->SetFont('timesbd', 'B', 11);
//$p->printL($p,15, $y, 'ДАТА РОЖДЕНИЯ:');
//$p->SetFont('times', '', 14);
//$p->printL($p,55, $y, $bday);
//$y+=6;

$p->SetFont('timesbd', 'B', 11);
$p->printL($p,15, $y, 'Школа:');
$p->SetFont('times', '', 14);
//$p->printL($p,33, $y, $sch_name);
$y+=6;

$p->SetFont('timesbd', 'B', 11);
$p->printL($p,17, $y, 'Город:');
$p->SetFont('times', '', 14);
//$p->printL($p,33, $y, $sch_place);

// Заголовок таблицы
$y+=8;
$header = array(array('№','НАИМЕНОВАНИЕ МЕРОПРИЯТИЯ', 'ГОД','БАЛЛ ИД'));

// Параметры
// положение начала колонки по по Х
$k1['x']=10;
$k2['x']=18;
$k3['x']=168;
$k4['x']=185;
// ширина колонки
$k1['w']=8;
$k2['w']=150;
$k3['w']=17;
$k4['w']=17;

$fs = 10;

// параметры для заголовка
$opts = array(array('x' => $k1['x'], 'y' => $y, 'w' => $k1['w'], 'a' => 'C', 'fs' => 9, 'h' => $lh),
              array('x' => $k2['x'], 'w' => $k2['w'], 'a' => 'C', 'fs' => 9, 'h' => $lh),
              array('x' => $k3['x'], 'w' => $k3['w'], 'a' => 'C', 'fs' => 9, 'h' => $lh),
              array('x' => $k4['x'], 'w' => $k4['w'], 'a' => 'C', 'fs' => 9, 'h' => $lh)
);

$y+= $p->MultilineColumns($opts, $header, false,1);

//var_dump($header);
// Строки таблицы
// параметры для данных таблицы
$opts = array(array('x' => $k1['x'], 'y' => $y, 'w' => $k1['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh),
              array('x' => $k2['x'], 'w' => $k2['w'], 'a' => 'L', 'fs' => $fs, 'h' => $lh),
              array('x' => $k3['x'], 'w' => $k3['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh),
              array('x' => $k4['x'], 'w' => $k4['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh)
);

//$p->SetFont("Times", "", $fs);
//$data = array(array('1','Наличие аттестата о среднем общем образовании или диплома о среднем профессиональном образовании с отличием', '', $red_cert?10:''),
//              array('2','Победители и призеры областных олимпиад (этап всероссийских олимпиад школьников)', '', $olymp_win?10:''));
//$y+= $p->MultilineColumns($opts, $data,false,1);
//
//if(count($konk_result) > 0){
//  $opts[0]['y'] = $y; // обновляем в массиве точку начала таблицы по Y
//  $p->SetFont('timesbd', 'B', 11);
//  $data = array(array('','МЕРОПРИЯТИЯ, ПРОВОДИМЫЕ НГТУ'));
//  $y+= $p->MultilineColumns($opts, $data,false,1);
//  
//  $opts[0]['y'] = $y;
//  $p->SetFont("Times", "", $fs);
//  //$data = array(array('3','Региональная командная олимпиада школьников по программированию','3','3','3'));
////  var_dump($konk_result);
//  $y+= $p->MultilineColumns($opts, $konk_result,false,1);
//}
//
//
//
//if(count($dop_konk_result) > 0){
//  $opts[0]['y'] = $y; // обновляем в массиве точку начала таблицы по Y
//  $p->SetFont('timesbd', 'B', 11);
//  $data = array(array('','МЕРОПРИЯТИЯ, ПРОВОДИМЫЕ ДРУГИМИ ВУЗАМИ СТРАНЫ'));
//  $y+= $p->MultilineColumns($opts, $data,false,1);
//  
//  $opts[0]['y'] = $y;
//  $p->SetFont("Times", "", $fs);
//  
////  var_dump($dop_konk_result);
//  $y+= $p->MultilineColumns($opts, $dop_konk_result,false,1);
//}
//
//
//// меняем структуру таблицы для финальной строчки с итогом
//// положение начала колонки по по Х
////$k1['x']=10;
////$k2['x']=18;
////$k3['x']=173;
//// ширина колонки
//$k1['w']=8;
//$k2['w']=150;
//$k3['w']=34;
//
//$opts = array(array('x' => $k1['x'], 'y' => $y, 'w' => $k1['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh*2),
//              array('x' => $k2['x'], 'w' => $k2['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh*2),
//              array('x' => $k3['x'], 'w' => $k3['w'], 'a' => 'C', 'fs' => $fs, 'h' => $lh*2));
//$p->SetFont('timesbd', 'B', 11);
//$data = array(array('','ИТОГО*', $summ_id));
//$y+= $p->MultilineColumns($opts, $data,false,1)+1;
//
//$p->SetFont("Times", "", $fs);
////$p->printL($p,37, $y, 'Иванов Иван Иванович');
//$p->SetXY($k1['x'], $y);
//$p->MultiCell(189, 4, $p->conv('* Общее количество баллов поступающего, полученное за индивидуальные достижения, не может превышать 10 (десяти) согласоно приложению 8 Правил приема на обучение по образовательным программам высшего образования.'));
//
//$y+=12;
//
//$p->SetFont("Times", "", $fs);
//$p->SetXY(9, $y);
//$p->MultiCell(300, 4, $p->conv('ИНФОРМАЦИЯ О ДОСТОВЕРНОСТИ ДИПЛОМОВ           ПРОВЕРЕНА             _____________ / ____________________'));
//

$p->Output();

?>