$(function () {
    let is_load = false;
    //Обрабатывает нажатие "карандаша" открывает модальное окно для редактирования
    $(".edit").on("click", function () {
        is_load = false;
        $('#edit_group_users').modal("show");
        var id = $(this).parents("tr:first").attr("id");
        $('#edit_group_users #id').val(id);
        $.ajax({
            url: "get_group_user_info_by_id",
            type: "POST",
            data: {
                id: id,
            },
            success: function (answer)
            {
                $('#edit_group_users #user_group_name').val(answer.user_group_name);
                $('#edit_group_users #user_status').val(answer.user_status);
                $('#edit_group_users #descr').val(answer.descr);
                $('#edit_group_users #loading').attr("hidden", "hidden");
                $('#edit_group_users #content').removeAttr("hidden");
                is_load = true;
            }
        });

    })
    //Обрабатывает нажатие на кнопку сохранения в модальном окне редактирования
    $("#edit_group_users #save").on("click", function () {
        if (is_load) {
            $.ajax({
                url: "save_groups_users_edit",
                type: "POST",
                data: {
                    id: $("#edit_group_users #id").val(),
                    user_group_name: $("#edit_group_users #user_group_name").val(),
                    user_status: $("#edit_group_users #user_status").val(),
                    descr: $("#edit_group_users #descr").val(),
                },
                success: function (answer)
                {
                    console.log(answer);
                    var id = $('#edit_group_users #id').val();
                    var changed_row = "#table_group_edit #" + id + " ";
                    $(changed_row + "#user_group_name").html($("#edit_group_users #user_group_name").val());
                    $(changed_row + "#user_status").html($("#edit_group_users #user_status").val());
                    $(changed_row + "#descr").html($("#edit_group_users #descr").val());
                    $("#edit_group_users").modal("hide");
                }
            });
        }
    });

    $("#add_group_user").on("click", function () {
        $('#create_group_user').modal("show");
    })

    $("#create_group_user #save").on("click", function () {
        $.ajax({
            url: "add_group_user",
            type: "POST",
            data: {
                user_group_name: $("#create_group_user #user_group_name").val(),
                user_status: $("#create_group_user #user_status").val(),
                descr: $("#create_group_user #descr").val(),
            },
            success: function (answer)
            {
                console.log(answer);
                $("#edit_group_users").append('<tr id = "' + answer.id + '">\
                <td><button class = "glyphicon glyphicon-pencil edit"></button></td>\
                <td><button class = "glyphicon glyphicon-remove delete"></button></td> \
                <td id = "id">' + answer.id + '</td>\
                <td id = "user_group_name">' + $("#create_group_user #user_group_name") + '</td>\
                <td id = "user_status">' + $("#create_group_user #user_status").val() + '</td>\
                <td id = "descr">' + $("#create_group_user #descr").val() + '</td>\
                </tr>');
                $("#create_group_user").modal("hide");
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
                url: "delete_group_user",
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