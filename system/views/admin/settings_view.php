<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2">Панель администратора</h1>
</div>
<div class="mb-md-0">
  <?php
  $name = $data["user_data"]["last_name"] . ' ' . $data["user_data"]["first_name"] . ' ' . $data["user_data"]["otc"];
  ?>
  <div class="container-fluid">
    <div class="row">

      <div class="col-lg-6">
        <h4 class="mb-3">Информация</h4>
        <div class="row">
          <div class="col-md-12 mb-3">
            <label class="font-weight-bold" for="firstName">Вы вошли как:</label>
            <input type="text" class="form-control" id="firstName" placeholder="" value="<?= $name ?>" required disabled>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 mb-3">
            <label class="font-weight-bold" for="firstName">Ваша роль:</label>
            <input type="text" class="form-control" id="firstName" placeholder="" value="<?= $data["user_data"]["user_group_name"] ?>" required disabled>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <h4 class="mb-3">Параметры</h4>
        <div class="row">
          <div class="col-md-12 mb-3">
            <label class="font-weight-bold" for="select_round">Текущий раунд</label>
            <div class="row">
              <select class="custom-select col-md-3" id="change_round">
                <option selected disabled>Выберите раунд...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <div class="col-md-5">
                <button class="btn btn-outline-secondary btn-block" id="change_round_btn" type="button">Применить</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <label for="firstName" class="font-weight-bold">Сбросить геймплей</label>
          </div>
          <div class="col-md-5">
            <button class="btn btn-danger btn-block" id="reset" type="button">Сброс</button>
          </div>
        </div>

      </div>
    </div>
  </div>
