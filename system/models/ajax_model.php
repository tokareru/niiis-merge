<?php

class ajax_model extends model {

  //обновляем информацию в таблице hostel
  public function save_hostel() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = $_REQUEST['name'];
    $address = $_REQUEST['address'];
    $construct_year = $_REQUEST['construct_year'];
    $percent_iznos = $_REQUEST['percent_iznos'];
    $examination_date = $_REQUEST['examination_date'];
    $inventar_number = $_REQUEST['inventar_number'];
    $liter = $_REQUEST['liter'];
    $naznachenie = $_REQUEST['naznachenie'];
    $floors = $_REQUEST['floors'];
    $underground_floors = $_REQUEST['underground_floors'];
    $area = $_REQUEST['area'];
    $number_of_lifts = $_REQUEST['number_of_lifts'];

    $hostel_id = $_REQUEST['hostel_id'];

    $query = mssql_qw("UPDATE hostel SET name=?,
    address=?,
    construct_year=?,
    percent_iznos=?,
    examination_date=?,
    inventar_number=?,
    liter=?,
    naznachenie=?,
    floors=?,
    underground_floors=?,
    area=?,
    number_of_lifts=?
    WHERE id = ?", $name, $address, $construct_year, $percent_iznos, $examination_date, $inventar_number, $liter, $naznachenie, $floors, $underground_floors, $area, $number_of_lifts, $hostel_id
    );

    $R = array('result' => '1');

    return $R;
  }

  public function get_oplata() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $hostel_id = filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);

    $R = "";
    $R .= "<span onclick='$(\"#overlay\").click()' id='oplata_hostel_modal_close'><img src='" . conf::$SITE_URL . "img/close.png'/></span>";
    
    
    $R .= get_person_oplata($person_id, $hostel_id, 0);
    return $R;
  }
  
   public function add_get_oplata() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $hostel_id = filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);
//      echo $person_id;
    $R = "";
    $R .= "<span onclick='$(\"#overlay\").click()' id='oplata_hostel_modal_close'><img src='" . conf::$SITE_URL . "img/close.png'/></span>";
    
    
    $R .= get_person_oplata($person_id, $hostel_id, 1);
    return $R;
  }
  
  
  
  public function eviction_from_hostel() {
//      $start_date = sys::secure($_REQUEST['start_date']);
//      $end_date = sys::secure($_REQUEST['end_date']);
      $person_id = (int)$_REQUEST['person_id'];
      $room_id = (int)$_REQUEST['room_id'];
//      $perroom_id = (int)$_REQUEST['perroom_id'];
      
      $result_query=mssql_query("update person_room set active_sign=0 where person_id=$person_id and room_id=$room_id");
      $result_query=mssql_query("update room set places_full=places_full-1 where id=$room_id");
      $result_query=mssql_query("update room set sex_id=4 where id=$room_id and places_full=0");  // Если комната стала пустой, сделаем ее Свободной
      $result_query=mssql_query("insert into person_room "
              . "(person_id,room_id,start_date,end_date) values "
              . "($person_id,1155,Null, Null)");
      
      $id=(int)mssql_result($result_query, 0, 0);
      
      $success=($id>0)?true:false;
      
      return array('success'=>$success);
    }
    /* формируют и отправляет форму для акта оплаты */

  public function add_oplata_act() 
  {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $hostel_id = filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $res_person = mssql_query("SELECT     person.id, person.last_name, person.first_name, person.otc, room.number, room.hostel_id, hostel.name
FROM         person LEFT OUTER JOIN
                      person_room ON person.id = person_room.person_id LEFT OUTER JOIN
                      room ON person_room.room_id = room.id LEFT OUTER JOIN
                      hostel ON room.hostel_id = hostel.id
                      WHERE person.id=$person_id AND person_room.active_sign='1'");
    $row_res_person = mssql_fetch_array($res_person);
    $R = "";
    $R .= "<span onclick='$(\"#overlay\").click()' id='oplata_hostel_modal_close'><img src='" . conf::$SITE_URL . "img/close.png'/></span>";
    $R .= '<h3>Оплата за проживание:</h3>';
    $R .= '<b>'.$row_res_person['last_name'].' '.$row_res_person['first_name'].' '.$row_res_person['otc'].', '
          .$row_res_person['name'].', комната: '.$row_res_person['number'].'</b>';
    $R .= '<div style = "width:100%;">
    
    <button id = "oplata_save" class="btn btn-default" onclick="save_oplata_new(1,' . $person_id . ')">Распечатать</button>
    </div>';
    $R .= get_oplata_act($hostel_id,$person_id, $oplata_act_id = 0, $start_date = "", $end_date = "", $summ = "", $payments = array(),$dolg=0,$pereplata=0);
    return $R;
  }

  /* функция сохранения оплаты */

  public function save_oplata() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);

    //удаляем все записи об оплате
    //1 - в таблице оплата
    //
    if (isset($_POST['oplata'])) {
      foreach ($_POST['oplata'] as $oplata) {

        $clear_old_oplata = mssql_qw("UPDATE oplata SET active_sign='1' WHERE person_id=?", $person_id);

        $oplata_id = $oplata['oplata_id'];
        $start_date = $oplata['start_date'];
        $end_date = $oplata['end_date'];
        $oplata_summ = $oplata['oplata_summ'];
        $oplata_all = $oplata['oplata_all'];

        if ($oplata_id == '0') {
          $result = mssql_qw("INSERT INTO oplata(
            person_id,
            start_date,
            end_date,
            summ)
            VALUES(?,
            CONVERT(SMALLDATETIME,?,104),
            CONVERT(SMALLDATETIME,?,104),
            ?) 
            SELECT @@IDENTITY", $person_id, $start_date, $end_date, $oplata_summ);
          $oplata_id = mssql_result($result, 0, 0);

          //сохраняем доп услуги
          if (isset($_POST['dop_uslugi'])) {
            $uslugi = $_POST['dop_uslugi'];
            foreach ($uslugi as $one_usluga) {
              $usluga_id = $one_usluga['id'];
              $add_day = $one_usluga['add_day'];
              $summa_for_dop_day = $one_usluga['summa_for_dop_day'];
              $month_cost = $one_usluga['month_cost'];
              $full_cost = $one_usluga['full_cost'];

              $query = mssql_qw("INSERT INTO oplata_usluga (usluga_id
                    ,oplata_id
                    ,full_cost
                    ,month_cost
                    ,start_date
                    ,end_date
                    ,add_day
                    ,summa_for_dop_day) 
                    VALUES 
                    (?,?,?,?,CONVERT(SMALLDATETIME,?,104),CONVERT(SMALLDATETIME,?,104),?,?)", $usluga_id
                      , $oplata_id
                      , $full_cost
                      , $month_cost
                      , $start_date
                      , $end_date
                      , $add_day
                      , $summa_for_dop_day
              );
            }
          }
        } else {
          $result = mssql_qw("UPDATE oplata SET
            person_id = ?,
            start_date = CONVERT(SMALLDATETIME,?,104),
            end_date = CONVERT(SMALLDATETIME,?,104),
            summ = ?,
            active_sign = '1'
            WHERE id=?", $person_id, $start_date, $end_date, $oplata_summ, $oplata_id);
        }

        

        if (isset($oplata['payments'])) {
          $payments = $oplata['payments'];
          //пробегаемся по платежам
          foreach ($payments as $payment) {
            $payments_id = $payment['payments_id'];
            $payment_date = $payment['payment_date'];
            $payment_sum = $payment['payment_sum'];
            
            $clear_old_payments = mssql_qw("UPDATE payment SET active_sign='1' WHERE oplata_id=?", $oplata_id);
            
            if ($payments_id == '0') {
              //insert
              $result = mssql_qw("INSERT INTO payment (oplata_id, date, size) VALUES (?,CONVERT(SMALLDATETIME,?,104),?)", $oplata_id, $payment_date, $payment_sum);
            } else {
              //update
              $result = mssql_qw("UPDATE payment SET 
              oplata_id=?,
              date=CONVERT(SMALLDATETIME,?,104),
              size=? ,
              active_sign='1'
              WHERE id=?", $oplata_id, $payment_date, $payment_sum, $payments_id);
            }
          }
        }
      }
    }
    return $person_id;
  }
  
  public function save_oplata_new() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);

    $oplata_id=0;
    
    //удаляем все записи об оплате
    //1 - в таблице оплата
    //
    if (isset($_POST['oplata'])) {
      foreach ($_POST['oplata'] as $oplata) {
        $oplata_id = $oplata['oplata_id'];
        $start_date = $oplata['start_date'];
        $end_date = $oplata['end_date'];
        $oplata_summ = $oplata['oplata_summ'];
        $oplata_all = $oplata['oplata_all'];
        $dolg = $oplata['dolg'];
        $pereplata = $oplata['pereplata'];
        $summ_dop=$dolg-$pereplata;
        
        // Проверка дат. Если даты не правильные, person_room_update() вернет ошибку
        $d1=new DateTime($start_date);
        $d2=new DateTime($end_date);
        if($d1>=$d2){
          break;
        }
        // --Проверка дат. Если даты не правильные, person_room_update() вернет ошибку
        
          // Пробегаемся по всем активным записям таблицы oplata
          $query_ck= mssql_query("SELECT o.id,o.person_id,o.summ
                               ,convert(varchar(10),o.start_date,104) AS start_date
                               ,convert(varchar(10),o.end_date,104) AS end_date "
                   . "FROM oplata o "
                   . "WHERE o.active_sign='1' AND o.person_id=$person_id "
                  . "order by o.end_date desc");
          
          $i=0;
          while($row_query_ck = mssql_fetch_array($query_ck)){
            // Если встретили такую у которой даты начала, конца совпадают, и сумма оплаты, то удаляем старую
            if($start_date == $row_query_ck['start_date'] && $end_date == $row_query_ck['end_date'] && $oplata_summ == $row_query_ck['summ']){
//              
              $result = mssql_qw("UPDATE oplata "
                                      . "SET active_sign='0' "
                                      . "WHERE id=?",$row_query_ck['id']);
              
            }
            
            // Меняем даты начала/конца заселения
            if($i===0){
              // Первая запись - end_date последней квитанции.
              
//              $d3=new DateTime($row_query_ck['start_date']);  // start_date последней квитанции
//              $d4=new DateTime($row_query_ck['end_date']);  // end_date последней квитанции
              
              // узнаем текущий $room_id
              $room_id=0;
              $rPersonRoom=mssql_query("select "
                      . "room_id "
                      . "from person_room "
                      . "where person_id=$person_id and active_sign=1 and deleted=0");
              if(mssql_num_rows($rPersonRoom)>0){
                $row_person_room = mssql_fetch_array($rPersonRoom);
                $room_id=$row_person_room['room_id'];
              }
              
              person_room_update($person_id,$room_id,$start_date,$end_date);
            }
            // --Меняем даты начала/конца заселения
            $i++;
          }
          // --Пробегаемся по всем активным записям таблицы oplata
          
        if ($oplata_id == '0') {
          $result = mssql_qw("INSERT INTO oplata(
            person_id,
            start_date,
            end_date,
            summ,
            summ_dop,
            date_create)
            VALUES(?,
            CONVERT(SMALLDATETIME,?,104),
            CONVERT(SMALLDATETIME,?,104),
            ?,
            ?,
            getdate()) 
            SELECT @@IDENTITY", $person_id, $start_date, $end_date, $oplata_summ,$summ_dop);
          $oplata_id = mssql_result($result, 0, 0);

          //сохраняем доп услуги
          if (isset($_POST['dop_uslugi'])) {
            $uslugi = $_POST['dop_uslugi'];
            foreach ($uslugi as $one_usluga) {
              $usluga_id = $one_usluga['id'];
              $add_day = $one_usluga['add_day'];
              $summa_for_dop_day = $one_usluga['summa_for_dop_day'];
              $month_cost = $one_usluga['month_cost'];
              $full_cost = $one_usluga['full_cost'];

              $query = mssql_qw("INSERT INTO oplata_usluga (usluga_id
                    ,oplata_id
                    ,full_cost
                    ,month_cost
                    ,start_date
                    ,end_date
                    ,add_day
                    ,summa_for_dop_day
                    ,[add_start_date]
                    ,[summa_for_dop_start]
                    ,[add_end_date]
                    ,[summa_for_dop_end]
                    ) 
                    VALUES 
                    (?,?,?,?,CONVERT(SMALLDATETIME,?,104),CONVERT(SMALLDATETIME,?,104),?,?,?,?,?,?)", $usluga_id
                      , $oplata_id
                      , $full_cost
                      , $month_cost
                      , $start_date
                      , $end_date
                      , $add_day
                      , $summa_for_dop_day
                      ,$one_usluga['add_day_start']
                      ,$one_usluga['add_summ_start']
                      ,$one_usluga['add_day_end']
                      ,$one_usluga['add_summ_end']
              );
              
              // Запишем в таблицу person_usluga.start_date - дата начала пользования услугой
              mssql_query("update person_usluga "
                      . "set start_date=CONVERT(SMALLDATETIME,'$start_date',104) "
                      . "where person_id=$person_id and usluga_id=$usluga_id "
                      . "and start_date is null and active_sign=1");
            }
          }
        }


        if (isset($oplata['payments'])) {
          $payments = $oplata['payments'];
          //пробегаемся по платежам
          foreach ($payments as $payment) {
            $payments_id = $payment['payments_id'];
            $payment_date = $payment['payment_date'];
            $payment_sum = $payment['payment_sum'];
            
            if ($payments_id == '0') {
              //insert
              $result = mssql_qw("INSERT INTO payment (oplata_id, date, size) VALUES (?,CONVERT(SMALLDATETIME,?,104),?)", $oplata_id, $payment_date, $payment_sum);
            } else {
              //update
              $result = mssql_qw("UPDATE payment SET 
              oplata_id=?,
              date=CONVERT(SMALLDATETIME,?,104),
              size=? ,
              active_sign='1'
              WHERE id=?", $oplata_id, $payment_date, $payment_sum, $payments_id);
            }
          }
        }
      }
    }
    return $oplata_id;
  }
  
  
  public function save_oplata_raznica_new() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $person_id = filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);

    //удаляем все записи об оплате
    //1 - в таблице оплата
    //
    if (isset($_POST['oplata'])) {
      foreach ($_POST['oplata'] as $oplata) {
        $oplata_id = $oplata['oplata_id'];
        $start_date = $oplata['start_date'];
        $end_date = $oplata['end_date'];
        $oplata_summ = $oplata['oplata_summ'];
        $oplata_all = $oplata['oplata_all'];
          
          $query_ck= mssql_query("SELECT id,person_id,summ
                               ,convert(varchar(10),start_date,104) AS start_date
                               ,convert(varchar(10),end_date,104) AS end_date "
                   . "FROM oplata "
                   . "WHERE active_sign='1' AND person_id=$person_id");
          
//          while($row_query_ck = mssql_fetch_array($query_ck)){
//            if($start_date == $row_query_ck['start_date'] && $end_date == $row_query_ck['end_date'] && $oplata_summ == $row_query_ck['summ']){
//              
//           $result = mssql_qw("UPDATE oplata "
//                                   . "SET active_sign='0' "
//                                   . "WHERE id=?",$row_query_ck['id']);
//              
//            }
//          }
          
          
          
//        if ($oplata_id == '0') {
//          $result = mssql_qw("INSERT INTO oplata(
//            person_id,
//            start_date,
//            end_date,
//            summ,
//            date_create)
//            VALUES(?,
//            CONVERT(SMALLDATETIME,?,104),
//            CONVERT(SMALLDATETIME,?,104),
//            ?,
//            getdate()) 
//            SELECT @@IDENTITY", $person_id, $start_date, $end_date, $oplata_summ);
//          $oplata_id = mssql_result($result, 0, 0);
//
//          //сохраняем доп услуги
//          if (isset($_POST['dop_uslugi'])) {
//            $uslugi = $_POST['dop_uslugi'];
//            foreach ($uslugi as $one_usluga) {
//              $usluga_id = $one_usluga['id'];
//              $add_day = $one_usluga['add_day'];
//              $summa_for_dop_day = $one_usluga['summa_for_dop_day'];
//              $month_cost = $one_usluga['month_cost'];
//              $full_cost = $one_usluga['full_cost'];
//
//              $query = mssql_qw("INSERT INTO oplata_usluga (usluga_id
//                    ,oplata_id
//                    ,full_cost
//                    ,month_cost
//                    ,start_date
//                    ,end_date
//                    ,add_day
//                    ,summa_for_dop_day) 
//                    VALUES 
//                    (?,?,?,?,CONVERT(SMALLDATETIME,?,104),CONVERT(SMALLDATETIME,?,104),?,?)", $usluga_id
//                      , $oplata_id
//                      , $full_cost
//                      , $month_cost
//                      , $start_date
//                      , $end_date
//                      , $add_day
//                      , $summa_for_dop_day
//              );
//            }
//          }
//        }
          
//           if (isset($oplata['payments'])) {
//          $payments = $oplata['payments'];
//          //пробегаемся по платежам
//          foreach ($payments as $payment) {
//            $payments_id = $payment['payments_id'];
//            $payment_date = $payment['payment_date'];
//            $payment_sum = $payment['payment_sum'];
//            
//            if ($payments_id == '0') {
//              //insert
//              $result = mssql_qw("INSERT INTO payment (oplata_id, date, size) VALUES (?,CONVERT(SMALLDATETIME,?,104),?)", $oplata_id, $payment_date, $payment_sum);
//            } else {
//              //update
//              $result = mssql_qw("UPDATE payment SET 
//              oplata_id=?,
//              date=CONVERT(SMALLDATETIME,?,104),
//              size=? ,
//              active_sign='1'
//              WHERE id=?", $oplata_id, $payment_date, $payment_sum, $payments_id);
//            }
//          }
//        }
      }
    }
    return $oplata_id;
  }
  
  

  public function get_uslugi_list() 
  {
      //sleep(1);
    //возвращает js массив со списком услуг для общежития
    require_once conf::$ROOT . 'system/etc/functions.php';
    $hostel_id = (int) filter_input(INPUT_POST, 'hostel_id', FILTER_SANITIZE_NUMBER_INT);
    $start_date = filter_input(INPUT_POST, 'start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    //var_dump($start_date);
    $result = mssql_qw("SELECT u.id
                            ,uh.name
                            ,uh.shortname
                            ,u.[cost]
                            ,uh.additional
                            ,u.[usluga_id]
                            ,u.[start_date]
                            ,u.[end_date]
                        FROM usluga u
                        inner JOIN usluga_helper uh ON u.usluga_id = uh.id
                        WHERE u.hostel_id = ? AND 
                            (u.end_date > CONVERT(SMALLDATETIME, '".$start_date."', 104) OR u.end_date IS NULL) AND 
                            u.start_date <= CONVERT(SMALLDATETIME, '".$start_date."', 104) AND
                            u.active_sign = 1
                        ORDER BY u.usluga_id", $hostel_id);
    $uslugi = NULL;
    while ($row = mssql_fetch_array($result)) 
    {
      $id = $row['id'];
      $name = $row['name'];
      $cost = $row['cost'];
      $additional = $row['additional'];
      if ($additional == null) 
      {
        $additional = 0;
      }
      $uslugi[$row['usluga_id']] = array($name, $cost, $additional, $id);
    }

    return $uslugi;
  }
  
  public function get_dop_uslugi_list() 
  {
      //sleep(1);
    //возвращает js массив со списком услуг для общежития
    require_once conf::$ROOT . 'system/etc/functions.php';
    $hostel_id = (int) filter_input(INPUT_POST, 'hostel_id', FILTER_SANITIZE_NUMBER_INT);
    $start_date = filter_input(INPUT_POST, 'start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    //var_dump($start_date);
    $result = mssql_qw("SELECT u.id
                            ,uh.name
                            ,uh.shortname
                            ,u.[cost]
                            ,uh.additional
                            ,u.[usluga_id]
                            ,u.[start_date]
                            ,u.[end_date]
                        FROM usluga u
                        inner JOIN usluga_helper uh ON u.usluga_id = uh.id
                        WHERE u.hostel_id = ? AND 
                            (u.end_date > CONVERT(SMALLDATETIME, '".$start_date."', 104) OR u.end_date IS NULL) AND 
                            u.start_date <= CONVERT(SMALLDATETIME, '".$start_date."', 104) AND
                            u.active_sign = 1 AND uh.additional = 1 
                        ORDER BY u.usluga_id", $hostel_id);
    $uslugi = NULL;
    while ($row = mssql_fetch_array($result)) 
    {
      $id = $row['id'];
      $name = $row['name'];
      $cost = $row['cost'];
      $additional = $row['additional'];
      if ($additional == null) 
      {
        $additional = 0;
      }
      $uslugi[$row['usluga_id']] = array($name, $cost, $additional, $id);
    }

    return $uslugi;
  }

  public function room_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $number = sys::secure($_REQUEST['number']);
    $naznachenie_id = (int) $_REQUEST['naznachenie_id'];
    $sex_id = (int) $_REQUEST['sex_id'];
    $area = filter_input(INPUT_POST, 'area', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION | FILTER_FLAG_ALLOW_THOUSAND);
    $area = str_replace(',', '.', $area);
    $places = (int) $_REQUEST['places'];
    $number_of_windows = (int) $_REQUEST['number_of_windows'];
    $quality_windows = sys::secure($_REQUEST['quality_windows']);
    $number_of_doors = (int) $_REQUEST['number_of_doors'];
    $quality_doors = sys::secure($_REQUEST['quality_doors']);
    $number_of_sockets = (int) $_REQUEST['number_of_sockets'];
    $quality_sockets = sys::secure($_REQUEST['quality_sockets']);
    $number_of_light = (int) $_REQUEST['number_of_light'];
    $quality_light = sys::secure($_REQUEST['quality_light']);
    $general_state = sys::secure($_REQUEST['general_state']);

    $room_id = (int) $_REQUEST['room_id'];
    
    $query = mssql_query("UPDATE room SET hostel_id=$hostel_id,number='$number',
        naznachenie_id=$naznachenie_id,
        sex_id=$sex_id,
        area=$area,places=$places,
        number_of_windows=$number_of_windows,quality_windows='$quality_windows',
        number_of_doors=$number_of_doors,quality_doors='$quality_doors',
        number_of_sockets=$number_of_sockets,quality_sockets='$quality_sockets',
        number_of_light=$number_of_light,quality_light='$quality_light',
        general_state='$general_state'
    WHERE id = $room_id"
    );

    if (isset($_REQUEST['equipment']))
    {
        // Оснащение помещения
        $equipment = $_REQUEST['equipment'];  // массив
        $query = mssql_query("UPDATE room_equipment SET active_sign='0' where room_id=$room_id");
        foreach ($equipment as $el) 
        {
            $el_id = (int) $el['id'];
            $el_name = (int) $el['name'];
            $el_cnt = (int) $el['cnt'];
            if (empty($el_id)) 
            {
                $query = mssql_query("insert into room_equipment(room_id,equipment_id,cnt) values($room_id,'$el_name',$el_cnt)");
            }
            else
            {
                $query = mssql_query("UPDATE room_equipment SET equipment_id='$el_name',cnt=$el_cnt, active_sign='1' where id=$el_id");
            }
        }
    }

    $R = array('result' => '1');

    return $R;
  }

  public function building_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $number = sys::secure($_REQUEST['number']);
    $name = sys::secure($_REQUEST['name']);
    $area = (int) $_REQUEST['area'];
    $height = (int) $_REQUEST['height'];
    $volume = (int) $_REQUEST['volume'];
    $number_of_seats = (int) $_REQUEST['number_of_seats'];
    $rooms = (int) $_REQUEST['rooms'];
    $apartment = (int) $_REQUEST['apartment'];
    $non_live_rooms = (int) $_REQUEST['non_live_rooms'];
    $all_rooms = (int) $_REQUEST['all_rooms'];

    $building_id = (int) $_REQUEST['building_id'];

    $query = mssql_query("UPDATE building SET "
            . "hostel_id=$hostel_id,number='$number',name='$name', "
            . "area=$area,height=$height, "
            . "volume=$volume,number_of_seats=$number_of_seats, "
            . "rooms=$rooms,apartment=$apartment, "
            . "non_live_rooms=$non_live_rooms,all_rooms=$all_rooms "
            . "WHERE id = $building_id"
    );

    $R = array('result' => '1');

    return $R;
  }

  public function list_room_naznachenie_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $id = (int) $_REQUEST['id'];

    $query = mssql_query("UPDATE room_naznachenie SET "
            . "naznachenie='$name' "
            . "WHERE id = $id"
    );

    $R = array('result' => '1');

    return $R;
  }
  
  public function list_room_equipment_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $id = (int) $_REQUEST['id'];

    $query = mssql_query("UPDATE room_equipment_helper SET "
            . "name='$name' "
            . "WHERE id = $id"
    );

    $R = array('result' => '1');

    return $R;
  }
  
  public function list_soft_equipment_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $id = (int) $_REQUEST['id'];

    $query = mssql_query("UPDATE soft_equipment_helper SET "
            . "name='$name' "
            . "WHERE id = $id"
    );

    $R = array('result' => '1');

    return $R;
  }

  public function users_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $login = sys::secure($_REQUEST['login']);
    $passwd = sys::secure($_REQUEST['passwd']);
    $fio = sys::secure($_REQUEST['fio']);
    $user_group_id = (int) $_REQUEST['user_group_id'];
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $use_ip_filter = (int) $_REQUEST['use_ip_filter'];
    $ip_filter = sys::secure($_REQUEST['ip_filter']);

    $id = (int) $_REQUEST['id'];

    $query = mssql_query("UPDATE users SET "
            . "login='$login',"
            . "passwd='$passwd',"
            . "fio='$fio',"
            . "user_group_id=$user_group_id,"
            . "hostel_id=$hostel_id,"
            . "use_ip_filter='$use_ip_filter',"
            . "ip_filter='$ip_filter' "
            . "WHERE id = $id"
    );

    $R = array('result' => '1');

    return $R;
  }

  public function structural_elements_save() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $name = sys::secure($_REQUEST['name']);
    $description = sys::secure($_REQUEST['description']);
    $wear = (int) $_REQUEST['wear'];

    $structural_elements_id = (int) $_REQUEST['structural_elements_id'];

    $query = mssql_query("UPDATE structural_elements SET "
            . "hostel_id=$hostel_id,name='$name',description='$description', "
            . "wear=$wear "
            . "WHERE id = $structural_elements_id"
    );

    $R = array('result' => '1');

    return $R;
  }

  public function room_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update room set active_sign=0 where id=$id");
    // Оснащение помещения
    $query = mssql_query("update room_equipment set active_sign=0 where room_id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }

  public function building_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update building set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }

  public function list_room_naznachenie_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update room_naznachenie set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }
  
  public function list_room_equipment_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update room_equipment_helper set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }
  
  public function list_soft_equipment_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update soft_equipment_helper set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }

  public function users_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update users set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }

  public function structural_elements_delete() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $id = (int) $_REQUEST['id'];

    $query = mssql_query("update structural_elements set active_sign=0 where id=$id");

    if ($query) {
      $R = array('result' => '1');
    }
    return $R;
  }

  public function add_hostel() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = $_REQUEST['name'];
    $address = $_REQUEST['address'];
    $construct_year = $_REQUEST['construct_year'];
    $percent_iznos = $_REQUEST['percent_iznos'];
    $examination_date = $_REQUEST['examination_date'];
    $inventar_number = $_REQUEST['inventar_number'];
    $liter = $_REQUEST['liter'];
    $naznachenie = $_REQUEST['naznachenie'];
    $floors = $_REQUEST['floors'];
    $underground_floors = $_REQUEST['underground_floors'];
    $area = $_REQUEST['area'];
    $number_of_lifts = $_REQUEST['number_of_lifts'];

    
    $query = mssql_qw("INSERT INTO hostel (name,
            address,
            construct_year,
            percent_iznos,
            examination_date,
            inventar_number,
            liter,
            naznachenie,
            floors,
            underground_floors,
            area,
            number_of_lifts
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
            , $name
            , $address
            , $construct_year
            , $percent_iznos
            , $examination_date
            , $inventar_number
            , $liter
            , $naznachenie
            , $floors
            , $underground_floors
            , $area
            , $number_of_lifts
    );
    
    $query = mssql_query("SELECT SCOPE_IDENTITY()");

    $hostel_id = mssql_result($query, 0, 0);

    if ($hostel_id > 0)
    {
        $R = array('result' => '1', 'hostel_id' => $hostel_id);
    }

    return $R;
  }

  //добавление информацию о проживающего
  public function add_person() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);
    $last_name = filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING);
    $first_name = filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING);
    $otc = filter_input(INPUT_POST, 'otc', FILTER_SANITIZE_STRING);

    $query = mssql_qw("INSERT INTO person (last_name,
            first_name,
            otc,
            hostel_id
            ) VALUES (?,?,?,?)"
            , $last_name
            , $first_name
            , $otc
            , $hostel_id
    );

    $person_id = mssql_result($query, 0, 0);

    if ($person_id > 0)
      $R = array('result' => '1', 'person_id' => $person_id);

    return $R;
  }

  //возвращает список пустых комнат в общежитии
  public function get_hostel_free_room() 
  {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');

    $person_id = (int) filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $hostel_id = $_SESSION['abitprof']['current_hostel_id'];//(int) filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);
    $sex = (int) filter_input(INPUT_POST, 'sex', FILTER_VALIDATE_INT);
    $faculty_id = (int) filter_input(INPUT_POST, 'faculty_id', FILTER_VALIDATE_INT);
    $group_name = filter_input(INPUT_POST, 'group_name', FILTER_SANITIZE_STRING);
    $room_id = (int) filter_input(INPUT_POST, 'room_id', FILTER_VALIDATE_INT);
    
    $result = mssql_query("SELECT r.id
      ,r.number
      ,r.places_full
      ,r.places 
      ,r.sex_id
      ,(r.places - r.places_full) AS free_places
      ,pr.person_id
      ,pe.first_name
      ,pe.last_name
      ,pe.otc
      ,pe.sex
      ,pe.faculty_id
      ,pe.sex
      ,pe.faculty_id
      ,pe.group_name
      ,fac.fac_short
      FROM room AS r 
      LEFT JOIN person_room AS pr ON pr.room_id = r.id AND pr.active_sign = 1
      LEFT JOIN person AS pe ON pr.person_id = pe.id
      LEFT JOIN faculty AS fac ON fac.fac_id = pe.faculty_id
      WHERE r.places_full < r.places and r.hostel_id= '$hostel_id' and r.active_sign = 1 and r.id <> '$room_id' and (pr.active_sign IS NULL OR pr.active_sign = 1)
      ORDER BY r.number");

    $room_list = array();
    $room_counter = 0;


    while ($row = mssql_fetch_array($result)) 
    {


      $room_id_row = $row['id'];
      $number_row = $row['number'];
      $places_row = $row['places'];
      $free_places_row = $row['free_places'];
      $sex_row = $row['sex'];
      $sex_room_id = $row['sex_id'];
      $faculty_id_row = $row['faculty_id'];
      $group_name_row = $row['group_name'];
      $fac_short_row = $row['fac_short'];

      $person_id_row = $row['person_id'];
      $first_name_row = $row['first_name'];
      $last_name_row = $row['last_name'];
      $otc_row = $row['otc'];

      $name_sex="";
      if($sex_room_id==1){
        $name_sex="МУЖ";
      }else if($sex_room_id==2){
        $name_sex="ЖЕН";
      }else if($sex_room_id==3){
        $name_sex="СЕМ";
      }else if($sex_room_id==4){
        $name_sex="СВОБ";
      }
      
      
      if (($sex == $sex_room_id) or ( $sex_room_id === 4) or ($sex_room_id===3)) 
      {
        $ball = 0;
        if (isset($room_list[$room_id_row])) 
        {
          $ball = $room_list[$room_id_row][2];
          $person_list = $room_list[$room_id_row][3];
        }
        else 
        {
          //проверяем только один раз
          switch ($free_places_row) 
          {
            case 1: 
              $ball += 10;
              break;
            case 2: 
              $ball += 9;
              break;
            case 3: 
              $ball += 8;
              break;
            case 4: 
              $ball += 7;
              break;
          }
        }

        //если в комнате уже кто-то живет
        if (($person_id_row <> "") and ( $person_id_row <> $person_id)) 
        {
          if ($group_name == $group_name_row) 
          {
            $ball += 1000;
          }
          if ($faculty_id == $faculty_id_row) 
          {
            $ball += 100;
          }

          $person_list[$person_id_row] = array($last_name_row, $first_name_row, $otc_row, $group_name_row, $fac_short_row);
        } 
        else 
        {
          $person_list = NULL;
        }
        $room_list[$room_id_row] = array($number_row, $free_places_row, $ball, $person_list, $room_id_row,$places_row,$name_sex);
        $person_list = NULL;
      }
    }

    //$text = "";
    //$text = print_r($room_list);
    

//    usort($room_list, "cmp");
      array_multisort($room_list,0);
    $text = "";
    
    //Текущая комната
    
//    $text .= '<tr class="info"><td></td><td></td><td></td><td><button class="btn btn-primary btn-xs person_room_select_button" id="stay_in_current_room">Оставить</button></td></tr>';
    
    foreach ($room_list AS $room) 
    {
      $text .= '<tr data-id="'.$room[4].'" data-name="'.$room[0].'">';
      $text .= "<td class='col-sm-1'>" . $room[0] . "<br>".$room[6] ."</td><td class='col-sm-1'>".$room[5]."</td><td class='col-sm-1' align='center'>" . $room[1] . "</td><td class='col-sm-7'>";
        $text .= '<div class="dates">';
          $text .= 'С <input type="text" class="start_date input-xs"> по <input type="text" class="end_date input-xs">';
        $text .= "</div>";
        if ($room[3] <> NULL) 
        {
          foreach ($room[3] AS $person) 
          {
            $text .= "<div class='person_edit_room_neibor'>" . $person[0] . " " . $person[1] . " " . $person[2] . " " . $person[4] . ", " . $person[3] . "</div>";
          }
        }
      $text .= "</td>";
      $text.="<td class='col-sm-2'>";
        $text.="<button class='btn btn-default person_room_select_button btn-xs'>Выбрать</button>";
        $text.="<button class='btn btn-success btn-xs'>Ок</button>";
        $text.=" <button class='btn btn-danger btn-xs' >Отмена</button>";
      $text.="</td>";
      $text.="</tr>";
    }


    $R = array('result' => $text);
    return $R;
  }

  
  
  public function get_hostel_free_room_family() 
  {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');

    $person_id = (int) filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $hostel_id = (int) filter_input(INPUT_POST, 'hostel_id', FILTER_VALIDATE_INT);
    $sex = (int) filter_input(INPUT_POST, 'sex', FILTER_VALIDATE_INT);
    $faculty_id = (int) filter_input(INPUT_POST, 'faculty_id', FILTER_VALIDATE_INT);
    $group_name = filter_input(INPUT_POST, 'group_name', FILTER_SANITIZE_STRING);
    $room_id = (int) filter_input(INPUT_POST, 'room_id', FILTER_VALIDATE_INT);

//    $result = mssql_qw("
//      SELECT r.id
//      ,r.number
//      ,r.places_full
//      ,r.places 
//      ,(r.places - r.places_full) AS free_places
//      ,pr.person_id
//      ,pe.first_name
//      ,pe.last_name
//      ,pe.otc
//      ,pe.sex
//      ,pe.faculty_id
//      ,pe.sex
//      ,pe.faculty_id
//      ,pe.group_name
//      ,fac.fac_short
//      FROM room AS r 
//      LEFT JOIN person_room AS pr ON pr.room_id = r.id
//      LEFT JOIN person AS pe ON pr.person_id = pe.id
//      LEFT JOIN faculty AS fac ON fac.fac_id = pe.faculty_id
//      WHERE r.places_full < r.places and r.hostel_id= ?  and r.active_sign = 1 and r.id <> ? and pr.active_sign not in(0)
//      ORDER BY r.number, pe.faculty_id DESC, pe.group_name DESC,free_places DESC
//    ", $hostel_id, $room_id);
    
    
    $result = mssql_query("SELECT r.id
      ,r.number
      ,r.places_full
      ,r.places 
      ,r.sex_id
      ,(r.places - r.places_full) AS free_places
      ,pr.person_id
      ,pe.first_name
      ,pe.last_name
      ,pe.otc
      ,pe.sex
      ,pe.faculty_id
      ,pe.sex
      ,pe.faculty_id
      ,pe.group_name
      ,fac.fac_short
      FROM room AS r 
      LEFT JOIN person_room AS pr ON pr.room_id = r.id AND pr.active_sign = 1
      LEFT JOIN person AS pe ON pr.person_id = pe.id
      LEFT JOIN faculty AS fac ON fac.fac_id = pe.faculty_id
      WHERE r.places_full < r.places and r.hostel_id= '$hostel_id' and r.active_sign = 1 and r.id <> '$room_id' and (pr.active_sign IS NULL OR pr.active_sign = 1)
      ORDER BY r.number");

    $room_list = array();
    $room_counter = 0;


    while ($row = mssql_fetch_array($result)) 
    {


      $room_id_row = $row['id'];
      $number_row = $row['number'];
      $free_places_row = $row['free_places'];
      $sex_row = $row['sex'];
      $room_sex_row = $row['sex_id'];
      $faculty_id_row = $row['faculty_id'];
      $group_name_row = $row['group_name'];
      $fac_short_row = $row['fac_short'];

      $person_id_row = $row['person_id'];
      $first_name_row = $row['first_name'];
      $last_name_row = $row['last_name'];
      $otc_row = $row['otc'];

      if (($room_sex_row == 3) or ( $room_sex_row == "") or ($room_sex_row == $sex)) 
      {
        $ball = 0;
        if (isset($room_list[$room_id_row])) 
        {
          $ball = $room_list[$room_id_row][2];
          $person_list = $room_list[$room_id_row][3];
        }
        else 
        {
          //проверяем только один раз
          switch ($free_places_row) 
          {
            case 1: 
              $ball += 10;
              break;
            case 2: 
              $ball += 9;
              break;
            case 3: 
              $ball += 8;
              break;
            case 4: 
              $ball += 7;
              break;
          }
        }

        //если в комнате уже кто-то живет
        if (($person_id_row <> "") and ( $person_id_row <> $person_id)) 
        {
          if ($group_name == $group_name_row) 
          {
            $ball += 1000;
          }
          if ($faculty_id == $faculty_id_row) 
          {
            $ball += 100;
          }

          $person_list[$person_id_row] = array($last_name_row, $first_name_row, $otc_row, $group_name_row, $fac_short_row);
        } 
        else 
        {
          $person_list = NULL;
        }
        $room_list[$room_id_row] = array($number_row, $free_places_row, $ball, $person_list, $room_id_row);
        $person_list = NULL;
      }
    }

    //$text = "";
    //$text = print_r($room_list);
    

//    usort($room_list, "cmp");
      array_multisort($room_list,0);
    $text = "";
    
    //Текущая комната
    
//    $text .= '<tr class="info"><td></td><td></td><td></td><td><button class="btn btn-primary btn-xs person_room_select_button" id="stay_in_current_room">Оставить</button></td></tr>';
    
    foreach ($room_list AS $room) 
    {
      $text .= "<tr>";
      $text .= "<td>" . $room[0] . "</td><td class='col-sm-2' align='center'>" . $room[1] . "</td><td>";
      if ($room[3] <> NULL) 
      {
        foreach ($room[3] AS $person) 
        {
          $text .= "<div class='person_edit_room_neibor'>" . $person[0] . " " . $person[1] . " " . $person[2] . " " . $person[4] . ", " . $person[3] . "</div>";
        }
      }
      $text .= "</td><td><button class='btn btn-default person_room_select_button btn-xs' onclick='person_edit_change_room(\"" . $room[0] . "\"," . $room[4] . ")'>Выбрать</button></td></tr>";
    }


    $R = array('result' => $text);
    return $R;
  }

  
  
  
  
  
  
  //сохраняет измененную информацию о проживающем
  public function save_person() 
  {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');

    $id = (int) filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $last_name = filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING);
    $first_name = filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING);
    $otc = filter_input(INPUT_POST, 'otc', FILTER_SANITIZE_STRING);
    $room_start_date = filter_input(INPUT_POST, 'room_start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $room_end_date = filter_input(INPUT_POST, 'room_end_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $room_id = (int) filter_input(INPUT_POST, 'room_id', FILTER_VALIDATE_INT);
    $sex_person_id = (int) filter_input(INPUT_POST, 'sex', FILTER_VALIDATE_INT);
    
    $med_spravka_date = filter_input(INPUT_POST, 'med_spravka_date', FILTER_SANITIZE_STRING);
    $med_flg_date = filter_input(INPUT_POST, 'med_flg_date', FILTER_SANITIZE_STRING);
    
    $med_spravka_date=empty($med_spravka_date)?'null':"CONVERT(DATE,'$med_spravka_date',104)";
    $med_flg_date=empty($med_flg_date)?'null':"CONVERT(DATE,'$med_flg_date',104)";

    $category = filter_input(INPUT_POST, 'category', FILTER_VALIDATE_INT);
    $learn_form_id = filter_input(INPUT_POST, 'learn_form_id', FILTER_VALIDATE_INT);
    $sex = filter_input(INPUT_POST, 'sex', FILTER_VALIDATE_INT);
    $commerce = filter_input(INPUT_POST, 'commerce', FILTER_VALIDATE_INT);
    $faculty_id = filter_input(INPUT_POST, 'faculty_id', FILTER_VALIDATE_INT);
    $dogovor = filter_input(INPUT_POST, 'dogovor', FILTER_SANITIZE_STRING);
    $otdel_id = filter_input(INPUT_POST, 'otdel_id', FILTER_SANITIZE_STRING);
    $group_name = filter_input(INPUT_POST, 'group_name', FILTER_SANITIZE_STRING);
    $position = filter_input(INPUT_POST, 'position', FILTER_SANITIZE_STRING);
    $bday = filter_input(INPUT_POST, 'bday', FILTER_SANITIZE_STRING);
    $bday_place = filter_input(INPUT_POST, 'bday_place', FILTER_SANITIZE_STRING);
    $doc_ser = filter_input(INPUT_POST, 'doc_ser', FILTER_SANITIZE_STRING);
    $doc_num = filter_input(INPUT_POST, 'doc_num', FILTER_SANITIZE_STRING);
    $doc_place = filter_input(INPUT_POST, 'doc_place', FILTER_SANITIZE_STRING);
    $doc_date = filter_input(INPUT_POST, 'doc_date', FILTER_SANITIZE_STRING);
    $home_address = filter_input(INPUT_POST, 'home_address', FILTER_SANITIZE_STRING);
    $registration_time = filter_input(INPUT_POST, 'registration_time', FILTER_SANITIZE_STRING);
    $account_number = filter_input(INPUT_POST, 'account_number', FILTER_SANITIZE_STRING);

    $phone_number = filter_input(INPUT_POST, 'phone_number', FILTER_SANITIZE_STRING);
    $other_phone_number = filter_input(INPUT_POST, 'other_phone_number', FILTER_SANITIZE_STRING);
    $country = filter_input(INPUT_POST, 'country', FILTER_SANITIZE_STRING);
    $region = filter_input(INPUT_POST, 'region', FILTER_SANITIZE_STRING);
    $area = filter_input(INPUT_POST, 'area', FILTER_SANITIZE_STRING);
    $city = filter_input(INPUT_POST, 'city', FILTER_SANITIZE_STRING);
    $nas_punkt = filter_input(INPUT_POST, 'nas_punkt', FILTER_SANITIZE_STRING);
    $street = filter_input(INPUT_POST, 'street', FILTER_SANITIZE_STRING);
    $house = filter_input(INPUT_POST, 'house', FILTER_SANITIZE_STRING);
    $korp = filter_input(INPUT_POST, 'korp', FILTER_SANITIZE_STRING);
    $apartment = filter_input(INPUT_POST, 'apartment', FILTER_SANITIZE_STRING);
    $post_index = filter_input(INPUT_POST, 'post_index', FILTER_VALIDATE_INT);
    
    
    // Проверка на существование дублей
    $dubl=false;
    if ($id == 0) 
    {
      $rDubl=mssql_query("select id from person where last_name='$last_name' and first_name='$first_name' and otc='$otc' and doc_ser='$doc_ser' and doc_num='$doc_num' and active_sign=1");
      if(mssql_num_rows($rDubl)>0){
        $dubl=true;
      }
    }  else {
//      $rDubl=mssql_query("select id from person where last_name='$last_name' and first_name='$first_name' and otc='$otc' and doc_ser='$doc_ser' and doc_num='$doc_num' and active_sign=1 and id<>$id");
//      if(mssql_num_rows($rDubl)>0){
//        $dubl=true;
//      }
    }
    
    if(!$dubl){
      
    if ($id == 0) 
    {
      $query = mssql_qw("INSERT INTO person (last_name,
            first_name,
            otc
            ) VALUES (?,?,?)
            SELECT @@IDENTITY"
              , $last_name
              , $first_name
              , $otc
      );
      $id = mssql_result($query, 0, 0);
    }
    else 
    {

      if (filter_has_var(INPUT_POST, 'dop_uslugi'))
      {
        $uslugi = $_POST['dop_uslugi'];

        //зануляем все доп услуги для проживающего
        $query = mssql_qw("UPDATE person_usluga SET active_sign = '0' WHERE person_id=?", $id);
        foreach ($uslugi as $one_usluga)
        {
          $usluga_isset = mssql_qw("SELECT * FROM person_usluga WHERE person_id=? AND usluga_id=?", $id, $one_usluga);
          if (mssql_num_rows($usluga_isset) > 0) 
          {
            $query = mssql_qw("UPDATE person_usluga SET active_sign = '1' WHERE person_id=? AND usluga_id=?", $id, $one_usluga);
          } 
          else 
          {
            $query = mssql_qw("INSERT INTO person_usluga (person_id,usluga_id) VALUES (?,?)", $id, $one_usluga);
          }
        }
      }
    }


    if ($registration_time === '')
    {
        $reg_time = 'registration_time=NULL,';
    }
    else
    {
        $reg_time = "registration_time=(CONVERT(SMALLDATETIME,'$registration_time',104)),";
    }
    
    $sql = "UPDATE person SET
    last_name='$last_name',
    first_name='$first_name',
    otc='$otc',
    sex=$sex,
    med_spravka_date=$med_spravka_date,
    med_flg_date=$med_flg_date,
    category=$category,
    learn_form_id=$learn_form_id,
    commerce=$commerce,
    faculty_id=$faculty_id,
    otdel_id='$otdel_id',
    group_name='$group_name',
    position='$position',
    dogovor='$dogovor',
    bday=(CONVERT(SMALLDATETIME,'$bday',104)),
    bday_place='$bday_place',
    doc_ser='$doc_ser',
    doc_num='$doc_num',
    doc_place='$doc_place',
    doc_date=(CONVERT(SMALLDATETIME,'$doc_date',104)),
    home_address='$home_address',
    $reg_time
    account_number='$account_number',
    phone_number='$phone_number',
    other_phone_number='$other_phone_number',
    country='$country',
    region='$region',
    area='$area',
    city='$city',
    nas_punkt='$nas_punkt',
    street='$street',
    house='$house',
    korp='$korp',
    apartment='$apartment',
    post_index='$post_index'
    WHERE id = $id"
    ;
    
    $query = mssql_query($sql);

    if ($query) {
      $R = array('result' => '1', 'id' => $id);
    } else {
      $R = array('result' => '0', 'id' => $id);
    }
    
    }else{
      $R = array('result' => '0', 'message' => 'Человек с таким ФИО и паспортом уже есть в базе');
    }
    
    return $R;
  }
  
  public function save_person_room() 
  {
    // Сохранение выбора комнаты
    
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');

    $person_id=(int) filter_input(INPUT_POST, 'person_id', FILTER_VALIDATE_INT);
    $room_start_date = filter_input(INPUT_POST, 'room_start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $room_end_date = filter_input(INPUT_POST, 'room_end_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $room_id = (int) filter_input(INPUT_POST, 'room_id', FILTER_VALIDATE_INT);
    $sex_person_id = (int) filter_input(INPUT_POST, 'sex', FILTER_VALIDATE_INT);

    $room_isset = mssql_qw("SELECT id, person_id, room_id FROM person_room WHERE person_id=? and active_sign=1 and deleted=0 ORDER BY id DESC", $person_id);

    if (mssql_num_rows($room_isset) > 0){
      // уже гдето заселен

      $room_isset_result = mssql_fetch_array($room_isset);

      if ($room_isset_result['room_id'] !== $room_id){
        // переселение
        $room_is_free = mssql_qw("SELECT places, places_full,sex_id FROM room WHERE id=?", $room_id);
        $result_room_is_free = mssql_fetch_array($room_is_free);
        $places = $result_room_is_free['places'];
        $places_full = $result_room_is_free['places_full'];
        $sex_id = $result_room_is_free['sex_id'];
        $places_free = $places - $places_full;
        if ($places_free > 0) 
        {
          // Обновляем таблицу person_room исходя из новых значений даты начала и конца
          $Person_room_update=person_room_update($person_id,$room_id,$room_start_date,$room_end_date);
          if($Person_room_update['result']===false){
            $R = array('result' => '0', 'message' => $Person_room_update['message']);
            return $R;
          }

          // Обновляем количество занятих мест в комнатах
          // старая комната - уменьшаем кол-во занятых мест
          $old_room = mssql_qw("SELECT places, places_full FROM room WHERE id=?", $room_isset_result['room_id']);
          $old_room_result = mssql_fetch_array($old_room);
          $ck=$old_room_result['places_full']-1;
          if($ck===0){
            mssql_qw("UPDATE room SET places_full = 0, sex_id=4 WHERE id=?", $room_isset_result['room_id']);
          }else{
            mssql_qw("UPDATE room SET places_full = ? WHERE id=?", ($old_room_result['places_full'] - 1), $room_isset_result['room_id']);
          }

          // новая комната - увеличиваем кол-во занятых мест
          if($sex_id == 4){
            mssql_qw("UPDATE room SET places_full = ?, sex_id = $sex_person_id WHERE id=?", ($places_full + 1), $room_id);
          }else{
            mssql_qw("UPDATE room SET places_full = ? WHERE id=?", ($places_full + 1), $room_id);
          }

          $R = array('result' => '1');
        }
        else 
        {
          $R = array('result' => '0', 'message' => 'Комната уже полностью занята! Выберите другую комнату!' . $places . ' ' . $places_full . '  ' . $room_id . ' ');
          return $R;
        }
      }
      else //Редактируем текущее поселение в комнате
      {

        // Обновляем таблицу person_room исходя из новых значений даты начала и конца
        $Person_room_update=person_room_update($person_id,$room_id,$room_start_date,$room_end_date);
        if($Person_room_update['result']===false){
          $R = array('result' => '0', 'message' => $Person_room_update['message']);
          return $R;
        }

        $R = array('result' => '1');
      }
    }else{
      //заселение

      $room_is_free = mssql_qw("SELECT places, places_full, sex_id FROM room WHERE id=?", $room_id);
      $result_room_is_free = mssql_fetch_array($room_is_free);
      $places = $result_room_is_free['places'];
      $places_full = $result_room_is_free['places_full'];
      $sex_id = $result_room_is_free['sex_id'];
      $places_free = $places - $places_full;
      if ($places_free > 0) 
      {
        // Обновляем таблицу person_room исходя из новых значений даты начала и конца
        $Person_room_update=person_room_update($person_id,$room_id,$room_start_date,$room_end_date);
        if($Person_room_update['result']===false){
          $R = array('result' => '0', 'message' => $Person_room_update['message']);
          return $R;
        }

        // Обновляем количество занятих мест в комнатах
        // новая комната - увеличиваем кол-во занятых мест
        if($sex_id == 4){
          mssql_qw("UPDATE room SET places_full = ?, sex_id = $sex_person_id WHERE id=?", ($places_full + 1), $room_id);
        }else{
          mssql_qw("UPDATE room SET places_full = ? WHERE id=?", ($places_full + 1), $room_id);
        }

        $R = array('result' => '1');
      }
      else 
      {
        $R = array('result' => '0', 'message' => 'Комната уже полностью занята! Выберите другую комнату! ' . $places_free . ' ');
        return $R;
      }
    }

    return $R;
  }

  public function room_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $number = (int) $_REQUEST['number'];
    $naznachenie_id = (int) $_REQUEST['naznachenie_id'];
    $sex_id = (int) $_REQUEST['sex_id'];
    $area = (int) $_REQUEST['area'];
    $places = (int) $_REQUEST['places'];
    $number_of_windows = (int) $_REQUEST['number_of_windows'];
    $quality_windows = sys::secure($_REQUEST['quality_windows']);
    $number_of_doors = (int) $_REQUEST['number_of_doors'];
    $quality_doors = sys::secure($_REQUEST['quality_doors']);
    $number_of_sockets = (int) $_REQUEST['number_of_sockets'];
    $quality_sockets = sys::secure($_REQUEST['quality_sockets']);
    $number_of_light = (int) $_REQUEST['number_of_light'];
    $quality_light = sys::secure($_REQUEST['quality_light']);
    $general_state = sys::secure($_REQUEST['general_state']);

    $query = mssql_qw("INSERT INTO room (number
            ,hostel_id
            ,naznachenie_id
            ,sex_id
            ,area
            ,places
            ,number_of_windows
            ,quality_windows
            ,number_of_doors
            ,quality_doors
            ,number_of_sockets
            ,quality_sockets
            ,number_of_light
            ,quality_light
            ,general_state
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            select @@IDENTITY
            "
            , $number
            , $hostel_id
            , $naznachenie_id
            , $sex_id
            , $area
            , $places
            , $number_of_windows
            , $quality_windows
            , $number_of_doors
            , $quality_doors
            , $number_of_sockets
            , $quality_sockets
            , $number_of_light
            , $quality_light
            , $general_state
    );

    $room_id = mssql_result($query, 0, 0);

    if ($room_id > 0) 
    {

      // Оснащение помещения
        if (isset($_REQUEST['equipment']))
        {
            $equipment = $_REQUEST['equipment'];  // массив
      //      $query = mssql_query("UPDATE room_equipment SET active_sign='0' where room_id=$room_id");
            foreach ($equipment as $el) 
            {
              $el_id = (int) $el['id'];
              $el_name = sys::secure($el['name']);
              $el_cnt = (int) $el['cnt'];
              if (empty($el_id)) 
              {
                $query = mssql_query("insert into room_equipment(room_id,name,cnt) values($room_id,'$el_name',$el_cnt)");
              } 
              else 
              {
      //          $query = mssql_query("UPDATE room_equipment SET name='$el_name',cnt=$el_cnt, active_sign='1' where id=$el_id");
              }
            }
        }

      $R = array('result' => '1', 'room_id' => $room_id);
    }

    return $R;
  }

  public function building_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $number = sys::secure($_REQUEST['number']);
    $name = sys::secure($_REQUEST['name']);
    $area = (int) $_REQUEST['area'];
    $height = (int) $_REQUEST['height'];
    $volume = (int) $_REQUEST['volume'];
    $number_of_seats = (int) $_REQUEST['number_of_seats'];
    $rooms = (int) $_REQUEST['rooms'];
    $apartment = (int) $_REQUEST['apartment'];
    $non_live_rooms = (int) $_REQUEST['non_live_rooms'];
    $all_rooms = (int) $_REQUEST['all_rooms'];

    $query = mssql_query("INSERT INTO building (
            number
            ,hostel_id
            ,name
            ,area
            ,height
            ,volume
            ,number_of_seats
            ,rooms
            ,apartment
            ,non_live_rooms
            ,all_rooms
            ) VALUES ('$number',$hostel_id,'$name',$area,$height,$volume,$number_of_seats,$rooms,$apartment,$non_live_rooms,$all_rooms)
            select @@IDENTITY
            "
    );

    $building_id = mssql_result($query, 0, 0);

    if ($building_id > 0)
      $R = array('result' => '1', 'building_id' => $building_id);

    return $R;
  }

  public function list_room_naznachenie_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $query = mssql_query("INSERT INTO room_naznachenie (naznachenie)
            VALUES ('$name')
            select @@IDENTITY
            "
    );

    $id = mssql_result($query, 0, 0);

    if ($id > 0)
      $R = array('result' => '1', 'id' => $id);

    return $R;
  }
  
  public function list_room_equipment_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $query = mssql_query("INSERT INTO room_equipment_helper (name)
            VALUES ('$name')
            select @@IDENTITY
            "
    );

    $id = mssql_result($query, 0, 0);

    if ($id > 0)
      $R = array('result' => '1', 'id' => $id);

    return $R;
  }
  
  public function list_soft_equipment_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $name = sys::secure($_REQUEST['name']);

    $query = mssql_query("INSERT INTO soft_equipment_helper (name)
            VALUES ('$name')
            select @@IDENTITY
            "
    );

    $id = mssql_result($query, 0, 0);

    if ($id > 0)
      $R = array('result' => '1', 'id' => $id);

    return $R;
  }

  public function users_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');

    $login = sys::secure($_REQUEST['login']);
    $passwd = sys::secure($_REQUEST['passwd']);
    $fio = sys::secure($_REQUEST['fio']);
    $user_group_id = (int) $_REQUEST['user_group_id'];
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $use_ip_filter = (int) $_REQUEST['use_ip_filter'];
    $ip_filter = sys::secure($_REQUEST['ip_filter']);

    $query = mssql_query("INSERT INTO users (login,passwd,fio,user_group_id,hostel_id,use_ip_filter,ip_filter)
            VALUES ('$login','$passwd','$fio',$user_group_id,$hostel_id,'$use_ip_filter','$ip_filter')
            select @@IDENTITY
            "
    );

    $id = mssql_result($query, 0, 0);

    if ($id > 0)
      $R = array('result' => '1', 'id' => $id);

    return $R;
  }

  public function structural_elements_add() {
    require_once conf::$ROOT . 'system/etc/functions.php';
    $R = array('result' => '0');
    $hostel_id = (int) $_REQUEST['hostel_id'];
    $name = sys::secure($_REQUEST['name']);
    $description = sys::secure($_REQUEST['description']);
    $wear = (int) $_REQUEST['wear'];

    $query = mssql_query("INSERT INTO structural_elements (
            hostel_id
            ,name
            ,description
            ,wear
            ) VALUES ($hostel_id,'$name','$description',$wear)
            select @@IDENTITY
            "
    );

    $structural_elements_id = mssql_result($query, 0, 0);

    if ($structural_elements_id > 0)
      $R = array('result' => '1', 'structural_elements_id' => $structural_elements_id);

    return $R;
  }

  public function anketa_citybase_get_region() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = array();

    $filter = '__' . '000' . '000' . '000' . '00';
    $result_array = array();
    $result = mssql_qw('SELECT CODE,(NAME+\' \'+SOCR) as NAME from CITYBASE_KLADR where CODE like \'' . $filter . '\' order by 2');
    if ($result)
      if (mssql_num_rows($result) > 0) {
        while ($row = mssql_fetch_object($result)) {
          $result_array[] = array('id' => $row->CODE, 'label' => $row->NAME, 'value' => $row->NAME);
        }
        $R = $result_array;
      }


    return $R;
  }

  public function anketa_citybase_get_area() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = array();

    if (!isset($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = 0;
    if (empty($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = '00';
    $filter = '' . $_REQUEST['ireg_id'] . '___' . '000' . '000' . '00';
    $filter_faild = '' . $_REQUEST['ireg_id'] . '000' . '000' . '000' . '00'; // исключить регионы

    $result_array = array();
    $result = mssql_qw('SELECT CODE,(NAME+\' \'+SOCR) as NAME from CITYBASE_KLADR where CODE like \'' . $filter . '\' and CODE not like \'' . $filter_faild . '\' order by 2');
    if ($result)
      if (mssql_num_rows($result) > 0) {
        while ($row = mssql_fetch_object($result)) {
          $result_array[] = array('id' => $row->CODE, 'label' => $row->NAME, 'value' => $row->NAME);
        }
        $R = $result_array;
      }

    return $R;
  }

  public function anketa_citybase_get_city() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = array();

    if (!isset($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = 0;
    if (!isset($_REQUEST['area_id']))
      $_REQUEST['area_id'] = 0;
    if (empty($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = '00';
    if (empty($_REQUEST['area_id']))
      $_REQUEST['area_id'] = '000';
    $filter = '' . $_REQUEST['ireg_id'] . $_REQUEST['area_id'] . '___' . '000' . '00';
    $filter_faild = '' . $_REQUEST['ireg_id'] . $_REQUEST['area_id'] . '000' . '000' . '00'; // исключить районы
    $result_array = array();
    $result = mssql_qw('SELECT CODE,(NAME+\' \'+SOCR) as NAME from CITYBASE_KLADR where CODE like \'' . $filter . '\' and CODE not like \'' . $filter_faild . '\' order by 2');
    if ($result)
      if (mssql_num_rows($result) > 0) {
        while ($row = mssql_fetch_object($result)) {
          $result_array[] = array('id' => $row->CODE, 'label' => $row->NAME, 'value' => $row->NAME);
        }
        $R = $result_array;
      }

    return $R;
  }

  public function anketa_citybase_get_nas_punkt() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = array();

    if (!isset($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = 0;
    if (!isset($_REQUEST['area_id']))
      $_REQUEST['area_id'] = 0;
    if (!isset($_REQUEST['city_id']))
      $_REQUEST['city_id'] = 0;
    if (empty($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = '00';
    if (empty($_REQUEST['area_id']))
      $_REQUEST['area_id'] = '000';
    if (empty($_REQUEST['city_id']))
      $_REQUEST['city_id'] = '000';
    $filter = '' . $_REQUEST['ireg_id'] . $_REQUEST['area_id'] . $_REQUEST['city_id'] . '___' . '00';
    $filter_faild = '' . $_REQUEST['ireg_id'] . $_REQUEST['area_id'] . $_REQUEST['city_id'] . '000' . '00'; // исключить город
    $result = mssql_qw('SELECT CODE,(NAME+\' \'+SOCR) as NAME from CITYBASE_KLADR where CODE like \'' . $filter . '\' and CODE not like \'' . $filter_faild . '\' order by 2');
    if ($result)
      if (mssql_num_rows($result) > 0) {
        while ($row = mssql_fetch_object($result)) {
          $result_array[] = array('id' => $row->CODE, 'label' => $row->NAME, 'value' => $row->NAME);
        }
        $R = $result_array;
      }

    return $R;
  }

  public function anketa_citybase_get_street() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = array();

    if (!isset($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = 0;
    if (!isset($_REQUEST['area_id']))
      $_REQUEST['area_id'] = 0;
    if (!isset($_REQUEST['city_id']))
      $_REQUEST['city_id'] = 0;
    if (!isset($_REQUEST['nas_punkt_id']))
      $_REQUEST['nas_punkt_id'] = 0;
    if (empty($_REQUEST['ireg_id']))
      $_REQUEST['ireg_id'] = '00';
    if (empty($_REQUEST['area_id']))
      $_REQUEST['area_id'] = '000';
    if (empty($_REQUEST['city_id']))
      $_REQUEST['city_id'] = '000';
    if (empty($_REQUEST['nas_punkt_id']))
      $_REQUEST['nas_punkt_id'] = '000';
    $filter = '' . $_REQUEST['ireg_id'] . $_REQUEST['area_id'] . $_REQUEST['city_id'] . $_REQUEST['nas_punkt_id'] . '__' . '____';
    $result = mssql_qw('SELECT CODE,(NAME+\' \'+SOCR) as NAME from CITYBASE_STREET where CODE like \'' . $filter . '\' order by 2');
    if ($result)
      if (mssql_num_rows($result) > 0) {
        while ($row = mssql_fetch_object($result)) {
          $result_array[] = array('id' => $row->CODE, 'label' => $row->NAME, 'value' => $row->NAME);
        }
        $R = $result_array;
      }

    return $R;
  }

  public function anketa_citybase_get_index() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $R = '';

    if (!isset($_REQUEST['street_id']))
      $_REQUEST['street_id'] = 0;
    $result = mssql_qw('SELECT [INDEX] from CITYBASE_STREET where CODE=?', $_REQUEST['street_id']);
    if ($result)
      if (mssql_num_rows($result) > 0) {
        $R.= mssql_result($result, 0, 0);
      }

    return $R;
  }
  
  public function qrcode() {
    require_once conf::$ROOT . 'system/etc/functions.php';

    $code=isset($_REQUEST['code'])?$_REQUEST['code']:' ';

    include(conf::$ROOT .'system/etc/phpqrcode/qrlib.php'); 

//    header("Cache-Control:");
    
    // outputs image directly into browser, as PNG stream 
//    QRcode::png("$code", $outfile = false, $level = QR_ECLEVEL_L, $size = 3, $margin = 0, $saveandprint=false);
    
    QRcode::png('PHP QR Code :)srfgb');
exit;
//    return $R;
  }
  
  public function fast_edit_person() {
    require_once conf::$ROOT . 'system/etc/functions.php';
      
    $start_date = sys::secure($_REQUEST['start_date']);
    $end_date = sys::secure($_REQUEST['end_date']);
    $person_id = (int)$_REQUEST['person_id'];
    $room_id = (int)$_REQUEST['room_id'];

    $Person_room_update=person_room_update($person_id,$room_id,$start_date,$end_date);
    if($Person_room_update['result']===false){
      $R = array('result' => false, 'message' => $Person_room_update['message']);
      return $R;
    }

    return array('result'=>true);
  }
  
    public function save_rates_row ()
    {
        if (!filter_has_var(INPUT_POST, 'id')||
            !filter_has_var(INPUT_POST, 'rate')||
            !filter_has_var(INPUT_POST, 'start_date')||
            !filter_has_var(INPUT_POST, 'end_date'))
        {
            return array('success' => false, 'error_message' => 'Переданы пустые поля');
        }
        
        $service_id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
        $new_rate = filter_input(INPUT_POST, 'rate', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION | FILTER_FLAG_ALLOW_THOUSAND);
        $start_date = filter_input(INPUT_POST, 'start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $end_date = filter_input(INPUT_POST, 'end_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

        
        $SQL = "SELECT DATEDIFF(day, start_date, CONVERT (date, '$end_date', 104)) as days FROM usluga WHERE id = '$service_id'";
        $result = mssql_query($SQL);
        $result = mssql_fetch_array($result);
        if ($result['days'] < 0)
        {
            return array('success' => false, 'message' => 'Проверьте правильность введённых дат.'.$result['days']);
        }
        
        
        $new_rate = str_replace(',', '.', $new_rate);
//        var_dump($new_rate);
//        die();
        
        $SQL = "UPDATE usluga "
             . "SET end_date = CONVERT (date, '$end_date', 104) "
             . "WHERE id = '$service_id'";
        mssql_query($SQL);
        $SQL = "SELECT hostel_id, usluga_id "
             . "FROM usluga "
             . "WHERE id = '$service_id'";
        $result = mssql_query($SQL);
        $result = mssql_fetch_array($result);
        $SQL = "INSERT INTO usluga (hostel_id, cost, usluga_id, start_date) "
             . "VALUES ('".$result['hostel_id']."', '$new_rate','".$result['usluga_id']."', CONVERT (date, '$start_date', 104))";
//        var_dump($SQL);
        mssql_query($SQL);
        return array('success' => true);
   
  }
  
  public function save_new_rate ()
  {
        if (!filter_has_var(INPUT_POST, 'id')||
            !filter_has_var(INPUT_POST, 'rate')||
            !filter_has_var(INPUT_POST, 'start_date')||
            !filter_has_var(INPUT_POST, 'additional')||
            !filter_has_var(INPUT_POST, 'hostel_id'))
        {
            return array('success' => false, 'error_message' => 'Переданы пустые поля');
        }
        
        $service_id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
        $new_rate = filter_input(INPUT_POST, 'rate', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION | FILTER_FLAG_ALLOW_THOUSAND);
        $start_date = filter_input(INPUT_POST, 'start_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $hostel_id = (int) filter_input(INPUT_POST, 'hostel_id', FILTER_SANITIZE_NUMBER_INT);
        $additional = (int) filter_input(INPUT_POST, 'additional', FILTER_SANITIZE_NUMBER_INT);
        
        
        $new_rate = str_replace(',', '.', $new_rate);
        
        $SQL = "INSERT INTO usluga (hostel_id, cost, usluga_id, start_date, additional) "
             . "VALUES ('$hostel_id', '$new_rate','$service_id', CONVERT (date, '$start_date', 104), '$additional')";
        mssql_query($SQL);
        
        return array('success' => true);
  }
  
  function get_saved_additional_services_list()
  {
      $person_id = (int) filter_input(INPUT_POST, 'person_id', FILTER_SANITIZE_NUMBER_INT);
      $SQL = "SELECT person_usluga.usluga_id 
                FROM person_usluga 
                
                LEFT JOIN usluga_helper ON usluga_helper.id = person_usluga.usluga_id 
                WHERE person_id = $person_id AND usluga_helper.additional = 1 AND person_usluga.active_sign = 1";
      $result = mssql_query($SQL);
      $array = array();
      while ($row = mssql_fetch_array($result))
      {
          $array[] = $row['usluga_id'];
      }
      return $array;
  }
  
  function del_oplata()
  {
      $id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $SQL = "UPDATE oplata SET active_sign = 0 WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function add_payment()
  {
      $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $date_pay = filter_input(INPUT_POST, 'date_pay', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
      
      $SQL = "update oplata set date_pay=convert(date,'$date_pay',104) WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function remove_payment()
  {
      $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $date_pay = filter_input(INPUT_POST, 'date_pay', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
      
      $SQL = "update oplata set date_pay=NULL WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function additional_service_change()
  {
    $userid = (int) filter_input(INPUT_POST, 'userid', FILTER_SANITIZE_NUMBER_INT);
    $usluga = (int) filter_input(INPUT_POST, 'usluga', FILTER_SANITIZE_NUMBER_INT);
    $status = (int) filter_input(INPUT_POST, 'status', FILTER_SANITIZE_NUMBER_INT);
    $end_date = filter_input(INPUT_POST, 'usluga_date', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    
    if($status === 1){
      
      // добавляем услугу
      
      $result = mssql_query("SELECT id FROM person_usluga WHERE person_id = $userid AND usluga_id = $usluga and active_sign = 1");
      if (mssql_num_rows($result) === 1)
      {
        // ничего не делаем - уже есть запись
//          $row = mssql_fetch_array($result);
//          $usluga_id = $row['id'];
//          mssql_query("UPDATE person_usluga SET active_sign = $status WHERE id = $usluga_id");
      }
      else
      {
          mssql_query("INSERT INTO person_usluga (person_id, usluga_id, active_sign) VALUES ($userid, $usluga, 1)");
      }
    }else{
      
      // убираем услугу
      
      $result = mssql_query("update person_usluga set end_date=convert(date,'$end_date',104), active_sign = 0 WHERE person_id = $userid AND usluga_id = $usluga and active_sign = 1");
    }
    
    
    
    return array('sucess' => true);
  }

  function add_person_note()
  {
      $userid = (int) filter_input(INPUT_POST, 'userid', FILTER_SANITIZE_NUMBER_INT);
      $note = filter_input(INPUT_POST, 'note', FILTER_SANITIZE_STRING);
      
      $SQL = "INSERT INTO person_notes (person, date, text) VALUES ('$userid', GETDATE(), '$note')";
      mssql_query($SQL);
      $result = mssql_query ("SELECT CONVERT(varchar(10), date, 104) as d, text, SCOPE_IDENTITY() as s FROM person_notes WHERE id = SCOPE_IDENTITY()");
      if (mssql_num_rows($result) === 1)
      {
        $row = mssql_fetch_array($result);
      
        return array('sucess' => true, 'row' => array($row['d'], $row['text'], $userid, $row['s']));
      }
      else
      {
          return array('sucess' => false);
      }
  }
  
  function delete_person_note()
  {
      $id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $SQL = "UPDATE person_notes SET active_sign = 0 WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function edit_person_note()
  {
      $id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $note = filter_input(INPUT_POST, 'note', FILTER_SANITIZE_STRING);
      
      $SQL = "UPDATE person_notes SET text = '$note' WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function add_soft_equipment()
  {
      $id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $userid = (int) filter_input(INPUT_POST, 'userid', FILTER_SANITIZE_NUMBER_INT);
      
      $SQL = "INSERT INTO person_soft_equipment (person_id, soft_equipment_id ) VALUES ('$userid', '$id')";
      mssql_query($SQL);
      
      $result = mssql_query ("SELECT SCOPE_IDENTITY() as s, soft_equipment_helper.name "
                           . "FROM person_soft_equipment "
                           . "LEFT JOIN soft_equipment_helper ON soft_equipment_helper.id = person_soft_equipment.soft_equipment_id "
                           . "WHERE person_soft_equipment.id = SCOPE_IDENTITY()");
      if (mssql_num_rows($result) === 1)
      {
        $row = mssql_fetch_array($result);
        return array('sucess' => true, 'row' => array($userid, $row['s'], $row['name']));
      }
      else
      {
          return array('sucess' => false);
      }
  }
  function edit_soft_equipment()
  {
      $person_soft_equipment_id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $number = (int) filter_input(INPUT_POST, 'number', FILTER_SANITIZE_NUMBER_INT);
      
      $SQL = "update person_soft_equipment set number=$number where id=$person_soft_equipment_id";
      $result=mssql_query($SQL);
      
      if ($result)
      {
        return array('sucess' => true);
      }
      else
      {
          return array('sucess' => false);
      }
  }
  
  function delete_soft_equipment()
  {
      $id = (int) filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
      $SQL = "UPDATE person_soft_equipment SET active_sign = 0 WHERE id = $id";
      mssql_query($SQL);
      return array('sucess' => true);
  }
  
  function import_students()
  {
    
    $Students=$_POST['students'];
    
    switch($_POST['db']){
      case 'abit':
        // Импорт из Абитуриент.Бак
        $DB_NAME_ABIT=conf::$DB_NAME_ABIT;
        $YEAR_SMALL=conf::$YEAR_SMALL_ABIT;

        foreach($Students as $ank_id){
          $ank_id = (int) $ank_id;

          // вытаскиваем информацию

          $category=1;  // Категория проживающего 1-Студент

          $SQL = ""
                  . "insert into person "
                    . "(from_db_name,ank_id"
                    . ",last_name,first_name,otc"
                    . ",sex"
                    . ",category,learn_form_id,commerce,faculty_id"
                    . ",group_name,bday,bday_place"
                    . ",doc_ser,doc_num,doc_place,doc_date"
                    . ",account_number"
                    . ",phone_number"
                    . ",home_address,country,region,area"
                    . ",city,nas_punkt,street,house,korp,apartment,post_index"
                    . ",date_create,registration_date) "
                  . "select "
                    . "'$DB_NAME_ABIT',a.ANK_ID"
                    . ",a.LAST_NAME,a.FIRST_NAME,a.OTC,"
                    . "case a.SEX when 'мужской' then 1 else 2 end,"
                    . "$category,lf.CODE_STUDGOROD,c.CODE_STUDGOROD,f.CODE_STUDGOROD,"
                    . "g.GRUPPA_NAME,a.BDAY,a.BDAY_PLACE,"
                    . "a.DOC_SER,a.DOC_NUM,a.DOC_PLACE,a.DOC_DATE,"
                    . "'Ж{$YEAR_SMALL}-'+convert(varchar(17),a.ANK_ID),"
                    . "TEL_NUM,"
                    . "ADDR_FACT,163,a.REGION_NAME,a.AREA_NAME,"
                    . "a.CITY_NAME,a.NAS_PUNKT,a.ADDRESS,a.HOUSE,a.KORP,a.FLAT,a.ADDR_INDEX,"
                    . "getdate(),getdate() "
                  . "from $DB_NAME_ABIT.dbo.ANKETA a "
                  . "inner join $DB_NAME_ABIT.dbo.ZAYV z on z.ANK_ID=a.ANK_ID "
                  . "inner join $DB_NAME_ABIT.dbo.FACULTY f on f.FAC_ID=z.FAC_ID "
                  . "inner join $DB_NAME_ABIT.dbo.LEARN_FORM lf on lf.LEARN_FORM_ID=f.LEARN_FORM_ID "
                  . "inner join $DB_NAME_ABIT.dbo.COMMERCE c on c.COMMERCE_ID=z.COMMERCE "
                  . "left join $DB_NAME_ABIT.dbo.GRUPPY g on g.GRUPPA_ID=z.GRUPPA_ID "
                  . "left join $DB_NAME_ABIT.dbo.COUNTRY co on co.ID=a.ADDRESS_COUNTRY_ID "
                  . "where a.ANK_ID=$ank_id and z.PRIK_NUM>0 "
                  . "select @@IDENTITY";
          $rImport=mssql_query($SQL);
          if(mssql_num_rows($rImport)>0){
            $id=mssql_result($rImport, 0, 0);

            // поместим студента в комнату
            $SQL = ""
                    . "insert into person_room "
                    . "(person_id,room_id,start_date,end_date) values "
                    . "($id,1164,'2017-09-01','2018-06-30')";
            mssql_query($SQL);
          }
        }
        break;
      case 'abit_mag':
        // Импорт из Абитуриент.Маг
        $DB_NAME_ABIT=conf::$DB_NAME_ABIT_MAG;
        $YEAR_SMALL=conf::$YEAR_SMALL_ABIT_MAG;

        foreach($Students as $ank_id){
          $ank_id = (int) $ank_id;

          // вытаскиваем информацию

          $category=1;  // Категория проживающего 1-Студент

          $SQL = ""
                  . "insert into person "
                    . "(from_db_name,ank_id"
                    . ",last_name,first_name,otc"
                    . ",sex"
                    . ",category,learn_form_id,commerce,faculty_id"
                    . ",group_name,bday,bday_place"
                    . ",doc_ser,doc_num,doc_place,doc_date"
                    . ",account_number"
                    . ",phone_number"
                    . ",home_address,country,region,area"
                    . ",city,nas_punkt,street,house,korp,apartment,post_index"
                    . ",date_create,registration_date) "
                  . "select "
                    . "'$DB_NAME_ABIT',a.ANK_ID"
                    . ",a.LAST_NAME,a.FIRST_NAME,a.OTC,"
                    . "case a.SEX when 'мужской' then 1 else 2 end,"
                    . "$category,lf.CODE_STUDGOROD,c.CODE_STUDGOROD,f.CODE_STUDGOROD,"
                    . "g.GRUPPA_NAME,a.BDAY,a.BDAY_PLACE,"
                    . "a.DOC_SER,a.DOC_NUM,a.DOC_PLACE,a.DOC_DATE,"
                    . "'Ж{$YEAR_SMALL}-'+convert(varchar(17),a.ANK_ID),"
                    . "TEL_NUM,"
                    . "ADDR_FACT,co.NAME as COUNTRY,a.REGION_NAME,a.AREA_NAME,"
                    . "a.CITY_NAME,a.NAS_PUNKT,a.ADDRESS,a.HOUSE,a.KORP,a.FLAT,a.ADDR_INDEX,"
                    . "getdate(),getdate() "
                  . "from $DB_NAME_ABIT.dbo.ANKETA a "
                  . "inner join $DB_NAME_ABIT.dbo.ZAYV z on z.ANK_ID=a.ANK_ID "
                  . "inner join $DB_NAME_ABIT.dbo.FACULTY f on f.FAC_ID=z.FAC_ID "
                  . "inner join $DB_NAME_ABIT.dbo.LEARN_FORM lf on lf.LEARN_FORM_ID=f.LEARN_FORM_ID "
                  . "inner join $DB_NAME_ABIT.dbo.COMMERCE c on c.COMMERCE_ID=z.COMMERCE "
                  . "left join $DB_NAME_ABIT.dbo.GRUPPY g on g.GRUPPA_ID=z.GRUPPA_ID "
                  . "left join $DB_NAME_ABIT.dbo.COUNTRY co on co.ID=a.ADDRESS_COUNTRY_ID "
                  . "where a.ANK_ID=$ank_id and z.PRIK_NUM>0 "
                  . "select @@IDENTITY";
          $rImport=mssql_query($SQL);
          if(mssql_num_rows($rImport)>0){
            $id=mssql_result($rImport, 0, 0);

            // поместим студента в комнату
            $SQL = ""
                    . "insert into person_room "
                    . "(person_id,room_id,start_date,end_date) values "
                    . "($id,1164,'2017-09-01','2018-06-30')";
            mssql_query($SQL);
          }
        }
        break;
      case 'decanat':
        // Импорт из Деканат.Бак
        $DB_NAME_IMPORT=conf::$DB_NAME_DECANAT;

        foreach($Students as $student_id){
          $student_id = (int) $student_id;

          // вытаскиваем информацию

          $category=1;  // Категория проживающего 1-Студент

          $SQL = ""
                  . "insert into person "
                    . "(from_db_name,ank_id,student_id"
                    . ",last_name,first_name,otc"
                    . ",sex"
                    . ",category,learn_form_id,commerce,faculty_id"
                    . ",group_name,bday,bday_place"
                    . ",doc_ser,doc_num,doc_place,doc_date"
                    . ",account_number"
                    . ",phone_number"
                    . ",home_address,country,region,area"
                    . ",city,nas_punkt,street,house,korp,apartment,post_index"
                    . ",date_create,registration_date) "
                  . "select "
                    . "'$DB_NAME_IMPORT',a.ANK_ID,a.STUDENT_ID"
                    . ",a.LAST_NAME,a.FIRST_NAME,a.OTC,"
                    . "case a.SEX when 'мужской' then 1 else 2 end,"
                    . "$category,lf.CODE_STUDGOROD,c.CODE_STUDGOROD,f.CODE_STUDGOROD,"
                    . "g.GRUPPA_NAME,a.BDAY,a.BDAY_PLACE,"
                    . "a.DOC_SER,a.DOC_NUM,a.DOC_PLACE,a.DOC_DATE,"
                    . "'Ж'+SUBSTRING(convert(varchar(4),year(a.YEAR_BEGIN)),3,2)+'-'+convert(varchar(16),a.ANK_ID),"
                    . "TEL_NUM,"
                    . "ADDR_FACT,co.NAME as COUNTRY,a.REGION_NAME,a.AREA_NAME,"
                    . "a.CITY_NAME,a.NAS_PUNKT,a.ADDRESS,a.HOUSE,a.KORP,a.FLAT,a.ADDR_INDEX,"
                    . "getdate(),getdate() "
                  . "from $DB_NAME_IMPORT.dbo.ANKETA a "
                  . "inner join $DB_NAME_IMPORT.dbo.GRUPPY g on g.GRUPPA_ID=a.GRUPPA_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.FACULTY f on f.FAC_ID=g.FAC_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.LEARN_FORM lf on lf.LEARN_FORM_ID=f.LEARN_FORM_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.COMMERCE c on c.COMMERCE_ID=a.COMMERCE_ID "
                  . "left join $DB_NAME_IMPORT.dbo.COUNTRY co on co.ID=a.ADDRESS_COUNTRY_ID "
                  . "where a.STUDENT_ID=$student_id "
                  . "select @@IDENTITY";
          $rImport=mssql_query($SQL);
          if(mssql_num_rows($rImport)>0){
            $id=mssql_result($rImport, 0, 0);

            // поместим студента в комнату
            $SQL = ""
                    . "insert into person_room "
                    . "(person_id,room_id,start_date,end_date) values "
                    . "($id,1164,'2017-09-01','2018-06-30')";
            mssql_query($SQL);
          }
        }
        break;
      case 'decanat_mag':
        // Импорт из Деканат.Маг
        $DB_NAME_IMPORT=conf::$DB_NAME_DECANAT_MAG;

        foreach($Students as $student_id){
          $student_id = (int) $student_id;

          // вытаскиваем информацию

          $category=1;  // Категория проживающего 1-Студент

          $SQL = ""
                  . "insert into person "
                    . "(from_db_name,ank_id,student_id"
                    . ",last_name,first_name,otc"
                    . ",sex"
                    . ",category,learn_form_id,commerce,faculty_id"
                    . ",group_name,bday,bday_place"
                    . ",doc_ser,doc_num,doc_place,doc_date"
                    . ",account_number"
                    . ",phone_number"
                    . ",home_address,country,region,area"
                    . ",city,nas_punkt,street,house,korp,apartment,post_index"
                    . ",date_create,registration_date) "
                  . "select "
                    . "'$DB_NAME_IMPORT',a.ANK_ID,a.STUDENT_ID"
                    . ",a.LAST_NAME,a.FIRST_NAME,a.OTC,"
                    . "case a.SEX when 'мужской' then 1 else 2 end,"
                    . "$category,lf.CODE_STUDGOROD,c.CODE_STUDGOROD,f.CODE_STUDGOROD,"
                    . "g.GRUPPA_NAME,a.BDAY,a.BDAY_PLACE,"
                    . "a.DOC_SER,a.DOC_NUM,a.DOC_PLACE,a.DOC_DATE,"
                    . "'Ж'+SUBSTRING(convert(varchar(4),year(a.YEAR_BEGIN)),3,2)+'-'+convert(varchar(16),a.ANK_ID),"
                    . "TEL_NUM,"
                    . "ADDR_FACT,co.NAME as COUNTRY,a.REGION_NAME,a.AREA_NAME,"
                    . "a.CITY_NAME,a.NAS_PUNKT,a.ADDRESS,a.HOUSE,a.KORP,a.FLAT,a.ADDR_INDEX,"
                    . "getdate(),getdate() "
                  . "from $DB_NAME_IMPORT.dbo.ANKETA a "
                  . "inner join $DB_NAME_IMPORT.dbo.GRUPPY g on g.GRUPPA_ID=a.GRUPPA_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.FACULTY f on f.FAC_ID=g.FAC_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.LEARN_FORM lf on lf.LEARN_FORM_ID=f.LEARN_FORM_ID "
                  . "inner join $DB_NAME_IMPORT.dbo.COMMERCE c on c.COMMERCE_ID=a.COMMERCE_ID "
                  . "left join $DB_NAME_IMPORT.dbo.COUNTRY co on co.ID=a.ADDRESS_COUNTRY_ID "
                  . "where a.STUDENT_ID=$student_id "
                  . "select @@IDENTITY";
          $rImport=mssql_query($SQL);
          if(mssql_num_rows($rImport)>0){
            $id=mssql_result($rImport, 0, 0);

            // поместим студента в комнату
            $SQL = ""
                    . "insert into person_room "
                    . "(person_id,room_id,start_date,end_date) values "
                    . "($id,1164,'2017-09-01','2018-06-30')";
            mssql_query($SQL);
          }
        }
        break;
    }
    
    
    return array('result' => '1');
  }
  
  function rasporyazhenie_get(){
    $result=array();
    $result['rasporyazhenie_name']='';
    $result['rasporyazhenie_date']='';
    $result['prikaz_name']='';
    $result['prikaz_date']='';
    $result['rasporyazhenie_people']='';
    
    $rasporyazhenie_id=isset($_POST['rasporyazhenie_id'])?(int)$_POST['rasporyazhenie_id']:0;
    
    if($rasporyazhenie_id>0){
      $query = mssql_query("
      select 
        rasporyazhenie_name,convert(varchar(10),rasporyazhenie_date,104) as rasporyazhenie_date,prikaz_name,convert(varchar(10),prikaz_date,104) as prikaz_date 
        from rasporyazhenie 
        where rasporyazhenie_id=$rasporyazhenie_id
      ");
      $row=mssql_fetch_array($query);
      
      $result['rasporyazhenie_name']=$row['rasporyazhenie_name'];
      $result['rasporyazhenie_date']=$row['rasporyazhenie_date'];
      $result['prikaz_name']=$row['prikaz_name'];
      $result['prikaz_date']=$row['prikaz_date'];
    }
    
    // люди
    
    $where_rasporyazhenie_id='';
    if($rasporyazhenie_id>0){
      $where_rasporyazhenie_id=" and (p.rasporyazhenie_id=$rasporyazhenie_id or p.rasporyazhenie_id is null)";
    }else{
      $where_rasporyazhenie_id=" and (p.rasporyazhenie_id is null)";
    }
    
    $query = mssql_query("
      select 
        p.id,p.last_name,p.first_name,p.otc,p.rasporyazhenie_id,p.group_name
        ,r.number as room_number
        ,h.name as hostel_name 
        from person p 
        inner join person_room pr on pr.person_id=p.id 
        inner join room r on r.id=pr.room_id 
        inner join hostel h on h.id=r.hostel_id 
        where p.active_sign=1 and pr.active_sign=1 and h.id not in(19,44,45) $where_rasporyazhenie_id 
        order by h.name,p.last_name,p.first_name,p.otc
      ");
    $R='';
    $R.='<table class="table table-condensed">';
    $R.='<thead>';
      $R.='<tr>';
        $R.='<th><input type="checkbox" class="check_all"> Все</th>';
        $R.='<th>ФИО</th>';
        $R.='<th>Группа</th>';
        $R.='<th>Общежитие</th>';
        $R.='<th>Комната</th>';
      $R.='</tr>';
    $R.='</thead>';
    $R.='<tbody>';
    while ($row = mssql_fetch_array($query)) {
      $R.='<tr data-id="'.$row['id'].'">';
        $checked=($row['rasporyazhenie_id']==$rasporyazhenie_id)?' checked':'';
        $R.='<td><input class="check" type="checkbox" '.$checked.'></td>';
        $R.='<td>'.$row['last_name'].' '.$row['first_name'].' '.$row['otc'].'</td>';
        $R.='<td>'.$row['group_name'].'</td>';
        $R.='<td>'.$row['hostel_name'].'</td>';
        $R.='<td>'.$row['room_number'].'</td>';
      $R.='</tr>';
    }
    $R.='</tbody>';
    $R.='</table>';
    
    $result['rasporyazhenie_people']=$R;
    
    return $result;
  }
  function rasporyazhenie_save(){
    $rasporyazhenie_id=isset($_POST['rasporyazhenie_id'])?(int)$_POST['rasporyazhenie_id']:0;
    $rasporyazhenie_name=isset($_POST['rasporyazhenie_name'])?sys::secure($_POST['rasporyazhenie_name']):'';
    $rasporyazhenie_date=isset($_POST['rasporyazhenie_date'])?sys::secure($_POST['rasporyazhenie_date']):'';
    $prikaz_name=isset($_POST['prikaz_name'])?sys::secure($_POST['prikaz_name']):'';
    $prikaz_date=isset($_POST['prikaz_date'])?sys::secure($_POST['prikaz_date']):'';
    $People=isset($_POST['people'])?$_POST['people']:array();
    
    if($rasporyazhenie_id>0){
      // изменяем старое распоряжение
      $query = mssql_query("
      update 
        rasporyazhenie 
        set rasporyazhenie_name='$rasporyazhenie_name'
                ,rasporyazhenie_date=convert(date,'$rasporyazhenie_date',104)
                ,prikaz_name='$prikaz_name'
                ,prikaz_date=convert(date,'$prikaz_date',104) 
        where rasporyazhenie_id=$rasporyazhenie_id
      ");
      
      // сначала уберем всех людей из этого распоряжения
      $query = mssql_query("
        update 
          person
          set rasporyazhenie_id=null
          where rasporyazhenie_id=$rasporyazhenie_id
        ");
      
    }else{
      // добавим новое распоряжение
      $query = mssql_query("
      insert into  
        rasporyazhenie 
        (rasporyazhenie_name,rasporyazhenie_date,prikaz_name,prikaz_date) 
        values (
          '$rasporyazhenie_name',convert(date,'$rasporyazhenie_date',104)
          ,'$prikaz_name',convert(date,'$prikaz_date',104) 
          )
      select @@IDENTITY
      ");
      $rasporyazhenie_id=mssql_result($query,0,0);
    }
    
    // добавим выбранных людей в распоряжение
    foreach($People as $id){
      $id=(int)$id;

      $query = mssql_query("
      update 
        person
        set rasporyazhenie_id=$rasporyazhenie_id
        where id=$id
      ");
    }
    
    return array('result'=>'1');
  }
  function rasporyazhenie_delete(){
    $R=array('result'=>'1');
    $rasporyazhenie_id=isset($_POST['rasporyazhenie_id'])?(int)$_POST['rasporyazhenie_id']:0;
    
    // проверим есть ли люди в распоряжении
    $query = mssql_query("
      select 1 from person where rasporyazhenie_id=$rasporyazhenie_id
      ");
    if(mssql_num_rows($query)===0){
      // Распоряжение пустое
    
//      // сначала уберем всех людей из этого распоряжения
//      $query = mssql_query("
//        update 
//          person
//          set rasporyazhenie_id=null
//          where rasporyazhenie_id=$rasporyazhenie_id
//        ");

      // удалим распоряжение
      $query = mssql_query("
        update 
          rasporyazhenie
          set active_sign=0
          where rasporyazhenie_id=$rasporyazhenie_id
        ");
    }else{
      // Распоряжение не пустое
      $R=array('result'=>'0','message'=>'Нельзя удалить. В распоряжении есть люди');
    }
    
    return $R;
  }
  

  //вернёт true, если других квитанций в диапазоне дат нет
  function oplata_check()
  {
    $person_id = (int) filter_input(INPUT_POST, 'person', FILTER_SANITIZE_NUMBER_INT);
    $start_date = filter_input(INPUT_POST, 'start', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $end_date = filter_input(INPUT_POST, 'end', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    
    $SQL = "SELECT COUNT(*) as cnt "
         . "FROM oplata "
         . "WHERE person_id = '$person_id' AND active_sign = 1 AND start_date <= convert(date,'$end_date',104) AND convert(date,'$start_date',104) <= end_date";
    $result = mssql_query($SQL);
    $row = mssql_fetch_row($result);
    if ($row[0] > 0)
    {
        return false;
    }
    else
    {
        return true;
    }
  }
  
  //получение квитанций человека, которые находятся в диапазоне дат
  function get_kvit_on_period()
  {
    $person_id = (int) filter_input(INPUT_POST, 'person', FILTER_SANITIZE_NUMBER_INT);
    $start_date = filter_input(INPUT_POST, 'start', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $end_date = filter_input(INPUT_POST, 'end', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    
    $SQL = "SELECT id,
        convert(varchar(10),start_date,104) AS start_date
      ,convert(varchar(10),end_date,104) AS end_date
      ,summ
      FROM oplata WHERE active_sign = '1' AND person_id='$person_id' AND start_date <= convert(date,'$end_date',104) AND convert(date,'$start_date',104) <= end_date
      ORDER BY id DESC";
    
    $result = mssql_query($SQL);
    
    $return = array();
    while ($row = mssql_fetch_array($result))
    {
        $o_result = mssql_query("SELECT oplata_usluga.id 
                                    ,convert(varchar(10), oplata_usluga.start_date, 104) AS start_date
                                    ,convert(varchar(10), oplata_usluga.end_date, 104) AS end_date
                                    ,oplata_usluga.usluga_id
                                    ,oplata_usluga.full_cost
                                    ,usluga_helper.name
                                    ,usluga_helper.additional as additional
                                    ,month_cost
                                FROM oplata_usluga
                                LEFT JOIN usluga ON usluga.id=oplata_usluga.usluga_id
                                LEFT JOIN usluga_helper ON usluga_helper.id=usluga.usluga_id
                                WHERE oplata_usluga.active_sign = 1 AND oplata_id=".$row['id']);
        $o = array();
        $o['info'] = array('id' => $row['id'], 
                           'start' => $row['start_date'], 
                           'end' => $row['end_date'], 
                           'summ' => $row['summ']);
        while ($o_row = mssql_fetch_array($o_result))
        {
            $o['rows'][] = array('id' => $o_row['id'], 
                         'start' => $o_row['start_date'], 
                         'end' => $o_row['end_date'], 
                         'usluga' => $o_row['usluga_id'], 
                         'full' => $o_row['full_cost'], 
                         'name' => $o_row['name'],
                         'additional' => $o_row['additional'],
                         'month_cost' => $o_row['month_cost']);
        }
        $return[] = $o;
    }
    return $return;
  }

   public function edit_news() {
      
      $start_date = sys::secure($_REQUEST['start_date']);
      $end_date = sys::secure($_REQUEST['end_date']);
      $name = sys::secure($_REQUEST['name']);
      $news = sys::secure($_REQUEST['news']);
      
      $result_query=mssql_query("INSERT INTO news
                      (name, news, start_date, end_date)
VALUES     ('$name', '$news', CONVERT(SMALLDATETIME, '$start_date', 104), CONVERT(SMALLDATETIME, '$end_date', 104))");
      
      $id=(int)mssql_result($result_query, 0, 0);
      
      $success=($id>0)?true:false;
      
      return array('success'=>$success);
  }
  
  public function person_room_delete(){
    $id = (int)$_REQUEST['id'];
    $result=mssql_query("update person_room set deleted=1 where id=$id");
    if($result===true){
      return array('success'=>true);
    }else{
      return array('success'=>false);
    }
  }
  
  function select_user() {
    if (sys::is_super_admin()) {
      $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;

      // Вытащим $user_status
      $sql = "SELECT u.LOGIN as USER_LOGIN,ug.USER_STATUS
						FROM USERS u inner join 
            USER_GROUP ug on ug.GROUP_ID=u.GROUP_USER_ID
						where u.ID=:id";
      $q = sys::$PDO->prepare($sql);
      $q->execute(array('id' => $id));
      $row = $q->fetch();
      $user_status = $row['USER_STATUS'];
      // --Вытащим $user_status

      sys::session_set('user_id', $id);
      sys::session_set('user_status', $user_status);

      return array('result' => 1);
    }
  }
  
}

