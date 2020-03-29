/* $( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
  } ); */
$( function() {
	$( "#tabs" ).tabs({
		event: "mouseover"
	});

	/* $('#listInput input').popover({
		placement : 'top',
    container: 'body'
	}) */


	$( "#tabs-1" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix");
	$( "#tabs-1 li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$( "#tabs-1" ).removeClass( "ui-widget-content" );
	$(".ui-tabs .ui-tabs-panel").css("padding", "inherit");
	$(".ui-tabs .ui-tabs-panel").css("width", "auto");
	//$(".ui-tabs .ui-tabs-panel").css("float", "none");
	$("#tabs-1").css({ marginLeft: '-0.2em' });
	$("#tabs-1").css({ marginTop: '0.5em' });
	$("#tabs-1").css({ marginBottom: '0.5em' });
	$("#tabs-1").css({ marginBottom: '0.5em' });

	$( "#tabs-2" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix");
	$( "#tabs-2 li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$( "#tabs-2" ).removeClass( "ui-widget-content" );
	$("#tabs-2").css({ marginLeft: '-0.2em' });
	$("#tabs-2").css({ marginTop: '0.5em' });
	$("#tabs-2").css({ marginBottom: '0.5em' });
	$("#tabs-2").css({ marginBottom: '0.5em' });

	$( "#tabs-3" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix");
	$( "#tabs-3 li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$( "#tabs-3" ).removeClass( "ui-widget-content" );
	$("#tabs-3").css({ marginLeft: '-0.2em' });
	$("#tabs-3").css({ marginTop: '0.5em' });
	$("#tabs-3").css({ marginBottom: '0.5em' });
	$("#tabs-3").css({ marginBottom: '0.5em' });
	Get();


	$( "#addItemList" ).click(function() {
		if (this.previousElementSibling.value == '')
		{

		}
		else
		{
			//проход верхней менюшки
			let count = $("#tabs")[0].children[1].children.length;
			let first, second;
			for (let i=0; i<count; i++)
			{
				if ($("#tabs ul li")[i].attributes.tabindex.value == 0) {first = i+1; break;}
			}

			//проход нижней менюшки
			//let scount = $("#tabs ul li").length - count;
			for (let j=count; j<$("#tabs ul li").length ; j++)
			{
				if ($("#tabs ul li a")[j].hash.substr(6,1) == first && $("#tabs ul li")[j].attributes.tabindex.value == 0)
				{
					second = $("#tabs ul li a")[j].hash.substr(8,1);
					break;
				}
			}

			$( "#tabs-"+first+"-"+second ).append( "<div><input disabled value='"+$("#listInput input").val()+
				"' class='form-control'><button type='button' clickpanel='edit' class='btn btn-outline-info'>Edit</button><button clickpanel='delete' type='button' class='btn btn-outline-danger'>X</button></div>" );
		}

	});

	$("body").on("click", "button[clickpanel='edit']", function (){
		this.parentElement.children[0].disabled=false; //input
		this.parentElement.children[0].focus();
		//$(this).hide(100);
		this.style.display='none';
		$( "<button style='display:none' clickpanel='save' type='button' class='btn btn-success'>Ok</button>" ).insertAfter( this );
		$(this.nextSibling).show(); //save
	});

	$("body").on("click", "button[clickpanel='save']", function (){
		this.parentElement.children[0].disabled=true; //input
		//$(this).hide();
		$(this.parentElement.children[1]).fadeIn(500); //edit show
		$(this.parentElement.children[2]).remove(); //save remove
	});

	$("body").on("click", "button[clickpanel='delete']", function (){
		$(this.parentElement).remove();
	});

	$( "#submitTabs" ).click(function() {
		let arr = [];
		for (let i=0; i<$("#tabs div div div ").length; i++)
		{
			let name = $("#tabs div div div ")[i].children[0].value;
			let id1 = $("#tabs div div div ")[i].parentElement.id.substr(5,1);
			let id2 = $("#tabs div div div ")[i].parentElement.id.substr(7,1);
			arr.push({name: name, id1: parseInt(id1), id2: parseInt(id2)});
		}
		Send(arr);
		//save_technologist_info
	});



	function Send(data) {
		$.ajax({
			type: "POST",
			url: "save_technologist_info",
			dataType: "json",
			data:{data:data},
			success: function (answer) {
				console.log(answer);
			}
		});
	}

	function Get()
	{
		//window.location.protocol+"//"+window.location.hostname+"/ajax/
		$.ajax({
			type: "GET",
			url: "get_technologist_info",
			dataType: "json",
			success: function (answer) {
				FillMenu(answer);
			}
		});
	}

	function FillMenu(obj)
	{
		//$("#tabs ul li a")[j].hash.substr(6,1)
		for (let i = 0; i < obj.length; i++)
		{
			$("#tabs ul li a")[i].innerText = obj[i].name;
			for (let j = 0; j < obj[i].children.length; j++)
			{
				let index1 = j+obj.length+(obj[i].children.length*i); //0 + 3 + (9*1)
				let f = $("#tabs ul li a")[index1].hash.substr(6,1);
				let s = $("#tabs ul li a")[index1].hash.substr(8,1);

				if (obj[i].id == f && obj[i].children[j].id == s)
				{
					$("#tabs ul li a")[index1].innerText = obj[i].children[j].name;

					for (let z = 0; z < obj[i].children[j].fields.length; z++)
					{
						$( "#tabs-"+f+"-"+s ).append( "<div><input disabled value='"+obj[i].children[j].fields[z].name+
							"' class='form-control'><button type='button' clickpanel='edit' class='btn btn-outline-info'>Edit</button><button clickpanel='delete' type='button' class='btn btn-outline-danger'>X</button></div>" );
					}
				}
			}
		}
	}

} );
