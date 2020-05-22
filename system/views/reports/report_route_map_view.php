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
}

//$size = $data['size'];

// -------------------------формирование страницы PDF---------------------------

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





$p->Output();
?>