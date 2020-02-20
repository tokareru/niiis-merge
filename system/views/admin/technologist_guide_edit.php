<main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2"><?php echo 'Справочник технолога' ?></h1>
  </div>
  <div class="mb-md-0">
    <div id="technologist_guide_field">
      <table border="bordered">
        <?php
        $id_1_layout = 0;
        $id_2_layout = 0;
        foreach ($data as $row) {
          echo "<tr><td><input class='1lvl' id=" . ++$id_1_layout . " value='" . $row["name"] . "'></td><td></td><td></td><td></td></tr>";
          foreach ($row["children"] as $item) {
            echo "<tr><td></td><td><input class='2lvl' name=" . $id_1_layout . " id=" . ++$id_2_layout . " value='" . $item["name"] . "'></td><td></td><td></td></tr>";
            echo "<tr><td></td><td></td><td>Инструменты:</td><td></td></tr>";
            foreach ($item["tools"] as $tools) {
              echo "<tr><td></td><td></td><td></td><td><input class='tools' name=" . $id_2_layout . " value='" . $tools["name"] . "'></td></tr>";
            }
            echo "<tr><td></td><td></td><td>Приборы:</td><td></td></tr>";
            foreach ($item["equipment"] as $equipment) {
              echo "<tr><td></td><td></td><td></td><td><input class='equipment' name=" . $id_2_layout . " value='" . $equipment["name"] . "'></td></tr>";
            }
          }
        }
        ?>
      </table>
      <button class="btn btn-default" id="save">Сохранить</button>
    </div>
  </div>
</main>