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
  function ImprovedTable($x, $y, $header, $data) {
    //Ширина колонки
    $this->SetXY($x, $y);
    $this->SetLineWidth(0.6);
    $w = array(60, 30, 50, 50);
//    $this->SetX(20);
    //Заголовок
    for ($i = 0; $i < count($header); $i++) {
      $this->Cell($w[$i], 8, $header[$i], 1, 0, 'C');
      
    }
    $this->Ln();
    $this->SetLineWidth(0.3);
    //Данные
    foreach ($data as $row) {
      $this->SetX($x);
      $this->Cell($w[0], 6, $this->conv($row['name']), 'LRB', 0, 'L');
      $this->Cell($w[1], 6, $this->conv($row['job']), 'LRB', 0, 'L');
      $this->Cell($w[2], 6, $this->conv($row['techOperation']), 'LRB', 0, 'L');
      $this->Cell($w[3], 6, $this->conv($row['task']), 'LRB', 0, 'L');
      $this->Ln();
    }
    $this->SetX(20);
  }
}

//$size = $data['size'];

// -------------------------формирование страницы PDF---------------------------

$task = $data['task'];
$round = $data['round'];

$p = new PDF('P', 'mm', 'A4');
$p->AddFont('gost', '', 'gost-type-a.php');
$p->AddFont('gost', 'B', 'gost_b.php');
$p->SetAutoPageBreak(0);

// метаданные
$p->SetAuthor("NIIIS", true);
$p->SetTitle('Задание на производство', true);
$p->SetSubject("ID", true);

// параметры страницы
$frame = $p->get_frame();
$x = 10;
$y = 10;
$w_str = 4.9;
$p->SetMargins(0, 0, 0);
$p->AddPage();
$p->SetFont('gost', '', 10);

$header = array($p->conv('ФИО'),$p->conv('Должность'),$p->conv('Техоперации'),$p->conv('Задание'),);
$p->SetXY($x, $y);
$p->ImprovedTable(10,10, $header, $task);


$p->Output();
?>