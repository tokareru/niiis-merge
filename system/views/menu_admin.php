<?php
$user_id = sys::session('user_id');
?>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/" title="Admin panel"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <p class="navbar-text">db: <?php echo conf::$DB_NAME; ?></p>
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Меню <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="http://gitweb.test.ngtu.org/?p=<?php echo conf::$PROJECT_NAME;?>.git;a=summary" target='_blank'>GitWEB</a></li>
            <li role="separator" class="divider"></li>
          </ul>
        </li>
      </ul>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <?php
              // Выбор пользователя
              echo 'user: <select class="form-control select_user">';
              
              
              $sql = "select u.ID as USER_ID,u.LOGIN,ug.USER_STATUS "
                . "from USERS u "
                . "inner join USER_GROUP ug on ug.GROUP_ID=u.GROUP_USER_ID "
                . "where u.ACTIVE_SIGN=1 "
                . "order by u.GROUP_USER_ID,u.LOGIN";
              
              $q = sys::$PDO->prepare($sql);
              $q->execute();
              $Q = $q->fetchAll();
              foreach ($Q as $row) {
                echo '<option value="' . $row['user_id'] . '" ' . ($user_id == $row['user_id'] ? 'selected' : '') . '>' . $row['user_status'] . ' | ' . $row['login'] . '</option>';
              }
              echo '</select>';
              // --Выбор пользователя
              ?>
            </div>
          </form>
        </ul>
      </div>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
