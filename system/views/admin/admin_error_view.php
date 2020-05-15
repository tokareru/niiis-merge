<?php
    
    sys::inc_no_cache('css', 'css/bootstrap.css');
    ?>
<style>
   h1 {
    font-family: 'Times New Roman', Times, serif; /* Гарнитура текста */ 
    font-size: 250%; /* Размер шрифта в процентах */ 
   } 
   p {
    font-family: Verdana, Arial, Helvetica, sans-serif; 
    font-size: 14pt; /* Размер шрифта в пунктах */ 
    text-align: center;
   }
  </style>
<div style="margin-top: 100px;">
    <p>Ваша роль <b><?=$_SESSION["niiis"]["role"]?></b>, у вас нет доступа к данной странице!</p>
    <p>Необходимо выйти из личного кабинета и зайти как администратор:</p>
    <p><a class="btn btn-primary" href="<?php echo conf::$SITE_URL?>" role="button">На главную</a> <a class="btn btn-danger" href="<?php echo conf::$SITE_URL . 'logout' ?>" role="button">Выйти</a></p>
    
</div>