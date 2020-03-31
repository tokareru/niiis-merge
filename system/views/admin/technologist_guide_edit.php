<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="../js/admin/techmenu.js"></script>
  <style>
  .ui-tabs-vertical { width: 55em; }
  .ui-tabs-vertical .ui-tabs-nav { padding: .2em .1em .2em .2em; float: left; width: 12em; }
  .ui-tabs-vertical .ui-tabs-nav li { clear: left; width: 100%; border-bottom-width: 1px !important; border-right-width: 0 !important; margin: 0 -1px .2em 0; }
  .ui-tabs-vertical .ui-tabs-nav li a { display:block; }
  .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active { padding-bottom: 0; padding-right: .1em; border-right-width: 1px; }
  .ui-tabs-vertical .ui-tabs-panel { padding: inherit; float: none; width: auto; }
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

	#tabs div div div {
		width: auto;
		position: relative;
		margin-left: 170px;
		margin-top: 5px;
		display: flex;
		margin-right: 100px;
	}

	#tabs div div input {
		width: 100%;
		position: relative;
	}

	#tabs div div button {
		margin-left:5px;
		position: relative;
		min-width: 58px;
	}

	#tabs {min-width: 453px;}

	#submitTabs {
		float: right;
		margin-top: 10px;
	}

	.ui-tabs .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor, .ui-tabs .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor, .ui-tabs .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor
	{
		cursor:pointer;
		display:block;
		width:100%
	}

	.ui-tabs-vertical .ui-tabs-nav li a
	{
		width:100%;
	}

  </style>
</head>
<body>

<div id="tabs">
	<div id="listInput">
		<input class="form-control">
		<button class="btn btn-outline-primary" id="addItemList">Добавить элемент</button>
	</div>
  <ul>
    <li><a href="#tabs-1">Меха</a></li>
    <li><a href="#tabs-2">По</a></li>
    <li><a href="#tabs-3">Сб</a></li>
  </ul>
  <div id="tabs-1">
  <ul>
	<li><a href="#tabs-1-1"></a></li>
	<li><a href="#tabs-1-2"></a></li>
	<li><a href="#tabs-1-3"></a></li>
	<li><a href="#tabs-1-4"></a></li>
	<li><a href="#tabs-1-5"></a></li>
	<li><a href="#tabs-1-6"></a></li>
	<li><a href="#tabs-1-7"></a></li>
	<li><a href="#tabs-1-8"></a></li>
	<li><a href="#tabs-1-9"></a></li>
  </ul>

  <div id="tabs-1-1">
  </div>
  <div id="tabs-1-2">
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
	<li><a href="#tabs-2-1"></a></li>
	<li><a href="#tabs-2-2"></a></li>
	<li><a href="#tabs-2-3"></a></li>
	<li><a href="#tabs-2-4"></a></li>
	<li><a href="#tabs-2-5"></a></li>
	<li><a href="#tabs-2-6"></a></li>
	<li><a href="#tabs-2-7"></a></li>
	<li><a href="#tabs-2-8"></a></li>
	<li><a href="#tabs-2-9"></a></li>
  </ul>

  <div id="tabs-2-1">
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
	<li><a href="#tabs-3-1"></a></li>
	<li><a href="#tabs-3-2"></a></li>
	<li><a href="#tabs-3-3"></a></li>
	<li><a href="#tabs-3-4"></a></li>
	<li><a href="#tabs-3-5"></a></li>
	<li><a href="#tabs-3-6"></a></li>
	<li><a href="#tabs-3-7"></a></li>
	<li><a href="#tabs-3-8"></a></li>
	<li><a href="#tabs-3-9"></a></li>
  </ul>

  <div id="tabs-3-1">
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
<button id="submitTabs" type="button" class="btn btn-primary">Сохранить</button>

</body>
</html>
