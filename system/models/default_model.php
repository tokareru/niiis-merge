<?php

class default_model extends model 
{

  public function get_data() 
  {
    $data = array();
    $data['title'] = conf::$SITE_NAME;
    $data['content'] = '';
    
    return $data;
  }
  
  // функция для вывода счетчиков в меню
  function counters(){
    
    $array = array('result'=>0); 
    
    $sql = 'SELECT COUNT(*) AS count_progs
    FROM PROGRAMS WHERE ACTIVE_SIGN = 1 ';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array+= ['count_programs'=>$res['count_progs']];
    
    $sql = 'SELECT COUNT(*) AS count_nastav
    FROM NASTAVNIK WHERE ACTIVE_SIGN = 1 ';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_nastav'=> $res['count_nastav']];
    // счетчик раздела список групп
    $sql = 'SELECT COUNT(*) AS count_groups
    FROM GRUPPY WHERE ACTIVE_SIGN = 1 ';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_groups'=> $res['count_groups']];
    
    // счетчик раздела Список школьников
    $sql = 'SELECT COUNT(*) AS count_abits
    FROM ANKETA WHERE     (ACTIVE_SIGN = 1) AND (SCH_CLASS <> 99) OR (SCH_CLASS IS NULL)';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_abits'=> $res['count_abits']]; 
    
    // счетчик раздела Индивидуальных достижений
    $sql = 'SELECT DISTINCT
                      ANKETA.ANK_ID, 
                      ANKETA.LAST_NAME, 
                      ANKETA.FIRST_NAME, 
                      ANKETA.OTC, 
                      CONVERT(varchar(10), ANKETA.BDAY, 104) AS BDAY, 
                      ANKETA.SCH_NUM, 
                      ANKETA.SCH_CLASS
            FROM      ANKETA INNER JOIN
                      ABIT_KONK ON ANKETA.ANK_ID = ABIT_KONK.ANK_ID INNER JOIN
                      KONKURS ON ABIT_KONK.KONK_ID = KONKURS.KONK_ID INNER JOIN
                      KONKURS_CATEG ON KONKURS.KONK_CATEG_ID = KONKURS_CATEG.KONK_CATEG_ID LEFT OUTER JOIN
                      RESULT_TYPE ON ABIT_KONK.RESULT_TYPE = RESULT_TYPE.ID
            WHERE     (ANKETA.ACTIVE_SIGN = 1) 
              AND     (ABIT_KONK.ACTIVE_SIGN = 1) 
              AND     (KONKURS.ACTIVE_SIGN = 1) 
              AND     (KONKURS_CATEG.ACTIVE_SIGN = 1) 
              AND     (KONKURS.IS_ID = 1)
            ORDER BY ANKETA.LAST_NAME, ANKETA.FIRST_NAME, ANKETA.OTC';
    $result = sys::$PDO->prepare($sql);
    $result->execute();
    $temp = $result->fetchAll();
    $array += ['count_abits_ind'=> count($temp)]; 
    
    $sql = 'SELECT COUNT(*) AS count_orgs
    FROM ORGANIZATION WHERE ACTIVE_SIGN = 1 ';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_orgs'=> $res['count_orgs']];
    
    $sql = 'SELECT COUNT(*) AS count_events
    FROM KONKURS WHERE ACTIVE_SIGN = 1 ';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_events'=> $res['count_events']];
    
    $sql = 'SELECT      COUNT(*) AS count_testprof
            FROM        PROF_TEST 
            INNER JOIN  ANKETA ON PROF_TEST.ANK_ID = ANKETA.ANK_ID
            WHERE       (PROF_TEST.ACTIVE_SIGN = 1) 
              AND       (ANKETA.ACTIVE_SIGN = 1)';
    $result=mssql_query($sql);
    $res = mssql_fetch_array($result);
    $array += ['count_testprof'=> $res['count_testprof']];
    
    
    
    // успешны ли запросы
    $array['result'] = 1;
    return $array;
    
  }

}
