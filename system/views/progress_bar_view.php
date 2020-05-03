<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-bottom pb-1" id="progress-bar-container">
    <button class="navbar-toggler outline-none" type="button" data-toggle="collapse" data-target="#progress-bar-collapse-div" aria-controls="progress-bar-collapse-div" aria-expanded="false" aria-label="Toggle navigation">
        <span class="font-family-fontAwesome fas fa-tasks"></span>
    </button>

    <div class="collapse navbar-collapse" id="progress-bar-collapse-div">
        <div class="ml-auto text-center"><span class="navbar-brand">Прогресс</span></div>
        <button class="btn fa-archive font-family-fontAwesome hidden mt-1 shadow-none" id="previous-actions-button"
                data-toggle="popover" data-trigger="hover" data-placement="top" data-container="body"
                data-content="Показать предыдущие действия "></button>
        <button id="left-scroll-button-progress-bar" data-toggle="tooltip" data-placement="top" title="Нажмите дважды, чтобы пролистать список в начало"
                class="font-family-fontAwesome scroll-buttons fas fa-angle-left mr-4 btn-outline-dark border-0 bold btn"></button>
        <ul class="nav-sm-to-lg navbar-nav-lg" id="progress-bar-body">
        </ul>
        <button id="right-scroll-button-progress-bar" data-toggle="tooltip" data-placement="top" title="Нажмите дважды, чтобы пролистать список в конец"
                class="font-family-fontAwesome scroll-buttons fas fa-angle-right ml-4 btn-outline-dark border-0 bold btn"></button>

        <div class="btn-group dropup mr-auto">
            <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="text-monospace alert-dismissible">Навигатор</span>
            </button>

            <div id="progress-bar-to-do-list" class="dropdown-menu dropdown-menu-lg-right">

            </div>
        </div>
    </div>
</nav>
