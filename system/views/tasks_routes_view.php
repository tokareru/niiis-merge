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
    <div id="task_routes_tree">
        <h2 class="font-weight-bold">Дерево маршрутов</h2>
        <input type="button" id="task_routes_add_button" value="Добавить маршрут" class="btn bg-dark text-white"
               data-toggle="modal" data-target="#task_routes_add_modalWindow">

        <div class="modal fade" tabindex="-1" role="dialog" id="task_routes_add_modalWindow" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content" id="create_task_route_mainModel">
                    <div class="modal-header">
                        <h5 class="modal-title font-weight-bold">Добавить маршрут</h5>
                        <button type="button" class="close shadow-none outline-none" data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table id="create_task_route_RouteList">
                            <thead>
                            <tr>
                                <th style="width: 25px; max-width: 25px; min-width: 25px;"></th>
                                <th style="width: 36px; max-width: 36px; min-width: 36px">№</th>
                                <th style="width: 210px; max-width: 210px; min-width: 210px">Должность</th>
                                <th style="width: 200px; max-width: 200px; min-width: 200px">Пользователь</th>
                                <th style="width: 195px; max-width: 195px; min-width: 195px">Задание</th>
                                <th style="width: 200px; max-width: 200px; min-width: 200px">Комментарий</th>
                            </tr>
                            </thead>
                            <tbody id="create_task_route_tbody">
                            <tr id="create_task_route_RouteListAddTr">
                                <td id="create_task_route_RouteListAdd">&#10010;</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button id="create_task_route_clearBtn" type="button" class="btn bg-danger text-white">Очистить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button id="create_task_route_saveBtn" type="button" class="btn bg-dark text-white">Сохранить</button>
                        <button id="create_task_route_testBtn" type="button" class="btn bg-dark text-white">test</button>
                    </div>
                </div>
            </div>
        </div>

        <ul>
            <li>
                <span class="caret">
                    Маршруты активные
                </span>
                <ul class="nested" id="task_routes_active_routes">

                </ul>
            </li>
            <li>
                <span class="caret">
                    Маршруты завершенные
                </span>
                <ul class="nested" id="task_routes_ended_routes">

                </ul>
            </li>
        </ul>

    </div>
    <!--<div>
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
    </div>-->
</div>
</body>
</html>
