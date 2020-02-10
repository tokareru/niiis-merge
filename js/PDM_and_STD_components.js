function createPDM(event, json_Role_and_Round) {
    set_PDM_or_STD("json/PDM_images.json", "#left-accordion", "#pdm_field");
    //$('#left-accordion').find('.pdm_draggable').draggable();
}

function createSTD(event, json_Role_and_Round) {
    set_PDM_or_STD("json/stdPDM_images.json", "#left-accordion", "#std_field");
}

function set_PDM_or_STD(imagesURL, accordID, fieldID) {
    // получем и устанавливаем картинки в поле pdm или std
    $.ajax({
        type: "POST",
        url: imagesURL,
        dataType: "json",
        success: function (json) {
            let div = $(accordID).find(fieldID);
            div.append("<fieldset></fieldset>");
            let field = $(accordID + " " + fieldID + " fieldset");
            let array;
            if (Round === 3) {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: "spec_autoentered_table_ajax/load_product_checked",
                    success: function (data) {
                        array = data;
                    }
                })
                //console.log(array)
            }
            json.images.forEach(function (elem, i) {
                if (Round < 3) addNewComponent(elem, accordID, fieldID, true)
                else {
                    //addNewComponent(elem, accordID, fieldID, true);
                    let check = true;
                    array.checked.forEach(function (value) {
                        if (elem.ID == value && check){
                            addNewComponent(elem, accordID, fieldID, true)
                            check = false;
                    }
                    })
                    if (check) addNewComponent(elem, accordID, fieldID, false);

                }
            });
            //$("#left-accordion").accordion("refresh");
        },
        error: function (message) {
            //console.log("Error");
        },
    })
}

function addNewComponent(data, accordID, fieldID, isChecked) {
    let field = $(accordID + " " + fieldID + " fieldset");
    if (isChecked) {
        field.append(
            "<p class='pdm_draggable'><label for=\"" + data.ID + "\">" +
            "<img src=\"" + data.IMG + "\">" + data.name + "</label><input checked='checked' type=\"checkbox\"" +
            " name=\"" + data.ID +
            "\" id=\"" + data.ID + "\">" + "</p>"
        );
        makeCheckbox(fieldID, isChecked);
    } else {
        field.append(
            "<p class='pdm_draggable ui-draggable ui-draggable-handle'><label for=\"" + data.ID + "\">" +
            "<img src=\"" + data.IMG + "\">" + data.name + "</label><input type=\"checkbox\"" +
            " name=\"" + data.ID +
            "\" id=\"" + data.ID + "\">" + "</p>"
        );
        makeCheckbox(fieldID, isChecked);
        field.find("p").last().draggable({
            helper: 'clone'
        });
    }
}


function makeCheckbox(fieldID, isChecked) {

    /*$('#left-accordion').find('.pdm_draggable').draggable(
        {
            helper: 'clone'
        }
    );*/
    /*  $('#scheme1').droppable(
          {
              drop: function (event, ui) {
                  console.log('dropped');
                  $(this).css({'background-color': 'yellow'})
                      .find('p').text('dropped!');
              }
          }
      );*/

    let $checkboxid = $(fieldID).find("p").last();

    let label = $checkboxid.find("label");
    label.addClass('check_std');
    if (isChecked){
        label.addClass('check_active');
        label.html("<span class='check_icon check_icon fa material-icons check_icon-checked ui-icon-check fa-check'></span>" + label.html());
    }   else {
        label.addClass('check_non-active');
        label.html("<span class='check_icon check_icon fa material-icons ui-icon-check fa-check check_icon-non fa-circle-thin'></span>" + label.html());
    }

    //скрывает теги input
    $checkboxid.find('input').attr('style', 'visibility: hidden');

    //checkbox
    $checkboxid.find('input').on('click', function () {
        let $input = $(this);
        let id = $(this).attr('id');
        $(this).parent().children().each(function (val, obj) {
            let $obj = $(obj);
            if ($obj.attr('for') === id) {
                if (!($obj.hasClass('check_active'))) {
                    $obj.removeClass('check_non-active');
                    $obj.addClass('check_active');
                    $obj.children().each(function (val, objspan) {
                        let $span = $(objspan);
                        $span.removeClass('check_icon-non');
                        $span.removeClass('fa-circle-thin');
                        $span.addClass('check_icon-checked');
                        $span.addClass('ui-icon-check fa-check');
                        //$input.parent('p').removeClass('ui-draggable ui-draggable-handle pdm_draggable');
                    });
                    $input.parent('p').draggable("destroy");
                } else {
                    $obj.removeClass('check_active');
                    $obj.addClass('check_non-active');
                    $obj.children().each(function (val, objspan) {
                        let $span = $(objspan);
                        $span.removeClass('check_icon-checked');
                        $span.addClass('check_icon-non fa-circle-thin');
                        $input.parent('p').addClass('ui-draggable ui-draggable-handle pdm_draggable');
                    });
                    $input.parent('p').draggable(
                        {
                            helper: 'clone'
                        }
                    );
                }
            }

        })
    });

    $checkboxid.find("input").click(function (e) {
        let arrayClicked = collectDataLabels(".left-side");
        showhideimage(arrayClicked, $(this));
        load3d(arrayClicked, $(this));
    });

    $checkboxid.find('img').on('dragstart', function (event) {
        event.preventDefault();
    });
}

//функция сбора данных checkbox, возвращает массив имен отмеченных input'ов
function collectDataLabels(id_div) {
    let $ser = $(id_div).find("fieldset").serializeArray();
    let arr = [];
    $ser.forEach(function (val) {
        arr.push(val.name);
    });
    //console.log(id_div + ":" + arr);
    esiNotifyHandler(arr);

    if (Round === 3){
        let amountOfChecked = $("#left-accordion").find("input:checked").length;
        let amountOfInputs = $("#left-accordion").find("input").length;
        let field3D = $("#field3DAll");

        if (Round === 3 && Role === 'designer'){
            if (amountOfChecked !== amountOfInputs){
                blockScheme()
            }else {
                unlockScheme();
                $.ajax({
                    type: "POST",
                    url: "drawing_main_text_ajax/save_is_full",
                    dataType: "json",
                    data:
                        {
                            "isFull": "true"
                        },
                    success: function (answer) {
                        console.log(answer);
                    }
                });
            }
        }

    }

    if (id_div === "#pdm_field") {
        sendMessage({
            "sender": id_div,
            "message_id": "checkedPdmComponents",
            "data": arr
        });
    } else {
        sendMessage({
            "sender": id_div,
            "message_id": "checkedStdComponents",
            "data": arr
        });
    }
    return arr;
}

function PdmOrStdHandler(event, data) {
    if (data.message_id === "checkedPdmComponents") {
        let text = data.data.join(", ");
        if (text.length) $("#availablePDM").text(text);
        else $("#availablePDM").text(" Пока что ничего не выбрано")
    } else if (data.message_id === "checkedStdComponents") {
        let text = data.data.join(", ");
        if (text.length) $("#availableSTD").text(text)
        else $("#availableSTD").text(" Пока что ничего не выбрано")
    }
}

function showhideimage(arrayComp, obj) {
    if (window.isEnded != undefined || window.isEnded == true) {
        arr = $('img');
        if (obj[0].checked) {
            for (i = 0; i < arr.length; i++) {
                if (arr[i].id != '') {
                    for (j = 1; j < 4; j++) {
                        if (arr[i].id.substr(0, 12) == "bolthideimg" + j && arrayComp.indexOf('std_component_' + j) != -1) {
                            arr[i].style.display = '';
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < arr.length; i++) {
                if (arr[i].id != '') {
                    for (j = 1; j < 4; j++) {
                        if (arr[i].id.substr(0, 12) == "bolthideimg" + j && arrayComp.indexOf('std_component_' + j) == -1) {
                            arr[i].style.display = 'none';
                        }
                    }
                }
            }
        }
    } else {
        obj[0].checked = false;
        obj[0].labels[0].className = "check_std check_non-active";
        obj[0].labels[0].children[0].className = "check_icon-non check_icon fa fa-circle-thin material-icons";
        //console.log(obj[0].labels[0].className);
        //alert('Необходимо закончить рисование и нажать "Готово"');
    }
}

function load3d(array, obj = {0: {"checked": "true"}}) {
    if (window.isEnded != undefined && window.isEnded == true) {
        if (obj[0].checked) {
            for (i = 0; i < 4; i++) {
                if (array.indexOf('component_' + (i + 1)) != -1) {
                    //meshs[stldata[i][2]].visible = true;
                    for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                        MeshsLinesScheme[stldata[i][2]][j].visible = true;
                    }
                }
            }

            for (i = 0; i < 3; i++) {
                if (array.indexOf('std_component_' + (i + 1)) != -1) {
                    //meshs[stldata[i+4][2]].visible = true;
                    for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                        MeshsLinesScheme[stldata[i + 4][2]][j].visible = true;
                    }
                }
            }
            if (typeof scene != "undefined") {
                window.renderer.render(scene, camera);
            }
            //window.renderersc.render(scenesc, camerasc);
        } else {
            for (i = 0; i < 4; i++) {
                if (array.indexOf('component_' + (i + 1)) == -1) {
                    //meshs[stldata[i][2]].visible = false;
                    for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                        MeshsLinesScheme[stldata[i][2]][j].visible = false;
                    }
                }
            }

            for (i = 0; i < 3; i++) {
                if (array.indexOf('std_component_' + (i + 1)) == -1) {
                    //meshs[stldata[i+4][2]].visible = false;
                    for (let j = 0; j < MeshsLinesScheme[stldata[i][2]].length; j++) {
                        MeshsLinesScheme[stldata[i + 4][2]][j].visible = false;
                    }
                }
            }
            if (typeof scene != "undefined") {
                window.renderer.render(scene, camera);
            }
            //window.renderersc.render(scenesc, camerasc);
        }
    } else {
        //alert()
    }
}

