<table class="table table-bordered">
    <thead>
        <tr>
            <td>id</td>
            <td>ФИО</td>
            <td>логин</td>
            <td>пароль</td>
            <td>группа пользователя</td>
            <td>активен</td>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach($data["content"]["users"] as $rows){
        echo '
            <tr>
                <td>'.$rows['id'].'</td>
                <td>'.$rows['first_name'].' '.$rows['first_name'].' '.$rows['first_name'].'</td>
                <td>'.$rows['login'].'</td>
                <td>'.$rows['password'].'</td>
                <td><select class="form-control">';
                    foreach($data["content"]["group_users"] as $row){
                        echo "<option value=".$row["group_id"]." "; if($rows['group_user_id'] == $row["group_id"]){echo "selected";} echo ">".$row["descr"]."</option>";
                    }
                echo '</select></td>
                <td><input class="form-control" type="checkbox" name="active_sign" '; if($rows['active_sign'] == 1){echo 'checked';} echo '></td>
            </tr>
        ';
        }
        ?>
    </tbody>
</table>
