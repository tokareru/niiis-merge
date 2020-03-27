<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script>
  /* $( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
  } ); */
  $( function() {
    $( "#tabs" ).tabs({
      event: "mouseover"
    });

	$( "#tabs-1" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix");
	$( "#tabs-1 li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$( "#tabs-1" ).removeClass( "ui-widget-content" );
	$(".ui-tabs .ui-tabs-panel").css("padding", "inherit");
	$(".ui-tabs .ui-tabs-panel").css("width", "auto");
	$(".ui-tabs .ui-tabs-panel").css("float", "none");
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


	$( "#addItemList" ).click(function() {
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
		console.log(first+"f"+second);
		$( "#tabs-"+first+"-"+second ).append( "<input disabled value='"+$(".form-control").val()+"' class='form-control'>" );
		//Send(first-1, second-1);
	});

	function Send(f, s) {
		let arr1 = ["MechObr", "Pokritie", "Sborka"];

		let arr2 =
		[
			"TechOp",
			"TechP",
			"Defence",
			"Prisp",
			"Equipment",
			"Rig",
			"Tools",
			"Izmer",
			"Prof"
		];

		let obj =
		{
			"MechObr":
			{
				"TechOp":[],
				"TechP":[],
				"Defence":[],
				"Prisp":[],
				"Equipment":[],
				"Rig":[],
				"Tools":[],
				"Izmer":[],
				"Prof":[]
			},

			"Pokritie":
			{
				"TechOp":[],
				"TechP":[],
				"Defence":[],
				"Prisp":[],
				"Equipment":[],
				"Rig":[],
				"Tools":[],
				"Izmer":[],
				"Prof":[]
			},

			"Sborka":
			{
				"TechOp":[],
				"TechP":[],
				"Defence":[],
				"Prisp":[],
				"Equipment":[],
				"Rig":[],
				"Tools":[],
				"Izmer":[],
				"Prof":[]
			}
		};


	}

  } );

  </script>
  <style>
  .ui-tabs-vertical { width: 55em; }
  .ui-tabs-vertical .ui-tabs-nav { padding: .2em .1em .2em .2em; float: left; width: 12em; }
  .ui-tabs-vertical .ui-tabs-nav li { clear: left; width: 100%; border-bottom-width: 1px !important; border-right-width: 0 !important; margin: 0 -1px .2em 0; }
  .ui-tabs-vertical .ui-tabs-nav li a { display:block; }
  .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active { padding-bottom: 0; padding-right: .1em; border-right-width: 1px; }
  .ui-tabs-vertical .ui-tabs-panel { padding: inherit; float: none; width: auto;}
  #listInput input {width: 100px; margin-bottom: 0.3em;}
  #listInput {
  float: right;
    position: absolute;
    top: 53;
    right: 2;
	z-index: 1;
	width: 100px;
	}

	#tabs div div div {
		word-break: break-word;
	}

	.list-tabs {

	}

	#tabs div div input {
		width: auto;
		position: relative;
		margin-left: 170px;
		margin-top: 5px;
	}
  </style>
</head>
<body>

<div id="tabs">
	<div id="listInput">
		<input class="form-control">
		<button class="btn btn-primary" id="addItemList">Добавить элемент</button>
	</div>
  <ul>
    <li><a href="#tabs-1">Механообработка</a></li>
    <li><a href="#tabs-2">Покрытие</a></li>
    <li><a href="#tabs-3">Сборка</a></li>
  </ul>
  <div id="tabs-1">
  <ul>
	<li><a href="#tabs-1-1">Техоперации</a></li>
	<li><a href="#tabs-1-2">Техпереходы</a></li>
	<li><a href="#tabs-1-3">Средства защиты</a></li>
	<li><a href="#tabs-1-4">Приспособления</a></li>
	<li><a href="#tabs-1-5">Оборудование</a></li>
	<li><a href="#tabs-1-6">Оснастка</a></li>
	<li><a href="#tabs-1-7">Инструменты</a></li>
	<li><a href="#tabs-1-8">Средства измерения</a></li>
	<li><a href="#tabs-1-9">Профессии</a></li>
  </ul>

  <div id="tabs-1-1">
	<div class="list-tabs" id="list-tabs-1-1"></div>
  </div>
  <div id="tabs-1-2">
	<div class="list-tabs" id="list-tabs-1-2"></div>
  </div>
  <div id="tabs-1-3"></div>
  <div id="tabs-1-4"></div>
  <div id="tabs-1-5"></div>
  <div id="tabs-1-6"></div>
  <div id="tabs-1-7"></div>
  <div id="tabs-1-8"></div>
  <div id="tabs-1-9"></div>

  </div>

  <div id="tabs-2">
  <ul>
	<li><a href="#tabs-2-1">Техоперации</a></li>
	<li><a href="#tabs-2-2">Техпереходы</a></li>
	<li><a href="#tabs-2-3">Средства защиты</a></li>
	<li><a href="#tabs-2-4">Приспособления</a></li>
	<li><a href="#tabs-2-5">Оборудование</a></li>
	<li><a href="#tabs-2-6">Оснастка</a></li>
	<li><a href="#tabs-2-7">Инструменты</a></li>
	<li><a href="#tabs-2-8">Средства измерения</a></li>
	<li><a href="#tabs-2-9">Профессии</a></li>
  </ul>

  <div id="tabs-2-1">
	<div class="list-tabs" id="list-tabs-2-1"></div>
  </div>
  <div id="tabs-2-2"></div>
  <div id="tabs-2-3"></div>
  <div id="tabs-2-4"></div>
  <div id="tabs-2-5"></div>
  <div id="tabs-2-6"></div>
  <div id="tabs-2-7"></div>
  <div id="tabs-2-8"></div>
  <div id="tabs-2-9"></div>
  </div>

  <div id="tabs-3">
  <ul>
	<li><a href="#tabs-3-1">Техоперации</a></li>
	<li><a href="#tabs-3-2">Техпереходы</a></li>
	<li><a href="#tabs-3-3">Средства защиты</a></li>
	<li><a href="#tabs-3-4">Приспособления</a></li>
	<li><a href="#tabs-3-5">Оборудование</a></li>
	<li><a href="#tabs-3-6">Оснастка</a></li>
	<li><a href="#tabs-3-7">Инструменты</a></li>
	<li><a href="#tabs-3-8">Средства измерения</a></li>
	<li><a href="#tabs-3-9">Профессии</a></li>
  </ul>

  <div id="tabs-3-1">
	<div class="list-tabs" id="list-tabs-3-1"></div>
  </div>
  <div id="tabs-3-2"></div>
  <div id="tabs-3-3"></div>
  <div id="tabs-3-4"></div>
  <div id="tabs-3-5"></div>
  <div id="tabs-3-6"></div>
  <div id="tabs-3-7"></div>
  <div id="tabs-3-8"></div>
  <div id="tabs-3-9"></div>
  </div>
</div>

</body>
</html>
