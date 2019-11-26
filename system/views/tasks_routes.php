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
<div id="tasks_routes" class="tasks_routes_main">
    <div>
         <div class="row">
            <div class="col-4" id="tasks_routes_info">
                <div class="tasks_routes_inner_div">
                    <p class="tasks_routes_inner_header">Дерево маршрутов</p>
                        <input type="button" disabled='disabled' id="tasks_active_routes" class="btn btn-custom btn-sm col-12" value="Активные маршруты">
                        <input type="button" id="tasks_completed_routes" class="btn btn-custom btn-sm col-12" value="Завершенные маршруты">
                </div>

                 <div class="tasks_routes_inner_div" id="tasks_list">
                      <p class="tasks_routes_inner_header">Список маршрутов: <span id="current_task_routes_list">Активные</span></p>
                      <div class="task_list">
                        <div id="tasks_list_div_active"></div>
                        <div id="tasks_list_div_completed"></div>
                      </div>
                 </div>
            </div>
            <div class="col-8" id="route_tree">
               <div class="tasks_routes_inner_div" id="tasks_composition">
                   <p class="tasks_routes_inner_header">Состав маршрута</p>
                   <div id="tasks_composition_div">

                   </div>
               </div>
            </div>

         </div>
    </div>
</div>
</body>
</html>
