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
<div id='create_task_route-side' >

	<div class="main_all_create_task">
		<div class='slider_button_create border border-info bg-dark'>
            <div class='font-weight-bold transformed'>Создание маршрута заданий</div>
            </div>
		<div id='create_task_route_main' class='bg-light border border-info'>
				<div class="create_task_route_header"></div>
					<div class="content_create_task_route">
						<select class="form-control bg-dark text-white">
							<option>Маршрут согласования/утверждения</option>
							<option>Маршрут выдачи задания</option>
						</select>
						<table class="table table-striped table_create_task_route table-bordered table-hover">
					 	 	<thead>
					  			<tr>
							  		<th>№</th>
							  		<th>Участие</th>
							  		<th>Должность</th>
							  		<th>Пользователь</th>
							  		<th>Задание</th>
					  			</tr>
					 		</thead>
					  		<tbody>

					  		</tbody>
						</table>

					</div>
					<div class="create_task_route_button"><input type="button" value="Отправить"
                    							class="btn bg-dark text-white shadow-none"></div>
			</div>
	</div>

</div>

</body>
</html>
