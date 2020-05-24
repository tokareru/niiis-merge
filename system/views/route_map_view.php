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
</head>
<body>

<div id="routeMapBlock">
    <div class='spec_header'>Маршрутная карта</div>

    <div class="table-responsive-md">
        <table id='tech_process_table' class='table table-bordered tech_process_table'>
            <tbody>

            </tbody>
        </table>
    </div>
    <div class="d-flex">
        <button id='tech_process_save' class="btn bg-dark ml-auto mr-2 text-white hidden">Сохранить</button>
        <button id='tech_process_reload' class="reloadButtonToHide btn bg-dark mr-2 text-white hidden font-family-fontAwesome fa-refresh"></button>
        <button class="btn bg-dark mr-auto text-white">
            <a class="text-decoration-none text-white" target="_blank" href="print_report/route_map">Печать</a>
        </button>
    </div>
</div>

</body>
</html>
