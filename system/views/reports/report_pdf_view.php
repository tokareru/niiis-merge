<?php 

define('FPDF_FONTPATH', conf::$ROOT.'system/etc/fpdf/font/');
require_once conf::$ROOT.'system/etc/fpdf/fpdf.php';
//require_once conf::$ROOT.'system/etc/fpdf/fpdf_extended.php';

class PDF extends FPDF
{
  //Улучшенная таблица
  function ImprovedTable($header,$data)
  {
      //Ширина колонки
      $w=array(20,60,60,25);
      //Заголовок
      for($i=0;$i<count($header);$i++)
          $this->Cell($w[$i],7,$header[$i],1,0,'C');
      $this->Ln();
      //Данные
      
      foreach($data as $row)
      {
        $this->SetX(30);
        $this->Cell($w[0],6,$this->conv($row[0]),'LRB',0,'C');
        $this->Cell($w[1],6,$this->conv($row[1]),'LRB',0,'L');
        $this->Cell($w[2],6,$this->conv($row[2]),'LRB',0,'L');
        $this->Cell($w[3],6,$this->conv($row[3]),'LRB',0,'C');
        $this->Ln();
      }
      $this->SetX(30);
      //Линия закрытия (последняя линия)
//      $this->Cell(array_sum($w),0,'','T');
  }
}

$main_label = $data['content']['data'][0];
$round = $data['content']['round'];
$spec_table = $data['content']['spec_table'];
$draw_finish = $data['content']['draw_finish'];

//var_dump($spec_table);
// -------------------------формирование страницы PDF---------------------------
$frame = 0;
$x = 20;
$y = 234;

$w_str = 4.9;

$p = new PDF('P','mm','A4');
$p->AddFont('gost', '', 'gost-type-a.php');
$p->AddFont('gost', 'B', 'gost_b.php');
$p->SetAutoPageBreak(0);

// метаданные
$p->SetAuthor("NIIIS",true);
$p->SetTitle("Report",true);
$p->SetSubject("ID",true);

$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->SetFont('gost', '', 10);

$p->Image('images/report/frame.jpg',0,0,-130); 

if($draw_finish){ // если чертеж дорисован
  $p->Image('images/report/ABR3d-1.png',30,20,-350); 

  // размеры на чертеже
  $p->SetXY(26,45);
  $p->Cell(6,5,'112',$frame,1,'C'); // размер 1
  $p->SetXY(160,63);
  $p->Cell(6,5,'248',$frame,1,'C'); // размер 2
  $p->SetXY(72,136);
  $p->Cell(6,5,'345',$frame,1,'C'); // размер 3
  // -----------------
}
// первая строка
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field1']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field2']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field3']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field4']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field5']),$frame,1,'L'); // пятая ячейка

// вторая строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field6']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field7']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field8']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field9']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field10']),$frame,1,'L'); // пятая ячейка

// третья строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field11']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field12']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field13']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field14']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field15']),$frame,1,'L'); // пятая ячейка

// четвертая строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field16']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field17']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field18']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field19']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field20']),$frame,1,'L'); // пятая ячейка


// пятая строка подписей
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv('Изм.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv('Лист'),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv('№ докум.'),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv('Подп.'),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv('Дата'),$frame,1,'L'); // пятая ячейка

// шестая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Разраб.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field23']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field24']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field25']),$frame,1,'L'); // четвертая ячейка

// седьмая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Пров.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field26']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field27']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field28']),$frame,1,'L'); // четвертая ячейка

// восьмая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Т.контр.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field29']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field30']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field31']),$frame,1,'L'); // четвертая ячейка

// девятая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv($main_label['field32']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field33']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field34']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field35']),$frame,1,'L'); // четвертая ячейка

// десятая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv("Н.контр."),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field36']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field37']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field38']),$frame,1,'L'); // четвертая ячейка

// одинадцатая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Утв.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field39']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field40']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field41']),$frame,1,'L'); // четвертая ячейка

//----------------------------------------------

$p->SetFont('gost', '', 14);
$x = 84;
$y = 234;

$p->SetXY($x,$y);
$p->Cell(118,15,$p->conv($main_label['field21']),$frame,1,'C'); // Название проекта

$y+=15;
$p->SetXY($x,$y);
$p->Cell(69,25,$p->conv($main_label['field22']),$frame,1,'C'); // Название проекта

$y+=24;
$p->SetXY($x,$y);
$p->Cell(69,15,$p->conv($main_label['field42']),$frame,1,'C'); // Название проекта

$p->SetXY($x+69,$y);
$p->Cell(50,15,$p->conv($main_label['field50']),$frame,1,'C'); // Название проекта



$p->SetFont('gost', '', 10);
$x = 153;
$y = 249;
$p->SetXY($x,$y);
$p->Cell(15,5,$p->conv("Лит."),$frame,1,'C'); // Литерал

$p->SetXY($x+15,$y);
$p->Cell(17,5,$p->conv("Масса"),$frame,1,'C'); // Масса

$p->SetXY($x+32,$y);
$p->Cell(17,5,$p->conv("Масштаб"),$frame,1,'C'); // Масштаб

$y+=10;
$p->SetXY($x,$y);
$p->Cell(5,5,$p->conv($main_label['field43']),$frame,1,'C'); // Литерал 1

$p->SetXY($x+5,$y);
$p->Cell(5,5,$p->conv($main_label['field44']),$frame,1,'C'); // Литерал 2

$p->SetXY($x+10,$y);
$p->Cell(5,5,$p->conv($main_label['field45']),$frame,1,'C'); // Литерал 3

$p->SetXY($x+15,$y);
$p->Cell(17,5,$p->conv($main_label['field46']),$frame,1,'C'); // Масса

$p->SetXY($x+32,$y);
$p->Cell(17,5,$p->conv($main_label['field47']),$frame,1,'C'); // Масштаб

$y+=10;
$p->SetXY($x,$y);
$p->Cell(20,5,$p->conv("Лист 1"),$frame,1,'L'); // Лист

$p->SetXY($x+20,$y);
$p->Cell(29,5,$p->conv("Листов 2"),$frame,1,'L'); // Листов

//------------------------------------------------------------------------------
//------------------Лист 2-----------------------------------------------------
//------------------------------------------------------------------------------

$p->AddPage();

$x = 20;
$y = 234;
$w_str = 4.9;
$p->Image('images/report/frame.jpg',0,0,-130); 




// первая строка
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field1']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field2']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field3']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field4']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field5']),$frame,1,'L'); // пятая ячейка

// вторая строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field6']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field7']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field8']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field9']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field10']),$frame,1,'L'); // пятая ячейка

// третья строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field11']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field12']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field13']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field14']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field15']),$frame,1,'L'); // пятая ячейка

// четвертая строка
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv($main_label['field16']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv($main_label['field17']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field18']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field19']),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field20']),$frame,1,'L'); // пятая ячейка


// пятая строка подписей
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(7,5,$p->conv('Изм.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+7,$y);
$p->Cell(10,5,$p->conv('Лист'),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv('№ докум.'),$frame,1,'L'); // третья ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv('Подп.'),$frame,1,'L'); // четвертая ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv('Дата'),$frame,1,'L'); // пятая ячейка

// шестая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Разраб.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field23']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field24']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field25']),$frame,1,'L'); // четвертая ячейка

// седьмая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Пров.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field26']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field27']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field28']),$frame,1,'L'); // четвертая ячейка

// восьмая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Т.контр.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field29']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field30']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field31']),$frame,1,'L'); // четвертая ячейка

// девятая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv($main_label['field32']),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field33']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field34']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field35']),$frame,1,'L'); // четвертая ячейка

// десятая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv("Н.контр."),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field36']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field37']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field38']),$frame,1,'L'); // четвертая ячейка

// одинадцатая строка фио
$y+=$w_str;
$p->SetXY($x,$y);
$p->Cell(17,5,$p->conv('Утв.'),$frame,1,'L'); // первая ячейка
$p->SetXY($x+17,$y);
$p->Cell(22,5,$p->conv($main_label['field39']),$frame,1,'L'); // вторая ячейка
$p->SetXY($x+39,$y);
$p->Cell(15,5,$p->conv($main_label['field40']),$frame,1,'L'); // третья ячейка
$p->SetXY($x+54,$y);
$p->Cell(10,5,$p->conv($main_label['field41']),$frame,1,'L'); // четвертая ячейка

//----------------------------------------------

$p->SetFont('gost', '', 14);
$x = 84;
$y = 234;

$p->SetXY($x,$y);
$p->Cell(118,15,$p->conv($main_label['field21']),$frame,1,'C'); // Название проекта

$y+=15;
$p->SetXY($x,$y);
$p->Cell(69,25,$p->conv($main_label['field22']),$frame,1,'C'); // Название проекта

$y+=24;
$p->SetXY($x,$y);
$p->Cell(69,15,$p->conv($main_label['field42']),$frame,1,'C'); // Название проекта

$p->SetXY($x+69,$y);
$p->Cell(50,15,$p->conv($main_label['field50']),$frame,1,'C'); // Название проекта



$p->SetFont('gost', '', 10);
$x = 153;
$y = 249;
$p->SetXY($x,$y);
$p->Cell(15,5,$p->conv("Лит."),$frame,1,'C'); // Литерал

$p->SetXY($x+15,$y);
$p->Cell(17,5,$p->conv("Масса"),$frame,1,'C'); // Масса

$p->SetXY($x+32,$y);
$p->Cell(17,5,$p->conv("Масштаб"),$frame,1,'C'); // Масштаб

$y+=10;
$p->SetXY($x,$y);
$p->Cell(5,5,$p->conv($main_label['field43']),$frame,1,'C'); // Литерал 1

$p->SetXY($x+5,$y);
$p->Cell(5,5,$p->conv($main_label['field44']),$frame,1,'C'); // Литерал 2

$p->SetXY($x+10,$y);
$p->Cell(5,5,$p->conv($main_label['field45']),$frame,1,'C'); // Литерал 3

$p->SetXY($x+15,$y);
$p->Cell(17,5,$p->conv($main_label['field46']),$frame,1,'C'); // Масса

$p->SetXY($x+32,$y);
$p->Cell(17,5,$p->conv($main_label['field47']),$frame,1,'C'); // Масштаб

$y+=10;
$p->SetXY($x,$y);
$p->Cell(20,5,$p->conv("Лист 2"),$frame,1,'L'); // Лист

$p->SetXY($x+20,$y);
$p->Cell(29,5,$p->conv("Листов 2"),$frame,1,'L'); // Листов

//------------------------------------------------------------------------------

$p->SetFont('gost', '', 14);
$p->SetXY(30,30);
$header=array($p->conv('Позиция'),$p->conv('Обозначение'),$p->conv('Наименование'),$p->conv('Количество'));
//Загрузка данных
$p->ImprovedTable($header, $spec_table);

$p->Output();

?>