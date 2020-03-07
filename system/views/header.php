<div class="btn-group ml-3">
    <button type="button" class="btn btn-outline-light dropdown-toggle userNicknameButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="text-monospace alert-dismissible">Меню</span>
    </button>
    <div class="dropdown-menu dropdown-menu-xl-right">
        <!--<p class="pr-4 pl-4 alert-link">Информ</i></p>
        <div class="dropdown-divider"></div>-->

        <div class="dropdown-item disabled">
            <span class="bold">Ваш логин:</span> <span class="ml-2 font-italic"><?php echo sys::user_login();?></span>
        </div>

        <div class="dropdown-item disabled">
            <span class="bold">Ваша роль:</span> <span class="ml-2 font-italic"><?php echo $_SESSION['niiis']['role'] ?></span>
        </div>

        <div class="dropdown-item disabled">
            <span class="bold">Текущий раунд:</span> <span class="ml-2 font-italic"><?php echo $_SESSION['niiis']['round'] ?></span>
        </div>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="print_report" target="_blank">
            <!--<input id="print_btn" type="button" value="Печать">-->
            Печать
        <a/>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" style="text-decoration: none;" href="<?php echo conf::$SITE_URL . 'logout' ?>">Выйти</a>
    </div>
</div>

<!--<div class=''>
    <div class="row">
        <div class="col-4">
            <div class="row">
                <div class="col-5">Ваш логин:</div>
                <div class="col-4"><?php echo sys::user_login();?>
                </div>
            </div>
        </div>
        <div class="col-4">
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
        <div class="col-1"><a class="medium red awesome" href="<?php echo conf::$SITE_URL . 'logout' ?>">Выйти</a></div>
    </div>
</div>-->
