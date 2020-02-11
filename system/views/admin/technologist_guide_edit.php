<?php
sys::inc_no_cache('css', 'css/bootstrap.css');
sys::inc_no_cache('css', 'css/styles.css');
sys::inc_no_cache('css', 'css/jquery-ui.structure.css');
sys::inc_no_cache('css', 'css/font-awesome.css');
//sys::inc_no_cache('css', 'css/technologist_guide.css');
sys::inc_no_cache('css', 'css/technological_process.css');
sys::inc_no_cache('css','css/main.css');
sys::inc_no_cache('css','css/btn_heder.css');

sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
sys::inc_no_cache('javascript', 'js/mainTabs.js');
sys::inc_no_cache('javascript', 'js/admin/admin.js');
sys::inc_no_cache('javascript', 'js/admin/technologist_guide_edit.js');
       
sys::inc_no_cache('javascript', 'js/shell/shell.js');
//        print_r($data);
?>
<div id="technologist_guide_field">
    <table border="bordered">
        <?php 
        $id_1_layout = 0;
        $id_2_layout = 0;
        foreach($data as $row){
            echo "<tr><td><input class='1lvl' id=".++$id_1_layout." value='".$row["name"]."'></td><td></td><td></td><td></td></tr>"; 
            foreach($row["children"] as $item){
                echo "<tr><td></td><td><input class='2lvl' name=".$id_1_layout." id=".++$id_2_layout." value='".$item["name"]."'></td><td></td><td></td></tr>";
                echo "<tr><td></td><td></td><td>Инструменты:</td><td></td></tr>";
                foreach($item["tools"] as $tools){
                     echo "<tr><td></td><td></td><td></td><td><input class='tools' name=".$id_2_layout." value='".$tools["name"]."'></td></tr>";
                }
                echo "<tr><td></td><td></td><td>Приборы:</td><td></td></tr>";
                foreach($item["equipment"] as $equipment){
                     echo "<tr><td></td><td></td><td></td><td><input class='equipment' name=".$id_2_layout." value='".$equipment["name"]."'></td></tr>";
                }
            }
        }
        ?>
    </table>
    <button class="btn btn-default" id="save">Сохранить</button>
</div>