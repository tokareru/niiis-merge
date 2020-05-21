<div id="menuBody" class="btn-group mr-auto ml-sm-auto ml-xl-3 d-none">
    <button type="button" class="btn btn-outline-light dropdown-toggle userNicknameButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="text-monospace alert-dismissible">Меню</span>
    </button>
    <div class="dropdown-menu dropdown-menu-xl-right">
        <div class="dropdown-item disabled">
            <span class="bold">Ваш логин:</span> <span class="ml-2 font-italic" id="current_login_field"></span>
        </div>

        <div class="dropdown-item disabled">
            <span class="bold">Ваша роль:</span> <span class="ml-2 font-italic" id="current_role_field"></span>
        </div>

        <div class="dropdown-item disabled">
            <span class="bold">Текущий раунд:</span> <span id="current_round_number" class="ml-2 font-italic"></span>
        </div>
        <div class="dropdown-divider"></div>
        <a id="print_report_button" class="dropdown-item logoutButton d-inline-flex" href="print_report" target="_blank">
            <!--<input id="print_btn" type="button" value="Печать">-->
             Печать <i class="fas fa-print ml-auto"></i>
        <a/>
        <div class="dropdown-divider"></div>
        <a id="exit_button" class="dropdown-item logoutButton d-inline-flex" style="text-decoration: none; cursor: pointer">
            Выйти <i class="fas fa-sign-out ml-auto"></i>
        </a>
    </div>
</div>
