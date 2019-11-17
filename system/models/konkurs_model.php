<?php

class konkurs_model extends model 
{

  public function get_data() 
  {
    $return = array();
    $return['title'] = self::title();
    $return['table'] = self::table();
    
    return $return;
  }

  function title() {
    return 'Мероприятия';
  }
  
  // модель для запроса из бд при загрузке основного представления        
  function table() {
    $konk_categ_id=isset($_REQUEST['konk_categ_id'])?'AND (k.KONK_CATEG_ID = '.$_REQUEST['konk_categ_id'].')':'';
    
    $sql="SELECT    k.KONK_ID, 
                    k.KONK_NAME, 
                    CONVERT(varchar(10), 
                    k.KONK_DATE, 104) AS KONK_DATE, 
                    k.KONK_MESTO, 
                    c.KONK_CATEG AS KONK_CATEG_NAME, 
                    k.ORGANIZATOR,
                    k.UCH_YEAR_N, 
                    k.UCH_YEAR_K,
                    k.KONK_CATEG_ID
          FROM      KONKURS AS k LEFT OUTER JOIN KONKURS_CATEG AS c ON c.KONK_CATEG_ID = k.KONK_CATEG_ID
          WHERE     (k.ACTIVE_SIGN = 1) 
             $konk_categ_id 
          ORDER BY  k.UCH_YEAR_N DESC, 
                    k.KONK_NAME";
    $konk_array=mssql_query($sql);
    
    $sql="SELECT     KONK_CATEG_ID, KONK_CATEG
          FROM         KONKURS_CATEG
          WHERE     (ACTIVE_SIGN = 1)";
    $konk_categ_array=mssql_query($sql);
    
    $result = array('konk_array'=>$konk_array,
                    'konk_categ_array' => $konk_categ_array);
    
    
    return $result;
  }
  
  // модель для удаления
  function delete(){
    $array=array('result'=>0);
    
    $id = (int)$_POST['id'];
    
    $sql="UPDATE  KONKURS
          SET     ACTIVE_SIGN = 0
          WHERE   KONK_ID = $id";
    $result=mssql_query($sql);
    
    if($result){
      $array=array('result'=>1);
    }
    
    // возвращаем данные в представление
    return $array;
  }
  
  // модель для сохранения при добавлении новой записи
  function save_add(){
    $array=array('result'=>0);
     
    $name = sys::secure($_POST['name']);
    $konk_categ_id = (int)$_POST['konk_categ_id'];
    
    $sql="INSERT INTO KONKURS (KONK_NAME, KONK_CATEG_ID) 
          VALUES     ('$name',
                      $konk_categ_id)
           select @@IDENTITY";
    $result=mssql_query($sql);
    
    if($result){
      $id=mssql_result($result,0,0);
      $array=array('result'=>1,'id'=>$id);
    }
    
    // возвращаем данные в представление
    return $array;
    
  }
  // модель для сохранения при редактировании
  function save_edit(){
    $array=array('result'=>0);
    
    $id = (int)$_POST['id'];
    $name = sys::secure($_POST['name']);
    $date = sys::secure($_POST['date']);
    $year_N = (int)($_POST['year_N']);
    $year_K = (int)($_POST['year_K']);
//    $mesto = sys::secure($_POST['mesto']);
    $mesto = sys::secure($_POST['mesto'])!=''?(",KONK_MESTO = '".sys::secure($_POST['mesto'])."'"):',KONK_MESTO = NULL';
    $konk_categ_id = (int)$_POST['konk_categ_id'];
//    $organizator = sys::secure($_POST['organizator']);
    $organizator = sys::secure($_POST['organizator'])!=''?(",ORGANIZATOR = '".sys::secure($_POST['organizator'])."'"):',ORGANIZATOR = NULL';
    
    $is_id = $_POST['is_id']=='true'?',IS_ID = 1':',IS_ID = 0';
    $max_ball = (int)$_POST['max_ball']!=(-1)?(',ID_MAX_BALL = '.(int)$_POST['max_ball']):',ID_MAX_BALL = NULL';
    $min_1 = (int)$_POST['min_1']!=(-1)?(',ID_MIN_1 = '.(int)$_POST['min_1']):',ID_MIN_1 = NULL';
    $min_2 = (int)$_POST['min_2']!=(-1)?(',ID_MIN_2 = '.(int)$_POST['min_2']):',ID_MIN_2 = NULL';
    $min_3 = (int)$_POST['min_3']!=(-1)?(',ID_MIN_3 = '.(int)$_POST['min_3']):',ID_MIN_3 = NULL';
    $min_4 = (int)$_POST['min_4']!=(-1)?(',ID_MIN_4 = '.(int)$_POST['min_4']):',ID_MIN_4 = NULL';
    $ball_1 = (int)$_POST['ball_1']!=(-1)?(',ID_BALL_1 = '.(int)$_POST['ball_1']):',ID_BALL_1 = NULL';
    $ball_2 = (int)$_POST['ball_2']!=(-1)?(',ID_BALL_2 = '.(int)$_POST['ball_2']):',ID_BALL_2 = NULL';
    $ball_3 = (int)$_POST['ball_3']!=(-1)?(',ID_BALL_3 = '.(int)$_POST['ball_3']):',ID_BALL_3 = NULL';
    $ball_4 = (int)$_POST['ball_4']!=(-1)?(',ID_BALL_4 = '.(int)$_POST['ball_4']):',ID_BALL_4 = NULL';
    $diplom_1 = (int)$_POST['diplom_1']!=(-1)?(',ID_DIPLOM_1 = '.(int)$_POST['diplom_1']):',ID_DIPLOM_1 = NULL';
    $diplom_2 = (int)$_POST['diplom_2']!=(-1)?(',ID_DIPLOM_2 = '.(int)$_POST['diplom_2']):',ID_DIPLOM_2 = NULL';
    $diplom_3 = (int)$_POST['diplom_3']!=(-1)?(',ID_DIPLOM_3 = '.(int)$_POST['diplom_3']):',ID_DIPLOM_3 = NULL';
    $diplom_4 = (int)$_POST['diplom_4']!=(-1)?(',ID_DIPLOM_4 = '.(int)$_POST['diplom_4']):',ID_DIPLOM_4 = NULL';
    
    $date=($date!='')?(',KONK_DATE = convert(date,"'.$date.'",104)'):',KONK_DATE = NULL ';
    $year_N=($year_N!=0)?(',UCH_YEAR_N = '.$year_N):',UCH_YEAR_N = NULL ';
    $year_K=($year_K!=0)?(',UCH_YEAR_K = '.$year_K):',UCH_YEAR_K = NULL ';
//    echo $_POST['is_id'];
    // для индивидуальных достижений
    
    $sql="UPDATE  KONKURS
          SET     KONK_NAME = '$name' 
            $date 
            $year_N 
            $year_K 
            $mesto
            ,KONK_CATEG_ID = $konk_categ_id
            $organizator
              $is_id
              $max_ball
              $min_1
              $min_2
              $min_3
              $min_4
              $ball_1
              $ball_2
              $ball_3
              $ball_4
              $diplom_1
              $diplom_2
              $diplom_3
              $diplom_4
          WHERE   KONK_ID = $id";
//    echo $sql;
    $result=mssql_query($sql);
    
    if($result){
      $array=array('result'=>1);
    }
    
    // возвращаем данные в представление
    return $array;
  }
  
  // модель для представления "Edit", возвращающая 
  // массив
  function edit(){
    $id = isset($_REQUEST['id'])?(int)$_REQUEST['id']:0;
    $sql = "SELECT  KONK_NAME,
            convert(varchar(10),KONK_DATE,104) as KONK_DATE,
            convert(varchar(10),UCH_YEAR_N,104) as UCH_YEAR_N,
            convert(varchar(10),UCH_YEAR_K,104) as UCH_YEAR_K,
            KONK_MESTO,
            KONK_CATEG_ID,
            ORGANIZATOR, 
            IS_ID, 
            ID_MAX_BALL, 
            ID_MIN_1, 
            ID_BALL_1, 
            ID_MIN_2, 
            ID_BALL_2, 
            ID_MIN_3, 
            ID_BALL_3, 
            ID_MIN_4, 
            ID_BALL_4,
            ID_DIPLOM_1,
            ID_DIPLOM_2,
            ID_DIPLOM_3,
            ID_DIPLOM_4
            FROM    KONKURS
            WHERE   KONK_ID = $id
            ";
    $result = mssql_query($sql);
    $res = mssql_fetch_array($result);
    // пишем в массив нужные данные 
    $data['id'] = $id;
    $data['konk_name'] = $res['KONK_NAME'];
    $data['konk_date'] = $res['KONK_DATE'];
    $data['UCH_YEAR_N'] = $res['UCH_YEAR_N'];
    $data['UCH_YEAR_K'] = $res['UCH_YEAR_K'];
    $data['konk_mesto'] = $res['KONK_MESTO'];
    $data['konk_categ_id'] = $res['KONK_CATEG_ID'];
    $data['organizator'] = $res['ORGANIZATOR'];
    $data['IS_ID'] = $res['IS_ID'];
    $data['ID_MAX_BALL'] = $res['ID_MAX_BALL'];
    $data['ID_MIN_1'] = $res['ID_MIN_1'];
    $data['ID_BALL_1'] = $res['ID_BALL_1'];
    $data['ID_MIN_2'] = $res['ID_MIN_2'];
    $data['ID_BALL_2'] = $res['ID_BALL_2'];
    $data['ID_MIN_3'] = $res['ID_MIN_3'];
    $data['ID_BALL_3'] = $res['ID_BALL_3'];
    $data['ID_MIN_4'] = $res['ID_MIN_4'];
    $data['ID_BALL_4'] = $res['ID_BALL_4'];
    $data['ID_DIPLOM_1'] = $res['ID_DIPLOM_1'];
    $data['ID_DIPLOM_2'] = $res['ID_DIPLOM_2'];
    $data['ID_DIPLOM_3'] = $res['ID_DIPLOM_3'];
    $data['ID_DIPLOM_4'] = $res['ID_DIPLOM_4'];
    
        
    // заголовок для модели редактирования
    $data['title'] = 'Мероприятие - Изменить';
    // возвращаем данные в представление
    return $data;
  }
  function add()
  {
    $konk_categ_id=isset($_REQUEST['konk_categ_id'])?$_REQUEST['konk_categ_id']:0;
//    echo $konk_categ_id;
    $sql="SELECT  KONK_CATEG
          FROM    KONKURS_CATEG
          WHERE   (KONK_CATEG_ID = $konk_categ_id)";
    $res=mssql_fetch_array(mssql_query($sql));
//    echo $sql;
    $konk_categ_name = $res['KONK_CATEG'];
    
    // заголовок для модели добавления
    $data['title'] = 'Мероприятие - Добавить '.(($konk_categ_id>0)?('в "'.$konk_categ_name.'"'):'');
    $data['konk_kateg_id'] = $konk_categ_id;
    // возвращаем данные в представление
    return $data;
  }
  

}
