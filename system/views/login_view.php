<?php
$data['message'] = '';
if (isset($_POST['login']) && isset($_POST['password'])) {
  $aut = sys::autorization($_POST['login'], $_POST['password']);
  if ($aut['result'] == '1') {
    header('location:' . $_SERVER["REQUEST_URI"]);
  } else {
    $data['message'] = 'Ошибка! Неверный логин или пароль!';
  }
}
?><!DOCTYPE html>
<html lang="ru">
  <head>
    <title><?= $data['title']; ?></title>
    <meta charset="UTF-8" />
    <?php 
    
    sys::inc_no_cache('css', 'css/bootstrap.css');
    sys::inc_no_cache('js', 'js/bootstrap.js');
    
    sys::inc_no_cache('css', 'css/login.css');
    sys::inc_no_cache('js', 'js/login.js');
    ?>
    
  </head>
  <body> 
    <form class="form-signin login_form" method="post">

      <div class="text-center mb-4">
        <img class="mb-4" src="<?php echo conf::$SITE_URL ?>images/niiis_sm.png" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Цифровая фабрика<br>IT-процессов</h1>
      </div>

      <?php if (!empty($data['message'])): ?>
        <div class="alert alert-danger" role="alert">
          <?= $data['message'] ?>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      <?php endif; ?>

      <div class="form-label-group">
        <input type="text" id="inputLogin" class="form-control" name="login" placeholder="Логин" required autofocus>
        <label for="inputLogin">Логин</label>
      </div>

      <div class="form-label-group">
        <input type="password" id="inputPassword" class="form-control" name="password" placeholder="Пароль" required>
        <label for="inputPassword">Пароль</label>
      </div>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
      <p class="mt-5 mb-3 text-muted text-center">&copy; НГТУ им. Р.Е.Алексеева<br>
        <a href="http://62.109.26.219/pgadmin4/" target="_blank">pgAdmin</a></p>

    </form>
  </body>
</html>

