<?php sys::inc_no_cache('javascript', 'js/admin/technologist_guide_edit.js'); 
sys::inc_no_cache('javascript', 'js/libraries/jquery-3.4.1.js');
    sys::inc_no_cache('javascript', 'js/libraries/popper.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/bootstrap.min.js');
    sys::inc_no_cache('javascript', 'js/libraries/jquery-ui.js');
?>
<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2"><?php echo 'Справочник технолога' ?></h1>
</div>
<div class="mb-md-0">
<!--    <div id="technologist_guide_field">-->
<!--        <table border="bordered">
            <?php
//            function inputStr($str){
//                $str = str_replace(' ','',$str);
//                $str = explode(",",$str);
//                return $str;
//            }
//            $id_1_layout = 0;
//            $id_2_layout = 0;
//            echo '<div class="accordion" id="accordionTechGuide">';
//            foreach ($data as $row) {
//                echo '<div class="card" id="card' . ++$id_1_layout . '">
//    <div class="card-header" id="lvl1' . $id_1_layout . '">
//      <h5 class="mb-0">
//        <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#collapse' . $id_1_layout . '" aria-expanded="true" aria-controls="collapse' . $id_1_layout . '">
//          ' . $row["name"] . '
//        </button>
//      </h5>
//    </div>
//
//    <div id="collapse' . $id_1_layout . '" class="collapse show" aria-labelledby="lvl1' . $id_1_layout . '" data-parent="#accordionTechGuide">
//        <div class="card-body">';
//
//                foreach ($row["children"] as $item) {
//                    echo '<div class="card" id="card2lvl' . ++$id_2_layout . '">
//        <div class="card-header" id="lvl2' . $id_2_layout . '">
//            <h5 class="mb-0">
//              <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#collapse2lvl' . $id_2_layout . '" aria-expanded="true" aria-controls="collapse2lvl' . $id_2_layout . '">
//                ' . $item["name"] . '
//              </button>
//            </h5>
//        </div>
//
//        <div id="collapse2lvl' . $id_2_layout . '" class="collapse show" aria-labelledby="lvl2' . $id_2_layout . '" data-parent="#card' . $id_1_layout . '">
//          <div class="card-body">';
//
//    echo '<div class="card" id="cardtools' . $id_2_layout . '">
//        <div class="card-header" id="tools' . $id_2_layout . '">
//      <h5 class="mb-0">
//        <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#collapseTools' . $id_2_layout . '" aria-expanded="true" aria-controls="collapseTools' . $id_2_layout . '">
//          Инструменты
//        </button>
//      </h5>
//    </div>
//    
//    
//    <div id="collapseTools' . $id_2_layout . '" class="collapse show" aria-labelledby="tools' . $id_2_layout . '" data-parent="#card2lvl' . $id_2_layout . '">
//      <div class="card-body">';
//                    $tools = inputStr($item["tools"][0]["name"]);
//                    foreach($tools as $name){
//                        echo '<input class="form-control" value="'.$name.'"/>';
//                    }
//                    echo '  </div>
//                            </div>
//                            </div>'
//                    ;
//echo '<div class="card" id="cardequipment' . $id_2_layout . '">
//        <div class="card-header" id="equipment' . $id_2_layout . '">
//      <h5 class="mb-0">
//        <button class="btn btn-secondary" type="button" data-toggle="collapse" data-target="#collapseEquipment' . $id_2_layout . '" aria-expanded="true" aria-controls="collapseEquipment' . $id_2_layout . '">
//          Приборы
//        </button>
//      </h5>
//    </div>
//    
//    
//    <div id="collapseEquipment' . $id_2_layout . '" class="collapse show" aria-labelledby="equipment' . $id_2_layout . '" data-parent="#card2lvl' . $id_2_layout . '">
//      <div class="card-body">';
//                    $equipment = inputStr($item["equipment"][0]["name"]);
//                    foreach($equipment as $name){
//                        echo '<input class="form-control" value="'.$name.'"/>';
//                    }
//                    echo '  </div>
//                            </div>
//                            </div>'
//                    ;
//
//                    echo '</div>
//        </div>
//        </div>'
//                    ;
//                }
//                echo ' </div>
//    </div>
//  </div>';
//        echo "<tr><td><input class='1lvl' id=" . ++$id_1_layout . " value='" . $row["name"] . "'></td><td></td><td></td><td></td></tr>";
//        foreach ($row["children"] as $item) {
//          echo "<tr><td></td><td><input class='2lvl' name=" . $id_1_layout . " id=" . ++$id_2_layout . " value='" . $item["name"] . "'></td><td></td><td></td></tr>";
//          echo "<tr><td></td><td></td><td>Инструменты:</td><td></td></tr>";
//          foreach ($item["tools"] as $tools) {
//            echo "<tr><td></td><td></td><td></td><td><input class='tools' name=" . $id_2_layout . " value='" . $tools["name"] . "'></td></tr>";
//          }
//          echo "<tr><td></td><td></td><td>Приборы:</td><td></td></tr>";
//          foreach ($item["equipment"] as $equipment) {
//            echo "<tr><td></td><td></td><td></td><td><input class='equipment' name=" . $id_2_layout . " value='" . $equipment["name"] . "'></td></tr>";
//          }
//        }
//            }
            ?>
    </div>
</table>-->
 <div class="row">
        <div class="col-2">
            <select class="form-control" id="1_layout">
                <?php 
                    foreach($data["1_layout"] as $row){
                        echo '<option value="'.$row["id"].'">'.$row["name"].'</option>';
                    }
                ?>
                
            </select>  
        </div>
        <div class="col-2">
            <select class="form-control" id="2_layout">
                <?php 
                    foreach($data["2_layout"] as $row){
                        echo '<option value="'.$row["id"].'">'.$row["name"].'</option>';
                    }
                ?>

            </select>  
        </div>
        
 </div>
<br/>
<div id="fields">
            <?php 
            foreach($data["fields"] as $row){
                        echo '<div class="row"><div class="col-3">';
                        echo '<input class="form-control" id="'.$row["id"].'" value="'.$row["fields"].'" />';
                        echo '</div></div>';
            }
            ?>
</div>
            
<button class="btn btn-default" id="save">Сохранить</button>
</div>
</div>
