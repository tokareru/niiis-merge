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
  
  function table_header($x = 10, $y = 10) {
    
    $main_label = array('', $this->conv('Номер'),
                        $this->conv('Удалить'),
                        $this->conv('Цеха'),
                        $this->conv('Участка'),
                        $this->conv('Операции'),
                        $this->conv('Наименование и содержание операции'),
                        $this->conv('Оборудование (код, наименование, инвентарный номер)'),
                        $this->conv('Приспособление и инструмент (код, наименование)'),
                        array($this->conv('Коэфф.'),$this->conv('шт.'),$this->conv('вр.')),
                        array($this->conv('Кол.'),$this->conv('раб.')),
                        array($this->conv('Кол.'),$this->conv('одн.'),$this->conv('обраб.'),$this->conv('дет.')),
                        array($this->conv('Код'),$this->conv('тариф'),$this->conv('сетки')),
                        array($this->conv('Объем'),$this->conv('производственной'),$this->conv('партии')),
                        $this->conv('Тп.3'),
                        array($this->conv('Код'),$this->conv('профессии')),
                        array($this->conv('Разр.'),$this->conv('раб.')),
                        array($this->conv('Ед.'),$this->conv('нормир.')),
                        array($this->conv('Код'),$this->conv('вида'),$this->conv('нормир.')),
                        $this->conv('Тшт'),
                        $this->conv('')
                    );

    $this->SetFont('gost', '', 10);
    $this->SetLineWidth(0.1);
    $this->inc_num_page(); // инкрементируем глобальный счетчик страниц
    
    // пустая ячейка
//    $x+=4;
//    $y;
    $this->SetXY($x, $y);
    $this->Cell(40, 20, '', 1, 1, 'C'); 
    
    // маршрутная карта
    // $x+=4;
    // $y;
    $this->SetFont('gost', '', 20);
    $this->SetXY($x+40, $y);
    $this->Cell(89, 20, $this->conv('Маршрутная карта'), 1, 1, 'C'); 
    $this->SetFont('gost', '', 12);
    // АБВГ
    $this->SetXY($x+129, $y);
    $this->Cell(80, 10, '', 1, 1, 'C'); 
    
    // Корпус
    $this->SetXY($x+129, $y+10);
    $this->Cell(80, 10, '', 1, 1, 'C'); 
    
    // Пустая ячейка
    $this->SetXY($x+209, $y);
    $this->Cell(70, 10, '', 1, 1, 'C'); 
    
    // Литера
    $this->SetXY($x+209, $y+10);
    $this->Cell(20, 10, $this->conv('Литера'), 1, 1, 'C'); 
    
    $this->SetXY($x+229, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+234, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+239, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+244, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+249, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+254, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+259, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+264, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+269, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    $this->SetXY($x+274, $y+10);
    $this->Cell(5, 10, '', 1, 1, 'C');
    
    // Номер
    $x+=5;
    $y+=20;
    $this->SetXY($x, $y);
    $this->Cell(26, 5, $main_label[1], 1, 1, 'C'); 
    
    // Удалить
    $x-=5;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+3.5, $y+20, $main_label[2], 90);
    $this->Cell(5, 27, '', 1, 0, 'C'); // первая ячейка
    
    // Цеха
    $x+=5;
    $y+=5;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+6, $y+15, $main_label[3], 90);
    $this->Cell(9, 22, '', 1, 0, 'C');
    
    // Участка
    $x+=9;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+5, $y+16, $main_label[4], 90);
    $this->Cell(8, 22, '', 1, 0, 'C');
    
    // Операции
    $x+=8;
    $y;
    $this->SetXY($x, $y);
    $this->TextWithRotation($x+6, $y+17, $main_label[5], 90);
    $this->Cell(9, 22, '', 1, 0, 'C');
    
    // Наименование ...
    $this->SetFont('gost', '', 16);
    $x+=9;
    $y-=5;
    $this->SetXY($x, $y);
    $this->Cell(100, 27, $main_label[6], 1, 1, 'C');
    
    // оборудование ...
    $this->SetFont('gost', '', 12);
    $x+=100;
    $this->SetXY($x+3, $y+8);
    $this->MultiCell(35, 4, $main_label[7], 0, 'C');
    $this->SetXY($x, $y);
    $this->Cell(40, 27, '', 1, 1, 'C');
    
    // приспособление ...
    $x+=40;
    $this->SetXY($x+3, $y+8);
    $this->MultiCell(35, 4, $main_label[8], 0, 'C');
    $this->SetXY($x, $y);
    $this->Cell(40, 27, '', 1, 1, 'C');
    
    // Коэф ...
    $this->SetFont('gost', '', 9);
    $x+=40;
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
    
    
    $x = 10;
    $y = $y + 14 + 20*6; // вычисляем начало нижней надписи учитывая что строк умещается 20 штук
    // в зависимости от номера страницы выводим либо первый тип либо второй
//    $x+=24;
    
    $this->SetFont('gost', '', 12);
    if($this->get_num_page() == 1){
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // разраб
      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(18, 5, $this->conv('Разраб.'), 1, 1, 'C');

      // ФИО
      $x+=18;
      $this->SetXY($x, $y);
      $this->Cell(40, 5, $this->conv(''), 1, 1, 'L');

      $x+=40;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      $x+=20;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      // 2 строка
      $x = 10;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // Пров.
      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(18, 5, $this->conv('Пров.'), 1, 1, 'C');

      // ФИО
      $x+=18;
      $this->SetXY($x, $y);
      $this->Cell(40, 5, $this->conv(''), 1, 1, 'L');

      $x+=40;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      $x+=20;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      // третья строка
      $x = 10;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // Нормир.
      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(18, 5, $this->conv('Нормир.'), 1, 1, 'C');

      // ФИО
      $x+=18;
      $this->SetXY($x, $y);
      $this->Cell(40, 5, $this->conv(''), 1, 1, 'L');

      $x+=40;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      $x+=20;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      // четвертая строка
      $x = 10;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // Утвердил
      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(18, 5, $this->conv('Утвердил'), 1, 1, 'C');

      // ФИО
      $x+=18;
      $this->SetXY($x, $y);
      $this->Cell(40, 5, $this->conv(''), 1, 1, 'L');

      $x+=40;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      $x+=20;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');

      // пятая строка
      $x = 10;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Изм.'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Лист'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('№ докум.'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Подпись'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Дата'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, $this->conv('Изм.'), 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Лист'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('№ докум.'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Подпись'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Дата'), 1, 1, 'C');
      // Н.Контр.
      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(18, 5, $this->conv('Н.Контр.'), 1, 1, 'C');
      // ФИО
      $x+=18;
      $this->SetXY($x, $y);
      $this->Cell(40, 5, $this->conv(''), 1, 1, 'L');
      $x+=40;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');
      $x+=20;
      $this->SetXY($x, $y);
      $this->Cell(20, 5, '', 1, 1, 'C');
      $this->SetFont('gost', '', 9);

      $x+=20;
      $y-=20;
      $this->SetXY($x, $y);
      $this->Cell(13, 5, $this->conv('Лист'), 1, 1, 'C');
      $y+=5;
      $this->SetXY($x, $y);
      $this->Cell(13, 7.5, $this->conv('1'), 1, 1, 'C');
      $y+=7.5;
      $this->SetXY($x, $y);
      $this->Cell(13, 5, $this->conv('Листов'), 1, 1, 'C');
      $y+=5;
      $this->SetXY($x, $y);
      $this->Cell(13, 7.5, '', 1, 1, 'C');
    } else {
      
      // первая строка
      $x = 10;
      $y+=6;
      
      $this->SetXY($x, $y);
      $this->Cell(15, 15, '', 1, 1, 'C');
      
      $x+=15;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

     $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // вторая строка
      $x = 25;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, '', 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, '', 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, '', 1, 1, 'C');

      // третья строка
      $x = 25;
      $y+=5;

      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Изм.'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Лист'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('№ докум.'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Подпись'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Дата'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, $this->conv('Изм.'), 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Лист'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('№ докум.'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Подпись'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Дата'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(9, 5, $this->conv('Изм.'), 1, 1, 'C');

      $x+=9;
      $this->SetXY($x, $y);
      $this->Cell(11, 5, $this->conv('Лист'), 1, 1, 'C');

      $x+=11;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('№ докум.'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Подпись'), 1, 1, 'C');

      $x+=21;
      $this->SetXY($x, $y);
      $this->Cell(21, 5, $this->conv('Дата'), 1, 1, 'C');

      $x+=21;
      $y-=10;
      $this->SetXY($x, $y);
      $this->Cell(13, 5, $this->conv('Лист'), 1, 1, 'C');
      
      $y+=5;
      $this->SetXY($x, $y);
      $this->Cell(13, 10, $this->get_num_page(), 1, 1, 'C');
    }
    
    
    
  }
  
  
  function main_table($x, $y, $data) {
    $x_save = $x;
    $y_save = $y;
    //Ширина колонки
    $this->SetLineWidth(0.2);
    $w = array(5, 9, 8, 9, 100, 40, 40, 12, 9, 16, 12, 12, 7);
    
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
    $flag = true;
    $count_global_row = 0;
    foreach ($data as $row) {
      if($this->get_num_page() == 1) $count_max_rows = 20;
      else $count_max_rows = 23;
      
      if($count_global_row == $count_max_rows) {
        $this->AddPage();
//        $this->inc_num_page();
        $this->table_header();
        $this->SetXY($x_save, $y_save);
        $count_rows = 0;
        $count_global_row = 0;
      }
      $count_rows++;
//      $this->SetX(20);
      $heigh = $heigh_row;
      
      $count_e = count($row['equipment']);
      $count_t = count($row['tools']);
      
      if($count_e > $count_t) {
        $count_global_row += $count_e;
      }
      else 
      {
        $count_global_row += $count_t;
      }
      
      if($count_e > 1 || $count_t > 1) $count_global_row -= 1;
      
      $count_global_row++;
      
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
    
    if($this->get_num_page() == 1) $count_max_rows = 19;
    else $count_max_rows = 21;
    
//    echo $count_global_row;
    
    for($i = 0; $i < $count_max_rows-$count_global_row; $i++){
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
    
    $y = $this->GetY();
    $x = $this->GetX();
    
    
    
  }
  
  function main_table_1_2($x, $y, $data) {
    //Ширина колонки
    $this->SetLineWidth(0.2);
    $w = array(5, 9, 8, 9, 100, 40, 40, 12, 9, 16, 12, 12, 7);
    
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

$p = new PDF('L', 'mm', 'A4');
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


$p->table_header(10, 10); // высота заголовка 27

if($round == 3){
  $p->main_table(10, 57, $route_map);
}
else {
  $p->main_table_1_2(10, 57, $route_map);
}

$p->Output();
?>