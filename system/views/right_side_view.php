<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Right-side</title>
</head>
<body>
<!--Правая сторона-->
<div id="right-side">
    <div class='slider_main'>
        <div class='slider_button border border-info bg-dark'>
            <div class='font-weight-bold transformed'>ЭСИ</div>
        </div>
        <div id="esi_field" class='bg-light border border-info'>
            <div class='spec_header' style="text-align: center;"><span>Электронный состав изделия</span></div>
            <div class="esi_branch_body">
                <li style="list-style: none">
                    <span class="caret" id="esi_branch_body_header_span"></span>
                    <ul id="esi_branch_body" class="bg-light col-12 nested">
                    </ul>
                </li>
            </div>
        </div>
    </div>
</div>

</body>
</html>
