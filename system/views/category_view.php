<script src="<?php echo conf::$SITE_URL ?>js/category.js"></script>
<!--<link rel="stylesheet" href="<?=conf::$SITE_URL ?>css/category.css">-->

<div class="container-fluid">
  <div class="row">
    <h3 style="margin-left: 15px">Категории</h3>
    <a class="btn btn-default new" href="<?=conf::$SITE_URL?>category/add" role="button">Добавить</a>
    <br>
    <br>
    <table class="table table-striped table-bordered table-hover table-condensed table-category">
      <thead>
        <tr>
          <th></th>
          <th>Категория</th>
        </tr>
      </thead>
      <tbody>
          <?php
          // получаем из модели массив с результатом для таблицы
          $result=$data['table'];
          // пробегаем по массиву и выводим
          while ($row = mssql_fetch_array($result)) {
            echo '<tr data-id="'.$row['CATEG_ID'].'">';
              echo '<td style="width: 35px;" align="center">';
                echo '<a href="" class="category_remove" title="Удалить"><span class="glyphicon glyphicon-remove"></span></a>  ';
                //отдельная кнопка для редактирования
                //echo '<a href="'.conf::$SITE_URL.'category/edit?categ_id='.$row['CATEG_ID'].'"><span class="glyphicon glyphicon-pencil category_edit"></span></a>';
              echo '</td>';
              echo '<td><a href="'.conf::$SITE_URL.'category/edit?categ_id='.$row['CATEG_ID'].'">'.$row['CATEG_NAME'].'</a></td>';
            echo '</tr>';
          }
          ?>
      </tbody>
    </table>
    <!--кнопка добавить-->
    <a class="btn btn-default new" href="<?=conf::$SITE_URL?>category/add" role="button">Добавить</a>
  </div>
</div>