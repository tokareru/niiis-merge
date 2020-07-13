<?php

define('FPDF_FONTPATH', conf::$ROOT . 'system/etc/fpdf/font/');
require_once conf::$ROOT . 'system/etc/fpdf/fpdf.php';

class PDF extends FPDF {

  public $num_page = 0;
  public $frame = 0;

  function get_frame() {
    return $this->frame;
  }

  function get_num_page() {
    return $this->num_page;
  }

  function inc_num_page() {
    $this->num_page++;
  }

  function TextWithRotation($x, $y, $txt, $txt_angle, $font_angle = 0) {
    $font_angle += 90 + $txt_angle;
    $txt_angle *= M_PI / 180;
    $font_angle *= M_PI / 180;

    $txt_dx = cos($txt_angle);
    $txt_dy = sin($txt_angle);
    $font_dx = cos($font_angle);
    $font_dy = sin($font_angle);

    $s = sprintf('BT %.2F %.2F %.2F %.2F %.2F %.2F Tm (%s) Tj ET', $txt_dx, $txt_dy, $font_dx, $font_dy, $x * $this->k, ($this->h - $y) * $this->k, $this->_escape($txt));
    if ($this->ColorFlag)
      $s = 'q ' . $this->TextColor . ' ' . $s . ' Q';
    $this->_out($s);
  }

  function RotatedText($x, $y, $txt, $angle) {
    //Text rotated around its origin
    $this->Rotate($angle, $x, $y);
    $this->Text($x, $y, $txt);
    $this->Rotate(0);
  }

  //Улучшенная таблица
  function ImprovedTable($header, $data) {
    //Ширина колонки
    $w = array(6, 6, 6, 60, 70, 10, 24);
    $this->SetX(20);
    //Заголовок
    for ($i = 0; $i < count($header); $i++) {

      if (($i < 3) || ($i == 5)) {
        $this->TextWithRotation($this->GetX() + $w[$i], $this->GetY() + 13, $header[$i], 90);
        $this->Cell($w[$i], 15, "", 1, 0, 'C');
      } else {
        $this->Cell($w[$i], 15, $header[$i], 1, 0, 'C');
      }
    }
    $this->Ln();

    //Данные
    foreach ($data as $row) {
      $this->SetX(20);
      $this->Cell($w[0], 8, "", 'LRB', 0, 'C');
      $this->Cell($w[1], 8, "", 'LRB', 0, 'L');
      $this->Cell($w[2], 8, $this->conv($row[0]), 'LRB', 0, 'L');
      $this->Cell($w[3], 8, $this->conv($row[1]), 'LRB', 0, 'C');
      $this->Cell($w[4], 8, $this->conv($row[2]), 'LRB', 0, 'C');
      $this->Cell($w[5], 8, $this->conv($row[3]), 'LRB', 0, 'L');
      $this->Cell($w[6], 8, "", 'LRB', 0, 'C');
      $this->Ln();
    }
    $this->SetX(20);
  }
  
  function table_header($x, $y, $main_label) {
    $this->SetFont('gost', '', 10);
    $this->SetLineWidth(0.5);
    $this->inc_num_page(); // инкрементируем глобальный счетчик страниц
    
    // Номер
    $x+=4;
    $y;
    $this->SetXY($x, $y);
    $this->Cell(20, 5, $main_label[1], 1, 1, 'C'); 
    
    // Удалить
    $x-=4;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+3, $y+20, $main_label[2], 90);
    $this->Cell(4, 27, '', 1, 0, 'C'); // первая ячейка
    
    // Цеха
    $x+=4;
    $y+=5;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+5, $y+15, $main_label[3], 90);
    $this->Cell(7, 22, '', 1, 0, 'C');
    
    // Участка
    $x+=7;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+16, $main_label[4], 90);
    $this->Cell(6, 22, '', 1, 0, 'C');
    
    // Операции
    $x+=6;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+17, $main_label[5], 90);
    $this->Cell(7, 22, '', 1, 0, 'C');
    
    // Наименование ...
    $this->SetFont('gost', '', 12);
    $x+=7;
    $y-=5;
    $this->SetXY($x, $y);
    $this->Cell(58, 27, $main_label[6], 1, 1, 'C');
    
    // оборудование ...
    $this->SetFont('gost', '', 9);
    $x+=58;
    $this->SetXY($x, $y+6);
    $this->MultiCell(23, 4, $main_label[7], 0, 'C');
    $this->SetXY($x, $y);
    $this->Cell(23, 27, '', 1, 1, 'C');
    
    // приспособление ...
    $x+=23;
    $this->SetXY($x, $y+7);
    $this->MultiCell(23, 4, $main_label[8], 0, 'C');
    $this->SetXY($x, $y);
    $this->Cell(23, 27, '', 1, 1, 'C');
    
    // Коэф ...
    $x+=23;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+10, $main_label[9][0], 90);
    $this->TextWithRotation($x+7, $y+8, $main_label[9][1], 90);
    $this->TextWithRotation($x+10, $y+8, $main_label[9][2], 90);
    $this->Cell(12, 13, '', 1, 1, 'C');
    
    // кол раб ...
    $x+=12;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+8, $main_label[10][0], 90);
    $this->TextWithRotation($x+7, $y+8, $main_label[10][1], 90);
    $this->Cell(9, 13, '', 1, 1, 'C');
    
    // кол одн ...
    $x+=9;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+8, $main_label[11][0], 90);
    $this->TextWithRotation($x+7, $y+8, $main_label[11][1], 90);
    $this->TextWithRotation($x+10, $y+9, $main_label[11][2], 90);
    $this->TextWithRotation($x+13, $y+9, $main_label[11][2], 90);
    
    $this->Cell(16, 13, '', 1, 1, 'C');
    
    // кол тариф ...
    $x+=16;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+8, $main_label[12][0], 90);
    $this->TextWithRotation($x+7, $y+9, $main_label[12][1], 90);
    $this->TextWithRotation($x+10, $y+9, $main_label[12][2], 90);
    $this->Cell(12, 13, '', 1, 1, 'C');
    
    // Объем ...
    $x+=12;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+16, $main_label[13][0], 90);
    $this->TextWithRotation($x+7, $y+23, $main_label[13][1], 90);
    $this->TextWithRotation($x+10, $y+16, $main_label[13][2], 90);
    $this->Cell(12, 27, '', 1, 1, 'C');
    
    // Тп.3 ...
    $x+=12;
    $this->SetXY($x, $y);
    $this->Cell(7, 13, $main_label[14], 1, 1, 'C');
    // строка 2
    // код проф ...
    $x-=61;
    $y+=13;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+5, $y+9, $main_label[15][0], 90);
    $this->TextWithRotation($x+8, $y+13, $main_label[15][1], 90);
    $this->Cell(12, 14, '', 1, 1, 'C');
    // разр раб ...
    $x+=12;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+9, $main_label[16][0], 90);
    $this->TextWithRotation($x+7, $y+9, $main_label[16][1], 90);
    $this->Cell(9, 14, '', 1, 1, 'C');
    // ед нормир ...
    $x+=9;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+7, $y+8, $main_label[17][0], 90);
    $this->TextWithRotation($x+10, $y+9, $main_label[18][1], 90);
    $this->Cell(16, 14, '', 1, 1, 'C');
    // код вида нормы ...
    $x+=16;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+4, $y+8, $main_label[18][0], 90);
    $this->TextWithRotation($x+7, $y+9, $main_label[18][1], 90);
    $this->TextWithRotation($x+10, $y+11, $main_label[18][2], 90);
    $this->Cell(12, 14, '', 1, 1, 'C');
    // пропуск
    // Тшт ...
    $x+=24;
    $this->SetXY($x, $y);
    $this->Cell(7, 14, $main_label[19], 1, 1, 'C');
  }
  
  
  function main_table($x, $y, $data) {
    //Ширина колонки
    $this->SetLineWidth(0.2);
    $w = array(4, 7, 6, 7, 58, 23, 23, 12, 9, 16, 12, 12, 7);
    
    $this->SetXY($x, $y);
    $heigh_row = 6;
    $this->SetFont('gost', '', 11);
    $count_rows = 0;
    
    // пустая строка
    $heigh = $heigh_row;
    $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[2], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[3], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $heigh, "", 'LRB', 0, 'L');
    $this->Cell($w[5], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
    $this->Ln();
    
    $y = $this->GetY();
//    $x = $this->GetX();
    //Данные
    foreach ($data as $row) {
      $count_rows++;
//      $this->SetX(20);
      $heigh = $heigh_row;
      
      $count_e = count($row['equipment']);
      $count_t = count($row['tools']);
      
      if($count_e > 0 || $count_t > 0){
        if($count_e > $count_t) {
          $heigh = $heigh_row * $count_e;
          $max_count = $count_e;
        }
        else {
          $heigh = $heigh_row * $count_t;
          $max_count = $count_t;
        }
      }
      
      
      $this->SetX($x);
      $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[1], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[2], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[3], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[4], $heigh, $this->conv($row['name']), 'LRB', 0, 'L');
      
      // сохраняем позицию чтобы потом восстановить после функции MultiCell
      $temp_y = $this->GetY();
      $temp_x = $this->GetX();
      $this->Cell($w[5], $heigh, "", 'LRB', 0, 'C');
      $this->SetXY($temp_x, $temp_y);
      $this->SetFont('gost', '', 9);
      foreach($row['equipment'] as $eqiupment) {
        $this->Cell($w[5], $heigh_row, $this->conv($eqiupment['name']), '', 1, 'C');
        $this->SetX($temp_x);
      }
      
      $temp_x+=$w[5];// сдвигаемся на один столбец вправо
      $this->SetXY($temp_x, $temp_y); // восстанавливаем координаты после MultiCell
      
      
      $temp_y = $this->GetY();
      $temp_x = $this->GetX();
      $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
      $this->SetXY($temp_x, $temp_y);
       
      foreach($row['tools'] as $tools) {
        $this->Cell($w[6], $heigh_row, $this->conv($tools['name']), '', 1, 'C');
        $this->SetX($temp_x);
      }
      $this->SetFont('gost', '', 11);
      $temp_x+=$w[6];// сдвигаемся на один столбец вправо
      $this->SetXY($temp_x, $temp_y); // восстанавливаем координаты после MultiCell
      
      
//      $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
      
      $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
      $this->Ln();
    }
    $this->SetX($x);
    $heigh = $heigh_row;
    $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[2], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[3], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $heigh, "", 'LRB', 0, 'L');
    $this->Cell($w[5], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
    $this->Ln();
  }
  
  function main_table_1_2($x, $y, $data) {
    //Ширина колонки
    $this->SetLineWidth(0.2);
    $w = array(4, 7, 6, 7, 58, 23, 23, 12, 9, 16, 12, 12, 7);
    
    $this->SetXY($x, $y);
    $heigh_row = 6;
    $this->SetFont('gost', '', 11);
    $count_rows = 0;
    
    // пустая строка
    $heigh = $heigh_row;
    $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[2], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[3], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $heigh, "", 'LRB', 0, 'L');
    $this->Cell($w[5], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
    $this->Ln();
    
    $y = $this->GetY();
//    $x = $this->GetX();
    //Данные
    foreach ($data as $row) {
      
      $this->SetX($x);
      $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[1], $heigh, $this->conv($row['num_ceh']), 'LRB', 0, 'L');
      $this->Cell($w[2], $heigh, $this->conv($row['num_uch']), 'LRB', 0, 'L');
      $this->Cell($w[3], $heigh, $this->conv($row['num_oper']), 'LRB', 0, 'L');
      $this->Cell($w[4], $heigh, $this->conv($row['name']), 'LRB', 0, 'L');
      $this->Cell($w[5], $heigh, $this->conv($row['equipment']), 'LRB', 0, 'L');
      $this->Cell($w[6], $heigh, $this->conv($row['tools']), 'LRB', 0, 'L');
      $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
      $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
      $this->Ln();
    }
    $this->SetX($x);
    $heigh = $heigh_row;
    $this->Cell($w[0], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[2], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[3], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $heigh, "", 'LRB', 0, 'L');
    $this->Cell($w[5], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[6], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[7], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[8], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[9], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[10], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[11], $heigh, "", 'LRB', 0, 'C');
    $this->Cell($w[12], $heigh, "", 'LRB', 0, 'C');
    $this->Ln();
  }
}

//$size = $data['size'];

// -------------------------формирование страницы PDF---------------------------
$route_map = $data['route_map'];
$round = $data['round'];

$p = new PDF('P', 'mm', 'A4');
$p->AddFont('gost', '', 'gost-type-a.php');
$p->AddFont('gost', 'B', 'gost_b.php');
$p->SetAutoPageBreak(0);

// метаданные
$p->SetAuthor("NIIIS", true);
$p->SetTitle('Маршрутная карта', true);
$p->SetSubject("ID", true);

// параметры страницы
$frame = $p->get_frame();
$x = 20;
$y = 234;
$w_str = 4.9;
$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->SetFont('gost', '', 10);

$main_label = array('', $p->conv('Номер'),
                        $p->conv('Удалить'),
                        $p->conv('Цеха'),
                        $p->conv('Участка'),
                        $p->conv('Операции'),
                        $p->conv('Наименование и содержание операции'),
                        $p->conv('Оборудование (код, наименование, инвентарный номер)'),
                        $p->conv('Приспособление и инструмент (код, наименование)'),
                        array($p->conv('Коэфф.'),$p->conv('шт.'),$p->conv('вр.')),
                        array($p->conv('Кол.'),$p->conv('раб.')),
                        array($p->conv('Кол.'),$p->conv('одн.'),$p->conv('обраб.'),$p->conv('дет.')),
                        array($p->conv('Код'),$p->conv('тариф'),$p->conv('сетки')),
                        array($p->conv('Объем'),$p->conv('производственной'),$p->conv('партии')),
                        $p->conv('Тп.3'),
                        array($p->conv('Код'),$p->conv('профессии')),
                        array($p->conv('Разр.'),$p->conv('раб.')),
                        array($p->conv('Ед.'),$p->conv('нормир.')),
                        array($p->conv('Код'),$p->conv('вида'),$p->conv('нормир.')),
                        $p->conv('Тшт'),
                        $p->conv('')
                    );

$p->table_header(7, 10, $main_label); // высота заголовка 27
if($round == 3){
  $p->main_table(7, 37, $route_map);
}
else {
  $p->main_table_1_2(7, 37, $route_map);
}

$p->Output();
?>