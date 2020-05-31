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
    <div class='spec_header text-align-center'>Задание на производство</div>
    <div class="row">
      <div class="col-xl-6 techProcessCol">
        <nav class="mt-2 ml-3 mt-xl-0 navbar-expand-xl nav navbar-light">
          <button class="navbar-toggler mb-2 outline-none" type="button" data-toggle="collapse"
                  data-target="#product_tech_process_field_container" aria-controls="product_tech_process_field_container"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="product_tech_process_field_container">
            <div class="h4">Текущий техпроцесс</div>
            <div id="product_tech_process_field_drop" class="tech_process_table">

            </div>
          </div>
        </nav>
      </div>
      <div class="col-xl-6 workerAreaCol">
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
