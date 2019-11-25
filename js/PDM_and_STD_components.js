function createPDM(event, json_Role_and_Round) {
    set_PDM_or_STD("json/PDM_images.json", "#left-accordion", "#pdm_field");
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
            json.images.forEach(function (elem, i) {
                addNewComponent(elem, accordID, fieldID)
            });
            //$("#left-accordion").accordion("refresh");
        },
        error: function (message) {
            //console.log("Error");
        },
    })
}

function addNewComponent(data, accordID, fieldID) {
    let field = $(accordID + " " + fieldID + " fieldset");
    field.append(
        "<p><label for=\"" + data.ID + "\">" +
        "<img src=\"" + data.IMG + "\">" + data.name + "</label><input type=\"checkbox\"" +
        " name=\"" + data.ID +
        "\" id=\"" + data.ID + "\">" + "</p>"
    );
    makeCheckbox(fieldID);
}


function makeCheckbox(fieldID) {
    let $checkboxid = $(fieldID).find("p").last();

    let label = $checkboxid.find("label");
    label.addClass('check_std');
    label.addClass('check_non-active');
    label.html("<span class='check_icon-non check_icon fa fa-circle-thin material-icons'></span>" + label.html());

    //скрывает теги input
    $checkboxid.find('input').attr('style', 'visibility: hidden');

    //checkbox
    $checkboxid.find('input').on('click', function () {
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
                    });
                } else {
                    $obj.removeClass('check_active');
                    $obj.addClass('check_non-active');
                    $obj.children().each(function (val, objspan) {
                        let $span = $(objspan);
                        $span.removeClass('check_icon-checked');
                        $span.addClass('check_icon-non fa-circle-thin');
                    });
                }
            }

        })
    });

    $checkboxid.find("input").click(function (e) {
		showhideimage(collectDataLabels(fieldID), $(this));
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

function showhideimage(arrayComp, obj) 
{
	if (isEnded) 
	{
		arr = $('img');
		if (obj[0].checked) 
		{
            for (i=0;i<arr.length;i++)
			{
                if (arr[i].id != '') 
		        {
		        	for (j=1;j<4;j++)
		        	{
		        		if (arr[i].id.substr(0, 12) == "bolthideimg"+j && arrayComp.indexOf('std_component_'+j) != -1) {arr[i].style.display = '';}
		        	}
		        }
            }
	    }
		else
		{
            for (i=0;i<arr.length;i++)
			{
                if (arr[i].id != '') 
		        {
		        	for (j=1;j<4;j++)
		        	{
		        		if (arr[i].id.substr(0, 12) == "bolthideimg"+j && arrayComp.indexOf('std_component_'+j) == -1) {arr[i].style.display = 'none';}
		        	}
		        }
            }
		}
	}
	else
	{
		obj[0].checked = false;
		obj[0].labels[0].className = "check_std check_non-active";
		obj[0].labels[0].children[0].className = "check_icon-non check_icon fa fa-circle-thin material-icons";
		//console.log(obj[0].labels[0].className);
		//alert('Необходимо закончить рисование и нажать "Готово"');
	}
}

