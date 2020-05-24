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
        <div class="h4" id="worker_product_list_header"></div>
        <div id="workers_drop_area" style="list-style: none">

        </div>
      </div>
    </div>

  </div>
  <div class="d-flex">
    <button class="btn-dark btn d-inline mr-2 ml-auto" id="product_task_save_button">Сохранить</button>
    <button class="reloadButtonToHide btn-dark btn d-inline mr-2 font-family-fontAwesome fa-refresh" id="product_task_reload_button"></button>
    <button class="btn bg-dark mr-auto text-white" id="productionTaskPrintLink">Печать</button>
  </div>

</div>
