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
        <div id="task_routes_add_button_div">
            <!--<input type="button" id="task_routes_add_button" value="Добавить маршрут" class="btn bg-dark text-white"
                    data-toggle="modal" data-target="#task_routes_add_modalWindow">-->
        </div>

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
                        <button id="create_task_route_clearBtn" type="button" class="btn bg-danger text-white">
                            Очистить
                        </button>
                        <button type="button" class="btn btn-secondary" id="create_task_route_closeBtn"
                                data-dismiss="modal">Закрыть
                        </button>
                        <button id="create_task_route_saveBtn" type="button" class="btn bg-dark text-white">Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ul class="pl-0">
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
            <li>
                <span class="caret">
                    Мои маршруты
                </span>
                <ul class="nested">
                    <div id="task_routes_own_routes"></div>
                </ul>
            </li>
        </ul>
        <button id="task_routes_own_routes_update" class="btn bg-dark text-center text-white">Обновить</button>

        <!-- Modal -->
        <div class="modal fade" id="task_routes_cancelModal" tabindex="-1" role="dialog"
             aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content h-50">
                    <div class="modal-header">
                        <h5 class="modal-title font-weight-bold">Причина отказа</h5>
                        <button type="button" class="close shadow-none outline-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                            <textarea class="w-100 h-75 form-control-sm text-left" id="task_routes_cancelModalTextarea" placeholder="Укажите причину отказа..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="task_routes_cancelModalCloseBtn" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-dark" id="task_routes_cancelModalCancelBtn">Отклонить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--<div id="task_routes_my_tasks">
        <div id="task_routes_my_tasks_button" class="float-left"></div>
        <div id="task_routes_my_tasks_content" class="float-right">
            <div id="task_routes_own_routes"></div>
        </div>
    </div>-->
</div>
</body>
</html>
