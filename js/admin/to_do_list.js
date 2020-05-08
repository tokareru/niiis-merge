$(function () {
    $.ajax({
        url: 'get_change_users',
        type: 'GET',
        success: function (data) {
            addlogins(data);
            console.log(data)
        },
        error: function (data) {
            console.log('error');
        }
    });

    $( "#addTask" ).on( "click", function() {
        createTask();
    });

    $( "#saveUserTasks" ).on( "click", function() {
        alert();
    });

    $("#change_user_login").change(function() {
        checkOnchange();
    });

    $("#change_user_round").change(function() {
        checkOnchange();
    });

    $(".taskselect").change(function() {

    })

});

function addlogins(d)
{
    for (let i=0; i<d.users.length; i++)
    {
        $("#change_user_login").append("<option value="+(i+1)+">"+d.users[i][0]+"</option>")
    }
}

function createTask()
{
    let t = getTasks();
    let count = $(".tasknumber").length+1;
    let code = `<span class="tasknumber">Задача №`+count+`</span>
	<div class="task">
	<div>
	Описание
	<textarea class="form-control form-control-col-1">test</textarea>
	</div>
	<div class="taskselect">
	Выберите действие
	<select class="form-control" id="task`+count+`">
	<option></option>
	</select>
	</div>
	</div>`;
    $("#contentblock").append(code);

    for (let i=0; i<t.tasks.length; i++)
    {
        $("#task"+count).append("<option value="+(i+1)+">"+t.tasks[i].text+"</option>");
    }

}

function checkOnchange()
{
    if ($("#change_user_login").prop('selectedIndex') !== 0 && $("#change_user_round").prop('selectedIndex') !== 0)
    {
        let t = getTasks();
        for (let i=0; i<t.tasks.length; i++)
        {
            //$("#task"+$(".tasknumber").length+1).append("<option value="+(i+1)+">"+d.users[i][0]+"</option>")
            // ajax получить задачи для каждого логина и раунда
        }
        $("#actionButtons").show();
    }
    else
    {
        $("#actionButtons").hide();
    }
}

function getTasks()
{
    var h;
    $.ajax({
        type: 'GET',
        async : false,
        url: '../json/to_do_list_config.json',
        success: function (json) {
            h = json;
        }
    });
    return h;
}





