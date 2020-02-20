<div class='container-fluid'>
    <div class="row">
        <div class="col-1"><a class="medium red awesome" href="<?php echo conf::$SITE_URL . 'logout' ?>">Выйти</a></div>
        <div class="col-3">
            <div class="row">
                <div class="col-5">Ваш логин:</div>
                <div class="col-4"><?php echo sys::user_login();?>
                </div>
            </div>
        </div>
        <div class="col-3">
            <div class="row">
                <div class="col-4">Ваша роль:</div>
                <div class="col-6"><?php echo $_SESSION['niiis']['role'] ?>
                </div>
            </div>
        </div>
        <div class="col-2">
            <div class="row">
                <div class="col-8">Текущий раунд:</div>
                <div class="col-4" id='current_round'><?php echo $_SESSION['niiis']['round'] ?>
                </div>
            </div>
        </div>
        
    </div>
</div>
