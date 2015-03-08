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
    include_once("D:/xampp/htdocs/ange/migration/passwordHash.php");

    MtUtil::_c("### [START]");

    $_a = new MtMssqlData();
    $_t = new MtMysqlData();

    $prefix = "";

    if ($_a->connect_db == "") {
        MtUtil::_c("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    $sql = "select
                e.eq_id AS USER_ID, e.datapoint AS SUM_POINT
            from (
                select max(eq_idx) as eq_idx, eq_id, eq_mom from eqmom group by eq_id, eq_mom having count(*) = 1
            ) data, eqmom e
            where data.eq_idx = e.eq_idx and datapoint != 0
            ";

    $result = $_t->sql_query($sql,true);
    for ($i=0; $row=$_t->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;

        $_t->sql_beginTransaction();

        $sql = "UPDATE COM_USER
                SET
                    SUM_POINT = '".$row['SUM_POINT']."',
                    REMAIN_POINT = '".$row['SUM_POINT']."'
                WHERE
                    USER_ID = '".$row['USER_ID']."'
                ";

        $_t->sql_query($sql);
        if($_t->mysql_errno > 0) {
            $err++;
            $msg .= $_t->mysql_error;
        }

        if($err > 0) {
            MtUtil::_c($i."> [ERROR] ".$_t->mysql_error);
            $_t->sql_rollback();
//            $_t->sql_query("UPDATE MIG_USER_INFO SET MIG_ST = '1', MIG_MSG = '".$msg."' WHERE NO = ".$no);
        } else {
            MtUtil::_c($i."> [SUCCESS] ");
            $_t->sql_commit();
//            $_t->sql_query("UPDATE MIG_USER_INFO SET MIG_ST = '2' WHERE NO = ".$no);
        }
    }

    MtUtil::_c("### [END]");
?>