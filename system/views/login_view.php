<?php
$data['message']='';
if(isset($_POST['login']) && isset($_POST['password'])){
  $aut=sys::autorization($_POST['login'], $_POST['password'], $_POST['is']);
  if($aut['result']=='1'){
    header('location:'.$_SERVER["REQUEST_URI"]);
  }else{
    $data['message']='<p>Неверный логин/пароль</p>';
  }
}
?><!DOCTYPE html>
<html lang="ru">
    <head>
        <title><?= $data['title']; ?></title>
        <meta charset="UTF-8" />
        <script type="text/javascript" src="<?php echo conf::$SITE_URL ?>js/jquery-1.11.3.min.js"></script>
        
        <!-- bootstrap -->
        <link href="<?php echo conf::$SITE_URL ?>css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <script src="<?php echo conf::$SITE_URL ?>js/bootstrap.min.js" type="text/javascript"></script>
        
        <script src="<?php echo conf::$SITE_URL ?>js/login.js" type="text/javascript"></script>
        <link rel="stylesheet" href="<?php echo conf::$SITE_URL ?>css/login.css">
        
      <div class="header">
        <div class="container header-text" style="text-align: center">
          <p><?php echo conf::$SITE_NAME?></p>
        </div>
      </div>
    </head>
    <body> 
        
      
      
        <div class="row">
          <div class="login-cont text-center">
            <br>

            <?php if(!empty($data['message'])):?>
            <div class="alert alert-warning alert-dismissible" role="alert">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <strong>Ошибка!</strong> <?=$data['message']?>
            </div>
            <?php endif;?>


            <form method="post" class="center-block login_form">
              <div class="form-group">
                <input type="text" class="form-control" name="login" placeholder="Логин" title="Логин" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" name="password" placeholder="Пароль" title="Пароль" required>
              </div>
              <div class="btn-group btn-group-justified" role="group">
                <div class="btn-group" role="group">
                  <button type="submit" class="btn btn-default center-block">Войти</button>
                </div>
              </div>
              <input type="hidden" name="is" value="abitprof">
            </form>
          </div>
        </div>
    </body>
</html>

