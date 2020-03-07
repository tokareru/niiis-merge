<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Main-tabs</title>
</head>
<body>
<div class="col-xl">
<!--Центральная сторона-->
    <nav id="tabs" class="navbar navbar-expand-xl flex-column navbar-dark fixed-top bg-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarToggler">
            <ul class="mr-auto nav nav-pills navbar-nav" role="tablist" style="list-style-type: none">
                <li><a href="#tabs-empty"></a></li>
            </ul>
            <?php require_once("system/views/header.php"); ?>
        </div>
    </nav>
    <div class="tab-content" id="tabs-content">

    </div>
</div>
</body>
</html>
