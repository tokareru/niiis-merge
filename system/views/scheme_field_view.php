<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>1</title>
</head>
<body>
<!--<aside id="standarts">
    <h1>Стандартные изделия</h1>
    <div><input id="check1" type="checkbox"><img id="default1" src="images/scheme/bolt.jpg"></div>
    <div><input id="check2" type="checkbox"><img id="default2" src="images/scheme/din.png"></div>
</aside>-->
<section>
    <!-- Для вида спереди -->
    <div><img id="bolthideimg111" src="images/scheme/projections/standart/1/forward.png" style="display:none;"></div>
    <div><img id="bolthideimg112" src="images/scheme/projections/standart/1/forward.png" style="display:none;"></div>

    <div><img id="bolthideimg211" src="images/scheme/projections/standart/2/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg212" src="images/scheme/projections/standart/2/forward.png" style="display:none;"></div>

	<div><img id="bolthideimg311" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg312" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg313" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg314" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg315" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg316" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg317" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg318" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg319" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>
	<div><img id="bolthideimg310" src="images/scheme/projections/standart/3/forward.png" style="display:none;"></div>

	<!-- Для вида слева -->
	<div><img id="bolthideimg121" src="images/scheme/projections/standart/1/left.png" style="display:none;"></div>
	<div><img id="bolthideimg122" src="images/scheme/projections/standart/1/left.png" style="display:none;"></div>

	<div><img id="bolthideimg221" src="images/scheme/projections/standart/2/left.png" style="display:none;"></div>
	<div><img id="bolthideimg222" src="images/scheme/projections/standart/2/left.png" style="display:none;"></div>

	<div><img id="bolthideimg321" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>

	<!-- Для вида сверху -->
	<div><img id="bolthideimg131" src="images/scheme/projections/standart/1/up.png" style="display:none;"></div>
	<div><img id="bolthideimg132" src="images/scheme/projections/standart/1/up.png" style="display:none;"></div>
	<div><img id="bolthideimg133" src="images/scheme/projections/standart/1/up.png" style="display:none;"></div>
	<div><img id="bolthideimg134" src="images/scheme/projections/standart/1/up.png" style="display:none;"></div>

	<div><img id="bolthideimg231" src="images/scheme/projections/standart/2/up.png" style="display:none;"></div>
	<div><img id="bolthideimg232" src="images/scheme/projections/standart/2/up.png" style="display:none;"></div>
	<div><img id="bolthideimg233" src="images/scheme/projections/standart/2/up.png" style="display:none;"></div>
	<div><img id="bolthideimg234" src="images/scheme/projections/standart/2/up.png" style="display:none;"></div>

	<div><img id="bolthideimg331" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg332" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg333" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg334" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg335" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg336" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg337" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg338" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg339" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>
	<div><img id="bolthideimg330" src="images/scheme/projections/standart/3/left.png" style="display:none;"></div>

    <div><span class="typeproj">Вид спереди</span><canvas id="canv1"></canvas><img class="canvimg" src="images/scheme/abr/forward1gray.png"></div>

    <div><span class="typeproj">Вид слева</span><canvas id="canv2"></canvas><img class="canvimg" src="images/scheme/abr/left1gray.png"></div>

    <div><span class="typeproj">Вид сверху</span><canvas id="canv3"></canvas><img class="canvimg" src="images/scheme/abr/up1gray.png"></div>
    <button class="btn-block btn btn-primary" id="ready">Готово</button>
</section>
<span id="info" style="position: absolute;right: 0;top: 0;"></span>
</body>
</html>
