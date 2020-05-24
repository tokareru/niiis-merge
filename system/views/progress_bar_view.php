<nav class="navbar navbar-expand-lg navbar-light fixed-bottom pb-1" id="progress-bar-container">
    <button class="navbar-toggler outline-none" type="button" data-toggle="collapse" data-target="#progress-bar-collapse-div"
            aria-controls="progress-bar-collapse-div" aria-expanded="false" aria-label="Toggle navigation" style="z-index: 10">
        <span class="font-family-fontAwesome fas fa-tasks"></span>
    </button>
    <div class="bg-light position-absolute" id="progress-bar-body-blur"></div>

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

        <div class="btn-group dropup mr-auto" id="progress-bar-to-do-list-body">
            <button id="to-do-list-open-button" type="button" class="btn btn-outline-secondary ml-1 dropdown-toggle"
                    data-trigger="click" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="text-monospace mr-3">Навигатор</span>
            </button>
            <div id="progress-bar-to-do-list" class="dropdown-menu dropdown-menu-lg-right pr-3">
                <span class="refreshToDoListButton font-size-12-em font-family-fontAwesome fa-refresh"></span>
            </div>
        </div>
    </div>
</nav>
<div id="progress-bar-line-body" class="progress position-fixed d-none" title="Задачи">
    <div id="progress-bar-line" class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
</div>
