<?php
//ini_set('error_reporting', E_ALL);
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);

define('FPDF_FONTPATH', conf::$ROOT . 'system/etc/fpdf/font/');
require_once conf::$ROOT . 'system/etc/fpdf/fpdf.php';

//require_once conf::$ROOT.'system/etc/fpdf/fpdf_extended.php';

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
  
  // фунукция вывода на третьем раунде
  function spec_table_max($main_label, $data, $x = 20, $y = 5) {

    //Ширина колонки
    $w = array(6, 6, 6, 60, 70, 10, 24);
    $this->SetXY($x, $y);
    $header = array($this->conv('Формат'), 
                    $this->conv('Зона'), 
                    $this->conv('Поз.'), 
                    $this->conv('Обозначение'), 
                    $this->conv('Наименование'), 
                    $this->conv('Кол.'), 
                    $this->conv('Примечание'));

    //Заголовок
    $this->TextWithRotation($this->GetX() + $w[0]-1, $this->GetY() + 14, $header[0], 90);
    $this->Cell($w[0], 15, "", 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[1]-1, $this->GetY() + 11, $header[1], 90);
    $this->Cell($w[1], 15, "", 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[2]-1, $this->GetY() + 10, $header[2], 90);
    $this->Cell($w[2], 15, "", 1, 0, 'C');
    
    $this->Cell($w[3], 15, $header[3], 1, 0, 'C');
    
    $this->Cell($w[4], 15, $header[4], 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[5]-3, $this->GetY() + 11, $header[5], 90);
    $this->Cell($w[5], 15, "", 1, 0, 'C');
    
    $this->Cell($w[6], 15, $header[6], 1, 0, 'C');

    $this->Ln();
    $this->SetLineWidth(0.7);
    $this->Line(20, 20, 202, 20);
    $this->Line(26, 5, 26, 233);
    $this->Line(32, 5, 32, 233);
    $this->Line(38, 5, 38, 233);
    $this->Line(98, 5, 98, 233);
    $this->Line(168, 5, 168, 233);
    $this->Line(178, 5, 178, 233);
    $this->SetLineWidth(0.1);
    //Данные
    
    $height = 7.36; // высота строки
    $row_count = 0; // снача считаем количество строк которые есть, потом добавляем оставшиеся
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, $this->conv("Документация"), 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, $this->conv($main_label['field21']. " СБ"), 'LRB', 0, 'L');
    $this->Cell($w[4], $height, $this->conv("Сборочный чертеж"), 'LRB', 0, 'L');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, $this->conv("Детали"), 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
//    var_dump($data);
    
    foreach ($data as $row) {
      
//      echo $row;
      if((int)$row['type_id'] == 1){
        $this->SetX($x);
        $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
        $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
        $this->Cell($w[2], $height, $this->conv($row['position']), 'LRB', 0, 'C');
        $this->Cell($w[3], $height, $this->conv($row['designation']), 'LRB', 0, 'L');
        $this->Cell($w[4], $height, $this->conv($row['name']), 'LRB', 0, 'L');
        $this->Cell($w[5], $height, $this->conv($row['number']), 'LRB', 0, 'C');
        $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
        $this->Ln();
        $row_count++;
      }
    }
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, $this->conv("Стандартные изделия"), 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    $this->SetX($x);
    $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
    $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
    $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
    $this->Ln();
    $row_count++;
    
    foreach ($data as $row) {
      if((int)$row['type_id'] == 2){
        $this->SetX($x);
        $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
        $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
        $this->Cell($w[2], $height, $this->conv($row['position']), 'LRB', 0, 'C');
        $this->Cell($w[3], $height, $this->conv($row['designation']), 'LRB', 0, 'L');
        $this->Cell($w[4], $height, $this->conv($row['name']), 'LRB', 0, 'L');
        $this->Cell($w[5], $height, $this->conv($row['number']), 'LRB', 0, 'C');
        $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
        $this->Ln();
        $row_count++;
      }
    }
    
    for($k = 0; $k < 29 - $row_count; $k++) {
      $this->SetX($x);
      $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
      $this->Ln();
    }
    
    $this->SetX(20);
  }
  
  // фунукция вывода для первых двух раундов
  function spec_table_min($main_label, $data, $x = 20, $y = 5) {

    //Ширина колонки
    $w = array(6, 6, 6, 60, 70, 10, 24);
    $this->SetXY($x, $y);
    $header = array($this->conv('Формат'), 
                    $this->conv('Зона'), 
                    $this->conv('Поз.'), 
                    $this->conv('Обозначение'), 
                    $this->conv('Наименование'), 
                    $this->conv('Кол.'), 
                    $this->conv('Примечание'));

    //Заголовок
    $this->TextWithRotation($this->GetX() + $w[0]-1, $this->GetY() + 14, $header[0], 90);
    $this->Cell($w[0], 15, "", 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[1]-1, $this->GetY() + 11, $header[1], 90);
    $this->Cell($w[1], 15, "", 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[2]-1, $this->GetY() + 10, $header[2], 90);
    $this->Cell($w[2], 15, "", 1, 0, 'C');
    
    $this->Cell($w[3], 15, $header[3], 1, 0, 'C');
    
    $this->Cell($w[4], 15, $header[4], 1, 0, 'C');
    
    $this->TextWithRotation($this->GetX() + $w[5]-3, $this->GetY() + 11, $header[5], 90);
    $this->Cell($w[5], 15, "", 1, 0, 'C');
    
    $this->Cell($w[6], 15, $header[6], 1, 0, 'C');

    $this->Ln();
    
    //вертикальные толстые линии
    $this->SetLineWidth(0.7);
    $this->Line(20, 20, 202, 20);
    $this->Line(26, 5, 26, 233);
    $this->Line(32, 5, 32, 233);
    $this->Line(38, 5, 38, 233);
    $this->Line(98, 5, 98, 233);
    $this->Line(168, 5, 168, 233);
    $this->Line(178, 5, 178, 233);
    $this->SetLineWidth(0.1);
    //Данные
    
    $height = 7.36; // высота строки
    $row_count = 0; // снача считаем количество строк которые есть, потом добавляем оставшиеся
    
    foreach ($data as $row) {
      
        $this->SetX($x);
        
        $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
        $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
        $this->Cell($w[2], $height, $this->conv($row[0]), 'LRB', 0, 'C');
        $this->Cell($w[3], $height, $this->conv($row[1]), 'LRB', 0, 'L');
        $this->Cell($w[4], $height, $this->conv($row[2]), 'LRB', 0, 'L');
        $this->Cell($w[5], $height, $this->conv($row[3]), 'LRB', 0, 'C');
        $this->Cell($w[6], $height, $this->conv($row[4]), 'LRB', 0, 'L');
        $this->Ln();
        $row_count++;
      
    }
    
    for($k = 0; $k < 29 - $row_count; $k++) {
      $this->SetX($x);
      $this->Cell($w[0], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[1], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[2], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[3], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[4], $height, "", 'LRB', 0, 'C');
      $this->Cell($w[5], $height, "", 'LRB', 0, 'L');
      $this->Cell($w[6], $height, "", 'LRB', 0, 'C');
      $this->Ln();
    }
    
    $this->SetX(20);
  }

  function border_page($main_label, $type = 1) {
    $this->inc_num_page(); // инкрементируем глобальный счетчик страниц

    $frame = $this->get_frame(); // показывать ли рамки (глобальный параметр)
    $x = 20;
    $y = 234;
    $wstr = 4.9;

    $this->SetFont('gost', '', 11);

    if ($type == 1) {
      $this->Image('images/report/frame.jpg', 0, 0, -130);
      // верхняя надпись повернутая на 180
      $this->SetFont('gost', '', 14);
      $this->TextWithRotation(70, 10, $this->conv($main_label['field21']), 180);
    } else if ($type = 2) {
      $this->Image('images/report/frame3.jpg', 0, 0, -130);
    }

    $this->SetFont('gost', '', 11);

    // первая строка
    $this->SetXY($x, $y);
    $this->Cell(7, 5, $this->conv($main_label['field1']), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 7, $y);
    $this->Cell(10, 5, $this->conv($main_label['field2']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field3']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field4']), $frame, 1, 'L'); // четвертая ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field5']), $frame, 1, 'L'); // пятая ячейка
    // вторая строка
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(7, 5, $this->conv($main_label['field6']), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 7, $y);
    $this->Cell(10, 5, $this->conv($main_label['field7']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field8']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field9']), $frame, 1, 'L'); // четвертая ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field10']), $frame, 1, 'L'); // пятая ячейка
    // третья строка
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(7, 5, $this->conv($main_label['field11']), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 7, $y);
    $this->Cell(10, 5, $this->conv($main_label['field12']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field13']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field14']), $frame, 1, 'L'); // четвертая ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field15']), $frame, 1, 'L'); // пятая ячейка
    // четвертая строка
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(7, 5, $this->conv($main_label['field16']), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 7, $y);
    $this->Cell(10, 5, $this->conv($main_label['field17']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field18']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field19']), $frame, 1, 'L'); // четвертая ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field20']), $frame, 1, 'L'); // пятая ячейка
    // пятая строка подписей
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(7, 5, $this->conv('Изм.'), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 7, $y);
    $this->Cell(10, 5, $this->conv('Лист'), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv('№ докум.'), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv('Подп.'), $frame, 1, 'L'); // четвертая ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv('Дата'), $frame, 1, 'L'); // пятая ячейка
    // шестая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv('Разраб.'), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field23']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field24']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field25']), $frame, 1, 'L'); // четвертая ячейка
    // седьмая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv('Пров.'), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field26']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field27']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field28']), $frame, 1, 'L'); // четвертая ячейка
    // восьмая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv('Т.контр.'), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field29']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field30']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field31']), $frame, 1, 'L'); // четвертая ячейка
    // девятая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv($main_label['field32']), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field33']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field34']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field35']), $frame, 1, 'L'); // четвертая ячейка
    // десятая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv("Н.контр."), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field36']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field37']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field38']), $frame, 1, 'L'); // четвертая ячейка
    // одинадцатая строка фио
    $y += $wstr;
    $this->SetXY($x, $y);
    $this->Cell(17, 5, $this->conv('Утв.'), $frame, 1, 'L'); // первая ячейка
    $this->SetXY($x + 17, $y);
    $this->Cell(22, 5, $this->conv($main_label['field39']), $frame, 1, 'L'); // вторая ячейка
    $this->SetXY($x + 39, $y);
    $this->Cell(15, 5, $this->conv($main_label['field40']), $frame, 1, 'L'); // третья ячейка
    $this->SetXY($x + 54, $y);
    $this->Cell(10, 5, $this->conv($main_label['field41']), $frame, 1, 'L'); // четвертая ячейка
    //----------------------------------------------

    $this->SetFont('gost', '', 14);
    $x = 84;
    $y = 234;

    $this->SetXY($x, $y);
    $this->Cell(118, 15, $this->conv($main_label['field21']), $frame, 1, 'C'); // Название проекта

    $y += 15;
    $this->SetXY($x, $y);
    $this->Cell(69, 25, $this->conv($main_label['field22']), $frame, 1, 'C'); // Название проекта

    $y += 24;
    $this->SetXY($x, $y);
    $this->Cell(69, 15, $this->conv($main_label['field42']), $frame, 1, 'C'); // Название проекта

    $this->SetXY($x + 69, $y);
    $this->Cell(50, 15, $this->conv($main_label['field50']), $frame, 1, 'C'); // Название проекта

    $this->SetFont('gost', '', 10);
    $x = 153;
    $y = 249;
    $this->SetXY($x, $y);
    $this->Cell(15, 5, $this->conv("Лит."), $frame, 1, 'C'); // Литерал

    $this->SetXY($x + 15, $y);
    $this->Cell(17, 5, $this->conv("Масса"), $frame, 1, 'C'); // Масса

    $this->SetXY($x + 32, $y);
    $this->Cell(17, 5, $this->conv("Масштаб"), $frame, 1, 'C'); // Масштаб

    $y += 10;
    $this->SetXY($x, $y);
    $this->Cell(5, 5, $this->conv($main_label['field43']), $frame, 1, 'C'); // Литерал 1

    $this->SetXY($x + 5, $y);
    $this->Cell(5, 5, $this->conv($main_label['field44']), $frame, 1, 'C'); // Литерал 2

    $this->SetXY($x + 10, $y);
    $this->Cell(5, 5, $this->conv($main_label['field45']), $frame, 1, 'C'); // Литерал 3

    $this->SetXY($x + 15, $y);
    $this->Cell(17, 5, $this->conv($main_label['field46']), $frame, 1, 'C'); // Масса

    $this->SetXY($x + 32, $y);
    $this->Cell(17, 5, $this->conv($main_label['field47']), $frame, 1, 'C'); // Масштаб

    $y += 10;
    $this->SetXY($x, $y);
    $this->Cell(20, 5, $this->conv("Лист " . $this->get_num_page()), $frame, 1, 'L'); // Лист

    $this->SetXY($x + 20, $y);
    $this->Cell(29, 5, $this->conv("Листов 2"), $frame, 1, 'L'); // Листов
  }

}

$size = $data['size'];
$main_label = $data['data'][0];
$round = $data['round'];
$spec_table = $data['spec_table'];
$draw_finish = $data['draw_finish'];

// -------------------------формирование страницы PDF---------------------------



$p = new PDF('P', 'mm', 'A4');
$p->AddFont('gost', '', 'gost-type-a.php');
$p->AddFont('gost', 'B', 'gost_b.php');
$p->SetAutoPageBreak(0);

// метаданные
$p->SetAuthor("NIIIS", true);
$p->SetTitle("Report", true);
$p->SetSubject("ID", true);

// параметры страницы
$frame = $p->get_frame();
$x = 20;
$y = 234;
$w_str = 4.9;
$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->SetFont('gost', '', 10);


// печать рамки страницы первого типа - для сборочного чертежа
$p->border_page($main_label, $type = 1);

  

if ($draw_finish) { // если чертеж дорисован
  $p->Image('images/report/drawing.PNG', 30, 20, -130);

  // размеры на чертеже
  $p->SetXY(39, 46);
//  $p->Cell(6, 5, $size["size_1"], $frame, 1, 'C'); // размер 1  
  $p->TextWithRotation(39, 44, $size["size_1"], 90);
  $p->SetXY(78, 120);
  $p->Cell(6, 5, $size["size_2"], $frame, 1, 'C'); // размер 3
  $p->SetXY(155, 55);
  $p->Cell(6, 5, $size["size_3"], $frame, 1, 'C'); // размер 2

  // -----------------
}

//------------------------------------------------------------------------------
//------------------Лист 2-----------------------------------------------------
//------------------------------------------------------------------------------

$p->AddPage();

// печать рамки страницы второго типа - для пецификации, с табличкой во всю страницу
$p->border_page($main_label, 2);

$p->SetFont('gost', '', 14);
$p->SetXY(30, 30);

//Загрузка данных
if($round == 3) $p->spec_table_max($main_label, $spec_table);
else $p->spec_table_min($main_label, $spec_table);

$p->Output();
?>