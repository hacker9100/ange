<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");
    Header("Content-type: text/html;Charset:UTF-8");

    @session_start();

    @extract($_GET);
    @extract($_POST);
    @extract($_SERVER);

    date_default_timezone_set('Asia/Seoul');

	include_once("D:/xampp/htdocs/ange/migration/classes/ImportClasses.php");

    MtUtil::_c("### [START]");

//    $_a = new MtMssqlData();
    $_t = new MtMysqlData();

    $prefix = "";

//    if ($_a->connect_db == "") {
//        MtUtil::_c("AS-IS DB 연결 실패.");
//    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    $sql = "SELECT B.NO FROM
            (
            select MIN(NO) AS MIN_NO, USER_ID, BABY_NM, BABY_BIRTH from ANGE_USER_BABY GROUP BY USER_ID, BABY_BIRTH HAVING COUNT(USER_ID) > 1
            ) AS D, ANGE_USER_BABY B
            WHERE D.USER_ID = B.USER_ID
            AND D.BABY_BIRTH = B.BABY_BIRTH
            AND MIN_NO != B.NO
            ";

//    $result = $_t->sql_query($sql,true);
//    MtUtil::_c($i."################################### [COUNT] ".count($result));

    for ($i=0; $row=$_t->sql_fetch_array($result); $i++) {
        $_t->sql_query("DELETE FROM ANGE_USER_BABY WHERE NO = ".$row['NO']);
    }

    MtUtil::_c("### [END]");
?>