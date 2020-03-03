$(function () {
    let is_load = false;
    //Обрабатывает нажатие "карандаша" открывает модальное окно для редактирования
    $(".edit").on("click", function () {
        is_load = false;
        $('#edit_users').modal("show");
        var id = $(this).parents("tr:first").attr("id");
        $('#edit_users #id').val(id);
        $.ajax({
            url: "get_user_info_by_id",
            type: "POST",
            data: {
                id: id,
            },
            success: function (answer)
            {

                $('#edit_users #first_name').val(answer.first_name);
                $('#edit_users #last_name').val(answer.last_name);
                $('#edit_users #otc').val(answer.otc);
                $('#edit_users #login').val(answer.login);
                $('#edit_users #password').val(answer.password);
                $('#edit_users #loading').attr("hidden", "hidden");
                $('#edit_users #content').removeAttr("hidden");
                is_load = true;
            }
        });

    })
    //Обрабатывает нажатие на кнопку сохранения в модальном окне редактирования
    $("#edit_users #save").on("click", function () {
        if (is_load) {
            $.ajax({
                url: "save_users_edit",
                type: "POST",
                data: {
                    id: $("#edit_users #id").val(),
                    first_name: $("#edit_users #first_name").val(),
                    last_name: $("#edit_users #last_name").val(),
                    otc: $("#edit_users #otc").val(),
                    login: $("#edit_users #login").val(),
                    password: $("#edit_users #password").val(),
                },
                success: function (answer)
                {
                    console.log(answer);
                    var id = $("#edit_users #id").val();
                    var changed_row = "#table_edit #" + id + " ";
                    var fio = $("#edit_users #last_name").val() + ' ' + $("#edit_users #first_name").val() + ' ' + $("#edit_users #otc").val()
                    $(changed_row + "#fio").html(fio);
                    $(changed_row + "#login").html($("#edit_users #login").val());
                    $(changed_row + "#password").html($("#edit_users #password").val());
                    $("#edit_users").modal("hide");
                }
            });
        }
    });
    //сохраняет флаг активности при изменении
    $(".active_sign").on("change", function () {
        var id = $(this).parents("tr:first").attr("id");
        $.ajax({
            url: "change_user_active_sign",
            type: "POST",
            data: {
                id: id,
            },
            success: function (answer)
            {
                console.log(answer);
            }
        });
    })
    //сохраняет роль пользователя при изменении
    $(".role").on("change", function () {
        var id = $(this).parents("tr:first").attr("id");
        $.ajax({
            url: "change_user_role",
            type: "POST",
            data: {
                id: id, role_id: $(this).val()
            },
            success: function (answer)
            {
                console.log(answer);
            }
        });
    })

    $("#add_user").on("click", function () {
        $('#create_user').modal("show");
    })

    $("#create_user #save").on("click", function () {
        $.ajax({
            url: "add_user",
            type: "POST",
            data: {
                first_name: $("#create_user #first_name").val(),
                last_name: $("#create_user #last_name").val(),
                otc: $("#create_user #otc").val(),
                login: $("#create_user #login").val(),
                password: $("#create_user #password").val(),
                group_user_id: $("#create_user #role").val()
            },
            success: function (answer)
            {
                console.log(answer);
                var fio = $("#create_user #last_name").val() + ' ' + $("#create_user #first_name").val() + ' ' + $("#create_user #otc").val()
                $.ajax({
                    url: "get_users_groups",
                    type: "GET",
                    data: {
                        group_user_id: $("#create_user #role").val()
                    },
                    success: function (response)
                    {
                        $("#table_edit").append('<tr id = "' + answer.id + '">\
                    <td><button class = "glyphicon glyphicon-pencil edit"></button></td>\
                    <td><button class = "glyphicon glyphicon-remove delete"></button></td> \
                    <td id = "id">' + answer.id + '</td>\
                    <td id = "fio">' + fio + '</td>\
                    <td id = "login">' + $("#create_user #login").val() + '</td>\
                    <td id = "password">' + $("#create_user #password").val() + '</td>\
                    <td>' + response + '</td>\n\
                    <td><div class="form-check"><input class="form-check-input active_sign" type="checkbox" id = "active_sign" name="active_sign" checked\
                    ></div></td>\
                    </tr>');
                    }
                });
                $("#create_user").modal("hide");
                location.reload();
            }
        });
    })

    $(".delete").on("click", function () {
        let item = $(this);
        var id = $(this).parents("tr:first").attr("id");
        if (confirm("Вы уверены , что хотите удалить?")) {
            
            $(this).removeClass("glyphicon glyphicon-remove");
            $(this).html("Удаление...");
            $(this).attr("disabled", "disabled");
            $(this).parents("tr:first").attr("disabled", "disabled");
            $.ajax({
                url: "delete_user",
                type: "POST",
                data: {
                    id: id
                },
                success: function (answer) {
                    console.log(answer);
                    item.parents("tr:first").remove();
                }
            });
        }
    })
});