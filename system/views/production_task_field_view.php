<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>

<div id="production_task_body">
  <div id="production_task_body_round_1_2">
    <div class='spec_header'>Задание на производство</div>
    <form>
      <div class="form-group">
        <label for="productionTaskSelectUserBody"><h5>Выберите сотрудника</h5></label>
        <select class="form-control col-5 shadow-none" id="productionTaskSelectUserBody">
        </select>
      </div>
    </form>
    <div id="prod_task_table_container">

    </div>
  </div>
  <div id="production_task_body_round_3">
    <div class='spec_header'>Задание на производство</div>
    <div class="row">
      <div class="col-6">
        <div id="product_tech_process_field_container">
          <div class="h4">Текущий техпроцесс</div>
          <div id="product_tech_process_field_drop" class="tech_process_table">

          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="h4">Список рабочих</div>
        <div id="workers_drop_area" style="list-style: none">

        </div>
      </div>
    </div>

  </div>
  <input type="button" class="btn-dark btn" value="Сохранить" id="product_task_save_button">
</div>
