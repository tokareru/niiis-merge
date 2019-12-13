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
    <title>Спецификация</title>
</head>
<body>
<div id="specificationBlock">
    <!--<script src="js/specification_table.js"></script>-->
    <div class="col-md-12 spec_main">
        <div class="row">
            <div class="col-md-12 spec_header">
                Спецификация
            </div>
        </div>

        <div class="row">
            <div class="table_made col-md-12 table-responsive">
            </div>
        </div>

        <form>
          <div class="form-group">
            <label for="choosePdmSelect"><div>Выберите изделие</div></label>
            <select class="form-control col-3" id="choosePdmSelect">
                <option value='pdm_component_1'>Деталь 1</option>
                <option value='pdm_component_2'>Деталь 2</option>
                <option value='pdm_component_3'>Деталь 3</option>
                <option value='pdm_component_4'>Деталь 4</option>
            </select>
          </div>
        </form>
        </br>
        <div class="row">
            <div id="specification_edit"></div>
        </div>

    </div>
</div>
</body>
</html>

