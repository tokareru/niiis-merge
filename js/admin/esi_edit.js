$(function () {

    $("#change_esi").on("change", function () {
        var id = $(this).children("option:selected").val();
        $("#esi").html("загрузка...");
        $.ajax({
            url: "get_esi_edit",
            type: "GET",
            data: {id: id},
            success: function (answer) {
                $("#esi").html(answer);
                $("#esi_save").on("click", function () {
                    let thisButton = this;
                    var id = $("#change_esi").children("option:selected").val();
                    var name = $("#esi #name").val();
                    var designation = $("#esi #designation").val();
                    var position = $("#esi #position").val();
                    var path_3d = $("#esi #path_3d").val();
                    var path_picture = $("#esi #path_picture").val();
                    var number = $("#esi #number").val();
                    var type_id = $("#esi #type").children("option:selected").val();
                    var files = $("#esi #file")[0].files;
                    if (files.length > 0) {
                        let hash = ToBase64(files[0]);
                    }
                    console.log({
                        id: id,
                        name: name,
                        designation: designation,
                        position: position,
                        path_3d: path_3d,
                        path_picture: path_picture,
                        number: number,
                        type_id: type_id
                    });
                    startProcessOfSaving(thisButton);
                    $.ajax({
                        url: "save_esi_edit",
                        type: "POST",
                        data: {
                            id: id,
                            name: name,
                            designation: designation,
                            position: position,
                            path_3d: path_3d,
                            path_picture: path_picture,
                            number: number,
                            type_id: type_id
                        },
                        success: function (answer) {
                            console.log(answer);
                        },
                        complete: function () {
                            stopProcessOfSaving(thisButton);
                        }
                    });
                });
            }
        });
    }).trigger("change");

    function ToBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            /*let str = reader.result;
            str = str.substr(str.indexOf('base64')+7);*/
            return reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


});


